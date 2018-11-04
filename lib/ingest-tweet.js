const steps = require('./steps')
const { write } = require('./db')

async function ingestTweet (tweet) {
	const processedTweet = steps.reduce(
		(acc, fn) => fn(acc),
		{...tweet, ingested_at: new Date() }
	)
	
	await write(processedTweet)

	return processedTweet
}

module.exports = ingestTweet