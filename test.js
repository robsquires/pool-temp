const {getTemperature} = require('./src/lib/steps')

const ok = [];
const errors = []
function isEqual(actual, expected) {
	if (actual === expected) {
		ok.push(actual);
	} else {
		errors.push(`Expected ${expected}, got ${actual}`);
	}
}

const today = {
	text: 'Saturday\'s pool temperature is 10.0 we are open from 7:30am till 11:00am last entry to the pool will be 15 minutes… https://t.co/REvpoyzbjJ',
	id: 1058622634416586800,
	created_at: 'Sat Nov 03 07:31:18 +0000 2018'
}

const yday = { text: 'Friday\'s pool temperature is 10.1 we are open at 7:15am till 10:45am. Last entry to the pool will be 15 minutes b… https://t.co/rglylvZiu0',
	id: 1057887853559078900,
	created_at: 'Fri Nov 02 06:51:33 +0000 2018'
}

const thurs = { text: 'Thursday\'s pool temperature is 10.3 we are open at 7:15am till 10:45am. Last entry to the pool will be 15 minutes b… https://t.co/rglylvZiu0',
	id: 1057887853559078900,
	created_at: 'Thu Nov 01 06:51:33 +0000 2018'
}

const mon = { text: 'Monday\'s pool Temperature is 11.1 we are open at 7:15am till 10:45am. Last entry to the pool will be 15 minutes b… https://t.co/rglylvZiu0',
	id: 1057887853559078900,
	created_at: 'Mon Oct 29 06:51:33 +0000 2018'
}

const shortDate = {
	text: "Brockwell lido temperature this Saturday morning (01/02) is 6.3 degrees centigrade",
	id: 1057887853559078901,
	created_at: "2014-02-01T07:49:03.000Z"
}

const DAY_LABELS = [
	'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
]

function getDay(date, todayDate) {
	const dayNumber = date.getDay()
	const todayDayNum = todayDate.getDay();
	const diffBetweenDays = todayDayNum - dayNumber;

	switch (diffBetweenDays) {
		case 0:
			return 'Today'
		case 1:
			return 'Yesterday'
		default:
			return DAY_LABELS[dayNumber - 1]
	}
}
const TODAY_DATE = new Date('Sat Nov 03 10:31:18 +0000 2018')

function generateAnswer(data) {
	const temp = getTemperature(data.text);
	if (!temp) {
		throw new Error('Couldn\'t parse temp');
	}

	const day = getDay(new Date(data.created_at), TODAY_DATE);
	switch (day) {
		case 'Today':
			return `Today it\'s ${temp} degrees`
		case 'Yesterday':
			return `Yesterday it was ${temp} degrees`
		default:
			return `On ${day} it was ${temp} degrees`
	}
}

function appendTemperature (data) {
	return {...data, temperature: getTemperature(data.text) }
}


isEqual(appendTemperature(today).temperature, 10)
isEqual(appendTemperature(yday).temperature, 10.1)
isEqual(appendTemperature(thurs).temperature, 10.3)
isEqual(appendTemperature(mon).temperature, 11.1)
isEqual(appendTemperature(shortDate).temperature, 6.3)
console.log(appendTemperature(shortDate))
isEqual(generateAnswer(today),'Today it\'s 10 degrees')
isEqual(generateAnswer(yday), 'Yesterday it was 10.1 degrees')
isEqual(generateAnswer(thurs), 'On Thursday it was 10.3 degrees')
isEqual(generateAnswer(mon), 'On Monday it was 11.1 degrees')

ok.map(str => console.log(`OK: ${str}`));
errors.map(str => console.error(`NOK: ${str}`));
