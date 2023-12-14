import { Fragment, useContext, useEffect, useState } from 'react'

import { View, ScrollView, Alert } from 'react-native'
import { Text, Divider, TextInput as PaperTextInput, IconButton, Snackbar } from 'react-native-paper'

import tw from 'twrnc'
import { FieldType } from '@src/common/templates'
import { i18n } from '@src/app/locale'
import IconSelector from '@components/IconSelector'
import AddFieldForm from './AddFieldForm'
import { getMK } from '@src/store/slices/authSlice'

import { decrypt, encrypt, isEmpty } from '@src/common/utils'
import { useSelector } from 'react-redux'
import { selectUserSettings } from '@src/store/slices/settingSlice'
import * as Clipboard from 'expo-clipboard'
import * as ScreenCapture from 'expo-screen-capture'
import { ToastContext } from '@src/common/contexts/ToastContext'

type Props = {
	entry: {
		title: OPM.EntryTitle
		fieldsOptions: OPM.FieldsOptions
		fieldsValues: OPM.FieldsValues
		fields: OPM.Field[]
	}
	setTitle: React.Dispatch<React.SetStateAction<OPM.EntryTitle>>
	setFieldsOptions: React.Dispatch<React.SetStateAction<OPM.FieldsOptions>>
	setFieldsValues: React.Dispatch<React.SetStateAction<OPM.FieldsValues>>
	setFields: React.Dispatch<React.SetStateAction<OPM.Field[]>>
	editable: boolean
	onChangeIcon: (icon?: OPM.ComplexIcon) => void
}

type OptionalProps = {
	showCopy: boolean
	data: { copy: string }
	OnCopyPressed?: (msg: string) => void
	showRemove: boolean
	onRemovePressed?: () => void
}

const OptionalActions = (props: OptionalProps) => {
	const { showCopy = false, showRemove = false, data = { copy: '' }, OnCopyPressed, onRemovePressed } = props
	async function copyToClipboard() {
		if (data.copy) {
			await Clipboard.setStringAsync(data.copy)
			if (OnCopyPressed) {
				OnCopyPressed('Copied to clipboard')
			}
		}
	}

	return (
		<>
			{showCopy && data.copy ? <IconButton icon="content-copy" onPress={copyToClipboard} /> : null}
			{showRemove ? (
				<IconButton
					icon="close-circle"
					iconColor="grey"
					size={20}
					style={tw`font-bold p-0`}
					onPress={onRemovePressed}
				/>
			) : null}
		</>
	)
}

