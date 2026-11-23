import test from 'node:test';
import assert from 'node:assert/strict';
import { escapeHtml, highlightCode, highlightLine } from '../src/utils/highlightCode.ts';

test('escapeHtml neutralizes markup characters', () => {
	assert.equal(escapeHtml('<a href="x">&\'</a>'), '&lt;a href=&quot;x&quot;&gt;&amp;&#39;&lt;/a&gt;');
});

test('text language is escaped only, without token spans', () => {
	const lines = highlightCode('¡Hola, Mundo desde Java!\n<fin>', 'text');
	assert.deepEqual(lines, ['¡Hola, Mundo desde Java!', '&lt;fin&gt;']);
});

test('java keywords, types, functions, strings and punctuation get their token classes', () => {
	const [line] = highlightCode('public static void main(String[] args) { System.out.println("Hola"); }', 'java');
	assert.match(line, /<span class="tok-kw">public<\/span>/);
	assert.match(line, /<span class="tok-kw">static<\/span>/);
	assert.match(line, /<span class="tok-kw">void<\/span>/);
	assert.match(line, /<span class="tok-fn">main<\/span>/);
	assert.match(line, /<span class="tok-type">String<\/span>/);
	assert.match(line, /<span class="tok-type">System<\/span>/);
	assert.match(line, /<span class="tok-fn">println<\/span>/);
	assert.match(line, /<span class="tok-str">&quot;Hola&quot;<\/span>/);
	assert.match(line, /<span class="tok-punct">;<\/span>/);
	// identifiers that are neither keywords, types nor calls stay plain text
	assert.match(line, /<\/span> args</);
	assert.doesNotMatch(line, /tok-\w+">args</);
});

test('java numbers, operators, annotations and line comments are tokenized', () => {
	const [line] = highlightCode('@Override int fin = Math.min(10, texto.length()); // límite', 'java');
	assert.match(line, /<span class="tok-ann">@Override<\/span>/);
	assert.match(line, /<span class="tok-num">10<\/span>/);
	assert.match(line, /<span class="tok-op">=<\/span>/);
	assert.match(line, /<span class="tok-fn">min<\/span>/);
	assert.match(line, /<span class="tok-cmt">\/\/ límite<\/span>/);
});

test('java block comments spanning lines are split so each line is self-contained', () => {
	const lines = highlightCode('/*\n   Comentario\n*/\nint x = 1;', 'java');
	assert.equal(lines.length, 4);
	assert.equal(lines[0], '<span class="tok-cmt">/*</span>');
	assert.equal(lines[1], '<span class="tok-cmt">   Comentario</span>');
	assert.equal(lines[2], '<span class="tok-cmt">*/</span>');
	assert.match(lines[3], /<span class="tok-kw">int<\/span>/);
});

test('bash marks the command word, flags, comments and strings', () => {
	const lines = highlightCode('javac HolaMundo.java\njava --version # versión\njava SaludoPersonalizado "Facundo"', 'bash');
	assert.equal(lines.length, 3);
	assert.match(lines[0], /^<span class="tok-cmd">javac<\/span> HolaMundo\.java$/);
	assert.match(lines[1], /<span class="tok-cmd">java<\/span>/);
	assert.match(lines[1], /<span class="tok-flag">--version<\/span>/);
	assert.match(lines[1], /<span class="tok-cmt"># versión<\/span>/);
	assert.match(lines[2], /<span class="tok-str">&quot;Facundo&quot;<\/span>/);
	// only the first word of a command is a command
	assert.doesNotMatch(lines[2], /tok-cmd">SaludoPersonalizado/);
});

test('highlightLine returns the first highlighted line', () => {
	assert.equal(highlightLine('java HolaMundo', 'bash'), '<span class="tok-cmd">java</span> HolaMundo');
});

test('c marks preprocessor directives, keywords, types, functions, strings and comments', () => {
	const lines = highlightCode(
		'#include <stdio.h>\nint main(void) {\n    size_t n = sizeof(int); // bytes\n    printf("%zu\\n", n);\n    return 0;\n}',
		'c',
	);
	assert.equal(lines.length, 6);
	assert.match(lines[0], /^<span class="tok-ann">#include<\/span>/);
	assert.match(lines[0], /&lt;stdio\.h&gt;/);
	assert.match(lines[1], /<span class="tok-kw">int<\/span> <span class="tok-fn">main<\/span>/);
	assert.match(lines[1], /<span class="tok-kw">void<\/span>/);
	assert.match(lines[2], /<span class="tok-type">size_t<\/span>/);
	assert.match(lines[2], /<span class="tok-kw">sizeof<\/span>/);
	assert.match(lines[2], /<span class="tok-cmt">\/\/ bytes<\/span>/);
	assert.match(lines[3], /<span class="tok-fn">printf<\/span>/);
	assert.match(lines[3], /<span class="tok-str">&quot;%zu\\n&quot;<\/span>/);
	assert.match(lines[4], /<span class="tok-kw">return<\/span> <span class="tok-num">0<\/span>/);
});

test('c knows C23 keywords and pointer operators', () => {
	const [line] = highlightCode('constexpr bool ok = true; int *p = nullptr; p->x;', 'c');
	for (const kw of ['constexpr', 'bool', 'true', 'int', 'nullptr']) {
		assert.match(line, new RegExp(`<span class="tok-kw">${kw}</span>`));
	}
	assert.match(line, /<span class="tok-op">-&gt;<\/span>/);
});
