import * as operations from './lib/operations'
import { Tweet } from './lib/steps'
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

	const data = await operations.ingestTweet(body.tweet);
	console.log('OK', data)
	return writeResponse(200, data);
}

export const refreshTweet: ScheduledHandler =  async (event) => {
	console.log('refreshTweet event:', event);
	const data = await operations.refreshTweet();
	console.log('OK', data);
}

export const latestTemperature: APIGatewayProxyHandler = async (event) =>  {
	console.log('latestTemperature event:', event)
	try {
		const data = await operations.getTemperature();
		return writeResponse(200, data)
	} catch(err: any) {
		console.error(err)
		return writeResponse(500, err)
	}
}
