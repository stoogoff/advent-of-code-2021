#!/usr/local/bin/node
const fs = require('fs')
const path = require('path')

const { stringToIntArray } = require('../utils')

// Test input
//let crabs = stringToIntArray('16,1,2,0,4,2,7,1,2,14')
let crabs = stringToIntArray(fs.readFileSync(path.join(__dirname, 'data'), 'utf8'))

const maxPosition = crabs.reduce((p, c) => Math.max(p, c, 0))
const fuelCost = []

for(let i = 0; i <= maxPosition; ++i) {
	fuelCost[i] = getFuelCost(crabs, i)
}

const result = fuelCost.reduce((p, c) => Math.min(p, c), 1000000)

console.log(`Result = ${result}`)

function getFuelCost(input, position) {
	return input.map(c => Math.abs(c - position)).reduce((p, c) => p + c, 0)
}