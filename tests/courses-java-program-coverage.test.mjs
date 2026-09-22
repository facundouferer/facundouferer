import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const JAVA_COURSE_DIR = 'src/content/courses/java';
const ALGORITHM_LESSON = '23-algoritmia-verificacion-y-complejidad';
const BASIC_CONCEPTS_LESSON = '01-conceptos-basicos';
const VARIABLES_LESSON = '02-variables-tipos-datos-y-operadores';
const METHODS_LESSON = '05-metodos-y-funciones';
const STACKS_QUEUES_LESSON = '14-tad-pilas-y-colas';
const NARY_TREES_LESSON = '26-arboles-n-arios-y-representacion-con-vectores';
const GRAPHS_LESSON = '18-grafos-representacion-y-algoritmos';
const PACKAGING_LESSON = '19-archivos-persistencia-y-empaquetado-jar';
const CONCURRENCY_LESSON = '20-programacion-concurrente-hilos-y-pools';
const DEBUGGING_LESSON = '27-depuracion-codigo-limpio-y-refactorizacion';
const TESTING_SPRING_LESSON = '22-testing-junit-y-spring-boot';

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
		assert.match(content, /documented sentinel value|valor centinela documentado/i, `${locale}: invalid-input handling`);
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
		assert.match(content, /documented sentinel value|valor centinela documentado/i, `${locale}: input validation`);
		assert.match(content, /MAX_RECURSIVE_DEPTH/, `${locale}: bounded recursive example`);
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
	assert.equal(Number(frontmatterValue(spanish, 'order')), 19);
	assert.equal(Number(frontmatterValue(english, 'order')), 19);
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

test('packaging lesson teaches validated platform-native distribution', async () => {
	const [spanish, english] = await Promise.all([
		readLesson(PACKAGING_LESSON, 'es'),
		readLesson(PACKAGING_LESSON, 'en'),
	]);

	for (const [locale, content] of [
		['Spanish', spanish],
		['English', english],
	]) {
		assert.match(content, /jpackage --version/, `${locale}: jpackage availability check`);
		assert.match(content, /--type app-image/, `${locale}: application image first`);
		assert.match(content, /--input/, `${locale}: input directory`);
		assert.match(content, /--main-jar/, `${locale}: main JAR`);
		assert.match(content, /--main-class|--module/, `${locale}: entry point`);
		assert.match(content, /--dest/, `${locale}: output directory`);
		assert.match(content, /--app-version/, `${locale}: validated version`);
		assert.match(content, /runtime image|imagen de runtime/i, `${locale}: bundled runtime`);
		assert.match(content, /msi|exe/, `${locale}: Windows package types`);
		assert.match(content, /dmg|pkg/, `${locale}: macOS package types`);
		assert.match(content, /deb|rpm/, `${locale}: Linux package types`);
		assert.match(content, /target OS|sistema operativo de destino/i, `${locale}: build and test per target OS`);
		assert.match(content, /signing|firma de c[oó]digo/i, `${locale}: code signing`);
		assert.match(content, /notarization|notarizaci[oó]n/i, `${locale}: notarization`);
		assert.match(content, /Launch4j/i, `${locale}: Launch4j comparison`);
		assert.match(content, /bundled runtime|runtime incluido/i, `${locale}: runtime strategy`);
		assert.match(content, /Get-Command jpackage/, `${locale}: safe PowerShell check`);
	}
});

