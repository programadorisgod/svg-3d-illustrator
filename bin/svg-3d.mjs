#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { compileScene, CRAFT_MODELS, TEMPLATES } from '../src/engine/compiler.js';
import { PRESETS } from '../src/tokens/presets.js';
import { COLOR_PALETTES } from '../src/engine/iso-kit.mjs';
import { ANIMATION_PRESETS } from '../src/engine/animations.mjs';
import { generateHtmlPreview } from '../src/utils/preview-generator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function printHelp() {
  console.log(`
🎨 svg-3d-illustrator CLI (V2 — 2D/3D Dual Engine, Color & Interactive Studio)
Deterministic Vector Illustration & 3D SVG Engine for AI Agents

Commands:
  craft                 Generate a 2D or 3D vector illustration (Physical or Organic)
  studio / preview      Generate the Interactive Vector & 3D Studio HTML Editor for any SVG
  render                Compile a declarative scene specification to SVG
  project-3d            Generate a 3D isometric/perspective projection of a solid mesh
  list-models           List available craft physical & organic models
  list-palettes         List available 4-tone color & material palettes
  list-animations       List available 2D/3D animation presets
  list-templates        List available scene templates
  list-presets          List design tokens presets

Options for 'craft':
  --model <name>        'bloom-flower', 'engine-piston', 'astral-bot-card', 'rocket-launch-card', 'retro-console-card', 'desk-computer', 'server-blade', 'sorting-desk', 'dial-indicator'
  --mode <2d|3d>        Dimension mode: '3d' (volumetric isometric) or '2d' (flat vector) [default: '3d']
  --color-mode <m>      'color' (full 4-tone color) or 'mono' (classic black & white)
  --palette <name>      'botanical', 'vibrant', 'cyber-neon', 'warm-craft', 'blueprint', 'gold-onyx'
  --animate <preset>    'static', 'float', 'spin', 'pulse', 'wobble', 'swing', 'spin-float', 'bloom'
  --no-plate            Hide base plate so the illustration is 100% Background-Ready
  --theme <theme>       'light' (paper) or 'dark' (obsidian)
  --out <file.svg>      Output SVG file path
  --preview / --studio  Also generate the Interactive Studio HTML Editor (.html)
  --screen-text <text>  Custom CRT terminal text (for desk-computer)

Examples:
  # Generate a full-color 3D Bloom Flower with 'bloom' animation and Interactive Studio
  svg-3d craft --model bloom-flower --mode 3d --color-mode color --palette botanical --animate bloom --out ./samples/flower.svg --preview

  # Generate a 2D Flat Bloom Flower without base plate (Background-Ready)
  svg-3d craft --model bloom-flower --mode 2d --color-mode color --no-plate --out ./samples/flower-2d.svg --preview

  # Generate Vintage Computer in Warm Craft color with floating animation
  svg-3d craft --model desk-computer --color-mode color --palette warm-craft --animate float --out ./samples/mac-color.svg --preview

  # Upgrade any existing SVG file into an Interactive Studio Editor
  svg-3d studio --in ./example-for-this-chat/axis-topography-light.svg --out ./example-for-this-chat/axis-studio.html
`);
}

function parseArgs(args) {
  const result = { _: [] };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = args[i + 1];
      if (next && !next.startsWith('--')) {
        result[key] = next;
        i++;
      } else {
        result[key] = true;
      }
    } else {
      result._.push(arg);
    }
  }
  return result;
}

