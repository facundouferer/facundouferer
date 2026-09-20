import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const JAVA_COURSE_DIR = 'src/content/courses/java';
const ALGORITHM_LESSON = '23-algoritmia-verificacion-y-complejidad';
const BASIC_CONCEPTS_LESSON = '01-conceptos-basicos';
const VARIABLES_LESSON = '02-variables-tipos-datos-y-operadores';
const METHODS_LESSON = '05-metodos-y-funciones';
const GIT_FOUNDATIONS_LESSON = '24-git-github-fundamentos-y-remotos';

async function readLesson(slug, lang) {
	return readFile(path.join(JAVA_COURSE_DIR, `${slug}.${lang}.md`), 'utf8');
}

function frontmatterValue(content, key) {
	const match = content.match(new RegExp(`^${key}:\\s*(?:'([^']*)'|([^\\n]+))$`, 'm'));
	assert.ok(match, `Expected ${key} in lesson frontmatter`);
	return (match[1] ?? match[2]).trim();
}

test('algorithm foundations lesson exists in Spanish and English at order 2', async () => {
	const [spanish, english] = await Promise.all([
		readLesson(ALGORITHM_LESSON, 'es'),
		readLesson(ALGORITHM_LESSON, 'en'),
	]);

	assert.equal(frontmatterValue(spanish, 'slug'), ALGORITHM_LESSON);
	assert.equal(frontmatterValue(english, 'slug'), ALGORITHM_LESSON);
	assert.equal(frontmatterValue(spanish, 'lang'), 'es');
	assert.equal(frontmatterValue(english, 'lang'), 'en');
	assert.equal(Number(frontmatterValue(spanish, 'order')), 2);
	assert.equal(Number(frontmatterValue(english, 'order')), 2);
});

test('algorithm foundations lesson teaches specification, verification, and analysis in both locales', async () => {
	const [spanish, english] = await Promise.all([
		readLesson(ALGORITHM_LESSON, 'es'),
		readLesson(ALGORITHM_LESSON, 'en'),
	]);

	for (const [locale, content] of [
		['Spanish', spanish],
		['English', english],
	]) {
		assert.match(content, /specification|especificaci[oó]n/i, `${locale}: specification`);
		assert.match(content, /verification|verificaci[oó]n/i, `${locale}: verification`);
		assert.match(content, /correctness|correcci[oó]n/i, `${locale}: correctness`);
		assert.match(content, /efficiency|eficiencia/i, `${locale}: efficiency`);
		assert.match(content, /time complexity|complejidad temporal/i, `${locale}: time analysis`);
		assert.match(content, /space complexity|complejidad espacial/i, `${locale}: space analysis`);
		assert.match(content, /O\(1\)/, `${locale}: constant complexity`);
		assert.match(content, /O\(log n\)/, `${locale}: logarithmic complexity`);
		assert.match(content, /O\(n\)/, `${locale}: linear complexity`);
		assert.match(content, /O\(n log n\)/, `${locale}: linearithmic complexity`);
		assert.match(content, /O\(n²\)/, `${locale}: quadratic complexity`);
		assert.match(content, /IllegalArgumentException/, `${locale}: invalid-input handling`);
	}
});

test('basic concepts lesson compares local and online Java development environments', async () => {
	const [spanish, english] = await Promise.all([
		readLesson(BASIC_CONCEPTS_LESSON, 'es'),
		readLesson(BASIC_CONCEPTS_LESSON, 'en'),
	]);

	for (const [locale, content] of [
		['Spanish', spanish],
		['English', english],
	]) {
		assert.match(content, /IntelliJ IDEA/, `${locale}: local IDE example`);
		assert.match(content, /online IDE|IDE online|browser|navegador/i, `${locale}: online IDE`);
		assert.match(content, /offline|sin conexi[oó]n/i, `${locale}: offline tradeoff`);
		assert.match(content, /version|versi[oó]n/i, `${locale}: JDK version compatibility`);
	}
});

