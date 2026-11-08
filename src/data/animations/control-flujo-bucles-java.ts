import type { AnimationScript, CodePanel, ShellPanel, Subtitle } from './types';

// Step-by-step animation for the Java lesson 03 "Control de flujo y bucles".
// Every step names the scene it shows (`data-scene` in
// `src/components/animaciones/control-flujo-bucles-java.astro`), the elements it
// reveals and emphasizes, its captions and any code or terminal panel. The
// break/continue chapter is a motion chapter: one SVG canvas whose cues move a
// cursor along the loop. Narration plays as short captions; the lesson page
// keeps the long-form explanation.

/** One caption of a step, timed after the previous one by its reading time. */
const say = (es: string, en: string): Subtitle => ({ text: { es, en } });

/** A caption pinned to a moment of a motion step, in ms from the step start. */
const sayAt = (at: number, es: string, en: string): Subtitle => ({ at, text: { es, en } });

const same = (text: string) => ({ es: text, en: text });

const notaIf: CodePanel = {
	title: 'Condicionales.java',
	language: 'java',
	source: {
		es: `int nota = 85;

if (nota >= 90) {
    System.out.println("Excelente");
} else if (nota >= 70) {
    System.out.println("Aprobado");
} else {
    System.out.println("Reprobado");
}`,
		en: `int nota = 85;

if (nota >= 90) {
    System.out.println("Excellent");
} else if (nota >= 70) {
    System.out.println("Passed");
} else {
    System.out.println("Failed");
}`,
	},
};

const ternary: CodePanel = {
	title: 'Ternario.java',
	language: 'java',
	source: {
		es: `int nota = 85;
String resultado = (nota >= 70) ? "Aprobado" : "Reprobado";`,
		en: `int nota = 85;
String resultado = (nota >= 70) ? "Passed" : "Failed";`,
	},
};

const switchClassic: CodePanel = {
	title: 'DiaSemana.java',
	language: 'java',
	source: {
		es: `int dia = 3;

switch (dia) {
    case 1:
        System.out.println("Lunes");
        break;
    case 2:
        System.out.println("Martes");
        break;
    case 3:
        System.out.println("Miércoles");
        break;
    default:
        System.out.println("Día no válido");
        break;
}`,
		en: `int dia = 3;

switch (dia) {
    case 1:
        System.out.println("Monday");
        break;
    case 2:
        System.out.println("Tuesday");
        break;
    case 3:
        System.out.println("Wednesday");
        break;
    default:
        System.out.println("Invalid day");
        break;
}`,
	},
};

const switchExpr: CodePanel = {
	title: 'SwitchExpresion.java',
	language: 'java',
	source: {
		es: `String nombreDia = switch (dia) {
    case 1 -> "Lunes";
    case 2 -> "Martes";
    case 3 -> "Miércoles";
    default -> "Día no válido";
};`,
		en: `String nombreDia = switch (dia) {
    case 1 -> "Monday";
    case 2 -> "Tuesday";
    case 3 -> "Wednesday";
    default -> "Invalid day";
};`,
	},
};

const menu: CodePanel = {
	title: 'Menu.java',
	language: 'java',
	source: {
		es: `switch (opcion) {
    case 1 -> cargarPersona(leer, personas);
    case 2 -> listarPersonas(personas);
    case 0 -> System.out.println("Fin del programa");
    default -> System.out.println("Opción inválida. Elegí 0, 1 o 2.");
}`,
		en: `switch (opcion) {
    case 1 -> cargarPersona(leer, personas);
    case 2 -> listarPersonas(personas);
    case 0 -> System.out.println("End of program");
    default -> System.out.println("Invalid option. Choose 0, 1 or 2.");
}`,
	},
};

const forLoop: CodePanel = {
	title: 'BucleFor.java',
	language: 'java',
	source: {
		es: `for (int i = 1; i <= 5; i++) {
    System.out.println("Iteración número: " + i);
}`,
		en: `for (int i = 1; i <= 5; i++) {
    System.out.println("Iteration number: " + i);
}`,
	},
};

