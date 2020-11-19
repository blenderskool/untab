/**
 * Generates a favicon url from the site url
 * @param {String} url Url for which favicon is needed
 * @param {Boolean} isAbsolute Force absolute url of favicon
 * @returns {String} URL to the favicon
 */
export default function(url, isAbsolute = false) {
  // On Chrome, cached favicons can be accessed using chrome://favicon
  if (process.env.BROWSER_ENV === 'chrome' && !isAbsolute) {
    return `chrome://favicon/${url}`;
  };

  const { origin } = new URL(url);
  return `${origin}/favicon.ico`;
}
