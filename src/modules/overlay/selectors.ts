import type { RootState } from '../../app/store'

export const selectWave = (state: RootState) => state.overlay.wave
