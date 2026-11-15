<script setup>
import { computed } from 'vue'

// Line icons drawn for this deck on a 48 x 48 grid. They share one stroke weight so every slide reads as one set.
const shapes = {
  paper: '<path d="M12 6h18l8 8v28H12z"/><path d="M30 6v8h8"/><path d="M18 24h14M18 31h14"/>',
  magnifier: '<circle cx="21" cy="21" r="12"/><path d="M30 30l12 12"/>',
  sliders: '<path d="M6 12h36M6 24h36M6 36h36"/><circle cx="17" cy="12" r="4"/><circle cx="31" cy="24" r="4"/><circle cx="21" cy="36" r="4"/>',
  guide: '<path d="M12 6h18l8 8v28H12z"/><path d="M30 6v8h8"/><path d="M18 29l5 5 9-11"/>',
  database: '<ellipse cx="24" cy="12" rx="15" ry="6"/><path d="M9 12v24c0 3.3 6.7 6 15 6s15-2.7 15-6V12"/><path d="M9 24c0 3.3 6.7 6 15 6s15-2.7 15-6"/>',
  nodes: '<circle cx="24" cy="10" r="5"/><circle cx="10" cy="36" r="5"/><circle cx="38" cy="36" r="5"/><path d="M21 14l-8 18M27 14l8 18M15 36h18"/>',
  chart: '<path d="M6 42h36"/><path d="M12 42V28M22 42V16M32 42V22M42 42V8"/>',
  tag: '<path d="M6 24V8h16l20 20-16 16z"/><circle cx="15" cy="17" r="2.5"/>',
  trace: '<path d="M14 6v36"/><circle cx="14" cy="12" r="4"/><circle cx="14" cy="24" r="4"/><circle cx="14" cy="36" r="4"/><path d="M24 12h18M24 24h14M24 36h16"/>',
  checklist: '<path d="M6 12l4 4 7-8M6 28l4 4 7-8"/><path d="M24 12h18M24 28h18M24 42h18"/><circle cx="11" cy="42" r="3.5"/>',
  gauge: '<path d="M6 36a18 18 0 0 1 36 0"/><path d="M24 36l9-14"/><circle cx="24" cy="36" r="3"/><path d="M6 42h36"/>',
  pin: '<path d="M24 44s14-13 14-24a14 14 0 0 0-28 0c0 11 14 24 14 24z"/><circle cx="24" cy="20" r="5"/>',
  person: '<circle cx="24" cy="14" r="8"/><path d="M8 43c0-10 7-16 16-16s16 6 16 16"/>',
  books: '<path d="M7 8h10v34H7zM19 8h10v34H19z"/><path d="M31 12l10-3 6 31-10 3z"/>',
  townhall: '<path d="M5 42h38M9 42V19l15-9 15 9v23"/><path d="M17 42V28h14v14M24 10V4"/>',
  houses: '<path d="M4 42V25l12-10 12 10v17zM28 42V31l9-8 9 8v11z"/>',
  list: '<path d="M6 10h4M6 24h4M6 38h4M16 10h26M16 24h26M16 38h26"/>',
  grid: '<path d="M6 6h36v36H6zM6 18h36M6 30h36M18 6v36M30 6v36"/>',
  lock: '<rect x="10" y="22" width="28" height="20" rx="3"/><path d="M16 22v-6a8 8 0 0 1 16 0v6"/><circle cx="24" cy="32" r="2.5"/>',
  alert: '<path d="M24 6l20 36H4z"/><path d="M24 19v12M24 36.5v.5"/>',
  check: '<path d="M10 25l9 9 19-21"/>',
}

const props = defineProps({ name: { type: String, required: true } })
const html = computed(() => (shapes[props.name] || '').replace(/<(path|circle|rect|ellipse)/g, '<$1 pathLength="1"'))
</script>

<template>
  <svg class="ico" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" v-html="html" />
</template>
