import * as k from '../../engine/iso-kit.mjs';

/**
 * Modelo de Ilustración Técnica Isométrica: Dial Indicator & Gauge Rig
 * Banco de pruebas con calibre de dial, base magnética, regla graduada, raíles y carro móvil.
 */
export function renderDialIndicatorModel({
  width = 600,
  height = 400,
  theme = 'light'
} = {}) {
  const PLATE = { x: -128, y: -64, w: 262, d: 128, r: 8 };
  const PLATE_H = 12;
  const FOOT_H = 5;

  const MAG = { x: -112, y: -20, w: 44, d: 40, r: 3 };
  const MAG_H = 24;
  const POST = [-98, 0];
  const POST_TOP = 122;
  const CLAMP_Z = 100;

  const DIAL = [58, 0];
  const DIAL_R = 20;
  const DIAL_Z = 82;
  const DIAL_H = 10;
  const DIAL_TOP = DIAL_Z + DIAL_H;
  const PER_TURN = 20;

  const RAIL_FROM = 2;
  const RAIL_TO = 124;
  const CARRIAGE = { x: -28, y: -24, w: 56, d: 48, r: 3 };
  const CARRIAGE_Z = 3;
  const CARRIAGE_TOP = 8;
  const BLOCKS = [18, 14, 10];
  const BLOCK_W = 15.6;
  const STEP = 16;
  const TIP_R = 2.6;

  const P = k.fitProjection(
    [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), [POST[0], POST[1], POST_TOP + 2], [DIAL[0] + DIAL_R, 0, DIAL_TOP]],
    width,
    height,
    { pad: 30, azimuth: 42 }
  );

  const at = (point) => k.iso(point, P);
  const S = (paths, style) => k.solidSvg(paths, style);
  const L = (d, style) => k.lineSvg(d, style);
  const D = (points, style) => k.dotsSvg(points, style);
  const byDepth = (points) => [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));

  function plate() {
    const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
    for (const [x, y] of byDepth(k.corners(PLATE, 22))) {
      out.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: "lo" }));
      out.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" }));
    }
    out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: "mid" }));
    out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
    const screws = k.corners(PLATE, 10);
    out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
    out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
    const strip = { x: -110, y: PLATE.y + PLATE.d - 15, w: 230, d: 7, r: 1 };
    out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
    const ticks = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 4, 5, strip.y + 0.8, 0.6, [2, 3.6], P);
    out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
    out.push(D([at([strip.x + 2, strip.y + 3.5, 0.6]), at([strip.x + strip.w - 2, strip.y + 3.5, 0.6])], { size: 0.45 }));
    return out.join("");
  }

  function rails() {
    const out = [];
    for (const y of [-20, 15]) {
      out.push(S(k.slabOf({ x: RAIL_FROM, y, w: RAIL_TO - RAIL_FROM, d: 5, r: 1 }, 0, 3, P, 3, 0.4), { tone: "mid" }));
      out.push(D([RAIL_FROM + 6, RAIL_TO - 6].map((x) => at([x, y + 2.5, 3])), { size: 0.4 }));
    }
    for (const x of [RAIL_FROM - 5, RAIL_TO]) {
      out.push(S(k.slabOf({ x, y: -23, w: 5, d: 46, r: 1.2 }, 0, 7, P, 3, 0.5), { tone: "mid" }));
      out.push(D([at([x + 2.5, -18, 7]), at([x + 2.5, 18, 7])], { size: 0.45 }));
    }
    return out.join("");
  }

  function fixture() {
    const out = [];
    out.push(S(k.slabOf(MAG, 0, 11, P, 6, 0.8), { tone: "mid" }));
    out.push(S(k.slabOf(k.insetPlan(MAG, 0.8), 11, MAG_H - 11, P, 6, 0.8), { tone: "mid" }));
    out.push(L(k.planOutline(k.insetPlan(MAG, 3), MAG_H, P), { tone: "faint" }));
    out.push(D([at([MAG.x + 5, MAG.y + 5, MAG_H]), at([MAG.x + 5, MAG.y + MAG.d - 5, MAG_H]), at([MAG.x + MAG.w - 5, MAG.y + 5, MAG_H])], { size: 0.45 }));
    const knob = [MAG.x + 32, MAG.y + 28];
    out.push(S(k.cylinder(knob[0], knob[1], 6, MAG_H, 4, P, 32), { tone: "mid" }));
    out.push(L(k.knurl(knob[0], knob[1], 6, MAG_H, MAG_H + 4, 36, P), { tone: "lo" }));
    out.push(L(k.lineOnTop([knob[0], knob[1]], [knob[0] + 6, knob[1]], MAG_H + 4, P), { tone: "hi" }));
    out.push(D([at([knob[0], knob[1], MAG_H + 4])], { size: 0.5, tone: "hi" }));
    out.push(S(k.cylinder(POST[0], POST[1], 5, MAG_H, 4, P, 28), { tone: "mid" }));
    const clamp = { x: POST[0] - 7, y: POST[1] - 7, w: 14, d: 14, r: 2.5 };
    out.push(S(k.cylinder(POST[0], POST[1], 3.2, MAG_H + 4, CLAMP_Z - 4 - MAG_H - 4, P, 28), { tone: "mid", crease: "none" }));
    out.push(L([60, 80].map((z) => k.sideArc(POST[0], POST[1], 3.2, z, P, 16)).join(""), { tone: "faint" }));
    out.push(S(k.slabOf(clamp, CLAMP_Z - 4, 12, P, 4, 0.6), { tone: "mid" }));
    out.push(S(k.cylinder(POST[0], POST[1], 3.2, CLAMP_Z + 8, POST_TOP - CLAMP_Z - 8, P, 28), { tone: "mid", crease: "none" }));
    out.push(S(k.cylinder(POST[0], POST[1], 3.8, POST_TOP, 2, P, 28), { tone: "mid" }));
    const arm = { x: POST[0] + 7, y: -3, w: DIAL[0] - DIAL_R - POST[0] - 7 + 2, d: 6, r: 2 };
    out.push(S(k.slabOf(arm, CLAMP_Z, 4, P, 4, 0.5), { tone: "mid" }));
    out.push(D([at([arm.x + 4, 0, CLAMP_Z + 4]), at([arm.x + arm.w - 5, 0, CLAMP_Z + 4])], { size: 0.45 }));
    const thumb = [clamp.x + 7, clamp.y + clamp.d + 3];
    out.push(S(k.slabOf({ x: thumb[0] - 1.4, y: clamp.y + clamp.d, w: 2.8, d: 3, r: 0.8 }, CLAMP_Z + 1, 4, P, 2), { tone: "mid", crease: "none" }));
    out.push(S(k.cylinder(thumb[0], thumb[1] + 1.4, 2.6, CLAMP_Z, 6, P, 20), { tone: "mid" }));
    out.push(L(k.knurl(thumb[0], thumb[1] + 1.4, 2.6, CLAMP_Z, CLAMP_Z + 6, 18, P), { tone: "lo" }));
    return out.join("");
  }

  function carriage() {
    const out = [`<path class="iso-halo" d="${k.haloOf(k.insetPlan(CARRIAGE, 3), CARRIAGE_Z, 0.1, P)}" style="filter:blur(4px)"/>`];
    out.push(S(k.slabOf(CARRIAGE, CARRIAGE_Z, CARRIAGE_TOP - CARRIAGE_Z, P, 5, 0.6), { tone: "mid" }));
    out.push(D([-22, -8, 8, 22].map((x) => at([x, CARRIAGE.y + CARRIAGE.d - 2.6, CARRIAGE_TOP])), { size: 0.4, tone: "lo" }));
    out.push(L(k.lineOnTop([CARRIAGE.x, -15.5], [CARRIAGE.x + CARRIAGE.w, -15.5], CARRIAGE_TOP, P), { tone: "faint" }));
    out.push(L(k.lineOnTop([CARRIAGE.x, 15.5], [CARRIAGE.x + CARRIAGE.w, 15.5], CARRIAGE_TOP, P), { tone: "faint" }));
    BLOCKS.forEach((blockHeight, index) => {
      const plan = { x: -24 + STEP * index, y: -12, w: BLOCK_W, d: 24, r: 1 };
      out.push(S(k.slabOf(plan, CARRIAGE_TOP, blockHeight, P, 3, 0.5), { tone: "hi", crease: "lo" }));
      out.push(L(k.planOutline(k.insetPlan(plan, 2), CARRIAGE_TOP + blockHeight, P, 3), { tone: "faint" }));
    });
    const handle = [CARRIAGE.x + CARRIAGE.w - 8, CARRIAGE.y + CARRIAGE.d + 3];
    out.push(S(k.slabOf({ x: handle[0] - 2, y: CARRIAGE.y + CARRIAGE.d - 1, w: 4, d: 4, r: 1 }, CARRIAGE_Z + 1, 3, P, 2), { tone: "mid", crease: "none" }));
    out.push(S(k.cylinder(handle[0], handle[1] + 1, 3, CARRIAGE_Z, 5, P, 20), { tone: "mid" }));
    out.push(L(k.knurl(handle[0], handle[1] + 1, 3, CARRIAGE_Z, CARRIAGE_Z + 5, 18, P), { tone: "lo" }));
    return out.join("");
  }

  function plunger() {
    const out = [];
    out.push(S(k.cylinder(DIAL[0], DIAL[1], TIP_R, 0, 2.4, P, 20), { tone: "hi", lit: true }));
    out.push(S(k.cylinder(DIAL[0], DIAL[1], 1.4, 2.4, 50, P, 16), { tone: "hi", crease: "none", lit: true }));
    return out.join("");
  }

  function dial() {
    const out = [];
    const [x, y] = DIAL;
    out.push(S(k.cylinder(x, y, 2.9, 54, DIAL_Z - 54, P, 20), { tone: "mid" }));
    out.push(L(k.sideArc(x, y, 2.9, 60, P, 12), { tone: "lo" }));
    out.push(S(k.slabOf({ x: x - DIAL_R - 6, y: -4, w: 8, d: 8, r: 1.5 }, DIAL_Z + 2, CLAMP_Z - DIAL_Z - 2, P, 3, 0.4), { tone: "mid" }));
    out.push(S(k.cylinder(x, y, DIAL_R, DIAL_Z, DIAL_H, P, 64, 0.8), { tone: "hi", crease: "lo" }));
    out.push(L(k.knurl(x, y, DIAL_R, DIAL_TOP - 3.4, DIAL_TOP, 84, P, 0.3), { tone: "lo" }));
    out.push(L(k.sideArc(x, y, DIAL_R, DIAL_TOP - 3.4, P, 40), { tone: "faint" }));
    out.push(L(k.ring(x, y, DIAL_R - 2.2, DIAL_TOP, P, 64), { tone: "lo" }));
    const ticks = k.radialTicks(x, y, DIAL_R - 3, 50, 5, DIAL_TOP, [1.3, 2.8], P);
    out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
    out.push(S(k.slabOf({ x: x + DIAL_R - 1, y: -2.4, w: 5, d: 4.8, r: 1.2 }, DIAL_Z + 2, 5, P, 3), { tone: "mid" }));
    out.push(S(k.slabOf({ x: x + DIAL_R + 3.6, y: -3.2, w: 2.6, d: 6.4, r: 1.2 }, DIAL_Z + 1.2, 6.6, P, 3), { tone: "mid" }));
    out.push(L(k.ring(x, y, 1.6, DIAL_TOP, P, 16), { tone: "mid" }));
    out.push(k.faceTextSvg(k.topMatrix([x, y + 9], DIAL_TOP, P, "x"), "0.01", { size: 2.4, tone: "lo", anchor: "middle" }));
    return out.join("");
  }

  const needleAngle = (BLOCKS[0] / PER_TURN) * Math.PI * 2;
  const needlePath = k.lineOnTop(
    [DIAL[0] - Math.sin(needleAngle) * 3.4, DIAL[1] + Math.cos(needleAngle) * 3.4],
    [DIAL[0] + Math.sin(needleAngle) * (DIAL_R - 4), DIAL[1] - Math.cos(needleAngle) * (DIAL_R - 4)],
    DIAL_TOP + 0.2,
    P
  );

  const body = [
    `<style>${k.ISO_CSS}</style>`,
    plate(),
    rails(),
    fixture(),
    carriage(),
    plunger(),
    dial(),
    `<path class="iso-line" data-tone="lit" d="${needlePath}" style="stroke-width:1.1"/>`
  ];

  return `<svg xmlns="http://www.w3.org/2000/svg" class="iso-svg iso" data-theme="${theme}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Dial indicator test rig illustration">
  ${body.join('\n  ')}
</svg>`;
}
