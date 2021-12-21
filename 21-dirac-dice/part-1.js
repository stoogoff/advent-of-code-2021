#!/usr/local/bin/node


class Player {
	constructor(name, start) {
		this.name = name
		this.position = start
		this.score = 0
	}

	move(amount) {
		let move = (this.position + amount) % 10

		if(move === 0) move = 10

		this.position = move
		this.score += this.position
	}
}

// Test data
//const p1 = new Player('p1', 4)
//const p2 = new Player('p2', 8)

const p1 = new Player('p1', 1)
const p2 = new Player('p2', 2)
const next = roll()
let current = p1
let called = 0

while(true) {
	current.move(next())

	if(current.score >= 1000) break

	current = current === p1 ? p2 : p1
}

console.log(`Player 1: ${p1.score}`)
console.log(`Player 2: ${p2.score}`)
console.log(`Dice rolls: ${called}`)
console.log(`Result: ${called * Math.min(p1.score, p2.score)}`)

function roll() {
	let dice = 1

	return () => {
		called += 3
		const rolled = dice * 3 + 3

		dice += 3

		return rolled
	}
}