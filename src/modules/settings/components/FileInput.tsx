import { ChangeEvent } from 'react'

import { ShakeEvent } from '@/telemetry/models/telemetry'

interface FileInputProps {
	onFileChange?(telemetry: Readonly<ShakeEvent>[]): void
}

const FileInput = ({ onFileChange }: FileInputProps) => {
	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file) {
			const reader = new FileReader()
			reader.onload = () => {
				const data = reader.result as string
				const lineArray = data.split('\n').filter(line => line.trim() !== '')
				const events = lineArray.map(line => JSON.parse(line) as ShakeEvent)
				if (events.length !== 0) {
					onFileChange!.call(null, events)
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
			disabled={onFileChange === undefined}
			onChange={handleFileChange}
		/>
	)
}

export default FileInput
