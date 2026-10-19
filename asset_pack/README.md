# Tiny 20/10 — SVG + Animation Asset Pack

This is a **starter asset pack**, not a replacement for the existing Tiny V10–V15 `index.html`.

## Contents

- `assets/gifts/red-rose.svg` — personalized red rose for Tquin.
- `assets/gifts/blue-rose.svg` — personalized blue rose for Nhi.
- `assets/gifts/lollipop.svg` — pastel swirl lollipop for Hương.
- `assets/ui/question-mark.svg` — glowing question mark.
- `assets/ui/shy-fingers.svg` — shy fingertip gesture.
- `css/tiny-animations.css` — reusable CSS motion primitives.
- `js/personalized-particles.js` — Canvas particle renderer for petals/candy/hearts.

## Important integration rule

Read `IDEA_MASTER_SPEC.md` and inspect the original Tiny V10–V15 HTML before integrating. Do not replace existing scenes, audio, lyric timing, `window.TINY_PERF`, `#tiny-mobile-branch`, or the ending sequence.

### SVG examples

```html
<img src="./assets/gifts/red-rose.svg" alt="Hoa hồng đỏ dành cho Tquin">
<img src="./assets/gifts/blue-rose.svg" alt="Hoa hồng xanh dành cho Nhi">
<img src="./assets/gifts/lollipop.svg" alt="Kẹo mút pastel dành cho Hương">
<img id="tiny-question-mark" src="./assets/ui/question-mark.svg" alt="">
<img id="tiny-shy-fingers" src="./assets/ui/shy-fingers.svg" alt="">
<link rel="stylesheet" href="./css/tiny-animations.css">
```

### Canvas example

```html
<canvas id="personalized-particles" aria-hidden="true"></canvas>
<script type="module">
  import { mountTinyParticles } from "./js/personalized-particles.js";

  const canvas = document.querySelector("#personalized-particles");
  const stopParticles = mountTinyParticles(canvas, {
    recipient: window.TINY_RECIPIENT || "tquin",
    fps: window.TINY_PERF?.leafFps ?? 30,
    dpr: window.TINY_PERF?.canvasDpr ?? 1.5
  });

  // Call stopParticles() when this scene is permanently hidden or cleaned up.
</script>
```

**Do not blindly add a second animation loop** if the original project already manages Canvas rendering through `window.TINY_PERF`. Merge the particle drawing functions into that existing scheduler when appropriate.

## Recipient branching

The original specification requires:
- `tquin`: red rose, red petals.
- `nhi`: blue rose, blue petals.
- `huong`: spinning candy, candy and pastel hearts.

Keep one recipient state as the source of truth. Apply the chosen theme before entering gift and celebration scenes.

## Performance and accessibility

- Respect `prefers-reduced-motion`.
- Pause effects for hidden scenes.
- Keep mobile particle counts lower.
- Test the project on the actual original HTML, including portrait and landscape mobile viewports.
- These files have not been integrated into the original project and are not a claim that the full website has been tested.
