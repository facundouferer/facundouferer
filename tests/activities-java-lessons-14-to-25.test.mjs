import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const EXPECTED_LESSON_SLUGS = [
	'13-java-collections-framework-y-genericos', // Order 14
	'14-iteradores-ordenamiento-equals-hashcode', // Order 15
	'11-tad-listas-estaticas-y-dinamicas', // Order 16
	'12-tad-pilas-y-colas', // Order 17
	'15-tad-arboles-binarios-y-busqueda', // Order 18
	'26-arboles-n-arios-y-representacion-con-vectores', // Order 19
	'16-grafos-representacion-y-algoritmos', // Order 20
	'17-archivos-persistencia-y-empaquetado-jar', // Order 21
	'19-programacion-concurrente-hilos-y-pools', // Order 22
	'19-acceso-a-bases-de-datos-jdbc', // Order 23
	'20-testing-junit-y-spring-boot', // Order 24
	'27-depuracion-codigo-limpio-y-refactorizacion', // Order 25
];

const BASE_DIR = join(process.cwd(), 'src/content/activities/java');

test('all 12 requested Java lessons (orders 14 to 25) have their activities directories', () => {
	for (const slug of EXPECTED_LESSON_SLUGS) {
		const dirPath = join(BASE_DIR, slug);
		assert.ok(existsSync(dirPath), `Expected directory src/content/activities/java/${slug} to exist`);
	}
});

test('each lesson from 14 to 25 has exactly one project and one quiz activity in Spanish', () => {
	for (const slug of EXPECTED_LESSON_SLUGS) {
		const dirPath = join(BASE_DIR, slug);
		const files = readdirSync(dirPath).filter((f) => f.endsWith('.es.md'));

		assert.equal(files.length, 2, `Expected exactly 2 .es.md files for lesson ${slug}, found ${files.length}: ${files.join(', ')}`);

		let hasProject = false;
		let hasQuiz = false;

		for (const file of files) {
			const content = readFileSync(join(dirPath, file), 'utf8');

			assert.match(content, /course:\s*'java'/, `${file} should have course: 'java'`);
			assert.match(content, new RegExp(`lesson:\\s*'${slug}'`), `${file} should have lesson: '${slug}'`);
			assert.match(content, /lang:\s*'es'/, `${file} should have lang: 'es'`);
			assert.match(content, /published:\s*true/, `${file} should have published: true`);

			if (/kind:\s*'project'/.test(content)) {
				hasProject = true;
				assert.match(content, /order:\s*1/, `${file} project should have order: 1`);
				assert.match(content, /objectives:/, `${file} should declare objectives`);
				assert.match(content, /requirements:/, `${file} should declare requirements`);
				assert.match(content, /exampleOutput:/, `${file} should declare exampleOutput`);
			} else if (/kind:\s*'quiz'/.test(content)) {
				hasQuiz = true;
				assert.match(content, /order:\s*2/, `${file} quiz should have order: 2`);
				assert.match(content, /questions:/, `${file} should declare questions`);
			}
		}

		assert.ok(hasProject, `Lesson ${slug} must have a kind: 'project' activity`);
		assert.ok(hasQuiz, `Lesson ${slug} must have a kind: 'quiz' activity`);
	}
});
