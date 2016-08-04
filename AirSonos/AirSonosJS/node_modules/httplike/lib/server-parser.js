'use strict';

var util = require('util');

var Parser = require('./parser');
var Message = require('./message');
var Response = require('./response');

function ServerParser (socket, options) {
  Parser.call(this, socket, options);
}

util.inherits(ServerParser, Parser);

ServerParser.prototype._constructMessage = function (firstLine) {

  var req = new Message();
  var parts = firstLine.trim().split(' ');

  req.method = parts[0].toUpperCase();
  req.path = parts[1];
  req.protocol = parts[2];

  return req;
};

ServerParser.prototype._emitMessage = function (msg) {
  this.emit('message', msg, new Response(this._socket, this.options));
};

module.exports = ServerParser;
