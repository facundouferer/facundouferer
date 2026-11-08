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
