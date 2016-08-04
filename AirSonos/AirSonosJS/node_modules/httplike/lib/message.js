'use strict';

function Message () {}

Message.prototype.getHeader = function (key) {
  return this.headers[key.toLowerCase()];
};

module.exports = Message;
