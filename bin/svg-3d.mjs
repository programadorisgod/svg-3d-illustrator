#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { compileScene, CRAFT_MODELS, TEMPLATES } from '../src/engine/compiler.js';
import { PRESETS } from '../src/tokens/presets.js';
import { generateHtmlPreview } from '../src/utils/preview-generator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function printHelp() {
  console.log(`
🎨 svg-3d-illustrator CLI
Deterministic Technical Vector Illustration & 3D SVG Engine for AI Agents (Anatomy & Linear Style)

Commands:
  craft                 Generate an isolated, physical technical illustration (Anatomy style)
  render                Compile a declarative scene specification to SVG
  project-3d            Generate a 3D isometric/perspective projection of a solid mesh
  list-models           List available craft physical object models
  list-templates        List available scene templates
  list-presets          List design tokens presets and color palettes
  preview               Generate an interactive HTML preview for an SVG file

Options for 'craft':
  --model <name>        Model: 'desk-computer', 'sorting-desk', 'dial-indicator', 'server-blade'
  --theme <theme>       'light' (technical paper) or 'dark' (deep obsidian)
  --out <file.svg>      Output file path
  --preview             Also generate an interactive HTML preview file
  --screen-text <text>  Text to display on CRT/screen if supported by model

Options for 'render':
  --scene <path>        Path to JSON scene specification file
  --template <name>     Template name to compile
  --preset <name>       Color preset
  --out <file.svg>      Output file path
  --preview             Also generate HTML preview

Options for 'project-3d':
  --primitive <type>    'box' or 'cylinder' (default: 'box')
  --rx <degrees>        Rotation on X axis (degrees, e.g. -25)
  --ry <degrees>        Rotation on Y axis (degrees, e.g. 35)
  --rz <degrees>        Rotation on Z axis (degrees, e.g. 0)
  --preset <name>       Color preset
  --out <file.svg>      Output file path

Examples:
  svg-3d craft --model desk-computer --theme light --out ./assets/computer.svg --preview
  svg-3d craft --model server-blade --theme light --out ./assets/server-blade.svg --preview
  svg-3d craft --model sorting-desk --theme light --out ./assets/workstation.svg --preview
  svg-3d craft --model dial-indicator --theme dark --out ./assets/dial.svg
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
      console.log('\n🛠️ Available Physical Craft Models (Pure objects, zero noise):\n');
      console.log('• desk-computer: Vintage 1984 all-in-one desktop computer with mechanical keyboard, coiled cord and CRT.');
      console.log('• server-blade: 1U data center server blade with hot-swap drive bays, RAM DIMMs, heatsink fins & optical fiber.');
      console.log('• sorting-desk: Postal sorting workstation with turned legs, cubbies, envelope stacks and dial scale.');
      console.log('• dial-indicator: Precision metrology gauge rig on surface plate with rails and sliding carriage.\n');
      break;
    }

    case 'craft': {
      const model = args.model || 'desk-computer';
      const theme = args.theme || 'light';
      const outFile = path.resolve(process.cwd(), args.out || `${model}-${theme}.svg`);

      const params = {};
      if (args['screen-text']) params.screenText = args['screen-text'];

      const svg = compileScene({
        craft: model,
        theme,
        params
      });

      fs.writeFileSync(outFile, svg, 'utf-8');
      console.log(`✅ Technical vector illustration generated: ${outFile}`);

      if (args.preview) {
        const previewFile = outFile.replace(/\.svg$/, '.html');
        const html = generateHtmlPreview({
          svgContent: svg,
          metadata: {
            title: `Craft: ${model}`,
            template: 'craft-object',
            preset: theme
          }
        });
        fs.writeFileSync(previewFile, html, 'utf-8');
        console.log(`🔍 HTML preview generated: ${previewFile}`);
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

      if (args.preview) {
        const previewFile = outFile.replace(/\.svg$/, '.html');
        const html = generateHtmlPreview({
          svgContent: svg,
          metadata: { title: spec.title || 'Preview', template: spec.template, preset: spec.preset }
        });
        fs.writeFileSync(previewFile, html, 'utf-8');
        console.log(`🔍 HTML preview generated: ${previewFile}`);
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

    case 'preview': {
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
        metadata: { title: path.basename(inFile), template: 'file', preset: 'detected' }
      });
      fs.writeFileSync(outFile, html, 'utf-8');
      console.log(`🔍 HTML preview generated: ${outFile}`);
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
