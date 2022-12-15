import { parseTweet } from "./parse-tweet"
import { Tweet } from "./operations"

function createTweet(text: string): Tweet {
    return {
        text,
        created_at: 'Mon Dec 12 13:00:00 +0000 2022',
        user_name: 'Brockwell_Lido'
    }
}

test('returns null if the tweet does not contain a reading', () => {
    expect(parseTweet({
        text:'hello',
        created_at: 'Mon Dec 12 13:00:00 +0000 2022',
        user_name: 'Brockwell_Lido'
    })).toEqual(null)
})

describe('brockwell lido', () => {
    test('converts tweet to temperature reading', () => {
        expect(parseTweet({
            text:'Monday\'s pool temperature is 10.0 we are open from 7:30am till 11:00am',
            created_at: 'Mon Dec 12 13:00:00 +0000 2022',
            user_name: 'Brockwell_Lido'
        })).toEqual({
            "temperature": 10,
            "date": new Date('2022-12-12T13:00:00.000Z'),
            "source": "TWEET"
        })
    })

    describe('handles tweet formats', () => {
        test('"temperature is X" format', () => {
            expect(
                parseTweet(createTweet('Monday\'s pool temperature is 9 we...')
            )).toMatchObject({ temperature: 9 })
            expect(
                parseTweet(createTweet('Monday\'s pool temperature is 10.0 we...')
            )).toMatchObject({ temperature: 10.0 })
            expect(
                parseTweet(createTweet('Monday\'s pool temperature is 10.1 we...')
            )).toMatchObject({ temperature: 10.1 })
        })

        test('"it\'s X degrees" format', () => {
            expect(
                parseTweet(createTweet('It\'s Monday and it\'s 9 degrees')
            )).toMatchObject({ temperature: 9 })
            expect(
                parseTweet(createTweet('It\'s Monday and it\'s 10 degrees')
            )).toMatchObject({ temperature: 10.0 })
            expect(
                parseTweet(createTweet('It\'s Monday and it\'s 10.1 degrees')
            )).toMatchObject({ temperature: 10.1 })
        })

        test('"X is the pool temperature today 😀" format', () => {
            expect(
                () => parseTweet(createTweet('14.4 is the pool temperature today 😁 https://t.co/aFBBjOOGGX'))
            ).toThrow()
        })

        test('"Good morning swimmers! \n\nSaturdays pool temp is 14.4" format', () => {
            expect(
                parseTweet(createTweet('Good morning swimmers! \n\nSaturdays pool temp is 14.4')
            )).toMatchObject({ temperature: 14.4 })
        })

        test('short date format', () => {
            expect(
                parseTweet(createTweet('Brockwell lido temperature this Saturday morning (01/02) is 6.3 degrees centigrade')
            )).toMatchObject({ temperature: 6.3 })
        })
    })
})