import { ANIMATION_CSS } from "./animations.mjs";

export const AZIMUTH = 45;
export const ELEVATION = 30;
export const SHADES = 4;
const RADIANS = Math.PI / 180;
const UNIT = Math.sqrt(1.6);

/**
 * Paleta semántica por defecto para resolver nombres de tintes o colores HEX directos
 */
export const SEMANTIC_TINTS = {
  primary: "#6366f1",
  secondary: "#0ea5e9",
  accent: "#f43f5e",
  petal: "#fb7185",
  "petal-deep": "#e11d48",
  leaf: "#10b981",
  stem: "#059669",
  gold: "#f59e0b",
  copper: "#d97706",
  chassis: "#e2e8f0",
  panel: "#cbd5e1",
  pcb: "#10b981",
  wood: "#d97706",
  brass: "#eab308",
  cobalt: "#3b82f6",
  violet: "#8b5cf6",
  cyan: "#06b6d4",
  emerald: "#10b981",
  rose: "#f43f5e",
  amber: "#f59e0b",
  slate: "#64748b"
};

/**
 * Paletas completas para re-colorear modelos enteros
 */
export const COLOR_PALETTES = {
  vibrant: {
    ...SEMANTIC_TINTS
  },
  botanical: {
    ...SEMANTIC_TINTS,
    primary: "#f43f5e",
    secondary: "#10b981",
    accent: "#f59e0b",
    petal: "#fb7185",
    "petal-deep": "#e11d48",
    leaf: "#10b981",
    stem: "#059669",
    gold: "#fbbf24",
    chassis: "#ffe4e6",
    panel: "#d1fae5"
  },
  "cyber-neon": {
    ...SEMANTIC_TINTS,
    primary: "#06b6d4",
    secondary: "#8b5cf6",
    accent: "#f43f5e",
    petal: "#22d3ee",
    "petal-deep": "#a855f7",
    leaf: "#10b981",
    stem: "#0891b2",
    gold: "#facc15",
    copper: "#f97316",
    chassis: "#38bdf8",
    panel: "#818cf8",
    pcb: "#14b8a6"
  },
  "warm-craft": {
    ...SEMANTIC_TINTS,
    primary: "#d97706",
    secondary: "#b45309",
    accent: "#dc2626",
    petal: "#fb923c",
    "petal-deep": "#ea580c",
    leaf: "#65a30d",
    stem: "#4d7c0f",
    gold: "#eab308",
    copper: "#ea580c",
    chassis: "#fde68a",
    panel: "#fed7aa",
    wood: "#d97706",
    brass: "#eab308"
  },
  blueprint: {
    ...SEMANTIC_TINTS,
    primary: "#3b82f6",
    secondary: "#60a5fa",
    accent: "#38bdf8",
    petal: "#60a5fa",
    "petal-deep": "#2563eb",
    leaf: "#38bdf8",
    stem: "#0284c7",
    gold: "#facc15",
    copper: "#93c5fd",
    chassis: "#93c5fd",
    panel: "#bfdbfe",
    pcb: "#2563eb"
  },
  "gold-onyx": {
    ...SEMANTIC_TINTS,
    primary: "#eab308",
    secondary: "#ca8a04",
    accent: "#f59e0b",
    petal: "#fde047",
    "petal-deep": "#ca8a04",
    leaf: "#eab308",
    stem: "#a16207",
    gold: "#fef08a",
    copper: "#f59e0b",
    chassis: "#71717a",
    panel: "#a1a1aa",
    pcb: "#ca8a04"
  }
};

/**
 * Calcula analíticamente 4 tonos de sombra lateral, cara superior iluminada,
 * borde y pliegue a partir de cualquier color HEX (#RRGGBB).
 */
export function computeFourToneShades(colorInput, paletteName = "vibrant") {
  if (!colorInput) return null;
  const palette = COLOR_PALETTES[paletteName] || COLOR_PALETTES.vibrant;
  const hex = (palette[colorInput] || colorInput || "#6366f1").replace("#", "");
  const fullHex = hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex;
  if (!/^[0-9a-fA-F]{6}$/.test(fullHex)) return null;

  const r = parseInt(fullHex.slice(0, 2), 16);
  const g = parseInt(fullHex.slice(2, 4), 16);
  const b = parseInt(fullHex.slice(4, 6), 16);

  const mix = (tr, tg, tb, weight) => {
    const nr = Math.round(r * (1 - weight) + tr * weight);
    const ng = Math.round(g * (1 - weight) + tg * weight);
    const nb = Math.round(b * (1 - weight) + tb * weight);
    return `#${[nr, ng, nb].map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0")).join("")}`;
  };

  return {
    top: mix(255, 255, 255, 0.34),
    s3: mix(255, 255, 255, 0.14),
    s2: `#${fullHex.toLowerCase()}`,
    s1: mix(15, 23, 42, 0.18),
    s0: mix(15, 23, 42, 0.36),
    edge: mix(10, 12, 20, 0.58),
    crease: mix(255, 255, 255, 0.45)
  };
}

export function cameraOf({ scale, azimuth = AZIMUTH, elevation = ELEVATION, mode = "3d" }) {
  if (mode === "2d") {
    const a = (azimuth ?? 0) * RADIANS;
    return {
      sinA: Math.sin(a),
      cosA: Math.cos(a),
      sinE: 0.985,
      cosE: 0.14,
      k: scale * UNIT,
      mode: "2d"
    };
  }
  const a = azimuth * RADIANS;
  const e = elevation * RADIANS;
  return { sinA: Math.sin(a), cosA: Math.cos(a), sinE: Math.sin(e), cosE: Math.cos(e), k: scale * UNIT, mode: "3d" };
}

