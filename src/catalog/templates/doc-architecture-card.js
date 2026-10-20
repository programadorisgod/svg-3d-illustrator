import { renderNetworkNodePrimitive } from '../primitives/network-node.js';
import { renderConnectorWirePrimitive } from '../primitives/connector-wire.js';

/**
 * Plantilla de Diagrama de Arquitectura para Documentación Técnica
 */
export function renderDocArchitectureCardTemplate({
  theme,
  width = 1000,
  height = 580,
  title = 'System Architecture Overview',
  subtitle = 'High level service topology and data communication pipeline.',
  badge = 'Production Ready',
  columns = {
    client: { title: 'Edge & Client', node: { title: 'Next.js Frontend', subtitle: 'Global CDN / Edge SSR', icon: 'api' } },
    service: { title: 'Core Services', node: { title: 'Gateway & Auth', subtitle: 'Node.js Microservices', icon: 'shield' } },
    data: { title: 'Persistence', node: { title: 'Primary Database', subtitle: 'PostgreSQL + Redis Cache', icon: 'database' } }
  }
}) {
  const cardW = 220;
  const cardH = 80;

  // Coordenadas de los 3 nodos
  const n1 = { x: 90, y: 240 };
  const n2 = { x: 390, y: 240 };
  const n3 = { x: 690, y: 240 };

  const node1Svg = renderNetworkNodePrimitive({
    x: n1.x, y: n1.y, width: cardW, height: cardH,
    theme,
    icon: columns.client.node.icon,
    title: columns.client.node.title,
    subtitle: columns.client.node.subtitle,
    badge: 'Edge',
    badgeColor: '#38bdf8',
    id: 'node-client'
  });

  const node2Svg = renderNetworkNodePrimitive({
    x: n2.x, y: n2.y, width: cardW, height: cardH,
    theme,
    icon: columns.service.node.icon,
    title: columns.service.node.title,
    subtitle: columns.service.node.subtitle,
    badge: 'mTLS',
    badgeColor: '#a855f7',
    id: 'node-service'
  });

  const node3Svg = renderNetworkNodePrimitive({
    x: n3.x, y: n3.y, width: cardW, height: cardH,
    theme,
    icon: columns.data.node.icon,
    title: columns.data.node.title,
    subtitle: columns.data.node.subtitle,
    badge: 'Replica',
    badgeColor: '#10b981',
    id: 'node-data'
  });

  // Conectores entre nodos
  const wire1Svg = renderConnectorWirePrimitive({
    from: { x: n1.x + cardW, y: n1.y + cardH / 2 },
    to: { x: n2.x, y: n2.y + cardH / 2 },
    theme,
    style: 'orthogonal',
    label: 'HTTPS / gRPC',
    id: 'wire-1'
  });

  const wire2Svg = renderConnectorWirePrimitive({
    from: { x: n2.x + cardW, y: n2.y + cardH / 2 },
    to: { x: n3.x, y: n3.y + cardH / 2 },
    theme,
    style: 'orthogonal',
    label: 'Connection Pool',
    id: 'wire-2'
  });

  return `
    <!-- Fondo del documento -->
    <rect width="${width}" height="${height}" fill="${theme.colors.background}" rx="${theme.radius.xl}" />
    <rect width="${width}" height="${height}" fill="url(#dot-pattern)" opacity="0.4" />
    <rect width="${width}" height="${height}" fill="none" stroke="${theme.colors.border}" stroke-width="1.5" rx="${theme.radius.xl}" />

    <!-- Encabezado de documentación -->
    <g class="doc-header" transform="translate(60, 50)">
      <text x="0" y="32" fill="${theme.colors.textPrimary}" font-family="${theme.typography.fontFamily}" font-size="28" font-weight="700">
        ${title}
      </text>
      <text x="0" y="60" fill="${theme.colors.textSecondary}" font-family="${theme.typography.fontFamily}" font-size="14" font-weight="400">
        ${subtitle}
      </text>
      
      <!-- Badge de status -->
      <rect x="${width - 240}" y="12" width="120" height="26" rx="13" fill="${theme.colors.surfaceElevated}" stroke="${theme.colors.borderBright}" stroke-width="1" />
      <circle cx="${width - 226}" cy="25" r="3" fill="${theme.colors.accent}" />
      <text x="${width - 214}" y="29" fill="${theme.colors.textPrimary}" font-family="${theme.typography.fontFamily}" font-size="${theme.typography.sizes.body}" font-weight="600">${badge}</text>
    </g>

    <line x1="60" y1="140" x2="${width - 60}" y2="140" stroke="${theme.colors.border}" stroke-width="1" />

    <!-- Títulos de Columnas / Capas -->
    <text x="90" y="200" fill="${theme.colors.textMuted}" font-family="${theme.typography.fontFamily}" font-size="12" font-weight="700" letter-spacing="1">${columns.client.title.toUpperCase()}</text>
    <text x="390" y="200" fill="${theme.colors.textMuted}" font-family="${theme.typography.fontFamily}" font-size="12" font-weight="700" letter-spacing="1">${columns.service.title.toUpperCase()}</text>
    <text x="690" y="200" fill="${theme.colors.textMuted}" font-family="${theme.typography.fontFamily}" font-size="12" font-weight="700" letter-spacing="1">${columns.data.title.toUpperCase()}</text>

    <!-- Conectores -->
    ${wire1Svg}
    ${wire2Svg}

    <!-- Nodos -->
    ${node1Svg}
    ${node2Svg}
    ${node3Svg}

    <!-- Callout de información al pie -->
    <g class="doc-footer-callout" transform="translate(60, 420)">
      <rect x="0" y="0" width="${width - 120}" height="70" rx="${theme.radius.md}" fill="${theme.colors.surface}" stroke="${theme.colors.border}" stroke-width="1" />
      <circle cx="28" cy="35" r="10" fill="${theme.colors.primaryLight}22" />
      <text x="28" y="39" text-anchor="middle" fill="${theme.colors.primaryLight}" font-family="${theme.typography.fontFamily}" font-size="12" font-weight="800">i</text>
      <text x="52" y="32" fill="${theme.colors.textPrimary}" font-family="${theme.typography.fontFamily}" font-size="13" font-weight="600">Alta Disponibilidad & Encriptación E2E</text>
      <text x="52" y="52" fill="${theme.colors.textSecondary}" font-family="${theme.typography.fontFamily}" font-size="12" font-weight="400">Todos los enlaces utilizan mTLS con cifrado AES-256 y enrutamiento automático ante fallos de zona.</text>
    </g>
  `;
}
