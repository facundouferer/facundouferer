export type PresentationTag = 'Algoritmos' | 'C' | 'Java';

export interface Presentation {
	slug: string;
	file: string;
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
		tag: { es: 'Algoritmos', en: 'Algorithms' },
		tagClass: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
		title: { es: 'Variables y Constantes', en: 'Variables and Constants' },
		description: {
			es: 'Constante: valor fijo. Variable: valor que cambia durante la ejecución.',
			en: 'Constant: fixed value. Variable: value that changes during execution.',
		},
		slug: 'variables_y_constantes',
	},
	{
		file: 'paso_por_valor_y_referencia.c',
		tag: { es: 'C', en: 'C' },
		tagClass: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
		title: { es: 'Paso por valor y paso por referencia', en: 'Pass by Value and Pass by Reference' },
		description: {
			es: 'Descubre cómo C maneja memoria y punteros.',
			en: 'Discover how C handles memory and pointers.',
		},
		slug: 'paso_por_valor_y_referencia',
	},
	{
		file: 'tipos_de_datos.c',
		tag: { es: 'C', en: 'C' },
		tagClass: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
		title: { es: 'Tipos de Datos', en: 'Data Types' },
		description: {
			es: 'Los tipos fundamentales de C: enteros, flotantes, chars, punteros y structs.',
			en: 'The fundamental types of C: integers, floats, chars, pointers and structs.',
		},
		slug: 'tipos_de_datos_en_javascript',
	},
	{
		file: 'modularidad.c',
		tag: { es: 'C', en: 'C' },
		tagClass: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
		title: { es: 'Modularidad', en: 'Modularity' },
		description: {
			es: 'Subprogramas, Funciones y Procedimientos',
			en: 'Subprograms, Functions and Procedures',
		},
		slug: 'modularidad_en_c',
	},
	{
		file: 'funciones.java',
		tag: { es: 'Java', en: 'Java' },
		tagClass: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
		title: { es: 'Funciones y procedimientos en Java', en: 'Functions and Procedures in Java' },
		description: {
			es: 'Cómo Java define y usa funciones y procedimientos.',
			en: 'How Java defines and uses functions and procedures.',
		},
		slug: 'funciones_y_procedimientos_java',
	},
	{
		file: 'arreglos.c',
		tag: { es: 'C', en: 'C' },
		tagClass: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
		title: { es: 'Arreglos en C', en: 'Arrays in C' },
		description: {
			es: 'Arreglos unidimensionales y matrices con visualizaciones y paso a paso.',
			en: 'One-dimensional arrays and matrices with visualizations and step-by-step.',
		},
		slug: 'arreglos-en-c',
	},
	{
		file: 'operaciones_arreglos.c',
		tag: { es: 'C', en: 'C' },
		tagClass: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
		title: { es: 'Operaciones con Arreglos', en: 'Array Operations' },
		description: {
			es: 'Recorrido, búsqueda e inserción en arreglos con simulaciones paso a paso.',
			en: 'Traversal, search and insertion in arrays with step-by-step simulations.',
		},
		slug: 'operaciones-con-arreglos',
	},
	{
		file: 'while_loop.c',
		tag: { es: 'Algoritmos', en: 'Algorithms' },
		tagClass: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
		title: { es: 'While paso a paso', en: 'While step by step' },
		description: {
			es: 'Simula iteración por iteración un while.',
			en: 'Simulate a while loop iteration by iteration.',
		},
		slug: 'while-paso-a-paso',
	},
	{
		file: 'do_while_loop.c',
		tag: { es: 'Algoritmos', en: 'Algorithms' },
		tagClass: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
		title: { es: 'Do-while paso a paso', en: 'Do-while step by step' },
		description: {
			es: 'Visualiza la lógica del do-while paso por paso.',
			en: 'Visualize the do-while logic step by step.',
		},
		slug: 'do-while-paso-a-paso',
	},
	{
		file: 'for_loop.c',
		tag: { es: 'Algoritmos', en: 'Algorithms' },
		tagClass: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
		title: { es: 'For paso a paso', en: 'For step by step' },
		description: {
			es: 'Inicialización, condición, bloque e incremento de un ciclo for.',
			en: 'Initialization, condition, block and increment of a for loop.',
		},
		slug: 'for-paso-a-paso',
	},
	{
		file: 'nested_for_table.c',
		tag: { es: 'Algoritmos', en: 'Algorithms' },
		tagClass: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
		title: { es: 'For anidado y tabla de multiplicar', en: 'Nested for and multiplication table' },
		description: {
			es: 'Dos for anidados que completan una tabla de multiplicar.',
			en: 'Two nested for loops that complete a multiplication table.',
		},
		slug: 'for-anidado-tabla-multiplicar',
	},
	{
		file: 'if_condition.c',
		tag: { es: 'Algoritmos', en: 'Algorithms' },
		tagClass: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
		title: { es: 'If paso a paso', en: 'If step by step' },
		description: {
			es: 'Flujo de un if línea por línea.',
			en: 'Flow of an if line by line.',
		},
		slug: 'if-paso-a-paso',
	},
	{
		file: 'if_else_condition.c',
		tag: { es: 'Algoritmos', en: 'Algorithms' },
		tagClass: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
		title: { es: 'If-else paso a paso', en: 'If-else step by step' },
		description: {
			es: 'Cómo el programa elige entre if y else.',
			en: 'How the program chooses between if and else.',
		},
		slug: 'if-else-paso-a-paso',
	},
	{
		file: 'switch_case.c',
		tag: { es: 'Algoritmos', en: 'Algorithms' },
		tagClass: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
		title: { es: 'Switch paso a paso', en: 'Switch step by step' },
		description: {
			es: 'Comparación de cases, match y break.',
			en: 'Comparison of cases, match and break.',
		},
		slug: 'switch-paso-a-paso',
	},
	{
		file: 'string_methods.c',
		tag: { es: 'C', en: 'C' },
		tagClass: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
		title: { es: 'String paso a paso', en: 'String step by step' },
		description: {
			es: 'Cambios al usar strlen, buffers y recortes manuales en C.',
			en: 'Changes when using strlen, buffers and manual cuts in C.',
		},
		slug: 'string-paso-a-paso',
	},
	{
		file: 'string_numbers.c',
		tag: { es: 'C', en: 'C' },
		tagClass: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
		title: { es: 'String de números paso a paso', en: 'String of numbers step by step' },
		description: {
			es: 'Concatenación textual vs suma real con sprintf y atoi.',
			en: 'Text concatenation vs real sum with sprintf and atoi.',
		},
		slug: 'string-numeros-paso-a-paso',
	},
	{
		file: 'strchr_demo.c',
		tag: { es: 'C', en: 'C' },
		tagClass: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
		title: { es: 'strchr paso a paso', en: 'strchr step by step' },
		description: {
			es: 'Cómo strchr recorre un string y devuelve un puntero.',
			en: 'How strchr traverses a string and returns a pointer.',
		},
		slug: 'strchr-paso-a-paso',
	},
	{
		file: 'contar_palabras.c',
		tag: { es: 'C', en: 'C' },
		tagClass: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
		title: { es: 'Contar palabras en cadenas', en: 'Counting words in strings' },
		description: {
			es: 'Recorre una cadena carácter por carácter y cuenta palabras al entrar en texto.',
			en: 'Traverses a string char by char and counts words when entering text.',
		},
		slug: 'contar-palabras-cadenas-c',
	},
	{
		file: 'bubble_sort.c',
		tag: { es: 'Algoritmos', en: 'Algorithms' },
		tagClass: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
		title: { es: 'Bubble Sort paso a paso', en: 'Bubble Sort step by step' },
		description: {
			es: 'Visualiza cómo los elementos burbujean hasta su posición correcta.',
			en: 'Visualize how elements bubble up to their correct positions.',
		},
		slug: 'bubble-sort',
	},
	{
		file: 'selection_sort.c',
		tag: { es: 'Algoritmos', en: 'Algorithms' },
		tagClass: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
		title: { es: 'Selection Sort paso a paso', en: 'Selection Sort step by step' },
		description: {
			es: 'Encuentra el mínimo y colócalo en su lugar.',
			en: 'Find the minimum and place it in its spot.',
		},
		slug: 'selection-sort',
	},
	{
		file: 'insertion_sort.c',
		tag: { es: 'Algoritmos', en: 'Algorithms' },
		tagClass: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
		title: { es: 'Insertion Sort paso a paso', en: 'Insertion Sort step by step' },
		description: {
			es: 'Inserta cada elemento en su posición correcta dentro de la parte ordenada.',
			en: 'Insert each element into its correct position within the sorted part.',
		},
		slug: 'insertion-sort',
	},
	{
		file: 'arboles_binarios.c',
		tag: { es: 'C', en: 'C' },
		tagClass: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
		title: { es: 'Árboles Binarios paso a paso', en: 'Binary Trees step by step' },
		description: {
			es: 'Visualiza la inserción recursiva y el recorrido inorden en un BST.',
			en: 'Visualize recursive insertion and in-order traversal in a BST.',
		},
		slug: 'arboles-binarios',
	},
];
