import * as operations from './lib/operations'
import { ScheduledHandler, APIGatewayProxyHandler } from 'aws-lambda';

function writeResponse (statusCode: number, data = {}) {
	return {
		statusCode,
		headers: {
			'content-type': 'application/json',
			'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate'
		},
		body: JSON.stringify(data)
	}
}

export const ingestTweet: APIGatewayProxyHandler = async (event) =>  {
	console.log('ingestTweet event:', event)
	let  body
	try {
		body = JSON.parse(event.body || '')
	} catch(err) {
		return writeResponse(400)
	}
	
	if (!body) {
		return writeResponse(400)
	}

	if (body.apiKey !== process.env.API_KEY) {
		return writeResponse(403)
	}

	const reading = await operations.ingestTweet(body.tweet);
	if (!reading) {
		console.log('Skipped tweet')
		return writeResponse(200, { result: 'SKIPPED'});
	}	
	const latestReading = await operations.refreshLatestReading();
	
	return writeResponse(200, { result: 'COMPLETED', reading: latestReading });
}

export const refreshLatestReading: ScheduledHandler =  async (event) => {
	console.log('refreshTweet event:', event);
	const reading = await operations.refreshLatestReading();
	console.log('OK', reading);
}
