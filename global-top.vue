<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'
import { useNav } from '@slidev/client'
import { clock, cueAt, formatTime, slotMs, staticView, totalMs } from './clock.js'
import { backup, slides } from './data/slides.js'
import notes from './data/speaker-notes.json'
import '@fontsource-variable/dm-sans'
import '@fontsource-variable/playfair-display'
import './styles/deck.css'
import './styles/motion.css'

const { currentPage, go, isPrintMode, isPresenter } = useNav()
const disabled = computed(() => staticView || isPrintMode.value || isPresenter.value)
const showNotes = ref(false)
const backupPage = ref(null)
const active = computed(() => slides[clock.slide - 1])
const note = computed(() => notes[clock.slide - 1])
const progress = computed(() => Math.max(0, Math.min(1, clock.elapsed / totalMs)))
const noteIndex = computed(() => {
  if (clock.mode === 'study') return -1
  const steps = active.value.cues.length
  return Math.round(clock.step * (note.value.sentences.length - 1) / (steps - 1))
})
const totalLabel = formatTime(totalMs)
const sections = [
  ['Opening', 1],
  ['Problem', 2],
  ['Objectives', 4],
  ['Research topic', 6],
  ['University research lines', 8],
  ['Sustainable Development Goal', 11],
  ['Logical framework', 13],
  ['Expected results', 17],
  ['Conclusion', 19],
].map(([label, first], index, list) => ({
  label,
  first,
  last: (list[index + 1]?.[1] ?? slides.length + 1) - 1,
}))
const canJump = computed(() => clock.mode === 'review' || clock.mode === 'manual')
function sectionFill(section) {
  const duration = (section.last - section.first + 1) * slotMs
  return Math.max(0, Math.min(1, (clock.elapsed - (section.first - 1) * slotMs) / duration))
}
let startTime = 0
let reviewTime = 0
let pausedTime = 0
let priorMode = 'review'
let frame
let watchdog
let lastRouteAttempt = -Infinity
let requestedSlide

function navigate(now = performance.now()) {
  if (currentPage.value === clock.slide) return
  if (clock.slide === requestedSlide && now - lastRouteAttempt < 500) return
  lastRouteAttempt = now
  requestedSlide = clock.slide
  try {
    Promise.resolve(go(clock.slide, 0, true)).catch((error) => console.warn('Slide navigation will retry', error))
  } catch (error) {
    console.warn('Slide navigation will retry', error)
  }
}

function tick() {
  const now = performance.now()
  if (clock.mode === 'live') {
    const elapsed = Math.min(totalMs, Math.max(0, now - startTime))
    const slide = Math.min(slides.length, Math.floor(elapsed / slotMs) + 1)
    clock.elapsed = elapsed
    clock.slide = slide
    clock.step = cueAt(slide, elapsed - (slide - 1) * slotMs)
    if (elapsed >= totalMs) clock.mode = 'finished'
  } else if (clock.mode === 'review' && clock.auto && !active.value.manualReview) {
    clock.step = cueAt(clock.slide, now - reviewTime)
  }
  navigate(now)
}

function frameTick() {
  try {
    tick()
  } finally {
    frame = requestAnimationFrame(frameTick)
  }
}

function start() {
  showNotes.value = false
  backupPage.value = null
  clock.slide = 1
  clock.elapsed = 0
  clock.step = 0
  startTime = performance.now()
  clock.mode = 'live'
  navigate()
}

function review(slide = 1) {
  backupPage.value = null
  clock.mode = 'review'
  clock.auto = true
  move(slide, 0)
}

function study(slide = clock.slide) {
  backupPage.value = null
  clock.mode = 'study'
  move(slide, slides[slide - 1].cues.length - 1)
}

function reset() {
  showNotes.value = false
  backupPage.value = null
  clock.mode = 'ready'
  move(1, 0)
}

function move(slide, step) {
  clock.slide = Math.max(1, Math.min(slides.length, slide))
  clock.step = step
  clock.elapsed = (clock.slide - 1) * slotMs
  reviewTime = performance.now()
  navigate()
}

