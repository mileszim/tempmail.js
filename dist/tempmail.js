/*! tempmail.js 2016-03-10 */

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.tempmail = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/** Dependencies */
var request = require('jsonp-client');
var md5     = require('blueimp-md5').md5;


/** @const */
var API_BASE         = 'http://api.temp-mail.ru/request/';
var API_FORMAT       = '/format/jsonp?callback=messages';
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
		request(endpoint, function(error, res) {
			if (error) {
				cb([]);
				return [];
			} else {
				cb(res.map(TempMail._formatMessage));
			}
		});
	},
	
	
	/**
	 * Address Domains
	 */
	domains: function(cb) {
		var endpoint = [API_BASE, ENDPOINT_DOMAINS, API_FORMAT].join('');
		request(endpoint, function(error, res) {
			if (error || res.body.error) {
				cb([]);
				return [];
			} else {
				cb(res);
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
},{"blueimp-md5":2,"jsonp-client":6}],2:[function(require,module,exports){
/*
 * JavaScript MD5 1.0.1
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 * 
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/*jslint bitwise: true */
/*global unescape, define */

(function ($) {
    'use strict';

    /*
    * Add integers, wrapping at 2^32. This uses 16-bit operations internally
    * to work around bugs in some JS interpreters.
    */
    function safe_add(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF),
            msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }

    /*
    * Bitwise rotate a 32-bit number to the left.
    */
    function bit_rol(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    }

    /*
    * These functions implement the four basic operations the algorithm uses.
    */
    function md5_cmn(q, a, b, x, s, t) {
        return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
    }
    function md5_ff(a, b, c, d, x, s, t) {
        return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }
    function md5_gg(a, b, c, d, x, s, t) {
        return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }
    function md5_hh(a, b, c, d, x, s, t) {
        return md5_cmn(b ^ c ^ d, a, b, x, s, t);
    }
    function md5_ii(a, b, c, d, x, s, t) {
        return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
    }

    /*
    * Calculate the MD5 of an array of little-endian words, and a bit length.
    */
    function binl_md5(x, len) {
        /* append padding */
        x[len >> 5] |= 0x80 << (len % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;

        var i, olda, oldb, oldc, oldd,
            a =  1732584193,
            b = -271733879,
            c = -1732584194,
            d =  271733878;

        for (i = 0; i < x.length; i += 16) {
            olda = a;
            oldb = b;
            oldc = c;
            oldd = d;

            a = md5_ff(a, b, c, d, x[i],       7, -680876936);
            d = md5_ff(d, a, b, c, x[i +  1], 12, -389564586);
            c = md5_ff(c, d, a, b, x[i +  2], 17,  606105819);
            b = md5_ff(b, c, d, a, x[i +  3], 22, -1044525330);
            a = md5_ff(a, b, c, d, x[i +  4],  7, -176418897);
            d = md5_ff(d, a, b, c, x[i +  5], 12,  1200080426);
            c = md5_ff(c, d, a, b, x[i +  6], 17, -1473231341);
            b = md5_ff(b, c, d, a, x[i +  7], 22, -45705983);
            a = md5_ff(a, b, c, d, x[i +  8],  7,  1770035416);
            d = md5_ff(d, a, b, c, x[i +  9], 12, -1958414417);
            c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
            b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = md5_ff(a, b, c, d, x[i + 12],  7,  1804603682);
            d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = md5_ff(b, c, d, a, x[i + 15], 22,  1236535329);

            a = md5_gg(a, b, c, d, x[i +  1],  5, -165796510);
            d = md5_gg(d, a, b, c, x[i +  6],  9, -1069501632);
            c = md5_gg(c, d, a, b, x[i + 11], 14,  643717713);
            b = md5_gg(b, c, d, a, x[i],      20, -373897302);
            a = md5_gg(a, b, c, d, x[i +  5],  5, -701558691);
            d = md5_gg(d, a, b, c, x[i + 10],  9,  38016083);
            c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = md5_gg(b, c, d, a, x[i +  4], 20, -405537848);
            a = md5_gg(a, b, c, d, x[i +  9],  5,  568446438);
            d = md5_gg(d, a, b, c, x[i + 14],  9, -1019803690);
            c = md5_gg(c, d, a, b, x[i +  3], 14, -187363961);
            b = md5_gg(b, c, d, a, x[i +  8], 20,  1163531501);
            a = md5_gg(a, b, c, d, x[i + 13],  5, -1444681467);
            d = md5_gg(d, a, b, c, x[i +  2],  9, -51403784);
            c = md5_gg(c, d, a, b, x[i +  7], 14,  1735328473);
            b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

            a = md5_hh(a, b, c, d, x[i +  5],  4, -378558);
            d = md5_hh(d, a, b, c, x[i +  8], 11, -2022574463);
            c = md5_hh(c, d, a, b, x[i + 11], 16,  1839030562);
            b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = md5_hh(a, b, c, d, x[i +  1],  4, -1530992060);
            d = md5_hh(d, a, b, c, x[i +  4], 11,  1272893353);
            c = md5_hh(c, d, a, b, x[i +  7], 16, -155497632);
            b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = md5_hh(a, b, c, d, x[i + 13],  4,  681279174);
            d = md5_hh(d, a, b, c, x[i],      11, -358537222);
            c = md5_hh(c, d, a, b, x[i +  3], 16, -722521979);
            b = md5_hh(b, c, d, a, x[i +  6], 23,  76029189);
            a = md5_hh(a, b, c, d, x[i +  9],  4, -640364487);
            d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = md5_hh(c, d, a, b, x[i + 15], 16,  530742520);
            b = md5_hh(b, c, d, a, x[i +  2], 23, -995338651);

            a = md5_ii(a, b, c, d, x[i],       6, -198630844);
            d = md5_ii(d, a, b, c, x[i +  7], 10,  1126891415);
            c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = md5_ii(b, c, d, a, x[i +  5], 21, -57434055);
            a = md5_ii(a, b, c, d, x[i + 12],  6,  1700485571);
            d = md5_ii(d, a, b, c, x[i +  3], 10, -1894986606);
            c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = md5_ii(b, c, d, a, x[i +  1], 21, -2054922799);
            a = md5_ii(a, b, c, d, x[i +  8],  6,  1873313359);
            d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = md5_ii(c, d, a, b, x[i +  6], 15, -1560198380);
            b = md5_ii(b, c, d, a, x[i + 13], 21,  1309151649);
            a = md5_ii(a, b, c, d, x[i +  4],  6, -145523070);
            d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = md5_ii(c, d, a, b, x[i +  2], 15,  718787259);
            b = md5_ii(b, c, d, a, x[i +  9], 21, -343485551);

            a = safe_add(a, olda);
            b = safe_add(b, oldb);
            c = safe_add(c, oldc);
            d = safe_add(d, oldd);
        }
        return [a, b, c, d];
    }

    /*
    * Convert an array of little-endian words to a string
    */
    function binl2rstr(input) {
        var i,
            output = '';
        for (i = 0; i < input.length * 32; i += 8) {
            output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
        }
        return output;
    }

    /*
    * Convert a raw string to an array of little-endian words
    * Characters >255 have their high-byte silently ignored.
    */
    function rstr2binl(input) {
        var i,
            output = [];
        output[(input.length >> 2) - 1] = undefined;
        for (i = 0; i < output.length; i += 1) {
            output[i] = 0;
        }
        for (i = 0; i < input.length * 8; i += 8) {
            output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
        }
        return output;
    }

    /*
    * Calculate the MD5 of a raw string
    */
    function rstr_md5(s) {
        return binl2rstr(binl_md5(rstr2binl(s), s.length * 8));
    }

    /*
    * Calculate the HMAC-MD5, of a key and some data (raw strings)
    */
    function rstr_hmac_md5(key, data) {
        var i,
            bkey = rstr2binl(key),
            ipad = [],
            opad = [],
            hash;
        ipad[15] = opad[15] = undefined;
        if (bkey.length > 16) {
            bkey = binl_md5(bkey, key.length * 8);
        }
        for (i = 0; i < 16; i += 1) {
            ipad[i] = bkey[i] ^ 0x36363636;
            opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }
        hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
        return binl2rstr(binl_md5(opad.concat(hash), 512 + 128));
    }

    /*
    * Convert a raw string to a hex string
    */
    function rstr2hex(input) {
        var hex_tab = '0123456789abcdef',
            output = '',
            x,
            i;
        for (i = 0; i < input.length; i += 1) {
            x = input.charCodeAt(i);
            output += hex_tab.charAt((x >>> 4) & 0x0F) +
                hex_tab.charAt(x & 0x0F);
        }
        return output;
    }

    /*
    * Encode a string as utf-8
    */
    function str2rstr_utf8(input) {
        return unescape(encodeURIComponent(input));
    }

    /*
    * Take string arguments and return either raw or hex encoded strings
    */
    function raw_md5(s) {
        return rstr_md5(str2rstr_utf8(s));
    }
    function hex_md5(s) {
        return rstr2hex(raw_md5(s));
    }
    function raw_hmac_md5(k, d) {
        return rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d));
    }
    function hex_hmac_md5(k, d) {
        return rstr2hex(raw_hmac_md5(k, d));
    }

    function md5(string, key, raw) {
        if (!key) {
            if (!raw) {
                return hex_md5(string);
            }
            return raw_md5(string);
        }
        if (!raw) {
            return hex_hmac_md5(key, string);
        }
        return raw_hmac_md5(key, string);
    }

    if (typeof define === 'function' && define.amd) {
        define(function () {
            return md5;
        });
    } else {
        $.md5 = md5;
    }
}(this));

},{}],3:[function(require,module,exports){

},{}],4:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"dup":3}],5:[function(require,module,exports){

var indexOf = [].indexOf;

module.exports = function(arr, obj){
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
},{}],6:[function(require,module,exports){
// jsonp-client
// -----------------
// Copyright(c) 2013 Bermi Ferrer <bermi@bermilabs.com>
// MIT Licensed

(function (root) {
  'use strict';

  var
    // Save the previous value of the `jsonpClient` variable.
    previousJsonpClient = root.jsonpClient,
    is_browser = typeof window !== 'undefined',
    getJsonpBrowser,
    getJsonp,
    CALLBACK_REGEXP = /[\?|&]callback=([a-z0-9_]+)/i,

    // Create a safe reference to the jsonpClient object for use below.
    jsonpClient = function () {
      var args = Array.prototype.slice.apply(arguments),
        callback,
        urls = args.slice(0, -1),
        i = 0,
        error,
        results = [],
        addUrl, returnResult;

      // Don't allows sync calls
      try {
        callback = args.slice(-1)[0];
        if (typeof callback !== 'function') {
          throw new Error('Callback not found');
        }
      } catch (e) {
        throw new Error("jsonpClient expects a callback");
      }


      // URL's provided as an array on the first parameter
      if (typeof urls[0] !== 'string') {
        urls = urls[0];
      }

      // Returns the results in the right order
      returnResult = function () {
        var i = 0;
        results = results.sort(function (a, b) {
          return a.position > b.position;
        });
        for (i = 0; results.length > i; i = i + 1) {
          results[i] = results[i].data;
        }
        results.unshift(null);
        callback.apply(null, results);
      };

      // Adds a URL to the queue
      addUrl = function (url, position) {
        getJsonp(urls[i], function (err, data) {
          if (error) {
            return;
          }
          error = err;
          if (err) {
            return callback(err);
          }
          results.push({
            data: data,
            position: position
          });
          if (results.length === urls.length) {
            returnResult();
          }
        });
      };

      // Pushes files to fetch
      for (i = 0; urls.length > i; i = i + 1) {
        addUrl(urls[i] + '', i);
      }
    };

  // Run jsonpClient in *noConflict* mode, returning the `jsonpClient`
  // variable to its previous owner. Returns a reference to
  // the jsonpClient object.
  jsonpClient.noConflict = function () {
    root.jsonpClient = previousJsonpClient;
    return jsonpClient;
  };

  // Browser only logic for including jsonp on the page
  getJsonpBrowser = function () {
    var getCallbackFromUrl,
      loadScript,
      head = document.getElementsByTagName('head')[0];

    loadScript = function (url, callback) {
      var script = document.createElement('script'),
        done = false;
      script.src = url;
      script.async = true;
      script.onload = script.onreadystatechange = function () {
        if (!done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
          done = true;
          script.onload = script.onreadystatechange = null;
          if (script && script.parentNode) {
            script.parentNode.removeChild(script);
          }
          callback();
        }
      };
      head.appendChild(script);
    };

    getCallbackFromUrl = function (url, callback) {
      var matches = url.match(CALLBACK_REGEXP);
      if (!matches) {
        return callback(new Error('Could not find callback on URL'));
      }
      callback(null, matches[1]);
    };

    return function (url, callback) {
      getCallbackFromUrl(url, function (err, callbackName) {
        var data,
          originalCallback = window[callbackName];
        if (err) {
          return callback(err);
        }
        window[callbackName] = function (jsonp_data) {
          data = jsonp_data;
        };
        loadScript(url, function (err) {
          if (!err && !data) {
            err = new Error("Calling to " + callbackName + " did not returned a JSON response." +
                            "Make sure the callback " + callbackName + " exists and is properly formatted.");
          }

          if (originalCallback) {
            window[callbackName] = originalCallback;
          } else {
            // Repeated calls to the same jsonp callback should be avoided
            // Unique callback names should be used.
            // Also, the try, catch here is to support issues in IE8/IE7 where you can not use delete on window.
            try {
              delete window[callbackName];
            }
            catch (ex) {
              window[callbackName] = undefined;
            }
          }

          callback(err, data);
        });
      });
    };
  };

  getJsonp = is_browser ? getJsonpBrowser() : require('./jsonp-node.js');

  // Export the jsonpClient object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `jsonpClient` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof module !== "undefined" && module.exports) {
    module.exports = jsonpClient;
  } else {
    // Set jsonpClient on the browser window
    root.jsonpClient = jsonpClient;
  }

  // Establish the root object, `window` in the browser, or `global` on the server.
}(this));
},{"./jsonp-node.js":7}],7:[function(require,module,exports){
"use strict";

var request = require('request'),
  vm = require('vm'),
  fs = require('fs'),
  parensRegex = /(^\(|\);?\s*$)/,
  functionRegex = /^[a-z\d_]*\(/i,
  functionNameRegex = /([\w\d_]*)\(/,
  evalJsonp,
  parseJsonp,
  evalOrParseJavascript,
  fetchRemoteJsonp,
  fetchUrl,
  fetchLocalJsonp;


// Lazy JSONp extraction by JSON.parsing the callback argument
parseJsonp = function (javascript, callback) {
  var err = null,
    jsonString, json;
  try {
    // chomp off anything that looks like a function name, remove parenthesis
    jsonString = javascript.replace(functionRegex, "").replace(parensRegex, "");
    json = JSON.parse(jsonString);
  } catch (error) {
    err = error;
  }
  callback(err, json);
};

// Creates a JavaScript VM in order to evaluate
// javascript from jsonp calls. This is expensive
// so make sure you cache the results
evalJsonp = function (javascript, cb) {
  var context, jsonp_callback_name, code;
  javascript = (javascript || '') + '';

  context = vm.createContext({
    error: null,
    cbData: null
  });

  jsonp_callback_name = (javascript.match(functionNameRegex) || [null, false])[1];

  code = "function " + jsonp_callback_name + " (data) { cbData = data } " +
         ' try { ' + javascript + ' } catch(e) { error = e;} ';

  try {
    if (!jsonp_callback_name) {
      throw new Error('Could not discover jsonp callback name on "' + javascript + '"');
    }

    vm.runInContext(code, context);
  } catch (e) {
    cb(new Error(e));
  }

  if (context.error) { return cb(new Error(context.error)); }
  cb(null, context.cbData);
};

// Given a javascript buffer this method will attempt
// to parse it as a string or it will attempt to run it
// on a vm
evalOrParseJavascript = function (javascript, callback) {
  javascript = javascript.toString();
  parseJsonp(javascript, function (err, json) {
    if (err) {
      return evalJsonp(javascript, function (err, json) {
        callback(err, json);
      });
    }
    callback(err, json);
  });
};

// Fetches a URL and returns a buffer with the response
fetchUrl = function (url_to_fetch, callback) {
  request(url_to_fetch, function (err, res, body) {
    if (err || !res || res.statusCode >= 400) {
      err = new Error('Could not fetch url ' + url_to_fetch + ', with status ' + (res && res.statusCode) + '. Got error: ' + (err && err.message) + '.');
    }
    callback(err, body);
  });
};

// Fetches a jsonp response from a remote service
// Make sure you cache the responses as this process
// creates a JavaScript VM to safely evaluate the javascript
fetchRemoteJsonp = function (remote_url, callback) {
  fetchUrl(remote_url, function (err, body) {
    if (err) {
      return callback(err);
    }

    evalOrParseJavascript(body, callback);
  });
};

// Retrieves a local file and evaluates the JSON script on a JS VM
fetchLocalJsonp = function (file_path, callback) {
  file_path = file_path.split('?')[0];
  fs.readFile(file_path, function (err, jsonp) {
    if (err) { return callback(err); }
    evalOrParseJavascript(jsonp, callback);
  });
};

module.exports = function (jsonp_path_or_url, callback) {
  if (jsonp_path_or_url.match(/^http/)) {
    fetchRemoteJsonp(jsonp_path_or_url, callback);
  } else {
    fetchLocalJsonp(jsonp_path_or_url, callback);
  }
};

},{"fs":4,"request":3,"vm":8}],8:[function(require,module,exports){
var indexOf = require('indexof');

var Object_keys = function (obj) {
    if (Object.keys) return Object.keys(obj)
    else {
        var res = [];
        for (var key in obj) res.push(key)
        return res;
    }
};

var forEach = function (xs, fn) {
    if (xs.forEach) return xs.forEach(fn)
    else for (var i = 0; i < xs.length; i++) {
        fn(xs[i], i, xs);
    }
};

var defineProp = (function() {
    try {
        Object.defineProperty({}, '_', {});
        return function(obj, name, value) {
            Object.defineProperty(obj, name, {
                writable: true,
                enumerable: false,
                configurable: true,
                value: value
            })
        };
    } catch(e) {
        return function(obj, name, value) {
            obj[name] = value;
        };
    }
}());

var globals = ['Array', 'Boolean', 'Date', 'Error', 'EvalError', 'Function',
'Infinity', 'JSON', 'Math', 'NaN', 'Number', 'Object', 'RangeError',
'ReferenceError', 'RegExp', 'String', 'SyntaxError', 'TypeError', 'URIError',
'decodeURI', 'decodeURIComponent', 'encodeURI', 'encodeURIComponent', 'escape',
'eval', 'isFinite', 'isNaN', 'parseFloat', 'parseInt', 'undefined', 'unescape'];

function Context() {}
Context.prototype = {};

var Script = exports.Script = function NodeScript (code) {
    if (!(this instanceof Script)) return new Script(code);
    this.code = code;
};

Script.prototype.runInContext = function (context) {
    if (!(context instanceof Context)) {
        throw new TypeError("needs a 'context' argument.");
    }
    
    var iframe = document.createElement('iframe');
    if (!iframe.style) iframe.style = {};
    iframe.style.display = 'none';
    
    document.body.appendChild(iframe);
    
    var win = iframe.contentWindow;
    var wEval = win.eval, wExecScript = win.execScript;

    if (!wEval && wExecScript) {
        // win.eval() magically appears when this is called in IE:
        wExecScript.call(win, 'null');
        wEval = win.eval;
    }
    
    forEach(Object_keys(context), function (key) {
        win[key] = context[key];
    });
    forEach(globals, function (key) {
        if (context[key]) {
            win[key] = context[key];
        }
    });
    
    var winKeys = Object_keys(win);

    var res = wEval.call(win, this.code);
    
    forEach(Object_keys(win), function (key) {
        // Avoid copying circular objects like `top` and `window` by only
        // updating existing context properties or new properties in the `win`
        // that was only introduced after the eval.
        if (key in context || indexOf(winKeys, key) === -1) {
            context[key] = win[key];
        }
    });

    forEach(globals, function (key) {
        if (!(key in context)) {
            defineProp(context, key, win[key]);
        }
    });
    
    document.body.removeChild(iframe);
    
    return res;
};

Script.prototype.runInThisContext = function () {
    return eval(this.code); // maybe...
};

Script.prototype.runInNewContext = function (context) {
    var ctx = Script.createContext(context);
    var res = this.runInContext(ctx);

    forEach(Object_keys(ctx), function (key) {
        context[key] = ctx[key];
    });

    return res;
};

forEach(Object_keys(Script.prototype), function (name) {
    exports[name] = Script[name] = function (code) {
        var s = Script(code);
        return s[name].apply(s, [].slice.call(arguments, 1));
    };
});

exports.createScript = function (code) {
    return exports.Script(code);
};

exports.createContext = Script.createContext = function (context) {
    var copy = new Context();
    if(typeof context === 'object') {
        forEach(Object_keys(context), function (key) {
            copy[key] = context[key];
        });
    }
    return copy;
};

},{"indexof":5}]},{},[1])(1)
});