const request = require('request')

function buttonClicked() {
    chrome.tabs.query({ currentWindow: true, active: true }, (queryInfo) => {
        chrome.tabs.get(queryInfo[0].id, (tab) => {
            let tabUrl = tab.url;
            sendUrl(tabUrl)
        });
    });
}

chrome.browserAction.onClicked.addListener(buttonClicked);

const re1 = 'https://www.youtube.com/watch'
const re2 = 'https://www.youtube.com/playlist'
const re3 = 'https://music.youtube.com/watch'
const re4 = 'https://music.youtube.com/playlist'


function sendUrl(url) {
    if (url.search(re1) != -1 || url.search(re2) != -1 || url.search(re3) != -1 || url.search(re4) != -1 ) {
        console.log(url)
        const clientServerOptions = {
            uri: 'http://localhost:1234',
            body: JSON.stringify(url),
            method: 'POST',
        }
        request(clientServerOptions, function (error, response) {
            return;
        });
    }
}
