import { createIsometricGrid } from '../../engine/isometric.js';
import { renderServerRackPrimitive } from '../primitives/server-rack.js';
import { renderDatabaseCylinderPrimitive } from '../primitives/database-cylinder.js';
import { renderCodeTerminalPrimitive } from '../primitives/code-terminal.js';

/**
 * Plantilla de Composición 3D Isométrica Tech: Servidor + BD + Terminal de Código
 */
export function renderTechStackSpotlightTemplate({
  theme,
  width = 900,
  height = 600,
  title = 'Autonomous Agent Stack',
  subtitle = 'Full-stack vector engine with zero external image generation dependencies.',
  serverLabel = 'Microservices',
  dbLabel = 'Turso / Vector DB',
  terminalTitle = 'antigravity-worker',
  terminalLines = ['> agy run build', '✓ Vectors compiled', '→ Serving at port 8080']
}) {
  const originX = width / 2;
  const originY = height * 0.58;

  // Cuadrícula isométrica central de base
  const gridSvg = createIsometricGrid({
    originX,
    originY,
    gridSize: 6,
    cellSize: 50,
    color: theme.colors.grid,
    axisColor: theme.colors.borderBright,
    showDots: true,
    dotColor: theme.colors.primaryLight
  });

  // 1. Servidor a la izquierda (x: -120, y: 40)
  const serverSvg = renderServerRackPrimitive({
    x: -120,
    y: 60,
    z: 0,
    width: 60,
    depth: 100,
    height: 80,
    originX,
    originY,
    theme,
    label: serverLabel,
    id: 'spotlight-server'
  });

  // 2. Base de datos a la derecha (x: 100, y: 120)
  const dbSvg = renderDatabaseCylinderPrimitive({
    x: 90,
    y: 110,
    z: 0,
    radius: 40,
    layerHeight: 18,
    layers: 3,
    originX,
    originY,
    theme,
    label: dbLabel,
    id: 'spotlight-db'
  });

  // 3. Terminal de código flotando en el centro superior (x: -50, y: -40, z: 90)
  const terminalSvg = renderCodeTerminalPrimitive({
    x: -40,
    y: -30,
    z: 90,
    width: 140,
    height: 80,
    originX,
    originY,
    theme,
    title: terminalTitle,
    lines: terminalLines,
    id: 'spotlight-terminal'
  });

  return `
    <!-- Fondo sólido y auroras -->
    <rect width="${width}" height="${height}" fill="${theme.colors.background}" rx="${theme.radius.lg}" />
    <rect width="${width}" height="${height}" fill="url(#aurora-glow-1)" />
    <rect width="${width}" height="${height}" fill="url(#aurora-glow-2)" />
    <rect width="${width}" height="${height}" fill="url(#grid-pattern)" opacity="0.3" />

    <!-- Título superior centrado -->
    <g class="spotlight-header" transform="translate(${width / 2}, 60)">
      <text x="0" y="0" text-anchor="middle" fill="${theme.colors.textPrimary}" font-family="${theme.typography.fontFamily}" font-size="32" font-weight="700">
        ${title}
      </text>
      <text x="0" y="30" text-anchor="middle" fill="${theme.colors.textSecondary}" font-family="${theme.typography.fontFamily}" font-size="14" font-weight="400">
        ${subtitle}
      </text>
    </g>

    <!-- Resplandor central -->
    <circle cx="${originX}" cy="${originY - 40}" r="140" fill="${theme.colors.primary}" opacity="0.12" filter="url(#glow-ambient)" />

    <!-- Escena Isométrica 3D -->
    <g class="isometric-spotlight-group">
      ${gridSvg}
      ${serverSvg}
      ${dbSvg}
      ${terminalSvg}
    </g>
  `;
}
