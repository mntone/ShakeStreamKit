import { useEffect, useRef } from 'react'

import { useAppSelector } from 'app/hooks'

import './style.css'

const CameraPreview = () => {
	const refVideo = useRef<HTMLVideoElement>(null)
	const cameraId = useAppSelector(state => state.config.cameraId)
	const broadcastEnabled = useAppSelector(state => state.view.broadcast.enabled)
	if (broadcastEnabled) {
		return null
	}

	useEffect(() => {
		if (cameraId) {
			const constraint: MediaStreamConstraints = {
				video: {
					aspectRatio: 16 / 9,
					deviceId: cameraId,
					frameRate: 30,
				},
			}
			navigator.mediaDevices.getUserMedia(constraint).then(stream => {
				if (refVideo.current) {
					refVideo.current.srcObject = stream
				}
			})
		} else if (refVideo.current) {
			refVideo.current.srcObject = null
		}
	}, [cameraId])

	return (
		<video
			ref={refVideo}
			autoPlay
			className='CameraPreview'
			playsInline
		/>
	)
}

export default CameraPreview
