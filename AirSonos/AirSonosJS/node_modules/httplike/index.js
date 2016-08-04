'use strict';

var ServerParser = require('./lib/server-parser');
var ClientParser = require('./lib/client-parser');
var Response = require('./lib/response');

module.exports = ServerParser;
module.exports.ServerParser = ServerParser;
module.exports.ClientParser = ClientParser;
module.exports.Response = Response;
