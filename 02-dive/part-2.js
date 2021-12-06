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
]*/

try {
	move(readFile('02-dive/data'))
	//move(input)
} catch (err) {
	console.error(err)
}

function move(input) {
	const movements = {
		'forward': (amount) => {
			position += amount
			depth += aim * amount
		},
		'down': (amount) => aim += amount,
		'up': (amount) => aim -= amount,
	}

	let position = 0
	let depth = 0
	let aim = 0

	input.forEach(movement => {
		const [ change, amount ] = movement.split(' ')

		if(change in movements) movements[change](parseInt(amount))
	})

	console.log(`aim = ${aim}`)
	console.log(`depth = ${depth}`)
	console.log(`position = ${position}`)	
	console.log(`total = ${depth * position}`)
}