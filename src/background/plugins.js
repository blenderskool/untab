export default [
  {
    name: 'tab-back',
    match: /^\/((tab)|t)(.*?)/,
    item: {
      title: 'tab: Back navigate',
      url: '',
    },
    handler() {
      chrome.tabs.goBack();
    }
  },
  {
    name: 'tab-forward',
    match: /^\/((tab)|t)(.*?)/,
    item: {
      title: 'tab: Forward navigate',
      url: '',
    },
    handler() {
      chrome.tabs.goForward();
    }
  },
  {
    name: 'tab-close',
    match: /^\/((tab)|t)(.*?)/,
    item: {
      title: 'tab: Close current tab',
      url: '',
    },
    handler() {
      chrome.tabs.query({ active: true, currentWindow: true }, (results) => {
        chrome.tabs.remove(results[0].id);
      });
    }
  },
  {
    name: 'google-search',
    match: /^\/((google)|g)\s*(.*)/,
    item: {
      favicon: 'https://www.google.com/favicon.ico',
      title: 'Search Google for $3',
      url: 'https://www.google.com/search?q=$3',
    },
    handler(item) {
      chrome.tabs.create({ active: true, url: item.url });
    }
  },
  {
    name: 'duckduckgo-search',
    match: /^\/((duckduckgo)|(duck)|d)\s*(.*)/,
    item: {
      favicon: 'https://duckduckgo.com/favicon.ico',
      title: 'Search DuckDuckGo for $4',
      url: 'https://duckduckgo.com?q=$4',
    },
    handler(item) {
      chrome.tabs.create({ active: true, url: item.url });
    }
  },
  {
    name: 'history',
    category: 'History',
    async item(query) {
      const histories = await new Promise(resolve => 
        chrome.history.search({ text: query, maxResults: 40 }, resolve)
      );
      
      return histories.map(({ title, url }) => ({ title, url, favicon: `chrome://favicon/${url}` }));
    },
    handler(item) {
      chrome.tabs.create({ active: true, url: item.url });
    }
  }
]