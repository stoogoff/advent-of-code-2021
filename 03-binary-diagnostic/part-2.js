#!/usr/local/bin/node

const { readFile } = require('../utils')

// test input
/*const input = [
	'00100',
	'11110',
	'10110',
	'10111',
	'10101',
	'01111',
	'00111',
	'11100',
	'10000',
	'11001',
	'00010',
	'01010',
]

lifeSupport(input)*/

try {
	lifeSupport(readFile('03-binary-diagnostic/data'))
} catch (err) {
	console.error(err)
}

function lifeSupport(input) {
	const threshold = input.length / 2
	const bits = input.map(line => line.split('')).map(arr => arr.map(bit => parseInt(bit)))
	const oxygen = reduceLines(bits, highestValueAtIndex, 1)
	const scrubber = reduceLines(bits, lowestValueAtIndex, 0)

	console.log(`oxygen = ${oxygen}`)
	console.log(`scrubber = ${scrubber}`)
	console.log(`total = ${oxygen * scrubber}`)
}

function reduceLines(input, func, priority) {
	const len = input[0].length
	let current = input

	for(let idx = 0; idx < len; ++idx) {
		let value = func(current, idx)

		if(value === -1) value = priority

		current = allWithValue(current, idx, value)

		if(current.length === 1) break
	}

	return parseInt(current[0].join(''), 2)
}

// return the highest value at the given index:
// 1 - more 1 than 0
// 0 - more 0 than 1
// -1 - equal
function highestValueAtIndex(input, idx) {
	const threshold = input.length / 2
	const result = input.map(arr => arr[idx]).reduce((p, c) => p + c, 0)

	if(result === threshold) return -1

	return result > threshold ? 1 : 0
}

function lowestValueAtIndex(input, idx) {
	const result = highestValueAtIndex(input, idx)

	return result === -1 ? result : (result === 0 ? 1 : 0)
}

// return all lines with the specified bit value
function allWithValue(input, idx, value) {
	return input.filter(line => line[idx] === value)
}

