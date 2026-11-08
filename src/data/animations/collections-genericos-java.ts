import type { AnimationScript, CodePanel, ShellLine, ShellPanel, Subtitle } from './types';

// Step-by-step animation for the Java lesson 15 "Colecciones en Java y Genéricos (JCF)".
// Every step names the scene it shows (`data-scene` in
// `src/components/animaciones/collections-genericos-java.astro`), its captions and,
// for slide steps, the elements it reveals plus any code or terminal panel.
// Nine scenes are SVG canvases choreographed by motion steps (the hierarchy, generics
// against Object, List and Set, ArrayList against LinkedList, Map, HashMap buckets,
// a generic box, a bounded type and type erasure); the rest are slide steps.

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
const hierRoot = timed(
	say('Todo el framework nace de una jerarquía de interfaces, no de clases.', 'The whole framework starts from a hierarchy of interfaces, not classes.'),
	say('`Iterable` permite el for-each y `Collection` guarda elementos sueltos.', '`Iterable` enables for-each and `Collection` holds loose elements.'),
);
const hierFamilies = timed(
	say('De `Collection` cuelgan tres familias: `List`, `Set` y `Queue`.', 'Three families hang from `Collection`: `List`, `Set` and `Queue`.'),
	say('Cada una es una interfaz: el contrato, lo que luego llamarás TAD.', 'Each one is an interface: the contract, what you will later call an ADT.'),
);
const hierImpls = timed(
	say('Las clases concretas son las implementaciones: `ArrayList`, `HashSet`, `ArrayDeque`…', 'The concrete classes are the implementations: `ArrayList`, `HashSet`, `ArrayDeque`…'),
	say('Cada una elige otra estructura por dentro: arreglo, tabla hash, árbol o nodos.', 'Each one picks another structure inside: array, hash table, tree or nodes.'),
);
const hierMap = timed(
	say('`Map` queda afuera: guarda asociaciones clave → valor, no elementos sueltos.', '`Map` stays outside: it stores key → value associations, not loose elements.'),
	say('Por eso no extiende `Collection` y su interfaz es distinta.', 'That is why it does not extend `Collection` and has its own interface.'),
);

const genRaw = timed(
	say('Antes de Java 5 las colecciones guardaban `Object`: todo entraba y todo compilaba.', 'Before Java 5 collections stored `Object`: everything went in and everything compiled.'),
	say('Agregás un texto y un número a la misma lista: compila perfecto.', 'You add a text and a number to the same list: it compiles perfectly.'),
	say('El error llega recién al castear: ClassCastException, en ejecución y con usuarios.', 'The error only arrives at the cast: ClassCastException, at runtime and with users.'),
);
const genTyped = timed(
	say('Con genéricos la colección declara qué guarda: `List<String>`.', 'With generics the collection declares what it stores: `List<String>`.'),
	say('Agregar un número ni siquiera compila: el error aparece en tu IDE, antes de ejecutar.', 'Adding a number does not even compile: the error shows in your IDE, before running.'),
	say('Y al leer, el casteo desaparece: el compilador ya sabe que sale un String.', 'And when reading, the cast disappears: the compiler already knows a String comes out.'),
);
const genDiamond = timed(
	say('El `<>` vacío de la derecha se llama diamante.', 'The empty `<>` on the right is called the diamond.'),
	say('Le dice al compilador: el mismo tipo que declaré a la izquierda.', 'It tells the compiler: the same type I declared on the left.'),
	say('`new ArrayList<String>()` no está mal, solo es redundante.', '`new ArrayList<String>()` is not wrong, just redundant.'),
);

const lsetList = timed(
	say('`List` mantiene el orden de inserción y permite duplicados.', '`List` keeps insertion order and allows duplicates.'),
	say('`get(1)` accede por índice y `size()` cuenta todo, incluidos los repetidos.', '`get(1)` reads by index and `size()` counts everything, repeated ones included.'),
);
const lsetSet = timed(
	say('`Set` no permite duplicados: agregás `java`, `poo` y otra vez `java`.', '`Set` allows no duplicates: you add `java`, `poo` and `java` again.'),
	say('El tercer `java` ya estaba: `add` lo ignora y el tamaño queda en 2.', 'The third `java` was already there: `add` ignores it and the size stays 2.'),
);
const lsetImpls = timed(
	say('`HashSet` no garantiza orden; `LinkedHashSet` lo conserva; `TreeSet` mantiene todo ordenado.', '`HashSet` guarantees no order; `LinkedHashSet` keeps it; `TreeSet` keeps everything sorted.'),
	say('Cuidado: tus propias clases necesitan `equals()` y `hashCode()` para que el Set detecte duplicados.', 'Careful: your own classes need `equals()` and `hashCode()` for the Set to detect duplicates.'),
);

const llGet = timed(
	say('En un `ArrayList`, `get(6)` salta directo: una cuenta de dirección y listo.', 'In an `ArrayList`, `get(6)` jumps straight there: one address calculation and done.'),
	say('En una `LinkedList` hay que seguir los enlaces, nodo por nodo, hasta llegar al 6.', 'In a `LinkedList` you must follow the links, node by node, until you reach the 6th.'),
	say('Con 500 elementos serían 500 saltos: acceder por índice en una LinkedList es lento.', 'With 500 elements that is 500 hops: indexed access in a LinkedList is slow.'),
);
const llCache = timed(
	say('Los elementos de un `ArrayList` están pegados en memoria: la caché del CPU los trae juntos.', 'The elements of an `ArrayList` sit side by side in memory: the CPU cache loads them together.'),
	say('Los nodos de una `LinkedList` están dispersos por el Heap: más fallos de caché.', 'The nodes of a `LinkedList` are scattered across the Heap: more cache misses.'),
	say('Por eso en la práctica `LinkedList` casi siempre pierde: `ArrayList`, salvo que midas lo contrario.', 'That is why in practice `LinkedList` almost always loses: `ArrayList`, unless you measure otherwise.'),
);

const mapPut = timed(
	say('`put(clave, valor)` guarda una asociación: la clave apunta a su valor.', '`put(key, value)` stores an association: the key points to its value.'),
	say('Primero `yerba` → 12 y después `café` → 5: dos entradas.', 'First `yerba` → 12 and then `café` → 5: two entries.'),
	say('Si repetís una clave, `put` la sobrescribe: las claves son únicas.', 'If you repeat a key, `put` overwrites it: keys are unique.'),
);
const mapGet = timed(
	say('`get("yerba")` busca la clave y devuelve su valor: 20.', '`get("yerba")` looks up the key and returns its value: 20.'),
	say('`get("azúcar")` no encuentra la clave y devuelve `null`.', '`get("azúcar")` finds no such key and returns `null`.'),
);
const mapDefault = timed(
	say('Cuidado: ese `null` explota con NullPointerException si lo desempaquetás a `int`.', 'Careful: that `null` blows up with a NullPointerException if you unbox it to `int`.'),
	say('`getOrDefault("azúcar", 0)` devuelve 0 cuando la clave falta: mucho mejor.', '`getOrDefault("azúcar", 0)` returns 0 when the key is missing: much better.'),
);

const hashArray = timed(
	say('Por dentro, un `HashMap` es un arreglo de cajones llamados buckets.', 'Inside, a `HashMap` is an array of drawers called buckets.'),
	say('Con capacidad 16 hay 16 buckets: la clave decide en cuál vive cada par.', 'With capacity 16 there are 16 buckets: the key decides which one holds each pair.'),
);
const hashKey = timed(
	say('`hashCode()` convierte la clave en un entero: para "gato" da 3165397.', '`hashCode()` turns the key into an integer: for "gato" it gives 3165397.'),
	say('Se mezclan los bits y la máscara `& (n - 1)` da el bucket: el 5.', 'The bits are mixed and the `& (n - 1)` mask gives the bucket: number 5.'),
	say('El par se guarda en el bucket 5 sin recorrer nada: por eso `get` es O(1).', 'The pair is stored in bucket 5 without scanning anything: that is why `get` is O(1).'),
);
const hashCollision = timed(
	say('Ahora `mesa`: su hash también cae en el bucket 5, siendo otra clave.', 'Now `mesa`: its hash also lands in bucket 5, even though it is another key.'),
	say('Es una colisión: las dos claves quedan encadenadas en el mismo bucket.', 'That is a collision: both keys end up chained in the same bucket.'),
	say('Dentro del bucket, `equals()` compara la clave real y decide cuál es cuál.', 'Inside the bucket, `equals()` compares the real key and decides which is which.'),
);
const hashGet = timed(
	say('Con `get("mesa")` se repite la cuenta: el hash lleva directo al bucket 5.', 'With `get("mesa")` the calculation repeats: the hash leads straight to bucket 5.'),
	say('Ahí `equals()` descarta `gato` y confirma `mesa`, sin mirar los otros buckets.', 'There `equals()` rules out `gato` and confirms `mesa`, without checking other buckets.'),
	say('`hashCode()` elige el cajón; `equals()` elige el elemento dentro del cajón.', '`hashCode()` picks the drawer; `equals()` picks the element inside the drawer.'),
);
const hashBad = timed(
	say('Si `hashCode()` está mal hecho, la búsqueda cae en el bucket equivocado.', 'If `hashCode()` is badly written, the lookup lands in the wrong bucket.'),
	say('El mapa responde `null` aunque `mesa` esté guardado, y no lanza ninguna excepción.', 'The map answers `null` even though `mesa` is stored, and throws no exception.'),
	say('Es el motivo de la próxima lección: `equals()` y `hashCode()` deben ser coherentes.', 'That is the reason for the next lesson: `equals()` and `hashCode()` must agree.'),
);