test('concurrency lesson teaches monitor coordination and deadlock diagnosis in both locales', async () => {
	const [spanish, english] = await Promise.all([
		readLesson(CONCURRENCY_LESSON, 'es'),
		readLesson(CONCURRENCY_LESSON, 'en'),
	]);

	for (const [locale, content] of [
		['Spanish', spanish],
		['English', english],
	]) {
		assert.match(content, /wait\(\)/, `${locale}: wait`);
		assert.match(content, /notify\(\)/, `${locale}: notify`);
		assert.match(content, /notifyAll\(\)/, `${locale}: notifyAll`);
		assert.match(content, /IllegalMonitorStateException/, `${locale}: monitor ownership exception`);
		assert.match(content, /spurious wakeup|despertar espurio/i, `${locale}: spurious wakeup`);
		assert.match(content, /while\s*\(/, `${locale}: condition loop uses while`);
		assert.match(content, /notifyAll\(\)\s*(?:en lugar de|instead of)\s*notify\(\)/i, `${locale}: prefer notifyAll guidance`);
		assert.match(content, /BoundedBuffer/, `${locale}: producer-consumer bounded buffer example`);
		assert.match(content, /mutual exclusion|exclusi[oó]n mutua/i, `${locale}: Coffman mutual exclusion`);
		assert.match(content, /hold-and-wait|retenci[oó]n y espera/i, `${locale}: Coffman hold-and-wait`);
		assert.match(content, /no preemption|sin apropiaci[oó]n/i, `${locale}: Coffman no preemption`);
		assert.match(content, /circular wait|espera circular/i, `${locale}: Coffman circular wait`);
		assert.match(content, /DeadlockDemo/, `${locale}: minimal two-lock deadlock example`);
		assert.match(content, /lock ordering|orden de (?:los )?locks/i, `${locale}: consistent lock ordering`);
		assert.match(content, /tryLock/, `${locale}: tryLock with timeout`);
		assert.match(content, /TimeUnit/, `${locale}: timeout unit`);
		assert.match(content, /jstack/, `${locale}: jstack diagnosis`);
		assert.match(content, /thread dump|volcado de hilos/i, `${locale}: thread dump`);
		assert.match(content, /Found one Java-level deadlock/, `${locale}: canonical deadlock report line`);
		assert.match(content, /JConsole/i, `${locale}: JConsole`);
		assert.match(content, /VisualVM/i, `${locale}: VisualVM`);
		assert.match(content, /BlockingQueue/, `${locale}: BlockingQueue alternative`);
		assert.match(content, /ReentrantLock/, `${locale}: ReentrantLock alternative`);
		assert.match(content, /newCondition\(\)/, `${locale}: Condition alternative`);
		assert.match(content, /CountDownLatch/, `${locale}: CountDownLatch alternative`);
		assert.match(content, /deadlock|interbloqueo/i, `${locale}: deadlock terminology`);
	}
});

test('Debugging and refactoring lesson is bilingual and follows the testing/Spring lesson', async () => {
	const [spanish, english] = await Promise.all([
		readLesson(DEBUGGING_LESSON, 'es'),
		readLesson(DEBUGGING_LESSON, 'en'),
	]);

	assert.equal(frontmatterValue(spanish, 'slug'), DEBUGGING_LESSON);
	assert.equal(frontmatterValue(english, 'slug'), DEBUGGING_LESSON);
	assert.equal(frontmatterValue(spanish, 'lang'), 'es');
	assert.equal(frontmatterValue(english, 'lang'), 'en');
	assert.equal(Number(frontmatterValue(spanish, 'order')), 25);
	assert.equal(Number(frontmatterValue(english, 'order')), 25);
});

test('Debugging and refactoring lesson teaches feedback loops, code smells, and behaviour-preserving refactors', async () => {
	const [spanish, english] = await Promise.all([
		readLesson(DEBUGGING_LESSON, 'es'),
		readLesson(DEBUGGING_LESSON, 'en'),
	]);

	for (const [locale, content] of [
		['Spanish', spanish],
		['English', english],
	]) {
		assert.match(content, /reproduce|reproducir/i, `${locale}: reproduce step`);
		assert.match(content, /hypothes(?:is|ize)|hip[oó]tesis/i, `${locale}: hypothesize step`);
		assert.match(content, /observe|observar/i, `${locale}: observe step`);
		assert.match(content, /verify|verificar/i, `${locale}: verify step`);
		assert.match(content, /stack trace|traza de pila/i, `${locale}: reading a stack trace`);
		assert.match(content, /breakpoint/i, `${locale}: breakpoint`);
		assert.match(content, /conditional breakpoint|breakpoint condicional/i, `${locale}: conditional breakpoint`);
		assert.match(content, /watch/i, `${locale}: watch expression`);
		assert.match(content, /step over/i, `${locale}: step over`);
		assert.match(content, /step into/i, `${locale}: step into`);
		assert.match(content, /step out/i, `${locale}: step out`);
		assert.match(content, /call stack|pila de llamadas/i, `${locale}: call stack inspection`);
		assert.match(content, /println/, `${locale}: println tradeoffs`);
		assert.match(content, /IntelliJ/, `${locale}: IntelliJ IDEA`);
		assert.match(content, /Visual Studio Code/, `${locale}: VS Code`);
		assert.match(content, /Eclipse/, `${locale}: Eclipse`);
		assert.match(content, /magic numbers?|n[uú]meros? m[aá]gicos?/i, `${locale}: magic numbers`);
		assert.match(content, /single responsibility|responsabilidad [uú]nica/i, `${locale}: single responsibility`);
		assert.match(content, /long method/i, `${locale}: long method smell`);
		assert.match(content, /long parameter list/i, `${locale}: long parameter list smell`);
		assert.match(content, /duplicated code/i, `${locale}: duplicated code smell`);
		assert.match(content, /feature envy/i, `${locale}: feature envy smell`);
		assert.match(content, /primitive obsession/i, `${locale}: primitive obsession smell`);
		assert.match(content, /god class/i, `${locale}: god class smell`);
		assert.match(content, /code smell/i, `${locale}: code smell terminology`);
		assert.match(content, /extract method/i, `${locale}: extract method refactor`);
		assert.match(content, /rename/i, `${locale}: rename refactor`);
		assert.match(content, /introduce constant/i, `${locale}: introduce constant refactor`);
		assert.match(content, /parameter object/i, `${locale}: parameter object refactor`);
		assert.match(content, /replace conditional with polymorphism/i, `${locale}: replace conditional with polymorphism`);
		assert.match(content, /guard clause/i, `${locale}: guard clause refactor`);
		assert.match(content, /JUnit/, `${locale}: JUnit-backed safety net`);
		assert.match(content, /@Test/, `${locale}: JUnit test annotation`);
		assert.match(content, /OrderCalculator/, `${locale}: before/after example subject`);
		assert.match(content, /Antes|Before/, `${locale}: before section`);
		assert.match(content, /Despu[eé]s|After/, `${locale}: after section`);
		assert.match(content, /observable behavior|comportamiento observable/i, `${locale}: behaviour-preserving definition`);
		assert.match(content, /green|verde/i, `${locale}: tests kept green`);
		assert.match(content, /mixing them in a single step|mezclarlas en un mismo paso/i, `${locale}: never mix debugging and refactoring`);
		assert.match(content, /are not the same step|no son el mismo paso/i, `${locale}: debugging vs refactoring distinction`);
	}
});

test('testing and Spring Boot lesson completes the CRUD with an idempotent PUT in both locales', async () => {
	const [spanish, english] = await Promise.all([
		readLesson(TESTING_SPRING_LESSON, 'es'),
		readLesson(TESTING_SPRING_LESSON, 'en'),
	]);

	for (const [locale, content] of [
		['Spanish', spanish],
		['English', english],
	]) {
		assert.match(content, /@PutMapping\("\/\{id\}"\)/, `${locale}: PUT mapping`);
		assert.match(content, /@Valid @RequestBody/, `${locale}: validated request body`);
		assert.match(content, /notFound\(\)|404/, `${locale}: not-found response`);
		assert.match(content, /idempoten/i, `${locale}: idempotency`);
		assert.match(content, /PATCH/, `${locale}: PATCH contrast`);
		assert.match(content, /400/, `${locale}: validation-failure status`);
		assert.match(content, /mockMvc\.perform\(put\(/, `${locale}: MockMvc PUT test`);
		assert.match(content, /CREATE/, `${locale}: CRUD table CREATE row`);
		assert.match(content, /READ/, `${locale}: CRUD table READ row`);
		assert.match(content, /UPDATE/, `${locale}: CRUD table UPDATE row`);
		assert.match(content, /DELETE/, `${locale}: CRUD table DELETE row`);
		assert.match(content, /201/, `${locale}: create status in CRUD table`);
		assert.match(content, /204/, `${locale}: delete status in CRUD table`);
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
