import fs from 'node:fs';
import path from 'node:path';
import { compileScene } from '../src/engine/compiler.js';
import { generateHtmlPreview } from '../src/utils/preview-generator.js';

const outDir = path.resolve(process.cwd(), 'samples');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log('🎨 Generando ilustraciones V2 (2D/3D, Color/B&W, Animadas) y Studios Interactivos...');

const craftSamples = [
  {
    name: 'bloom-flower-color',
    title: 'Bloom Flower (3D Color & Animated)',
    spec: {
      craft: 'bloom-flower',
      theme: 'light',
      mode: '3d',
      colorMode: 'color',
      palette: 'botanical',
      animate: 'bloom',
      showPlate: false
    }
  },
  {
    name: 'bloom-flower-2d',
    title: 'Bloom Flower (2D Flat Vector)',
    spec: {
      craft: 'bloom-flower',
      theme: 'light',
      mode: '2d',
      colorMode: 'color',
      palette: 'botanical',
      animate: 'float',
      showPlate: false
    }
  },
  {
    name: 'computer-light',
    title: 'Vintage 1984 Computer (Studio)',
    spec: {
      craft: 'desk-computer',
      theme: 'light',
      mode: '3d',
      colorMode: 'color',
      palette: 'warm-craft',
      animate: 'float',
      params: { screenText: 'init studio --v2' }
    }
  },
  {
    name: 'computer-dark',
    title: 'Vintage 1984 Computer (Dark Obsidian)',
    spec: {
      craft: 'desk-computer',
      theme: 'dark',
      mode: '3d',
      colorMode: 'mono',
      animate: 'static',
      params: { screenText: 'agent --ready' }
    }
  },
  {
    name: 'server-blade-color',
    title: '1U Server Blade (Cyber Color)',
    spec: {
      craft: 'server-blade',
      theme: 'dark',
      mode: '3d',
      colorMode: 'color',
      palette: 'cyber-neon',
      animate: 'spin-float'
    }
  },
  {
    name: 'sorting-desk-light',
    title: 'Postal Sorting Workstation',
    spec: {
      craft: 'sorting-desk',
      theme: 'light',
      mode: '3d',
      colorMode: 'color',
      palette: 'warm-craft',
      animate: 'static'
    }
  },
  {
    name: 'dial-indicator-light',
    title: 'Metrology Dial Indicator Rig',
    spec: {
      craft: 'dial-indicator',
      theme: 'light',
      mode: '3d',
      colorMode: 'color',
      palette: 'blueprint',
      animate: 'float'
    }
  },
  {
    name: 'engine-piston-3d',
    title: 'V8 Engine Piston & Crankshaft (3D Mechanical)',
    spec: {
      craft: 'engine-piston',
      theme: 'light',
      mode: '3d',
      colorMode: 'color',
      palette: 'vibrant',
      animate: 'float',
      showPlate: true
    }
  },
  {
    name: 'astral-bot-card',
    title: 'Astral Bot — Neo-Brutalist Pop Sticker & 3D Card',
    spec: {
      craft: 'astral-bot-card',
      theme: 'light',
      mode: '2d',
      colorMode: 'color',
      palette: 'vibrant',
      animate: 'float',
      showPlate: false
    }
  },
  {
    name: 'rocket-launch-card',
    title: 'Mission Orbit — Rocket Pop Sticker & 3D Card',
    spec: {
      craft: 'rocket-launch-card',
      theme: 'light',
      mode: '2d',
      colorMode: 'color',
      palette: 'vibrant',
      animate: 'float',
      showPlate: false
    }
  },
  {
    name: 'retro-console-card',
    title: 'Retro Play Console — 8-Bit Pop Sticker & 3D Card',
    spec: {
      craft: 'retro-console-card',
      theme: 'light',
      mode: '2d',
      colorMode: 'color',
      palette: 'vibrant',
      animate: 'float',
      showPlate: false
    }
  }
];

