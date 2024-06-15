import { FormattedMessage } from 'react-intl'

import { useEnvironment } from '@/core/components/EnvironmentProvider'

import { useAppSelector } from 'app/hooks'

import DialogMessages from '../messages'

const LogPage = () => {
	const userLanguage = useEnvironment()?.lang ?? 'en'
	const lang = useAppSelector(state => state.config.language) ?? userLanguage
	const logs = useAppSelector(state => state.log.logs)

	const formatter = new Intl.DateTimeFormat(lang, {
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	})

	return (
		<>
			<h2 className='Form-title'>
				<FormattedMessage {...DialogMessages.log} />
			</h2>

			<ul>
				{logs.map((log, index) => {
					return (
						<li key={index}>
							{`${formatter.format(log.timestamp)}: ${log.type}`}
						</li>
					)
				})}
			</ul>
		</>
	)
}

export default LogPage
