import getFaviconUrl from '../background/utils/getFaviconUrl';
import checkPermission from '../background/utils/checkPermission';
import tabs from './tabs';
import webSearch from './web-search';

export default {
  'tabs': tabs,
  'tab-actions': {
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
  'web-search': webSearch,
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
    displayName: '.new Shortcut',
    keys: ['n', 'new', '.new', 's', 'shortcut'],
    item: [
      {
        title: 'Google Docs - Create a new document',
        url: 'https://www.docs.new',
        favicon: 'https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_document_x16.png'
      },
      {
        title: 'Google Sheets - Create a new spreadsheet',
        url: 'https://www.sheets.new',
        favicon: 'https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_spreadsheet_x16.png'
      },
      {
        title: 'Google Slides - Create a new presentation',
        url: 'https://www.slides.new',
        favicon: 'https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_presentation_x16.png'
      },
      {
        title: 'Google Forms - Create a new form',
        url: 'https://www.form.new',
        favicon: 'https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_2_form_x16.png'
      },
      {
        title: 'CodePen - Create a new pen',
        url: 'https://www.pen.new',
        favicon: 'https://codepen.io/favicon.ico'
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
      },
      {
        title: 'Lamentis',
        url: '',
        emoji: '☄️',
        theme: 'lamentis'
      }
    ],
    async handler({ theme }) {
      await browser.storage.local.set({ theme });

      return { theme, autoClose: false };
    }
  },
};
