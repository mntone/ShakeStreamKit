import { FormatDateOptions, useIntl } from 'react-intl'

import { useAppSelector } from 'app/hooks'

import DialogMessages from '../messages'

const opts: FormatDateOptions = {
	month: 'short',
	day: 'numeric',
	hour: '2-digit',
	minute: '2-digit',
	second: '2-digit',
}

const LogPage = () => {
	const intl = useIntl()
	const logs = useAppSelector(state => state.log.logs)

	return (
		<>
			<h2 className='Form-title'>
				{intl.formatMessage(DialogMessages.log)}
			</h2>

			<ul>
				{logs.map((log, index) => {
					return (
						<li key={index}>
							{`${intl.formatDate(log.timestamp, opts)}: ${log.type}`}
						</li>
					)
				})}
			</ul>
		</>
	)
}

export default LogPage
