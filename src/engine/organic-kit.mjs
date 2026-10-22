import * as k from "./iso-kit.mjs";

const TAU = Math.PI * 2;
const RAD = Math.PI / 180;

/**
 * Genera el contorno orgánico de un pétalo u hoja en coordenadas locales (u a lo largo, v transversal)
 */
export function createPetalContour({ length = 42, width = 18, sharpness = 0.65, steps = 20 } = {}) {
  const ring = [];
  // Lado derecho (de base u=0 a punta u=length)
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const u = t * length;
    // Perfil orgánico: se ensancha suavemente y termina en punta
    const envelope = Math.sin(t * Math.PI) * Math.pow(1 - t * 0.25, sharpness);
    const v = (width / 2) * envelope;
    ring.push([u, v]);
  }
  // Lado izquierdo (de punta u=length de regreso a base u=0)
  for (let i = steps - 1; i > 0; i--) {
    const t = i / steps;
    const u = t * length;
    const envelope = Math.sin(t * Math.PI) * Math.pow(1 - t * 0.25, sharpness);
    const v = -(width / 2) * envelope;
    ring.push([u, v]);
  }
  return ring;
}

/**
 * Transforma un punto local de pétalo (u, v) al espacio 3D aplicando ángulo radial, inclinación (tilt) y curvatura (curl)
 */
function transformPetalPoint([u, v], { cx = 0, cy = 0, z = 0, angleDeg = 0, radiusOffset = 0, length = 42, tiltDeg = 22, curl = 6 }) {
  const t = u / (length || 1);
  const angle = angleDeg * RAD;
  const tilt = tiltDeg * RAD;

  // Elevación progresiva + curvatura parabólica suave en la punta
  const localR = radiusOffset + u * Math.cos(tilt);
  const localZ = z + u * Math.sin(tilt) - curl * Math.pow(t, 2.1) + Math.sin(t * Math.PI) * (curl * 0.45);

  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);

  const wx = cx + localR * cosA - v * sinA;
  const wy = cy + localR * sinA + v * cosA;
  return [wx, wy, localZ];
}

/**
 * Renderiza un pétalo u hoja 3D/2D individual con espesor, sombreado de 4 tonos y nervaduras vectoriales
 */
