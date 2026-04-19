import {
	AUTHOR,
	CONTACT_EMAIL,
	SITE_DEFAULT_OG_IMAGE,
	SITE_NAME,
	SITE_URL,
	SOCIAL_IDENTITIES,
	SOCIAL_LINKS,
} from '../config/site';

type Locale = 'es' | 'en';

type CollectionItem = {
	name: string;
	url: string;
	description?: string;
};

type BreadcrumbItem = {
	name: string;
	path: string;
};

type CollectionPageSchemaInput = {
	locale: Locale;
	path: string;
	name: string;
	description: string;
	items: CollectionItem[];
	breadcrumbs: BreadcrumbItem[];
};

type ArticleSchemaInput = {
	locale: Locale;
	path: string;
	title: string;
	description: string;
	datePublished: Date;
	image?: string;
	category: string;
	tags: string[];
};

export type SchemaNode = {
	'@context': 'https://schema.org';
	'@type': string;
	[key: string]: unknown;
};

const LOCALE_TAGS: Record<Locale, string> = {
	es: 'es-AR',
	en: 'en',
};

const HOME_COPY = {
	es: {
		serviceDescription:
			'Servicio de ingenieria full stack, arquitectura de software y orquestacion de IA para construir productos web listos para produccion.',
	},
	en: {
		serviceDescription:
			'Professional service focused on full stack engineering, software architecture, and AI orchestration for production-ready web products.',
	},
} as const;

const SERVICE_TYPES = [
	'AI-assisted software engineering',
	'Full stack web development',
	'Software architecture',
	'Multi-agent orchestration',
	'Automation',
];

const KNOWS_ABOUT = [
	'AI-assisted development',
	'Multi-agent systems',
	'Full stack engineering',
	'Astro',
	'TypeScript',
	'Node.js',
	'Clean architecture',
	'Automation',
];

function toAbsoluteUrl(path: string): string {
	return new URL(path, SITE_URL).toString();
}

function resolveImageUrl(path?: string): string {
	if (!path) {
		return toAbsoluteUrl(SITE_DEFAULT_OG_IMAGE);
	}

	return /^https?:/i.test(path) ? path : toAbsoluteUrl(path);
}

export function getLocaleTag(locale: Locale): string {
	return LOCALE_TAGS[locale];
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]): SchemaNode {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			item: toAbsoluteUrl(item.path),
		})),
	};
}

export function buildPersonSchema(locale: Locale): SchemaNode {
	return {
		'@context': 'https://schema.org',
		'@type': 'Person',
		'@id': `${SITE_URL}#person`,
		name: AUTHOR.name,
		url: SITE_URL,
		image: toAbsoluteUrl('/foto_facundo_01.png'),
		email: CONTACT_EMAIL,
		jobTitle: AUTHOR.jobTitle[locale],
		description: AUTHOR.description[locale],
		sameAs: SOCIAL_IDENTITIES,
		knowsAbout: KNOWS_ABOUT,
	};
}

export function buildProfessionalServiceSchema(locale: Locale): SchemaNode {
	return {
		'@context': 'https://schema.org',
		'@type': 'ProfessionalService',
		'@id': `${SITE_URL}#service`,
		name: SITE_NAME,
		url: SITE_URL,
		description: HOME_COPY[locale].serviceDescription,
		image: toAbsoluteUrl('/foto_facundo_02.png'),
		provider: {
			'@id': `${SITE_URL}#person`,
		},
		sameAs: SOCIAL_IDENTITIES,
		contactPoint: {
			'@type': 'ContactPoint',
			email: CONTACT_EMAIL,
			contactType: 'sales',
			availableLanguage: ['es', 'en'],
		},
		areaServed: 'Worldwide',
		serviceType: SERVICE_TYPES,
	};
}

export function buildWebsiteSchema(locale: Locale): SchemaNode {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		'@id': `${SITE_URL}#website`,
		url: SITE_URL,
		name: SITE_NAME,
		description: HOME_COPY[locale].serviceDescription,
		inLanguage: ['es-AR', 'en'],
		publisher: {
			'@id': `${SITE_URL}#service`,
		},
	};
}

