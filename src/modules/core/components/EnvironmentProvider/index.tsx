import { type PropsWithChildren, createContext, useState, useEffect, useContext } from 'react'

import { type BroadcastSoftwareInfo, detectBroadcast } from '../../utils/broadcast'

interface EnvrionmentInfo {
	broadcast?: BroadcastSoftwareInfo
	secure: boolean
}

const EnvironmentContext = createContext<EnvrionmentInfo | undefined>(undefined)

const EnvironmentProvider = ({ children }: PropsWithChildren) => {
	const [environment, setEnvironment] = useState<EnvrionmentInfo | undefined>(undefined)

	useEffect(() => {
		const broadcast = detectBroadcast()
		const secure = window.location.protocol === 'https:'
		const info: EnvrionmentInfo = broadcast
			? { broadcast, secure }
			: { secure }
		setEnvironment(info)
	}, [])

	return (
		<EnvironmentContext.Provider value={environment}>
			{children}
		</EnvironmentContext.Provider>
	)
}

export const useEnvironment = () => {
	const info = useContext(EnvironmentContext)
	return info
}

export default EnvironmentProvider
