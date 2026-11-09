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
