import { createIsometricGrid, toIsometric } from '../../engine/isometric.js';
import { renderIsometricBoxPrimitive } from '../primitives/isometric-box.js';

/**
 * Plantilla de Fondo Hero con Cuadrícula Isométrica y Elementos Flotantes
 */
export function renderHeroIsometricGridTemplate({
  theme,
  width = 1200,
  height = 630,
  title = 'High Performance Cloud Architecture',
  subtitle = 'Resilient, automated vector infrastructure built for modern AI agents.',
  badge = 'v2.0 • Zero Downtime',
  showGrid = true,
  cubes = [
    { x: 100, y: 150, z: 20, width: 60, depth: 60, height: 50, label: 'Auth' },
    { x: 240, y: 100, z: 60, width: 70, depth: 70, height: 70, label: 'Compute' },
    { x: 180, y: 260, z: 10, width: 65, depth: 65, height: 45, label: 'Cache' }
  ]
}) {
  const originX = width * 0.72;
  const originY = height * 0.48;

  // Cuadrícula isométrica
  const gridSvg = showGrid ? createIsometricGrid({
    originX,
    originY,
    gridSize: 7,
    cellSize: 45,
    color: theme.colors.grid,
    axisColor: theme.colors.borderBright,
    showDots: true,
    dotColor: theme.colors.textMuted
  }) : '';

  // Renderizar cubos flotantes
  const cubesSvg = cubes.map((c, i) => renderIsometricBoxPrimitive({
    x: c.x,
    y: c.y,
    z: c.z,
    width: c.width,
    depth: c.depth,
    height: c.height,
    originX,
    originY,
    scale: 1,
    theme,
    label: c.label,
    id: `hero-cube-${i}`
  })).join('\n');

  return `
    <!-- Fondo sólido del canvas -->
    <rect width="${width}" height="${height}" fill="${theme.colors.background}" />

    <!-- Auroras y resplandor de fondo -->
    <rect width="${width}" height="${height}" fill="url(#aurora-glow-1)" />
    <rect width="${width}" height="${height}" fill="url(#aurora-glow-2)" />

    <!-- Patrón sutil de puntos global -->
    <rect width="${width}" height="${height}" fill="url(#dot-pattern)" opacity="0.6" />

    <!-- Área isométrica a la derecha -->
    <g class="hero-isometric-scene">
      ${gridSvg}
      ${cubesSvg}
    </g>

    <!-- Contenido de texto a la izquierda -->
    <g class="hero-content" transform="translate(80, 200)">
      ${badge ? `
        <!-- Badge -->
        <rect x="0" y="0" width="180" height="28" rx="14" fill="${theme.colors.surfaceElevated}" stroke="${theme.colors.borderBright}" stroke-width="1" />
        <circle cx="16" cy="14" r="3.5" fill="${theme.colors.accent}" />
        <text x="28" y="18" fill="${theme.colors.textPrimary}" font-family="${theme.typography.fontFamily}" font-size="${theme.typography.sizes.body}" font-weight="600">${badge}</text>
      ` : ''}

      <!-- Título Principal -->
      <text x="0" y="80" fill="${theme.colors.textPrimary}" font-family="${theme.typography.fontFamily}" font-size="44" font-weight="800" letter-spacing="-0.5">
        ${title}
      </text>

      <!-- Subtítulo -->
      <text x="0" y="125" fill="${theme.colors.textSecondary}" font-family="${theme.typography.fontFamily}" font-size="18" font-weight="400" width="480">
        ${subtitle}
      </text>
    </g>
  `;
}
