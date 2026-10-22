import * as k from '../../engine/iso-kit.mjs';

/**
 * Modelo de Ilustración Técnica (2D Plano y 3D Isométrico): Sorting Workstation
 * Mesa de carpintería con patas torneadas, gavetero de casilleros huecos (cubbies)
 * construidos con tabiques y repisas reales ordenados por profundidad Z,
 * regla milimetrada, bandeja de sobres y balanza mecánica con plato superior.
 */
export function renderSortingDeskModel({
  width = 700,
  height = 500,
  theme = 'light',
  mode = '3d',
  colorMode = 'mono',
  palette = 'warm-craft',
  animate = 'static',
  showPlate = true
} = {}) {
  const TABLE = { x: -140, y: -70, w: 280, d: 140, r: 8 };
  const TABLE_TOP_Z = 70;
  const TABLE_SLAB_H = 8;

  const CABINET = { x: -96, y: -62, w: 192, d: 44, r: 3 };
  const CAB_BASE_Z = TABLE_TOP_Z + TABLE_SLAB_H;
  const CAB_HEIGHT = 76;

  function buildView(viewMode) {
    const P = k.fitProjection(
      [...k.boxCorners(TABLE, 0, TABLE_TOP_Z + TABLE_SLAB_H), ...k.boxCorners(CABINET, CAB_BASE_Z, CAB_BASE_Z + CAB_HEIGHT + 12)],
      width,
      height,
      {
        pad: 35,
        azimuth: viewMode === '2d' ? 0 : 48,
        elevation: viewMode === '2d' ? 88 : 30,
        mode: viewMode,
        palette
      }
    );

    const at = (point) => k.iso(point, P);
    const S = (paths, style) => k.solidSvg(paths, { palette, ...style });
    const L = (d, style) => k.lineSvg(d, { palette, ...style });
    const D = (points, style) => k.dotsSvg(points, style);
    const byDepth = (points) => [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));

    function tableLegs() {
      const out = [];
      const corners = k.corners(TABLE, 18);
      for (const [lx, ly] of byDepth(corners)) {
        out.push(S(k.cylinder(lx, ly, 6.5, 0, 3, P, 24), { tone: "lo", color: "brass" }));
        out.push(S(k.cylinder(lx, ly, 5.5, 3, 2, P, 24), { tone: "mid", color: "wood" }));
        out.push(S(k.cylinder(lx, ly, 4.2, 5, 20, P, 24), { tone: "mid", color: "wood" }));
        out.push(S(k.cylinder(lx, ly, 6, 25, 4, P, 24), { tone: "hi", color: "brass" }));
        out.push(S(k.cylinder(lx, ly, 4.8, 29, 38, P, 24), { tone: "mid", color: "wood" }));
        out.push(S(k.cylinder(lx, ly, 6.5, 67, 3, P, 24), { tone: "lo", color: "wood" }));
      }

      const stretcherZ = 16;
      out.push(S(k.slabOf({ x: TABLE.x + 18, y: TABLE.y + 18, w: TABLE.w - 36, d: 4, r: 1 }, stretcherZ, 4, P, 3), { tone: "lo", color: "wood" }));
      out.push(S(k.slabOf({ x: TABLE.x + 18, y: TABLE.y + TABLE.d - 22, w: TABLE.w - 36, d: 4, r: 1 }, stretcherZ, 4, P, 3), { tone: "lo", color: "wood" }));
      out.push(S(k.slabOf({ x: TABLE.x + 18, y: TABLE.y + 18, w: 4, d: TABLE.d - 36, r: 1 }, stretcherZ, 4, P, 3), { tone: "lo", color: "wood" }));
      out.push(S(k.slabOf({ x: TABLE.x + TABLE.w - 22, y: TABLE.y + 18, w: 4, d: TABLE.d - 36, r: 1 }, stretcherZ, 4, P, 3), { tone: "lo", color: "wood" }));

      return `<g class="iso-base-plate" data-layer="base">${out.join("")}</g>`;
    }

    function tableTop() {
      const out = [];
      const topZ = TABLE_TOP_Z + TABLE_SLAB_H;
      out.push(S(k.slabOf(TABLE, TABLE_TOP_Z, TABLE_SLAB_H, P, 8, 1.8), { tone: "mid", color: "wood" }));
      out.push(L(k.planOutline(k.insetPlan(TABLE, 6), topZ, P, 8), { tone: "lo" }));

      // 1. Regla milimetrada de latón embutida a la izquierda del borde frontal
      const frontEdgeY = TABLE.y + TABLE.d - 16;
      const rulerStrip = { x: TABLE.x + 18, y: frontEdgeY, w: 118, d: 8, r: 1.2 };
      out.push(S(k.slabOf(rulerStrip, topZ, 0.8, P, 2), { tone: "lo", crease: "none", color: "brass" }));
      const ticks = k.topTicks(rulerStrip.x + 4, rulerStrip.x + rulerStrip.w - 4, 3, 5, rulerStrip.y + 0.8, topZ + 0.8, [2.2, 4.2], P);
      out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "hi" }));

      // 2. Bandeja clasificadora de sobres a la derecha del borde frontal (sin chocar con la regla)
      const tray = { x: TABLE.x + 148, y: frontEdgeY - 4, w: 86, d: 14, r: 2 };
      out.push(S(k.slabOf(tray, topZ, 2.2, P, 3, 0.4), { tone: "mid", color: "copper" }));
      // Dos sobres apilados limpiamente dentro de la bandeja
      for (let i = 0; i < 2; i++) {
        const env = { x: tray.x + 6 + i * 38, y: tray.y + 2, w: 32, d: 10, r: 1 };
        out.push(S(k.slabOf(env, topZ + 2.2, 1.4, P, 2), { tone: "hi", color: "chassis" }));
        out.push(L(k.lineOnTop([env.x + 4, env.y + 4], [env.x + env.w - 6, env.y + 4], topZ + 3.6, P), { tone: "faint", free: true }));
      }

      return `<g data-layer="main">${out.join("")}</g>`;
    }

    function cabinet() {
      const out = [];
      const z0 = CAB_BASE_Z;
      const h = CAB_HEIGHT;
      const wallT = 3.2;
      const shelfH = 3.2;
      const cols = 4;
      const innerW = CABINET.w - wallT * (cols + 1);
      const bayW = innerW / cols;
      const rowH = (h - shelfH * 3) / 2;
      const frontY = CABINET.y + CABINET.d;

      // 1. Pared trasera del gabinete (al fondo)
      const backWall = { x: CABINET.x, y: CABINET.y, w: CABINET.w, d: 4, r: 1.5 };
      out.push(S(k.slabOf(backWall, z0, h, P, 4, 0.6), { tone: "lo", color: "copper" }));

      // Función auxiliar para construir una fila de casilleros de atrás hacia adelante
      // Con Azimuth ~48°, los elementos con menor (x + y) están más lejos y mayor (x + y) más cerca
      function renderShelfRow(rowZ, rowIndex) {
        // Piso de la repisa
        const shelfPlan = { x: CABINET.x, y: CABINET.y, w: CABINET.w, d: CABINET.d, r: 2 };
        out.push(S(k.slabOf(shelfPlan, rowZ, shelfH, P, 4, 0.5), { tone: "mid", color: "wood" }));

        const cellZ = rowZ + shelfH;
        // Ordenamos las columnas de izquierda a derecha (de más lejana en X a más cercana en X)
        for (let c = 0; c <= cols; c++) {
          const wallX = CABINET.x + c * (bayW + wallT);
          const divider = { x: wallX, y: CABINET.y + 3, w: wallT, d: CABINET.d - 3.5, r: 0.8 };
          out.push(S(k.slabOf(divider, cellZ, rowH, P, 2, 0.3), { tone: "mid", color: "wood" }));

          // Si hay un casillero a la derecha de este tabique, dibujamos sus sobres adentro antes del siguiente tabique frontal
          if (c < cols) {
            const slotX = wallX + wallT;
            // Plaquita portaetiqueta de latón en el canto frontal de la repisa
            const tag = { x: slotX + bayW / 2 - 7, y: frontY - 0.8, w: 14, d: 1.6, r: 0.5 };
            out.push(S(k.slabOf(tag, rowZ + 0.5, 2.2, P, 2), { tone: "hi", color: "brass" }));
            out.push(D([at([tag.x + 2, tag.y + tag.d, rowZ + 1.6]), at([tag.x + tag.w - 2, tag.y + tag.d, rowZ + 1.6])], { size: 0.32, tone: "lo" }));

            // Sobres reales descansando en el piso interior del casillero hueco
            if ((c + rowIndex) % 2 === 0 || c === 1) {
              const stackCount = c === 1 ? 2 : 1;
              for (let s = 0; s < stackCount; s++) {
                const letter = {
                  x: slotX + 4 + s * 1.5,
                  y: CABINET.y + 8 + s * 2,
                  w: bayW - 8,
                  d: CABINET.d - 12,
                  r: 0.8
                };
                const lz = cellZ + s * 1.8;
                out.push(S(k.slabOf(letter, lz, 1.5, P, 2), { tone: "hi", color: "chassis" }));
                out.push(L(k.planOutline(k.insetPlan(letter, 2), lz + 1.5, P, 2), { tone: "faint" }));
                out.push(L(k.lineOnTop([letter.x + 5, letter.y + 8], [letter.x + letter.w - 7, letter.y + 8], lz + 1.55, P), { tone: "lo", free: true }));
              }
            }
          }
        }
      }

      // Fila inferior de casilleros
      renderShelfRow(z0, 0);
      // Fila superior de casilleros
      renderShelfRow(z0 + shelfH + rowH, 1);

      // Techo del gabinete y cornisa moldurada superior
      const topShelfZ = z0 + (shelfH + rowH) * 2;
      out.push(S(k.slabOf({ x: CABINET.x, y: CABINET.y, w: CABINET.w, d: CABINET.d, r: 2 }, topShelfZ, shelfH, P, 4, 0.5), { tone: "mid", color: "wood" }));
      const crown = { x: CABINET.x - 3, y: CABINET.y - 2.5, w: CABINET.w + 6, d: CABINET.d + 5, r: 3.5 };
      out.push(S(k.slabOf(crown, topShelfZ + shelfH, 5, P, 6, 1.2), { tone: "hi", color: "copper" }));
      out.push(L(k.planOutline(k.insetPlan(crown, 3.5), topShelfZ + shelfH + 5, P, 6), { tone: "faint" }));

      return `<g data-layer="main">${out.join("")}</g>`;
    }

    function postalScale() {
      const out = [];
      const sx = -18;
      const sy = 14;
      const scaleBase = { x: sx - 20, y: sy - 14, w: 40, d: 28, r: 3 };
      const z0 = TABLE_TOP_Z + TABLE_SLAB_H;

      // Base pesada de hierro/cobre de la balanza
      out.push(S(k.slabOf(scaleBase, z0, 7, P, 4, 0.8), { tone: "mid", color: "copper" }));

      // Pomo moleteado de calibración a la derecha
      out.push(S(k.cylinder(sx + 12, sy + 4, 3.6, z0 + 7, 5, P, 20), { tone: "mid", color: "accent" }));
      out.push(L(k.knurl(sx + 12, sy + 4, 3.6, z0 + 7, z0 + 12, 12, P), { tone: "lo" }));

      // Torre central y carátula circular del dial (a la derecha/frente)
      out.push(S(k.cylinder(sx, sy, 6.5, z0 + 7, 12, P, 24, 0.5), { tone: "lo", color: "brass" }));
      const dialZ = z0 + 19;
      out.push(S(k.cylinder(sx, sy, 11.5, dialZ, 4.5, P, 28, 0.8), { tone: "hi", color: "chassis" }));
      const ticks = k.radialTicks(sx, sy, 9.6, 24, 4, dialZ + 4.5, [1.2, 2.2], P);
      out.push(L(ticks.minor, { tone: "lo" }));
      out.push(L(ticks.major, { tone: "mid" }));
      out.push(L(k.lineOnTop([sx, sy], [sx + 5, sy + 2], dialZ + 4.6, P), { tone: "red" }));
      out.push(D([at([sx, sy, dialZ + 4.7])], { size: 0.75, tone: "hi" }));

      // Vástago y plato de latón de pesaje ELEVADO por encima del dial para que nunca lo tape
      const panX = sx - 11;
      const panY = sy - 4;
      out.push(S(k.cylinder(panX, panY, 2.0, z0 + 7, 20, P, 16), { tone: "lo", color: "brass" }));
      out.push(S(k.cylinder(panX, panY, 9.5, z0 + 27, 2.2, P, 28, 0.6), { tone: "hi", color: "gold" }));
      out.push(L(k.ring(panX, panY, 7.2, z0 + 29.2, P, 24), { tone: "lo" }));

      return `<g data-layer="detail">${out.join("")}</g>`;
    }

    const halo = `<path class="iso-halo" d="${k.haloOf(TABLE, -10, TABLE_SLAB_H, P)}"/>`;
    return [halo, tableLegs(), tableTop(), cabinet(), postalScale()].join('\n    ');
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
    label: "Postal sorting workstation illustration (2D & 3D)",
    view3d: buildView('3d'),
    view2d: buildView('2d')
  });
}