async function main() {
  const rawArgs = process.argv.slice(2);
  const args = parseArgs(rawArgs);
  const command = args._[0];

  if (!command || args.help || args.h) {
    printHelp();
    process.exit(0);
  }

  switch (command) {
    case 'list-models': {
      console.log('\n🛠️ Available 2D/3D Craft, Mechanical, UI Sticker & Organic Models:\n');
      console.log('• bloom-flower       : Botanical lotus/rose flower with 3D curved petals, veins, stem, leaves & golden stamens (2D & 3D, Color & B&W).');
      console.log('• engine-piston      : Mechanical Car Engine Piston & Crankshaft assembly with compression rings, I-beam connecting rod & counterweights.');
      console.log('• astral-bot-card    : Neo-Brutalist Pop-Sticker UI Card ("Astral Bot") with thick ink strokes, dove avatar, voice note & reply.');
      console.log('• rocket-launch-card : Neo-Brutalist Pop-Sticker & 3D Rocket Launch Card with exhaust plume, smoke clouds, planet & liftoff badge.');
      console.log('• retro-console-card : Neo-Brutalist Pop-Sticker & 3D Handheld Console Card with D-pad, candy buttons, 8-bit heart & level-up badge.');
      console.log('• desk-computer      : Vintage 1984 all-in-one desktop computer with mechanical keyboard, coiled cord and CRT.');
      console.log('• server-blade       : 1U data center server blade with hot-swap drive bays, RAM DIMMs, heatsink fins & optical fiber.');
      console.log('• sorting-desk       : Postal sorting workstation with turned legs, hollow cubbies, envelope stacks and dial scale.');
      console.log('• dial-indicator     : Precision metrology gauge rig on surface plate with rails and sliding carriage.\n');
      break;
    }

    case 'list-palettes': {
      console.log('\n🎨 Available 4-Tone Color & Material Palettes:\n');
      for (const name of Object.keys(COLOR_PALETTES)) {
        console.log(`• ${name}`);
      }
      console.log('');
      break;
    }

    case 'list-animations': {
      console.log('\n✨ Available 2D/3D Animation Presets (embedded in SVG):\n');
      for (const [key, anim] of Object.entries(ANIMATION_PRESETS)) {
        console.log(`• ${key.padEnd(12)} : ${anim.description}`);
      }
      console.log('');
      break;
    }

    case 'craft': {
      const model = args.model || 'bloom-flower';
      const theme = args.theme || 'light';
      const mode = args.mode || (['astral-bot-card', 'rocket-launch-card', 'retro-console-card'].includes(model) ? '2d' : '3d');
      const colorMode = args['color-mode'] || (args.color ? 'color' : (['bloom-flower', 'engine-piston', 'astral-bot-card', 'rocket-launch-card', 'retro-console-card'].includes(model) ? 'color' : 'mono'));
      const palette = args.palette || (model === 'bloom-flower' ? 'botanical' : 'vibrant');
      const animate = args.animate || (model === 'bloom-flower' ? 'bloom' : 'static');
      const showPlate = args['no-plate'] ? false : (['astral-bot-card', 'rocket-launch-card', 'retro-console-card'].includes(model) ? false : true);
      const outFile = path.resolve(process.cwd(), args.out || `${model}-${mode}-${colorMode}.svg`);

      const params = {};
      if (args['screen-text']) params.screenText = args['screen-text'];
      if (args.petals) params.petalCount = Number(args.petals);

      const svg = compileScene({
        craft: model,
        theme,
        mode,
        colorMode,
        palette,
        animate,
        showPlate,
        params
      });

      fs.writeFileSync(outFile, svg, 'utf-8');
      console.log(`✅ Vector illustration generated (${mode.toUpperCase()}, ${colorMode}): ${outFile}`);

      if (args.preview || args.studio) {
        const previewFile = outFile.replace(/\.svg$/, '.html');
        const html = generateHtmlPreview({
          svgContent: svg,
          metadata: {
            title: `${model} (${mode.toUpperCase()})`,
            template: 'craft-object',
            preset: `${colorMode} / ${palette}`
          }
        });
        fs.writeFileSync(previewFile, html, 'utf-8');
        console.log(`🎛️ Interactive Studio HTML generated: ${previewFile}`);
      }
      break;
    }

    case 'list-templates': {
      console.log('\n📐 Available Scene Templates:\n');
      console.log('1. hero-isometric-grid: Hero background with isometric perspective grid');
      console.log('2. doc-architecture-card: Clean technical documentation 3-tier architecture diagram');
      console.log('3. tech-stack-spotlight: Isometric 3D tech spotlight composition');
      console.log('4. abstract-aurora-bg: Clean fluid Bézier aurora background\n');
      break;
    }

    case 'list-presets': {
      console.log('\n🎨 Design Presets and Palettes:\n');
      for (const [key, preset] of Object.entries(PRESETS)) {
        console.log(`• ${key} (${preset.name}): ${preset.description}`);
      }
      break;
    }

    case 'render': {
      let spec = {};
      if (args.scene) {
        const scenePath = path.resolve(process.cwd(), args.scene);
        if (!fs.existsSync(scenePath)) {
          console.error(`❌ Error: File not found: ${scenePath}`);
          process.exit(1);
        }
        spec = JSON.parse(fs.readFileSync(scenePath, 'utf-8'));
      } else if (args.template) {
        spec = {
          template: args.template,
          preset: args.preset || 'dark-linear',
          title: args.title || 'Illustration',
          params: { title: args.title, subtitle: args.subtitle, badge: args.badge }
        };
      }

      const outFile = path.resolve(process.cwd(), args.out || 'output.svg');
      const svg = compileScene(spec);
      fs.writeFileSync(outFile, svg, 'utf-8');
      console.log(`✅ SVG generated successfully: ${outFile}`);

      if (args.preview || args.studio) {
        const previewFile = outFile.replace(/\.svg$/, '.html');
        const html = generateHtmlPreview({
          svgContent: svg,
          metadata: { title: spec.title || 'Preview', template: spec.template, preset: spec.preset }
        });
        fs.writeFileSync(previewFile, html, 'utf-8');
        console.log(`🎛️ Interactive Studio HTML generated: ${previewFile}`);
      }
      break;
    }

    case 'project-3d': {
      const primitive = args.primitive || 'box';
      const rx = Number(args.rx || -25);
      const ry = Number(args.ry || 35);
      const rz = Number(args.rz || 0);
      const preset = args.preset || 'dark-linear';
      const outFile = path.resolve(process.cwd(), args.out || 'output-3d.svg');

      const spec = {
        mode: '3d-projection',
        preset,
        projection3d: { primitive, rotation: { x: rx, y: ry, z: rz } }
      };

      const svg = compileScene(spec);
      fs.writeFileSync(outFile, svg, 'utf-8');
      console.log(`✅ 3D projection SVG generated: ${outFile}`);
      break;
    }

    case 'preview':
    case 'studio': {
      const inFile = args.in || args._[1];
      if (!inFile) {
        console.error('❌ Error: Please specify input SVG with --in <file.svg>');
        process.exit(1);
      }
      const svgPath = path.resolve(process.cwd(), inFile);
      if (!fs.existsSync(svgPath)) {
        console.error(`❌ Error: File not found: ${svgPath}`);
        process.exit(1);
      }
      const svgContent = fs.readFileSync(svgPath, 'utf-8');
      const outFile = path.resolve(process.cwd(), args.out || inFile.replace(/\.svg$/, '.html'));
      const html = generateHtmlPreview({
        svgContent,
        metadata: { title: path.basename(inFile, '.svg'), template: 'studio', preset: 'interactive' }
      });
      fs.writeFileSync(outFile, html, 'utf-8');
      console.log(`🎛️ Interactive Studio HTML generated: ${outFile}`);
      break;
    }

    default:
      console.error(`Unknown command: ${command}`);
      printHelp();
      process.exit(1);
  }
}

main().catch(err => {
  console.error('❌ Execution error:', err);
  process.exit(1);
});
