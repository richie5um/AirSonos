"use strict";

var assert = require('assert');
var stream = require('stream');
var Response = require('..').Response;

describe('Response', function() {
  var socket = null;

  beforeEach(function() {
    socket = new stream.PassThrough();
  });

	it('should write a response', function(done) {
		var expected = 'HTTP/1.1 200 OK\r\n\r\n';

		socket.on('data', function(d) {
			assert.equal(d.toString(), expected);
			done();
		});

		var response = new Response(socket);

		response.send();
	});

	it('should write a response with headers', function(done) {
		var expected = 'HTTP/1.1 200 OK\r\ntest:hello\r\n\r\n';

		socket.on('data', function(d) {
			assert.equal(d.toString(), expected);
			done();
		});

		var response = new Response(socket);
		response.set('test', 'hello');

		response.send();
	});

	it('should write a response with a body', function(done) {
		var expected = 'HTTP/1.1 200 OK\r\ntest:hello\r\nContent-Length:5\r\n\r\nhello';

		socket.on('data', function(d) {
			assert.equal(d.toString(), expected);
			done();
		});

		var response = new Response(socket);
		response.set('test', 'hello');

		response.send('hello');
	});

	it('should write a response with a JSON body', function(done) {
		var expected = 'HTTP/1.1 200 OK\r\ntest:hello\r\nContent-Length:18\r\n\r\n{"body":"content"}';

		socket.on('data', function(d) {
			d = d.toString();

			var body = JSON.parse(d.split('\r\n\r\n')[1]);
			assert.equal(body['body'], 'content');
			assert.equal(d, expected);
			done();
		});

		var response = new Response(socket);
		response.set('test', 'hello');

		response.send({ 'body': 'content' });
	});

  it('should write a resposne with a status code in send()', function(done) {
    var expected = 'HTTP/1.1 401 Unauthorized\r\ntest:hello\r\nContent-Length:18\r\n\r\n{"body":"content"}';

    socket.on('data', function(d) {
      d = d.toString();

      var body = JSON.parse(d.split('\r\n\r\n')[1]);
      assert.equal(body['body'], 'content');
      assert.equal(d, expected);
      done();
    });

    var response = new Response(socket);
    response.set('test', 'hello');

    response.send(401, { 'body': 'content' });
  });

  describe('Options', function() {

    it('should write a response with a custom protocol', function(done) {
      var expected = 'RTSP/1.0 200 OK\r\n\r\n';

      socket.on('data', function(d) {
        assert.equal(d.toString(), expected);
        done();
      });

      var response = new Response(socket, { protocol: 'RTSP/1.0' });

      response.send();
    });

    it('should accept custom status messages', function(done) {
      var expected = 'HTTP/1.1 453 Not Enough Bandwidth\r\n\r\n';

      socket.on('data', function(d) {
        d = d.toString();

        assert.equal(d, expected);
        done();
      });

      var response = new Response(socket, {
        statusMessages: {
          453: 'Not Enough Bandwidth'
        }
      });
      response.send(453);
    });

    it('should overwrite default status messages', function(done) {
      var expected = 'HTTP/1.1 200 we good\r\n\r\n';

      socket.on('data', function(d) {
        d = d.toString();

        assert.equal(d, expected);
        done();
      });

      var response = new Response(socket, {
        statusMessages: {
          200: 'we good'
        }
      });
      response.send(200);
    });

  });
});
