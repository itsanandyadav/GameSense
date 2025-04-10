from flask import Flask, render_template, request, redirect, jsonify
from logger import logger
import logging
import time
import os
import sys
import glob
import re
import json
import atexit

version = "CODE_0P96"
if os.name == "nt":
    proj_path = "./"
    global_device_list_file = proj_path + "/json/global_device_list_file_nt.json"
else:
    proj_path = "./CODE_0P96"
    global_device_list_file = proj_path + "/json/global_device_list_file.json"

run = logger(proj_path + "/app.log")
run.log("Started the server at time : ", time.ctime())
##################################


local_status_file = proj_path + "/tc_status.json"


##  dictionary to save list of device as {device:sim_space}
list_of_devices = {}

##  Now create dictionary to save all the testcase status. It will be save in below format
##  { device : { parent : { testcase: [ timestamp , status informations separated by comma] } }
global_tc_status_dict = {}


## function will return testcase status and save for later requests.
def testcase_status(device, parent, tc):
    global global_tc_status_dict

    read_log = 0  ## Flag to read logs
    try:
        ## check if xrun file was read in less than 120 seconds
        ## global_tc_status_dict[device][parent][tc][0]: zeroth item in ts value is timestamp
        ## if yes then just return saved status, don't read again
        if time.time() - global_tc_status_dict[device][parent][tc][0] < 120:
            read_log = 0
            txt = "Returning from saved status"
            return [txt, global_tc_status_dict[device][parent][tc]]
        else:
            read_log = 1
            txt = "Time exceeded 120s, Reading logs"
    except Exception as e:
        handle_ex(e)
        ## exception will come because of tc key error if it was not set for first time
        read_log = 1
        txt = "Reading logs no previous status exists"
    if read_log == 1:
        try:
            # run.log("Saving to tc status. Device : ", device, " Parent : ", parent, " tc : ", tc)
            global_tc_status_dict[device][parent][tc] = [int(time.time())] + read_xrun(
                device, parent, tc
            )
            return [txt, global_tc_status_dict[device][parent][tc]]
        except Exception as e:
            handle_ex(e)
            return []


## function to read xrun file and extract testcase status and FAILS
def read_xrun(device, parent, tc):
    global list_of_devices

    file_name_format = (
        list_of_devices[device]
        + "/"
        + device
        + "/"
        + parent
        + "/Latest/create/*/"
        + tc
        + "/Job_1.0/psf/xrun.log"
    )
    log_path = glob.glob(file_name_format)
    if len(log_path) > 0:
        log_path = log_path[0]
        path = log_path
        txt = read_jobfile(log_path)
        ## Before netlisting sim files are removed and created again after netlisting,
        ## If xrun is there, it means netlisting is done
        ## if farm build issue is there  and xrun already esixts then xrun will not be removed.
        ## this will not be able to flag issue. checks for this not implemented yet
        farm_build_status = "Farm_build"
    else:
        log_path = ""
        txt = ""
        farm_build_status = "FARM_FAIL"

    # r = re.compile("(.*(SIMSTART|SIMSTOP|Exiting)(.*))")
    # r = re.compile(r'\bPending\b | \bSIMSTART\b | \bSIMSTOP\b | \bExiting\b')

    r = re.compile(r"SIMSTART|#FAIL#|SIMSTOP|Exiting")  ## search these matches
    # f = open(log_path,"r")
    result = [farm_build_status] + r.findall(txt)
    # print(txt)

    return result


## Function to return list of testcases in python list datatype
## not used anywhere
def list_tc_names(root_path):
    cwd = os.getcwd()
    os.chdir(root_path)
    file_format = "*/Job_1.0/psf/xrun.log"
    list_of_funct_tcs = glob.glob(file_format)
    tc = []
    if len(list_of_funct_tcs) < 1:
        tc = tc + ["No testcase present"]
    else:
        for i in list_of_funct_tcs:
            tc = tc + [i.split("/")[-4]]
            # print(i)
    tc.sort()
    os.chdir(cwd)
    return tc


## Function to read any file give its full path
def read_jobfile(file_path):
    if os.path.isfile(file_path):
        try:
            with open(file_path, encoding="latin2") as f:
                ## removing last "/n" from the file
                txt = f.read()[:-1]
                txt = txt.replace("<","&lt")
                txt = txt.replace(">","&gt")
        except Exception as e:
            handle_ex(e)
            txt = "*****E:Not able to decode"
    else:
        txt = "NULL"
    return txt


