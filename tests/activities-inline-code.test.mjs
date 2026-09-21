import test from 'node:test';
import assert from 'node:assert/strict';

// Safe inline-code renderer used for quiz prompts/options/explanations:
// escapes HTML first, then converts backtick-delimited spans (`` `x` ``)
// into <code> elements. No Astro/DOM dependency, so it is unit-tested
// directly, the same way src/data/activities/grading.ts is.

let renderInlineCode;

test('src/utils/renderInlineCode.ts can be loaded and exports renderInlineCode', async () => {
	const mod = await import('../src/utils/renderInlineCode.ts');
	renderInlineCode = mod.renderInlineCode;
	assert.equal(typeof renderInlineCode, 'function');
});

test('renders a single backtick span as a <code> element', () => {
	assert.equal(renderInlineCode('Use `this` inside the method.'), 'Use <code>this</code> inside the method.');
});

test('renders multiple backtick spans in the same string', () => {
	assert.equal(
		renderInlineCode('`int`/`long`/`byte` default to `0`.'),
		'<code>int</code>/<code>long</code>/<code>byte</code> default to <code>0</code>.',
	);
});

test('plain text with no backticks is returned unchanged (aside from escaping)', () => {
	assert.equal(renderInlineCode('No code here.'), 'No code here.');
});

test('escapes HTML special characters before converting backticks', () => {
	assert.equal(
		renderInlineCode('a < b && b > c, and `a < b`'),
		'a &lt; b &amp;&amp; b &gt; c, and <code>a &lt; b</code>',
	);
});

test('never injects raw HTML from content: a literal <script> tag is escaped, not executed', () => {
	const rendered = renderInlineCode('<script>alert(1)</script>');
	assert.doesNotMatch(rendered, /<script>/);
	assert.match(rendered, /&lt;script&gt;/);
});

test('an unmatched (odd) backtick is left as a literal escaped character', () => {
	assert.equal(renderInlineCode('a stray ` backtick'), 'a stray ` backtick');
});

test('escapes quotes so the result is safe inside HTML attributes too', () => {
	assert.equal(renderInlineCode(`He said "hi" and it's fine`), 'He said &quot;hi&quot; and it&#39;s fine');
});
