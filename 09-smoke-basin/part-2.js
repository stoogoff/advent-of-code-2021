#!/usr/local/bin/node
const { readFile, multiplier } = require('../utils')

// Test data
/*const input = `2199943210
3987894921
9856789892
8767896789
9899965678`.split('\n').map(row => row.split(''))*/
const input = readFile('09-smoke-basin/data').map(row => row.split(''))


const BARRIER = '9'
const chomped = {}

const basins = findBasins(input)

console.log(`Result: ${basins.reduce(multiplier, 1)}`)

function findBasins(input) {
	let basins = []
	let safety = 1000

	for(let y = 0, ylen = input.length; y < ylen; ++y) {
		for(let x = 0, xlen = input[y].length; x < xlen; ++x) {
			const basin = walkRight(input, x, y, 0)

			if(basin > 0) basins.push(basin)
		}
	}

	return basins.sort((a, b) => b - a).splice(0, 3)
}

function key(x, y) {
	return y.toString() + x.toString()
}

function walkRight(input, x, y, depth) {
	let basin = 0

	while(x < input[y].length) {
		const KEY = key(x, y)

		if(input[y][x] === BARRIER) {
			chomped[KEY] = true
			break
		}

		if(chomped[KEY]) {
			x++
			continue
		}

		chomped[KEY] = true

		basin += 1 + walkDown(input, x, y + 1) + walkUp(input, x, y - 1)

		x++
	}

	return basin
}

function walkLeft(input, x, y) {
	let basin = 0

	while(x >= 0) {
		const KEY = key(x, y)

		if(input[y][x] === BARRIER) {
			chomped[KEY] = true
			break
		}

		if(chomped[KEY]) {
			x--
			continue
		}

		chomped[KEY] = true

		basin += 1 + walkDown(input, x, y + 1) + walkUp(input, x, y - 1)

		x--
	}

	return basin
}

function walkDown(input, x, y) {
	let basin = 0

	if(y < input.length) {
		if(input[y][x] === BARRIER) {
			chomped[key(x, y)] = true
			return 0
		}

		basin += walkRight(input, x, y)
		basin += walkLeft(input, x - 1, y)
	}

	return basin
}

function walkUp(input, x, y) {
	let basin = 0

	if(y >= 0) {
		if(input[y][x] === BARRIER) {
			chomped[key(x, y)] = true
			return 0
		}

		basin += walkRight(input, x, y)
		basin += walkLeft(input, x - 1, y)
	}

	return basin
}