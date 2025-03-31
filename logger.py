
import os

class logger:

    def __init__(self, log_file_name  = "./print_logs.log"):
        self.log_file_name = log_file_name
        self.move_previous_log_to_old()
        return None

    def log(self,*args):
        txt = ""
        for i in args:
            txt = txt+str(i)
        print(txt)
        with open(self.log_file_name, "+a") as logger:
            logger.write(txt+"\n")
        return None

    def move_previous_log_to_old(self):
        if os.path.isfile(self.log_file_name):
            os.replace(self.log_file_name,  self.log_file_name[:-4]+"_old.log")
        else:
            pass
        return None



if __name__ == "__main__": 

    file_name = "test.tcl\nfile not found"
    my = logger(log_file_name="logs.log")
    my.log("File is missing :",file_name)
    my.log("File is missing :",file_name)





