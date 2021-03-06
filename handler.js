'use strict'

const {
	ingestTweet,
	refreshTweet
} = require('./lib/operations')

function writeResponse (statusCode, data = {}) {
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
	console.log('Incoming event:', event)
	const body = JSON.parse(event.body)

	if (body.apiKey !== process.env.API_KEY) {
		return callback(null, writeResponse(403))
	}

	ingestTweet(body.tweet).then(data => {
		console.log('OK', data)
		callback(null, writeResponse(200, data))
	})
	.catch(err => {
		console.error(err)
		callback(null, writeResponse(500, err))
	})
}

module.exports.refreshTweet = (event, context, callback) => {
	refreshTweet().then(data => {
		console.log('OK', data)
		callback(null, data)
	})
	.catch(err => {
		console.error(err)
		callback(err)
	})
}
