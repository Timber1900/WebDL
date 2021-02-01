function buttonClicked() {
  chrome.tabs.query({ currentWindow: true, active: true }, (queryInfo) => {
    chrome.tabs.get(queryInfo[0].id, (tab) => {
      console.log(tab.url);
      chrome.storage.sync.get(['PORT'], (result) => {
        fetch(`http://localhost:${result.PORT}`, {
          method: 'POST',
          mode: 'no-cors',
          cache: 'no-cache',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: JSON.stringify({ url: tab.url }),
        })
          .then((res) => res.json())
          .then(console.log)
          .catch(console.error);
      });
    });
  });
}

chrome.browserAction.onClicked.addListener(buttonClicked);

function setPort() {
  chrome.storage.sync.get(['PORT'], (result) => {
    const val = prompt('Set a default port.', result.PORT);
    if (/^[0-9]+$/.test(val)) {
      chrome.storage.sync.set({ PORT: val }, () => console.log(`Value is set to ${val}`));
    } else {
      alert('Port has to be a whole number');
    }
  });
}

chrome.contextMenus.create({
  title: 'Set server port...',
  onclick: setPort,
});
