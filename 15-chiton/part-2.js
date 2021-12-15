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

const WIDTH = input[0].length * 5
const HEIGHT = input.length * 5

const path = findPath(input)

console.log(`Result: ${path}`)

function findPath(grid) {
	let queue = []
	const visited = {}
	const TARGET = { x: WIDTH - 1, y: HEIGHT - 1 }

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

	if(x + 1 < WIDTH) {
		next.push({ x: x + 1, y: y, val: getGridVal(grid, y, x + 1) })
	}
	if(y + 1 < HEIGHT) {
		next.push({ x: x, y: y + 1, val: getGridVal(grid, y + 1, x) })
	}
	if(x - 1 >= 0) {
		next.push({ x: x - 1, y: y, val: getGridVal(grid, y, x - 1) })
	}
	if(y - 1 >= 0) {
		next.push({ x: x, y: y - 1, val: getGridVal(grid, y - 1, x) })
	}

	return next
}

function getGridVal(grid, x, y) {
	const modY = y % input.length
	const modX = x % input[0].length
	const divY = Math.floor(y / input.length)
	const divX = Math.floor(x / input[0].length)

	let value = grid[modY][modX] + divY + divX

	if(value > 9) value = value % 9

	return value
}
