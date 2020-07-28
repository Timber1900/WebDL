import os
import pygubu
import tkinter as tk

PROJECT_PATH = os.path.dirname(__file__)
PROJECT_UI = os.path.join(PROJECT_PATH, "newproject")


class NewprojectApp:
    def __init__(self, master):
        self.master = master
        self.builder = builder = pygubu.Builder()
        builder.add_from_file("temp.ui")
        self.mainwindow = builder.get_object('mainwindows')
        builder.connect_callbacks(self)
        self.label = builder.get_variable('status')
        self.progress = builder.get_object('downloadprocess')
    
    def changeToMp3(self):
        self.label.set("Test")
        
    def changeToMp4(self):
        self.progress['value'] +=1

    def run(self):
        self.mainwindow.mainloop()

if __name__ == '__main__':
    root = tk.Tk()
    app = NewprojectApp(root)
    app.run()

