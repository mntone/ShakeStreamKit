import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'

import { getBroadcastFriendlyName } from '@/core/utils/broadcast'
import { addLog } from '@/notification/slicers'

import { useAppSelector } from 'app/hooks'

import CameraSelector from '../components/CameraSelector'
import DialogMessages from '../messages'

const DevelopmentPage = () => {
	const broadcast = useAppSelector(state => state.overlay.broadcast)
	const dispatch = useDispatch()

	const notifyTest = () => {
		dispatch(addLog({
			type: 'test',
			timestamp: Date.now(),
		}))
	}

	return (
		<>
			<h2 className='Form-title'>
				<FormattedMessage {...DialogMessages.development} />
			</h2>

			{!broadcast.enabled && (
				<section className='Form-group'>
					<h3>
						<FormattedMessage {...DialogMessages.developmentPreview} />
					</h3>
					<p>
						<FormattedMessage {...DialogMessages.developmentUseCamera} />
					</p>
					<CameraSelector />
				</section>
			)}

			{import.meta.env.DEV && (
				<section className='Form-group'>
					<h3>
						<FormattedMessage {...DialogMessages.developmentNotification} />
					</h3>
					<button
						type='button'
						className='Button'
						onClick={notifyTest}
					>
						<FormattedMessage {...DialogMessages.developmentTestNotifications} />
					</button>
				</section>
			)}

			<section className='Form-group'>
				<h3>
					<FormattedMessage {...DialogMessages.developmentEnvironment} />
				</h3>
				<p>
					<FormattedMessage
						values={{
							status: broadcast.enabled
								? <FormattedMessage {...DialogMessages.developmentBroadcastModeEnabled} />
								: <FormattedMessage {...DialogMessages.developmentBroadcastModeDisabled} />,
						}}
						{...DialogMessages.developmentBroadcastMode}
					/>
				</p>
				{broadcast.enabled && (
					<p>
						<FormattedMessage
							values={{ software: getBroadcastFriendlyName(broadcast.name) + ' ' + broadcast.version }}
							{...DialogMessages.developmentBroadcastSoftware}
						/>
					</p>
				)}
			</section>
		</>
	)
}

export default DevelopmentPage