export function renderPetal({
  cx = 0,
  cy = 0,
  z = 0,
  angleDeg = 0,
  radiusOffset = 6,
  length = 44,
  width = 20,
  thickness = 2.4,
  tiltDeg = 24,
  curl = 5,
  sharpness = 0.6,
  veins = true,
  P,
  color = "petal",
  palette = "botanical",
  tone = "hi",
  layer = "main"
}) {
  const is2D = P?.mode === "2d";
  const effTilt = is2D ? 4 : tiltDeg;
  const effCurl = is2D ? 0.5 : curl;
  const effThickness = is2D ? 0.8 : thickness;

  const localContour = createPetalContour({ length, width, sharpness, steps: 18 });

  // Proyectamos el contorno al plano X-Y con su altura Z media para extrusión limpia,
  // o construimos directamente la malla 3D superior e inferior del pétalo curvado
  const top3D = localContour.map((pt) =>
    transformPetalPoint(pt, { cx, cy, z: z + effThickness, angleDeg, radiusOffset, length, tiltDeg: effTilt, curl: effCurl })
  );
  const bot3D = localContour.map((pt) =>
    transformPetalPoint(pt, { cx, cy, z, angleDeg, radiusOffset, length, tiltDeg: effTilt, curl: effCurl })
  );

  const top2D = top3D.map((pt) => k.iso(pt, P));
  const bot2D = bot3D.map((pt) => k.iso(pt, P));

  // Construir facetas laterales visibles entre top2D y bot2D
  const count = localContour.length;
  const buckets = [[], [], [], []];
  const sideParts = [];
  const { sinA, cosA } = k.cameraOf(P);
  const [vx, vy] = k.towardViewer(P);
  const [lx, ly] = [-sinA, cosA];

  for (let i = 0; i < count; i++) {
    const next = (i + 1) % count;
    const p0 = top3D[i];
    const p1 = top3D[next];
    const dx = p1[0] - p0[0];
    const dy = p1[1] - p0[1];
    const len = Math.hypot(dx, dy) || 1;
    const nx = dy / len;
    const ny = -dx / len;

    if (nx * vx + ny * vy > -0.15) {
      const lit = (nx * lx + ny * ly + 1) / 2;
      const shade = Math.min(3, Math.max(0, Math.floor(lit * 4)));
      const quad = k.pathOf([top2D[i], top2D[next], bot2D[next], bot2D[i]], true);
      buckets[shade].push(quad);
      sideParts.push(quad);
    }
  }

  const topPath = k.pathOf(top2D, true);
  const fillPath = sideParts.join("") + topPath;

  // Nervadura central (midrib) y venas secundarias
  const veinPaths = [];
  if (veins) {
    const midribPts = [];
    for (let s = 0; s <= 10; s++) {
      const u = (s / 10) * (length * 0.88);
      const pt3 = transformPetalPoint([u, 0], {
        cx,
        cy,
        z: z + effThickness + 0.2,
        angleDeg,
        radiusOffset,
        length,
        tiltDeg: effTilt,
        curl: effCurl
      });
      midribPts.push(k.iso(pt3, P));
    }
    veinPaths.push(k.lineSvg(k.pathOf(midribPts), { tone: "lo" }));

    // 3 pares de venas laterales finas
    for (const frac of [0.28, 0.5, 0.7]) {
      const u0 = frac * length;
      const u1 = (frac + 0.14) * length;
      const wSpan = (width * 0.34) * Math.sin(frac * Math.PI);
      for (const side of [-1, 1]) {
        const pStart = k.iso(
          transformPetalPoint([u0, 0], { cx, cy, z: z + effThickness + 0.2, angleDeg, radiusOffset, length, tiltDeg: effTilt, curl: effCurl }),
          P
        );
        const pMid = k.iso(
          transformPetalPoint([(u0 + u1) / 2, side * wSpan * 0.6], {
            cx,
            cy,
            z: z + effThickness + 0.2,
            angleDeg,
            radiusOffset,
            length,
            tiltDeg: effTilt,
            curl: effCurl
          }),
          P
        );
        const pEnd = k.iso(
          transformPetalPoint([u1, side * wSpan], {
            cx,
            cy,
            z: z + effThickness + 0.2,
            angleDeg,
            radiusOffset,
            length,
            tiltDeg: effTilt,
            curl: effCurl
          }),
          P
        );
        veinPaths.push(k.lineSvg(k.pathOf([pStart, pMid, pEnd]), { tone: "faint" }));
      }
    }
  }

  const solidPaths = {
    fill: fillPath,
    outline: topPath,
    crease: k.pathOf(bot2D.slice(0, Math.floor(count / 2))),
    top: topPath,
    shades: buckets.map((b) => b.join(""))
  };

  // Centroide 3D para ordenamiento por profundidad (Z-sorting del pintor)
  const center3D = transformPetalPoint([length * 0.45, 0], {
    cx,
    cy,
    z: z + effThickness / 2,
    angleDeg,
    radiusOffset,
    length,
    tiltDeg: effTilt,
    curl: effCurl
  });

  return {
    depth: k.depthOf(center3D, P),
    svg: k.solidSvg(solidPaths, {
      tone,
      crease: "lo",
      color,
      palette,
      layer,
      inner: veinPaths.join("")
    })
  };
}

/**
 * Genera una corona circular completa de pétalos u hojas ordenada de atrás hacia adelante
 */
export function renderPetalRing({
  cx = 0,
  cy = 0,
  z = 0,
  count = 8,
  angleOffset = 0,
  radiusOffset = 6,
  length = 44,
  width = 20,
  thickness = 2.4,
  tiltDeg = 24,
  curl = 5,
  sharpness = 0.6,
  veins = true,
  P,
  color = "petal",
  palette = "botanical",
  tone = "hi",
  layer = "main"
}) {
  const items = [];
  for (let i = 0; i < count; i++) {
    const angleDeg = angleOffset + (i * 360) / count;
    items.push(
      renderPetal({
        cx,
        cy,
        z,
        angleDeg,
        radiusOffset,
        length,
        width,
        thickness,
        tiltDeg,
        curl,
        sharpness,
        veins,
        P,
        color,
        palette,
        tone,
        layer
      })
    );
  }
  items.sort((a, b) => a.depth - b.depth);
  return `<g class="iso-petal-ring" data-layer="${layer}">${items.map((item) => item.svg).join("")}</g>`;
}

