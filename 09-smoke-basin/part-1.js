#!/usr/local/bin/node
const { readFile, adder } = require('../utils')

// Test data
/*const input = `2199943210
3987894921
9856789892
8767896789
9899965678`.split('\n').map(row => row.split('').map(cell => parseInt(cell)))*/
const input = readFile('09-smoke-basin/data').map(row => row.split('').map(cell => parseInt(cell)))


const result = mapToAdjacent(input)

console.log(`Result: ${result.reduce(adder, 0)}`)

function mapToAdjacent(input) {
	const sections = []

	for(let y = 0, ylen = input.length; y < ylen; ++y) {
		const row = input[y]

		for(let x = 0, xlen = row.length; x < xlen; ++x) {
			const height = row[x]
			const chunk = [height]

			if(x - 1 >= 0) chunk.push(row[x - 1])
			if(x + 1 < xlen) chunk.push(row[x + 1])
			if(y - 1 >= 0) chunk.push(input[y - 1][x])
			if(y + 1 < ylen) chunk.push(input[y + 1][x])

			sections.push(chunk)
		}
	}

	return sections
		.filter(chunk => {
			const [head, ...tail] = chunk
			const min = Math.min(...tail)

			return head < min

		})
		.map(chunk => chunk[0] + 1)
}
