#!/usr/local/bin/node
const { readFile } = require('../utils')

// Test data
/*const input = `6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5`.split('\n')*/

const input = readFile('13-transparent-origami/data')

let grid = buildGrid(input)
const folds = getFolds(input)

folds.forEach(f => {
	grid = fold(grid, f)
})

visualise(grid)

//console.log(`Result: ${newGrid.length}`)

function visualise(grid) {
	const MAX_X = getMax(grid, 0)
	const MAX_Y = getMax(grid, 1)
	const gridMap = {}

	grid.forEach(point => gridMap[key(...point)] = point)

	const buffer = []

	for(let x = 0; x <= MAX_X; ++x) {
		const lineBuffer = []

		for(let y = 0; y <= MAX_Y; ++y) {
			if(gridMap[key(x, y)]) {
				lineBuffer.push('#')
			}
			else {
				lineBuffer.push('.')
			}
		}

		buffer.push(lineBuffer)
	}

	console.log(buffer.map(line => line.join('')).join('\n'))
}

function fold(grid, fold) {
	const changePos = fold[0] === 'y' ? 1 : 0
	const fixedPos = changePos === 1 ? 0 : 1
	const max = getMax(grid, changePos)
	const newGrid = {}

	grid.forEach(point => {
		if(point[changePos] < fold[1]) {
			newGrid[key(point)] = point
			return
		}

		const newPoint = []

		newPoint[fixedPos] = point[fixedPos]
		newPoint[changePos] = max - point[changePos]

		newGrid[key(newPoint)] = newPoint
	})

	return Object.values(newGrid)
}

function key(x, y) {
	return `${x},${y}`
}

function buildGrid(input) {
	return input.filter(line => !line.startsWith('fold') && line !== '').map(line =>
		line.split(',').map(p => parseInt(p))
	)
}

function getFolds(input) {
	return input.filter(line => line.startsWith('fold')).map(fold => {
		const [dir, amount] = fold.replace('fold along', '').split('=')

		return [dir.trim(), parseInt(amount)]
	})
}

function getMax(grid, position) {
	return Math.max(...grid.map(point => point[position]))
}