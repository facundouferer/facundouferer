export const SITE_URL = 'https://facundouferer.github.io/facundouferer';

export const SOCIAL_LINKS = {
	github: 'https://github.com/facundouferer',
	linkedin: 'https://www.linkedin.com/in/facundouferer/',
	twitter: 'https://x.com/facundouferer',
	email: 'mailto:juanfacundouf@gmail.com',
} as const;

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
