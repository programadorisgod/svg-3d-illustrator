/**
 * Motor 3D vectorial a SVG
 * Soporta rotaciones 3D (Euler X/Y/Z), cálculo de normales, iluminación direccional,
 * algoritmo del pintor (Z-sorting) y proyección de perspectiva u ortográfica a SVG limpio.
 */

// Operaciones vectoriales básicas
export function vec3Sub(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

export function vec3Add(a, b) {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

export function vec3Cross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

export function vec3Dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

export function vec3Normalize(v) {
  const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  if (len === 0) return [0, 0, 0];
  return [v[0] / len, v[1] / len, v[2] / len];
}

/**
 * Rota un vértice 3D [x, y, z] por los ángulos rotX, rotY, rotZ (en grados)
 */
export function rotateVertex(v, rxDeg, ryDeg, rzDeg) {
  const radX = (rxDeg * Math.PI) / 180;
  const radY = (ryDeg * Math.PI) / 180;
  const radZ = (rzDeg * Math.PI) / 180;

  let [x, y, z] = v;

  // Rotación en X
  const y1 = y * Math.cos(radX) - z * Math.sin(radX);
  const z1 = y * Math.sin(radX) + z * Math.cos(radX);
  y = y1;
  z = z1;

  // Rotación en Y
  const x2 = x * Math.cos(radY) + z * Math.sin(radY);
  const z2 = -x * Math.sin(radY) + z * Math.cos(radY);
  x = x2;
  z = z2;

  // Rotación en Z
  const x3 = x * Math.cos(radZ) - y * Math.sin(radZ);
  const y3 = x * Math.sin(radZ) + y * Math.cos(radZ);
  x = x3;
  y = y3;

  return [x, y, z];
}

/**
 * Ajusta brillo de un color HEX según factor de iluminación (0.0 a 1.0)
 */
export function shadeColor(hex, factor) {
  // Asegura formato #RRGGBB
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  // Mezcla con sombra (si factor < 0.5) o con luz blanca (si factor > 0.5)
  let nr, ng, nb;
  if (factor <= 0.5) {
    const t = factor / 0.5;
    nr = Math.round(r * t);
    ng = Math.round(g * t);
    nb = Math.round(b * t);
  } else {
    const t = (factor - 0.5) / 0.5;
    nr = Math.round(r + (255 - r) * t * 0.4);
    ng = Math.round(g + (255 - g) * t * 0.4);
    nb = Math.round(b + (255 - b) * t * 0.4);
  }

  const toHex = c => Math.min(255, Math.max(0, c)).toString(16).padStart(2, '0');
  return `#${toHex(nr)}${toHex(ng)}${toHex(nb)}`;
}

/**
 * Malla 3D de un Cubo / Prisma
 */
export function createBoxMesh(width = 100, depth = 100, height = 100) {
  const hw = width / 2;
  const hd = depth / 2;
  const hh = height / 2;

  const vertices = [
    [-hw, -hd, -hh], // 0
    [ hw, -hd, -hh], // 1
    [ hw,  hd, -hh], // 2
    [-hw,  hd, -hh], // 3
    [-hw, -hd,  hh], // 4
    [ hw, -hd,  hh], // 5
    [ hw,  hd,  hh], // 6
    [-hw,  hd,  hh], // 7
  ];

  const faces = [
    { indices: [4, 5, 6, 7], name: 'top' },    // +Z
    { indices: [0, 3, 2, 1], name: 'bottom' }, // -Z
    { indices: [0, 1, 5, 4], name: 'front' },  // -Y
    { indices: [2, 3, 7, 6], name: 'back' },   // +Y
    { indices: [0, 4, 7, 3], name: 'left' },   // -X
    { indices: [1, 2, 6, 5], name: 'right' },  // +X
  ];

  return { vertices, faces };
}

/**
 * Malla 3D de un Cilindro paramétrico
 */
export function createCylinderMesh(radius = 50, height = 80, segments = 16) {
  const vertices = [];
  const faces = [];
  const hh = height / 2;

  // Vértices inferiores y superiores
  for (let i = 0; i < segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    const x = Math.cos(theta) * radius;
    const y = Math.sin(theta) * radius;
    vertices.push([x, y, -hh]); // base
    vertices.push([x, y,  hh]); // top
  }

  // Caras laterales
  for (let i = 0; i < segments; i++) {
    const next = (i + 1) % segments;
    const b0 = i * 2;
    const t0 = i * 2 + 1;
    const b1 = next * 2;
    const t1 = next * 2 + 1;
    faces.push({ indices: [b0, b1, t1, t0], name: `side_${i}` });
  }

  // Tapa superior
  const topIndices = [];
  for (let i = 0; i < segments; i++) {
    topIndices.push(i * 2 + 1);
  }
  faces.push({ indices: topIndices, name: 'top' });

  // Tapa inferior
  const bottomIndices = [];
  for (let i = segments - 1; i >= 0; i--) {
    bottomIndices.push(i * 2);
  }
  faces.push({ indices: bottomIndices, name: 'bottom' });

  return { vertices, faces };
}

/**
 * Renderiza una malla 3D completa a elementos SVG ordenados por profundidad
 */
export function render3DMeshToSvg({
  mesh,
  rotation = { x: -25, y: 35, z: 0 },
  origin = { x: 400, y: 300 },
  scale = 1.5,
  camera = 'perspective', // 'orthographic' o 'perspective'
  fov = 400,
  baseColor = '#6366f1',
  stroke = 'rgba(255, 255, 255, 0.2)',
  strokeWidth = 1,
  lightDirection = [0.4, -0.6, 1.0], // Dirección de la luz
  ambient = 0.25,
}) {
  const normLight = vec3Normalize(lightDirection);

  // 1. Rotar todos los vértices
  const rotatedVerts = mesh.vertices.map(v => 
    rotateVertex(v, rotation.x, rotation.y, rotation.z)
  );

  // 2. Procesar cada cara
  const processedFaces = [];

  for (const face of mesh.faces) {
    const faceVerts = face.indices.map(i => rotatedVerts[i]);
    if (faceVerts.length < 3) continue;

    // Calcular normal en espacio de cámara (usando primeros 3 vértices)
    const e1 = vec3Sub(faceVerts[1], faceVerts[0]);
    const e2 = vec3Sub(faceVerts[2], faceVerts[0]);
    const normal = vec3Normalize(vec3Cross(e1, e2));

    // Backface culling en espacio de cámara (si normal.z <= 0, mira hacia atrás)
    if (normal[2] <= 0) continue;

    // Calcular profundidad promedio Z para el algoritmo del pintor
    const avgZ = faceVerts.reduce((sum, v) => sum + v[2], 0) / faceVerts.length;

    // Calcular iluminación direccional: dot(normal, light)
    const dot = Math.max(0, vec3Dot(normal, normLight));
    const intensity = Math.min(1, Math.max(0, ambient + (1 - ambient) * dot));
    const faceColor = shadeColor(baseColor, intensity);

    // Proyectar vértices a pantalla 2D
    const projectedPts = faceVerts.map(v => {
      let sx, sy;
      if (camera === 'perspective') {
        const dist = fov / (fov + v[2]);
        sx = origin.x + v[0] * scale * dist;
        sy = origin.y - v[1] * scale * dist; // Invertir Y para coordenadas SVG estándar
      } else {
        sx = origin.x + v[0] * scale;
        sy = origin.y - v[1] * scale;
      }
      return { x: Number(sx.toFixed(2)), y: Number(sy.toFixed(2)) };
    });

    processedFaces.push({
      avgZ,
      faceColor,
      projectedPts,
      name: face.name
    });
  }

  // 3. Ordenar por profundidad (de más lejano/menor Z a más cercano/mayor Z)
  processedFaces.sort((a, b) => a.avgZ - b.avgZ);

  // 4. Generar polígonos SVG
  const strokeAttr = stroke ? `stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"` : '';
  const polygonsSvg = processedFaces.map(f => {
    const pointsStr = f.projectedPts.map(p => `${p.x},${p.y}`).join(' ');
    return `<polygon points="${pointsStr}" fill="${f.faceColor}" ${strokeAttr} data-face="${f.name}" />`;
  }).join('\n    ');

  return `
    <g class="mesh-3d" transform="translate(0, 0)">
      ${polygonsSvg}
    </g>
  `;
}
