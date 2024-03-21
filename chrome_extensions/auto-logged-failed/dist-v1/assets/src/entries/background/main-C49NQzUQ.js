chrome.runtime.onInstalled.addListener(async()=>{const e=chrome.runtime.getURL("src/entries/options/index.html");await chrome.tabs.create({url:e})});
