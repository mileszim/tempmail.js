tempmail.js
===========

Programatically generate and receive mail from temporary email addresses. Works in browsers and in node.js.

[tempmail.js]("https://github.com/mileszim/tempmail.js") provides a JavaScript wrapper around ```api.temp-mail.ru```.


## Docs ##

### Install ###

**Browser:**

```<script type="text/javascript" src="/dist/tempmail.min.js"></script>```

**Node.js:**

```npm install tempmail.js```


### Usage ###

**Generate a new email address**

```javascript
// if using node.js
var TempMail = require('tempmail.js');

// ES6
import TempMail from 'tempmail.js';


// create a random address
var account = new TempMail();

console.log(account.address); // a0953d5f9e1c01573d290823b1bbe8d1@walkmail.ru


// Create your own address at one of the tempmail domains
var account = new TempMail('example@walkmail.ru');

console.log(account.address); // example@walkmail.ru
```


#### Messages/Inbox ####

**Get messages**

```javascript
account.getMail().then((messages) => {
  console.log(messages);
});
```

**Message response format**

```javascript
[ { id: 'c3e7ed132aefe624a8539307a45ec7c9',
    uid: '68450627',
    from: 'Bob Smith <bob@smith.com>',
    subject: 'hey bro whats up',
    preview: 'sup dude\n\n',
    text: 'sup dude',
    text_only: 'sup dude',
    html: '',
    timestamp: Mon Nov 03 2014 17:50:15 GMT-0800 (PST) },
  { id: '030199e2ede68f8aefe0d858c9071271',
    uid: '68452459',
    from: 'Super Cool Dude <hessuper@cool.com>',
    subject: 'cool subject line',
    preview: 'yeah man\n\n\n',
    text: '',
    text_only: 'yeah man\n\n\n\n',
    html: '<html><head><meta http-equiv="Content-Type" content="text/html charset=us-ascii"></head><body style="word-wrap: break-word; -webkit-nbsp-mode: space; -webkit-line-break: after-white-space;">yeah man<br><div apple-content-edited="true">\n<div style="color: rgb(0, 0, 0); font-family: Helvetica; font-size: 12px; font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: auto; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: auto; word-spacing: 0px; -webkit-text-stroke-width: 0px; word-wrap: break-word; -webkit-nbsp-mode: space; -webkit-line-break: after-white-space;"><div></div></div><br></div>\n<br></body></html>\n',
    timestamp: Mon Nov 03 2014 17:51:42 GMT-0800 (PST)
}]
```

**Delete Message**

```javascript
account.deleteMessage(someEmail.id).then((deletedMessage) {
  console.log(deletedMessage);
});
```


#### Domains ####

**Get domains**

```javascript
account.domains().then((domains) {
  console.log(domains);
});
```

**Domain response format**

```javascript
[
  '@dlemail.ru',
  '@flemail.ru',
  '@shotmail.ru',
  '@walkmail.ru'
]
```
