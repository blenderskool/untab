import Fuse from './utils/fuse';
import plugins from './plugins';
import constants from '../constants';
import logEvent from './utils/logEvent';

let search = {
  query: '',
  plugin: {},
};

const pluginIndex = new Fuse(
  Object
    .entries(plugins)
    .filter(([,plugin]) => plugin.keys?.length)
    .map(([name, { keys, displayName }]) => ({ name, keys, displayName })),
  {
    threshold: 0.4,
    keys: ['keys', 'displayName'],
  }
);

/**
 * Preprocesses the items from a plugin making it ready for search indexing
 * @param {String} name Unique name of the plugin
 * @returns {Promise<Array>} processed plugin items
 */
async function preprocessPluginItems(name) {
  const plugin = plugins[name];
  if (!plugin) return [];

  let items = typeof plugin.item === 'function' ? await plugin.item(search.query) : plugin.item;
  items = Array.isArray(items) ? items : [ items ];

  return items.map((item) => {
    const newItem = {};

    // Replace the $parameter in the item attributes with the matched groups
    for(const key in item) {
      newItem[key] = plugin.match && /\$[1-9][0-9]*/.test(item[key])
        ? search.query.replace(plugin.match, item[key])
        : item[key];
    }

    return {
      ...newItem,
      name,
      url: item.requestPermission ? 'Additional permissions required to enable this plugin' : newItem.url,
      type: constants.PLUGIN,
      category: item.category || 'Plugins',
    };
  });
}

/**
 * Groups an array of items based on their `category` key
 * @param {Array<Object>} items Items to be grouped 
 * @param {Array<String>} groups Explicit ordering of groups in the results
 * @returns {Object} key as the group name and value as array of items in that group
 */
function groupItems(items, groups = []) {
  /**
   * Groups are explicity created here to define
   * the order of categories in the final result
   */
  const results = groups.reduce((obj, grp) => {
    obj[grp] = [];
    return obj;
  }, {});

  items.forEach(({ item }) => {
    if (!results[item.category]) {
      results[item.category] = [];
    }

    results[item.category].push(item);
  });

  // Remove empty groups
  Object.keys(results).forEach((key) => {
    if (results[key].length) return;

    delete results[key];
  });

  /**
   * Assign each result their index when represented in a 1D array.
   * This is used for keyboard navigation on the UI
   */
  Object
    .values(results)
    .flat()
    .forEach((item, i) => {
      item.idx = i;
    });

  return results;
}

async function searchData({ data }) {
  search = data;

  /**
   * Prepare an index of plugins that match the regex
   */
  const pluginsItems = (await Promise.all(
    Object
      .entries(plugins)
      .filter(([,plugin]) => !(plugin.keys || plugin.match !== undefined && !plugin.match.test(search.query)))
      .map(([name, plugin]) => {
        if (plugin.match) {
          plugin.match.lastIndex = 0;
        }

        return preprocessPluginItems(name);
      })
  )).flat();
  
  const searchIndex = pluginsItems;
  const fuse = new Fuse(searchIndex, {
    threshold: 0.45,
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

  const results = fuse.search(search.query);

  return {
    length: results.length,
    items: groupItems(results, [ 'Tabs', 'Plugins' ]),
    match: results?.[0]?.matches,
  };
}

function searchPlugins({ data }) {
  const query = data.query.substring(1);

  const results = pluginIndex.search(query);
  const items = results.reduce((obj, { item }) => {
    obj[item.name] = item;
    return obj;
  }, {});
  
  return {
    length: results.length,
    items,
  };
}

async function searchPluginItems({ data }) {
  search = data;
  const pluginsItems = await preprocessPluginItems(data.plugin.name);

  const fuse = new Fuse(pluginsItems, {
    threshold: 0.75,
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

  const results = fuse.search(search.query);

  return {
    length: results.length,
    items: groupItems(results, [ 'Plugins' ]),
    match: results?.[0]?.matches,
  };
}

browser.runtime.onConnect.addListener(port => {
  if (port.name === constants.SEARCH_PORT) {
    port.onMessage.addListener(async (req) => {

      let results;
      switch(req.type) {
        case constants.SEARCH_TYPE_PLUGINS:
          results = searchPlugins(req);
          break;
        case constants.SEARCH_TYPE_PLUGIN:
          results = await searchPluginItems(req);
          break;
        case constants.SEARCH_TYPE_FULL:
          results = await searchData(req);
          break;
      }

      port.postMessage(results);
    });
  } else if (port.name === constants.SELECT_PORT) {
    port.onMessage.addListener(async ({ data:item }) => {
      let results = { autoClose: true };

      if (item.type === constants.PLUGIN) {
        /**
         * Plugins are executed by calling their specific handler method
         * handler is passed item object that was selected.
         * returned object is sent back as response
         */
        const data = (await plugins[item.name].handler(item));
        if (typeof data === 'object') {
          results = { ...results, ...data };
        }
        logEvent('trigger', 'select');
      }

      port.postMessage(results);
    });
  }
});

const prepareUntabOpenData = (storage) => ({
  type: constants.OPEN,
  data: {
    storage,
    ...search,
  },
});

async function triggerOpen(tab) {
  try {
    const [results, storage] = await Promise.all([
      tab ? [ tab ] : browser.tabs.query({ active: true, currentWindow: true }),
      browser.storage.local.get(null),
    ]);
    await browser.tabs.sendMessage(results[0].id, prepareUntabOpenData(storage));

    logEvent('trigger', 'open');
  } catch(err) {
    try {
      const [tab, storage] = await Promise.all([
        browser.tabs.create({ active: true, url: browser.runtime.getURL('index.html') }),
        browser.storage.local.get(null),
      ]);

      const handleTabUpdate = async (tabId, changeInfo) => {
        if (tabId === tab.id && changeInfo.status === 'complete') {
          await browser.tabs.sendMessage(tabId, prepareUntabOpenData(storage));
          logEvent('trigger', 'open');
          browser.tabs.onUpdated.removeListener(handleTabUpdate);
        }
      }

      browser.tabs.onUpdated.addListener(handleTabUpdate);
    } catch(err) {
      console.log(err);
    }
  }
}

browser.commands.onCommand.addListener(async (command) => {
  switch (command) {
    case constants.TOGGLE_SEARCH:
      await triggerOpen();
      break;
  }
});

browser.browserAction.onClicked.addListener(triggerOpen);

/**
 * Open welcome page when extension is installed
 */
browser.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === browser.runtime.OnInstalledReason.INSTALL) {
    browser.tabs.create({ active: true, url: 'https://getuntab.now.sh/welcome' });
  }
});
