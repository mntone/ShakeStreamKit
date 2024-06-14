import { useContext } from 'react'
import { FormattedMessage } from 'react-intl'

import { CheckIcon, XMarkIcon } from '@heroicons/react/16/solid'

import { WebSocketContext } from 'features/telemetry/components/WebSocketProvider'

import FileInput from '../components/FileInput'
import ServerAddressBox from '../components/ServerAddressBox'
import DialogMessages from '../messages'

const DataSourcePage = () => {
	const wsConnect = useContext(WebSocketContext)
	return (
		<>
			<h2 className='Form-title'>
				<FormattedMessage {...DialogMessages.dataSource} />
			</h2>

			<section className='Form-group'>
				<h3>
					<FormattedMessage {...DialogMessages.dataSourceServerAddress} />
				</h3>
				<ServerAddressBox />

				{
					wsConnect && wsConnect.isConnect === true
						? (
							<span className='StatusText StatusText-positive'>
								<CheckIcon className='Icon16' />
								<FormattedMessage
									values={{ url: wsConnect.url }}
									{...DialogMessages.dataSourceConnected}
								/>
							</span>
						)
						: (
							<span className='StatusText StatusText-negative'>
								<XMarkIcon className='Icon16' />
								<FormattedMessage {...DialogMessages.dataSourceNotConnected} />
							</span>
						)
				}
			</section>

			<section className='Form-group'>
				<h3>
					<FormattedMessage {...DialogMessages.dataSourceFileInput} />
				</h3>
				<FileInput />
			</section>
		</>
	)
}

export default DataSourcePage
