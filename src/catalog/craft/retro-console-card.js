import * as k from '../../engine/iso-kit.mjs';

const escapeXml = (str = '') =>
  String(str)
    .replace(/&(?!amp;|lt;|gt;|quot;|apos;)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

/**
 * Modelo Pop-Sticker & 3D Extruded: "Retro Console / 8-Bit Pixel Heart"
 * Estilo Neo-Brutalista con gruesos trazos entintados, consola portátil estilo GameBoy
 * en color lavanda/púrpura o lima, cruceta negra D-pad, botones candy A/B,
 * pantalla retroiluminada con corazón 8-bit latiendo y burbuja de diálogo [❤️ LEVEL UP!].
 * Funciona tanto estático como animado con el switch del Studio.
 */
export function renderRetroConsoleCardModel({
  width = 620,
  height = 560,
  theme = 'light',
  mode = '2d',
  colorMode = 'color',
  palette = 'vibrant',
  animate = 'float',
  showPlate = true,
  brandText = 'RETRO PLAY',
  statusText = 'LEVEL UP!'
} = {}) {
  // 1. Vista 2D Sticker Neo-Brutalista
  function build2D() {
    const out = [];

    // Placa/Marco exterior suave de fondo (Ocultable con "No Plate")
    out.push(`<g class="iso-base-plate" data-layer="base">
      <g transform="translate(310, 280)">
        <rect x="-188" y="-235" width="376" height="470" rx="30" class="rc-backdrop-card" />
      </g>
    </g>`);

    // Tarjeta Pop-Sticker centrada y de frente (0°)
    out.push(`
    <g transform="translate(310, 280)">
      <!-- Sombra dura desplazada del chasis de la consola -->
      <g data-layer="base">
        <rect x="-132" y="-172" width="264" height="344" rx="26" class="rc-hard-shadow" />
      </g>

      <!-- Cuerpo Chasis de la Consola Gameboy Portátil -->
      <g data-layer="main">
        <!-- Chasis Lila/Lavanda entintado -->
        <rect x="-140" y="-180" width="264" height="344" rx="24" class="rc-chassis-bg" />

        <!-- Ranuras de ventilación / detalles superiores -->
        <line x1="-100" y1="-165" x2="-60" y2="-165" class="rc-slot-line" />
        <line x1="-50" y1="-165" x2="-10" y2="-165" class="rc-slot-line" />
        <circle cx="100" cy="-165" r="4" fill="#ef4444" stroke="#0b0e14" stroke-width="2.5" />

        <!-- Marco Exterior de la Pantalla Gris Oscuro -->
        <g transform="translate(0, -78)">
          <rect x="-105" y="-62" width="210" height="136" rx="14" class="rc-screen-frame" />
          <line x1="-105" y1="-44" x2="105" y2="-44" stroke="#0b0e14" stroke-width="2.5" />
          <text x="-95" y="-50" class="rc-screen-badge">8-BIT MATRIX</text>
          <circle cx="92" cy="-52" r="3" fill="#10b981" />

          <!-- Pantalla Interior Verde Retroiluminada (Game Boy Matrix) -->
          <rect x="-76" y="-36" width="152" height="98" rx="8" class="rc-lcd-matrix" />

          <!-- Corazón de Píxeles 8-Bit (Latiendo con animación) -->
          <g class="rc-heart-pulse" transform="translate(0, 10)">
            <!-- Rejilla de píxeles formando un corazón retro -->
            <rect x="-24" y="-20" width="10" height="10" fill="#064e3b" />
            <rect x="-14" y="-20" width="10" height="10" fill="#064e3b" />
            <rect x="4" y="-20" width="10" height="10" fill="#064e3b" />
            <rect x="14" y="-20" width="10" height="10" fill="#064e3b" />

            <rect x="-34" y="-10" width="10" height="10" fill="#064e3b" />
            <rect x="-24" y="-10" width="10" height="10" fill="#064e3b" />
            <rect x="-14" y="-10" width="10" height="10" fill="#064e3b" />
            <rect x="-4" y="-10" width="10" height="10" fill="#064e3b" />
            <rect x="6" y="-10" width="10" height="10" fill="#064e3b" />
            <rect x="16" y="-10" width="10" height="10" fill="#064e3b" />
            <rect x="24" y="-10" width="10" height="10" fill="#064e3b" />

            <rect x="-34" y="0" width="10" height="10" fill="#064e3b" />
            <rect x="-24" y="0" width="10" height="10" fill="#064e3b" />
            <rect x="-14" y="0" width="10" height="10" fill="#064e3b" />
            <rect x="-4" y="0" width="10" height="10" fill="#064e3b" />
            <rect x="6" y="0" width="10" height="10" fill="#064e3b" />
            <rect x="16" y="0" width="10" height="10" fill="#064e3b" />
            <rect x="24" y="0" width="10" height="10" fill="#064e3b" />

            <rect x="-24" y="10" width="10" height="10" fill="#064e3b" />
            <rect x="-14" y="10" width="10" height="10" fill="#064e3b" />
            <rect x="-4" y="10" width="10" height="10" fill="#064e3b" />
            <rect x="6" y="10" width="10" height="10" fill="#064e3b" />
            <rect x="14" y="10" width="10" height="10" fill="#064e3b" />

            <rect x="-14" y="20" width="10" height="10" fill="#064e3b" />
            <rect x="-4" y="20" width="10" height="10" fill="#064e3b" />
            <rect x="4" y="20" width="10" height="10" fill="#064e3b" />

            <rect x="-4" y="30" width="10" height="10" fill="#064e3b" />
          </g>
        </g>

        <!-- Marca de la consola "RETRO PLAY" -->
        <text x="0" y="22" class="rc-brand-title">${escapeXml(brandText)}</text>

        <!-- Controles Inferiores (D-Pad Cruceta a la izquierda, Botones A/B a la derecha) -->
        <g transform="translate(0, 68)">
          <!-- D-Pad Cruceta Negra entintada -->
          <g transform="translate(-64, 18)">
            <!-- Sombra del D-pad -->
            <path d="M -10 -28 H 10 V -10 H 28 V 10 H 10 V 28 H -10 V 10 H -28 V -10 H -10 Z" transform="translate(3, 4)" class="rc-hard-shadow" />
            <!-- Cruceta entintada -->
            <path d="M -10 -28 H 10 V -10 H 28 V 10 H 10 V 28 H -10 V 10 H -28 V -10 H -10 Z" fill="#0b0e14" stroke="#0b0e14" stroke-width="3" stroke-linejoin="round" />
            <circle cx="0" cy="0" r="4.5" fill="#1e293b" />
          </g>

          <!-- Botones Candy A y B Diagonales (Magenta y Cian) -->
          <g transform="translate(56, 16)">
            <!-- Botón B (Cian) -->
            <g transform="translate(-18, 12)">
              <circle cx="0" cy="0" r="14" class="rc-hard-shadow" transform="translate(2, 3)" />
              <circle cx="0" cy="0" r="14" fill="#06b6d4" stroke="#0b0e14" stroke-width="3.6" />
              <text x="0" y="5" class="rc-btn-label">B</text>
            </g>
            <!-- Botón A (Magenta) -->
            <g transform="translate(16, -10)">
              <circle cx="0" cy="0" r="14" class="rc-hard-shadow" transform="translate(2, 3)" />
              <circle cx="0" cy="0" r="14" fill="#f43f5e" stroke="#0b0e14" stroke-width="3.6" />
              <text x="0" y="5" class="rc-btn-label">A</text>
            </g>
          </g>

          <!-- Botones Select y Start en píldoras inclinadas -->
          <g transform="translate(-18, 62) rotate(-22)">
            <rect x="-12" y="-4" width="24" height="8" rx="4" fill="#475569" stroke="#0b0e14" stroke-width="2.5" />
          </g>
          <g transform="translate(18, 62) rotate(-22)">
            <rect x="-12" y="-4" width="24" height="8" rx="4" fill="#475569" stroke="#0b0e14" stroke-width="2.5" />
          </g>
        </g>

        <!-- Altavoces / Rejilla acústica en la esquina inferior derecha -->
        <g transform="translate(85, 134) rotate(-28)">
          <line x1="-12" y1="-6" x2="12" y2="-6" stroke="#0b0e14" stroke-width="3.5" stroke-linecap="round" />
          <line x1="-12" y1="0" x2="12" y2="0" stroke="#0b0e14" stroke-width="3.5" stroke-linecap="round" />
          <line x1="-12" y1="6" x2="12" y2="6" stroke="#0b0e14" stroke-width="3.5" stroke-linecap="round" />
        </g>

        <!-- Contorno exterior grueso entintado del chasis -->
        <rect x="-140" y="-180" width="264" height="344" rx="24" fill="none" class="rc-ink-stroke" />
      </g>

      <!-- Burbuja Emergente Sticker [❤️ LEVEL UP!] (Layer Detail) -->
      <g data-layer="detail" transform="translate(45, -135) rotate(-6)">
        <!-- Sombra dura de la burbuja -->
        <rect x="-70" y="-20" width="140" height="40" rx="20" class="rc-hard-shadow" transform="translate(4, 4)" />
        <!-- Píldora amarilla vibrante entintada -->
        <rect x="-70" y="-20" width="140" height="40" rx="20" class="rc-bubble-bg" />
        <text x="-56" y="6" class="rc-bubble-icon">❤️</text>
        <text x="-30" y="6" class="rc-bubble-text">${escapeXml(statusText)}</text>
      </g>
    </g>`);

    return out.join('\n    ');
  }

  // 2. Vista 3D Volumétrica Extruida por Capas
  function build3D() {
    const CHASSIS = { x: -85, y: -115, w: 170, d: 230, r: 16 };
    const P = k.fitProjection(
      [...k.boxCorners(CHASSIS, -10, 48)],
      width,
      height,
      { pad: 34, azimuth: 44, elevation: 34, mode: '3d', palette }
    );

    const S = (paths, style) => k.solidSvg(paths, { palette, ...style });
    const out = [];

    // Placa exterior de fondo (Ocultable con "No Plate")
    const outerTray = { x: -102, y: -130, w: 204, d: 260, r: 20 };
    out.push(`<g class="iso-base-plate" data-layer="base">
      <path class="iso-halo" d="${k.haloOf(outerTray, -10, 8, P)}"/>
      ${S(k.slabOf(outerTray, -8, 8, P, 8, 1.4), { tone: "lo", color: "panel" })}
    </g>`);

    // Sombra dura 3D y Chasis Principal de la Consola Extruido
    const shadowSlab = { x: CHASSIS.x - 6, y: CHASSIS.y + 8, w: CHASSIS.w, d: CHASSIS.d, r: CHASSIS.r };
    out.push(`<g data-layer="main">
      ${S(k.slabOf(shadowSlab, 0, 5, P, 8, 0.5), { tone: "hi", color: "slate" })}
      ${S(k.slabOf(CHASSIS, 5, 14, P, 8, 1.4), { tone: "hi", color: "primary" })}
    </g>`);

    // Marco de Pantalla Extruido y LCD 3D
    const screenFrame = { x: -65, y: -95, w: 130, d: 90, r: 10 };
    const lcdPlan = { x: -50, y: -80, w: 100, d: 65, r: 6 };
    out.push(`<g data-layer="main">
      ${S(k.slabOf(screenFrame, 19, 4, P, 6, 0.8), { tone: "hi", color: "chassis" })}
      ${S(k.slabOf(lcdPlan, 23, 2, P, 4, 0.6), { tone: "hi", color: "stem" })}
      ${k.faceTextSvg(k.topMatrix([0, -42], 25.5, P, "x"), "❤️ LEVEL UP", { size: 12, tone: "lit", anchor: "middle" })}
    </g>`);

    // Controles 3D: D-Pad y Botones Candy
    const dpadZ = 19;
    out.push(`<g data-layer="detail">
      <!-- D-Pad Cruceta 3D -->
      ${S(k.slabOf({ x: -54, y: 15, w: 14, d: 42, r: 3 }, dpadZ, 5, P, 3), { tone: "hi", color: "slate" })}
      ${S(k.slabOf({ x: -68, y: 29, w: 42, d: 14, r: 3 }, dpadZ, 5, P, 3), { tone: "hi", color: "slate" })}

      <!-- Botones A/B Cilíndricos 3D -->
      ${S(k.cylinder(36, 26, 10, dpadZ, 6, P, 24, 0.8), { tone: "hi", color: "accent" })}
      ${S(k.cylinder(58, 10, 10, dpadZ, 6, P, 24, 0.8), { tone: "hi", color: "petal" })}
    </g>`);

    return out.join('\n    ');
  }

  const customCss = `
  .rc-backdrop-card{fill:var(--anatomy-shade-2);stroke:var(--anatomy-lo);stroke-width:1.2px}
  .iso[data-color-mode="color"] .rc-backdrop-card{fill:#f5f3ff;stroke:#ddd6fe}
  .rc-hard-shadow{fill:#0b0e14;stroke:#0b0e14;stroke-width:3px;stroke-linejoin:round}
  .rc-chassis-bg{fill:var(--anatomy-top)}
  .iso[data-color-mode="color"] .rc-chassis-bg{fill:var(--pal-primary,#8b5cf6)}
  .rc-slot-line{stroke:#0b0e14;stroke-width:3.5px;stroke-linecap:round}
  .rc-screen-frame{fill:#1e293b;stroke:#0b0e14;stroke-width:4px}
  .rc-screen-badge{fill:#94a3b8;font-family:ui-monospace,monospace;font-size:9px;font-weight:700;letter-spacing:0.05em}
  .rc-lcd-matrix{fill:#86efac;stroke:#0b0e14;stroke-width:3.5px}
  .rc-brand-title{fill:#ffffff;font-family:"Comic Sans MS","Chalkboard SE","Marker Felt",ui-rounded,system-ui,sans-serif;font-size:22px;font-weight:800;letter-spacing:0.04em;text-anchor:middle}
  .rc-btn-label{fill:#ffffff;font-family:ui-rounded,system-ui,sans-serif;font-size:12px;font-weight:900;text-anchor:middle}
  .rc-bubble-bg{fill:var(--pal-accent,#facc15);stroke:#0b0e14;stroke-width:3.8px}
  .rc-bubble-icon{font-size:17px}
  .rc-bubble-text{fill:#0b0e14;font-family:"Comic Sans MS","Chalkboard SE",ui-rounded,system-ui,sans-serif;font-size:17px;font-weight:800;letter-spacing:0.02em}
  .rc-ink-stroke{stroke:#0b0e14;stroke-width:4.4px;stroke-linecap:round;stroke-linejoin:round}
  @keyframes rc-heart-beat{0%,100%{transform:scale(1)}30%{transform:scale(1.22)}60%{transform:scale(1.08)}}
  .iso-svg:not([data-animate="static"]) .rc-heart-pulse{animation:rc-heart-beat 0.9s ease-in-out infinite;transform-origin:center;transform-box:fill-box}
  `;

  return k.wrapDualModeSvg({
    width,
    height,
    theme,
    mode,
    colorMode,
    palette,
    animate,
    showPlate,
    label: "Retro Console Pop-Sticker and 3D Card Illustration",
    extraCss: customCss,
    view3d: build3D(),
    view2d: build2D()
  });
}
