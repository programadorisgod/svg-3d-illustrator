/**
 * Plantilla de Fondo Vectorial Abstracto con Mallas y Ondas Aurora
 */
export function renderAbstractAuroraBgTemplate({
  theme,
  width = 1200,
  height = 600,
  title = '',
  subtitle = '',
  accentGlow = true
}) {
  return `
    <!-- Fondo principal -->
    <rect width="${width}" height="${height}" fill="${theme.colors.background}" />

    <!-- Auroras radiales de alta difusión -->
    <circle cx="${width * 0.25}" cy="${height * 0.35}" r="${width * 0.35}" fill="${theme.colors.primary}" opacity="0.22" filter="url(#glow-ambient)" />
    <circle cx="${width * 0.75}" cy="${height * 0.45}" r="${width * 0.4}" fill="${theme.colors.secondary}" opacity="0.18" filter="url(#glow-ambient)" />
    <circle cx="${width * 0.5}" cy="${height * 0.7}" r="${width * 0.3}" fill="${theme.colors.accent}" opacity="0.15" filter="url(#glow-ambient)" />

    <!-- Ondas vectoriales suaves (Curvas Bézier cúbicas superpuestas) -->
    <path d="
      M 0 ${height * 0.65}
      C ${width * 0.2} ${height * 0.45}, ${width * 0.4} ${height * 0.8}, ${width * 0.65} ${height * 0.55}
      C ${width * 0.85} ${height * 0.35}, ${width * 0.95} ${height * 0.7}, ${width} ${height * 0.5}
      L ${width} ${height}
      L 0 ${height}
      Z
    " fill="${theme.colors.surface}" opacity="0.4" />

    <path d="
      M 0 ${height * 0.75}
      C ${width * 0.25} ${height * 0.6}, ${width * 0.5} ${height * 0.85}, ${width * 0.75} ${height * 0.65}
      C ${width * 0.9} ${height * 0.5}, ${width * 0.95} ${height * 0.75}, ${width} ${height * 0.7}
      L ${width} ${height}
      L 0 ${height}
      Z
    " fill="${theme.colors.surfaceElevated}" opacity="0.5" />

    <!-- Rejilla de puntos para textura técnica -->
    <rect width="${width}" height="${height}" fill="url(#dot-pattern)" opacity="0.5" />

    <!-- Textos opcionales de presentación -->
    ${title ? `
      <g transform="translate(${width / 2}, ${height / 2 - 20})">
        <text x="0" y="0" text-anchor="middle" fill="${theme.colors.textPrimary}" font-family="${theme.typography.fontFamily}" font-size="38" font-weight="800" letter-spacing="-0.5">
          ${title}
        </text>
        ${subtitle ? `
          <text x="0" y="40" text-anchor="middle" fill="${theme.colors.textSecondary}" font-family="${theme.typography.fontFamily}" font-size="16" font-weight="400">
            ${subtitle}
          </text>
        ` : ''}
      </g>
    ` : ''}
  `;
}