def read_path(path):
    txt = ""
    if os.path.isfile(path):
        try:
            with open(path, encoding="latin2") as f:
                ## removing last "/n" from the file
                txt = f.read()[:-1]
        except Exception as e:
            handle_ex(e)
            txt = "*****E:Not able to decode"
    elif os.path.isdir(path):
        for i in os.listdir(path):
            txt = txt + "\n" + os.path.join(path, i)
    else:
        txt = "Not avalid path : " + str(path)
    return txt


##  This returns list of directories in a directory.
def listdirs(folder):
    ##  If the dir doesn't exist or no valid directory path found then it will return  blank python list []
    list_of_dirs = []
    try:
        for d in os.listdir(folder):
            if os.path.isdir(os.path.join(folder, d)):
                list_of_dirs.append(d)
    except Exception as e:
        handle_ex(e)
        run.log("Directory doesn't exist : ", folder)
    return list_of_dirs


## Exception handler
def handle_ex(e):
    run.log("------------------Exception---------------")
    run.log("Exception::", e)
    try:
        exc_type, exc_obj, exc_tb = sys.exc_info()
        fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
        run.log(
            "ERROR type : ",
            exc_type,
            "; FILE_NAME : ",
            fname,
            "; LINE_NO : ",
            exc_tb.tb_lineno,
        )
    except Exception as ee:
        ## if not able to get above information
        run.log(ee)
    return None


app = Flask(__name__, template_folder="templates")


@app.route("/", methods=["GET", "POST"])
def home_page():
    ##  the home page will be ams_sim.
    ##  Since there are nothing else than webpage for sim results the root redirects to ams_sim
    return redirect("/ams_sim")


##  home page for AMS simulation results
##  This will list all the devices and button to add a new device.
@app.route("/ams_sim", methods=["GET", "POST"])
def devices():
    global global_device_list_file, list_of_devices, global_tc_status_dict

    try:  ## Get the list of devices and sim space in dictionary as {device:sim_space}
        with open(global_device_list_file, "r") as deviceListFile:
            list_of_devices = json.load(deviceListFile)
        run.log("Reading list of devices from the file : ", global_device_list_file)
        run.log("List of devices : ", list_of_devices)
    ## if not able to read the file then assing list of devices as blank dictionary {}
    except Exception as e:
        handle_ex(e)
        list_of_devices = {}
        # run.log("File not found : ", global_device_list_file)
        handle_ex(e)
        run.log("Setting list of devices as blank dictionary {}")

    ##  In the global_tc_status_dict set each device as key and its value read from the saved in corresponding device json.
    ##  If the device json doesn't exist then assign blank dictionary as value to device key.
    for device_name in list_of_devices:
        ##  device json file name. Where tc status will be saved individually for all devices.
        tc_status_file = proj_path + "/json/" + device_name + "_tc_status.json"

        ##  check if the device key already exists in global_tc_status_dict,if yes then don' read again
        ##  otherwise on reload the current status in global dict will be lost.
        ##  This will  happen with device page is reloaded again after reading testcase status.
        if device_name in global_tc_status_dict.keys():
            ## run.log(device_name," key exists in ",global_tc_status_dict,"not reading saved json",
            pass
        else:
            try:
                with open(tc_status_file, "r") as status_file:
                    global_tc_status_dict[device_name] = json.load(status_file)
                    run.log(
                        device_name,
                        ": reading json file and setting in value for the device : ",
                        tc_status_file,
                    )
            except Exception as e:
                handle_ex(e)
                run.log("Setting value of ", device_name, " key as blank dictionary {}")
                global_tc_status_dict[device_name] = {}

    return render_template("list_devices.html", server_data=list_of_devices)


##  This request will be called to add a new device.
##  once device is added to list it will reload the ams_sim home page to populate with added device
@app.route("/ams_sim/add_device", methods=["POST", "GET"])
def add_device():
    global global_device_list_file
    if request.method == "POST":  ## [ POST] methond allows to accept request from web
        ## get device name from form submit [post] request
        device_name = request.form.get("device_name")
        ## get sim space for the device in post request
        sim_space = request.form.get("sim_space")
        run.log(
            "Request to add : ",
            str({device_name: sim_space}),
            " to ",
            global_device_list_file,
        )

        try:
            with open(global_device_list_file, "r") as deviceListFile:
                # load device list from json
                list_of_devices = json.load(deviceListFile)
        except Exception as e:
            handle_ex(e)
            list_of_devices = {}

        # update the list of device dictionary
        list_of_devices[device_name] = sim_space
        try:
            with open(global_device_list_file, "w") as outfile:
                ## write to the json file
                json.dump(list_of_devices, outfile, indent=4)
        except Exception as e:
            handle_ex(e)
            run.log("List of devices : ", list_of_devices)

    ## redirect to ams_sim to update the webpage with added device
    return redirect("/ams_sim")


