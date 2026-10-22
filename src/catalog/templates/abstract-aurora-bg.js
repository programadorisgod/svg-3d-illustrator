/**
 * Plantilla de Fondo Vectorial Abstracto "Aurora Borealis" Fluida y Cinematográfica
 * Diseñada para lucir orgánica, con velos de luz en curvas Bézier entrelazadas,
 * degradados luminosos multi-stop, resplandores sin recortes duros y esquinas redondeadas.
 */
export function renderAbstractAuroraBgTemplate({
  theme,
  width = 1200,
  height = 600,
  title = '',
  subtitle = '',
  accentGlow = true
} = {}) {
  // Paleta de luces boreales (Emerald, Cyan, Indigo, Violet, Rose)
  const isDark = theme.isDark !== false;
  const deepBg = isDark ? (theme.colors?.background || '#090d16') : '#f8fafc';
  const cEmerald = '#10b981';
  const cCyan = '#06b6d4';
  const cIndigo = '#6366f1';
  const cViolet = '#8b5cf6';
  const cRose = '#f43f5e';

  return `
    <!-- Filtro de difusión atmosférica de alto radio sin recorte -->
    <defs>
      <filter id="aurora-blur-heavy" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="64" />
      </filter>
      <filter id="aurora-blur-medium" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="36" />
      </filter>
      <linearGradient id="aurora-ribbon-1" x1="0%" y1="0%" x2="100%" y2="50%">
        <stop offset="0%" stop-color="${cIndigo}" stop-opacity="0.8" />
        <stop offset="45%" stop-color="${cCyan}" stop-opacity="0.9" />
        <stop offset="100%" stop-color="${cEmerald}" stop-opacity="0.4" />
      </linearGradient>
      <linearGradient id="aurora-ribbon-2" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${cRose}" stop-opacity="0.75" />
        <stop offset="50%" stop-color="${cViolet}" stop-opacity="0.85" />
        <stop offset="100%" stop-color="${cCyan}" stop-opacity="0.2" />
      </linearGradient>
      <linearGradient id="aurora-ribbon-3" x1="15%" y1="0%" x2="85%" y2="100%">
        <stop offset="0%" stop-color="${cEmerald}" stop-opacity="0.7" />
        <stop offset="60%" stop-color="${cCyan}" stop-opacity="0.8" />
        <stop offset="100%" stop-color="${cIndigo}" stop-opacity="0.4" />
      </linearGradient>
      <radialGradient id="aurora-bg-mesh" cx="50%" cy="40%" r="75%">
        <stop offset="0%" stop-color="${isDark ? '#141b2d' : '#e0e7ff'}" stop-opacity="1" />
        <stop offset="65%" stop-color="${deepBg}" stop-opacity="1" />
        <stop offset="100%" stop-color="${isDark ? '#05070c' : '#f1f5f9'}" stop-opacity="1" />
      </radialGradient>
      <clipPath id="aurora-frame-clip">
        <rect width="${width}" height="${height}" rx="24" />
      </clipPath>
    </defs>

    <!-- Marco recortado con esquinas suaves de 24px para evitar bordes duros cortados -->
    <g clip-path="url(#aurora-frame-clip)">
      <!-- Fondo Degradado Atmosférico Profundo -->
      <rect width="${width}" height="${height}" fill="url(#aurora-bg-mesh)" />

      <!-- Orbes difusos de resplandor boreal ambiental (Capa 0: Atmósfera) -->
      <g filter="url(#aurora-blur-heavy)" opacity="0.65">
        <ellipse cx="${width * 0.3}" cy="${height * 0.35}" rx="${width * 0.32}" ry="${height * 0.4}" fill="${cIndigo}" />
        <ellipse cx="${width * 0.72}" cy="${height * 0.42}" rx="${width * 0.35}" ry="${height * 0.45}" fill="${cCyan}" />
        <circle cx="${width * 0.5}" cy="${height * 0.25}" r="${width * 0.28}" fill="${cEmerald}" />
        <circle cx="${width * 0.85}" cy="${height * 0.7}" r="${width * 0.22}" fill="${cRose}" />
      </g>

      <!-- Velo Boreal 1: Cinta ondulante principal (Cyan/Emerald) -->
      <path d="
        M -50 ${height * 0.48}
        C ${width * 0.25} ${height * 0.2}, ${width * 0.42} ${height * 0.75}, ${width * 0.7} ${height * 0.38}
        C ${width * 0.88} ${height * 0.16}, ${width * 0.95} ${height * 0.5}, ${width + 60} ${height * 0.32}
        L ${width + 60} ${height + 60}
        L -50 ${height + 60}
        Z
      " fill="url(#aurora-ribbon-1)" opacity="0.75" filter="url(#aurora-blur-medium)" />

      <!-- Velo Boreal 2: Cinta ondulante secundaria (Violet/Rose) en contrapunto -->
      <path d="
        M -60 ${height * 0.62}
        C ${width * 0.18} ${height * 0.78}, ${width * 0.48} ${height * 0.32}, ${width * 0.75} ${height * 0.58}
        C ${width * 0.89} ${height * 0.72}, ${width * 0.96} ${height * 0.42}, ${width + 60} ${height * 0.55}
        L ${width + 60} ${height + 60}
        L -60 ${height + 60}
        Z
      " fill="url(#aurora-ribbon-2)" opacity="0.65" filter="url(#aurora-blur-medium)" />

      <!-- Velo Boreal 3: Cinta de luz frontal nítida con curvas Bézier armónicas -->
      <path d="
        M 0 ${height * 0.55}
        C ${width * 0.22} ${height * 0.38}, ${width * 0.44} ${height * 0.72}, ${width * 0.68} ${height * 0.45}
        C ${width * 0.84} ${height * 0.26}, ${width * 0.94} ${height * 0.52}, ${width} ${height * 0.42}
        L ${width} ${height}
        L 0 ${height}
        Z
      " fill="url(#aurora-ribbon-3)" opacity="0.45" />

      <!-- Resplandor de cresta de onda (Fina línea luminosa de luz) -->
      <path d="
        M 0 ${height * 0.55}
        C ${width * 0.22} ${height * 0.38}, ${width * 0.44} ${height * 0.72}, ${width * 0.68} ${height * 0.45}
        C ${width * 0.84} ${height * 0.26}, ${width * 0.94} ${height * 0.52}, ${width} ${height * 0.42}
      " fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2" stroke-linecap="round" />

      <!-- Cuadrícula sutil de estrellas / puntos técnicos luminosos -->
      <rect width="${width}" height="${height}" fill="url(#dot-pattern)" opacity="${isDark ? '0.35' : '0.18'}" />

      <!-- Borde de marco interior elegante -->
      <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="23" fill="none" stroke="${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'}" stroke-width="1.5" />

      <!-- Textos Opcionales -->
      ${title ? `
        <g transform="translate(${width / 2}, ${height / 2 - 16})">
          <text x="0" y="0" text-anchor="middle" fill="${isDark ? '#ffffff' : '#0f172a'}" font-family="${theme.typography.fontFamily}" font-size="38" font-weight="800" letter-spacing="-0.02em" filter="drop-shadow(0 4px 16px rgba(0,0,0,0.4))">
            ${title}
          </text>
          ${subtitle ? `
            <text x="0" y="42" text-anchor="middle" fill="${isDark ? 'rgba(255,255,255,0.85)' : '#475569'}" font-family="${theme.typography.fontFamily}" font-size="16" font-weight="500" letter-spacing="0.01em">
              ${subtitle}
            </text>
          ` : ''}
        </g>
      ` : ''}
    </g>
  `;
}
