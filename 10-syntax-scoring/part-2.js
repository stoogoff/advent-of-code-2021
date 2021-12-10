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

// apparently my local node doesn't have flatMap
Array.prototype.flatMap = function(lambda) { 
    return Array.prototype.concat.apply([], this.map(lambda))
}


class Tree {
	constructor(start, end) {
		this.start = start
		this.end = end
		this.children = []
		this.parent = null
		this.completed = false
	}

	append(tree) {
		tree.parent = this
		this.children.push(tree)
	}

	complete() {
		this.completed = true
	}

	isComplete() {
		if(!this.completed) return false

		return this.children.map(leaf => leaf.isComplete()).filter(complete => complete).length === this.children.length
	}

	write() {
		let chars = [this.start]

		this.children.forEach(leaf => chars = [...chars, ...leaf.write()])

		return [...chars, this.end].join('')
	}

	score(d) {
		let score = []

		if(!this.completed && this.end !== '') {
			score.push(SCORE[this.end])
		}

		return [...score, ...this.children.flatMap(leaf => leaf.score())]
	}
}


const SCORE = {
	')': 1,
	']': 2,
	'}': 3,
	'>': 4,
}

const PAIRS = {
	'(': ')',
	'[': ']',
	'{': '}',
	'<': '>',
}

const parsed = parseTree(input)
const scores = parsed.map(
	tree => tree.score().reverse().reduce((p, c) => p * 5 + c, 0)
).sort((a, b) => a - b)

console.log(`Result: ${scores[Math.floor(scores.length / 2)]}`)


function parseTree(input) {
	const parsedLines = []

	for(let i = 0, ilen = input.length; i < ilen; ++i) {
		const line = input[i]
		let root = new Tree('', '')

		root.completed = true

		let current = root
		let error = false

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
					current.complete()
					current = current.parent
				}
				else {
					error = true
					//console.warn(`Line ${i}, char ${j}: Expected ${current.end}, but found ${char} instead.`)
					break
				}

				continue
			}

			console.warn('ERROR: Not an opening character and current is null')
		}

		if(!error) parsedLines.push(root)
	}

	return parsedLines.filter(tree => !tree.isComplete())
}