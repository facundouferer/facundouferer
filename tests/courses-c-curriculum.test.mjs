import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

// The C course curriculum (odd/tasks/c-course-redesign.md, S4, S5, S10):
// 44 lessons in a fixed order, a roadmap that follows it, an exercises section
// with solutions in every lesson, the topics each lesson owns, and no topic
// used before the lesson that teaches it. The redesign ships by stages; a
// lesson is enforced once its stage is done (DONE_STAGE). Lessons of later
// stages are checked only for their order when their file already exists.

import { DONE_STAGE, LESSONS, TAUGHT_AT, orderOf } from './helpers/c-curriculum.mjs';

const C_DIR = 'src/content/courses/c';

const LOCALES = [
	{ lang: 'es', exercises: '## Ejercicios prácticos', solution: '<summary>Ver solución</summary>' },
	{ lang: 'en', exercises: '## Practice exercises', solution: '<summary>Show solution</summary>' },
];

// Topics each lesson must teach (S4): `all` are code tokens shared by both
// locales; `es`/`en` are words in the lesson's language.
const REQUIRED = {
	'compilacion-y-enlazado': {
		all: ['-std=c23', '-Wall', '-Wextra', '-Wpedantic', '-E', ' -c ', '.o', 'C17'],
		es: ['preprocesador', 'enlazador', 'advertencia'],
		en: ['preprocessor', 'linker', 'warning'],
	},
	'variables-y-constantes': { all: ['const ', '#define'], es: ['literal'], en: ['literal'] },
	'tipos-de-datos': {
		all: ['sizeof', 'size_t', '%zu', 'unsigned', 'bool', '(double)', 'INT_MAX'],
		es: ['conversión implícita', 'conversión explícita'],
		en: ['implicit conversion', 'explicit conversion'],
	},
	'entrada-y-salida': { all: ['scanf', 'printf', '!= 1'], es: ['validar'], en: ['validat'] },
	operadores: {
		all: ['&&', '||', '%'],
		es: ['cortocircuito', 'comportamiento indefinido'],
		en: ['short-circuit', 'undefined behavior'],
	},
	'modularizacion-subprogramas-y-funciones': {
		all: ['#ifndef', '#define', '#endif', '.h', '.c', '-std=c23'],
		es: ['prototipo', 'enlaz'],
		en: ['prototype', 'link'],
	},
	'variables-parametros-y-pasaje': {
		all: ['return'],
		es: ['siempre por valor', 'alcance', 'duración'],
		en: ['always by value', 'scope', 'duration'],
	},
	recursividad: { all: ['return'], es: ['pila de llamadas', 'caso base'], en: ['call stack', 'base case'] },
	'punteros-y-direcciones': {
		all: ['&', 'int *', '%p', 'NULL', '*p'],
		es: ['dirección', 'desreferenc'],
		en: ['address', 'dereferenc'],
	},
	'punteros-arreglos-y-estructuras': {
		all: ['->', 'void *', '**', 'p + 1', '(*'],
		es: ['aritmética de punteros'],
		en: ['pointer arithmetic'],
	},
	'duracion-y-ciclo-de-vida': {
		all: ['static'],
		es: ['duración automática', 'duración estática', 'tiempo de vida', 'comportamiento indefinido', 'colgante'],
		en: ['automatic storage duration', 'static storage duration', 'lifetime', 'undefined behavior', 'dangling'],
	},
	'memoria-dinamica': {
		all: ['malloc(', 'calloc(', 'realloc(', 'free(', 'NULL', 'sizeof'],
		es: ['montículo'],
		en: ['heap'],
	},
	'propiedad-y-errores-de-memoria': {
		all: ['free(', '-fsanitize=address'],
		es: ['fuga', 'doble liberación', 'uso después de liberar', 'propiedad'],
		en: ['leak', 'double free', 'use after free', 'ownership'],
	},
	// Stage 2
	'sentencia-if-else': { all: ['else if'], es: ['condición'], en: ['condition'] },
	'operador-ternario': { all: [' ? ', ' : '], es: ['expresión'], en: ['expression'] },
	'sentencia-switch-y-bloques-de-codigo': { all: ['switch', 'case', 'break', 'default'], es: ['alcance', 'bloque'], en: ['scope', 'block'] },
	'sentencia-while': { all: ['while ('], es: ['centinela'], en: ['sentinel'] },
	'sentencia-for': { all: ['for ('], es: ['contador'], en: ['counter'] },
	'sentencia-do-while': { all: ['do {', 'break', 'continue'], es: ['al menos una vez'], en: ['at least once'] },
	'programacion-esquematica-y-sentencias-anidadas': { all: [], es: ['refinamiento'], en: ['refinement'] },
	'manejo-de-estructuras-secuenciales-de-datos': { all: [], es: ['arreglo'], en: ['array'] },
	'arreglos-unidimensionales-y-multidimensionales': { all: ['sizeof', '[3][4]'], es: ['índice', 'límite'], en: ['index', 'bound'] },
	'operaciones-con-arreglos': { all: ['size_t'], es: ['recorr'], en: ['travers'] },
	'cadenas-de-caracteres-y-operaciones': { all: ["'\\0'", 'strlen', 'fgets', 'snprintf'], es: ['capacidad'], en: ['capacity'] },
	'concepto-de-estructuras': { all: ['struct', 'union', 'enum', 'typedef'], es: ['relleno'], en: ['padding'] },
	'busqueda-en-arreglos': { all: ['O(log n)', 'O(n)'], es: ['búsqueda binaria', 'complejidad'], en: ['binary search', 'complexity'] },
	'ordenacion-de-arreglos': { all: ['O(n'], es: ['complejidad', 'estable'], en: ['complexity', 'stable'] },
	'estructuras-dinamicas-listas': { all: ['malloc(', 'free(', 'NULL', '->'], es: ['nodo'], en: ['node'] },
	'estructuras-dinamicas-pilas': { all: ['malloc(', 'free(', '->'], es: ['pila', 'apilar'], en: ['stack', 'push'] },
	'estructuras-dinamicas-colas': { all: ['malloc(', 'free(', '->'], es: ['cola', 'encolar'], en: ['queue', 'enqueue'] },
	'arboles-binarios': { all: ['malloc(', 'free(', '->'], es: ['recorrido', 'árbol binario de búsqueda'], en: ['traversal', 'binary search tree'] },
	'biblioteca-estandar-y-errores': { all: ['strtol', 'errno', '<ctype.h>', 'EOF'], es: ['código de retorno'], en: ['return code'] },
	archivos: { all: ['fopen', 'fclose', 'fread', 'fwrite', 'ferror', 'NULL'], es: ['binario'], en: ['binary'] },
	'introduccion-a-poo-en-c': { all: ['struct'], es: ['abstracción'], en: ['abstraction'] },
	'encapsulacion-y-abstraccion-en-c': { all: ['.h', 'typedef struct'], es: ['opaco'], en: ['opaque'] },
	'objetos-metodos-y-diseno-basado-en-struct': { all: ['->'], es: ['composición'], en: ['composition'] },
	'polimorfismo-y-herencia-simulados-en-c': { all: ['(*'], es: ['límite'], en: ['limit'] },

	// Stages 3 and 4
	'introduccion-y-estructura': { all: ['#include <stdio.h>', 'int main(void)', 'C23'], es: ['estándar'], en: ['standard'] },
	'procesos-y-estados': { all: [], es: ['algoritmo', 'estado'], en: ['algorithm', 'state'] },
	'depuracion-y-sanitizers': { all: ['-g', '-fsanitize=address', '-fsanitize=undefined', 'gdb', 'lldb', 'break'], es: ['reproducir', 'aislar'], en: ['reproduce', 'isolate'] },
	'pruebas-estilo-y-portabilidad': { all: ['assert(', 'NDEBUG'], es: ['prueba unitaria', 'portabilidad', 'convención'], en: ['unit test', 'portability', 'convention'] },
	'c23-moderno': { all: ['constexpr', 'typeof', 'nullptr', '#embed', '_BitInt', '[[nodiscard]]', '-std=c23'], es: ['extensión'], en: ['extension'] },
	'preprocesador-y-programacion-generica': { all: ['#define', '__VA_ARGS__', '_Generic', 'inline'], es: ['macro'], en: ['macro'] },
	'concurrencia-threads-y-atomics': { all: ['<threads.h>', 'thrd_create', 'mtx_lock', 'atomic_int', 'pthread'], es: ['condición de carrera'], en: ['race condition'] },
};

