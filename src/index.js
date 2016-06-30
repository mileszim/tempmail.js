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
   * Polling for an email
   */
    pollingMail(mail_from = "", searchTerm = "", interval = 5000, iterations = 10) {
      return new Promise( (resolve, reject) => {
        let counter = 0;
        setInterval( async () => {
          try {
            if(counter < iterations) {
              let queryResult = await this.queryMessages(mail_from, searchTerm);
              if (queryResult.length) resolve(queryResult);
              counter++;
            } else {
              resolve({'error': 'Timeout exceeded, no messages found.'});
            }
          } catch(error) {
            reject(error);
          }
        }, 500);
      });
    }

   /**
    * Querying mails based on parameters
    */
    async queryMessages(mail_from = "", searchTerm = "") {
      try {
        let messages = await this.getMail();
        if(messages.length && (mail_from !== "" || searchTerm !== "")) {
          let messagesFound = [];
          messages.forEach( (message) => {
            if(message.mail_from.indexOf(mail_from) != -1 || message.mail_text.indexOf(searchTerm) != -1) {
              messagesFound.push(message);
            }
          });
          return messagesFound;
        }
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
