import { generateAnswer } from "./generate-answer"


const aSunday = new Date('2022-01-09')
describe('generate-answer', () => {
    jest
    .useFakeTimers()
    .setSystemTime(aSunday);

    test('reading is from today', () => {
        expect(generateAnswer(10, new Date())).toEqual('It\'s 10 degrees')
    })
    
    test('reading is from yesterday', () => {
        const yesterday = new Date('2022-01-08')
        expect(generateAnswer(10, yesterday)).toEqual('Yesterday it was 10 degrees')
    })
    
    test('reading is in the same rolling week', () => {
        expect(generateAnswer(10, new Date('2022-01-03'))).toEqual('On Monday it was 10 degrees')
        expect(generateAnswer(10, new Date('2022-01-04'))).toEqual('On Tuesday it was 10 degrees')
        expect(generateAnswer(10, new Date('2022-01-05'))).toEqual('On Wednesday it was 10 degrees')
        expect(generateAnswer(10, new Date('2022-01-06'))).toEqual('On Thursday it was 10 degrees')
        expect(generateAnswer(10, new Date('2022-01-07'))).toEqual('On Friday it was 10 degrees')
    })

    xtest('reading is older than one week', () => {
        expect(generateAnswer(10, new Date('2022-01-02'))).toEqual('On the 2nd Jan it was 10 degrees')
    })
})
