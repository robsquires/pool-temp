const { ingestSteps, refreshSteps } = require('./steps')
const { read, write } = require('./db')


function execute (steps, tweet) {
	return steps.reduce((acc, fn) => fn(acc), tweet)
}

async function ingestTweet (tweet) {
	const processedTweet = execute(ingestSteps, tweet)
	await write(processedTweet)
	return processedTweet
}

async function refreshCurrentTweet () {
	const tweet = await read()
	const processedTweet = execute(refreshSteps, tweet)
	await write(processedTweet)
	return processedTweet
}

module.exports = {
	ingestTweet,
	refreshCurrentTweet
}