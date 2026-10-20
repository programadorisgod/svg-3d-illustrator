import { createIsometricBox, toIsometric } from '../../engine/isometric.js';

/**
 * Primitiva de Bloque/Caja Isométrica con soporte para etiqueta frontal o superior
 */
export function renderIsometricBoxPrimitive({
  x = 0,
  y = 0,
  z = 0,
  width = 90,
  depth = 90,
  height = 60,
  originX = 400,
  originY = 300,
  scale = 1,
  theme,
  label = '',
  badge = '',
  id = ''
}) {
  const colors = {
    top: theme.colors.isoTop,
    left: theme.colors.isoLeft,
    right: theme.colors.isoRight,
    stroke: theme.colors.borderBright,
    strokeWidth: 1,
    shadow: theme.colors.shadow,
  };

  const boxSvg = createIsometricBox({
    x, y, z, width, depth, height,
    originX, originY, scale,
    colors,
    hasShadow: true,
    shadowBlur: 12,
    id
  });

  let labelSvg = '';
  if (label) {
    // Proyectar texto sobre la cara superior
    const topCenter = toIsometric(x + width / 2, y + depth / 2, z + height + 2, originX, originY, scale);
    labelSvg = `
      <text 
        x="${topCenter.x}" 
        y="${topCenter.y}" 
        text-anchor="middle" 
        fill="${theme.colors.textPrimary}" 
        font-family="${theme.typography.fontFamily}" 
        font-size="${theme.typography.sizes.body}" 
        font-weight="600"
        letter-spacing="0.5"
      >${label}</text>
    `;
  }

  return `
    <g class="primitive-iso-box" ${id ? `id="${id}"` : ''}>
      ${boxSvg}
      ${labelSvg}
    </g>
  `;
}
