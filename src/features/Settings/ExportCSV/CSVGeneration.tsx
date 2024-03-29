import { useContext, useEffect, useState } from 'react'
// eslint-disable-next-line react-native/split-platform-components
import { Image, Platform, ToastAndroid, View } from 'react-native'
import { Button, Text, TouchableRipple } from 'react-native-paper'
import { i18n } from '@src/app/locale'
import * as FileSystem from 'expo-file-system'
import tw from '@src/libs/tailwind'

import AuthScreen from '@src/components/AuthScreen'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as Sharing from 'expo-sharing'

import { useSelector } from 'react-redux'
import { selectAllEntries } from '@store/slices/entriesSlice'

import { decrypt, formatDate } from '@src/common/utils'
import { OPMTypes } from '@src/common/types'
import { selectAllProfiles } from '@store/slices/profilesSlice'
import { ToastContext } from '@src/common/contexts/ToastContext'
import { FieldType, FieldTypes } from '@src/common/templates/entries'
import { selectAllCategories } from '@store/slices/categoriesSlice'
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '@src/app/routes'

import LoadingAnimation from '@src/components/LoadingAnimation'
import { ParamListBase, useNavigation } from '@react-navigation/native'
import Animated, { useSharedValue, withRepeat, FadeIn, withSpring } from 'react-native-reanimated'
import Content from '@src/components/Content'

type Props = NativeStackScreenProps<RootStackParamList, 'Settings:ExportCSV:CSVGeneration'>