test('basic concepts lesson teaches a practical API and Javadoc reading workflow', async () => {
	const [spanish, english] = await Promise.all([
		readLesson(BASIC_CONCEPTS_LESSON, 'es'),
		readLesson(BASIC_CONCEPTS_LESSON, 'en'),
	]);

	for (const [locale, content] of [
		['Spanish', spanish],
		['English', english],
	]) {
		assert.match(content, /java\.base/, `${locale}: module`);
		assert.match(content, /java\.lang/, `${locale}: package`);
		assert.match(content, /String\.substring/, `${locale}: standard-library worked example`);
		assert.match(content, /substring\(int beginIndex, int endIndex\)/, `${locale}: method signature`);
		assert.match(content, /parameter|par[aá]metro/i, `${locale}: parameters`);
		assert.match(content, /return|devuelve/i, `${locale}: return value`);
		assert.match(content, /IndexOutOfBoundsException/, `${locale}: thrown exception`);
		assert.match(content, /deprecat|obsolet/i, `${locale}: deprecation`);
		assert.match(content, /linked type|tipo enlazado|tipos enlazados/i, `${locale}: linked types`);
	}
});

test('variables lesson distinguishes Java scope, lifetime, and initialization rules', async () => {
	const [spanish, english] = await Promise.all([
		readLesson(VARIABLES_LESSON, 'es'),
		readLesson(VARIABLES_LESSON, 'en'),
	]);

	for (const [locale, content] of [
		['Spanish', spanish],
		['English', english],
	]) {
		assert.match(content, /block[- ]scope|[aá]mbito de bloque/i, `${locale}: block scope`);
		assert.match(content, /local variable|variable local/i, `${locale}: local variables`);
		assert.match(content, /parameter|par[aá]metro/i, `${locale}: parameters`);
		assert.match(content, /instance field|campo de instancia/i, `${locale}: instance fields`);
		assert.match(content, /class field|campo de clase/i, `${locale}: class fields`);
		assert.match(content, /shadowing|sombreado/i, `${locale}: shadowing`);
		assert.match(content, /lifetime|tiempo de vida/i, `${locale}: lifetime`);
		assert.match(content, /visibility|visibilidad/i, `${locale}: visibility`);
		assert.match(content, /definite assignment|asignaci[oó]n definida/i, `${locale}: local initialization`);
		assert.match(content, /no (?:free )?global variables|no (?:existen|hay) variables globales libres/i, `${locale}: no free globals`);
	}
});

test('methods lesson teaches recursion forms, stack costs, and bounded use', async () => {
	const [spanish, english] = await Promise.all([
		readLesson(METHODS_LESSON, 'es'),
		readLesson(METHODS_LESSON, 'en'),
	]);

	for (const [locale, content] of [
		['Spanish', spanish],
		['English', english],
	]) {
		assert.match(content, /direct recursion|recursi[oó]n directa/i, `${locale}: direct recursion`);
		assert.match(content, /indirect recursion|recursi[oó]n indirecta/i, `${locale}: indirect recursion`);
		assert.match(content, /mutual recursion|recursi[oó]n mutua/i, `${locale}: mutual recursion`);
		assert.match(content, /tail recursion|recursi[oó]n de cola/i, `${locale}: tail recursion`);
		assert.match(content, /does not guarantee tail-call optimization|no garantiza (?:la )?optimizaci[oó]n de llamadas? de cola/i, `${locale}: Java TCO limitation`);
		assert.match(content, /StackOverflowError/, `${locale}: stack overflow risk`);
		assert.match(content, /O\(n\).*(?:stack|pila)|(?:stack|pila).*O\(n\)/is, `${locale}: linear stack cost`);
		assert.match(content, /IllegalArgumentException/, `${locale}: input validation`);
		assert.match(content, /MAX_RECURSIVE_DEPTH/, `${locale}: bounded recursive example`);
	}
});

