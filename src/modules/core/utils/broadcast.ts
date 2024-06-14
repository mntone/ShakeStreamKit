export type BroadcastSoftware =
	| 'obs'
	| 'xsplit'
	| 'twitch'

export interface BroadcastSoftwareInfo {
	name: BroadcastSoftware
	version: string | undefined
}

const pattern = /(OBS|XSplitChromeSource|TwitchStudio)\/([\d.]+)/
const dict: Record<string, BroadcastSoftware> = {
	OBS: 'obs',
	XSplitChromeSource: 'xsplit',
	TwitchStudio: 'twitch',
}

const friendlyName: Record<BroadcastSoftware, string> = {
	obs: 'OBS Studio',
	xsplit: 'XSplit',
	twitch: 'Twitch Studio',
}

export const getBroadcastFriendlyName = (name: BroadcastSoftware) => friendlyName[name]

export const detectBroadcast = (): BroadcastSoftwareInfo | undefined => {
	const match = pattern.exec(navigator.userAgent)
	if (match !== null) {
		return {
			name: dict[match[1]],
			version: match[2],
		}
	}

	return undefined
}
