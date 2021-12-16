
const { adder, multiplier } = require('../utils')

const bitMap = {
	'0': '0000',
	'1': '0001',
	'2': '0010',
	'3': '0011',
	'4': '0100',
	'5': '0101',
	'6': '0110',
	'7': '0111',
	'8': '1000',
	'9': '1001',
	'A': '1010',
	'B': '1011',
	'C': '1100',
	'D': '1101',
	'E': '1110',
	'F': '1111',
}

const handlers = {
	type_0: input => handlers.operator(input, values => values.reduce(adder, 0)),

	type_1: input => handlers.operator(input, values => values.reduce(multiplier, 1)),

	type_2: input => handlers.operator(input, values => Math.min(...values)),

	type_3: input => handlers.operator(input, values => Math.max(...values)),

	type_4: function(input) {
		const output = []

		while(input.length > 0) {
			const num = input.substring(0, 5)

			output.push(num.substring(1))

			input = input.substring(5)

			if(num.startsWith('0')) break
		}

		return { value: parseInt(output.join(''), 2), bits: input }
	},

	type_5: input => handlers.operator(input, values => values[0] > values[1] ? 1 : 0),

	type_6: input => handlers.operator(input, values => values[0] < values[1] ? 1 : 0),

	type_7: input => handlers.operator(input, values => values[0] == values[1] ? 1 : 0),

	operator: function(input, callable) {
		const lengthTypeID = input.substring(0, 1)
		const output = handlers[`operator_${lengthTypeID}`](input.substring(1))

		if(callable) {
			output.value = callable(output.values)
		}

		return output
	},

	// here value is the total length of the subpackets
	operator_0: function(input) {
		let { value, bits } = getSubPackets(input, 15)
		const subPackets = bits.substring(0, value)
		const { version, _, values } = exports.parsePackets(subPackets)

		return { version, bits: bits.substring(value), values }
	},

	// here value is the total number of subpackets
	operator_1: function(input) {
		let { value, bits } = getSubPackets(input, 11)

		return exports.parsePackets(bits, value)
	},
}


exports.convertHexToBin = input => input.split('').map(char => bitMap[char]).join('')

exports.parsePackets = (input, length) => {
	let iterations = 0
	let totalVersion = 0
	const values = []

	while(input && input.length) {
		const [version, typeID, tail] = getTypeAndVersion(input)

		input = tail
		totalVersion += version

		let key = `type_${typeID}`

		if(!(key in handlers)) {
			key = 'operator'
		}

		const output = handlers[key](input)

		if('value' in output) values.push(output.value)
		if(output.version) totalVersion += output.version

		input = output.bits

		if(input === '0'.repeat(input.length)) break
		if(length && ++iterations >= length) break
	}

	return { version: totalVersion, bits: input, values }
}

function getTypeAndVersion(input) {
	const version = parseInt(input.substring(0, 3), 2)
	const typeID = parseInt(input.substring(3, 6), 2)

	return [version, typeID, input.substring(6)]
}

function getSubPackets(input, len) {
	return {
		value: parseInt(input.substring(0, len), 2),
		bits: input.substring(len),
	}
}