test('Git foundations lesson is bilingual and ordered before object-oriented programming', async () => {
	const [spanish, english] = await Promise.all([
		readLesson(GIT_FOUNDATIONS_LESSON, 'es'),
		readLesson(GIT_FOUNDATIONS_LESSON, 'en'),
	]);

	assert.equal(frontmatterValue(spanish, 'slug'), GIT_FOUNDATIONS_LESSON);
	assert.equal(frontmatterValue(english, 'slug'), GIT_FOUNDATIONS_LESSON);
	assert.equal(frontmatterValue(spanish, 'lang'), 'es');
	assert.equal(frontmatterValue(english, 'lang'), 'en');
	assert.equal(Number(frontmatterValue(spanish, 'order')), 7);
	assert.equal(Number(frontmatterValue(english, 'order')), 7);
});

test('Git foundations lesson teaches a safe local and remote workflow in both locales', async () => {
	const [spanish, english] = await Promise.all([
		readLesson(GIT_FOUNDATIONS_LESSON, 'es'),
		readLesson(GIT_FOUNDATIONS_LESSON, 'en'),
	]);

	for (const [locale, content] of [
		['Spanish', spanish],
		['English', english],
	]) {
		assert.match(content, /GitHub.*(?:hosting|alojamiento)|(?:hosting|alojamiento).*GitHub/is, `${locale}: Git versus GitHub`);
		assert.match(content, /git --version/, `${locale}: installation verification`);
		assert.match(content, /git config --global user\.name/, `${locale}: global identity`);
		assert.match(content, /git config --local user\.email/, `${locale}: repository-local identity`);
		assert.match(content, /git init/, `${locale}: init`);
		assert.match(content, /git status/, `${locale}: status`);
		assert.match(content, /git add/, `${locale}: staging`);
		assert.match(content, /git commit/, `${locale}: commit`);
		assert.match(content, /\.gitignore/, `${locale}: ignore rules`);
		assert.match(content, /git remote add origin/, `${locale}: remote`);
		assert.match(content, /git remote get-url origin/, `${locale}: remote URL validation`);
		assert.match(content, /git branch --show-current/, `${locale}: current branch validation`);
		assert.match(content, /git clone/, `${locale}: clone`);
		assert.match(content, /git fetch/, `${locale}: fetch`);
		assert.match(content, /git pull/, `${locale}: pull`);
		assert.match(content, /git push -u origin/, `${locale}: push and upstream tracking`);
		assert.match(content, /HTTPS/, `${locale}: HTTPS tradeoff`);
		assert.match(content, /SSH/, `${locale}: SSH tradeoff`);
		assert.match(content, /secret|secreto/i, `${locale}: secret warning`);
		assert.match(content, /force[- ]push|push.*--force|--force.*push/i, `${locale}: force-push warning`);
	}
});

test('Java lesson orders remain bilingual, unique, and contiguous', async () => {
	const files = (await readdir(JAVA_COURSE_DIR)).filter((file) => /\.(es|en)\.md$/.test(file));
	const lessons = await Promise.all(
		files.map(async (file) => ({ file, content: await readFile(path.join(JAVA_COURSE_DIR, file), 'utf8') })),
	);

	for (const lang of ['es', 'en']) {
		const localized = lessons.filter(({ file }) => file.endsWith(`.${lang}.md`));
		const orders = localized.map(({ content }) => Number(frontmatterValue(content, 'order'))).sort((a, b) => a - b);
		assert.deepEqual(orders, Array.from({ length: localized.length }, (_, index) => index + 1));
	}

	const spanishOrders = new Map(
		lessons
			.filter(({ file }) => file.endsWith('.es.md'))
			.map(({ content }) => [frontmatterValue(content, 'slug'), frontmatterValue(content, 'order')]),
	);
	for (const { content } of lessons.filter(({ file }) => file.endsWith('.en.md'))) {
		assert.equal(
			frontmatterValue(content, 'order'),
			spanishOrders.get(frontmatterValue(content, 'slug')),
			`Expected ES/EN order parity for ${frontmatterValue(content, 'slug')}`,
		);
	}
});
