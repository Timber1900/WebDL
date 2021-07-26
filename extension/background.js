function buttonClicked() {
  chrome.tabs.query({ currentWindow: true, active: true }, (queryInfo) => {
    chrome.tabs.get(queryInfo[0].id, (tab) => {
      console.log(tab.url);
      addToServer(tab.url);
    });
  });
}

const addToServer = (url) => {
  chrome.storage.sync.get(['PORT'], (result) => {
    const bodyJson = { url: url };
    const bodyString = JSON.stringify(bodyJson);
    fetch(`http://localhost:${result.PORT}`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: {'Content-Type': 'application/json'},
      body: bodyString,
    })
      .then((res) => res.json())
      .then(console.log)
      .catch(console.error);
  });
};

const setPort = () => {
  chrome.storage.sync.get(['PORT'], (result) => {
    const val = prompt('Set a default port.', result.PORT);
    if (/^[0-9]+$/.test(val)) {
      chrome.storage.sync.set({ PORT: val }, () => console.log(`Value is set to ${val}`));
    } else {
      alert('Port has to be a whole number');
    }
  });
};

chrome.browserAction.onClicked.addListener(buttonClicked);

chrome.contextMenus.create({
  title: 'Send to WebDL',
  contexts: ['link'],
  onclick: (event) => {
    addToServer(event.linkUrl);
  }
});

chrome.contextMenus.create({
  title: 'Set server port...',
  onclick: setPort,
});
