# alac2pcm

A Node.js streaming libary and command line tool that converts [Apple
Lossless](https://en.wikipedia.org/wiki/Apple_Lossless) (ALAC) audio to
raw [PCM audio](https://en.wikipedia.org/wiki/Pulse-code_modulation).

[![Build status](https://travis-ci.org/watson/alac2pcm.svg?branch=master)](https://travis-ci.org/watson/alac2pcm)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

## CLI usage

Install as a global module:

```
npm install -g alac2pcm
```

Pipe binary ALAC bytes into STDIN and, alac2pcm will output raw PCM
audio bytes on STDOUT:

```
cat audio.alac | alac2pcm > audio.pcm
```

For a list of available configuration options, write:

```
alac2pcm --help
```

## Programmatic usage

Install as a local module:

```
npm install --save alac2pcm
```

Then you can just use it as a regular node stream:

```js
var Alac2Pcm = require('alac2pcm')

var options = {
  bitDepth: 8
}
var alac2pcm = new Alac2Pcm(options)

sourceAlacStream.pipe(alac2pcm).pipe(pcmPlayer)
```

### Configuration

When instantiating the `Alac2Pcm` object an optional options object can
be provided:

- `frameLength` - (default: 352) Indicating the frames per packet when
  no explicit frames per packet setting is present in the packet header.
  The encoder frames per packet can be explicitly set but for maximum
  compatibility, the default encoder setting of 4096 should be used
- `bitDepth` - (default: 16) Describes the bit depth of the source PCM
  data (maximum value = 32)
- `channels` - (default: 2) Describes the channel count (1 = mono, 2 =
  stereo, etc...). When channel layout info is not provided in the
  'magic cookie', a channel count > 2 describes a set of discreet
  channels with no specific ordering
- `maxFrameBytes` - (default: 0) The maximum size of an Apple Lossless
  packet within the encoded stream. Value of 0 indicates unknown
- `avgBitRate` - (default: 0) The average bit rate in bits per second of
  the Apple Lossless stream. Value of 0 indicates unknown
- `sampleRate` - (default: 44100) Sample rate of the encoded stream

Aditional, but currently unused options:

- `compatibleVersion` - (default: 0) Indicating compatible version.
  Value must be set to 0
- `pb` - (default: 40) Currently unused tuning parameter. Value should
  be set to 40
- `mb` - (default: 10) Currently unused tuning parameter. Value should
  be set to 10
- `kb` - (default: 14) Currently unused tuning parameter. Value should
  be set to 14
- `maxRun` - (default: 255) Currently unused. Value should be set to 255

## Todo's

- Support for Node.js 0.12 and 4

## License

MIT