export default function CSVGeneration({ route }: Props) {
	const { data } = route.params
	const sv = useSharedValue(0)

	const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()
	const { invokeToast } = useContext(ToastContext)

	const LoadingStatus = Object.freeze({
		INIT: 1,
		GENERATED: 2,
		COMPLETED: 3,
		ERROR: 4
	})

	const allEntries = useSelector(selectAllEntries)
	const allProfiles = useSelector(selectAllProfiles)
	const allCategories = useSelector(selectAllCategories)

	const isAndroid = Platform.OS === 'android'

	const [loadingStatus, setLoadingStatus] = useState<(typeof LoadingStatus)[keyof typeof LoadingStatus]>(
		LoadingStatus.INIT
	)
	const [generatedRecords, setGeneratedRecords] = useState<OPMTypes.ExportedCSVFile[] | undefined>()

	type CSVData = { profile: OPMTypes.Profile; data: CSVPerCategory }[]
	type CSVPerCategory = Record<string, { cols: string[]; rows: string[][] }>

	useEffect(() => {
		let timeoutId: string | number | NodeJS.Timeout | undefined
		async function onExport() {
			sv.value = withRepeat(withSpring(0), 5)

			const files = await buildCSVExport()
			setGeneratedRecords(files)

			timeoutId = setTimeout(() => {
				if (files?.length && files.length > 0) {
					setLoadingStatus(LoadingStatus.GENERATED)
				} else {
					setLoadingStatus(LoadingStatus.ERROR)
				}
			}, 13000)
		}

		async function buildCSVExport() {
			const { profileIds, key } = data
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

										if (key && entry.fieldsValues?.[f.id]) {
											const dVal = decrypt(entry.fieldsValues[f.id], key)
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
				return await saveCSVFilesToCache(generated)
			}
		}

		const saveCSVFilesToCache = async (
			data: { profile: OPMTypes.Profile; sheet: string }[]
		): Promise<OPMTypes.ExportedCSVFile[]> => {
			const files: OPMTypes.ExportedCSVFile[] = []
			const createdOn = formatDate(new Date(), 'dd_mm_yyyy')
			for (const { profile, sheet } of data) {
				const filename = `Export_${profile.name}_${createdOn}.csv`
				try {
					const fileUri = FileSystem.cacheDirectory + filename
					await FileSystem.writeAsStringAsync(fileUri, sheet, { encoding: FileSystem.EncodingType.UTF8 })
					const fileInfo = await FileSystem.getInfoAsync(fileUri)
					files.push({
						id: profile.id,
						success: true,
						profile: profile,
						filename: filename,
						fileUri: fileUri,
						fileInfo: fileInfo
					})
				} catch (e) {
					files.push({
						id: profile.id,
						success: false,
						profile: profile,
						error: 'Unable to generate csv for this profile'
					})
				}
			}
			return files
		}

		onExport()

		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId)
			}
		}
	}, [allCategories, allEntries, allProfiles, data, invokeToast])

	async function onShare(record: OPMTypes.ExportedCSVFile) {
		if (record.success && record.fileUri) {
			await Sharing.shareAsync(record.fileUri, { UTI: '.csv', mimeType: 'application/csv' })
		}
	}

	async function onDownload(record: OPMTypes.ExportedCSVFile) {
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

	function onDone() {
		navigation.popToTop()
	}

	return (
		<AuthScreen style={tw`flex-1 bg-white`}>
			<Content>
				{loadingStatus === LoadingStatus.INIT && (
					<View style={tw`flex-col p-14 items-center`}>
						<LoadingAnimation />
						<Text style={tw`text-lg text-neutral-600 font-bold text-center py-14`}>
							{i18n.t('settings:export:generated:label:generating')} ...
						</Text>
					</View>
				)}

				{loadingStatus === LoadingStatus.GENERATED && (
					<>
						<Animated.View entering={FadeIn} style={tw`flex-1 flex-col p-4`}>
							<Text style={tw`text-lg font-bold text-teal-800 p-1`}>
								{i18n.t('settings:export:generated:label:generated', { type: 'CSV' })}
							</Text>

							<Text style={tw`text-sm text-gray-500 px-1`}>Note: Store this in at a secure location</Text>

							<View style={tw`p-1`}>
								{generatedRecords?.map((record: OPMTypes.ExportedCSVFile) => {
									return (
										<View
											key={`gen-file-${record.id}`}
											style={tw.style('bg-white mt-3 border-2 rounded-2xl border-gray-300')}
										>
											<View style={tw`flex-row items-center justify-between p-1`}>
												{record.success && (
													<Text style={tw`font-bold text-gray-600 shrink-1 px-2`} numberOfLines={2}>
														{record.profile.name}
													</Text>
												)}

												{record.success && record.fileInfo.exists && (
													<View style={tw.style(`flex-row shrink-0`)}>
														<TouchableRipple
															style={tw`p-2 items-center justify-between rounded-xl mx-2`}
															rippleColor="rgba(0, 0, 0, .32)"
															onPress={() => onDownload(record)}
															borderless={true}
														>
															<>
																<MaterialCommunityIcons
																	name="download"
																	size={32}
																	color={tw.color('white')}
																	style={tw`p-2 rounded-lg bg-teal-500 mb-1`}
																/>
																<Text style={tw`text-xs font-bold text-gray-400`}>{i18n.t('label:download')}</Text>
															</>
														</TouchableRipple>
														<TouchableRipple
															style={tw`p-2 items-center justify-between rounded-xl`}
															rippleColor="rgba(0, 0, 0, .32)"
															onPress={() => onShare(record)}
															borderless={true}
														>
															<>
																<MaterialCommunityIcons
																	name="share-variant"
																	size={32}
																	color={tw.color('white')}
																	style={tw`p-2 rounded-lg bg-teal-500 mb-1`}
																/>
																<Text style={tw`text-xs font-bold text-gray-400`}>{i18n.t('label:share')}</Text>
															</>
														</TouchableRipple>
													</View>
												)}
											</View>
										</View>
									)
								})}
							</View>
						</Animated.View>
						<Button mode="contained" style={tw`m-10`} onPress={onDone}>
							{i18n.t('button:label:done')}
						</Button>
					</>
				)}

				{loadingStatus === LoadingStatus.ERROR && (
					<View style={tw`flex-1 flex-col items-center top-[5%] px-12`}>
						<View style={tw`rounded-full bg-red-100 p-14`}>
							<Image
								resizeMode="contain"
								style={tw`w-[80px] h-[80px]`}
								source={require('../../../../assets/images/icons/app/error-doc-64x64.png')}
							/>
						</View>
						<Text style={tw`text-xl text-neutral-500 font-bold text-center py-10`}>
							{i18n.t('settings:export:generated:error:generation')}
						</Text>
					</View>
				)}
			</Content>
		</AuthScreen>
	)
}
