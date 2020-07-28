
from http.server import BaseHTTPRequestHandler, HTTPServer
import logging
import youtube_dl as yt
import os
from tkinter import * 
from tkinter.ttk import *

class S(BaseHTTPRequestHandler):

    def _set_response(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()

    

    def do_POST(self):
        content_length = int(self.headers['Content-Length']) # <--- Gets the size of data
        post_data = self.rfile.read(content_length) # <--- Gets the data itself
        raw = post_data.decode('utf-8')
        url = raw.split('"')[3]
        filetype = raw.split('"')[7]
        print(url)
        print(filetype)

        class GUI:
            root = Tk()
            progress = Progressbar(root, orient = HORIZONTAL, 
                length = 100, mode = 'determinate') 
            progress['value'] = 100
            v = StringVar()
            v.set("0%")
            text = Label(root, textvariable=v)
            def my_hook(self, d):
                if d['status'] == 'finished':
                    file_tuple = os.path.split(os.path.abspath(d['filename']))
                    print("Done downloading {}".format(file_tuple[1]))
                if d['status'] == 'downloading':
                    p = d['_percent_str']
                    p = p.replace('%','')
                    self.updateBar(p)
                    self.v.set(d['_percent_str'])
                    self.text.pack(padx=5, pady=20, side=LEFT)
                    self.root.update()
                    
            
            def updateBar(self, val):
                self.progress['value'] = val
                self.progress.pack(padx=5, pady=20, side=LEFT)     
        g = GUI()
                
        if filetype == "mp3":
            ydl_opts = {
                "outtmpl": os.environ["USERPROFILE"] + "/Videos/Youtube/%(title)s.%(ext)s",
                "format": "bestaudio/best",
                "ignoreerrors": True,
                "cachedir": False,
                'logger': MyLogger(),
                'progress_hooks': [g.my_hook],
            }
        else:
            ydl_opts = {
                "outtmpl": os.environ["USERPROFILE"] + "/Videos/Youtube/%(title)s.%(ext)s",
                "format": "bestvideo[ext=mp4]+bestaudio",
                "ignoreerrors": True,
                "cachedir": False,
                'logger': MyLogger(),
                'progress_hooks': [g.my_hook],
            }
        try:
            with yt.YoutubeDL(ydl_opts) as ydl:
                ydl.download([url])
            g.root.destroy()
        except:
            print("Something went wrong")
    

class MyLogger(object):
    def debug(self, msg):
        pass

    def warning(self, msg):
        pass

    def error(self, msg):
        print(msg)

def run(server_class=HTTPServer, handler_class=S, port=1234):
    server_address = ('localhost', port)
    httpd = server_class(server_address, handler_class)
    httpd.serve_forever()
    

run()


