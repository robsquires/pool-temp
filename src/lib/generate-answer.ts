const DAY_LABELS = [
	'Sunday',
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday'
]

export function generateAnswer (temperature: number, date: Date): string {
	const dayOfWeek = DAY_LABELS[date.getDay()];
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