##  page for listing all the devices and button to add a new device.
@app.route("/ams_sim/<device>")
def parents(device):
    global list_of_devices, global_tc_status_dict
    try:
        ## list all the parent directories for the device.
        list_of_parent_dirs = listdirs(list_of_devices[device] + "/" + device)
        list_of_parent_dirs.sort()

        for i in list_of_parent_dirs:
            if i in global_tc_status_dict[device].keys():
                pass
            else:
                ## create blank dictionary as value to save tc statuts for parent keys
                global_tc_status_dict[device][i] = {}
                run.log("Setting value of ", i, " key as blank dictionary {}")

        ##----------RISK----------------------------------------------
        tc_status_file = proj_path + "/json/" + device + "_tc_status.json"
        try:
            with open(tc_status_file, "w") as outfile:
                json.dump(global_tc_status_dict[device], outfile, indent=4)

            with open(tc_status_file, "r") as status_file:
                global_tc_status_dict[device] = json.load(status_file)
                run.log(
                    device,
                    ": reading json file and setting in value for the device : ",
                    tc_status_file,
                )
        except Exception as e:
            handle_ex(e)
            run.log("Setting value of ", device, " key as blank dictionary {}")
        ##----------RISK----------------------------------------------

        list_of_parent_dirs = {"device": device, "parent_dirs": list_of_parent_dirs}

        return render_template("list_parents.html", server_data=list_of_parent_dirs)

    except Exception as e:
        handle_ex(e)
        ## redirect to ams_sim to update the webpage if there is key error for devices or parents
        run.log("Not able to process request : /ams_sim/" + device)
        run.log("Redirecting to : /ams_sim")
        return redirect("/ams_sim")


##  page for listing all the devices and button to add a new device.
@app.route("/ams_sim/<device>/<parent>")
def functional_testcases(device, parent):
    global list_of_devices, global_tc_status_dict

    try:  ## try to get testcase names from name of farm_log
        file_format = (
            list_of_devices[device]
            + "/"
            + device
            + "/"
            + parent
            + "/Latest/create/*/farmEXE*"
        )
        farm_logs = glob.glob(
            file_format
        )  ## search for all the farm logs for given device and parent dir
        test_cases = []
        for i in farm_logs:
            ## jus collecting names of farm logs and send webpage. js there will strip and extract testcase name
            test_cases = test_cases + [i.split("/")[-1]]
        test_cases.sort()

        ##----------RISK----------------------------------------------
        # tc_status_file = proj_path+"/json/" + device + "_tc_status.json"
        # try:
        #     with open(tc_status_file, "w") as outfile:
        #         json.dump(global_tc_status_dict[device], outfile, indent=4)
        #     run.log("Writing the device json. Device:",device," File name :",tc_status_file)
        #     with open(tc_status_file, "r") as status_file:
        #         global_tc_status_dict[device] = json.load(status_file)
        #     run.log("Reading the device json. Device:",device," File name :",tc_status_file)
        # except Exception as e:
        #     handle_ex(e)
        #     run.log("Setting value of ", device, " key as blank dictionary {}")
        ##----------RISK----------------------------------------------

        list_of_testcases = {"device": device, "parent": parent, "tc": test_cases}
        return render_template("list_testcases.html", tc=list_of_testcases)
    except Exception as e:
        handle_ex(e)
        ## redirect to ams_sim to update the webpage if there is key error for devices or parents
        run.log("Not able to process request : /ams_sim/" + device + "/" + parent)
        run.log("Redirecting to : /ams_sim")
        return redirect("/ams_sim")


##  This request will be called to get status of a testcase
##  Inputs will be device, parent and testcase name from ajax in form of dictionary
@app.route("/ams_sim/tc_status", methods=["POST", "GET"])
def tc_status():
    status = {}
    if request.method == "POST":
        qtc_data = request.get_json()
        status = testcase_status(
            qtc_data["device"], qtc_data["parent"], qtc_data["testcase_name"]
        )
    else:
        run.log("There is no post methond for /ams_sim/tc_status")
        pass

    return jsonify(status)


@app.route("/ams_sim/version", methods=["POST", "GET"])
def app_version():

    tc="Version"
    txt = proj_path
    farm_txt = proj_path

    return render_template("xrun_log.html", tc=tc, xrun_log=txt, farm_log=farm_txt)


