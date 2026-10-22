---
name: svg-3d-illustrator
description: Universal AI Agent Skill (Claude Code, Antigravity, Cursor, Codex, OpenCode, Windsurf) to generate deterministic 2D Flat & 3D Volumetric SVG illustrations, organic/botanical shapes (like flowers), and technical objects in Full Color or Monochrome B&W, with embedded 3dsvg-style animations and an Interactive Vector & 3D Studio Editor (Zoom/Pan, 3D Orbit, 2D/3D toggle, Color/Mono toggle, Background-Ready export).
compatibility: Universal AI Agent Skill (Claude Code, Antigravity, OpenCode, Codex, Cursor, Windsurf, CLI runners). Requires Node.js 18+.
license: MIT
---

# SVG 3D & 2D Illustrator (V2 — Dual Dimension, Color & Interactive Studio)

A universal skill for autonomous AI agents to design and generate **crafted, deterministic 2D Flat and 3D Volumetric SVG illustrations** — ranging from organic forms (flowers, leaves, crystals, fluid waves) to precision physical machines (vintage computers, server blades, metrology rigs) — **with full 4-tone color palettes or classic black-and-white, embedded animations, and an interactive Studio Editor**.

---

## 🎯 Identity & Golden Rules for Agents

> [!IMPORTANT]
> **1. True Visual Identity — Never Build a "Generic Box Board" for Repositories**
> - When a user asks you to analyze a repository or create a specific illustration (e.g., *"illustrate my project"*, *"make a flower"*, *"create a background illustration"*), **DO NOT** just slap rectangular gray boxes with tiny unreadable text labels onto a flat rectangular slab.
> - Instead, follow the **3-Step Creative Recon Workflow**:
>   1. **Metaphor & Form (`organic-kit` + `iso-kit`)**: Choose an iconic, memorable visual metaphor (e.g., a blooming lotus/flower, an interlocking turbine/core, a floating neural crystal, a multi-ring orbital hub, or a physical instrument).
>   2. **Dimension & Background-Readiness (`2d` vs `3d`, `showPlate`)**: If the user wants an illustration to use as a **website background, hero asset, or icon**, set `showPlate: false` (`--no-plate`) so there is no bulky rectangular tray blocking the background, and provide **both `3d` and `2d` views** via `wrapDualModeSvg`.
>   3. **Color & Motion (`color` vs `mono`, `animate`)**: Support both **Full Color** (`colorMode: 'color'`) and **Monochrome B&W** (`colorMode: 'mono'`) using semantic `color` tokens on every solid (`petal`, `leaf`, `gold`, `primary`, `secondary`, `accent`, `copper`, `chassis`), and attach a smooth animation (`float`, `bloom`, `spin-float`, `pulse`, `wobble`, `swing`).

> [!IMPORTANT]
> **2. Always Generate the Interactive Studio HTML (`--preview` / `--studio`)**
> - Every time you generate an SVG illustration, **always** generate its companion `.html` Interactive Studio (`generateHtmlPreview` or `--preview`), so the user can:
>   - **Zoom (0.25x–8x)** with the mouse wheel and **Pan** freely across the infinite canvas.
>   - **Orbit / Tilt in 3D** interactively.
>   - Toggle live between **3D Volumetric** and **2D Flat Vector**.
>   - Switch live between **Monochrome B&W** and **Full Color Palettes** (or pick custom colors).
>   - Toggle **Base Plate On/Off** (`Background-Ready`) and test **8 Animation Presets** before clicking **Download SVG** or **Copy React `<Illustration3D />`**.

---

## Agent CLI Usage (`bin/svg-3d.mjs`)

### 1. Generate 2D / 3D Models (Color or B&W, Animated, with Studio)

```bash
# Botanical Bloom Flower in 3D, Full Color, with 'bloom' animation & Interactive Studio
node bin/svg-3d.mjs craft \
  --model bloom-flower \
  --mode 3d \
  --color-mode color \
  --palette botanical \
  --animate bloom \
  --out ./assets/bloom-flower.svg \
  --preview

# Botanical Bloom Flower in 2D Flat mode, without base plate (Background-Ready)
node bin/svg-3d.mjs craft \
  --model bloom-flower \
  --mode 2d \
  --color-mode color \
  --no-plate \
  --animate float \
  --out ./assets/bloom-flower-2d.svg \
  --preview

# 1984 Vintage Desktop Computer in Warm Craft Color + Float Animation
node bin/svg-3d.mjs craft \
  --model desk-computer \
  --color-mode color \
  --palette warm-craft \
  --animate float \
  --screen-text "init studio --v2" \
  --out ./assets/computer-color.svg \
  --preview

# 1U Data Center Server Blade in Cyber Neon Color (or '--color-mode mono' for B&W)
node bin/svg-3d.mjs craft \
  --model server-blade \
  --color-mode color \
  --palette cyber-neon \
  --animate spin-float \
  --out ./assets/server-blade.svg \
  --preview

# V8 Engine Piston & Crankshaft in 3D Mechanical Color
node bin/svg-3d.mjs craft \
  --model engine-piston \
  --mode 3d \
  --color-mode color \
  --palette vibrant \
  --animate float \
  --out ./assets/engine-piston.svg \
  --preview

# Astral Bot — Neo-Brutalist Pop Sticker & 3D Card (2D Sticker or 3D Extruded)
node bin/svg-3d.mjs craft \
  --model astral-bot-card \
  --mode 2d \
  --color-mode color \
  --animate float \
  --out ./assets/astral-bot-card.svg \
  --preview

# Mission Orbit — Cyber Rocket Pop Sticker & 3D Card (con o sin movimiento)
node bin/svg-3d.mjs craft \
  --model rocket-launch-card \
  --mode 2d \
  --color-mode color \
  --animate float \
  --out ./assets/rocket-launch-card.svg \
  --preview

# Retro Console — 8-Bit Pixel Gameboy Pop Sticker & 3D Card
node bin/svg-3d.mjs craft \
  --model retro-console-card \
  --mode 2d \
  --color-mode color \
  --animate static \
  --out ./assets/retro-console-card.svg \
  --preview

# Upgrade ANY existing SVG file into an Interactive Studio Editor
node bin/svg-3d.mjs studio \
  --in ./path/to/existing.svg \
  --out ./path/to/existing-studio.html
```

