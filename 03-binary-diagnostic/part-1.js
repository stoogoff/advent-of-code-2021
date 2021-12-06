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

powerConsumption(input)*/

try {
	powerConsumption(readFile('03-binary-diagnostic/data'))
} catch (err) {
	console.error(err)
}



function powerConsumption(input) {
	const threshold = input.length / 2
	const base = new Array(input[0].length) // [0,0,0,0,0]

	for(let i = 0, len = base.length; i < len; ++i) base[i] = 0

	const gamma = input.map(line => line.split('')).reduce((prev, current) => {
		return prev.map((bit, idx) => bit + parseInt(current[idx]))
	}, base).map(value => value < threshold ? 0 : 1)

	const epsilon = gamma.map(bit => bit ? 0 : 1)

	const gammaDec = bitArrary2Dec(gamma)
	const epsilonDec = bitArrary2Dec(epsilon)

	console.log(`gamma = ${gammaDec}`)
	console.log(`epsilon = ${epsilonDec}`)
	console.log(`total = ${gammaDec * epsilonDec}`)
}

function bitArrary2Dec(input) {
	return parseInt(input.join(''), 2)
}