export type PresentationTag = 'Algoritmos' | 'C' | 'Java';

export interface Presentation {
	slug: string;
	file: string;
	image: string;
	tag: {
		es: PresentationTag;
		en: string;
	};
	tagClass: string;
	title: {
		es: string;
		en: string;
	};
	description: {
		es: string;
		en: string;
	};
	lesson: { course: string; slug: string };
}

export interface CategoryFilter {
	filter: string;
	label: {
		es: string;
		en: string;
	};
}

export const categories: CategoryFilter[] = [
	{ label: { es: '~/todos', en: '~/all' }, filter: 'all' },
	{ label: { es: '~/algoritmos', en: '~/algorithms' }, filter: 'Algoritmos' },
	{ label: { es: '~/c', en: '~/c' }, filter: 'C' },
	{ label: { es: '~/java', en: '~/java' }, filter: 'Java' },
];

export const presentations: Presentation[] = [
	{
		file: 'lesson_01.sh',
		image: '/img/presentations/variables_y_constantes.svg',
		tag: { es: 'Algoritmos', en: 'Algorithms' },
		tagClass: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
		title: { es: 'Variables y Constantes', en: 'Variables and Constants' },
		description: {
			es: 'Constante: valor fijo. Variable: valor que cambia durante la ejecución.',
			en: 'Constant: fixed value. Variable: value that changes during execution.',
		},
		slug: 'variables_y_constantes',
		lesson: { course: 'c', slug: 'variables-y-constantes' },
	},
	{
		file: 'paso_por_valor_y_referencia.c',
		image: '/img/presentations/paso_por_valor_y_referencia.svg',
		tag: { es: 'C', en: 'C' },
		tagClass: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
		title: { es: 'Paso por valor y paso por referencia', en: 'Pass by Value and Pass by Reference' },
		description: {
			es: 'Descubre cómo C maneja memoria y punteros.',
			en: 'Discover how C handles memory and pointers.',
		},
		slug: 'paso_por_valor_y_referencia',
		lesson: { course: 'c', slug: 'variables-parametros-y-pasaje' },
	},
	{
		file: 'tipos_de_datos.c',
		image: '/img/presentations/tipos_de_datos_en_javascript.svg',
		tag: { es: 'C', en: 'C' },
		tagClass: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
		title: { es: 'Tipos de Datos', en: 'Data Types' },
		description: {
			es: 'Los tipos fundamentales de C: enteros, flotantes, chars, punteros y structs.',
			en: 'The fundamental types of C: integers, floats, chars, pointers and structs.',
		},
		slug: 'tipos_de_datos_en_javascript',
		lesson: { course: 'c', slug: 'tipos-de-datos' },
	},
	{
		file: 'modularidad.c',
		image: '/img/presentations/modularidad_en_c.svg',
		tag: { es: 'C', en: 'C' },
		tagClass: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
		title: { es: 'Modularidad', en: 'Modularity' },
		description: {
			es: 'Subprogramas, Funciones y Procedimientos',
			en: 'Subprograms, Functions and Procedures',
		},
		slug: 'modularidad_en_c',
		lesson: { course: 'c', slug: 'modularizacion-subprogramas-y-funciones' },
	},
	{
		file: 'funciones.java',
		image: '/img/presentations/funciones_y_procedimientos_java.svg',
		tag: { es: 'Java', en: 'Java' },
		tagClass: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
		title: { es: 'Funciones y procedimientos en Java', en: 'Functions and Procedures in Java' },
		description: {
			es: 'Cómo Java define y usa funciones y procedimientos.',
			en: 'How Java defines and uses functions and procedures.',
		},
		slug: 'funciones_y_procedimientos_java',
		lesson: { course: 'java', slug: '05-metodos-y-funciones' },
	},
	{
		file: 'arreglos.c',
		image: '/img/presentations/arreglos-en-c.svg',
		tag: { es: 'C', en: 'C' },
		tagClass: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
		title: { es: 'Arreglos en C', en: 'Arrays in C' },
		description: {
			es: 'Arreglos unidimensionales y matrices con visualizaciones y paso a paso.',
			en: 'One-dimensional arrays and matrices with visualizations and step-by-step.',
		},
		slug: 'arreglos-en-c',
		lesson: { course: 'c', slug: 'arreglos-unidimensionales-y-multidimensionales' },
	},
	{
		file: 'operaciones_arreglos.c',
		image: '/img/presentations/operaciones-con-arreglos.svg',
		tag: { es: 'C', en: 'C' },
		tagClass: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
		title: { es: 'Operaciones con Arreglos', en: 'Array Operations' },
		description: {
			es: 'Recorrido, búsqueda e inserción en arreglos con simulaciones paso a paso.',
			en: 'Traversal, search and insertion in arrays with step-by-step simulations.',
		},
		slug: 'operaciones-con-arreglos',
		lesson: { course: 'c', slug: 'operaciones-con-arreglos' },
	},
	{
		file: 'while_loop.c',
		image: '/img/presentations/while-paso-a-paso.svg',
		tag: { es: 'Algoritmos', en: 'Algorithms' },
		tagClass: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
		title: { es: 'While paso a paso', en: 'While step by step' },
		description: {
			es: 'Simula iteración por iteración un while.',
			en: 'Simulate a while loop iteration by iteration.',
		},
		slug: 'while-paso-a-paso',
		lesson: { course: 'c', slug: 'sentencia-while' },
	},
	{
		file: 'do_while_loop.c',
		image: '/img/presentations/do-while-paso-a-paso.svg',
		tag: { es: 'Algoritmos', en: 'Algorithms' },
		tagClass: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
		title: { es: 'Do-while paso a paso', en: 'Do-while step by step' },
		description: {
			es: 'Visualiza la lógica del do-while paso por paso.',
			en: 'Visualize the do-while logic step by step.',
		},
		slug: 'do-while-paso-a-paso',
		lesson: { course: 'c', slug: 'sentencia-do-while' },
	},
	{
		file: 'for_loop.c',
		image: '/img/presentations/for-paso-a-paso.svg',
		tag: { es: 'Algoritmos', en: 'Algorithms' },
		tagClass: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
		title: { es: 'For paso a paso', en: 'For step by step' },
		description: {
			es: 'Inicialización, condición, bloque e incremento de un ciclo for.',
			en: 'Initialization, condition, block and increment of a for loop.',
		},
		slug: 'for-paso-a-paso',
		lesson: { course: 'c', slug: 'sentencia-for' },
	},
	{
		file: 'nested_for_table.c',
		image: '/img/presentations/for-anidado-tabla-multiplicar.svg',
		tag: { es: 'Algoritmos', en: 'Algorithms' },
		tagClass: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
		title: { es: 'For anidado y tabla de multiplicar', en: 'Nested for and multiplication table' },
		description: {
			es: 'Dos for anidados que completan una tabla de multiplicar.',
			en: 'Two nested for loops that complete a multiplication table.',
		},
		slug: 'for-anidado-tabla-multiplicar',
		lesson: { course: 'c', slug: 'programacion-esquematica-y-sentencias-anidadas' },
	},
	{
		file: 'if_condition.c',
		image: '/img/presentations/if-paso-a-paso.svg',
		tag: { es: 'Algoritmos', en: 'Algorithms' },
		tagClass: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
		title: { es: 'If paso a paso', en: 'If step by step' },
		description: {
			es: 'Flujo de un if línea por línea.',
			en: 'Flow of an if line by line.',
		},
		slug: 'if-paso-a-paso',
		lesson: { course: 'c', slug: 'sentencia-if-else' },
	},
	{
		file: 'if_else_condition.c',
		image: '/img/presentations/if-else-paso-a-paso.svg',
		tag: { es: 'Algoritmos', en: 'Algorithms' },
		tagClass: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
		title: { es: 'If-else paso a paso', en: 'If-else step by step' },
		description: {
			es: 'Cómo el programa elige entre if y else.',
			en: 'How the program chooses between if and else.',
		},
		slug: 'if-else-paso-a-paso',
		lesson: { course: 'c', slug: 'sentencia-if-else' },
	},
	{
		file: 'switch_case.c',
		image: '/img/presentations/switch-paso-a-paso.svg',
		tag: { es: 'Algoritmos', en: 'Algorithms' },
		tagClass: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
		title: { es: 'Switch paso a paso', en: 'Switch step by step' },
		description: {
			es: 'Comparación de cases, match y break.',
			en: 'Comparison of cases, match and break.',
		},
		slug: 'switch-paso-a-paso',
		lesson: { course: 'c', slug: 'sentencia-switch-y-bloques-de-codigo' },
	},
	{
		file: 'string_methods.c',
		image: '/img/presentations/string-paso-a-paso.svg',
		tag: { es: 'C', en: 'C' },
		tagClass: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
		title: { es: 'String paso a paso', en: 'String step by step' },
		description: {
			es: 'Cambios al usar strlen, buffers y recortes manuales en C.',
			en: 'Changes when using strlen, buffers and manual cuts in C.',
		},
		slug: 'string-paso-a-paso',
		lesson: { course: 'c', slug: 'cadenas-de-caracteres-y-operaciones' },
	},
	{
		file: 'string_numbers.c',
		image: '/img/presentations/string-numeros-paso-a-paso.svg',
		tag: { es: 'C', en: 'C' },
		tagClass: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
		title: { es: 'String de números paso a paso', en: 'String of numbers step by step' },
		description: {
			es: 'Concatenación textual vs suma real con sprintf y atoi.',
			en: 'Text concatenation vs real sum with sprintf and atoi.',
		},
		slug: 'string-numeros-paso-a-paso',
		lesson: { course: 'c', slug: 'cadenas-de-caracteres-y-operaciones' },
	},
	{
		file: 'strchr_demo.c',
		image: '/img/presentations/strchr-paso-a-paso.svg',
		tag: { es: 'C', en: 'C' },
		tagClass: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
		title: { es: 'strchr paso a paso', en: 'strchr step by step' },
		description: {
			es: 'Cómo strchr recorre un string y devuelve un puntero.',
			en: 'How strchr traverses a string and returns a pointer.',
		},
		slug: 'strchr-paso-a-paso',
		lesson: { course: 'c', slug: 'cadenas-de-caracteres-y-operaciones' },
	},
	{
		file: 'contar_palabras.c',
		image: '/img/presentations/contar-palabras-cadenas-c.svg',
		tag: { es: 'C', en: 'C' },
		tagClass: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
		title: { es: 'Contar palabras en cadenas', en: 'Counting words in strings' },
		description: {
			es: 'Recorre una cadena carácter por carácter y cuenta palabras al entrar en texto.',
			en: 'Traverses a string char by char and counts words when entering text.',
		},
		slug: 'contar-palabras-cadenas-c',
		lesson: { course: 'c', slug: 'cadenas-de-caracteres-y-operaciones' },
	},
	{
		file: 'bubble_sort.c',
		image: '/img/presentations/bubble-sort.svg',
		tag: { es: 'Algoritmos', en: 'Algorithms' },
		tagClass: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
		title: { es: 'Bubble Sort paso a paso', en: 'Bubble Sort step by step' },
		description: {
			es: 'Visualiza cómo los elementos burbujean hasta su posición correcta.',
			en: 'Visualize how elements bubble up to their correct positions.',
		},
		slug: 'bubble-sort',
		lesson: { course: 'c', slug: 'ordenacion-de-arreglos' },
	},
	{
		file: 'selection_sort.c',
		image: '/img/presentations/selection-sort.svg',
		tag: { es: 'Algoritmos', en: 'Algorithms' },
		tagClass: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
		title: { es: 'Selection Sort paso a paso', en: 'Selection Sort step by step' },
		description: {
			es: 'Encuentra el mínimo y colócalo en su lugar.',
			en: 'Find the minimum and place it in its spot.',
		},
		slug: 'selection-sort',
		lesson: { course: 'c', slug: 'ordenacion-de-arreglos' },
	},
	{
		file: 'insertion_sort.c',
		image: '/img/presentations/insertion-sort.svg',
		tag: { es: 'Algoritmos', en: 'Algorithms' },
		tagClass: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
		title: { es: 'Insertion Sort paso a paso', en: 'Insertion Sort step by step' },
		description: {
			es: 'Inserta cada elemento en su posición correcta dentro de la parte ordenada.',
			en: 'Insert each element into its correct position within the sorted part.',
		},
		slug: 'insertion-sort',
		lesson: { course: 'c', slug: 'ordenacion-de-arreglos' },
	},
	{
		file: 'arboles_binarios.c',
		image: '/img/presentations/arboles-binarios.svg',
		tag: { es: 'C', en: 'C' },
		tagClass: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
		title: { es: 'Árboles Binarios paso a paso', en: 'Binary Trees step by step' },
		description: {
			es: 'Visualiza la inserción recursiva y el recorrido inorden en un BST.',
			en: 'Visualize recursive insertion and in-order traversal in a BST.',
		},
		slug: 'arboles-binarios',
		lesson: { course: 'c', slug: 'arboles-binarios' },
	},
	{
		file: 'Dispositivos.java',
		image: '/img/presentations/pilares-poo-java.svg',
		tag: { es: 'Java', en: 'Java' },
		tagClass: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
		title: { es: 'Los 4 pilares de la POO en Java', en: 'The 4 Pillars of OOP in Java' },
		description: {
			es: 'Abstracción, encapsulamiento, herencia y polimorfismo con diagramas y demos interactivas.',
			en: 'Abstraction, encapsulation, inheritance and polymorphism with diagrams and interactive demos.',
		},
		slug: 'pilares-poo-java',
		lesson: { course: 'java', slug: '06-introduccion-y-pilares-poo' },
	},
	{
		file: 'HolaMundo.java',
		image: '/img/presentations/conceptos-basicos-jvm-java.svg',
		tag: { es: 'Java', en: 'Java' },
		tagClass: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
		title: {
			es: 'Conceptos Básicos, JVM y Tu Primer Programa',
			en: 'Basic Concepts, JVM, and Your First Program',
		},
		description: {
			es: 'El pipeline de compilación a bytecode, arquitectura interna de la JVM y anatomía de main().',
			en: 'Compilation pipeline to bytecode, internal JVM architecture, and anatomy of main().',
		},
		slug: 'conceptos-basicos-jvm-java',
		lesson: { course: 'java', slug: '01-conceptos-basicos' },
	},
	{
		file: 'TiposDatos.java',
		image: '/img/presentations/variables-tipos-datos-operadores-java.svg',
		tag: { es: 'Java', en: 'Java' },
		tagClass: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
		title: {
			es: 'Variables, Tipos de Datos y Operadores en Java',
			en: 'Variables, Data Types, and Operators in Java',
		},
		description: {
			es: 'Los 8 tipos primitivos en memoria, casting implícito/explícito y cortocircuito lógico con simulador.',
			en: 'The 8 primitive types in memory, implicit/explicit casting, and logical short-circuit simulator.',
		},
		slug: 'variables-tipos-datos-operadores-java',
		lesson: { course: 'java', slug: '02-variables-tipos-datos-y-operadores' },
	},
	{
		file: 'ControlFlujo.java',
		image: '/img/presentations/control-flujo-bucles-java.svg',
		tag: { es: 'Java', en: 'Java' },
		tagClass: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
		title: {
			es: 'Control de Flujo: Condicionales y Bucles en Java',
			en: 'Control Flow: Conditionals and Loops in Java',
		},
		description: {
			es: 'Diagramas de flujo animados de if/else, switch moderno, y la anatomía interna de for, while y do-while.',
			en: 'Animated flowcharts of if/else, modern switch, and the internal anatomy of for, while, and do-while.',
		},
		slug: 'control-flujo-bucles-java',
		lesson: { course: 'java', slug: '03-control-de-flujo-y-bucles' },
	},
	{
		file: 'ArraysStrings.java',
		image: '/img/presentations/arrays-strings-memoria-java.svg',
		tag: { es: 'Java', en: 'Java' },
		tagClass: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
		title: {
			es: 'Arrays y Strings: Memoria y el Pool de Cadenas',
			en: 'Arrays and Strings: Memory and the Constant Pool',
		},
		description: {
			es: 'Memoria contigua, String Constant Pool en el Heap, la trampa de == vs equals y StringBuilder.',
			en: 'Contiguous memory, String Constant Pool in Heap, the == vs equals trap, and StringBuilder.',
		},
		slug: 'arrays-strings-memoria-java',
		lesson: { course: 'java', slug: '04-arrays-y-strings' },
	},
	{
		file: 'ClasesObjetos.java',
		image: '/img/presentations/fundamentos-poo-clases-objetos-java.svg',
		tag: { es: 'Java', en: 'Java' },
		tagClass: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
		title: {
			es: 'Clases, Objetos y el Ciclo del Operador new',
			en: 'Classes, Objects, and the new Operator Lifecycle',
		},
		description: {
			es: 'El plano frente a la edificación, ciclo en 4 tiempos de new, puntero this y aliasing en memoria.',
			en: 'Blueprint vs building, 4-step new lifecycle, this pointer, and memory aliasing.',
		},
		slug: 'fundamentos-poo-clases-objetos-java',
		lesson: { course: 'java', slug: '07-fundamentos-poo-clases-y-objetos' },
	},
	{
		file: 'ConstructoresEncapsulamiento.java',
		image: '/img/presentations/constructores-encapsulamiento-java.svg',
		tag: { es: 'Java', en: 'Java' },
		tagClass: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
		title: {
			es: 'Constructores, Encapsulamiento y Fuga de Referencia',
			en: 'Constructors, Encapsulation, and Reference Leaks',
		},
		description: {
			es: 'Delegación this(), matriz de los 4 modificadores de acceso, copia defensiva e inmutabilidad.',
			en: 'this() delegation, 4 access modifiers matrix, defensive copying, and immutability.',
		},
		slug: 'constructores-encapsulamiento-java',
		lesson: { course: 'java', slug: '07-constructores-y-encapsulamiento' },
	},
	{
		file: 'ArraysDeObjetos.java',
		image: '/img/presentations/arrays-de-objetos-java.svg',
		tag: { es: 'Java', en: 'Java' },
		tagClass: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
		title: {
			es: 'Arrays de Objetos: Doble Nivel de Memoria',
			en: 'Object Arrays: Two Levels of Memory in Java',
		},
		description: {
			es: 'El error de las casillas null, creación en dos pasos, capacidad vs cantidad y aliasing con diagramas de Heap.',
			en: 'The null slot trap, two-step creation, capacity vs size, and aliasing with Heap diagrams.',
		},
		slug: 'arrays-de-objetos-java',
		lesson: { course: 'java', slug: '09-arrays-de-objetos' },
	},
	{
		file: 'HerenciaPolimorfismo.java',
		image: '/img/presentations/herencia-polimorfismo-sobrecarga-java.svg',
		tag: { es: 'Java', en: 'Java' },
		tagClass: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
		title: {
			es: 'Herencia, Despacho Dinámico y Polimorfismo',
			en: 'Inheritance, Dynamic Method Dispatch, and Polymorphism',
		},
		description: {
			es: 'Prueba "es-un", encadenamiento de constructores con super(), sobrecarga vs sobrescritura y la tabla virtual de métodos (vtable).',
			en: '"Is-a" test, constructor chaining with super(), overloading vs overriding, and the virtual method table (vtable).',
		},
		slug: 'herencia-polimorfismo-sobrecarga-java',
		lesson: { course: 'java', slug: '08-herencia-polimorfismo-y-sobrecarga' },
	},
	{
		file: 'ClasesAbstractasInterfaces.java',
		image: '/img/presentations/clases-abstractas-interfaces-java.svg',
		tag: { es: 'Java', en: 'Java' },
		tagClass: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
		title: {
			es: 'Clases Abstractas e Interfaces en Java',
			en: 'Abstract Classes and Interfaces in Java',
		},
		description: {
			es: 'Contratos, jerarquías, métodos default y relaciones UML con diagramas interactivos.',
			en: 'Contracts, hierarchies, default methods, and UML relationships with interactive diagrams.',
		},
		slug: 'clases-abstractas-interfaces-java',
		lesson: { course: 'java', slug: '09-clases-abstractas-interfaces-y-modelado' },
	},
	{
		file: 'ExcepcionesManejoErrores.java',
		image: '/img/presentations/excepciones-manejo-errores-java.svg',
		tag: { es: 'Java', en: 'Java' },
		tagClass: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
		title: {
			es: 'Manejo de Excepciones y Robustez en Java',
			en: 'Exception Handling and Robustness in Java',
		},
		description: {
			es: 'Propagación en la pila de llamadas, try-with-resources y jerarquía Throwable con simulaciones paso a paso.',
			en: 'Call stack propagation, try-with-resources, and Throwable hierarchy with step-by-step simulations.',
		},
		slug: 'excepciones-manejo-errores-java',
		lesson: { course: 'java', slug: '10-excepciones-y-manejo-de-errores' },
	},
	{
		file: 'TadListas.java',
		image: '/img/presentations/tad-listas-enlazadas-java.svg',
		tag: { es: 'Java', en: 'Java' },
		tagClass: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
		title: {
			es: 'TAD Listas: Estáticas vs Dinámicas y Nodos Enlazados',
			en: 'List ADT: Static vs Dynamic and Linked Nodes',
		},
		description: {
			es: 'Contrato abstracto, memoria contigua vs dispersa, inserción/eliminación y análisis de complejidad Big-O.',
			en: 'Abstract contract, contiguous vs dispersed memory, insertion/deletion, and Big-O complexity analysis.',
		},
		slug: 'tad-listas-enlazadas-java',
		lesson: { course: 'java', slug: '11-tad-listas-estaticas-y-dinamicas' },
	},
	{
		file: 'TadPilasColas.java',
		image: '/img/presentations/tad-pilas-colas-java.svg',
		tag: { es: 'Java', en: 'Java' },
		tagClass: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
		title: {
			es: 'TAD Pila (LIFO) y TAD Cola (FIFO) en Java',
			en: 'Stack (LIFO) and Queue (FIFO) ADTs in Java',
		},
		description: {
			es: 'Estructuras lineales, cola circular con aritmética modular y balanceo de expresiones con simuladores.',
			en: 'Linear data structures, circular queue with modular arithmetic, and expression balancing simulators.',
		},
		slug: 'tad-pilas-colas-java',
		lesson: { course: 'java', slug: '12-tad-pilas-y-colas' },
	},
	{
		file: 'CollectionsFramework.java',
		image: '/img/presentations/collections-framework-genericos-java.svg',
		tag: { es: 'Java', en: 'Java' },
		tagClass: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
		title: {
			es: 'Java Collections Framework y Genéricos',
			en: 'Java Collections Framework and Generics',
		},
		description: {
			es: 'Jerarquía completa, familias List/Set/Map/Queue y anatomía interna de HashMap con simulador de buckets.',
			en: 'Full hierarchy, List/Set/Map/Queue families, and internal HashMap anatomy with bucket simulator.',
		},
		slug: 'collections-framework-genericos-java',
		lesson: { course: 'java', slug: '13-java-collections-framework-y-genericos' },
	},
	{
		file: 'IteradoresOrdenamiento.java',
		image: '/img/presentations/iteradores-ordenamiento-equals-hashcode-java.svg',
		tag: { es: 'Java', en: 'Java' },
		tagClass: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
		title: {
			es: 'Iteradores, Ordenamiento y Contrato equals/hashCode',
			en: 'Iterators, Sorting, and equals/hashCode Contract',
		},
		description: {
			es: 'ConcurrentModificationException desmitificada, Comparator vs Comparable y colisiones en HashSet.',
			en: 'ConcurrentModificationException demystified, Comparator vs Comparable, and HashSet collisions.',
		},
		slug: 'iteradores-ordenamiento-equals-hashcode-java',
		lesson: { course: 'java', slug: '14-iteradores-ordenamiento-equals-hashcode' },
	},
	{
		file: 'TadArbolesBinarios.java',
		image: '/img/presentations/tad-arboles-binarios-busqueda-java.svg',
		tag: { es: 'Java', en: 'Java' },
		tagClass: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
		title: {
			es: 'TAD Árboles Binarios y Búsqueda (ABB) en Java',
			en: 'Binary Trees and BST in Java',
		},
		description: {
			es: 'Recorridos DFS/BFS, propiedad ABB, inserción y eliminación con simulador de árbol interactivo.',
			en: 'DFS/BFS traversals, BST invariant, insert and delete with interactive tree simulator.',
		},
		slug: 'tad-arboles-binarios-busqueda-java',
		lesson: { course: 'java', slug: '15-tad-arboles-binarios-y-busqueda' },
	},
	{
		file: 'GrafosAlgoritmos.java',
		image: '/img/presentations/grafos-algoritmos-java.svg',
		tag: { es: 'Java', en: 'Java' },
		tagClass: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
		title: {
			es: 'Grafos: Matriz, Lista, BFS, DFS y Dijkstra',
			en: 'Graphs: Matrix, List, BFS, DFS, and Dijkstra',
		},
		description: {
			es: 'Representación en memoria, recorridos BFS/DFS, Dijkstra y Floyd-Warshall con simulador de grafos interactivo.',
			en: 'Memory representation, BFS/DFS traversals, Dijkstra, and Floyd-Warshall with interactive graph simulator.',
		},
		slug: 'grafos-algoritmos-java',
		lesson: { course: 'java', slug: '16-grafos-representacion-y-algoritmos' },
	},
	{
		file: 'ArchivosPersistencia.java',
		image: '/img/presentations/archivos-persistencia-jar-java.svg',
		tag: { es: 'Java', en: 'Java' },
		tagClass: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
		title: {
			es: 'Archivos, Serialización y Empaquetado JAR en Java',
			en: 'Files, Serialization, and JAR Packaging in Java',
		},
		description: {
			es: 'Patrón Decorador en I/O, NIO.2, serialVersionUID y empaquetado nativo con jpackage.',
			en: 'I/O Decorator Pattern, NIO.2, serialVersionUID, and native packaging with jpackage.',
		},
		slug: 'archivos-persistencia-jar-java',
		lesson: { course: 'java', slug: '17-archivos-persistencia-y-empaquetado-jar' },
	},
	{
		file: 'ConcurrenciaHilosPools.java',
		image: '/img/presentations/concurrencia-hilos-pools-java.svg',
		tag: { es: 'Java', en: 'Java' },
		tagClass: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
		title: {
			es: 'Hilos, Sincronización y Virtual Threads en Java',
			en: 'Threads, Synchronization, and Virtual Threads in Java',
		},
		description: {
			es: 'Stack vs Heap en el JMM, condiciones de carrera en count++, cerrojos synchronized, pools de hilos y Project Loom.',
			en: 'Stack vs Heap in JMM, count++ race conditions, synchronized locks, thread pools, and Project Loom.',
		},
		slug: 'concurrencia-hilos-pools-java',
		lesson: { course: 'java', slug: '19-programacion-concurrente-hilos-y-pools' },
	},
	{
		file: 'AccesoDatosJdbc.java',
		image: '/img/presentations/acceso-datos-jdbc-java.svg',
		tag: { es: 'Java', en: 'Java' },
		tagClass: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
		title: {
			es: 'JDBC, Inyección SQL y Manejo de Transacciones',
			en: 'JDBC, SQL Injection, and Transaction Management',
		},
		description: {
			es: 'Arquitectura de drivers, Statement vs PreparedStatement, cursor de ResultSet, commit/rollback y pools HikariCP.',
			en: 'Driver architecture, Statement vs PreparedStatement, ResultSet cursor, commit/rollback, and HikariCP pools.',
		},
		slug: 'acceso-datos-jdbc-java',
		lesson: { course: 'java', slug: '19-acceso-a-bases-de-datos-jdbc' },
	},
	{
		file: 'TestingJunitSpringBoot.java',
		image: '/img/presentations/testing-junit-spring-boot-java.svg',
		tag: { es: 'Java', en: 'Java' },
		tagClass: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
		title: {
			es: 'Testing con JUnit 5, Mockito y Arquitectura Spring Boot',
			en: 'Testing with JUnit 5, Mockito, and Spring Boot Architecture',
		},
		description: {
			es: 'Pirámide de tests, patrón AAA, aislamiento con dobles de prueba (Mockito) y la arquitectura en 3 capas de Spring Boot.',
			en: 'Test pyramid, AAA pattern, test doubles isolation (Mockito), and Spring Boot 3-tier architecture.',
		},
		slug: 'testing-junit-spring-boot-java',
		lesson: { course: 'java', slug: '20-testing-junit-y-spring-boot' },
	},
	{
		file: 'AlgoritmiaVerificacionComplejidad.java',
		image: '/img/presentations/algoritmia-verificacion-complejidad-java.svg',
		tag: { es: 'Java', en: 'Java' },
		tagClass: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
		title: {
			es: 'Algoritmia: Especificación, Invariantes y Big-O',
			en: 'Algorithms: Specification, Invariants, and Big-O',
		},
		description: {
			es: 'Tripletas de Hoare, invariantes de bucle paso a paso y curvas de complejidad asintótica.',
			en: 'Hoare triples, step-by-step loop invariants, and asymptotic complexity curves.',
		},
		slug: 'algoritmia-verificacion-complejidad-java',
		lesson: { course: 'java', slug: '23-algoritmia-verificacion-y-complejidad' },
	},
	{
		file: 'ArbolesNAriosVectores.java',
		image: '/img/presentations/arboles-n-arios-vectores-java.svg',
		tag: { es: 'Java', en: 'Java' },
		tagClass: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
		title: {
			es: 'Árboles N-arios y Representación con Vectores',
			en: 'N-ary Trees and Vector Representation in Java',
		},
		description: {
			es: 'Transformación Primer Hijo - Siguiente Hermano (LCRS) y vector de padres con animador interactivo.',
			en: 'Left-Child Right-Sibling (LCRS) transformation and parent vector with interactive animator.',
		},
		slug: 'arboles-n-arios-vectores-java',
		lesson: { course: 'java', slug: '26-arboles-n-arios-y-representacion-con-vectores' },
	},
	{
		file: 'DepuracionCodigoLimpio.java',
		image: '/img/presentations/depuracion-codigo-limpio-java.svg',
		tag: { es: 'Java', en: 'Java' },
		tagClass: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
		title: {
			es: 'Depuración, Código Limpio y Refactorización',
			en: 'Debugging, Clean Code, and Refactoring',
		},
		description: {
			es: 'El bucle científico de depuración, breakpoints y watches en el IDE, catálogo de code smells y refactor seguro con JUnit.',
			en: 'Scientific debugging loop, breakpoints and watches in the IDE, code smells catalog, and test-backed refactoring.',
		},
		slug: 'depuracion-codigo-limpio-java',
		lesson: { course: 'java', slug: '27-depuracion-codigo-limpio-y-refactorizacion' },
	},
];

/**
 * Returns the presentations that belong to a given course lesson, in catalog order.
 * Returns [] when no presentation is mapped to that lesson.
 */
export function getPresentationsForLesson(course: string, lessonSlug: string): Presentation[] {
	return presentations.filter(
		(presentation) => presentation.lesson.course === course && presentation.lesson.slug === lessonSlug,
	);
}

/**
 * Returns a lesson slug -> presentation count map for a given course.
 * Lessons without presentations are absent from the returned record.
 */
export function getPresentationCountsForCourse(course: string): Record<string, number> {
	const counts: Record<string, number> = {};

	for (const presentation of presentations) {
		if (presentation.lesson.course !== course) continue;
		counts[presentation.lesson.slug] = (counts[presentation.lesson.slug] ?? 0) + 1;
	}

	return counts;
}

/**
 * Returns the lesson reference for a given presentation slug.
 * Returns undefined when the slug does not match any presentation.
 */
export function getLessonForPresentation(slug: string): { course: string; slug: string } | undefined {
	return presentations.find((presentation) => presentation.slug === slug)?.lesson;
}
