# SVG 3D Illustrator

> Universal AI Agent Skill for Deterministic Technical Vector Illustrations & 3D Isometric SVG.
> Compatible with **Claude Code**, **Antigravity**, **Cursor**, **Codex**, **OpenCode**, and standalone CLI runners.
> Inspired by the precision craft of **[wheresryan22/anatomy](https://github.com/wheresryan22/anatomy)** and the technical aesthetics of Linear and Stripe.

---

## Overview

**`svg-3d-illustrator`** is a universal skill that equips autonomous AI coding agents to generate **high-craft physical technical illustrations**, precision isometric objects, and clean architectural diagrams directly as pure, deterministic SVG code — **without using diffusion models, external image APIs, or GPU services**.

### The Core Philosophy: "The Physical Object IS the Explanation"
- **Zero Marketing Noise**: Never wraps objects in opaque dark cards with promotional headlines ("450 HP"), telemetry boxes, or fake UI badges.
- **Pure Vector Isolation**: Generates clean, transparent-background SVGs with subtle ambient ground contact halos (`iso-halo`), ready to embed in any web UI, documentation, or blog post.
- **Analytical 4-Tone Lighting**: Top faces (`iso-top`) receive bright ambient light; side facets are calculated analytically into four discrete shadow tones (`iso-shade-0` to `iso-shade-3`).
- **Hairline Precision**: 0.6px vector strokes (`iso-line`) with semantic contrast levels (`hi`, `mid`, `lo`, `faint`), screw indentations, knurled knobs, ruler ticks, and bevels.

---

## Available Craft Models

| Model | Subject | Features |
| :--- | :--- | :--- |
| **`desk-computer`** | 1984 Vintage All-in-One Computer (Macintosh 128k) | Recessed CRT with scanlines, 58-key mechanical keyboard with individual dishes, coiled helical cable, floppy slot, side rocker switch. |
| **`server-blade`** | 1U Enterprise Data Center Server Blade | 4x hot-swap drive bays with release latches & LEDs, RAM DIMMs, dense CPU heatsink cooling fins, PCB mounting standoffs, and angled optical fiber cord. |
| **`sorting-desk`** | Vintage Postal Sorting Workstation | Turned legs with moldings, cross stretchers, tabletop sorting trough with envelopes, 8-cubby sorting rack, and mechanical dial scale. |
| **`dial-indicator`** | Precision Metrology Test Rig | Cast surface plate with feet and ruler, magnetic base, articulated arm, circular dial gauge with needle, guide rails, and sliding carriage. |

---

## Installation Across AI Agent Ecosystems

Install once, use across any agent runner:

### 1. Claude Code
```bash
mkdir -p ~/.claude/skills
git clone https://github.com/programadorisgod/svg-3d-illustrator.git ~/.claude/skills/svg-3d-illustrator
```

### 2. Antigravity / Gemini CLI
```bash
mkdir -p ~/.gemini/config/skills
git clone https://github.com/programadorisgod/svg-3d-illustrator.git ~/.gemini/config/skills/svg-3d-illustrator
```

### 3. OpenCode
```bash
mkdir -p ~/.config/opencode/skills
git clone https://github.com/programadorisgod/svg-3d-illustrator.git ~/.config/opencode/skills/svg-3d-illustrator
```

### 4. Per-Project Repository (Cursor, Windsurf, Codex, CI/CD)
```bash
git submodule add https://github.com/programadorisgod/svg-3d-illustrator.git .skills/svg-3d-illustrator
```

---

## CLI Usage

The CLI binary is executable at `bin/svg-3d.mjs`:

```bash
# 1. Generate 1984 vintage computer in light / technical paper theme
./bin/svg-3d.mjs craft --model desk-computer --theme light --out ./assets/computer.svg --preview

# 2. Generate 1U server blade with preview and download button
./bin/svg-3d.mjs craft --model server-blade --theme light --out ./assets/server-blade.svg --preview

# 3. Generate postal sorting workstation
./bin/svg-3d.mjs craft --model sorting-desk --theme light --out ./assets/workstation.svg --preview

# 4. Generate dial indicator in dark obsidian theme
./bin/svg-3d.mjs craft --model dial-indicator --theme dark --out ./assets/dial.svg

# 5. Customize CRT screen prompt on computer
./bin/svg-3d.mjs craft --model desk-computer --theme light --screen-text "init worker --live" --out ./assets/custom-pc.svg
```

### Interactive HTML Preview & Vector Export
Adding the `--preview` flag generates a companion `.html` viewer with:
- **"Download SVG"** button: Downloads the raw, self-contained `.svg` file directly.
- **"Toggle Background"** button: Checks contrast on both dark and white backgrounds.
- **"Copy SVG"** button: Copies markup to clipboard for Figma or web templates.

---

## Verification & Testing

Run the automated test suite to verify determinism and XML syntax across all models and templates:

```bash
npm test
```

Test output verifies:
1. **Bit-for-bit determinism**: Same inputs yield identical SHA-256 hashes.
2. **Template validation**: Hero grids, doc architecture cards, and spotlights compile cleanly.
3. **3D projection**: Z-sorting and normal vectors render without occlusions.
4. **Craft models**: `desk-computer`, `server-blade`, `sorting-desk`, and `dial-indicator` validated in both `light` and `dark` themes.

---

## License

MIT License. Designed for Antigravity AI agents and developers.
