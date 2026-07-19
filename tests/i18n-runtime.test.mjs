import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile, readdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import path from 'node:path';

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const BASELINE_PATH = 'tests/__snapshots__/i18n-baseline.json';

const ROUTES = [
	{ key: 'home-es', file: 'dist/index.html' },
	{ key: 'home-en', file: 'dist/en/index.html' },
	{ key: 'projects-es', file: 'dist/proyectos/index.html' },
	{ key: 'projects-en', file: 'dist/en/projects/index.html' },
	{ key: 'articles-es', file: 'dist/articulos/index.html' },
	{ key: 'articles-en', file: 'dist/en/articles/index.html' },
];

// Mirrors Astro 6 `getLangFromUrl` for `defaultLocale: 'es'` + `prefixDefaultLocale: false`.
// Used here to assert the expected URL -> locale semantics that `verifySnapshot`
// then validates end-to-end through `<html lang>` on the rendered dist.
export function getLangFromUrl(url) {
	if (!(url instanceof URL)) {
		throw new TypeError('getLangFromUrl expects a URL instance');
	}
	const segments = url.pathname.split('/').filter(Boolean);
	const lang = segments[0];
	return lang === 'en' ? 'en' : 'es';
}

// Build matrix of `useTranslations(locale)` semantically equivalent reads.
function useTranslationsSync(dict) {
	return function t(pathArg) {
		return pathArg.split('.').reduce((acc, key) => acc?.[key], dict);
	};
}

const stripTags = (html) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

function extractRoute(html) {
	const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/);
	const htmlLangMatch = html.match(/<html\s+lang="([^"]+)"/);
	const hreflangMatches = [...html.matchAll(/<link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"[^>]*>/g)];
	const hreflang = hreflangMatches.map((m) => ({ hreflang: m[1], href: m[2] }));

	const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
	const h1 = h1Match ? stripTags(h1Match[1]) : null;

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

async function rebuildDist() {
	await rm('dist', { recursive: true, force: true });
	await new Promise((resolve, reject) => {
		const p = spawn('npm', ['run', 'build'], { cwd: ROOT, stdio: 'inherit' });
		p.on('close', (code) =>
			code === 0 ? resolve() : reject(new Error(`npm run build exited with ${code}`)),
		);
	});
}

async function listFilesRecursive(dir, acc = []) {
	const entries = await readdir(dir, { withFileTypes: true });
	for (const entry of entries) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			await listFilesRecursive(full, acc);
		} else {
			acc.push(full);
		}
	}
	return acc;
}

test('es.json + en.json dictionaries exist', async () => {
	await access('src/i18n/es.json');
	await access('src/i18n/en.json');
});

test('es.json dictionary exposes required hierarchical UI keys', async () => {
	const es = JSON.parse(await readFile('src/i18n/es.json', 'utf8'));
	assert.equal(es.nav.projects, 'Proyectos');
	assert.equal(es.nav.articles, 'Articulos');
	assert.equal(es.nav.about, 'Sobre mi');
	assert.equal(es.nav.contact, 'Contacto');
	assert.equal(es.nav.hire, 'Contratame');
	assert.equal(es.nav.courses, 'Cursos');
	assert.ok(es.seo.home.title, 'seo.home.title present in es.json');
	assert.ok(es.seo.home.description, 'seo.home.description present in es.json');
	assert.ok(es.seo.articles.title, 'seo.articles.title present in es.json');
	assert.ok(es.seo.articles.description, 'seo.articles.description present in es.json');
	assert.ok(es.seo.projects.title, 'seo.projects.title present in es.json');
	assert.ok(es.seo.projects.description, 'seo.projects.description present in es.json');
});

