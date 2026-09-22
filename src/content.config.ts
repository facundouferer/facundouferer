import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
// `z` from 'astro:content' is a value-only re-export (no namespace typing),
// so it cannot be used in a type position (e.g. `z.ZodType<T>`). `ZodType`
// is imported directly from `zod` (the same package astro re-exports as
// `z`, already resolved transitively — not a new dependency) purely as a
// type, for the recursive roadmap schema's explicit annotation below.
import type { ZodType } from 'zod';
import type { RoadmapNode } from './utils/roadmap';

function generateArticleId({ data, entry }: { data: Record<string, unknown>; entry: string }): string {
	const slug = typeof data.slug === 'string' ? data.slug : entry.replace(/\.md$/, '');
	const lang = typeof data.lang === 'string' ? data.lang : 'es';

	return lang === 'both' ? slug : `${slug}__${lang}`;
}

// --- roadmap -------------------------------------------------------------
// Optional mindmap-style learning path for a course: an array of modules,
// each with a bilingual title/description and EITHER `lessons` (a flat list
// of lesson frontmatter slugs, not filenames) OR `children` (nested
// submodules), never both. Recursion is unbounded via `z.lazy`, but the
// `CourseRoadmap.astro` UI renders cleanly for two levels of `children` plus
// a final `lessons` level. See AGENTS.md "Courses and Lessons" for the
// authoring rules and `src/utils/roadmap.ts` for how it is resolved and
// validated against a course's actual lessons (order, referential integrity).
// Declared here, ahead of every collection, because the courses collection
// below references it and it must exist before that declaration (also kept
// out of the articles..courses window that tests/issue-10-content-schema.test.mjs
// slices, so it never collides with that unrelated assertion).
const roadmapNodeSchema: ZodType<RoadmapNode> = z.lazy(() =>
	z
		.object({
			title: z.string(),
			title_en: z.string(),
			description: z.string().optional(),
			description_en: z.string().optional(),
			lessons: z.array(z.string()).min(1).optional(),
			children: z.array(roadmapNodeSchema).min(1).optional(),
		})
		.superRefine((data, ctx) => {
			const hasLessons = Array.isArray(data.lessons);
			const hasChildren = Array.isArray(data.children);
			if (hasLessons === hasChildren) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'A course roadmap node must declare exactly one of "lessons" or "children".',
				});
			}
		}),
);

const projects = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
	schema: z.object({
		slug: z.string(),
		title: z.string(),
		title_en: z.string(),
		category: z.string(),
		description: z.string(),
		description_en: z.string(),
		challenge: z.string(),
		challenge_en: z.string(),
		aiRole: z.string(),
		aiRole_en: z.string(),
		tags: z.array(z.string()).min(1),
		image: z.string(),
		liveUrl: z.string().url(),
		featured: z.boolean().default(false),
		published: z.boolean().default(true),
		archived: z.boolean().default(false),
	}),
});

const articles = defineCollection({
	loader: glob({
		pattern: '**/*.md',
		base: './src/content/articles',
		generateId: generateArticleId,
	}),
	schema: z.object({
		title: z.string(),
		slug: z.string(),
		date: z.coerce.date(),
		author: z.string().default('Facundo Uferer'),
		category: z.string(),
		tags: z.array(z.string()).min(1),
		excerpt: z.string(),
		readingTime: z.number().int().positive(),
		image: z.string().optional(),
		lang: z.enum(['es', 'en', 'both']).default('es'),
		published: z.boolean().default(true),
		featured: z.boolean().default(false),
		doi: z.string().optional(),
	}),
});

const courses = defineCollection({
	loader: glob({ pattern: '**/index.md', base: './src/content/courses' }),
	schema: z.object({
		slug: z.string(),
		title: z.string(),
		title_en: z.string(),
		description: z.string(),
		description_en: z.string(),
		technology: z.string(),
		difficulty: z.string(),
		image: z.string().optional(),
		published: z.boolean().default(true),
		featured: z.boolean().default(false),
		roadmap: z.array(roadmapNodeSchema).optional(),
	}),
});

