const fs = require('fs')
require('dotenv').config()

// twitter accounts
const SERPS = 87698451
const BROCKWELL = 1343989614;

const account = BROCKWELL;

const tweets = []
async function doFetch(token) {
    console.log('Loading page...')

    const res = await fetch(`https://api.twitter.com/2/users/${account}/tweets?` + new URLSearchParams({
        exclude: 'retweets,replies',
        max_results: '100',
        'tweet.fields': 'created_at',
        ...(token ? { pagination_token: token } : {}), 
    }), {
        headers: {
            Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
        }
    })
    if (!res.ok) {
        throw new Error(`Status: ${res.status}`)
    }

    const body = await res.json();
    console.log(`Loaded: ${body.meta.result_count} tweets | last tweet: ${body.data[body.data.length - 1].created_at} | next token: ${body.meta.next_token}\n`)
    const data = body.data.map(({ created_at, text }) => ({ created_at, text }))
    tweets.push(...data);
    if (!body.meta.next_token) {
        console.log('complete...last meta:')
        console.log(body.meta)
        return;
    }
    
    return doFetch(body.meta.next_token)
}

doFetch().then(() => {
    const fileName = `./tweets-${account}.json`
    console.log(`Writing ${tweets.length} tweets to ${fileName}`);
    fs.writeFileSync(fileName, JSON.stringify(tweets, undefined, "    "));
})