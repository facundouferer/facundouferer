import type { LessonReference } from './presentations';

export type AnimationTag = 'Java';

/**
 * A step-by-step explanatory animation. Unlike presentations, every animation
 * is bound to exactly one course lesson: the lesson page links to it and the
 * animation page links back to the lesson. The actual steps live in
 * `src/data/animations/<slug>.ts` and the scenes in
 * `src/components/animaciones/<slug>.astro`.
 */
export interface Animation {
	slug: string;
	image: string;
	tag: {
		es: AnimationTag;
		en: string;
	};
	title: {
		es: string;
		en: string;
	};
	description: {
		es: string;
		en: string;
	};
	/** Approximate watch time in minutes, shown on the lesson card. */
	minutes: number;
	lesson: LessonReference;
}

export const animations: Animation[] = [
	{
		slug: 'conceptos-basicos-java',
		image: '/img/animations/conceptos-basicos-java.svg',
		tag: { es: 'Java', en: 'Java' },
		title: {
			es: 'Conceptos básicos de Java, paso a paso',
			en: 'Java basics, step by step',
		},
		description: {
			es: 'Recorrido animado por la plataforma Java (JDK, JRE, JVM), el flujo de compilación, la anatomía de HolaMundo, la consola, los argumentos, las convenciones, el Javadoc y los errores comunes.',
			en: 'An animated walkthrough of the Java platform (JDK, JRE, JVM), the compilation flow, the anatomy of HolaMundo, the terminal, arguments, conventions, Javadoc and common mistakes.',
		},
		minutes: 14,
		lesson: { course: 'java', slug: '01-conceptos-basicos' },
	},
	{
		slug: 'variables-tipos-datos-java',
		image: '/img/animations/variables-tipos-datos-java.svg',
		tag: { es: 'Java', en: 'Java' },
		title: {
			es: 'Variables, tipos de datos y operadores, paso a paso',
			en: 'Variables, data types and operators, step by step',
		},
		description: {
			es: 'Recorrido animado por la declaración de variables y constantes, el ámbito, los tipos primitivos y por referencia, el casting y los operadores.',
			en: 'An animated walkthrough of variable and constant declarations, scope, primitive and reference types, casting and operators.',
		},
		minutes: 14,
		lesson: { course: 'java', slug: '02-variables-tipos-datos-y-operadores' },
	},
	{
		slug: 'control-flujo-bucles-java',
		image: '/img/animations/control-flujo-bucles-java.svg',
		tag: { es: 'Java', en: 'Java' },
		title: {
			es: 'Control de flujo y bucles, paso a paso',
			en: 'Control flow and loops, step by step',
		},
		description: {
			es: 'Recorrido animado por if, else if, else, switch, los bucles while, do-while y for, y el control con break y continue.',
			en: 'An animated walkthrough of if, else if, else, switch, the while, do-while and for loops, and control with break and continue.',
		},
		minutes: 12,
		lesson: { course: 'java', slug: '03-control-de-flujo-y-bucles' },
	},
	{
		slug: 'arrays-strings-java',
		image: '/img/animations/arrays-strings-java.svg',
		tag: { es: 'Java', en: 'Java' },
		title: {
			es: 'Arrays y Strings, paso a paso',
			en: 'Arrays and Strings, step by step',
		},
		description: {
			es: 'Recorrido animado por la memoria de los arrays, su recorrido, matrices, java.util.Arrays, la inmutabilidad de String, el String Pool y StringBuilder.',
			en: 'An animated walkthrough of array memory, traversal, matrices, java.util.Arrays, String immutability, the String Pool and StringBuilder.',
		},
		minutes: 16,
		lesson: { course: 'java', slug: '04-arrays-y-strings' },
	},
	{
		slug: 'herencia-polimorfismo-java',
		image: '/img/animations/herencia-polimorfismo-java.svg',
		tag: { es: 'Java', en: 'Java' },
		title: {
			es: 'Herencia, polimorfismo y sobrecarga, paso a paso',
			en: 'Inheritance, polymorphism and overloading, step by step',
		},
		description: {
			es: 'Recorrido animado por extends, la cadena de constructores con super, @Override, la diferencia entre sobrecarga y sobrescritura, el despacho dinámico, instanceof, la composición y la clase Object.',
			en: 'An animated walkthrough of extends, the constructor chain with super, @Override, overloading versus overriding, dynamic dispatch, instanceof, composition and the Object class.',
		},
		minutes: 15,
		lesson: { course: 'java', slug: '08-herencia-polimorfismo-y-sobrecarga' },
	},
	{
		slug: 'viaje-llamada-polimorfica-java',
		image: '/img/animations/viaje-llamada-polimorfica-java.svg',
		tag: { es: 'Java', en: 'Java' },
		title: {
			es: 'El viaje de una llamada polimórfica',
			en: 'The journey of a polymorphic call',
		},
		description: {
			es: 'Un corto de dos minutos que sigue a v.arrancar() desde una variable Vehiculo hasta el objeto Auto real: qué revisa el compilador, cómo el despacho dinámico elige la sobrescritura, qué hace super y por qué la sobrecarga se decide antes de ejecutar.',
			en: 'A two-minute short that follows v.start() from a Vehicle variable to the real Car object: what the compiler checks, how dynamic dispatch picks the override, what super does and why overloading is decided before running.',
		},
		minutes: 2,
		lesson: { course: 'java', slug: '08-herencia-polimorfismo-y-sobrecarga' },
	},
	{
		slug: 'abstractas-interfaces-java',
		image: '/img/animations/abstractas-interfaces-java.svg',
		tag: { es: 'Java', en: 'Java' },
		title: {
			es: 'Clases abstractas e interfaces, paso a paso',
			en: 'Abstract classes and interfaces, step by step',
		},
		description: {
			es: 'Recorrido animado por las clases abstractas y las interfaces, default, static y adaptadoras, la implementación de varios contratos, cuándo elegir cada una, los packages y el FQCN, y la asociación, agregación y composición.',
			en: 'An animated walkthrough of abstract classes and interfaces, default, static and adapter classes, implementing several contracts, when to pick each one, packages and the FQCN, and association, aggregation and composition.',
		},
		minutes: 15,
		lesson: { course: 'java', slug: '09-clases-abstractas-interfaces-y-modelado' },
	},
	{
		slug: 'viaje-contrato-interfaz-java',
		image: '/img/animations/viaje-contrato-interfaz-java.svg',
		tag: { es: 'Java', en: 'Java' },
		title: {
			es: 'El viaje de un contrato: de la interfaz al objeto',
			en: 'The journey of a contract: from the interface to the object',
		},
		description: {
			es: 'Un corto animado de dos minutos que sigue al contrato Pagable desde la interfaz hasta el objeto: la clase abstracta que lo deja incompleto, el compilador que rechaza instanciarla, la clase concreta que lo completa y la llamada que main hace a través de la interfaz.',
			en: 'A two-minute animated short that follows the Payable contract from the interface to the object: the abstract class that leaves it incomplete, the compiler refusing to instantiate it, the concrete class that completes it and the call main makes through the interface.',
		},
		minutes: 2,
		lesson: { course: 'java', slug: '09-clases-abstractas-interfaces-y-modelado' },
	},
	{
		slug: 'excepciones-java',
		image: '/img/animations/excepciones-java.svg',
		tag: { es: 'Java', en: 'Java' },
		title: {
			es: 'Excepciones y manejo de errores, paso a paso',
			en: 'Exceptions and error handling, step by step',
		},
		description: {
			es: 'Recorrido animado por la jerarquía Throwable, el flujo de try, catch y finally, checked y unchecked, la propagación por la pila de llamadas, el orden de los catch, try-with-resources, las excepciones propias con su causa y los antipatrones.',
			en: 'An animated walkthrough of the Throwable hierarchy, the try, catch and finally flow, checked and unchecked exceptions, propagation up the call stack, catch ordering, try-with-resources, custom exceptions with their cause, and common antipatterns.',
		},
		minutes: 14,
		lesson: { course: 'java', slug: '10-excepciones-y-manejo-de-errores' },
	},
	{
		slug: 'viaje-excepcion-java',
		image: '/img/animations/viaje-excepcion-java.svg',
		tag: { es: 'Java', en: 'Java' },
		title: {
			es: 'El viaje de una excepción',
			en: 'The journey of an exception',
		},
		description: {
			es: 'Un corto animado de dos minutos: el flujo normal de un programa, la excepción que lo interrumpe, su propagación por la pila de llamadas, la captura en un catch, el bloque finally y cómo el programa continúa.',
			en: 'A two-minute animated short: the normal flow of a program, the exception that interrupts it, its propagation through the call stack, the capture in a catch, the finally block and how the program carries on.',
		},
		minutes: 2,
		lesson: { course: 'java', slug: '10-excepciones-y-manejo-de-errores' },
	},
	{
		slug: 'collections-genericos-java',
		image: '/img/animations/collections-genericos-java.svg',
		tag: { es: 'Java', en: 'Java' },
		title: {
			es: 'Java Collections Framework y genéricos, paso a paso',
			en: 'Java Collections Framework and generics, step by step',
		},
		description: {
			es: 'Recorrido animado por la jerarquía del Java Collections Framework, los genéricos, List, Set y Map, ArrayList contra LinkedList, el funcionamiento interno de HashMap, las clases y métodos genéricos propios y el borrado de tipos.',
			en: 'An animated walkthrough of the Java Collections Framework hierarchy, generics, List, Set and Map, ArrayList against LinkedList, how a HashMap works inside, your own generic classes and methods, and type erasure.',
		},
		minutes: 16,
		lesson: { course: 'java', slug: '13-java-collections-framework-y-genericos' },
	},
	{
		slug: 'viaje-clave-hashmap-java',
		image: '/img/animations/viaje-clave-hashmap-java.svg',
		tag: { es: 'Java', en: 'Java' },
		title: {
			es: 'El viaje de una clave por un HashMap',
			en: 'The journey of a key through a HashMap',
		},
		description: {
			es: 'Un corto animado de dos minutos que sigue una clave desde put hasta su bucket: hashCode(), la máscara, una colisión que equals() resuelve y un get que repite el mismo camino.',
			en: 'A two-minute animated short that follows a key from put to its bucket: hashCode(), the mask, a collision that equals() resolves and a get that repeats the same path.',
		},
		minutes: 2,
		lesson: { course: 'java', slug: '13-java-collections-framework-y-genericos' },
	},
	{
		slug: 'iteradores-ordenamiento-java',
		image: '/img/animations/iteradores-ordenamiento-java.svg',
		tag: { es: 'Java', en: 'Java' },
		title: {
			es: 'Iteradores, ordenamiento, equals y hashCode, paso a paso',
			en: 'Iterators, sorting, equals and hashCode, step by step',
		},
		description: {
			es: 'Recorrido animado por el iterador detrás del for-each, ConcurrentModificationException, Comparable y Comparator, el contrato equals/hashCode con los cajones de un HashSet y la trampa del TreeSet.',
			en: 'An animated walkthrough of the iterator behind the for-each, ConcurrentModificationException, Comparable and Comparator, the equals/hashCode contract with HashSet buckets and the TreeSet trap.',
		},
		minutes: 16,
		lesson: { course: 'java', slug: '14-iteradores-ordenamiento-equals-hashcode' },
	},
	{
		slug: 'viaje-comparacion-ordenamiento-java',
		image: '/img/animations/viaje-comparacion-ordenamiento-java.svg',
		tag: { es: 'Java', en: 'Java' },
		title: {
			es: 'El viaje de una comparación: cómo se ordena una lista',
			en: 'The journey of a comparison: how a list gets sorted',
		},
		description: {
			es: 'Un corto de dos minutos: por qué Java rechaza ordenar una lista de Libro, cómo compareTo responde cada comparación con un signo y cómo un Comparator aporta otro orden sin tocar la clase.',
			en: 'A two-minute short: why Java refuses to sort a list of Book, how compareTo answers each comparison with a sign, and how a Comparator supplies another order without touching the class.',
		},
		minutes: 2,
		lesson: { course: 'java', slug: '14-iteradores-ordenamiento-equals-hashcode' },
	},
	{
		slug: 'metodos-funciones-java',
		image: '/img/animations/metodos-funciones-java.svg',
		tag: { es: 'Java', en: 'Java' },
		title: {
			es: 'El viaje de una llamada a un método',
			en: 'The journey of a method call',
		},
		description: {
			es: 'Un corto de dos minutos que sigue una llamada desde main hasta la pila de llamadas (Call Stack): el marco que se apila, la copia por valor de los argumentos, el return que devuelve el resultado y cómo el marco desaparece.',
			en: 'A two-minute short that follows a call from main onto the Call Stack: the pushed stack frame, pass-by-value argument copying, the return statement delivering the result and how the frame disappears.',
		},
		minutes: 2,
		lesson: { course: 'java', slug: '05-metodos-y-funciones' },
	},
	{
		slug: 'introduccion-pilares-poo-java',
		image: '/img/animations/introduccion-pilares-poo-java.svg',
		tag: { es: 'Java', en: 'Java' },
		title: {
			es: 'El viaje hacia un objeto: los cuatro pilares de la POO',
			en: 'The journey to an object: the four pillars of OOP',
		},
		description: {
			es: 'Un corto de dos minutos que muestra cómo variables sueltas se reúnen en un objeto con estado y comportamiento propios: abstracción, encapsulamiento, herencia y polimorfismo en acción.',
			en: 'A two-minute short showing how scattered variables come together into an object with its own state and behavior: abstraction, encapsulation, inheritance and polymorphism in action.',
		},
		minutes: 2,
		lesson: { course: 'java', slug: '06-introduccion-y-pilares-poo' },
	},
	{
		slug: 'clases-objetos-java',
		image: '/img/animations/clases-objetos-java.svg',
		tag: { es: 'Java', en: 'Java' },
		title: {
			es: 'El viaje de new: del molde en la clase al objeto en el Heap',
			en: 'The journey of new: from the class blueprint to the Heap object',
		},
		description: {
			es: 'Un corto de dos minutos que sigue a new cuando reserva memoria en el Heap a partir de una clase, guarda la referencia en el Stack, modifica atributos independientes y muestra qué pasa cuando dos variables apuntan al mismo objeto.',
			en: 'A two-minute short that follows new as it allocates Heap memory from a class, stores the reference on the Stack, mutates independent attributes and shows what happens when two variables point to the same object.',
		},
		minutes: 2,
		lesson: { course: 'java', slug: '07-fundamentos-poo-clases-y-objetos' },
	},
	{
		slug: 'constructores-encapsulamiento-java',
		image: '/img/animations/constructores-encapsulamiento-java.svg',
		tag: { es: 'Java', en: 'Java' },
		title: {
			es: 'El viaje de un dato privado: constructores y encapsulamiento',
			en: 'The journey of a private field: constructors and encapsulation',
		},
		description: {
			es: 'Un corto de dos minutos que sigue la inicialización de un objeto con su constructor y this, el bloqueo del compilador ante un atributo private y cómo el setter valida la regla antes de cambiar el estado.',
			en: 'A two-minute short that follows object initialization with its constructor and this, the compiler blocking direct access to a private field, and how the setter validates the rule before changing state.',
		},
		minutes: 2,
		lesson: { course: 'java', slug: '07-constructores-y-encapsulamiento' },
	},
	{
		slug: 'arrays-objetos-java',
		image: '/img/animations/arrays-objetos-java.svg',
		tag: { es: 'Java', en: 'Java' },
		title: {
			es: 'El viaje por un array de objetos: de null a las instancias',
			en: 'The journey through an array of objects: from null to instances',
		},
		description: {
			es: 'Un corto de dos minutos que muestra por qué new Persona[3] solo crea casilleros en null, el tropiezo de NullPointerException en una celda vacía, cómo cada índice enlaza su objeto en el Heap y cómo recorrerlos.',
			en: 'A two-minute short showing why new Person[3] only creates null slots, the NullPointerException trap on an empty cell, how each index links its Heap object, and how to traverse them.',
		},
		minutes: 2,
		lesson: { course: 'java', slug: '09-arrays-de-objetos' },
	},
	{
		slug: 'tad-listas-java',
		image: '/img/animations/tad-listas-java.svg',
		tag: { es: 'Java', en: 'Java' },
		title: {
			es: 'El viaje de un nodo: listas estáticas frente a enlazadas',
			en: 'The journey of a node: static lists versus linked lists',
		},
		description: {
			es: 'Un corto de dos minutos que compara desplazar elementos en un arreglo fijo con enlazar nodos mediante referencias siguiente en una lista dinámica.',
			en: 'A two-minute short comparing shifting elements in a fixed array against linking nodes through next references in a dynamic list.',
		},
		minutes: 2,
		lesson: { course: 'java', slug: '11-tad-listas-estaticas-y-dinamicas' },
	},
	{
		slug: 'tad-pilas-colas-java',
		image: '/img/animations/tad-pilas-colas-java.svg',
		tag: { es: 'Java', en: 'Java' },
		title: {
			es: 'El viaje por una pila y una cola: LIFO frente a FIFO',
			en: 'The journey through a stack and a queue: LIFO versus FIFO',
		},
		description: {
			es: 'Un corto de dos minutos que sigue a los mismos elementos al apilar y desapilar por el tope (LIFO) y al encolar por el fondo y desencolar por el frente (FIFO).',
			en: 'A two-minute short that follows the same elements as they push and pop at the top of a stack (LIFO) and enqueue at the rear and dequeue at the front of a queue (FIFO).',
		},
		minutes: 2,
		lesson: { course: 'java', slug: '12-tad-pilas-y-colas' },
	},
	{
		slug: 'arboles-binarios-java',
		image: '/img/animations/arboles-binarios-java.svg',
		tag: { es: 'Java', en: 'Java' },
		title: {
			es: 'El viaje de una búsqueda en un árbol binario (ABB)',
			en: 'The journey of a search in a binary search tree (BST)',
		},
		description: {
			es: 'Un corto de dos minutos que sigue una clave desde la raíz de un ABB, doblando a la izquierda o a la derecha para descartar subárboles enteros, y cómo el recorrido inorden devuelve las claves ordenadas.',
			en: 'A two-minute short that follows a key from the root of a BST, branching left or right to discard whole subtrees, and how in-order traversal yields the keys in sorted order.',
		},
		minutes: 2,
		lesson: { course: 'java', slug: '15-tad-arboles-binarios-y-busqueda' },
	},
	{
		slug: 'grafos-java',
		image: '/img/animations/grafos-java.svg',
		tag: { es: 'Java', en: 'Java' },
		title: {
			es: 'El viaje por un grafo: de BFS al camino mínimo con Dijkstra',
			en: 'The journey through a graph: from BFS to Dijkstra shortest path',
		},
		description: {
			es: 'Un corto de dos minutos que recorre una lista de adyacencia por capas con la cola de BFS y luego relaja aristas con peso para encontrar la ruta más corta con Dijkstra.',
			en: 'A two-minute short that explores an adjacency list layer by layer with a BFS queue and then relaxes weighted edges to find the shortest path with Dijkstra.',
		},
		minutes: 2,
		lesson: { course: 'java', slug: '16-grafos-representacion-y-algoritmos' },
	},
	{
		slug: 'archivos-jar-java',
		image: '/img/animations/archivos-jar-java.svg',
		tag: { es: 'Java', en: 'Java' },
		title: {
			es: 'El viaje de un dato al disco y al archivo JAR',
			en: 'The journey of data to disk and into a JAR file',
		},
		description: {
			es: 'Un corto de dos minutos que muestra por qué el Heap se evapora al terminar main, cómo try-with-resources y BufferedWriter persisten datos en disco, y cómo MANIFEST.MF empaqueta las clases en un JAR ejecutable.',
			en: 'A two-minute short showing why the Heap vanishes when main ends, how try-with-resources and BufferedWriter persist data to disk, and how MANIFEST.MF packages classes into an executable JAR.',
		},
		minutes: 2,
		lesson: { course: 'java', slug: '17-archivos-persistencia-y-empaquetado-jar' },
	},
	{
		slug: 'concurrencia-hilos-java',
		image: '/img/animations/concurrencia-hilos-java.svg',
		tag: { es: 'Java', en: 'Java' },
		title: {
			es: 'El viaje de dos hilos: de la condición de carrera al cerrojo',
			en: 'The journey of two threads: from a race condition to the lock',
		},
		description: {
			es: 'Un corto de dos minutos que sigue a dos hilos pisándose al incrementar un contador compartido, cómo synchronized serializa el paso con un monitor y cómo un pool reutiliza hilos.',
			en: 'A two-minute short that follows two threads overwriting each other on a shared counter, how synchronized serializes access with a monitor lock, and how a thread pool reuses workers.',
		},
		minutes: 2,
		lesson: { course: 'java', slug: '19-programacion-concurrente-hilos-y-pools' },
	},
	{
		slug: 'jdbc-java',
		image: '/img/animations/jdbc-java.svg',
		tag: { es: 'Java', en: 'Java' },
		title: {
			es: 'El viaje de una consulta SQL por JDBC: parámetros y transacción',
			en: 'The journey of a SQL query through JDBC: parameters and transaction',
		},
		description: {
			es: 'Un corto de dos minutos que contrasta el peligro de concatenar SQL con un PreparedStatement que separa consulta y parámetros ?, y cómo commit o rollback protegen la transacción.',
			en: 'A two-minute short contrasting the danger of concatenating SQL with a PreparedStatement that separates query and ? parameters, and how commit or rollback protects the transaction.',
		},
		minutes: 2,
		lesson: { course: 'java', slug: '19-acceso-a-bases-de-datos-jdbc' },
	},
	{
		slug: 'algoritmia-complejidad-java',
		image: '/img/animations/algoritmia-complejidad-java.svg',
		tag: { es: 'Java', en: 'Java' },
		title: {
			es: 'El viaje de un algoritmo: contrato, invariante y O(log n)',
			en: 'The journey of an algorithm: contract, invariant and O(log n)',
		},
		description: {
			es: 'Un corto de dos minutos que sigue la precondición de un método, el invariante que sostiene cada vuelta y la diferencia entre revisar elemento por elemento O(n) y partir el arreglo a la mitad O(log n).',
			en: 'A two-minute short that follows a method precondition, the loop invariant holding on every iteration, and the contrast between scanning one by one O(n) and halving the array O(log n).',
		},
		minutes: 2,
		lesson: { course: 'java', slug: '23-algoritmia-verificacion-y-complejidad' },
	},
	{
		slug: 'arboles-n-arios-java',
		image: '/img/animations/arboles-n-arios-java.svg',
		tag: { es: 'Java', en: 'Java' },
		title: {
			es: 'El viaje por un árbol N-ario: primer hijo, siguiente hermano y vectores',
			en: 'The journey through an N-ary tree: first child, next sibling and arrays',
		},
		description: {
			es: 'Un corto de dos minutos que transforma una jerarquía con muchos hijos por nodo en dos punteros fijos (primerHijo y siguienteHermano) y la almacena en vectores paralelos de índices padre.',
			en: 'A two-minute short that transforms a hierarchy with many children per node into two fixed pointers (firstChild and nextSibling) and stores it in parallel parent-index arrays.',
		},
		minutes: 2,
		lesson: { course: 'java', slug: '26-arboles-n-arios-y-representacion-con-vectores' },
	},
];

/**
 * Animations bound to one lesson, in catalog order. Returns `[]` when the
 * lesson has none, mirroring `getPresentationsForLesson`.
 */
export function getAnimationsForLesson(course: string, slug: string): Animation[] {
	return animations.filter((animation) => animation.lesson.course === course && animation.lesson.slug === slug);
}

/**
 * Lesson slug -> animation count for one course. Lessons without animations are
 * absent from the map, mirroring `getPresentationCountsForCourse`.
 */
export function getAnimationCountsForCourse(course: string): Record<string, number> {
	const counts: Record<string, number> = {};
	for (const animation of animations) {
		if (animation.lesson.course !== course) continue;
		counts[animation.lesson.slug] = (counts[animation.lesson.slug] ?? 0) + 1;
	}
	return counts;
}

/** The owning lesson of an animation slug, or `undefined` for an unknown slug. */
export function getLessonForAnimation(slug: string): LessonReference | undefined {
	return animations.find((animation) => animation.slug === slug)?.lesson;
}
