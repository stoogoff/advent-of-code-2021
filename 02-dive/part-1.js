#!/usr/local/bin/node

const { readFile } = require('../utils')

// test input
/*const input = [
	'forward 5',
	'down 5',
	'forward 8',
	'up 3',
	'down 8',
	'forward 2',
]

move(input)*/


try {
	move(readFile('02-dive/data'))
} catch (err) {
	console.error(err)
}

function move(input) {
	const movements = {
		'forward': (amount) => position += amount,
		'down': (amount) => depth += amount,
		'up': (amount) => depth -= amount,
	}

	let position = 0
	let depth = 0

	input.forEach(movement => {
		const [ change, amount ] = movement.split(' ')

		if(change in movements) movements[change](parseInt(amount))
	})

	console.log(`depth = ${depth}`)
	console.log(`position = ${position}`)	
	console.log(`total = ${depth * position}`)
}