import { useEffect, useState } from 'react'
import * as FileSystem from 'expo-file-system'
import { Asset } from 'expo-asset'

export const useAssetContent = (file: number | number[] | string | string[]) => {
	const [content, setContent] = useState<string | null>(null)

	useEffect(() => {
		const loadFile = async () => {
			const [{ localUri }] = await Asset.loadAsync(file)
			if (localUri) {
				const content = await FileSystem.readAsStringAsync(localUri)
				setContent(content)
			}
		}

		loadFile()
	}, [file])

	return content
}
