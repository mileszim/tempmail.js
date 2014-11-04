/** Dependencies */
var request = require('browser-request');
var md5     = require('blueimp-md5');


/** @const */
var API_BASE         = 'http://api.temp-mail.ru/request/';
var API_FORMAT       = '/format/json';
var ENDPOINT_INBOX   = 'mail/id';
var ENDPOINT_DOMAINS = 'domains';




/**
 * TempMail
 * Manage a TempMail api address
 *
 * @constructor
 * @param {string} address - A temp-mail.ru email address. Generated if not provided.
 */
var TempMail = function(address) {
	
};


TempMail.prototype = {
	
	
	
};


/**
 * Generate random tempmail address
 *
 * @returns {string} address
 */
TempMail.randomEmail = function() {
	
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