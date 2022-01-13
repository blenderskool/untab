import Tabs from './Tabs.svelte';

const tabsMetadata = {};

if (process.env.BROWSER_ENV !== 'firefox') {
  browser.tabs.onActivated.addListener(({ tabId }) => {
    tabsMetadata[tabId] = {
      lastAccessed: +new Date(),
    };
  });

  browser.tabs.onRemoved.addListener(tabId => {
    delete tabsMetadata[tabId];
  });
}

export default {
  ui: Tabs,
  async item() {
    const tabs = await browser.tabs.query({ active: false });

    return (
            process.env.BROWSER_ENV === 'firefox' ?
              tabs
              .sort((a, b) => b.lastAccessed - a.lastAccessed)
            :
              tabs
              .sort((a, b) => ((tabsMetadata[b.id]?.lastAccessed ?? 0) - (tabsMetadata[a.id]?.lastAccessed ?? 0)))
          )
          .map(({ windowId, title, favIconUrl, url, id, audible, mutedInfo: { muted }, pinned }) => ({
            id,
            windowId,
            title: audible ? `${muted ? '🔇' : '🔊'} ${title}` : title,
            pinned,
            url,
            favicon: favIconUrl,
            category: 'Tabs',
          }));
  },
  async handler(item) {
    await browser.windows.update(item.windowId, { focused: true });
    await browser.tabs.update(item.id, { active: true });
  },
  methods: {
    async close(tabId) {
      await browser.tabs.remove(tabId);
    },
    async togglePin(tabId, state) {
      await browser.tabs.update(tabId, { pinned: state });
    },
  },
};
