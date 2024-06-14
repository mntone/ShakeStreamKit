import { PayloadAction, createSlice } from '@reduxjs/toolkit'

// State
export type LogType =
	| 'test'
	| 'websocket_connect'
	| 'websocket_disconnect'

export interface Log {
	type: LogType
	timestamp: number
}

export interface LogState {
	logs: Log[]
}

const initialState: LogState = {
	logs: [],
}

// Slice
const logSlice = createSlice({
	name: 'log',
	initialState,
	reducers: {
		addLog(state, action: PayloadAction<Log>) {
			state.logs.push(action.payload)
		},
	},
})

export const {
	addLog,
} = logSlice.actions
export default logSlice.reducer
