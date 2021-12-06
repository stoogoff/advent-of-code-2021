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
]

checkAdjustment(input)*/

try {
	checkAdjustment(readFile('01-sonar-sweep/data').map(line => parseInt(line)))
} catch (err) {
	console.error(err)
}
