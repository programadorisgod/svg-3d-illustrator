import { toIsometric, COS_30 } from '../../engine/isometric.js';

/**
 * Primitiva de Base de Datos Isométrica en Torre de Discos
 */
export function renderDatabaseCylinderPrimitive({
  x = 0,
  y = 0,
  z = 0,
  radius = 45,
  layerHeight = 22,
  layers = 3,
  originX = 400,
  originY = 300,
  scale = 1,
  theme,
  statusColor = '#10b981', // Verde activo
  label = 'Database',
  id = ''
}) {
  const rx = radius * scale * COS_30 * 1.414;
  const ry = rx * 0.577;
  const strokeAttr = `stroke="${theme.colors.borderBright}" stroke-width="1.2"`;

  const layerSvgs = [];

  for (let i = 0; i < layers; i++) {
    const curZ = z + i * (layerHeight + 4);
    const centerBase = toIsometric(x, y, curZ, originX, originY, scale);
    const centerTop = toIsometric(x, y, curZ + layerHeight, originX, originY, scale);

    // Disco i
    layerSvgs.push(`
      <g class="db-layer" data-layer="${i}">
        <!-- Sombra sutil entre capas -->
        <ellipse cx="${centerBase.x}" cy="${centerBase.y + 4}" rx="${rx * 0.95}" ry="${ry * 0.95}" fill="${theme.colors.shadow}" opacity="0.3" filter="url(#shadow-blur-6)" />

        <!-- Cuerpo cilíndrico -->
        <path d="
          M ${centerBase.x - rx} ${centerTop.y}
          L ${centerBase.x - rx} ${centerBase.y}
          A ${rx} ${ry} 0 0 0 ${centerBase.x + rx} ${centerBase.y}
          L ${centerBase.x + rx} ${centerTop.y}
          Z
        " fill="${theme.colors.isoRight}" ${strokeAttr} />

        <!-- Tapa superior del disco -->
        <ellipse cx="${centerTop.x}" cy="${centerTop.y}" rx="${rx}" ry="${ry}" fill="${i === layers - 1 ? theme.colors.isoTop : theme.colors.surfaceElevated}" ${strokeAttr} />

        <!-- LED indicador en el frente del cilindro -->
        <circle cx="${centerBase.x + rx * 0.5}" cy="${(centerBase.y + centerTop.y) / 2}" r="2.5" fill="${statusColor}" filter="url(#shadow-blur-6)" />
      </g>
    `);
  }

  // Etiqueta superior opcional
  let labelSvg = '';
  if (label) {
    const topZ = z + layers * (layerHeight + 4);
    const topPos = toIsometric(x, y, topZ + 15, originX, originY, scale);
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
    <g class="primitive-database" ${id ? `id="${id}"` : ''}>
      ${layerSvgs.join('\n')}
      ${labelSvg}
    </g>
  `;
}
