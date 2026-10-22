import * as k from '../../engine/iso-kit.mjs';

/**
 * Modelo de Ilustración Mecánica (2D Blueprint y 3D Volumétrico):
 * Engine Piston & Crankshaft Assembly (Conjunto de Pistón, Biela, Cigüeñal y Camisa Aleteada)
 * Incluye bloque soporte, cigüeñal con contrapesos y engrane, biela forjada en H,
 * bulón transversal, falda de pistón, 3 anillos de compresión/aceite y corona con cavidades de válvulas.
 */
export function renderEnginePistonModel({
  width = 640,
  height = 540,
  theme = 'light',
  mode = '3d',
  colorMode = 'color',
  palette = 'warm-craft',
  animate = 'float',
  showPlate = true
} = {}) {
  const BASE = { x: -86, y: -66, w: 172, d: 132, r: 8 };
  const BASE_H = 12;

  function build3D() {
    const P = k.fitProjection(
      [...k.boxCorners(BASE, -BASE_H, 165)],
      width,
      height,
      { pad: 32, azimuth: 46, elevation: 28, mode: '3d', palette }
    );

    const at = (pt) => k.iso(pt, P);
    const S = (paths, style) => k.solidSvg(paths, { palette, ...style });
    const L = (d, style) => k.lineSvg(d, { palette, ...style });
    const D = (pts, style) => k.dotsSvg(pts, style);
    const byDepth = (pts) => [...pts].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));

    // 1. Bloque de Cárter / Placa Base Mecánica (Ocultable con "No Plate")
    function crankcaseBase() {
      const out = [];
      out.push(`<path class="iso-halo" d="${k.haloOf(BASE, -BASE_H - 4, BASE_H, P)}"/>`);
      for (const [fx, fy] of byDepth(k.corners(BASE, 16))) {
        out.push(S(k.cylinder(fx, fy, 6, -BASE_H - 4, 4, P, 24), { tone: "lo", color: "panel" }));
      }
      out.push(S(k.slabOf(BASE, -BASE_H, BASE_H, P, 8, 1.5), { tone: "mid", color: "panel" }));
      out.push(L(k.planOutline(k.insetPlan(BASE, 5), 0, P, 8), { tone: "lo" }));

      // Cavidad del cárter de aceite bajo el cigüeñal
      const sump = { x: -48, y: -36, w: 96, d: 72, r: 4 };
      out.push(S(k.slabOf(sump, 0, 2.5, P, 4, 0.5), { tone: "lo", color: "chassis" }));

      // Pernos de bancada en las 4 esquinas
      for (const [bx, by] of byDepth(k.corners(BASE, 12))) {
        out.push(S(k.cylinder(bx, by, 3.2, 0, 2.2, P, 6), { tone: "hi", color: "gold" }));
        out.push(D([at([bx, by, 2.2])], { size: 0.5, tone: "lo" }));
      }

      // Escala de grados TDC / BDC en el borde frontal
      const ticks = k.topTicks(-50, 50, 5, 5, BASE.y + BASE.d - 9, 0.2, [2, 4], P);
      out.push(L(ticks.minor, { tone: "faint" }), L(ticks.major, { tone: "lo" }));

      return `<g class="iso-base-plate" data-layer="base">${out.join("")}</g>`;
    }

    // 2. Camisa Aleteada de Cilindro en Corte Trasero (Cutaway Cylinder Block)
    function cutawayCylinderFins() {
      const out = [];
      // Bloque de soporte trasero que muestra las aletas de enfriamiento detrás del pistón
      const finBlockZ = 68;
      const finCount = 6;
      for (let i = 0; i < finCount; i++) {
        const fz = finBlockZ + i * 9;
        // Aleta trasera en forma de placa semi-envolvente (ubicada en y negativo, detrás del pistón)
        const finPlan = { x: -48, y: -48, w: 96, d: 34, r: 6 };
        out.push(S(k.slabOf(finPlan, fz, 3.2, P, 6, 0.5), { tone: "mid", color: "chassis" }));
        // Espaciador entre aletas
        if (i < finCount - 1) {
          out.push(S(k.slabOf({ x: -38, y: -42, w: 76, d: 24, r: 4 }, fz + 3.2, 5.8, P, 4), { tone: "lo", color: "panel" }));
        }
      }
      // 4 Espárragos largos de culata (Cylinder Head Studs) en las esquinas del bloque trasero
      for (const sx of [-42, 42]) {
        for (const sy of [-42, -20]) {
          out.push(S(k.cylinder(sx, sy, 2.0, 0, 126, P, 14), { tone: "lo", color: "brass" }));
          out.push(S(k.cylinder(sx, sy, 3.2, 126, 3.5, P, 6), { tone: "hi", color: "gold" }));
        }
      }
      return `<g data-layer="base">${out.join("")}</g>`;
    }

    // 3. Cigüeñal (Crankshaft), Contrapesos y Engrane de Distribución
    function crankshaft() {
      const out = [];
      const crankZ = 24;

      // Bancada trasera (Rear Main Bearing Block)
      out.push(S(k.slabOf({ x: -16, y: -34, w: 32, d: 14, r: 2 }, 2.5, crankZ + 8, P, 3, 0.6), { tone: "mid", color: "panel" }));

      // Contrapeso trasero del cigüeñal (disco excéntrico)
      out.push(S(k.slabOf({ x: -24, y: -18, w: 48, d: 10, r: 8 }, crankZ - 14, 34, P, 6, 1.0), { tone: "hi", color: "secondary" }));

      // Muñón de biela (Crankpin Journal) y cabeza inferior de la biela (Big End)
      out.push(S(k.slabOf({ x: -15, y: -7, w: 30, d: 14, r: 4 }, crankZ - 4, 18, P, 4, 0.8), { tone: "hi", color: "copper" }));
      // Pernos de sujeción de bancada de biela
      out.push(S(k.cylinder(-11, 0, 2.0, crankZ + 14, 3, P, 12), { tone: "hi", color: "gold" }));
      out.push(S(k.cylinder(11, 0, 2.0, crankZ + 14, 3, P, 12), { tone: "hi", color: "gold" }));

      // Contrapeso delantero del cigüeñal
      out.push(S(k.slabOf({ x: -24, y: 8, w: 48, d: 10, r: 8 }, crankZ - 14, 34, P, 6, 1.0), { tone: "hi", color: "secondary" }));
      out.push(L(k.planOutline({ x: -18, y: 9.5, w: 36, d: 7, r: 4 }, crankZ + 20, P, 4), { tone: "lo" }));

      // Bancada delantera y Engrane / Polea dentada frontal
      out.push(S(k.slabOf({ x: -16, y: 20, w: 32, d: 12, r: 2 }, 2.5, crankZ + 6, P, 3, 0.6), { tone: "mid", color: "panel" }));
      out.push(S(k.slabOf({ x: -18, y: 33, w: 36, d: 6, r: 6 }, crankZ - 8, 22, P, 6, 0.8), { tone: "hi", color: "gold" }));
      out.push(L(k.knurl(0, 36, 14, crankZ - 4, crankZ + 10, 24, P), { tone: "lo" }));

      return `<g data-layer="main">${out.join("")}</g>`;
    }

    // 4. Biela Forjada en H (Connecting Rod) y Bulón (Wrist Pin)
    function connectingRodAndPiston() {
      const out = [];

      // Fuste de la biela forjada (de z=38 a z=82)
      const rodShaft = { x: -8, y: -5, w: 16, d: 10, r: 2 };
      out.push(S(k.slabOf(rodShaft, 38, 44, P, 4, 0.6), { tone: "hi", color: "copper" }));
      // Rebaje central de aligeramiento (viga en H)
      const hPocket = { x: -4.5, y: -5.2, w: 9, d: 10.4, r: 1 };
      out.push(S(k.slabOf(hPocket, 44, 32, P, 2), { tone: "lo", color: "brass" }));

      // Pie de biela superior (Small End)
      out.push(S(k.slabOf({ x: -13, y: -7, w: 26, d: 14, r: 3 }, 78, 12, P, 4, 0.6), { tone: "hi", color: "copper" }));

      // 5. Falda y Cabeza del Pistón (Piston Skirt, Rings & Crown)
      const pistonZ = 84;
      const pistonR = 32;

      // Falda inferior maquinada del pistón
      out.push(S(k.cylinder(0, 0, pistonR - 0.8, pistonZ, 18, P, 48, 0.6), { tone: "mid", color: "primary" }));

      // Alojamiento del Bulón Transversal (Wrist Pin / Gudgeon Pin) visible en el lateral
      out.push(S(k.cylinder(0, 0, pistonR + 0.6, pistonZ + 6, 6, P, 48, 0.3), { tone: "lo", color: "panel" }));
      // Casquillo de bronce y centro del bulón en la cara frontal-derecha
      const pinFace = at([pistonR * 0.72, pistonR * 0.72, pistonZ + 9]);
      out.push(D([pinFace], { size: 2.2, tone: "hi" }));

      // Cuerpo superior del pistón y 3 Anillos de Compresión / Rascador / Aceite
      const ringStartZ = pistonZ + 20;
      const ringColors = ["gold", "copper", "accent"];
      for (let r = 0; r < 3; r++) {
        const rz = ringStartZ + r * 7.5;
        // Ranura profunda (Ring Land Groove)
        out.push(S(k.cylinder(0, 0, pistonR - 2.2, rz, 2.2, P, 44), { tone: "lo", color: "panel" }));
        // Anillo de compresión metálico sobresaliendo ligeramente
        out.push(S(k.cylinder(0, 0, pistonR + 0.8, rz + 2.2, 2.6, P, 48, 0.3), { tone: "hi", color: ringColors[r] }));
        // Pared del pistón entre anillos
        out.push(S(k.cylinder(0, 0, pistonR, rz + 4.8, 2.7, P, 48, 0.3), { tone: "mid", color: "primary" }));
      }

      // Corona Superior del Pistón (Piston Crown)
      const crownZ = ringStartZ + 22.5;
      const crownH = 8;
      const topZ = crownZ + crownH;
      out.push(S(k.cylinder(0, 0, pistonR, crownZ, crownH, P, 56, 1.4), { tone: "hi", color: "primary" }));

      // Cámara de combustión cóncava (Combustion Bowl) en la cara superior del pistón
      out.push(S(k.cylinder(0, 0, pistonR - 8, topZ - 0.5, 1.2, P, 44, 0.4), { tone: "mid", color: "secondary" }));
      out.push(L(k.ring(0, 0, pistonR - 5, topZ, P, 48), { tone: "lo" }));
      out.push(L(k.ring(0, 0, pistonR - 11, topZ + 0.7, P, 40), { tone: "faint" }));

      // 4 Muecas de alivio de válvulas (Valve Relief Pockets: 2 Admisión, 2 Escape)
      const valveOffsets = [
        [-12, -12, 6.2],
        [12, -12, 6.2],
        [-12, 12, 5.2],
        [12, 12, 5.2]
      ];
      for (const [vx, vy, vr] of valveOffsets) {
        out.push(S(k.cylinder(vx, vy, vr, topZ + 0.6, 1.0, P, 24, 0.3), { tone: "lo", color: "gold" }));
        out.push(L(k.ring(vx, vy, vr - 1.2, topZ + 1.6, P, 20), { tone: "faint" }));
      }

      // Graduaciones radiales de precisión e indicador de frente (flecha de montaje)
      const crownTicks = k.radialTicks(0, 0, pistonR - 2.2, 36, 3, topZ, [1.2, 2.5], P);
      out.push(L(crownTicks.minor, { tone: "faint" }), L(crownTicks.major, { tone: "lo" }));
      out.push(D([at([0, 0, topZ + 0.8])], { size: 0.9, tone: "hi", pulse: true }));

      return `<g data-layer="detail">${out.join("")}</g>`;
    }

    return [
      crankcaseBase(),
      cutawayCylinderFins(),
      crankshaft(),
      connectingRodAndPiston()
    ].join('\n    ');
  }

  // Vista 2D Plana: Corte Técnico Frontal del Pistón, Anillos, Biela en H y Cigüeñal
  function build2D() {
    const cx = width / 2;
    const cy = height / 2;
    const scale = Math.min(width / 280, height / 260);
    const sx = (x) => Number((cx + x * scale).toFixed(1));
    const sy = (y) => Number((cy + y * scale).toFixed(1));
    const sw = (w) => Number((w * scale).toFixed(1));

    const primShades = k.computeFourToneShades("primary", palette);
    const secShades = k.computeFourToneShades("secondary", palette);
    const copShades = k.computeFourToneShades("copper", palette);
    const goldShades = k.computeFourToneShades("gold", palette);
    const panShades = k.computeFourToneShades("panel", palette);
    const accShades = k.computeFourToneShades("accent", palette);

    const box2d = (x, y, w, h, r, sh, tone = "hi") => {
      const style = sh ? `--c-top:${sh.top};--c-s0:${sh.s0};--c-s1:${sh.s1};--c-s2:${sh.s2};--c-s3:${sh.s3};--c-edge:${sh.edge}` : "";
      return `<g class="iso-solid" ${sh ? 'data-has-color=""' : ""} style="${style}">
        <rect class="iso-top" x="${sx(x)}" y="${sy(y)}" width="${sw(w)}" height="${sw(h)}" rx="${sw(r)}" />
        <rect class="iso-line iso-edge" data-tone="${tone}" x="${sx(x)}" y="${sy(y)}" width="${sw(w)}" height="${sw(h)}" rx="${sw(r)}" />
      </g>`;
    };

    const circle2d = (x, y, r, sh, tone = "hi") => {
      const style = sh ? `--c-top:${sh.top};--c-s0:${sh.s0};--c-s1:${sh.s1};--c-s2:${sh.s2};--c-s3:${sh.s3};--c-edge:${sh.edge}` : "";
      return `<g class="iso-solid" ${sh ? 'data-has-color=""' : ""} style="${style}">
        <circle class="iso-top" cx="${sx(x)}" cy="${sy(y)}" r="${sw(r)}" />
        <circle class="iso-line iso-edge" data-tone="${tone}" cx="${sx(x)}" cy="${sy(y)}" r="${sw(r)}" />
      </g>`;
    };

    const out = [];

    // 1. Camisa aleteada exterior y base (Ocultable con "No Plate")
    const fins2d = [];
    for (let i = 0; i < 6; i++) {
      const fy = -96 + i * 12;
      fins2d.push(box2d(-64, fy, 18, 5, 1.5, panShades, "lo"));
      fins2d.push(box2d(46, fy, 18, 5, 1.5, panShades, "lo"));
    }
    out.push(`<g class="iso-base-plate" data-layer="base">
      ${box2d(-78, 92, 156, 16, 4, panShades, "mid")}
      ${box2d(-50, -102, 6, 194, 2, panShades, "lo")}
      ${box2d(44, -102, 6, 194, 2, panShades, "lo")}
      ${fins2d.join("")}
    </g>`);

    // 2. Cigüeñal rotativo (Crankshaft) en la parte inferior
    out.push(`<g data-layer="main">
      ${circle2d(0, 62, 34, secShades, "hi")}
      ${circle2d(0, 62, 24, panShades, "lo")}
      ${circle2d(0, 62, 10, goldShades, "hi")}
    </g>`);

    // 3. Biela en H y Pistón con 3 anillos de compresión y bulón central
    out.push(`<g data-layer="detail">
      <!-- Biela Forjada en H -->
      ${box2d(-11, -36, 22, 98, 4, copShades, "hi")}
      ${box2d(-5.5, -20, 11, 64, 2, goldShades, "lo")}
      ${circle2d(0, 52, 15, copShades, "hi")}
      ${circle2d(0, 52, 8, goldShades, "mid")}

      <!-- Cabeza y Falda del Pistón -->
      ${box2d(-42, -98, 84, 58, 5, primShades, "hi")}
      <!-- 3 Anillos de Compresión y Aceite -->
      ${box2d(-44.5, -90, 89, 4, 1.2, goldShades, "hi")}
      ${box2d(-44.5, -81, 89, 4, 1.2, copShades, "hi")}
      ${box2d(-44.5, -72, 89, 4, 1.2, accShades, "hi")}

      <!-- Bulón Transversal (Wrist Pin) -->
      ${circle2d(0, -54, 14, secShades, "hi")}
      ${circle2d(0, -54, 8, goldShades, "hi")}
    </g>`);

    return out.join('\n    ');
  }

  return k.wrapDualModeSvg({
    width,
    height,
    theme,
    mode,
    colorMode,
    palette,
    animate,
    showPlate,
    label: "Mechanical Engine Piston & Crankshaft Assembly (2D & 3D)",
    view3d: build3D(),
    view2d: build2D()
  });
}
