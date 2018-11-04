

function getTemperature (text) {
	const m = /temperature is ([\d.]+)/i.exec(text);
	return m ? parseFloat(m[1]) : null;
}

const DAY_LABELS = [
	'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
]

function getDayOfWeek (date) {
	return DAY_LABELS[date.getDay()]
}

function generateAnswer (data) {
	const { temperature, dayOfWeek } = data
	const diffBetweenDays = (new Date()).getDay() - data.date.getDay()
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

function appendTemperature (data) {
	return { ...data, temperature: getTemperature(data.text) }
}

function appendDayOfWeek (data) {
	console.log(data, getDayOfWeek(data.date))
	return { ...data, dayOfWeek: getDayOfWeek(data.date) }
}

function appendAnswer (data) {
	return { ...data, answer:  generateAnswer(data) }
}


module.exports = {
	appendTemperature,
	appendDayOfWeek,
	appendAnswer
}