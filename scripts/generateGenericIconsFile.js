#! /usr/bin/env node

import fs from 'fs'
import genericIcons from './templates/genericIcons.js'

await main()

async function main() {
	const fileContent = generateContent()
	await writeTofile(fileContent, 'genericIcons.ts')
}

function generateContent() {
	let fileContent = ''
	const prefixId = 'genicon-'
	const sorted = genericIcons.sort((a, b) => a.displayName.toLowerCase().localeCompare(b.displayName.toLowerCase()))

	const lastItem = genericIcons.sort((a, b) => a.id < b.id).slice(-1)[0]
	let currentLastId = parseInt(lastItem?.id.replace(prefixId, ''))

	let arrContent = '['
	sorted.forEach((ic, idx) => {
		arrContent += `	{ id:'${ic.id ? ic.id : prefixId + ++currentLastId}', displayName:'${ic.displayName}', name: '${
			ic.name
		}', color: tw.color('${ic.color}'), sort:${idx} },\r\n`
	})
	arrContent = arrContent.slice(0, -1)
	arrContent += `]`

	fileContent = `import tw from '@src/libs/tailwind'\r\n\r\nconst genericIcons = ${arrContent}\r\n\r\nexport default genericIcons`
	return fileContent
}

async function writeTofile(fileContent, filename) {
	await fs.writeFile('./src/common/assets/' + filename, fileContent, err => {
		if (err) {
			console.error(err)
		}
		console.log('\x1b[32m%s\x1b[0m', 'File "src/common/assets/' + filename + '" is generated successfully.')
	})
}
