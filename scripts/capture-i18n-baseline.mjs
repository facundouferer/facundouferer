// One-shot baseline capture for slice A of courses-i18n-refactor.
// Reads pre-migration dist HTML and locks the visible UI strings per route
// into tests/__snapshots__/i18n-baseline.json. Run AFTER `npm run build` on
// pristine HEAD. Slice A's golden snapshot test verifies the post-migration
// build still matches this baseline (behavior preservation).

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const ROUTES = [
	{ key: 'home-es', file: 'dist/index.html' },
	{ key: 'home-en', file: 'dist/en/index.html' },
	{ key: 'projects-es', file: 'dist/proyectos/index.html' },
	{ key: 'projects-en', file: 'dist/en/projects/index.html' },
	{ key: 'articles-es', file: 'dist/articulos/index.html' },
	{ key: 'articles-en', file: 'dist/en/articles/index.html' },
];

const stripTags = (html) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

function extract(html) {
	const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/);
	const htmlLangMatch = html.match(/<html\s+lang="([^"]+)"/);
	const hreflangMatches = [...html.matchAll(/<link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"[^>]*>/g)];
	const hreflang = hreflangMatches.map((m) => ({ hreflang: m[1], href: m[2] }));

	const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
	const h1 = h1Match ? stripTags(h1Match[1]) : null;

	// Nav labels: <nav aria-label="Primary" ...> ... <ul>...<li>...<a href="...">label</a>...</ul> ... </nav>
	const navMatch = html.match(/<nav\s+aria-label="Primary"[^>]*>([\s\S]*?)<\/nav>/);
	let nav = [];
	if (navMatch) {
		const items = [...navMatch[1].matchAll(/<a\s+[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)];
		nav = items.map((m) => ({ href: m[1], label: stripTags(m[2]) }));
	}

	return {
		title: titleMatch ? titleMatch[1].trim() : null,
		htmlLang: htmlLangMatch ? htmlLangMatch[1] : null,
		hreflang,
		h1,
		nav,
	};
}

async function main() {
	if (!existsSync('dist')) {
		console.error('dist/ not found. Run `npm run build` first.');
		process.exit(1);
	}

	const baseline = {};
	for (const route of ROUTES) {
		const html = await readFile(route.file, 'utf8');
		baseline[route.key] = extract(html);
	}

	await mkdir('tests/__snapshots__', { recursive: true });
	await writeFile('tests/__snapshots__/i18n-baseline.json', JSON.stringify(baseline, null, 2) + '\n', 'utf8');
	console.log('Wrote tests/__snapshots__/i18n-baseline.json');
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});