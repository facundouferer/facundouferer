import type { LessonReference } from './presentations';

export type AnimationTag = 'Java' | 'Git' | 'C';

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
	{
		slug: 'tres-estados-git',
		image: '/img/animations/tres-estados-git.svg',
		tag: { es: 'Git', en: 'Git' },
		title: {
			es: 'El viaje de un archivo por las tres zonas de Git',
			en: 'The journey of a file through Git\'s three zones',
		},
		description: {
			es: 'Un corto de dos minutos que sigue a hola.txt por el Working Directory, el Staging Area y el repositorio: git add, git commit, qué comparan git diff y git diff --staged, cómo sacar un cambio con git restore --staged y cómo se encadenan los commits.',
			en: 'A two-minute short that follows hello.txt through the Working Directory, the Staging Area and the repository: git add, git commit, what git diff and git diff --staged compare, how git restore --staged takes a change out, and how commits chain.',
		},
		minutes: 2,
		lesson: { course: 'git', slug: 'el-principio-con-git' },
	},
	{
		slug: 'deshacer-cambios-git',
		image: '/img/animations/deshacer-cambios-git.svg',
		tag: { es: 'Git', en: 'Git' },
		title: {
			es: 'El viaje de HEAD: deshacer sin perder trabajo',
			en: 'The journey of HEAD: undoing without losing work',
		},
		description: {
			es: 'Un corto de dos minutos que sigue a HEAD sobre una cadena de commits: restore descarta, amend reemplaza, revert agrega un commit inverso, reset mueve HEAD en sus tres modos y reflog recupera lo perdido.',
			en: 'A two-minute short that follows HEAD along a chain of commits: restore discards, amend replaces, revert adds an inverse commit, reset moves HEAD in its three modes and reflog recovers what was lost.',
		},
		minutes: 2,
		lesson: { course: 'git', slug: 'deshacer-cambios' },
	},
	{
		slug: 'ramas-conflictos-git',
		image: '/img/animations/ramas-conflictos-git.svg',
		tag: { es: 'Git', en: 'Git' },
		title: {
			es: 'El viaje de dos ramas: del fast-forward al conflicto',
			en: 'The journey of two branches: from fast-forward to conflict',
		},
		description: {
			es: 'Un corto de dos minutos que muestra las ramas como etiquetas que se mueven, un merge fast-forward, un merge commit con dos padres y cómo se resuelve un conflicto en la misma línea.',
			en: 'A two-minute short showing branches as moving labels, a fast-forward merge, a merge commit with two parents and how a conflict on the same line is resolved.',
		},
		minutes: 2,
		lesson: { course: 'git', slug: 'conflictos' },
	},
	{
		slug: 'sincronizacion-remota-git',
		image: '/img/animations/sincronizacion-remota-git.svg',
		tag: { es: 'Git', en: 'Git' },
		title: {
			es: 'El viaje de un commit hasta GitHub y de vuelta',
			en: 'The journey of a commit to GitHub and back',
		},
		description: {
			es: 'Un corto de dos minutos que sigue un commit de Ana hasta el remoto con push, su llegada a la copia de Beto con fetch y pull, y por qué un push es rechazado cuando el remoto avanzó.',
			en: 'A two-minute short that follows a commit from Ana to the remote with push, its arrival in Bob\'s copy with fetch and pull, and why a push is rejected when the remote moved ahead.',
		},
		minutes: 2,
		lesson: { course: 'git', slug: 'bajar-y-subir-cambios' },
	},
	{
		slug: 'pull-requests-git',
		image: '/img/animations/pull-requests-git.svg',
		tag: { es: 'Git', en: 'Git' },
		title: {
			es: 'El viaje de un Pull Request: de la rama a main',
			en: 'The journey of a Pull Request: from a branch to main',
		},
		description: {
			es: 'Un corto de dos minutos que sigue una rama de trabajo publicada en GitHub, el Pull Request que pide integrarla, la revisión, la actualización con origin/main y la limpieza después del merge.',
			en: 'A two-minute short that follows a feature branch pushed to GitHub, the Pull Request that asks to integrate it, the review, the update with origin/main and the cleanup after the merge.',
		},
		minutes: 2,
		lesson: { course: 'git', slug: 'ramas-y-pull-requests' },
	},
	{
		slug: 'rebase-git',
		image: '/img/animations/rebase-git.svg',
		tag: { es: 'Git', en: 'Git' },
		title: {
			es: 'El viaje de un rebase: commits que se vuelven a aplicar',
			en: 'The journey of a rebase: commits replayed on a new base',
		},
		description: {
			es: 'Un corto de dos minutos que muestra cómo rebase vuelve a aplicar tus commits sobre origin/main con hashes nuevos, cómo se detiene ante un conflicto y por qué se publica con --force-with-lease.',
			en: 'A two-minute short showing how rebase replays your commits on top of origin/main with new hashes, how it stops on a conflict and why the result is pushed with --force-with-lease.',
		},
		minutes: 2,
		lesson: { course: 'git', slug: 'rebase-y-buenas-practicas' },
	},
	{
		slug: 'compilacion-enlazado-c',
		image: '/img/animations/compilacion-enlazado-c.svg',
		tag: { es: 'C', en: 'C' },
		title: {
			es: 'El viaje de hola.c hasta el ejecutable',
			en: 'The journey of hello.c to an executable',
		},
		description: {
			es: 'Un corto de dos minutos que sigue a un programa por el preprocesador, el compilador, el ensamblador y el enlazador: qué hace cada etapa, qué es un archivo .o, de dónde sale printf y en qué etapa falla un error de compilación y uno de enlazado.',
			en: 'A two-minute short that follows a program through the preprocessor, the compiler, the assembler and the linker: what each stage does, what an .o file is, where printf comes from, and which stage a compile error and a link error stop.',
		},
		minutes: 2,
		lesson: { course: 'c', slug: 'compilacion-y-enlazado' },
	},
	{
		slug: 'tipos-conversiones-c',
		image: '/img/animations/tipos-conversiones-c.svg',
		tag: { es: 'C', en: 'C' },
		title: {
			es: 'Cajas de bits: tipos, tamaños y conversiones',
			en: 'Boxes of bits: types, sizes and conversions',
		},
		description: {
			es: 'Un corto de dos minutos sobre cómo cada tipo ocupa una caja de tamaño distinto: sizeof y size_t, el límite de un int, la vuelta de un unsigned, la división entera frente a un cast a double y la trampa de comparar con signo y sin signo.',
			en: 'A two-minute short on how every type takes a box of a different size: sizeof and size_t, the limit of an int, an unsigned wrapping around, integer division versus a cast to double, and the trap of comparing signed and unsigned.',
		},
		minutes: 2,
		lesson: { course: 'c', slug: 'tipos-de-datos' },
	},
	{
		slug: 'pasaje-por-valor-c',
		image: '/img/animations/pasaje-por-valor-c.svg',
		tag: { es: 'C', en: 'C' },
		title: {
			es: 'Una copia viaja a la función',
			en: 'A copy travels to the function',
		},
		description: {
			es: 'Un corto de dos minutos que muestra la pila de llamadas: cada llamada recibe una copia de sus argumentos, por eso la función no puede cambiar la variable de quien llama; alcance de las variables y un contador static que sobrevive entre llamadas.',
			en: 'A two-minute short that shows the call stack: every call gets a copy of its arguments, so the function cannot change the caller\'s variable; variable scope and a static counter that survives between calls.',
		},
		minutes: 2,
		lesson: { course: 'c', slug: 'variables-parametros-y-pasaje' },
	},
	{
		slug: 'punteros-direcciones-c',
		image: '/img/animations/punteros-direcciones-c.svg',
		tag: { es: 'C', en: 'C' },
		title: {
			es: 'Una dirección que apunta',
			en: 'An address that points',
		},
		description: {
			es: 'Un corto de dos minutos sobre la memoria como celdas numeradas: &x da la dirección, un puntero la guarda, *p lee y escribe a través de ella, intercambiar recibe direcciones para cambiar las variables de quien llama y NULL no apunta a nada.',
			en: 'A two-minute short on memory as numbered cells: &x gives the address, a pointer stores it, *p reads and writes through it, swap receives addresses to change the caller\'s variables, and NULL points to nothing.',
		},
		minutes: 2,
		lesson: { course: 'c', slug: 'punteros-y-direcciones' },
	},
	{
		slug: 'punteros-arreglos-c',
		image: '/img/animations/punteros-arreglos-c.svg',
		tag: { es: 'C', en: 'C' },
		title: {
			es: 'Caminar un arreglo con un puntero',
			en: 'Walking an array with a pointer',
		},
		description: {
			es: 'Un corto de dos minutos sobre la aritmética de punteros: p + 1 avanza sizeof del elemento, a[i] es *(a + i), pasar un arreglo a una función pasa un puntero al primer elemento y el operador -> llega al campo de una estructura.',
			en: 'A two-minute short on pointer arithmetic: p + 1 moves by the element size, a[i] is *(a + i), passing an array to a function passes a pointer to its first element, and the -> operator reaches a struct field.',
		},
		minutes: 2,
		lesson: { course: 'c', slug: 'punteros-arreglos-y-estructuras' },
	},
	{
		slug: 'duracion-ciclo-vida-c',
		image: '/img/animations/duracion-ciclo-vida-c.svg',
		tag: { es: 'C', en: 'C' },
		title: {
			es: 'Lo que nace y muere en la pila',
			en: 'What is born and dies on the stack',
		},
		description: {
			es: 'Un corto de dos minutos sobre la duración de almacenamiento: las variables automáticas nacen y mueren con su bloque, las estáticas viven todo el programa y devolver la dirección de una variable local deja un puntero colgante.',
			en: 'A two-minute short on storage duration: automatic variables are born and die with their block, static ones live for the whole program, and returning the address of a local variable leaves a dangling pointer.',
		},
		minutes: 2,
		lesson: { course: 'c', slug: 'duracion-y-ciclo-de-vida' },
	},
	{
		slug: 'memoria-dinamica-c',
		image: '/img/animations/memoria-dinamica-c.svg',
		tag: { es: 'C', en: 'C' },
		title: {
			es: 'Pedir y devolver memoria',
			en: 'Asking for memory and giving it back',
		},
		description: {
			es: 'Un corto de dos minutos en el montículo: malloc reserva un bloque y puede devolver NULL, el arreglo crece con realloc usando un puntero temporal y free devuelve el bloque cuando ya no se usa.',
			en: 'A two-minute short on the heap: malloc reserves a block and may return NULL, the array grows with realloc through a temporary pointer, and free gives the block back when it is no longer used.',
		},
		minutes: 2,
		lesson: { course: 'c', slug: 'memoria-dinamica' },
	},
	{
		slug: 'errores-memoria-c',
		image: '/img/animations/errores-memoria-c.svg',
		tag: { es: 'C', en: 'C' },
		title: {
			es: 'Quién libera este bloque',
			en: 'Who frees this block',
		},
		description: {
			es: 'Un corto de dos minutos sobre la propiedad de la memoria: quién reserva, quién usa y quién libera, y los errores que aparecen cuando nadie lo sabe: fuga de memoria, uso después de liberar y doble liberación, detectados con AddressSanitizer.',
			en: 'A two-minute short on memory ownership: who allocates, who uses and who frees, and the errors that appear when nobody knows: memory leaks, use after free and double free, caught by AddressSanitizer.',
		},
		minutes: 2,
		lesson: { course: 'c', slug: 'propiedad-y-errores-de-memoria' },
	},
	{
		slug: 'decisiones-if-else-c',
		image: '/img/animations/decisiones-if-else-c.svg',
		tag: { es: 'C', en: 'C' },
		title: {
			es: 'Un camino según la condición',
			en: 'One path per condition',
		},
		description: {
			es: 'Un corto de dos minutos sobre cómo el programa elige un camino: if, else, cadenas de else if, condiciones anidadas y los errores clásicos de = frente a == y del punto y coma después del if.',
			en: 'A two-minute short on how a program picks a path: if, else, else if chains, nested conditions and the classic mistakes of = versus == and a semicolon after the if.',
		},
		minutes: 2,
		lesson: { course: 'c', slug: 'sentencia-if-else' },
	},
	{
		slug: 'operador-ternario-c',
		image: '/img/animations/operador-ternario-c.svg',
		tag: { es: 'C', en: 'C' },
		title: {
			es: 'Una expresión que elige',
			en: 'An expression that chooses',
		},
		description: {
			es: 'Un corto de dos minutos sobre el operador condicional: una expresión que vale una de dos ramas, cuándo aclara el código y cuándo lo complica.',
			en: 'A two-minute short on the conditional operator: an expression worth one of two branches, when it makes code clearer and when it makes it harder.',
		},
		minutes: 2,
		lesson: { course: 'c', slug: 'operador-ternario' },
	},
	{
		slug: 'switch-bloques-c',
		image: '/img/animations/switch-bloques-c.svg',
		tag: { es: 'C', en: 'C' },
		title: {
			es: 'El salto del switch y la vida de un bloque',
			en: 'The switch jump and the life of a block',
		},
		description: {
			es: 'Un corto de dos minutos sobre cómo switch salta a la etiqueta case que coincide, qué hace break, la caída intencional con [[fallthrough]] y el alcance de las variables de un bloque.',
			en: 'A two-minute short on how switch jumps to the matching case label, what break does, deliberate fall-through with [[fallthrough]], and the scope of block variables.',
		},
		minutes: 2,
		lesson: { course: 'c', slug: 'sentencia-switch-y-bloques-de-codigo' },
	},
	{
		slug: 'bucle-while-c',
		image: '/img/animations/bucle-while-c.svg',
		tag: { es: 'C', en: 'C' },
		title: {
			es: 'Repetir mientras se cumpla',
			en: 'Repeat while it holds',
		},
		description: {
			es: 'Un corto de dos minutos sobre el ciclo while: la condición se evalúa primero, contadores y acumuladores, el valor centinela que termina la lectura y cómo nace un ciclo infinito.',
			en: 'A two-minute short on the while loop: the condition is checked first, counters and accumulators, the sentinel value that ends the input, and how an infinite loop is born.',
		},
		minutes: 2,
		lesson: { course: 'c', slug: 'sentencia-while' },
	},
	{
		slug: 'bucle-for-c',
		image: '/img/animations/bucle-for-c.svg',
		tag: { es: 'C', en: 'C' },
		title: {
			es: 'Las tres partes del for',
			en: 'The three parts of for',
		},
		description: {
			es: 'Un corto de dos minutos sobre el ciclo for: inicialización, condición y actualización, el alcance del contador, contar hacia atrás y el error de un paso de más.',
			en: 'A two-minute short on the for loop: initialization, condition and update, the scope of the counter, counting down, and the off-by-one error.',
		},
		minutes: 2,
		lesson: { course: 'c', slug: 'sentencia-for' },
	},
	{
		slug: 'bucle-do-while-c',
		image: '/img/animations/bucle-do-while-c.svg',
		tag: { es: 'C', en: 'C' },
		title: {
			es: 'Primero hacer, después preguntar',
			en: 'Do first, ask later',
		},
		description: {
			es: 'Un corto de dos minutos sobre do-while: el cuerpo se ejecuta al menos una vez, la validación de una entrada y un menú, y adónde saltan break y continue.',
			en: 'A two-minute short on do-while: the body runs at least once, validating an input and a menu, and where break and continue jump.',
		},
		minutes: 2,
		lesson: { course: 'c', slug: 'sentencia-do-while' },
	},
	{
		slug: 'refinamiento-anidados-c',
		image: '/img/animations/refinamiento-anidados-c.svg',
		tag: { es: 'C', en: 'C' },
		title: {
			es: 'Del problema al programa, paso a paso',
			en: 'From problem to program, step by step',
		},
		description: {
			es: 'Un corto de dos minutos sobre el refinamiento sucesivo: un enunciado que se divide en pasos, el pseudocódigo que se vuelve C y dos ciclos anidados recorriendo una tabla.',
			en: 'A two-minute short on stepwise refinement: a statement split into steps, pseudocode that becomes C, and two nested loops walking a table.',
		},
		minutes: 2,
		lesson: { course: 'c', slug: 'programacion-esquematica-y-sentencias-anidadas' },
	},
	{
		slug: 'datos-secuenciales-c',
		image: '/img/animations/datos-secuenciales-c.svg',
		tag: { es: 'C', en: 'C' },
		title: {
			es: 'Datos en fila',
			en: 'Data in a row',
		},
		description: {
			es: 'Un corto de dos minutos sobre por qué agrupar datos en secuencia: acceso secuencial frente a acceso directo y tamaño fijo frente a tamaño que crece, como puente hacia los arreglos.',
			en: 'A two-minute short on why we group data in a sequence: sequential versus direct access and fixed versus growing size, as a bridge to arrays.',
		},
		minutes: 2,
		lesson: { course: 'c', slug: 'manejo-de-estructuras-secuenciales-de-datos' },
	},
	{
		slug: 'arreglos-indices-c',
		image: '/img/animations/arreglos-indices-c.svg',
		tag: { es: 'C', en: 'C' },
		title: {
			es: 'Celdas contiguas e índices',
			en: 'Contiguous cells and indexes',
		},
		description: {
			es: 'Un corto de dos minutos sobre los arreglos: celdas contiguas numeradas desde 0, el límite que no se debe cruzar, cuántos elementos calcula sizeof y una matriz guardada fila por fila.',
			en: 'A two-minute short on arrays: contiguous cells numbered from 0, the bound that must not be crossed, how many elements sizeof computes, and a matrix stored row by row.',
		},
		minutes: 2,
		lesson: { course: 'c', slug: 'arreglos-unidimensionales-y-multidimensionales' },
	},
	{
		slug: 'operaciones-arreglos-c',
		image: '/img/animations/operaciones-arreglos-c.svg',
		tag: { es: 'C', en: 'C' },
		title: {
			es: 'Recorrer, insertar y borrar',
			en: 'Traverse, insert and delete',
		},
		description: {
			es: 'Un corto de dos minutos sobre las operaciones con arreglos: recorrer para sumar y buscar el máximo, insertar corriendo los elementos a la derecha y borrar corriéndolos a la izquierda.',
			en: 'A two-minute short on array operations: traversing to sum and find the maximum, inserting by shifting elements right, and deleting by shifting them left.',
		},
		minutes: 2,
		lesson: { course: 'c', slug: 'operaciones-con-arreglos' },
	},
	{
		slug: 'cadenas-terminador-c',
		image: '/img/animations/cadenas-terminador-c.svg',
		tag: { es: 'C', en: 'C' },
		title: {
			es: 'La cadena y su terminador',
			en: 'The string and its terminator',
		},
		description: {
			es: 'Un corto de dos minutos sobre las cadenas de C: un arreglo de char que termina en el carácter nulo, la diferencia entre capacidad y longitud, leer con fgets y copiar sin desbordar.',
			en: 'A two-minute short on C strings: a char array that ends in the null character, capacity versus length, reading with fgets, and copying without overflowing.',
		},
		minutes: 2,
		lesson: { course: 'c', slug: 'cadenas-de-caracteres-y-operaciones' },
	},
	{
		slug: 'estructuras-registros-c',
		image: '/img/animations/estructuras-registros-c.svg',
		tag: { es: 'C', en: 'C' },
		title: {
			es: 'Un registro con campos',
			en: 'A record with fields',
		},
		description: {
			es: 'Un corto de dos minutos sobre struct: un registro con campos de distintos tipos, el acceso con punto, un arreglo de registros, la copia al pasarlo a una función, enum para nombrar valores y el relleno que agrega el compilador.',
			en: 'A two-minute short on struct: a record with fields of different types, access with a dot, an array of records, the copy made when passing it to a function, enum to name values, and the padding the compiler adds.',
		},
		minutes: 2,
		lesson: { course: 'c', slug: 'concepto-de-estructuras' },
	},
	{
		slug: 'busqueda-binaria-c',
		image: '/img/animations/busqueda-binaria-c.svg',
		tag: { es: 'C', en: 'C' },
		title: {
			es: 'Partir la búsqueda a la mitad',
			en: 'Halving the search',
		},
		description: {
			es: 'Un corto de dos minutos que compara la búsqueda lineal con la binaria: revisar uno por uno frente a descartar la mitad en cada paso, por qué la binaria exige un arreglo ordenado y cuántos pasos da cada una.',
			en: 'A two-minute short that compares linear and binary search: checking one by one versus discarding half at each step, why binary search needs a sorted array, and how many steps each takes.',
		},
		minutes: 2,
		lesson: { course: 'c', slug: 'busqueda-en-arreglos' },
	},
	{
		slug: 'ordenamiento-comparado-c',
		image: '/img/animations/ordenamiento-comparado-c.svg',
		tag: { es: 'C', en: 'C' },
		title: {
			es: 'Tres maneras de ordenar',
			en: 'Three ways to sort',
		},
		description: {
			es: 'Un corto de dos minutos sobre burbuja, selección e inserción sobre el mismo arreglo: qué compara e intercambia cada una, cuántas operaciones hacen, cuál es estable y cuándo conviene cada una.',
			en: 'A two-minute short on bubble, selection and insertion sort on the same array: what each one compares and swaps, how many operations they do, which one is stable, and when each fits.',
		},
		minutes: 2,
		lesson: { course: 'c', slug: 'ordenacion-de-arreglos' },
	},
	{
		slug: 'listas-enlazadas-c',
		image: '/img/animations/listas-enlazadas-c.svg',
		tag: { es: 'C', en: 'C' },
		title: {
			es: 'Nodos unidos por punteros',
			en: 'Nodes linked by pointers',
		},
		description: {
			es: 'Un corto de dos minutos sobre la lista enlazada: cada nodo se pide con malloc y apunta al siguiente, insertar al principio cambia la cabeza a través de un doble puntero, borrar reengancha los enlaces y destruir libera nodo por nodo.',
			en: 'A two-minute short on the linked list: every node is allocated with malloc and points to the next, inserting at the front changes the head through a double pointer, deleting relinks the nodes, and destroying frees them one by one.',
		},
		minutes: 2,
		lesson: { course: 'c', slug: 'estructuras-dinamicas-listas' },
	},
	{
		slug: 'pilas-lifo-c',
		image: '/img/animations/pilas-lifo-c.svg',
		tag: { es: 'C', en: 'C' },
		title: {
			es: 'El último en entrar, el primero en salir',
			en: 'Last in, first out',
		},
		description: {
			es: 'Un corto de dos minutos sobre la pila: apilar y desapilar por el tope, el error de desapilar una pila vacía, la versión con arreglo que crece con realloc y el verificador de paréntesis balanceados.',
			en: 'A two-minute short on the stack: push and pop at the top, the error of popping an empty stack, the array version that grows with realloc, and the balanced brackets checker.',
		},
		minutes: 2,
		lesson: { course: 'c', slug: 'estructuras-dinamicas-pilas' },
	},
	{
		slug: 'colas-fifo-c',
		image: '/img/animations/colas-fifo-c.svg',
		tag: { es: 'C', en: 'C' },
		title: {
			es: 'El primero en llegar, el primero en salir',
			en: 'First come, first served',
		},
		description: {
			es: 'Un corto de dos minutos sobre la cola: encolar por el final y desencolar por el frente, por qué el final debe volver a NULL cuando la cola se vacía y la cola circular sobre un arreglo.',
			en: 'A two-minute short on the queue: enqueue at the rear and dequeue at the front, why the rear must go back to NULL when the queue empties, and the circular queue on an array.',
		},
		minutes: 2,
		lesson: { course: 'c', slug: 'estructuras-dinamicas-colas' },
	},
	{
		slug: 'arbol-busqueda-c',
		image: '/img/animations/arbol-busqueda-c.svg',
		tag: { es: 'C', en: 'C' },
		title: {
			es: 'Un árbol que ordena al insertar',
			en: 'A tree that sorts as it inserts',
		},
		description: {
			es: 'Un corto de dos minutos sobre el árbol binario de búsqueda: insertar bajando a izquierda o derecha, buscar con la misma regla, los recorridos inorden, preorden y postorden, liberar en postorden y el árbol degenerado.',
			en: 'A two-minute short on the binary search tree: inserting by going left or right, searching with the same rule, the inorder, preorder and postorder traversals, freeing in postorder, and the degenerate tree.',
		},
		minutes: 2,
		lesson: { course: 'c', slug: 'arboles-binarios' },
	},
	{
		slug: 'biblioteca-errores-c',
		image: '/img/animations/biblioteca-errores-c.svg',
		tag: { es: 'C', en: 'C' },
		title: {
			es: 'Convertir sin confiar',
			en: 'Converting without trusting',
		},
		description: {
			es: 'Un corto de dos minutos sobre la biblioteca estándar y los errores: strtol con su puntero final y errno, códigos de retorno, perror y una única salida que libera los recursos en cada camino de error.',
			en: 'A two-minute short on the standard library and errors: strtol with its end pointer and errno, return codes, perror, and a single exit that releases resources on every error path.',
		},
		minutes: 2,
		lesson: { course: 'c', slug: 'biblioteca-estandar-y-errores' },
	},
	{
		slug: 'archivos-persistencia-c',
		image: '/img/animations/archivos-persistencia-c.svg',
		tag: { es: 'C', en: 'C' },
		title: {
			es: 'Del programa al disco y de vuelta',
			en: 'From the program to disk and back',
		},
		description: {
			es: 'Un corto de dos minutos sobre los archivos: fopen y su comprobación, escribir registros con fwrite y leerlos con fread contando lo que llegó, distinguir fin de archivo de un error y cerrar en todos los caminos.',
			en: 'A two-minute short on files: fopen and its check, writing records with fwrite and reading them with fread counting what arrived, telling end of file from an error, and closing on every path.',
		},
		minutes: 2,
		lesson: { course: 'c', slug: 'archivos' },
	},
	{
		slug: 'c23-novedades-c',
		image: '/img/animations/c23-novedades-c.svg',
		tag: { es: 'C', en: 'C' },
		title: {
			es: 'Lo nuevo de C23, con la etiqueta de cada cosa',
			en: 'What is new in C23, labelled',
		},
		description: {
			es: 'Un corto de dos minutos sobre C23: bool, nullptr, constexpr, typeof, atributos y #embed, y cómo distinguir qué es estándar, qué es una extensión de un compilador y qué es opcional.',
			en: 'A two-minute short on C23: bool, nullptr, constexpr, typeof, attributes and #embed, and how to tell what is standard, what is a compiler extension and what is optional.',
		},
		minutes: 2,
		lesson: { course: 'c', slug: 'c23-moderno' },
	},
	{
		slug: 'macros-genericos-c',
		image: '/img/animations/macros-genericos-c.svg',
		tag: { es: 'C', en: 'C' },
		title: {
			es: 'Texto que se reemplaza y código genérico',
			en: 'Replaced text and generic code',
		},
		description: {
			es: 'Un corto de dos minutos sobre el preprocesador: una macro reemplaza texto antes de compilar, por qué MAX(i++, j) evalúa dos veces, y cómo _Generic elige una función según el tipo.',
			en: 'A two-minute short on the preprocessor: a macro replaces text before compiling, why MAX(i++, j) evaluates twice, and how _Generic picks a function by type.',
		},
		minutes: 2,
		lesson: { course: 'c', slug: 'preprocesador-y-programacion-generica' },
	},
	{
		slug: 'hilos-atomics-c',
		image: '/img/animations/hilos-atomics-c.svg',
		tag: { es: 'C', en: 'C' },
		title: {
			es: 'Dos hilos, un contador',
			en: 'Two threads, one counter',
		},
		description: {
			es: 'Un corto de dos minutos sobre la concurrencia: dos hilos que incrementan el mismo contador pierden cuentas por una condición de carrera, y un mutex o una variable atómica lo arreglan.',
			en: 'A two-minute short on concurrency: two threads incrementing the same counter lose counts through a race condition, and a mutex or an atomic variable fixes it.',
		},
		minutes: 2,
		lesson: { course: 'c', slug: 'concurrencia-threads-y-atomics' },
	},
	{
		slug: 'ideas-poo-c',
		image: '/img/animations/ideas-poo-c.svg',
		tag: { es: 'C', en: 'C' },
		title: {
			es: 'Datos y operaciones juntos, sin clases',
			en: 'Data and operations together, without classes',
		},
		description: {
			es: 'Un corto de dos minutos sobre qué ideas de la programación orientada a objetos puede expresar C con un struct y funciones, y cuáles no tiene de forma nativa.',
			en: 'A two-minute short on which object-oriented ideas C can express with a struct and functions, and which it lacks natively.',
		},
		minutes: 2,
		lesson: { course: 'c', slug: 'introduccion-a-poo-en-c' },
	},
	{
		slug: 'tipo-opaco-c',
		image: '/img/animations/tipo-opaco-c.svg',
		tag: { es: 'C', en: 'C' },
		title: {
			es: 'Un tipo que esconde sus campos',
			en: 'A type that hides its fields',
		},
		description: {
			es: 'Un corto de dos minutos sobre los tipos opacos: el archivo de cabecera declara el tipo sin mostrar sus campos, solo las funciones del .c los tocan y crear y destruir cuidan la propiedad de la memoria.',
			en: 'A two-minute short on opaque types: the header declares the type without showing its fields, only the functions in the .c touch them, and create and destroy take care of memory ownership.',
		},
		minutes: 2,
		lesson: { course: 'c', slug: 'encapsulacion-y-abstraccion-en-c' },
	},
	{
		slug: 'metodos-composicion-c',
		image: '/img/animations/metodos-composicion-c.svg',
		tag: { es: 'C', en: 'C' },
		title: {
			es: 'Funciones que reciben el objeto',
			en: 'Functions that receive the object',
		},
		description: {
			es: 'Un corto de dos minutos sobre el diseño basado en struct: el puntero al objeto como primer parámetro, getters que no modifican, composición de structs y códigos de retorno.',
			en: 'A two-minute short on struct-based design: the object pointer as the first parameter, getters that do not modify, composition of structs, and return codes.',
		},
		minutes: 2,
		lesson: { course: 'c', slug: 'objetos-metodos-y-diseno-basado-en-struct' },
	},
	{
		slug: 'tabla-operaciones-c',
		image: '/img/animations/tabla-operaciones-c.svg',
		tag: { es: 'C', en: 'C' },
		title: {
			es: 'Una tabla de funciones decide',
			en: 'A table of functions decides',
		},
		description: {
			es: 'Un corto de dos minutos sobre el polimorfismo simulado: una tabla de punteros a funciones elige el área y el perímetro de cada figura, la base va como primer miembro y los límites de esta técnica.',
			en: 'A two-minute short on simulated polymorphism: a table of function pointers picks the area and perimeter of each shape, the base goes first as a member, and the limits of this technique.',
		},
		minutes: 2,
		lesson: { course: 'c', slug: 'polimorfismo-y-herencia-simulados-en-c' },
	},
	{
		slug: 'programa-estructura-c',
		image: '/img/animations/programa-estructura-c.svg',
		tag: { es: 'C', en: 'C' },
		title: {
			es: 'Las partes de un programa en C',
			en: 'The parts of a C program',
		},
		description: {
			es: 'Un corto de dos minutos sobre la estructura de un programa: la inclusión de stdio.h, la función main que devuelve un entero, las sentencias que se ejecutan en orden y los comentarios.',
			en: 'A two-minute short on the structure of a program: including stdio.h, the main function returning an integer, statements running in order, and comments.',
		},
		minutes: 2,
		lesson: { course: 'c', slug: 'introduccion-y-estructura' },
	},
	{
		slug: 'algoritmo-estados-c',
		image: '/img/animations/algoritmo-estados-c.svg',
		tag: { es: 'C', en: 'C' },
		title: {
			es: 'El estado cambia paso a paso',
			en: 'State changes step by step',
		},
		description: {
			es: 'Un corto de dos minutos sobre los algoritmos como secuencias de acciones: el estado de las variables en cada paso, una tabla de seguimiento y el intercambio con una variable temporal.',
			en: 'A two-minute short on algorithms as sequences of actions: the state of the variables at each step, a trace table, and swapping through a temporary variable.',
		},
		minutes: 2,
		lesson: { course: 'c', slug: 'procesos-y-estados' },
	},
	{
		slug: 'variables-constantes-c',
		image: '/img/animations/variables-constantes-c.svg',
		tag: { es: 'C', en: 'C' },
		title: {
			es: 'Cajas con nombre y cajas que no cambian',
			en: 'Named boxes and boxes that do not change',
		},
		description: {
			es: 'Un corto de dos minutos sobre variables y constantes: declarar e inicializar, el valor indeterminado de una variable sin inicializar, literales con sufijo y la diferencia entre const y #define.',
			en: 'A two-minute short on variables and constants: declaring and initializing, the indeterminate value of an uninitialized variable, suffixed literals, and the difference between const and #define.',
		},
		minutes: 2,
		lesson: { course: 'c', slug: 'variables-y-constantes' },
	},
	{
		slug: 'entrada-salida-c',
		image: '/img/animations/entrada-salida-c.svg',
		tag: { es: 'C', en: 'C' },
		title: {
			es: 'Leer sin confiar',
			en: 'Reading without trusting',
		},
		description: {
			es: 'Un corto de dos minutos sobre la entrada y la salida: printf y sus especificadores, scanf y su valor de retorno, qué pasa con la entrada inválida que queda en el búfer y cómo descartarla.',
			en: 'A two-minute short on input and output: printf and its specifiers, scanf and its return value, what happens to invalid input left in the buffer, and how to discard it.',
		},
		minutes: 2,
		lesson: { course: 'c', slug: 'entrada-y-salida' },
	},
	{
		slug: 'operadores-evaluacion-c',
		image: '/img/animations/operadores-evaluacion-c.svg',
		tag: { es: 'C', en: 'C' },
		title: {
			es: 'El orden en que se evalúa una expresión',
			en: 'The order an expression is evaluated in',
		},
		description: {
			es: 'Un corto de dos minutos sobre los operadores: precedencia y asociatividad, el cortocircuito de && y ||, el prefijo frente al sufijo en ++ y los casos que son comportamiento indefinido.',
			en: 'A two-minute short on operators: precedence and associativity, the short-circuit of && and ||, prefix versus postfix ++, and the cases that are undefined behavior.',
		},
		minutes: 2,
		lesson: { course: 'c', slug: 'operadores' },
	},
	{
		slug: 'funciones-modulos-c',
		image: '/img/animations/funciones-modulos-c.svg',
		tag: { es: 'C', en: 'C' },
		title: {
			es: 'De un archivo a un proyecto de varios',
			en: 'From one file to a multi-file project',
		},
		description: {
			es: 'Un corto de dos minutos sobre la modularización: el prototipo en el .h con su guarda de inclusión, la definición en el .c, compilar cada archivo a un .o y enlazarlos.',
			en: 'A two-minute short on modularization: the prototype in the .h with its include guard, the definition in the .c, compiling each file to a .o and linking them.',
		},
		minutes: 2,
		lesson: { course: 'c', slug: 'modularizacion-subprogramas-y-funciones' },
	},
	{
		slug: 'recursividad-pila-c',
		image: '/img/animations/recursividad-pila-c.svg',
		tag: { es: 'C', en: 'C' },
		title: {
			es: 'Cada llamada apila un marco',
			en: 'Every call stacks a frame',
		},
		description: {
			es: 'Un corto de dos minutos sobre la recursividad: el caso base y el caso recursivo, la pila de llamadas que crece y se desarma en factorial(4), el costo de fibonacci y el desborde de la pila.',
			en: 'A two-minute short on recursion: the base case and the recursive case, the call stack growing and unwinding in factorial(4), the cost of fibonacci, and stack overflow.',
		},
		minutes: 2,
		lesson: { course: 'c', slug: 'recursividad' },
	},
	{
		slug: 'pruebas-modulos-c',
		image: '/img/animations/pruebas-modulos-c.svg',
		tag: { es: 'C', en: 'C' },
		title: {
			es: 'Un módulo bajo prueba',
			en: 'A module under test',
		},
		description: {
			es: 'Un corto de dos minutos sobre cómo probar un módulo en C: la compuerta assert y su mensaje, los casos límite, por qué NDEBUG hace desaparecer los assert, un ejecutor de pruebas con código de salida, make test y los tipos de ancho fijo de stdint.h para que el programa sea portable.',
			en: 'A two-minute short on testing a C module: the assert gate and its message, boundary cases, why NDEBUG makes asserts disappear, a test runner with an exit status, make test and the fixed-width types of stdint.h that keep a program portable.',
		},
		minutes: 2,
		lesson: { course: 'c', slug: 'pruebas-estilo-y-portabilidad' },
	},
	{
		slug: 'depuracion-sanitizers-c',
		image: '/img/animations/depuracion-sanitizers-c.svg',
		tag: { es: 'C', en: 'C' },
		title: {
			es: 'El viaje de un error: depurar y vigilar la memoria',
			en: 'The journey of a bug: debugging and watching memory',
		},
		description: {
			es: 'Un corto de dos minutos que sigue a un error de una posición de más: el método de cinco pasos, las advertencias como primer depurador, un punto de parada con sus variables, el primer valor incorrecto y cómo AddressSanitizer y UndefinedBehaviorSanitizer lo detectan antes de la corrección.',
			en: 'A two-minute short that follows an off-by-one bug: the five-step method, warnings as the first debugger, a breakpoint with its variables, the first wrong value, and how AddressSanitizer and UndefinedBehaviorSanitizer catch it before the fix.',
		},
		minutes: 2,
		lesson: { course: 'c', slug: 'depuracion-y-sanitizers' },
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
