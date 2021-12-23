#!/usr/local/bin/node

// Test data
// Player 1 starting position: 4
// Player 2 starting position: 8

// Live data
// Player 1 starting position: 1
// Player 2 starting position: 2

class Cache {
	#cache = {}

	has(key) {
		return key in this.#cache
	}

	get(key) {
		return this.#cache[key]
	}

	set(key, value) {
		if(!this.has(key)) {
			this.#cache[key] = value
		}
	}

	static createKey(...key) {
		return key.join('_')
	}
}

const dice = [1,2,3]
let rolled = []

dice.forEach(a => dice.forEach(b => dice.forEach(c => rolled.push(a + b + c))))

//rolled = rolled.filter((v, i) => rolled.indexOf(v) === i)

console.log(rolled)
/*console.log(`Player 1: ${p1.score}`)
console.log(`Player 2: ${p2.score}`)
console.log(`Dice rolls: ${called}`)
console.log(`Result: ${called * Math.min(p1.score, p2.score)}`)*/

let iter = 21
let p1 = 1
let p2 = 2
const cache = new Cache()


//while(true) {
console.log(play(p1, p2, 0, 0))


//	if
//}



// p1 and p2 are the player starting values
function play(p1, p2, score1, score2) {
	const KEY = Cache.createKey(p1, p2, score1, score2)

	if(cache.has(KEY)) return cache.get(KEY)

	if(score2 >= 21) {
		const K1 = Cache.createKey(p1, p2, score1, score2)
		cache.set(K1, [0, 1])
		return [0, 1]
	}
	if(score1 >= 21) {
		const K2 = Cache.createKey(p1, p2, score1, score2)
		cache.set(K2, [1, 0])
		return [1, 0]
	}

	let wins1 = 0
	let wins2 = 0

	rolled.forEach(roll => {
		const move1 = position(p1, roll)
		const move2 = position(p2, roll)

		let [winL1, winL2] = play(p1, p2, score1 + move1, score2)
		let [winR1, winR2] = play(p1, p2, score1, score2 + move2)

		wins1 += winL1 + winL2
		wins2 += winR1 + winR2
	})

	return [wins1, wins2]
}

function position(current, roll) {
	let move = (current + roll) % 10

	if(move === 0) move = 10

	return move
}