/**
 * Interpola una curva suave 3D (Catmull-Rom) y la renderiza como un tallo o tubo orgánico con volumen
 */
export function renderCurvedStem({
  points = [
    [0, 0, 0],
    [0, 0, 60]
  ],
  radiusBottom = 4.2,
  radiusTop = 2.6,
  steps = 28,
  P,
  color = "stem",
  palette = "botanical",
  layer = "base"
}) {
  if (points.length < 2) return "";

  // Interpolación suave entre puntos de control
  const samplePoint = (t) => {
    const scaled = t * (points.length - 1);
    const idx = Math.min(points.length - 2, Math.max(0, Math.floor(scaled)));
    const frac = scaled - idx;
    const p0 = points[Math.max(0, idx - 1)];
    const p1 = points[idx];
    const p2 = points[idx + 1];
    const p3 = points[Math.min(points.length - 1, idx + 2)];

    const f2 = frac * frac;
    const f3 = f2 * frac;
    const catmull = (v0, v1, v2, v3) =>
      0.5 * (2 * v1 + (-v0 + v2) * frac + (2 * v0 - 5 * v1 + 4 * v2 - v3) * f2 + (-v0 + 3 * v1 - 3 * v2 + v3) * f3);

    return [
      catmull(p0[0], p1[0], p2[0], p3[0]),
      catmull(p0[1], p1[1], p2[1], p3[1]),
      catmull(p0[2], p1[2], p2[2], p3[2])
    ];
  };

  const { k: scaleK } = k.cameraOf(P);
  const sampled2D = [];
  const radii = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const pt3 = samplePoint(t);
    sampled2D.push(k.iso(pt3, P));
    radii.push((radiusBottom + (radiusTop - radiusBottom) * t) * scaleK);
  }

  const leftEdge = [];
  const rightEdge = [];
  const centerLine = [];

  for (let i = 0; i <= steps; i++) {
    const prev = sampled2D[Math.max(0, i - 1)];
    const next = sampled2D[Math.min(steps, i + 1)];
    const dx = next[0] - prev[0];
    const dy = next[1] - prev[1];
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const r = radii[i];
    const [px, py] = sampled2D[i];
    leftEdge.push([px + nx * r, py + ny * r]);
    rightEdge.push([px - nx * r, py - ny * r]);
    centerLine.push([px + nx * r * 0.28, py + ny * r * 0.28]);
  }

  const outlinePoints = [...leftEdge, ...[...rightEdge].reverse()];
  const bodyPath = k.pathOf(outlinePoints, true);
  const edgePath = k.pathOf(leftEdge) + k.pathOf(rightEdge);
  const shinePath = k.pathOf(centerLine);

  const solidPaths = {
    fill: bodyPath,
    outline: edgePath,
    crease: shinePath,
    top: k.pathOf([...leftEdge, ...[...centerLine].reverse()], true),
    shades: [
      k.pathOf([...centerLine, ...[...rightEdge].reverse()], true),
      bodyPath,
      "",
      ""
    ]
  };

  return k.solidSvg(solidPaths, {
    tone: "hi",
    crease: "lo",
    color,
    palette,
    layer
  });
}

/**
 * Extruye cualquier polígono personalizado 2D (estrella, cristal, escudo, gota) en 3D o 2D
 */
export function extrudeCustomPolygon(points2D, z, height, P, { color = "primary", palette = "vibrant", bevel = 0.8, tone = "hi", layer = "main" } = {}) {
  const paths = k.extrude(points2D, z, height, P, { convex: false, bevel });
  return k.solidSvg(paths, { tone, color, palette, layer });
}
