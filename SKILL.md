---
name: svg-3d-illustrator
description: Universal skill for AI agents (Claude Code, Antigravity, Cursor, Codex, OpenCode, Windsurf) to generate crafted, deterministic technical vector illustrations and 3D isometric SVG objects (Anatomy & Linear style) without generative AI image services. Builds physical, highly detailed objects with four-tone shading, 0.6px line weights, and transparent backgrounds for websites and documentation.
compatibility: Universal AI Agent Skill (Claude Code, Antigravity, OpenCode, Codex, Cursor, Windsurf, CLI runners). Requires Node.js 18+.
license: MIT
---

# SVG 3D Illustrator (Craft & Anatomy Engine)

A universal skill for autonomous AI agents across platforms (Claude Code, Antigravity, Cursor, OpenCode, Codex, and standalone CLI) to compose and generate **high-craft technical vector illustrations**, physical 3D isometric objects, and clean architectural figures directly as pure, deterministic SVG code — **without relying on diffusion models or external image generation APIs**.

Built upon the geometric architecture of `wheresryan22/anatomy` and the technical design standards of Linear and Stripe.

---

## ⚠️ Golden Rule: Pure Physical Object vs. Landing Page

> [!IMPORTANT]
> **The physical object IS the illustration.**
> - **NEVER** generate full opaque dark cards that look like a landing page with giant marketing titles, promotional specs tables ("450 HP", "Fox 3.0"), buttons, or fake telemetry widgets.
> - **ALWAYS** generate the **isolated, real physical machine or instrument** (e.g., retro computer with mechanical keyboard and coiled cord, server blade with hot-swap drive bays, postal sorting desk with scale, dial indicator rig), with a transparent background and a soft ground contact halo (`iso-halo`), so it can be cleanly dropped into **any website, dark or light background, or documentation**, and animated without visual noise.

---

## Agent Usage & Commands

The command-line interface is located at `bin/svg-3d.mjs` (or via `node bin/svg-3d.mjs`):

### 1. Physical Craft Object Illustration (`craft`) — Recommended Mode
Generates a detailed, tangible physical machine with 4-tone subtle shading, bevels, screws, and 0.6px hairline vector strokes:

```bash
# 1984 Vintage Desktop Computer (Macintosh 128k style) in light / paper theme
node bin/svg-3d.mjs craft --model desk-computer --theme light --out ./assets/computer.svg --preview

# 1984 Vintage Desktop Computer in dark obsidian theme
node bin/svg-3d.mjs craft --model desk-computer --theme dark --out ./assets/computer-dark.svg

# 1U Data Center Server Blade with hot-swap bays, RAM DIMMs & fiber optic cable
node bin/svg-3d.mjs craft --model server-blade --theme light --out ./assets/server-blade.svg --preview

# Postal Sorting Workstation with turned legs, cubbies, letters & scale
node bin/svg-3d.mjs craft --model sorting-desk --theme light --out ./assets/workstation.svg --preview

# Precision Dial Indicator Metrology Test Rig on surface plate
node bin/svg-3d.mjs craft --model dial-indicator --theme light --out ./assets/dial-indicator.svg
```

### 2. Customizing Screen Prompts & Parameters
For models featuring a display or CRT screen (such as `desk-computer`), pass custom prompt text:

```bash
node bin/svg-3d.mjs craft \
  --model desk-computer \
  --theme light \
  --screen-text "init agent --strict" \
  --out ./assets/agent-terminal.svg \
  --preview
```

### 3. Declarative Scene Specification (`scene.json`)
For programmatic compilation or embedding in agent workflows:

```json
{
  "craft": "server-blade",
  "theme": "light",
  "params": {}
}
```

Compile with:
```bash
node bin/svg-3d.mjs render --scene ./scene.json --out ./assets/result.svg --preview
```

---

## Four-Tone Shading System (Anatomy Architecture)

The engine uses analytical flat lighting with zero blurry gradient meshes and zero noisy polygonal facets:

| Token / CSS Class | Semantic Role | Light Theme (`light`) | Dark Theme (`dark`) |
| :--- | :--- | :--- | :--- |
| `iso-top` | Horizontal top face receiving direct ambient light | `#ffffff` | `#1c1c1c` |
| `iso-shade-0` | Lateral face in deepest shadow | `#dcdcd9` | `#0f0f0f` |
| `iso-shade-1` | Lateral face in medium shadow | `#e5e5e2` | `#121212` |
| `iso-shade-2` | Lateral face in half-light | `#ededea` | `#151515` |
| `iso-shade-3` | Lateral face in brightest light | `#f4f4f1` | `#181818` |
| `iso-line` (`hi`) | Primary silhouette outlines and prominent edges | `#26262a` (0.6px) | `#d4d4d4` |
| `iso-line` (`mid`) | Visible body edges and facet intersections | `#8a8a8f` | `#6a6a6a` |
| `iso-line` (`lo`) | Secondary details, grooves, and panel seams | `#b4b4b8` | `#3e3e3e` |
| `iso-line` (`faint`) | Internal bevels and subtle material creases | `#d4d4d6` | `#2a2a2a` |
| `iso-halo` | Soft Gaussian ground contact shadow under base | `opacity: 0.32` (`blur(9px)`) | `opacity: 0.9` |

