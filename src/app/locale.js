//import { getLocales } from "expo-localization";
import * as Localization from 'expo-localization'
import { I18n } from 'i18n-js'

// Set the key-value pairs for the different languages you want to support.
const i18n = new I18n({
	en: {
		'app:name:title': 'Family Password Manager',
		'set-master-password:text:password': 'Password',
		'set-master-password:text:confirm-password': 'Confirm Password',
		'set-master-password:button:set-password': 'Set Password',
		'set-master-password:text:note:enter-password': 'Please enter a strong password',
		'set-master-password:error:password:strength': 'Password has to be at least {{char}} characters',
		'set-master-password:error:password:confirm': 'Confirm Password does not match',
		'set-master-password:error:save:password': 'There was an error setting your password, please try again',
		'login:button:unlock': 'Unlock',
		'login:label:biometrics': 'Unlock via Biometrics',
		'login:text:enter:password': 'Enter your password to login',
		'login:text:enter:password:unlock': 'Enter your password to unlock',
		'login:error:password:empty': 'Please enter your password',
		'login:error:password:invalid': 'Incorrect password, please try again.',
		'login:error:login:error': 'There was an error unlocking, please try again.',
		'login:session:note:security':
			'As a security precaution, you will be asked to enter your password after a period of time',
		'navigation:label:settings': 'Settings',
		'navigation:drawer:label:logout': 'Lock',
		'categories:card:button:text:add': '+ Add',
		'categories:card:menu:edit-category': 'Edit Category',
		'categories:card:menu:delete-category': 'Delete Category',
		'categories:card:title:category': 'Categories',
		'categories:card:menu:close': 'Cancel',
		'entries:label:no:entries': 'No entries',
		'entries:button:add:new:entry': '+ Add',
		'entries:label:no:search:matches': 'No matches found',
		'entries:menu:add:new:entry': 'Add Entry',
		'entry:new:field:input:label': 'Label',
		'entry:new:field:input:type:label': 'Type (Note: Type of input)',
		'entry:new:field:select:type:label': 'Select a field type',
		'entry:form:field:input:placeholder:title': 'Title',
		'dashboard:profile:label:profile': 'Profile',
		'dashboard:profile:label:profile-description': 'Your profile description',
		'dashboard:profile:button:edit:profile': 'Edit Profile',
		'dashboard:profile:label:profiles': 'Profiles',
		'dashboard:profile:label:other:profiles': 'Other Profiles',
		'dashboard:profile:label:add:profile': 'Add another profile',
		'dashboard:profile:label:manage:profiles': 'Manage profiles',
		'search:bar:placeholder:search': 'Search',
		'routes:dashboard': 'Dashboard',
		'routes:settings': 'Settings',
		'routes:view:edit:profile': 'Edit Profile',
		'routes:add:profile': 'Add Profile',
		'button:label:save': 'Save',
		'button:label:clear': 'Clear',
		'button:label:add': 'Add',
		'button:label:cancel': 'Cancel',
		'button:label:ok': 'Ok',
		'button:label:yes': 'Yes',
		'button:label:remove': 'Remove',
		'button:label:apply': 'Apply',
		'button:label:delete:profile': 'Delete Profile',
		'component:icon-initial:icons-selector:text:generic-icons': 'Generic Icons',
		'component:icon-initial:icons-selector:text:brand-icons': 'Brand Icons',
		'component:basic-icon-modal:text:icons': 'Icons',
		'component:basic-icon-modal:text:color-theme': 'Pick a color',
		'component:basic-icon-modal:text:custom-icon': 'Custom Avatar',
		'prompt:edit:entry:cancel:title': 'Cancel',
		'prompt:edit:entry:cancel:message': 'Are you sure you want to discard your changes?',
		'prompt:edit:entry:delete:title': 'Delete Entry',
		'prompt:edit:entry:delete:message': 'Are yousure you want to delete this entry?',
		'prompt:edit:entry:invalid:form:title': 'Missing input(s)',
		'prompt:edit:entry:invalid:form:message': '- Title cannot be empty',
		'prompt:entry:form:field:remove:title': 'Remove field',
		'prompt:entry:form:field:remove:message': 'Are you sure you wish to remove "{{fieldname}}" field?',
		'prompt:edit:profile:delete:title': 'Delete Profile?',
		'prompt:profile:form:delete:profile:message':
			'Deleting "{{profilename}}" profile will:\n\t\t- permanently remove all entries\n\t\t- action is irreversible',
		'prompt:profile:form:delete:profile:note':
			'Note: There is an export functionality, you might want to consider performing a manual backup before removing this profile.',
		'prompt:edit:profile:invalid:form:title': 'Missing input(s)',
		'prompt:edit:profile:invalid:form:message': '- Name cannot be empty'
	},
	zh: {
		'set-master-password:text:password': '密码',
		'set-master-password:text:confirm-password': '确认密码'
	}
})

const initLocalization = () => {
	// Set the locale once at the beginning of your app.
	i18n.locale = Localization.getLocales?.()?.[0]?.languageCode || 'en' //Localization.locale;
	i18n.enableFallback = true
}

export { i18n, initLocalization }
