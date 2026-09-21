import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';

// --- design system: ported .field / .radio -----------------------------

test('global.css ports .field and .radio from Organic (needed for the quiz UI)', async () => {
	const content = await readFile('src/styles/global.css', 'utf8');
	assert.match(content, /\.field\s*>\s*label\s*\{/);
	assert.match(content, /\.radio\s*\{/);
	assert.match(content, /\.radio \.dot\s*\{/);
	assert.match(content, /stroke-width/, 'sanity: file still has existing Lucide stroke-width rules');
});

// --- LessonActivitiesAccess component -----------------------------------

test('LessonActivitiesAccess component exists', () => {
	assert.ok(existsSync('src/components/LessonActivitiesAccess.astro'));
});

test('LessonActivitiesAccess links to the activities list route and shows the count', async () => {
	const content = await readFile('src/components/LessonActivitiesAccess.astro', 'utf8');
	assert.match(content, /\/cursos\/\$\{course\}\/\$\{lesson\}\/actividades/);
	assert.match(content, /withBase/);
	assert.match(content, /count/);
});

test('LessonActivitiesAccess renders nothing when count is 0', async () => {
	const content = await readFile('src/components/LessonActivitiesAccess.astro', 'utf8');
	assert.match(content, /count\s*<=?\s*0|!count/);
	assert.match(content, /return null/);
});

test('LessonActivitiesAccess uses a Lucide icon at stroke-width 2.75', async () => {
	const content = await readFile('src/components/LessonActivitiesAccess.astro', 'utf8');
	assert.match(content, /stroke-width="2\.75"/);
});

// --- Lesson page integration ---------------------------------------------

test('Spanish lesson page imports and conditionally renders LessonActivitiesAccess next to the title', async () => {
	const content = await readFile('src/pages/cursos/[course]/[lesson].astro', 'utf8');
	assert.match(content, /import LessonActivitiesAccess from/);
	assert.match(content, /getActivitiesForLesson/);
	assert.match(content, /<LessonActivitiesAccess/);
});

// --- List page: /cursos/[course]/[lesson]/actividades --------------------

const LIST_PAGE = 'src/pages/cursos/[course]/[lesson]/actividades/index.astro';
const DETAIL_PAGE = 'src/pages/cursos/[course]/[lesson]/actividades/[activity].astro';

test('activities list page exists', () => {
	assert.ok(existsSync(LIST_PAGE));
});

test('activities list page declares getStaticPaths and only includes lessons with activities', async () => {
	const content = await readFile(LIST_PAGE, 'utf8');
	assert.match(content, /export async function getStaticPaths/);
	assert.match(content, /getActivitiesForLesson/);
});

test('activities list page renders lesson context, a back link, and activity cards with kind tags', async () => {
	const content = await readFile(LIST_PAGE, 'utf8');
	assert.match(content, /courses\.activities\.backToLesson/);
	assert.match(content, /courses\.activities\.kind\.project/);
	assert.match(content, /courses\.activities\.kind\.quiz/);
	assert.match(content, /card-title/);
	assert.match(content, /actividades\/\$\{/, 'expected a link to the activity detail route');
});

// --- Detail page: /cursos/[course]/[lesson]/actividades/[activity] -------

test('activity detail page exists', () => {
	assert.ok(existsSync(DETAIL_PAGE));
});

test('activity detail page declares getStaticPaths from the activities collection', async () => {
	const content = await readFile(DETAIL_PAGE, 'utf8');
	assert.match(content, /export async function getStaticPaths/);
	assert.match(content, /getCollection\('activities'\)/);
});

test('activity detail page renders a back link to the activities list', async () => {
	const content = await readFile(DETAIL_PAGE, 'utf8');
	assert.match(content, /courses\.activities\.backToList/);
});

test('activity detail page branches on kind: project renders markdown Content plus objectives/requirements', async () => {
	const content = await readFile(DETAIL_PAGE, 'utf8');
	assert.match(content, /entry\.data\.kind === 'project'/);
	assert.match(content, /<Content\s*\/>/);
	assert.match(content, /entry\.data\.objectives/);
	assert.match(content, /entry\.data\.requirements/);
});

test('activity detail page branches on kind: quiz renders questions as accessible fieldset/legend radio groups', async () => {
	const content = await readFile(DETAIL_PAGE, 'utf8');
	assert.match(content, /entry\.data\.kind === 'quiz'/);
	assert.match(content, /<fieldset/);
	assert.match(content, /<legend/);
	assert.match(content, /class="radio"/);
	assert.match(content, /type="radio"/);
});

test('activity detail page embeds question grading data and wires the Calificar/Reintentar buttons', async () => {
	const content = await readFile(DETAIL_PAGE, 'utf8');
	assert.match(content, /data-quiz-questions/);
	assert.match(content, /data-quiz-grade/);
	assert.match(content, /data-quiz-retry/);
	assert.match(content, /data-quiz-score/);
});

test('activity detail page imports the pure grading module in its client script (not reimplemented inline)', async () => {
	const content = await readFile(DETAIL_PAGE, 'utf8');
	assert.match(content, /import\s*\{[^}]*gradeQuiz[^}]*\}\s*from\s*'[^']*data\/activities\/grading'/);
	assert.match(content, /formatScore/);
});

test('activity detail page shows correct/incorrect state and the explanation ("por qué") per question', async () => {
	const content = await readFile(DETAIL_PAGE, 'utf8');
	assert.match(content, /courses\.activities\.quiz\.correct/);
	assert.match(content, /courses\.activities\.quiz\.incorrect/);
	assert.match(content, /courses\.activities\.quiz\.whyLabel/);
	assert.match(content, /getCorrectAnswerLabel/);
});

test('activity detail page shows the score normalized to 10 via formatScore', async () => {
	const content = await readFile(DETAIL_PAGE, 'utf8');
	assert.match(content, /data-quiz-score-value/);
	assert.match(content, /formatScore\(/);
});

// --- code snippets: question prompt on top, real code block below it -------

test('activity detail page renders question code with the site-wide Code component, reusing article-body pre/code styling', async () => {
	const content = await readFile(DETAIL_PAGE, 'utf8');
	assert.match(content, /import\s*\{\s*Code\s*\}\s*from\s*'astro:components'/);
	assert.match(content, /question\.code/);
	assert.match(content, /<Code\s/);
	assert.match(content, /lang=\{question\.codeLanguage/);
	// The code block must sit inside an `.article-body` ancestor so it picks
	// up the same pre/code styling already used for lesson/article content.
	assert.match(content, /class="article-body quiz-code"[^>]*>[\s\S]{0,400}?<Code\s/);
});

test('activity detail page renders prompt/option/explanation text through the safe inline-code renderer', async () => {
	const content = await readFile(DETAIL_PAGE, 'utf8');
	assert.match(content, /import\s*\{\s*renderInlineCode\s*\}\s*from\s*'[^']*utils\/renderInlineCode'/);
	assert.match(content, /renderInlineCode\(question\.prompt\)/);
	assert.match(content, /renderInlineCode\(option\.text\)/);
	assert.match(content, /renderInlineCode\(question\.explanation\)/);
});

// --- options layout: stacked, not cramped inline ----------------------------

test('quiz options stack vertically instead of flowing inline (the reported "cramped" bug)', async () => {
	const content = await readFile(DETAIL_PAGE, 'utf8');
	const rule = content.match(/\.quiz-options\s*\{([^}]*)\}/);
	assert.ok(rule, 'expected a .quiz-options rule');
	assert.match(rule[1], /display:\s*grid/, '.quiz-options must lay out its .radio children as a vertical stack');
});

test('activity detail page forces display:none on hidden quiz action buttons (.btn overrides native [hidden] otherwise)', async () => {
	// Regression: .btn sets display:inline-flex, an author style that (per CSS
	// cascade rules) beats the browser's UA [hidden]{display:none} rule, so a
	// hidden .btn still renders. LessonPresentationsMenu hit the same issue
	// for its .card panel. Verified live in-browser: without this override,
	// "Calificar" and "Reintentar" are both visible after grading.
	const content = await readFile(DETAIL_PAGE, 'utf8');
	assert.match(content, /\[hidden\]\s*\{[^}]*display:\s*none\s*!important/);
});

// --- i18n ------------------------------------------------------------------

test('i18n dictionaries expose courses.activities strings for badge, headings, and quiz UI', async () => {
	const es = JSON.parse(await readFile('src/i18n/es.json', 'utf8'));
	const en = JSON.parse(await readFile('src/i18n/en.json', 'utf8'));
	for (const dict of [es, en]) {
		assert.ok(dict.courses?.activities?.badge?.one);
		assert.ok(dict.courses?.activities?.badge?.other);
		assert.ok(dict.courses?.activities?.accessLabel);
		assert.ok(dict.courses?.activities?.backToLesson);
		assert.ok(dict.courses?.activities?.backToList);
		assert.ok(dict.courses?.activities?.kind?.project);
		assert.ok(dict.courses?.activities?.kind?.quiz);
		assert.ok(dict.courses?.activities?.quiz?.gradeButton);
		assert.ok(dict.courses?.activities?.quiz?.retryButton);
		assert.ok(dict.courses?.activities?.quiz?.correct);
		assert.ok(dict.courses?.activities?.quiz?.incorrect);
		assert.ok(dict.courses?.activities?.quiz?.whyLabel);
		assert.ok(dict.courses?.activities?.quiz?.trueLabel);
		assert.ok(dict.courses?.activities?.quiz?.falseLabel);
	}
});

// --- documentation -----------------------------------------------------

test('AGENTS.md documents the activities content model', async () => {
	const content = await readFile('AGENTS.md', 'utf8');
	assert.match(content, /Activities/);
	assert.match(content, /getActivitiesForLesson/);
	assert.match(content, /gradeQuiz/);
});
