
function parse(tweetSelector, textSelector) {
	return [...document.querySelectorAll(tweetSelector)].map(el => {
		const textEl = el.querySelector(textSelector)
		const text = textEl ? textEl.innerText : '';
		
		const timeEl = el.querySelector('time')
		const time = timeEl ? timeEl.getAttribute('datetime') : null;
		return {
			text,
			date: new Date(time)
		}
	}).filter(({text}) => text.match(/temperature/))
}

const tweets = []
function pushTweets(newTweets) {
	console.log(newTweets)
	const filteredTweets = newTweets.filter(function filterNew({date}) {
		console.log(date, tweets)
		return !tweets.find(function isDuplicate(tweet) {
			console.log('tweet', tweet, date)
			return date.getTime() === tweet.date.getTime()
		})
	})
	tweets.push(...filteredTweets)
	return tweets
}
     


pushTweets(parse(
	'.css-1dbjc4n.r-1iusvr4.r-16y2uox.r-1777fci.r-1mi0q7o',
	'.css-1dbjc4n .css-901oao.r-hkyrab.r-1qd0xha.r-a023e6.r-16dba41.r-ad9z0x.r-bcqeeo.r-bnwqim.r-qvutc0 .css-901oao.css-16my406.r-1qd0xha.r-ad9z0x.r-bcqeeo.r-qvutc0'
))

