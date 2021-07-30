cd ~
mkdir ./.webdl
cd .webdl/
mkdir ./WebDL
rm -rf ./WebDL.tar.xz
wget https://github.com/Timber1900/WebDL/releases/download/beta-linux-v10.3.2/WebDL.tar.xz
tar xf WebDL.tar.xz -C ./WebDL
sudo rm -rf /usr/lib/WebDL
sudo mv ./WebDL -t /usr/lib
rm -rf ./WebDL.tar.xz
cd /home/timber/.local/share/applications/
rm -f ./WebDL.desktop
touch ./WebDL.desktop

echo "[Desktop Entry]\nEncoding=UTF-8\nVersion=1.0\nType=Application\nTerminal=false\nExec=/usr/lib/WebDL/WebDL\nName=WebDL\nIcon=/usr/lib/WebDL/webdl.ico" > ./WebDL.desktop


