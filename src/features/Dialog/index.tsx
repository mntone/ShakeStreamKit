import { clsx } from 'clsx'
import { FormattedMessage } from 'react-intl'

import { XMarkIcon } from '@heroicons/react/16/solid'
import * as Dialog from '@radix-ui/react-dialog'
import * as Tabs from '@radix-ui/react-tabs'

import { useAppSelector } from 'app/hooks'

import DialogMessages from './messages'
import DataSourcePage from './pages/DataSourcePage'
import DevelopmentPage from './pages/DevelopmentPage'
import LogPage from './pages/LogPage'
import SettingsPage from './pages/SettingsPage'

import './styles.css'

const _Dialog = () => {
	const broadcastEnabled = useAppSelector(state => state.view.broadcast.enabled)

	return (
		<Dialog.Root>
			<Dialog.Trigger asChild>
				<button type='button' className='Button'>
					<FormattedMessage {...DialogMessages.openSettings} />
				</button>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className='Dialog-overlay' />
				<Dialog.Content className={clsx(
					'Dialog-content',
					broadcastEnabled && 'Dialog-content--broadcast',
				)}>
					<Tabs.Root className='Dialog-tab' defaultValue='settings'>
						<Tabs.List className='Dialog-tablist'>
							<Tabs.Trigger className='Dialog-tabitem' value='settings'>
								<FormattedMessage {...DialogMessages.settings} />
							</Tabs.Trigger>
							<Tabs.Trigger className='Dialog-tabitem' value='datasource'>
								<FormattedMessage {...DialogMessages.dataSource} />
							</Tabs.Trigger>
							<Tabs.Trigger className='Dialog-tabitem' value='log'>
								<FormattedMessage {...DialogMessages.log} />
							</Tabs.Trigger>
							<Tabs.Trigger className='Dialog-tabitem' value='development'>
								<FormattedMessage {...DialogMessages.development} />
							</Tabs.Trigger>
						</Tabs.List>
						<Tabs.Content className='Dialog-tabcontent' value='settings'>
							<SettingsPage />
						</Tabs.Content>
						<Tabs.Content className='Dialog-tabcontent' value='datasource'>
							<DataSourcePage />
						</Tabs.Content>
						<Tabs.Content className='Dialog-tabcontent' value='log'>
							<LogPage />
						</Tabs.Content>
						<Tabs.Content className='Dialog-tabcontent' value='development'>
							<DevelopmentPage />
						</Tabs.Content>
					</Tabs.Root>

					<Dialog.Close asChild>
						<button
							type='button'
							aria-label='Close'
							className='Button SettingsDialog-close'
							tabIndex={-1}
						>
							<XMarkIcon className='Icon16' />
						</button>
					</Dialog.Close>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	)
}

export default _Dialog
