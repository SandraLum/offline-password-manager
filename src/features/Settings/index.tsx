import { useState } from 'react'
import { View } from 'react-native'
import { Text, Searchbar, List } from 'react-native-paper'

import { i18n } from '@src/app/locale'
import tw from 'twrnc'
import Container from '@src/components/Container'
import Screen from '@src/components/Screen'
import Content from '@src/components/Content'

export default function Settings() {
	return (
		<Screen>
			<Container>
				<Content horizontal={false}>
					<View style={tw`flex justify-center`}>
						<List.Section>
							<List.Subheader>General</List.Subheader>
							<List.Item title="Theme mode" left={props => <List.Icon {...props} icon="theme-light-dark" />} />
							<List.Item title="Change theme" left={props => <List.Icon {...props} icon="palette" />} />
							<List.Item title="Language" left={props => <List.Icon {...props} icon="globe-model" />} />
							<List.Item
								title="Hide Password"
								description={'Password will be masked and will only be shown when you click on the eye icon'}
								left={props => <List.Icon {...props} icon="eye-off" />}
							/>
							<List.Item title="Show copy buttons" left={props => <List.Icon {...props} icon="content-copy" />} />
						</List.Section>

						<List.Section>
							<List.Subheader>Security</List.Subheader>
							<List.Item title="Change Password" left={props => <List.Icon {...props} icon="lock" />} />
							<List.Item
								title="Biometrics"
								description={'Use biometrics (fingerprint/face recognition) to login for biometric supported'}
								left={props => <List.Icon {...props} icon="fingerprint" />}
							/>
							<List.Item
								title="Auto-lock"
								description={'Lock app automatically after a certain interval in the background'}
								left={props => <List.Icon {...props} icon="lock-clock" />}
							/>
							<List.Item
								title="Manually reset app and removes all entries"
								description={'Removes all entries and reset the app. This action cannot be undone.'}
								left={props => <List.Icon {...props} icon="delete-forever" />}
							/>
							<List.Item
								title="Allow screenshot"
								left={props => <List.Icon {...props} icon="cellphone-screenshot" />}
							/>
						</List.Section>

						<List.Section>
							<List.Subheader>Import and Export</List.Subheader>
							<List.Item
								title="Import"
								description={
									'Imports and restores a valid backup file into the app. The current entries will be overwritten.'
								}
								left={props => <List.Icon {...props} icon="import" />}
							/>
							<List.Item
								title="Export"
								description={'Backup and exports the current entries into a backup file.'}
								left={props => <List.Icon {...props} icon="export" />}
							/>
						</List.Section>
					</View>
				</Content>
			</Container>
		</Screen>
	)
}
