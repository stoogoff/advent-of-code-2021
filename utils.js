
const fs = require('fs')
const path = require('path')

exports.readFile = (name) => {
	const data = fs.readFileSync(path.join(__dirname, name), 'utf8')

	return data.split('\n').filter(line => !!line)
}

exports.stringToIntArray = input => input.split(',').map(i => parseInt(i))

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

