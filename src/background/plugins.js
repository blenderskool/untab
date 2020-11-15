export default {
  'tabs': {
    async item() {
      const tabs = await new Promise(resolve => {
        chrome.tabs.query({}, resolve);
      });

      return tabs.map(({ windowId, title, favIconUrl, url, id }) => ({
        id,
        windowId,
        title,
        url,
        favicon: favIconUrl,
        category: 'Tabs',
      }));
    },
    handler(item, sendResponse) {
      chrome.windows.update(
        item.windowId,
        { focused: true },
        () => chrome.tabs.update(item.id, { active: true }, () => sendResponse()),
      );
    }
  },
  'tab-actions': {
    displayName: 'Tab actions',
    keys: [ 't', 'tab' ],
    item: [
      {
        key: 'back',
        title: 'Back navigate',
        url: '',
        emoji: '⬅️',
        category: 'Current Tab',
      },
      {
        key: 'forward',
        title: 'Forward navigate',
        url: '',
        emoji: '➡️',
        category: 'Current Tab',
      },
      {
        key: 'close',
        title: 'Close Tab',
        url: '',
        emoji: '❌',
        category: 'Current Tab',
      },
    ],
    handler(item, sendResponse) {
      switch(item.key) {
        case 'back':
          chrome.tabs.goBack(null, sendResponse);
          break;
        case 'forward':
          chrome.tabs.goForward(null, sendResponse);
          break;
        case 'close':
          chrome.tabs.query({ active: true, currentWindow: true }, (results) => {
            chrome.tabs.remove(results[0].id, sendResponse);
          });
          break;
      }
    }
  },
  'google-search': {
    displayName: 'Google search',
    match: /\s*(.*?)/,
    keys: [ 'g', 'google' ],
    item: {
      favicon: 'https://www.google.com/favicon.ico',
      title: 'Search Google for $1',
      url: 'https://www.google.com/search?q=$1',
    },
    handler(item, sendResponse) {
      chrome.tabs.create({ active: true, url: item.url }, () => sendResponse());
    }
  },
  'duckduckgo-search': {
    displayName: 'DuckDuckGo search',
    match: /\s*(.*?)/,
    keys: [ 'd', 'duckduckgo' ],
    async item(query) {
      const results = [];

      if (query.length > 3) {
        const category = 'Instant answer';
        const parseIconUrl = (url) => {
          if (!url || url === '') return;
          return url.indexOf('http') === 0 ? url : 'https://duckduckgo.com' + url;
        };

        try {
          const search = await fetch(`https://api.duckduckgo.com/?q=${encodeURI(query)}&format=json`).then(response => response.json());

          if (search.Abstract) {
            results.push({
              favicon: parseIconUrl(search.Image),
              title: search.AbstractText,
              url: search.AbstractURL,
              category,
            });
          }

          results.push(...search.Results.map(result => ({
            favicon: parseIconUrl(result.Icon?.URL),
            title: result.Text,
            url: result.FirstURL,
            category,
          })));

          results.push(
            ...search.RelatedTopics
              .filter(topic => !!topic.FirstURL)
              .map(topic => ({
                favicon: parseIconUrl(topic.Icon?.URL),
                title: topic.Text,
                url: topic.FirstURL,
                category,
              }))
          );
        } catch {}
      }
      return [
        {
          favicon: 'https://duckduckgo.com/favicon.ico',
          title: 'Results from DuckDuckGo for $1',
          url: 'https://duckduckgo.com?q=$1',
        },
        ...results,
      ];
    },
    handler(item, sendResponse) {
      chrome.tabs.create({ active: true, url: item.url }, () => sendResponse());
    }
  },
  'open-url': {
    match: /^(https?:\/\/)?([\w]+\.)+[A-Za-z]{2,24}(\/[\w\/&.=?-]*)?$/,
    async item(query) {
      const url = /^https?:\/\//.exec(query) ? query : `https://${query}`;
      return {
        favicon: `chrome://favicon/${url}`,
        title: `Open ${query} in new tab`,
        url,
      }
    },
    handler(item, sendResponse) {
      chrome.tabs.create({ active: true, url: item.url }, () => sendResponse());
    }
  },
  'history': {
    async item(query) {
      const histories = await new Promise(resolve => 
        chrome.history.search({ text: query, maxResults: 40 }, resolve)
      );
      
      return histories.map(({ title, url }) => ({
        title,
        url,
        favicon: `chrome://favicon/${url}`,
        category: 'History',
      }));
    },
    handler(item, sendResponse) {
      chrome.tabs.create({ active: true, url: item.url }, () => sendResponse());
    }
  },
  'bookmarks': {
    async item(query) {
      if (!query) return [];

      const bookmarkTreeNodes = await new Promise(resolve => 
        chrome.bookmarks.search(query, resolve)
      );

      return bookmarkTreeNodes
        .filter(({ url }) => !!url) // We avoid adding the bookmarkTreeNode to the list if it is a folder
        .map(({ title, url }) => ({
          title,
          url,
          favicon: `chrome://favicon/${url}`,
          category: 'Bookmarks'
        }));
    },
    handler(item, sendResponse) {
      chrome.tabs.create({ active: true, url: item.url }, () => sendResponse());
    }
  },
  'themes': {
    keys: ['dark', 'themes', 'mode', 'light'],
    displayName: '🎨 Themes',
    item: [
      {
        title: 'Dark',
        url: '',
        emoji: '🌒',
        theme: 'dark',
      },
      {
        title: 'Light',
        url: '',
        emoji: '☀️',
        theme: 'light',
      },
      {
        title: 'Coffee',
        url: '',
        emoji: '☕',
        theme: 'coffee',
      },
      {
        title: 'Spearmint',
        url: '',
        emoji: '🌿',
        theme: 'spearmint',
      },
      {
        title: 'Ocean',
        url: '',
        emoji: '🌊',
        theme: 'ocean'
      }
    ],
    handler({ theme }, sendResponse) {
      chrome.storage.local.set({ theme }, () => {
        sendResponse({ theme, autoClose: false });
      });
    }
  }
};
