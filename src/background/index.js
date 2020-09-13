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
    windowId, title, url, id, favicon: favIconUrl, category: 'Tabs',
  }));
}

chrome.runtime.onConnect.addListener(port => {
  if (port.name !== constants.SEARCH_PORT) return;

  port.onMessage.addListener(async (req) => {
    query = req.data;

    const tabs = await getTabs();
    const pluginsItemsArray = [];
    const pluginsItems = [];

    /**
     * Prepare an index of plugins that match the regex
     */
    for(const plugin of plugins) {
      if (plugin.match !== undefined && !plugin.match.test(query)) continue;
      if (plugin.match) {
        plugin.match.lastIndex = 0;
      }

      let items = typeof plugin.item === 'function' ? await plugin.item(query) : plugin.item;
      const isArray = Array.isArray(items);

      if (!isArray) {
        items = [ items ];
      }

      items.forEach((item) => {
        if (isArray && pluginsItems.length) return;

        const newItem = {};

        // Replace the $parameter in the item attributes with the matched groups
        for(const key in item) {
          newItem[key] = plugin.match && /\$[1-9][0-9]*/.test(item[key]) ? query.replace(plugin.match, item[key]) : item[key];
        }

        item = {
          ...newItem,
          type: constants.PLUGIN,
          name: plugin.name,
          category: plugin.category || 'Plugins',
        };

        if (isArray) {
          pluginsItemsArray.push(item);
        } else {
          pluginsItems.push(item);
        }
      });
    }
    
    const search = [...( pluginsItems.length ? pluginsItems : [...tabs, ...pluginsItemsArray] )];
    const fuse = new Fuse(search, {
      threshold: pluginsItems.length ? 0.75 : 0.45,
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
    
    const items = {
      'Tabs': [],
      'Plugins': [],
    };
    
    const results = fuse.search(query);
    results.forEach(({ item }) => {
      if (!items[item.category]) {
        items[item.category] = [];
      }

      items[item.category].push(item);
    });

    port.postMessage({
      items: query ? Object.values(items).flat() : search,
      match: pluginsItems.length ? undefined : results?.[0]?.matches,
    });
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