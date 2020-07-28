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

function sendUrl(url) {
    if (url.substr(0, 32) == 'https://www.youtube.com/watch?v=' || url.substr(0, 38) == 'https://www.youtube.com/playlist?list=') {
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