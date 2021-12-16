#!/usr/local/bin/node
const { read } = require('../utils')
const { convertHexToBin, parsePackets } = require('./decoder')


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
