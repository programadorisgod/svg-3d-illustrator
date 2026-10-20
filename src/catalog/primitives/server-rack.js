import { createIsometricBox, toIsometric } from '../../engine/isometric.js';

/**
 * Primitiva de Servidor en Rack Isométrico
 */
export function renderServerRackPrimitive({
  x = 0,
  y = 0,
  z = 0,
  width = 70,
  depth = 110,
  height = 90,
  originX = 400,
  originY = 300,
  scale = 1,
  theme,
  ledColor = '#00d4b2', // Cian o esmeralda
  label = 'API Gateway',
  id = ''
}) {
  const boxSvg = createIsometricBox({
    x, y, z, width, depth, height,
    originX, originY, scale,
    colors: {
      top: theme.colors.surfaceElevated,
      left: theme.colors.surface,
      right: theme.colors.isoLeft,
      stroke: theme.colors.borderBright,
      strokeWidth: 1,
      shadow: theme.colors.shadow
    },
    hasShadow: true,
    shadowBlur: 10,
    id: `${id}-chassis`
  });

  // Bahías de discos y LEDs en la cara frontal (right face)
  const slots = [];
  const slotCount = 3;
  const slotSpacing = height / (slotCount + 1);

  for (let i = 1; i <= slotCount; i++) {
    const slotZ = z + height - i * slotSpacing;
    const pStart = toIsometric(x + width, y + 15, slotZ, originX, originY, scale);
    const pEnd = toIsometric(x + width, y + depth - 20, slotZ, originX, originY, scale);
    const pLed = toIsometric(x + width, y + depth - 10, slotZ, originX, originY, scale);

    slots.push(`
      <!-- Slot ${i} -->
      <line x1="${pStart.x}" y1="${pStart.y}" x2="${pEnd.x}" y2="${pEnd.y}" stroke="${theme.colors.borderBright}" stroke-width="2" />
      <circle cx="${pLed.x}" cy="${pLed.y}" r="2" fill="${ledColor}" />
    `);
  }

  // Etiqueta
  let labelSvg = '';
  if (label) {
    const topPos = toIsometric(x + width / 2, y + depth / 2, z + height + 15, originX, originY, scale);
    labelSvg = `
      <text 
        x="${topPos.x}" 
        y="${topPos.y}" 
        text-anchor="middle" 
        fill="${theme.colors.textPrimary}" 
        font-family="${theme.typography.fontFamily}" 
        font-size="${theme.typography.sizes.body}" 
        font-weight="600"
      >${label}</text>
    `;
  }

  return `
    <g class="primitive-server-rack" ${id ? `id="${id}"` : ''}>
      ${boxSvg}
      <g class="server-slots">
        ${slots.join('\n        ')}
      </g>
      ${labelSvg}
    </g>
  `;
}
