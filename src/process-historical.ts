import { getTemperature, Tweet } from './lib/steps'
import fs from 'fs'
const rawData = require('../data/brockwell-lido-historical-2020.json')

const processedData = rawData
	.map(({ text, date }: Tweet) => ({ date, temperature: getTemperature(text)}))
	.filter(({ temperature }: Tweet) => !!temperature)

console.log("Number tweets read:", rawData.length, "Number successfully parsed:", processedData.length);

fs.writeFileSync('./brockwell-lido-historical.json', JSON.stringify(processedData, undefined));