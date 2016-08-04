'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Promise = require('bluebird');
var sonos = require('sonos');
var DeviceTunnel = require('./tunnel');

var AirSonos = (function () {
  function AirSonos(options) {
    _classCallCheck(this, AirSonos);

    this.tunnels = {};
    this.options = options || {};
  }

  _createClass(AirSonos, [{
    key: 'start',
    value: function start() {
      var _this = this;

      return this.searchForDevices().then(function (devices) {

        var promises = devices.map(function (device) {
          return DeviceTunnel.createFor(device, _this.options).then(function (tunnel) {

            tunnel.on('error', function (err) {
              if (err.code === 415) {
                console.error('Warning!', err.message);
                console.error('AirSonos currently does not support codecs used by applications such as iTunes or AirFoil.');
                console.error('Progress on this issue: https://github.com/stephen/nodetunes/issues/1');
              } else {
                console.error('Unknown error:');
                console.error(err);
              }
            });

            tunnel.start();
            _this.tunnels[tunnel.device.groupId] = tunnel;

            return tunnel;
          });
        });

        return Promise.all(promises);
      });
    }
  }, {
    key: 'refresh',
    value: function refresh() {
      return this.searchForDevices().then(function (devices) {
        // remove old groups
        // add new groups
        // update existing groups with new configurations
      });
    }
  }, {
    key: 'stop',
    value: function stop() {
      return Promise.all(this.tunnels.map(tunnel.stop));
    }
  }, {
    key: 'searchForDevices',
    get: function get() {
      return Promise.promisify(sonos.LogicalDevice.search);
    }
  }]);

  return AirSonos;
})();

module.exports = AirSonos;