/**
 * Presets de estilo y paletas de color para el sistema de diseño SVG
 */

export const PRESETS = {
  'dark-linear': {
    name: 'Linear Dark',
    description: 'Estética moderna inspirada en Linear, con fondo oscuro profundo y acentos índigo/violeta',
    isDark: true,
    colors: {
      background: '#08090d',
      surface: '#12141c',
      surfaceElevated: '#1a1d29',
      primary: '#5e6ad2',
      primaryLight: '#828fff',
      secondary: '#8b5cf6',
      accent: '#00d4b2',
      accentGlow: 'rgba(0, 212, 178, 0.25)',
      textPrimary: '#f3f4f6',
      textSecondary: '#9ca3af',
      textMuted: '#6b7280',
      border: 'rgba(255, 255, 255, 0.08)',
      borderBright: 'rgba(94, 106, 210, 0.4)',
      grid: 'rgba(255, 255, 255, 0.04)',
      shadow: 'rgba(0, 0, 0, 0.5)',
      // Caras isométricas
      isoTop: '#6b79e8',
      isoLeft: '#3c4485',
      isoRight: '#4e58a8'
    }
  },

  'light-stripe': {
    name: 'Stripe Light',
    description: 'Estilo limpio, brillante y corporativo de alta gama inspirado en Stripe',
    isDark: false,
    colors: {
      background: '#f8fafc',
      surface: '#ffffff',
      surfaceElevated: '#ffffff',
      primary: '#6366f1',
      primaryLight: '#818cf8',
      secondary: '#0ea5e9',
      accent: '#06b6d4',
      accentGlow: 'rgba(99, 102, 241, 0.15)',
      textPrimary: '#0f172a',
      textSecondary: '#475569',
      textMuted: '#94a3b8',
      border: 'rgba(15, 23, 42, 0.08)',
      borderBright: 'rgba(99, 102, 241, 0.35)',
      grid: 'rgba(15, 23, 42, 0.04)',
      shadow: 'rgba(15, 23, 42, 0.12)',
      // Caras isométricas
      isoTop: '#818cf8',
      isoLeft: '#4338ca',
      isoRight: '#4f46e5'
    }
  },

  'cyber-neon': {
    name: 'Cyber Neon',
    description: 'Alto contraste, cian y esmeralda neón sobre fondo abisal para visuales de ciberseguridad o web3',
    isDark: true,
    colors: {
      background: '#040711',
      surface: '#0b1122',
      surfaceElevated: '#111b33',
      primary: '#06b6d4',
      primaryLight: '#67e8f9',
      secondary: '#10b981',
      accent: '#f43f5e',
      accentGlow: 'rgba(6, 182, 212, 0.35)',
      textPrimary: '#f0fdfa',
      textSecondary: '#99f6e4',
      textMuted: '#5eead4',
      border: 'rgba(6, 182, 212, 0.2)',
      borderBright: '#06b6d4',
      grid: 'rgba(6, 182, 212, 0.08)',
      shadow: 'rgba(0, 0, 0, 0.7)',
      // Caras isométricas
      isoTop: '#22d3ee',
      isoLeft: '#0e7490',
      isoRight: '#0891b2'
    }
  },

  'slate-docs': {
    name: 'Slate Docs',
    description: 'Optimizado para documentación técnica limpia, diagramas de arquitectura y blogs técnicos',
    isDark: true,
    colors: {
      background: '#0f172a',
      surface: '#1e293b',
      surfaceElevated: '#334155',
      primary: '#38bdf8',
      primaryLight: '#7dd3fc',
      secondary: '#818cf8',
      accent: '#34d399',
      accentGlow: 'rgba(56, 189, 248, 0.2)',
      textPrimary: '#f8fafc',
      textSecondary: '#cbd5e1',
      textMuted: '#64748b',
      border: 'rgba(255, 255, 255, 0.1)',
      borderBright: 'rgba(56, 189, 248, 0.4)',
      grid: 'rgba(255, 255, 255, 0.04)',
      shadow: 'rgba(0, 0, 0, 0.4)',
      // Caras isométricas
      isoTop: '#7dd3fc',
      isoLeft: '#0369a1',
      isoRight: '#0284c7'
    }
  }
};
