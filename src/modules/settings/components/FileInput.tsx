import { ChangeEvent } from 'react'
import { useDispatch } from 'react-redux'

import { setMatch } from '@/overlay/slicers'
import { ShakeEvent } from '@/telemetry/models/telemetry'
import { setTelemetry } from '@/telemetry/slicers'

const FileInput = () => {
	const dispatch = useDispatch()
	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file) {
			const reader = new FileReader()
			reader.onload = () => {
				const data = reader.result as string
				const lineArray = data.split('\n').filter(line => line.trim() !== '')
				const events = lineArray.map(line => JSON.parse(line) as ShakeEvent)
				if (events.length !== 0) {
					dispatch(setTelemetry(events))
					dispatch(setMatch(events[0].session))
				}
			}
			reader.readAsText(file)
		}
	}

	return (
		<input
			className='File'
			type='file'
			accept='.json'
			onChange={handleFileChange}
		/>
	)
}

export default FileInput
