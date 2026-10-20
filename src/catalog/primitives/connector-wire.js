/**
 * Primitiva de Conector / Cable de Flujo de Datos
 * Conecta dos puntos con trazado ortogonal y esquinas redondeadas
 */
export function renderConnectorWirePrimitive({
  from = { x: 100, y: 100 },
  to = { x: 300, y: 200 },
  theme,
  style = 'orthogonal', // 'orthogonal', 'direct', 'isometric'
  color,
  strokeWidth = 2,
  dashed = false,
  showPulse = true,
  hasArrow = true,
  label = '',
  id = ''
}) {
  const wireColor = color || theme.colors.borderBright;
  let pathD = '';

  if (style === 'direct') {
    pathD = `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
  } else {
    // Trazado ortogonal con punto medio
    const midX = (from.x + to.x) / 2;
    pathD = `M ${from.x} ${from.y} L ${midX} ${from.y} L ${midX} ${to.y} L ${to.x} ${to.y}`;
  }

  const pulseSvg = showPulse ? `
    <circle cx="${(from.x + to.x) / 2}" cy="${(from.y + to.y) / 2}" r="3" fill="${theme.colors.accent}">
      <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
    </circle>
  ` : '';

  const labelSvg = label ? `
    <text 
      x="${(from.x + to.x) / 2}" 
      y="${(from.y + to.y) / 2 - 8}" 
      text-anchor="middle" 
      fill="${theme.colors.textMuted}" 
      font-family="${theme.typography.fontFamily}" 
      font-size="${theme.typography.sizes.badge}" 
      font-weight="500"
    >${label}</text>
  ` : '';

  return `
    <g class="connector-wire" ${id ? `id="${id}"` : ''}>
      <path 
        d="${pathD}" 
        fill="none" 
        stroke="${wireColor}" 
        stroke-width="${strokeWidth}" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        ${dashed ? 'stroke-dasharray="6,4"' : ''}
      />
      ${pulseSvg}
      ${labelSvg}
    </g>
  `;
}
