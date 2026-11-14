<script setup>
import { computed } from 'vue'
import { cundinamarca as map } from '../data/cundinamarca-map.js'

// One drawing, three jobs. `stage` moves the cover map from the department silhouette (0)
// to municipal boundaries (1) to DANE's 2022 estimates (2). `variant` switches the same
// outlines to the Gacheta locator and to the illustrative planning view.
const props = defineProps({
  stage: { type: Number, default: 2 },
  variant: { type: String, default: 'cover' },
  label: { type: String, default: '' },
})
const wave = (m) => Math.round((m.x / map.w + m.y / map.h) * 12)
const cells = map.m.map(m => ({ ...m, wave: wave(m), look: hash(m.c) % 9 === 0 }))
function hash(code) {
  let value = 0
  for (const ch of code) value = (value * 31 + ch.charCodeAt(0)) >>> 0
  return value
}
const gacheta = computed(() => map.m.find(m => m.q))
</script>

<template>
  <svg
    class="cmap"
    :viewBox="`0 0 ${map.w} ${map.h}`"
    :data-stage="stage"
    :data-variant="variant"
    role="img"
    :aria-label="label || 'Map of the 116 municipalities of Cundinamarca'"
  >
    <g class="cmap-cells">
      <path
        v-for="m in cells" :key="m.c" :d="m.d" class="cell" fill-rule="evenodd"
        :data-k="m.k" :data-q="m.q || undefined" :data-look="m.look || undefined"
        :style="{ '--wave': m.wave }"
      />
    </g>
    <path v-if="map.bogota" :d="map.bogota.d" class="cmap-bogota" fill-rule="evenodd" />
    <text v-if="map.bogota" :x="map.bogota.x" :y="map.bogota.y + 4" class="cmap-bogota-label">Bogotá D.C.</text>
    <g v-if="variant === 'locator'" class="cmap-pin" :transform="`translate(${gacheta.x} ${gacheta.y})`">
      <circle class="pin-ring" r="22" />
      <circle class="pin-ring pin-ring-late" r="22" />
      <circle class="pin-dot" r="13" />
    </g>
    <g v-if="variant === 'cover'" class="cmap-label">
      <text :x="map.w * 0.5" :y="map.h * 0.48" class="label-main">Cundinamarca</text>
      <text :x="map.w * 0.5" :y="map.h * 0.48 + 30" class="label-sub">one departmental number</text>
    </g>
  </svg>
</template>