##  This request will be called to get farm and xrun logs
@app.route("/ams_sim/<device>/<parent>/<tc>/Job_1.0", methods=["GET", "POST"])
def xrun_log(device, parent, tc):
    global list_of_devices, global_tc_status_dict
    try:
        ## xrun.log file path format
        file_format = (
            list_of_devices[device]
            + "/"
            + device
            + "/"
            + parent
            + "/Latest/create/*/"
            + tc
            + "/Job_1.0/psf/xrun.log"
        )

        ## get the file path, if found it will be in python list data type
        log_path = glob.glob(file_format)
        if len(log_path) < 1:  ## True if no path found in xrun.log format
            log_path = ""
            path = ""
        else:
            log_path = log_path[0]
            path = "#INFO# File Path :: " + log_path + "\n"
        ## adding file path for webage along with content of the file
        txt = path + read_jobfile(log_path)

        ## farm log file path format
        farm_file_name_format = (
            list_of_devices[device]
            + "/"
            + device
            + "/"
            + parent
            + "/Latest/create/*/farmEXE*__"
            + tc
            + ".log"
        )
        ## get the file path, if found it will be in python list data type
        farm_log_path = glob.glob(farm_file_name_format)
        if len(farm_log_path) < 1:
            farm_log_path = ""
            farm_path = ""
        else:
            farm_log_path = farm_log_path[0]
            farm_path = "#INFO# File Path :: " + farm_log_path + "\n"
        ## adding file path for webage along with content of the file
        farm_txt = farm_path + read_jobfile(farm_log_path)

        ###############################################################
        # with open(proj_path+"/xrun.log","w") as f:
        #     f.write(txt+"\n")

        # with open(proj_path+"/farm_run.log","w") as f:
        #     f.write(farm_txt+"\n")

        # run.log("type of tc : ",type(tc))
        # run.log("type of xrun_log : ",type(txt))
        # run.log("type of farm_log : ",type(farm_txt))

        ###############################################################

        return render_template("xrun_log.html", tc=tc, xrun_log=txt, farm_log=farm_txt)
        # return render_template("xrun_log.html", tc=tc)
    except Exception as e:
        handle_ex(e)
        ## Redirect to ams_sim. if there are issues with reading files. Check for file permissions
        run.log(
            "Not able to process request : /ams_sim/"
            + device
            + "/"
            + parent
            + "/"
            + tc
            + "/Job_1.0"
        )
        run.log("Redirecting to : /ams_sim")
        return redirect("/ams_sim")


# function to read any file path given
@app.route("/ams_sim/read_file", methods=["POST", "GET"])
def read_file():
    print(re)
    if request.method == "GET":
        try:
            file_path = request.args.get("file_path")
        except Exception as e:
            handle_ex(e)
            run.log("Not able to get value of key [file_path]")
            file_path = "/"

        file_name = file_path.split("/")[-1]
        if os.name == "nt":
            file_path_local = "C:/Users/a0485645/Documents/dv_log/farmEXE_functional__sanity_check.log"
        else:
            file_path_local = file_path
        file_content = read_path(file_path_local.strip())
        return render_template(
            "read_file.html", name=file_name, path=file_path, content=file_content
        )
    else:
        run.log("There is no GET methond for /ams_sim/read_file")
        return render_template("read_file.html", name="NA", path="NA", content="NA")


## os name is "nt" for windows environment. For deveolpment and debug
if os.name == "nt":
    ## running localhost
    app.run()

else:
    ## running with on its own allocated ip by router, this will open the server for intranet
    app.run(host="0.0.0.0", threaded=True)


## on exit save testcase status to json files for each device to its seprate json file
def exit_handler():
    global list_of_devices, global_tc_status_dict
    run.log("Closing the server at time : ", time.ctime())
    ## log individual device testcase status in separate file
    try:
        for device in list_of_devices:
            tc_status_file = proj_path + "/json/" + device + "_tc_status.json"
            run.log(
                "Writing to the device file in json. Device:",
                device,
                " File name :",
                tc_status_file,
            )
            with open(tc_status_file, "w") as outfile:
                json.dump(global_tc_status_dict[device], outfile, indent=4)

        ## log all device testcase status in tc_status.json file. This is not needed, later remove this data log.
        with open(local_status_file, "w") as outfile:
            json.dump(global_tc_status_dict, outfile, indent=4)
    except Exception as e:
        handle_ex(e)
        run.log(
            "Not able to save testcase status to json files. Check file path and permissions"
        )
    run.log("Closed the server at time : ", time.ctime())


atexit.register(exit_handler)