---

## Physical Craft Model Catalog (`craft`)

### 1. `desk-computer`
- **Inspiration**: 1984 all-in-one desktop computer (Macintosh 128k).
- **Anatomy**:
  - Surface plate with feet, screws, and brass label plate.
  - Plinth base and main chassis with rear handle, ventilation slots, and side rocker power switch.
  - Recessed CRT display with phosphor glow, raster scanlines, and customizable monospace prompt text.
  - Floppy disk drive slot with activity LED and speaker grille.
  - Coiled helical keyboard cord routing to a 58-key mechanical keyboard with individual keycap dishes.

### 2. `server-blade`
- **Inspiration**: 1U enterprise data center server blade.
- **Anatomy**:
  - Metal chassis with side telescopic sliding rails and locking slots.
  - 4x hot-swap hard drive bays with release levers, ventilation holes, and dual-color activity LEDs.
  - Green motherboard PCB with mounting standoffs and grounding rings.
  - Heavy CPU copper heatsink block topped with 13 dense aluminum cooling fins and socket spring screws.
  - Dual memory banks with 8 total RAM DIMMs, DRAM chips, and retention latches.
  - Solid-state VRM capacitor bank.
  - Rear dual SFP+ optical cage with connected transceiver, pull tab, and angled fiber optic patch cord.

### 3. `sorting-desk`
- **Inspiration**: Vintage postal mail sorting workstation.
- **Anatomy**:
  - Sturdy wooden bench table with turned legs, base flanges, moldings, and cross stretchers.
  - Front tabletop sorting trough with envelope stack and millimetric ruler markings (`topTicks`).
  - Overhead 8-bay sorting cubbies cabinet with crown molding and metal label plates.
  - Mechanical postal scale with circular dial, pointer needle, knurled adjustment knob, and brass pan.

### 4. `dial-indicator`
- **Inspiration**: Metrology surface plate and gauge rig.
- **Anatomy**:
  - Heavy cast iron surface plate with mounting feet and engraved ruler strip.
  - Magnetic base with clamping post, articulated arm, and knurled lock thumb screws.
  - Circular dial gauge with high-precision radial graduations and needle.
  - Dual guide rails with end stops and sliding carriage carrying step gauge blocks.
  - Hardened steel contact plunger.

---

## Building a New Custom Physical Model

When designing a new physical object from scratch, follow the `iso-kit` conventions:

```javascript
import * as k from '../engine/iso-kit.mjs';

export function renderCustomInstrument({ width = 600, height = 400, theme = 'light' }) {
  // 1. Define bounding geometry in real-world units (x, y on floor, z up)
  const BASE = { x: -60, y: -40, w: 120, d: 80, r: 4 };
  const BASE_H = 8;

  // 2. Compute camera projection (azimuth 42°-56°, elevation 30°)
  const P = k.fitProjection(
    [...k.boxCorners(BASE, 0, BASE_H + 40)],
    width,
    height,
    { pad: 30, azimuth: 48, elevation: 30 }
  );

  const S = (paths, style) => k.solidSvg(paths, style);
  const L = (d, style) => k.lineSvg(d, style);
  const D = (points, style) => k.dotsSvg(points, style);
  const at = (point) => k.iso(point, P);

  // 3. Assemble components from back to front, bottom to top
  const out = [];

  // Ground halo contact shadow
  out.push(`<path class="iso-halo" d="${k.haloOf(BASE, -4, 4, P)}"/>`);

  // Base slab with 1.2px bevel
  out.push(S(k.slabOf(BASE, 0, BASE_H, P, 6, 1.2), { tone: "mid" }));

  // Perimeter groove and corner screws
  out.push(L(k.planOutline(k.insetPlan(BASE, 4), BASE_H, P, 6), { tone: "lo" }));
  const screws = k.corners(BASE, 7);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 1.8, BASE_H, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, BASE_H])), { size: 0.45 }));

  // Turned cylinder knob with knurling
  out.push(S(k.cylinder(0, 0, 14, BASE_H, 12, P, 32, 0.8), { tone: "hi" }));
  out.push(L(k.knurl(0, 0, 14, BASE_H + 2, BASE_H + 12, 36, P), { tone: "lo" }));

  // 4. Return standalone SVG with embedded ISO_CSS styles
  return `<svg xmlns="http://www.w3.org/2000/svg" class="iso-svg iso" data-theme="${theme}" viewBox="0 0 ${width} ${height}">
    <style>${k.ISO_CSS}</style>
    ${out.join('\n    ')}
  </svg>`;
}
```
