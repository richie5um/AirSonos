'use strict';

var util = require('util');
var stream = require('stream');

var Writable = stream.Writable;

var LINE_TERMINATOR = '\r\n';
var HEADER_TERMINATOR = [0x0D, 0x0A, 0x0D, 0x0A];

function Parser (socket, options) {

  Writable.call(this);
  this.options = options || {};

  this._buffer = new Buffer(0);
  this._collectingContent = -1;
  this._headerData = null;
  this._output = null;

  var me = this;
  this.on('pipe', function (src) {
    me._socket = src;
  });

  if (socket) {
    socket.pipe(this);
  }

}

util.inherits(Parser, Writable);

Parser.prototype.parseHeader = function (header) {

  var lines = header.split(LINE_TERMINATOR);
  var firstLine = lines.shift();

  var message = this._constructMessage(firstLine);
  var headers = lines.reduce(function (headers, line) {

    var idx = line.indexOf(':');
    var key = line.substring(0, idx).trim();
    var val = line.substring(idx + 1).trim();

    if (idx === -1) {
      throw new Error('Invalid header (' + line + ')');
    }

    headers[key.toLowerCase()] = val;

    return headers;
  }, {});

  message.headers = headers;

  var hasContent = headers.hasOwnProperty('content-length');
  var contentLength = (hasContent ? Number(headers['content-length']) : 0);

  return {
    message: message,
    contentLength: contentLength
  };
};

Parser.prototype._write = function (chunk, encoding, cb) {

  this._buffer = Buffer.concat([this._buffer, chunk]);

  while (true) {

    if (this._collectingContent === -1) {

      var idxTerminator = bufferIndexOf(this._buffer, HEADER_TERMINATOR);
      if (idxTerminator === -1) {
        return cb(null);
      }

      var info;

      try {
        info = this.parseHeader(this._buffer.slice(0, idxTerminator).toString());
      } catch (err) {
        return cb(err);
      }

      this._headerData = info;
      this._buffer = this._buffer.slice(idxTerminator + HEADER_TERMINATOR.length);

      if (this._headerData.contentLength === 0) {
        this._emitMessage(this._headerData.message);
      } else {
        this._collectingContent = this._headerData.contentLength;
      }

    } else {

      if (this._buffer.length < this._collectingContent) {
        return cb(null);
      }

      this._headerData.message.content = this._buffer.slice(0, this._collectingContent);
      this._emitMessage(this._headerData.message);

      this._buffer = this._buffer.slice(this._collectingContent);
      this._collectingContent = -1;

    }

  }

};

function bufferIndexOf(haystack, needle) {
  var nLen = needle.length;
  var max = haystack.length - nLen;
  outer: for (var i = 0; i <= max; i++) {
    for (var j = 0; j < nLen; j++) {
      if (haystack[i+j] !== needle[j]) {
        continue outer;
      }
    }
    return i;
  }
  return -1;
}

module.exports = Parser;
