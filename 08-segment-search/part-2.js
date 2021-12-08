#!/usr/local/bin/node
const { readFile, parseSignals, sortBy, adder } = require('../utils')

// Test data
//const input = [`acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf`]
//const input = [`be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe`]
//const input = ['edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc']
/*const input = `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`.split('\n')*/
const input = readFile('08-segment-search/data')

const match = {
	2: 1,
	4: 4,
	3: 7,
	7: 8,
}

const signals = parseSignals(input)
const result = sortPatterns(signals).map(row => {
	const mapping = convertPatternsToNumbers(row.signalPatterns)
	const number = row.output.map(o => o in mapping ? mapping[o] : 'ERROR')

	return parseInt(number.join(''))
}).reduce(adder, 0)

console.log(`Result: ${result}`)


function convertPatternsToNumbers(patterns) {
	const map = {}

	// simple length checks first
	// get them in place to use as building blocks for the others
	patterns.forEach(p => {
		if(p.length in match) {
			map[match[p.length]] = p
		}
	})

	// length of 6, numbers 0, 6, 9
	patterns.forEach(p => {
		if(p.length === 6) {
			// 9 has a length of 6 and must have all the characters of 4
			if(hasChars(p, map[4])) {
				map[9] = p
			}
			// 6 mustn't have the characters of 1
			else if(!hasChars(p, map[1])) {
				map[6] = p
			}
			else {
				map[0] = p
			}
		}
	})

	// length of 5, numbers 2, 3, 5
	patterns.forEach(p => {
		if(p.length === 5) {
			if(hasChars(p, map[1])) {
				map[3] = p
			}
			else if(hasChars(map[6], p)) {
				map[5] = p
			}
			else {
				map[2] = p
			}
		}
	})

	const reverseMap = {}

	Object.keys(map).forEach(key => reverseMap[map[key]] = key)

	return reverseMap
}

function hasChars(input, mustMatch) {
	if(!mustMatch) return false

	input = input.split('')
	mustMatch = mustMatch.split('')

	const match = input.map(c => mustMatch.indexOf(c) > -1).reduce(adder, 0)

	return match === mustMatch.length
}

function sortPatterns(signals) {
	return signals
		.map(signals => (
			{
				output: sortChars(signals.output),
				signalPatterns: sortChars(signals.signalPatterns).sort(sortBy('length')),
			}
		))
}

function sortChars(input) {
	return input.map(n => n.split('').sort().join(''))
}
