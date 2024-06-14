import { defineMessages } from 'react-intl'

const DialogMessages = defineMessages({
	openSettings: {
		id: 'Dialog.openSettings',
		defaultMessage: 'Open Settings',
	},

	dataSource: {
		id: 'Dialog.dataSource',
		defaultMessage: 'Data Source',
	},
	dataSourceServerAddress: {
		id: 'Dialog.dataSource.serverAddress',
		defaultMessage: 'Server Address',
	},
	dataSourceSave: {
		id: 'Dialog.dataSource.save',
		defaultMessage: 'Save',
	},
	dataSourceConnected: {
		id: 'Dialog.dataSource.connected',
		defaultMessage: 'Connected to {url}',
	},
	dataSourceNotConnected: {
		id: 'Dialog.dataSource.notConnected',
		defaultMessage: 'Not Connected',
	},
	dataSourceFileInput: {
		id: 'Dialog.dataSource.fileInput',
		defaultMessage: 'File Input',
	},

	development: {
		id: 'Dialog.development',
		defaultMessage: 'Development',
	},
	developmentPreview: {
		id: 'Dialog.development.preview',
		defaultMessage: 'Preview',
	},
	developmentUseCamera: {
		id: 'Dialog.development.useCameraAsBackground',
		defaultMessage: 'Use camera as background',
	},
	developmentNone: {
		id: 'Dialog.development.none',
		defaultMessage: 'None',
	},
	developmentNotification: {
		id: 'Dialog.development.notification',
		defaultMessage: 'Notification',
	},
	developmentTestNotifications: {
		id: 'Dialog.development.testNotifications',
		defaultMessage: 'Test Notifications',
	},
	developmentEnvironment: {
		id: 'Dialog.development.environment',
		defaultMessage: 'Environment',
	},
	developmentBroadcastMode: {
		id: 'Dialog.development.broadcastMode',
		defaultMessage: 'Broadcast Mode: {status}',
	},
	developmentBroadcastModeDisabled: {
		id: 'Dialog.development.broadcastMode.disabled',
		defaultMessage: 'Disabled',
		description: 'broadcast software: disabled',
	},
	developmentBroadcastModeEnabled: {
		id: 'Dialog.development.broadcastMode.enabled',
		defaultMessage: 'Enabled',
		description: 'broadcast software: enabled',
	},
	developmentBroadcastSoftware: {
		id: 'Dialog.development.broadcastSoftware',
		defaultMessage: 'Broadcast Software: {software}',
	},

	log: {
		id: 'Dialog.log',
		defaultMessage: 'Log',
	},

	settings: {
		id: 'Dialog.settings',
		defaultMessage: 'Settings',
	},
	settingsOverlay: {
		id: 'Dialog.settings.overlay',
		defaultMessage: 'Overlay',
	},
	settingsAutoHide: {
		id: 'Dialog.settings.autoHide',
		defaultMessage: 'Hide overlay automatically',
	},
	settingsShowOverlayOn: {
		id: 'Dialog.settings.showOverlayOn',
		defaultMessage: 'Show Overlay on:',
	},
	settingsShowOverlayOnQuotaMet: {
		id: 'Dialog.settings.showOverlayOn.quotaMet',
		defaultMessage: 'Quota Met',
	},
	settingsShowOverlayOnWaveFinished: {
		id: 'Dialog.settings.showOverlayOn.waveFinished',
		defaultMessage: 'Wave Finished',
	},
	settingsLanguage: {
		id: 'Dialog.settings.language',
		defaultMessage: 'Language',
	},
})

export default DialogMessages
