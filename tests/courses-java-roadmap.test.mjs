import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

// T3 — the Java course roadmap (src/content/courses/java/index.md `roadmap`
// frontmatter) must group every published Spanish lesson exactly once, in a
// depth-first sequence that matches their `order` field exactly. There is no
// `yaml`/`js-yaml` dependency in this project (see package.json), so this
// test does a focused, structure-specific parse instead of a generic YAML
// parse: it relies on the roadmap being authored with lesson slugs as quoted
// block-list items (`- 'slug'`), which is the only place that exact pattern
// appears within the roadmap block.

const JAVA_DIR = 'src/content/courses/java';

function frontmatterValue(content, key) {
	const match = content.match(new RegExp(`^${key}:\\s*(?:'([^']*)'|([^\\n]+))$`, 'm'));
	assert.ok(match, `Expected ${key} in frontmatter`);
	return (match[1] ?? match[2]).trim();
}

async function loadEsLessonSlugsSortedByOrder() {
	const files = (await readdir(JAVA_DIR)).filter((file) => file.endsWith('.es.md'));
	const entries = await Promise.all(
		files.map(async (file) => {
			const content = await readFile(`${JAVA_DIR}/${file}`, 'utf8');
			const publishedRaw = content.match(/^published:\s*([^\n]+)$/m);
			const published = publishedRaw ? publishedRaw[1].trim() !== 'false' : true;
			return {
				slug: frontmatterValue(content, 'slug'),
				order: Number(frontmatterValue(content, 'order')),
				published,
			};
		}),
	);
	return entries
		.filter((entry) => entry.published)
		.sort((a, b) => a.order - b.order)
		.map((entry) => entry.slug);
}

async function readRoadmapBlock() {
	const indexContent = await readFile(`${JAVA_DIR}/index.md`, 'utf8');
	const start = indexContent.indexOf('\nroadmap:');
	assert.ok(start !== -1, 'src/content/courses/java/index.md must declare a roadmap field');
	const closingFrontmatter = indexContent.indexOf('\n---', start);
	return indexContent.slice(start, closingFrontmatter === -1 ? undefined : closingFrontmatter);
}

test('java course index.md declares a roadmap', async () => {
	const indexContent = await readFile(`${JAVA_DIR}/index.md`, 'utf8');
	assert.match(indexContent, /\nroadmap:/);
});

test('java roadmap flattened depth-first lesson sequence matches the ES lessons order exactly, each lesson once', async () => {
	const roadmapBlock = await readRoadmapBlock();
	const flattened = [...roadmapBlock.matchAll(/^\s*-\s*'([^']+)'\s*$/gm)].map((match) => match[1]);
	const expected = await loadEsLessonSlugsSortedByOrder();

	assert.equal(flattened.length, expected.length, 'roadmap must reference every published ES lesson exactly once');
	assert.deepEqual(flattened, expected, "flattened depth-first roadmap order must equal the lessons' order sequence");
	assert.equal(new Set(flattened).size, flattened.length, 'no lesson slug may repeat in the roadmap');
});

test('every roadmap module and submodule node declares both title and title_en', async () => {
	const roadmapBlock = await readRoadmapBlock();
	const titleCount = [...roadmapBlock.matchAll(/^\s*-\s*title:\s*'/gm)].length;
	const titleEnCount = [...roadmapBlock.matchAll(/^\s*title_en:\s*'/gm)].length;

	assert.ok(titleCount > 0, 'expected at least one roadmap module node');
	assert.equal(titleCount, titleEnCount, 'every roadmap node must declare both title and title_en');
});

test('java roadmap groups the course into 5 top-level modules with 7 submodules total (12 nodes)', async () => {
	const roadmapBlock = await readRoadmapBlock();
	const totalNodeCount = [...roadmapBlock.matchAll(/^\s*-\s*title:\s*'/gm)].length;

	assert.equal(totalNodeCount, 12);
});
