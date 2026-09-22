import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// The Java Collections Framework and generics are taught in
// 15-java-collections-framework-y-genericos.{es,en}.md (order 16). Iterators,
// sorting, Comparable/Comparator and the equals/hashCode contract are taught
// in 16-iteradores-ordenamiento-equals-hashcode.{es,en}.md (order 17).
//
// These four earlier lessons (orders 10, 11, 12, 13) and the presentations
// that illustrate them must not use List/ArrayList/Map/Set/Optional,
// generics syntax, or Comparable/Comparator/compareTo — those are all
// future-topic APIs and syntax at this point in the course.
//
// 13-tad-listas-estaticas-y-dinamicas and 14-tad-pilas-y-colas are out of
// scope: their `<T>` generic node structures are a known, separate
// structural decision.

const LESSON_FILES = [
	'src/content/courses/java/09-arrays-de-objetos.es.md',
	'src/content/courses/java/09-arrays-de-objetos.en.md',
	'src/content/courses/java/10-herencia-polimorfismo-y-sobrecarga.es.md',
	'src/content/courses/java/10-herencia-polimorfismo-y-sobrecarga.en.md',
	'src/content/courses/java/11-clases-abstractas-interfaces-y-modelado.es.md',
	'src/content/courses/java/11-clases-abstractas-interfaces-y-modelado.en.md',
	'src/content/courses/java/12-excepciones-y-manejo-de-errores.es.md',
	'src/content/courses/java/12-excepciones-y-manejo-de-errores.en.md',
];

const PRESENTATION_FILES = [
	'src/components/presentaciones/arrays-de-objetos-java.astro',
	'src/components/presentaciones/herencia-polimorfismo-sobrecarga-java.astro',
	'src/components/presentaciones/clases-abstractas-interfaces-java.astro',
	'src/components/presentaciones/excepciones-manejo-errores-java.astro',
];

const FORBIDDEN_PATTERNS = [
	{ name: 'List<', pattern: /\bList</ },
	{ name: 'ArrayList', pattern: /\bArrayList\b/ },
	{ name: 'List.of', pattern: /\bList\.of\b/ },
	{ name: 'Map<', pattern: /\bMap</ },
	{ name: 'HashMap', pattern: /\bHashMap\b/ },
	{ name: 'Map.of', pattern: /\bMap\.of\b/ },
	{ name: 'Set<', pattern: /\bSet</ },
	{ name: 'Optional', pattern: /\bOptional\b/ },
	{ name: 'Comparable', pattern: /\bComparable\b/ },
	{ name: 'Comparator', pattern: /\bComparator\b/ },
	{ name: '<T>', pattern: /<T>/ },
];

function assertNoCollectionsOrGenerics(filePath, content) {
	for (const { name, pattern } of FORBIDDEN_PATTERNS) {
		assert.doesNotMatch(
			content,
			pattern,
			`${filePath} should not use "${name}" — the Collections Framework and generics are taught later, in lesson 15-java-collections-framework-y-genericos (order 16), and Comparable/Comparator in lesson 16-iteradores-ordenamiento-equals-hashcode (order 17)`,
		);
	}
}

for (const filePath of LESSON_FILES) {
	test(`${filePath} does not use collections/generics/Comparable syntax`, async () => {
		const content = await readFile(filePath, 'utf8');
		assertNoCollectionsOrGenerics(filePath, content);
	});
}

for (const filePath of PRESENTATION_FILES) {
	test(`${filePath} does not use collections/generics/Comparable syntax`, async () => {
		const content = await readFile(filePath, 'utf8');
		assertNoCollectionsOrGenerics(filePath, content);
	});
}
