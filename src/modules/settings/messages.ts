import { defineMessages } from 'react-intl'

const DialogMessages = defineMessages({
	settings: {
		id: 'Dialog.settings',
		defaultMessage: 'Settings',
	},
	openSettings: {
		id: 'Dialog.openSettings',
		defaultMessage: 'Open Settings',
	},

	advanced: {
		id: 'Dialog.advanced',
		defaultMessage: 'Advanced',
	},
	advancedDisplayDuration: {
		id: 'Dialog.advanced.displayDuration',
		defaultMessage: 'Display Duration for Overlay',
	},
	advancedDisplayDurationUnit: {
		id: 'Dialog.advanced.displayDurationUnit',
		defaultMessage: 'sec',
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

	general: {
		id: 'Dialog.general',
		defaultMessage: 'General',
	},
	generalOverlay: {
		id: 'Dialog.general.overlay',
		defaultMessage: 'Overlay',
	},
	generalAutoHide: {
		id: 'Dialog.general.autoHide',
		defaultMessage: 'Hide overlay automatically',
	},
	generalShowOverlayOn: {
		id: 'Dialog.general.showOverlayOn',
		defaultMessage: 'Show Overlay on:',
	},
	generalShowOverlayOnQuotaMet: {
		id: 'Dialog.general.showOverlayOn.quotaMet',
		defaultMessage: 'Quota Met',
	},
	generalShowOverlayOnWaveFinished: {
		id: 'Dialog.general.showOverlayOn.waveFinished',
		defaultMessage: 'Wave Finished',
	},
	generalLanguage: {
		id: 'Dialog.general.language',
		defaultMessage: 'Language',
	},
})

export default DialogMessages
