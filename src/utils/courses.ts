import type { CollectionEntry } from 'astro:content';

type Locale = 'es' | 'en';
type CourseEntry = CollectionEntry<'courses'>;
type LessonEntry = CollectionEntry<'lessons'>;

/**
 * Returns published courses for the given locale.
 * Includes entries where lang === locale OR lang === 'both'.
 * Sorted by (technology, slug) ascending.
 */
export function getCoursesForLocale(
	entries: CourseEntry[],
	locale: Locale,
): CourseEntry[] {
	return entries
		.filter((entry) => entry.data.published)
		.sort((a, b) => {
			const techCompare = (a.data.technology ?? '').localeCompare(b.data.technology ?? '');
			if (techCompare !== 0) return techCompare;
			return a.data.slug.localeCompare(b.data.slug);
		});
}

/**
 * Finds a course entry by slug among published entries.
 * Prefers lang === locale, then 'both', then fallbackLocale.
 * Returns undefined for nonexistent slug (no throw).
 */
export function resolveCourseEntry(
	entries: CourseEntry[],
	slug: string,
	locale: Locale,
	fallbackLocale?: Locale,
): CourseEntry | undefined {
	const publishedEntries = entries.filter(
		(entry) => entry.data.published && entry.data.slug === slug,
	);

	return publishedEntries.find((entry) => {
		const lang = 'lang' in entry.data ? (entry.data as Record<string, unknown>).lang : undefined;
		return lang === locale || lang === 'both' || lang === undefined;
	})
		?? (fallbackLocale
			? publishedEntries.find((entry) => {
				const lang = 'lang' in entry.data ? (entry.data as Record<string, unknown>).lang : undefined;
				return lang === fallbackLocale;
			})
			: undefined);
}

/**
 * Returns published lesson slugs for given locale (from getCoursesForLocale).
 */
export function getCourseSlugsForLocale(
	entries: CourseEntry[],
	locale: Locale,
): string[] {
	return getCoursesForLocale(entries, locale).map((entry) => entry.data.slug);
}

/**
 * Returns published lessons for a specific course and locale.
 * Sorted by order ascending.
 * Returns [] for unknown course slug (no throw — referential integrity).
 */
export function getLessonsForCourse(
	lessons: LessonEntry[],
	courseSlug: string,
	locale: Locale,
): LessonEntry[] {
	return lessons
		.filter(
			(lesson) =>
				lesson.data.course === courseSlug &&
				lesson.data.lang === locale &&
				lesson.data.published,
		)
		.sort((a, b) => a.data.order - b.data.order);
}

/**
 * Returns the preview image path for a course entry.
 */
export function getCoursePreviewImage(entry: CourseEntry): string | undefined {
	return 'image' in entry.data && typeof entry.data.image === 'string'
		? entry.data.image
		: undefined;
}
