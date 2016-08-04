"use strict";

var assert = require('assert');
var stream = require('stream');

var httplike = require('../');
var Parser = httplike.ServerParser;

describe('Parser', function() {

  var mockStream, parser;

  beforeEach(function () {
    mockStream = new stream.PassThrough();
    parser = new Parser(mockStream);
  });

  it('should parse a request without content', function (done) {
    parser.on('message', function(m) {
      assert.equal(m.method, 'GET');
      assert.equal(m.getHeader('Data'), 'Hello');
      assert.equal(m.getHeader('Data-2'), 'More Hello');
      done();
    });
    mockStream.write('GET /test HTTP/1.1\r\nData:Hello\r\nData-2:More Hello\r\n\r\n');
  });

  it('should parse a request with content', function (done) {

    var content = 'dat content';

    parser.on('message', function(m) {
      assert.equal(m.content, content);
      done();
    });

    mockStream.write('GET /test HTTP/1.1\r\nData:Hello\r\nContent-Length:' + content.length + '\r\n\r\n' + content);
  });

  it('should parse multiple http requests without content', function (done) {

    var expected = [ 'Hello', 'Goodbye' ];

    parser.on('message', function(m) {
      assert.equal(m.method, 'GET');
      assert.equal(expected.shift(), m.getHeader('Data'));

      (expected.length === 0) && done();
    });

    var data0 = 'GET / HTTP/1.1\r\nData:' + expected[0] + '\r\n\r\n';
    var data1 = 'GET / HTTP/1.1\r\nData:' + expected[1] + '\r\n\r\n';

    mockStream.write(data0);
    mockStream.write(data1);
  });

  it('should parse multiple pipelined http requests', function (done) {

    var expected = [ 'Hello', 'Goodbye' ];

    parser.on('message', function(m) {
      assert.equal(m.method, 'GET');
      assert.equal(expected.shift(), m.getHeader('Data'));

      (expected.length === 0) && done();
    });

    var data0 = 'GET / HTTP/1.1\r\nData:' + expected[0] + '\r\n\r\n';
    var data1 = 'GET / HTTP/1.1\r\nData:' + expected[1] + '\r\n\r\n';

    mockStream.write(data0 + data1);
  });

  it('should parse multiple http requests with content', function (done) {

    var expected = [ 'Hello', 'Goodbye' ];

    parser.on('message', function(m) {
      assert.equal(m.method, 'GET');
      assert.equal(expected.shift(), m.content);

      (expected.length === 0) && done();
    });

    var data0 = 'GET / HTTP/1.1\r\nContent-Length:' + expected[0].length + '\r\n\r\n' + expected[0];
    var data1 = 'GET / HTTP/1.1\r\nContent-Length:' + expected[1].length + '\r\n\r\n' + expected[1];

    mockStream.write(data0);
    mockStream.write(data1);
  });

  it('should parse headers', function (done) {

    parser.on('message', function(m) {
      assert.equal(m.method, 'GET');
      assert.equal(m.path, '/test/path');
      assert.equal(m.getHeader('Data'), 'Hello');
      assert.equal(m.getHeader('Data-2'), 'More Hello');
      done();
    });

    mockStream.write('GET /test/path HTTP/1.1\r\nData:Hello\r\nData-2:More Hello\r\n\r\n');
  });

  it('should should fail on malformed headers', function (done) {

    parser.once('error', function (err) {
      assert(err);
      done();
    });

    mockStream.write('GET /test/path HTTP/1.1\r\nData\r\nData-2:More Hello\r\n\r\n');
  });

  it('should handle multiple colons in header', function (done) {

    parser.on('message', function(m) {
      assert.equal(m.method, 'GET');
      assert.equal(m.path, '/test/path');
      assert.equal(m.getHeader('Data'), 'Hello:There');
      assert.equal(m.getHeader('Data-2'), 'More Hello');
      done();
    });

    mockStream.write('GET /test/path HTTP/1.1\r\nData:Hello:There\r\nData-2:More Hello\r\n\r\n');
  });

});
