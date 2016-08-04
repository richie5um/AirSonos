'use strict';

var util = require('util');
var Parser = require('./parser');
var Message = require('./message');

var RE_HEADER = /^([^ ]+) ([0-9]+) (.*)$/;

function ClientParser (socket, options) {
  Parser.call(this, socket, options);
}

util.inherits(ClientParser, Parser);

ClientParser.prototype._constructMessage = function (firstLine) {

  var res = new Message();
  var m = RE_HEADER.exec(firstLine);

  if (m === null) {
    throw new Error('Unable to parse first line');
  }

  res.protocol = m[1];
  res.statusCode = Number(m[2]);
  res.statusMessage = m[3];

  return res;
};

ClientParser.prototype._emitMessage = function (msg) {
  this.emit('message', msg);
};

module.exports = ClientParser;
