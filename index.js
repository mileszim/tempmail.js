/** Dependencies */
var request = require('superagent');
var md5     = require('blueimp-md5').md5;


/** @const */
var API_BASE         = 'http://api.temp-mail.ru/request/';
var API_FORMAT       = '/format/json';
var ENDPOINT_INBOX   = 'mail/id';
var ENDPOINT_DOMAINS = 'domains';
var ADDRESS_DOMAINS  = ['alivance.com', 'walkmail.net', 'lackmail.net', 'bigprofessor.so'];




/**
 * TempMail
 * Manage a TempMail api address
 *
 * @constructor
 * @param {string} address - A temp-mail.ru email address. Generated if not provided.
 */
var TempMail = function(address) {
	this.address    = address || TempMail.randomEmail();
	this.address_id = md5(this.address);
};


TempMail.prototype = {
	
	/**
	 * Get Mail
	 */
	getMail: function(cb) {
		var endpoint = [API_BASE, ENDPOINT_INBOX, '/', this.address_id, API_FORMAT].join('');
		request(endpoint).end(function(error, res) {
			if (error || res.body.error) {
				cb([]);
				return [];
			} else {
				cb(res.body.map(TempMail._formatMessage));
			}
		});
	},
	
	
	/**
	 * Address Domains
	 */
	domains: function(cb) {
		var endpoint = [API_BASE, ENDPOINT_DOMAINS, API_FORMAT].join('');
		request(endpoint).end(function(error, res) {
			if (error || res.body.error) {
				cb([]);
				return [];
			} else {
				cb(res.body);
			}
		});
	}
	
};


/**
 * Generate random tempmail address
 *
 * @returns {string} address
 */
TempMail.randomEmail = function() {
	var prefix = md5(Math.random() + Date() + Math.random());
	var suffix = ADDRESS_DOMAINS[Math.floor(Math.random() * ADDRESS_DOMAINS.length)];
	return prefix + '@' + suffix;
};


/**
 * Format Mail
 *
 * @param {object} message
 */
TempMail._formatMessage = function(msg) {
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
};




/**
 * Assemble API url
 *
 * @param   {string} endpoint
 * @returns {string}
 */
TempMail._endpoint = function(endpoint) {
	return API_BASE + endpoint + API_FORMAT;
};


/**
 * Inbox Endpoint URL
 *
 * @param  {string} address - MD5 hashed email address to fetch
 * @return {string} url
 */
TempMail._inboxURL = function(address) {
	return TempMail._endpoint(ENDPOINT_INBOX + '/' + address);
};


/**
 * Domains Endpoint URL
 *
 * @return {string} url
 */
TempMail._domainsURL = function() {
	return TempMail._endpoint(ENDPOINT_DOMAINS);
};




/** Export */
module.exports = TempMail;