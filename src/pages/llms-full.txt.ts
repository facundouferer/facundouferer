import { getCollection } from 'astro:content';
import { AUTHOR, SITE_URL } from '../config/site';
import { getArticlesForLocale } from '../utils/articles';

export async function GET() {
	const articles = getArticlesForLocale(await getCollection('articles'), 'en', 'es');
	const projects = (await getCollection('projects')).filter((item) => item.data.published);

	const body = [
		'# Facundo Uferer',
		'',
		`Site: ${SITE_URL}`,
		`Author: ${AUTHOR.name}`,
		`Role: ${AUTHOR.jobTitle.en}`,
		'',
		'## Summary',
		'This website presents consulting capabilities, selected projects, and bilingual technical articles focused on AI-assisted software engineering, multi-agent workflows, automation, architecture, and modern web development.',
		'',
		'## Primary navigation',
		'- /',
		'- /en/',
		'- /proyectos',
		'- /en/projects',
		'- /articulos',
		'- /en/articles',
		'- /rss.xml',
		'',
		'## Projects',
		...projects.map(
			(project) => `- ${project.data.title_en} — ${project.data.description_en} (${project.data.liveUrl})`,
		),
		'',
		'## Articles',
		...articles.map(
			(article) =>
				`- ${article.data.title_en} — ${article.data.excerpt_en} (${SITE_URL}/en/articles/${article.data.slug})`,
		),
	].join('\n');

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
		},
	});
}
