/**
 * Generador de gradientes, efectos de luz, sombras y filtros SVG
 */

export function createSvgDefs(theme = {}) {
  const primary = theme.colors?.primary || '#6366f1';
  const secondary = theme.colors?.secondary || '#a855f7';
  const accent = theme.colors?.accent || '#38bdf8';
  const bg = theme.colors?.background || '#090d16';

  return `
  <defs>
    <!-- Filtros de sombra y blur ambiental -->
    <filter id="shadow-blur-6" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
      <feOffset dx="0" dy="4" result="offsetblur" />
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.3" />
      </feComponentTransfer>
      <feMerge>
        <feMergeNode />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <filter id="shadow-blur-12" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="6" />
    </filter>

    <filter id="glow-ambient" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="24" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <!-- Gradientes principales -->
    <linearGradient id="grad-primary-v" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${primary}" stop-opacity="0.9" />
      <stop offset="100%" stop-color="${secondary}" stop-opacity="1" />
    </linearGradient>

    <linearGradient id="grad-accent-diag" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${accent}" />
      <stop offset="100%" stop-color="${primary}" />
    </linearGradient>

    <!-- Gradientes de caras 3D e isométricas -->
    <linearGradient id="iso-top-face" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${primary}" stop-opacity="0.95" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.25" />
    </linearGradient>

    <linearGradient id="iso-left-face" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${primary}" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0.4" />
    </linearGradient>

    <linearGradient id="iso-right-face" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${secondary}" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0.3" />
    </linearGradient>

    <!-- Aurora y Fondos -->
    <radialGradient id="aurora-glow-1" cx="40%" cy="30%" r="60%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.35" />
      <stop offset="50%" stop-color="${primary}" stop-opacity="0.15" />
      <stop offset="100%" stop-color="${bg}" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="aurora-glow-2" cx="70%" cy="60%" r="55%">
      <stop offset="0%" stop-color="${secondary}" stop-opacity="0.3" />
      <stop offset="60%" stop-color="${primary}" stop-opacity="0.1" />
      <stop offset="100%" stop-color="${bg}" stop-opacity="0" />
    </radialGradient>

    <!-- Patrón de rejilla de puntos -->
    <pattern id="dot-pattern" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1" fill="${theme.colors?.grid || 'rgba(255,255,255,0.08)'}" />
    </pattern>

    <!-- Patrón de cuadrícula continua -->
    <pattern id="grid-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${theme.colors?.grid || 'rgba(255,255,255,0.05)'}" stroke-width="1" />
    </pattern>
  </defs>
  `;
}
