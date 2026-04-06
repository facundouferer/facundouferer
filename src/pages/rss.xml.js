import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { getArticlesForLocale } from '../utils/articles';

export async function GET(context) {
	const articles = getArticlesForLocale(await getCollection('articles'), 'en', 'es');

	return rss({
		title: 'Facundo Uferer — Technical Articles',
		description: 'Research and applied thinking on software engineering and AI.',
		site: context.site ?? 'https://facundouferer.ar',
		items: articles.map((article) => ({
			title: article.data.title_en,
			pubDate: article.data.date,
			description: article.data.excerpt_en,
			link: `/en/articles/${article.data.slug}`,
		})),
		customData: '<language>en-us</language>',
	});
}
