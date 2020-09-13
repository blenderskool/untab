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
  }
]