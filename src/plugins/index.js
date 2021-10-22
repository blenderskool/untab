import getFaviconUrl from '../background/utils/getFaviconUrl';
import checkPermission from '../background/utils/checkPermission';
import tabs from './tabs/tabs';

export default {
  'tabs': tabs,
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
    async handler(item) {
      switch(item.key) {
        case 'back':
          await browser.tabs.goBack(null);
          break;
        case 'forward':
          await browser.tabs.goForward(null);
          break;
        case 'close':
          const results = await browser.tabs.query({ active: true, currentWindow: true });
          await browser.tabs.remove(results[0].id);
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
    async handler(item) {
      await browser.tabs.create({ active: true, url: item.url });
    }
  },
  'bing-search': {
    displayName: 'Bing search',
    match: /\s*(.*?)/,
    keys: [ 'b', 'bing' ],
    item: {
      favicon: 'https://www.bing.com/favicon.ico',
      title: 'Search Bing for $1',
      url: 'https://www.bing.com/search?q=$1',
    },
    async handler(item) {
      await browser.tabs.create({ active: true, url: item.url });
    }
  },

  'duckduckgo-search': {
    displayName: 'DuckDuckGo search',
    match: /\s*(.*?)/,
    keys: [ 'd', 'duckduckgo' ],
    async item(query) {
      const isInstantAllowed = await checkPermission({ origins: [ 'https://api.duckduckgo.com/*' ] });
      const results = [
        {
          favicon: 'https://duckduckgo.com/favicon.ico',
          title: 'Results from DuckDuckGo for $1',
          url: 'https://duckduckgo.com?q=$1',
        },
      ];
      const category = 'Instant answer';

      if (!isInstantAllowed) {
        results.push({
          title: 'Enable DuckDuckGo Instant Answer',
          category,
          requestPermission: { origins: [ 'https://api.duckduckgo.com/*' ] },
        });
      } else if (query.length > 3) {
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
      return results;
    },
    async handler(item) {
      await browser.tabs.create({ active: true, url: item.url });
    }
  },
  'open-url': {
    match: /^(https?:\/\/)?([\w]+\.)+[A-Za-z]{2,24}(\/[\w\/&.=?-]*)?$/,
    async item(query) {
      const url = /^https?:\/\//.exec(query) ? query : `https://${query}`;
      return {
        favicon: getFaviconUrl(url),
        title: `Open ${query} in new tab`,
        url,
      }
    },
    async handler(item) {
      await browser.tabs.create({ active: true, url: item.url });
    }
  },

  'new-shortcut': {
    displayName: '.new Shorcut',
    keys: ['n', 'new', '.new', 's', 'shortcut'],
    item: [
      {
        title: 'Google Docs - Create a new doccument.',
        url: 'https://www.docs.new',
        favicon: 'https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_document_x16.png'
      },
      {
        title: 'Google Sheets - Create a new spreadsheet.',
        url: 'https://www.sheets.new',
        favicon: 'https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_spreadsheet_x16.png'
      },
      {
        title: 'Google Slides - Create a new presentation.',
        url: 'https://www.slides.new',
        favicon: 'https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_presentation_x16.png'
      },
      {
        title: 'Google Forms - Create a new form.',
        url: 'https://www.form.new',
        favicon: 'https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_2_form_x16.png'
      },
      {
        title: 'CodePen',
        url: 'https://www.pen.new',
        favicon: 'https://cpwebassets.codepen.io/assets/favicon/favicon-aec34940fbc1a6e787974dcd360f2c6b63348d4b1f4e06c77743096d55480f33.ico'
      }
    ],
    async handler(item) {
      await browser.tabs.create({active: true, url: item.url});
    }
  },

  'history': {
    async item(query) {
      const isHistoryAllowed = await checkPermission(['history']);

      if (!isHistoryAllowed) {
        return {
          title: 'Enable History searching',
          category: 'History',
          requestPermission: ['history'],
        };
      }

      const histories = await browser.history.search({ text: query, maxResults: 40 });

      return histories.map(({ title, url }) => ({
        title,
        url,
        favicon: getFaviconUrl(url),
        category: 'History',
      }));
    },
    async handler(item) {
      await browser.tabs.create({ active: true, url: item.url });
    }
  },
  'bookmarks': {
    async item(query) {
      const isBookmarkAllowed = await checkPermission(['bookmarks']);

      if (!isBookmarkAllowed) {
        return {
          title: 'Enable Bookmarks searching',
          category: 'Bookmarks',
          requestPermission: ['bookmarks'],
        };
      }

      if (!query) return [];

      const bookmarkTreeNodes = await browser.bookmarks.search(query);

      return bookmarkTreeNodes
        .filter(({ url }) => !!url) // We avoid adding the bookmarkTreeNode to the list if it is a folder
        .map(({ title, url }) => ({
          title,
          url,
          favicon: getFaviconUrl(url),
          category: 'Bookmarks'
        }));
    },
    async handler(item) {
      await browser.tabs.create({ active: true, url: item.url });
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
    async handler({ theme }) {
      await browser.storage.local.set({ theme });

      return { theme, autoClose: false };
    }
  },
};
