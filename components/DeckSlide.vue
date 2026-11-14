<script setup>
import { computed } from 'vue'
import { useNav } from '@slidev/client'
import { clock, staticView } from '../clock.js'
import { presenter, question, slides } from '../data/slides.js'
import zeroHunger from '../assets/sdg2.png'
import MunicipalMap from './MunicipalMap.vue'
import { outlines } from '../data/study-outlines.js'
import gachetaPhoto from '../assets/gacheta-plaza.jpg'
import cachipayPhoto from '../assets/cachipay-market.jpg'

const props = defineProps({ number: { type: Number, required: true } })
const { isPrintMode } = useNav()
const slide = slides[props.number - 1]
const still = computed(() => staticView || isPrintMode.value)
const step = computed(() => still.value || clock.slide !== props.number || clock.mode === 'ready'
  ? slide.cues.length - 1
  : clock.step)
const reveal = (index) => ({ 'reveal': true, 'is-visible': step.value >= index })
const serial = number => String(number).padStart(2, '0')
const colors = ['#feebe1', '#fdafb7', '#f668a0', '#c31b83', '#79046a', '#bdbdbd']
const legend = ['Below 20%', '20% to 30%', '30% to 40%', '40% to 60%', 'Above 60%', 'No estimate']
const flowKinds = ['flow', 'local', 'local-impact']
// Slide 2: one dot per cell of a coarse grid, clipped to Brazil's outline (a stand-in for its 5,507 municipalities).
const brazilDots = []
for (let y = 12; y < outlines.brazil.h; y += 24) {
  for (let x = 12; x < outlines.brazil.w; x += 24) brazilDots.push({ x, y, wave: Math.round((x / outlines.brazil.w + y / outlines.brazil.h) * 10) })
}
// Slide 6: the ten full-text appraisals recorded in the RAE workbook.
const appraised = ['Tomes 2025', 'Busker 2024', 'Westerveld 2021', 'Lentz 2019', 'Gholami 2022', 'Gubert 2010', 'Pyne 2023', 'Balashankar 2023', 'Herteux 2024', 'Foini 2023']
// Slide 7: the six countries in Foini et al. Forecast beat the last observed value in Syria and Yemen only.
const countries = [['Syria', true], ['Yemen', true], ['Burkina Faso', false], ['Cameroon', false], ['Mali', false], ['Nigeria', false]]
</script>

