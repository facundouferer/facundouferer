import { getCollection, type CollectionEntry } from 'astro:content';

type ProjectEntry = CollectionEntry<'projects'>;

function sortByDateDesc(entries: ProjectEntry[]): ProjectEntry[] {
	return [...entries].sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getPublishedProjects(): Promise<ProjectEntry[]> {
	const entries = await getCollection('projects');
	return sortByDateDesc(entries.filter((item) => item.data.published));
}
