var MetricStream = require('../lib/metricstream');

describe('metricstream', function () {

  it('should work as expected', function() {
  	var stream = new MetricStream();
  	stream.on('stats', function(d) {
  		console.log('stats', d);
  	});
  	stream.write('sup');
  	stream.write('hi');
  });

})