---

## Built-in Modes, Palettes & Animations

### Dimension Modes (`--mode`)
- `3d`: Analytical isometric / volumetric 3D projection with 4-tone directional shading, bevels, and depth parallax.
- `2d`: Clean flat orthographic/top-down vector illustration ideal for icons, flat diagrams, and subtle web backgrounds.
- **Dual-Mode SVG**: Models built with `wrapDualModeSvg` embed both `.iso-view-3d` and `.iso-view-2d` so the user can switch between **2D** and **3D** with a single click inside the Studio HTML!

### Color Modes (`--color-mode`) & Material Palettes (`--palette`)
- `color`: Full analytical 4-tone color shading (`--c-top`, `--c-s0..3`, `--c-edge`) computed automatically for every part.
- `mono`: Classic high-craft black-and-white technical illustration (`light` paper or `dark` obsidian).
- **Built-in Palettes**:
  - `botanical`: Rose/coral petals (`#fb7185`, `#e11d48`), emerald foliage (`#10b981`), golden stamens (`#fbbf24`).
  - `vibrant`: Indigo (`#6366f1`), sky cyan (`#0ea5e9`), rose accent (`#f43f5e`).
  - `cyber-neon`: Electric cyan (`#06b6d4`), violet (`#8b5cf6`), neon emerald (`#10b981`).
  - `warm-craft`: Terracotta/amber (`#d97706`), brass (`#eab308`), warm cream & crimson (`#dc2626`).
  - `blueprint`: Engineering cobalt (`#3b82f6`), ice blue (`#60a5fa`), gold markers (`#facc15`).
  - `gold-onyx`: Pure gold (`#eab308`, `#fef08a`) over dark zinc/onyx (`#27272a`).

### Animation Presets (`--animate`)
All animations are embedded as pure CSS `@keyframes` inside the `<svg>` so they work standalone anywhere:
- `static` | `float` | `spin` | `pulse` | `wobble` | `swing` | `spin-float` | `bloom`

---

## Building Custom Organic or Technical Illustrations (2D + 3D + Color)

When creating a bespoke illustration for a user (e.g., a custom flower, crystal, project identity, or machine), combine `iso-kit.mjs` and `organic-kit.mjs` with `wrapDualModeSvg`:

```javascript
import * as k from './src/engine/iso-kit.mjs';
import * as org from './src/engine/organic-kit.mjs';
import { generateHtmlPreview } from './src/utils/preview-generator.js';
import fs from 'node:fs';

export function renderCustomIllustration({
  width = 640,
  height = 500,
  theme = 'light',
  mode = '3d',
  colorMode = 'color',
  palette = 'botanical',
  animate = 'float',
  showPlate = false // false = Background-Ready (no rectangular tray)
} = {}) {
  function buildView(viewMode) {
    const BOUND = { x: -90, y: -90, w: 180, d: 180, r: 20 };
    const P = k.fitProjection(
      [...k.boxCorners(BOUND, -10, 120)],
      width,
      height,
      {
        pad: 32,
        azimuth: viewMode === '2d' ? 0 : 48,
        elevation: viewMode === '2d' ? 88 : 32,
        mode: viewMode,
        palette
      }
    );

    const out = [];

    // 1. Optional base plate wrapped in .iso-base-plate so user can toggle it in Studio
    out.push(`<g class="iso-base-plate" data-layer="base">
      <path class="iso-halo" d="${k.haloOf({ x: -55, y: -55, w: 110, d: 110, r: 55 }, -8, 6, P)}"/>
      ${k.solidSvg(k.cylinder(0, 0, 44, -6, 6, P, 48, 1), { color: 'panel', palette })}
    </g>`);

    // 2. Organic petal/leaf ring or custom 3D/2D solids with semantic colors
    out.push(org.renderPetalRing({
      cx: 0, cy: 0, z: 30,
      count: 8, length: 50, width: 22, tiltDeg: viewMode === '2d' ? 10 : 25, curl: 6,
      P, color: 'petal', palette, layer: 'main'
    }));

    // 3. Central core in 'detail' layer (gets automatic parallax in animations)
    out.push(k.solidSvg(k.cylinder(0, 0, 12, 36, 8, P, 32, 1.2), {
      color: 'gold',
      palette,
      layer: 'detail'
    }));

    return out.join('\n    ');
  }

  return k.wrapDualModeSvg({
    width, height, theme, mode, colorMode, palette, animate, showPlate,
    label: 'Custom 2D/3D Illustration',
    view3d: buildView('3d'),
    view2d: buildView('2d')
  });
}
```
