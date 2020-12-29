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
    console.log(url)
    chrome.storage.sync.get(['PORT'], function(result) {
        const clientServerOptions = {
            uri: 'http://localhost:' + result.PORT,
            headers: {'Content-Type': 'application/json; charset=utf-8'},
            body: JSON.stringify({url}),
            method: 'POST', 
        }
        request(clientServerOptions, function (error, response) {
            console.log(response)
        });;
    });
    
}

function setPort(){
    const val = prompt("Set a default port.", "1234");
    if(/[0-9]+/.test(val)){
        chrome.storage.sync.set({PORT: val}, function() {
            console.log('Value is set to ' + val);
        });
    }
    else{
        alert("Port has to be a whole number")
    }
}

chrome.contextMenus.create({
    title: "Set server port...", 
    onclick: setPort
});