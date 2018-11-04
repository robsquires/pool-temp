[...document.querySelectorAll('.tweet')].map(el => {
	const textEl = el.querySelector('.tweet-text')
	const text = textEl ? textEl.innerText : '';
	
	const timeEl = el.querySelector('._timestamp')
	const time = timeEl ? parseInt(timeEl.getAttribute('data-time-ms'), 10) : null;
	return {
		text,
		date: new Date(time)
	}
})


