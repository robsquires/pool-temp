import { S3 } from 'aws-sdk'
const s3 = new S3()

const Bucket = 'pool-temperatures'

export function createClient (Key: string) {
	
	function write (data: any) {
		return s3.putObject({
			Bucket,
			Key,
			Body: Buffer.from(JSON.stringify(data), 'utf8'),
			ContentType: 'application/json'
		}).promise()
	}
	  
	async function read () {
		const { Body } = await s3.getObject({
			Bucket,
			Key,
		}).promise()
		if (!Body) {
			throw new Error(`Could not find file at ${Key}`)
		}
		return JSON.parse(Body.toString())
	}

	return { write, read }
}