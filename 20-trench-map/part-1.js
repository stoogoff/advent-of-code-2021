#!/usr/local/bin/node
const { read } = require('../utils')

// Test data
/*const input = `..#.#..#####.#.#.#.###.##.....###.##.#..###.####..#####..#....#..#..##..###..######.###...####..#..#####..##..#.#####...##.#.#..#.##..#.#......#.###.######.###.####...#.##.##..#..#..#####.....#.#....###..#.##......#.....#..#..#..##..#...##.######.####.####.#.#...#.......#..#.#.#...####.##.#......#..#...##.#.##..#...##.#.##..###.#......#.#.......#.#.#.####.###.##...#.....####.#..#..#.##.#....##..#.####....##...##..#...#......#.#.......#.......##..####..#...#.#.#...##..#.#..###..#####........#..####......#..#

#..#.
#....
##..#
..#..
..###`*/
const input = read('20-trench-map/data')
const original = parseInput(input)

let steps = 0
let image = original.image

while(steps++ < 2) {
	image = parseImage(image, original.algorithm)

	//const drawn = draw(image)

	//console.log(drawn)
	console.log(`\nResult: ${image.flat().filter(cell => cell === '#').length}\n`)
}




function parseInput(input) {
	const [head, ...tail] = input.split('\n')
	const image = tail.filter(line => line !== '').map(line => line.split(''))


	return { algorithm: head, image: image }
}

function parseImage(image, algo, step) {
	const OFFSET = 2
	const newImage = []

	for(let y = -OFFSET, ylen = image.length + OFFSET; y < ylen; ++y) {
		newImage[y + OFFSET] = []

		for(let x = -OFFSET, xlen = image[0].length + OFFSET; x < xlen; ++x) {
			const position = getBinaryFromPosition(image, x, y)

			newImage[y + OFFSET][x + OFFSET] = (algo[0] === '#' & step % 2) ? '.' : algo[position]
		}
	}
//return newImage
	const trimmedImage = []

	for(let y = 1, ylen = newImage.length - 1; y < ylen; ++y) {
		trimmedImage[y - 1] = []

		for(let x = 1, xlen = newImage[0].length - 1; x < xlen; ++x) {
			trimmedImage[y - 1][x - 1] = newImage[y][x]
		}
	}

	return trimmedImage
}

function getBinaryFromPosition(input, x, y) {
	const LIGHT = '1'
	const DARK = '0'
	const cells = []

	for(let y1 = y - 1, ylen = y + 1; y1 <= ylen; ++y1) {
		if(y1 < 0 || y1 >= input.length) {
			cells.push(DARK.repeat(3))
			continue
		}

		for(let x1 = x - 1, xlen = x + 1; x1 <= xlen; ++x1) {
			if(x1 < 0 || x1 > input[y1].length) {
				cells.push(DARK)
				continue
			}

			cells.push(input[y1][x1] === '#' ? '1' : '0')
		}
	}

	return parseInt(cells.join(''), 2)
}

function draw(input) {
	const buffer = []

	for(let y = 0, ylen = input.length; y < ylen; ++y) {
		let inner = []

		for(let x = 0, xlen = input[y].length; x < xlen; ++x) {
			inner.push(input[y][x])
		}

		buffer.push(inner.join(''))
	}

	return buffer.join('\n')
}