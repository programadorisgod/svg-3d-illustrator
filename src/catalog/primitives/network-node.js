/**
 * Primitiva de Nodo de Arquitectura / Diagrama Técnico (Plano 2D o Isométrico)
 */
export function renderNetworkNodePrimitive({
  x = 100,
  y = 100,
  width = 180,
  height = 80,
  theme,
  icon = 'server',
  title = 'Auth Service',
  subtitle = 'OAuth2 & JWT Token',
  badge = 'Active',
  badgeColor = '#10b981',
  id = ''
}) {
  const r = theme.radius.lg;

  // Iconos vectoriales simples inline
  const icons = {
    server: `<rect x="${x + 16}" y="${y + 18}" width="20" height="14" rx="2" fill="none" stroke="${theme.colors.primaryLight}" stroke-width="2" /><circle cx="${x + 22}" cy="${y + 25}" r="1.5" fill="${theme.colors.accent}" />`,
    database: `<ellipse cx="${x + 26}" cy="${y + 22}" rx="10" ry="4" fill="none" stroke="${theme.colors.primaryLight}" stroke-width="1.8" /><path d="M ${x + 16} ${y + 22} v 8 a 10 4 0 0 0 20 0 v -8" fill="none" stroke="${theme.colors.primaryLight}" stroke-width="1.8" />`,
    api: `<path d="M ${x + 18} ${y + 20} l 6 5 l -6 5 M ${x + 28} ${y + 30} h 6" fill="none" stroke="${theme.colors.primaryLight}" stroke-width="2" stroke-linecap="round" />`,
    shield: `<path d="M ${x + 26} ${y + 16} l 9 4 v 6 c 0 5 -4 9 -9 11 c -5 -2 -9 -6 -9 -11 v -6 z" fill="none" stroke="${theme.colors.primaryLight}" stroke-width="1.8" />`
  };

  const iconSvg = icons[icon] || icons['server'];

  return `
    <g class="network-node" ${id ? `id="${id}"` : ''} transform="translate(0, 0)">
      <!-- Fondo con sombra -->
      <rect 
        x="${x}" 
        y="${y}" 
        width="${width}" 
        height="${height}" 
        rx="${r}" 
        fill="${theme.colors.surface}" 
        stroke="${theme.colors.borderBright}" 
        stroke-width="1.2"
        filter="url(#shadow-blur-6)" 
      />

      <!-- Contenedor del Icono -->
      <rect x="${x + 12}" y="${y + 14}" width="28" height="28" rx="${theme.radius.md}" fill="${theme.colors.surfaceElevated}" />
      ${iconSvg}

      <!-- Badge de Estado -->
      ${badge ? `
        <rect x="${x + width - 62}" y="${y + 14}" width="50" height="18" rx="9" fill="${badgeColor}1a" stroke="${badgeColor}40" stroke-width="1" />
        <circle cx="${x + width - 52}" cy="${y + 23}" r="2.5" fill="${badgeColor}" />
        <text x="${x + width - 44}" y="${y + 26}" fill="${badgeColor}" font-family="${theme.typography.fontFamily}" font-size="${theme.typography.sizes.badge}" font-weight="600">${badge}</text>
      ` : ''}

      <!-- Título -->
      <text 
        x="${x + 48}" 
        y="${y + 32}" 
        fill="${theme.colors.textPrimary}" 
        font-family="${theme.typography.fontFamily}" 
        font-size="${theme.typography.sizes.subtitle}" 
        font-weight="600"
      >${title}</text>

      <!-- Subtítulo -->
      <text 
        x="${x + 16}" 
        y="${y + 60}" 
        fill="${theme.colors.textSecondary}" 
        font-family="${theme.typography.fontFamily}" 
        font-size="${theme.typography.sizes.body}" 
        font-weight="400"
      >${subtitle}</text>
    </g>
  `;
}
