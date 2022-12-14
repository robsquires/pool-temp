import * as operations from './lib/operations'
import { ScheduledHandler, APIGatewayProxyHandler } from 'aws-lambda';
import { TweetSchema } from './lib/operations';

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
	if (event.headers['x-api-key'] !== process.env.API_KEY) {
		return writeResponse(403, { error: 'Unauthorized' })
	}

	let  body
	try {
		body = JSON.parse(event.body || '')
	} catch (err: any) {
		return writeResponse(400, { error: err.message })
	}
	
	const result = TweetSchema.safeParse(body);
	if (!result.success) {
		console.log('Validation error', result);
		return writeResponse(400, { error: result.error })
	}

	const reading = await operations.ingestTweet(result.data);
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
