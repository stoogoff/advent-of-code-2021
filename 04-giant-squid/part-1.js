#!/usr/local/bin/node
const fs = require('fs')
const path = require('path')
const MARKER = 'x'

// Test input
/*const draw = '7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1'.split(',').map(i => parseInt(i))
//const draw = [14, 10, 18, 22, 2]
const boards = [
	[
		[22, 13, 17, 11,  0],
		[ 8,  2, 23,  4, 24],
		[21,  9, 14, 16,  7],
		[ 6, 10,  3, 18,  5],
		[ 1, 12, 20, 15, 19],
	],
	[
		[ 3, 15,  0,  2, 22],
		[ 9, 18, 13, 17,  5],
		[19,  8,  7, 25, 23],
		[20, 11, 10, 24,  4],
		[14, 21, 16, 12,  6],
	],
	[
		[14, 21, 17, 24,  4],
		[10, 16, 15,  9, 19],
		[18,  8, 23, 26, 20],
		[22, 11, 13,  6,  5],
		[ 2,  0, 12,  3,  7],
	]
]

const result = playBingo(draw, boards)

console.log(`result = ${result}`)*/

try {
	const data = fs.readFileSync(path.join(__dirname, 'data'), 'utf8').trim().split('\n')
	const draw = data.shift().split(',').map(i => parseInt(i))
	const boards = parseData(data)
	const result = playBingo(draw, boards)

	console.log(`result = ${result}`)	
} catch (err) {
	console.error(err)
}

function parseData(lines) {
	let boards = []
	let board = []

	for(let i = 1, len = lines.length; i < len; ++i) {
		const line = lines[i].trim()

		if(line === '') {
			boards.push(board)
			board = []
			continue
		}

		board.push(line.split(/\s+/).map(cell => parseInt(cell.trim())))
	}

	boards.push(board)

	return boards
}


function playBingo(draw, boards) {
	for(let i = 0, ilen = draw.length; i < ilen; ++i) {
		for(let j = 0, jlen = boards.length; j < jlen; ++j) {
			boards[j] = fillBoard(boards[j], draw[i])
			if(checkRowAndCol(boards[j])) {
				return getWinningNumbers(boards[j]) * draw[i]
			}
		}
	}

	return 0
}

function fillBoard(board, number) {
	return board.map(row => row.map(cell => cell === number ? MARKER : cell))
}

function checkRowAndCol(board) {
	const filledRow = board.filter(row => {
		return row.filter(cell => cell === MARKER).length === row.length
	})

	if(filledRow.length > 0) return true

	for(let i = 0, len = board[0].length; i < len; ++i) {
		if(board.filter(row => row[i] === MARKER).length === len) {
			return true
		}
	}

	return false
}

function getWinningNumbers(board) {
	const adder = (p, c) => p + c

	return board.map(row => {
		return row.filter(cell => cell !== MARKER).reduce(adder, 0)
	}).reduce(adder, 0)
}

