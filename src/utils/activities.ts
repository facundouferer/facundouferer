import type { CollectionEntry } from 'astro:content';

type Locale = 'es' | 'en';
type ActivityEntry = CollectionEntry<'activities'>;

/**
 * Returns published activities for a given course+lesson+locale, sorted by
 * order ascending. Returns [] when the lesson has no activities (referential
 * integrity — no throw), mirroring `getPresentationsForLesson` in
 * `src/data/presentations.ts`.
 */
export function getActivitiesForLesson(
	entries: ActivityEntry[],
	course: string,
	lesson: string,
	locale: Locale,
): ActivityEntry[] {
	return entries
		.filter(
			(entry) =>
				entry.data.course === course &&
				entry.data.lesson === lesson &&
				entry.data.lang === locale &&
				entry.data.published,
		)
		.sort((a, b) => a.data.order - b.data.order);
}

/**
 * Returns a lesson slug -> published activity count map for one course+locale.
 * Lessons without activities are absent from the returned record, mirroring
 * `getPresentationCountsForCourse` in `src/data/presentations.ts`.
 */
export function getActivityCountsForCourse(
	entries: ActivityEntry[],
	course: string,
	locale: Locale,
): Record<string, number> {
	const counts: Record<string, number> = {};

	for (const entry of entries) {
		if (entry.data.course !== course || entry.data.lang !== locale || !entry.data.published) continue;
		counts[entry.data.lesson] = (counts[entry.data.lesson] ?? 0) + 1;
	}

	return counts;
}

/**
 * Finds one published activity by course+lesson+slug+locale.
 * Returns undefined for an unknown slug (no throw).
 */
export function resolveActivityEntry(
	entries: ActivityEntry[],
	course: string,
	lesson: string,
	slug: string,
	locale: Locale,
): ActivityEntry | undefined {
	return entries.find(
		(entry) =>
			entry.data.course === course &&
			entry.data.lesson === lesson &&
			entry.data.slug === slug &&
			entry.data.lang === locale &&
			entry.data.published,
	);
}
