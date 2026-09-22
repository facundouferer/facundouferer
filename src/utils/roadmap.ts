import type { CollectionEntry } from 'astro:content';

type Locale = 'es' | 'en';
type LessonEntry = CollectionEntry<'lessons'>;

/**
 * Author-facing shape of the optional `roadmap` field on a course's
 * frontmatter (see the `roadmapNodeSchema` in `src/content.config.ts`). A
 * node is either a leaf module that lists lesson slugs directly (`lessons`),
 * or a group module that nests further modules (`children`) — never both.
 * Depth is unbounded via recursion, but the UI renders cleanly for two
 * levels of `children` plus a final `lessons` level (see AGENTS.md).
 */
export type RoadmapNode = {
	title: string;
	title_en: string;
	description?: string;
	description_en?: string;
	lessons?: string[];
	children?: RoadmapNode[];
};

/** One resolved lesson leaf, ready to render as a tree link. */
export type ResolvedRoadmapLesson = {
	slug: string;
	title: string;
	order: number;
	href: string;
};

/**
 * One resolved roadmap node. `step` is the numbered path label ("1", "3.2",
 * ...) used to make the learning sequence explicit in the UI.
 */
export type ResolvedRoadmapNode =
	| {
			kind: 'lessons';
			step: string;
			title: string;
			description?: string;
			lessons: ResolvedRoadmapLesson[];
	  }
	| {
			kind: 'group';
			step: string;
			title: string;
			description?: string;
			children: ResolvedRoadmapNode[];
	  };

/**
 * Resolves a course's authored `roadmap` against its published lessons for
 * one locale (the result of `getLessonsForCourse`), computing step labels
 * and lesson hrefs (base-relative; wrap with `withBase` when rendering).
 *
 * Returns `undefined` when the course has no roadmap — callers render
 * nothing in that case (no heading, no empty block).
 *
 * Fails the build (throws a descriptive `Error`) when the roadmap is
 * inconsistent with the course's actual lessons:
 * - a `lessons` slug does not match any published lesson for the locale;
 * - a lesson slug appears more than once across the whole roadmap;
 * - a published lesson is missing from the roadmap entirely;
 * - the depth-first flattened lesson sequence does not exactly match the
 *   lessons' `order` sequence (the roadmap must follow the lesson order);
 * - a node declares neither `lessons` nor `children`.
 */
export function resolveRoadmap(
	roadmap: RoadmapNode[] | undefined,
	lessons: LessonEntry[],
	locale: Locale,
	courseSlug: string,
): ResolvedRoadmapNode[] | undefined {
	if (!roadmap || roadmap.length === 0) return undefined;

	const lessonBySlug = new Map(lessons.map((lesson) => [lesson.data.slug, lesson]));
	const seenSlugs = new Set<string>();
	const flattenedSlugs: string[] = [];

	function resolveNode(node: RoadmapNode, step: string): ResolvedRoadmapNode {
		const title = locale === 'es' ? node.title : node.title_en;
		const description = locale === 'es' ? node.description : node.description_en;

		if (node.lessons) {
			const resolvedLessons: ResolvedRoadmapLesson[] = node.lessons.map((slug) => {
				const entry = lessonBySlug.get(slug);
				if (!entry) {
					throw new Error(
						`Course "${courseSlug}" roadmap references lesson slug "${slug}" (locale "${locale}"), but no published lesson with that slug exists.`,
					);
				}
				if (seenSlugs.has(slug)) {
					throw new Error(
						`Course "${courseSlug}" roadmap lists lesson slug "${slug}" more than once (locale "${locale}").`,
					);
				}
				seenSlugs.add(slug);
				flattenedSlugs.push(slug);

				const href =
					locale === 'es'
						? `/cursos/${courseSlug}/${slug}`
						: `/en/courses/${courseSlug}/${slug}`;

				return {
					slug,
					title: entry.data.title,
					order: entry.data.order,
					href,
				};
			});

			return { kind: 'lessons', step, title, description, lessons: resolvedLessons };
		}

		if (node.children) {
			const children = node.children.map((child, index) => resolveNode(child, `${step}.${index + 1}`));
			return { kind: 'group', step, title, description, children };
		}

		throw new Error(
			`Course "${courseSlug}" roadmap node "${node.title}" must declare either "lessons" or "children".`,
		);
	}

	const resolved = roadmap.map((node, index) => resolveNode(node, String(index + 1)));

	const publishedSlugsInOrder = [...lessons]
		.sort((a, b) => a.data.order - b.data.order)
		.map((lesson) => lesson.data.slug);

	const missing = publishedSlugsInOrder.filter((slug) => !seenSlugs.has(slug));
	if (missing.length > 0) {
		throw new Error(
			`Course "${courseSlug}" roadmap (locale "${locale}") is missing published lesson(s): ${missing.join(', ')}.`,
		);
	}

	const sameLength = flattenedSlugs.length === publishedSlugsInOrder.length;
	const sameOrder = sameLength && flattenedSlugs.every((slug, index) => slug === publishedSlugsInOrder[index]);
	if (!sameOrder) {
		throw new Error(
			`Course "${courseSlug}" roadmap order (locale "${locale}") does not match the lessons' order sequence. ` +
				`Expected: ${publishedSlugsInOrder.join(' -> ')}. Got: ${flattenedSlugs.join(' -> ')}.`,
		);
	}

	return resolved;
}
