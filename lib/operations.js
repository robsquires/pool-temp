'use strict'
const { ingestSteps, refreshSteps, execute } = require('./steps')
const createClient = require('./db')

const tweetClient = createClient('brockwell-lido.json')
const historialClient = createClient('brockwell-lido-historical.json')


async function ingestTweet (tweet) {
	const processedTweet = execute(ingestSteps, tweet)
	await tweetClient.write(processedTweet)

	
	const historicalTweets = await historialClient.read();
	const { date, temperature } = processedTweet
	await historialClient.write(historicalTweets.concat({ date, temperature }))

	return processedTweet
}

async function refreshTweet () {
	const tweet = await tweetClient.read(tweetLocation)
	const processedTweet = execute(refreshSteps, tweet)
	await tweetClient.write(processedTweet, tweetLocation)
	return processedTweet
}

module.exports = {
	ingestTweet,
	refreshTweet
}