test('en.json dictionary exposes required hierarchical UI keys', async () => {
	const en = JSON.parse(await readFile('src/i18n/en.json', 'utf8'));
	assert.equal(en.nav.projects, 'Projects');
	assert.equal(en.nav.articles, 'Articles');
	assert.equal(en.nav.about, 'About');
	assert.equal(en.nav.contact, 'Contact');
	assert.equal(en.nav.hire, 'Hire Me');
	assert.equal(en.nav.courses, 'Courses');
	assert.ok(en.seo.home.title, 'seo.home.title present in en.json');
	assert.ok(en.seo.home.description, 'seo.home.description present in en.json');
	assert.ok(en.seo.articles.title, 'seo.articles.title present in en.json');
	assert.ok(en.seo.articles.description, 'seo.articles.description present in en.json');
	assert.ok(en.seo.projects.title, 'seo.projects.title present in en.json');
	assert.ok(en.seo.projects.description, 'seo.projects.description present in en.json');
});

test('useTranslations: nav.courses resolves to Cursos (es) and Courses (en)', async () => {
	const es = JSON.parse(await readFile('src/i18n/es.json', 'utf8'));
	const en = JSON.parse(await readFile('src/i18n/en.json', 'utf8'));
	const tEs = useTranslationsSync(es);
	const tEn = useTranslationsSync(en);
	assert.equal(tEs('nav.courses'), 'Cursos');
	assert.equal(tEn('nav.courses'), 'Courses');
	assert.equal(tEs('nav.projects'), 'Proyectos');
	assert.equal(tEn('nav.projects'), 'Projects');
});

test('getLangFromUrl returns es for / and en for /en/articles/foo', () => {
	assert.equal(getLangFromUrl(new URL('http://localhost/')), 'es');
	assert.equal(getLangFromUrl(new URL('http://localhost/en/articles/foo')), 'en');
	assert.equal(getLangFromUrl(new URL('http://localhost/proyectos')), 'es');
	assert.equal(getLangFromUrl(new URL('http://localhost/en/projects')), 'en');
});

test('BaseLayout derives locale from getLangFromUrl(Astro.url)', async () => {
	const base = await readFile('src/layouts/BaseLayout.astro', 'utf8');
	assert.match(base, /import\s+\{[^}]*getLangFromUrl[^}]*\}\s+from\s+['"][^'"]*i18n\/utils['"]/);
	assert.match(base, /getLangFromUrl\(\s*Astro\.url\s*\)/);
});

test('no source code under src/ imports from seo/meta, i18n/translations or i18n/paths', async () => {
	const files = await listFilesRecursive('src');
	const forbidden = /from\s+['"][^'"]*(\/seo\/meta|\/i18n\/translations|\/i18n\/paths)['"]/;
	const offenders = [];
	for (const file of files) {
		if (!/\.(astro|ts|mjs|js)$/.test(file)) continue;
		const content = await readFile(file, 'utf8');
		if (forbidden.test(content)) offenders.push(file);
	}
	assert.deepEqual(offenders, [], `No production imports of deprecated modules. Offenders: ${offenders.join(', ')}`);
});

test('no source code under src/ reads SEO.es / SEO.en', async () => {
	const files = await listFilesRecursive('src');
	const offenders = [];
	for (const file of files) {
		if (!/\.(astro|ts|mjs|js)$/.test(file)) continue;
		const content = await readFile(file, 'utf8');
		if (/\bSEO\.(es|en)\b/.test(content)) offenders.push(file);
	}
	assert.deepEqual(offenders, [], `No production references to SEO.es/SEO.en. Offenders: ${offenders.join(', ')}`);
});

test('behavior-preservation snapshot matches pre-migration baseline', async () => {
	await access(BASELINE_PATH);
	const baseline = JSON.parse(await readFile(BASELINE_PATH, 'utf8'));
	await rebuildDist();
	for (const route of ROUTES) {
		assert.ok(existsSync(route.file), `Built dist file missing: ${route.file}`);
		const html = await readFile(route.file, 'utf8');
		const actual = extractRoute(html);
		assert.deepEqual(
			actual,
			baseline[route.key],
			`Route ${route.key} diverged from pre-migration baseline`,
		);
	}
});