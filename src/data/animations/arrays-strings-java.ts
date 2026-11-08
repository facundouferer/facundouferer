import type { AnimationScript, CodePanel, ShellLine, ShellPanel, Subtitle } from './types';

// Step-by-step animation for the Java lesson 04 "Arrays y Strings". Every step names
// the scene it shows (`data-scene` in `src/components/animaciones/arrays-strings-java.astro`),
// the elements it reveals and emphasizes, plus its captions and any terminal panel.
// Four chapters play as motion steps on a persistent SVG canvas (array memory, growing
// an array, the String pool, StringBuilder); the rest are slide steps.

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
const readingMs = (sub: Subtitle) =>
	1200 + Math.max(sub.text.es.length, sub.text.en.length) * 55;
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
const memBlock = timed(
	say('Un array es un bloque de memoria contiguo, dividido en casillas del mismo tamaño.', 'An array is a contiguous block of memory split into equally sized cells.'),
	say('La variable vive en el Stack y solo guarda una referencia; los datos viven en el Heap.', 'The variable lives on the Stack and only holds a reference; the data lives on the Heap.'),
);
const memAccess = timed(
	say('Llegar a una casilla es una cuenta: dirección base + i × tamaño.', 'Reaching a cell is arithmetic: base address + i × size.'),
	say('Por eso `edades[0]` y `edades[4]` cuestan lo mismo: acceso instantáneo.', 'That is why `edades[0]` and `edades[4]` cost the same: instant access.'),
	say('El índice empieza en 0 porque mide desplazamiento, no posición.', 'The index starts at 0 because it measures offset, not position.'),
);
const memFixed = timed(
	say('Justo después del bloque hay otra cosa en memoria: el tamaño no puede cambiar.', 'Right after the block sits something else in memory: the size cannot change.'),
	say('`array.length` es un atributo; en String, `texto.length()` es un método.', '`array.length` is an attribute; on String, `texto.length()` is a method.'),
);
const growFull = timed(
	say('No existe `array.add`: un array de 4 posiciones muere con 4 posiciones.', 'There is no `array.add`: a 4-slot array dies with 4 slots.'),
	say('Cuando necesitás más, la única salida es pedir un bloque nuevo, más grande.', 'When you need more, the only way out is to ask for a new, larger block.'),
);
const growCopy = timed(
	say('Después se copian los elementos uno por uno: copiar n elementos cuesta n operaciones.', 'Then the elements are copied one by one: copying n elements costs n operations.'),
	say('El array original queda sin referencias y se lo lleva el recolector de basura.', 'The original array is left without references and the garbage collector takes it.'),
	say('Por eso ArrayList duplica su capacidad: así el costo de copiar se reparte.', 'That is why ArrayList doubles its capacity: it spreads the cost of copying.'),
);
const poolLiterals = timed(
	say('Para no duplicar cadenas, la JVM guarda los literales en el String Constant Pool.', 'To avoid duplicating strings, the JVM keeps literals in the String Constant Pool.'),
	say('Por eso `s1` y `s2` apuntan al mismo objeto y `s1 == s2` da true.', 'That is why `s1` and `s2` point to the same object and `s1 == s2` is true.'),
);
const poolNew = timed(
	say('`new String("Java")` siempre crea un objeto aparte, fuera del pool.', '`new String("Java")` always creates a separate object, outside the pool.'),
	say('Por eso `s1 == s3` da false, aunque el texto sea el mismo.', 'That is why `s1 == s3` is false, even though the text is the same.'),
);
const poolEquals = timed(
	say('`==` compara identidad de objetos; `.equals()` compara el contenido.', '`==` compares object identity; `.equals()` compares the content.'),
	say('Regla de oro: para comparar texto, siempre `.equals()`.', 'Golden rule: to compare text, always use `.equals()`.'),
	say('Con el literal a la izquierda evitás NullPointerException: `"salir".equals(entrada)`.', 'With the literal on the left you avoid NullPointerException: `"exit".equals(input)`.'),
);
const poolRuntime = timed(
	say('Si la cadena se arma en ejecución, como `parte + "va"`, es un objeto nuevo.', 'If the string is built at runtime, like `part + "va"`, it is a new object.'),
	say('Mismo texto, otro objeto: `==` da false y `.equals()` da true.', 'Same text, another object: `==` is false and `.equals()` is true.'),
);
const builderCost = timed(
	say('Cada `+=` sobre un String crea un objeto nuevo y copia todo lo acumulado.', 'Each `+=` on a String creates a new object and copies everything accumulated.'),
	say('En 1000 vueltas son 1000 objetos temporales y medio millón de caracteres copiados.', 'Over 1000 iterations that is 1000 temporary objects and half a million characters copied.'),
	say('`StringBuilder` escribe en un único buffer y solo copia cuando se le agota la capacidad.', '`StringBuilder` writes into a single buffer and only copies when it runs out of capacity.'),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'intro', label: { es: 'Introducción', en: 'Introduction' } },
		{ id: 'memory', label: { es: '1. Memoria contigua', en: '1. Contiguous memory' } },
		{ id: 'declare', label: { es: '2. Declarar e inicializar', en: '2. Declare and initialize' } },
		{ id: 'traverse', label: { es: '3. Recorrer un array', en: '3. Traversing an array' } },
		{ id: 'grow', label: { es: '4. Tamaño fijo', en: '4. Fixed size' } },
		{ id: 'objects', label: { es: '5. Primitivos vs. objetos', en: '5. Primitives vs. objects' } },
		{ id: 'matrix', label: { es: '6. Matrices', en: '6. Matrices' } },
		{ id: 'tools', label: { es: '7. java.util.Arrays', en: '7. java.util.Arrays' } },
		{ id: 'immut', label: { es: '8. Strings inmutables', en: '8. Immutable Strings' } },
		{ id: 'pool', label: { es: '9. String Pool y ==', en: '9. String Pool and ==' } },
		{ id: 'indexing', label: { es: '10. Índices y texto', en: '10. Indexes and text' } },
		{ id: 'builder', label: { es: '11. StringBuilder', en: '11. StringBuilder' } },
		{ id: 'errors', label: { es: '12. Errores frecuentes', en: '12. Common mistakes' } },
		{ id: 'exercises', label: { es: '13. Ejercicios', en: '13. Exercises' } },
	],
	steps: [
		// ─── Intro ──────────────────────────────────────────────────────────
		{
			id: 'intro-why',
			chapter: 'intro',
			scene: 'intro04',
			show: ['loose', 'arr'],
			focus: ['arr'],
			title: { es: 'Del dato suelto al array', en: 'From a loose value to an array' },
			subtitles: [
				say('Hasta acá guardaste datos en variables sueltas: una edad, un nombre, un precio.', 'So far you stored data in loose variables: an age, a name, a price.'),
				say('Con las notas de un curso, `nota1`, `nota2`, `nota3`… deja de ser una opción.', 'With a course’s grades, `nota1`, `nota2`, `nota3`… stops being an option.'),
				say('El array guarda muchos valores del mismo tipo bajo un único nombre.', 'An array stores many values of the same type under a single name.'),
			],
		},
		{
			id: 'intro-both',
			chapter: 'intro',
			scene: 'intro04',
			show: '*',
			focus: ['str', 'mem'],
			title: { es: 'Arrays y Strings, una misma historia', en: 'Arrays and Strings, one story' },
			subtitles: [
				say('El String parece un tipo más, pero es un objeto construido sobre un array de caracteres.', 'String looks like a plain type, but it is an object built on a char array.'),
				say('Las dos cosas comparten un trasfondo: cómo Java acomoda los datos en memoria.', 'Both share one background: how Java lays data out in memory.'),
			],
		},

		// ─── 1. Contiguous memory (motion) ──────────────────────────────────
		{
			id: 'mem-block',
			chapter: 'memory',
			scene: 'mem',
			title: { es: 'Un bloque contiguo en el Heap', en: 'A contiguous block on the Heap' },
			subtitles: memBlock.list,
			motion: {
				cues: [
					{ at: 0, do: 'type', el: 'decl', dur: 1500 },
					{ at: 900, do: 'enter', el: 'stack' },
					{ at: 1400, do: 'enter', el: 'heap' },
					{ at: 2000, do: 'enter', el: 'ref' },
					{ at: 2600, do: 'draw', el: 'arrow-ref', dur: 900 },
					{ at: 3400, do: 'enter', el: 'cell-0' },
					{ at: 3580, do: 'enter', el: 'cell-1' },
					{ at: 3760, do: 'enter', el: 'cell-2' },
					{ at: 3940, do: 'enter', el: 'cell-3' },
					{ at: 4120, do: 'enter', el: 'cell-4' },
					{ at: memBlock.start(1) + 300, do: 'pulse', el: 'ref' },
					{ at: memBlock.start(1) + 1200, do: 'pulse', el: 'heap' },
				],
			},
		},
		{
			id: 'mem-access',
			chapter: 'memory',
			scene: 'mem',
			title: { es: 'Acceso instantáneo por índice', en: 'Instant access by index' },
			subtitles: memAccess.list,
			motion: {
				cues: [
					{ at: 0, do: 'enter', el: 'formula' },
					{ at: 900, do: 'enter', el: 'ptr' },
					{ at: 1800, do: 'move', el: 'ptr', to: 'cell-3', dy: -75, dur: 1800 },
					{ at: 3700, do: 'pulse', el: 'cell-3' },
					{ at: memAccess.start(1) + 200, do: 'move', el: 'ptr', to: 'cell-4', dy: -75, dur: 1000 },
					{ at: memAccess.start(1) + 1300, do: 'pulse', el: 'cell-4' },
					{ at: memAccess.start(2) + 200, do: 'move', el: 'ptr', to: 'cell-0', dy: -75, dur: 1400 },
					{ at: memAccess.start(2) + 1700, do: 'pulse', el: 'cell-0' },
				],
			},
		},
		{
			id: 'mem-fixed',
			chapter: 'memory',
			scene: 'mem',
			title: { es: 'El tamaño no puede cambiar', en: 'The size cannot change' },
			subtitles: memFixed.list,
			motion: {
				cues: [
					{ at: 500, do: 'enter', el: 'other' },
					{ at: 1600, do: 'pulse', el: 'other' },
					{ at: 2200, do: 'type', el: 'len', dur: 900 },
					{ at: memFixed.start(1) + 300, do: 'pulse', el: 'len' },
				],
			},
		},

		// ─── 2. Declare, instantiate, initialize ────────────────────────────
		{
			id: 'declare-three',
			chapter: 'declare',
			scene: 'declare',
			show: ['d1', 'd2', 'd3', 'alt'],
			focus: ['d1', 'd2', 'd3'],
			code: code(
				'Arreglos.java',
				`int[] edades = new int[5];            // declarar + instanciar
String[] lenguajes = {"Java", "Go"};  // literal de inicialización
double[] precios;                     // declarar: vale null
precios = new double[3];              // instanciar después`,
				`int[] edades = new int[5];            // declare + instantiate
String[] lenguajes = {"Java", "Go"};  // initializer literal
double[] precios;                     // declare: it is null
precios = new double[3];              // instantiate later`,
			),
			title: { es: 'Declarar, instanciar e inicializar', en: 'Declare, instantiate and initialize' },
			subtitles: [
				say('Declarar crea la variable, instanciar reserva el bloque en el Heap, inicializar pone los valores.', 'Declaring creates the variable, instantiating reserves the Heap block, initializing sets the values.'),
				say('Con un literal `{ }` el compilador deduce el tamaño. Evitá la sintaxis heredada `int edades[]`.', 'With a `{ }` literal the compiler infers the size. Avoid the legacy `int edades[]` syntax.'),
			],
		},
		{
			id: 'declare-defaults',
			chapter: 'declare',
			scene: 'defaults',
			show: '*',
			focus: ['df1', 'df2', 'df3', 'df4', 'df5'],
			title: { es: 'Valores por defecto', en: 'Default values' },
			subtitles: [
				say('Con `new`, Java llena el bloque con ceros binarios: nunca deja basura.', 'With `new`, Java fills the block with binary zeros: it never leaves garbage.'),
				say('Cada tipo lo interpreta a su manera: 0, 0.0, el carácter nulo, false o null.', 'Each type reads it its own way: 0, 0.0, the null character, false or null.'),
			],
		},
		{
			id: 'declare-null',
			chapter: 'declare',
			scene: 'defaults',
			show: '*',
			focus: ['df5'],
			code: code('Nulos.java', `String[] nombres = new String[3];

System.out.println(nombres[0]);           // null
System.out.println(nombres[0].length());  // NullPointerException`),
			shell: shell(cmd('java Nulos'), out('null'), err('Exception in thread "main" java.lang.NullPointerException')),
			title: { es: 'new String[3] no da cadenas vacías', en: 'new String[3] gives no empty strings' },
			subtitles: [
				say('`new String[3]` no da tres cadenas vacías: da tres `null`.', '`new String[3]` does not give three empty strings: it gives three `null`.'),
				say('Llamar a `.length()` sobre una casilla `null` termina en NullPointerException.', 'Calling `.length()` on a `null` cell ends in NullPointerException.'),
			],
		},
		{
			id: 'declare-errors',
			chapter: 'declare',
			scene: 'errs',
			show: '*',
			focus: ['e1', 'e2', 'e3'],
			code: code(
				'Errores.java',
				`int[] datos = new int[3];

datos[3] = 99;     // índice fuera de rango
datos[-1] = 99;    // índice negativo
int[] otro = new int[-5];  // tamaño negativo`,
				`int[] datos = new int[3];

datos[3] = 99;     // index out of range
datos[-1] = 99;    // negative index
int[] otro = new int[-5];  // negative size`,
			),
			shell: shell(
				cmd('java Errores'),
				err('ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3'),
			),
			title: { es: 'Los errores que vas a ver seguro', en: 'The errors you will surely see' },
			subtitles: [
				say('Índice 3 o -1 en un array de 3 lanza ArrayIndexOutOfBoundsException.', 'Index 3 or -1 on a 3-element array throws ArrayIndexOutOfBoundsException.'),
				say('Un tamaño negativo lanza NegativeArraySizeException. Los tres ocurren en ejecución.', 'A negative size throws NegativeArraySizeException. All three happen at runtime.'),
				say('Java verifica el rango en cada acceso: el error aparece justo donde se produjo.', 'Java checks the range on every access: the error shows up exactly where it happened.'),
			],
		},

		// ─── 3. Traversing ──────────────────────────────────────────────────
		{
			id: 'traverse-for',
			chapter: 'traverse',
			scene: 'traverse',
			show: ['tr-for', 'tr-each', 'tr-back'],
			focus: ['tr-for', 'tr-back'],
			code: code(
				'Recorridos.java',
				`String[] frutas = {"Manzana", "Banana", "Naranja"};

for (int i = 0; i < frutas.length; i++) {
    System.out.println(i + ": " + frutas[i]);
}

for (int i = frutas.length - 1; i >= 0; i--) {
    System.out.println(frutas[i]);
}`,
			),
			title: { es: 'El for clásico', en: 'The classic for' },
			subtitles: [
				say('El `for` clásico tiene el índice: podés leer y también modificar el array.', 'The classic `for` has the index: you can read and also modify the array.'),
				say('También sirve para recorrer hacia atrás, desde `length - 1` hasta 0.', 'It also walks backwards, from `length - 1` down to 0.'),
			],
		},
		{
			id: 'traverse-foreach',
			chapter: 'traverse',
			scene: 'traverse',
			show: ['tr-for', 'tr-each', 'tr-back'],
			focus: ['tr-each'],
			code: code(
				'ForEach.java',
				`String[] frutas = {"Manzana", "Banana", "Naranja"};

for (String fruta : frutas) {
    System.out.println("Fruta: " + fruta);
}`,
			),
			title: { es: 'El for-each', en: 'The for-each' },
			subtitles: [
				say('El `for-each` se lee mejor y elimina de raíz los errores de índice.', 'The `for-each` reads better and removes index errors at the root.'),
				say('Es la opción por defecto cuando solo necesitás leer cada elemento.', 'It is the default choice when you only need to read each element.'),
			],
		},
		{
			id: 'traverse-copy',
			chapter: 'traverse',
			scene: 'traverse',
			show: '*',
			focus: ['tr-trap'],
			code: code(
				'Duplicar.java',
				`int[] numeros = {1, 2, 3};

for (int n : numeros) {
    n = n * 2;          // n es una copia
}
for (int i = 0; i < numeros.length; i++) {
    numeros[i] = numeros[i] * 2;
}`,
			),
			shell: shell(cmd('java Duplicar'), out('[1, 2, 3]  ← después del for-each'), out('[2, 4, 6]  ← después del for con índice')),
			title: { es: 'La trampa del for-each', en: 'The for-each trap' },
			subtitles: [
				say('La variable del `for-each` es una copia: `n = n * 2` no modifica el array.', 'The `for-each` variable is a copy: `n = n * 2` does not change the array.'),
				say('Regla simple: para escribir en el array necesitás el índice.', 'Simple rule: to write into the array you need the index.'),
			],
		},

		// ─── 4. Fixed size (motion) ─────────────────────────────────────────
		{
			id: 'grow-full',
			chapter: 'grow',
			scene: 'grow',
			title: { es: 'Un array no crece', en: 'An array does not grow' },
			subtitles: growFull.list,
			motion: {
				cues: [
					{ at: 0, do: 'type', el: 'g-decl', dur: 1700 },
					{ at: 700, do: 'enter', el: 'old' },
					{ at: 2400, do: 'pulse', el: 'old' },
					{ at: growFull.start(1), do: 'enter', el: 'nlabel' },
					{ at: growFull.start(1) + 300, do: 'enter', el: 'ncell-0' },
					{ at: growFull.start(1) + 450, do: 'enter', el: 'ncell-1' },
					{ at: growFull.start(1) + 600, do: 'enter', el: 'ncell-2' },
					{ at: growFull.start(1) + 750, do: 'enter', el: 'ncell-3' },
					{ at: growFull.start(1) + 900, do: 'enter', el: 'ncell-4' },
					{ at: growFull.start(1) + 1050, do: 'enter', el: 'ncell-5' },
					{ at: growFull.start(1) + 1200, do: 'enter', el: 'ncell-6' },
					{ at: growFull.start(1) + 1350, do: 'enter', el: 'ncell-7' },
				],
			},
		},
		{
			id: 'grow-copy',
			chapter: 'grow',
			scene: 'grow',
			title: { es: 'Crecer es copiar', en: 'Growing means copying' },
			subtitles: growCopy.list,
			motion: {
				cues: [
					{ at: 200, do: 'enter', el: 'tok-0', dur: 300 },
					{ at: 350, do: 'enter', el: 'tok-1', dur: 300 },
					{ at: 500, do: 'enter', el: 'tok-2', dur: 300 },
					{ at: 650, do: 'enter', el: 'tok-3', dur: 300 },
					{ at: 1300, do: 'move', el: 'tok-0', to: 'ncell-0', dur: 1100 },
					{ at: 1700, do: 'move', el: 'tok-1', to: 'ncell-1', dur: 1100 },
					{ at: 2100, do: 'move', el: 'tok-2', to: 'ncell-2', dur: 1100 },
					{ at: 2500, do: 'move', el: 'tok-3', to: 'ncell-3', dur: 1100 },
					{ at: growCopy.start(1) + 200, do: 'exit', el: 'old', dur: 700 },
					{ at: growCopy.start(1) + 900, do: 'enter', el: 'gc' },
					{ at: growCopy.start(2) + 200, do: 'enter', el: 'g-note' },
				],
			},
		},
		{
			id: 'grow-api',
			chapter: 'grow',
			scene: 'arrays-api',
			show: '*',
			focus: ['t-copy'],
			code: code(
				'Crecer.java',
				`int[] datos = {10, 20, 30, 40};

int[] masGrande = Arrays.copyOf(datos, 8);
int[] medio = Arrays.copyOfRange(datos, 1, 3);   // [20, 30]

int[] destino = new int[8];
System.arraycopy(datos, 0, destino, 0, datos.length);`,
			),
			title: { es: 'Las herramientas para copiar', en: 'The copying tools' },
			subtitles: [
				say('`Arrays.copyOf(a, n)` copia con otro tamaño; `copyOfRange` copia un rango sin incluir el final.', '`Arrays.copyOf(a, n)` copies with another size; `copyOfRange` copies a range excluding the end.'),
				say('`System.arraycopy` da control total sobre origen y destino.', '`System.arraycopy` gives full control over source and destination.'),
			],
		},

		// ─── 5. Primitive vs. object arrays ─────────────────────────────────
		{
			id: 'objects-values',
			chapter: 'objects',
			scene: 'refs',
			show: ['r-int', 'r-str'],
			focus: ['r-int'],
			code: code(
				'Primitivos.java',
				`int[] numeros = new int[3];        // 3 casillas con 0
String[] nombres = new String[3];  // 3 casillas con null`,
				`int[] numeros = new int[3];        // 3 cells holding 0
String[] nombres = new String[3];  // 3 cells holding null`,
			),
			title: { es: 'Valores o referencias', en: 'Values or references' },
			subtitles: [
				say('Un array de primitivos contiene los valores: `new int[3]` son tres ceros.', 'A primitive array holds the values: `new int[3]` is three zeros.'),
				say('Un array de objetos contiene referencias: `new String[3]` son tres `null`.', 'An object array holds references: `new String[3]` is three `null`.'),
			],
		},
		{
			id: 'objects-null',
			chapter: 'objects',
			scene: 'refs',
			show: ['r-int', 'r-str'],
			focus: ['r-str'],
			shell: shell(cmd('java Referencias'), out('0'), out('null'), err('Exception in thread "main" java.lang.NullPointerException')),
			title: { es: 'Las referencias apuntan a otra parte', en: 'References point elsewhere' },
			subtitles: [
				say('Los objetos viven en otra parte del Heap; el array solo guarda sus direcciones.', 'The objects live elsewhere on the Heap; the array only stores their addresses.'),
				say('Por eso `nombres[0].length()` falla con NullPointerException hasta que lo llenes.', 'So `nombres[0].length()` fails with NullPointerException until you fill it.'),
			],
		},
		{
			id: 'objects-shallow',
			chapter: 'objects',
			scene: 'refs',
			show: '*',
			focus: ['r-shallow'],
			code: code(
				'Superficial.java',
				`StringBuilder[] original = { new StringBuilder("Hola") };
StringBuilder[] copia = Arrays.copyOf(original, 1);

copia[0].append(" mundo");

System.out.println(original[0]);   // "Hola mundo"`,
				`StringBuilder[] original = { new StringBuilder("Hello") };
StringBuilder[] copia = Arrays.copyOf(original, 1);

copia[0].append(" world");

System.out.println(original[0]);   // "Hello world"`,
			),
			title: { es: 'Copia superficial', en: 'Shallow copy' },
			subtitles: [
				say('`Arrays.copyOf` hace copia superficial: duplica el array, no los objetos.', '`Arrays.copyOf` makes a shallow copy: it duplicates the array, not the objects.'),
				say('Los dos arrays apuntan al mismo objeto: cambiar uno cambia el otro.', 'Both arrays point to the same object: changing one changes the other.'),
				say('Con String no pasa: es inmutable, compartir la referencia no hace daño.', 'It never happens with String: it is immutable, sharing the reference does no harm.'),
			],
		},

		// ─── 6. Matrices ────────────────────────────────────────────────────
		{
			id: 'matrix-array-of-arrays',
			chapter: 'matrix',
			scene: 'matrix',
			show: ['m-outer', 'm-r0', 'm-r1', 'm-r2'],
			focus: ['m-outer'],
			code: code(
				'Matriz.java',
				`int[][] tablero = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};

for (int[] fila : tablero) {
    for (int valor : fila) {
        System.out.print(valor + " ");
    }
}`,
			),
			title: { es: 'Un array de arrays', en: 'An array of arrays' },
			subtitles: [
				say('En Java no existen las matrices: existe un array cuyos elementos son arrays.', 'Java has no matrices: it has an array whose elements are arrays.'),
				say('Cada fila es un objeto independiente, con su propia longitud.', 'Each row is an independent object with its own length.'),
			],
		},
		{
			id: 'matrix-jagged',
			chapter: 'matrix',
			scene: 'matrix',
			show: '*',
			focus: ['m-r0', 'm-r1', 'm-r2', 'm-note'],
			code: code(
				'Irregular.java',
				`int[][] datos = new int[3][];   // filas en null
datos[0] = new int[]{1, 2, 3};
datos[1] = new int[]{4, 5, 6, 7, 8};
datos[2] = new int[]{9, 0};

System.out.println(datos[1].length);   // 5`,
			),
			title: { es: 'Arrays irregulares', en: 'Jagged arrays' },
			subtitles: [
				say('Un array irregular se crea con `new int[3][]`: las filas quedan en `null` hasta asignarlas.', 'A jagged array is created with `new int[3][]`: rows stay `null` until you assign them.'),
				say('Por eso el bucle interno usa `tablero[fila].length`, no `tablero[0].length`.', 'That is why the inner loop uses `tablero[fila].length`, not `tablero[0].length`.'),
			],
		},
		{
			id: 'matrix-print',
			chapter: 'matrix',
			scene: 'matrix',
			show: '*',
			focus: ['m-outer'],
			code: code(
				'Imprimir.java',
				`System.out.println(Arrays.toString(datos));
System.out.println(Arrays.deepToString(datos));`,
			),
			shell: shell(cmd('java Imprimir'), out('[[I@1b6d3586, [I@4554617c, [I@74a14482]'), out('[[1, 2, 3], [4, 5, 6, 7, 8], [9, 0]]')),
			title: { es: 'Imprimir una matriz', en: 'Printing a matrix' },
			subtitles: [
				say('`Arrays.toString` solo ve el array externo: imprime las direcciones de las filas.', '`Arrays.toString` only sees the outer array: it prints the rows’ addresses.'),
				say('Para imprimir una matriz completa usá `Arrays.deepToString`.', 'To print a whole matrix use `Arrays.deepToString`.'),
			],
		},

		// ─── 7. java.util.Arrays ────────────────────────────────────────────
		{
			id: 'tools-list',
			chapter: 'tools',
			scene: 'arrays-api',
			show: '*',
			focus: [],
			title: { es: 'El cinturón de herramientas', en: 'The toolbelt' },
			subtitles: [
				say('`java.util.Arrays` ya resuelve casi todo: imprimir, ordenar, buscar, copiar, rellenar y comparar.', '`java.util.Arrays` already solves almost everything: print, sort, search, copy, fill and compare.'),
				say('`Arrays.stream` permite sumar, filtrar y promediar sin escribir un bucle.', '`Arrays.stream` lets you sum, filter and average without writing a loop.'),
			],
		},
		{
			id: 'tools-sort-search',
			chapter: 'tools',
			scene: 'arrays-api',
			show: '*',
			focus: ['t-sort', 't-search'],
			code: code(
				'Herramientas.java',
				`int[] numeros = {42, 12, 89, 7, 23};

Arrays.sort(numeros);
int indice = Arrays.binarySearch(numeros, 23);

System.out.println(Arrays.toString(numeros));
System.out.println("Índice de 23: " + indice);`,
				`int[] numeros = {42, 12, 89, 7, 23};

Arrays.sort(numeros);
int indice = Arrays.binarySearch(numeros, 23);

System.out.println(Arrays.toString(numeros));
System.out.println("Index of 23: " + indice);`,
			),
			shell: shell(cmd('java Herramientas'), out('[7, 12, 23, 42, 89]'), { kind: 'out', text: { es: 'Índice de 23: 2', en: 'Index of 23: 2' } }),
			title: { es: 'Ordenar y buscar', en: 'Sort and search' },
			subtitles: [
				say('`Arrays.sort` ordena el array original, sin crear uno nuevo.', '`Arrays.sort` sorts the original array, without creating a new one.'),
				say('`binarySearch` busca rápido, pero exige el array ya ordenado.', '`binarySearch` searches fast, but it requires an already sorted array.'),
			],
		},
		{
			id: 'tools-equals',
			chapter: 'tools',
			scene: 'arrays-api',
			show: '*',
			focus: ['t-equals'],
			code: code(
				'Comparar.java',
				`int[] a = {1, 2, 3};
int[] b = {1, 2, 3};

System.out.println(a == b);
System.out.println(a.equals(b));
System.out.println(Arrays.equals(a, b));`,
			),
			shell: shell(cmd('java Comparar'), out('false'), out('false'), out('true')),
			title: { es: '== tampoco sirve para arrays', en: '== does not work for arrays either' },
			subtitles: [
				say('`==` compara referencias: dos arrays con el mismo contenido dan false.', '`==` compares references: two arrays with the same content give false.'),
				say('`a.equals(b)` tampoco sirve: un array no sobrescribe `equals`. Usá `Arrays.equals`.', '`a.equals(b)` does not help: an array does not override `equals`. Use `Arrays.equals`.'),
			],
		},
		{
			id: 'tools-binary',
			chapter: 'tools',
			scene: 'arrays-api',
			show: '*',
			focus: ['t-search'],
			title: { es: 'binarySearch sin ordenar', en: 'binarySearch on unsorted data' },
			subtitles: [
				say('`binarySearch` sobre un array desordenado no lanza excepción: devuelve basura en silencio.', '`binarySearch` on an unsorted array throws no exception: it silently returns garbage.'),
				say('Ordená primero con `Arrays.sort` y recién después buscá.', 'Sort first with `Arrays.sort` and only then search.'),
			],
		},

		// ─── 8. Immutable Strings ───────────────────────────────────────────
		{
			id: 'immut-concept',
			chapter: 'immut',
			scene: 'immut',
			show: ['im-var', 'im-old', 'im-new'],
			focus: ['im-new'],
			title: { es: 'El contenido no cambia jamás', en: 'The content never changes' },
			subtitles: [
				say('Un String es un objeto cuyo contenido no cambia jamás una vez creado.', 'A String is an object whose content never changes once created.'),
				say('Ningún método lo modifica: `toUpperCase()` devuelve una cadena nueva.', 'No method modifies it: `toUpperCase()` returns a new string.'),
			],
		},
		{
			id: 'immut-forget',
			chapter: 'immut',
			scene: 'immut',
			show: ['im-var', 'im-old', 'im-new'],
			focus: ['im-var', 'im-new'],
			code: code(
				'Inmutable.java',
				`String texto = "hola";
texto.toUpperCase();                 // se descarta
System.out.println(texto);

String mayus = texto.toUpperCase();  // así sí
System.out.println(mayus);`,
			),
			shell: shell(cmd('java Inmutable'), out('hola'), out('HOLA')),
			title: { es: 'Olvidar asignar el resultado', en: 'Forgetting to assign the result' },
			subtitles: [
				say('Olvidar asignar el resultado es el error número uno: el programa sigue con el valor viejo.', 'Forgetting to assign the result is mistake number one: the program carries on with the old value.'),
				say('`texto.toUpperCase();` se descarta; `mayus = texto.toUpperCase();` lo guarda.', '`texto.toUpperCase();` is discarded; `mayus = texto.toUpperCase();` keeps it.'),
			],
		},
		{
			id: 'immut-why',
			chapter: 'immut',
			scene: 'immut',
			show: '*',
			focus: ['im-sec', 'im-conc', 'im-hash', 'im-reuse'],
			title: { es: 'Por qué es inmutable', en: 'Why it is immutable' },
			subtitles: [
				say('No es un capricho: seguridad, concurrencia, hash cacheado y reutilización.', 'It is no whim: security, concurrency, cached hash and reuse.'),
				say('Como nadie puede modificarlos, la JVM comparte un mismo objeto entre variables: es el pool.', 'Since nobody can modify them, the JVM shares one object among variables: that is the pool.'),
			],
		},

		// ─── 9. String Constant Pool (motion) ───────────────────────────────
		{
			id: 'pool-literals',
			chapter: 'pool',
			scene: 'pool',
			title: { es: 'Los literales van al pool', en: 'Literals go to the pool' },
			subtitles: poolLiterals.list,
			motion: {
				cues: [
					{ at: 0, do: 'enter', el: 'heap' },
					{ at: 400, do: 'enter', el: 'stack' },
					{ at: 800, do: 'enter', el: 'pool' },
					{ at: 1400, do: 'enter', el: 'v-s1' },
					{ at: 2000, do: 'enter', el: 'o-pool' },
					{ at: 2700, do: 'draw', el: 'a-s1', dur: 900 },
					{ at: poolLiterals.start(1), do: 'enter', el: 'v-s2' },
					{ at: poolLiterals.start(1) + 700, do: 'draw', el: 'a-s2', dur: 900 },
					{ at: poolLiterals.start(1) + 1800, do: 'enter', el: 'r1' },
					{ at: poolLiterals.start(1) + 2400, do: 'pulse', el: 'o-pool' },
				],
			},
		},
		{
			id: 'pool-new',
			chapter: 'pool',
			scene: 'pool',
			title: { es: 'new String crea otro objeto', en: 'new String creates another object' },
			subtitles: poolNew.list,
			motion: {
				cues: [
					{ at: 0, do: 'enter', el: 'v-s3' },
					{ at: 700, do: 'enter', el: 'o-new' },
					{ at: 1500, do: 'draw', el: 'a-s3', dur: 1200 },
					{ at: poolNew.start(1), do: 'enter', el: 'r2' },
					{ at: poolNew.start(1) + 700, do: 'pulse', el: 'o-new' },
				],
			},
		},
		{
			id: 'pool-equals',
			chapter: 'pool',
			scene: 'pool',
			title: { es: 'Identidad vs. contenido', en: 'Identity vs. content' },
			subtitles: poolEquals.list,
			motion: {
				cues: [
					{ at: 300, do: 'pulse', el: 'o-pool' },
					{ at: 600, do: 'pulse', el: 'o-new' },
					{ at: 1300, do: 'enter', el: 'r3' },
					{ at: poolEquals.start(1) + 300, do: 'pulse', el: 'r3' },
				],
			},
		},
		{
			id: 'pool-runtime',
			chapter: 'pool',
			scene: 'pool',
			title: { es: 'La trampa de armar cadenas en ejecución', en: 'The runtime-built string trap' },
			subtitles: poolRuntime.list,
			motion: {
				cues: [
					{ at: 0, do: 'exit', el: 'r1' },
					{ at: 0, do: 'exit', el: 'r2' },
					{ at: 0, do: 'exit', el: 'r3' },
					{ at: 700, do: 'enter', el: 'v-c' },
					{ at: 1300, do: 'enter', el: 'o-run' },
					{ at: 2000, do: 'draw', el: 'a-c', dur: 1100 },
					{ at: poolRuntime.start(1), do: 'enter', el: 'r4' },
					{ at: poolRuntime.start(1) + 600, do: 'enter', el: 'r5' },
				],
			},
		},

		// ─── 10. Indexes and text ───────────────────────────────────────────
		{
			id: 'index-chars',
			chapter: 'indexing',
			scene: 'indexing',
			show: ['ix-str', 'ix-len', 'ix-last'],
			focus: ['ix-str'],
			code: code(
				'Indices.java',
				`String texto = "Aprender";

System.out.println(texto.length());   // 8
System.out.println(texto.charAt(0));  // A
System.out.println(texto.charAt(7));  // r`,
				`String texto = "Learning";

System.out.println(texto.length());   // 8
System.out.println(texto.charAt(0));  // L
System.out.println(texto.charAt(7));  // g`,
			),
			title: { es: 'Un String se indexa como un array', en: 'A String is indexed like an array' },
			subtitles: [
				say('Un String se indexa igual que un array: de 0 a `length() - 1`.', 'A String is indexed just like an array: from 0 to `length() - 1`.'),
				say('`charAt(i)` devuelve el carácter en la posición `i`.', '`charAt(i)` returns the character at position `i`.'),
			],
		},
		{
			id: 'index-substring',
			chapter: 'indexing',
			scene: 'indexing',
			show: ['ix-str', 'ix-len', 'ix-last', 'ix-hl'],
			focus: ['ix-hl'],
			code: code(
				'Cortar.java',
				`String texto = "Aprender";

String parte = texto.substring(2, 5);
System.out.println(parte);   // "ren"`,
				`String texto = "Learning";

String parte = texto.substring(2, 5);
System.out.println(parte);   // "arn"`,
			),
			title: { es: 'Inicio incluido, fin excluido', en: 'Start included, end excluded' },
			subtitles: [
				say('`substring(2, 5)` corta desde el índice 2 hasta el 4: el final no se incluye.', '`substring(2, 5)` cuts from index 2 up to 4: the end is not included.'),
				say('Inicio incluido, fin excluido: la misma convención de `copyOfRange` y `subList`.', 'Start included, end excluded: the same convention as `copyOfRange` and `subList`.'),
			],
		},
		{
			id: 'index-methods',
			chapter: 'indexing',
			scene: 'indexing',
			show: ['ix-str', 'ix-methods'],
			focus: ['ix-methods'],
			code: code(
				'Metodos.java',
				`String texto = "  Aprendiendo Java en 2026  ";

texto.trim();                  // sin espacios en los extremos
texto.contains("Java");        // true
texto.indexOf("Java");         // 14
texto.replace("2026", "2027");
texto.toUpperCase();`,
			),
			title: { es: 'Los métodos esenciales de String', en: 'The essential String methods' },
			subtitles: [
				say('Con `indexOf`, `contains`, `trim`, `replace` y `toUpperCase` trabajás el texto sin recorrerlo a mano.', 'With `indexOf`, `contains`, `trim`, `replace` and `toUpperCase` you work the text without walking it by hand.'),
				say('Todos devuelven una cadena nueva: hay que asignar el resultado.', 'All of them return a new string: you must assign the result.'),
			],
		},
		{
			id: 'index-format',
			chapter: 'indexing',
			scene: 'indexing',
			show: '*',
			focus: ['ix-fmt'],
			code: code(
				'Formato.java',
				`String[] provincias = "Neuquén,Córdoba,Salta".split(",");
String unidas = String.join(" | ", provincias);

"   ".isBlank();     // true
"   ".isEmpty();     // false

"Promedio %.2f".formatted(8.457);`,
				`String[] provincias = "Neuquén,Córdoba,Salta".split(",");
String unidas = String.join(" | ", provincias);

"   ".isBlank();     // true
"   ".isEmpty();     // false

"Average %.2f".formatted(8.457);`,
			),
			title: { es: 'Partir, unir y formatear', en: 'Split, join and format' },
			subtitles: [
				say('`split` parte una cadena en un `String[]` y `String.join` vuelve a unirla.', '`split` breaks a string into a `String[]` and `String.join` joins it back.'),
				say('`strip()` e `isBlank()` son la versión moderna de `trim()` e `isEmpty()`.', '`strip()` and `isBlank()` are the modern version of `trim()` and `isEmpty()`.'),
				say('`formatted` controla los decimales y los bloques de texto evitan los escapes.', '`formatted` controls decimals and text blocks avoid escapes.'),
			],
		},

		// ─── 11. StringBuilder (motion) ─────────────────────────────────────
		{
			id: 'builder-cost',
			chapter: 'builder',
			scene: 'sb',
			title: { es: 'El costo de concatenar en un bucle', en: 'The cost of concatenating in a loop' },
			subtitles: builderCost.list,
			motion: {
				cues: [
					{ at: 0, do: 'type', el: 'sb-tl', dur: 1500 },
					{ at: 900, do: 'enter', el: 'l1' },
					{ at: 1900, do: 'enter', el: 'l2' },
					{ at: 2900, do: 'enter', el: 'l3' },
					{ at: 3900, do: 'enter', el: 'l4' },
					{ at: builderCost.start(1), do: 'enter', el: 'l-note' },
					{ at: builderCost.start(1) + 600, do: 'pulse', el: 'l4' },
					{ at: builderCost.start(2), do: 'type', el: 'sb-tr', dur: 1500 },
					{ at: builderCost.start(2) + 1000, do: 'enter', el: 'r-buf' },
					{ at: builderCost.start(2) + 1700, do: 'type', el: 'b1', dur: 500 },
					{ at: builderCost.start(2) + 2300, do: 'type', el: 'b2', dur: 500 },
					{ at: builderCost.start(2) + 2900, do: 'type', el: 'b3', dur: 500 },
					{ at: builderCost.start(2) + 3500, do: 'type', el: 'b4', dur: 500 },
					{ at: builderCost.start(2) + 4300, do: 'enter', el: 'r-note' },
				],
			},
		},
		{
			id: 'builder-api',
			chapter: 'builder',
			scene: 'builder-when',
			show: ['bw-single', 'bw-loop'],
			code: code(
				'Constructor.java',
				`StringBuilder sb = new StringBuilder("Hola");

sb.append(" mundo");       // "Hola mundo"
sb.insert(0, ">> ");       // ">> Hola mundo"
sb.deleteCharAt(0);        // "> Hola mundo"
sb.reverse();

String frase = sb.toString();`,
				`StringBuilder sb = new StringBuilder("Hello");

sb.append(" world");       // "Hello world"
sb.insert(0, ">> ");       // ">> Hello world"
sb.deleteCharAt(0);        // "> Hello world"
sb.reverse();

String frase = sb.toString();`,
			),
			title: { es: 'La API de StringBuilder', en: 'The StringBuilder API' },
			subtitles: [
				say('`append`, `insert`, `replace`, `deleteCharAt` y `reverse` modifican el mismo objeto.', '`append`, `insert`, `replace`, `deleteCharAt` and `reverse` modify the same object.'),
				say('Cada método devuelve el mismo StringBuilder: por eso se encadenan.', 'Each method returns the same StringBuilder: that is why they chain.'),
			],
		},
		{
			id: 'builder-when',
			chapter: 'builder',
			scene: 'builder-when',
			show: '*',
			focus: ['bw-loop'],
			title: { es: 'Cuándo usarlo y cuándo no', en: 'When to use it and when not' },
			subtitles: [
				say('En una sola expresión el compilador ya optimiza la concatenación: no hace falta StringBuilder.', 'In a single expression the compiler already optimizes concatenation: no StringBuilder needed.'),
				say('Dentro de un bucle largo, StringBuilder es una necesidad, no una preferencia.', 'Inside a long loop, StringBuilder is a necessity, not a preference.'),
				say('`StringBuffer` es lo mismo pero sincronizado y más lento: usá StringBuilder.', '`StringBuffer` is the same but synchronized and slower: use StringBuilder.'),
			],
		},

		// ─── 12. Common mistakes ────────────────────────────────────────────
		{
			id: 'errors-first',
			chapter: 'errors',
			scene: 'errors04',
			show: ['er1', 'er2', 'er3', 'er4', 'er5'],
			focus: ['er1', 'er2', 'er3', 'er4', 'er5'],
			title: { es: 'Errores frecuentes (1 de 2)', en: 'Common mistakes (1 of 2)' },
			subtitles: [
				say('Confundir `array.length` con `texto.length()`: uno es atributo y el otro método.', 'Mixing up `array.length` and `texto.length()`: one is an attribute, the other a method.'),
				say('Comparar cadenas con `==`, olvidar asignar el resultado o iterar hasta `<= length`.', 'Comparing strings with `==`, forgetting to assign the result or looping up to `<= length`.'),
			],
		},
		{
			id: 'errors-second',
			chapter: 'errors',
			scene: 'errors04',
			show: '*',
			focus: ['er6', 'er7', 'er8', 'er9'],
			title: { es: 'Errores frecuentes (2 de 2)', en: 'Common mistakes (2 of 2)' },
			subtitles: [
				say('Usar `binarySearch` sin ordenar o esperar que `copyOf` clone los objetos.', 'Using `binarySearch` without sorting or expecting `copyOf` to clone the objects.'),
				say('Imprimir una matriz con `toString` o recorrer un `String[]` recién creado sin llenarlo.', 'Printing a matrix with `toString` or walking a freshly created `String[]` without filling it.'),
				say('Y concatenar dentro de un bucle largo: ahí va `StringBuilder`.', 'And concatenating inside a long loop: that is where `StringBuilder` goes.'),
			],
		},

		// ─── 13. Exercises and closing ──────────────────────────────────────
		{
			id: 'ex-palindrome',
			chapter: 'exercises',
			scene: 'exercises',
			show: ['ex1', 'ex2', 'ex3', 'ex4'],
			focus: ['ex1'],
			code: code(
				'Palindromo.java',
				`String limpio = texto.replace(" ", "").toLowerCase();
String reves = new StringBuilder(limpio).reverse().toString();

return limpio.equals(reves);`,
			),
			title: { es: 'Ejercicio 1: palíndromos', en: 'Exercise 1: palindromes' },
			subtitles: [
				say('Ejercicio 1: un palíndromo ignora espacios y mayúsculas y se lee igual en los dos sentidos.', 'Exercise 1: a palindrome ignores spaces and case and reads the same both ways.'),
				say('Normalizá, invertí con StringBuilder y compará con `.equals()`.', 'Normalize, reverse with StringBuilder and compare with `.equals()`.'),
			],
		},
		{
			id: 'ex-stats',
			chapter: 'exercises',
			scene: 'exercises',
			show: ['ex1', 'ex2', 'ex3', 'ex4'],
			focus: ['ex2'],
			code: code(
				'Estadisticas.java',
				`int[] datos = {42, 12, 89, 7, 23};

int max = datos[0];
int suma = 0;
for (int n : datos) {
    if (n > max) max = n;
    suma += n;
}
double promedio = (double) suma / datos.length;`,
			),
			title: { es: 'Ejercicio 2: estadísticas de un array', en: 'Exercise 2: array statistics' },
			subtitles: [
				say('Ejercicio 2: estadísticas de un array: suma, máximo, mínimo y promedio.', 'Exercise 2: array statistics: sum, maximum, minimum and average.'),
				say('Un solo recorrido alcanza, o `Arrays.stream` sin bucles.', 'A single pass is enough, or `Arrays.stream` with no loops.'),
			],
		},
		{
			id: 'ex-words',
			chapter: 'exercises',
			scene: 'exercises',
			show: ['ex1', 'ex2', 'ex3', 'ex4'],
			focus: ['ex3'],
			code: code(
				'Palabras.java',
				`String[] palabras = texto.strip().split("\\\\s+");

String masLarga = palabras[0];
for (String p : palabras) {
    if (p.length() > masLarga.length()) masLarga = p;
}`,
			),
			title: { es: 'Ejercicio 3: contar palabras', en: 'Exercise 3: count words' },
			subtitles: [
				say('Ejercicio 3: contar palabras y encontrar la más larga con `split`.', 'Exercise 3: count words and find the longest one with `split`.'),
				say('Recorrés el `String[]` guardando la más larga que viste.', 'You walk the `String[]` keeping the longest one seen.'),
			],
		},
		{
			id: 'ex-transpose',
			chapter: 'exercises',
			scene: 'exercises',
			show: '*',
			focus: ['ex4'],
			code: code(
				'Transponer.java',
				`int[][] t = new int[cols][filas];

for (int f = 0; f < filas; f++) {
    for (int c = 0; c < cols; c++) {
        t[c][f] = m[f][c];
    }
}`,
			),
			title: { es: 'Ejercicio 4: transponer una matriz', en: 'Exercise 4: transpose a matrix' },
			subtitles: [
				say('Ejercicio 4: transponer una matriz intercambia filas por columnas.', 'Exercise 4: transposing a matrix swaps rows and columns.'),
				say('El resultado tiene `columnas × filas` y se llena con `t[c][f] = m[f][c]`.', 'The result is `columns × rows` and is filled with `t[c][f] = m[f][c]`.'),
			],
		},
		{
			id: 'closing-takeaways',
			chapter: 'exercises',
			scene: 'closing04',
			show: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9'],
			focus: [],
			title: { es: 'Para llevarte', en: 'Takeaways' },
			subtitles: [
				say('Contiguo, fijo, desde 0: de la memoria salen las reglas del array.', 'Contiguous, fixed, from 0: the array rules come from memory.'),
				say('String es inmutable, `==` compara identidad y `.equals()` el contenido.', 'String is immutable, `==` compares identity and `.equals()` the content.'),
				say('Y `StringBuilder` cuando concatenás dentro de un bucle.', 'And `StringBuilder` when you concatenate inside a loop.'),
			],
		},
		{
			id: 'closing-repo',
			chapter: 'exercises',
			scene: 'closing04',
			show: '*',
			focus: ['repo'],
			title: { es: 'Código real para profundizar', en: 'Real code to go deeper' },
			subtitles: [
				say('Reforzá todo con 33 ejercicios en el repositorio del curso.', 'Reinforce everything with 33 exercises in the course repository.'),
				say('Clonalo, abrí `l04_arrays_y_strings` y ejecutá cada programa mientras releés la lección.', 'Clone it, open `l04_arrays_y_strings` and run each program while you reread the lesson.'),
			],
		},
	],
};
