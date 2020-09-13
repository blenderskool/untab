import Fuse from 'fuse.js';
import plugins from './plugins';
import constants from '../constants';

let query = '';

/**
 * @returns {Array<Object>} all the currently opened tabs (including tabs from incognito window)
 */
async function getTabs() {
  const tabs = await new Promise(resolve => {
    chrome.tabs.query({}, resolve);
  });

  return tabs.map(({ windowId, title, favIconUrl, url, id }) => ({
    windowId, title, url, id, favicon: favIconUrl,
  }));
}

chrome.runtime.onConnect.addListener(port => {
  if (port.name !== constants.SEARCH_PORT) return;

  port.onMessage.addListener(async (req) => {
    if (!req.data) return;

    query = req.data;

    const tabs = await getTabs();
    const pluginsSearch = [];

    /**
     * Prepare an index of plugins that match the regex
     */
    for(const plugin of plugins) {
      if (!plugin.match.test(query)) continue;
      plugin.match.lastIndex = 0;

      let items = plugin.item;
      items = Array.isArray(items) ? items : [ items ];

      items.forEach((item) => {
        const newItem = {};

        // Replace the $parameter in the item attributes with the matched groups
        for(const key in item) {
          newItem[key] = /\$[1-9][0-9]*/g.test(item[key]) ? query.replace(plugin.match, item[key]) : item[key];
        }

        item = {
          ...newItem,
          type: constants.PLUGIN,
          name: plugin.name,
        };

        pluginsSearch.push(item);
      });
    }
    
    const fuse = new Fuse([ ...pluginsSearch, ...tabs ], {
      threshold: 0.6,
      includeMatches: true,
      keys: [
        {
          name: 'title',
          weight: 0.9,
        },
        {
          name: 'url',
          weight: 0.7,
        },
      ],
    });

    port.postMessage(fuse.search(query));
  })
})

chrome.runtime.onMessage.addListener(async (req, sender, sendResponse) => {
  if (req.type !== constants.SELECT) return;

  const item = req.data;
  sendResponse();

  if (item.type === constants.PLUGIN) {
    // Plugins are executed by calling their specific handler method
    plugins
      .find(plugin => plugin.name === item.name)
      .handler(item);
  } else {
    // Tab switching
    chrome.windows.update(item.windowId, { focused: true }, () => 
      chrome.tabs.update(item.id, { active: true })
    );
  }

});

chrome.commands.onCommand.addListener((command) => {
  switch (command) {
    case constants.TOGGLE_SEARCH:
      chrome.tabs.query({ active: true, currentWindow: true }, (results) => {
        chrome.tabs.sendMessage(results[0].id, {
          type: constants.OPEN,
          data: query,
        });
      });
      break;
  }
});