const lessons = defineCollection({
	loader: glob({
		pattern: '**/*.+(es|en).md',
		base: './src/content/courses',
		generateId: ({ data }) => {
			const course = typeof data.course === 'string' ? data.course : 'unknown';
			const slug = typeof data.slug === 'string' ? data.slug : 'unknown';
			const lang = typeof data.lang === 'string' ? data.lang : 'es';
			return `${course}/${slug}__${lang}`;
		},
	}),
	schema: z.object({
		course: z.string(),
		slug: z.string(),
		title: z.string(),
		description: z.string().optional(),
		order: z.number().int().nonnegative(),
		lang: z.enum(['es', 'en']),
		published: z.boolean().default(true),
	}),
});

// --- activities ---------------------------------------------------------
// Practice activities for course lessons. Locale-split markdown files under
// `src/content/activities/<course>/<lesson>/<slug>.<lang>.md`. `kind`
// discriminates the collection schema so `project` and `quiz` activities
// each carry only their own fields. Question kinds are their own nested
// discriminated union (`single-choice` | `true-false`) so a new kind (e.g.
// `multiple-select`) can be added later without touching existing questions.

const singleChoiceOption = z.object({
	id: z.string(),
	text: z.string(),
});

// Optional code snippet shown below the prompt when a question involves real
// Java code (e.g. multi-statement examples). `codeLanguage` defaults to
// 'java' since every pilot activity so far is a Java lesson. Shared between
// both question kinds so a future kind gets it for free too.
const quizQuestionCodeFields = {
	code: z.string().optional(),
	codeLanguage: z.string().default('java'),
};

const singleChoiceQuestion = z.object({
	kind: z.literal('single-choice'),
	id: z.string(),
	prompt: z.string(),
	...quizQuestionCodeFields,
	options: z.array(singleChoiceOption).min(2),
	correctOptionId: z.string(),
	explanation: z.string(),
});

const trueFalseQuestion = z.object({
	kind: z.literal('true-false'),
	id: z.string(),
	prompt: z.string(),
	...quizQuestionCodeFields,
	correctAnswer: z.boolean(),
	explanation: z.string(),
});

const quizQuestion = z.discriminatedUnion('kind', [singleChoiceQuestion, trueFalseQuestion]);

const activityBaseSchema = {
	course: z.string(),
	lesson: z.string(),
	slug: z.string(),
	title: z.string(),
	description: z.string(),
	order: z.number().int().nonnegative(),
	lang: z.enum(['es', 'en']),
	published: z.boolean().default(true),
	estimatedMinutes: z.number().int().positive().optional(),
};

const projectActivity = z.object({
	...activityBaseSchema,
	kind: z.literal('project'),
	objectives: z.array(z.string()).min(1),
	requirements: z.array(z.string()).min(1),
	exampleOutput: z.string().optional(),
	extensionChallenges: z.array(z.string()).optional(),
	deliveryTips: z.array(z.string()).optional(),
});

const quizActivity = z
	.object({
		...activityBaseSchema,
		kind: z.literal('quiz'),
		questions: z.array(quizQuestion).min(1),
	})
	.superRefine((data, ctx) => {
		for (const [index, question] of data.questions.entries()) {
			if (question.kind === 'single-choice' && !question.options.some((option) => option.id === question.correctOptionId)) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: `questions[${index}].correctOptionId "${question.correctOptionId}" does not match any option id`,
					path: ['questions', index, 'correctOptionId'],
				});
			}
		}
	});

const activities = defineCollection({
	loader: glob({
		pattern: '**/*.+(es|en).md',
		base: './src/content/activities',
		generateId: ({ data }) => {
			const course = typeof data.course === 'string' ? data.course : 'unknown';
			const lesson = typeof data.lesson === 'string' ? data.lesson : 'unknown';
			const slug = typeof data.slug === 'string' ? data.slug : 'unknown';
			const lang = typeof data.lang === 'string' ? data.lang : 'es';
			return `${course}/${lesson}/${slug}__${lang}`;
		},
	}),
	schema: z.discriminatedUnion('kind', [projectActivity, quizActivity]),
});

export const collections = { projects, articles, courses, lessons, activities };
