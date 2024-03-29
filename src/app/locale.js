//import { getLocales } from "expo-localization";
import * as Localization from 'expo-localization'
import { I18n } from 'i18n-js'

// Set the key-value pairs for the different languages you want to support.
const i18n = new I18n({
	en: {
		'developer:nope:not:priority':
			'Developer decided that this feature is not a priority at the moment...so are 50 other features',
		'app:name:title': 'Bondpass',
		'set-master-password:text:password': 'Password',
		'set-master-password:text:confirm-password': 'Confirm Password',
		'set-master-password:button:set-password': 'Set Password',
		'set-master-password:text:note:enter-password': 'Please enter a strong password',
		'set-master-password:error:password:strength': 'Password has to be at least {{char}} characters',
		'set-master-password:error:password:confirm': 'Confirm Password does not match',
		'set-master-password:error:save:password': 'There was an error setting your password, please try again',
		'login:button:unlock': 'Unlock',
		'login:label:biometrics': 'Unlock via Biometrics',
		'login:text:enter:password': 'Enter your password to unlock',
		'login:text:enter:password:unlock': 'Enter your password to unlock',
		'login:error:password:empty': 'Please enter your password',
		'login:error:password:invalid': 'Incorrect password, please try again.',
		'login:error:login:error': 'There was an error unlocking, please try again.',
		'login:session:note:security':
			'As a security precaution, you will be asked to enter your password after a period of time',
		'onboarding:label:welcome': `Welcome to your\nPassword Store!`,
		'onboarding:note:success': 'You have successfully set your master password. Please remember your master password.',
		'onboarding:button:next': 'Next',
		'navigation:label:settings': 'Settings',
		'navigation:drawer:label:logout': 'Lock',
		'categories:card:button:text:add': '+ Add',
		'categories:card:menu:edit-category': 'Edit Category',
		'categories:card:menu:delete-category': 'Delete Category',
		'categories:card:title:category': 'Categories',
		'categories:card:menu:close': 'Cancel',
		'categories:card:entries:count': `{{totalEntries}} entries`,
		'categories:card:entries': `entries`,
		'entries:label:no:entries': 'No entries',
		'entries:button:add:new:entry': '+ Add',
		'entries:label:no:search:matches': 'No matches found for {{s}}',
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
		'favourites:title:label': 'Favourites',
		'favourites:label:no:fav': 'No favourites added yet',
		'password:recovery:sheet:button:save-share': 'Save and Print',
		'password:recovery:sheet:button:close': 'Close',
		'password:recovery:sheet:button:done': 'Done',
		'password:recovery:sheet:menu:save': 'Save File',
		'password:recovery:sheet:menu:print': 'Print',
		'password:recovery:sheet:menu:share': 'Share',
		'password:recovery:sheet:toast:save:success': 'Password recovery sheet saved.',
		'password:recovery:warning:prompt:title': 'Have you saved and printed your password recovery sheet?',
		'password:recovery:warning:prompt:text':
			'It is important for you to keep a copy of your recovery sheet to unlock your records in the future.',
		'settings:subheader:general': 'General',
		'settings:subheader:backup:export': 'Backup and Export',
		'settings:subheader:security': 'Security',
		'settings:change-password:label:current-password': 'Current password',
		'settings:change-password:label:new-password': 'New password',
		'settings:change-password:text:current-password': 'Enter your current password',
		'settings:change-password:text:password': 'Enter a new password',
		'settings:change-password:text:confirm-password': 'Re-enter your new password',
		'settings:change-password:button:set-password': 'Set Password',
		'settings:change-password:text:note:enter-password': 'Please enter a strong password',
		'settings:change-password:error:password:strength': 'Password has to be at least {{char}} characters',
		'settings:change-password:error:password:confirm': 'Confirm Password does not match',
		'settings:change-password:error:save:password': 'There was an error setting your password, please try again',
		'settings:change-password:error:password:empty': 'Password cannot be empty',
		'settings:change-password:error:save:current-password': 'The password is incorrect. Please try again',
		'settings:change-password:label': 'Change Password',
		'settings:change-password:checklist': `To protect your account, make sure your password is: \n\t- at least 6 characters long\n\t- not commonly used (don't use 'Password123' , '112233')\n\t- not reused across multiple devices or services`,
		'settings:change-password:label:success': 'Password Changed!',
		'settings:change-password:note:success': 'Your password has been changed successfully',
		'settings:verify:label:enter-password': 'Enter your current password',
		'settings:verify:note:verify-password': 'This verification is for security purposes',
		'settings:verify:text:password': 'Password',
		'settings:export:csv:label:note': 'Unencrypted comma-separated file which contains all your records',
		'settings:export:button:export': 'Export Data',
		'settings:export:generated:label:all:profiles:note': 'Select one or more profiles',
		'settings:export:generated:label:all:profiles': 'Profiles',
		'settings:export:generated:label:generating': 'Generating your CSV files',
		'settings:export:generated:loading': 'Generating your files',
		'settings:export:generated:label:generated': 'Generated {{type}} files',
		'settings:export:generated:error:generation': 'Error generating export files. Please try again.',
		'settings:export:generated:toast:saved': 'File downloaded',
		'settings:backup:generated:label': 'Backup my data',
		'settings:backup:generated:label:note':
			'This process will generate a backup file to save in your desired location. This backup file can be used to restore your records.',
		'settings:backup:processing:error': 'Could not complete backup. Please try again.',
		'settings:backup:processing:success': 'Your backup has been saved.',
		'settings:backup:button:save': 'Save my Backup',
		'settings:backup:button:save:again': 'Save my backup file again',
		'settings:backup:label:generating': 'Backing up your records',
		'settings:backup:label:generating:complete': 'Your backup is ready.',
		'settings:restore:generated:label': 'Restore my data',
		'settings:restore:generated:label:note':
			'This process will restore your records from your backup file. This action will overwrite all your existing records currently on your app.',
		'settings:restore:label:choose:file': 'Select your backup file',
		'settings:restore:label:enter-password': 'Enter your backup password',
		'settings:restore:text:password': 'Password',
		'settings:restore:label:enter-secret-key': 'Enter your backup secret key',
		'settings:restore:text:secret-key': 'Secret Key',
		'settings:restore:error:password:empty': 'Password is empty',
		'settings:restore:error:secret-key:empty': 'Secret Key is empty',
		'settings:restore:error:file:empty': 'No file selected',
		'settings:restore:error:file:invalid': 'Invalid file selected.',
		'settings:restore:button:label:restore': 'Restore from my backup file',
		'settings:restore:warning:prompt:text':
			'This will restore all your records from your backup file. Your existing records will be overwritten.',
		'settings:restore:warning:prompt:title': 'Proceed to restore from your backup file?',
		'settings:restore:alert:button:label:proceed': 'Yes, proceed to restore',
		'settings:restore:processing:error':
			'There is an error restoring your backup. Please try check your backup file is valid.',
		'settings:restore:processing:success': 'Your records has been restored.',
		'search:bar:placeholder:search': 'Search',
		'routes:dashboard': 'Dashboard',
		'routes:settings': 'Settings',
		'routes:view:edit:profile': 'Edit Profile',
		'routes:add:profile': 'Add Profile',
		'routes:change:password': 'Change Password',
		'routes:settings:verify:password': 'Verify Password',
		'button:label:save': 'Save',
		'button:label:clear': 'Clear',
		'button:label:add': 'Add',
		'button:label:cancel': 'Cancel',
		'button:label:ok': 'Ok',
		'button:label:yes': 'Yes',
		'button:label:remove': 'Remove',
		'button:label:apply': 'Apply',
		'button:label:no:cancel': 'No, cancel',
		'button:label:yes:done': 'Yes, I have done it',
		'button:label:delete:profile': 'Delete Profile',
		'button:label:continue': 'Continue',
		'button:label:next': 'Next',
		'button:label:done': 'Done',
		'button:label:choose': 'Choose',
		'button:label:no': 'No',
		'label:download': 'Download',
		'label:share': 'Share',
		'label:please:wait': 'Please wait a moment',
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
