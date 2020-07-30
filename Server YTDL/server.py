import sys, os, threading
from http.server import BaseHTTPRequestHandler, HTTPServer
import youtube_dl as yt
from tkinter import *
from tkinter.ttk import *
import pygubu


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
        self.path = builder.get_variable("home")
        self.path.set(os.environ["USERPROFILE"] + "\Videos\Youtube")
        self.v1 = builder.get_variable("v1")
        self.progress = builder.get_object("downloadprocess")
        self.cur = builder.get_variable("curfile")


    def changeToMp3(self):
        self.filetype = "mp3"
        self.cur.set("MP3")


    def changeToMp4(self):
        self.filetype = "mp4"
        self.cur.set("MP4")

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
        
        if app.path.get()[:3] != "C:\\":
            app.path.set(os.environ["USERPROFILE"] + "\Videos\\" + app.path.get())

        if app.filetype == "mp3":
            ydl_opts = {
                "outtmpl": app.path.get() + "\%(title)s.%(ext)s",
                "format": "bestaudio/best",
                "ignoreerrors": True,
                "cachedir": False,
                "logger": MyLogger(),
                "progress_hooks": [app.my_hook]
            }
        else:
            ydl_opts = {
                "outtmpl": app.path.get() + "\%(title)s.%(ext)s",
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
