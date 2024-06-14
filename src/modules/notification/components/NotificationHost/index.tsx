import './styles.css'

import { UIEvent, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

import { XMarkIcon } from '@heroicons/react/16/solid'
import * as ToastPrimitive from '@radix-ui/react-toast'

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

export const NotificationHost = forwardRef<NotificationHandle, NotificationHostProps>(function NotificationHost({ maxCount, ...props }, forwardedRef) {
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

	const handleOpen = (timestamp: number, open: boolean) => {
		if (!open) {
			const index = notifications.findIndex(n => n.timestamp === timestamp)
			notifications.splice(index, 1)
		}
	}

	return (
		<ToastPrimitive.Provider swipeDirection='right'>
			<>
				{notifications.map(notification => {
					return (
						<ToastPrimitive.Root
							key={notification.timestamp}
							className='Notification'
							duration={notification.duration ?? 5000}
							onOpenChange={handleOpen.bind(null, notification.timestamp)}
							{...props}
						>
							<ToastPrimitive.Title className='ToastTitle'>
								{notification.title}
							</ToastPrimitive.Title>
							<ToastPrimitive.Description className='Notification-description'>
								{notification.description}
							</ToastPrimitive.Description>
							<ToastPrimitive.Close
								aria-label='Close'
								className='Notification-close'
								tabIndex={-1}
							>
								<XMarkIcon className='Icon16' />
							</ToastPrimitive.Close>
						</ToastPrimitive.Root>
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