export function iso([x, y, z], projection) {
  const { origin } = projection;
  const { sinA, cosA, sinE, cosE, k } = cameraOf(projection);
  return [origin[0] + (x * sinA - y * cosA) * k, origin[1] + ((x * cosA + y * sinA) * sinE - z * cosE) * k];
}

export function towardViewer(projection) {
  const { sinA, cosA } = cameraOf(projection);
  return [cosA, sinA];
}

export function depthOf([x, y, z], projection) {
  const { sinA, cosA, sinE, cosE } = cameraOf(projection);
  return (x * cosA + y * sinA) * cosE + z * sinE;
}

const tenth = (value) => {
  const text = (Math.round(value * 10) / 10).toFixed(1).replace(/\.0$/, "");
  return text === "-0" ? "0" : text;
};

export function pathOf(points, closed = false) {
  if (!points.length)
    return "";
  return points.map(([x, y], at) => `${at ? "L" : "M"}${tenth(x)} ${tenth(y)}`).join("") + (closed ? "Z" : "");
}

export const joinPaths = (paths) => paths.filter(Boolean).join("");

export function roundedPlan({ x, y, w, d, r }, steps = 8) {
  const radius = Math.max(0, Math.min(r, w / 2, d / 2));
  const corners = [
    [x + w - radius, y + radius, -90],
    [x + w - radius, y + d - radius, 0],
    [x + radius, y + d - radius, 90],
    [x + radius, y + radius, 180],
  ];
  const out = [];
  for (const [cx, cy, start] of corners) {
    const count = radius > 0 ? steps : 0;
    for (let step = 0; step <= count; step++) {
      const angle = (start + (count ? (90 * step) / count : 45)) * RADIANS;
      out.push([cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)]);
    }
  }
  return out;
}

function signedArea(points) {
  let area = 0;
  for (let index = 0; index < points.length; index++) {
    const [ax, ay] = points[index];
    const [bx, by] = points[(index + 1) % points.length];
    area += ax * by - bx * ay;
  }
  return area / 2;
}

const oriented = (points) => (signedArea(points) < 0 ? [...points].reverse() : points);

function convexHull(points) {
  const sorted = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (sorted.length < 3)
    return sorted;
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower = [];
  for (const point of sorted) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], point) <= 0)
      lower.pop();
    lower.push(point);
  }
  const upper = [];
  for (let index = sorted.length - 1; index >= 0; index--) {
    const point = sorted[index];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], point) <= 0)
      upper.pop();
    upper.push(point);
  }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}

function runsOf(flags, want) {
  const count = flags.length;
  const runs = [];
  const start = flags.findIndex((flag, index) => flag !== flags[(index + count - 1) % count]);
  if (start < 0)
    return flags[0] === want ? [Array.from({ length: count + 1 }, (_, index) => index % count)] : [];
  let run = null;
  for (let step = 0; step < count; step++) {
    const index = (start + step) % count;
    if (flags[index] === want) {
      if (!run)
        run = [index];
      run.push((index + 1) % count);
    }
    else if (run) {
      runs.push(run);
      run = null;
    }
  }
  if (run)
    runs.push(run);
  return runs;
}

export function extrude(ring, z, height, projection, options = {}) {
  const is2D = projection?.mode === "2d";
  const effectiveHeight = is2D ? Math.min(height * 0.18, 2.2) : height;
  const convex = options.convex ?? true;
  const count = ring.length;
  const counter = signedArea(ring) > 0;
  const [vx, vy] = towardViewer(projection);
  const { sinA, cosA } = cameraOf(projection);
  const normals = ring.map(([ax, ay], index) => {
    const [bx, by] = ring[(index + 1) % count];
    const dx = bx - ax;
    const dy = by - ay;
    const length = Math.hypot(dx, dy) || 1;
    return (counter ? [dy / length, -dx / length] : [-dy / length, dx / length]);
  });
  const facing = normals.map(([nx, ny]) => nx * vx + ny * vy > 1e-9);
  const top = ring.map(([x, y]) => iso([x, y, z + effectiveHeight], projection));
  const bottom = ring.map(([x, y]) => iso([x, y, z], projection));
  const outline = [];
  const crease = [];
  for (const run of runsOf(facing, false))
    outline.push(pathOf(run.map((index) => top[index])));
  for (const run of runsOf(facing, true)) {
    crease.push(pathOf(run.map((index) => top[index])));
    if (effectiveHeight > 0)
      outline.push(pathOf(run.map((index) => bottom[index])));
  }
  if (effectiveHeight > 0) {
    for (let index = 0; index < count; index++) {
      if (facing[(index + count - 1) % count] !== facing[index])
        outline.push(pathOf([top[index], bottom[index]]));
    }
  }
  let fill;
  if (convex) {
    fill = pathOf(convexHull([...top, ...bottom]), true);
  }
  else {
    const parts = [pathOf(oriented(top), true), pathOf(oriented(bottom), true)];
    for (let index = 0; index < count; index++) {
      if (!facing[index])
        continue;
      const next = (index + 1) % count;
      parts.push(pathOf(oriented([top[index], top[next], bottom[next], bottom[index]]), true));
    }
    fill = parts.join("");
  }
  const buckets = Array.from({ length: SHADES }, () => []);
  if (effectiveHeight > 0) {
    const [lx, ly] = [-sinA, cosA];
    for (let index = 0; index < count; index++) {
      if (!facing[index])
        continue;
      const [nx, ny] = normals[index];
      const lit = (nx * lx + ny * ly + 1) / 2;
      const shade = Math.min(SHADES - 1, Math.max(0, Math.floor(lit * SHADES)));
      const next = (index + 1) % count;
      buckets[shade].push(pathOf(oriented([top[index], top[next], bottom[next], bottom[index]]), true));
    }
  }
  let bevel;
  if (options.bevel && options.bevel > 0) {
    const by = options.bevel;
    const inset = ring.map(([x, y], index) => {
      const [ax, ay] = normals[(index + count - 1) % count];
      const [bx, by2] = normals[index];
      const mx = ax + bx;
      const my = ay + by2;
      const length = Math.hypot(mx, my) || 1;
      return [x - (mx / length) * by, y - (my / length) * by];
    });
    const insetTop = inset.map(([x, y]) => iso([x, y, z + effectiveHeight], projection));
    bevel = runsOf(facing, true)
      .map((run) => pathOf([top[run[0]], ...run.slice(1, -1).map((index) => insetTop[index]), top[run[run.length - 1]]]))
      .join("");
  }
  return {
    fill,
    outline: outline.join(""),
    crease: crease.join(""),
    top: pathOf(oriented(top), true),
    shades: buckets.map((paths) => paths.join("")),
    bevel,
  };
}

