#!/usr/local/bin/node
const { read } = require('../utils')

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

	operator: function(input) {
		const lengthTypeID = input.substring(0, 1)

		return handlers[`operator_${lengthTypeID}`](input.substring(1))
	},

	// here value is the total length of the subpackets
	operator_0: function(input) {
		let { value, bits } = getSubPackets(input, 15)
		const subPackets = bits.substring(0, value)
		const { version, _ } = parsePackets(subPackets)

		return { version, bits: bits.substring(value) }
	},

	// here value is the total number of subpackets
	operator_1: function(input) {
		let { value, bits } = getSubPackets(input, 11)

		return parsePackets(bits, value)
	},
}

// Test data
/*const testData = {
	'D2FE28'                        : 6,  // first test
	'38006F45291200'                : 9,  // operator 0 packet
	'EE00D40C823060'                : 14, // operator 1 packet
	'8A004A801A8002F478'            : 16,
	'620080001611562C8802118E34'    : 12, // this failed
	'C0015000016115A2E0802F182340'  : 23, // this failed
	'A0016C880162017C3686B18A3D4780': 31, 
}


Object.keys(testData).forEach(key => {
	let bits = convertHexToBin(key)

	console.log(key)

	const output = parsePackets(bits)

	console.log(`Result: ${output.version}`)
	console.log(output.version === testData[key])
})*/

const input = convertHexToBin(read('16-packet-decoder/data'))
const output = parsePackets(input)

console.log(`Result: ${output.version}`)


function convertHexToBin(input) {
	return input.split('').map(char => bitMap[char]).join('')
}

function parsePackets(input, length) {
	let iterations = 0
	let totalVersion = 0

	while(input && input.length) {
		const [version, typeID, tail] = getTypeAndVersion(input)

		input = tail
		totalVersion += version

		let key = `type_${typeID}`

		if(!(key in handlers)) {
			key = 'operator'
		}

		const output = handlers[key](input)

		if(output.value) console.log(`Output: ${output.value}`)
		if(output.version) totalVersion += output.version

		input = output.bits

		if(input === '0'.repeat(input.length)) break
		if(length && ++iterations >= length) break
	}

	return { version: totalVersion, bits: input }
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