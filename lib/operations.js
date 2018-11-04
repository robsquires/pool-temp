'use strict'
const { ingestSteps, refreshSteps, execute } = require('./steps')
const { read, write } = require('./db')

async function ingestTweet (tweet) {
	const processedTweet = execute(ingestSteps, tweet)
	await write(processedTweet)
	return processedTweet
}

async function refreshTweet () {
	const tweet = await read()
	const processedTweet = execute(refreshSteps, tweet)
	await write(processedTweet)
	return processedTweet
}

module.exports = {
	ingestTweet,
	refreshTweet
}