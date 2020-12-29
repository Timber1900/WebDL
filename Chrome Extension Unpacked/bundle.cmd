copy "manifest.json" "..\Chrome Extension\manifest.json"
echo "Copied files"
browserify background.js > "C:\Users\35196\Desktop\Stuff\GitHub repos\YoutubeVideoDownloader\Chrome Extension\bundle.js"
echo "Done creating bundle"

