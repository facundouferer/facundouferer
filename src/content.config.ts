import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

function generateArticleId({ data, entry }: { data: Record<string, unknown>; entry: string }): string {
	const slug = typeof data.slug === 'string' ? data.slug : entry.replace(/\.md$/, '');
	const lang = typeof data.lang === 'string' ? data.lang : 'es';

	return lang === 'both' ? slug : `${slug}__${lang}`;
}

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
