#!/usr/local/bin/node
const { read } = require('../utils')

// Test data
/*let input = `5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`*/

/*let input = `11111
18881
18181
18981
11111`*/

let input = read('11-dumbo-octopus/data')

input = input.split('\n').map(line => line.split('').map(cell => parseInt(cell)))

let flashed = {}
const result = flashSquid(input, 100)

console.log(`Result: ${result}`)

function flashSquid(input, steps) {
	let totalFlashes = 0

	while(--steps >= 0) {
		flashed = {}

		for(let y = 0, ylen = input.length; y < ylen; ++y) {
			for(let x = 0, xlen = input[y].length; x < xlen; ++x) {
				increment(input, y, x)
			}
		}

		totalFlashes += Object.keys(flashed).length
	}

	return totalFlashes
}

function key(x, y) {
	return `${y}${x}`
}

function increment(input, y, x) {
	const KEY = key(x, y)

	if(input[y][x] + 1 > 9 && !flashed[KEY]) {
		flashed[KEY] = true
		input[y][x] = 0

		const prevX = x - 1 >= 0 ? x - 1 : false
		const nextX = x + 1 < input[y].length ? x + 1 : false
		const prevY = y - 1 >= 0 ? y - 1 : false
		const nextY = y + 1 < input.length ? y + 1 : false

		// horizontal
		if(prevX !== false) increment(input, y, prevX)
		if(nextX !== false) increment(input, y, nextX)

		// vertical
		if(prevY !== false) increment(input, prevY, x)
		if(nextY !== false) increment(input, nextY, x)

		// four diagonals
		if(prevX !== false && prevY !== false) increment(input, prevY, prevX)
		if(nextX !== false && prevY !== false) increment(input, prevY, nextX)
		if(prevX !== false && nextY !== false) increment(input, nextY, prevX)
		if(nextX !== false && nextY !== false) increment(input, nextY, nextX)
	}
	else if(flashed[KEY]) {
		input[y][x] = 0
	}
	else {
		input[y][x] = input[y][x] + 1
	}
}