const boxTemplate = timed(
	say('Una clase genérica declara un parámetro de tipo entre `<>`: `Caja<T>`.', 'A generic class declares a type parameter between `<>`: `Caja<T>`.'),
	say('`T` es un hueco: la clase funciona igual con cualquier tipo.', '`T` is a placeholder: the class works the same with any type.'),
);
const boxInstances = timed(
	say('Al usarla reemplazás `T` por un tipo concreto: `Caja<String>` o `Caja<Integer>`.', 'When you use it you replace `T` with a concrete type: `Caja<String>` or `Caja<Integer>`.'),
	say('Cada versión se comporta como si estuviera escrita para ese tipo.', 'Each version behaves as if it had been written for that type.'),
);
const boxSafe = timed(
	say('`guardar("hola")` entra sin problema y `sacar()` devuelve un `String`, sin casteo.', '`guardar("hola")` goes in fine and `sacar()` returns a `String`, with no cast.'),
	say('`guardar(42)` en una `Caja<String>` no compila: el compilador defiende el tipo.', '`guardar(42)` on a `Caja<String>` does not compile: the compiler defends the type.'),
	say('La misma clase como `Caja<Integer>` sí acepta el 42.', 'The same class as `Caja<Integer>` does accept the 42.'),
);

const boundGate = timed(
	say('`<T extends Comparable<T>>` acota el tipo: solo entran clases que se pueden comparar.', '`<T extends Comparable<T>>` bounds the type: only comparable classes get in.'),
	say('`Integer` y `String` implementan `Comparable` y pasan; una clase `Perro` sin `compareTo` no.', '`Integer` and `String` implement `Comparable` and pass; a `Perro` class without `compareTo` does not.'),
	say('Así podés llamar a `compareTo` dentro del método con total seguridad.', 'That way you can call `compareTo` inside the method with total safety.'),
);
const boundLoop = timed(
	say('El método recorre la lista y compara cada elemento con el mayor encontrado hasta ahora.', 'The method walks the list and compares each element with the largest found so far.'),
	say('Cada vez que `compareTo` da positivo, el elemento nuevo pasa a ser el mayor.', 'Each time `compareTo` is positive, the new element becomes the largest.'),
	say('Al terminar devuelve 12 y no hizo falta ningún casteo.', 'At the end it returns 12 and no cast was needed.'),
);

