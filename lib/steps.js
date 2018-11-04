'use strict'

function getTemperature (text) {
	const m = /temperature is ([\d.]+)/i.exec(text);
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

function getDayOfWeek (date) {
	return DAY_LABELS[date.getDay()]
}

function generateAnswer (tweet) {
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

function appendTemperature (tweet) {
	return { ...tweet, temperature: getTemperature(tweet.text) }
}

function appendDayOfWeek (tweet) {
	return { ...tweet, dayOfWeek: getDayOfWeek(tweet.date) }
}

function appendAnswer (tweet) {
	return { ...tweet, answer:  generateAnswer(tweet) }
}

function appendIngestedDate (tweet) {
	let { date } = tweet
	if (!date) {
		date = new Date()
	} else if (!(date instanceof Date)) {
		date = new Date(date)
	}
	return { ...tweet, date }
}

module.exports.ingestSteps = [
	appendIngestedDate,
	appendTemperature,
	appendDayOfWeek,
	appendAnswer
]

module.exports.refreshSteps = [
	appendIngestedDate,
	appendAnswer
]

module.exports.execute = function execute (steps, tweet) {
	return steps.reduce((acc, fn) => fn(acc), tweet)
}