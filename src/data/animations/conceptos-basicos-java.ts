import type { AnimationScript, CodePanel, Subtitle } from './types';

// Step-by-step animation for the Java lesson 01 "Conceptos básicos y tu primer
// programa". Every step names the scene it shows (`data-scene` in
// `src/components/animaciones/conceptos-basicos-java.astro`), the elements it
// reveals and the ones it emphasizes, plus its narration and any terminal panel.
// Narration plays as short captions, one idea each: the lesson page keeps the
// long-form explanation.

/** Shared with the pipeline canvas, which types it into its editor. */
export const holaMundo: CodePanel = {
	title: 'HolaMundo.java',
	language: 'java',
	source: {
		es: `public class HolaMundo {
    public static void main(String[] args) {
        System.out.println("¡Hola, Mundo desde Java!");
    }
}`,
		en: `public class HolaMundo {
    public static void main(String[] args) {
        System.out.println("Hello, World from Java!");
    }
}`,
	},
};

const saludoPersonalizado: CodePanel = {
	title: 'SaludoPersonalizado.java',
	language: 'java',
	source: {
		es: `public class SaludoPersonalizado {
    public static void main(String[] args) {
        if (args.length > 0) {
            System.out.println("¡Hola, " + args[0] + "! Bienvenido a la ingeniería en Java.");
        } else {
            System.out.println("¡Hola, Desarrollador Anónimo! Pasá tu nombre como argumento.");
        }
    }
}`,
		en: `public class SaludoPersonalizado {
    public static void main(String[] args) {
        if (args.length > 0) {
            System.out.println("Hello, " + args[0] + "! Welcome to Java engineering.");
        } else {
            System.out.println("Hello, Anonymous Developer! Pass your name as an argument.");
        }
    }
}`,
	},
};

const comentarios: CodePanel = {
	title: 'Comentarios.java',
	language: 'java',
	source: {
		es: `// Comentario de una sola línea

/*
   Comentario multilínea
   para explicaciones extensas.
*/

/**
 * Comentario Javadoc para generar documentación de APIs.
 */
public class Comentarios {
    public static final int MAX_RETRY_COUNT = 3;
}`,
		en: `// Single-line comment

/*
   Multi-line comment
   for longer explanations.
*/

/**
 * Javadoc comment for API documentation generation.
 */
public class Comentarios {
    public static final int MAX_RETRY_COUNT = 3;
}`,
	},
};

const vistaPrevia: CodePanel = {
	title: 'VistaPrevia.java',
	language: 'java',
	source: {
		es: `public class VistaPrevia {
    public static void main(String[] args) {
        if (args.length == 0 || args[0].isBlank()) {
            System.err.println("Uso: java VistaPrevia <texto-no-vacio>");
            return;
        }

        String texto = args[0];
        int finExclusivo = Math.min(10, texto.length());
        String resumen = texto.substring(0, finExclusivo);
        System.out.println(resumen);
    }
}`,
		en: `public class VistaPrevia {
    public static void main(String[] args) {
        if (args.length == 0 || args[0].isBlank()) {
            System.err.println("Usage: java VistaPrevia <non-empty-text>");
            return;
        }

        String text = args[0];
        int exclusiveEnd = Math.min(10, text.length());
        String preview = text.substring(0, exclusiveEnd);
        System.out.println(preview);
    }
}`,
	},
};

const perfilDesarrollador: CodePanel = {
	title: 'PerfilDesarrollador.java',
	language: 'java',
	source: {
		es: `public class PerfilDesarrollador {
    public static void main(String[] args) {
        if (args.length >= 2) {
            String nombre = args[0];
            String lenguaje = args[1];
            System.out.println("==========================================");
            System.out.println(" Desarrollador: " + nombre);
            System.out.println(" Especialidad:  " + lenguaje);
            System.out.println("==========================================");
        } else {
            System.out.println("Uso: java PerfilDesarrollador <TuNombre> <TuLenguaje>");
        }
    }
}`,
		en: `public class PerfilDesarrollador {
    public static void main(String[] args) {
        if (args.length >= 2) {
            String name = args[0];
            String language = args[1];
            System.out.println("==========================================");
            System.out.println(" Developer: " + name);
            System.out.println(" Specialty: " + language);
            System.out.println("==========================================");
        } else {
            System.out.println("Usage: java PerfilDesarrollador <YourName> <YourLanguage>");
        }
    }
}`,
	},
};

const same = (text: string) => ({ es: text, en: text });

/** One caption of a step, timed after the previous one by its reading time. */
const say = (es: string, en: string): Subtitle => ({ text: { es, en } });

