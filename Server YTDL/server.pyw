import sys
from http.server import BaseHTTPRequestHandler, HTTPServer
import logging
import youtube_dl as yt
import os
import threading
from tkinter import *
from tkinter.ttk import *


class GUI:
    root = Tk()
    progress = Progressbar(root, orient=HORIZONTAL, length=300, mode="determinate")
    v1 = StringVar()
    text = Label(root, textvariable=v1)
    v2 = StringVar()
    text2 = Label(root, textvariable=v2)

    def __init__(self):
        self.root.protocol("WM_DELETE_WINDOW", self.close)
        self.root.title("Youtube Downloader")
        self.root.resizable(False, False)
        self.root.iconbitmap("./page_32.ico")
        self.progress["value"] = 0
        self.v1.set("0%")
        self.v2.set("Waiting.")
        self.text2.pack(padx=10, pady=10, side=BOTTOM)
        self.text.pack(padx=5, pady=20, side=LEFT)
        self.progress.pack(padx=5, pady=10, side=LEFT)

    def my_hook(self, d):
        if d["status"] == "finished":
            file_tuple = os.path.split(os.path.abspath(d["filename"]))
            self.v2.set("Done downloading '" + format(file_tuple[1] + "'"))
        if d["status"] == "downloading":
            p = d["_percent_str"]
            p = p.replace("%", "")
            self.updateBar(p)
            self.v1.set(d["_percent_str"])
            self.v2.set("Downloading")

    def updateBar(self, val):
        self.progress["value"] = val

    def close(self):
        self.root.destroy()
        sys.exit()


g = GUI()


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
        url = raw.split('"')[3]
        filetype = raw.split('"')[7]

        if filetype == "mp3":
            ydl_opts = {
                "outtmpl": os.environ["USERPROFILE"]
                + "/Videos/Youtube/%(title)s.%(ext)s",
                "format": "bestaudio/best",
                "ignoreerrors": True,
                "cachedir": False,
                "logger": MyLogger(),
                "progress_hooks": [g.my_hook],
            }
        else:
            ydl_opts = {
                "outtmpl": os.environ["USERPROFILE"]
                + "/Videos/Youtube/%(title)s.%(ext)s",
                "format": "bestvideo[ext=mp4]+bestaudio",
                "ignoreerrors": True,
                "cachedir": False,
                "logger": MyLogger(),
                "progress_hooks": [g.my_hook],
            }
        try:
            with yt.YoutubeDL(ydl_opts) as ydl:
                ydl.download([url])
            g.progress["value"] = 100
            g.v1.set("100%")
        except:
            g.v2.set("Something went wrong")


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


mainloop()