export const ringOf = (plan, steps = 8) => roundedPlan(plan, steps);
export function slabOf(plan, z, height, projection, steps = 8, bevel = 0) {
  return extrude(ringOf(plan, steps), z, height, projection, { convex: true, bevel });
}
export function circleRing(cx, cy, radius, steps = 40) {
  return Array.from({ length: steps }, (_, step) => {
    const angle = (step / steps) * Math.PI * 2;
    return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
  });
}
export function cylinder(cx, cy, radius, z, height, projection, steps = 32, bevel = 0) {
  return extrude(circleRing(cx, cy, radius, steps), z, height, projection, { convex: true, bevel });
}
export const insetPlan = ({ x, y, w, d, r }, by) => ({ x: x + by, y: y + by, w: w - by * 2, d: d - by * 2, r: Math.max(0, r - by) });
export function onTop(points, z, projection, closed = false) {
  return pathOf(points.map(([x, y]) => iso([x, y, z], projection)), closed);
}
export const planOutline = (plan, z, projection, steps = 8) => onTop(ringOf(plan, steps), z, projection, true);
export const lineOnTop = (from, to, z, projection) => onTop([from, to], z, projection);
export const segment = (from, to, projection) => pathOf([iso(from, projection), iso(to, projection)]);
export const rise = (at, from, to, projection) => segment([at[0], at[1], from], [at[0], at[1], to], projection);
export const ring = (cx, cy, radius, z, projection, steps = 40) => onTop(circleRing(cx, cy, radius, steps), z, projection, true);
export const pointsAt = (points, projection) => points.map((point) => iso(point, projection));
export function dotGrid(x, y, columns, rows, gap, z, projection) {
  const dots = [];
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++)
      dots.push(iso([x + column * gap, y + row * gap, z], projection));
  }
  return dots;
}
export function corners({ x, y, w, d }, inset = 0) {
  return [
    [x + inset, y + inset],
    [x + w - inset, y + inset],
    [x + inset, y + d - inset],
    [x + w - inset, y + d - inset],
  ];
}
export function boxCorners({ x, y, w, d }, z0, z1) {
  const out = [];
  for (const px of [x, x + w])
    for (const py of [y, y + d])
      for (const z of [z0, z1])
        out.push([px, py, z]);
  return out;
}
export function knurl(cx, cy, radius, z0, z1, count, projection, inset = 0.4) {
  const [vx, vy] = towardViewer(projection);
  const lines = [];
  for (let index = 0; index < count; index++) {
    const angle = (index / count) * Math.PI * 2;
    const nx = Math.cos(angle);
    const ny = Math.sin(angle);
    if (nx * vx + ny * vy < 0.15)
      continue;
    lines.push(segment([cx + radius * nx, cy + radius * ny, z0 + inset], [cx + radius * nx, cy + radius * ny, z1 - inset], projection));
  }
  return lines.join("");
}
export function sideArc(cx, cy, radius, z, projection, steps = 24) {
  const [vx, vy] = towardViewer(projection);
  const facing = Math.atan2(vy, vx);
  const points = [];
  for (let step = 0; step <= steps; step++) {
    const angle = facing - Math.PI / 2 + (step / steps) * Math.PI;
    points.push(iso([cx + radius * Math.cos(angle), cy + radius * Math.sin(angle), z], projection));
  }
  return pathOf(points);
}
export function ringSeam(ring, z, projection) {
  const count = ring.length;
  const counter = signedArea(ring) > 0;
  const [vx, vy] = towardViewer(projection);
  const facing = ring.map(([ax, ay], index) => {
    const [bx, by] = ring[(index + 1) % count];
    const dx = bx - ax;
    const dy = by - ay;
    const [nx, ny] = counter ? [dy, -dx] : [-dy, dx];
    return nx * vx + ny * vy > 1e-9;
  });
  return runsOf(facing, true).map((run) => pathOf(run.map((index) => iso([ring[index][0], ring[index][1], z], projection)))).join("");
}
export const sideSeam = (plan, z, projection, steps = 8) => ringSeam(ringOf(plan, steps), z, projection);
export function sideRing(center, radius, axis, projection, steps = 20) {
  const [px, py, pz] = center;
  const points = [];
  for (let step = 0; step < steps; step++) {
    const angle = (step / steps) * Math.PI * 2;
    const u = radius * Math.cos(angle);
    const v = radius * Math.sin(angle);
    points.push(iso(axis === "x" ? [px, py + u, pz + v] : [px + u, py, pz + v], projection));
  }
  return pathOf(points, true);
}
export function coil(from, to, center, radius, turns, axis, projection, perTurn = 16) {
  const count = Math.max(1, Math.round(turns * perTurn));
  const back = [];
  const front = [];
  let run = [];
  let near = null;
  for (let index = 0; index <= count; index++) {
    const share = index / count;
    const angle = share * turns * Math.PI * 2;
    const u = radius * Math.cos(angle);
    const v = radius * Math.sin(angle);
    const along = from + (to - from) * share;
    const point = axis === "x" ? [along, center[0] + u, center[1] + v] : [center[0] + u, along, center[1] + v];
    const normal = axis === "x" ? [0, Math.cos(angle), Math.sin(angle)] : [Math.cos(angle), 0, Math.sin(angle)];
    const facing = depthOf(normal, projection) > 0;
    const flat = iso(point, projection);
    if (near === null)
      near = facing;
    if (facing !== near) {
      run.push(flat);
      (near ? front : back).push(pathOf(run));
      run = [flat];
      near = facing;
      continue;
    }
    run.push(flat);
  }
  if (run.length > 1)
    (near ? front : back).push(pathOf(run));
  return { back: back.join(""), front: front.join("") };
}
export function topTicks(from, to, step, every, edge, z, lengths, projection, axis = "x") {
  const minor = [];
  const major = [];
  const first = Math.ceil(from / step) * step;
  for (let at = first, index = Math.round(first / step); at <= to + 1e-9; at += step, index++) {
    const big = index % every === 0;
    const length = big ? lengths[1] : lengths[0];
    const a = axis === "x" ? [at, edge] : [edge, at];
    const b = axis === "x" ? [at, edge + length] : [edge + length, at];
    (big ? major : minor).push(lineOnTop(a, b, z, projection));
  }
  return { minor: minor.join(""), major: major.join("") };
}
export function sideTicks(from, to, step, every, face, top, lengths, projection, axis = "x") {
  const minor = [];
  const major = [];
  const first = Math.ceil(from / step) * step;
  for (let at = first, index = Math.round(first / step); at <= to + 1e-9; at += step, index++) {
    const big = index % every === 0;
    const length = big ? lengths[1] : lengths[0];
    const a = axis === "x" ? [at, face, top] : [face, at, top];
    const b = axis === "x" ? [at, face, top - length] : [face, at, top - length];
    (big ? major : minor).push(segment(a, b, projection));
  }
  return { minor: minor.join(""), major: major.join("") };
}
export function radialTicks(cx, cy, radius, count, every, z, lengths, projection, from = 0, span = Math.PI * 2) {
  const minor = [];
  const major = [];
  const closed = Math.abs(span - Math.PI * 2) < 1e-9;
  const steps = closed ? count : count + 1;
  for (let index = 0; index < steps; index++) {
    const angle = from + (index / count) * span;
    const big = index % every === 0;
    const inner = radius - (big ? lengths[1] : lengths[0]);
    const sx = Math.sin(angle);
    const sy = -Math.cos(angle);
    (big ? major : minor).push(lineOnTop([cx + sx * inner, cy + sy * inner], [cx + sx * radius, cy + sy * radius], z, projection));
  }
  return { minor: minor.join(""), major: major.join("") };
}
export const haloOf = (plan, z, height, projection) => slabOf(plan, z, height, projection).fill;
export function axisVector(projection, [dx, dy, dz]) {
  const origin = iso([0, 0, 0], projection);
  const moved = iso([dx, dy, dz], projection);
  return [moved[0] - origin[0], moved[1] - origin[1]];
}
const fine = (value) => Math.round(value * 100) / 100;
export function translateAlong(projection, by) {
  const [x, y] = axisVector(projection, by);
  return `translate(${fine(x)} ${fine(y)})`;
}
const thousandth = (value) => Math.round(value * 1000) / 1000;
function axesAt(at, z, projection) {
  const origin = iso([at[0], at[1], z], projection);
  const along = (point) => {
    const [px, py] = iso(point, projection);
    return [px - origin[0], py - origin[1]];
  };
  return { origin, x: along([at[0] + 1, at[1], z]), y: along([at[0], at[1] + 1, z]), z: along([at[0], at[1], z + 1]) };
}
const matrixOf = (u, v, origin) => `matrix(${thousandth(u[0])} ${thousandth(u[1])} ${thousandth(v[0])} ${thousandth(v[1])} ${thousandth(origin[0])} ${thousandth(origin[1])})`;
export function holdStill(element, [dx, dy]) {
  const text = dx || dy ? `translate(${-dx} ${-dy})` : "";
  element.querySelectorAll("[data-hold]").forEach((node) => (text ? node.setAttribute("transform", text) : node.removeAttribute("transform")));
}
export function topMatrix(at, z, projection, along = "x") {
  const { origin, x, y } = axesAt(at, z, projection);
  return along === "x" ? matrixOf(x, y, origin) : matrixOf([-y[0], -y[1]], x, origin);
}
export function sideMatrix(at, z, projection, face) {
  const { origin, x, y, z: up } = axesAt(at, z, projection);
  const down = [-up[0], -up[1]];
  return face === "left" ? matrixOf(x, down, origin) : matrixOf([-y[0], -y[1]], down, origin);
}
export function screenRise(height, projection) {
  const { cosE, k } = cameraOf(projection);
  return height * cosE * k;
}
export function fitProjection(points, width, height, { pad = 24, headroom = 0, azimuth = AZIMUTH, elevation = ELEVATION, mode = "3d", palette = "vibrant" } = {}) {
  const unit = { origin: [0, 0], scale: 1, azimuth: mode === "2d" ? 0 : azimuth, elevation: mode === "2d" ? 88 : elevation, mode };
  const flat = points.map((point) => iso(point, unit));
  const xs = flat.map(([x]) => x);
  const ys = flat.map(([, y]) => y);
  const left = Math.min(...xs);
  const right = Math.max(...xs);
  const up = Math.min(...ys);
  const down = Math.max(...ys);
  const scale = Math.min((width - pad * 2) / ((right - left) || 1), (height - pad * 2 - headroom) / ((down - up) || 1));
  return {
    origin: [width / 2 - ((left + right) / 2) * scale, headroom + (height - headroom) / 2 - ((up + down) / 2) * scale],
    scale,
    azimuth: unit.azimuth,
    elevation: unit.elevation,
    mode,
    palette
  };
}

