from __future__ import print_function
import os
import threading
import tkinter
from http.server import BaseHTTPRequestHandler, HTTPServer
from tkinter import *
from tkinter import simpledialog, filedialog

import pygubu
import youtube_dl as yt
import keyboard


def resource_path(relative_path):
    if hasattr(sys, "_MEIPASS"):
        return os.path.join(sys._MEIPASS, relative_path)
    return os.path.join(os.path.abspath("."), relative_path)


class NewprojectApp:
    def __init__(self, master):
        self.log = ""
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
        self.output = builder.get_variable("output")
        self.output.set(self.path)
        self.FileName = ""
        self.checked = builder.get_variable("checked")
        self.isLogOpen = False

    def changeToMp3(self):
        self.filetype = "mp3"
        self.mp3["state"] = "disabled"
        self.mp4["state"] = "normal"

    def changeToMp4(self):
        self.filetype = "mp4"
        self.mp4["state"] = "disabled"
        self.mp3["state"] = "normal"

    def chosePath(self):
        temp = filedialog.askdirectory(initialdir=self.path, title="Select A Directory")
        if temp:
            self.path = temp
            self.output.set(self.path)

    def run(self):
        self.mainwindow.mainloop()

    def my_hook(self, d):
        if d["status"] == "finished":
            file_tuple = os.path.split(os.path.abspath(d["filename"]))
            print(d["filename"])
            self.status.set("Done downloading '" + format(file_tuple[1] + "'"))
        if d["status"] == "downloading":
            p = d["_percent_str"]
            p = p.replace("%", "")
            self.progress["value"] = p
            self.v1.set(d["_percent_str"])
            self.status.set("Downloading")
            vel = d["speed"]
            if isinstance(vel, float):
                vel = vel / 1048576
                self.vel.set("{:.2f}".format(vel) + " MB/s")
            self.mp4["state"] = "disabled"
            self.mp3["state"] = "disabled"

    def close(self):
        self.master.destroy()
        sys.exit()

    def closeLog(self):
        self.isLogOpen = False
        self.main_window_master.destroy()

    def clearLog(self):
        self.logText.config(state=NORMAL)
        self.logText.delete('1.0', END)
        self.logText.config(state=DISABLED)
        self.log = ""


class S(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        for arg in args:
            print(arg)
        return

    def do_POST(self):
        response = bytes("Youtube link received!", "utf-8")  # create response

        self.send_response(200)  # create header
        self.send_header("Content-Length", str(len(response)))
        self.end_headers()

        self.wfile.write(response)  # send response

        content_length = int(
            self.headers["Content-Length"]
        )  # <--- Gets the size of data
        post_data = self.rfile.read(content_length)  # <--- Gets the data itself
        raw = post_data.decode("utf-8")
        url = raw.split('"')[1]
        if app.checked.get() == "1":
            temp = filedialog.asksaveasfilename(initialdir=app.path, title="Save as?")
            if temp:
                temp = temp.split(".")[0]
                output = temp + ".%(ext)s"
            else:
                return
        else:
            output = app.path + "\%(title)s.%(ext)s"

        if app.filetype == "mp3":
            ydl_opts = {
                "outtmpl": output,
                "format": "140",
                "ignoreerrors": True,
                "cachedir": False,
                "logger": MyLogger(),
                "progress_hooks": [app.my_hook]
            }
        else:
            ydl_opts = {
                "outtmpl": output,
                'format': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]',
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
    @staticmethod
    def debug(msg):
        print(msg)

    @staticmethod
    def warning(msg):
        print(msg)

    @staticmethod
    def error(msg):
        print(msg)


class WebThread(threading.Thread):
    def run(self, server_class=HTTPServer, handler_class=S, port=1234):
        server_address = ("localhost", port)
        httpd = server_class(server_address, handler_class)
        httpd.serve_forever()


def print(*args, **kwargs):
    if not hasattr(app, "main_window_master"):
        for arg in args:
            app.log += arg + "\n"
    elif len(app.main_window_master.children) == 0:
        for arg in args:
            app.log += arg + "\n"
    else:
        app.logText.config(state=NORMAL)
        for arg in args:
            app.logText.insert(END, arg + "\n")
        app.logText.config(state=DISABLED)


def OpenLog():
    if not app.isLogOpen:
        app.builder2 = builder2 = pygubu.Builder()
        builder2.add_from_file(resource_path("temp.ui"))

        app.isLogOpen = True
        app.main_window_master = Toplevel(app.mainwindow)
        app.main_window_master.protocol("WM_DELETE_WINDOW", app.closeLog)
        app.main_window_master.title("Youtube Downloader")
        app.main_window_master.resizable(False, False)
        app.main_window_master.iconbitmap(resource_path("page_32.ico"))

        app.logframe = builder2.get_object('logframe', app.main_window_master)
        app.logText = builder2.get_object("logtextbox", app.main_window_master)
        app.logText.insert(END, app.log)
        app.logText.config(state=DISABLED)

        builder2.connect_callbacks(app)


def AskPort():
    x = simpledialog.askinteger("title", "prompt")


if __name__ == "__main__":
    root = Tk()
    app = NewprojectApp(root)
    keyboard.add_hotkey('ctrl+alt+l', OpenLog)
    keyboard.add_hotkey('ctrl+alt+s', AskPort)
    AskPort()
    web = WebThread()
    web.daemon = TRUE
    web.start()
    app.run()