const eraseCompile = timed(
	say('Los genéricos existen solo en tiempo de compilación: la JVM no sabe nada de ellos.', 'Generics exist only at compile time: the JVM knows nothing about them.'),
	say('Es el borrado de tipos: el compilador verifica los tipos y después los elimina.', 'It is type erasure: the compiler checks the types and then removes them.'),
);
const eraseSame = timed(
	say('En el bytecode, `List<String>` y `List<Integer>` son la misma cosa: `List`.', 'In the bytecode, `List<String>` and `List<Integer>` are the same thing: `List`.'),
	say('Por eso `a.getClass() == b.getClass()` da `true`: es la misma clase en ejecución.', 'That is why `a.getClass() == b.getClass()` is `true`: it is the same class at runtime.'),
);
const eraseLimit = timed(
	say('De ahí nacen las limitaciones: `new T[10]` no se puede, en ejecución no se sabe qué es `T`.', 'That is where the limits come from: `new T[10]` is not allowed, at runtime `T` is unknown.'),
	say('Los genéricos no aceleran nada: adelantan el error al momento de escribir la línea.', 'Generics speed up nothing: they bring the error forward to the moment you write the line.'),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'intro', label: { es: 'Introducción', en: 'Introduction' } },
		{ id: 'jcf', label: { es: '1. La jerarquía del JCF', en: '1. The JCF hierarchy' } },
		{ id: 'generics', label: { es: '2. Por qué existen los genéricos', en: '2. Why generics exist' } },
		{ id: 'families', label: { es: '3. Las cuatro familias', en: '3. The four families' } },
		{ id: 'hashmap', label: { es: '4. HashMap por dentro', en: '4. Inside a HashMap' } },
		{ id: 'own', label: { es: '5. Tus propios genéricos', en: '5. Your own generics' } },
		{ id: 'choose', label: { es: '6. Cuál elegir', en: '6. Which one to pick' } },
		{ id: 'errors', label: { es: '7. Errores frecuentes', en: '7. Common mistakes' } },
		{ id: 'exercise', label: { es: '8. Ejercicio guiado', en: '8. Guided exercise' } },
		{ id: 'closing', label: { es: 'Para llevarte', en: 'Takeaways' } },
	],
	steps: [
		// ─── Intro ──────────────────────────────────────────────────────────
		{
			id: 'intro-why',
			chapter: 'intro',
			scene: 'intro15',
			show: ['in-hand', 'in-lib'],
			focus: ['in-lib'],
			title: { es: 'Java ya lo trae todo', en: 'Java already ships it all' },
			subtitles: [
				say('Más adelante vas a implementar listas, pilas y colas a mano para entender cómo funcionan.', 'Later you will build lists, stacks and queues by hand to understand how they work.'),
				say('Pero en el día a día no hace falta: Java lo trae todo, optimizado durante treinta años.', 'But day to day you do not need to: Java ships it all, tuned over thirty years.'),
			],
		},
		{
			id: 'intro-know',
			chapter: 'intro',
			scene: 'intro15',
			show: '*',
			focus: ['in-know'],
			title: { es: 'Usar una herramienta o entenderla', en: 'Using a tool or understanding it' },
			subtitles: [
				say('Cuando alguien diga "usá un `HashMap`", vas a saber que hay un arreglo y colisiones.', 'When someone says "use a `HashMap`", you will know there is an array and collisions.'),
				say('Esa es la diferencia entre usar una herramienta y entenderla.', 'That is the difference between using a tool and understanding it.'),
			],
		},

		// ─── 1. The JCF hierarchy (motion) ──────────────────────────────────
		{
			id: 'hier-root',
			chapter: 'jcf',
			scene: 'hier',
			title: { es: 'Interfaces en la raíz', en: 'Interfaces at the root' },
			subtitles: hierRoot.list,
			motion: {
				cues: [
					{ at: 0, do: 'enter', el: 'hi-iterable' },
					{ at: 700, do: 'draw', el: 'hi-a1', dur: 800 },
					{ at: 1500, do: 'enter', el: 'hi-collection' },
					{ at: hierRoot.start(1) + 300, do: 'pulse', el: 'hi-iterable' },
					{ at: hierRoot.start(1) + 1100, do: 'pulse', el: 'hi-collection' },
				],
			},
		},
		{
			id: 'hier-families',
			chapter: 'jcf',
			scene: 'hier',
			title: { es: 'List, Set y Queue', en: 'List, Set and Queue' },
			subtitles: hierFamilies.list,
			motion: {
				cues: [
					{ at: 0, do: 'draw', el: 'hi-a-list', dur: 800 },
					{ at: 600, do: 'enter', el: 'hi-list' },
					{ at: 1200, do: 'draw', el: 'hi-a-set', dur: 800 },
					{ at: 1800, do: 'enter', el: 'hi-set' },
					{ at: 2400, do: 'draw', el: 'hi-a-queue', dur: 800 },
					{ at: 3000, do: 'enter', el: 'hi-queue' },
					{ at: hierFamilies.start(1) + 200, do: 'pulse', el: 'hi-list' },
					{ at: hierFamilies.start(1) + 500, do: 'pulse', el: 'hi-set' },
					{ at: hierFamilies.start(1) + 800, do: 'pulse', el: 'hi-queue' },
				],
			},
		},
		{
			id: 'hier-impls',
			chapter: 'jcf',
			scene: 'hier',
			title: { es: 'Las implementaciones', en: 'The implementations' },
			subtitles: hierImpls.list,
			motion: {
				cues: [
					{ at: 0, do: 'enter', el: 'hi-arraylist' },
					{ at: 500, do: 'enter', el: 'hi-linkedlist' },
					{ at: 1000, do: 'enter', el: 'hi-hashset' },
					{ at: 1500, do: 'enter', el: 'hi-treeset' },
					{ at: 2000, do: 'enter', el: 'hi-arraydeque' },
					{ at: 2500, do: 'enter', el: 'hi-pq' },
					{ at: hierImpls.start(1) + 200, do: 'pulse', el: 'hi-arraylist' },
					{ at: hierImpls.start(1) + 700, do: 'pulse', el: 'hi-hashset' },
					{ at: hierImpls.start(1) + 1200, do: 'pulse', el: 'hi-arraydeque' },
				],
			},
		},
		{
			id: 'hier-map',
			chapter: 'jcf',
			scene: 'hier',
			title: { es: 'Map queda afuera', en: 'Map stays outside' },
			subtitles: hierMap.list,
			motion: {
				cues: [
					{ at: 0, do: 'camera', to: ['hi-map', 'hi-no', 'hi-hashmap', 'hi-treemap'], dur: 1400 },
					{ at: 400, do: 'enter', el: 'hi-map' },
					{ at: 1200, do: 'enter', el: 'hi-no' },
					{ at: 2000, do: 'pulse', el: 'hi-no' },
					{ at: 2400, do: 'enter', el: 'hi-hashmap' },
					{ at: 2900, do: 'enter', el: 'hi-treemap' },
					{ at: hierMap.start(1), do: 'camera', to: 'all', dur: 1400 },
					{ at: hierMap.start(1) + 1000, do: 'enter', el: 'hi-note' },
				],
			},
		},

		// ─── Program against interfaces (slide) ─────────────────────────────
		{
			id: 'iface-good',
			chapter: 'jcf',
			scene: 'iface',
			show: ['if-good', 'if-swap'],
			focus: ['if-good', 'if-swap'],
			code: code(
				'Declaraciones.java',
				`// Bien: el tipo de la variable es la interfaz
List<String> nombres = new ArrayList<>();
Map<String, Integer> stock = new HashMap<>();`,
				`// Good: the variable's type is the interface
List<String> nombres = new ArrayList<>();
Map<String, Integer> stock = new HashMap<>();`,
			),
			title: { es: 'Declará con la interfaz', en: 'Declare with the interface' },
			subtitles: [
				say('La regla concreta: el tipo de la variable es la interfaz, no la implementación.', 'The concrete rule: the variable’s type is the interface, not the implementation.'),
				say('Cambiar a `LinkedList` es tocar una sola palabra.', 'Switching to `LinkedList` means touching a single word.'),
			],
		},
		{
			id: 'iface-bad',
			chapter: 'jcf',
			scene: 'iface',
			show: '*',
			focus: ['if-bad'],
			code: code(
				'Atado.java',
				`// Mal: te atás a la implementación
ArrayList<String> nombres = new ArrayList<>();`,
				`// Bad: you tie yourself to the implementation
ArrayList<String> nombres = new ArrayList<>();`,
			),
			title: { es: 'Atarse a la implementación', en: 'Tying yourself to the implementation' },
			subtitles: [
				say('Si declarás `ArrayList`, quien use un método propio de `ArrayList` te obliga a tocar todo.', 'If you declare `ArrayList`, anyone using an `ArrayList`-only method forces you to change it all.'),
				say('Es el mismo principio del TAD: programar contra el contrato, no contra el detalle.', 'It is the same principle as the ADT: program against the contract, not the detail.'),
			],
		},

		// ─── 2. Generics (motion) ───────────────────────────────────────────
		{
			id: 'gen-raw',
			chapter: 'generics',
			scene: 'gen',
			title: { es: 'Sin genéricos: guardan Object', en: 'Without generics: they store Object' },
			subtitles: genRaw.list,
			motion: {
				cues: [
					{ at: 0, do: 'type', el: 'gr-decl', dur: 1400 },
					{ at: 800, do: 'enter', el: 'gr-list' },
					{ at: genRaw.start(1), do: 'type', el: 'gr-add1', dur: 700 },
					{ at: genRaw.start(1) + 400, do: 'enter', el: 'gr-hola' },
					{ at: genRaw.start(1) + 1000, do: 'move', el: 'gr-hola', to: 'gr-s0', dur: 1200 },
					{ at: genRaw.start(1) + 2400, do: 'type', el: 'gr-add2', dur: 700 },
					{ at: genRaw.start(1) + 2800, do: 'enter', el: 'gr-42' },
					{ at: genRaw.start(1) + 3400, do: 'move', el: 'gr-42', to: 'gr-s1', dur: 1200 },
					{ at: genRaw.start(1) + 4300, do: 'enter', el: 'gr-ok' },
					{ at: genRaw.start(2), do: 'type', el: 'gr-cast', dur: 1400 },
					{ at: genRaw.start(2) + 1600, do: 'pulse', el: 'gr-42' },
					{ at: genRaw.start(2) + 2300, do: 'enter', el: 'gr-boom' },
					{ at: genRaw.start(2) + 3100, do: 'pulse', el: 'gr-boom' },
				],
			},
		},
		{
			id: 'gen-typed',
			chapter: 'generics',
			scene: 'gen',
			title: { es: 'Con genéricos: el error llega antes', en: 'With generics: the error comes earlier' },
			subtitles: genTyped.list,
			motion: {
				cues: [
					{ at: 0, do: 'type', el: 'gt-decl', dur: 1500 },
					{ at: 900, do: 'enter', el: 'gt-list' },
					{ at: 1400, do: 'enter', el: 'gt-gate' },
					{ at: 2000, do: 'type', el: 'gt-add1', dur: 700 },
					{ at: 2400, do: 'enter', el: 'gt-hola' },
					{ at: 2900, do: 'move', el: 'gt-hola', to: 'gt-s0', dur: 1400 },
					{ at: 3500, do: 'pulse', el: 'gt-gate' },
					{ at: genTyped.start(1), do: 'type', el: 'gt-add2', dur: 700 },
					{ at: genTyped.start(1) + 400, do: 'enter', el: 'gt-42' },
					{ at: genTyped.start(1) + 1000, do: 'move', el: 'gt-42', to: 'gt-gate', dx: 70, dur: 1000 },
					{ at: genTyped.start(1) + 2000, do: 'enter', el: 'gt-x' },
					{ at: genTyped.start(1) + 2000, do: 'pulse', el: 'gt-gate' },
					{ at: genTyped.start(1) + 2700, do: 'move', el: 'gt-42', to: 'gt-home', dur: 800 },
					{ at: genTyped.start(1) + 3600, do: 'exit', el: 'gt-42' },
					{ at: genTyped.start(1) + 3600, do: 'exit', el: 'gt-x' },
					{ at: genTyped.start(1) + 3800, do: 'enter', el: 'gt-err' },
					{ at: genTyped.start(2), do: 'type', el: 'gt-get', dur: 1500 },
					{ at: genTyped.start(2) + 1700, do: 'pulse', el: 'gt-hola' },
				],
			},
		},
		{
			id: 'gen-diamond',
			chapter: 'generics',
			scene: 'gen',
			title: { es: 'El diamante <>', en: 'The diamond <>' },
			subtitles: genDiamond.list,
			motion: {
				cues: [
					{ at: 0, do: 'camera', to: ['gt-decl', 'gt-dia'], dur: 1200 },
					{ at: 500, do: 'pulse', el: 'gt-decl' },
					{ at: 1000, do: 'enter', el: 'gt-dia' },
					{ at: genDiamond.start(1) + 200, do: 'pulse', el: 'gt-dia' },
					{ at: genDiamond.start(2), do: 'camera', to: 'all', dur: 1200 },
				],
			},
		},

		// ─── 3. The four families (motion + slides) ─────────────────────────
		{
			id: 'lset-list',
			chapter: 'families',
			scene: 'lset',
			title: { es: 'List: orden y duplicados', en: 'List: order and duplicates' },
			subtitles: lsetList.list,
			motion: {
				cues: [
					{ at: 0, do: 'type', el: 'la-decl', dur: 1500 },
					{ at: 700, do: 'enter', el: 'la-box' },
					{ at: 1300, do: 'enter', el: 'la-t1' },
					{ at: 1700, do: 'move', el: 'la-t1', to: 'la-s0', dur: 900 },
					{ at: 2400, do: 'enter', el: 'la-t2' },
					{ at: 2800, do: 'move', el: 'la-t2', to: 'la-s1', dur: 900 },
					{ at: 3500, do: 'enter', el: 'la-t3' },
					{ at: 3900, do: 'move', el: 'la-t3', to: 'la-s2', dur: 900 },
					{ at: 4800, do: 'enter', el: 'la-dup' },
					{ at: 5000, do: 'pulse', el: 'la-t1' },
					{ at: 5000, do: 'pulse', el: 'la-t3' },
					{ at: lsetList.start(1) + 400, do: 'type', el: 'la-get', dur: 1400 },
					{ at: lsetList.start(1) + 1900, do: 'pulse', el: 'la-t2' },
					{ at: lsetList.start(1) + 2800, do: 'type', el: 'la-size', dur: 1000 },
					{ at: lsetList.start(1) + 3900, do: 'pulse', el: 'la-box' },
				],
			},
		},
		{
			id: 'lset-set',
			chapter: 'families',
			scene: 'lset',
			title: { es: 'Set: sin duplicados', en: 'Set: no duplicates' },
			subtitles: lsetSet.list,
			motion: {
				cues: [
					{ at: 0, do: 'type', el: 'sb-decl', dur: 1500 },
					{ at: 700, do: 'enter', el: 'sb-box' },
					{ at: 1300, do: 'enter', el: 'sb-t1' },
					{ at: 1700, do: 'move', el: 'sb-t1', to: 'sb-s0', dur: 900 },
					{ at: 2400, do: 'enter', el: 'sb-t2' },
					{ at: 2800, do: 'move', el: 'sb-t2', to: 'sb-s1', dur: 900 },
					{ at: 3500, do: 'enter', el: 'sb-t3' },
					{ at: lsetSet.start(1), do: 'move', el: 'sb-t3', to: 'sb-s0', dy: 78, dur: 1200 },
					{ at: lsetSet.start(1) + 1300, do: 'enter', el: 'sb-x' },
					{ at: lsetSet.start(1) + 1500, do: 'pulse', el: 'sb-t1' },
					{ at: lsetSet.start(1) + 2300, do: 'move', el: 'sb-t3', to: 'sb-home', dur: 900 },
					{ at: lsetSet.start(1) + 3200, do: 'exit', el: 'sb-t3' },
					{ at: lsetSet.start(1) + 3200, do: 'exit', el: 'sb-x' },
					{ at: lsetSet.start(1) + 3500, do: 'type', el: 'sb-size', dur: 1000 },
				],
			},
		},
		{
			id: 'lset-impls',
			chapter: 'families',
			scene: 'lset',
			title: { es: 'HashSet, LinkedHashSet y TreeSet', en: 'HashSet, LinkedHashSet and TreeSet' },
			subtitles: lsetImpls.list,
			motion: {
				cues: [
					{ at: 0, do: 'enter', el: 'sb-i1' },
					{ at: 800, do: 'enter', el: 'sb-i2' },
					{ at: 1600, do: 'enter', el: 'sb-i3' },
					{ at: lsetImpls.start(1), do: 'enter', el: 'sb-warn' },
					{ at: lsetImpls.start(1) + 900, do: 'pulse', el: 'sb-warn' },
					{ at: lsetImpls.start(1) + 1600, do: 'pulse', el: 'sb-box' },
				],
			},
		},
		{
			id: 'll-get',
			chapter: 'families',
			scene: 'll',
			title: { es: 'ArrayList contra LinkedList: acceder', en: 'ArrayList against LinkedList: access' },
			subtitles: llGet.list,
			motion: {
				cues: [
					{ at: 0, do: 'enter', el: 'll-al-t' },
					{ at: 300, do: 'enter', el: 'll-al-cells' },
					{ at: 900, do: 'enter', el: 'll-ap' },
					{ at: 1500, do: 'move', el: 'll-ap', to: 'll-c-6', dy: -70, dur: 1200 },
					{ at: 2800, do: 'enter', el: 'll-hit-a' },
					{ at: 3000, do: 'enter', el: 'll-cost-a' },
					{ at: llGet.start(1), do: 'enter', el: 'll-l-t' },
					{ at: llGet.start(1) + 300, do: 'enter', el: 'll-nodes' },
					{ at: llGet.start(1) + 900, do: 'draw', el: 'll-links', dur: 900 },
					{ at: llGet.start(1) + 1900, do: 'enter', el: 'll-lp' },
					{ at: llGet.start(1) + 2500, do: 'move', el: 'll-lp', to: 'll-n-1', dy: -70, dur: 400 },
					{ at: llGet.start(1) + 2950, do: 'move', el: 'll-lp', to: 'll-n-2', dy: -70, dur: 400 },
					{ at: llGet.start(1) + 3400, do: 'move', el: 'll-lp', to: 'll-n-3', dy: -70, dur: 400 },
					{ at: llGet.start(1) + 3850, do: 'move', el: 'll-lp', to: 'll-n-4', dy: -70, dur: 400 },
					{ at: llGet.start(1) + 4300, do: 'move', el: 'll-lp', to: 'll-n-5', dy: -70, dur: 400 },
					{ at: llGet.start(1) + 4750, do: 'move', el: 'll-lp', to: 'll-n-6', dy: -70, dur: 400 },
					{ at: llGet.start(1) + 5250, do: 'enter', el: 'll-hit-l' },
					{ at: llGet.start(1) + 5400, do: 'enter', el: 'll-cost-l' },
					{ at: llGet.start(2) + 200, do: 'enter', el: 'll-500' },
					{ at: llGet.start(2) + 1000, do: 'pulse', el: 'll-cost-l' },
				],
			},
		},
		{
			id: 'll-cache',
			chapter: 'families',
			scene: 'll',
			title: { es: 'Por qué LinkedList casi siempre pierde', en: 'Why LinkedList almost always loses' },
			subtitles: llCache.list,
			motion: {
				cues: [
					{ at: 0, do: 'enter', el: 'll-cache' },
					{ at: 700, do: 'enter', el: 'll-cache-a' },
					{ at: llCache.start(1), do: 'enter', el: 'll-scatter' },
					{ at: llCache.start(1) + 800, do: 'pulse', el: 'll-nodes' },
					{ at: llCache.start(2), do: 'pulse', el: 'll-cache' },
					{ at: llCache.start(2) + 700, do: 'pulse', el: 'll-cache-a' },
				],
			},
		},
		{
			id: 'map-put',
			chapter: 'families',
			scene: 'map',
			title: { es: 'Map: asociar una clave a un valor', en: 'Map: tie a key to a value' },
			subtitles: mapPut.list,
			motion: {
				cues: [
					{ at: 0, do: 'enter', el: 'mp-table' },
					{ at: 900, do: 'type', el: 'mp-put1', dur: 1100 },
					{ at: 2200, do: 'enter', el: 'mp-row0' },
					{ at: 2500, do: 'enter', el: 'mp-v0a' },
					{ at: mapPut.start(1), do: 'exit', el: 'mp-put1' },
					{ at: mapPut.start(1) + 100, do: 'type', el: 'mp-put2', dur: 1000 },
					{ at: mapPut.start(1) + 1300, do: 'enter', el: 'mp-row1' },
					{ at: mapPut.start(2), do: 'exit', el: 'mp-put2' },
					{ at: mapPut.start(2) + 100, do: 'type', el: 'mp-put3', dur: 1100 },
					{ at: mapPut.start(2) + 1500, do: 'exit', el: 'mp-v0a' },
					{ at: mapPut.start(2) + 1500, do: 'enter', el: 'mp-v0b' },
					{ at: mapPut.start(2) + 1900, do: 'pulse', el: 'mp-row0' },
				],
			},
		},
		{
			id: 'map-get',
			chapter: 'families',
			scene: 'map',
			title: { es: 'get: buscar por clave', en: 'get: look up by key' },
			subtitles: mapGet.list,
			motion: {
				cues: [
					{ at: 0, do: 'exit', el: 'mp-put3' },
					{ at: 150, do: 'type', el: 'mp-get1', dur: 1000 },
					{ at: 1200, do: 'enter', el: 'mp-ptr' },
					{ at: 1800, do: 'move', el: 'mp-ptr', to: 'mp-a0', dur: 900 },
					{ at: 2800, do: 'pulse', el: 'mp-row0' },
					{ at: 3000, do: 'enter', el: 'mp-res' },
					{ at: 3200, do: 'draw', el: 'mp-a-res', dur: 700 },
					{ at: 3800, do: 'enter', el: 'mp-res20' },
					{ at: mapGet.start(1), do: 'exit', el: 'mp-get1' },
					{ at: mapGet.start(1), do: 'exit', el: 'mp-res20' },
					{ at: mapGet.start(1) + 150, do: 'type', el: 'mp-get2', dur: 1100 },
					{ at: mapGet.start(1) + 800, do: 'move', el: 'mp-ptr', to: 'mp-a1', dur: 700 },
					{ at: mapGet.start(1) + 1600, do: 'move', el: 'mp-ptr', to: 'mp-a2', dur: 700 },
					{ at: mapGet.start(1) + 2500, do: 'enter', el: 'mp-resnull' },
					{ at: mapGet.start(1) + 2800, do: 'pulse', el: 'mp-res' },
				],
			},
		},
		{
			id: 'map-default',
			chapter: 'families',
			scene: 'map',
			title: { es: 'getOrDefault evita el null', en: 'getOrDefault avoids null' },
			subtitles: mapDefault.list,
			motion: {
				cues: [
					{ at: 0, do: 'pulse', el: 'mp-resnull' },
					{ at: 600, do: 'enter', el: 'mp-npe' },
					{ at: 1500, do: 'pulse', el: 'mp-npe' },
					{ at: mapDefault.start(1), do: 'exit', el: 'mp-get2' },
					{ at: mapDefault.start(1), do: 'exit', el: 'mp-npe' },
					{ at: mapDefault.start(1) + 150, do: 'type', el: 'mp-get3', dur: 1400 },
					{ at: mapDefault.start(1) + 1700, do: 'exit', el: 'mp-resnull' },
					{ at: mapDefault.start(1) + 1900, do: 'enter', el: 'mp-res0' },
					{ at: mapDefault.start(1) + 2500, do: 'pulse', el: 'mp-res0' },
				],
			},
		},
		{
			id: 'mapapi-iter',
			chapter: 'families',
			scene: 'mapapi',
			show: ['mapi-entry'],
			focus: ['mapi-entry'],
			code: code(
				'Recorrer.java',
				`Map<String, Integer> stock = new HashMap<>();
stock.put("yerba", 12);
stock.put("café", 5);
stock.put("yerba", 20);   // sobrescribe

for (Map.Entry<String, Integer> entrada : stock.entrySet()) {
    System.out.println(entrada.getKey() + " → " + entrada.getValue());
}`,
				`Map<String, Integer> stock = new HashMap<>();
stock.put("yerba", 12);
stock.put("café", 5);
stock.put("yerba", 20);   // overwrites

for (Map.Entry<String, Integer> entrada : stock.entrySet()) {
    System.out.println(entrada.getKey() + " → " + entrada.getValue());
}`,
			),
			title: { es: 'Recorrer un Map', en: 'Walking a Map' },
			subtitles: [
				say('Un `Map` se recorre con `entrySet()`: cada entrada trae su clave y su valor.', 'A `Map` is walked with `entrySet()`: each entry carries its key and its value.'),
				say('Es la colección más usada de todas, y la que más se subutiliza.', 'It is the most used collection of all, and the most underused.'),
			],
		},
		{
			id: 'mapapi-merge',
			chapter: 'families',
			scene: 'mapapi',
			show: ['mapi-entry', 'mapi-merge', 'mapi-gd', 'mapi-pia'],
			focus: ['mapi-merge', 'mapi-pia'],
			code: code(
				'Contar.java',
				`// En lugar de: contador.put(p, contador.containsKey(p) ? contador.get(p) + 1 : 1);
contador.merge(palabra, 1, Integer::sum);

// En lugar de: if (mapa.get(k) == null) mapa.put(k, v);
mapa.putIfAbsent(clave, valor);`,
				`// Instead of: contador.put(p, contador.containsKey(p) ? contador.get(p) + 1 : 1);
contador.merge(palabra, 1, Integer::sum);

// Instead of: if (mapa.get(k) == null) mapa.put(k, v);
mapa.putIfAbsent(clave, valor);`,
			),
			title: { es: 'merge y putIfAbsent', en: 'merge and putIfAbsent' },
			subtitles: [
				say('Los métodos modernos eliminan casi todos los `if` que se escribían a mano.', 'The modern methods remove almost every `if` that used to be written by hand.'),
				say('`merge` cuenta frecuencias en una línea y `putIfAbsent` guarda solo si la clave falta.', '`merge` counts frequencies in one line and `putIfAbsent` stores only if the key is missing.'),
			],
		},
		{
			id: 'mapapi-cia',
			chapter: 'families',
			scene: 'mapapi',
			show: '*',
			focus: ['mapi-cia'],
			code: code(
				'Agrupar.java',
				`// En lugar de: if (!mapa.containsKey(k)) mapa.put(k, new ArrayList<>());
mapa.computeIfAbsent(clave, k -> new ArrayList<>()).add(valor);`,
				`// Instead of: if (!mapa.containsKey(k)) mapa.put(k, new ArrayList<>());
mapa.computeIfAbsent(clave, k -> new ArrayList<>()).add(valor);`,
			),
			title: { es: 'computeIfAbsent arma mapas de listas', en: 'computeIfAbsent builds maps of lists' },
			subtitles: [
				say('`computeIfAbsent` crea la lista solo la primera vez que aparece la clave.', '`computeIfAbsent` creates the list only the first time the key appears.'),
				say('Es el patrón para agrupar valores bajo una clave sin chequear nada a mano.', 'It is the pattern for grouping values under a key without checking anything by hand.'),
			],
		},
		{
			id: 'queue-deque',
			chapter: 'families',
			scene: 'queue',
			show: '*',
			focus: ['qu-deque', 'qu-pq'],
			code: code(
				'Colas.java',
				`Deque<String> pila = new ArrayDeque<>();
pila.push("a");
pila.push("b");
System.out.println(pila.pop());   // b

Queue<Integer> prioridad = new PriorityQueue<>();`,
			),
			title: { es: 'Queue y Deque', en: 'Queue and Deque' },
			subtitles: [
				say('`ArrayDeque` sirve como pila y como cola; `PriorityQueue` saca primero al de mayor prioridad.', '`ArrayDeque` works as a stack and as a queue; `PriorityQueue` serves the highest priority first.'),
				say('Los vas a implementar a mano más adelante, pero ya podés usarlos hoy.', 'You will implement them by hand later, but you can already use them today.'),
			],
		},

		// ─── 4. HashMap inside (motion) ─────────────────────────────────────
		{
			id: 'hash-array',
			chapter: 'hashmap',
			scene: 'hash',
			title: { es: 'Un arreglo de buckets', en: 'An array of buckets' },
			subtitles: hashArray.list,
			motion: {
				cues: [
					{ at: 300, do: 'enter', el: 'ha-buckets' },
					{ at: 1200, do: 'type', el: 'ha-cap', dur: 1200 },
					{ at: hashArray.start(1) + 300, do: 'pulse', el: 'ha-buckets' },
				],
			},
		},
		{
			id: 'hash-key',
			chapter: 'hashmap',
			scene: 'hash',
			title: { es: 'De la clave al bucket', en: 'From key to bucket' },
			subtitles: hashKey.list,
			motion: {
				cues: [
					{ at: 200, do: 'enter', el: 'ha-gato' },
					{ at: 900, do: 'draw', el: 'ha-a1', dur: 700 },
					{ at: 1400, do: 'enter', el: 'ha-hc' },
					{ at: 1900, do: 'type', el: 'ha-hc1', dur: 1200 },
					{ at: hashKey.start(1), do: 'camera', to: ['ha-hc', 'ha-mix'], dur: 1200 },
					{ at: hashKey.start(1) + 800, do: 'draw', el: 'ha-a2', dur: 700 },
					{ at: hashKey.start(1) + 1300, do: 'enter', el: 'ha-mix' },
					{ at: hashKey.start(1) + 1900, do: 'type', el: 'ha-mixt', dur: 1500 },
					{ at: hashKey.start(1) + 3500, do: 'enter', el: 'ha-mixnote' },
					{ at: hashKey.start(2), do: 'camera', to: 'all', dur: 1000 },
					{ at: hashKey.start(2) + 300, do: 'draw', el: 'ha-a3', dur: 900 },
					{ at: hashKey.start(2) + 1200, do: 'enter', el: 'ha-b5' },
					{ at: hashKey.start(2) + 1600, do: 'move', el: 'ha-gato', to: 'ha-n1', dur: 1500 },
					{ at: hashKey.start(2) + 3000, do: 'draw', el: 'ha-c1', dur: 500 },
					{ at: hashKey.start(2) + 3300, do: 'pulse', el: 'ha-b5' },
				],
			},
		},
		{
			id: 'hash-collision',
			chapter: 'hashmap',
			scene: 'hash',
			title: { es: 'Una colisión', en: 'A collision' },
			subtitles: hashCollision.list,
			motion: {
				cues: [
					{ at: 0, do: 'exit', el: 'ha-hc1' },
					{ at: 200, do: 'enter', el: 'ha-mesa' },
					{ at: 700, do: 'enter', el: 'ha-hc2' },
					{ at: 1800, do: 'pulse', el: 'ha-mixt' },
					{ at: 2300, do: 'move', el: 'ha-mesa', to: 'ha-n2', dur: 1500 },
					{ at: 3500, do: 'draw', el: 'ha-c2', dur: 500 },
					{ at: 3600, do: 'pulse', el: 'ha-b5' },
					{ at: hashCollision.start(1) + 100, do: 'enter', el: 'ha-coll' },
					{ at: hashCollision.start(1) + 800, do: 'pulse', el: 'ha-gato' },
					{ at: hashCollision.start(1) + 1100, do: 'pulse', el: 'ha-mesa' },
					{ at: hashCollision.start(2) + 100, do: 'enter', el: 'ha-eq' },
					{ at: hashCollision.start(2) + 900, do: 'pulse', el: 'ha-eq' },
				],
			},
		},
		{
			id: 'hash-get',
			chapter: 'hashmap',
			scene: 'hash',
			title: { es: 'Buscar con get', en: 'Looking up with get' },
			subtitles: hashGet.list,
			motion: {
				cues: [
					{ at: 0, do: 'exit', el: 'ha-coll' },
					{ at: 0, do: 'exit', el: 'ha-eq' },
					{ at: 300, do: 'enter', el: 'ha-ptr' },
					{ at: 800, do: 'move', el: 'ha-ptr', to: 'ha-bk5', dur: 1100 },
					{ at: 2000, do: 'pulse', el: 'ha-b5' },
					{ at: hashGet.start(1), do: 'move', el: 'ha-ptr', to: 'ha-n1', dx: 90, dur: 800 },
					{ at: hashGet.start(1) + 900, do: 'enter', el: 'ha-no' },
					{ at: hashGet.start(1) + 1900, do: 'move', el: 'ha-ptr', to: 'ha-n2', dx: 90, dur: 800 },
					{ at: hashGet.start(1) + 2800, do: 'enter', el: 'ha-ok' },
					{ at: hashGet.start(1) + 3000, do: 'pulse', el: 'ha-mesa' },
					{ at: hashGet.start(2), do: 'pulse', el: 'ha-hc' },
					{ at: hashGet.start(2) + 600, do: 'pulse', el: 'ha-b5' },
					{ at: hashGet.start(2) + 1200, do: 'pulse', el: 'ha-ok' },
				],
			},
		},
		{
			id: 'hash-bad',
			chapter: 'hashmap',
			scene: 'hash',
			title: { es: 'Un hashCode mal hecho', en: 'A broken hashCode' },
			subtitles: hashBad.list,
			motion: {
				cues: [
					{ at: 0, do: 'exit', el: 'ha-ok' },
					{ at: 0, do: 'exit', el: 'ha-no' },
					{ at: 0, do: 'exit', el: 'ha-hc2' },
					{ at: 0, do: 'exit', el: 'ha-mixt' },
					{ at: 400, do: 'enter', el: 'ha-hc3' },
					{ at: 700, do: 'enter', el: 'ha-mix3' },
					{ at: 1500, do: 'move', el: 'ha-ptr', to: 'ha-bk9', dur: 1400 },
					{ at: 2900, do: 'enter', el: 'ha-b9' },
					{ at: hashBad.start(1) + 100, do: 'enter', el: 'ha-lost' },
					{ at: hashBad.start(1) + 900, do: 'pulse', el: 'ha-lost' },
					{ at: hashBad.start(1) + 1500, do: 'pulse', el: 'ha-mesa' },
					{ at: hashBad.start(2) + 200, do: 'pulse', el: 'ha-hc3' },
				],
			},
		},

		// ─── 5. Your own generics ───────────────────────────────────────────
		{
			id: 'gcode-class',
			chapter: 'own',
			scene: 'gcode',
			show: ['gc-class'],
			focus: ['gc-class'],
			code: code(
				'Caja.java',
				`public class Caja<T> {
    private T contenido;

    public void guardar(T contenido) { this.contenido = contenido; }
    public T sacar() { return contenido; }
}

Caja<String> cajaTexto = new Caja<>();
cajaTexto.guardar("hola");
String s = cajaTexto.sacar();   // sin casteo`,
				`public class Caja<T> {
    private T contenido;

    public void guardar(T contenido) { this.contenido = contenido; }
    public T sacar() { return contenido; }
}

Caja<String> cajaTexto = new Caja<>();
cajaTexto.guardar("hola");
String s = cajaTexto.sacar();   // no cast`,
			),
			title: { es: 'Una clase genérica', en: 'A generic class' },
			subtitles: [
				say('No son solo para usar: también podés escribir tus propios genéricos.', 'They are not only for using: you can also write your own generics.'),
				say('Una clase genérica declara sus parámetros de tipo entre `<>`, como `Caja<T>`.', 'A generic class declares its type parameters between `<>`, like `Caja<T>`.'),
			],
		},
		{
			id: 'box-template',
			chapter: 'own',
			scene: 'box',
			title: { es: 'T es un hueco', en: 'T is a placeholder' },
			subtitles: boxTemplate.list,
			motion: {
				cues: [
					{ at: 0, do: 'enter', el: 'bx-tpl' },
					{ at: 700, do: 'enter', el: 'bx-T' },
					{ at: boxTemplate.start(1) + 200, do: 'pulse', el: 'bx-T' },
					{ at: boxTemplate.start(1) + 900, do: 'pulse', el: 'bx-tpl' },
				],
			},
		},
		{
			id: 'box-instances',
			chapter: 'own',
			scene: 'box',
			title: { es: 'Reemplazar T por un tipo', en: 'Replacing T with a type' },
			subtitles: boxInstances.list,
			motion: {
				cues: [
					{ at: 0, do: 'enter', el: 'bx-swap' },
					{ at: 300, do: 'spin', el: 'bx-swap', dur: 1600 },
					{ at: 1200, do: 'enter', el: 'bx-str' },
					{ at: 1700, do: 'enter', el: 'bx-int' },
					{ at: boxInstances.start(1) + 100, do: 'type', el: 'bx-c1', dur: 1500 },
					{ at: boxInstances.start(1) + 1800, do: 'pulse', el: 'bx-str' },
					{ at: boxInstances.start(1) + 2100, do: 'pulse', el: 'bx-int' },
				],
			},
		},
		{
			id: 'box-safe',
			chapter: 'own',
			scene: 'box',
			title: { es: 'El tipo queda protegido', en: 'The type stays protected' },
			subtitles: boxSafe.list,
			motion: {
				cues: [
					{ at: 0, do: 'enter', el: 'bx-hola' },
					{ at: 300, do: 'type', el: 'bx-c2', dur: 1000 },
					{ at: 1400, do: 'move', el: 'bx-hola', to: 'bx-sA', dur: 1400 },
					{ at: 3000, do: 'type', el: 'bx-c3', dur: 1500 },
					{ at: 4400, do: 'enter', el: 'bx-nocast' },
					{ at: boxSafe.start(1), do: 'enter', el: 'bx-42' },
					{ at: boxSafe.start(1) + 200, do: 'type', el: 'bx-c4', dur: 1000 },
					{ at: boxSafe.start(1) + 1400, do: 'move', el: 'bx-42', to: 'bx-rej', dur: 1000 },
					{ at: boxSafe.start(1) + 2400, do: 'exit', el: 'bx-nocast' },
					{ at: boxSafe.start(1) + 2400, do: 'enter', el: 'bx-x' },
					{ at: boxSafe.start(1) + 2500, do: 'enter', el: 'bx-err' },
					{ at: boxSafe.start(1) + 3500, do: 'move', el: 'bx-42', to: 'bx-home42', dur: 800 },
					{ at: boxSafe.start(1) + 3500, do: 'exit', el: 'bx-x' },
					{ at: boxSafe.start(2), do: 'exit', el: 'bx-err' },
					{ at: boxSafe.start(2) + 300, do: 'move', el: 'bx-42', to: 'bx-sB', dur: 1400 },
					{ at: boxSafe.start(2) + 1900, do: 'pulse', el: 'bx-int' },
				],
			},
		},
		{
			id: 'gcode-method',
			chapter: 'own',
			scene: 'gcode',
			show: ['gc-class', 'gc-method'],
			focus: ['gc-method'],
			code: code(
				'Primero.java',
				`public static <T> T primero(List<T> lista) {
    if (lista.isEmpty()) throw new NoSuchElementException("Lista vacía");
    return lista.get(0);
}`,
				`public static <T> T primero(List<T> lista) {
    if (lista.isEmpty()) throw new NoSuchElementException("Empty list");
    return lista.get(0);
}`,
			),
			title: { es: 'Un método genérico', en: 'A generic method' },
			subtitles: [
				say('Un método genérico declara su propio parámetro de tipo antes del retorno.', 'A generic method declares its own type parameter before the return type.'),
				say('`primero` sirve para una `List<String>`, una `List<Integer>` o la que le pases.', '`primero` works for a `List<String>`, a `List<Integer>` or whatever you pass.'),
			],
		},
		{
			id: 'gcode-bound',
			chapter: 'own',
			scene: 'gcode',
			show: ['gc-class', 'gc-method', 'gc-bound'],
			focus: ['gc-bound'],
			code: code(
				'Maximo.java',
				`// T tiene que ser comparable, así podemos usar compareTo
public static <T extends Comparable<T>> T maximo(List<T> lista) {
    T mayor = lista.get(0);
    for (T elemento : lista) {
        if (elemento.compareTo(mayor) > 0) mayor = elemento;
    }
    return mayor;
}`,
				`// T must be comparable, so we can use compareTo
public static <T extends Comparable<T>> T maximo(List<T> lista) {
    T mayor = lista.get(0);
    for (T elemento : lista) {
        if (elemento.compareTo(mayor) > 0) mayor = elemento;
    }
    return mayor;
}`,
			),
			title: { es: 'Acotar el tipo con extends', en: 'Bounding the type with extends' },
			subtitles: [
				say('Podés acotar el tipo con `extends` para usar los métodos del tipo acotado.', 'You can bound the type with `extends` to use the methods of the bound.'),
				say('Acá `T` debe ser comparable: así `compareTo` está garantizado.', 'Here `T` must be comparable: that guarantees `compareTo` exists.'),
			],
		},
		{
			id: 'bound-gate',
			chapter: 'own',
			scene: 'bound',
			title: { es: 'Quién pasa la puerta', en: 'Who gets through the door' },
			subtitles: boundGate.list,
			motion: {
				cues: [
					{ at: 0, do: 'type', el: 'bd-sig', dur: 1800 },
					{ at: 1000, do: 'enter', el: 'bd-door' },
					{ at: 1500, do: 'enter', el: 'bd-fn' },
					{ at: 2200, do: 'enter', el: 'bd-int' },
					{ at: 2500, do: 'enter', el: 'bd-str' },
					{ at: 2800, do: 'enter', el: 'bd-dog' },
					{ at: boundGate.start(1), do: 'move', el: 'bd-int', to: 'bd-p1', dur: 1400 },
					{ at: boundGate.start(1) + 700, do: 'move', el: 'bd-str', to: 'bd-p2', dur: 1400 },
					{ at: boundGate.start(1) + 1400, do: 'move', el: 'bd-dog', to: 'bd-stop', dur: 1000 },
					{ at: boundGate.start(1) + 2400, do: 'enter', el: 'bd-x' },
					{ at: boundGate.start(1) + 2500, do: 'enter', el: 'bd-err' },
					{ at: boundGate.start(1) + 3300, do: 'move', el: 'bd-dog', to: 'bd-home', dur: 800 },
					{ at: boundGate.start(1) + 3300, do: 'exit', el: 'bd-x' },
					{ at: boundGate.start(2) + 200, do: 'enter', el: 'bd-ct' },
					{ at: boundGate.start(2) + 900, do: 'pulse', el: 'bd-fn' },
				],
			},
		},
		{
			id: 'bound-loop',
			chapter: 'own',
			scene: 'bound',
			title: { es: 'El método maximo en acción', en: 'The maximo method at work' },
			subtitles: boundLoop.list,
			motion: {
				cues: [
					{ at: 0, do: 'exit', el: 'bd-int' },
					{ at: 0, do: 'exit', el: 'bd-str' },
					{ at: 0, do: 'exit', el: 'bd-ct' },
					{ at: 0, do: 'exit', el: 'bd-err' },
					{ at: 300, do: 'enter', el: 'bd-cells' },
					{ at: 900, do: 'enter', el: 'bd-mayor' },
					{ at: 1400, do: 'enter', el: 'bd-m7' },
					{ at: 2000, do: 'enter', el: 'bd-ptr' },
					{ at: 2500, do: 'move', el: 'bd-ptr', to: 'bd-c0', dy: -70, dur: 700 },
					{ at: boundLoop.start(1), do: 'move', el: 'bd-ptr', to: 'bd-c1', dy: -70, dur: 700 },
					{ at: boundLoop.start(1) + 800, do: 'enter', el: 'bd-cmp' },
					{ at: boundLoop.start(1) + 1500, do: 'exit', el: 'bd-m7' },
					{ at: boundLoop.start(1) + 1500, do: 'enter', el: 'bd-m12' },
					{ at: boundLoop.start(1) + 1900, do: 'pulse', el: 'bd-mayor' },
					{ at: boundLoop.start(1) + 2600, do: 'move', el: 'bd-ptr', to: 'bd-c2', dy: -70, dur: 700 },
					{ at: boundLoop.start(1) + 3300, do: 'exit', el: 'bd-cmp' },
					{ at: boundLoop.start(1) + 3300, do: 'enter', el: 'bd-cmp2' },
					{ at: boundLoop.start(2) + 200, do: 'enter', el: 'bd-ret' },
					{ at: boundLoop.start(2) + 900, do: 'pulse', el: 'bd-ret' },
				],
			},
		},
		{
			id: 'gcode-names',
			chapter: 'own',
			scene: 'gcode',
			show: '*',
			focus: ['gc-names'],
			title: { es: 'La convención de las letras', en: 'The letter convention' },
			subtitles: [
				say('Por convención, los parámetros de tipo son una sola letra mayúscula.', 'By convention, type parameters are a single capital letter.'),
				say('`T` es type, `E` element, `K` y `V` key y value, `R` result.', '`T` is type, `E` element, `K` and `V` key and value, `R` result.'),
			],
		},

		// ─── Type erasure (motion + slide) ──────────────────────────────────
		{
			id: 'erase-compile',
			chapter: 'own',
			scene: 'erase',
			title: { es: 'Borrado de tipos', en: 'Type erasure' },
			subtitles: eraseCompile.list,
			motion: {
				cues: [
					{ at: 0, do: 'enter', el: 'er-src' },
					{ at: 600, do: 'enter', el: 'er-ta' },
					{ at: 900, do: 'enter', el: 'er-tb' },
					{ at: 1500, do: 'enter', el: 'er-run' },
					{ at: 2100, do: 'draw', el: 'er-arrow', dur: 900 },
					{ at: 3100, do: 'flow', el: 'er-arrow' },
					{ at: eraseCompile.start(1) + 300, do: 'exit', el: 'er-ta' },
					{ at: eraseCompile.start(1) + 600, do: 'exit', el: 'er-tb' },
					{ at: eraseCompile.start(1) + 1100, do: 'enter', el: 'er-ra' },
					{ at: eraseCompile.start(1) + 1400, do: 'enter', el: 'er-rb' },
				],
			},
		},
		{
			id: 'erase-same',
			chapter: 'own',
			scene: 'erase',
			title: { es: 'La misma clase en ejecución', en: 'The same class at runtime' },
			subtitles: eraseSame.list,
			motion: {
				cues: [
					{ at: 300, do: 'pulse', el: 'er-ra' },
					{ at: 600, do: 'pulse', el: 'er-rb' },
					{ at: eraseSame.start(1) + 200, do: 'enter', el: 'er-eq' },
					{ at: eraseSame.start(1) + 1200, do: 'pulse', el: 'er-eq' },
				],
			},
		},
		{
			id: 'erase-limit',
			chapter: 'own',
			scene: 'erase',
			title: { es: 'Las limitaciones', en: 'The limitations' },
			subtitles: eraseLimit.list,
			motion: {
				cues: [
					{ at: 0, do: 'enter', el: 'er-lim' },
					{ at: 900, do: 'enter', el: 'er-x' },
					{ at: 1500, do: 'pulse', el: 'er-lim' },
					{ at: eraseLimit.start(1) + 400, do: 'pulse', el: 'er-eq' },
				],
			},
		},
		{
			id: 'erase-code',
			chapter: 'own',
			scene: 'erasenote',
			show: '*',
			code: code(
				'Borrado.java',
				`List<String> a = new ArrayList<>();
List<Integer> b = new ArrayList<>();
System.out.println(a.getClass() == b.getClass());   // true

// T[] arreglo = new T[10];   // no se puede: en ejecución no se sabe qué es T`,
				`List<String> a = new ArrayList<>();
List<Integer> b = new ArrayList<>();
System.out.println(a.getClass() == b.getClass());   // true

// T[] arreglo = new T[10];   // not allowed: at runtime T is unknown`,
			),
			shell: shell(cmd('java Borrado'), out('true')),
			title: { es: 'Los genéricos solo existen al compilar', en: 'Generics only exist at compile time' },
			subtitles: [
				say('Los genéricos adelantan el error de producción al momento de escribir la línea.', 'Generics bring the error forward from production to the moment you write the line.'),
				say('En ejecución, `List<String>` y `List<Integer>` imprimen `true`: son la misma clase.', 'At runtime, `List<String>` and `List<Integer>` print `true`: they are the same class.'),
			],
		},

		// ─── 6. Which one to pick ───────────────────────────────────────────
		{
			id: 'choose-lists',
			chapter: 'choose',
			scene: 'choose',
			show: '*',
			focus: ['ch-1', 'ch-2'],
			title: { es: 'Orden y extremos', en: 'Order and ends' },
			subtitles: [
				say('Orden de inserción y acceso por índice: `ArrayList`.', 'Insertion order and access by index: `ArrayList`.'),
				say('Insertar y borrar mucho en los extremos: `ArrayDeque`.', 'Inserting and removing a lot at the ends: `ArrayDeque`.'),
			],
		},
		{
			id: 'choose-sets',
			chapter: 'choose',
			scene: 'choose',
			show: '*',
			focus: ['ch-3', 'ch-4'],
			title: { es: 'Elementos únicos', en: 'Unique elements' },
			subtitles: [
				say('Elementos únicos sin importar el orden: `HashSet`.', 'Unique elements, order does not matter: `HashSet`.'),
				say('Elementos únicos y siempre ordenados: `TreeSet`.', 'Unique elements that stay sorted: `TreeSet`.'),
			],
		},
		{
			id: 'choose-maps',
			chapter: 'choose',
			scene: 'choose',
			show: '*',
			focus: ['ch-5', 'ch-6', 'ch-7', 'ch-8'],
			title: { es: 'Clave → valor y prioridad', en: 'Key → value and priority' },
			subtitles: [
				say('Clave → valor rapidísimo: `HashMap`; en orden de clave `TreeMap`; en orden de inserción `LinkedHashMap`.', 'Key → value, very fast: `HashMap`; in key order `TreeMap`; in insertion order `LinkedHashMap`.'),
				say('Y para sacar siempre al de mayor prioridad: `PriorityQueue`.', 'And to always take the highest priority first: `PriorityQueue`.'),
			],
		},

		// ─── 7. Common mistakes ─────────────────────────────────────────────
		{
			id: 'errors-1',
			chapter: 'errors',
			scene: 'errors15',
			show: '*',
			focus: ['e15-1', 'e15-2', 'e15-3'],
			title: { es: 'Errores de diseño', en: 'Design mistakes' },
			subtitles: [
				say('Declarar con la clase en vez de la interfaz te ata a una implementación.', 'Declaring with the class instead of the interface ties you to one implementation.'),
				say('Objetos propios sin `equals` y `hashCode` guardan duplicados y `get()` devuelve `null`.', 'Your own objects without `equals` and `hashCode` store duplicates and `get()` returns `null`.'),
				say('Y modificar una colección mientras se recorre lanza ConcurrentModificationException.', 'And modifying a collection while walking it throws ConcurrentModificationException.'),
			],
		},
		{
			id: 'errors-2',
			chapter: 'errors',
			scene: 'errors15',
			show: '*',
			focus: ['e15-4', 'e15-5', 'e15-6', 'e15-7'],
			title: { es: 'Errores de uso', en: 'Usage mistakes' },
			subtitles: [
				say('`mapa.get(k)` sin contemplar `null` termina en NullPointerException: usá `getOrDefault`.', '`mapa.get(k)` without handling `null` ends in a NullPointerException: use `getOrDefault`.'),
				say('`LinkedList` "porque insertar es más rápido": en la práctica es más lenta que `ArrayList`.', '`LinkedList` "because inserting is faster": in practice it is slower than `ArrayList`.'),
				say('Una clave mutable queda perdida en el bucket viejo; `List.of(...)` es inmutable.', 'A mutable key gets lost in its old bucket; `List.of(...)` is immutable.'),
			],
		},

		// ─── 8. Guided exercise ─────────────────────────────────────────────
		{
			id: 'exercise-brief',
			chapter: 'exercise',
			scene: 'exercise',
			show: ['ex-1', 'ex-2', 'ex-3', 'ex-4', 'ex-5'],
			focus: ['ex-1'],
			title: { es: 'Contador de frecuencias', en: 'Word frequency counter' },
			subtitles: [
				say('El desafío: contar cuántas veces aparece cada palabra de un texto.', 'The challenge: count how many times each word of a text appears.'),
				say('Normalizás, contás con un `Map`, ordenás por frecuencia y contás las distintas con un `Set`.', 'You normalize, count with a `Map`, sort by frequency and count the distinct ones with a `Set`.'),
			],
		},
		{
			id: 'exercise-merge',
			chapter: 'exercise',
			scene: 'exercise',
			show: ['ex-1', 'ex-2', 'ex-3', 'ex-4', 'ex-5'],
			focus: ['ex-2'],
			code: code(
				'ContadorDePalabras.java',
				`public static Map<String, Integer> contar(String texto) {
    Map<String, Integer> frecuencias = new HashMap<>();
    // \\p{L}+ toma secuencias de letras, incluidas las acentuadas
    for (String palabra : texto.toLowerCase().split("[^\\\\p{L}]+")) {
        if (palabra.isBlank() || VACIAS.contains(palabra)) {
            continue;
        }
        // merge: si no está, guarda 1; si está, aplica Integer::sum
        frecuencias.merge(palabra, 1, Integer::sum);
    }
    return frecuencias;
}`,
				`public static Map<String, Integer> contar(String texto) {
    Map<String, Integer> frecuencias = new HashMap<>();
    // \\p{L}+ takes runs of letters, accented ones included
    for (String palabra : texto.toLowerCase().split("[^\\\\p{L}]+")) {
        if (palabra.isBlank() || VACIAS.contains(palabra)) {
            continue;
        }
        // merge: if absent, store 1; if present, apply Integer::sum
        frecuencias.merge(palabra, 1, Integer::sum);
    }
    return frecuencias;
}`,
			),
			title: { es: 'Contar con merge', en: 'Counting with merge' },
			subtitles: [
				say('`merge` reemplaza el clásico if con `containsKey`: una línea en lugar de cuatro.', '`merge` replaces the classic `containsKey` if: one line instead of four.'),
				say('Y no hay forma de equivocarse en el caso de la primera aparición.', 'And there is no way to get the first appearance wrong.'),
			],
		},
		{
			id: 'exercise-sort',
			chapter: 'exercise',
			scene: 'exercise',
			show: ['ex-1', 'ex-2', 'ex-3', 'ex-4', 'ex-5'],
			focus: ['ex-3', 'ex-4'],
			code: code(
				'Ordenar.java',
				`Set<String> distintas = frecuencias.keySet();

List<Map.Entry<String, Integer>> ordenadas = new ArrayList<>(frecuencias.entrySet());
ordenadas.sort(
    Map.Entry.<String, Integer>comparingByValue().reversed()
        .thenComparing(Map.Entry.comparingByKey())
);

// Bonus: agrupar palabras por su longitud, con computeIfAbsent
Map<Integer, List<String>> porLongitud = new TreeMap<>();
for (String palabra : distintas) {
    porLongitud.computeIfAbsent(palabra.length(), k -> new ArrayList<>()).add(palabra);
}`,
				`Set<String> distintas = frecuencias.keySet();

List<Map.Entry<String, Integer>> ordenadas = new ArrayList<>(frecuencias.entrySet());
ordenadas.sort(
    Map.Entry.<String, Integer>comparingByValue().reversed()
        .thenComparing(Map.Entry.comparingByKey())
);

// Bonus: group words by length, with computeIfAbsent
Map<Integer, List<String>> porLongitud = new TreeMap<>();
for (String palabra : distintas) {
    porLongitud.computeIfAbsent(palabra.length(), k -> new ArrayList<>()).add(palabra);
}`,
			),
			title: { es: 'Ordenar y agrupar', en: 'Sorting and grouping' },
			subtitles: [
				say('Las claves del mapa son un `Set`: te dan las palabras distintas sin lógica extra.', 'The map’s keys are a `Set`: they give you the distinct words with no extra logic.'),
				say('Se ordena por frecuencia descendente y, a igual frecuencia, alfabéticamente.', 'It sorts by descending frequency and, on a tie, alphabetically.'),
			],
		},
		{
			id: 'exercise-set',
			chapter: 'exercise',
			scene: 'exercise',
			show: '*',
			focus: ['ex-5', 'ex-vs'],
			code: code(
				'Vacias.java',
				`private static final Set<String> VACIAS = Set.of(
    "de", "la", "el", "y", "que", "en", "a", "los", "las", "un", "una", "es"
);`,
			),
			title: { es: 'Por qué VACIAS es un Set', en: 'Why VACIAS is a Set' },
			subtitles: [
				say('`VACIAS` es un `Set` porque solo preguntamos `contains`: en un `Set` cuesta O(1).', '`VACIAS` is a `Set` because we only ask `contains`: on a `Set` it costs O(1).'),
				say('En una `List` serían O(n) por cada palabra: elegir bien es una decisión de rendimiento.', 'On a `List` it would be O(n) per word: choosing well is a performance decision.'),
			],
		},

		// ─── Closing ────────────────────────────────────────────────────────
		{
			id: 'closing-takeaways',
			chapter: 'closing',
			scene: 'closing15',
			show: ['c1', 'c2', 'c3', 'c4'],
			focus: ['c1', 'c2', 'c3', 'c4'],
			title: { es: 'Para llevarte: estructura', en: 'Takeaways: structure' },
			subtitles: [
				say('El JCF separa interfaces de implementaciones: declarás siempre con la interfaz.', 'The JCF separates interfaces from implementations: always declare with the interface.'),
				say('`Map` no extiende `Collection` y los genéricos adelantan el error al compilar.', '`Map` does not extend `Collection` and generics bring the error forward to compile time.'),
			],
		},
		{
			id: 'closing-repo',
			chapter: 'closing',
			scene: 'closing15',
			show: '*',
			focus: ['c5', 'c6', 'c7', 'c8', 'repo'],
			title: { es: 'Para llevarte: criterio', en: 'Takeaways: judgment' },
			subtitles: [
				say('En un `HashMap`, `hashCode()` elige el bucket y `equals()` elige el elemento.', 'In a `HashMap`, `hashCode()` picks the bucket and `equals()` picks the element.'),
				say('Elegir bien la colección es una decisión de rendimiento. Los programas están en el repo del curso.', 'Picking the right collection is a performance decision. The programs are in the course repo.'),
			],
		},
	],
};
