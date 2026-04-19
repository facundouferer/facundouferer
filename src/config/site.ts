export const SITE_NAME = 'Facundo Uferer';
export const SITE_URL = 'https://facundouferer.ar';
export const SITE_DEFAULT_OG_IMAGE = '/og/site.svg';
export const CONTACT_EMAIL = 'juanfacundouf@gmail.com';
export const TWITTER_HANDLE = '@facundouferer';

export const AUTHOR = {
	name: 'Facundo Uferer',
	jobTitle: {
		es: 'Ingeniero Full Stack Senior y AI Orchestrator',
		en: 'Senior Full Stack Engineer and AI Orchestrator',
	},
	description: {
		es: 'Ingeniero Full Stack Senior especializado en desarrollo asistido por IA, arquitectura de software y sistemas multi-agente.',
		en: 'Senior Full Stack Engineer specialized in AI-assisted development, software architecture, and multi-agent systems.',
	},
} as const;

export const SITE_LANGUAGES = {
	es: {
		htmlLang: 'es-AR',
		hreflang: 'es',
		ogLocale: 'es_AR',
		label: 'Español',
	},
	en: {
		htmlLang: 'en',
		hreflang: 'en',
		ogLocale: 'en_US',
		label: 'English',
	},
} as const;

export const SOCIAL_LINKS = {
	github: 'https://github.com/facundouferer',
	linkedin: 'https://www.linkedin.com/in/facundouferer/',
	twitter: 'https://x.com/facundouferer',
	email: `mailto:${CONTACT_EMAIL}`,
} as const;

export const SOCIAL_IDENTITIES = [
	SOCIAL_LINKS.github,
	SOCIAL_LINKS.linkedin,
	SOCIAL_LINKS.twitter,
] as const;

export const NAVIGATION = {
	es: [
		{ href: '/proyectos', label: 'Proyectos' },
		{ href: '/articulos', label: 'Articulos' },
		{ href: '/#about', label: 'Sobre mi' },
		{ href: '/#contact', label: 'Contacto' },
	],
	en: [
		{ href: '/en/projects', label: 'Projects' },
		{ href: '/en/articles', label: 'Articles' },
		{ href: '/en/#about', label: 'About' },
		{ href: '/en/#contact', label: 'Contact' },
	],
} as const;
