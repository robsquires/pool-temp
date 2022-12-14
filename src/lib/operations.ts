import { createClient, createListClient } from './db'
import { generateAnswer } from './generate-answer'
import { parseTweet } from './parse-tweet'

export type Tweet = {
	text: string
	created_at: string
}

export enum Source {
	Tweet = 'TWEET',
	Manual = 'MANUAL'
}

export type TemperatureReading = {
	source: Source
	date: Date
	temperature: number
	answer?: string
}

export const latestReadingClient = createClient<TemperatureReading>('brockwell-lido.json')
export const temperatureReadingsClient = createListClient<TemperatureReading>('brockwell-lido/historical.json')

export async function ingestTweet (tweet: Tweet): Promise<TemperatureReading|null> {
	const reading = parseTweet(tweet);
	if (!reading) {
		return null
	}
	await temperatureReadingsClient.insert(reading)	
	return reading
}

export async function refreshLatestReading () {
	const [latestReading] = await temperatureReadingsClient.read()
	console.log('refresh latest reading:', latestReading)
	const updatedReading = {
		...latestReading,
		answer: generateAnswer(latestReading.temperature, new Date(latestReading.date) )
	}
	await latestReadingClient.write(updatedReading)
	return updatedReading
}