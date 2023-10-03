import { useContext, useEffect, useState } from 'react'
// eslint-disable-next-line react-native/split-platform-components
import { Platform, ToastAndroid, View } from 'react-native'
import { Text, TouchableRipple, ActivityIndicator } from 'react-native-paper'
import { i18n } from '@src/app/locale'
import * as FileSystem from 'expo-file-system'
import tw from 'twrnc'

import AuthScreen from '@src/components/AuthScreen'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as Sharing from 'expo-sharing'

import { useSelector } from 'react-redux'
import { selectAllEntries } from '../../store/slices/entriesSlice'

import { decrypt, formatDate } from '@src/common/utils'
import { OPMTypes } from '@src/common/types'
import { selectAllProfiles } from '../../store/slices/profilesSlice'
import { ToastContext } from '@src/common/contexts/ToastContext'
import { FieldType, FieldTypes } from '@src/common/templates/entries'
import { selectAllCategories } from '../../store/slices/categoriesSlice'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '@src/app/routes'

type Props = NativeStackScreenProps<RootStackParamList, 'Settings:ExportGeneration'>

export default function ExportGeneration({ route }: Props) {
	const { type, data } = route.params

	const { invokeToast } = useContext(ToastContext)

	const allEntries = useSelector(selectAllEntries)
	const allProfiles = useSelector(selectAllProfiles)
	const allCategories = useSelector(selectAllCategories)

	const isAndroid = Platform.OS === 'android'

	const [isLoading, setIsLoading] = useState(true)
	const [generatedRecords, setGeneratedRecords] = useState<OPMTypes.ExportedFile[] | undefined>()
	const [selectedRecord, setSelectRecord] = useState<OPMTypes.ExportedFile>()

	type CSVData = { profile: OPMTypes.Profile; data: CSVPerCategory }[]
	type CSVPerCategory = Record<string, { cols: string[]; rows: string[][] }>

	useEffect(() => {
		async function onExport() {
			setIsLoading(true)
			if (type === 'csv') {
				const files = await buildCSVExport()
				setGeneratedRecords(files)
			}
			setIsLoading(false)
		}

		async function buildCSVExport() {
			const { profileIds, hsPwd } = data
			const arrCSVData: CSVData = []
			try {
				for (const profile of allProfiles) {
					if (profileIds.includes(profile.id)) {
						const entriesIds = profile.entries || []

						if (entriesIds.length) {
							const csvData: CSVPerCategory = {}
							const filteredEntries = allEntries.filter(item => entriesIds.includes(item.id))

							filteredEntries.forEach((entry: OPMTypes.Entry) => {
								const category = allCategories.find(c => c.id === entry.category.id)
								if (!category) return

								const groupName = category.name
								let rowIdx = 0
								let group = csvData[groupName]
								if (!group) {
									group = { cols: ['Category', 'Title'], rows: [] }
								}
								group.rows.push([groupName, entry.title.name])
								rowIdx = group.rows.length - 1

								entry.fields.forEach(f => {
									let colIdx = group.cols.indexOf(f.label, 1)
									if (FieldTypes[f.fieldType as FieldType].isFormField) {
										if (colIdx === -1) {
											group.cols.push(f.label)
											colIdx = group.cols.length - 1
										}

										if (entry.fieldsValues?.[f.id]) {
											const dVal = decrypt(entry.fieldsValues[f.id], hsPwd)
											group.rows[rowIdx][colIdx] = dVal
										}
									}
								})
								csvData[groupName] = group
							})
							arrCSVData.push({ profile: profile, data: csvData })
						} else {
							arrCSVData.push({ profile: profile, data: {} })
						}
					}
				}
				return await buildCSVFormat(arrCSVData)
			} catch (e) {
				invokeToast('There was a issue with the generation of your export')
			}
		}

		async function buildCSVFormat(arrCsvData: CSVData) {
			if (arrCsvData.length) {
				const generated = []
				for (const sheetData of arrCsvData) {
					let sheet = ``
					const { profile, data } = sheetData
					sheet += `Profile:,${profile.name}\r\n\r\n`

					for (const [key, value] of Object.entries(data)) {
						sheet += value.cols.join() + '\r\n'
						for (const row of value.rows) {
							sheet += row.join() + '\r\n'
						}
						sheet += `\r\n`
					}
					generated.push({ profile: profile, sheet })
				}
				return await saveCSVFilesToCache(generated, 'csv')
			}
		}

		const saveCSVFilesToCache = async (
			data: { profile: OPMTypes.Profile; sheet: string }[],
			type: 'csv'
		): Promise<OPMTypes.ExportedFile[]> => {
			const files: OPMTypes.ExportedFile[] = []
			const createdOn = formatDate(new Date(), 'dd_mm_yyyy')
			for (const { profile, sheet } of data) {
				const filename = `Export_${profile.name}_${createdOn}.csv`
				try {
					const fileUri = FileSystem.cacheDirectory + filename
					await FileSystem.writeAsStringAsync(fileUri, sheet, { encoding: FileSystem.EncodingType.UTF8 })
					const fileInfo = await FileSystem.getInfoAsync(fileUri)
					files.push({
						id: profile.id,
						type: type,
						success: true,
						profile: profile,
						filename: filename,
						fileUri: fileUri,
						fileInfo: fileInfo
					})
				} catch (e) {
					if (type === 'csv') {
						files.push({
							id: profile.id,
							type: type,
							success: false,
							profile: profile,
							error: 'Unable to generate csv for this profile'
						})
					}
				}
			}
			return files
		}

		onExport()
	}, [allCategories, allEntries, allProfiles, data, invokeToast, type])

	async function onShare(record: OPMTypes.ExportedFile) {
		if (record.success && record.fileUri) {
			await Sharing.shareAsync(record.fileUri, { UTI: '.csv', mimeType: 'application/csv' })
		}
	}

	async function onDownload(record: OPMTypes.ExportedFile) {
		console.log('ondownload', record)
		setSelectRecord(record)
		if (record.success) {
			if (isAndroid) {
				const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync(
					FileSystem.documentDirectory
				)

				if (permissions.granted) {
					// Gets SAF URI from response
					const destinationUri = permissions.directoryUri

					// Gets all files inside of selected directory
					await FileSystem.StorageAccessFramework.readDirectoryAsync(destinationUri)
					await copySAFFileTo(record.fileUri, destinationUri, record.filename)
				}
			} else {
				// For ios, use the share functionality instead
				await onShare(record)
			}
		}
	}

	async function copySAFFileTo(from: string, to: string, filename: string) {
		try {
			const fileCreatedUri = await FileSystem.StorageAccessFramework.createFileAsync(to, filename, 'application/csv')
			const content = await FileSystem.readAsStringAsync(from, { encoding: 'base64' })
			await FileSystem.writeAsStringAsync(fileCreatedUri, content, { encoding: 'base64' })
			ToastAndroid.show(i18n.t('settings:export:generated:toast:saved'), ToastAndroid.SHORT)
		} catch (e) {
			console.log('[Error] Saving file to selected folder', e)
		}
	}

	return (
		<AuthScreen style={tw`p-4`}>
			{isLoading ? (
				<View style={tw`justify-center self-center p-2`}>
					<ActivityIndicator animating={true} size="large" />
					<Text style={tw`text-lg font-bold text-center pt-4`}>
						{i18n.t('settings:export:generated:label:generating')}...
					</Text>
				</View>
			) : !generatedRecords ? (
				<Text style={tw`text-base font-bold text-gray-900 pt-2`}>
					{i18n.t('settings:export:generated:error:generation')}
				</Text>
			) : (
				<>
					<Text style={tw`text-xl font-bold text-gray-900 p-1`}>
						{i18n.t('settings:export:generated:label:generated', { type: type.toUpperCase() })}
					</Text>

					<View style={tw`rounded-lg p-1`}>
						{/* <RadioButton.Group onValueChange={newValue => setFileFormat(newValue)} value={fileFormat}> */}
						{generatedRecords.map((record: OPMTypes.ExportedFile) => {
							return (
								<View
									key={`gen-file-${record.id}`}
									style={tw.style('bg-white mt-2 border-2 rounded-lg border-slate-300')}
								>
									<View style={tw`p-2`}>
										<View style={tw`flex flex-row items-center justify-between flex-wrap`}>
											{record.success && record.type === 'csv' && (
												<Text style={tw`font-bold text-lg flex`}>Profile: {record.profile.name}</Text>
											)}

											{record.success && record.fileInfo.exists && (
												<View style={tw.style(`flex-row items-center`)}>
													<View style={tw.style(`flex-col`, { flexShrink: 1 })}>
														<Text>Filename: {record.filename}</Text>
														<Text>File Size: {record.fileInfo.size} bytes</Text>
													</View>

													<View style={tw`flex-row`}>
														<TouchableRipple
															style={tw`p-2 items-center justify-center`}
															rippleColor="rgba(0, 0, 0, .32)"
															onPress={() => onDownload(record)}
														>
															<>
																<MaterialCommunityIcons
																	name="download"
																	size={32}
																	color={tw.color('teal-600')}
																	style={tw`w-[9] text-center`}
																/>
																<Text style={tw`font-bold`}>{i18n.t('label:download')}</Text>
															</>
														</TouchableRipple>

														<TouchableRipple
															style={tw`p-2 items-center justify-center`}
															rippleColor="rgba(0, 0, 0, .32)"
															onPress={() => onShare(record)}
														>
															<>
																<MaterialCommunityIcons
																	name="share"
																	size={32}
																	color={tw.color('teal-600')}
																	style={tw`w-[9] text-center`}
																/>
																<Text style={tw`font-bold`}>{i18n.t('label:share')}</Text>
															</>
														</TouchableRipple>
													</View>
												</View>
											)}
										</View>
									</View>
								</View>
							)
						})}
					</View>
				</>
			)}
		</AuthScreen>
	)
}
