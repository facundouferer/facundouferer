// Astro 6 i18n runtime helpers.
//
// Astro's `astro:i18n` virtual module exposes locale/URL/middleware utilities
// (`getLocaleByPath`, `getRelativeLocaleUrl`, redirectToFallback, ...) but it
// does NOT ship a UI string translation engine. Per the official Astro 6 i18n
// recipe (https://docs.astro.build/en/recipes/i18n/), UI strings live in
// `src/i18n/<locale>.json` and consumers consume them via the two helpers
// below. This file is the canonical i18n surface for `src/`.

import esRaw from './es.json';
import enRaw from './en.json';

export type Locale = 'es' | 'en';

type Dict = Record<string, unknown>;

const dictionaries: Record<Locale, Dict> = {
	es: esRaw as Dict,
	en: enRaw as Dict,
};

/**
 * Derive the active locale from a URL instance. Matches the project's i18n
 * config (`defaultLocale: 'es'`, `prefixDefaultLocale: false`): URLs starting
 * with `/en/` resolve to `'en'`; everything else resolves to `'es'`.
 */
export function getLangFromUrl(url: URL): Locale {
	const [, lang] = url.pathname.split('/');
	return lang === 'en' ? 'en' : 'es';
}

/**
 * Build a `t(path)` function bound to the dictionary for `locale`.
 * Hierarchical dot-path lookup (`'nav.projects'`) returns the string at that
 * path. A missing key is a programming error, so the helper throws with the
 * locale + key context — let it surface loudly during `astro check`/build
 * rather than silently render `undefined`.
 */
export function useTranslations(locale: Locale): (key: string) => string {
	const dict: unknown = dictionaries[locale];
	return (key: string): string => {
		const parts = key.split('.');
		let cursor: unknown = dict;
		for (const part of parts) {
			if (cursor && typeof cursor === 'object' && part in (cursor as Record<string, unknown>)) {
				cursor = (cursor as Record<string, unknown>)[part];
			} else {
				throw new Error(`i18n: missing key "${key}" in "${locale}" dictionary`);
			}
		}
		if (typeof cursor !== 'string') {
			throw new Error(`i18n: key "${key}" in "${locale}" dictionary does not resolve to a string`);
		}
		return cursor;
	};
}