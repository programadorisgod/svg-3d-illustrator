import fs from 'node:fs';
import path from 'node:path';
import { compileScene } from '../src/engine/compiler.js';
import { generateHtmlPreview } from '../src/utils/preview-generator.js';

const outDir = path.resolve(process.cwd(), 'samples');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log('🎨 Generando ilustraciones de ejemplo y vistas previas...');

const samples = [
  {
    name: 'hero-grid',
    spec: {
      template: 'hero-isometric-grid',
      preset: 'dark-linear',
      title: 'Autonomous Vector Infrastructure',
      params: {
        title: 'High Velocity Cloud Systems',
        subtitle: 'Scalable vector architecture generated deterministically by AI agents.',
        badge: 'Enterprise v2.4 • Live'
      }
    }
  },
  {
    name: 'doc-architecture',
    spec: {
      template: 'doc-architecture-card',
      preset: 'slate-docs',
      title: 'E2E Microservices Topology',
      params: {
        title: 'Distributed System Topology',
        subtitle: 'Production microservice cluster with TLS encryption and automatic failover.',
        badge: 'Status: 99.99% SLA'
      }
    }
  },
  {
    name: 'tech-spotlight',
    spec: {
      template: 'tech-stack-spotlight',
      preset: 'cyber-neon',
      title: 'Agent Core Platform',
      params: {
        title: 'Autonomous Agent Platform',
        subtitle: 'Real-time telemetry, persistent memory and deterministic vector generation.',
        serverLabel: 'Edge Core',
        dbLabel: 'Vector Memory',
        terminalTitle: 'antigravity-node',
        terminalLines: ['> init pipeline --strict', '✓ Engine compiled (100% vector)', '→ Ready for agent execution']
      }
    }
  },
  {
    name: 'cube-3d',
    spec: {
      mode: '3d-projection',
      preset: 'dark-linear',
      title: '3D Vector Isometric Solid',
      projection3d: {
        primitive: 'box',
        width: 130,
        depth: 130,
        height: 110,
        rotation: { x: -28, y: 38, z: 12 }
      }
    }
  }
];

for (const s of samples) {
  const svg = compileScene(s.spec);
  const svgPath = path.join(outDir, `${s.name}.svg`);
  fs.writeFileSync(svgPath, svg, 'utf-8');

  const html = generateHtmlPreview({
    svgContent: svg,
    metadata: {
      title: s.spec.title,
      template: s.spec.template || s.spec.mode,
      preset: s.spec.preset
    }
  });
  const htmlPath = path.join(outDir, `${s.name}.html`);
  fs.writeFileSync(htmlPath, html, 'utf-8');

  console.log(`  ✓ ${s.name}: ${svgPath} & ${htmlPath}`);
}

console.log('\n✨ Todas las muestras generadas en directorio samples/');
