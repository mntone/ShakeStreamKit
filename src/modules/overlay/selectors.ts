import type { RootState } from '../../app/store'

export const selectOverlay = (state: RootState) => state.overlay.overlay

export const selectWave = (state: RootState) => state.overlay.wave
