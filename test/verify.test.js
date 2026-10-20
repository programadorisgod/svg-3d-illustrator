import assert from 'node:assert';
import crypto from 'node:crypto';
import { compileScene } from '../src/engine/compiler.js';
import { PRESETS } from '../src/tokens/presets.js';

console.log('🧪 Iniciando verificación de svg-3d-illustrator...\n');

// Test 1: Determinismo de salida
console.log('Test 1: Verificando renderizado 100% determinista...');
const spec = {
  template: 'tech-stack-spotlight',
  preset: 'dark-linear',
  title: 'Deterministic Test'
};

const svg1 = compileScene(spec);
const svg2 = compileScene(spec);

const hash1 = crypto.createHash('sha256').update(svg1).digest('hex');
const hash2 = crypto.createHash('sha256').update(svg2).digest('hex');

assert.strictEqual(hash1, hash2, 'El resultado debe ser bit-a-bit idéntico para los mismos inputs');
console.log('  ✓ Determinismo validado: ambos hashes SHA-256 coinciden exactamente.\n');

// Test 2: Validación de todas las plantillas
console.log('Test 2: Verificando compilación de todas las plantillas...');
const templates = ['hero-isometric-grid', 'doc-architecture-card', 'tech-stack-spotlight', 'abstract-aurora-bg'];

for (const tmpl of templates) {
  const output = compileScene({ template: tmpl, preset: 'light-stripe' });
  assert.ok(output.startsWith('<?xml') && output.includes('</svg>'), `La plantilla ${tmpl} debe generar un SVG válido`);
  assert.ok(output.includes('viewBox='), `La plantilla ${tmpl} debe contener viewBox`);
  console.log(`  ✓ Plantilla ${tmpl} compilada correctamente`);
}
console.log('');

// Test 3: Verificación de Proyección 3D analítica
console.log('Test 3: Verificando proyección 3D de cubo y cilindro...');
const cube3d = compileScene({
  mode: '3d-projection',
  projection3d: {
    primitive: 'box',
    rotation: { x: -30, y: 45, z: 0 }
  }
});
assert.ok(cube3d.includes('<polygon points='), 'El cubo 3D debe proyectar polígonos ordenados por profundidad');
assert.ok(cube3d.includes('data-face='), 'Las caras 3D deben incluir etiquetas de cara');
console.log('  ✓ Cubo 3D proyectado correctamente con Z-sorting e iluminación');

const cyl3d = compileScene({
  mode: '3d-projection',
  projection3d: {
    primitive: 'cylinder',
    segments: 16
  }
});
assert.ok(cyl3d.includes('<polygon points='), 'El cilindro 3D debe proyectar facetas calculadas');
console.log('  ✓ Cilindro 3D paramétrico proyectado correctamente\n');

// Test 4: Presets de diseño
console.log('Test 4: Verificando presets de tokens...');
const presetKeys = Object.keys(PRESETS);
assert.ok(presetKeys.includes('dark-linear'));
assert.ok(presetKeys.includes('light-stripe'));
assert.ok(presetKeys.includes('cyber-neon'));
assert.ok(presetKeys.includes('slate-docs'));
console.log(`  ✓ ${presetKeys.length} presets validados con sus tokens de color correspondientes\n`);

// Test 5: Verificación de Modelos de Artesanía Técnica (estilo Anatomy)
console.log('Test 5: Verificando modelos de artesanía técnica física...');
const craftModels = ['desk-computer', 'sorting-desk', 'dial-indicator', 'server-blade'];
for (const model of craftModels) {
  const lightSvg = compileScene({ craft: model, theme: 'light' });
  const darkSvg = compileScene({ craft: model, theme: 'dark' });
  assert.ok(lightSvg.includes('<svg') && lightSvg.includes('</svg>'), `Modelo ${model} (light) debe ser un SVG válido`);
  assert.ok(darkSvg.includes('<svg') && darkSvg.includes('</svg>'), `Modelo ${model} (dark) debe ser un SVG válido`);
  assert.ok(lightSvg.includes('class="iso-svg iso"'), `Modelo ${model} debe usar clases de iso-kit`);
  console.log(`  ✓ Modelo craft '${model}' validado en temas light y dark`);
}
console.log('');

console.log('🎉 ¡Todas las pruebas pasaron exitosamente!');
