/**
 * Generador de vista previa HTML interactiva para el SVG compilado
 */
export function generateHtmlPreview({
  svgContent,
  metadata = {
    title: 'Vector Preview',
    template: 'custom',
    preset: 'dark-linear',
    dimensions: '800x600'
  }
}) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview: ${metadata.title} - svg-3d-illustrator</title>
  <style>
    :root {
      --bg: #090a0f;
      --panel: #131722;
      --border: #232936;
      --text: #f1f5f9;
      --text-muted: #94a3b8;
      --accent: #6366f1;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: system-ui, -apple-system, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    header {
      background: var(--panel);
      border-bottom: 1px solid var(--border);
      padding: 14px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .badge {
      background: rgba(99, 102, 241, 0.2);
      color: #818cf8;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      margin-left: 8px;
    }
    .meta {
      font-size: 13px;
      color: var(--text-muted);
      display: flex;
      gap: 16px;
    }
    .controls {
      display: flex;
      gap: 10px;
    }
    button {
      background: #1e2433;
      color: var(--text);
      border: 1px solid var(--border);
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s;
    }
    button:hover {
      background: var(--accent);
      border-color: var(--accent);
    }
    main {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
      overflow: auto;
      background: radial-gradient(#1e2433 1px, transparent 1px);
      background-size: 20px 20px;
    }
    .svg-wrapper {
      max-width: 95vw;
      max-height: 80vh;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid var(--border);
      background: transparent;
      display: flex;
    }
    .svg-wrapper svg {
      width: 100%;
      height: auto;
      display: block;
    }
    .light-mode {
      background: #ffffff !important;
    }
  </style>
</head>
<body>
  <header>
    <div style="display: flex; align-items: center;">
      <h1 style="font-size: 16px; font-weight: 700;">${metadata.title}</h1>
      <span class="badge">${metadata.template || 'custom'}</span>
      <span class="badge" style="background: rgba(16, 185, 129, 0.2); color: #34d399;">${metadata.preset || 'dark-linear'}</span>
    </div>
    <div class="controls">
      <button onclick="toggleBackground()">Toggle Background</button>
      <button onclick="copySvg()">Copy SVG</button>
      <button onclick="downloadSvg()" style="background: var(--accent); border-color: var(--accent);">Download SVG</button>
    </div>
  </header>
  <main>
    <div class="svg-wrapper" id="canvas-container">
      ${svgContent}
    </div>
  </main>

  <script>
    function toggleBackground() {
      const el = document.getElementById('canvas-container');
      el.classList.toggle('light-mode');
    }
    function copySvg() {
      const svg = document.querySelector('svg').outerHTML;
      navigator.clipboard.writeText(svg).then(() => {
        alert('SVG code copied to clipboard!');
      });
    }
    function downloadSvg() {
      const svg = document.querySelector('svg').outerHTML;
      const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const filename = '${metadata.title ? metadata.title.toLowerCase().replace(/[^a-z0-9_-]/g, '_') : 'illustration'}'.replace(/^_+|_+$/g, '') + '.svg';
      a.download = filename || 'illustration.svg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  </script>
</body>
</html>
`;
}