function toggleManual() {
  if (clock.mode === 'study') return
  if (clock.mode === 'ready' || clock.mode === 'finished') review(clock.slide)
  if (clock.mode === 'manual') {
    if (priorMode === 'live') {
      const elapsedOnSlide = active.value.cues[clock.step]
      const elapsed = clock.slide === Math.floor(pausedTime / slotMs) + 1
        ? Math.max(elapsedOnSlide, pausedTime % slotMs)
        : elapsedOnSlide
      startTime = performance.now() - (clock.slide - 1) * slotMs - elapsed
      clock.mode = 'live'
    } else {
      clock.mode = 'review'
      clock.auto = true
      reviewTime = performance.now() - active.value.cues[clock.step]
    }
    tick()
    return
  }
  priorMode = clock.mode
  pausedTime = clock.elapsed
  clock.mode = 'manual'
}

function next(direction, skip = false) {
  if (clock.mode === 'live' || backupPage.value !== null) return
  if (clock.mode === 'ready' || clock.mode === 'finished') {
    review(clock.slide)
    return
  }
  if (clock.mode === 'study') {
    const target = clock.slide + direction
    if (target >= 1 && target <= slides.length) study(target)
    return
  }
  const stepped = clock.mode === 'manual' || active.value.manualReview
  const newStep = clock.step + direction
  if (!skip && stepped && newStep >= 0 && newStep < active.value.cues.length) {
    clock.step = newStep
    return
  }
  const target = clock.slide + direction
  if (target < 1 || target > slides.length) return
  clock.auto = direction === 1
  const step = direction === 1 ? 0 : slides[target - 1].cues.length - 1
  move(target, step)
}

async function toggleFullscreen() {
  try {
    if (document.fullscreenElement) await document.exitFullscreen()
    else await document.documentElement.requestFullscreen()
  } catch (error) {
    console.warn('Fullscreen is unavailable', error)
  }
}

const actions = {
  Enter: () => clock.mode === 'ready' || clock.mode === 'finished' ? start() : next(1),
  ' ': () => clock.mode === 'ready' ? start() : next(1),
  ArrowRight: () => next(1),
  ArrowLeft: () => next(-1),
  ArrowDown: () => next(1, true),
  ArrowUp: () => next(-1, true),
  PageDown: () => next(1, true),
  PageUp: () => next(-1, true),
  a: () => { clock.motion = !clock.motion },
  f: toggleFullscreen,
  m: toggleManual,
  n: () => { showNotes.value = !showNotes.value },
  r: reset,
  Escape: () => {
    if (backupPage.value !== null) backupPage.value = null
    else if (showNotes.value) showNotes.value = false
  },
}

function keydown(event) {
  if (event.ctrlKey || event.altKey || event.metaKey || event.isComposing) return
  if (event.target.closest?.('select, input, textarea, [contenteditable="true"]')) return
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key
  const question = /^[1-3]$/.test(key)
  if (!actions[key] && !question) return
  if ((key === 'Enter' || key === ' ') && event.target.closest?.('button, a')) return
  event.preventDefault()
  event.stopImmediatePropagation()
  if (event.repeat) return
  if (question) {
    if (clock.mode !== 'live') backupPage.value = Number(key) - 1
    return
  }
  actions[key]()
}

onMounted(() => {
  watchEffect(() => {
    document.documentElement.dataset.deckMotion = clock.motion && !disabled.value && clock.mode !== 'study' ? 'on' : 'off'
  })
  if (disabled.value) return
  if (currentPage.value > 1) review(currentPage.value)
  window.addEventListener('keydown', keydown, true)
  document.addEventListener('visibilitychange', tick)
  frame = requestAnimationFrame(frameTick)
  watchdog = window.setInterval(tick, 250)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', keydown, true)
  document.removeEventListener('visibilitychange', tick)
  cancelAnimationFrame(frame)
  clearInterval(watchdog)
})
</script>

