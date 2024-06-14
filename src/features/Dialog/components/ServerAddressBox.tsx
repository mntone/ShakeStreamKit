import { ChangeEvent, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'

import { hostport } from 'utils/regex'

import { setServer as setServerToConfig } from 'app/configSlice'
import { useAppSelector } from 'app/hooks'
import { setServer as setServerForView } from 'app/viewSlice'

import DialogMessages from '../messages'

const secure = window.location.protocol === 'https:'
const defaultServer = import.meta.env.VITE_WS_SERVER

const ServerAddressBox = () => {
	const [isValid, setIsValid] = useState(true)
	const [serverOnConfig, setServerOnConfig] = useState<string | undefined>(useAppSelector(state => state.config.server))
	const [serverInBox, setServerInBox] = useState<string | undefined>(useAppSelector(state => state.view.server) ?? serverOnConfig)

	const dispatch = useDispatch()

	const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
		let currentServer: string | undefined = e.target.value
		if (currentServer === '') {
			currentServer = undefined
		}
		setServerInBox(currentServer)
		dispatch(setServerForView(currentServer))

		const valid = e.currentTarget.checkValidity()
		setIsValid(valid)
	}

	const handleSave = () => {
		setServerOnConfig(serverInBox)
		dispatch(setServerToConfig(serverInBox))
	}

	return (
		<div className='ServerAddressBox InputFlex'>
			<span className='InputFlex-appendix'>
				{secure ? 'wss://' : 'ws://'}
			</span>
			<input
				className='TextBox ServerAddressBox-input'
				defaultValue={serverInBox}
				onChange={handleInput}
				pattern={hostport}
				placeholder={defaultServer}
			/>
			<button
				type='button'
				className='Button'
				disabled={!isValid || serverOnConfig === serverInBox}
				onClick={handleSave}
				style={{ minWidth: '80px' }}
			>
				<FormattedMessage {...DialogMessages.dataSourceSave} />
			</button>
		</div>
	)
}

export default ServerAddressBox
