#!/usr/local/bin/node
const { adder } = require('../utils')


class Tree {
	constructor() {
		this.children = []
		this.parent = null
		this.index = -1
	}

	get depth() {
		let node = this
		let count = 0

		while(node.parent !== null) {
			count++
			node = node.parent
		}

		return count
	}

	// go back up the tree and get the first available number
	addLeft(value) {
		let node = this

		while(node.parent !== null) {
			if(node.index - 1 >= 0) {
				const left = node.parent.children[node.index - 1]

				if(left instanceof Tree) {
					left.addLeft(value)
					return
				}
				else {
					node.parent.children[node.index - 1] += value
					return
				}
			}

			node = node.parent
		}
	}
	addRight(value, depth = 0) {
		let node = this

		while(node.parent !== null) {
			console.log(`${' '.repeat(depth)}addRight...`)
			console.log(`${' '.repeat(depth)}next index=${node.index + 1}`)
			console.log(`${' '.repeat(depth)}parent.length=${node.parent.children.length}`)
			console.log(`${' '.repeat(depth)}depth=${node.depth}`)

			if(node.index + 1 < node.parent.children.length) {
				const right = node.parent.children[node.index + 1]
console.log(`${' '.repeat(depth)}right`, right)
				if(right instanceof Tree) {
					console.log(`${' '.repeat(depth)}calling addRight`)
					right.addLeft(value, depth + 1)
					console.log('--')
					return
				}
				else {
					node.parent.children[node.index + 1] += value
					console.log(`${' '.repeat(depth)}assigning value: ${node.parent.children[node.index + 1]}`)
					console.log('--')
					return
				}
			}
			console.log(`${' '.repeat(depth)}checking parent`, node.parent !== null)
			depth++
			node = node.parent
		}
	}

	append(leaf) {
		if(leaf instanceof Tree) {
			leaf.parent = this
			leaf.index = this.children.length
		}

		this.children.push(leaf)
	}

	sum() {
		let redo = false

		do {
			redo = this._sum()
		} while(redo)
	}

	_sum() {
		let redo = false

		for(let i = 0, ilen = this.children.length; i < ilen; ++i) {
			const leaf = this.children[i]
//console.log(leaf, leaf.depth)
			if(leaf instanceof Tree) {
				// explode
				if(leaf.depth > 4) {
					console.log('explode', leaf.children)
					leaf.addLeft(leaf.children[0])
					leaf.addRight(leaf.children[1])
					leaf.parent = null
					leaf.index = -1

					this.children[i] = 0

					redo = true
				}
				else {
					const response = leaf._sum()

					if(response) redo = response
				}
			}
			else {
				// split
				if(leaf >= 10) {
					console.log('split')
					const left = Math.floor(leaf / 2)
					const right = Math.ceil(leaf / 2)
					const tree = new Tree()

					tree.append(left)
					tree.append(right)
					tree.parent = this
					tree.index = i

					this.children[i] = tree

					redo = true
				}
			}
		}

		return redo
	}

	get magnitude() {
		if(
			this.children.length === 2 &&
			!(this.children[0] instanceof Tree) &&
			!(this.children[1] instanceof Tree)
		) {
			return this.children[0] * 3 + this.children[1] * 2
		}

		let result = []

		this.children.forEach(leaf => {
			if(leaf instanceof Tree) {
				result.push(leaf.magnitude)
			}
			else {
				result.push(leaf)
			}
		})

		let count = 0

		for(let i = 0, ilen = result.length; i < ilen; i += 2) {
			if(i + 1 < ilen) {
				count += result[i] * 3 + result[i + 1] * 2
			}
			else {
				count += result[i]
			}
		}

		return count
	}

	// debug
	write() {
		let buffer = []

		this.children.forEach(leaf => {
			if(leaf instanceof Tree) {
				buffer.push('[' + leaf.write() + ']')
			}
			else {
				buffer.push(leaf)
			}
		})

		return buffer.join(',')
	}
}


let input = [
	/*{ test: '[[1,2],[[3,4],5]]', magnitude: 143 },
	{ test: '[[[[0,7],4],[[7,8],[6,0]]],[8,1]]', magnitude: 1384 },
	{ test: '[[[[1,1],[2,2]],[3,3]],[4,4]]', magnitude: 445 },
	{ test: '[[[[3,0],[5,3]],[4,4]],[5,5]]', magnitude: 791 },
	{ test: '[[[[5,0],[7,4]],[5,5]],[6,6]]', magnitude: 1137 },
	{ test: '[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]', magnitude: 3488 },
	{ test: '[[[[6,6],[7,6]],[[7,7],[7,0]]],[[[7,7],[7,7]],[[7,8],[9,9]]]]', magnitude: 4140 },*/
	{ test: '[[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]]', output: '[[[[0,7],4],[[7,8],[6,0]]],[8,1]]' },
	//{ test: '[[[[1,[4,3]]]]]', result: 14 },
	/*{ test: '[[[[[9,8],1],2],3],4]', output: '[[[[0,9],2],3],4]'},
	{ test: '[7,[6,[5,[4,[3,2]]]]]', output: '[7,[6,[5,[7,0]]]]'},
	{ test: '[[6,[5,[4,[3,2]]]],1]', output: '[[6,[5,[7,0]]],3]'},
	{ test: '[[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]]', output: '[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]'},
	{ test: '[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]', output: '[[3,[2,[8,0]]],[9,[5,[7,0]]]]'},*/
	//{ test: '[1,1,[[[[4,4]]]],1,1]', output: '[1,5,[[[0]]],5,1]'},
]
//let input = [10, 5, 3, 11]

input.forEach(test => {
	console.log('\n--\n')
	console.log(test.test)

	const tree = parseInput(test.test)

	tree.sum()

	if(test.magnitude) {
		logResult(tree.magnitude, test.magnitude)
	}

	if(test.output) {
		logResult(tree.write(), test.output)
	}
})

function logResult(result, expected) {
	const correct = result === expected

	console.log(`Result: ${result}`)
	console.log(`Matches?`, (correct ? correct : `\x1b[31m${correct}\x1b[0m`))

	if(!correct) {
		console.log(`EXPECTED: ${expected}`)
	}
}

/*
const test = `[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
[[[5,[2,8]],4],[5,[[9,9],0]]]
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
[[[[5,4],[7,7]],8],[[8,3],8]]
[[9,3],[[9,9],[6,[4,9]]]]
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]`.split('\n')

while(test.length > 0) {
	const line = test.shift()
	const tree = parseInput(line)

	tree.sum()

	if(test.length > 0) {
		test[0] = '[' + tree.write() + ',' + test[0] + ']'
	}
	else {
		console.log(tree.write())
		console.log(tree.magnitude)
	}
}
*/


//console.log(tree.write())
//console.log(tree.magnitude)









function parseInput(input) {
	let tree = new Tree()

	for(let i = 0, ilen = input.length; i < ilen; ++i) {
		const char = input[i]

		if(char === '[') {
			const leaf = new Tree()

			tree.append(leaf)
			tree = leaf
		}
		else if(char === ']') {
			if(!tree.parent) break

			tree = tree.parent
		}
		else if(char === ',') {
			continue
		}
		else {
			tree.append(parseInt(char))
		}
	}

	return tree
}
