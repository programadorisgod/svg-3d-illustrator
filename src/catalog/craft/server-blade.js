import * as k from '../../engine/iso-kit.mjs';

/**
 * Modelo de Ilustración Técnica Isométrica: Data Center Server Blade (1U)
 * Chasis metálico con guías de rack, bahías de discos hot-swap frontales,
 * placa base con zócalos de memoria RAM (DIMMs), disipador de CPU con aletas,
 * condensadores y cable de fibra óptica acodado en el puerto posterior.
 */
export function renderServerBladeModel({
  width = 650,
  height = 460,
  theme = 'light'
} = {}) {
  // Bandeja del chasis del servidor (1U rack blade)
  const TRAY = { x: -85, y: -70, w: 170, d: 210, r: 6 };
  const TRAY_H = 18;
  const FRONT_Y = TRAY.y + TRAY.d;
  const REAR_Y = TRAY.y;

  const P = k.fitProjection(
    [...k.boxCorners(TRAY, -6, TRAY_H + 32)],
    width,
    height,
    { pad: 32, azimuth: 52, elevation: 32 }
  );

  const at = (point) => k.iso(point, P);
  const S = (paths, style) => k.solidSvg(paths, style);
  const L = (d, style) => k.lineSvg(d, style);
  const D = (points, style) => k.dotsSvg(points, style);
  const byDepth = (points) => [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));

  // 1. Chasis metálico y rieles telescópicos
  function chassis() {
    const out = [];
    // Sombra de contacto
    out.push(`<path class="iso-halo" d="${k.haloOf(TRAY, -6, 6, P)}"/>`);

    // Rieles telescópicos laterales
    for (const rx of [TRAY.x - 3.2, TRAY.x + TRAY.w + 0.2]) {
      const rail = { x: rx, y: TRAY.y + 15, w: 3, d: TRAY.d - 30, r: 1 };
      out.push(S(k.slabOf(rail, 4, 8, P, 3, 0.4), { tone: "lo" }));
      // Ranuras de fijación del riel
      for (let sy = rail.y + 20; sy < rail.y + rail.d - 20; sy += 35) {
        out.push(S(k.slabOf({ x: rx + 0.5, y: sy, w: 2, d: 12, r: 0.6 }, 6, 4, P, 2), { tone: "mid" }));
      }
    }

    // Bandeja base del chasis
    out.push(S(k.slabOf(TRAY, 0, TRAY_H, P, 6, 1.4), { tone: "mid" }));
    // Ranura de pliegue de chapa
    out.push(L(k.planOutline(k.insetPlan(TRAY, 3), TRAY_H, P, 6), { tone: "lo" }));

    // Tornillos de fijación del chasis
    const chassisScrews = k.corners(TRAY, 8);
    out.push(L(chassisScrews.map(([x, y]) => k.ring(x, y, 2, TRAY_H, P, 16)).join(""), { tone: "lo" }));
    out.push(D(chassisScrews.map(([x, y]) => at([x, y, TRAY_H])), { size: 0.45 }));

    return out.join("");
  }

  // 2. Bahías frontales de discos Hot-Swap y panel de control
  function frontBays() {
    const out = [];
    const bayCount = 4;
    const bayW = (TRAY.w - 24) / bayCount;
    const bayD = 40;
    const bayZ = 3;
    const bayH = TRAY_H - 4;

    for (let i = 0; i < bayCount; i++) {
      const bx = TRAY.x + 8 + i * (bayW + 2);
      const by = FRONT_Y - bayD;
      const bay = { x: bx, y: by, w: bayW, d: bayD, r: 1.5 };

      // Bandeja del disco
      out.push(S(k.slabOf(bay, bayZ, bayH, P, 3, 0.6), { tone: "hi" }));
      
      // Pestillo / palanca de extracción en el frontal
      const latch = { x: bx + 3, y: FRONT_Y - 3, w: bayW - 6, d: 2.5, r: 0.8 };
      out.push(S(k.slabOf(latch, bayZ + 2, 4, P, 2), { tone: "mid" }));

      // Ranuras de ventilación perforadas en la bahía
      for (let rz = bayZ + 7; rz < bayZ + bayH - 4; rz += 2.4) {
        out.push(L(k.lineOnTop([bx + 4, FRONT_Y - 0.5], [bx + bayW - 4, FRONT_Y - 0.5], rz, P), { tone: "lo", free: true }));
      }

      // LEDs de estado (Verde actividad / Ámbar fallo)
      const ledX = bx + bayW - 5;
      out.push(D([at([ledX, FRONT_Y + 0.2, bayZ + bayH - 3])], { size: 0.55, tone: "green" }));
      out.push(D([at([ledX - 3.5, FRONT_Y + 0.2, bayZ + bayH - 3])], { size: 0.45, tone: "lo" }));
    }

    // Botón de encendido e ID del servidor a la derecha
    const pwrX = TRAY.x + TRAY.w - 5;
    out.push(S(k.cylinder(pwrX - 2, FRONT_Y, 1.6, bayZ + 8, 1.2, P, 16), { tone: "hi" }));
    out.push(D([at([pwrX - 2, FRONT_Y + 0.2, bayZ + 4])], { size: 0.6, tone: "blue" }));

    return out.join("");
  }

  // 3. Placa base (Motherboard PCB) y componentes internos
  function motherboard() {
    const out = [];
    const pcb = { x: TRAY.x + 5, y: TRAY.y + 6, w: TRAY.w - 10, d: TRAY.d - 54, r: 2 };
    const pcbZ = 3;
    const pcbH = 1.6;

    // Sustrato PCB
    out.push(S(k.slabOf(pcb, pcbZ, pcbH, P, 4, 0.3), { tone: "lo" }));
    
    // Tornillos de fijación PCB (Standoffs con anillo de masa)
    const pcbScrews = [
      [pcb.x + 8, pcb.y + 8],
      [pcb.x + pcb.w - 8, pcb.y + 8],
      [pcb.x + 8, pcb.y + pcb.d - 8],
      [pcb.x + pcb.w - 8, pcb.y + pcb.d - 8],
      [pcb.x + pcb.w / 2, pcb.y + pcb.d / 2 - 10]
    ];
    out.push(L(pcbScrews.map(([sx, sy]) => k.ring(sx, sy, 2.2, pcbZ + pcbH, P, 16)).join(""), { tone: "hi" }));
    out.push(D(pcbScrews.map(([sx, sy]) => at([sx, sy, pcbZ + pcbH])), { size: 0.45, tone: "mid" }));

    return out.join("");
  }

  // 4. Disipador de calor de la CPU (Heatsink con aletas densas)
  function cpuHeatsink() {
    const out = [];
    const hs = { x: -22, y: 15, w: 44, d: 46, r: 2 };
    const baseZ = 4.6;
    const baseH = 4;
    const finH = 22; // Altura de las aletas

    // Bloque base de cobre / vapor chamber
    out.push(S(k.slabOf(hs, baseZ, baseH, P, 4, 0.6), { tone: "hi" }));

    // Tornillos tensores del socket CPU con resortes
    const socketScrews = [
      [hs.x + 3, hs.y + 3],
      [hs.x + hs.w - 3, hs.y + 3],
      [hs.x + 3, hs.y + hs.d - 3],
      [hs.x + hs.w - 3, hs.y + hs.d - 3]
    ];
    for (const [sx, sy] of socketScrews) {
      out.push(S(k.cylinder(sx, sy, 2.2, baseZ + baseH, 3, P, 16), { tone: "mid" }));
      out.push(D([at([sx, sy, baseZ + baseH + 3])], { size: 0.5, tone: "lo" }));
    }

    // Aletas de disipación (Array de láminas de aluminio en paralelo)
    const finCount = 13;
    const finGap = (hs.d - 4) / finCount;
    for (let f = 0; f < finCount; f++) {
      const fy = hs.y + 2 + f * finGap;
      const fin = { x: hs.x + 1, y: fy, w: hs.w - 2, d: 1.2, r: 0.4 };
      out.push(S(k.slabOf(fin, baseZ + baseH, finH, P, 2, 0.2), { tone: f % 2 === 0 ? "hi" : "mid" }));
    }

    return out.join("");
  }

  // 5. Bancos de memoria RAM (DIMMs con clips de retención)
  function ramBanks() {
    const out = [];
    const dimmCount = 4;
    const dimmW = 3.2;
    const dimmD = 48;
    const dimmH = 16;
    const baseZ = 4.6;

    // Banco izquierdo
    const leftStartX = -62;
    for (let i = 0; i < dimmCount; i++) {
      const dx = leftStartX + i * 7.5;
      const dimm = { x: dx, y: 14, w: dimmW, d: dimmD, r: 0.8 };
      
      // Ranura / socket DIMM
      out.push(S(k.slabOf({ x: dx - 0.8, y: 11, w: dimmW + 1.6, d: dimmD + 6, r: 1 }, baseZ, 2.4, P, 2), { tone: "lo" }));
      // Módulo de memoria RAM
      out.push(S(k.slabOf(dimm, baseZ + 2, dimmH, P, 2, 0.4), { tone: "hi" }));
      // Chips DRAM grabados en la superficie
      for (let cy = dimm.y + 6; cy < dimm.y + dimm.d - 6; cy += 8.5) {
        out.push(L(k.planOutline({ x: dx + dimmW, y: cy, w: 0.6, d: 5.5, r: 0.3 }, baseZ + 6, P, 2), { tone: "lo" }));
      }
      // Clips de retención en los extremos
      out.push(S(k.slabOf({ x: dx - 0.4, y: 11.5, w: dimmW + 0.8, d: 2, r: 0.5 }, baseZ + 2, 8, P, 2), { tone: "mid" }));
      out.push(S(k.slabOf({ x: dx - 0.4, y: dimm.y + dimm.d + 1.5, w: dimmW + 0.8, d: 2, r: 0.5 }, baseZ + 2, 8, P, 2), { tone: "mid" }));
    }

    // Banco derecho
    const rightStartX = 34;
    for (let i = 0; i < dimmCount; i++) {
      const dx = rightStartX + i * 7.5;
      const dimm = { x: dx, y: 14, w: dimmW, d: dimmD, r: 0.8 };
      
      // Ranura
      out.push(S(k.slabOf({ x: dx - 0.8, y: 11, w: dimmW + 1.6, d: dimmD + 6, r: 1 }, baseZ, 2.4, P, 2), { tone: "lo" }));
      // Módulo
      out.push(S(k.slabOf(dimm, baseZ + 2, dimmH, P, 2, 0.4), { tone: "hi" }));
      // Chips DRAM
      for (let cy = dimm.y + 6; cy < dimm.y + dimm.d - 6; cy += 8.5) {
        out.push(L(k.planOutline({ x: dx, y: cy, w: 0.6, d: 5.5, r: 0.3 }, baseZ + 6, P, 2), { tone: "lo" }));
      }
      // Clips
      out.push(S(k.slabOf({ x: dx - 0.4, y: 11.5, w: dimmW + 0.8, d: 2, r: 0.5 }, baseZ + 2, 8, P, 2), { tone: "mid" }));
      out.push(S(k.slabOf({ x: dx - 0.4, y: dimm.y + dimm.d + 1.5, w: dimmW + 0.8, d: 2, r: 0.5 }, baseZ + 2, 8, P, 2), { tone: "mid" }));
    }

    // Hilera de condensadores de estado sólido VRM
    for (let ci = 0; ci < 6; ci++) {
      const capY = -3 + ci * 6;
      out.push(S(k.cylinder(-2, capY, 2.2, baseZ, 7, P, 18, 0.4), { tone: "mid" }));
      out.push(D([at([-2, capY, baseZ + 7])], { size: 0.35, tone: "lo" }));
    }

    return out.join("");
  }

  // 6. Panel posterior, puertos SFP+ y cable de red acodado
  function rearPortsAndCable() {
    const out = [];
    const portZ = 5;

    // Caja blindada del transceptor dual SFP+ (10G/25G)
    const sfp = { x: -48, y: REAR_Y - 4, w: 26, d: 18, r: 1.2 };
    out.push(S(k.slabOf(sfp, portZ, 10, P, 3, 0.5), { tone: "hi" }));
    out.push(L(k.planOutline(k.insetPlan(sfp, 1.8), portZ + 10, P, 3), { tone: "lo" }));

    // Jaula del conector posterior
    out.push(S(k.slabOf({ x: -45, y: REAR_Y - 7, w: 10, d: 4, r: 0.8 }, portZ + 1.5, 7, P, 2), { tone: "lo" }));
    out.push(S(k.slabOf({ x: -33, y: REAR_Y - 7, w: 10, d: 4, r: 0.8 }, portZ + 1.5, 7, P, 2), { tone: "lo" }));

    // Conector metálico de fibra (SFP latch) conectado en el puerto izquierdo
    const plug = { x: -44, y: REAR_Y - 14, w: 8, d: 8, r: 1 };
    out.push(S(k.slabOf(plug, portZ + 2, 6, P, 2, 0.4), { tone: "mid" }));
    // Pestaña de extracción (pull tab naranja/azul)
    out.push(S(k.slabOf({ x: -43, y: REAR_Y - 17, w: 6, d: 3, r: 0.6 }, portZ + 3.5, 2.5, P, 2), { tone: "hi", lit: true }));

    // Bota de alivio de tensión (strain relief boot)
    const boot = { x: -42.5, y: REAR_Y - 24, w: 5, d: 8, r: 1.4 };
    out.push(S(k.slabOf(boot, portZ + 2.5, 5, P, 3), { tone: "lo" }));

    // Cable de fibra óptica acodado saliendo hacia atrás y la izquierda
    const cableRoute = [
      [-40, REAR_Y - 24, portZ + 5],
      [-40, REAR_Y - 42, portZ + 5],
      [-55, REAR_Y - 58, portZ + 2],
      [-85, REAR_Y - 68, 0],
      [-110, REAR_Y - 74, 0]
    ];
    const cablePath = k.pathOf(cableRoute.map(pt => at(pt)));
    out.push(`<path class="iso-line" data-tone="hi" d="${cablePath}" style="stroke-width: 2.2px; stroke-linecap: round; stroke-linejoin: round;" />`);
    out.push(`<path class="iso-line" data-tone="lit" d="${cablePath}" style="stroke-width: 0.8px; stroke-linecap: round; stroke-linejoin: round;" />`);

    return out.join("");
  }

  const body = [
    `<style>${k.ISO_CSS}</style>`,
    chassis(),
    motherboard(),
    cpuHeatsink(),
    ramBanks(),
    frontBays(),
    rearPortsAndCable()
  ];

  return `<svg xmlns="http://www.w3.org/2000/svg" class="iso-svg iso" data-theme="${theme}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Data Center Server Blade 1U Isometric Illustration">
  ${body.join('\n  ')}
</svg>`;
}