const whileLoop: CodePanel = {
	title: 'BucleWhile.java',
	language: 'java',
	source: {
		es: `int contador = 0;
while (contador < 3) {
    System.out.println("Contador: " + contador);
    contador++;
}`,
		en: `int contador = 0;
while (contador < 3) {
    System.out.println("Counter: " + contador);
    contador++;
}`,
	},
};

const doWhileLoop: CodePanel = {
	title: 'BucleDoWhile.java',
	language: 'java',
	source: {
		es: `int numero = 10;
do {
    System.out.println("Se ejecuta al menos una vez");
} while (numero < 5);`,
		en: `int numero = 10;
do {
    System.out.println("It runs at least once");
} while (numero < 5);`,
	},
};

const sumaPares: CodePanel = {
	title: 'SumaPares.java',
	language: 'java',
	source: {
		es: `int suma = 0;
for (int i = 2; i <= 100; i += 2) {
    suma += i;
}
System.out.println("Suma de pares: " + suma);`,
		en: `int suma = 0;
for (int i = 2; i <= 100; i += 2) {
    suma += i;
}
System.out.println("Sum of even numbers: " + suma);`,
	},
};

const forShell: ShellPanel = {
	lines: [
		{ kind: 'cmd', text: same('java BucleFor') },
		...[1, 2, 3, 4, 5].map((n) => ({
			kind: 'out' as const,
			text: { es: `Iteración número: ${n}`, en: `Iteration number: ${n}` },
		})),
	],
};

const whileShell: ShellPanel = {
	lines: [
		{ kind: 'cmd', text: same('java BucleWhile') },
		...[0, 1, 2].map((n) => ({
			kind: 'out' as const,
			text: { es: `Contador: ${n}`, en: `Counter: ${n}` },
		})),
	],
};

const doWhileShell: ShellPanel = {
	lines: [
		{ kind: 'cmd', text: same('java BucleDoWhile') },
		{ kind: 'out', text: { es: 'Se ejecuta al menos una vez', en: 'It runs at least once' } },
	],
};

const sumaShell: ShellPanel = {
	lines: [
		{ kind: 'cmd', text: same('javac SumaPares.java') },
		{ kind: 'cmd', text: same('java SumaPares') },
		{ kind: 'out', text: { es: 'Suma de pares: 2550', en: 'Sum of even numbers: 2550' } },
	],
};

