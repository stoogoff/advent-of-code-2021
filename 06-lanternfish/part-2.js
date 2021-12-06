#!/usr/local/bin/node

// Test data
//let fish = '3,4,3,1,2'.split(',').map(f => parseInt(f))
let fish = '5,1,1,3,1,1,5,1,2,1,5,2,5,1,1,1,4,1,1,5,1,1,4,1,1,1,3,5,1,1,1,1,1,1,1,1,1,4,4,4,1,1,1,1,1,4,1,1,1,1,1,5,1,1,1,4,1,1,1,1,1,3,1,1,4,1,4,1,1,2,3,1,1,1,1,4,1,2,2,1,1,1,1,1,1,3,1,1,1,1,1,2,1,1,1,1,1,1,1,4,4,1,4,2,1,1,1,1,1,4,3,1,1,1,1,2,1,1,1,2,1,1,3,1,1,1,2,1,1,1,3,1,3,1,1,1,1,1,1,1,1,1,3,1,1,1,1,3,1,1,1,1,1,1,2,1,1,2,3,1,2,1,1,4,1,1,5,3,1,1,1,2,4,1,1,2,4,2,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,4,3,1,2,1,2,1,5,1,2,1,1,5,1,1,1,1,1,1,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4,1,1,1,1,1,3,1,1,5,1,1,1,1,5,1,4,1,1,1,4,1,3,4,1,4,1,1,1,1,1,1,1,1,1,3,5,1,3,1,1,1,1,4,1,5,3,1,1,1,1,1,5,1,1,1,2,2'.split(',').map(f => parseInt(f))

const MAX_DAYS = 256

let result = 0
const cache = {
	5: 4368232009, // cached from failed runs
	1: 6206821033,
}

for(let i = 0; i < fish.length; ++i) {
	const f = fish[i]
	console.log(`Fish ${f} (index = ${i})`)

	if(f in cache) {
		console.log(`total from cache: ${cache[f]}`)
		result += cache[f]
	}
	else {
		const total = spawnsFish(f, MAX_DAYS - 1)
		console.log(`total: ${total}`)
		result += total
		cache[f] = total
	}
}


//result = spawnsFish(5, MAX_DAYS - 1, -1)

console.log(`Fish over ${MAX_DAYS} days: ${result}`)




function spawnsFish(age, days, depth) {
	const spawn = 7
	const firstSpawn = 9

	days -= age

	const children = 1 + parseInt(days / spawn)
	let result = 1 // the original fish

	if(days < 0) {
		return result
	}

	for(let i = 0; i < children; ++i) {
		const remainingDays = days - firstSpawn - (spawn * i)

		result += spawnsFish(0, remainingDays, depth)
	}	

	return result
}
