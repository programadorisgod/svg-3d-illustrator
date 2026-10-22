/**
 * Motor de Animaciones Vectoriales 2D y 3D (Inspirado en renatoworks/3dsvg)
 * Se incrusta como CSS puro dentro del SVG para que el archivo descargado
 * conserve sus animaciones en cualquier sitio web, README o visor sin dependencias.
 */

export const ANIMATION_PRESETS = {
  static: {
    id: 'static',
    name: 'Static',
    description: 'Sin animación de movimiento global (mantiene pulsos de telemetría si existen)'
  },
  float: {
    id: 'float',
    name: 'Float',
    description: 'Levitación vertical suave con respiración de sombra en el suelo e inercia por capas'
  },
  spin: {
    id: 'spin',
    name: 'Spin / Orbit',
    description: 'Rotación continua suave (orbital en 3D, giro concéntrico en 2D)'
  },
  pulse: {
    id: 'pulse',
    name: 'Pulse',
    description: 'Latido rítmico de escala y énfasis luminoso en las capas principales'
  },
  wobble: {
    id: 'wobble',
    name: 'Wobble',
    description: 'Balanceo orgánico tridimensional con inclinación suave'
  },
  swing: {
    id: 'swing',
    name: 'Swing',
    description: 'Movimiento pendular armónico alrededor del eje central'
  },
  'spin-float': {
    id: 'spin-float',
    name: 'Spin + Float',
    description: 'Combinación de levitación vertical y giro orbital con parallax entre capas'
  },
  bloom: {
    id: 'bloom',
    name: 'Bloom / Breathe',
    description: 'Apertura radial orgánica por capas (ideal para flores, nodos y arquitecturas)'
  }
};

export const ANIMATION_CSS = `
.iso-svg{
  --anim-speed:1;
}
.iso-svg .iso-scene-root,
.iso-svg [data-layer],
.iso-svg .iso-halo,
.iso-svg .iso-petal-ring{
  transform-box:fill-box;
  transform-origin:center center;
}

@keyframes svg3d-float{
  0%,100%{transform:translateY(0px)}
  50%{transform:translateY(-10px)}
}
@keyframes svg3d-float-detail{
  0%,100%{transform:translateY(0px)}
  50%{transform:translateY(-14px)}
}
@keyframes svg3d-halo-breathe{
  0%,100%{transform:translateY(3px) scale(1);opacity:var(--anatomy-halo-opacity,.32)}
  50%{transform:translateY(3px) scale(.92);opacity:calc(var(--anatomy-halo-opacity,.32) * .65)}
}
@keyframes svg3d-spin-2d{
  0%{transform:rotate(0deg)}
  100%{transform:rotate(360deg)}
}
@keyframes svg3d-spin-3d{
  0%{transform:rotate(0deg) skewX(0deg) scale(1)}
  25%{transform:rotate(4deg) skewX(3deg) scale(.98)}
  50%{transform:rotate(0deg) skewX(0deg) scale(1.02)}
  75%{transform:rotate(-4deg) skewX(-3deg) scale(.98)}
  100%{transform:rotate(0deg) skewX(0deg) scale(1)}
}
@keyframes svg3d-pulse{
  0%,100%{transform:scale(1)}
  50%{transform:scale(1.045)}
}
@keyframes svg3d-wobble{
  0%,100%{transform:rotate(0deg) skewY(0deg) translateY(0px)}
  25%{transform:rotate(-2.8deg) skewY(1.8deg) translateY(-4px)}
  75%{transform:rotate(2.8deg) skewY(-1.8deg) translateY(-2px)}
}
@keyframes svg3d-swing{
  0%,100%{transform:rotate(0deg)}
  25%{transform:rotate(5deg)}
  75%{transform:rotate(-5deg)}
}
@keyframes svg3d-spin-float{
  0%,100%{transform:translateY(0px) rotate(0deg) scale(1)}
  25%{transform:translateY(-6px) rotate(2.5deg) scale(1.01)}
  50%{transform:translateY(-12px) rotate(0deg) scale(1.025)}
  75%{transform:translateY(-6px) rotate(-2.5deg) scale(1.01)}
}
@keyframes svg3d-bloom{
  0%,100%{transform:scale(1) rotate(0deg)}
  50%{transform:scale(1.055) rotate(2.5deg)}
}
@keyframes svg3d-bloom-inner{
  0%,100%{transform:scale(1) rotate(0deg)}
  50%{transform:scale(1.09) rotate(-4deg)}
}

/* Preset: FLOAT */
.iso-svg[data-animate="float"] .iso-scene-root{
  animation:svg3d-float calc(4.2s / var(--anim-speed, 1)) ease-in-out infinite;
}
.iso-svg[data-animate="float"] [data-layer="detail"]{
  animation:svg3d-float-detail calc(4.2s / var(--anim-speed, 1)) ease-in-out infinite;
}
.iso-svg[data-animate="float"] .iso-halo{
  animation:svg3d-halo-breathe calc(4.2s / var(--anim-speed, 1)) ease-in-out infinite;
}

/* Preset: SPIN */
.iso-svg[data-animate="spin"][data-mode="2d"] .iso-scene-root{
  animation:svg3d-spin-2d calc(16s / var(--anim-speed, 1)) linear infinite;
}
.iso-svg[data-animate="spin"]:not([data-mode="2d"]) .iso-scene-root{
  animation:svg3d-spin-3d calc(7s / var(--anim-speed, 1)) ease-in-out infinite;
}

/* Preset: PULSE */
.iso-svg[data-animate="pulse"] .iso-scene-root{
  animation:svg3d-pulse calc(2.8s / var(--anim-speed, 1)) ease-in-out infinite;
}
.iso-svg[data-animate="pulse"] [data-layer="detail"]{
  animation:svg3d-pulse calc(2.8s / var(--anim-speed, 1)) ease-in-out infinite 0.2s;
}

/* Preset: WOBBLE */
.iso-svg[data-animate="wobble"] .iso-scene-root{
  animation:svg3d-wobble calc(4.6s / var(--anim-speed, 1)) ease-in-out infinite;
}

/* Preset: SWING */
.iso-svg[data-animate="swing"] .iso-scene-root{
  transform-origin:center 20%;
  animation:svg3d-swing calc(3.8s / var(--anim-speed, 1)) ease-in-out infinite;
}

/* Preset: SPIN-FLOAT */
.iso-svg[data-animate="spin-float"] .iso-scene-root{
  animation:svg3d-spin-float calc(5.2s / var(--anim-speed, 1)) ease-in-out infinite;
}
.iso-svg[data-animate="spin-float"] [data-layer="detail"]{
  animation:svg3d-float-detail calc(5.2s / var(--anim-speed, 1)) ease-in-out infinite;
}
.iso-svg[data-animate="spin-float"] .iso-halo{
  animation:svg3d-halo-breathe calc(5.2s / var(--anim-speed, 1)) ease-in-out infinite;
}

/* Preset: BLOOM */
.iso-svg[data-animate="bloom"] .iso-scene-root{
  animation:svg3d-float calc(5s / var(--anim-speed, 1)) ease-in-out infinite;
}
.iso-svg[data-animate="bloom"] [data-layer="main"]{
  animation:svg3d-bloom calc(4.4s / var(--anim-speed, 1)) ease-in-out infinite;
}
.iso-svg[data-animate="bloom"] [data-layer="detail"]{
  animation:svg3d-bloom-inner calc(4.4s / var(--anim-speed, 1)) ease-in-out infinite;
}
`;
