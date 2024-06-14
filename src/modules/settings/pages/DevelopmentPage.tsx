import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'

import { useEnvironment } from '@/core/components/EnvironmentProvider'
import { getBroadcastFriendlyName } from '@/core/utils/broadcast'
import { addLog } from '@/notification/slicers'

import CameraSelector from '../components/CameraSelector'
import DialogMessages from '../messages'

const DevelopmentPage = () => {
	const environment = useEnvironment()
	const broadcastEnabled = environment && 'broadcast' in environment

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

			{!broadcastEnabled && (
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
							status: broadcastEnabled
								? <FormattedMessage {...DialogMessages.developmentBroadcastModeEnabled} />
								: <FormattedMessage {...DialogMessages.developmentBroadcastModeDisabled} />,
						}}
						{...DialogMessages.developmentBroadcastMode}
					/>
				</p>
				{environment?.broadcast && (
					<p>
						<FormattedMessage
							values={{ software: getBroadcastFriendlyName(environment.broadcast.name) + ' ' + environment.broadcast.version }}
							{...DialogMessages.developmentBroadcastSoftware}
						/>
					</p>
				)}
			</section>
		</>
	)
}

export default DevelopmentPage
