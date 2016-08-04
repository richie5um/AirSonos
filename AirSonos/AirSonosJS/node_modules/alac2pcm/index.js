'use strict'

var util = require('util')
var stream = require('readable-stream')
var xtend = require('xtend')
var alac = require('libalac')

// These default values are usually used by iTunes. For detailed info about the
// ALAC cookie, see:
// https://alac.macosforge.org/trac/browser/trunk/ALACMagicCookieDescription.txt
var DEFAULT_OPTS = {
  frameLength: 352,
  compatibleVersion: 0,
  bitDepth: 16,
  pb: 40,
  mb: 10,
  kb: 14,
  channels: 2,
  maxRun: 255,
  maxFrameBytes: 0,
  avgBitRate: 0,
  sampleRate: 44100
}

var Decoder = module.exports = function (opts) {
  if (!(this instanceof Decoder)) return new Decoder(opts)

  stream.Transform.call(this)

  opts = xtend(DEFAULT_OPTS, opts)

  this._saturated = false

  this._alac = alac.decoder({
    cookie: cookie(opts),
    channels: opts.channels,
    bitDepth: opts.bitDepth,
    framesPerPacket: opts.frameLength
  })
}

util.inherits(Decoder, stream.Transform)

Decoder.prototype._transform = function (chunk, enc, cb) {
  this._alac.packets(chunk.length)
  this._alac.write(chunk)
  while ((chunk = this._alac.read()) !== null) {
    this.push(chunk)
  }
  cb()
}

function cookie (opts) {
  var cookie = new Buffer(24)
  cookie.writeUInt32BE(opts.frameLength, 0)
  cookie.writeUInt8(opts.compatibleVersion, 4)
  cookie.writeUInt8(opts.bitDepth, 5)
  cookie.writeUInt8(opts.pb, 6)
  cookie.writeUInt8(opts.mb, 7)
  cookie.writeUInt8(opts.kb, 8)
  cookie.writeUInt8(opts.channels, 9)
  cookie.writeUInt16BE(opts.maxRun, 10)
  cookie.writeUInt32BE(opts.maxFrameBytes, 12)
  cookie.writeUInt32BE(opts.avgBitRate, 16)
  cookie.writeUInt32BE(opts.sampleRate, 20)
  return cookie
}
