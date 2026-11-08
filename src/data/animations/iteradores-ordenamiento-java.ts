import type { AnimationScript, CodePanel, ShellLine, ShellPanel, Subtitle } from './types';

// Step-by-step animation for the Java lesson 16 "Iteradores, ordenamiento y equals/hashCode".
// Every step names the scene it shows (`data-scene` in
// `src/components/animaciones/iteradores-ordenamiento-java.astro`), the elements it reveals
// and emphasizes, plus its captions and any code or terminal panel. Seven scenes are SVG
// canvases choreographed by motion steps (the iterator cursor, the failing and the fixed
// removal, the sorting cards, `==` vs `equals`, the HashSet buckets and the TreeSet trap);
// the rest are slide steps. A motion scene keeps its state only across consecutive motion
// steps, so every canvas below owns one uninterrupted run of steps.

const same = (text: string) => ({ es: text, en: text });
const say = (es: string, en: string): Subtitle => ({ text: { es, en } });

const code = (title: string, es: string, en: string = es): CodePanel => ({
	title,
	language: 'java',
	source: { es, en },
});

const shell = (...lines: ShellLine[]): ShellPanel => ({ lines });
const cmd = (text: string): ShellLine => ({ kind: 'cmd', text: same(text) });
const out = (text: string): ShellLine => ({ kind: 'out', text: same(text) });
const err = (text: string): ShellLine => ({ kind: 'err', text: same(text) });

/**
 * Pins captions on the step timeline: each one starts once the previous has been
 * read (same formula as `subtitleReadingTime`, for the slower locale) plus a pause.
 * Motion steps use the starts to sync their cues with what is being said.
 */
const readingMs = (sub: Subtitle) => 1200 + Math.max(sub.text.es.length, sub.text.en.length) * 55;
function timed(...subs: Subtitle[]) {
	let at = 0;
	const starts: number[] = [];
	const list = subs.map((sub) => {
		starts.push(at);
		const placed: Subtitle = { ...sub, at };
		at += readingMs(sub) + 200;
		return placed;
	});
	return { list, start: (index: number) => starts[index] ?? 0 };
}

