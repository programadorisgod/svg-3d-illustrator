import * as k from '../../engine/iso-kit.mjs';

/**
 * Modelo de Ilustración Técnica Isométrica: Sorting Workstation (Escritorio de clasificación postal / estación de trabajo)
 * Inspirado en Image 3: mesa con patas torneadas, gavetero de casilleros (cubbies), balanza con dial y sobres.
 */
export function renderSortingDeskModel({
  width = 700,
  height = 500,
  theme = 'light'
} = {}) {
  // Dimensiones de la mesa base
  const TABLE = { x: -140, y: -70, w: 280, d: 140, r: 8 };
  const TABLE_TOP_Z = 70;
  const TABLE_SLAB_H = 8;
  const LEG_R = 5;

  // Gabinete de casilleros (Cubbies) en la parte trasera de la mesa
  const CABINET = { x: -90, y: -60, w: 180, d: 45, r: 4 };
  const CAB_BASE_Z = TABLE_TOP_Z;
  const CAB_HEIGHT = 80;

  const P = k.fitProjection(
    [...k.boxCorners(TABLE, 0, TABLE_TOP_Z + TABLE_SLAB_H), ...k.boxCorners(CABINET, CAB_BASE_Z, CAB_BASE_Z + CAB_HEIGHT + 10)],
    width,
    height,
    { pad: 35, azimuth: 48, elevation: 30 }
  );

  const at = (point) => k.iso(point, P);
  const S = (paths, style) => k.solidSvg(paths, style);
  const L = (d, style) => k.lineSvg(d, style);
  const D = (points, style) => k.dotsSvg(points, style);
  const byDepth = (points) => [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));

  function tableLegs() {
    const out = [];
    const corners = k.corners(TABLE, 18);
    // Ordenar patas por profundidad
    for (const [lx, ly] of byDepth(corners)) {
      // Base / pie de la pata
      out.push(S(k.cylinder(lx, ly, 6.5, 0, 3, P, 24), { tone: "lo" }));
      out.push(S(k.cylinder(lx, ly, 5.5, 3, 2, P, 24), { tone: "mid" }));
      // Fuste inferior
      out.push(S(k.cylinder(lx, ly, 4.2, 5, 20, P, 24), { tone: "mid" }));
      // Moldura central torneada
      out.push(S(k.cylinder(lx, ly, 6, 25, 4, P, 24), { tone: "hi" }));
      // Fuste superior
      out.push(S(k.cylinder(lx, ly, 4.8, 29, 38, P, 24), { tone: "mid" }));
      // Capitel de unión bajo la mesa
      out.push(S(k.cylinder(lx, ly, 6.5, 67, 3, P, 24), { tone: "lo" }));
    }

    // Travesaños / bastidor entre patas
    const stretcherZ = 16;
    out.push(S(k.slabOf({ x: TABLE.x + 18, y: TABLE.y + 18, w: TABLE.w - 36, d: 4, r: 1 }, stretcherZ, 4, P, 3), { tone: "lo" }));
    out.push(S(k.slabOf({ x: TABLE.x + 18, y: TABLE.y + TABLE.d - 22, w: TABLE.w - 36, d: 4, r: 1 }, stretcherZ, 4, P, 3), { tone: "lo" }));
    out.push(S(k.slabOf({ x: TABLE.x + 18, y: TABLE.y + 18, w: 4, d: TABLE.d - 36, r: 1 }, stretcherZ, 4, P, 3), { tone: "lo" }));
    out.push(S(k.slabOf({ x: TABLE.x + TABLE.w - 22, y: TABLE.y + 18, w: 4, d: TABLE.d - 36, r: 1 }, stretcherZ, 4, P, 3), { tone: "lo" }));

    return out.join("");
  }

  function tableTop() {
    const out = [];
    // Tablero principal con bisel
    out.push(S(k.slabOf(TABLE, TABLE_TOP_Z, TABLE_SLAB_H, P, 8, 1.8), { tone: "mid" }));
    // Ranura decorativa de perímetro
    out.push(L(k.planOutline(k.insetPlan(TABLE, 6), TABLE_TOP_Z + TABLE_SLAB_H, P, 8), { tone: "lo" }));
    
    // Regla graduada de medición en el borde frontal del escritorio
    const frontEdgeY = TABLE.y + TABLE.d - 12;
    const rulerStrip = { x: TABLE.x + 20, y: frontEdgeY, w: 120, d: 8, r: 1 };
    out.push(S(k.slabOf(rulerStrip, TABLE_TOP_Z + TABLE_SLAB_H, 0.6, P, 2), { tone: "lo", crease: "none" }));
    const ticks = k.topTicks(rulerStrip.x + 4, rulerStrip.x + rulerStrip.w - 4, 3, 5, rulerStrip.y + 0.6, TABLE_TOP_Z + TABLE_SLAB_H + 0.6, [2, 4], P);
    out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));

    // Guía metálica frontal para clasificar
    out.push(S(k.slabOf({ x: TABLE.x + 16, y: frontEdgeY - 2, w: 180, d: 14, r: 2 }, TABLE_TOP_Z + TABLE_SLAB_H, 4, P, 4), { tone: "lo" }));
    out.push(S(k.slabOf({ x: TABLE.x + 18, y: frontEdgeY, w: 176, d: 10, r: 1 }, TABLE_TOP_Z + TABLE_SLAB_H + 2, 2, P, 3), { tone: "mid" }));

    // Carta/sobre en la bandeja frontal
    const letterFront = { x: TABLE.x + 140, y: frontEdgeY + 1, w: 32, d: 20, r: 1 };
    out.push(S(k.slabOf(letterFront, TABLE_TOP_Z + TABLE_SLAB_H + 4, 1.2, P, 2), { tone: "hi" }));
    out.push(L(k.planOutline(k.insetPlan(letterFront, 2), TABLE_TOP_Z + TABLE_SLAB_H + 5.2, P, 2), { tone: "faint" }));
    out.push(L(k.lineOnTop([letterFront.x + 6, letterFront.y + 6], [letterFront.x + 24, letterFront.y + 6], TABLE_TOP_Z + TABLE_SLAB_H + 5.2, P), { tone: "faint", free: true }));
    out.push(L(k.lineOnTop([letterFront.x + 6, letterFront.y + 11], [letterFront.x + 20, letterFront.y + 11], TABLE_TOP_Z + TABLE_SLAB_H + 5.2, P), { tone: "faint", free: true }));

    return out.join("");
  }

  function cabinet() {
    const out = [];
    const z0 = CAB_BASE_Z + TABLE_SLAB_H;
    const h = CAB_HEIGHT;

    // Cuerpo del casillero
    out.push(S(k.slabOf(CABINET, z0, h, P, 6, 1.5), { tone: "mid" }));
    // Cornisa superior moldurada
    const crown = { x: CABINET.x - 3, y: CABINET.y - 3, w: CABINET.w + 6, d: CABINET.d + 6, r: 4 };
    out.push(S(k.slabOf(crown, z0 + h, 5, P, 6, 1.2), { tone: "hi" }));
    out.push(L(k.planOutline(k.insetPlan(crown, 4), z0 + h + 5, P, 6), { tone: "faint" }));

    // División de casilleros (4 columnas x 2 filas)
    const cols = 4;
    const rows = 2;
    const colW = (CABINET.w - 12) / cols;
    const rowH = (h - 14) / rows;

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const slotX = CABINET.x + 6 + c * colW;
        const slotZ = z0 + 6 + r * rowH;
        const frontY = CABINET.y + CABINET.d;

        // Borde exterior del nicho
        const niche = { x: slotX + 1, y: CABINET.y + 4, w: colW - 2, d: CABINET.d - 4, r: 1 };
        out.push(S(k.slabOf(niche, slotZ, rowH - 2, P, 2), { tone: "lo" }));

        // Plaquita portaetiqueta metálica
        const tag = { x: slotX + colW / 2 - 8, y: frontY - 1, w: 16, d: 2, r: 0.6 };
        out.push(S(k.slabOf(tag, slotZ - 2, 3, P, 2), { tone: "hi" }));
        out.push(D([at([tag.x + 2, tag.y + tag.d, slotZ - 0.5]), at([tag.x + tag.w - 2, tag.y + tag.d, slotZ - 0.5])], { size: 0.35, tone: "lo" }));

        // Sobres apilados dentro de algunos casilleros
        if ((c + r) % 2 === 1 || c === 0) {
          const letter = { x: slotX + 4, y: CABINET.y + 12, w: colW - 8, d: 24, r: 0.8 };
          out.push(S(k.slabOf(letter, slotZ + 1, 1.4, P, 2), { tone: "hi" }));
          out.push(L(k.lineOnTop([letter.x + 4, letter.y + 6], [letter.x + letter.w - 6, letter.y + 6], slotZ + 2.4, P), { tone: "faint", free: true }));
        }
      }
    }

    return out.join("");
  }

  function postalScale() {
    const out = [];
    // Balanza mecánica de correos colocada en el centro del escritorio
    const scaleBase = { x: -20, y: -5, w: 40, d: 30, r: 3 };
    const z0 = TABLE_TOP_Z + TABLE_SLAB_H;

    // Base de la balanza
    out.push(S(k.slabOf(scaleBase, z0, 8, P, 4, 0.8), { tone: "mid" }));

    // Columna central de la balanza
    out.push(S(k.cylinder(0, 10, 8, z0 + 8, 14, P, 24, 0.6), { tone: "lo" }));

    // Dial circular de medición
    const dialZ = z0 + 22;
    out.push(S(k.cylinder(0, 10, 12, dialZ, 5, P, 28, 0.8), { tone: "hi" }));
    // Ticks en el dial
    const ticks = k.radialTicks(0, 10, 10, 24, 4, dialZ + 5, [1.2, 2.4], P);
    out.push(L(ticks.minor, { tone: "lo" }));
    out.push(L(ticks.major, { tone: "mid" }));
    // Aguja indicadora
    out.push(L(k.lineOnTop([0, 10], [5, 12], dialZ + 5.1, P), { tone: "hi" }));
    out.push(D([at([0, 10, dialZ + 5.2])], { size: 0.8, tone: "hi" }));

    // Plato de pesaje a la izquierda
    const panX = -12;
    const panY = 10;
    out.push(S(k.cylinder(panX, panY, 1.8, z0 + 8, 10, P, 16), { tone: "lo" }));
    out.push(S(k.cylinder(panX, panY, 9, z0 + 18, 1.8, P, 24, 0.5), { tone: "hi" }));

    // Pomo moleteado de ajuste
    out.push(S(k.cylinder(12, 10, 4, z0 + 8, 6, P, 20), { tone: "mid" }));
    out.push(L(k.knurl(12, 10, 4, z0 + 8, z0 + 14, 12, P), { tone: "lo" }));

    return out.join("");
  }

  const halo = `<path class="iso-halo" d="${k.haloOf(TABLE, -10, TABLE_SLAB_H, P)}"/>`;

  const body = [
    `<style>${k.ISO_CSS}</style>`,
    halo,
    tableLegs(),
    tableTop(),
    cabinet(),
    postalScale()
  ];

  return `<svg xmlns="http://www.w3.org/2000/svg" class="iso-svg iso" data-theme="${theme}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Postal sorting workstation isometric illustration">
  ${body.join('\n  ')}
</svg>`;
}
