const V_1 = /([\d\.]+) degrees/i
const V_2 = /temperature(?:[^\d]+)([\d.]+)/i

export function getTemperature (text: string) {
	const m = [V_1, V_2]
		.map(regex => regex.exec(text))
		.find(m => m !== null)
	return m ? parseFloat(m[1]) : null;
}

const DAY_LABELS = [
	'Sunday',
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday'
]

function getDayOfWeek (date: Date) {
	return DAY_LABELS[date.getDay()]
}

function generateAnswer (tweet: Tweet) {
	const { temperature, dayOfWeek, date } = tweet
	const diffBetweenDays = (new Date()).getDay() - date.getDay()
	switch (diffBetweenDays) {
		case 0:
			return `It's ${temperature} degrees`
		case 1:
		case -6:
			return `Yesterday it was ${temperature} degrees`
		default:
			return `On ${dayOfWeek} it was ${temperature} degrees`
	}
}

function appendTemperature (tweet: Tweet) {
	return { ...tweet, temperature: getTemperature(tweet.text) }
}

function appendDayOfWeek (tweet: Tweet) {
	return { ...tweet, dayOfWeek: getDayOfWeek(tweet.date) }
}

function appendAnswer (tweet: Tweet) {
	return { ...tweet, answer:  generateAnswer(tweet) }
}

function appendIngestedDate (tweet: Tweet) {
	let { date } = tweet
	if (!date) {
		date = new Date()
	} else if (!(date instanceof Date)) {
		date = new Date(date)
	}
	return { ...tweet, date }
}


export const ingestSteps = [
	appendIngestedDate,
	appendTemperature,
	appendDayOfWeek,
	appendAnswer
]

export const refreshSteps = [
	appendIngestedDate,
	appendAnswer
]

export type Tweet = {
	text: string
	date: Date
	temperature?: Number
	dayOfWeek?: String
}

export function execute (steps: Function[], tweet: Tweet) {
	return steps.reduce((acc, fn) => fn(acc), tweet)
}