// ─── Motion captions (cues below are placed relative to their starts) ───────
const itSetup = timed(
	say('`nombres.iterator()` devuelve un objeto con un cursor que empieza antes del primer elemento.', '`nombres.iterator()` returns an object with a cursor that starts before the first element.'),
	say('El cursor no señala un elemento: vive en el hueco entre dos.', 'The cursor does not point at an element: it lives in the gap between two.'),
);
const itLoop = timed(
	say('Antes de cada vuelta se llama `hasNext()`: ¿queda algún elemento por devolver?', 'Before every iteration `hasNext()` is called: is there any element left to return?'),
	say('`next()` devuelve el elemento que está después del cursor y lo avanza un lugar.', '`next()` returns the element right after the cursor and moves it forward one place.'),
	say('Así, vuelta tras vuelta, el cursor salta de hueco en hueco hasta el final.', 'That way, iteration after iteration, the cursor hops gap by gap to the end.'),
);
const itEnd = timed(
	say('Con el cursor al final, `hasNext()` devuelve false y el bucle termina.', 'With the cursor at the end, `hasNext()` returns false and the loop ends.'),
	say('El tercer método, `remove()`, borra el último elemento que devolvió `next()`.', 'The third method, `remove()`, deletes the last element `next()` returned.'),
);
const cmeIterator = timed(
	say('El for-each crea un Iterator, que memoriza el `modCount` de la lista: su contador de cambios.', 'The for-each creates an Iterator, which memorizes the list’s `modCount`: its change counter.'),
	say('Hoy vale 0: la lista todavía no fue modificada desde que empezó el recorrido.', 'Today it is 0: the list has not been modified since the traversal began.'),
);
const cmeRemove = timed(
	say('El bucle llega a «descansar» y llama a `tareas.remove(t)`: la lista cambia por fuera del iterador.', 'The loop reaches “descansar” and calls `tareas.remove(t)`: the list changes behind the iterator’s back.'),
	say('Su `modCount` pasa a 1, pero el iterador sigue recordando 0.', 'Its `modCount` becomes 1, but the iterator still remembers 0.'),
	say('En la vuelta siguiente, `next()` compara los contadores: no coinciden y lanza `ConcurrentModificationException`.', 'On the next iteration `next()` compares the counters: they differ and it throws `ConcurrentModificationException`.'),
);
const rmWalk = timed(
	say('La primera forma correcta es borrar a través del propio iterador: `it.remove()`.', 'The first correct way is to delete through the iterator itself: `it.remove()`.'),
	say('El bucle avanza con `next()` hasta «descansar», el elemento que hay que borrar.', 'The loop advances with `next()` up to “descansar”, the element to delete.'),
);
const rmRemove = timed(
	say('`it.remove()` borra el último elemento devuelto y actualiza el contador del iterador.', '`it.remove()` deletes the last returned element and updates the iterator’s counter.'),
	say('Lista e iterador coinciden ahora en `modCount = 1`: el recorrido sigue siendo válido.', 'List and iterator now agree on `modCount = 1`: the traversal is still valid.'),
	say('Los elementos se corren a la izquierda y el cursor sigue sin saltearse ninguno.', 'The elements shift left and the cursor keeps going without skipping any.'),
);
const sortStart = timed(
	say('Cuatro libros en el orden en que se cargaron: nada garantiza que estén ordenados.', 'Four books in the order they were loaded: nothing guarantees they are sorted.'),
);
const sortNatural = timed(
	say('`Collections.sort(libros)` usa `compareTo`: compara de a pares y reubica los libros por título.', '`Collections.sort(libros)` uses `compareTo`: it compares pairs and relocates the books by title.'),
	say('Resultado: 1984, El Aleph, Ficciones, Rayuela.', 'Result: 1984, El Aleph, Ficciones, Rayuela.'),
);
const sortPages = timed(
	say('Con un `Comparator` el orden vive afuera: `comparingInt(Libro::getPaginas).reversed()`.', 'With a `Comparator` the order lives outside: `comparingInt(Libro::getPaginas).reversed()`.'),
	say('No tocaste la clase `Libro`: los mismos objetos, otro criterio.', 'You did not touch the `Libro` class: the same objects, another criterion.'),
);
const sortAuthor = timed(
	say('`thenComparing` encadena criterios: primero el autor y, si empatan, el título.', '`thenComparing` chains criteria: the author first and, on a tie, the title.'),
	say('Borges aparece dos veces: `El Aleph` y `Ficciones` se desempatan por título.', 'Borges appears twice: `El Aleph` and `Ficciones` are tie-broken by title.'),
	say('`sort` ordena la lista original en el lugar: si querés conservar el orden, copiala antes.', '`sort` orders the original list in place: if you want to keep the order, copy it first.'),
);
const eqRefs = timed(
	say('`a` y `b` son dos objetos distintos en el Heap, aunque tengan exactamente los mismos datos.', '`a` and `b` are two different objects on the Heap, even with exactly the same data.'),
	say('El operador `==` compara referencias: no pregunta qué contienen los objetos.', 'The `==` operator compares references: it does not ask what the objects contain.'),
);
const eqDefault = timed(
	say('`Object.equals()` también compara referencias: da true solo si es literalmente el mismo objeto.', '`Object.equals()` compares references too: it is true only for literally the same object.'),
	say('Para casi cualquier clase de dominio eso está mal: `a.equals(b)` debería dar true.', 'For almost any domain class that is wrong: `a.equals(b)` should be true.'),
);
const eqFields = timed(
	say('Al sobrescribir `equals`, la comparación pasa a ser por contenido: título, autor y páginas.', 'Once `equals` is overridden, the comparison is by content: title, author and pages.'),
	say('Cuando todos los campos coinciden, `a.equals(b)` devuelve true.', 'When every field matches, `a.equals(b)` returns true.'),
);
const hashIntro = timed(
	say('Un HashSet no recorre todo comparando: primero calcula en qué cajón (bucket) va cada objeto.', 'A HashSet does not scan everything comparing: first it computes which bucket each object goes in.'),
	say('Solo dentro de ese cajón usa `equals()` para ver si ya hay uno igual.', 'Only inside that bucket does it use `equals()` to check whether an equal one is already there.'),
);
const hashBroken = timed(
	say('Acá `equals()` está bien escrito, pero `hashCode()` quedó heredado de `Object`.', 'Here `equals()` is written correctly, but `hashCode()` is still inherited from `Object`.'),
	say('Cada libro produce un hash distinto y cae en otro cajón: el 2 y el 11.', 'Each book yields a different hash and lands in another bucket: 2 and 11.'),
	say('`equals()` nunca llegó a ejecutarse: el Set tiene dos libros iguales.', '`equals()` never even ran: the Set holds two equal books.'),
);
const hashFixed = timed(
	say('Con `hashCode()` sobrescrito, dos libros iguales producen el mismo hash.', 'With `hashCode()` overridden, two equal books produce the same hash.'),
	say('Caen en el mismo cajón: ahora sí el Set ejecuta `equals()`.', 'They land in the same bucket: now the Set does run `equals()`.'),
	say('`equals()` da true, `add` devuelve false y el duplicado se descarta.', '`equals()` is true, `add` returns false and the duplicate is discarded.'),
);
const hashMutate = timed(
	say('Si modificás un objeto ya guardado en un HashSet, su `hashCode` cambia.', 'If you modify an object already stored in a HashSet, its `hashCode` changes.'),
	say('Queda en el cajón viejo, pero la búsqueda ahora mira el cajón nuevo.', 'It stays in the old bucket, but the lookup now checks the new one.'),
	say('`contains()` da false sobre un objeto que está adentro. Usá elementos inmutables.', '`contains()` is false for an object that is inside. Use immutable elements.'),
);
const treeAdd = timed(
	say('El punto 6 del desafío: un `TreeSet` cuyo `compareTo` solo mira el título.', 'Point 6 of the challenge: a `TreeSet` whose `compareTo` only looks at the title.'),
	say('Ya contiene «1984» de Orwell. Intentamos agregar otro libro titulado «1984».', 'It already holds “1984” by Orwell. We try to add another book titled “1984”.'),
);
const treeResult = timed(
	say('`equals` lo considera distinto: cambian el autor y las páginas.', '`equals` considers it different: the author and the pages change.'),
	say('Pero el TreeSet ignora `equals`: decide los duplicados con `compareTo == 0`.', 'But the TreeSet ignores `equals`: it decides duplicates with `compareTo == 0`.'),
	say('Resultado: el libro desaparece sin error, sin excepción y sin aviso.', 'Result: the book vanishes with no error, no exception and no warning.'),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'intro', label: { es: 'Introducción', en: 'Introduction' } },
		{ id: 'foreach', label: { es: '1. Detrás del for-each', en: '1. Behind the for-each' } },
		{ id: 'cme', label: { es: '2. ConcurrentModificationException', en: '2. ConcurrentModificationException' } },
		{ id: 'comparable', label: { es: '3. Comparable', en: '3. Comparable' } },
		{ id: 'comparator', label: { es: '4. Comparator', en: '4. Comparator' } },
		{ id: 'equals', label: { es: '5. El contrato equals', en: '5. The equals contract' } },
		{ id: 'hashcode', label: { es: '6. hashCode', en: '6. hashCode' } },
		{ id: 'errors', label: { es: '7. Errores frecuentes', en: '7. Common mistakes' } },
		{ id: 'exercise', label: { es: '8. Ejercicio guiado', en: '8. Guided exercise' } },
		{ id: 'closing', label: { es: 'Para llevarte', en: 'Takeaways' } },
	],
	steps: [
		// ─── Intro ──────────────────────────────────────────────────────────
		{
			id: 'intro-debts',
			chapter: 'intro',
			scene: 'intro16',
			show: ['q-iter', 'q-sort', 'q-eq'],
			title: { es: 'Tres deudas de la lección anterior', en: 'Three debts from the previous lesson' },
			subtitles: [
				say('Primera deuda: qué hay detrás del for-each y por qué salta `ConcurrentModificationException`.', 'First debt: what hides behind the for-each and why `ConcurrentModificationException` is thrown.'),
				say('Segunda: cómo se ordena una colección de objetos propios con `Comparable` y `Comparator`.', 'Second: how to sort a collection of your own objects with `Comparable` and `Comparator`.'),
				say('Tercera: por qué un `HashSet` a veces guarda duplicados.', 'Third: why a `HashSet` sometimes keeps duplicates.'),
			],
		},
		{
			id: 'intro-root',
			chapter: 'intro',
			scene: 'intro16',
			show: '*',
			focus: ['q-root'],
			title: { es: 'La misma raíz', en: 'The same root' },
			subtitles: [
				say('Las tres comparten la raíz: las colecciones le hacen preguntas a tus objetos.', 'All three share one root: collections ask your objects questions.'),
				say('Si tus objetos contestan mal, todo falla en silencio: sin excepciones y sin avisos.', 'If your objects answer wrongly, everything fails silently: no exceptions, no warnings.'),
			],
		},

		// ─── 1. Behind the for-each ─────────────────────────────────────────
		{
			id: 'fe-desugar',
			chapter: 'foreach',
			scene: 'foreach',
			show: ['fe-for', 'fe-arrow', 'fe-it'],
			focus: ['fe-it'],
			code: code(
				'ForEach.java',
				`for (String nombre : nombres) {
    System.out.println(nombre);
}

// lo que el compilador genera:
Iterator<String> it = nombres.iterator();
while (it.hasNext()) {
    String nombre = it.next();
    System.out.println(nombre);
}`,
				`for (String nombre : nombres) {
    System.out.println(nombre);
}

// what the compiler generates:
Iterator<String> it = nombres.iterator();
while (it.hasNext()) {
    String nombre = it.next();
    System.out.println(nombre);
}`,
			),
			title: { es: 'El for-each es azúcar sintáctica', en: 'The for-each is syntactic sugar' },
			subtitles: [
				say('El for-each que usás desde la lección de arrays es azúcar sintáctica.', 'The for-each you have used since the arrays lesson is syntactic sugar.'),
				say('El compilador lo traduce a un `Iterator` y un `while`.', 'The compiler translates it into an `Iterator` and a `while`.'),
			],
		},
		{
			id: 'fe-methods',
			chapter: 'foreach',
			scene: 'foreach',
			show: ['fe-for', 'fe-arrow', 'fe-it', 'fe-methods'],
			focus: ['fe-methods'],
			title: { es: 'Un Iterator tiene tres métodos', en: 'An Iterator has three methods' },
			subtitles: [
				say('Un `Iterator` es un objeto con solo tres métodos: `hasNext()`, `next()` y `remove()`.', 'An `Iterator` is an object with just three methods: `hasNext()`, `next()` and `remove()`.'),
				say('Se recorre con for-each solo si implementa `Iterable`, que exige un único método: `iterator()`.', 'It works with for-each only if it implements `Iterable`, which requires one method: `iterator()`.'),
			],
		},
		{
			id: 'fe-same',
			chapter: 'foreach',
			scene: 'foreach',
			show: '*',
			focus: ['fe-same'],
			title: { es: 'La misma sintaxis para todo', en: 'The same syntax for everything' },
			subtitles: [
				say('Por eso `ArrayList`, `HashSet` y `ArrayDeque` se recorren con la misma sintaxis.', 'That is why `ArrayList`, `HashSet` and `ArrayDeque` are walked with the same syntax.'),
				say('El for-each no habla con la colección: habla con su iterador.', 'The for-each does not talk to the collection: it talks to its iterator.'),
			],
		},
		{
			id: 'it-setup',
			chapter: 'foreach',
			scene: 'iter',
			title: { es: 'Se crea el iterador', en: 'The iterator is created' },
			subtitles: itSetup.list,
			motion: {
				cues: [
					{ at: 0, do: 'type', el: 'decl', dur: 1700 },
					{ at: 1800, do: 'enter', el: 'list' },
					{ at: 2200, do: 'enter', el: 'cell-0' },
					{ at: 2400, do: 'enter', el: 'cell-1' },
					{ at: 2600, do: 'enter', el: 'cell-2' },
					{ at: 3400, do: 'enter', el: 'cur' },
					{ at: 4200, do: 'pulse', el: 'cur' },
					{ at: itSetup.start(1) + 400, do: 'pulse', el: 'cur' },
					{ at: itSetup.start(1) + 1400, do: 'pulse', el: 'list' },
				],
			},
		},
		{
			id: 'it-loop',
			chapter: 'foreach',
			scene: 'iter',
			title: { es: 'hasNext() y next()', en: 'hasNext() and next()' },
			subtitles: itLoop.list,
			motion: {
				cues: [
					{ at: 300, do: 'enter', el: 'has-0' },
					{ at: itLoop.start(1) + 200, do: 'enter', el: 'next-0' },
					{ at: itLoop.start(1) + 200, do: 'move', el: 'cur', to: 'gp-1', dur: 1100 },
					{ at: itLoop.start(1) + 1500, do: 'pulse', el: 'cell-0' },
					{ at: itLoop.start(2) + 200, do: 'enter', el: 'has-1' },
					{ at: itLoop.start(2) + 900, do: 'enter', el: 'next-1' },
					{ at: itLoop.start(2) + 900, do: 'move', el: 'cur', to: 'gp-2', dur: 1100 },
					{ at: itLoop.start(2) + 2200, do: 'pulse', el: 'cell-1' },
					{ at: itLoop.start(2) + 2800, do: 'enter', el: 'has-2' },
					{ at: itLoop.start(2) + 3500, do: 'enter', el: 'next-2' },
					{ at: itLoop.start(2) + 3500, do: 'move', el: 'cur', to: 'gp-3', dur: 1100 },
					{ at: itLoop.start(2) + 4800, do: 'pulse', el: 'cell-2' },
				],
			},
		},
		{
			id: 'it-end',
			chapter: 'foreach',
			scene: 'iter',
			title: { es: 'Se acabaron los elementos', en: 'No more elements' },
			subtitles: itEnd.list,
			motion: {
				cues: [
					{ at: 400, do: 'enter', el: 'has-end' },
					{ at: 1400, do: 'pulse', el: 'cur' },
					{ at: itEnd.start(1) + 300, do: 'pulse', el: 'cell-2' },
					{ at: itEnd.start(1) + 1100, do: 'pulse', el: 'cur' },
				],
			},
		},

		// ─── 2. ConcurrentModificationException ─────────────────────────────
		{
			id: 'cme-bad',
			chapter: 'cme',
			scene: 'cmefix',
			show: ['cf-bad'],
			focus: ['cf-bad'],
			code: code(
				'Tareas.java',
				`List<String> tareas = new ArrayList<>(
    List.of("estudiar", "descansar", "practicar", "leer"));

for (String t : tareas) {
    if (t.startsWith("d")) {
        tareas.remove(t);      // ← ConcurrentModificationException
    }
}`,
			),
			shell: shell(cmd('java Tareas'), err('Exception in thread "main" java.util.ConcurrentModificationException'), err('    at java.base/java.util.ArrayList$Itr.checkForComodification(ArrayList.java)')),
			title: { es: 'Borrar dentro del for-each', en: 'Deleting inside the for-each' },
			subtitles: [
				say('Este código parece razonable, pero falla: borra de la lista mientras el for-each la recorre.', 'This code looks reasonable, but it fails: it deletes from the list while the for-each walks it.'),
				say('Veamos paso a paso qué detecta Java y por qué se queja.', 'Let us see step by step what Java detects and why it complains.'),
			],
		},
		{
			id: 'cme-iterator',
			chapter: 'cme',
			scene: 'cme',
			title: { es: 'El iterador memoriza modCount', en: 'The iterator memorizes modCount' },
			subtitles: cmeIterator.list,
			motion: {
				cues: [
					{ at: 0, do: 'type', el: 'decl', dur: 1700 },
					{ at: 1800, do: 'enter', el: 'list' },
					{ at: 2200, do: 'enter', el: 't0' },
					{ at: 2400, do: 'enter', el: 't1' },
					{ at: 2600, do: 'enter', el: 't2' },
					{ at: 2800, do: 'enter', el: 't3' },
					{ at: 3400, do: 'enter', el: 'lmc0' },
					{ at: 4200, do: 'enter', el: 'it-card' },
					{ at: 4900, do: 'type', el: 'iexp0', dur: 1100 },
					{ at: 6200, do: 'enter', el: 'cur' },
					{ at: cmeIterator.start(1) + 300, do: 'pulse', el: 'lmc0' },
					{ at: cmeIterator.start(1) + 1100, do: 'pulse', el: 'iexp0' },
				],
			},
		},
		{
			id: 'cme-remove',
			chapter: 'cme',
			scene: 'cme',
			title: { es: 'La lista cambia por fuera', en: 'The list changes from outside' },
			subtitles: cmeRemove.list,
			motion: {
				cues: [
					{ at: 0, do: 'move', el: 'cur', to: 'gp-1', dur: 900 },
					{ at: 950, do: 'pulse', el: 't0' },
					{ at: 1500, do: 'move', el: 'cur', to: 'gp-2', dur: 900 },
					{ at: 2450, do: 'pulse', el: 't1' },
					{ at: 3000, do: 'enter', el: 'rmc' },
					{ at: 4200, do: 'exit', el: 't1' },
					{ at: 4500, do: 'move', el: 't2', to: 'sl-1', dur: 900 },
					{ at: 4700, do: 'move', el: 't3', to: 'sl-2', dur: 900 },
					{ at: cmeRemove.start(1), do: 'exit', el: 'lmc0' },
					{ at: cmeRemove.start(1) + 150, do: 'enter', el: 'lmc1' },
					{ at: cmeRemove.start(1) + 1000, do: 'pulse', el: 'lmc1' },
					{ at: cmeRemove.start(2) + 300, do: 'enter', el: 'chk' },
					{ at: cmeRemove.start(2) + 1200, do: 'pulse', el: 'chk' },
					{ at: cmeRemove.start(2) + 2600, do: 'enter', el: 'boom' },
					{ at: cmeRemove.start(2) + 3600, do: 'pulse', el: 'boom' },
					{ at: cmeRemove.start(2) + 3600, do: 'pulse', el: 'it-card' },
				],
			},
		},
		{
			id: 'rm-walk',
			chapter: 'cme',
			scene: 'rm',
			title: { es: 'Borrar con el propio iterador', en: 'Deleting with the iterator itself' },
			subtitles: rmWalk.list,
			motion: {
				cues: [
					{ at: 0, do: 'type', el: 'decl', dur: 1900 },
					{ at: 2200, do: 'enter', el: 'cur' },
					{ at: rmWalk.start(1) + 200, do: 'move', el: 'cur', to: 'gp-1', dur: 900 },
					{ at: rmWalk.start(1) + 1150, do: 'pulse', el: 't0' },
					{ at: rmWalk.start(1) + 1700, do: 'move', el: 'cur', to: 'gp-2', dur: 900 },
					{ at: rmWalk.start(1) + 2650, do: 'pulse', el: 't1' },
				],
			},
		},
		{
			id: 'rm-remove',
			chapter: 'cme',
			scene: 'rm',
			title: { es: 'it.remove() mantiene todo en sincronía', en: 'it.remove() keeps everything in sync' },
			subtitles: rmRemove.list,
			motion: {
				cues: [
					{ at: 200, do: 'enter', el: 'itrm' },
					{ at: 1200, do: 'exit', el: 't1' },
					{ at: 1500, do: 'move', el: 't2', to: 'sl-1', dur: 900 },
					{ at: 1700, do: 'move', el: 't3', to: 'sl-2', dur: 900 },
					{ at: 1500, do: 'move', el: 'cur', to: 'gp-1', dur: 900 },
					{ at: rmRemove.start(1), do: 'exit', el: 'lmc0' },
					{ at: rmRemove.start(1) + 150, do: 'enter', el: 'lmc1' },
					{ at: rmRemove.start(1) + 900, do: 'exit', el: 'iexp0' },
					{ at: rmRemove.start(1) + 1050, do: 'enter', el: 'iexp1' },
					{ at: rmRemove.start(1) + 1800, do: 'enter', el: 'okc' },
					{ at: rmRemove.start(2) + 300, do: 'move', el: 'cur', to: 'gp-2', dur: 900 },
					{ at: rmRemove.start(2) + 1300, do: 'pulse', el: 't2' },
					{ at: rmRemove.start(2) + 1900, do: 'move', el: 'cur', to: 'gp-3', dur: 900 },
					{ at: rmRemove.start(2) + 2900, do: 'pulse', el: 't3' },
				],
			},
		},
		{
			id: 'cme-fix',
			chapter: 'cme',
			scene: 'cmefix',
			show: ['cf-bad', 'cf-opt1', 'cf-opt2'],
			focus: ['cf-opt1', 'cf-opt2'],
			code: code(
				'Tareas.java',
				`// Opción 1: el iterador explícito
Iterator<String> it = tareas.iterator();
while (it.hasNext()) {
    if (it.next().startsWith("d")) {
        it.remove();          // borra Y se mantiene consistente
    }
}

// Opción 2: removeIf — desde Java 8
tareas.removeIf(t -> t.startsWith("d"));`,
				`// Option 1: the explicit iterator
Iterator<String> it = tareas.iterator();
while (it.hasNext()) {
    if (it.next().startsWith("d")) {
        it.remove();          // deletes AND stays consistent
    }
}

// Option 2: removeIf — since Java 8
tareas.removeIf(t -> t.startsWith("d"));`,
			),
			title: { es: 'Las dos formas correctas', en: 'The two correct ways' },
			subtitles: [
				say('Las dos formas correctas: `it.remove()` con el iterador explícito, o `removeIf`.', 'The two correct ways: `it.remove()` with an explicit iterator, or `removeIf`.'),
				say('`removeIf` existe desde Java 8 y es la que vas a usar el 95 % de las veces.', '`removeIf` exists since Java 8 and is the one you will use 95 % of the time.'),
			],
		},
		{
			id: 'cme-threads',
			chapter: 'cme',
			scene: 'cmefix',
			show: '*',
			focus: ['cf-threads'],
			title: { es: 'No tiene nada que ver con hilos', en: 'It has nothing to do with threads' },
			subtitles: [
				say('El nombre confunde: no tiene nada que ver con hilos ni con concurrencia.', 'The name is misleading: it has nothing to do with threads or concurrency.'),
				say('Pasa igual en un programa de un solo hilo: la lista cambió durante el recorrido.', 'It happens the same in a single-threaded program: the list changed during the traversal.'),
				say('La excepción te protege de recorrer una estructura que cambió bajo tus pies.', 'The exception protects you from walking a structure that changed under your feet.'),
			],
		},

		// ─── 3. Comparable ──────────────────────────────────────────────────
		{
			id: 'cmp-error',
			chapter: 'comparable',
			scene: 'sign',
			show: ['sg-error'],
			focus: ['sg-error'],
			code: code(
				'Libros.java',
				`List<Libro> libros = new ArrayList<>();
Collections.sort(libros);   // ERROR: Libro no es Comparable`,
				`List<Libro> libros = new ArrayList<>();
Collections.sort(libros);   // ERROR: Libro is not Comparable`,
			),
			shell: shell(cmd('javac Libros.java'), err('Libros.java:9: error: no suitable method found for sort(List<Libro>)')),
			title: { es: 'Java no sabe ordenar tus objetos', en: 'Java cannot sort your objects' },
			subtitles: [
				say('Si ordenás una lista de objetos propios, Java te frena: `Libro` no es `Comparable`.', 'If you sort a list of your own objects, Java stops you: `Libro` is not `Comparable`.'),
				say('Y tiene razón: ¿ordenar por qué? ¿Título, autor, páginas, año? No puede adivinarlo.', 'And it is right: sort by what? Title, author, pages, year? It cannot guess.'),
			],
		},
		{
			id: 'cmp-sign',
			chapter: 'comparable',
			scene: 'sign',
			show: ['sg-neg', 'sg-zero', 'sg-pos'],
			title: { es: 'Qué devuelve compareTo', en: 'What compareTo returns' },
			subtitles: [
				say('`Comparable` define el orden natural: el que tiene sentido cuando nadie pide otro.', '`Comparable` defines the natural order: the one that makes sense when nobody asks for another.'),
				say('`a.compareTo(b)` negativo: a va antes. Cero: equivalentes. Positivo: a va después.', '`a.compareTo(b)` negative: a goes first. Zero: equivalent. Positive: a goes after.'),
				say('El valor exacto no importa: solo importa el signo.', 'The exact value does not matter: only the sign does.'),
			],
		},
		{
			id: 'cmp-natural-code',
			chapter: 'comparable',
			scene: 'sign',
			show: ['sg-neg', 'sg-zero', 'sg-pos'],
			focus: ['sg-neg'],
			code: code(
				'Libro.java',
				`public class Libro implements Comparable<Libro> {
    private final String titulo;
    private final String autor;
    private final int paginas;

    @Override
    public int compareTo(Libro otro) {
        return this.titulo.compareTo(otro.titulo);   // orden natural: por título
    }
}`,
				`public class Libro implements Comparable<Libro> {
    private final String titulo;
    private final String autor;
    private final int paginas;

    @Override
    public int compareTo(Libro otro) {
        return this.titulo.compareTo(otro.titulo);   // natural order: by title
    }
}`,
			),
			title: { es: 'Implementar Comparable', en: 'Implementing Comparable' },
			subtitles: [
				say('Se implementa `Comparable<Libro>` y se escribe `compareTo`: acá, el orden natural es por título.', 'You implement `Comparable<Libro>` and write `compareTo`: here the natural order is by title.'),
				say('Con eso `Collections.sort`, `TreeSet`, `TreeMap` y `Arrays.sort` funcionan solos.', 'With that, `Collections.sort`, `TreeSet`, `TreeMap` and `Arrays.sort` just work.'),
			],
		},
		{
			id: 'cmp-trap',
			chapter: 'comparable',
			scene: 'sign',
			show: '*',
			focus: ['sg-trap'],
			code: code(
				'Persona.java',
				`// Trampa clásica: la resta puede desbordar el int
return this.edad - otro.edad;

// Siempre así:
return Integer.compare(this.edad, otro.edad);`,
				`// Classic trap: the subtraction can overflow the int
return this.edad - otro.edad;

// Always like this:
return Integer.compare(this.edad, otro.edad);`,
			),
			title: { es: 'La trampa de la resta', en: 'The subtraction trap' },
			subtitles: [
				say('La trampa clásica: devolver `this.edad - otro.edad`. Con valores grandes la resta desborda el `int`.', 'The classic trap: returning `this.edad - otro.edad`. With large values the subtraction overflows the `int`.'),
				say('El signo sale equivocado y la lista queda mal ordenada, sin ninguna excepción.', 'The sign comes out wrong and the list ends up misordered, with no exception at all.'),
				say('Usá siempre `Integer.compare(a, b)`.', 'Always use `Integer.compare(a, b)`.'),
			],
		},

		// ─── 4. Comparator ──────────────────────────────────────────────────
		{
			id: 'cr-why',
			chapter: 'comparator',
			scene: 'cmpvs',
			show: ['cv-comparable', 'cv-comparator'],
			focus: ['cv-comparator'],
			title: { es: 'Un orden natural, muchos comparadores', en: 'One natural order, many comparators' },
			subtitles: [
				say('`Comparable` tiene un límite: solo podés tener un orden natural por clase.', '`Comparable` has a limit: you can only have one natural order per class.'),
				say('¿Y si a veces querés ordenar por páginas y otras por autor?', 'And what if sometimes you want to sort by pages and other times by author?'),
				say('Para eso está `Comparator`: un orden que vive fuera de la clase. Podés tener todos los que quieras.', 'That is what `Comparator` is for: an order that lives outside the class. You can have as many as you like.'),
			],
		},
		{
			id: 'sort-start',
			chapter: 'comparator',
			scene: 'sort',
			title: { es: 'Una lista sin ordenar', en: 'An unsorted list' },
			subtitles: sortStart.list,
			motion: {
				cues: [
					{ at: 0, do: 'enter', el: 'bk0' },
					{ at: 250, do: 'enter', el: 'bk1' },
					{ at: 500, do: 'enter', el: 'bk2' },
					{ at: 750, do: 'enter', el: 'bk3' },
					{ at: 2200, do: 'pulse', el: 'bk0' },
					{ at: 2400, do: 'pulse', el: 'bk1' },
					{ at: 2600, do: 'pulse', el: 'bk2' },
					{ at: 2800, do: 'pulse', el: 'bk3' },
				],
			},
		},
		{
			id: 'sort-natural',
			chapter: 'comparator',
			scene: 'sort',
			title: { es: 'Orden natural: por título', en: 'Natural order: by title' },
			subtitles: sortNatural.list,
			motion: {
				cues: [
					{ at: 0, do: 'type', el: 's-natural', dur: 1500 },
					{ at: 1700, do: 'pulse', el: 'bk0' },
					{ at: 1700, do: 'pulse', el: 'bk1' },
					{ at: 2800, do: 'pulse', el: 'bk2' },
					{ at: 2800, do: 'pulse', el: 'bk3' },
					{ at: 3800, do: 'move', el: 'bk2', to: 'ps-0', dur: 1400 },
					{ at: 4100, do: 'move', el: 'bk1', to: 'ps-1', dur: 1400 },
					{ at: 4400, do: 'move', el: 'bk3', to: 'ps-2', dur: 1400 },
					{ at: 4700, do: 'move', el: 'bk0', to: 'ps-3', dur: 1400 },
					{ at: sortNatural.start(1) + 500, do: 'pulse', el: 'bk2' },
				],
			},
		},
		{
			id: 'sort-pages',
			chapter: 'comparator',
			scene: 'sort',
			title: { es: 'Comparator por páginas, descendente', en: 'Comparator by pages, descending' },
			subtitles: sortPages.list,
			motion: {
				cues: [
					{ at: 0, do: 'exit', el: 's-natural' },
					{ at: 500, do: 'type', el: 's-pages', dur: 2300 },
					{ at: 3000, do: 'pulse', el: 'bk0' },
					{ at: 3000, do: 'pulse', el: 'bk2' },
					{ at: 4000, do: 'move', el: 'bk0', to: 'ps-0', dur: 1400 },
					{ at: 4300, do: 'move', el: 'bk2', to: 'ps-1', dur: 1400 },
					{ at: 4600, do: 'move', el: 'bk3', to: 'ps-2', dur: 1400 },
					{ at: 4900, do: 'move', el: 'bk1', to: 'ps-3', dur: 1400 },
					{ at: sortPages.start(1) + 500, do: 'pulse', el: 'bk0' },
				],
			},
		},
		{
			id: 'sort-author',
			chapter: 'comparator',
			scene: 'sort',
			title: { es: 'Por autor y, a igual autor, por título', en: 'By author and, on a tie, by title' },
			subtitles: sortAuthor.list,
			motion: {
				cues: [
					{ at: 0, do: 'exit', el: 's-pages' },
					{ at: 500, do: 'type', el: 's-author', dur: 2400 },
					{ at: 3100, do: 'pulse', el: 'bk1' },
					{ at: 3100, do: 'pulse', el: 'bk3' },
					{ at: 3900, do: 'move', el: 'bk1', to: 'ps-0', dur: 1400 },
					{ at: 4200, do: 'move', el: 'bk3', to: 'ps-1', dur: 1400 },
					{ at: 4500, do: 'move', el: 'bk0', to: 'ps-2', dur: 1400 },
					{ at: 4800, do: 'move', el: 'bk2', to: 'ps-3', dur: 1400 },
					{ at: sortAuthor.start(1) + 600, do: 'pulse', el: 'bk1' },
					{ at: sortAuthor.start(1) + 600, do: 'pulse', el: 'bk3' },
					{ at: sortAuthor.start(2) + 300, do: 'enter', el: 'sort-note' },
				],
			},
		},
		{
			id: 'cr-code',
			chapter: 'comparator',
			scene: 'cmpvs',
			show: '*',
			focus: ['cv-chain', 'cv-null'],
			code: code(
				'Orden.java',
				`// Ordenar por páginas, de menor a mayor
libros.sort(Comparator.comparingInt(Libro::getPaginas));

// De mayor a menor
libros.sort(Comparator.comparingInt(Libro::getPaginas).reversed());

// Por autor y, a igual autor, por título
libros.sort(Comparator.comparing(Libro::getAutor)
                      .thenComparing(Libro::getTitulo));

// Con nulos al final, sin que reviente
libros.sort(Comparator.comparing(Libro::getAutor,
            Comparator.nullsLast(Comparator.naturalOrder())));`,
				`// Sort by pages, ascending
libros.sort(Comparator.comparingInt(Libro::getPaginas));

// Descending
libros.sort(Comparator.comparingInt(Libro::getPaginas).reversed());

// By author and, on a tie, by title
libros.sort(Comparator.comparing(Libro::getAutor)
                      .thenComparing(Libro::getTitulo));

// Nulls last, without blowing up
libros.sort(Comparator.comparing(Libro::getAutor,
            Comparator.nullsLast(Comparator.naturalOrder())));`,
			),
			title: { es: 'Los comparadores que más vas a usar', en: 'The comparators you will use most' },
			subtitles: [
				say('Los comparadores más usados: por campo, invertido y encadenado con `thenComparing`.', 'The most used comparators: by field, reversed and chained with `thenComparing`.'),
				say('Con `nullsLast` los valores nulos van al final sin que el ordenamiento reviente.', 'With `nullsLast` the null values go last without the sort blowing up.'),
				say('Un `Comparator` sirve incluso para clases que no escribiste y no podés modificar.', 'A `Comparator` works even for classes you did not write and cannot modify.'),
			],
		},

		// ─── 5. The equals contract ─────────────────────────────────────────
		{
			id: 'eq-refs',
			chapter: 'equals',
			scene: 'eq',
			title: { es: 'Dos libros iguales, dos objetos', en: 'Two equal books, two objects' },
			subtitles: eqRefs.list,
			motion: {
				cues: [
					{ at: 0, do: 'type', el: 'code1', dur: 1500 },
					{ at: 1500, do: 'type', el: 'code2', dur: 1500 },
					{ at: 3200, do: 'enter', el: 'va' },
					{ at: 3400, do: 'enter', el: 'vb' },
					{ at: 3900, do: 'enter', el: 'oa' },
					{ at: 4100, do: 'enter', el: 'ob' },
					{ at: 4800, do: 'draw', el: 'arr-a', dur: 700 },
					{ at: 4900, do: 'draw', el: 'arr-b', dur: 700 },
					{ at: eqRefs.start(1) + 400, do: 'enter', el: 'r1' },
					{ at: eqRefs.start(1) + 1300, do: 'pulse', el: 'r1' },
				],
			},
		},
		{
			id: 'eq-default',
			chapter: 'equals',
			scene: 'eq',
			title: { es: 'equals() por defecto', en: 'Default equals()' },
			subtitles: eqDefault.list,
			motion: {
				cues: [
					{ at: 400, do: 'pulse', el: 'oa' },
					{ at: 600, do: 'pulse', el: 'ob' },
					{ at: 1400, do: 'enter', el: 'r2' },
					{ at: 2300, do: 'pulse', el: 'r2' },
					{ at: eqDefault.start(1) + 500, do: 'pulse', el: 'r1' },
					{ at: eqDefault.start(1) + 700, do: 'pulse', el: 'r2' },
				],
			},
		},
		{
			id: 'eq-fields',
			chapter: 'equals',
			scene: 'eq',
			title: { es: 'equals() sobrescrito compara campos', en: 'Overridden equals() compares fields' },
			subtitles: eqFields.list,
			motion: {
				cues: [
					{ at: 500, do: 'draw', el: 'ln-t', dur: 800 },
					{ at: 1000, do: 'draw', el: 'ln-a', dur: 800 },
					{ at: 1500, do: 'draw', el: 'ln-p', dur: 800 },
					{ at: 2600, do: 'pulse', el: 'oa' },
					{ at: 2600, do: 'pulse', el: 'ob' },
					{ at: eqFields.start(1) + 200, do: 'enter', el: 'r3' },
					{ at: eqFields.start(1) + 1100, do: 'pulse', el: 'r3' },
					{ at: eqFields.start(1) + 1100, do: 'flow', el: 'ln-t' },
					{ at: eqFields.start(1) + 1100, do: 'flow', el: 'ln-a' },
					{ at: eqFields.start(1) + 1100, do: 'flow', el: 'ln-p' },
				],
			},
		},
		{
			id: 'eq-rules',
			chapter: 'equals',
			scene: 'rules',
			show: ['ru-refl', 'ru-sym', 'ru-trans', 'ru-cons', 'ru-null'],
			title: { es: 'Las cinco reglas del contrato', en: 'The five rules of the contract' },
			subtitles: [
				say('Sobrescribir `equals` es firmar un contrato de cinco cláusulas.', 'Overriding `equals` means signing a contract with five clauses.'),
				say('Reflexiva, simétrica y transitiva: `a` es igual a sí mismo, y la igualdad va y vuelve y se encadena.', 'Reflexive, symmetric and transitive: `a` equals itself, and equality goes both ways and chains.'),
				say('Consistente: el mismo resultado si nada cambió. Y contra `null`: siempre false, nunca excepción.', 'Consistent: the same result if nothing changed. And against `null`: always false, never an exception.'),
			],
		},
		{
			id: 'eq-code',
			chapter: 'equals',
			scene: 'rules',
			show: ['ru-refl', 'ru-sym', 'ru-trans', 'ru-cons', 'ru-null'],
			focus: ['ru-refl', 'ru-null'],
			code: code(
				'Libro.java',
				`@Override
public boolean equals(Object o) {
    if (this == o) return true;                    // atajo: mismo objeto
    if (o == null || getClass() != o.getClass()) return false;
    Libro otro = (Libro) o;
    return paginas == otro.paginas
        && Objects.equals(titulo, otro.titulo)     // tolera null en ambos lados
        && Objects.equals(autor, otro.autor);
}`,
				`@Override
public boolean equals(Object o) {
    if (this == o) return true;                    // shortcut: same object
    if (o == null || getClass() != o.getClass()) return false;
    Libro otro = (Libro) o;
    return paginas == otro.paginas
        && Objects.equals(titulo, otro.titulo)     // tolerates null on both sides
        && Objects.equals(autor, otro.autor);
}`,
			),
			title: { es: 'Un equals correcto', en: 'A correct equals' },
			subtitles: [
				say('El esqueleto: atajo si es el mismo objeto, false si es `null` o de otra clase, y después los campos.', 'The skeleton: shortcut for the same object, false for `null` or another class, then the fields.'),
				say('`Objects.equals` tolera `null` a ambos lados, y el parámetro es `Object o`.', '`Objects.equals` tolerates `null` on both sides, and the parameter is `Object o`.'),
			],
		},
		{
			id: 'eq-overload',
			chapter: 'equals',
			scene: 'rules',
			show: '*',
			focus: ['ru-overload'],
			code: code(
				'Libro.java',
				`// Sobrecarga: las colecciones NO la usan
public boolean equals(Libro o) { ... }

// Sobrescritura: la correcta
@Override
public boolean equals(Object o) { ... }`,
				`// Overload: collections do NOT use it
public boolean equals(Libro o) { ... }

// Override: the correct one
@Override
public boolean equals(Object o) { ... }`,
			),
			title: { es: 'equals(Libro) no es equals(Object)', en: 'equals(Libro) is not equals(Object)' },
			subtitles: [
				say('Si escribís `equals(Libro o)` estás sobrecargando, no sobrescribiendo.', 'If you write `equals(Libro o)` you are overloading, not overriding.'),
				say('Las colecciones llaman a `equals(Object)` y siguen usando la comparación por referencia.', 'Collections call `equals(Object)` and keep using the comparison by reference.'),
				say('`@Override` detecta este error al compilar: usalo siempre.', '`@Override` catches this mistake at compile time: always use it.'),
			],
		},

		// ─── 6. hashCode ────────────────────────────────────────────────────
		{
			id: 'hash-intro',
			chapter: 'hashcode',
			scene: 'hash',
			title: { es: 'El HashSet calcula un cajón', en: 'The HashSet computes a bucket' },
			subtitles: hashIntro.list,
			motion: {
				cues: [
					{ at: 0, do: 'enter', el: 'buckets' },
					{ at: 1500, do: 'pulse', el: 'buckets' },
					{ at: hashIntro.start(1) + 400, do: 'pulse', el: 'buckets' },
				],
			},
		},
		{
			id: 'hash-broken',
			chapter: 'hashcode',
			scene: 'hash',
			title: { es: 'equals() sí, hashCode() no', en: 'equals() yes, hashCode() no' },
			subtitles: hashBroken.list,
			motion: {
				cues: [
					{ at: 0, do: 'enter', el: 'L1' },
					{ at: 300, do: 'enter', el: 'L2' },
					{ at: 1000, do: 'pulse', el: 'L1' },
					{ at: 1000, do: 'pulse', el: 'L2' },
					{ at: hashBroken.start(1), do: 'type', el: 'hh1', dur: 1500 },
					{ at: hashBroken.start(1) + 1700, do: 'move', el: 'L1', to: 'bk-2', dur: 1300 },
					{ at: hashBroken.start(1) + 3200, do: 'type', el: 'hh2', dur: 1600 },
					{ at: hashBroken.start(1) + 4900, do: 'move', el: 'L2', to: 'bk-11', dur: 1500 },
					{ at: hashBroken.start(2) + 300, do: 'enter', el: 'sz2' },
					{ at: hashBroken.start(2) + 1200, do: 'pulse', el: 'sz2' },
					{ at: hashBroken.start(2) + 1200, do: 'enter', el: 'skip' },
				],
			},
		},
		{
			id: 'hash-fixed',
			chapter: 'hashcode',
			scene: 'hash',
			title: { es: 'Con hashCode sobrescrito', en: 'With hashCode overridden' },
			subtitles: hashFixed.list,
			motion: {
				cues: [
					{ at: 0, do: 'exit', el: 'L1' },
					{ at: 0, do: 'exit', el: 'L2' },
					{ at: 0, do: 'exit', el: 'hh1' },
					{ at: 0, do: 'exit', el: 'hh2' },
					{ at: 0, do: 'exit', el: 'sz2' },
					{ at: 0, do: 'exit', el: 'skip' },
					{ at: 700, do: 'enter', el: 'G1' },
					{ at: 900, do: 'enter', el: 'G2' },
					{ at: 1400, do: 'type', el: 'hh3', dur: 1700 },
					{ at: hashFixed.start(1), do: 'move', el: 'G1', to: 'bk-6', dur: 1300 },
					{ at: hashFixed.start(1) + 1500, do: 'move', el: 'G2', to: 'bk-6', dy: -135, dur: 1400 },
					{ at: hashFixed.start(2) + 200, do: 'enter', el: 'eqc' },
					{ at: hashFixed.start(2) + 1100, do: 'pulse', el: 'eqc' },
					{ at: hashFixed.start(2) + 1900, do: 'exit', el: 'G2' },
					{ at: hashFixed.start(2) + 2300, do: 'enter', el: 'sz1' },
					{ at: hashFixed.start(2) + 3200, do: 'pulse', el: 'sz1' },
				],
			},
		},
		{
			id: 'hash-mutate',
			chapter: 'hashcode',
			scene: 'hash',
			title: { es: 'Un objeto que cambia después de guardarse', en: 'An object that changes after being stored' },
			subtitles: hashMutate.list,
			motion: {
				cues: [
					{ at: 0, do: 'exit', el: 'G1' },
					{ at: 0, do: 'exit', el: 'hh3' },
					{ at: 0, do: 'exit', el: 'eqc' },
					{ at: 0, do: 'exit', el: 'sz1' },
					{ at: 600, do: 'enter', el: 'M' },
					{ at: 1500, do: 'type', el: 'hh4', dur: 1800 },
					{ at: 3500, do: 'exit', el: 'm-old' },
					{ at: 3650, do: 'enter', el: 'm-new' },
					{ at: 4300, do: 'pulse', el: 'M' },
					{ at: hashMutate.start(1) + 200, do: 'enter', el: 'ghost' },
					{ at: hashMutate.start(1) + 900, do: 'enter', el: 'probe' },
					{ at: hashMutate.start(1) + 1800, do: 'move', el: 'probe', to: 'bk-9', dur: 1400 },
					{ at: hashMutate.start(2) + 300, do: 'enter', el: 'miss' },
					{ at: hashMutate.start(2) + 1200, do: 'pulse', el: 'miss' },
				],
			},
		},
		{
			id: 'hc-rule',
			chapter: 'hashcode',
			scene: 'hcrule',
			show: ['hr-rule', 'hr-conv'],
			title: { es: 'La regla es absoluta', en: 'The rule is absolute' },
			subtitles: [
				say('La regla es absoluta: si `a.equals(b)` es true, los dos `hashCode` tienen que ser iguales.', 'The rule is absolute: if `a.equals(b)` is true, both `hashCode` values must be equal.'),
				say('Al revés no hace falta: dos objetos distintos pueden compartir hashCode. Es una colisión y es normal.', 'The reverse is not required: two different objects can share a hashCode. That is a collision and it is normal.'),
			],
		},
		{
			id: 'hc-code',
			chapter: 'hashcode',
			scene: 'hcrule',
			show: ['hr-rule', 'hr-conv', 'hr-fields'],
			focus: ['hr-fields'],
			code: code(
				'Libro.java',
				`@Override
public int hashCode() {
    return Objects.hash(titulo, autor, paginas);   // los MISMOS campos que equals
}`,
				`@Override
public int hashCode() {
    return Objects.hash(titulo, autor, paginas);   // the SAME fields as equals
}`,
			),
			title: { es: 'hashCode con los mismos campos', en: 'hashCode with the same fields' },
			subtitles: [
				say('Si sobrescribís `equals`, sobrescribí `hashCode` con `Objects.hash(...)`.', 'If you override `equals`, override `hashCode` with `Objects.hash(...)`.'),
				say('Usá los mismos campos en los dos: si `hashCode` usa uno que `equals` ignora, el contrato se rompe.', 'Use the same fields in both: if `hashCode` uses one that `equals` ignores, the contract breaks.'),
			],
		},
		{
			id: 'hc-record',
			chapter: 'hashcode',
			scene: 'hcrule',
			show: '*',
			focus: ['hr-record'],
			code: code(
				'Libro.java',
				`public record Libro(String titulo, String autor, int paginas)
        implements Comparable<Libro> {

    @Override
    public int compareTo(Libro otro) {
        return this.titulo.compareTo(otro.titulo);
    }
}`,
			),
			title: { es: 'El atajo: record', en: 'The shortcut: record' },
			subtitles: [
				say('Si tu clase solo transporta datos, un `record` genera `equals`, `hashCode` y `toString` correctos.', 'If your class only carries data, a `record` generates correct `equals`, `hashCode` and `toString`.'),
				say('Tres líneas y el compilador te garantiza el contrato.', 'Three lines and the compiler guarantees the contract for you.'),
			],
		},

		// ─── 7. Common mistakes ─────────────────────────────────────────────
		{
			id: 'errors-first',
			chapter: 'errors',
			scene: 'errors16',
			show: ['e1', 'e2', 'e3', 'e4'],
			focus: ['e1', 'e2', 'e3', 'e4'],
			title: { es: 'Errores frecuentes (1 de 2)', en: 'Common mistakes (1 of 2)' },
			subtitles: [
				say('Sobrescribir `equals` y no `hashCode`: los `HashSet` guardan duplicados y `get()` devuelve `null`.', 'Overriding `equals` but not `hashCode`: `HashSet`s keep duplicates and `get()` returns `null`.'),
				say('Escribir `equals(Libro o)` en vez de `equals(Object o)`: es una sobrecarga y no se usa.', 'Writing `equals(Libro o)` instead of `equals(Object o)`: it is an overload and goes unused.'),
				say('Devolver `a - b` en `compareTo`, o comparar `String` con `==`.', 'Returning `a - b` in `compareTo`, or comparing `String` with `==`.'),
			],
		},
		{
			id: 'errors-second',
			chapter: 'errors',
			scene: 'errors16',
			show: '*',
			focus: ['e5', 'e6', 'e7'],
			title: { es: 'Errores frecuentes (2 de 2)', en: 'Common mistakes (2 of 2)' },
			subtitles: [
				say('Modificar un objeto ya guardado en un `HashSet`: cambia su hash y `contains()` lo pierde.', 'Modifying an object already stored in a `HashSet`: its hash changes and `contains()` loses it.'),
				say('Borrar con `lista.remove(x)` dentro de un for-each: usá `removeIf` o `iterator.remove()`.', 'Deleting with `lista.remove(x)` inside a for-each: use `removeIf` or `iterator.remove()`.'),
				say('Y un `compareTo` inconsistente con `equals`: el `TreeSet` descarta elementos sin avisar.', 'And a `compareTo` inconsistent with `equals`: the `TreeSet` drops elements without warning.'),
			],
		},

		// ─── 8. Guided exercise ─────────────────────────────────────────────
		{
			id: 'ex-intro',
			chapter: 'exercise',
			scene: 'exercise16',
			show: ['x1', 'x2', 'x3', 'x4', 'x5', 'x6'],
			title: { es: 'El desafío: la clase Libro', en: 'The challenge: the Libro class' },
			subtitles: [
				say('El desafío guiado: una clase `Libro` con título, autor y páginas, todos inmutables.', 'The guided challenge: a `Libro` class with title, author and pages, all immutable.'),
				say('Seis pasos: `equals`, `hashCode`, `Comparable`, un `HashSet`, varios ordenamientos y un `TreeSet`.', 'Six steps: `equals`, `hashCode`, `Comparable`, a `HashSet`, several sorts and a `TreeSet`.'),
			],
		},
		{
			id: 'ex-class',
			chapter: 'exercise',
			scene: 'exercise16',
			show: ['x1', 'x2', 'x3', 'x4', 'x5', 'x6'],
			focus: ['x1', 'x2', 'x3'],
			code: code(
				'Libro.java',
				`public final class Libro implements Comparable<Libro> {
    private final String titulo;
    private final String autor;
    private final int paginas;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Libro otro = (Libro) o;
        return paginas == otro.paginas
            && Objects.equals(titulo, otro.titulo)
            && Objects.equals(autor, otro.autor);
    }

    @Override
    public int hashCode() {
        return Objects.hash(titulo, autor, paginas);   // los mismos tres campos
    }

    @Override
    public int compareTo(Libro otro) {
        return this.titulo.compareTo(otro.titulo);     // orden natural: por título
    }
}`,
				`public final class Libro implements Comparable<Libro> {
    private final String titulo;
    private final String autor;
    private final int paginas;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Libro otro = (Libro) o;
        return paginas == otro.paginas
            && Objects.equals(titulo, otro.titulo)
            && Objects.equals(autor, otro.autor);
    }

    @Override
    public int hashCode() {
        return Objects.hash(titulo, autor, paginas);   // the same three fields
    }

    @Override
    public int compareTo(Libro otro) {
        return this.titulo.compareTo(otro.titulo);     // natural order: by title
    }
}`,
			),
			title: { es: 'equals, hashCode y compareTo', en: 'equals, hashCode and compareTo' },
			subtitles: [
				say('Pasos 1 a 3: campos inmutables, `equals` y `hashCode` con los tres campos, y orden natural por título.', 'Steps 1 to 3: immutable fields, `equals` and `hashCode` over the three fields, and natural order by title.'),
				say('Con esto, dos libros idénticos son iguales y tienen el mismo hash.', 'With this, two identical books are equal and share the same hash.'),
			],
		},
		{
			id: 'ex-run',
			chapter: 'exercise',
			scene: 'exercise16',
			show: ['x1', 'x2', 'x3', 'x4', 'x5', 'x6'],
			focus: ['x4', 'x5'],
			shell: shell(
				cmd('javac Libro.java && java Libro'),
				out('a == b        → false'),
				out('a.equals(b)   → true'),
				out('mismo hash    → true'),
				out('HashSet size  → 1'),
			),
			title: { es: 'Probar el HashSet y los ordenamientos', en: 'Trying the HashSet and the sorts' },
			subtitles: [
				say('Paso 4: `a == b` da false, `a.equals(b)` da true y el `HashSet` descarta el duplicado.', 'Step 4: `a == b` is false, `a.equals(b)` is true and the `HashSet` discards the duplicate.'),
				say('Paso 5: ordenás la lista por el orden natural y con tres `Comparator` distintos.', 'Step 5: you sort the list by the natural order and with three different `Comparator`s.'),
			],
		},
		{
			id: 'tree-add',
			chapter: 'exercise',
			scene: 'tree',
			title: { es: 'La trampa del TreeSet', en: 'The TreeSet trap' },
			subtitles: treeAdd.list,
			motion: {
				cues: [
					{ at: 0, do: 'enter', el: 'ts' },
					{ at: 500, do: 'enter', el: 'n1' },
					{ at: 1100, do: 'enter', el: 'szt' },
					{ at: 2200, do: 'pulse', el: 'n1' },
					{ at: treeAdd.start(1) + 300, do: 'enter', el: 'inc' },
					{ at: treeAdd.start(1) + 1200, do: 'pulse', el: 'inc' },
				],
			},
		},
		{
			id: 'tree-result',
			chapter: 'exercise',
			scene: 'tree',
			title: { es: 'compareTo == 0 es duplicado', en: 'compareTo == 0 means duplicate' },
			subtitles: treeResult.list,
			motion: {
				cues: [
					{ at: 0, do: 'move', el: 'inc', to: 'n1', dx: 640, dur: 1300 },
					{ at: 1400, do: 'enter', el: 'c-eq' },
					{ at: 2300, do: 'pulse', el: 'c-eq' },
					{ at: treeResult.start(1) + 200, do: 'enter', el: 'c-cmp' },
					{ at: treeResult.start(1) + 1100, do: 'pulse', el: 'c-cmp' },
					{ at: treeResult.start(2) + 200, do: 'exit', el: 'inc' },
					{ at: treeResult.start(2) + 700, do: 'enter', el: 'c-rej' },
					{ at: treeResult.start(2) + 1500, do: 'pulse', el: 'szt' },
				],
			},
		},
		{
			id: 'ex-fix',
			chapter: 'exercise',
			scene: 'exercise16',
			show: ['x1', 'x2', 'x3', 'x4', 'x5', 'x6', 'x-fix'],
			focus: ['x6', 'x-fix'],
			code: code(
				'Libro.java',
				`@Override
public int compareTo(Libro otro) {
    int porTitulo = this.titulo.compareTo(otro.titulo);
    if (porTitulo != 0) return porTitulo;
    int porAutor = Objects.compare(this.autor, otro.autor,
                                   Comparator.nullsFirst(Comparator.naturalOrder()));
    if (porAutor != 0) return porAutor;
    return Integer.compare(this.paginas, otro.paginas);   // nunca la resta
}`,
				`@Override
public int compareTo(Libro otro) {
    int porTitulo = this.titulo.compareTo(otro.titulo);
    if (porTitulo != 0) return porTitulo;
    int porAutor = Objects.compare(this.autor, otro.autor,
                                   Comparator.nullsFirst(Comparator.naturalOrder()));
    if (porAutor != 0) return porAutor;
    return Integer.compare(this.paginas, otro.paginas);   // never the subtraction
}`,
			),
			title: { es: 'Un compareTo consistente con equals', en: 'A compareTo consistent with equals' },
			subtitles: [
				say('La solución: que `compareTo` devuelva 0 exactamente cuando `equals` devuelve true.', 'The fix: make `compareTo` return 0 exactly when `equals` returns true.'),
				say('Compará título, después autor y después páginas, siempre con `Integer.compare`.', 'Compare title, then author, then pages, always with `Integer.compare`.'),
			],
		},

		// ─── Closing ────────────────────────────────────────────────────────
		{
			id: 'closing-takeaways',
			chapter: 'closing',
			scene: 'closing16',
			show: '*',
			focus: ['c1', 'c2', 'c3', 'c4', 'c5'],
			title: { es: 'Para llevarte', en: 'Takeaways' },
			subtitles: [
				say('El for-each usa un `Iterator`; para borrar mientras recorrés, `removeIf` o `iterator.remove()`.', 'The for-each uses an `Iterator`; to delete while walking, use `removeIf` or `iterator.remove()`.'),
				say('`Comparable` es un orden natural; `Comparator`, muchos órdenes. En `compareTo` importa solo el signo.', '`Comparable` is one natural order; `Comparator`, many. In `compareTo` only the sign matters.'),
			],
		},
		{
			id: 'closing-contract',
			chapter: 'closing',
			scene: 'closing16',
			show: '*',
			focus: ['c6', 'c7', 'c8', 'c9'],
			title: { es: 'El contrato, en una línea', en: 'The contract in one line' },
			subtitles: [
				say('Si sobrescribís `equals`, sobrescribí `hashCode` con los mismos campos y la firma `equals(Object o)`.', 'If you override `equals`, override `hashCode` with the same fields and the `equals(Object o)` signature.'),
				say('`TreeSet` y `TreeMap` ignoran `equals` y deciden con `compareTo`. Un `record` lo resuelve gratis.', '`TreeSet` and `TreeMap` ignore `equals` and decide with `compareTo`. A `record` solves it for free.'),
			],
		},
		{
			id: 'closing-repo',
			chapter: 'closing',
			scene: 'closing16',
			show: '*',
			focus: ['repo'],
			title: { es: 'Profundizá con código real', en: 'Go deeper with real code' },
			subtitles: [
				say('Reforzá la lección con programas completos y ejecutables en el repositorio del curso.', 'Reinforce the lesson with complete, runnable programs in the course repository.'),
				say('Clonalo y ejecutá cada programa mientras leés para ver cada concepto en acción.', 'Clone it and run each program while you read to see every concept in action.'),
			],
		},
	],
};
