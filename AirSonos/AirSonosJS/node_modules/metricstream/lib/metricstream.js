var util = require('util');
var stream = require('stream');
var Transform = stream.Transform;

function MetricStream(options) {

	Transform.call(this, options);
	this.byteCount = 0;
	this.messageCount = 0;
	setInterval(this._updateMetrics.bind(this), 1000);
}

util.inherits(MetricStream, Transform);

MetricStream.prototype._updateMetrics = function() {
	this.emit('stats', {
		bytesPerSecond : this.byteCount,
		messagesPerSecond : this.messageCount
	});

	this.byteCount = 0;
	this.messageCount = 0;
};

MetricStream.prototype._transform = function(chunk, encoding, callback) {
	this.push(chunk, encoding);
	
	//	amazing metrics
	this.messageCount++;
	this.byteCount += chunk.length;

	callback();
};

MetricStream.prototype._flush = function(callback) {
	clearInterval(this._updateMetrics);
	callback();
};

module.exports = MetricStream;