const pathOf = (lesson, lang) => `${C_DIR}/${lesson.file}.${lang}.md`;
const read = (lesson, lang) => readFile(pathOf(lesson, lang), 'utf8');
const field = (content, key) => content.match(new RegExp(`^${key}:\\s*'?([^'\\n]+)'?\\s*$`, 'm'))?.[1].trim();
// Prose and code, without inline SVG and HTML comments.
const body = (content) => content.replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<!--[\s\S]*?-->/g, '');

const done = (lesson) => lesson.stage <= DONE_STAGE;
const present = (lesson) => existsSync(pathOf(lesson, 'es'));

test('every C lesson file belongs to the target curriculum', async () => {
	const expected = new Set(LESSONS.flatMap((lesson) => LOCALES.map(({ lang }) => `${lesson.file}.${lang}.md`)));
	const files = (await readdir(C_DIR)).filter((name) => /\.(es|en)\.md$/.test(name));
	for (const file of files) assert.ok(expected.has(file), `unexpected lesson file ${file}`);
});

for (const lesson of LESSONS.filter((lesson) => done(lesson) || present(lesson))) {
	for (const { lang } of LOCALES) {
		test(`${lesson.file}.${lang} declares its slug, order, course, locale and description`, async () => {
			const content = await read(lesson, lang);
			assert.equal(field(content, 'slug'), lesson.slug);
			assert.equal(Number(field(content, 'order')), lesson.order);
			assert.equal(field(content, 'course'), 'c');
			assert.equal(field(content, 'lang'), lang);
			const desc = field(content, 'description');
			assert.ok(desc && desc.length >= 20, `${lesson.file}.${lang} needs a non-empty description`);
		});
	}
}

