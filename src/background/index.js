import Fuse from 'fuse.js';
import constants from '../constants';

/**
 * @returns {Array<Object>} all the currently opened tabs (including tabs from incognito window)
 */
function getTabs() {
  return new Promise(resolve => {
    chrome.tabs.query({}, resolve);
  });
}

chrome.runtime.onConnect.addListener(port => {
  if (port.name !== constants.SEARCH_PORT) return;

  port.onMessage.addListener(async (req) => {
    if (!req.data) return;

    const tabs = await getTabs();
    
    const fuse = new Fuse(tabs, {
      threshold: 0.7,
      includeMatches: true,
      keys: [ 'title' ],
    });

    port.postMessage(fuse.search(req.data));
  })
})


chrome.commands.onCommand.addListener((command) => {
  switch (command) {
    case constants.TOGGLE_SEARCH:
      chrome.tabs.query({ active: true, currentWindow: true }, (results) => {
        chrome.tabs.sendMessage(results[0].id, {
          type: constants.OPEN,
        });
      });
      break;
  }
});