<template>
  <Teleport to="body">
  <div v-if="!disabled" class="deck-overlay" :data-mode="clock.mode" :data-motion="clock.motion ? 'on' : 'off'">
    <div
      v-if="clock.mode !== 'ready' && clock.mode !== 'study'"
      class="deck-progress"
      role="progressbar"
      aria-label="Presentation time"
      :aria-valuenow="Math.round(progress * 100)"
    >
      <span
        v-for="section in sections" :key="section.first" class="progress-section"
        :style="{ flex: section.last - section.first + 1 }"
        :class="{ 'section-active': clock.slide >= section.first && clock.slide <= section.last }"
      ><i :style="{ transform: 'scaleX(' + sectionFill(section) + ')' }" /></span>
    </div>
    <div v-if="canJump" class="section-jumps" aria-label="Jump to a section">
      <button v-for="(section, index) in sections" :key="section.first" type="button"
        :class="{ 'section-current': clock.slide >= section.first && clock.slide <= section.last }"
        :title="section.label" :aria-label="'Go to ' + section.label" @click="review(section.first)">
        {{ index + 1 }}
      </button>
    </div>
    <div v-if="clock.mode === 'ready'" class="start-screen">
      <div class="start-orbit" aria-hidden="true" />
      <div class="start-copy">
        <p class="eyebrow">CTeI 1 · PechaKucha</p>
        <h2>Municipal food insecurity</h2>
        <p>20 slides · 20 seconds each · {{ totalLabel }}</p>
        <div class="start-actions">
          <button type="button" class="primary-action" @click="start">Start presentation <span aria-hidden="true">→</span></button>
          <button type="button" class="secondary-action" @click="study()">Study mode <span>· No timer</span></button>
        </div>
      </div>
    </div>
    <button v-if="clock.mode === 'live'" type="button" class="enter-study" @click="study()">Study mode</button>
    <div v-if="clock.mode === 'finished'" class="finish-controls">
      <span>{{ totalLabel }} complete</span><button type="button" @click="study()">Study mode</button><button type="button" @click="reset">Replay</button>
    </div>
    <div v-if="clock.mode === 'review' || clock.mode === 'manual'" class="review-controls">
      <button type="button" aria-label="Previous slide or reveal" @click="next(-1)">←</button>
      <span>{{ clock.mode === 'manual' ? 'Manual' : active.manualReview ? 'Manual reveals' : 'Rehearsal' }}</span>
      <button type="button" aria-label="Next slide or reveal" @click="next(1)">→</button>
      <button type="button" @click="study()">Study mode</button>
      <button type="button" @click="reset">Home</button>
    </div>

    <nav v-if="clock.mode === 'study'" class="study-controls" aria-label="Study controls">
      <div class="study-navigation">
        <button type="button" aria-label="Previous slide" :disabled="clock.slide === 1" @click="next(-1)">←</button>
        <select :value="clock.slide" aria-label="Choose any slide" @change="study(Number($event.target.value))">
          <option v-for="(slide, index) in slides" :key="slide.title" :value="index + 1">
            {{ String(index + 1).padStart(2, '0') }} · {{ slide.title }}
          </option>
        </select>
        <button type="button" aria-label="Next slide" :disabled="clock.slide === slides.length" @click="next(1)">→</button>
      </div>
      <div class="study-actions">
        <button type="button" :aria-pressed="showNotes" @click="showNotes = !showNotes">Speaker notes</button>
        <button type="button" @click="review(clock.slide)">Rehearse reveals</button>
        <button type="button" @click="reset">Home</button>
      </div>
    </nav>

    <aside v-if="showNotes" class="notes-panel" aria-label="Speaker notes">
      <div class="notes-heading">
        <div><p class="eyebrow">Slide {{ clock.slide }} · {{ clock.mode === 'study' ? 'Study mode' : note.start + ' · 20 seconds' }}</p><h2>{{ active.title }}</h2></div>
        <button type="button" aria-label="Close speaker notes" @click="showNotes = false">×</button>
      </div>
      <p class="notes-idea">{{ active.idea }}</p>
      <div class="spoken-script">
        <p v-for="(sentence, index) in note.sentences" :key="index" :class="{ 'current-line': index === noteIndex }">{{ sentence }}</p>
      </div>
      <p class="notes-cue">{{ note.cue }}</p>
      <p class="notes-bridge"><strong>Next</strong> {{ active.bridge }}</p>
      <p v-if="active.sourceNote" class="notes-cue">{{ active.sourceNote }}</p>
      <ul v-if="note.links.length" class="note-links">
        <li v-for="link in note.links" :key="link.label">
          <a v-if="link.url" :href="link.url" target="_blank" rel="noopener noreferrer">{{ link.label }}</a>
          <span v-else>{{ link.label }}</span>
        </li>
      </ul>
    </aside>

    <div v-if="backupPage !== null" class="backup-backdrop">
      <section class="backup-card" role="dialog" aria-label="Backup answer">
        <p class="eyebrow">Q&A · {{ backupPage + 1 }} / {{ backup.length }}</p>
        <h2>{{ backup[backupPage].title }}</h2>
        <p>{{ backup[backupPage].body }}</p>
        <a v-if="backup[backupPage].source" :href="backup[backupPage].source" target="_blank" rel="noopener noreferrer">
          {{ backup[backupPage].credit }}
        </a>
        <button type="button" @click="backupPage = null">Return to slide</button>
      </section>
    </div>
  </div>
  </Teleport>
</template>
