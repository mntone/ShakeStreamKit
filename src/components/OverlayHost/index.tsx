import { clsx } from 'clsx'

import { useAppSelector } from 'app/hooks'

import type { FC, PropsWithChildren } from 'react'

import './styles.css'

const OverlayHost: FC<PropsWithChildren> = ({ children }) => {
	const broadcastEnabled = useAppSelector(state => state.view.broadcast.enabled)
	return (
		<div className={clsx(
			'OverlayHost',
			broadcastEnabled && 'OverlayHost--broadcast',
		)}>
			{children}
		</div>
	)
}

export default OverlayHost
