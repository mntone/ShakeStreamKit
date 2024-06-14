import { ChangeEvent } from 'react'
import { useDispatch } from 'react-redux'

import { ShakeEvent } from 'features/telemetry/model'
import { setTelemetry } from 'features/telemetry/telemetrySlice'

const FileInput = () => {
	const dispatch = useDispatch()
	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file) {
			const reader = new FileReader()
			reader.onload = () => {
				const data = reader.result as string
				const lineArray = data.split('\n').filter(line => line.trim() !== '')
				const events: ShakeEvent[] = lineArray.map(line => JSON.parse(line) as ShakeEvent)
				dispatch(setTelemetry(events))
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
