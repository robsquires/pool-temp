import { ingestSteps, refreshSteps, execute, Tweet }  from './steps'
import {createClient} from './db'

const tweetClient = createClient('brockwell-lido.json')
const historialClient = createClient('brockwell-lido-historical.json')

export async function ingestTweet (tweet: Tweet) {
	const processedTweet = execute(ingestSteps, tweet)
	await tweetClient.write(processedTweet)

	
	const historicalTweets = await historialClient.read();
	const { date, temperature } = processedTweet
	await historialClient.write([{ date, temperature }].concat(historicalTweets))

	return processedTweet
}

export async function refreshTweet () {
	const tweet = await tweetClient.read()
	const processedTweet = execute(refreshSteps, tweet)
	await tweetClient.write(processedTweet)
	return processedTweet
}