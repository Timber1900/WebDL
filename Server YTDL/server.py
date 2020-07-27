
from http.server import BaseHTTPRequestHandler, HTTPServer
import logging
import youtube_dl as yt
import os

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
        if filetype == "mp3":
            ydl_opts = {
                "outtmpl": os.environ["USERPROFILE"] + "/Videos/Youtube/%(title)s.%(ext)s",
                "format": "bestaudio/best",
                "ignoreerrors": True,
                "cachedir": False,
            }
        else:
            ydl_opts = {
                "outtmpl": os.environ["USERPROFILE"] + "/Videos/Youtube/%(title)s.%(ext)s",
                "format": "bestvideo[ext=mp4]+bestaudio",
                "ignoreerrors": True,
                "cachedir": False,
            }
        with yt.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
        print("Downloaded")



def run(server_class=HTTPServer, handler_class=S, port=1234):
    server_address = ('localhost', port)
    httpd = server_class(server_address, handler_class)
    httpd.serve_forever()

run()


