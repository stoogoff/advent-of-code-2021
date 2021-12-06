#!/usr/local/bin/node

const { readFile, checkAdjustment } = require('../utils')

// test input
/*const input = [
	199,
	200,
	208,
	210,
	200,
	207,
	240,
	269,
	260,
	263,
]*/



try {
	const input = readFile('01-sonar-sweep/data').map(line => parseInt(line))
	const groupedInput = input.filter(line => !!line).map(line => parseInt(line)).map((line, idx) => {
		if(idx + 2 < input.length) return line + input[idx + 1] + input[idx + 2]

		return -1
	}).filter(line => line > 0)

	//console.log(groupedInput)

	checkAdjustment(groupedInput)
} catch (err) {
	console.error(err)
}
