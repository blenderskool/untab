import checkPermission from '../background/utils/checkPermission';

const SEARCH_ENGINES =  {
  Google: {
    favicon: 'https://www.google.com/favicon.ico',
    url: 'https://www.google.com/search?q=',
  },
  Ecosia: {
    favicon: 'https://cdn-static.ecosia.org/assets/images/ico/favicon.ico',
    url: 'https://www.ecosia.org/search?q=',
  },
  DuckDuckGo: {
    favicon: 'https://duckduckgo.com/favicon.ico',
    url: 'https://duckduckgo.com?q=',
  },
  Brave: {
    favicon: 'https://icons.duckduckgo.com/ip3/search.brave.com.ico',
    url: 'https://search.brave.com/search?q=',
  },
  YouTube: {
    favicon: 'https://youtube.com/favicon.ico',
    url: 'https://www.youtube.com/results?search_query=',
  },
  Wikipedia: {
    favicon: 'https://wikipedia.org/favicon.ico',
    url: 'https://en.wikipedia.org/wiki/Special:Search/',
  },
  'Google Scholar': {
    favicon: 'https://scholar.google.com/favicon.ico',
    url: 'https://scholar.google.com/scholar?q=',
  },
  'Stack Overflow': {
    favicon: 'https://stackoverflow.com/favicon.ico',
    url: 'https://stackoverflow.com/search?q=',
  }
};

export default {
  displayName: '🔍 Web search',
  keys: ['search', 'web', 'google'],
  async item(query) {
    const results = Object.entries(SEARCH_ENGINES).map(([name, data]) => ({
      favicon: data.favicon,
      title: `Search ${name} for ${query}`,
      url: data.url + query,
      category: 'Web Search',
    }));

    // DuckDuckGo Instant Search results
    const isInstantAllowed = await checkPermission({ origins: [ 'https://api.duckduckgo.com/*' ] });
    const category = 'DuckDuckGo Instant Answer';

    if (!isInstantAllowed) {
      results.push({
        title: `Enable DuckDuckGo Instant Answer`,
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
};
