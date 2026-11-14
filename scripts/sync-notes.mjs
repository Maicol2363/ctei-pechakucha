import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { slides } from '../data/slides.js'

const scriptUrl = new URL('../../Speaker_Script.md', import.meta.url)
const notesUrl = new URL('../data/speaker-notes.json', import.meta.url)
const script = await readFile(scriptUrl, 'utf8').catch((error) => {
  if (error.code !== 'ENOENT') throw error
  return null
})

if (script) {
  const section = /^## (\d+) · (\d+:\d\d) · [^\r\n]+\r?\n\r?\n> ([^\r\n]+)\r?\n\r?\n\*\*Cue\*\* ([^\r\n]+)/gm
  const segmenter = new Intl.Segmenter('en', { granularity: 'sentence' })
  const notes = [...script.matchAll(section)].map(([, number, start, spoken, cue], index) => {
    const seconds = index * 20
    const expected = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
    if (Number(number) !== index + 1 || start !== expected) {
      throw new Error(`Timing mismatch in Speaker_Script.md at slide ${index + 1}`)
    }
    const links = [...cue.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)].map(([, label, url]) => ({
      label,
      ...(url.startsWith('https://') ? { url } : {}),
    }))
    return {
      start,
      spoken,
      sentences: [...segmenter.segment(spoken)].map(({ segment }) => segment.trim()),
      cue: cue.split(/\s\[/, 1)[0],
      links,
    }
  })
  if (notes.length !== slides.length) throw new Error('Expected one script entry per slide')
  await mkdir(new URL('../data/', import.meta.url), { recursive: true })
  await writeFile(notesUrl, JSON.stringify(notes, null, 2) + '\n')
}

// The generated snapshot also supports building from a standalone checkout.
const notes = JSON.parse(await readFile(notesUrl, 'utf8'))
if (notes.length !== slides.length) throw new Error('The notes snapshot must cover all 20 slides')

const head = `---
theme: default
layout: default
title: Municipal food insecurity
author: Maycol Estiven Fonseca Muñoz
favicon: ./assets/cundinamarca.png
aspectRatio: 16/9
canvasWidth: 1280
routerMode: hash
colorSchema: light
fonts:
  provider: none
transition: grid-shift
presenter: true
drawings:
  enabled: false
---`
const pages = slides.map((slide, index) => {
  const note = notes[index]
  const sources = note.links.map(({ label, url }) => url ? `${label} (${url})` : label)
  return `# ${slide.title}

<DeckSlide :number="${index + 1}" />

<!--
${note.spoken}

${note.cue}

${slide.sourceNote ? slide.sourceNote + '\n\n' : ''}${sources.join('\n')}
-->`
})
await writeFile(new URL('../slides.md', import.meta.url), head + '\n\n' + pages.join('\n\n---\n\n') + '\n')
