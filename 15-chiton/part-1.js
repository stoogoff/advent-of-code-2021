#!/usr/local/bin/node
const { readFile, sortBy, adder } = require('../utils')

// Test input
/*let input = `1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581`

input = input.split('\n').map(line => line.split('').map(cell => parseInt(cell)))*/
const input = readFile('15-chiton/data').map(line => line.split('').map(cell => parseInt(cell)))

let canDescend = true

const path = findPath(input)

console.log(`Result: ${path}`)

function findPath(grid) {
	let queue = []
	const visited = {}
	const TARGET = { x: grid[0].length - 1, y: grid.length - 1 }

	queue.push({ x: 0, y: 0, val: 0 })

	while(queue.length > 0) {
		queue = queue.sort(sortBy('val'))

		const current = queue.shift()
		const KEY = key(current)

		if(KEY in visited) continue

		visited[KEY] = current.val

		if(current.x === TARGET.x && current.y === TARGET.y) return current.val

		getNext(grid, current.x, current.y).forEach(next => {
			queue.push({ ...next, val: current.val + next.val })
		})
	}
}

function key(point) {
	return `${point.y}${point.x}`
}

function getNext(grid, x, y) {
	const next = []

	if(x + 1 < grid[y].length) {
		next.push({ x: x + 1, y: y, val: grid[y][x + 1] })
	}
	if(y + 1 < grid.length) {
		next.push({ x: x, y: y + 1, val: grid[y + 1][x] })
	}
	if(x - 1 >= 0) {
		next.push({ x: x - 1, y: y, val: grid[y][x - 1] })
	}
	if(y - 1 >= 0) {
		next.push({ x: x, y: y - 1, val: grid[y - 1][x] })
	}

	return next
}

function visualise(grid, path) {
	const buffer = []
	const pathMap = {}

	path.forEach(point => pathMap[`${point.x}${point.y}`] = point)

	const BRIGHT = '\x1b[37m'
	const DIM = '\x1b[32m'
	let state = BRIGHT

	process.stdout.write('\x1b[1m')

	for(let y = 0, ylen = grid.length; y < ylen; ++y) {
		for(let x = 0, xlen = grid[y].length; x < xlen; ++x) {
			const KEY = `${x}${y}`

			if(pathMap[KEY]) {
				state = BRIGHT
			}
			else {
				state = DIM
			}

			process.stdout.write(state + grid[y][x].toString())

			if(x < xlen - 1) process.stdout.write('.')
		}

		process.stdout.write('\n')
	}

	console.log('\x1b[0m')
}
