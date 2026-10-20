/**
 * Motor analítico de proyección isométrica (30 grados estándar)
 * Transforma coordenadas 3D (x, y, z) a pantalla 2D (u, v)
 */

export const COS_30 = Math.cos(Math.PI / 6); // ~0.8660254
export const SIN_30 = Math.sin(Math.PI / 6); // 0.5

/**
 * Convierte coordenadas cartesianas (x, y, z) a coordenadas de pantalla (sx, sy)
 * @param {number} x - Eje hacia abajo-derecha
 * @param {number} y - Eje hacia abajo-izquierda
 * @param {number} z - Altura (hacia arriba)
 * @param {number} originX - Centro X en pantalla
 * @param {number} originY - Centro Y en pantalla
 * @param {number} scale - Escala de unidades
 */
export function toIsometric(x, y, z = 0, originX = 0, originY = 0, scale = 1) {
  const sx = originX + (x - y) * COS_30 * scale;
  const sy = originY + (x + y) * SIN_30 * scale - z * scale;
  return { x: Number(sx.toFixed(2)), y: Number(sy.toFixed(2)) };
}

/**
 * Convierte un array de puntos [x, y, z] a coordenadas isométricas
 */
export function projectPoints(points, originX, originY, scale = 1) {
  return points.map(([x, y, z]) => toIsometric(x, y, z, originX, originY, scale));
}

/**
 * Convierte puntos proyectados en string de path SVG 'M x y L x y ... Z'
 */
export function pointsToPath(pts, closed = true) {
  if (!pts || pts.length === 0) return '';
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  return closed ? `${d} Z` : d;
}

/**
 * Genera un prisma/caja isométrica completa con caras top, left, right y sombra
 */
