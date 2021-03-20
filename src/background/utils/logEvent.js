import { v4 as uuid } from 'uuid';

/**
 * Logs an event using Google Analytics Meaurement protocol
 * @param {String} category Event Category
 * @param {String} action Event Action
 * @param {String} label Event Label
 * @param {String} value Event Value
 */
export default function(category, action, label='', value='') {
  if (process.env.NODE_ENV === 'development') return;

  let url = `https://www.google-analytics.com/collect?v=1&tid=UA-82138003-5&ds=ext&aip&cid=${uuid()}&t=event&ec=${category}&ea=${action}`;
  if (label) {
    url += `&el=${label}`;
  }
  if (value) {
    url += `&ev=${value}`;
  }

  return navigator.sendBeacon(encodeURI(url));
}