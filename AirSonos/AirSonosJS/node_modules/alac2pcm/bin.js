#!/usr/bin/env node
'use strict'

var argv = require('minimist')(process.argv.slice(2))
var pkg = require('../package')
var Alac2Pcm = require('../')

if (argv.help) {
  console.log('Usage:')
  console.log('  %s [options]\n', pkg.name)
  console.log(
    'Options:\n' +
    '  --help             Output this help\n' +
    '  --version          Output the version\n' +
    '  --frameLength=n    (default: 342) Indicating the frames per packet when\n' +
    '                     no explicit frames per packet setting is present in\n' +
    '                     the packet header. The encoder frames per packet can\n' +
    '                     be explicitly set but for maximum compatibility, the\n' +
    '                     default encoder setting of 4096 should be used\n' +
    '  --bitDepth=n       (default: 16) Describes the bit depth of the source\n' +
    '                     PCM data (maximum value = 32)\n' +
    '  --channels=n       (default: 2) Describes the channel count (1 = mono,\n' +
    '                     2 = stereo, etc...). When channel layout info is not\n' +
    '                     provided in the \'magic cookie\', a channel count > 2\n' +
    '                     describes a set of discreet channels with no specific\n' +
    '                     ordering\n' +
    '  --maxFrameBytes=n  (default: 0) The maximum size of an Apple Lossless\n' +
    '                     packet within the encoded stream. Value of 0 indicates\n' +
    '                     unknown\n' +
    '  --avgBitRate=n     (default: 0) The average bit rate in bits per second\n' +
    '                     of the Apple Lossless stream. Value of 0 indicates\n' +
    '                     unknown\n' +
    '  --sampleRate=n     (default: 44100) Sample rate of the encoded stream'
  )
  process.exit(1)
}

if (argv.version) {
  console.log('v%s', pkg.version)
  process.exit(1)
}

process.stdin.pipe(new Alac2Pcm(argv)).pipe(process.stdout)
