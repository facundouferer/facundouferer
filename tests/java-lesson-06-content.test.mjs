import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const lessonPath = 'src/content/courses/java/06-introduccion-y-pilares-poo';
const activityPath = 'src/content/activities/java/06-introduccion-y-pilares-poo';

test('lesson 06 diagrams are inline, accessible and localized', async () => {
	for (const [locale, labels] of Object.entries({
		es: ['Programación estructurada', 'Programación orientada a objetos', 'Abstracción', 'Encapsulamiento', 'Herencia', 'Polimorfismo'],
		en: ['Procedural programming', 'Object-oriented programming', 'Abstraction', 'Encapsulation', 'Inheritance', 'Polymorphism'],
	})) {
		const source = await readFile(`${lessonPath}.${locale}.md`, 'utf8');
		assert.doesNotMatch(source, /procedural-vs-oop\.jpg|java-oop-four-pillars\.jpg/);
		assert.equal((source.match(/<figure class="diagram">/g) ?? []).length, 2);
		assert.equal((source.match(/<svg\b/g) ?? []).length, 2);
		assert.equal((source.match(/role="img"/g) ?? []).length, 2);
		assert.equal((source.match(/<figcaption>/g) ?? []).length, 2);
		for (const label of labels) assert.ok(source.includes(label), `${locale}: ${label}`);
		assert.match(source, /var\(--color-accent-2/);
	}
});

test('lesson 06 has one project and one quiz scoped to concepts already taught', async () => {
	const files = (await readdir(activityPath)).filter((name) => name.endsWith('.es.md'));
	assert.equal(files.length, 2);
	const sources = await Promise.all(files.map((name) => readFile(`${activityPath}/${name}`, 'utf8')));
	const project = sources.find((source) => /kind: 'project'/.test(source));
	const quiz = sources.find((source) => /kind: 'quiz'/.test(source));
	assert.ok(project);
	assert.ok(quiz);
	for (const source of sources) {
		assert.match(source, /course: 'java'/);
		assert.match(source, /lesson: '06-introduccion-y-pilares-poo'/);
		assert.match(source, /lang: 'es'/);
		assert.doesNotMatch(source, /\bnew\b|\bthis\b|constructor|try\s*\{|catch\s*\(|\bsuper\b/i);
	}
	assert.match(project, /objectives:/);
	assert.match(project, /requirements:/);
	assert.match(quiz, /single-choice/);
	assert.match(quiz, /true-false/);
	assert.ok((quiz.match(/explanation:/g) ?? []).length >= 5);
});
