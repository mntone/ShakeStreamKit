import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { Dispatch, UnknownAction } from 'redux'

import { Log, addLog } from '@/notification/slicers'

import { ShakeEvent } from '../model'
import { addTelemetry } from '../slicers'
import { ConnectWebSocketWorkerMessage, MessageWebSocketWorkerEvent, WebSocketWorkerEvent, WebSocketWorkerMessage } from '../utils/websocket.worker'

export interface WebSocketLog extends Log {
	type: 'websocket_connect' | 'websocket_disconnect'
	url: string
	retryCount?: number
}

const handleWebSocketLog = (dispatch: Dispatch<UnknownAction>, log: WebSocketLog) => dispatch(addLog(log))

const useWebsocketTelemetry = (url: string) => {
	const [isConnect, setIsConnect] = useState(false)
	const dispatch = useDispatch()
	const dispatchWebSocketLog = handleWebSocketLog.bind(null, dispatch)

	useEffect(() => {
		const worker = new Worker(new URL('../utils/websocket.worker.ts', import.meta.url), {
			type: 'module',
		})
		worker.onmessage = (e: MessageEvent<WebSocketWorkerEvent>) => {
			const event = e.data
			switch (event.event) {
			case 'connect':
				setIsConnect(true)
				dispatchWebSocketLog({
					type: 'websocket_connect',
					timestamp: Date.now(),
					url,
				})
				break
			case 'disconnect':
				dispatchWebSocketLog({
					type: 'websocket_disconnect',
					timestamp: Date.now(),
					url,
					retryCount: event.retryCount!,
				})
				setIsConnect(false)
				break
			case 'message': {
				const telemetry = (event as MessageWebSocketWorkerEvent<ShakeEvent>).data
				dispatch(addTelemetry(telemetry))
				break
			}
			}
		}

		worker.postMessage({
			event: 'connect',
			url,
			connectionTimeout: 15000,
			minUptime: 30000,
		} as ConnectWebSocketWorkerMessage)

		return () => {
			worker.postMessage({
				event: 'disconnect',
			} as WebSocketWorkerMessage)
			worker.terminate()
		}
	}, [url])

	return isConnect
}

export default useWebsocketTelemetry