export function createIsometricBox({
  x = 0,
  y = 0,
  z = 0,
  width = 100,  // dx
  depth = 100,  // dy
  height = 80,  // dz
  originX = 400,
  originY = 300,
  scale = 1,
  colors = {
    top: '#6366f1',
    left: '#4338ca',
    right: '#4f46e5',
    stroke: 'rgba(255,255,255,0.15)',
    strokeWidth: 1,
    shadow: 'rgba(0, 0, 0, 0.25)',
  },
  hasShadow = true,
  shadowBlur = 12,
  id = ''
}) {
  const p = (px, py, pz) => toIsometric(px, py, pz, originX, originY, scale);

  // Vértices base (z)
  const b0 = p(x, y, z);
  const b1 = p(x + width, y, z);
  const b2 = p(x + width, y + depth, z);
  const b3 = p(x, y + depth, z);

  // Vértices superiores (z + height)
  const t0 = p(x, y, z + height);
  const t1 = p(x + width, y, z + height);
  const t2 = p(x + width, y + depth, z + height);
  const t3 = p(x, y + depth, z + height);

  // Caras
  const topFace = [t0, t1, t2, t3];
  const leftFace = [b3, b2, t2, t3];
  const rightFace = [b2, b1, t1, t2];

  // Sombra proyectada en el plano z = 0
  let shadowSvg = '';
  if (hasShadow) {
    const s0 = p(x, y, 0);
    const s1 = p(x + width + depth * 0.2, y, 0);
    const s2 = p(x + width + depth * 0.4, y + depth * 1.1, 0);
    const s3 = p(x, y + depth * 1.1, 0);
    shadowSvg = `
      <polygon 
        points="${[s0, s1, s2, s3].map(pt => `${pt.x},${pt.y}`).join(' ')}" 
        fill="${colors.shadow}" 
        filter="${shadowBlur > 0 ? `url(#shadow-blur-${shadowBlur})` : 'none'}" 
      />`;
  }

  const strokeAttr = colors.stroke ? `stroke="${colors.stroke}" stroke-width="${colors.strokeWidth || 1}" stroke-linejoin="round"` : '';

  return `
    <g class="iso-box" ${id ? `id="${id}"` : ''} data-z="${z}">
      ${shadowSvg}
      <!-- Left Face -->
      <polygon points="${leftFace.map(pt => `${pt.x},${pt.y}`).join(' ')}" fill="${colors.left}" ${strokeAttr} />
      <!-- Right Face -->
      <polygon points="${rightFace.map(pt => `${pt.x},${pt.y}`).join(' ')}" fill="${colors.right}" ${strokeAttr} />
      <!-- Top Face -->
      <polygon points="${topFace.map(pt => `${pt.x},${pt.y}`).join(' ')}" fill="${colors.top}" ${strokeAttr} />
    </g>
  `;
}

/**
 * Genera una cuadrícula isométrica en el plano z = 0
 */
export function createIsometricGrid({
  originX = 400,
  originY = 300,
  gridSize = 6,
  cellSize = 50,
  color = 'rgba(255, 255, 255, 0.08)',
  axisColor = 'rgba(99, 102, 241, 0.4)',
  strokeWidth = 1,
  showDots = true,
  dotRadius = 1.5,
  dotColor = 'rgba(255, 255, 255, 0.3)'
}) {
  const lines = [];
  const dots = [];
  const max = gridSize * cellSize;

  for (let i = 0; i <= gridSize; i++) {
    const pos = i * cellSize;

    // Líneas paralelas a X
    const p1 = toIsometric(0, pos, 0, originX, originY);
    const p2 = toIsometric(max, pos, 0, originX, originY);
    const isAxisY = i === 0;
    lines.push(`<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="${isAxisY ? axisColor : color}" stroke-width="${strokeWidth}" />`);

    // Líneas paralelas a Y
    const p3 = toIsometric(pos, 0, 0, originX, originY);
    const p4 = toIsometric(pos, max, 0, originX, originY);
    const isAxisX = i === 0;
    lines.push(`<line x1="${p3.x}" y1="${p3.y}" x2="${p4.x}" y2="${p4.y}" stroke="${isAxisX ? axisColor : color}" stroke-width="${strokeWidth}" />`);

    if (showDots) {
      for (let j = 0; j <= gridSize; j++) {
        const pt = toIsometric(i * cellSize, j * cellSize, 0, originX, originY);
        dots.push(`<circle cx="${pt.x}" cy="${pt.y}" r="${dotRadius}" fill="${dotColor}" />`);
      }
    }
  }

  return `
    <g class="iso-grid">
      ${lines.join('\n      ')}
      ${dots.join('\n      ')}
    </g>
  `;
}

/**
 * Genera un cilindro isométrico (ideal para bases de datos / storage)
 */
export function createIsometricCylinder({
  x = 0,
  y = 0,
  z = 0,
  radius = 50,
  height = 40,
  originX = 400,
  originY = 300,
  scale = 1,
  colors = {
    top: '#38bdf8',
    side: '#0284c7',
    stroke: 'rgba(255,255,255,0.2)',
    strokeWidth: 1,
  },
  id = ''
}) {
  const centerBase = toIsometric(x, y, z, originX, originY, scale);
  const centerTop = toIsometric(x, y, z + height, originX, originY, scale);

  // En proyección isométrica de 30°, un círculo se proyecta como una elipse:
  // radio horizontal rx = radius * scale, radio vertical ry = radius * scale * sin(30) = radius * scale * 0.5
  const rx = radius * scale * COS_30 * 1.414; // Compensación visual
  const ry = rx * 0.577; // Proporción isométrica tan(30)

  const strokeAttr = colors.stroke ? `stroke="${colors.stroke}" stroke-width="${colors.strokeWidth || 1}"` : '';

  return `
    <g class="iso-cylinder" ${id ? `id="${id}"` : ''} data-z="${z}">
      <!-- Cuerpo lateral -->
      <path d="
        M ${centerBase.x - rx} ${centerTop.y}
        L ${centerBase.x - rx} ${centerBase.y}
        A ${rx} ${ry} 0 0 0 ${centerBase.x + rx} ${centerBase.y}
        L ${centerBase.x + rx} ${centerTop.y}
        Z
      " fill="${colors.side}" ${strokeAttr} />
      
      <!-- Tapa inferior para sombra/borde si aplica -->
      <ellipse cx="${centerBase.x}" cy="${centerBase.y}" rx="${rx}" ry="${ry}" fill="none" ${strokeAttr} />
      
      <!-- Tapa superior -->
      <ellipse cx="${centerTop.x}" cy="${centerTop.y}" rx="${rx}" ry="${ry}" fill="${colors.top}" ${strokeAttr} />
    </g>
  `;
}