export const script: AnimationScript = {
	chapters: [
		{ id: 'intro', label: { es: 'Introducción', en: 'Introduction' } },
		{ id: 'conditionals', label: { es: '1. Condicionales', en: '1. Conditionals' } },
		{ id: 'switch', label: { es: '2. La estructura switch', en: '2. The switch statement' } },
		{ id: 'loops', label: { es: '3. Bucles e iteración', en: '3. Loops and iteration' } },
		{ id: 'jumps', label: { es: '4. break y continue', en: '4. break and continue' } },
		{ id: 'exercise', label: { es: '5. Ejercicio', en: '5. Exercise' } },
	],
	steps: [
		// ─── Intro ──────────────────────────────────────────────────────────
		{
			id: 'intro-flow',
			chapter: 'intro',
			scene: 'intro',
			show: ['decide', 'repeat', 'jump'],
			title: { es: 'Controlar el flujo del programa', en: 'Controlling the program flow' },
			subtitles: [
				say(
					'El control de flujo altera el orden en que se ejecuta tu programa.',
					'Flow control changes the order in which your program runs.',
				),
				say(
					'Decidí con condiciones, repetí con bucles y saltá con `break` y `continue`.',
					'Decide with conditions, repeat with loops and jump with `break` and `continue`.',
				),
			],
		},

		// ─── 1. Conditionals ────────────────────────────────────────────────
		{
			id: 'cond-structure',
			chapter: 'conditionals',
			scene: 'branches',
			show: ['val', 'c1', 'c2', 'c3'],
			code: { ...notaIf, focusLines: [3, 5, 7] },
			title: { es: 'if, else if y else', en: 'if, else if and else' },
			subtitles: [
				say(
					'`if` ejecuta un bloque solo cuando su condición es verdadera.',
					'`if` runs a block only when its condition is true.',
				),
				say(
					'`else if` prueba otra condición y `else` cubre todo lo demás.',
					'`else if` tests another condition and `else` covers everything else.',
				),
			],
		},
		{
			id: 'cond-evaluate',
			chapter: 'conditionals',
			scene: 'branches',
			show: '*',
			focus: ['val', 'x1', 'c2', 'ok2', 'a2', 'r2'],
			code: { ...notaIf, focusLines: [1, 5, 6] },
			title: { es: 'Evaluar con nota = 85', en: 'Evaluating with nota = 85' },
			subtitles: [
				say(
					'Con `nota = 85` no se llega a 90, pero sí a 70.',
					'With `nota = 85` the 90 is not reached, but the 70 is.',
				),
				say(
					'Corre el primer bloque verdadero y el resto se ignora: imprime Aprobado.',
					'The first true block runs and the rest is ignored: it prints Passed.',
				),
			],
		},
		{
			id: 'cond-ternary',
			chapter: 'conditionals',
			scene: 'ternary',
			show: '*',
			focus: ['t-cond', 't-yes', 't-out'],
			code: { ...ternary, focusLines: [2] },
			title: { es: 'El operador ternario', en: 'The ternary operator' },
			subtitles: [
				say(
					'El operador ternario es un `if` en una sola línea para asignar un valor.',
					'The ternary operator is a one-line `if` that assigns a value.',
				),
				say(
					'Condición, `?`, valor si es verdadera, `:`, valor si es falsa.',
					'Condition, `?`, value if true, `:`, value if false.',
				),
			],
		},

		// ─── 2. switch ──────────────────────────────────────────────────────
		{
			id: 'switch-classic',
			chapter: 'switch',
			scene: 'switch',
			show: ['s-val', 'k1', 'k2', 'k3', 'kd'],
			code: { ...switchClassic, focusLines: [3] },
			title: { es: 'switch: una variable, varios valores', en: 'switch: one variable, many values' },
			subtitles: [
				say(
					'`switch` compara una misma variable contra varios valores posibles.',
					'`switch` compares one variable against several possible values.',
				),
				say(
					'Cada `case` es un valor candidato y `default` atiende cualquier otro.',
					'Each `case` is a candidate value and `default` handles any other.',
				),
			],
		},
		{
			id: 'switch-match',
			chapter: 'switch',
			scene: 'switch',
			show: ['s-val', 'k1', 'k2', 'k3', 'kd'],
			focus: ['s-val', 'k3'],
			code: { ...switchClassic, focusLines: [10, 11, 12] },
			title: { es: 'Coincide el tercer caso', en: 'The third case matches' },
			subtitles: [
				say(
					'Con `dia = 3` coincide el tercer caso y se imprime Miércoles.',
					'With `dia = 3` the third case matches and Wednesday is printed.',
				),
				say('Los casos 1 y 2 no coinciden y se saltan.', 'Cases 1 and 2 do not match and are skipped.'),
			],
		},
		{
			id: 'switch-break',
			chapter: 'switch',
			scene: 'switch',
			show: ['s-val', 'k1', 'k2', 'k3', 'kd', 'brk', 'fall'],
			focus: ['k3', 'brk', 'fall'],
			code: { ...switchClassic, focusLines: [12, 15] },
			title: { es: 'break corta el switch', en: 'break ends the switch' },
			subtitles: [
				say(
					'`break` termina el `switch`; sin él, la ejecución cae al caso siguiente.',
					'`break` ends the `switch`; without it, execution falls into the next case.',
				),
				say(
					'Por eso cada caso clásico cierra con `break`.',
					'That is why every classic case ends with `break`.',
				),
			],
		},
		{
			id: 'switch-expression',
			chapter: 'switch',
			scene: 'switch-expr',
			show: '*',
			focus: ['e3', 'e-res'],
			code: { ...switchExpr, focusLines: [4] },
			title: { es: 'Switch expression', en: 'Switch expression' },
			subtitles: [
				say(
					'Java moderno: un `switch` puede devolver un valor con `->`.',
					'Modern Java: a `switch` can return a value with `->`.',
				),
				say(
					'Cada caso trae su resultado directo y no necesita `break`.',
					'Each case brings its result directly and needs no `break`.',
				),
			],
		},
		{
			id: 'switch-menu',
			chapter: 'switch',
			scene: 'menu',
			show: '*',
			focus: ['m2'],
			code: { ...menu, focusLines: [3] },
			title: { es: 'Flechas para ejecutar acciones', en: 'Arrows to run actions' },
			subtitles: [
				say(
					'Con flechas también ejecutás acciones, como en un menú de consola.',
					'Arrows also run actions, as in a console menu.',
				),
				say(
					'Cada caso corre solo su instrucción, sin caer en el siguiente.',
					'Each case runs only its own statement, without falling through.',
				),
				say(
					'Si necesitás varias instrucciones, usá un bloque.',
					'If you need several statements, use a block.',
				),
			],
		},

		// ─── 3. Loops ───────────────────────────────────────────────────────
		{
			id: 'loops-overview',
			chapter: 'loops',
			scene: 'loops',
			show: ['lf', 'lw', 'ld'],
			title: { es: 'Tres bucles para repetir', en: 'Three loops to repeat' },
			subtitles: [
				say(
					'Un bucle repite un bloque de código mientras se cumpla una condición.',
					'A loop repeats a block of code while a condition holds.',
				),
				say('Hay tres formas: `for`, `while` y `do-while`.', 'There are three forms: `for`, `while` and `do-while`.'),
			],
		},
		{
			id: 'loop-for-anatomy',
			chapter: 'loops',
			scene: 'for-trace',
			show: ['init', 'cond', 'step'],
			code: { ...forLoop, focusLines: [1] },
			title: { es: 'for: inicio, condición y paso', en: 'for: start, condition and step' },
			subtitles: [
				say(
					'`for` se usa cuando sabés de antemano cuántas vueltas dará.',
					'`for` is used when you know in advance how many laps it takes.',
				),
				say(
					'Tiene inicio, condición y paso, todo en la misma línea.',
					'It has a start, a condition and a step, all on the same line.',
				),
			],
		},
		{
			id: 'loop-for-run',
			chapter: 'loops',
			scene: 'for-trace',
			show: '*',
			focus: ['it1', 'it2', 'it3', 'it4', 'it5', 'it6'],
			code: { ...forLoop, focusLines: [2] },
			shell: forShell,
			title: { es: 'for en acción', en: 'for in action' },
			subtitles: [
				say(
					'Imprime `i` desde 1 hasta 5 y después sale.',
					'It prints `i` from 1 to 5 and then exits.',
				),
				say(
					'Cada vuelta comprueba, ejecuta el bloque y avanza con `i++`.',
					'Each lap checks, runs the block and moves on with `i++`.',
				),
			],
		},
		{
			id: 'loop-while',
			chapter: 'loops',
			scene: 'while-trace',
			show: '*',
			focus: ['wcheck', 'w3'],
			code: { ...whileLoop, focusLines: [2, 4] },
			shell: whileShell,
			title: { es: 'while: evalúa antes', en: 'while: checks first' },
			subtitles: [
				say(
					'`while` evalúa la condición antes de ejecutar el bloque.',
					'`while` evaluates the condition before running the block.',
				),
				say(
					'`contador++` evita un bucle infinito: al llegar a 3, la condición falla.',
					'`contador++` avoids an infinite loop: at 3, the condition fails.',
				),
			],
		},
		{
			id: 'loop-dowhile',
			chapter: 'loops',
			scene: 'dowhile',
			show: '*',
			focus: ['d-block', 'd-once'],
			code: { ...doWhileLoop, focusLines: [2, 3, 4] },
			shell: doWhileShell,
			title: { es: 'do-while: evalúa al final', en: 'do-while: checks last' },
			subtitles: [
				say(
					'`do-while` ejecuta el bloque primero y evalúa la condición al final.',
					'`do-while` runs the block first and checks the condition at the end.',
				),
				say(
					'Aunque `numero < 5` sea falso desde el inicio, el bloque corre una vez.',
					'Even if `numero < 5` is false from the start, the block runs once.',
				),
			],
		},
		{
			id: 'loop-compare',
			chapter: 'loops',
			scene: 'loops',
			show: '*',
			focus: ['cw', 'cd', 'cf'],
			title: { es: 'Cuándo usar cada uno', en: 'When to use each one' },
			subtitles: [
				say(
					'`while` evalúa antes, `do-while` evalúa al final y `for` agrupa todo en una línea.',
					'`while` checks first, `do-while` checks last and `for` packs it all in one line.',
				),
				say(
					'Elegí según cuántas vueltas conocés y si el bloque debe correr al menos una vez.',
					'Choose by how many laps you know and whether the block must run at least once.',
				),
			],
		},

		// ─── 4. break and continue (motion) ─────────────────────────────────
		// One persistent canvas: a cursor walks the loop, continue skips the 5
		// and break leaves the loop at the 8.
		{
			id: 'jumps-setup',
			chapter: 'jumps',
			scene: 'jumps',
			title: { es: 'break y continue', en: 'break and continue' },
			subtitles: [
				sayAt(
					0,
					'`break` interrumpe el bucle de inmediato; `continue` salta la iteración actual.',
					'`break` stops the loop immediately; `continue` skips the current iteration.',
				),
				sayAt(
					6400,
					'Este bucle recorre `i` de 1 a 10. Veamos qué pasa con el 5 y con el 8.',
					'This loop walks `i` from 1 to 10. Let us see what happens at 5 and at 8.',
				),
			],
			motion: {
				cues: [
					{ at: 0, do: 'camera', to: 'all', dur: 1 },
					{ at: 200, do: 'enter', el: 'code' },
					{ at: 900, do: 'type', el: 'code-1', dur: 700 },
					{ at: 1600, do: 'type', el: 'code-2', dur: 900 },
					{ at: 2500, do: 'type', el: 'code-3', dur: 900 },
					{ at: 3400, do: 'type', el: 'code-4', dur: 900 },
					{ at: 4300, do: 'type', el: 'code-5', dur: 300 },
					{ at: 4800, do: 'enter', el: 'out-card' },
					{ at: 5300, do: 'enter', el: 'track' },
					{ at: 6400, do: 'enter', el: 'c1' },
					{ at: 6520, do: 'enter', el: 'c2' },
					{ at: 6640, do: 'enter', el: 'c3' },
					{ at: 6760, do: 'enter', el: 'c4' },
					{ at: 6880, do: 'enter', el: 'c5' },
					{ at: 7000, do: 'enter', el: 'c6' },
					{ at: 7120, do: 'enter', el: 'c7' },
					{ at: 7240, do: 'enter', el: 'c8' },
					{ at: 7360, do: 'enter', el: 'c9' },
					{ at: 7480, do: 'enter', el: 'c10' },
					{ at: 8200, do: 'enter', el: 'cursor' },
				],
			},
		},
		{
			id: 'jumps-continue',
			chapter: 'jumps',
			scene: 'jumps',
			title: { es: 'continue salta una iteración', en: 'continue skips an iteration' },
			subtitles: [
				sayAt(
					0,
					'Con `i` = 1, 2, 3 y 4 se imprime cada valor y el bucle sigue.',
					'With `i` = 1, 2, 3 and 4 each value is printed and the loop goes on.',
				),
				sayAt(
					5000,
					'En `i == 5`, `continue` salta el resto de la vuelta y pasa a `i` = 6.',
					'At `i == 5`, `continue` skips the rest of the lap and moves to `i` = 6.',
				),
			],
			motion: {
				cues: [
					{ at: 200, do: 'enter', el: 'out-1' },
					{ at: 1000, do: 'move', el: 'cursor', to: 'c2', dy: -85, dur: 700 },
					{ at: 1700, do: 'enter', el: 'out-2' },
					{ at: 2400, do: 'move', el: 'cursor', to: 'c3', dy: -85, dur: 700 },
					{ at: 3100, do: 'enter', el: 'out-3' },
					{ at: 3800, do: 'move', el: 'cursor', to: 'c4', dy: -85, dur: 700 },
					{ at: 4500, do: 'enter', el: 'out-4' },
					{ at: 5000, do: 'camera', to: ['c4', 'c5', 'c6', 'tag-continue'], pad: 80, dur: 1200 },
					{ at: 5300, do: 'move', el: 'cursor', to: 'c5', dy: -85, dur: 700 },
					{ at: 6000, do: 'pulse', el: 'c5' },
					{ at: 6100, do: 'enter', el: 'tag-continue' },
					{ at: 6500, do: 'draw', el: 'arc-continue', dur: 800 },
					{ at: 7400, do: 'move', el: 'cursor', to: 'c6', dy: -85, dur: 900 },
					{ at: 8500, do: 'camera', to: 'all', dur: 1200 },
				],
			},
		},
		{
			id: 'jumps-break',
			chapter: 'jumps',
			scene: 'jumps',
			title: { es: 'break corta el bucle', en: 'break ends the loop' },
			subtitles: [
				sayAt(
					0,
					'`i` = 6 y 7 se imprimen. En `i == 8`, `break` corta el bucle por completo.',
					'`i` = 6 and 7 are printed. At `i == 8`, `break` ends the loop entirely.',
				),
				sayAt(
					6200,
					'Los números 9 y 10 nunca se ejecutan. Salida final: 1 2 3 4 6 7.',
					'Numbers 9 and 10 never run. Final output: 1 2 3 4 6 7.',
				),
			],
			motion: {
				cues: [
					{ at: 200, do: 'enter', el: 'out-6' },
					{ at: 1000, do: 'move', el: 'cursor', to: 'c7', dy: -85, dur: 700 },
					{ at: 1700, do: 'enter', el: 'out-7' },
					{ at: 2500, do: 'move', el: 'cursor', to: 'c8', dy: -85, dur: 700 },
					{ at: 3300, do: 'pulse', el: 'c8' },
					{ at: 3400, do: 'enter', el: 'tag-break' },
					{ at: 3900, do: 'draw', el: 'arrow-break', dur: 600 },
					{ at: 4600, do: 'draw', el: 'arrow-exit', dur: 500 },
					{ at: 4800, do: 'enter', el: 'exit-chip' },
					{ at: 4900, do: 'flow', el: 'arrow-exit' },
					{ at: 5300, do: 'exit', el: 'c9' },
					{ at: 5450, do: 'exit', el: 'c10' },
					{ at: 5600, do: 'exit', el: 'cursor' },
					{ at: 6200, do: 'pulse', el: 'out-card', dur: 900 },
				],
			},
		},

		// ─── 5. Exercise ────────────────────────────────────────────────────
		{
			id: 'exercise-challenge',
			chapter: 'exercise',
			scene: 'exercise',
			show: ['x-range', 'x-even', 'x-sum'],
			focus: ['x-range', 'x-even', 'x-sum'],
			title: { es: 'Desafío: la suma de los pares', en: 'Challenge: the sum of even numbers' },
			subtitles: [
				say(
					'Desafío: sumá todos los números pares entre 1 y 100 con un bucle.',
					'Challenge: add up all the even numbers between 1 and 100 with a loop.',
				),
				say(
					'Imprimí el resultado final. Intentalo antes de ver la solución.',
					'Print the final result. Try it before looking at the solution.',
				),
			],
		},
		{
			id: 'exercise-solution',
			chapter: 'exercise',
			scene: 'exercise',
			show: '*',
			focus: ['x-even', 'x-res'],
			code: { ...sumaPares, focusLines: [2, 3] },
			shell: sumaShell,
			title: { es: 'Solución sugerida', en: 'Suggested solution' },
			subtitles: [
				say(
					'Un `for` con `i += 2` recorre solo los pares y los acumula en `suma`.',
					'A `for` with `i += 2` walks only the even numbers and adds them to `suma`.',
				),
				say(
					'La suma de los pares de 1 a 100 es 2550.',
					'The sum of the even numbers from 1 to 100 is 2550.',
				),
			],
		},
		{
			id: 'closing-summary',
			chapter: 'exercise',
			scene: 'closing',
			show: '*',
			focus: ['repo'],
			title: { es: 'Resumen y código real', en: 'Summary and real code' },
			subtitles: [
				say(
					'Viste condicionales, `switch`, bucles y el control con `break` y `continue`.',
					'You saw conditionals, `switch`, loops and control with `break` and `continue`.',
				),
				say(
					'Reforzá todo con los 43 ejercicios resueltos del repositorio del curso.',
					'Reinforce it all with the 43 solved exercises in the course repository.',
				),
			],
		},
	],
};
