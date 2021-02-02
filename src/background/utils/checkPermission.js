/**
 * Checks if extension has a permission granted
 * @param {Array|Object} permissions Permission Object or Array of permissions
 * @returns {Promise} Promise that resolves to boolean value indicating whether permission is granted
 */
export default function(permissions) {
  if (Array.isArray(permissions)) {
    return browser.permissions.contains({ permissions });
  } else {
    return browser.permissions.contains(permissions);
  }
}
