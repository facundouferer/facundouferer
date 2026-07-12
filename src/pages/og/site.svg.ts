import type { APIContext } from 'astro';

export async function GET(_context: APIContext) {
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#f5ead8" />
<circle cx="1050" cy="60" r="240" fill="#7a8a5e" fill-opacity="0.18" />
<circle cx="60" cy="600" r="200" fill="#c67139" fill-opacity="0.14" />
<text x="84" y="120" fill="#8c491a" font-size="28" font-family="Figtree, sans-serif" font-weight="600" letter-spacing="2">facundouferer.ar</text>
<text x="84" y="270" fill="#201e1d" font-size="78" font-family="Caprasimo, sans-serif" font-weight="400">Facundo Uferer</text>
<text x="84" y="352" fill="#8c491a" font-size="38" font-family="Figtree, sans-serif" font-weight="700">Senior Full Stack Engineer · AI Orchestrator</text>
<text x="84" y="450" fill="#474238" font-size="32" font-family="Figtree, sans-serif">AI-assisted software engineering, multi-agent systems, architecture, and delivery.</text>
</svg>`;

	return new Response(svg, {
		headers: {
			'Content-Type': 'image/svg+xml',
			'Cache-Control': 'public, max-age=3600',
		},
	});
}
