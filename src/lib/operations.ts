import { createClient, createListClient } from './db'
import { generateAnswer } from './generate-answer'
import { parseTweet } from './parse-tweet'
import { z } from 'zod'

export const TwitterUserName = z.enum(['Brockwell_Lido', 'SerpsSwimClub'])

export const TweetSchema = z.object({
	text: z.string(),
	created_at: z.string(),
	user_name: TwitterUserName
});

export type Tweet = z.infer<typeof TweetSchema>

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