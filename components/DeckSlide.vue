<script setup>
import { computed } from 'vue'
import { useNav } from '@slidev/client'
import { clock, staticView } from '../clock.js'
import { presenter, question, slides } from '../data/slides.js'
import zeroHunger from '../assets/sdg2.png'
import MunicipalMap from './MunicipalMap.vue'
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
          <span class="moving-rule" aria-hidden="true" />
        </section>
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
      <p v-if="slide.takeaway" class="takeaway" :class="reveal(slide.items.length + 1)">{{ slide.takeaway }}</p>
    </div>

    <div v-else-if="slide.kind === 'count'" class="count-body">
      <div class="count-stat" :class="reveal(0)">
        <strong><span class="sr-only">10</span><span class="appraisal-number" aria-hidden="true" /></strong>
        <span>Full-text appraisals</span>
        <div class="appraisal-papers" aria-hidden="true">
          <i v-for="index in 10" :key="index" :style="{ '--paper-order': index }" />
        </div>
      </div>
      <ol class="count-list">
        <li v-for="(item, index) in slide.items" :key="item" :class="reveal(index + 1)">
          <i aria-hidden="true" />{{ item }}
        </li>
      </ol>
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
