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
const GIT_BRANCHING_LESSON = '25-git-ramas-merge-conflictos-y-rebase';
const STACKS_QUEUES_LESSON = '14-tad-pilas-y-colas';
const NARY_TREES_LESSON = '26-arboles-n-arios-y-representacion-con-vectores';
const GRAPHS_LESSON = '18-grafos-representacion-y-algoritmos';

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

test('Git branching lesson is bilingual and follows the Git foundations lesson', async () => {
	const [spanish, english] = await Promise.all([
		readLesson(GIT_BRANCHING_LESSON, 'es'),
		readLesson(GIT_BRANCHING_LESSON, 'en'),
	]);

	assert.equal(frontmatterValue(spanish, 'slug'), GIT_BRANCHING_LESSON);
	assert.equal(frontmatterValue(english, 'slug'), GIT_BRANCHING_LESSON);
	assert.equal(frontmatterValue(spanish, 'lang'), 'es');
	assert.equal(frontmatterValue(english, 'lang'), 'en');
	assert.equal(Number(frontmatterValue(spanish, 'order')), 8);
	assert.equal(Number(frontmatterValue(english, 'order')), 8);
});

test('Git branching lesson teaches safe merge, conflict, rebase, and recovery workflows', async () => {
	const [spanish, english] = await Promise.all([
		readLesson(GIT_BRANCHING_LESSON, 'es'),
		readLesson(GIT_BRANCHING_LESSON, 'en'),
	]);

	for (const [locale, content] of [
		['Spanish', spanish],
		['English', english],
	]) {
		assert.match(content, /git switch -c/, `${locale}: branch creation`);
		assert.match(content, /git fetch origin/, `${locale}: upstream fetch`);
		assert.match(content, /fast-forward/i, `${locale}: fast-forward merge`);
		assert.match(content, /git merge --no-ff/, `${locale}: merge commit`);
		assert.match(content, /<<<<<<<.*=======.*>>>>>>>/s, `${locale}: conflict markers`);
		assert.match(content, /git merge --abort/, `${locale}: merge abort`);
		assert.match(content, /git rebase origin\/main/, `${locale}: rebase`);
		assert.match(content, /git rebase --continue/, `${locale}: rebase continuation`);
		assert.match(content, /git rebase --abort/, `${locale}: rebase abort`);
		assert.match(content, /shared history|historial compartido/i, `${locale}: no rebase of shared history`);
		assert.match(content, /--force-with-lease/, `${locale}: guarded force update`);
		assert.match(content, /git push --force(?!-with-lease)/, `${locale}: unsafe force-push comparison`);
		assert.match(content, /git reflog/, `${locale}: reflog recovery`);
		assert.match(content, /git status/, `${locale}: precondition and conflict status checks`);
	}
});

test('queues lesson teaches deterministic discrete-event simulation in both locales', async () => {
	const [spanish, english] = await Promise.all([
		readLesson(STACKS_QUEUES_LESSON, 'es'),
		readLesson(STACKS_QUEUES_LESSON, 'en'),
	]);

	for (const [locale, content] of [
		['Spanish', spanish],
		['English', english],
	]) {
		assert.match(content, /discrete-event simulation|simulaci[oó]n de eventos discretos/i, `${locale}: simulation model`);
		assert.match(content, /record Event|record Evento/, `${locale}: immutable event`);
		assert.match(content, /PriorityQueue<(?:Event|Evento)>/, `${locale}: future-event priority queue`);
		assert.match(content, /sequence|secuencia/i, `${locale}: deterministic tie-breaker`);
		assert.match(content, /simulated clock|reloj simulado/i, `${locale}: simulated clock`);
		assert.match(content, /Thread\.sleep/, `${locale}: no wall-clock sleeping`);
		assert.match(content, /ARRIVAL|LLEGADA/, `${locale}: arrival event`);
		assert.match(content, /COMPLETION|FINALIZACION|FINALIZACIÓN/, `${locale}: completion event`);
		assert.match(content, /ArrayDeque/, `${locale}: FIFO service queue`);
		assert.match(content, /IllegalArgumentException/, `${locale}: input validation`);
		assert.match(content, /MAX_EVENTS|MAX_EVENTOS/, `${locale}: bounded termination`);
		assert.match(content, /waiting time|tiempo de espera/i, `${locale}: waiting-time metric`);
		assert.match(content, /queue length|longitud de la cola/i, `${locale}: queue-length metric`);
	}
});

