'use strict';

const ingestTweet = require('./lib/ingest-tweet');

module.exports.processTweet = (event, context, callback) => {
	const body = JSON.parse(event.body);
	const data = ingestTweet(body.tweet);
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
