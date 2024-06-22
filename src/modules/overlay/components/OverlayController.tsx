import { memo } from 'react'

import MatchSelector from './MatchSelector'
import WaveSelector from './WaveSelector'

export const OverlayController = () => {
	return (
		<>
			<MatchSelector />
			<WaveSelector />
		</>
	)
}

export default memo(OverlayController)