const escape = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const attrs = (pairs) => Object.entries(pairs)
  .filter(([, value]) => value !== undefined && value !== false)
  .map(([key, value]) => ` ${key}="${escape(String(value))}"`)
  .join("");

export function solidSvg(paths, { tone = "hi", crease = "faint", halo = false, lit = false, flat = false, className, inner = "", color, palette = "vibrant", layer } = {}) {
  const parts = [];
  if (halo)
    parts.push(`<path class="iso-halo" d="${paths.fill}"/>`);
  parts.push(`<path class="iso-fill" d="${paths.fill}"/>`);
  if (!flat) {
    paths.shades.forEach((d, shade) => {
      if (d)
        parts.push(`<path class="iso-shade" data-shade="${shade}" d="${d}"/>`);
    });
    parts.push(`<path class="iso-top" d="${paths.top}"/>`);
  }
  if (crease !== "none" && paths.crease)
    parts.push(`<path class="iso-line iso-crease" data-tone="${crease}" d="${paths.crease}"/>`);
  if (crease !== "none" && paths.bevel)
    parts.push(`<path class="iso-line iso-bevel" data-tone="${crease}" d="${paths.bevel}"/>`);
  if (inner)
    parts.push(inner);
  parts.push(`<path class="iso-line iso-edge" data-tone="${tone}" d="${paths.outline}"/>`);

  const shades = color ? computeFourToneShades(color, palette) : null;
  const styleStr = shades
    ? `--c-top:${shades.top};--c-s0:${shades.s0};--c-s1:${shades.s1};--c-s2:${shades.s2};--c-s3:${shades.s3};--c-edge:${shades.edge};--c-crease:${shades.crease}`
    : undefined;

  return `<g${attrs({
    class: className ? `iso-solid ${className}` : "iso-solid",
    "data-lit": lit ? "" : undefined,
    "data-seamless": paths.seamless ? "" : undefined,
    "data-has-color": shades ? "" : undefined,
    "data-tint": color || undefined,
    "data-layer": layer || undefined,
    style: styleStr
  })}>${parts.join("")}</g>`;
}

