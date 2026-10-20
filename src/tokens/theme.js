import { PRESETS } from './presets.js';

/**
 * Resuelve y normaliza el tema final combinando el preset base con overrides opcionales
 */
export function resolveTheme(presetName = 'dark-linear', customColors = {}) {
  const basePreset = PRESETS[presetName] || PRESETS['dark-linear'];

  return {
    ...basePreset,
    colors: {
      ...basePreset.colors,
      ...customColors
    },
    // Tokens de espaciado y fuentes
    typography: {
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      codeFont: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      sizes: {
        title: 22,
        subtitle: 14,
        body: 12,
        badge: 10,
        code: 11
      }
    },
    stroke: {
      thin: 1,
      regular: 1.5,
      thick: 2.5
    },
    radius: {
      sm: 4,
      md: 8,
      lg: 12,
      xl: 16
    }
  };
}
