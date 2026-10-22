import * as k from '../../engine/iso-kit.mjs';
import * as org from '../../engine/organic-kit.mjs';

/**
 * Modelo de Ilustración Técnica (2D Plano y 3D Isométrico): Data Center Server Blade (1U)
 * Chasis metálico con guías de rack, bahías de discos hot-swap frontales,
 * placa base con zócalos de memoria RAM (DIMMs), disipador de CPU con aletas,
 * banco de condensadores VRM en la etapa trasera de potencia (sin solapar el disipador)
 * y cable de fibra óptica 3D en el puerto posterior SFP+.
 */
export function renderServerBladeModel({
  width = 650,
  height = 460,
  theme = 'light',
  mode = '3d',
  colorMode = 'mono',
  palette = 'cyber-neon',
  animate = 'static',
  showPlate = true
} = {}) {
  const TRAY = { x: -85, y: -70, w: 170, d: 210, r: 6 };
  const TRAY_H = 18;
  const FRONT_Y = TRAY.y + TRAY.d;
  const REAR_Y = TRAY.y;

  function buildView(viewMode) {
    const P = k.fitProjection(
      [...k.boxCorners(TRAY, -6, TRAY_H + 32)],
      width,
      height,
      {
        pad: 32,
        azimuth: viewMode === '2d' ? 0 : 52,
        elevation: viewMode === '2d' ? 88 : 32,
        mode: viewMode,
        palette
      }
    );

    const at = (point) => k.iso(point, P);
    const S = (paths, style) => k.solidSvg(paths, { palette, ...style });
    const L = (d, style) => k.lineSvg(d, { palette, ...style });
    const D = (points, style) => k.dotsSvg(points, style);

    function chassis() {
      const out = [];
      out.push(`<path class="iso-halo" d="${k.haloOf(TRAY, -6, 6, P)}"/>`);

      for (const rx of [TRAY.x - 3.2, TRAY.x + TRAY.w + 0.2]) {
        const rail = { x: rx, y: TRAY.y + 15, w: 3, d: TRAY.d - 30, r: 1 };
        out.push(S(k.slabOf(rail, 4, 8, P, 3, 0.4), { tone: "lo", color: "panel" }));
        for (let sy = rail.y + 20; sy < rail.y + rail.d - 20; sy += 35) {
          out.push(S(k.slabOf({ x: rx + 0.5, y: sy, w: 2, d: 12, r: 0.6 }, 6, 4, P, 2), { tone: "mid", color: "chassis" }));
        }
      }

      out.push(S(k.slabOf(TRAY, 0, TRAY_H, P, 6, 1.4), { tone: "mid", color: "chassis" }));
      out.push(L(k.planOutline(k.insetPlan(TRAY, 3), TRAY_H, P, 6), { tone: "lo" }));

      const chassisScrews = k.corners(TRAY, 8);
      out.push(L(chassisScrews.map(([x, y]) => k.ring(x, y, 2, TRAY_H, P, 16)).join(""), { tone: "lo" }));
      out.push(D(chassisScrews.map(([x, y]) => at([x, y, TRAY_H])), { size: 0.45 }));

      return `<g class="iso-base-plate" data-layer="base">${out.join("")}</g>`;
    }

    function motherboard() {
      const out = [];
      const pcb = { x: TRAY.x + 6, y: TRAY.y + 8, w: TRAY.w - 12, d: TRAY.d - 56, r: 2.5 };
      const pcbZ = 14.5;
      const pcbH = 2.0;

      out.push(S(k.slabOf(pcb, pcbZ, pcbH, P, 4, 0.4), { tone: "lo", color: "pcb" }));

      // Pistas de circuito impreso (traces) grabadas en la placa base
      for (let tx = -36; tx <= 36; tx += 9) {
        out.push(L(k.lineOnTop([tx, pcb.y + 14], [tx, pcb.y + 52], pcbZ + pcbH + 0.1, P), { tone: "faint", free: true }));
      }

      const pcbScrews = [
        [pcb.x + 8, pcb.y + 8],
        [pcb.x + pcb.w - 8, pcb.y + 8],
        [pcb.x + 8, pcb.y + pcb.d - 8],
        [pcb.x + pcb.w - 8, pcb.y + pcb.d - 8]
      ];
      out.push(L(pcbScrews.map(([sx, sy]) => k.ring(sx, sy, 2.2, pcbZ + pcbH, P, 16)).join(""), { tone: "hi", color: "gold" }));
      out.push(D(pcbScrews.map(([sx, sy]) => at([sx, sy, pcbZ + pcbH])), { size: 0.45, tone: "mid" }));

      return `<g data-layer="main">${out.join("")}</g>`;
    }

    // Etapa trasera: Puertos SFP+, cable óptico 3D y banco VRM (ubicado en y = -28, DETRÁS del disipador CPU)
    function rearStageAndVrm() {
      const out = [];
      const baseZ = 16.5;

      // Cable de fibra óptica 3D con volumen saliendo hacia atrás
      out.push(
        org.renderCurvedStem({
          points: [
            [-40, REAR_Y - 14, baseZ + 3],
            [-42, REAR_Y - 34, baseZ + 2],
            [-64, REAR_Y - 52, baseZ - 4],
            [-95, REAR_Y - 62, 4]
          ],
          radiusBottom: 1.8,
          radiusTop: 1.5,
          P,
          color: "accent",
          palette,
          layer: "detail"
        })
      );

      // Caja blindada del transceptor dual SFP+ (10G/25G)
      const sfp = { x: -52, y: REAR_Y - 2, w: 28, d: 20, r: 1.4 };
      out.push(S(k.slabOf(sfp, baseZ, 9, P, 3, 0.5), { tone: "hi", color: "panel" }));
      out.push(L(k.planOutline(k.insetPlan(sfp, 1.8), baseZ + 9, P, 3), { tone: "lo" }));

      // Conector SFP enchufado
      const plug = { x: -45, y: REAR_Y - 10, w: 9, d: 8, r: 1 };
      out.push(S(k.slabOf(plug, baseZ + 1.5, 5.5, P, 2, 0.4), { tone: "mid", color: "secondary" }));
      out.push(S(k.slabOf({ x: -43.5, y: REAR_Y - 14, w: 6, d: 4, r: 0.6 }, baseZ + 2.5, 3, P, 2), { tone: "hi", color: "gold" }));

      // Hilera de 6 condensadores VRM posicionados en x: -20..20, y: -26 (detrás del CPU, sin tocar las aletas)
      for (let ci = 0; ci < 6; ci++) {
        const capX = -20 + ci * 8;
        const capY = -26;
        out.push(S(k.cylinder(capX, capY, 2.4, baseZ, 6.5, P, 18, 0.4), { tone: "mid", color: "copper" }));
        out.push(D([at([capX, capY, baseZ + 6.5])], { size: 0.38, tone: "lo" }));
      }

      return `<g data-layer="detail">${out.join("")}</g>`;
    }

    function ramAndCpuStage() {
      const out = [];
      const baseZ = 16.5;
      const dimmCount = 4;
      const dimmW = 3.2;
      const dimmD = 50;
      const dimmH = 14;

      // 1. Banco RAM izquierdo (x: -64..-41, más lejano en X)
      for (let i = 0; i < dimmCount; i++) {
        const dx = -64 + i * 7.5;
        const dimm = { x: dx, y: 4, w: dimmW, d: dimmD, r: 0.8 };
        out.push(S(k.slabOf({ x: dx - 0.8, y: 1, w: dimmW + 1.6, d: dimmD + 6, r: 1 }, baseZ, 2.2, P, 2), { tone: "lo", color: "panel" }));
        out.push(S(k.slabOf(dimm, baseZ + 2, dimmH, P, 2, 0.4), { tone: "hi", color: "gold" }));
        out.push(S(k.slabOf({ x: dx - 0.4, y: 1.5, w: dimmW + 0.8, d: 2, r: 0.5 }, baseZ + 2, 7, P, 2), { tone: "mid", color: "chassis" }));
        out.push(S(k.slabOf({ x: dx - 0.4, y: dimm.y + dimm.d + 1.5, w: dimmW + 0.8, d: 2, r: 0.5 }, baseZ + 2, 7, P, 2), { tone: "mid", color: "chassis" }));
      }

      // 2. Disipador de calor CPU central (x: -22..22, y: 4..50)
      const hs = { x: -22, y: 4, w: 44, d: 48, r: 2 };
      const baseH = 3.5;
      const finH = 19;

      // Bloque base de cobre
      out.push(S(k.slabOf(hs, baseZ, baseH, P, 4, 0.6), { tone: "hi", color: "copper" }));

      // Aletas de aluminio ordenadas de atrás (y menor) hacia adelante (y mayor)
      const finCount = 12;
      const finGap = (hs.d - 4) / finCount;
      for (let f = 0; f < finCount; f++) {
        const fy = hs.y + 2.5 + f * finGap;
        const fin = { x: hs.x + 1.5, y: fy, w: hs.w - 3, d: 1.4, r: 0.4 };
        out.push(S(k.slabOf(fin, baseZ + baseH, finH, P, 2, 0.2), { tone: f % 2 === 0 ? "hi" : "mid", color: f % 2 === 0 ? "primary" : "secondary" }));
      }

      // 3. Banco RAM derecho (x: 36..59, más cercano en X)
      for (let i = 0; i < dimmCount; i++) {
        const dx = 36 + i * 7.5;
        const dimm = { x: dx, y: 4, w: dimmW, d: dimmD, r: 0.8 };
        out.push(S(k.slabOf({ x: dx - 0.8, y: 1, w: dimmW + 1.6, d: dimmD + 6, r: 1 }, baseZ, 2.2, P, 2), { tone: "lo", color: "panel" }));
        out.push(S(k.slabOf(dimm, baseZ + 2, dimmH, P, 2, 0.4), { tone: "hi", color: "gold" }));
        out.push(S(k.slabOf({ x: dx - 0.4, y: 1.5, w: dimmW + 0.8, d: 2, r: 0.5 }, baseZ + 2, 7, P, 2), { tone: "mid", color: "chassis" }));
        out.push(S(k.slabOf({ x: dx - 0.4, y: dimm.y + dimm.d + 1.5, w: dimmW + 0.8, d: 2, r: 0.5 }, baseZ + 2, 7, P, 2), { tone: "mid", color: "chassis" }));
      }

      return `<g data-layer="detail">${out.join("")}</g>`;
    }

    function frontBays() {
      const out = [];
      const bayCount = 4;
      const bayW = (TRAY.w - 22) / bayCount;
      const bayD = 36;
      const bayZ = 14.5;
      const bayH = 12;

      for (let i = 0; i < bayCount; i++) {
        const bx = TRAY.x + 8 + i * (bayW + 2);
        const by = FRONT_Y - bayD - 3;
        const bay = { x: bx, y: by, w: bayW, d: bayD, r: 1.8 };

        // Cuerpo del caddy Hot-Swap
        out.push(S(k.slabOf(bay, bayZ, bayH, P, 3, 0.6), { tone: "hi", color: "panel" }));
        out.push(L(k.planOutline(k.insetPlan(bay, 2.2), bayZ + bayH, P, 3), { tone: "faint" }));

        // Botón de liberación del pestillo en la cara superior-frontal del caddy
        const releaseBtn = { x: bx + 3, y: by + bayD - 7, w: bayW - 12, d: 4.5, r: 0.8 };
        out.push(S(k.slabOf(releaseBtn, bayZ + bayH, 1.4, P, 2), { tone: "mid", color: "secondary" }));

        // LEDs de actividad y salud en la esquina derecha de cada bahía
        const ledX = bx + bayW - 4.5;
        const ledY = by + bayD - 4.5;
        out.push(D([at([ledX, ledY, bayZ + bayH + 0.5])], { size: 0.65, tone: "green", pulse: true }));
        out.push(D([at([ledX, ledY - 3.2, bayZ + bayH + 0.5])], { size: 0.5, tone: "blue" }));
      }

      return `<g data-layer="main">${out.join("")}</g>`;
    }

    return [
      chassis(),
      motherboard(),
      rearStageAndVrm(),
      ramAndCpuStage(),
      frontBays()
    ].join('\n    ');
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
    label: "Data Center Server Blade 1U Illustration (2D & 3D)",
    view3d: buildView('3d'),
    view2d: buildView('2d')
  });
}