for (const item of craftSamples) {
  const svg = compileScene(item.spec);
  const svgPath = path.join(outDir, `${item.name}.svg`);
  fs.writeFileSync(svgPath, svg, 'utf-8');

  const html = generateHtmlPreview({
    svgContent: svg,
    metadata: {
      title: item.title,
      template: item.spec.craft,
      preset: `${item.spec.mode.toUpperCase()} · ${item.spec.colorMode}`
    }
  });
  const htmlPath = path.join(outDir, `${item.name}.html`);
  fs.writeFileSync(htmlPath, html, 'utf-8');
  console.log(`  ✓ ${item.name}: ${svgPath} & ${htmlPath}`);
}

// Regenerar también todas las plantillas y proyecciones 3D (doc-architecture, cube-3d, hero-grid, etc.)
// para que no tengan errores XML y cuenten con el Interactive Studio V2
const templateSamples = [
  {
    name: 'doc-architecture',
    title: 'System Architecture Overview',
    spec: {
      template: 'doc-architecture-card',
      preset: 'dark-linear',
      title: 'System Architecture Overview'
    }
  },
  {
    name: 'hero-grid',
    title: 'Hero Isometric Grid',
    spec: {
      template: 'hero-isometric-grid',
      preset: 'dark-linear',
      title: 'Deterministic 3D Vector Engine'
    }
  },
  {
    name: 'tech-spotlight',
    title: 'Tech Stack Spotlight',
    spec: {
      template: 'tech-stack-spotlight',
      preset: 'neon-cyber',
      title: 'Edge Compute Cluster'
    }
  },
  {
    name: 'aurora-light',
    title: 'Abstract Aurora Background',
    spec: {
      template: 'abstract-aurora-bg',
      preset: 'light-stripe',
      title: 'Fluid Vector Mesh'
    }
  },
  {
    name: 'cube-3d',
    title: '3D Projected Solid Mesh',
    spec: {
      mode: '3d-projection',
      preset: 'dark-linear',
      title: '3D Isometric Box Projection',
      projection3d: { primitive: 'box', rotation: { x: -25, y: 35, z: 0 } }
    }
  }
];

for (const item of templateSamples) {
  const svg = compileScene(item.spec);
  const svgPath = path.join(outDir, `${item.name}.svg`);
  fs.writeFileSync(svgPath, svg, 'utf-8');

  const html = generateHtmlPreview({
    svgContent: svg,
    metadata: {
      title: item.title,
      template: item.spec.template || item.spec.mode,
      preset: item.spec.preset
    }
  });
  const htmlPath = path.join(outDir, `${item.name}.html`);
  fs.writeFileSync(htmlPath, html, 'utf-8');
  console.log(`  ✓ ${item.name}: ${svgPath} & ${htmlPath}`);
}

// Actualizar también los archivos de example-for-this-chat para que tengan el nuevo Interactive Studio
const exampleDir = path.resolve(process.cwd(), 'example-for-this-chat');
if (fs.existsSync(exampleDir)) {
  for (const file of ['axis-topography-light.svg', 'axis-topography-dark.svg']) {
    const svgFile = path.join(exampleDir, file);
    if (fs.existsSync(svgFile)) {
      const rawSvg = fs.readFileSync(svgFile, 'utf-8');
      const studioHtml = generateHtmlPreview({
        svgContent: rawSvg,
        metadata: {
          title: `Studio: ${file.replace('.svg', '')}`,
          template: 'craft-object',
          preset: file.includes('dark') ? 'dark' : 'light'
        }
      });
      const outHtml = svgFile.replace(/\.svg$/, '.html');
      fs.writeFileSync(outHtml, studioHtml, 'utf-8');
      console.log(`  ✓ Upgraded example Studio: ${outHtml}`);
    }
  }
}

console.log('\n✨ Todas las muestras y Studios Interactivos generados correctamente.');
