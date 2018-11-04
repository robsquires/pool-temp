

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
	const { temperature, dayOfWeek, ingestedAt } = tweet
	const diffBetweenDays = (new Date()).getDay() - ingestedAt.getDay()
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
	return { ...tweet, dayOfWeek: getDayOfWeek(tweet.ingestedAt) }
}

function appendAnswer (tweet) {
	return { ...tweet, answer:  generateAnswer(tweet) }
}

function appendIngestedDate (tweet) {
	let { ingestedAt } = tweet
	if (!ingestedAt) {
		ingestedAt = new Date()
	} else if (!(ingestedAt instanceof Date)) {
		ingestedAt = new Date(ingestedAt)
	}
	return { ...tweet, ingestedAt }
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