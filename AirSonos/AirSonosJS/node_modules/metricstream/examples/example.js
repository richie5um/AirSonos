var MetricStream = require('../lib/metricstream');

var stream = new MetricStream();
stream.write('sup');
stream.write('hi');
stream.on('stats', function(d) {
	console.log('bps:', d.bytesPerSecond, 'mpg:', d.messagesPerSecond);
});
process.stdin.pipe(stream);