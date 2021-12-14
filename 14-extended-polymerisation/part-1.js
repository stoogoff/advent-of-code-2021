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


let [template, ...tail] = input
let steps = 10
const rules = parseRules(tail)

while(--steps >= 0) {
	template = grow(template, rules)
}

const counter = getElementCount(template)
const max = Math.max(...counter)
const min = Math.min(...counter)

console.log(`Result: ${max - min}`)


function grow(template, rules) {
	const input = template.split('')

	return input
		// get pairs
		.map((char, idx) => {
			if(idx + 1 < input.length) {
				return char + input[idx + 1]
			}

			return char
		})
		// skip single char code
		.filter(code => code.length === 2)
		// insert extra sequence into a pair
		.map(pair => {
			if(rules[pair]) {
				const parts = pair.split('')

				return parts[0] + rules[pair] + parts[1]
			}

			return pair
		})
		// ready the pairs for joining by removing the end char
		.map((code, idx, arr) => {
			if(code.length === 3 && idx < arr.length - 1) {
				return code.substring(0, 2)
			}

			return code
		}).join('')
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

	for(let i = 0, ilen = input.length; i < ilen; ++i) {
		if(!counter[input[i]]) {
			counter[input[i]] = 0
		}

		counter[input[i]]++
	}

	return Object.values(counter)
}
