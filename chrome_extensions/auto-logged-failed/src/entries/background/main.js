let tab;
chrome.runtime.onInstalled.addListener(async () => {
    const url = chrome.runtime.getURL('src/entries/options/index.html');

    tab = await chrome.tabs.create({ url: url });
    // console.log(tab);
    // console.log(`Created tab ${tab.id}`);
});

// chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
//     msg.from = 'background.js';
//     chrome.runtime.sendMessage(msg);
// });
