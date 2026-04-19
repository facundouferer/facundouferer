import type { CollectionEntry } from 'astro:content';

type Locale = 'es' | 'en';
type ArticleEntry = CollectionEntry<'articles'>;
const MARKDOWN_IMAGE_REGEX = /!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/;

function sortByDateDesc(entries: ArticleEntry[]): ArticleEntry[] {
	return [...entries].sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function resolveArticleEntry(
	entries: ArticleEntry[],
	slug: string,
	preferredLang: Locale,
	fallbackLang?: Locale,
): ArticleEntry | undefined {
	const publishedEntries = entries.filter((item) => item.data.published && item.data.slug === slug);

	return publishedEntries.find((item) => item.data.lang === preferredLang)
		?? publishedEntries.find((item) => item.data.lang === 'both')
		?? (fallbackLang ? publishedEntries.find((item) => item.data.lang === fallbackLang) : undefined);
}

export function getArticlesForLocale(
	entries: ArticleEntry[],
	preferredLang: Locale,
	fallbackLang?: Locale,
): ArticleEntry[] {
	const slugs = [...new Set(entries.filter((item) => item.data.published).map((item) => item.data.slug))];

	const localizedEntries = slugs
		.map((slug) => resolveArticleEntry(entries, slug, preferredLang, fallbackLang))
		.filter((item): item is ArticleEntry => Boolean(item));

	return sortByDateDesc(localizedEntries);
}

export function getArticleSlugsForLocale(
	entries: ArticleEntry[],
	preferredLang: Locale,
	fallbackLang?: Locale,
): string[] {
	return getArticlesForLocale(entries, preferredLang, fallbackLang).map((item) => item.data.slug);
}

export function getArticlePreviewImage(entry: ArticleEntry): string | undefined {
	const frontmatterImage = 'image' in entry.data && typeof entry.data.image === 'string'
		? entry.data.image
		: undefined;

	if (frontmatterImage) {
		return frontmatterImage;
	}

	const match = entry.body?.match(MARKDOWN_IMAGE_REGEX);
	return match?.[1];
}
