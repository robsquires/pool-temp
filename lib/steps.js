

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
	const { temperature, dayOfWeek, ingested_at } = tweet
	const diffBetweenDays = (new Date()).getDay() - ingested_at.getDay()
	switch (diffBetweenDays) {
		case 0:
			return `Today it\'s ${temperature} degrees`
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
	return { ...tweet, dayOfWeek: getDayOfWeek(tweet.ingested_at) }
}

function appendAnswer (tweet) {
	return { ...tweet, answer:  generateAnswer(tweet) }
}

module.exports = [
	appendTemperature,
	appendDayOfWeek,
	appendAnswer
]

module.exports.appendTemperature = appendTemperature;
module.exports.appendDayOfWeek = appendDayOfWeek;
module.exports.appendAnswer = appendAnswer;