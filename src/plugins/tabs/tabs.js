import Tabs from './Tabs.svelte';

export default {
  ui: Tabs,
  async item() {
    const tabs = (await Promise.all([
      // Query audible tabs first
      browser.tabs.query({ audible: true, currentWindow: true, active: false}),
      // Then other tabs
      browser.tabs.query({ audible: false, currentWindow: true, active: false })
    ])).flat();


    return tabs
          .sort((a, b) => (b.lastAccessed - a.lastAccessed))
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
