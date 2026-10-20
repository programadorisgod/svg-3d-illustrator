import { toIsometric, pointsToPath } from '../../engine/isometric.js';

/**
 * Primitiva de Ventana de Terminal de Código en Perspectiva Isométrica Flotante
 */
export function renderCodeTerminalPrimitive({
  x = 0,
  y = 0,
  z = 30, // Flotando sobre el plano
  width = 120,
  height = 90,
  originX = 400,
  originY = 300,
  scale = 1,
  theme,
  title = 'bash - 80x24',
  lines = ['npm run deploy', '✓ Build complete in 1.2s', '→ Live at astral.dev'],
  id = ''
}) {
  const p = (px, py, pz) => toIsometric(px, py, pz, originX, originY, scale);

  // La ventana se dibuja verticalmente en el plano X-Z (o Y-Z)
  // Aquí la modelamos en el plano X-Z con un pequeño grosor en Y
  const t0 = p(x, y, z + height);
  const t1 = p(x + width, y, z + height);
  const b1 = p(x + width, y, z);
  const b0 = p(x, y, z);

  const cardPath = pointsToPath([t0, t1, b1, b0]);

  // Barra de título (parte superior de la tarjeta)
  const barHeight = 18;
  const tb0 = p(x, y, z + height);
  const tb1 = p(x + width, y, z + height);
  const bb1 = p(x + width, y, z + height - barHeight);
  const bb0 = p(x, y, z + height - barHeight);
  const barPath = pointsToPath([tb0, tb1, bb1, bb0]);

  // Botones de la ventana (dots de macOS)
  const dot1 = p(x + 12, y, z + height - 9);
  const dot2 = p(x + 22, y, z + height - 9);
  const dot3 = p(x + 32, y, z + height - 9);

  // Líneas de código
  const codeLinesSvg = lines.slice(0, 3).map((line, idx) => {
    const linePos = p(x + 14, y, z + height - barHeight - 16 - idx * 18);
    const isCommand = line.startsWith('>');
    const isSuccess = line.startsWith('✓');
    const color = isSuccess ? '#10b981' : isCommand ? theme.colors.accent : theme.colors.textSecondary;

    return `
      <text 
        x="${linePos.x}" 
        y="${linePos.y}" 
        fill="${color}" 
        font-family="${theme.typography.codeFont}" 
        font-size="${theme.typography.sizes.code}" 
        font-weight="500"
      >${line}</text>
    `;
  }).join('\n');

  return `
    <g class="primitive-terminal" ${id ? `id="${id}"` : ''}>
      <!-- Fondo de terminal -->
      <path d="${cardPath}" fill="${theme.colors.surface}" stroke="${theme.colors.borderBright}" stroke-width="1.5" />
      
      <!-- Barra superior -->
      <path d="${barPath}" fill="${theme.colors.surfaceElevated}" stroke="${theme.colors.border}" stroke-width="1" />
      
      <!-- Dots -->
      <circle cx="${dot1.x}" cy="${dot1.y}" r="3" fill="#ef4444" />
      <circle cx="${dot2.x}" cy="${dot2.y}" r="3" fill="#f59e0b" />
      <circle cx="${dot3.x}" cy="${dot3.y}" r="3" fill="#10b981" />

      <!-- Contenido de código -->
      ${codeLinesSvg}
    </g>
  `;
}
