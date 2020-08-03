import sys, os, threading
from http.server import BaseHTTPRequestHandler, HTTPServer
import youtube_dl as yt
from tkinter import *
from tkinter.ttk import *
from tkinter import filedialog
import pygubu
import math


def resource_path(relative_path):
    if hasattr(sys, "_MEIPASS"):
        return os.path.join(sys._MEIPASS, relative_path)
    return os.path.join(os.path.abspath("."), relative_path)


class NewprojectApp:
    def __init__(self, master):
        self.master = master
        self.filetype = "mp4"
        self.master.protocol("WM_DELETE_WINDOW", self.close)
        self.master.title("Youtube Downloader")
        self.master.resizable(False, False)
        self.master.iconbitmap(resource_path("page_32.ico"))
        self.builder = builder = pygubu.Builder()
        builder.add_from_file(resource_path("temp.ui"))
        self.mainwindow = builder.get_object("mainwindows")
        builder.connect_callbacks(self)
        self.status = builder.get_variable("status")
        self.path = os.environ["USERPROFILE"] + "\Videos\Youtube" 
        self.v1 = builder.get_variable("v1")
        self.progress = builder.get_object("downloadprocess")
        self.mp3 = builder.get_object("mp3")
        self.mp4 = builder.get_object("mp4")
        self.b = builder.get_object("browse")
        self.vel = builder.get_variable("vel")
        self.name = builder.get_variable("name")
        self.output = builder.get_variable("output")
        self.output.set(self.path)
        self.FileName = ""

    def changeToMp3(self):
        self.filetype = "mp3"
        self.mp3["state"] = "disabled"
        self.mp4["state"] = "normal"        

    def changeToMp4(self):
        self.filetype = "mp4"
        self.mp4["state"] = "disabled"
        self.mp3["state"] = "normal" 

    def chosePath(self):
        temp = filedialog.askdirectory(initialdir = self.path, title = "Select A File")
        if temp:
            self.path = temp
            self.output.set(self.path)
        
    def run(self):
        self.mainwindow.mainloop()

    def my_hook(self, d):
        if d["status"] == "finished":
            file_tuple = os.path.split(os.path.abspath(d["filename"]))
            self.status.set("Done downloading '" + format(file_tuple[1] + "'"))
        if d["status"] == "downloading":
            p = d["_percent_str"]
            p = p.replace("%", "")
            self.progress["value"] = p
            self.v1.set(d["_percent_str"])
            self.status.set("Downloading")
            vel = d["speed"]
            if isinstance(vel, float):
                vel = vel / (1048576)
                self.vel.set("{:.2f}".format(vel) + " MB/s")
            self.mp4["state"] = "disabled"
            self.mp3["state"] = "disabled" 
                      


    def close(self):
        self.master.destroy()
        sys.exit()

    



root = Tk()
app = NewprojectApp(root)


class S(BaseHTTPRequestHandler):
    def _set_response(self):
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.end_headers()

    def do_POST(self):
        content_length = int(
            self.headers["Content-Length"]
        )  # <--- Gets the size of data
        post_data = self.rfile.read(content_length)  # <--- Gets the data itself
        raw = post_data.decode("utf-8")
        url = raw.split('"')[1]
        

        if app.name.get() == "":
            name = "\%(title)s.%(ext)s"
        else:
            name = "\\" + app.name.get() + ".%(ext)s" 

        if app.filetype == "mp3":
            ydl_opts = {
                "outtmpl": app.path + name,
                "format": "140",
                "ignoreerrors": True,
                "cachedir": False,
                "logger": MyLogger(),
                "progress_hooks": [app.my_hook]
            }
        else:
            ydl_opts = {
                "outtmpl": app.path + name,
                'format': '137+bestaudio/best',
                "ignoreerrors": True,
                "cachedir": False,
                "logger": MyLogger(),
                "progress_hooks": [app.my_hook]
            }
        try:
            with yt.YoutubeDL(ydl_opts) as ydl:
                ydl.download([url])
            app.progress["value"] = 100
            app.v1.set("100%")
            if app.filetype == "mp3":
                app.mp4["state"] = "normal"
            else:
                app.mp3["state"] = "normal" 
        except:
            app.status.set("Something went wrong")


class MyLogger(object):
    def debug(self, msg):
        pass

    def warning(self, msg):
        pass

    def error(self, msg):
        print(msg)


class WebThread(threading.Thread):
    def run(self, server_class=HTTPServer, handler_class=S, port=1234):
        server_address = ("localhost", port)
        httpd = server_class(server_address, handler_class)
        httpd.serve_forever()


web = WebThread()
web.daemon = TRUE
web.start()
app.run()
