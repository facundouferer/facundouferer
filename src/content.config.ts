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
		title_en: z.string(),
		slug: z.string(),
		date: z.coerce.date(),
		author: z.string().default('Facundo Uferer'),
		category: z.string(),
		tags: z.array(z.string()).min(1),
		excerpt: z.string(),
		excerpt_en: z.string(),
		readingTime: z.number().int().positive(),
		image: z.string().optional(),
		lang: z.enum(['es', 'en', 'both']).default('es'),
		published: z.boolean().default(true),
		featured: z.boolean().default(false),
		doi: z.string().optional(),
	}),
});

export const collections = { projects, articles };
