import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Lesson content must never be wider than a phone screen: a wider page moves
// the fixed "Temario" button partly off screen. Wide tables scroll inside
// themselves (like `figure.diagram`), and long words or inline code wrap.

const css = await readFile('src/styles/article-body.css', 'utf8');
const rule = (selector) => {
	const start = css.indexOf(`${selector} {`);
	assert.ok(start !== -1, `missing rule ${selector}`);
	return css.slice(start, css.indexOf('}', start));
};

test('article body breaks long words instead of widening the page', () => {
	assert.match(rule('.article-body'), /overflow-wrap:\s*break-word/);
});

test('inline code can break anywhere, block code keeps scrolling', () => {
	assert.match(rule('.article-body :global(:not(pre) > code)'), /overflow-wrap:\s*anywhere/);
});

test('on narrow screens wide tables scroll inside themselves', () => {
	const media = css.slice(css.indexOf('@media (width < 960px)'));
	assert.ok(media.length > 0 && css.includes('@media (width < 960px)'), 'missing narrow-screen media query');
	const table = media.slice(media.indexOf('.article-body :global(table) {'), media.indexOf('}', media.indexOf('.article-body :global(table) {')));
	assert.match(table, /display:\s*block/);
	assert.match(table, /overflow-x:\s*auto/);
	assert.match(table, /max-width:\s*100%/);
});

test('quiz questions do not grow to fit their code snippets', async () => {
	// A <fieldset> defaults to `min-width: min-content`, so a wide code block
	// stretches it (and the page) even though the <pre> scrolls.
	const page = await readFile('src/pages/cursos/[course]/[lesson]/actividades/[activity].astro', 'utf8');
	const start = page.indexOf('.quiz-question {');
	assert.match(page.slice(start, page.indexOf('}', start)), /min-width:\s*0/);
});
