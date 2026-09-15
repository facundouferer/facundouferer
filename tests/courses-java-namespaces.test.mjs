import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('Java course lesson 11 in Spanish explains namespace concept and packages', async () => {
	const content = await readFile(
		'src/content/courses/java/11-clases-abstractas-interfaces-y-modelado.es.md',
		'utf8',
	);

	// Explains namespace concept
	assert.match(content, /namespace|espacio[s]? de nombres/i);
	// Explains Java implements namespaces through packages without a namespace keyword
	assert.match(content, /package/);
	assert.match(content, /FQCN|Fully Qualified Class Name|nombre completamente calificado/i);
	// Collision resolution example
	assert.match(content, /java\.util\.Date/);
	assert.match(content, /java\.sql\.Date/);
	// Explains package-private and reverse domain convention
	assert.match(content, /package-private/);
	assert.match(content, /com\./);
});

test('Java course lesson 11 in English explains namespace concept and packages', async () => {
	const content = await readFile(
		'src/content/courses/java/11-clases-abstractas-interfaces-y-modelado.en.md',
		'utf8',
	);

	// Explains namespace concept
	assert.match(content, /namespace/i);
	// Explains Java implements namespaces through packages without a namespace keyword
	assert.match(content, /package/);
	assert.match(content, /FQCN|Fully Qualified Class Name/i);
	// Collision resolution example
	assert.match(content, /java\.util\.Date/);
	assert.match(content, /java\.sql\.Date/);
	// Explains package-private and reverse domain convention
	assert.match(content, /package-private/);
	assert.match(content, /com\./);
});

test('Java course lesson 08 cross-references namespaces in access modifiers section', async () => {
	const esContent = await readFile(
		'src/content/courses/java/08-constructores-y-encapsulamiento.es.md',
		'utf8',
	);
	const enContent = await readFile(
		'src/content/courses/java/08-constructores-y-encapsulamiento.en.md',
		'utf8',
	);

	assert.match(esContent, /namespace/i);
	assert.match(enContent, /namespace/i);
});
