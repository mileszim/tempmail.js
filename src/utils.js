import md5 from 'blueimp-md5';
import { ADDRESS_DOMAINS, API_BASE, API_FORMAT, ENDPOINT_INBOX, ENDPOINT_DOMAINS, ENDPOINT_DELETE } from './constants';


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
export function randomEmail() {
  var prefix = md5(Math.random() + Date() + Math.random());
  var suffix = ADDRESS_DOMAINS[Math.floor(Math.random() * ADDRESS_DOMAINS.length)];
  return prefix + '@' + suffix;
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