test('the C roadmap lists the existing lessons in order, each once', async () => {
	const index = await readFile(`${C_DIR}/index.md`, 'utf8');
	const roadmap = index.slice(index.indexOf('\nroadmap:'));
	const slugs = [...roadmap.matchAll(/^\s*-\s*'([^']+)'\s*$/gm)].map((match) => match[1]);
	assert.deepEqual(slugs, LESSONS.filter(present).map((lesson) => lesson.slug));
});

test('the C course declares its standard', async () => {
	const index = await readFile(`${C_DIR}/index.md`, 'utf8');
	assert.match(index, /C23/);
});

for (const lesson of LESSONS.filter(done)) {
	for (const { lang, exercises, solution } of LOCALES) {
		const name = `${lesson.file}.${lang}`;

		test(`${name} ends with at least three exercises with solutions`, async () => {
			const content = await read(lesson, lang);
			const start = content.indexOf(`\n${exercises}\n`);
			assert.ok(start !== -1, `${name} needs "${exercises}"`);
			assert.ok(content.slice(start).split(solution).length - 1 >= 3, `${name} needs 3+ solutions`);
		});

		test(`${name} teaches the topics it owns`, async () => {
			const content = await read(lesson, lang);
			const required = REQUIRED[lesson.slug] ?? {};
			for (const token of [...(required.all ?? []), ...(required[lang] ?? [])]) {
				assert.ok(content.toLowerCase().includes(token.toLowerCase()), `${name} must teach "${token}"`);
			}
		});

		test(`${name} does not use topics taught in a later lesson`, async () => {
			const content = body(await read(lesson, lang));
			for (const [owner, pattern, description] of TAUGHT_AT) {
				if (lesson.order >= orderOf[owner]) continue;
				assert.doesNotMatch(content, pattern, `${name} must not use ${description} before ${owner}`);
			}
		});

		test(`${name} does not use C++ references or void main`, async () => {
			const content = body(await read(lesson, lang));
			assert.doesNotMatch(content, /\b(?:int|char|double|float)\s*&\s*[A-Za-z_]/, 'C has no references');
			assert.doesNotMatch(content, /\bvoid\s+main\s*\(/, 'main returns int');
		});
	}
}
