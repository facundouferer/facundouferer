import { test } from 'node:test';
import assert from 'node:assert';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { presentations, getPresentationsForLesson, getLessonForPresentation } from '../src/data/presentations.ts';

test('presentations catalog carries the testing-junit-spring-boot-java record', () => {
	const pres = presentations.find((p) => p.slug === 'testing-junit-spring-boot-java');
	assert.ok(pres, 'testing-junit-spring-boot-java must be registered in presentations array');
	assert.equal(pres.lesson.course, 'java');
	assert.equal(pres.lesson.slug, '20-testing-junit-y-spring-boot');
	assert.equal(pres.image, '/img/presentations/testing-junit-spring-boot-java.svg');
});

test('getPresentationsForLesson maps to java/20-testing-junit-y-spring-boot', () => {
	const mapped = getPresentationsForLesson('java', '20-testing-junit-y-spring-boot');
	assert.ok(mapped.some((p) => p.slug === 'testing-junit-spring-boot-java'));
	const lesson = getLessonForPresentation('testing-junit-spring-boot-java');
	assert.deepEqual(lesson, { course: 'java', slug: '20-testing-junit-y-spring-boot' });
});

test('presentation card SVG asset exists', () => {
	assert.ok(existsSync('public/img/presentations/testing-junit-spring-boot-java.svg'));
});

test('presentation Astro component exists and contains 5 slides with interactive simulators', async () => {
	assert.ok(existsSync('src/components/presentaciones/testing-junit-spring-boot-java.astro'));
	const content = await readFile('src/components/presentaciones/testing-junit-spring-boot-java.astro', 'utf8');
	assert.match(content, /data-slide="1"/);
	assert.match(content, /data-slide="2"/);
	assert.match(content, /data-slide="3"/);
	assert.match(content, /data-slide="4"/);
	assert.match(content, /data-slide="5"/);
	assert.match(content, /Pirámide de Testing|Testing Pyramid|Pirámide de Tests/i);
	assert.match(content, /Arrange.*Act.*Assert|AAA/i);
	assert.match(content, /@BeforeEach/);
	assert.match(content, /Mockito|Mock/i);
	assert.match(content, /verify\(pasarela/);
	assert.match(content, /@RestController/);
	assert.match(content, /@Service/);
	assert.match(content, /@Repository/);
	assert.match(content, /Inyección de Dependencias|Dependency Injection/i);
	assert.match(content, /201 Created/);
});

test('both presentation detail pages import and map testing-junit-spring-boot-java', async () => {
	for (const file of [
		'src/pages/presentaciones/[slug].astro',
		'src/pages/[lang]/presentaciones/[slug].astro',
	]) {
		const content = await readFile(file, 'utf8');
		assert.match(content, /TestingJunitSpringBootJava/);
		assert.match(content, /'testing-junit-spring-boot-java':\s*TestingJunitSpringBootJava/);
	}
});