<template>
  <article
    :key="clock.replay"
    class="deck-scene"
    :class="['tone-' + (slide.tone || 'paper'), 'scene-' + slide.kind]"
    :data-slide="number"
    :data-step="step"
    :data-study="!still && clock.mode === 'study' || undefined"
    :data-motion="clock.motion && !still && clock.slide === number && clock.mode !== 'ready' ? 'on' : 'off'"
  >
    <div class="scene-field" aria-hidden="true">
      <span class="field-grid" />
      <span class="field-ring" />
      <span class="field-ring field-ring-inner" />
      <span class="field-trace" />
      <span class="field-beacon" />
      <span v-for="index in 6" :key="index" class="field-particle" :style="{ '--particle': index }" />
    </div>
    <MunicipalMap v-if="slide.kind === 'closing'" class="closing-map" variant="closing" :stage="step" aria-hidden="true" label="Cundinamarca's 116 municipalities lighting up" />
    <header class="scene-header">
      <p class="eyebrow" :class="reveal(0)">{{ slide.label }}</p>
      <h1 v-if="slide.kind !== 'opening'" :class="reveal(0)">{{ slide.title }}</h1>
    </header>

    <div v-if="slide.kind === 'opening'" class="opening-grid">
      <div class="opening-copy">
        <h1 :class="reveal(0)">{{ question }}</h1>
        <div :class="reveal(0)" class="byline">
          <strong>{{ presenter }}</strong>
          <span>Universidad de Cundinamarca</span>
        </div>
      </div>
      <figure class="map" :class="reveal(0)">
        <figcaption>
          <span class="map-title" :data-on="step < 1">Cundinamarca · department level</span>
          <span class="map-title" :data-on="step === 1">116 municipal boundaries</span>
          <span class="map-title" :data-on="step >= 2">Household food insecurity · 2022 estimates</span>
        </figcaption>
        <div class="map-body">
          <MunicipalMap :key="clock.mode === 'ready' ? 'ready' : 'play-' + clock.replay" class="map-art" :stage="Math.min(step, 2)" label="Cundinamarca resolving into 116 municipalities, colored by DANE's 2022 household food-insecurity estimates" />
          <div class="map-legend" :class="{ 'is-on': step >= 2 }">
            <span v-for="(label, index) in legend" :key="label">
              <i :style="{ backgroundColor: colors[index], '--legend-order': index }" />{{ label }}
            </span>
          </div>
        </div>
        <small class="map-source">
          <span :data-on="step < 2">Boundaries · DANE 2020 via geoBoundaries</span>
          <span :data-on="step >= 2">Estimates · DANE FIES Municipal 2022, Figure 20<br>Boundaries · DANE 2020 via geoBoundaries</span>
        </small>
      </figure>
    </div>

    <div v-else-if="slide.kind === 'split'" class="split-body">
      <div class="split-grid">
        <section v-for="([context, title, detail], index) in slide.items" :key="title" :class="[reveal(index + 1), { 'split-focus': step === index + 1 }]">
          <p class="eyebrow">{{ context }}</p>
          <h2>{{ title }}</h2>
          <p>{{ detail }}</p>
          <div v-if="number === 2" class="task-timeline" :class="{ 'forecast-timeline': index === 1 }">
            <span class="time-baseline" aria-hidden="true"><i /><b /><span class="time-playhead" /></span>
            <small>{{ index === 0 ? 'Reference period' : 'Observed period' }}</small>
            <small v-if="index === 1">Future period</small>
          </div>
          <div v-if="number === 7" class="comparison-track">
            <span class="comparison-mark" aria-hidden="true" />
            {{ index === 0 ? 'Model ahead of baseline' : 'Baseline ahead of model' }}
          </div>
          <div v-if="number === 2" class="study-art" :class="index === 0 ? 'art-brazil' : 'art-horn'" aria-hidden="true">
            <svg v-if="index === 0" :viewBox="`0 0 ${outlines.brazil.w} ${outlines.brazil.h}`">
              <defs><clipPath id="clip-brazil"><path :d="outlines.brazil.d" /></clipPath></defs>
              <path class="art-shape" :d="outlines.brazil.d" />
              <g clip-path="url(#clip-brazil)">
                <circle v-for="(dot, n) in brazilDots" :key="n" class="art-dot" :cx="dot.x" :cy="dot.y" r="5" :style="{ '--wave': dot.wave }" />
              </g>
            </svg>
            <svg v-else :viewBox="`0 0 ${outlines.horn.w} ${outlines.horn.h}`">
              <path v-for="name in ['kenya', 'somalia', 'ethiopia']" :key="name" class="art-shape art-region" :d="outlines.horn[name]" />
            </svg>
            <small>{{ index === 0 ? '5,507 municipalities' : '213 units, up to 12 months ahead' }}</small>
          </div>
          <span class="moving-rule" aria-hidden="true" />
        </section>
      </div>
      <div v-if="number === 7" class="country-strip" :class="{ 'baseline-shown': step >= 2, 'forecast-shown': step >= 1 }">
        <span
          v-for="([name, forecastLed], index) in countries" :key="name" class="country-chip"
          :class="forecastLed ? 'chip-forecast' : 'chip-baseline'" :style="{ '--chip': index }"
        ><strong>{{ name }}</strong><small>{{ forecastLed ? 'Forecast led' : 'Baseline led' }}</small></span>
      </div>
      <p class="takeaway" :class="reveal(3)">{{ slide.takeaway }}</p>
    </div>

    <div v-else-if="flowKinds.includes(slide.kind)" class="flow-body" :class="{ 'flow-with-photo': slide.kind === 'local' || slide.kind === 'local-impact' }">
      <div class="flow-main">
        <ol class="flow-track">
          <li
            v-for="(item, index) in slide.items" :key="index"
            :class="[
              reveal(slide.kind === 'local' ? Math.min(index + 1, 2) : index + 1),
              { 'link-ready': index < slide.items.length - 1 && step >= (slide.kind === 'local' ? 2 : index + 2) },
            ]"
          >
            <span class="track-dot" aria-hidden="true" />
            <span v-if="index < slide.items.length - 1" class="flow-link" aria-hidden="true"><i /></span>
            <span v-if="Array.isArray(item)" class="eyebrow">{{ item[0] }}</span>
            <strong>{{ Array.isArray(item) ? item[1] : item }}</strong>
            <span v-if="number === 10 && index === 1" class="model-pool" :class="{ 'is-filtering': step >= 2 }" aria-hidden="true">
              <i v-for="n in 6" :key="n" :style="{ '--model': n }" />
            </span>
            <span v-if="number === 10 && index === 1" class="pool-label" :class="{ 'is-on': step >= 2 }">Shortlist, then test locally</span>
            <span v-if="number === 10 && index === 2" class="version-chip" :class="{ 'is-on': step >= 3 }" aria-hidden="true">Model v1 · inputs logged</span>
          </li>
        </ol>
        <div v-if="slide.kind === 'local'" class="local-flag" :class="reveal(3)">
          <span class="quality-signal" aria-hidden="true">!</span>
          <h2>Gachetá</h2><p>{{ slide.takeaway }}</p>
        </div>
        <p v-if="number === 12" class="takeaway" :class="reveal(3)">Use in planning depends on validation.</p>
      </div>
      <figure v-if="slide.kind === 'local-impact'" class="plan-card" :class="reveal(1)">
        <MunicipalMap variant="plan" :stage="step" label="Illustrative map of municipalities being assessed" />
        <figcaption>
          <b>{{ ['', 'Municipal outlines', 'Estimates with uncertainty', 'Further assessment'][step] }}</b>
          <span>Illustrative only · not a result</span>
        </figcaption>
      </figure>
      <figure v-if="slide.kind === 'local'" class="photo-card gacheta-card" :class="reveal(3)">
        <div class="photo-frame">
          <img :src="gachetaPhoto" alt="The main square and church of Gachetá, Cundinamarca">
          <span class="photo-flag" aria-hidden="true">Quality flag · 2022</span>
          <div class="photo-locator">
            <MunicipalMap variant="locator" :stage="2" label="Gachetá marked on the map of Cundinamarca" />
          </div>
        </div>
        <figcaption>Gachetá, Cundinamarca · Photo: Click1master, CC BY 4.0, Wikimedia Commons</figcaption>
      </figure>
    </div>

    <div v-else-if="slide.kind === 'statement'" class="statement-body">
      <h2 :class="reveal(1)">{{ slide.items[0] }}</h2>
      <div :class="reveal(2)" class="statement-line">
        <span>{{ slide.items[1] }}</span>
        <span class="statement-arrow" aria-hidden="true">→</span>
        <span>{{ slide.items[2] }}</span>
      </div>
    </div>

    <div v-else-if="['rows', 'actors', 'alternatives'].includes(slide.kind)" class="rows-body">
      <ol class="deck-rows">
        <li
          v-for="([title, detail], index) in slide.items" :key="title"
          :class="[reveal(index + 1), { 'selected-row': slide.kind === 'alternatives' && index === 2, 'row-focus': step === index + 1 }]"
        >
          <span class="row-index" aria-hidden="true">{{ serial(index + 1) }}</span>
          <strong>{{ title }}</strong><span class="row-detail">{{ detail }}</span>
        </li>
      </ol>
      <p v-if="slide.takeaway && number !== 17" class="takeaway" :class="reveal(slide.items.length + 1)">{{ slide.takeaway }}</p>
      <div v-if="number === 17" class="rule-card" :class="reveal(slide.items.length + 1)">
        <div class="rule-copy">
          <p class="eyebrow">Example guide entry</p>
          <p class="rule-title">Check uncertainty before use</p>
        </div>
        <div class="rule-gauge" aria-hidden="true">
          <span class="gauge-track" /><span class="gauge-zone" /><span class="gauge-limit"><b>30% cvlog</b></span><span class="gauge-dot" />
          <span class="gauge-stamp">Flag</span>
        </div>
      </div>
      <div v-if="number === 19" class="merge-rings" :class="reveal(1)" :data-merge="step >= 3 || undefined" aria-hidden="true">
        <svg viewBox="0 0 360 320">
          <g class="merge-links"><path d="M180 124V141" /><path d="M121 219L142 207" /><path d="M239 219L218 207" /></g>
          <g class="merge-sat sat-a"><circle cx="180" cy="64" r="60" /><text x="180" y="70">Data fit</text></g>
          <g class="merge-sat sat-b"><circle cx="69" cy="249" r="60" /><text x="69" y="255">Performance</text></g>
          <g class="merge-sat sat-c"><circle cx="291" cy="249" r="60" /><text x="291" y="255">Interpretability</text></g>
          <g class="merge-hub"><circle cx="180" cy="185" r="44" /><text x="180" y="181">Intended</text><text x="180" y="201">use</text></g>
        </svg>
      </div>
    </div>

    <div v-else-if="slide.kind === 'count'" class="count-body">
      <div class="count-stat" :class="reveal(0)">
        <strong><span class="sr-only">10</span><span class="appraisal-number" aria-hidden="true" /></strong>
        <span>Full-text appraisals</span>
      </div>
      <div class="matrix" :data-cols="Math.min(step, 3)">
        <div class="matrix-head" aria-hidden="true">
          <span />
          <span v-for="(item, index) in slide.items" :key="item" :class="reveal(index + 1)">{{ item }}</span>
        </div>
        <ol class="matrix-rows">
          <li v-for="(paper, row) in appraised" :key="paper" :class="reveal(0)" :style="{ '--row': row }">
            <span class="matrix-paper">{{ paper }}</span>
            <i v-for="col in 3" :key="col" class="matrix-tick" :class="{ 'is-on': step >= col }" :style="{ '--col': col }" />
          </li>
        </ol>
        <span class="sr-only">Each of the ten papers was appraised for {{ slide.items.join(', ') }}.</span>
      </div>
    </div>

    <div v-else-if="slide.kind === 'sdg'" class="sdg-body">
      <figure class="sdg-icon" :class="reveal(0)">
        <img :src="zeroHunger" alt="United Nations Sustainable Development Goal 2, Zero Hunger">
      </figure>
      <div class="sdg-points">
        <section v-for="([title, detail], index) in slide.items" :key="title" :class="reveal(index + 1)">
          <p class="eyebrow">{{ title }}</p><p>{{ detail }}</p>
        </section>
      </div>
      <figure class="photo-card market-card" :class="reveal(1)">
        <div class="photo-frame"><img :src="cachipayPhoto" alt="Vendors and shoppers in the covered market of Cachipay, Cundinamarca"></div>
        <figcaption>Market in Cachipay, Cundinamarca · Photo: Jairud, CC BY-SA 4.0, Wikimedia Commons</figcaption>
      </figure>
    </div>

    <div v-else-if="slide.kind === 'problem'" class="problem-body">
      <div class="tree-branch" :class="reveal(3)">
        <p class="eyebrow">Potential effect</p><p>Choice with weak evidence of local fit</p>
      </div>
      <div class="tree-trunk" :class="reveal(1)">{{ slide.takeaway }}</div>
      <ul class="tree-roots" :class="reveal(2)">
        <li v-for="(item, index) in slide.items" :key="item" :style="{ '--branch-order': index }">{{ item }}</li>
      </ul>
    </div>

    <div v-else-if="slide.kind === 'objectives'" class="objectives-body">
      <div class="objective-labels">
        <span>Products</span><span>Objectives</span><span>Activities</span>
      </div>
      <ol class="objective-tree">
        <li v-for="([activity, objective, product], index) in slide.items" :key="objective" :class="reveal(index + 1)">
          <span class="product">{{ product }}</span><strong>{{ objective }}</strong><span class="activity">{{ activity }}</span>
        </li>
      </ol>
    </div>

    <div v-else-if="slide.kind === 'closing'" class="closing-body">
      <ol>
        <li v-for="(item, index) in slide.items" :key="item" :class="[reveal(index + 1), { 'row-focus': step === index + 1 }]">
          <span class="row-index" aria-hidden="true">{{ serial(index + 1) }}</span><span>{{ item }}</span>
        </li>
      </ol>
      <figure class="sdg-icon" :class="reveal(0)">
        <span class="closing-orbit" aria-hidden="true"><i /><i /></span>
        <img :src="zeroHunger" alt="United Nations Sustainable Development Goal 2, Zero Hunger">
      </figure>
    </div>

    <footer class="scene-footer">
      <span>{{ slide.source || 'CTeI 1 · Universidad de Cundinamarca' }}</span>
      <span>{{ serial(number) }} / {{ slides.length }}</span>
    </footer>
  </article>
</template>
