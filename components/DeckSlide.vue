<script setup>
import { computed } from 'vue'
import { useNav } from '@slidev/client'
import { clock, staticView } from '../clock.js'
import { presenter, question, slides } from '../data/slides.js'
import municipalMap from '../assets/cundinamarca.png'
import zeroHunger from '../assets/sdg2.png'

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
    class="deck-scene"
    :class="['tone-' + (slide.tone || 'paper'), 'scene-' + slide.kind]"
    :data-slide="number"
    :data-step="step"
    :data-motion="clock.motion && !still && clock.slide === number && !['ready', 'study'].includes(clock.mode) ? 'on' : 'off'"
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
        <figcaption>Household food insecurity · Cundinamarca, 2022</figcaption>
        <div class="map-image">
          <img :src="municipalMap" alt="DANE’s map of 2022 municipal estimates for moderate or severe household food insecurity">
          <span class="map-scan" aria-hidden="true" />
          <div class="map-legend">
            <span v-for="(label, index) in legend" :key="label">
              <i :style="{ backgroundColor: colors[index] }" />{{ label }}
            </span>
          </div>
        </div>
        <small :class="reveal(1)">DANE · FIES Municipal 2022 · Figure 20</small>
      </figure>
    </div>

    <div v-else-if="slide.kind === 'split'" class="split-body">
      <div class="split-grid">
        <section v-for="([context, title, detail], index) in slide.items" :key="title" :class="[reveal(index + 1), { 'split-focus': step === index + 1 }]">
          <p class="eyebrow">{{ context }}</p>
          <h2>{{ title }}</h2>
          <p>{{ detail }}</p>
          <div v-if="number === 2" class="task-timeline" :class="{ 'forecast-timeline': index === 1 }">
            <span class="time-baseline" aria-hidden="true"><i /><b /></span>
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

    <div v-else-if="flowKinds.includes(slide.kind)" class="flow-body">
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
        </li>
      </ol>
      <div v-if="slide.kind === 'local'" class="local-flag" :class="reveal(3)">
        <span class="quality-signal" aria-hidden="true">!</span>
        <h2>Gachetá</h2><p>{{ slide.takeaway }}</p>
      </div>
      <p v-if="number === 12" class="takeaway" :class="reveal(3)">Use in planning depends on validation.</p>
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
        <strong>10</strong>
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
        <img :src="zeroHunger" alt="United Nations Sustainable Development Goal 2, Zero Hunger">
      </figure>
    </div>

    <footer class="scene-footer">
      <span>{{ slide.source || 'CTeI 1 · Universidad de Cundinamarca' }}</span>
      <span>{{ serial(number) }} / {{ slides.length }}</span>
    </footer>
  </article>
</template>
