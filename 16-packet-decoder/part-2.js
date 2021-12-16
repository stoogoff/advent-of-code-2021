#!/usr/local/bin/node
const { read } = require('../utils')
const { convertHexToBin, parsePackets } = require('./decoder')

// Test data
/*const testData = {
	'C200B40A82'    : 3, // finds the sum of 1 and 2, resulting in the value 3.
	'04005AC33890'  : 54, // finds the product of 6 and 9, resulting in the value 54.
	'880086C3E88112': 7, // finds the minimum of 7, 8, and 9, resulting in the value 7.
	'CE00C43D881120': 9, // finds the maximum of 7, 8, and 9, resulting in the value 9.
	'D8005AC2A8F0'  : 1, // produces 1, because 5 is less than 15.
	'F600BC2D8F'    : 0, // produces 0, because 5 is not greater than 15.
	'9C005AC2F8F0'  : 0, // produces 0, because 5 is not equal to 15.
	'9C0141080250320F1802104A08': 1, // produces 1, because 1 + 3 = 2 * 2.
}

Object.keys(testData).forEach(key => {
	let bits = convertHexToBin(key)

	console.log(key)

	const output = parsePackets(bits)

	console.log(`Result: ${output.values[0]} (${output.values[0] === testData[key]})`)

	if(output.values[0] !== testData[key]) console.log(output)
})*/

const input = convertHexToBin(read('16-packet-decoder/data'))
const output = parsePackets(input)


console.log(`Result: ${output.values[0]}`)

