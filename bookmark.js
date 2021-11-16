function onFulfilled(bookmarkItems) {
    if (bookmarkItems.length) {
      console.log("active tab is bookmarked");
    } else {
      console.log("active tab is not bookmarked");
    }
  }
  
  function onRejected(error) {
    console.log(`An error: ${error}`);
  }
  
  function checkActiveTab(tab) {
    var searching = browser.bookmarks.search({url: tab.url});
    searching.then(onFulfilled, onRejected);
  }
  
  browser.browserAction.onClicked.addListener(checkActiveTab);
  