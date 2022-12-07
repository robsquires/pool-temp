const { getTemperature } = require('./lib/steps')
const rawData = require('./data/brockwell-lido-historical-2020.json')
const fs = require('fs')

const processedData = rawData
	.map(({ text, date }) => ({ date, temperature: getTemperature(text)}))
	.filter(({ temperature }) => !!temperature)

console.log("Number tweets read:", rawData.length, "Number successfully parsed:", processedData.length);

fs.writeFileSync('./brockwell-lido-historical.json', JSON.stringify(processedData, undefined));