import 'babel-polyfill';

import md5 from 'blueimp-md5';
import 'isomorphic-fetch';
import 'fetch-jsonp';

import { IS_NODE } from './constants';
import { formatMessage, randomEmail, inboxURL, domainsURL, deleteMessageURL } from './utils';


export default class TempMail {
  /**
   * @constructor
   * @param {string} address - A temp-mail.ru email address. Generated if not provided.
   */
  constructor(address) {
    this.address    = address || randomEmail();
    this.address_id = md5(this.address);
    this.fetch      = IS_NODE ? fetch : fetchJsonp;
  }

  /**
   * Get Mail
   */
  async getMail() {
    try {
      let response = await this.fetch(inboxURL(this.address_id));
      let messages = response.json();
      if (messages[0]) { return messages.map(formatMessage); }
      return messages;
    } catch(error) {
      console.error(error);
    }
    return [];
  }

  /**
   * Address Domains
   */
  async domains() {
    try {
      let domains = await this.fetch(domainsURL());
      return domains.json();
    } catch(error) {
      console.error(error);
    }
    return [];
  }

  /**
   * Delete Message
   */
  async deleteMessage(message_id) {
    try {
      let deletedMessage = await this.fetch(deleteMessageURL(message_id));
      return deletedMessage.json();
    } catch(error) {
      console.error(error);
    }
    return [];
  }
}
