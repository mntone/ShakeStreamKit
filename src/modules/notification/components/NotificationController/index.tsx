import { useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'

import type { WebSocketLog } from '@/telemetry/hooks/websocket'

import { useAppSelector } from 'app/hooks'

import NotificationHost, { NotificationHandle, NotificationMessage } from '../NotificationHost'

import NotificationMessages from './messages'

const SUPPRESS_DISCONNECT_DURATION = 2 * 60 * 1000

const NotificationController = () => {
	const intl = useIntl()
	const logs = useAppSelector(state => state.log.logs)
	const [previousLogLength, setPreviousLogLength] = useState(0)
	const [previousDisconnectedTimestamp, setPreviousDisconnectedTimestamp] = useState(0)
	const savedRef = useRef<NotificationHandle>(null)

	useEffect(() => {
		const handler = savedRef.current
		if (!handler) {
			return
		}

		for (let i = previousLogLength; i < logs.length; ++i) {
			const log = logs[i]

			let message: NotificationMessage
			switch (log.type) {
			case 'test':
				message = {
					timestamp: log.timestamp,
					title: intl.formatMessage(NotificationMessages.notificationTestingNotification),
					description: intl.formatMessage(NotificationMessages.notificationSucceedToTestNotification),
				}
				break
			case 'websocket_connect':
				message = {
					timestamp: log.timestamp,
					title: intl.formatMessage(NotificationMessages.notificationWebSocketConnected),
					description: (log as WebSocketLog).url,
				}
				break
			case 'websocket_disconnect': {
				const wslog = log as WebSocketLog
				const suppress = log.timestamp - previousDisconnectedTimestamp < SUPPRESS_DISCONNECT_DURATION
				if (!import.meta.env.DEV && suppress) {
					continue
				}
				setPreviousDisconnectedTimestamp(log.timestamp)

				message = {
					timestamp: log.timestamp,
					title: intl.formatMessage(NotificationMessages.notificationWebSocketDisconnected),
					description: wslog.url,
				}
				break
			}
			default:
				continue
			}
			handler.publish(message)
		}
		setPreviousLogLength(logs.length)
	}, [logs])

	return <NotificationHost ref={savedRef} maxCount={5} />
}

export default NotificationController