export function buildHomeSchemas(locale: Locale): SchemaNode[] {
	return [
		buildWebsiteSchema(locale),
		buildPersonSchema(locale),
		buildProfessionalServiceSchema(locale),
	];
}

export function buildCollectionPageSchemas({
	locale,
	path,
	name,
	description,
	items,
	breadcrumbs,
}: CollectionPageSchemaInput): SchemaNode[] {
	const itemListId = `${toAbsoluteUrl(path)}#list`;

	return [
		{
			'@context': 'https://schema.org',
			'@type': 'CollectionPage',
			'@id': `${toAbsoluteUrl(path)}#collection-page`,
			url: toAbsoluteUrl(path),
			name,
			description,
			inLanguage: getLocaleTag(locale),
			isPartOf: {
				'@id': `${SITE_URL}#website`,
			},
			about: {
				'@id': `${SITE_URL}#service`,
			},
			mainEntity: {
				'@id': itemListId,
			},
		},
		{
			'@context': 'https://schema.org',
			'@type': 'ItemList',
			'@id': itemListId,
			name: `${name} list`,
			itemListOrder: 'https://schema.org/ItemListOrderAscending',
			numberOfItems: items.length,
			itemListElement: items.map((item, index) => ({
				'@type': 'ListItem',
				position: index + 1,
				url: /^https?:/i.test(item.url) ? item.url : toAbsoluteUrl(item.url),
				name: item.name,
				description: item.description,
			})),
		},
		buildBreadcrumbSchema(breadcrumbs),
	];
}

export function buildArticleSchemas({
	locale,
	path,
	title,
	description,
	datePublished,
	image,
	category,
	tags,
}: ArticleSchemaInput): SchemaNode[] {
	const articleUrl = toAbsoluteUrl(path);

	return [
		{
			'@context': 'https://schema.org',
			'@type': 'BlogPosting',
			'@id': `${articleUrl}#blog-posting`,
			mainEntityOfPage: articleUrl,
			headline: title,
			description,
			image: [resolveImageUrl(image)],
			datePublished: datePublished.toISOString(),
			dateModified: datePublished.toISOString(),
			inLanguage: getLocaleTag(locale),
			articleSection: category,
			keywords: tags,
			isAccessibleForFree: true,
			author: {
				'@id': `${SITE_URL}#person`,
			},
			publisher: {
				'@id': `${SITE_URL}#service`,
			},
			about: KNOWS_ABOUT,
			url: articleUrl,
		},
		buildBreadcrumbSchema([
			{ name: locale === 'es' ? 'Inicio' : 'Home', path: locale === 'es' ? '/' : '/en/' },
			{
				name: locale === 'es' ? 'Articulos' : 'Articles',
				path: locale === 'es' ? '/articulos' : '/en/articles',
			},
			{ name: title, path },
		]),
	];
}

export function buildLlmsDocument(): string {
	return [
		'# Facundo Uferer',
		'',
		'> Bilingual portfolio and publishing site for a Senior Full Stack Engineer and AI Orchestrator.',
		'',
		`- Site: ${SITE_URL}`,
		'- Languages: es-AR (default), en',
		'- Topics: AI-assisted software engineering, multi-agent systems, full stack architecture, automation, Astro, TypeScript, Node.js',
		'',
		'## Key URLs',
		'- /',
		'- /en/',
		'- /proyectos',
		'- /en/projects',
		'- /articulos',
		'- /en/articles',
		'- /rss.xml',
		'- /sitemap.xml',
		'- /llms-full.txt',
		'',
		'## Identity',
		`- Person: ${AUTHOR.name}`,
		`- Role: ${AUTHOR.jobTitle.en}`,
		`- Contact: ${SOCIAL_LINKS.email}`,
		`- GitHub: ${SOCIAL_LINKS.github}`,
		`- LinkedIn: ${SOCIAL_LINKS.linkedin}`,
		`- X: ${SOCIAL_LINKS.twitter}`,
	].join('\n');
}
