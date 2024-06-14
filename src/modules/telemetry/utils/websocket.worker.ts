import ReconnectingWebSocket, { UrlProvider } from 'reconnecting-websocket'
import { CloseEvent, Event } from 'reconnecting-websocket/dist/events'

export interface WebSocketWorkerMessage {
	event: 'connect' | 'disconnect'
}

export interface ConnectWebSocketWorkerMessage extends WebSocketWorkerMessage {
	event: 'connect'
	url: UrlProvider
	connectionTimeout?: number
	minUptime?: number
}

export type WebSocketWorkerEventType = 'connect' | 'disconnect' | 'message'

export interface WebSocketWorkerEvent {
	event: WebSocketWorkerEventType
	retryCount?: number
}

export interface MessageWebSocketWorkerEvent<T> extends WebSocketWorkerEvent {
	event: 'message'
	data: T
}

const worker: Worker = self as any

const postMessage = <T extends WebSocketWorkerEvent>(message: T) => {
	worker.postMessage(message)
}

const handleOpen = (_: Event) => postMessage<WebSocketWorkerEvent>({ event: 'connect' })

const handleClose = (e: CloseEvent) => {
	const socket = e.target as ReconnectingWebSocket
	postMessage<WebSocketWorkerEvent>({
		event: 'disconnect',
		retryCount: socket.retryCount,
	})
}

const handleMessage = (e: MessageEvent) => {
	const json = JSON.parse(e.data)
	postMessage<MessageWebSocketWorkerEvent<any>>({
		event: 'message',
		data: json,
	})
}

let socket: ReconnectingWebSocket | undefined = undefined
const closeWebSocket = () => {
	const ws = socket
	if (ws) {
		ws.close()
		ws.removeEventListener('open', handleOpen)
		ws.removeEventListener('close', handleClose)
		ws.removeEventListener('message', handleMessage)
		socket = undefined
	}
}

worker.addEventListener('message', (e: MessageEvent<WebSocketWorkerMessage>) => {
	switch (e.data.event) {
	case 'connect': {
		closeWebSocket()

		const connectEvent = e.data as ConnectWebSocketWorkerMessage
		const ws = new ReconnectingWebSocket(connectEvent.url, undefined, {
			connectionTimeout: connectEvent.connectionTimeout ?? 5000,
			minUptime: connectEvent.minUptime ?? 5000,
		})
		ws.addEventListener('open', handleOpen)
		ws.addEventListener('close', handleClose)
		ws.addEventListener('message', handleMessage)
		socket = ws
		break
	}
	case 'disconnect':
		closeWebSocket()
		break
	}
})

export default worker
