import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

function escapeXml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');
}

export async function getStaticPaths() {
	const articles = await getCollection('articles');
	return articles.map((article) => ({ params: { slug: article.data.slug } }));
}

export async function GET({ params }: APIContext) {
	const slug = params.slug;
	if (!slug) {
		return new Response('Missing slug', { status: 400 });
	}

	const entries = await getCollection('articles');
	const article = entries.find((entry) => entry.data.slug === slug);
	if (!article) {
		return new Response('Not found', { status: 404 });
	}

	const title = escapeXml(article.data.title_en);
	const category = escapeXml(article.data.category);

	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#050510" />
    <stop offset="100%" stop-color="#0f1130" />
  </linearGradient>
</defs>
<rect width="1200" height="630" fill="url(#bg)" />
<circle cx="180" cy="120" r="220" fill="#A855F7" fill-opacity="0.18"/>
<circle cx="1010" cy="100" r="180" fill="#06B6D4" fill-opacity="0.2"/>
<text x="80" y="120" fill="#06B6D4" font-size="32" font-family="JetBrains Mono, monospace">${category}</text>
<text x="80" y="250" fill="#ffffff" font-size="62" font-family="Syne, sans-serif" font-weight="700">${title}</text>
<text x="80" y="560" fill="#ffffff" font-size="30" font-family="DM Sans, sans-serif">facundouferer.ar</text>
</svg>`;

	return new Response(svg, {
		headers: {
			'Content-Type': 'image/svg+xml',
			'Cache-Control': 'public, max-age=3600',
		},
	});
}
