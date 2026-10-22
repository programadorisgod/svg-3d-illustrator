import * as k from "../../engine/iso-kit.mjs";
import * as org from "../../engine/organic-kit.mjs";

/**
 * Modelo de Ilustración Vectorial Botánica / Orgánica (2D Plano y 3D Volumétrico):
 * Bloom Flower (Flor de Loto / Rosa Botánica de Precisión)
 * Demuestra geometría orgánica curva, coronas de pétalos con nervaduras, tallo curvo,
 * hojas, estambres dorados y conmutación instantánea entre 2D/3D y Color/Blanco y Negro.
 */
export function renderBloomFlowerModel({
  width = 640,
  height = 520,
  theme = "light",
  mode = "3d", // '3d' o '2d'
  colorMode = "color", // 'color' o 'mono'
  palette = "botanical",
  animate = "bloom",
  showPlate = true,
  petalCount = 8
} = {}) {
  function buildProjectionView(viewMode) {
    const BOUND = { x: -95, y: -95, w: 190, d: 190, r: 20 };
    const P = k.fitProjection(
      [...k.boxCorners(BOUND, -16, 135)],
      width,
      height,
      {
        pad: 34,
        azimuth: viewMode === "2d" ? 0 : 46,
        elevation: viewMode === "2d" ? 88 : 32,
        mode: viewMode,
        palette
      }
    );

    const at = (pt) => k.iso(pt, P);
    const S = (paths, style) => k.solidSvg(paths, { palette, ...style });
    const L = (d, style) => k.lineSvg(d, { palette, ...style });
    const D = (pts, style) => k.dotsSvg(pts, style);

    const out = [];

    // 1. Base / Pedestal opcional (se puede ocultar con "Hide Base Plate" para modo Background-Ready)
    const baseParts = [];
    baseParts.push(`<path class="iso-halo" d="${k.haloOf({ x: -58, y: -58, w: 116, d: 116, r: 58 }, -12, 8, P)}"/>`);
    // Anillo botánico minimalista de base
    baseParts.push(S(k.cylinder(0, 0, 46, -10, 6, P, 48, 1.2), { tone: "mid", color: "panel" }));
    baseParts.push(S(k.cylinder(0, 0, 36, -4, 4, P, 40, 0.8), { tone: "lo", color: "chassis" }));
    baseParts.push(L(k.ring(0, 0, 41, -4, P, 48), { tone: "lo" }));
    const baseTicks = k.radialTicks(0, 0, 44, 36, 3, -4, [1.5, 3.2], P);
    baseParts.push(L(baseTicks.minor, { tone: "faint" }), L(baseTicks.major, { tone: "lo" }));
    out.push(`<g class="iso-base-plate" data-layer="base">${baseParts.join("")}</g>`);

    // 2. Tallo orgánico curvo y hojas inferiores ( sólo prominente en 3D, sutil en 2D )
    const stemGroup = [];
    if (viewMode === "3d") {
      stemGroup.push(
        org.renderCurvedStem({
          points: [
            [0, 0, 0],
            [-6, 4, 24],
            [4, -3, 52],
            [0, 0, 74]
          ],
          radiusBottom: 4.8,
          radiusTop: 3.2,
          P,
          color: "stem",
          palette,
          layer: "base"
        })
      );
    }

    // Hojas botánicas inferiores (Sépalos / Hojas de tallo)
    stemGroup.push(
      org.renderPetalRing({
        cx: 0,
        cy: 0,
        z: viewMode === "2d" ? 28 : 34,
        count: 4,
        angleOffset: 22,
        radiusOffset: 4,
        length: 56,
        width: 24,
        thickness: 2.2,
        tiltDeg: viewMode === "2d" ? 6 : 8,
        curl: 9,
        sharpness: 0.75,
        veins: true,
        P,
        color: "leaf",
        palette,
        tone: "hi",
        layer: "base"
      })
    );

    // Cáliz / Receptáculo floral bajo la corola
    stemGroup.push(S(k.cylinder(0, 0, 14, 66, 8, P, 32, 1.2), { tone: "mid", color: "stem", layer: "base" }));
    out.push(`<g data-layer="base">${stemGroup.join("")}</g>`);

    // 3. Corona Exterior de Pétalos Principales
    const outerCorolla = org.renderPetalRing({
      cx: 0,
      cy: 0,
      z: 72,
      count: petalCount,
      angleOffset: 0,
      radiusOffset: 9,
      length: 54,
      width: 25,
      thickness: 2.6,
      tiltDeg: viewMode === "2d" ? 10 : 20,
      curl: 7,
      sharpness: 0.55,
      veins: true,
      P,
      color: "petal-deep",
      palette,
      tone: "hi",
      layer: "main"
    });
    out.push(outerCorolla);

    // 4. Corona Intermedia de Pétalos (desfasada en ángulo y más elevada)
    const midCorolla = org.renderPetalRing({
      cx: 0,
      cy: 0,
      z: 78,
      count: petalCount,
      angleOffset: 180 / petalCount,
      radiusOffset: 7,
      length: 42,
      width: 20,
      thickness: 2.4,
      tiltDeg: viewMode === "2d" ? 18 : 36,
      curl: 5,
      sharpness: 0.5,
      veins: true,
      P,
      color: "petal",
      palette,
      tone: "hi",
      layer: "main"
    });
    out.push(midCorolla);

    // 5. Corona Interior de Pétalos Jóvenes + Núcleo Estaminado Dorado (Capa Detail)
    const innerDetails = [];
    innerDetails.push(
      org.renderPetalRing({
        cx: 0,
        cy: 0,
        z: 84,
        count: Math.max(5, Math.floor(petalCount * 0.75)),
        angleOffset: 15,
        radiusOffset: 5,
        length: 28,
        width: 14,
        thickness: 2.0,
        tiltDeg: viewMode === "2d" ? 26 : 52,
        curl: 3,
        sharpness: 0.45,
        veins: true,
        P,
        color: "petal",
        palette,
        tone: "hi",
        layer: "detail"
      })
    );

    // Botón central (Pistilo y corona de estambres dorados)
    const coreZ = 86;
    innerDetails.push(S(k.cylinder(0, 0, 11, coreZ, 6, P, 32, 1.4), { tone: "hi", color: "gold", layer: "detail" }));
    innerDetails.push(S(k.cylinder(0, 0, 6.5, coreZ + 6, 4, P, 24, 1.0), { tone: "hi", color: "accent", layer: "detail" }));

    // Filamentos y anteras (estambres radiales)
    const stamenCount = 16;
    const stamenDots = [];
    const stamenLines = [];
    for (let i = 0; i < stamenCount; i++) {
      const ang = (i / stamenCount) * Math.PI * 2;
      const r0 = 8.5;
      const r1 = 14.5;
      const x0 = Math.cos(ang) * r0;
      const y0 = Math.sin(ang) * r0;
      const x1 = Math.cos(ang) * r1;
      const y1 = Math.sin(ang) * r1;
      const zTip = coreZ + 9.5 + (i % 2) * 2;
      stamenLines.push(k.segment([x0, y0, coreZ + 4], [x1, y1, zTip], P));
      stamenDots.push(at([x1, y1, zTip]));
    }
    innerDetails.push(L(stamenLines.join(""), { tone: "hi", color: "gold" }));
    innerDetails.push(D(stamenDots, { size: 1.15, tone: "hi", pulse: true }));

    // Semillas geométricas en el centro del disco
    const centerSeeds = [
      at([0, 0, coreZ + 10.2]),
      ...Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return at([Math.cos(a) * 3.2, Math.sin(a) * 3.2, coreZ + 10.2]);
      })
    ];
    innerDetails.push(D(centerSeeds, { size: 0.75, tone: "hi" }));

    out.push(`<g data-layer="detail">${innerDetails.join("")}</g>`);

    return out.join("\n    ");
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
    label: "Botanical Bloom Flower Vector Illustration (2D & 3D)",
    view3d: buildProjectionView("3d"),
    view2d: buildProjectionView("2d")
  });
}
