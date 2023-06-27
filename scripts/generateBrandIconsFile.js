#! /usr/bin/env node

import fs from 'fs'
import brandIcons from './templates/brandIcons.js'

await main()

async function main() {
	//Assets from images icon folder
	const filenames = (await getFilenamesFromDir('./assets/images/icons/')).sort((a, b) => a < b)
	const fileContent = generateContent(filenames, brandIcons)
	await writeTofile(fileContent, 'brandIcons.ts')
}

function generateContent(filenames, existingList) {
	const prefixId = 'brandico-'
	const prefixPath = '../../../assets/images/icons/'

	let fileContent = ''
	let currentLastId = parseInt(existingList[existingList.length - 1]?.id?.replace(prefixId, ''))

	let arrContent = '['
	filenames.forEach((filename, idx) => {
		const displayName = getDisplayName(filename)
		const ic = existingList.find(item => item.displayName.toLowerCase() === displayName.toLowerCase())

		arrContent += `	{ id:'${
			ic?.id || prefixId + ++currentLastId
		}', displayName:'${displayName}', path: require('${prefixPath}${filename}'), sort:${idx} },\r\n`
	})

	arrContent = arrContent.slice(0, -1)
	arrContent += `]`

	fileContent = `const brandIcons = ${arrContent}\r\n\r\nexport default brandIcons`
	return fileContent
}

async function getFilenamesFromDir(path) {
	const validIconPrefix = 'icons8-'
	try {
		return fs
			.readdirSync(path, { withFileTypes: true })
			.filter(item => !item.isDirectory() && item.name.includes(validIconPrefix))
			.map(item => item.name)
	} catch (err) {
		console.error(err)
	}
}

async function writeTofile(fileContent, filename) {
	await fs.writeFile('./src/common/assets/' + filename, fileContent, err => {
		if (err) {
			console.error(err)
		}
		console.log('\x1b[32m%s\x1b[0m', 'File "src/common/assets/' + filename + '" is generated successfully.')
	})
}

function getDisplayName(filename) {
	let name = filename
	name = filename.split('icons8-')?.[1]?.split('-50')[0]
	const replaced = name.split('-')
	replaced.length = replaced.length > 1 ? 2 : 1
	const capitalized = replaced.map(a => a.charAt(0).toUpperCase() + a.substr(1))
	return capitalized.join(' ')
}
