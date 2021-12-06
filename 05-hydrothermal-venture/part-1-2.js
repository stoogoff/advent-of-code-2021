#!/usr/local/bin/node
const fs = require('fs')
const path = require('path')

class Point {
	constructor(x, y) {
		this.x = x
		this.y = y
	}

	toString() {
		return `{Point: ${this.x}, ${this.y}}`
	}

	static Parse(input) {
		const [x, y] = input.split(',')

		return new Point(x ,y)
	}
}

class Line {
	constructor(start, end) {
		this.start = start
		this.end = end
	}

	intersects(point) {
		const dxc = point.x - this.start.x
		const dyc = point.y - this.start.y

		const dxl = this.end.x - this.start.x
		const dyl = this.end.y - this.start.y

		const cross = dxc * dyl - dyc * dxl

		if(cross !== 0) return false

		if(Math.abs(dxl) >= Math.abs(dyl)) {
			return dxl > 0 ? 
				this.start.x <= point.x && point.x <= this.end.x :
				this.end.x <= point.x && point.x <= this.start.x
		}
		else {
			return dyl > 0 ? 
				this.start.y <= point.y && point.y <= this.end.y :
				this.end.y <= point.y && point.y <= this.start.y
		}
	}

	isHorizontalOrVertical() {
		return this.start.x === this.end.x || this.start.y === this.end.y
	}
}

/*const input = `0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2`*/

const input = fs.readFileSync(path.join(__dirname, 'data'), 'utf8').trim()

const data = parseInput(input)
const max = getSize(data)
const hv = data//.filter(line => line.isHorizontalOrVertical())

let output = []
let totalBad = 0

for(let y = 0, ylen = max.y; y <= ylen; ++y) {
	for(let x = 0, xlen = max.x; x <= xlen; ++x) {
		const p = new Point(x, y)
		const total = hv.filter(line => line.intersects(p)).length

		output.push(total)

		if(total > 1) ++totalBad
	}

	output.push('\n')
}

//console.log(output.join('') + '\n')
console.log(`result = ${totalBad}`)


function getSize(input) {
	const end = new Point(0,0)

	input.forEach(line => {
		end.x = Math.max(end.x, line.start.x, line.end.x)
		end.y = Math.max(end.y, line.start.y, line.end.y)
	})

	return end
}

function parseInput(input) {
	return input.split('\n').map(line => {
		const [a, b] = line.split(' -> ')

		return new Line(Point.Parse(a), Point.Parse(b))
	})
}