#!/usr/local/bin/node
const { readFile } = require('../utils')


// Test data
/*const input = `start-A
start-b
A-c
A-b
b-d
A-end
b-end`.split('\n')*/

/*const input = `fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW`.split('\n')*/

const input = readFile('12-passage-pathing/data')

const complete = parseMap(input)

console.log(complete.map(path => path.join(',')).join('\n'))

console.log(`Result: ${complete.length}`)


function parseMap(input) {
	const nodes = {}

	input.forEach(line => {
		const [start, end] = line.split('-')

		if(!nodes[start]) {
			nodes[start] = []
		}
		
		if(!nodes[end]) {
			nodes[end] = []
		}

		nodes[start].push(end)
		nodes[end].push(start)
	})

	let paths = [['start']]
	let complete = []

	while(paths.length) {
		let path = paths.pop()
		let last = path[path.length - 1]

		nodes[last].forEach(cave => {
			if(cave == 'end') {
				complete.push([...path, cave])
			}
			else if(/[A-Z]/.test(cave) || path.indexOf(cave) === -1) {
				paths.push([...path, cave])
			}
			else if(cave !== 'start' && path.filter(chunk => chunk === cave).length < 2) {
				const valueCount = path.filter(chunk => /^[a-z]{1,2}$/.test(chunk)).reduce((obj, val) => {
					if(!(val in obj)) {
						obj[val] = 0
					}

					++obj[val]

					return obj
				}, {})

				if(Object.values(valueCount).filter(val => val >= 2).length === 0) {
					paths.push([...path, cave])
				}
			}
		})
	}

	return complete
}
