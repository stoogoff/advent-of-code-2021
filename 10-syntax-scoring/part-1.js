#!/usr/local/bin/node
const { readFile, adder } = require('../utils')

// Test data
/*const input = `[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]`.split('\n')*/
const input = readFile('10-syntax-scoring/data')

class Tree {
	constructor(start, end) {
		this.start = start
		this.end = end
		this.children = []
		this.parent = null
	}

	append(tree) {
		tree.parent = this
		this.children.push(tree)
	}
}


const SCORE = {
	')': 3,
	']': 57,
	'}': 1197,
	'>': 25137,
}

const PAIRS = {
	'(': ')',
	'[': ']',
	'{': '}',
	'<': '>',
}

const illegal = parseTree(input).map(char => SCORE[char]).reduce(adder, 0)

console.log(`Result: ${illegal}`)



function parseTree(input) {
	const illegal = []
	let current = null

	for(let i = 0, ilen = input.length; i < ilen; ++i) {
		const line = input[i]

		for(let j = 0, jlen = line.length; j < jlen; ++j) {
			const char = line[j]

			// opening character
			if(char in PAIRS) {
				let next = new Tree(char, PAIRS[char])

				if(current) {
					current.append(next)
				}

				current = next
				continue
			}
			// closing character
			else if(current) {
				if(char === current.end) {
					current = current.parent
				}
				else {
					illegal.push(char)
					console.warn(`Line ${i}, char ${j}: Expected ${current.end}, but found ${char} instead.`)
					break
				}

				continue
			}

			console.log('Not an opening character and current is null')
		}
	}

	return illegal
}