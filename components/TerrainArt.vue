<script setup>
import { terrain } from '../data/terrain-contours.js'
</script>

<template>
  <svg class="terrain" :viewBox="`0 0 ${terrain.w} ${terrain.h}`" aria-hidden="true">
    <path class="terrain-minor" :d="terrain.minor" />
    <path class="terrain-major" :d="terrain.major" />
  </svg>
</template>
