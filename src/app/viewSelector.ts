import type { RootState } from './store'

export const selectOverlay = (state: RootState) => state.view.overlay

export const selectWave = (state: RootState) => state.view.wave
