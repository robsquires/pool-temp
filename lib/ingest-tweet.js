const steps = require('./steps');

function ingestTweet (tweet) {
	const processedTweet = steps.reduce(
		(acc, fn) => fn(acc),
		{...tweet, ingested_at: new Date() }
	)
	return processedTweet
}

module.exports = ingestTweet;