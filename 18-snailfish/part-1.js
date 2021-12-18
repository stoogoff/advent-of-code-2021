#!/usr/local/bin/node

/*let input = `[1,2]
[[1,2],3]
[9,[8,7]]
[[1,9],[8,5]]
[[[[1,2],[3,4]],[[5,6],[7,8]]],9]
[[[9,[3,8]],[[0,9],6]],[[[3,7],[4,9]],3]]
[[[[1,3],[5,3]],[[1,3],[8,7]]],[[[4,9],[6,9]],[[8,2],[7,3]]]]`.split('\n').map(line => eval(line))*/

let input = [
	{ test: [[1,2],[[3,4],5]], result: 143 },
	{ test: [[[[0,7],4],[[7,8],[6,0]]],[8,1]], result: 1384 },
	{ test: [[[[1,1],[2,2]],[3,3]],[4,4]], result: 445 },
	{ test: [[[[3,0],[5,3]],[4,4]],[5,5]], result: 791 },
	{ test: [[[[5,0],[7,4]],[5,5]],[6,6]], result: 1137 },
	{ test: [[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]], result: 3488 },
	{ test: [[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]], result: 14 },
]
//let input = [10, 5, 3, 11]

input.forEach(test => {
	const input = recurse(test.test, 1)
	const result = getMagnitude(input)

	console.log(JSON.stringify(input))

	const correct = result === test.result

	console.log(`Result: ${result}`, (correct ? correct : `\x1b[31m${correct}\x1b[0m`))
})

function recurse(input, depth) {
	const newInput = []

	for(let i = 0, ilen = input.length; i < ilen; ++i) {
		const val = input[i]

		// explode
		if(Array.isArray(val) && depth === 4) {
			console.log(`${' '.repeat(depth)}explode, ${JSON.stringify(val)}`)
			// left
			// TODO this needs to look back up the chain for any numeric left value to increase
			if(i > 0 && !Array.isArray(newInput[i - 1])) {
				newInput[i - 1] += val[0]
				val[0] = 0
				console.log(`${' '.repeat(depth)}left: ${newInput[i - 1]}`)
			}

			// right
			// TODO same with this, which means recursion isn't the right approach
			if(i + 1 < ilen && !Array.isArray(input[i + 1])) {
				input[i + 1] += val[1]
				val[1] = 0
				console.log(`${' '.repeat(depth)}right: ${input[i + 1]}`)
			}

			newInput.push(0)
		}
		// recurse
		else if(Array.isArray(val)) {
			console.log(`${' '.repeat(depth)}recurse, ${JSON.stringify(val)}`)

			const result = recurse(val, depth + 1)

			console.log(`${' '.repeat(depth)}result: ${JSON.stringify(result)}`)			

			newInput.push(result)
		}
		// split
		else if(val >= 10) {
			console.log(`${' '.repeat(depth)}split, ${JSON.stringify(val)}`)
			const left = Math.floor(val / 2)
			const right = Math.ceil(val / 2)

			console.log(`${' '.repeat(depth)}new pair: ${JSON.stringify([left, right])}`)

			newInput.push([left, right])
		}
		else {
			newInput.push(val)
		}
	}

	return newInput
}

function getMagnitude(input) {
	let result = 0
	let breaker = 100

	while(true) {
		if(Array.isArray(input[0])) {
			input = input[0]
		}
		else {
			result = input[0] * 3 + input[1] * 2
			break
		}

		if(--breaker <= 0) break
	}

	return result
}