test('N-ary trees lesson is bilingual and follows the binary trees lesson', async () => {
	const [spanish, english] = await Promise.all([
		readLesson(NARY_TREES_LESSON, 'es'),
		readLesson(NARY_TREES_LESSON, 'en'),
	]);

	assert.equal(frontmatterValue(spanish, 'slug'), NARY_TREES_LESSON);
	assert.equal(frontmatterValue(english, 'slug'), NARY_TREES_LESSON);
	assert.equal(frontmatterValue(spanish, 'lang'), 'es');
	assert.equal(frontmatterValue(english, 'lang'), 'en');
	assert.equal(Number(frontmatterValue(spanish, 'order')), 21);
	assert.equal(Number(frontmatterValue(english, 'order')), 21);
});

test('N-ary trees lesson teaches transformations and validated indexed storage', async () => {
	const [spanish, english] = await Promise.all([
		readLesson(NARY_TREES_LESSON, 'es'),
		readLesson(NARY_TREES_LESSON, 'en'),
	]);

	for (const [locale, content] of [
		['Spanish', spanish],
		['English', english],
	]) {
		assert.match(content, /N-ary tree|[aá]rbol N-ario/i, `${locale}: N-ary terminology`);
		assert.match(content, /first child|primer hijo/i, `${locale}: first-child transformation`);
		assert.match(content, /next sibling|siguiente hermano/i, `${locale}: next-sibling transformation`);
		assert.match(content, /preorder|preorden/i, `${locale}: traversal`);
		assert.match(content, /record IndexedNode|record NodoIndexado/, `${locale}: indexed node`);
		assert.match(content, /List<(?:IndexedNode|NodoIndexado)>/, `${locale}: vector-backed storage`);
		assert.match(content, /NO_INDEX|SIN_INDICE/, `${locale}: absent-index sentinel`);
		assert.match(content, /invalid index|[ií]ndice inv[aá]lido/i, `${locale}: invalid-index handling`);
		assert.match(content, /cycle|ciclo/i, `${locale}: cycle validation`);
		assert.match(content, /capacity|capacidad/i, `${locale}: capacity validation and tradeoff`);
		assert.match(content, /O\(n\)/, `${locale}: traversal complexity`);
		assert.match(content, /locality|localidad/i, `${locale}: memory-locality tradeoff`);
		assert.match(content, /reference|referencia/i, `${locale}: reference-based comparison`);
	}
});

test('graphs lesson teaches safe Floyd-Warshall all-pairs shortest paths', async () => {
	const [spanish, english] = await Promise.all([
		readLesson(GRAPHS_LESSON, 'es'),
		readLesson(GRAPHS_LESSON, 'en'),
	]);

	for (const [locale, content] of [
		['Spanish', spanish],
		['English', english],
	]) {
		assert.match(content, /Floyd[–-]Warshall/i, `${locale}: algorithm name`);
		assert.match(content, /all-pairs shortest paths|caminos m[aá]s cortos entre todos los pares/i, `${locale}: all-pairs purpose`);
		assert.match(content, /long\[\]\[\]/, `${locale}: distance matrix`);
		assert.match(content, /INF\s*=\s*Long\.MAX_VALUE\s*\/\s*4/, `${locale}: safe infinity sentinel`);
		assert.match(content, /for \(int k = 0;/, `${locale}: intermediate-vertex loop`);
		assert.match(content, /dist\[i\]\[k\]\s*==\s*INF/, `${locale}: unreachable guard`);
		assert.match(content, /negative cycle|ciclo negativo/i, `${locale}: negative-cycle detection`);
		assert.match(content, /dist\[v\]\[v\]\s*<\s*0/, `${locale}: diagonal check`);
		assert.match(content, /O\(V³\)|O\(V\^3\)/, `${locale}: cubic time`);
		assert.match(content, /O\(V²\)|O\(V\^2\)/, `${locale}: quadratic space`);
		assert.match(content, /square matrix|matriz cuadrada/i, `${locale}: square-matrix validation`);
		assert.match(content, /IllegalArgumentException/, `${locale}: invalid input handling`);
		assert.match(content, /Dijkstra/i, `${locale}: Dijkstra comparison`);
		assert.match(content, /negative edges|aristas negativas/i, `${locale}: negative-edge behavior`);
		assert.match(content, /unreachable|inalcanzable/i, `${locale}: unreachable pairs`);
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
