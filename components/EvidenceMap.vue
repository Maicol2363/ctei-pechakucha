<script setup>
import { computed } from 'vue'
import { worldMaps } from '../data/world-maps.js'

// `evidence` shows where the ten appraised studies were run. `horn` shows the six countries in Foini et al.
// Study countries come from the RAE workbook (methodology fields), not from this file's geometry.
const props = defineProps({
  variant: { type: String, default: 'evidence' },
  step: { type: Number, default: 0 },
})

const map = computed(() => worldMaps[props.variant === 'horn' ? 'horn' : 'evidence'])
// Appraised studies per country: Tomes, Lentz and Gholami (Malawi); Busker (Kenya, Somalia, Ethiopia); Westerveld (Ethiopia);
// Gubert (Brazil); Pyne (India); Herteux (Mali, Nigeria, Syria, Yemen); Foini (Burkina Faso, Cameroon, Mali, Nigeria, Syria, Yemen).
const studies = { MWI: 3, ETH: 2, KEN: 1, SOM: 1, BRA: 1, IND: 1, MLI: 2, NGA: 2, SYR: 2, YEM: 2, BFA: 1, CMR: 1 }
const forecastLed = ['SYR', 'YEM']
const foini = ['SYR', 'YEM', 'BFA', 'CMR', 'MLI', 'NGA']
const labels = { SYR: 'Syria', YEM: 'Yemen', BFA: 'Burkina Faso', CMR: 'Cameroon', MLI: 'Mali', NGA: 'Nigeria' }

const order = computed(() => {
  const ids = Object.keys(studies)
  return Object.fromEntries(ids.sort((a, b) => map.value.center[a][0] - map.value.center[b][0]).map((id, index) => [id, index]))
})
function look(country) {
  if (props.variant === 'horn') {
    if (forecastLed.includes(country.id)) return { 'is-forecast': true, 'is-on': props.step >= 1 }
    if (foini.includes(country.id)) return { 'is-baseline': true, 'is-on': props.step >= 2 }
    return {}
  }
  if (country.id === 'COL') return { 'is-home': true }
  return studies[country.id] ? { 'is-study': true, ['count-' + studies[country.id]]: true } : {}
}
const labelled = computed(() => props.variant === 'horn' ? Object.keys(labels) : [])
const home = computed(() => map.value.center.COL)
</script>

<template>
  <svg class="emap" :class="'emap-' + variant" :viewBox="`0 0 ${map.w} ${map.h}`" role="img"
    :aria-label="variant === 'horn' ? 'Map of the six countries in Foini et al.' : 'Map of the countries where the ten appraised studies were run'">
    <g class="emap-land">
      <path
        v-for="country in map.countries" :key="country.id" :d="country.d" class="emap-country"
        :class="look(country)" :style="{ '--order': order[country.id] ?? 0 }"
      />
    </g>
    <g v-if="variant === 'evidence'" class="emap-home" :transform="`translate(${home[0]} ${home[1]})`">
      <circle class="home-ring" r="9" /><circle class="home-ring home-ring-late" r="9" /><circle class="home-dot" r="3.4" />
    </g>
    <g v-for="id in labelled" :key="id" class="emap-label" :class="{ 'is-on': step >= (forecastLed.includes(id) ? 1 : 2) }">
      <text :x="map.center[id][0]" :y="map.center[id][1] + 5">{{ labels[id] }}</text>
    </g>
  </svg>
</template>