export default function EntryForm({
	entry: { title, fieldsOptions, fieldsValues, fields },
	setTitle,
	setFieldsOptions,
	setFieldsValues,
	setFields,
	editable = false,
	onChangeIcon
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
Props) {
	const { invokeToast } = useContext(ToastContext)
	const mk = useSelector(getMK)
	const { allowCopy, allowScreenCapture, defaultHidePassword } = useSelector(selectUserSettings)

	console.log('defaultHidePassword', defaultHidePassword)

	useEffect(() => {
		async function init() {
			if (!allowScreenCapture) {
				await ScreenCapture.preventScreenCaptureAsync()
			}
		}
		init()
	}, [allowScreenCapture])

	function getFieldComponent(f: OPM.Field) {
		let component
		const value = fieldsValues[f.id] || ''

		// Decrypt value
		const decrypted = !isEmpty(value) ? decrypt(value, mk) : ''

		switch (f.fieldType) {
			case FieldType.TextInput:
				component = (
					<PaperTextInput
						mode={editable ? 'outlined' : 'flat'}
						editable={editable}
						value={decrypted}
						onChangeText={val => onChangeValue(f, val)}
						placeholder={f.placeholder}
						style={tw.style(`flex-1 bg-transparent justify-center`, !f.fieldOptions?.multiline && 'h-9')}
						contentStyle={tw`border-0 px-2`}
						underlineColor="transparent"
						activeUnderlineColor="hwb(360, 100%, 100%)"
						multiline={f.fieldOptions?.multiline}
					/>
				)
				break
			case FieldType.Password:
				component = (
					<PaperTextInput
						mode={editable ? 'outlined' : 'flat'}
						editable={editable}
						value={decrypted}
						onChangeText={val => onChangeValue(f, val)}
						placeholder={f.placeholder}
						style={tw.style(`flex-1 bg-transparent justify-center`, !f.fieldOptions?.multiline && 'h-10')}
						contentStyle={tw`border-0 px-2`}
						underlineColor="transparent"
						activeUnderlineColor="hwb(360, 100%, 100%)"
						secureTextEntry={fieldsOptions[f.id]?.isSecure || defaultHidePassword}
						right={
							<PaperTextInput.Icon
								icon={fieldsOptions[f.id]?.isSecure || defaultHidePassword ? 'eye-off' : 'eye'}
								style={tw`p-0 m-0 mt-[8]`}
								onPress={() =>
									setFieldsOptions({
										...fieldsOptions,
										[f.id]: {
											...(fieldsOptions[f.id] || {}),
											isSecure: !fieldsOptions[f.id]?.isSecure
										}
									})
								}
							/>
						}
					/>
				)
				break
			case FieldType.TextArea:
				component = (
					<PaperTextInput
						mode={editable ? 'outlined' : 'flat'}
						editable={editable}
						value={decrypted}
						onChangeText={val => onChangeValue(f, val)}
						placeholder={f.placeholder}
						style={tw.style(`flex-1 bg-transparent justify-center`)}
						contentStyle={tw`border-0 px-2`}
						underlineColor="transparent"
						activeUnderlineColor="hwb(360, 100%, 100%)"
						multiline={true}
					/>
				)
				break
		}
		return { field: component, value: decrypted }
	}

	function onChangeValue(field: OPM.Field, value: string) {
		const encrypted = encrypt(value || '', mk)
		setFieldsValues(o => ({ ...o, [field.id]: encrypted }))
	}

	function onRemoveField(field: OPM.Field) {
		Alert.alert(
			i18n.t('prompt:entry:form:field:remove:title'),
			i18n.t('prompt:entry:form:field:remove:message', { fieldname: field.label }),
			[
				{ text: i18n.t('button:label:cancel') },
				{
					text: i18n.t('button:label:yes'),
					onPress: () => {
						setFields(o => {
							const updatedFields = o.filter((f: { id: string | number }) => f.id !== field.id)
							return updatedFields
						})
						setFieldsValues((o: OPM.FieldsValues) => {
							const clone = { ...o }
							delete clone[field.id]
							return { ...clone }
						})
					}
				}
			]
		)
	}

	function onAddField(field: OPM.Field) {
		setFields((o: OPM.Field[]) => [...o, field])
		setFieldsValues((o: OPM.FieldsValues) => ({ ...o, [field.id]: '' }))
	}

	return (
		<>
			<ScrollView
				nestedScrollEnabled={true}
				showsVerticalScrollIndicator={true}
				style={tw`w-full h-full`}
				contentContainerStyle={tw.style(`flex`)}
			>
				<View style={tw`w-full px-2 py-0 bg-white`}>
					<View style={tw`flex py-2 flex-row items-center`}>
						<IconSelector
							bordered={editable}
							editable={editable}
							size={40}
							icon={title.icon}
							name={title.name}
							onChangeIcon={onChangeIcon}
						/>

						<PaperTextInput
							dense
							mode={editable ? 'outlined' : 'flat'}
							editable={editable}
							value={title.name}
							onChangeText={text => setTitle({ ...title, name: text })}
							style={tw.style(`flex-1 justify-center text-5 bg-transparent`, !editable && 'font-bold')}
							contentStyle={tw.style(!editable && 'pl-1')}
							error={title.name.trim() === ''}
							underlineColor="transparent"
							activeUnderlineColor="transparent"
							placeholder={i18n.t('entry:form:field:input:placeholder:title')}
							focusable={true}
							right={
								editable && title.name.length > 0 ? (
									<PaperTextInput.Icon
										icon="close-circle-outline"
										forceTextInputFocus={true}
										onPress={() => setTitle({ ...title, name: '' })}
									/>
								) : null
							}
						/>
					</View>
					{/* eslint-disable-next-line react-native/no-inline-styles */}
					<Divider style={{ borderBottomWidth: 1, borderColor: tw.color('teal-700') }} />

					{/* Render fields */}
					{fields.map((f: OPM.Field, index: number) => {
						const { field, value } = getFieldComponent(f)

						return field ? (
							<Fragment key={`f-${index}-${f.id}`}>
								<View style={tw`flex-col justify-center pb-2`}>
									<Text style={tw`text-3 pl-2 py-1 font-bold`}>{f.label}</Text>

									<View style={tw`flex-row items-center`}>
										<View style={tw`flex-1`}>{field}</View>
										{/* {renderReadOnlyIcons(f.id)} */}
										<OptionalActions
											showRemove={editable}
											showCopy={!editable && allowCopy}
											data={{ copy: value }}
											OnCopyPressed={message => invokeToast(message)}
											onRemovePressed={() => onRemoveField(f)}
										/>
									</View>
								</View>
								<Divider
									// eslint-disable-next-line react-native/no-inline-styles
									style={{ borderBottomWidth: 0.8, borderColor: tw.color(editable ? 'stone-300' : 'stone-700') }}
								/>
							</Fragment>
						) : null
					})}

					{/* Editable mode: To allow adding of fields */}
					{editable && <AddFieldForm onAddField={onAddField} />}
				</View>
			</ScrollView>
		</>
	)
}
