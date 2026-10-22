import * as k from '../../engine/iso-kit.mjs';

const escapeXml = (str = '') =>
  String(str)
    .replace(/&(?!amp;|lt;|gt;|quot;|apos;)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

/**
 * Modelo de Ilustración Neo-Vector / Pop Sticker UI (2D Plano y 3D Extruido):
 * "Astral Bot" Chat & Voice Note Card (Réplica de la Imagen 4)
 * En 2D Plano reproduce el estilo Sticker Neo-Brutalista con bordes gruesos entintados,
 * sombras sólidas desplazadas, paloma vectorial en el avatar, nota de voz con onda animada
 * y recordatorio con check verde. En 3D proyecta y extruye la tarjeta y sus burbujas en capas.
 */
export function renderAstralBotCardModel({
  width = 620,
  height = 560,
  theme = 'light',
  mode = '2d', // Por defecto inicia en 2D Sticker como en la imagen de referencia, conmutable a 3D en el Studio
  colorMode = 'color',
  palette = 'vibrant',
  animate = 'float',
  showPlate = true,
  screenText = 'Astral Bot',
  durationText = '0:14',
  reminderLine1 = 'Recordatorio',
  reminderLine2 = 'guardado]'
} = {}) {
  // Alturas de las 15 barras de la onda de audio en la burbuja verde
  const WAVE_BARS = [12, 26, 15, 29, 14, 24, 34, 20, 32, 16, 26, 30, 18, 12, 8];

  // 1. Vista 2D Sticker Neo-Brutalista (Fiel a la Imagen 4)
  function build2D() {
    const out = [];

    // Placa/Tarjeta exterior suave centrada y de frente (Ocultable con "No Plate (BG Ready)")
    out.push(`<g class="iso-base-plate" data-layer="base">
      <g transform="translate(310, 280)">
        <rect x="-188" y="-235" width="376" height="470" rx="30" class="ab-backdrop-card" />
      </g>
    </g>`);

    // Ondas de audio compactadas (paso 8.8px) para que quepan 100% dentro de la burbuja verde
    const waveBarsSvg = WAVE_BARS.map((bh, idx) => {
      const bx = -24 + idx * 8.8;
      const y1 = -bh / 2;
      const y2 = bh / 2;
      const delay = (idx * 90) % 900;
      return `<line x1="${bx.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${bx.toFixed(1)}" y2="${y2.toFixed(1)}" class="ab-wave-bar" style="--wave-delay:${delay}ms" />`;
    }).join('');

    out.push(`
    <g transform="translate(310, 284)">
      <!-- Sombra dura desplazada del marco principal (Hard Offset Block Shadow) -->
      <g data-layer="base">
        <rect x="-144" y="-154" width="296" height="318" rx="22" class="ab-hard-shadow" />
      </g>

      <!-- Cuerpo de la Ventana Principal -->
      <g data-layer="main">
        <!-- Fondo interior de la tarjeta -->
        <rect x="-148" y="-158" width="296" height="318" rx="20" class="ab-window-bg" />

        <!-- Barra Superior Azul ("Astral Bot") recortada a las esquinas superiores -->
        <clipPath id="ab-header-clip">
          <rect x="-148" y="-158" width="296" height="318" rx="20" />
        </clipPath>
        <g clip-path="url(#ab-header-clip)">
          <rect x="-152" y="-162" width="304" height="82" class="ab-header-fill" />
          <line x1="-152" y1="-80" x2="156" y2="-80" class="ab-ink-stroke" />
        </g>

        <!-- Brillos especulares blancos en la esquina superior derecha del Header -->
        <circle cx="106" cy="-146" r="2.2" fill="#ffffff" />
        <circle cx="118" cy="-146" r="3.4" fill="#ffffff" />
        <path d="M 129 -145 Q 141 -144 141 -131" fill="none" stroke="#ffffff" stroke-width="5.2" stroke-linecap="round" />
        <circle cx="141" cy="-120" r="2.4" fill="#ffffff" />
        <circle cx="143" cy="-112" r="1.4" fill="#ffffff" />

        <!-- Avatar Circular Blanco con Ilustración del Ave/Paloma -->
        <g transform="translate(-102, -120)">
          <circle cx="0" cy="0" r="24" fill="#ffffff" />
          <!-- Trazos vectoriales del ave con ramita en el pico -->
          <path d="M -16 -9 C -8 -8 -2 -3 1 3 C 3 -4 9 -7 15 -5 C 10 -1 7 4 4 9 C -1 15 -9 16 -16 12" fill="none" class="ab-bird-stroke" />
          <path d="M -14 -2 C -7 -1 -3 2 -1 6" fill="none" class="ab-bird-stroke" />
          <path d="M -17 6 C -9 8 -2 7 3 2" fill="none" class="ab-bird-stroke" />
          <!-- Ramita de olivo en el pico -->
          <path d="M 13 -5 L 19 -9 M 16 -7 L 15 -10 M 18 -8 L 20 -6" fill="none" class="ab-bird-stroke" />
        </g>

        <!-- Título "Astral Bot" -->
        <text x="-64" y="-109" class="ab-header-title">${escapeXml(screenText)}</text>

        <!-- Contorno exterior grueso entintado de la ventana -->
        <rect x="-148" y="-158" width="296" height="318" rx="20" fill="none" class="ab-ink-stroke" />
      </g>

      <!-- Capas de Burbujas de Chat (Layer Detail con animación) -->
      <g data-layer="detail">
        <!-- 1. Burbuja Superior: Nota de Voz Verde (Centrada y amplia) -->
        <g transform="translate(14, -28)">
          <!-- Sombra dura desplazada bajo la burbuja de audio -->
          <path d="M -76 -24 H 74 A 28 28 0 0 1 102 4 V 6 A 28 28 0 0 1 90 29 Q 96 36 105 38 Q 88 39 77 33 H -76 A 28 28 0 0 1 -104 5 V 4 A 28 28 0 0 1 -76 -24 Z" transform="translate(4, 5)" class="ab-hard-shadow" />
          <!-- Cuerpo verde de la burbuja de audio con cola a la derecha -->
          <path d="M -76 -24 H 74 A 28 28 0 0 1 102 4 V 6 A 28 28 0 0 1 90 29 Q 96 36 105 38 Q 88 39 77 33 H -76 A 28 28 0 0 1 -104 5 V 4 A 28 28 0 0 1 -76 -24 Z" class="ab-voice-bubble" />

          <!-- Botón Play Blanco -->
          <path d="M -76 -8 L -54 4 L -76 16 Z" fill="#ffffff" stroke="#ffffff" stroke-width="3" stroke-linejoin="round" />

          <!-- 15 Barras de Onda de Audio (Alineadas cómodamente) -->
          <g transform="translate(-18, 2)">
            ${waveBarsSvg}
          </g>

          <!-- Duración 0:14 -->
          <text x="56" y="25" class="ab-duration-text">${escapeXml(durationText)}</text>
        </g>

        <!-- 2. Burbuja Inferior: Respuesta "[✅ Recordatorio guardado]" (Ampliada generosamente) -->
        <g transform="translate(-14, 68)">
          <!-- Sombra dura desplazada -->
          <path d="M -102 -28 H 102 A 18 18 0 0 1 120 -10 V 32 A 18 18 0 0 1 102 50 H -98 Q -110 56 -126 55 Q -115 47 -113 37 A 18 18 0 0 1 -120 24 V -10 A 18 18 0 0 1 -102 -28 Z" transform="translate(-4, 5)" class="ab-hard-shadow" />
          <!-- Cuerpo blanco de la burbuja con cola a la izquierda -->
          <path d="M -102 -28 H 102 A 18 18 0 0 1 120 -10 V 32 A 18 18 0 0 1 102 50 H -98 Q -110 56 -126 55 Q -115 47 -113 37 A 18 18 0 0 1 -120 24 V -10 A 18 18 0 0 1 -102 -28 Z" class="ab-reply-bubble" />

          <!-- Corchete de apertura "[" -->
          <text x="-106" y="3" class="ab-reply-text">[</text>

          <!-- Icono Check Verde Cuadrado -->
          <g transform="translate(-92, -18)">
            <rect x="0" y="0" width="26" height="26" rx="6" class="ab-check-box" />
            <path d="M 6 13.5 L 11.5 19 L 21 6.5" fill="none" stroke="#ffffff" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round" />
          </g>

          <!-- Texto en dos líneas con amplio margen para la 'o' -->
          <text x="-56" y="3" class="ab-reply-text">${escapeXml(reminderLine1)}</text>
          <text x="-57" y="30" class="ab-reply-text">${escapeXml(reminderLine2)}</text>
        </g>
      </g>
    </g>`);

    return out.join('\n    ');
  }

  // 2. Vista 3D Volumétrica por Capas Extruidas (Pop-Up 3D Card)
  function build3D() {
    const CARD = { x: -95, y: -110, w: 190, d: 220, r: 14 };
    const P = k.fitProjection(
      [...k.boxCorners(CARD, -10, 42)],
      width,
      height,
      { pad: 34, azimuth: 44, elevation: 34, mode: '3d', palette }
    );

    const at = (pt) => k.iso(pt, P);
    const S = (paths, style) => k.solidSvg(paths, { palette, ...style });
    const L = (d, style) => k.lineSvg(d, { palette, ...style });
    const D = (pts, style) => k.dotsSvg(pts, style);

    const out = [];

    // Placa exterior de fondo (Ocultable con "No Plate")
    const outerTray = { x: -112, y: -126, w: 224, d: 252, r: 18 };
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

    // Barra Superior Azul Extruida ("Astral Bot")
    const headerPlan = { x: CARD.x + 2, y: CARD.y + 2, w: CARD.w - 4, d: 52, r: 12 };
    const headerZ = 15;
    const headerH = 5;
    out.push(`<g data-layer="main">
      ${S(k.slabOf(headerPlan, headerZ, headerH, P, 6, 0.8), { tone: "hi", color: "primary" })}
      <!-- Avatar Circular 3D -->
      ${S(k.cylinder(CARD.x + 30, CARD.y + 28, 15, headerZ + headerH, 3.5, P, 32, 0.6), { tone: "hi", color: "chassis" })}
      ${L(k.ring(CARD.x + 30, CARD.y + 28, 10, headerZ + headerH + 3.6, P, 24), { tone: "hi", color: "primary" })}
      ${k.faceTextSvg(k.topMatrix([CARD.x + 54, CARD.y + 33], headerZ + headerH + 0.5, P, "x"), screenText, { size: 14, tone: "lit", anchor: "start" })}
    </g>`);

    // Burbuja de Nota de Voz Verde Extruida en 3D con Barras de Audio Volumétricas
    const voicePlan = { x: -38, y: -38, w: 120, d: 44, r: 20 };
    const voiceZ = 15;
    const voiceH = 7;
    const bars3d = [];
    for (let i = 0; i < 10; i++) {
      const bx = -8 + i * 8.2;
      const barLen = 8 + (i % 3) * 7;
      const barPlan = { x: bx, y: -16 - barLen / 2, w: 3.2, d: barLen, r: 1 };
      bars3d.push(S(k.slabOf(barPlan, voiceZ + voiceH, 2.5, P, 2), { tone: "hi", color: "stem" }));
    }
    out.push(`<g data-layer="detail">
      ${S(k.slabOf(voicePlan, voiceZ, voiceH, P, 8, 1.0), { tone: "hi", color: "leaf" })}
      ${S(k.cylinder(-22, -16, 7.5, voiceZ + voiceH, 2.5, P, 3, 0.4), { tone: "hi", color: "chassis" })}
      ${bars3d.join("")}
    </g>`);

    // Burbuja Inferior de Respuesta "[✅ Recordatorio guardado]" Extruida en 3D
    const replyPlan = { x: -84, y: 22, w: 144, d: 58, r: 12 };
    const replyZ = 15;
    const replyH = 7;
    const checkPlan = { x: -60, y: 32, w: 22, d: 22, r: 4 };
    out.push(`<g data-layer="detail">
      ${S(k.slabOf(replyPlan, replyZ, replyH, P, 6, 1.0), { tone: "hi", color: "chassis" })}
      <!-- Corchete de apertura 3D "[" -->
      ${k.faceTextSvg(k.topMatrix([-72, 48], replyZ + replyH + 0.5, P, "x"), "[", { size: 16, tone: "hi", anchor: "middle" })}
      <!-- Check box verde 3D -->
      ${S(k.slabOf(checkPlan, replyZ + replyH, 3, P, 3, 0.5), { tone: "hi", color: "leaf" })}
      <!-- Textos 3D de Recordatorio guardado] -->
      ${k.faceTextSvg(k.topMatrix([-30, 46], replyZ + replyH + 0.5, P, "x"), reminderLine1, { size: 11, tone: "hi", anchor: "start" })}
      ${k.faceTextSvg(k.topMatrix([-30, 64], replyZ + replyH + 0.5, P, "x"), reminderLine2, { size: 11, tone: "hi", anchor: "start" })}
    </g>`);

    return out.join('\n    ');
  }

  const customCss = `
  .ab-backdrop-card{fill:var(--anatomy-shade-2);stroke:var(--anatomy-lo);stroke-width:1.2px}
  .iso[data-color-mode="color"] .ab-backdrop-card{fill:#e4effd;stroke:#c7dcf8}
  .ab-hard-shadow{fill:var(--anatomy-hi);stroke:#0b0e14;stroke-width:3px;stroke-linejoin:round}
  .iso[data-color-mode="color"] .ab-hard-shadow{fill:#0b0e14;stroke:#0b0e14}
  .ab-window-bg{fill:var(--anatomy-top)}
  .iso[data-color-mode="color"] .ab-window-bg{fill:#f2f7ff}
  .ab-header-fill{fill:var(--anatomy-shade-0)}
  .iso[data-color-mode="color"] .ab-header-fill{fill:var(--pal-primary,#1648d8)}
  .ab-ink-stroke{stroke:var(--anatomy-hi);stroke-width:4.4px;stroke-linecap:round;stroke-linejoin:round}
  .iso[data-color-mode="color"] .ab-ink-stroke{stroke:#0b0e14}
  .ab-bird-stroke{stroke:var(--anatomy-hi);stroke-width:2px;stroke-linecap:round;stroke-linejoin:round}
  .iso[data-color-mode="color"] .ab-bird-stroke{stroke:var(--pal-primary,#1648d8)}
  .ab-header-title{fill:var(--anatomy-top);font-family:"Comic Sans MS","Chalkboard SE","Marker Felt",ui-rounded,system-ui,sans-serif;font-size:31px;font-weight:700;letter-spacing:.01em}
  .iso[data-color-mode="color"] .ab-header-title{fill:#ffffff}
  .ab-voice-bubble{fill:var(--anatomy-shade-1);stroke:var(--anatomy-hi);stroke-width:4.2px;stroke-linejoin:round}
  .iso[data-color-mode="color"] .ab-voice-bubble{fill:var(--pal-leaf,#36c959);stroke:#0b0e14}
  .ab-wave-bar{stroke:var(--anatomy-hi);stroke-width:4.2px;stroke-linecap:round;transform-box:fill-box;transform-origin:center}
  .iso[data-color-mode="color"] .ab-wave-bar{stroke:#092210}
  @keyframes ab-wave-eq{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.45)}}
  .iso-svg:not([data-animate="static"]) .ab-wave-bar{animation:ab-wave-eq 1.1s ease-in-out infinite;animation-delay:var(--wave-delay,0ms)}
  .ab-duration-text{fill:var(--anatomy-hi);font-family:"Comic Sans MS","Chalkboard SE",ui-rounded,system-ui,sans-serif;font-size:13.5px;font-weight:700}
  .iso[data-color-mode="color"] .ab-duration-text{fill:#092210}
  .ab-reply-bubble{fill:var(--anatomy-top);stroke:var(--anatomy-hi);stroke-width:4.2px;stroke-linejoin:round}
  .iso[data-color-mode="color"] .ab-reply-bubble{fill:#ffffff;stroke:#0b0e14}
  .ab-check-box{fill:var(--anatomy-hi)}
  .iso[data-color-mode="color"] .ab-check-box{fill:var(--pal-leaf,#09d668)}
  .ab-reply-text{fill:var(--anatomy-hi);font-family:"Comic Sans MS","Chalkboard SE",ui-rounded,system-ui,sans-serif;font-size:25px;font-weight:700}
  .iso[data-color-mode="color"] .ab-reply-text{fill:#0b0e14}
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
    label: "Astral Bot Neo-Vector Sticker & 3D Card Illustration",
    extraCss: customCss,
    view3d: build3D(),
    view2d: build2D()
  });
}
