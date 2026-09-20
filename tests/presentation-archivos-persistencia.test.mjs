import { test } from 'node:test';
import assert from 'node:assert';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { presentations, getPresentationsForLesson, getLessonForPresentation } from '../src/data/presentations.ts';

test('presentations catalog carries the archivos-persistencia-jar-java record', () => {
	const pres = presentations.find((p) => p.slug === 'archivos-persistencia-jar-java');
	assert.ok(pres, 'archivos-persistencia-jar-java must be registered in presentations array');
	assert.equal(pres.lesson.course, 'java');
	assert.equal(pres.lesson.slug, '17-archivos-persistencia-y-empaquetado-jar');
	assert.equal(pres.image, '/img/presentations/archivos-persistencia-jar-java.svg');
});

test('getPresentationsForLesson maps to java/17-archivos-persistencia-y-empaquetado-jar', () => {
	const mapped = getPresentationsForLesson('java', '17-archivos-persistencia-y-empaquetado-jar');
	assert.ok(mapped.some((p) => p.slug === 'archivos-persistencia-jar-java'));
	const lesson = getLessonForPresentation('archivos-persistencia-jar-java');
	assert.deepEqual(lesson, { course: 'java', slug: '17-archivos-persistencia-y-empaquetado-jar' });
});

test('presentation card SVG asset exists', () => {
	assert.ok(existsSync('public/img/presentations/archivos-persistencia-jar-java.svg'));
});

test('presentation Astro component exists and contains 7 slides with interactive simulators', async () => {
	assert.ok(existsSync('src/components/presentaciones/archivos-persistencia-jar-java.astro'));
	const content = await readFile('src/components/presentaciones/archivos-persistencia-jar-java.astro', 'utf8');
	assert.match(content, /data-slide="1"/);
	assert.match(content, /data-slide="2"/);
	assert.match(content, /data-slide="3"/);
	assert.match(content, /data-slide="4"/);
	assert.match(content, /data-slide="5"/);
	assert.match(content, /data-slide="6"/);
	assert.match(content, /data-slide="7"/);
	assert.match(content, /InputStream|OutputStream|Reader|Writer/i);
	assert.match(content, /BufferedInputStream|Decorador/i);
	assert.match(content, /NIO\.2|Files\.readAllLines/i);
	assert.match(content, /serialVersionUID/i);
	assert.match(content, /MANIFEST\.MF|jpackage/i);
});

test('both presentation detail pages import and map archivos-persistencia-jar-java', async () => {
	for (const file of [
		'src/pages/presentaciones/[slug].astro',
		'src/pages/[lang]/presentaciones/[slug].astro',
	]) {
		const content = await readFile(file, 'utf8');
		assert.match(content, /ArchivosPersistenciaJarJava/);
		assert.match(content, /'archivos-persistencia-jar-java':\s*ArchivosPersistenciaJarJava/);
	}
});
