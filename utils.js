
const fs = require('fs')
const path = require('path')

exports.readFile = (name) => {
	const data = fs.readFileSync(path.join(__dirname, name), 'utf8')

	return data.split('\n').filter(line => !!line)
}

exports.read = name => fs.readFileSync(path.join(__dirname, name), 'utf8')

exports.stringToIntArray = input => input.split(',').map(i => parseInt(i))

exports.adder = (p, c) => p + c

exports.sortBy = prop => (a, b) => {
	a = a[prop]
	b = b[prop]

	return a === b ? 0 : (a < b ? -1 : 1)
}

// 01
exports.checkAdjustment = (input) => {
	let increased = 0
	let decreased = 0
	let last = input[0]

	input.forEach(current => {
		if(current < last) {
			++decreased
		}
		if(current > last) {
			++increased
		}

		last = current
	})

	console.log(`increased = ${increased}`)
	console.log(`decreased = ${decreased}`)
}

// 08
exports.parseSignals = input => input.map(line => {
		const [signalPatterns, output] = line.split(' | ')

		return {
			signalPatterns: signalPatterns.split(' '),
			output: output.split(' '),
		}
	})
