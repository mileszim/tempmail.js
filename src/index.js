import 'isomorphic-fetch';
import 'fetch-jsonp';

import { IS_NODE } from './constants';
import {
  formatMessage,
  emailId,
  randomEmailPrefix,
  inboxURL,
  domainsURL,
  deleteMessageURL
} from './utils';


export default class TempMail {
  /**
   * @constructor
   * @param {string} address - A temp-mail.ru email address or a prefix. Generated if not provided.
   */
  constructor(address) {
    this.active = false;
    this._useOrCreateEmail(address)
      .then(emailAddress => {
        if (!emailAddress) { throw new Error("Address unable to be created"); }
        this.address = emailAddress;
        this.address_id = emailId(this.address);
        this.fetch = IS_NODE ? fetch : fetchJsonp;
        this.active = true;
      });
  }


  /**
   * Get Mail
   */
  async getMail() {
    try {
      let response = await this.fetch(inboxURL(this.address_id));
      let messages = await response.json();
      if (messages.length) { return messages.map(formatMessage); }
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
      return await domains.json();
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
      return await deletedMessage.json();
    } catch(error) {
      console.error(error);
    }
    return [];
  }

  // Private

  /**
   * Generate a random email from domains and prefix
   */
  async _useOrCreateEmail(addressPrefix) {
    if (addressPrefix.includes("@")) { return addressPrefix; }
    try {
      const domains = await this.domains();
      return `${addressPrefix}@${chance.pickone(domains)}`;
    } catch(error) {
      console.error(error);
    }
    return false;
  }
}
