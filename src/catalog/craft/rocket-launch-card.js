import * as k from '../../engine/iso-kit.mjs';

const escapeXml = (str = '') =>
  String(str)
    .replace(/&(?!amp;|lt;|gt;|quot;|apos;)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

/**
 * Modelo Pop-Sticker & 3D Extruded: "Mission Orbit / Cyber Rocket"
 * Estilo Neo-Brutalista con gruesos trazos entintados (4px), sombras sólidas desplazadas,
 * cohete retro estilizado, propulsor con llama vibrante, nubes de humo puff entintadas,
 * estrellas con destellos y badge de despegue [🚀 T-0:00 LIFTOFF].
 * Funciona tanto estático como en movimiento con las animaciones integradas.
 */
export function renderRocketLaunchCardModel({
  width = 620,
  height = 560,
  theme = 'light',
  mode = '2d',
  colorMode = 'color',
  palette = 'vibrant',
  animate = 'float',
  showPlate = true,
  missionText = 'Mission Orbit',
  badgeText = 'T-0:00 LIFTOFF'
} = {}) {
  // 1. Vista 2D Sticker Neo-Brutalista
  function build2D() {
    const out = [];

    // Placa/Marco exterior suave de fondo (Ocultable con "No Plate")
    out.push(`<g class="iso-base-plate" data-layer="base">
      <g transform="translate(310, 280)">
        <rect x="-188" y="-235" width="376" height="470" rx="30" class="rk-backdrop-card" />
      </g>
    </g>`);

    // Tarjeta Pop-Sticker centrada y de frente (0°)
    out.push(`
    <g transform="translate(310, 280)">
      <!-- Sombra dura desplazada del marco principal (Hard Offset Block Shadow) -->
      <g data-layer="base">
        <rect x="-144" y="-148" width="288" height="308" rx="22" class="rk-hard-shadow" />
      </g>

      <!-- Cuerpo de la Ventana Principal Sticker -->
      <g data-layer="main">
        <rect x="-152" y="-156" width="288" height="308" rx="20" class="rk-window-bg" />

        <!-- Cabecera Naranja/Coral recortada con clips -->
        <clipPath id="rk-header-clip">
          <rect x="-152" y="-156" width="288" height="308" rx="20" />
        </clipPath>
        <g clip-path="url(#rk-header-clip)">
          <rect x="-156" y="-160" width="298" height="78" class="rk-header-fill" />
          <line x1="-156" y1="-82" x2="148" y2="-82" class="rk-ink-stroke" />
        </g>

        <!-- Planeta Anillado Sticker en la esquina superior izquierda -->
        <g transform="translate(-108, -122)">
          <circle cx="0" cy="0" r="16" fill="#facc15" stroke="#0b0e14" stroke-width="3.6" />
          <!-- Anillo de Saturno entintado -->
          <ellipse cx="0" cy="0" rx="25" ry="7" fill="none" stroke="#0b0e14" stroke-width="3.6" transform="rotate(-25)" />
        </g>

        <!-- Título "Mission Orbit" en cabecera -->
        <text x="-76" y="-112" class="rk-header-title">${escapeXml(missionText)}</text>

        <!-- Brillos de destello blanco en cabecera -->
        <circle cx="110" cy="-142" r="3.2" fill="#ffffff" />
        <path d="M 118 -140 Q 130 -138 128 -124" fill="none" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" />

        <!-- Estrellas y destellos de 4 puntas en el espacio interior -->
        <g transform="translate(-95, -28)">
          <path d="M 0 -10 Q 0 0 10 0 Q 0 0 0 10 Q 0 0 -10 0 Q 0 0 0 -10 Z" fill="#facc15" stroke="#0b0e14" stroke-width="2.5" />
        </g>
        <g transform="translate(98, -45)">
          <path d="M 0 -7 Q 0 0 7 0 Q 0 0 0 7 Q 0 0 -7 0 Q 0 0 0 -7 Z" fill="#67e8f9" stroke="#0b0e14" stroke-width="2" />
        </g>
        <circle cx="-110" cy="40" r="4" fill="#0b0e14" />
        <circle cx="108" cy="30" r="5" fill="#f43f5e" stroke="#0b0e14" stroke-width="2" />
      </g>

      <!-- Cohete Espacial Central y Llamas (Layer Detail) -->
      <g data-layer="detail">
        <!-- Nubes de humo Puff en la base -->
        <g transform="translate(0, 78)">
          <!-- Sombra dura de la nube -->
          <path d="M -70 20 Q -80 0 -50 -5 Q -30 -30 10 -25 Q 45 -35 65 -5 Q 85 5 70 24 Z" transform="translate(4, 5)" class="rk-hard-shadow" />
          <!-- Nube blanca puff entintada -->
          <path d="M -70 20 Q -80 0 -50 -5 Q -30 -30 10 -25 Q 45 -35 65 -5 Q 85 5 70 24 Z" fill="#ffffff" stroke="#0b0e14" stroke-width="4.2" stroke-linejoin="round" />
        </g>

        <!-- Llama de propulsión de fuego -->
        <g transform="translate(0, 48)">
          <!-- Llama exterior amarilla -->
          <path d="M -16 0 C -22 25, -12 45, 0 55 C 12 45, 22 25, 16 0 Z" fill="#facc15" stroke="#0b0e14" stroke-width="3.5" class="rk-flame-pulse" />
          <!-- Llama interior naranja/roja -->
          <path d="M -9 0 C -12 18, -6 32, 0 38 C 6 32, 12 18, 9 0 Z" fill="#ef4444" />
        </g>

        <!-- Cohete Central Pop Sticker (Cuerpo cilíndrico, punta cónica, aletas y ventana circular) -->
        <g transform="translate(0, -6)">
          <!-- Sombra dura del cohete -->
          <g transform="translate(5, 6)">
            <!-- Aletas -->
            <path d="M -38 28 L -18 8 L -18 42 Z" class="rk-hard-shadow" />
            <path d="M 38 28 L 18 8 L 18 42 Z" class="rk-hard-shadow" />
            <!-- Fuselaje -->
            <path d="M -22 36 L -22 -10 Q 0 -62 0 -62 Q 0 -62 22 -10 L 22 36 Z" class="rk-hard-shadow" />
          </g>

          <!-- Aletas rojas laterales entintadas -->
          <path d="M -38 28 L -18 8 L -18 42 Z" fill="#f43f5e" stroke="#0b0e14" stroke-width="4.2" stroke-linejoin="round" />
          <path d="M 38 28 L 18 8 L 18 42 Z" fill="#f43f5e" stroke="#0b0e14" stroke-width="4.2" stroke-linejoin="round" />

          <!-- Fuselaje Blanco con punta Roja -->
          <clipPath id="rk-rocket-clip">
            <path d="M -22 36 L -22 -10 Q 0 -62 0 -62 Q 0 -62 22 -10 L 22 36 Z" />
          </clipPath>
          <g clip-path="url(#rk-rocket-clip)">
            <!-- Cuerpo blanco -->
            <rect x="-30" y="-70" width="60" height="120" fill="#ffffff" />
            <!-- Punta conica roja -->
            <path d="M -26 -16 Q 0 -64 0 -64 Q 0 -64 26 -16 Z" fill="#f43f5e" />
            <line x1="-24" y1="-16" x2="24" y2="-16" stroke="#0b0e14" stroke-width="4" />
            <!-- Franjas deportivas de velocidad -->
            <rect x="-24" y="22" width="48" height="7" fill="#6366f1" />
          </g>
          <!-- Contorno de tinta exterior del fuselaje -->
          <path d="M -22 36 L -22 -10 Q 0 -62 0 -62 Q 0 -62 22 -10 L 22 36 Z" fill="none" stroke="#0b0e14" stroke-width="4.4" stroke-linejoin="round" />

          <!-- Ojo de buey / Ventana circular celeste con reflejo -->
          <g transform="translate(0, 4)">
            <circle cx="0" cy="0" r="13" fill="#38bdf8" stroke="#0b0e14" stroke-width="3.8" />
            <path d="M -7 -4 Q 0 -10 6 -4" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" />
          </g>
        </g>

        <!-- Badge Inferior Píldora: [🚀 T-0:00 LIFTOFF] -->
        <g transform="translate(0, 96)">
          <!-- Sombra dura del badge -->
          <rect x="-84" y="-18" width="168" height="36" rx="18" class="rk-hard-shadow" transform="translate(3, 4)" />
          <!-- Píldora verde menta entintada -->
          <rect x="-84" y="-18" width="168" height="36" rx="18" class="rk-badge-bg" />
          <!-- Icono Cohete Mini y Texto -->
          <text x="-70" y="6" class="rk-badge-icon">🚀</text>
          <text x="-44" y="6" class="rk-badge-text">${escapeXml(badgeText)}</text>
        </g>

        <!-- Contorno exterior entintado de la tarjeta -->
        <rect x="-152" y="-156" width="288" height="308" rx="20" fill="none" class="rk-ink-stroke" />
      </g>
    </g>`);

    return out.join('\n    ');
  }

  // 2. Vista 3D Volumétrica Extruida por Capas
  function build3D() {
    const CARD = { x: -95, y: -105, w: 190, d: 210, r: 14 };
    const P = k.fitProjection(
      [...k.boxCorners(CARD, -10, 45)],
      width,
      height,
      { pad: 34, azimuth: 44, elevation: 34, mode: '3d', palette }
    );

    const S = (paths, style) => k.solidSvg(paths, { palette, ...style });
    const out = [];

    // Placa exterior de fondo (Ocultable con "No Plate")
    const outerTray = { x: -110, y: -120, w: 220, d: 240, r: 18 };
    out.push(`<g class="iso-base-plate" data-layer="base">
      <path class="iso-halo" d="${k.haloOf(outerTray, -10, 8, P)}"/>
      ${S(k.slabOf(outerTray, -8, 8, P, 8, 1.4), { tone: "lo", color: "panel" })}
    </g>`);

    // Sombra dura desplazada 3D y Cuerpo de la Ventana Principal
    const shadowSlab = { x: CARD.x - 6, y: CARD.y + 8, w: CARD.w, d: CARD.d, r: CARD.r };
    out.push(`<g data-layer="main">
      ${S(k.slabOf(shadowSlab, 0, 5, P, 8, 0.5), { tone: "hi", color: "slate" })}
      ${S(k.slabOf(CARD, 5, 10, P, 8, 1.4), { tone: "hi", color: "chassis" })}
    </g>`);

    // Cabecera Naranja Extruida ("Mission Orbit") + Planeta Saturno 3D
    const headerPlan = { x: CARD.x + 2, y: CARD.y + 2, w: CARD.w - 4, d: 50, r: 12 };
    out.push(`<g data-layer="main">
      ${S(k.slabOf(headerPlan, 15, 6, P, 6, 0.8), { tone: "hi", color: "primary" })}
      <!-- Planeta Saturno 3D en cabecera -->
      ${S(k.cylinder(CARD.x + 24, CARD.y + 24, 11, 21, 3.5, P, 24, 0.6), { tone: "hi", color: "accent" })}
      ${k.faceTextSvg(k.topMatrix([CARD.x + 44, CARD.y + 30], 21.5, P, "x"), missionText, { size: 14, tone: "lit", anchor: "start" })}
    </g>`);

    // Cohete 3D Pop Fiel (Fuselaje aerodinámico, punta roja, aletas laterales rojas, ventana y llamas)
    const rocketZ = 16;
    out.push(`<g data-layer="detail">
      <!-- Nube de humo puff base 3D -->
      ${S(k.slabOf({ x: -44, y: 38, w: 88, d: 28, r: 14 }, rocketZ, 5, P, 6, 0.8), { tone: "hi", color: "chassis" })}

      <!-- Llama propulsora de fuego 3D -->
      ${S(k.slabOf({ x: -14, y: 24, w: 28, d: 20, r: 8 }, rocketZ + 4, 4.5, P, 4, 0.6), { tone: "hi", color: "accent" })}
      ${S(k.slabOf({ x: -8, y: 26, w: 16, d: 14, r: 5 }, rocketZ + 8, 3, P, 4, 0.5), { tone: "hi", color: "petal" })}

      <!-- Aletas Laterales Rojas Extruidas (Alas izquierda y derecha) -->
      ${S(k.slabOf({ x: -36, y: 4, w: 18, d: 24, r: 4 }, rocketZ + 5, 5, P, 3, 0.5), { tone: "hi", color: "petal" })}
      ${S(k.slabOf({ x: 18, y: 4, w: 18, d: 24, r: 4 }, rocketZ + 5, 5, P, 3, 0.5), { tone: "hi", color: "petal" })}

      <!-- Fuselaje Principal Blanco del Cohete (Cuerpo central redondeado) -->
      ${S(k.slabOf({ x: -20, y: -24, w: 40, d: 52, r: 12 }, rocketZ + 6, 12, P, 6, 1.0), { tone: "hi", color: "chassis" })}

      <!-- Punta / Ojiva Cónica Roja Superior -->
      ${S(k.slabOf({ x: -15, y: -42, w: 30, d: 22, r: 9 }, rocketZ + 10, 9, P, 5, 0.8), { tone: "hi", color: "petal" })}

      <!-- Ojo de buey / Ventana circular celeste con relieve -->
      ${S(k.cylinder(0, -6, 9, rocketZ + 18, 3, P, 24, 0.5), { tone: "hi", color: "secondary" })}
      ${S(k.cylinder(0, -6, 5.5, rocketZ + 21, 1.5, P, 20, 0.3), { tone: "hi", color: "primary" })}

      <!-- Badge Inferior Píldora 3D: [🚀 T-0:00 LIFTOFF] -->
      ${S(k.slabOf({ x: -62, y: 64, w: 124, d: 28, r: 14 }, rocketZ + 12, 6, P, 6, 0.8), { tone: "hi", color: "leaf" })}
      ${k.faceTextSvg(k.topMatrix([0, 80], rocketZ + 18.5, P, "x"), "🚀 " + badgeText, { size: 10.5, tone: "hi", anchor: "middle" })}
    </g>`);

    return out.join('\n    ');
  }

  const customCss = `
  .rk-backdrop-card{fill:var(--anatomy-shade-2);stroke:var(--anatomy-lo);stroke-width:1.2px}
  .iso[data-color-mode="color"] .rk-backdrop-card{fill:#fdf2f8;stroke:#fbcfe8}
  .rk-hard-shadow{fill:#0b0e14;stroke:#0b0e14;stroke-width:3px;stroke-linejoin:round}
  .rk-window-bg{fill:var(--anatomy-top)}
  .iso[data-color-mode="color"] .rk-window-bg{fill:#fefce8}
  .rk-header-fill{fill:var(--anatomy-shade-0)}
  .iso[data-color-mode="color"] .rk-header-fill{fill:var(--pal-primary,#f97316)}
  .rk-ink-stroke{stroke:#0b0e14;stroke-width:4.4px;stroke-linecap:round;stroke-linejoin:round}
  .rk-header-title{fill:#ffffff;font-family:"Comic Sans MS","Chalkboard SE","Marker Felt",ui-rounded,system-ui,sans-serif;font-size:27px;font-weight:700}
  .rk-badge-bg{fill:var(--pal-leaf,#10b981);stroke:#0b0e14;stroke-width:4px}
  .rk-badge-icon{font-size:18px}
  .rk-badge-text{fill:#0b0e14;font-family:"Comic Sans MS","Chalkboard SE",ui-rounded,system-ui,sans-serif;font-size:16px;font-weight:800;letter-spacing:0.02em}
  @keyframes rk-flame-anim{0%,100%{transform:scale(1)}50%{transform:scale(1.15) translateY(2px)}}
  .iso-svg:not([data-animate="static"]) .rk-flame-pulse{animation:rk-flame-anim 0.4s ease-in-out infinite;transform-origin:top center}
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
    label: "Rocket Mission Pop-Sticker and 3D Card Illustration",
    extraCss: customCss,
    view3d: build3D(),
    view2d: build2D()
  });
}
