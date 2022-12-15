import { Source, TemperatureReading, Tweet } from "./operations";

const V_1 = /([\d.]+) ?(?:degrees|°C)/i
const V_2 = /temp(?:erature)? (?:[^\d]+)?([\d.]+)/i

function brockwellTweet (text: string): number | null {
	const m = [V_1, V_2]
		.map(regex => regex.exec(text))
		.find(m => m !== null)
	return m ? parseFloat(m[1]) : null;
}

export function parseTweet(tweet: Tweet): TemperatureReading | null {
    const temperature = brockwellTweet(tweet.text)

    if (temperature === null) {
		return null
	}

	if (isNaN(temperature)) {
		console.log('Kinda recognised this tweet but couldn\'t parse temperature:', tweet)
		throw new Error('Unknown tweet format')
	}

	return {
		date: new Date(tweet.created_at),
		temperature,
		source: Source.Tweet
	};
}
