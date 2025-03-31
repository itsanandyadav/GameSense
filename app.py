from flask import Flask, render_template, request, redirect, jsonify
from flask import send_file, url_for, send_from_directory
from flask_httpauth import HTTPBasicAuth

# from fileinput import filename
from logger import logger
from urllib.parse import urlsplit, parse_qs
import time
import os
import sys
import json
import atexit
from werkzeug.utils import secure_filename
import shutil
import zipfile as ZipFile

sys.path.append(os.path.dirname(os.path.abspath(__file__)))




pwd = os.path.dirname(os.path.abspath(__file__))
print(pwd)
proj_path = "./"
# questions_json_file = proj_path + "/json/questions.json"
questions_json_file = pwd + "/json/questions_2.json"
leaderboard_json_file = pwd + "/json/score.json"

run = logger(proj_path + "/app.log")
run.log("Started the server at time : ", time.ctime())
##################################
users = {"Bheem":"Chutki#3000","Kaliya":"XX_bheem_XX","Chutki":"1234"}

def read_path(path):
    txt = {"dir": [], "file": []}
    print(path)
    if os.path.isdir(path):
        for i in os.listdir(path):
            if os.path.isdir(os.path.join(path, i)):
                txt["dir"].append(i)
            else:
                txt["file"].append(i)
        txt["dir"].sort()
        txt["file"].sort()
        # txt["msg"]="Updated"
    else:
        pass
        # txt["msg"]="Path Doesn't Exist"
    return txt


##  This returns list of directories in a directory.
def listdirs(folder):
    ##  If the dir doesn't exist or no valid directory path found then it will return  blank python list []
    list_of_dirs = []
    try:
        list_of_dirs = os.listdir(folder)
    except:
        run.log("Directory doesn't exist : ", folder)
    return list_of_dirs


## Exception handler
def handle_ex(e):
    run.log(e)
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


def parse_args(arg_data):
    global global_user_list
    user_name = arg_data.split("/", 1)[0]
    ## for root dir the arg will be only username. No / so path will be empty
    if len(arg_data.split("/", 1)) < 2:
        rel_path = ""
    else:
        rel_path = arg_data.split("/", 1)[1]
    abs_path = global_user_list[user_name] + "/" + rel_path
    return user_name, rel_path, abs_path






app = Flask(__name__, template_folder="templates")
auth = HTTPBasicAuth()

# authentication 
# @auth.verify_password
def verify_password(username, password):
    if username in users and users[username]==password:
        run.log("Authenticated user : ",username)
        return username
    else:
        run.log("Authentication failed !")
        run.log("user:",username, ";password:",password)


@app.route("/", methods=["GET", "POST"])
def home_page():
    ##  the home page will be ams_sim.
    ##  Since there are nothing else than webpage for sim results the root redirects to ams_sim
    return redirect("/leaderboard")


##  home page for AMS simulation results
##  This will list all the devices and button to add a new device.
@app.route("/leaderboard", methods=["GET", "POST"])
def poll_form():
    global questions_json_file ,leaderboard_json_file
    try:
        with open(questions_json_file, "r") as QuestionListFile:
            all_questions = json.load(QuestionListFile)
        run.log("Reading list of questions from the file : ", questions_json_file)
    except Exception as e:
        handle_ex(e)
        all_questions = {}
        handle_ex(e)
        run.log("Setting list of questions as blank dictionary {}")

    try:
        with open(leaderboard_json_file, "r") as ScoreFile:
            leaderboard_data = json.load(ScoreFile)
        run.log("Reading scores from the file : ", leaderboard_json_file)
    except Exception as e:
        handle_ex(e)
        leaderboard_data = {}
        handle_ex(e)
        run.log("Setting scores as blank dictionary {}")

    return render_template("home.html", leaderboard_data =leaderboard_data, poll_data=all_questions)
    # return render_template("form_submitted.html", server2client_data=all_questions)


@app.route("/poll_form_response", methods=["POST","GET"])
def poll_form_response():
    if request.method == "POST":
        all_args = {}

        for key in request.form:
            all_args[key] = request.form[key]
        run.log(all_args)
    return render_template("form_submitted.html")


## os name is "nt" for windows environment. For deveolpment and debug
if os.name == "nt":
    app.run()
    # app.run(host="0.0.0.0",threaded=True)
else:
    ## running with on its own allocated ip by router, this will open the server for intranet
    app.run(host="0.0.0.0", threaded=True)


## on exit save testcase status to json files for each device to its seprate json file
"""
def exit_handler():
    global list_of_devices, global_tc_status_dict
    run.log("Closing the server at time : ", time.ctime())
    ## log individual device testcase status in separate file
    try:
        for device in list_of_devices:
            tc_status_file = proj_path+"/json/" + device + "_tc_status.json"
            run.log(
                "Writing to the device file in json. Device:",
                device,
                " File name :",
                tc_status_file
            )
            with open(tc_status_file, "w") as outfile:
                json.dump(global_tc_status_dict[device], outfile, indent=4)

        ## log all device testcase status in tc_status.json file. This is not needed, later remove this data log.
        with open(local_status_file, "w") as outfile:
            json.dump(global_tc_status_dict, outfile, indent=4)
    except Exception as e:
        handle_ex(e)
        run.log("Not able to save testcase status to json files. Check file path and permissions")
    run.log("Closed the server at time : ", time.ctime())

"""
# atexit.register(exit_handler)
