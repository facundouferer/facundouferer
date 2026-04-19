import { getCollection } from 'astro:content';
import { SITE_URL } from '../config/site';
import { getArticlesForLocale } from '../utils/articles';

type AlternateLink = {
	hreflang: string;
	href: string;
};

type UrlEntry = {
	loc: string;
	lastmod?: string;
	alternates?: AlternateLink[];
};

function absoluteUrl(path: string): string {
	return new URL(path, SITE_URL).toString();
}

function escapeXml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');
}

function renderUrl(entry: UrlEntry): string {
	const alternates = (entry.alternates ?? [])
		.map(
			(alternate) =>
				`    <xhtml:link rel="alternate" hreflang="${escapeXml(alternate.hreflang)}" href="${escapeXml(alternate.href)}" />`,
		)
		.join('\n');
	const lastmod = entry.lastmod ? `\n    <lastmod>${escapeXml(entry.lastmod)}</lastmod>` : '';
	const alternateBlock = alternates ? `\n${alternates}` : '';

	return `  <url>\n    <loc>${escapeXml(entry.loc)}</loc>${lastmod}${alternateBlock}\n  </url>`;
}

export async function GET() {
	const articles = await getCollection('articles');
	const projects = (await getCollection('projects')).filter((item) => item.data.published);
	const articleRoutesEs = getArticlesForLocale(articles, 'es', 'en');
	const articleRoutesEn = getArticlesForLocale(articles, 'en', 'es');
	const generatedAt = new Date().toISOString();

	const urls: UrlEntry[] = [
		{
			loc: absoluteUrl('/'),
			alternates: [
				{ hreflang: 'es', href: absoluteUrl('/') },
				{ hreflang: 'en', href: absoluteUrl('/en/') },
				{ hreflang: 'x-default', href: absoluteUrl('/') },
			],
		},
		{
			loc: absoluteUrl('/en/'),
			alternates: [
				{ hreflang: 'es', href: absoluteUrl('/') },
				{ hreflang: 'en', href: absoluteUrl('/en/') },
				{ hreflang: 'x-default', href: absoluteUrl('/') },
			],
		},
		{
			loc: absoluteUrl('/articulos'),
			lastmod: generatedAt,
			alternates: [
				{ hreflang: 'es', href: absoluteUrl('/articulos') },
				{ hreflang: 'en', href: absoluteUrl('/en/articles') },
				{ hreflang: 'x-default', href: absoluteUrl('/articulos') },
			],
		},
		{
			loc: absoluteUrl('/en/articles'),
			lastmod: generatedAt,
			alternates: [
				{ hreflang: 'es', href: absoluteUrl('/articulos') },
				{ hreflang: 'en', href: absoluteUrl('/en/articles') },
				{ hreflang: 'x-default', href: absoluteUrl('/articulos') },
			],
		},
		{
			loc: absoluteUrl('/proyectos'),
			lastmod: generatedAt,
			alternates: [
				{ hreflang: 'es', href: absoluteUrl('/proyectos') },
				{ hreflang: 'en', href: absoluteUrl('/en/projects') },
				{ hreflang: 'x-default', href: absoluteUrl('/proyectos') },
			],
		},
		{
			loc: absoluteUrl('/en/projects'),
			lastmod: generatedAt,
			alternates: [
				{ hreflang: 'es', href: absoluteUrl('/proyectos') },
				{ hreflang: 'en', href: absoluteUrl('/en/projects') },
				{ hreflang: 'x-default', href: absoluteUrl('/proyectos') },
			],
		},
		...articleRoutesEs.map((article) => ({
			loc: absoluteUrl(`/articulos/${article.data.slug}`),
			lastmod: article.data.date.toISOString(),
			alternates: [
				{ hreflang: 'es', href: absoluteUrl(`/articulos/${article.data.slug}`) },
				{ hreflang: 'en', href: absoluteUrl(`/en/articles/${article.data.slug}`) },
				{ hreflang: 'x-default', href: absoluteUrl(`/articulos/${article.data.slug}`) },
			],
		})),
		...articleRoutesEn.map((article) => ({
			loc: absoluteUrl(`/en/articles/${article.data.slug}`),
			lastmod: article.data.date.toISOString(),
			alternates: [
				{ hreflang: 'es', href: absoluteUrl(`/articulos/${article.data.slug}`) },
				{ hreflang: 'en', href: absoluteUrl(`/en/articles/${article.data.slug}`) },
				{ hreflang: 'x-default', href: absoluteUrl(`/articulos/${article.data.slug}`) },
			],
		})),
		...projects.map((project) => ({
			loc: project.data.liveUrl,
			lastmod: generatedAt,
		})),
	];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls
		.map(renderUrl)
		.join('\n')}\n</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
		},
	});
}
