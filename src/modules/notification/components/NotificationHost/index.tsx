import './styles.css'

import { UIEvent, forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'

import * as ToastPrimitive from '@radix-ui/react-toast'

import Notification from './Notification'

export interface NotificationHandle {
	publish(notification: NotificationMessage): void
}

export interface NotificationMessage {
	timestamp: number
	title: string
	description?: string
	duration?: number
}

export interface NotificationHostProps {
	maxCount?: number
}

export const NotificationHost = forwardRef<NotificationHandle, NotificationHostProps>(function NotificationHost({ maxCount }, forwardedRef) {
	const ref = useRef<HTMLOListElement>(null)
	const [isBottom, setIsBottom] = useState(true)
	const [notifications, setNotifications] = useState<NotificationMessage[]>([])

	useImperativeHandle(forwardedRef, () => ({
		publish: (notification: NotificationMessage) => {
			const length = notifications.length + 1
			if (maxCount && length > maxCount) {
				const newNotifications = notifications.slice(length - maxCount)
				newNotifications.push(notification)
				setNotifications(newNotifications)
			} else {
				const newNotifications = [...notifications, notification]
				setNotifications(newNotifications)
			}
		},
	}))

	useEffect(() => {
		if (isBottom && ref.current) {
			ref.current.scrollTop = ref.current.scrollHeight
		}
	}, [notifications])

	const handleScroll = (e: UIEvent) => {
		const target = e.currentTarget
		const availableTop = target.scrollHeight - target.clientHeight
		setIsBottom(target.scrollTop === availableTop)
	}

	const handleClose = useCallback((timestamp: number) => {
		const index = notifications.findIndex(n => n.timestamp === timestamp)
		notifications.splice(index, 1)
	}, [])

	return (
		<ToastPrimitive.Provider swipeDirection='right'>
			<>
				{notifications.map(notification => {
					return (
						<Notification
							key={notification.timestamp}
							onClose={handleClose}
							{...notification}
						/>
					)
				})}
			</>
			<ToastPrimitive.Viewport
				className='NotificationHost'
				ref={ref}
				onScroll={handleScroll}
			/>
		</ToastPrimitive.Provider>
	)
})

export default NotificationHost
