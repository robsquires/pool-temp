import { S3 } from 'aws-sdk'
const s3 = new S3()

const Bucket = 'pool-temperatures'

export function createClient<T> (Key: string) {
	
	function write (data: T) {
		return s3.putObject({
			Bucket,
			Key,
			Body: Buffer.from(JSON.stringify(data), 'utf8'),
			ContentType: 'application/json'
		}).promise()
	}
	  
	async function read (defaultValue?: T): Promise<T> {
		let result;
		try {
			result = await s3.getObject({ Bucket, Key }).promise()
		} catch (err: any) {
			if (err.code === 'NoSuchKey' && defaultValue) {
				return defaultValue;
			}
			throw err;
		}

		if (result && result.Body) {
			return JSON.parse(result.Body.toString())
		}

		throw new Error(`Could not find file at ${Key}`)
	}

	return { write, read }
}

export function createListClient<T>(key: string) {
    const client = createClient<T[]>(key);

    async function insert(item: T): Promise<T[]> {
		console.log('insert new item', item)
        const updatedList = [item].concat(await client.read([]));
        await client.write(updatedList);
        return updatedList;
    }

    return {
        ...client,
        insert
    }
}