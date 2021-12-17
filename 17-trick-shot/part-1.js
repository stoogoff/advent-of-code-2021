#!/usr/local/bin/node

class Point {
	constructor(x, y) {
		this.x = x
		this.y = y
	}

	add(point) {
		return new Point(this.x + point.x, this.y + point.y)
	}

	distance(point) {
		const dx = this.x - point.x
		const dy = this.y - point.y

		return Math.sqrt(dx * dx + dy * dy)
	}
}

class Trajectory {
	constructor(vx, vy) {
		this.maxHeight = 0
		this.position = new Point(0, 0)
		this.lastPosition = this.position

		if(vx instanceof Point) {
			this.velocity = vx
		}
		else {
			this.velocity = new Point(vx, vy) // I know!
		}
		this.startingVelocity = this.velocity
		this.hitTarget = false
	}

	move() {
		this.lastPosition = this.position
		this.position = this.position.add(this.velocity)
		this.maxHeight = Math.max(this.position.y, this.maxHeight)

		let vx = this.velocity.x
		let newx = 0

		if(vx > 0) {
			newx = -1
		}
		else if(vx < 0) {
			newx = 1
		}

		this.velocity = this.velocity.add(new Point(newx, -1))
	}

	hasMovedCloser(target) {
		const d1 = this.position.distance(target)
		const d2 = this.lastPosition.distance(target)

		return d1 < d2
	}
}

class Rectangle {
	constructor(x1, y1, x2, y2) {
		const minX = Math.min(x1, x2)
		const maxX = Math.max(x1, x2)
		const minY = Math.min(y1, y2)
		const maxY = Math.max(y1, y2)

		this.position = new Point(minX, minY)
		this.width = maxX - minX
		this.height = maxY - minY
	}

	contains(point) {
		return (
			point.x >= this.left &&
			point.x <= this.right &&
			point.y >= this.top &&
			point.y <= this.bottom
		)
	}

	get top() {
		return this.position.y
	}

	get right() {
		return this.position.x + this.width
	}

	get bottom() {
		return this.position.y + this.height
	}

	get left() {
		return this.position.x
	}

	get centre() {
		return new Point(this.left + this.width / 2, this.top + this.height / 2)
	}
}

//console.log('target area: x=96..125, y=-144..-98')
const target = new Rectangle(96, -144, 125, -98)

// Test target
//target area: x=20..30, y=-10..-5
//const target = new Rectangle(20, -10, 30, -5)

const CENTRE = target.centre

console.log(target)
console.log('centre=', CENTRE)
console.log(`top: ${target.top}`)
console.log(`right: ${target.right}`)
console.log(`bottom: ${target.bottom}`)
console.log(`left: ${target.left}`)

// create some probes
const probes = []
const MAX_VELOCITY = 250

for(let y = -MAX_VELOCITY; y < MAX_VELOCITY; ++y) {
	for(let x = 0; x < MAX_VELOCITY; ++x) {
		probes.push(new Trajectory(x, y))
	}
}

// Test probes
//probes.push(new Trajectory(7, 2))
//probes.push(new Trajectory(6, 3))
//probes.push(new Trajectory(17, -4))
//probes.push(new Trajectory(6, 9))

console.log(`\nFiring ${probes.length} probes...`)


probes.forEach((probe, idx) => {
	let limit = 300

	while(true) {
		probe.move()

		if(target.contains(probe.position)) {
			probe.hitTarget = true
			break
		}

		/*if(!probe.hasMovedCloser(CENTRE)) {
			break
		}*/

		if(--limit <= 0) break
	}
})

const hits = probes.filter(probe => probe.hitTarget)
const heighest = Math.max(...hits.map(probe => probe.maxHeight))

console.log(`${hits.length} probes hit the target. The heighest reached ${heighest}.\n`)

console.log(hits.filter(probe => probe.maxHeight === heighest))
