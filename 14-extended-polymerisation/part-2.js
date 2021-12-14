#!/usr/local/bin/node
const { readFile } = require('../utils')

// Test input
/*const input = `NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`.split('\n').filter(line => line !== '')*/
const input = readFile('14-extended-polymerisation/data')

const [head, ...tail] = input
let steps = 40
const rules = parseRules(tail)
let template = createStartingPairs(head)

while(--steps >= 0) {
	template = grow(template, rules)
}

const counter = getElementCount(template)
const max = Math.max(...counter)
const min = Math.min(...counter)

// slight rounding error...
console.log(`Result: ${max - min}`)


function createStartingPairs(input) {
	const counter = {}

	input.split('').forEach((char, idx) => {
		if(idx + 1 < input.length) {
			increment(counter, char + input[idx + 1], 1)
		}
	})

	return counter
}

function grow(pairs, rules) {
	const counter = {}

	for(let pair in pairs) {
		const char = rules[pair]

		increment(counter, pair[0] + char, pairs[pair])
		increment(counter, char + pair[1], pairs[pair])
	}

	return counter
}

function increment(counter, key, value) {
	if(!counter[key]) counter[key] = 0

	counter[key] += value
}

function parseRules(rules) {
	const parsedRules = {}

	rules.forEach(rule => {
		const [pair, char] = rule.split(' -> ')

		parsedRules[pair] = char
	})

	return parsedRules
}

function getElementCount(input) {
	const counter = {}

	for(let pair in input) {
		increment(counter, pair[0], input[pair] / 2)
		increment(counter, pair[1], input[pair] / 2)
	}

	return Object.values(counter)
}
