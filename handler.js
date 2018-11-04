'use strict';

const {
	appendTemperature,
	appendDayOfWeek,
	appendAnswer
} = require('./lib/steps');

const steps = [
	appendTemperature,
	appendDayOfWeek,
	appendAnswer
]

module.exports.processTweet = (event, context, callback) => {
	const body = JSON.parse(event.body);
	const data = steps.reduce((acc, fn) => fn(acc), {...body.tweet, date: new Date() })
	console.log(data)
	callback(null, {
		statusCode: 200,
		headers: {
			'content-type': 'application/json',
			'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate'
		},
		body: JSON.stringify(data)
	});
}
