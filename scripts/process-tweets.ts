import { parseTweet } from "../src/lib/parse-tweet";
import fs from 'fs'
import { Tweet } from "../src/lib/operations";

const dataString = fs.readFileSync('./data/brockwell.json');

const tweets: Tweet[] = JSON.parse(dataString.toString());

const readings = tweets.map((tweet: Tweet) => ({ tweet, reading: parseTweet(tweet) }))

const output = {
    ok: readings.filter(({ reading }) => !!reading),
    nok: readings.filter(({ reading }) => !reading)
}

fs.writeFileSync('./data/brockwell-processed-ok.json', JSON.stringify(output.ok, undefined, "    "));
fs.writeFileSync('./data/brockwell-processed-nok.json', JSON.stringify(output.nok, undefined, "    "));