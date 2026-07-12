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
<rect width="1200" height="630" fill="#f5ead8" />
<circle cx="1030" cy="90" r="200" fill="#c67139" fill-opacity="0.16"/>
<circle cx="120" cy="560" r="180" fill="#7a8a5e" fill-opacity="0.18"/>
<text x="80" y="120" fill="#8c491a" font-size="32" font-family="Figtree, sans-serif" font-weight="700">${category}</text>
<text x="80" y="250" fill="#201e1d" font-size="62" font-family="Caprasimo, sans-serif" font-weight="400">${title}</text>
<text x="80" y="560" fill="#474238" font-size="30" font-family="Figtree, sans-serif">facundouferer.ar</text>
</svg>`;

	return new Response(svg, {
		headers: {
			'Content-Type': 'image/svg+xml',
			'Cache-Control': 'public, max-age=3600',
		},
	});
}
