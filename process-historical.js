const { getTemperature } = require('./lib/steps')
const rawData = require('./data/historical-tweets.json')
const fs = require('fs')

const processedData = rawData
	.map(({ text, date }) => ({ date, temperature: getTemperature(text)}))
	.filter(({ temperature }) => !!temperature)


	fs.writeFileSync('./brockwell-lido-historical.json', JSON.stringify(processedData, undefined, "\t"));