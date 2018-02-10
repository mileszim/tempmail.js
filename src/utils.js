import chance from 'chance';
import {
  API_BASE,
  API_FORMAT,
  ENDPOINT_INBOX,
  ENDPOINT_DOMAINS,
  ENDPOINT_DELETE
} from './constants';


/**
 * Format Mail
 * @param {object} message
 */
export function formatMessage(msg) {
  return {
    id: msg.mail_id,
    uid: msg.mail_unique_id,
    from: msg.mail_from,
    subject: msg.mail_subject,
    preview: msg.mail_preview,
    text: msg.mail_preview.replace(/\s/g, ' ').trim(),
    text_only: msg.mail_text_only,
    html: msg.mail_html,
    timestamp: new Date(parseInt(msg.mail_timestamp + '000'))
  };
}


/**
 * Generate random tempmail address prefix
 * @returns {string} addressPrefix
 */
export function randomEmailPrefix() {
  const name = chance.name({ middle_initial: true }).toLowerCase().split(' ').join('.');
  const year = chance.integer({ min: 1970, max: ((new Date()).getFullYear() - 8) });
  return `${name}-${year}`;
}


/**
 * Gives same ID for email address
 * @returns {string} ID
 */
export function emailId(emailAddress) {
  let code = emailAddress.split("").map(c => c.codePointAt(0)).join("");
  return parseInt(code).toString(16).substr(2,12);
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
