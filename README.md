tempmail.js
===========

Programatically generate and receive mail from temporary email addresses.

[tempmail.js]("https://github.com/mileszim/tempmail.js") provides a JavaScript wrapper around ```api.temp-mail.ru```.


### Docs ###

#### Install ####

** Browser: **

```<script type="text/javascript" src="/dist/tempmail.min.js"></script>```

** Node.js: **

```npm install tempmail.js```


#### Usage ####

** Generate a new email address **

```javascript
// if using node.js
var tempmail = require('tempmail.js');


// creates a random address
var account = new tempmail();


// > a0953d5f9e1c01573d290823b1bbe8d1@lackmail.net
console.log(account.address);
```


** Get message inbox: **

```javascript
account.getMail(function(messages) {
  console.log(messages);
});
```