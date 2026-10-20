/**
 * Ensamblador de documento SVG estándar y limpio
 */
export function wrapSvgDocument({
  content = '',
  defs = '',
  width = 800,
  height = 600,
  title = 'SVG 3D Illustration',
  description = 'Generated deterministically by svg-3d-illustrator'
}) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg 
  xmlns="http://www.w3.org/2000/svg" 
  viewBox="0 0 ${width} ${height}" 
  width="${width}" 
  height="${height}"
  role="img"
  aria-label="${title}"
>
  <title>${title}</title>
  <desc>${description}</desc>
  ${defs}
  ${content}
</svg>
`.trim();
}
