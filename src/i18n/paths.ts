import type { Locale } from './translations';

type PathMap = {
	es: string;
	en: string;
};

const PATHS: Record<string, PathMap> = {
	home: { es: '/', en: '/en/' },
	projects: { es: '/proyectos', en: '/en/projects' },
	articles: { es: '/articulos', en: '/en/articles' },
};

export function getPath(key: keyof typeof PATHS, locale: Locale): string {
	return PATHS[key][locale];
}

export function getAlternatePath(pathname: string, locale: Locale): string {
	if (pathname === '/' || pathname === '/en/' || pathname === '/en') {
		return locale === 'es' ? '/en/' : '/';
	}

	if (pathname.startsWith('/en/')) {
		return pathname.replace('/en/', '/');
	}

	if (pathname.startsWith('/en')) {
		return pathname.replace('/en', '/');
	}

	return `/en${pathname}`;
}
