import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { presentations } from '../src/data/presentations.ts';
import { C_FLAGS, findCompiler } from '../scripts/check-c-examples.mjs';

// Report §7 of the C course redesign: every C presentation offers three modes.
// The newer decks implement them inside the deck (Aprender, Practicar,
// Evaluar); the older ones get "Practicar" and "Evaluar" from a data file
// rendered under the deck by PresentationPractice.astro.

const DIR = 'src/data/presentation-practice';
const NATIVE = new Set([
	'compilacion-y-enlazado-c',
	'tipos-sizeof-conversiones-c',
	'punteros-y-direcciones-c',
	'punteros-y-arreglos-c',
	'stack-y-heap-c',
	'memoria-dinamica-paso-a-paso',
	'ciclo-de-vida-objetos-c',
	'estructuras-enlazadas-c',
]);
const VOSEO = /(?<!\p{L})(tenés|podés|querés|hacés|sabés|ejecutás|escribís|usás|hacé|ejecutá|probá|mirá|elegí|fijate|imaginá|compilá|usá|creá|agregá|definí|declará|recordá|pensá|completá)(?!\p{L})/iu;

const cDecks = presentations.filter((p) => p.lesson?.course === 'c' && !NATIVE.has(p.slug));

test('the practice panel is wired into both presentation pages and the catalog is consistent', async () => {
	for (const page of ['src/pages/presentaciones/[slug].astro', 'src/pages/[lang]/presentaciones/[slug].astro']) {
		const source = await readFile(page, 'utf8');
		assert.match(source, /<PresentationPractice/);
		assert.match(source, /presentation-practice\/\*\.ts/);
	}
	for (const lang of ['es', 'en']) {
		const messages = JSON.parse(await readFile(`src/i18n/${lang}.json`, 'utf8'));
		for (const key of ['title', 'practice', 'assess', 'grade', 'retry', 'score', 'correct', 'incorrect', 'why', 'goTo']) {
			assert.ok(messages.presentationPractice?.[key], `${lang}: presentationPractice.${key}`);
		}
	}
});

test('there are older C decks to cover', () => {
	assert.ok(cDecks.length >= 15, `found ${cDecks.length}`);
});

const cc = findCompiler();

for (const deck of cDecks) {
	test(`${deck.slug} has bilingual practice and assessment items`, async () => {
		const file = `${DIR}/${deck.slug}.ts`;
		assert.ok(existsSync(file), `missing ${file}`);
		const { practice } = await import(`../${file}`);
		for (const mode of ['practice', 'assess']) {
			const items = practice[mode];
			assert.ok(items.length >= 5 && items.length <= 8, `${mode}: ${items.length} items`);
			assert.equal(new Set(items.map((item) => item.id)).size, items.length, `${mode}: unique ids`);
			for (const item of items) {
				assert.ok(item.options.length >= 3 && item.options.length <= 4, `${item.id}: 3-4 options`);
				const ids = item.options.map((option) => option.id);
				assert.equal(new Set(ids).size, ids.length, `${item.id}: unique option ids`);
				assert.ok(ids.includes(item.correct), `${item.id}: correct option exists`);
				for (const localized of [item.prompt, item.explanation, ...item.options.map((option) => option.text)]) {
					assert.ok(localized.es?.trim() && localized.en?.trim(), `${item.id}: both languages`);
					assert.doesNotMatch(localized.es, VOSEO, `${item.id}: no voseo`);
				}
			}
		}
		const withCode = [...practice.practice, ...practice.assess].filter((item) => item.code);
		assert.ok(withCode.length >= 4, 'at least four items read code');
	});

	test(`${deck.slug} code items that are complete programs compile`, { skip: !cc && 'no C compiler' }, async () => {
		const { practice } = await import(`../${DIR}/${deck.slug}.ts`);
		const dir = mkdtempSync(join(tmpdir(), 'pp-check-'));
		try {
			let index = 0;
			for (const item of [...practice.practice, ...practice.assess]) {
				if (!item.code) continue;
				for (const code of typeof item.code === 'string' ? [item.code] : [item.code.es, item.code.en]) {
					if (!/\bmain\s*\(/.test(code) || /c-check: skip/.test(code)) continue;
					const source = join(dir, `i${index++}.c`);
					writeFileSync(source, `${code}\n`);
					const result = spawnSync(cc, [...C_FLAGS.filter((flag) => flag !== '-Werror'), source], { encoding: 'utf8' });
					assert.equal(result.status, 0, `${deck.slug}/${item.id}: ${result.stderr}`);
				}
			}
		} finally {
			rmSync(dir, { recursive: true, force: true });
		}
	});
}
