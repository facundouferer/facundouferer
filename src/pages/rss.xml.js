import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
	const articles = (await getCollection('articles'))
		.filter((entry) => entry.data.published)
		.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

	return rss({
		title: 'Facundo Uferer — Technical Articles',
		description: 'Research and applied thinking on software engineering and AI.',
		site: context.site ?? 'https://facundouferer.github.io/facundouferer',
		items: articles.map((article) => ({
			title: article.data.title_en,
			pubDate: article.data.date,
			description: article.data.excerpt_en,
			link: `/en/articles/${article.data.slug}`,
		})),
		customData: '<language>en-us</language>',
	});
}