export function lineSvg(d, { tone = "lo", dotted = false, dashed = false, flow = false, className, free, color, palette = "vibrant" } = {}) {
  if (!d)
    return "";
  const shades = color ? computeFourToneShades(color, palette) : null;
  return `<path${attrs({
    class: className ? `iso-line ${className}` : "iso-line",
    "data-tone": tone,
    "data-free": free === true ? "" : free || undefined,
    "data-dotted": dotted ? "" : undefined,
    "data-dashed": dashed ? "" : undefined,
    "data-flow": flow ? "" : undefined,
    "data-color-stroke": shades ? "" : undefined,
    style: shades ? `--c-stroke:${shades.s2}` : undefined,
    d,
  })}/>`;
}

export function dotsSvg(points, { size = 0.5, tone = "mid", pulse = false } = {}) {
  const dots = points
    .map(([x, y, alpha], index) => `<circle cx="${tenth(x)}" cy="${tenth(y)}" r="${size}"${alpha !== undefined && alpha < 1 ? ` fill-opacity="${Math.max(0, alpha).toFixed(2)}"` : ""}${pulse ? ` data-pulse="" style="--pulse-at:${(index * 137) % 1600}ms"` : ""}/>`)
    .join("");
  return `<g class="iso-dots" data-tone="${tone}">${dots}</g>`;
}

export function fadedSvg(list, style = {}) {
  const groups = new Map();
  for (const entry of list) {
    const [d, alpha] = Array.isArray(entry) ? entry : [entry.d, entry.alpha];
    if (!d || !(alpha > 0.02))
      continue;
    const level = Math.min(1, Math.round(alpha * 20) / 20);
    groups.set(level, (groups.get(level) ?? "") + d);
  }
  return [...groups].map(([alpha, d]) => (alpha >= 1 ? lineSvg(d, style) : `<g opacity="${alpha.toFixed(2)}">${lineSvg(d, style)}</g>`)).join("");
}