export const script: AnimationScript = {
	chapters: [
		{ id: 'intro', label: { es: 'Introducción', en: 'Introduction' } },
		{ id: 'wora', label: { es: '1. Arquitectura WORA', en: '1. WORA architecture' } },
		{ id: 'pipeline', label: { es: '2. Compilación y ejecución', en: '2. Compilation and execution' } },
		{ id: 'anatomy', label: { es: '3. Anatomía del programa', en: '3. Program anatomy' } },
		{ id: 'terminal', label: { es: '4. Desde la consola', en: '4. From the terminal' } },
		{ id: 'args', label: { es: '5. Argumentos', en: '5. Arguments' } },
		{ id: 'conventions', label: { es: '6. Convenciones', en: '6. Conventions' } },
		{ id: 'ide', label: { es: '7. Entorno de desarrollo', en: '7. Development environment' } },
		{ id: 'javadoc', label: { es: '8. API y Javadoc', en: '8. API and Javadoc' } },
		{ id: 'errors', label: { es: '9. Errores comunes', en: '9. Common mistakes' } },
		{ id: 'exercise', label: { es: '10. Ejercicio', en: '10. Exercise' } },
	],
	steps: [
		// ─── Intro ──────────────────────────────────────────────────────────
		{
			id: 'intro-welcome',
			chapter: 'intro',
			scene: 'intro',
			show: ['core', 'use-bank', 'use-backend', 'use-android', 'use-micro'],
			title: { es: '¡Bienvenido al curso de Java!', en: 'Welcome to the Java course!' },
			subtitles: [
				say('Java es uno de los lenguajes más populares, robustos y demandados de la industria.', 'Java is one of the most popular, robust and in-demand languages in the industry.'),
				say('Lo vas a encontrar en bancos, backends empresariales, apps Android y microservicios.', 'You will find it in banks, enterprise backends, Android apps and microservices.'),
			],
		},
		{
			id: 'intro-map',
			chapter: 'intro',
			scene: 'closing',
			show: ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10'],
			title: { es: 'Qué vamos a recorrer', en: 'What we will cover' },
			subtitles: [
				say('En esta lección: la plataforma Java, la compilación, tu primer programa y la consola.', 'In this lesson: the Java platform, compilation, your first program and the terminal.'),
				say('También argumentos, convenciones, entornos, Javadoc y errores comunes. Avanzá a tu ritmo.', 'Also arguments, conventions, environments, Javadoc and common mistakes. Go at your own pace.'),
			],
		},

		// ─── 1. WORA ────────────────────────────────────────────────────────
		{
			id: 'wora-problem',
			chapter: 'wora',
			scene: 'wora',
			show: ['c-title', 'c-src', 'c-bin-win', 'c-bin-linux', 'c-bin-mac'],
			focus: ['c-bin-win', 'c-bin-linux', 'c-bin-mac'],
			title: { es: 'El problema histórico: un binario por plataforma', en: 'The historical problem: one binary per platform' },
			subtitles: [
				say('En C o C++, el mismo código se compilaba una vez por cada sistema y procesador.', 'In C or C++, the same code was compiled once for every system and processor.'),
				say('Resultado: un ejecutable distinto para Windows, Linux y macOS.', 'The result: a different executable for Windows, Linux and macOS.'),
			],
		},
		{
			id: 'wora-solution',
			chapter: 'wora',
			scene: 'wora',
			show: '*',
			focus: ['java-class', 'java-jvm-win', 'java-jvm-linux', 'java-jvm-mac', 'wora-banner'],
			title: { es: 'WORA: Write Once, Run Anywhere', en: 'WORA: Write Once, Run Anywhere' },
			subtitles: [
				say('Java compila a un único `.class` con bytecode.', 'Java compiles to a single `.class` file of bytecode.'),
				say('Ese archivo corre en cualquier sistema con una JVM: escribir una vez, ejecutar en cualquier lugar.', 'That file runs on any system with a JVM: write once, run anywhere.'),
			],
		},
		{
			id: 'platform-overview',
			chapter: 'wora',
			scene: 'platform',
			show: ['jdk', 'jre', 'jvm'],
			title: { es: 'Tres componentes anidados: JDK, JRE y JVM', en: 'Three nested components: JDK, JRE and JVM' },
			subtitles: [
				say('La plataforma Java son tres capas anidadas: el JDK contiene al JRE y el JRE a la JVM.', 'The Java platform is three nested layers: the JDK holds the JRE and the JRE holds the JVM.'),
				say('Vamos a abrirlas de afuera hacia adentro.', 'Let us open them from the outside in.'),
			],
		},
		{
			id: 'platform-jdk',
			chapter: 'wora',
			scene: 'platform',
			show: ['jdk', 'jre', 'jvm', 'tools'],
			focus: ['jdk', 'tools'],
			title: { es: 'JDK: el kit del desarrollador', en: 'JDK: the developer kit' },
			subtitles: [
				say('El JDK es el kit del desarrollador: `javac`, `jar`, `javadoc`, `jdb` y más.', 'The JDK is the developer kit: `javac`, `jar`, `javadoc`, `jdb` and more.'),
				say('Si vas a programar en Java, instalás el JDK.', 'If you are going to write Java, you install the JDK.'),
			],
		},
		{
			id: 'platform-jre',
			chapter: 'wora',
			scene: 'platform',
			show: ['jdk', 'jre', 'jvm', 'tools', 'libs'],
			focus: ['jre', 'libs'],
			title: { es: 'JRE: lo necesario para ejecutar', en: 'JRE: what you need to run' },
			subtitles: [
				say('El JRE es lo necesario para ejecutar: la JVM más librerías estándar como `java.lang` y `java.util`.', 'The JRE is what you need to run: the JVM plus standard libraries such as `java.lang` and `java.util`.'),
				say('Quien solo usa un programa Java no necesita el compilador.', 'Someone who only uses a Java program does not need the compiler.'),
			],
		},
		{
			id: 'platform-jvm',
			chapter: 'wora',
			scene: 'platform',
			show: ['jdk', 'jre', 'jvm', 'tools', 'libs', 'classloader', 'verifier', 'jit', 'gc'],
			focus: ['jvm'],
			title: { es: 'JVM: el corazón operativo', en: 'JVM: the operating heart' },
			subtitles: [
				say('La JVM es una máquina simulada por software que ejecuta el bytecode.', 'The JVM is a software-simulated machine that runs bytecode.'),
				say('Gracias a ella, el mismo `.class` corre en cualquier sistema.', 'Thanks to it, the same `.class` runs on any system.'),
			],
		},
		{
			id: 'platform-jvm-load',
			chapter: 'wora',
			scene: 'platform',
			show: ['jdk', 'jre', 'jvm', 'tools', 'libs', 'classloader', 'verifier', 'jit', 'gc'],
			focus: ['classloader', 'verifier'],
			title: { es: 'Class Loader y Bytecode Verifier', en: 'Class Loader and Bytecode Verifier' },
			subtitles: [
				say('El Class Loader carga los `.class` en memoria cuando el programa los necesita.', 'The Class Loader loads `.class` files into memory when the program needs them.'),
				say('El Bytecode Verifier comprueba que ese código sea válido y seguro antes de ejecutarlo.', 'The Bytecode Verifier checks that the code is valid and safe before it runs.'),
			],
		},
		{
			id: 'platform-jvm-run',
			chapter: 'wora',
			scene: 'platform',
			show: ['jdk', 'jre', 'jvm', 'tools', 'libs', 'classloader', 'verifier', 'jit', 'gc'],
			focus: ['jit', 'gc'],
			title: { es: 'Compilador JIT y Garbage Collector', en: 'JIT compiler and Garbage Collector' },
			subtitles: [
				say('El compilador JIT convierte el bytecode más usado en código nativo para ganar velocidad.', 'The JIT compiler turns the most used bytecode into native code for speed.'),
				say('El Garbage Collector libera la memoria de los objetos que ya no usás.', 'The Garbage Collector frees the memory of objects you no longer use.'),
			],
		},

		// ─── 2. Pipeline (motion) ───────────────────────────────────────────
		// A persistent canvas: the camera follows HolaMundo.java from the editor
		// through javac, the .class travels to three JVMs and runs on their CPUs.
		{
			id: 'pipeline-source',
			chapter: 'pipeline',
			scene: 'pipeline',
			title: { es: 'Fase 1: todo empieza en el código fuente', en: 'Phase 1: it all starts with source code' },
			subtitles: [
				{
					at: 0,
					text: {
						es: 'Java no es interpretado puro como JavaScript o Python, ni compilado nativo como C++: usa una compilación en dos fases.',
						en: 'Java is neither purely interpreted like JavaScript or Python nor natively compiled like C++: it compiles in two phases.',
					},
				},
				{
					at: 7800,
					text: {
						es: 'Todo empieza en tu editor o IDE: el código fuente `.java` es texto pensado para que lo lea una persona.',
						en: 'It all starts in your editor or IDE: the `.java` source code is text meant to be read by a person.',
					},
				},
			],
			motion: {
				cues: [
					{ at: 0, do: 'camera', to: ['editor'], dur: 1, pad: 50 },
					{ at: 150, do: 'enter', el: 'phase-1' },
					{ at: 300, do: 'enter', el: 'editor' },
					{ at: 1000, do: 'type', el: 'code-1', dur: 900 },
					{ at: 2000, do: 'type', el: 'code-2', dur: 1500 },
					{ at: 3600, do: 'type', el: 'code-3', dur: 2000 },
					{ at: 5700, do: 'type', el: 'code-4', dur: 300 },
					{ at: 6100, do: 'type', el: 'code-5', dur: 250 },
					{ at: 7800, do: 'camera', to: ['editor', 'javac'], dur: 1800 },
					{ at: 8600, do: 'enter', el: 'javac' },
					{ at: 9200, do: 'draw', el: 'arrow-edit', dur: 700 },
					{ at: 10400, do: 'enter', el: 'java-file' },
				],
			},
		},
		{
			id: 'pipeline-compile',
			chapter: 'pipeline',
			scene: 'pipeline',
			title: { es: 'javac traduce el código a bytecode', en: 'javac translates the code into bytecode' },
			subtitles: [
				{
					at: 0,
					text: {
						es: 'El compilador `javac` lee ese archivo y lo traduce a un formato intermedio llamado bytecode.',
						en: 'The `javac` compiler reads that file and translates it into an intermediate format called bytecode.',
					},
				},
				{
					at: 6700,
					text: {
						es: 'El resultado es `HolaMundo.class`: instrucciones compactas, independientes de la plataforma y diseñadas para la JVM.',
						en: 'The result is `HolaMundo.class`: compact, platform-independent instructions designed for the JVM.',
					},
				},
			],
			motion: {
				cues: [
					{ at: 0, do: 'camera', to: ['editor', 'javac', 'bytecode', 'terminal'], dur: 1600 },
					{ at: 500, do: 'enter', el: 'terminal' },
					{ at: 1100, do: 'type', el: 'term-javac', dur: 1200 },
					{ at: 2500, do: 'move', el: 'java-file', to: 'javac', dur: 1300 },
					{ at: 3700, do: 'spin', el: 'javac', dur: 1800 },
					{ at: 3800, do: 'exit', el: 'java-file', dur: 350 },
					{ at: 3800, do: 'pulse', el: 'javac' },
					{ at: 5600, do: 'enter', el: 'class-file' },
					{ at: 5900, do: 'move', el: 'class-file', to: 'class-slot', dur: 900 },
					{ at: 6700, do: 'draw', el: 'arrow-compile', dur: 700 },
					{ at: 7300, do: 'enter', el: 'bytecode' },
					{ at: 7900, do: 'type', el: 'bc-1', dur: 700 },
					{ at: 8700, do: 'type', el: 'bc-2', dur: 1100 },
					{ at: 9900, do: 'type', el: 'bc-3', dur: 800 },
					{ at: 10800, do: 'type', el: 'bc-4', dur: 300 },
					{ at: 11600, do: 'pulse', el: 'class-file' },
				],
			},
		},
		{
			id: 'pipeline-jvm',
			chapter: 'pipeline',
			scene: 'pipeline',
			title: { es: 'Fase 2: la JVM de cada sistema lee el bytecode', en: 'Phase 2: each system’s JVM reads the bytecode' },
			subtitles: [
				{
					at: 0,
					text: {
						es: 'Fase 2: ese mismo `.class` viaja sin cambios a la JVM instalada en cada sistema operativo.',
						en: 'Phase 2: that same `.class` travels unchanged to the JVM installed on each operating system.',
					},
				},
				{
					at: 6300,
					text: {
						es: 'Cada JVM lo interpreta y, con el compilador JIT, convierte en caliente las partes más usadas en código nativo.',
						en: 'Each JVM interprets it and, with the JIT compiler, turns the most used parts into native code on the fly.',
					},
				},
			],
			motion: {
				cues: [
					{ at: 0, do: 'camera', to: ['javac', 'jvm-win', 'jvm-linux', 'cpu-win'], dur: 1800 },
					{ at: 400, do: 'enter', el: 'phase-2' },
					{ at: 800, do: 'enter', el: 'jvm-win' },
					{ at: 950, do: 'enter', el: 'jvm-mac' },
					{ at: 1100, do: 'enter', el: 'jvm-linux' },
					{ at: 1700, do: 'enter', el: 'class-mac' },
					{ at: 1850, do: 'enter', el: 'class-linux' },
					{ at: 2300, do: 'draw', el: 'arrow-class-win' },
					{ at: 2400, do: 'draw', el: 'arrow-class-mac' },
					{ at: 2500, do: 'draw', el: 'arrow-class-linux' },
					{ at: 3100, do: 'move', el: 'class-file', to: 'jvm-win', dur: 1300 },
					{ at: 3250, do: 'move', el: 'class-mac', to: 'jvm-mac', dur: 1300 },
					{ at: 3400, do: 'move', el: 'class-linux', to: 'jvm-linux', dur: 1300 },
					{ at: 4400, do: 'exit', el: 'class-file' },
					{ at: 4400, do: 'pulse', el: 'jvm-win' },
					{ at: 4550, do: 'exit', el: 'class-mac' },
					{ at: 4550, do: 'pulse', el: 'jvm-mac' },
					{ at: 4700, do: 'exit', el: 'class-linux' },
					{ at: 4700, do: 'pulse', el: 'jvm-linux' },
					{ at: 6300, do: 'pulse', el: 'jit-win', dur: 900 },
					{ at: 6450, do: 'pulse', el: 'jit-mac', dur: 900 },
					{ at: 6600, do: 'pulse', el: 'jit-linux', dur: 900 },
					{ at: 7600, do: 'enter', el: 'cpu-win' },
					{ at: 7750, do: 'enter', el: 'cpu-mac' },
					{ at: 7900, do: 'enter', el: 'cpu-linux' },
					{ at: 8400, do: 'draw', el: 'arrow-run-win', dur: 600 },
					{ at: 8500, do: 'draw', el: 'arrow-run-mac', dur: 600 },
					{ at: 8600, do: 'draw', el: 'arrow-run-linux', dur: 600 },
				],
			},
		},
		{
			id: 'pipeline-run',
			chapter: 'pipeline',
			scene: 'pipeline',
			title: { es: 'La JVM ejecuta sobre el procesador real', en: 'The JVM runs on the real processor' },
			subtitles: [
				{
					at: 0,
					text: {
						es: 'Con `java HolaMundo`, la JVM ejecuta el programa sobre el procesador real de cada equipo.',
						en: 'With `java HolaMundo`, the JVM runs the program on each machine’s real processor.',
					},
				},
				{
					at: 6200,
					text: {
						es: 'El bytecode nunca cambia: lo que cambia es la JVM que lo ejecuta. Escribís una vez y corre en cualquier lugar.',
						en: 'The bytecode never changes: the JVM running it does. You write once and it runs anywhere.',
					},
				},
			],
			motion: {
				cues: [
					{ at: 0, do: 'camera', to: 'all', dur: 1800 },
					{ at: 1200, do: 'type', el: 'term-java', dur: 900 },
					{ at: 2300, do: 'flow', el: 'arrow-run-win' },
					{ at: 2300, do: 'flow', el: 'arrow-run-mac' },
					{ at: 2300, do: 'flow', el: 'arrow-run-linux' },
					{ at: 2300, do: 'pulse', el: 'cpu-win' },
					{ at: 2450, do: 'pulse', el: 'cpu-mac' },
					{ at: 2600, do: 'pulse', el: 'cpu-linux' },
					{ at: 3000, do: 'type', el: 'term-out', dur: 1000 },
					{ at: 6200, do: 'enter', el: 'banner' },
					{ at: 6700, do: 'pulse', el: 'bytecode', dur: 900 },
				],
			},
		},

		// ─── 3. Anatomy ─────────────────────────────────────────────────────
		{
			id: 'anatomy-class',
			chapter: 'anatomy',
			scene: 'anatomy',
			show: '*',
			focus: ['kw-class', 'name', 'brace-open', 'brace-close'],
			code: { ...holaMundo, focusLines: [1, 5] },
			title: { es: 'Todo el código vive dentro de una clase', en: 'All code lives inside a class' },
			subtitles: [
				say('En Java no hay funciones sueltas: todo vive dentro de una clase.', 'Java has no loose functions: everything lives inside a class.'),
				say('`class` declara la clase y las llaves `{ }` delimitan su cuerpo.', '`class` declares the class and the braces `{ }` delimit its body.'),
			],
		},
		{
			id: 'anatomy-public-class',
			chapter: 'anatomy',
			scene: 'anatomy',
			show: '*',
			focus: ['kw-public', 'kw-class'],
			code: { ...holaMundo, focusLines: [1] },
			title: { es: 'public y class', en: 'public and class' },
			subtitles: [
				say('`public` hace que la clase sea accesible desde cualquier parte del proyecto.', '`public` makes the class reachable from anywhere in the project.'),
				say('`class` declara una clase, la pieza base de la programación orientada a objetos.', '`class` declares a class, the basic building block of object-oriented programming.'),
			],
		},
		{
			id: 'anatomy-name',
			chapter: 'anatomy',
			scene: 'anatomy',
			show: '*',
			focus: ['name', 'file-tab'],
			code: { ...holaMundo, focusLines: [1] },
			title: { es: 'HolaMundo y la regla de oro del archivo', en: 'HolaMundo and the golden rule of the file' },
			subtitles: [
				say('`HolaMundo` es el nombre de la clase.', '`HolaMundo` is the name of the class.'),
				say('Regla de oro: el archivo se llama igual que la clase pública, con las mismas mayúsculas.', 'Golden rule: the file is named exactly like the public class, same capitals included.'),
				say('`HolaMundo.java` compila; `holamundo.java` no.', '`HolaMundo.java` compiles; `holamundo.java` does not.'),
			],
		},
		{
			id: 'anatomy-main',
			chapter: 'anatomy',
			scene: 'anatomy',
			show: '*',
			focus: ['kw-public-2', 'kw-static', 'kw-void', 'name-main'],
			code: { ...holaMundo, focusLines: [2] },
			title: { es: 'public static void main: el punto de entrada', en: 'public static void main: the entry point' },
			subtitles: [
				say('`main` es el punto de entrada: la JVM lo busca para arrancar el programa.', '`main` is the entry point: the JVM looks for it to start the program.'),
				say('`static`: pertenece a la clase, no a un objeto. `void`: no devuelve nada.', '`static`: it belongs to the class, not to an object. `void`: it returns nothing.'),
			],
		},
		{
			id: 'anatomy-args',
			chapter: 'anatomy',
			scene: 'anatomy',
			show: '*',
			focus: ['args'],
			code: { ...holaMundo, focusLines: [2] },
			title: { es: 'String[] args: lo que llega desde la consola', en: 'String[] args: what arrives from the terminal' },
			subtitles: [
				say('`String[] args` es un array de textos con los argumentos que llegan desde la consola.', '`String[] args` is an array of strings with the arguments that come from the terminal.'),
				say('HolaMundo todavía no lo usa; en unos pasos lo aprovechamos.', 'HolaMundo does not use it yet; we will put it to work in a few steps.'),
			],
		},
		{
			id: 'anatomy-println',
			chapter: 'anatomy',
			scene: 'anatomy',
			show: '*',
			focus: ['println', 'string', 'semicolon'],
			code: { ...holaMundo, focusLines: [3] },
			title: { es: 'System.out.println y el punto y coma', en: 'System.out.println and the semicolon' },
			subtitles: [
				say('`System.out.println()` imprime una línea en la consola.', '`System.out.println()` prints a line to the console.'),
				say('Toda instrucción termina con punto y coma: `;`.', 'Every statement ends with a semicolon: `;`.'),
			],
		},

		// ─── 4. Terminal ────────────────────────────────────────────────────
		{
			id: 'terminal-create',
			chapter: 'terminal',
			scene: 'terminal-flow',
			show: ['f-java'],
			focus: ['f-java'],
			code: holaMundo,
			title: { es: 'Paso 1: crear el archivo', en: 'Step 1: create the file' },
			subtitles: [
				say('Ahora, el flujo real desde la terminal.', 'Now, the real flow from the terminal.'),
				say('Paso 1: guardá el código en `HolaMundo.java`, con el mismo nombre que la clase.', 'Step 1: save the code as `HolaMundo.java`, named after the class.'),
			],
		},
		{
			id: 'terminal-compile',
			chapter: 'terminal',
			scene: 'terminal-flow',
			show: ['f-java', 'f-javac', 'f-class'],
			focus: ['f-javac', 'f-class'],
			shell: {
				lines: [
					{ kind: 'cmd', text: same('javac HolaMundo.java') },
					{ kind: 'cmt', text: { es: '# Sin errores: aparece HolaMundo.class en la misma carpeta', en: '# No errors: HolaMundo.class appears in the same folder' } },
					{ kind: 'cmd', text: same('ls') },
					{ kind: 'out', text: same('HolaMundo.class  HolaMundo.java') },
				],
			},
			title: { es: 'Paso 2: compilar con javac', en: 'Step 2: compile with javac' },
			subtitles: [
				say('Paso 2: `javac HolaMundo.java` compila el archivo.', 'Step 2: `javac HolaMundo.java` compiles the file.'),
				say('Si no hay errores, no imprime nada y aparece `HolaMundo.class`: el bytecode.', 'If there are no errors it prints nothing and `HolaMundo.class` appears: the bytecode.'),
			],
		},
		{
			id: 'terminal-run',
			chapter: 'terminal',
			scene: 'terminal-flow',
			show: '*',
			focus: ['f-java-cmd', 'f-out'],
			shell: {
				lines: [
					{ kind: 'cmd', text: same('java HolaMundo') },
					{ kind: 'out', text: { es: '¡Hola, Mundo desde Java!', en: 'Hello, World from Java!' } },
				],
			},
			title: { es: 'Paso 3: ejecutar con java', en: 'Step 3: run with java' },
			subtitles: [
				say('Paso 3: `java HolaMundo` ejecuta la clase, sin la extensión `.class`.', 'Step 3: `java HolaMundo` runs the class, without the `.class` extension.'),
				say('La JVM carga, verifica y ejecuta `main`: aparece el saludo.', 'The JVM loads, verifies and runs `main`: the greeting appears.'),
			],
		},

		// ─── 5. Args ────────────────────────────────────────────────────────
		{
			id: 'args-code',
			chapter: 'args',
			scene: 'args',
			show: ['cmd-base', 'arr-empty', 'len-0', 'branch-if', 'branch-else'],
			focus: ['branch-if'],
			code: { ...saludoPersonalizado, focusLines: [3] },
			title: { es: 'Recibir parámetros con String[] args', en: 'Receiving parameters with String[] args' },
			subtitles: [
				say('`String[] args` recibe los datos que escribís al ejecutar el programa.', '`String[] args` receives the data you type when running the program.'),
				say('Antes de leerlos, preguntá por `args.length`: con datos saluda por nombre; sin datos, en genérico.', 'Check `args.length` before reading: with data it greets by name; without data, generically.'),
			],
		},
		{
			id: 'args-none',
			chapter: 'args',
			scene: 'args',
			show: ['cmd-base', 'arr-empty', 'len-0', 'branch-if', 'branch-else'],
			focus: ['cmd-base', 'arr-empty', 'len-0', 'branch-else'],
			shell: {
				lines: [
					{ kind: 'cmd', text: same('javac SaludoPersonalizado.java') },
					{ kind: 'cmt', text: { es: '# Ejecución sin argumentos:', en: '# Running without arguments:' } },
					{ kind: 'cmd', text: same('java SaludoPersonalizado') },
					{ kind: 'out', text: { es: '¡Hola, Desarrollador Anónimo! Pasá tu nombre como argumento.', en: 'Hello, Anonymous Developer! Pass your name as an argument.' } },
				],
			},
			title: { es: 'Sin argumentos: el array llega vacío', en: 'Without arguments: the array arrives empty' },
			subtitles: [
				say('Sin argumentos, el array llega vacío: `args.length` vale 0.', 'Without arguments the array arrives empty: `args.length` is 0.'),
				say('La condición es falsa y se ejecuta la rama `else`.', 'The condition is false and the `else` branch runs.'),
			],
		},
		{
			id: 'args-one',
			chapter: 'args',
			scene: 'args',
			show: ['cmd-arg', 'arr-filled', 'len-1', 'branch-if', 'branch-else'],
			focus: ['cmd-arg', 'arr-filled', 'len-1', 'branch-if'],
			shell: {
				lines: [
					{ kind: 'cmt', text: { es: '# Ejecución pasando un argumento:', en: '# Running with one argument:' } },
					{ kind: 'cmd', text: same('java SaludoPersonalizado Facundo') },
					{ kind: 'out', text: { es: '¡Hola, Facundo! Bienvenido a la ingeniería en Java.', en: 'Hello, Facundo! Welcome to Java engineering.' } },
				],
			},
			title: { es: 'Con un argumento: args[0] guarda el valor', en: 'With one argument: args[0] holds the value' },
			subtitles: [
				say('Con `Facundo`, la JVM lo guarda en `args[0]` y `args.length` vale 1.', 'With `Facundo`, the JVM stores it in `args[0]` and `args.length` becomes 1.'),
				say('La condición es verdadera y el saludo usa el nombre.', 'The condition is true and the greeting uses the name.'),
			],
		},

		// ─── 6. Conventions ─────────────────────────────────────────────────
		{
			id: 'conventions-naming',
			chapter: 'conventions',
			scene: 'conventions',
			show: ['pascal', 'camel', 'upper'],
			title: { es: 'Nombrar bien: PascalCase, camelCase y UPPER_SNAKE_CASE', en: 'Naming well: PascalCase, camelCase and UPPER_SNAKE_CASE' },
			subtitles: [
				say('Clases en PascalCase: `HolaMundo`, `CuentaBancaria`.', 'Classes in PascalCase: `HolaMundo`, `CuentaBancaria`.'),
				say('Métodos y variables en camelCase: `calcularTotal()`, `nombreUsuario`.', 'Methods and variables in camelCase: `calcularTotal()`, `nombreUsuario`.'),
				say('Constantes en UPPER_SNAKE_CASE: `MAX_RETRY_COUNT`.', 'Constants in UPPER_SNAKE_CASE: `MAX_RETRY_COUNT`.'),
			],
		},
		{
			id: 'conventions-comments',
			chapter: 'conventions',
			scene: 'conventions',
			show: '*',
			focus: ['semi', 'cmt-line', 'cmt-block', 'cmt-doc'],
			code: { ...comentarios, focusLines: [1, 3, 4, 5, 6, 8, 9, 10] },
			title: { es: 'Punto y coma y tres tipos de comentario', en: 'Semicolon and three kinds of comment' },
			subtitles: [
				say('Cada instrucción termina con `;`.', 'Every statement ends with `;`.'),
				say('Comentarios: `//` una línea, `/* */` un bloque y `/** */` Javadoc para documentar tu API.', 'Comments: `//` one line, `/* */` a block and `/** */` Javadoc to document your API.'),
			],
		},

		// ─── 7. IDE ─────────────────────────────────────────────────────────
		{
			id: 'ide-options',
			chapter: 'ide',
			scene: 'ide',
			show: ['ide-local', 'ide-online', 'ide-term'],
			title: { es: 'Tres formas de escribir Java', en: 'Three ways to write Java' },
			subtitles: [
				say('Un IDE reúne edición, compilación, ejecución y depuración.', 'An IDE brings editing, compiling, running and debugging together.'),
				say('Tres caminos: un IDE local, uno online o la terminal con `javac` y `java`.', 'Three paths: a local IDE, an online one, or the terminal with `javac` and `java`.'),
			],
		},
		{
			id: 'ide-tradeoffs',
			chapter: 'ide',
			scene: 'ide',
			show: ['ide-local', 'ide-online', 'ide-term', 'lts'],
			focus: ['ide-local', 'lts'],
			title: { es: 'Ventajas, límites y la opción segura', en: 'Advantages, limits and the safe default' },
			subtitles: [
				say('Local: funciona sin conexión. Online: arranca rápido pero limita. Terminal: muestra el flujo real.', 'Local: works offline. Online: quick to start but limited. Terminal: shows the real flow.'),
				say('Para el curso, un JDK LTS local.', 'For this course, a local LTS JDK.'),
				say('Si ves UnsupportedClassVersionError, revisá la versión antes de tocar el código.', 'If you see UnsupportedClassVersionError, check the version before touching the code.'),
			],
		},
		{
			id: 'ide-checklist',
			chapter: 'ide',
			scene: 'ide',
			show: '*',
			focus: ['chk1', 'chk2', 'chk3', 'chk4', 'chk5'],
			shell: {
				lines: [
					{ kind: 'cmd', text: same('java --version') },
					{ kind: 'out', text: same('openjdk 21.0.2 2024-01-16 LTS') },
					{ kind: 'cmd', text: same('javac --version') },
					{ kind: 'out', text: same('javac 21.0.2') },
				],
			},
			title: { es: 'Lista de comprobación antes de empezar', en: 'Checklist before you start' },
			subtitles: [
				say('Antes de empezar: `java --version` y `javac --version` deben responder con versiones compatibles.', 'Before you start: `java --version` and `javac --version` must answer with compatible versions.'),
				say('Usá ese JDK en el proyecto, probalo una vez desde la terminal y guardalo bajo control de versiones.', 'Use that JDK in the project, try it once from the terminal and keep it under version control.'),
				say('Y nunca pegues contraseñas ni datos personales en servicios online.', 'And never paste passwords or personal data into online services.'),
			],
		},

		// ─── 8. Javadoc ─────────────────────────────────────────────────────
		{
			id: 'javadoc-locate',
			chapter: 'javadoc',
			scene: 'javadoc',
			show: ['version', 'module', 'package', 'class'],
			focus: ['version', 'module', 'package', 'class'],
			title: { es: 'La API es el contrato; el Javadoc, cómo leerlo', en: 'The API is the contract; Javadoc is how you read it' },
			subtitles: [
				say('La API es el contrato de las clases; el Javadoc, cómo leerlo.', 'The API is the contract of the classes; Javadoc is how you read it.'),
				say('Abrí la documentación de tu JDK: `String` está en el módulo `java.base`, paquete `java.lang`.', 'Open the docs for your JDK: `String` lives in module `java.base`, package `java.lang`.'),
			],
		},
		{
			id: 'javadoc-signature',
			chapter: 'javadoc',
			scene: 'javadoc',
			show: ['version', 'module', 'package', 'class', 'summary', 'signature', 'params', 'returns'],
			focus: ['signature', 'params', 'returns'],
			title: { es: 'Firma exacta, parámetros y valor devuelto', en: 'Exact signature, parameters and return value' },
			subtitles: [
				say('Buscá la firma exacta: `substring(int beginIndex, int endIndex)`.', 'Find the exact signature: `substring(int beginIndex, int endIndex)`.'),
				say('`beginIndex` es inclusivo, `endIndex` es exclusivo y devuelve un `String` nuevo.', '`beginIndex` is inclusive, `endIndex` is exclusive, and it returns a new `String`.'),
			],
		},
		{
			id: 'javadoc-throws',
			chapter: 'javadoc',
			scene: 'javadoc',
			show: '*',
			focus: ['throws', 'meta', 'links'],
			title: { es: 'Throws, Deprecated, Since y tipos enlazados', en: 'Throws, Deprecated, Since and linked types' },
			subtitles: [
				say('Throws declara `IndexOutOfBoundsException` si los índices no son válidos: también es contrato.', 'Throws declares `IndexOutOfBoundsException` for invalid indexes: that is contract too.'),
				say('Deprecated propone una alternativa y Since dice desde qué versión existe el método.', 'Deprecated points to an alternative and Since tells which version added the method.'),
			],
		},
		{
			id: 'javadoc-example',
			chapter: 'javadoc',
			scene: 'javadoc',
			show: '*',
			focus: ['signature', 'params', 'throws'],
			code: { ...vistaPrevia, focusLines: [3, 4, 9, 10] },
			shell: {
				lines: [
					{ kind: 'cmd', text: same('javac VistaPrevia.java') },
					{ kind: 'cmd', text: { es: 'java VistaPrevia "Programación en Java"', en: 'java VistaPrevia "Programming in Java"' } },
					{ kind: 'out', text: { es: 'Programaci', en: 'Programmin' } },
					{ kind: 'cmd', text: same('java VistaPrevia') },
					{ kind: 'err', text: { es: 'Uso: java VistaPrevia <texto-no-vacio>', en: 'Usage: java VistaPrevia <non-empty-text>' } },
				],
			},
			title: { es: 'Aplicar el contrato de String.substring', en: 'Applying the String.substring contract' },
			subtitles: [
				say('`Math.min(10, texto.length())` evita pedir más caracteres de los que hay.', '`Math.min(10, text.length())` avoids asking for more characters than there are.'),
				say('Si falta el texto, avisamos por `System.err` en vez de dejar que salte una excepción.', 'If the text is missing we report it on `System.err` instead of letting an exception fly.'),
			],
		},
		{
			id: 'javadoc-mismatch',
			chapter: 'javadoc',
			scene: 'javadoc',
			show: '*',
			focus: ['version', 'meta'],
			title: { es: 'Cuando la documentación y el compilador no coinciden', en: 'When documentation and compiler disagree' },
			subtitles: [
				say('¿El compilador no coincide con la documentación? Compará `java --version`, `javac --version` y el Javadoc.', 'Compiler and docs disagree? Compare `java --version`, `javac --version` and the Javadoc.'),
				say('Revisá la firma completa y Since. La documentación manda; el autocompletado solo ayuda.', 'Check the full signature and Since. The docs rule; autocomplete only helps.'),
			],
		},

		// ─── 9. Errors ──────────────────────────────────────────────────────
		{
			id: 'errors-filename',
			chapter: 'errors',
			scene: 'errors',
			show: ['err1'],
			focus: ['err1'],
			shell: {
				lines: [
					{ kind: 'cmd', text: same('javac holamundo.java') },
					{ kind: 'err', text: same('holamundo.java:1: error: class HolaMundo is public, should be declared in a file named HolaMundo.java') },
				],
			},
			title: { es: 'Error 1: el archivo no se llama como la clase', en: 'Mistake 1: the file is not named like the class' },
			subtitles: [
				say('Error 1: `class HolaMundo is public, should be declared in a file named HolaMundo.java`.', 'Error 1: `class HolaMundo is public, should be declared in a file named HolaMundo.java`.'),
				say('El archivo debe llamarse como la clase pública, con las mismas mayúsculas.', 'The file must be named like the public class, with the same capitals.'),
			],
		},
		{
			id: 'errors-main-class',
			chapter: 'errors',
			scene: 'errors',
			show: ['err1', 'err2'],
			focus: ['err2'],
			shell: {
				lines: [
					{ kind: 'cmd', text: same('java HolaMundo.class') },
					{ kind: 'err', text: same('Error: Could not find or load main class HolaMundo.class') },
					{ kind: 'cmt', text: { es: '# Correcto: sin la extensión', en: '# Correct: without the extension' } },
					{ kind: 'cmd', text: same('java HolaMundo') },
					{ kind: 'out', text: { es: '¡Hola, Mundo desde Java!', en: 'Hello, World from Java!' } },
				],
			},
			title: { es: 'Error 2: Could not find or load main class', en: 'Mistake 2: Could not find or load main class' },
			subtitles: [
				say('Error 2: `Could not find or load main class`: la JVM no encuentra la clase.', 'Error 2: `Could not find or load main class`: the JVM cannot find the class.'),
				say('Ejecutá `java HolaMundo` sin `.class` y desde la carpeta donde está el archivo.', 'Run `java HolaMundo` without `.class`, from the folder that holds the file.'),
			],
		},
		{
			id: 'errors-index',
			chapter: 'errors',
			scene: 'errors',
			show: '*',
			focus: ['err3'],
			shell: {
				lines: [
					{ kind: 'cmt', text: { es: '# Leer args[0] sin verificar args.length > 0:', en: '# Reading args[0] without checking args.length > 0:' } },
					{ kind: 'cmd', text: same('java SaludoSinChequeo') },
					{ kind: 'err', text: same('Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 0 out of bounds for length 0') },
				],
			},
			title: { es: 'Error 3: ArrayIndexOutOfBoundsException', en: 'Mistake 3: ArrayIndexOutOfBoundsException' },
			subtitles: [
				say('Error 3: leer `args[0]` sin argumentos lanza `ArrayIndexOutOfBoundsException`.', 'Error 3: reading `args[0]` without arguments throws `ArrayIndexOutOfBoundsException`.'),
				say('La solución: preguntar por `args.length` antes de leer.', 'The fix: check `args.length` before reading.'),
			],
		},

		// ─── 10. Exercise ───────────────────────────────────────────────────
		{
			id: 'exercise-challenge',
			chapter: 'exercise',
			scene: 'exercise',
			show: ['check', 'yes', 'no'],
			focus: ['check'],
			title: { es: 'Desafío: PerfilDesarrollador.java', en: 'Challenge: PerfilDesarrollador.java' },
			subtitles: [
				say('Desafío: `PerfilDesarrollador.java` recibe un nombre y un lenguaje favorito.', 'Challenge: `PerfilDesarrollador.java` receives a name and a favorite language.'),
				say('Con 2 argumentos imprime el perfil; si no, explica cómo usarlo. Intentalo antes de ver la solución.', 'With 2 arguments it prints the profile; otherwise it explains how to use it. Try it first.'),
			],
		},
		{
			id: 'exercise-solution',
			chapter: 'exercise',
			scene: 'exercise',
			show: '*',
			focus: ['yes', 'out-box'],
			code: { ...perfilDesarrollador, focusLines: [3, 4, 5] },
			shell: {
				lines: [
					{ kind: 'cmd', text: same('javac PerfilDesarrollador.java') },
					{ kind: 'cmd', text: same('java PerfilDesarrollador Facundo Java') },
					{ kind: 'out', text: same('==========================================') },
					{ kind: 'out', text: { es: ' Desarrollador: Facundo', en: ' Developer: Facundo' } },
					{ kind: 'out', text: { es: ' Especialidad:  Java', en: ' Specialty: Java' } },
					{ kind: 'out', text: same('==========================================') },
				],
			},
			title: { es: 'Solución sugerida', en: 'Suggested solution' },
			subtitles: [
				say('La solución valida `args.length >= 2` antes de leer.', 'The solution checks `args.length >= 2` before reading.'),
				say('Guarda `args[0]` y `args[1]` en variables camelCase e imprime el perfil con `System.out.println`.', 'It stores `args[0]` and `args[1]` in camelCase variables and prints the profile with `System.out.println`.'),
			],
		},
		{
			id: 'exercise-usage',
			chapter: 'exercise',
			scene: 'exercise',
			show: '*',
			focus: ['no', 'usage-box'],
			code: { ...perfilDesarrollador, focusLines: [10, 11] },
			shell: {
				lines: [
					{ kind: 'cmd', text: same('java PerfilDesarrollador Facundo') },
					{ kind: 'out', text: { es: 'Uso: java PerfilDesarrollador <TuNombre> <TuLenguaje>', en: 'Usage: java PerfilDesarrollador <YourName> <YourLanguage>' } },
				],
			},
			title: { es: 'Un solo argumento: el programa explica cómo usarlo', en: 'One argument: the program explains how to use it' },
			subtitles: [
				say('Con un solo argumento, la condición es falsa y entra el `else`.', 'With a single argument the condition is false and `else` runs.'),
				say('En lugar de fallar, explica qué esperaba: validar primero, explicar después.', 'Instead of crashing it explains what it expected: validate first, explain after.'),
			],
		},
		{
			id: 'closing-summary',
			chapter: 'exercise',
			scene: 'closing',
			show: '*',
			focus: ['repo'],
			title: { es: 'Resumen y código real para profundizar', en: 'Recap and real code to go deeper' },
			subtitles: [
				say('Recorriste la plataforma, la compilación, HolaMundo, la consola, los argumentos y el Javadoc.', 'You covered the platform, compilation, HolaMundo, the terminal, arguments and Javadoc.'),
				say('Para practicar, cloná el repositorio del curso y ejecutá los programas de `l01_conceptos_basicos`.', 'To practice, clone the course repository and run the programs in `l01_conceptos_basicos`.'),
			],
		},
	],
};
