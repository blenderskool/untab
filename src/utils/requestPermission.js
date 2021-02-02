/**
 * Requests for a permission
 * @param {Array|Object} permissions Permission Object or Array of permissions
 * @returns {Promise} Promise that resolves to boolean value indicating whether the permission was granted
 */
export default function(permissions) {
  if (Array.isArray(permissions)) {
    return browser.permissions.request({ permissions });
  } else {
    return browser.permissions.request(permissions);
  }
}
