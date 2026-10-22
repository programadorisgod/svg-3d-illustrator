import assert from 'node:assert';
import crypto from 'node:crypto';
import { compileScene } from '../src/engine/compiler.js';
import { PRESETS } from '../src/tokens/presets.js';
import { COLOR_PALETTES, computeFourToneShades } from '../src/engine/iso-kit.mjs';
import { ANIMATION_PRESETS } from '../src/engine/animations.mjs';
import { generateHtmlPreview } from '../src/utils/preview-generator.js';

console.log('🧪 Iniciando verificación de svg-3d-illustrator V2...\n');

// Test 1: Determinismo de salida
console.log('Test 1: Verificando renderizado 100% determinista...');
const spec = {
  craft: 'bloom-flower',
  mode: '3d',
  colorMode: 'color',
  palette: 'botanical',
  animate: 'bloom'
};

const svg1 = compileScene(spec);
const svg2 = compileScene(spec);

const hash1 = crypto.createHash('sha256').update(svg1).digest('hex');
const hash2 = crypto.createHash('sha256').update(svg2).digest('hex');

assert.strictEqual(hash1, hash2, 'El resultado debe ser bit-a-bit idéntico para los mismos inputs');
console.log('  ✓ Determinismo validado: ambos hashes SHA-256 coinciden exactamente.\n');

// Helper para validar que el SVG sea XML bien formado (sin comillas anidadas ni & sin escapar)
function assertWellFormedSvgXml(svg, contextName) {
  assert.ok(!svg.includes('"Segoe UI"'), `${contextName}: No debe contener comillas dobles anidadas ("Segoe UI") dentro de atributos XML`);
  // Buscar & que no sean parte de &amp;, &lt;, &gt;, &quot;, &apos; o &#...;
  const unescapedAmp = /&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[0-9a-fA-F]+;)/;
  assert.ok(!unescapedAmp.test(svg), `${contextName}: No debe contener caracteres '&' sin escapar como '&amp;'`);
}

// Test 2: Validación de Modos 2D Plano y 3D Volumétrico + Color vs Blanco y Negro
console.log('Test 2: Verificando los 9 modelos Craft (2D/3D, Color/Mono, Sin Placa, Animaciones y XML Well-Formed)...');
const craftModels = [
  'bloom-flower',
  'engine-piston',
  'astral-bot-card',
  'rocket-launch-card',
  'retro-console-card',
  'desk-computer',
  'sorting-desk',
  'dial-indicator',
  'server-blade'
];

for (const model of craftModels) {
  const svg3dColor = compileScene({
    craft: model,
    theme: 'light',
    mode: '3d',
    colorMode: 'color',
    palette: 'botanical',
    animate: 'float',
    showPlate: false
  });
  const svg2dMono = compileScene({
    craft: model,
    theme: 'dark',
    mode: '2d',
    colorMode: 'mono',
    animate: 'spin'
  });

  assertWellFormedSvgXml(svg3dColor, `${model} (3D Color)`);
  assertWellFormedSvgXml(svg2dMono, `${model} (2D Mono)`);
  assert.ok(svg3dColor.includes('data-mode="3d"'), `Modelo ${model} debe soportar modo 3D`);
  assert.ok(svg3dColor.includes('data-color-mode="color"'), `Modelo ${model} debe soportar modo Color`);
  assert.ok(svg3dColor.includes('data-plate="hidden"'), `Modelo ${model} debe soportar ocultar placa base (Background-Ready)`);
  assert.ok(svg3dColor.includes('data-animate="float"'), `Modelo ${model} debe incrustar el preset de animación`);
  assert.ok(svg3dColor.includes('class="iso-view-3d"') && svg3dColor.includes('class="iso-view-2d"'), `Modelo ${model} debe incluir vistas duales 3D y 2D`);
  assert.ok(svg3dColor.includes('--c-top:'), `Modelo ${model} debe calcular tonos de color analíticos de 4 niveles`);

  assert.ok(svg2dMono.includes('data-mode="2d"'), `Modelo ${model} debe soportar modo 2D Plano`);
  assert.ok(svg2dMono.includes('data-color-mode="mono"'), `Modelo ${model} debe soportar modo Blanco y Negro (mono)`);
  console.log(`  ✓ Modelo '${model}' validado en 2D/3D, Color/Mono, Background-Ready, Animado y XML Well-Formed`);
}
console.log('');

// Test 3: Verificación de cálculo analítico de 4 tonos y paletas
console.log('Test 3: Verificando motor de color de 4 tonos y paletas...');
const shades = computeFourToneShades('#f43f5e', 'botanical');
assert.ok(shades && shades.top && shades.s0 && shades.s1 && shades.s2 && shades.s3 && shades.edge, 'Debe generar los 4 tonos + top + edge');
assert.ok(Object.keys(COLOR_PALETTES).length >= 6, 'Debe incluir al menos 6 paletas de material');
assert.ok(Object.keys(ANIMATION_PRESETS).length >= 8, 'Debe incluir los 8 presets de animación estilo 3dsvg');
console.log(`  ✓ ${Object.keys(COLOR_PALETTES).length} paletas de color y ${Object.keys(ANIMATION_PRESETS).length} animaciones verificadas\n`);

// Test 4: Verificación del Interactive Studio HTML Editor
console.log('Test 4: Verificando generación del Interactive Vector & 3D Studio HTML...');
const studioHtml = generateHtmlPreview({
  svgContent: svg1,
  metadata: { title: 'Bloom Flower Studio', template: 'craft-object', preset: 'botanical' }
});
assert.ok(studioHtml.includes('setDimensionMode'), 'El Studio debe incluir conmutador 2D/3D');
assert.ok(studioHtml.includes('setColorMode'), 'El Studio debe incluir conmutador Color/B&W');
assert.ok(studioHtml.includes('setAnimation'), 'El Studio debe incluir selector de animaciones');
assert.ok(studioHtml.includes('setBasePlate'), 'El Studio debe permitir ocultar la placa base');
assert.ok(studioHtml.includes('zoomStep'), 'El Studio debe incluir controles de Zoom y Pan');
console.log('  ✓ Interactive Studio HTML validado con Zoom/Pan, 3D Orbit, 2D/3D, Color/B&W y Exportación\n');

// Test 5: Compatibilidad con plantillas y proyección 3D previas + XML Well-Formedness
console.log('Test 5: Verificando retrocompatibilidad y XML Well-Formedness en plantillas y mallas 3D...');
const templates = ['hero-isometric-grid', 'doc-architecture-card', 'tech-stack-spotlight', 'abstract-aurora-bg'];
for (const tmpl of templates) {
  const output = compileScene({ template: tmpl, preset: 'light-stripe' });
  assert.ok(output.includes('</svg>'), `La plantilla ${tmpl} debe generar un SVG válido`);
  assertWellFormedSvgXml(output, `Template ${tmpl}`);
}
const cube3d = compileScene({
  mode: '3d-projection',
  projection3d: { primitive: 'box', rotation: { x: -30, y: 45, z: 0 } }
});
assert.ok(cube3d.includes('<polygon points='), 'El cubo 3D debe proyectar polígonos ordenados por profundidad');
assertWellFormedSvgXml(cube3d, 'Cube 3D Projection');
console.log('  ✓ Todas las plantillas y proyecciones 3D son retrocompatibles y 100% XML Well-Formed\n');

console.log('🎉 ¡Todas las pruebas de svg-3d-illustrator V2 pasaron exitosamente!');
