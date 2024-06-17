import { useContext } from 'react'
import { useIntl } from 'react-intl'

import { CheckIcon, XMarkIcon } from '@heroicons/react/16/solid'

import { WebSocketContext } from '@/telemetry/components/WebSocketProvider'

import FileInput from '../components/FileInput'
import ServerAddressBox from '../components/ServerAddressBox'
import DialogMessages from '../messages'

const DataSourcePage = () => {
	const intl = useIntl()
	const wsConnect = useContext(WebSocketContext)
	return (
		<>
			<h2 className='Form-title'>
				{intl.formatMessage(DialogMessages.dataSource)}
			</h2>

			<section className='Form-group'>
				<h3>
					{intl.formatMessage(DialogMessages.dataSourceServerAddress)}
				</h3>
				<ServerAddressBox />

				{
					wsConnect && wsConnect.isConnect === true
						? (
							<span className='StatusText StatusText-positive'>
								<CheckIcon className='Icon16' />
								{intl.formatMessage(
									DialogMessages.dataSourceConnected,
									{ url: wsConnect.url },
								)}
							</span>
						)
						: (
							<span className='StatusText StatusText-negative'>
								<XMarkIcon className='Icon16' />
								{intl.formatMessage(DialogMessages.dataSourceNotConnected)}
							</span>
						)
				}
			</section>

			<section className='Form-group'>
				<h3>
					{intl.formatMessage(DialogMessages.dataSourceFileInput)}
				</h3>
				<FileInput />
			</section>
		</>
	)
}

export default DataSourcePage
