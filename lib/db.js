'use strict'
const AWS = require('aws-sdk')
const s3 = new AWS.S3()

const Bucket = 'pool-temperatures'

module.exports = function createClient (Key) {
	
	function write (data) {
		return s3.putObject({
			Bucket,
			Key,
			Body: new Buffer(JSON.stringify(data), 'utf8'),
			ContentType: 'application/json'
		}).promise()
	}
	  
	async function read () {
		const { Body } = await s3.getObject({
			Bucket,
			Key,
		}).promise()
		return JSON.parse(Body.toString())
	}

	return { write, read }
}
