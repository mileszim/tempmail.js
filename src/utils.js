import 'babel-polyfill';

import md5 from 'blueimp-md5';
import 'isomorphic-fetch';
import 'fetch-jsonp';

import { ADDRESS_DOMAINS, API_BASE, API_FORMAT, ENDPOINT_INBOX, ENDPOINT_DOMAINS, ENDPOINT_DELETE, IS_NODE } from './constants';


/**
 * Format Mail
 * @param {object} message
 */
export function formatMessage(msg) {
  return {
    id:        msg.mail_id,
    uid:       msg.mail_unique_id,
    from:      msg.mail_from,
    subject:   msg.mail_subject,
    preview:   msg.mail_preview,
    text:      msg.mail_preview.replace(/\s/g, ' ').trim(),
    text_only: msg.mail_text_only,
    html:      msg.mail_html,
    timestamp: new Date(parseInt(msg.mail_timestamp + '000'))
  };
}

/**
 * Generate random tempmail address
 * @returns {string} address
 */
export async function randomEmail() {
    try {
      let rightFetch = IS_NODE ? fetch : fetchJsonp;
      let response = await rightFetch(domainsURL());
      let domains = JSON.parse(await response.text());
      let prefix = md5(Math.random() + Date() + Math.random());
      let suffix = domains[Math.floor(Math.random() * domains.length)];
      return prefix + suffix;
    } catch(error) {
      console.error(error);
    }
    return [];
}

/**
 * Assemble API url
 * @param   {string} endpoint
 * @returns {string}
 */
export function endpoint(endpoint) {
  return API_BASE + endpoint + API_FORMAT;
}


/**
 * Inbox Endpoint URL
 * @param  {string} address - MD5 hashed email address to fetch
 * @return {string} url
 */
export function inboxURL(address) {
  return endpoint(ENDPOINT_INBOX + '/' + address);
}


/**
 * Domains Endpoint URL
 * @return {string} url
 */
export function domainsURL() {
  return endpoint(ENDPOINT_DOMAINS);
}


/**
 * Delete Message Endpoint URL
 * @return {string} url
 */
export function deleteMessageURL(message_id) {
  return endpoint(ENDPOINT_DELETE + '/' + message_id);
}
