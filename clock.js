import { reactive } from 'vue'
import { slides } from './data/slides.js'

export const slotMs = 20_000
export const totalMs = slides.length * slotMs
export const staticView = new URLSearchParams(window.location.search).has('static')

export const clock = reactive({
  mode: 'ready',
  slide: 1,
  step: 0,
  elapsed: 0,
  motion: new URLSearchParams(window.location.search).get('motion') !== 'off',
  auto: true,
})

export function cueAt(slide, milliseconds) {
  const cues = slides[slide - 1].cues
  return cues.findLastIndex(cue => milliseconds >= cue)
}

export function formatTime(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000)
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}
