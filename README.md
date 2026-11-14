# CTeI 1 PechaKucha

Choose **Start presentation** for the 6-minute-40-second run. In **Study mode**, pick any slide to play its animations from the first cue. The deck stays on that slide until you choose another. Use **Replay animation** to start the slide again, **Show all** to jump to its final cue, or **Speaker notes** to read along with the current cue. You can also enter Study mode during a timed run.

## Run locally

Use Node.js 22.12 or later. Run these commands from this directory.

```sh
npm ci
npm run build
npm run preview
```

Open the [local deck](http://127.0.0.1:3030/). After the first build, `npm run preview` serves the bundled deck without internet access. The fonts, map, and Goal 2 icon are local. Use `npm run dev` for editing.

## Presentation and rehearsal keys

| Key | Action |
| --- | --- |
| Enter or Space | Start from the opening screen. |
| Left and Right | Move between slides in rehearsal. In manual mode and on the two tree slides, move one reveal at a time. |
| Up, Down, Page Up, Page Down | Move directly to the previous or next slide during rehearsal. |
| M | Toggle manual mode. During the timed run, this pauses or resumes the clock. |
| N | Show or hide the speaker notes. The highlighted sentence changes as the slide reveals its content. |
| A | Toggle animation. Start with `?motion=off` in the URL to disable it before the deck opens. |
| F | Toggle fullscreen. |
| 1, 2, 3 | Open a backup answer in rehearsal, manual mode, or after the timed run. |
| Esc | Close the backup answer or speaker notes. |
| R | Return to the opening screen. |

In rehearsal, moving backward leaves the previous slide fully visible and pauses automatic reveals. Moving forward resumes them. The two trees use manual reveals in rehearsal. All 20 slides use timed reveals during the live run.

The nine segments in the progress bar follow the assignment sections. In rehearsal or manual mode, the numbered buttons jump to the start of a section.

## Content and exports

- Edit on-screen copy, reveal times, and backup answers in `data/slides.js`.
- The map sweep, timeline, moving links, tree branches, and other scene animations use `styles/motion.css`.
- Edit spoken text in [Speaker_Script.md](../Speaker_Script.md). The build updates `slides.md` and the speaker notes snapshot.
- The [static deck PDF](../FONSECA_PechaKucha_Fallback.pdf) shows the finished state of every slide.
- The [phone study PDF](../FONSECA_PechaKucha_Study.pdf) has one page per slide with its script and delivery cue.

## Publishing updates

[Open the published presentation](https://maicol2363.github.io/ctei-pechakucha/).

This directory is the source for the public deck repository. Push changes to `main` to rebuild and publish to the same URL. When the course speaker script changes, run `node scripts/sync-notes.mjs` from this directory and include the generated `slides.md` and `data/speaker-notes.json` in the push. The Pages workflow builds from this snapshot.
