#!/usr/local/bin/node
const fs = require('fs')
const path = require('path')

const { stringToIntArray } = require('../utils')

// Test input
//let crabs = stringToIntArray('16,1,2,0,4,2,7,1,2,14')
let crabs = stringToIntArray(fs.readFileSync(path.join(__dirname, 'data'), 'utf8'))

const maxPosition = crabs.reduce((p, c) => Math.max(p, c, 0))
let fuelCost = 1000000000000

for(let i = 0; i <= maxPosition; ++i) {
	fuelCost = Math.min(getFuelCost(crabs, i), fuelCost)
}

console.log(`Result = ${fuelCost}`)

function getFuelCost(input, position) {
	return input.map(c => totals(Math.abs(c - position))).reduce((p, c) => p + c, 0)
}

function totals(n) {
	return (n + 1) * (n / 2)
}
