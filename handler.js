'use strict';

const ingestTweet = require('./lib/ingest-tweet');

function writeResponse (statusCode, data) {
	return {
		statusCode,
		headers: {
			'content-type': 'application/json',
			'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate'
		},
		body: JSON.stringify(data)
	}
}

module.exports.ingestTweet = (event, context, callback) => {
	const body = JSON.parse(event.body)
	ingestTweet(body.tweet).then(data => {
		callback(null, writeResponse(200, data));
	})
	.catch(err => {
		console.error(err);
		callback(null, writeResponse(500, err));
	})
}
