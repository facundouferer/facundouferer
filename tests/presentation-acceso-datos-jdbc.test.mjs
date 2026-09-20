import { test } from 'node:test';
import assert from 'node:assert';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { presentations, getPresentationsForLesson, getLessonForPresentation } from '../src/data/presentations.ts';

test('presentations catalog carries the acceso-datos-jdbc-java record', () => {
	const pres = presentations.find((p) => p.slug === 'acceso-datos-jdbc-java');
	assert.ok(pres, 'acceso-datos-jdbc-java must be registered in presentations array');
	assert.equal(pres.lesson.course, 'java');
	assert.equal(pres.lesson.slug, '19-acceso-a-bases-de-datos-jdbc');
	assert.equal(pres.image, '/img/presentations/acceso-datos-jdbc-java.svg');
});

test('getPresentationsForLesson maps to java/19-acceso-a-bases-de-datos-jdbc', () => {
	const mapped = getPresentationsForLesson('java', '19-acceso-a-bases-de-datos-jdbc');
	assert.ok(mapped.some((p) => p.slug === 'acceso-datos-jdbc-java'));
	const lesson = getLessonForPresentation('acceso-datos-jdbc-java');
	assert.deepEqual(lesson, { course: 'java', slug: '19-acceso-a-bases-de-datos-jdbc' });
});

test('presentation card SVG asset exists', () => {
	assert.ok(existsSync('public/img/presentations/acceso-datos-jdbc-java.svg'));
});

test('presentation Astro component exists and contains 5 slides with interactive simulators', async () => {
	assert.ok(existsSync('src/components/presentaciones/acceso-datos-jdbc-java.astro'));
	const content = await readFile('src/components/presentaciones/acceso-datos-jdbc-java.astro', 'utf8');
	assert.match(content, /data-slide="1"/);
	assert.match(content, /data-slide="2"/);
	assert.match(content, /data-slide="3"/);
	assert.match(content, /data-slide="4"/);
	assert.match(content, /data-slide="5"/);
	assert.match(content, /Driver|java\.sql|Connection/i);
	assert.match(content, /Inyecci[oó]n SQL|SQL Injection|PreparedStatement/i);
	assert.match(content, /ResultSet|rs\.next/i);
	assert.match(content, /commit|rollback|ACID/i);
	assert.match(content, /HikariCP|Pool|DAO/i);
});

test('both presentation detail pages import and map acceso-datos-jdbc-java', async () => {
	for (const file of [
		'src/pages/presentaciones/[slug].astro',
		'src/pages/[lang]/presentaciones/[slug].astro',
	]) {
		const content = await readFile(file, 'utf8');
		assert.match(content, /AccesoDatosJdbcJava/);
		assert.match(content, /'acceso-datos-jdbc-java':\s*AccesoDatosJdbcJava/);
	}
});