export function fadeLineSvg(points, { fade = [0, 0], tone = "lo", className, stops = 6 } = {}) {
  if (points.length < 2)
    return "";
  const ease = (t) => t * t * (3 - 2 * t);
  const hashOf = (text) => {
    let hash = 2166136261;
    for (let index = 0; index < text.length; index++)
      hash = Math.imul(hash ^ text.charCodeAt(index), 16777619);
    return (hash >>> 0).toString(36);
  };
  const lengths = [0];
  for (let index = 1; index < points.length; index++)
    lengths.push(lengths[index - 1] + Math.hypot(points[index][0] - points[index - 1][0], points[index][1] - points[index - 1][1]));
  const at = (length) => {
    let index = 1;
    while (index < points.length - 1 && lengths[index] < length)
      index++;
    const span = lengths[index] - lengths[index - 1] || 1;
    const t = Math.max(0, Math.min(1, (length - lengths[index - 1]) / span));
    return [points[index - 1][0] + (points[index][0] - points[index - 1][0]) * t, points[index - 1][1] + (points[index][1] - points[index - 1][1]) * t];
  };
  const pieceOf = (from, to) => [at(from), ...points.filter((_, index) => lengths[index] > from + 1e-6 && lengths[index] < to - 1e-6), at(to)];
  const total = lengths[lengths.length - 1];
  if (total < 1e-6)
    return "";
  let [start, end] = Array.isArray(fade) ? fade : [fade, fade];
  if (start + end > total) {
    const share = total / (start + end);
    start *= share;
    end *= share;
  }
  const paint = `var(--anatomy-${tone})`;
  const ramp = (piece, rising) => {
    const d = pathOf(piece);
    const [x1, y1] = piece[0];
    const [x2, y2] = piece[piece.length - 1];
    const id = `iso-fade-${hashOf(`${d}|${tone}|${rising}`)}`;
    const marks = Array.from({ length: stops + 1 }, (_, index) => {
      const t = index / stops;
      const alpha = ease(rising ? t : 1 - t);
      return `<stop offset="${t.toFixed(3)}" stop-opacity="${alpha.toFixed(3)}" style="stop-color:${paint}"/>`;
    }).join("");
    const gradient = `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${tenth(x1)}" y1="${tenth(y1)}" x2="${tenth(x2)}" y2="${tenth(y2)}">${marks}</linearGradient>`;
    return `<defs>${gradient}</defs><path${attrs({ class: className ? `iso-line ${className}` : "iso-line", "data-tone": tone, "data-free": rising ? "start" : "end", d, style: `stroke:url(#${id})` })}/>`;
  };
  const parts = [];
  if (start > 0.05)
    parts.push(ramp(pieceOf(0, start), true));
  if (total - end - start > 0.05)
    parts.push(lineSvg(pathOf(pieceOf(start, total - end)), { tone, className }));
  if (end > 0.05)
    parts.push(ramp(pieceOf(total - end, total), false));
  return `<g class="iso-fade">${parts.join("")}</g>`;
}

export function wireSvg(from, to, { via = [], tone = "lo", dotted = false, dashed = false, flow = false, ends = "both", size = 1.2 } = {}) {
  const d = pathOf([from, ...via, to]);
  const end = ([x, y]) => `<circle class="iso-wire-end" cx="${tenth(x)}" cy="${tenth(y)}" r="${size}"/>`;
  return `<g class="iso-wire" data-tone="${tone}">${lineSvg(d, { tone, dotted, dashed, flow })}${ends === "both" || ends === "from" ? end(from) : ""}${ends === "both" || ends === "to" ? end(to) : ""}</g>`;
}

export function faceTextSvg(transform, text, { size = 3, tone = "mid", anchor = "start" } = {}) {
  return `<text class="iso-face-text" data-tone="${tone}" transform="${transform}" font-size="${size}" text-anchor="${anchor}">${escape(text)}</text>`;
}

export function groupSvg(children, extra = {}) {
  return `<g${attrs(extra)}>${Array.isArray(children) ? children.join("") : children}</g>`;
}

export function figureSvg({ width, height, label, body, standalone = false, className }) {
  const style = standalone ? `<style>${ISO_CSS}</style>` : "";
  return `<svg${attrs({
    xmlns: "http://www.w3.org/2000/svg",
    class: `iso-svg${standalone ? " iso" : ""}${className ? ` ${className}` : ""}`,
    "data-theme": standalone || undefined,
    viewBox: `0 0 ${width} ${height}`,
    role: "img",
    "aria-label": label,
  })}>${style}${Array.isArray(body) ? body.join("") : body}</svg>`;
}

/**
 * Empaqueta un modelo con soporte dual (Vista 3D Volumétrica + Vista 2D Plana),
 * Modo Color / Blanco y Negro (Monochrome), Paleta y Animación embebida.
 */
export function wrapDualModeSvg({
  width = 600,
  height = 440,
  theme = "light",
  mode = "3d", // '3d' o '2d'
  colorMode = "mono", // 'mono' (B&W) o 'color'
  palette = "vibrant",
  animate = "static",
  showPlate = true,
  label = "Vector Illustration",
  extraCss = "",
  view3d = "",
  view2d = ""
}) {
  return `<svg${attrs({
    xmlns: "http://www.w3.org/2000/svg",
    class: "iso-svg iso",
    "data-theme": theme,
    "data-mode": mode,
    "data-color-mode": colorMode,
    "data-palette": palette,
    "data-animate": animate,
    "data-plate": showPlate === false ? "hidden" : "visible",
    viewBox: `0 0 ${width} ${height}`,
    role: "img",
    "aria-label": label
  })}>
  <style>${ISO_CSS}${extraCss ? `\n${extraCss}` : ""}</style>
  <g class="iso-scene-root">
    <g class="iso-view-3d">${view3d}</g>
    ${view2d ? `<g class="iso-view-2d">${view2d}</g>` : ""}
  </g>
</svg>`;
}

function swatchSvg(mark) {
  if (mark === "raised" || mark === "flat" || mark === "lit") {
    const body = mark === "flat" ? "M2 6.5 8 3.5 14 6.5 8 9.5Z" : "M2 4.5 8 1.5 14 4.5 14 6 8 9 2 6Z";
    const crease = mark === "flat" ? "" : `<path class="iso-swatch-crease" d="M2 4.5 8 7.5 14 4.5"/>`;
    return `<svg class="iso-swatch" data-mark="${mark}" viewBox="0 0 16 10" aria-hidden="true"><path d="${body}"/>${crease}</svg>`;
  }
  return `<svg class="iso-swatch" data-mark="${mark}" viewBox="0 0 16 10" aria-hidden="true"><path d="M1.5 5h13"/></svg>`;
}

export function plateHtml({ fig, title, hint, readout = "", keys = [], caption, body }) {
  const corner = (name, text, extra = "") => `<span class="iso-plate-corner" data-corner="${name}"${extra}>${escape(text)}</span>`;
  const legend = keys.length || caption
    ? `<figcaption class="iso-legend">${keys.length ? `<span class="iso-keys">${keys.map((key) => `<span class="iso-key">${swatchSvg(key.mark)}${escape(key.label)}</span>`).join("")}</span>` : ""}${caption ? `<span class="iso-caption">${escape(caption)}</span>` : ""}</figcaption>`
    : "";
  return `<figure class="iso-figure"><div class="iso-plate"><div class="iso-plate-corners" aria-hidden="true">${corner("fig", fig)}${title ? corner("title", title) : ""}${hint ? corner("hint", hint) : ""}${corner("readout", readout, " data-readout")}</div>${body}</div>${legend}</figure>`;
}

export function pageHtml({ title, theme = "dark", body, script = "", width = 650 }) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(title)}</title><style>${ISO_CSS}${PAGE_CSS.replace("__WIDTH__", String(width))}</style></head><body class="iso" data-theme="${theme}"><main class="iso-page">${body}</main>${script ? `<script type="module">${script.replace(/<\/(script)/gi, "<\\/$1")}</script>` : ""}</body></html>`;
}

const PAGE_CSS = `
*{box-sizing:border-box}
html{color-scheme:dark}
body[data-theme="light"]{color-scheme:light}
body{margin:0;background:var(--anatomy-page);color:var(--anatomy-text);font:14px/1.6 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased}
.iso-page{width:min(__WIDTH__px,100% - 32px);margin:64px auto 96px}
`;

export const ISO_CSS = `
.iso{
  --anatomy-page:#0b0b0b;--anatomy-card:#131313;--anatomy-text:#a3a3a3;--anatomy-strong:#e6e6e6;--anatomy-muted:#6e6e6e;
  --anatomy-paper:#131313;--anatomy-face:#1b1b1b;--anatomy-top:#1c1c1c;
  --anatomy-shade-0:#0f0f0f;--anatomy-shade-1:#121212;--anatomy-shade-2:#151515;--anatomy-shade-3:#181818;
  --anatomy-lit-top:#262626;--anatomy-lit-shade:#1d1d1d;
  --anatomy-hi:#d4d4d4;--anatomy-mid:#6a6a6a;--anatomy-lo:#3e3e3e;--anatomy-faint:#2a2a2a;--anatomy-lit:#ffffff;
  --anatomy-halo:#050505;--anatomy-halo-opacity:.9;--anatomy-dot:#e6e6e6;
  --anatomy-red:#ff6b6b;--anatomy-green:#6be0a0;--anatomy-blue:#6b9bff;
  --anatomy-weight:.6px;--anatomy-ease:cubic-bezier(.32,.72,0,1);
  --anatomy-mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --anatomy-lift:inset 0 1px 0 0 #ffffff0a,inset 0 0 0 1px #ffffff06,0 0 0 1px #00000026,0 1px 1px -.5px #00000014,0 3px 3px -1.5px #00000014,0 6px 6px -3px #00000014,0 12px 12px -6px #00000014;
}
.iso[data-theme="light"]{
  --anatomy-page:#f2f2ef;--anatomy-card:#fbfbfa;--anatomy-text:#57575a;--anatomy-strong:#18181a;--anatomy-muted:#8c8c90;
  --anatomy-paper:#fbfbfa;--anatomy-face:#ffffff;--anatomy-top:#ffffff;
  --anatomy-shade-0:#dcdcd9;--anatomy-shade-1:#e5e5e2;--anatomy-shade-2:#ededea;--anatomy-shade-3:#f4f4f1;
  --anatomy-lit-top:#ffffff;--anatomy-lit-shade:#eeeeeb;
  --anatomy-hi:#26262a;--anatomy-mid:#8a8a8f;--anatomy-lo:#b4b4b8;--anatomy-faint:#d4d4d6;--anatomy-lit:#000000;
  --anatomy-halo:#8a8a80;--anatomy-halo-opacity:.32;--anatomy-dot:#3a3a3e;
  --anatomy-red:#e5484d;--anatomy-green:#30a46c;--anatomy-blue:#3e63dd;
  --anatomy-lift:inset 0 1px 0 0 #ffffff,0 0 0 1px #0000000f,0 1px 1px -.5px #0000000a,0 3px 3px -1.5px #0000000a,0 6px 6px -3px #0000000a,0 12px 12px -6px #0000000a;
}
.iso-svg{display:block;width:100%;height:auto;overflow:visible}
.iso-svg path,.iso-svg circle{vector-effect:non-scaling-stroke}
.iso-fill{fill:var(--anatomy-paper);stroke:none}
.iso-solid[data-lit]>.iso-fill{fill:var(--anatomy-face)}
.iso-shade,.iso-top{stroke:none}
.iso-shade[data-shade="0"]{fill:var(--anatomy-shade-0)}
.iso-shade[data-shade="1"]{fill:var(--anatomy-shade-1)}
.iso-shade[data-shade="2"]{fill:var(--anatomy-shade-2)}
.iso-shade[data-shade="3"]{fill:var(--anatomy-shade-3)}
.iso-top{fill:var(--anatomy-top)}
.iso-solid[data-lit]>.iso-top{fill:var(--anatomy-lit-top)}
.iso-solid[data-lit]>.iso-shade{fill:var(--anatomy-lit-shade)}
.iso[data-color-mode="color"] .iso-solid[data-has-color]>.iso-fill{fill:var(--c-s1,var(--anatomy-paper))}
.iso[data-color-mode="color"] .iso-solid[data-has-color]>.iso-top{fill:var(--c-top,var(--anatomy-top))}
.iso[data-color-mode="color"] .iso-solid[data-has-color]>.iso-shade[data-shade="0"]{fill:var(--c-s0,var(--anatomy-shade-0))}
.iso[data-color-mode="color"] .iso-solid[data-has-color]>.iso-shade[data-shade="1"]{fill:var(--c-s1,var(--anatomy-shade-1))}
.iso[data-color-mode="color"] .iso-solid[data-has-color]>.iso-shade[data-shade="2"]{fill:var(--c-s2,var(--anatomy-shade-2))}
.iso[data-color-mode="color"] .iso-solid[data-has-color]>.iso-shade[data-shade="3"]{fill:var(--c-s3,var(--anatomy-shade-3))}
.iso[data-color-mode="color"] .iso-solid[data-has-color]>.iso-edge{stroke:var(--c-edge,var(--anatomy-hi))}
.iso[data-color-mode="color"] .iso-solid[data-has-color]>.iso-crease,
.iso[data-color-mode="color"] .iso-solid[data-has-color]>.iso-bevel{stroke:var(--c-crease,var(--anatomy-lo))}
.iso[data-color-mode="color"] .iso-line[data-color-stroke]{stroke:var(--c-stroke,var(--anatomy-hi))}
.iso[data-color-mode="color"] .iso-flat-shape[data-has-color]{fill:var(--c-top,var(--anatomy-top));stroke:var(--c-edge,var(--anatomy-hi))}
.iso:not([data-color-mode="color"]) .iso-flat-shape{fill:var(--anatomy-top);stroke:var(--anatomy-hi)}
.iso-svg[data-mode="2d"] .iso-view-3d{display:none!important}
.iso-svg:not([data-mode="2d"]) .iso-view-2d{display:none!important}
.iso-svg[data-plate="hidden"] .iso-base-plate{display:none!important}
.iso-solid[data-seamless]>.iso-shade,.iso-solid[data-seamless]>.iso-top{stroke-width:.4;stroke-linejoin:round}
.iso-solid[data-seamless]>.iso-shade[data-shade="0"]{stroke:var(--anatomy-shade-0)}
.iso-solid[data-seamless]>.iso-shade[data-shade="1"]{stroke:var(--anatomy-shade-1)}
.iso-solid[data-seamless]>.iso-shade[data-shade="2"]{stroke:var(--anatomy-shade-2)}
.iso-solid[data-seamless]>.iso-shade[data-shade="3"]{stroke:var(--anatomy-shade-3)}
.iso-solid[data-seamless]>.iso-top{stroke:var(--anatomy-top)}
.iso-solid[data-seamless][data-lit]>.iso-top{stroke:var(--anatomy-lit-top)}
.iso-solid[data-seamless][data-lit]>.iso-shade{stroke:var(--anatomy-lit-shade)}
.iso-solid[data-lit]>.iso-edge{stroke:var(--anatomy-lit)}
.iso-halo{fill:var(--anatomy-halo);stroke:none;filter:blur(9px);opacity:var(--anatomy-halo-opacity);transform:translateY(3px)}
.iso-line{fill:none;stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linecap:round;stroke-linejoin:round}
.iso-line[data-tone="hi"]{stroke:var(--anatomy-hi)}
.iso-line[data-tone="mid"]{stroke:var(--anatomy-mid)}
.iso-line[data-tone="lo"]{stroke:var(--anatomy-lo)}
.iso-line[data-tone="faint"]{stroke:var(--anatomy-faint)}
.iso-line[data-tone="lit"]{stroke:var(--anatomy-lit)}
.iso-line[data-tone="red"]{stroke:var(--anatomy-red)}
.iso-line[data-tone="green"]{stroke:var(--anatomy-green)}
.iso-line[data-tone="blue"]{stroke:var(--anatomy-blue)}
.iso-line[data-dotted]{stroke-dasharray:.01 3.5;stroke-width:1}
.iso-line[data-dashed]{stroke-dasharray:3 3}
.iso-line[data-flow]{stroke-dasharray:2 6}
.iso-wire-end{fill:var(--anatomy-paper);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight)}
.iso-wire[data-tone="hi"] .iso-wire-end{stroke:var(--anatomy-hi)}
.iso-wire[data-tone="mid"] .iso-wire-end{stroke:var(--anatomy-mid)}
.iso-wire[data-tone="faint"] .iso-wire-end{stroke:var(--anatomy-faint)}
.iso-wire[data-tone="lit"] .iso-wire-end{stroke:var(--anatomy-lit)}
.iso-dots circle{fill:var(--anatomy-dot);stroke:none;opacity:.32}
.iso-dots[data-tone="hi"] circle{opacity:.85}
.iso-dots[data-tone="mid"] circle{opacity:.45}
.iso-dots[data-tone="lo"] circle{opacity:.22}
.iso-dots[data-tone="faint"] circle{opacity:.12}
.iso-dots[data-tone="green"] circle{fill:var(--anatomy-green);opacity:.95}
.iso-dots[data-tone="blue"] circle{fill:var(--anatomy-blue);opacity:.95}
.iso-dots[data-tone="red"] circle{fill:var(--anatomy-red);opacity:.95}
.iso-face-text{fill:var(--anatomy-mid);font-family:var(--anatomy-mono);letter-spacing:.04em}
.iso-face-text[data-tone="hi"]{fill:var(--anatomy-hi)}
.iso-face-text[data-tone="lo"]{fill:var(--anatomy-lo)}
.iso-face-text[data-tone="faint"]{fill:var(--anatomy-faint)}
.tb-body{fill:var(--anatomy-shade-2);stroke:none}
.tb-shine{fill:var(--anatomy-top);stroke:none}
.tb-shade{fill:var(--anatomy-shade-0);stroke:none}
.tb-ring{fill:none;stroke:var(--anatomy-lo);stroke-width:.45;stroke-linecap:butt;stroke-linejoin:round}
.tb-ring[data-tone="mid"]{stroke:var(--anatomy-mid)}
.tb-ring[data-tone="faint"]{stroke:var(--anatomy-faint)}
.tb-ring[data-tone="hi"]{stroke:var(--anatomy-hi)}
@keyframes iso-flow{to{stroke-dashoffset:-32}}
@keyframes iso-pulse{0%,100%{opacity:.18}12%{opacity:1}40%{opacity:.18}}
.iso-line[data-flow]{animation:iso-flow 1600ms linear infinite}
.iso-dots circle[data-pulse]{animation:iso-pulse 1600ms steps(1,end) infinite;animation-delay:var(--pulse-at,0ms)}
${ANIMATION_CSS}
@media (prefers-reduced-motion:reduce){.iso-line[data-flow],.iso-dots circle[data-pulse],.iso-svg .iso-scene-root,.iso-svg [data-layer]{animation:none!important}}
`;
