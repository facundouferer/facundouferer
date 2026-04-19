import type { APIContext } from 'astro';

export async function GET(_context: APIContext) {
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#050510" />
    <stop offset="100%" stop-color="#12163f" />
  </linearGradient>
  <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#06B6D4" />
    <stop offset="100%" stop-color="#A855F7" />
  </linearGradient>
</defs>
<rect width="1200" height="630" fill="url(#bg)" />
<circle cx="210" cy="130" r="240" fill="#06B6D4" fill-opacity="0.12" />
<circle cx="1010" cy="500" r="220" fill="#A855F7" fill-opacity="0.14" />
<text x="84" y="120" fill="#8BE9FD" font-size="28" font-family="JetBrains Mono, monospace">facundouferer.ar</text>
<text x="84" y="270" fill="#ffffff" font-size="78" font-family="Syne, sans-serif" font-weight="800">Facundo Uferer</text>
<text x="84" y="352" fill="url(#accent)" font-size="38" font-family="DM Sans, sans-serif" font-weight="700">Senior Full Stack Engineer · AI Orchestrator</text>
<text x="84" y="450" fill="#d3d8ef" font-size="32" font-family="DM Sans, sans-serif">AI-assisted software engineering, multi-agent systems, architecture, and delivery.</text>
</svg>`;

	return new Response(svg, {
		headers: {
			'Content-Type': 'image/svg+xml',
			'Cache-Control': 'public, max-age=3600',
		},
	});
}
