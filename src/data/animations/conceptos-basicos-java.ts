import type { AnimationScript, CodePanel } from './types';

// Step-by-step animation for the Java lesson 01 "Conceptos básicos y tu primer
// programa". Every step names the scene it shows (`data-scene` in
// `src/components/animaciones/conceptos-basicos-java.astro`), the elements it
// reveals and the ones it emphasizes, plus the narration and any terminal panel.
// Narration follows the lesson text closely so learners can read both side by side.

const holaMundo: CodePanel = {
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
			text: {
				es: 'Java es uno de los lenguajes más populares, robustos y demandados de la industria. Lo vas a encontrar en plataformas bancarias de alta disponibilidad, en sistemas backend empresariales masivos, en aplicaciones Android y en microservicios modernos. Es una piedra angular de la ingeniería de software actual.',
				en: 'Java is one of the most popular, robust and in-demand languages in the industry. You will find it in high-availability banking platforms, massive enterprise backends, Android applications and modern microservices. It is a cornerstone of today’s software engineering.',
			},
		},
		{
			id: 'intro-map',
			chapter: 'intro',
			scene: 'closing',
			show: ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10'],
			title: { es: 'Qué vamos a recorrer', en: 'What we will cover' },
			text: {
				es: 'En esta primera lección vas a entender los pilares que hacen a Java tan potente: su arquitectura interna de compilación y ejecución, la anatomía detallada de una clase ejecutable, cómo compilar y correr desde la consola, cómo recibir argumentos, las convenciones de estilo, cómo elegir un entorno, cómo leer el Javadoc y los errores típicos de quien empieza. Usá los controles para avanzar a tu ritmo.',
				en: 'In this first lesson you will understand the pillars that make Java so powerful: its internal compilation and execution architecture, the detailed anatomy of an executable class, how to compile and run from the terminal, how to receive arguments, style conventions, how to pick an environment, how to read Javadoc and the typical beginner mistakes. Use the controls to move at your own pace.',
			},
		},

		// ─── 1. WORA ────────────────────────────────────────────────────────
		{
			id: 'wora-problem',
			chapter: 'wora',
			scene: 'wora',
			show: ['c-title', 'c-src', 'c-bin-win', 'c-bin-linux', 'c-bin-mac'],
			focus: ['c-bin-win', 'c-bin-linux', 'c-bin-mac'],
			title: { es: 'El problema histórico: un binario por plataforma', en: 'The historical problem: one binary per platform' },
			text: {
				es: 'Históricamente, un programa escrito en C o C++ debía compilarse específicamente para cada sistema operativo y cada arquitectura de procesador: Windows x86, Linux ARM, macOS Apple Silicon. El mismo código fuente producía tres ejecutables distintos, y cada uno solo funcionaba en su plataforma.',
				en: 'Historically, a program written in C or C++ had to be compiled specifically for each operating system and processor architecture: Windows x86, Linux ARM, macOS Apple Silicon. The same source code produced three different executables, and each one only ran on its own platform.',
			},
		},
		{
			id: 'wora-solution',
			chapter: 'wora',
			scene: 'wora',
			show: '*',
			focus: ['java-class', 'java-jvm-win', 'java-jvm-linux', 'java-jvm-mac', 'wora-banner'],
			title: { es: 'WORA: Write Once, Run Anywhere', en: 'WORA: Write Once, Run Anywhere' },
			text: {
				es: 'Java revolucionó la industria con la filosofía WORA: escribir una vez, ejecutar en cualquier lugar. El código fuente se compila a un único archivo .class con bytecode, y ese mismo archivo corre sin cambios en Windows, Linux o macOS porque cada sistema tiene su propia máquina virtual de Java que lo interpreta.',
				en: 'Java revolutionized the industry with the WORA philosophy: write once, run anywhere. Source code compiles into a single .class file of bytecode, and that same file runs unchanged on Windows, Linux or macOS because each system has its own Java Virtual Machine that interprets it.',
			},
		},
		{
			id: 'platform-overview',
			chapter: 'wora',
			scene: 'platform',
			show: ['jdk', 'jre', 'jvm'],
			title: { es: 'Tres componentes anidados: JDK, JRE y JVM', en: 'Three nested components: JDK, JRE and JVM' },
			text: {
				es: 'Para lograr WORA, la plataforma Java se divide en tres componentes esenciales que se anidan uno dentro del otro. El JDK contiene al JRE, y el JRE contiene a la JVM. Vamos a abrirlos de afuera hacia adentro.',
				en: 'To achieve WORA, the Java platform is split into three essential components nested inside one another. The JDK contains the JRE, and the JRE contains the JVM. Let’s open them from the outside in.',
			},
		},
		{
			id: 'platform-jdk',
			chapter: 'wora',
			scene: 'platform',
			show: ['jdk', 'jre', 'jvm', 'tools'],
			focus: ['jdk', 'tools'],
			title: { es: 'JDK: el kit del desarrollador', en: 'JDK: the developer kit' },
			text: {
				es: 'El JDK (Java Development Kit) es el paquete completo para desarrolladores. Incluye el compilador javac, la utilidad de empaquetado jar, el generador de documentación javadoc, el depurador jdb y todas las herramientas necesarias para escribir código. Si vas a programar en Java, instalás el JDK.',
				en: 'The JDK (Java Development Kit) is the complete bundle for developers. It includes the javac compiler, the jar packaging utility, the javadoc documentation generator, the jdb debugger and every tool needed to write code. If you are going to program in Java, you install the JDK.',
			},
		},
		{
			id: 'platform-jre',
			chapter: 'wora',
			scene: 'platform',
			show: ['jdk', 'jre', 'jvm', 'tools', 'libs'],
			focus: ['jre', 'libs'],
			title: { es: 'JRE: lo necesario para ejecutar', en: 'JRE: what you need to run' },
			text: {
				es: 'El JRE (Java Runtime Environment) es el paquete necesario para ejecutar aplicaciones Java. Contiene la JVM junto con las librerías estándar del lenguaje: java.lang, java.util, java.io, java.net y muchas más. Quien solo usa un programa Java necesita el JRE, no el compilador.',
				en: 'The JRE (Java Runtime Environment) is the package needed to run Java applications. It contains the JVM together with the language’s standard libraries: java.lang, java.util, java.io, java.net and many more. Someone who only uses a Java program needs the JRE, not the compiler.',
			},
		},
		{
			id: 'platform-jvm',
			chapter: 'wora',
			scene: 'platform',
			show: ['jdk', 'jre', 'jvm', 'tools', 'libs', 'classloader', 'verifier', 'jit', 'gc'],
			focus: ['jvm'],
			title: { es: 'JVM: el corazón operativo', en: 'JVM: the operating heart' },
			text: {
				es: 'La JVM (Java Virtual Machine) es una máquina simulada por software que interpreta y ejecuta el bytecode. Es el corazón de Java: gracias a ella el mismo .class corre en cualquier sistema. Dentro tiene cuatro componentes clave que vamos a ver uno por uno.',
				en: 'The JVM (Java Virtual Machine) is a software-simulated machine that interprets and executes bytecode. It is the heart of Java: thanks to it the same .class runs on any system. Inside it has four key components that we will look at one by one.',
			},
		},
		{
			id: 'platform-jvm-load',
			chapter: 'wora',
			scene: 'platform',
			show: ['jdk', 'jre', 'jvm', 'tools', 'libs', 'classloader', 'verifier', 'jit', 'gc'],
			focus: ['classloader', 'verifier'],
			title: { es: 'Class Loader y Bytecode Verifier', en: 'Class Loader and Bytecode Verifier' },
			text: {
				es: 'El Class Loader carga los archivos .class en memoria cuando el programa los necesita. Antes de ejecutar nada, el Bytecode Verifier comprueba la seguridad e integridad de ese código: que las instrucciones sean válidas y no violen las reglas del lenguaje. Primero cargar, después verificar.',
				en: 'The Class Loader loads .class files into memory when the program needs them. Before anything runs, the Bytecode Verifier checks the safety and integrity of that code: that the instructions are valid and do not break the language rules. First load, then verify.',
			},
		},
		{
			id: 'platform-jvm-run',
			chapter: 'wora',
			scene: 'platform',
			show: ['jdk', 'jre', 'jvm', 'tools', 'libs', 'classloader', 'verifier', 'jit', 'gc'],
			focus: ['jit', 'gc'],
			title: { es: 'Compilador JIT y Garbage Collector', en: 'JIT compiler and Garbage Collector' },
			text: {
				es: 'El compilador JIT (Just-In-Time) traduce los fragmentos de bytecode que se ejecutan con frecuencia directamente a código máquina nativo, para maximizar el rendimiento. El Garbage Collector (recolector de basura) gestiona la memoria automáticamente: libera los objetos que ya no están en uso sin que vos tengas que hacerlo a mano.',
				en: 'The JIT (Just-In-Time) compiler translates frequently executed bytecode fragments directly into native machine code to maximize performance. The Garbage Collector manages memory automatically: it frees objects that are no longer in use without you doing it by hand.',
			},
		},

		// ─── 2. Pipeline ────────────────────────────────────────────────────
		{
			id: 'pipeline-compile',
			chapter: 'pipeline',
			scene: 'pipeline',
			show: ['src', 'javac', 'bytecode'],
			focus: ['javac', 'bytecode'],
			title: { es: 'Fase 1: de código fuente a bytecode', en: 'Phase 1: from source code to bytecode' },
			text: {
				es: 'A diferencia de lenguajes interpretados puros (JavaScript, Python) o compilados nativos (C++), Java usa una compilación en dos fases. Primero, el código fuente .java que escribís en tu editor pasa por el compilador javac, que lo traduce a bytecode: un conjunto de instrucciones compactas e independientes de la plataforma, guardadas en un archivo .class.',
				en: 'Unlike purely interpreted languages (JavaScript, Python) or natively compiled ones (C++), Java uses a two-phase compilation. First, the .java source code you write in your editor goes through the javac compiler, which translates it into bytecode: a compact, platform-independent instruction set stored in a .class file.',
			},
		},
		{
			id: 'pipeline-run',
			chapter: 'pipeline',
			scene: 'pipeline',
			show: '*',
			focus: ['jvm', 'cpu'],
			title: { es: 'Fase 2: la JVM ejecuta sobre el procesador real', en: 'Phase 2: the JVM runs on the real processor' },
			text: {
				es: 'Segundo, la JVM instalada en el sistema operativo destino (Windows, macOS o Linux) lee el bytecode y lo ejecuta sobre el procesador real. Combina interpretación con compilación JIT: las partes más usadas se vuelven código nativo en caliente. El bytecode nunca cambia; cambia la JVM que lo ejecuta.',
				en: 'Second, the JVM installed on the target operating system (Windows, macOS or Linux) reads the bytecode and executes it on the real processor. It combines interpretation with JIT compilation: the most used parts become native code on the fly. The bytecode never changes; the JVM running it does.',
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
			text: {
				es: 'En Java no existen funciones sueltas ni código global: todo vive obligatoriamente dentro de una clase. Este es el clásico HolaMundo.java. La palabra class declara la clase y las llaves { } delimitan su cuerpo. Vamos a desglosarlo palabra por palabra.',
				en: 'In Java there are no loose functions or global code: everything must live inside a class. This is the classic HolaMundo.java. The word class declares the class and the braces { } delimit its body. Let’s break it down word by word.',
			},
		},
		{
			id: 'anatomy-public-class',
			chapter: 'anatomy',
			scene: 'anatomy',
			show: '*',
			focus: ['kw-public', 'kw-class'],
			code: { ...holaMundo, focusLines: [1] },
			title: { es: 'public y class', en: 'public and class' },
			text: {
				es: 'public es un modificador de acceso: significa que la clase es accesible desde cualquier parte del proyecto. class declara una clase, el bloque constructivo fundamental de la Programación Orientada a Objetos. Juntas abren la definición de nuestro programa.',
				en: 'public is an access modifier: it means the class is accessible from anywhere in the project. class declares a class, the fundamental building block of Object-Oriented Programming. Together they open our program’s definition.',
			},
		},
		{
			id: 'anatomy-name',
			chapter: 'anatomy',
			scene: 'anatomy',
			show: '*',
			focus: ['name', 'file-tab'],
			code: { ...holaMundo, focusLines: [1] },
			title: { es: 'HolaMundo y la regla de oro del archivo', en: 'HolaMundo and the golden rule of the file' },
			text: {
				es: 'HolaMundo es el nombre de la clase. Regla de oro: el archivo .java debe llamarse exactamente igual que la clase pública, respetando mayúsculas y minúsculas. La clase HolaMundo vive en HolaMundo.java; si el archivo se llama holamundo.java, el compilador se queja.',
				en: 'HolaMundo is the class name. Golden rule: the .java file must be named exactly like the public class, respecting upper and lower case. The HolaMundo class lives in HolaMundo.java; if the file is called holamundo.java, the compiler complains.',
			},
		},
		{
			id: 'anatomy-main',
			chapter: 'anatomy',
			scene: 'anatomy',
			show: '*',
			focus: ['kw-public-2', 'kw-static', 'kw-void', 'name-main'],
			code: { ...holaMundo, focusLines: [2] },
			title: { es: 'public static void main: el punto de entrada', en: 'public static void main: the entry point' },
			text: {
				es: 'main es el punto de entrada: la JVM busca exactamente un método llamado main para iniciar la ejecución. static indica que el método pertenece a la clase en sí y no a un objeto concreto, por eso la JVM puede llamarlo sin instanciar nada. void indica que realiza una acción pero no devuelve ningún valor.',
				en: 'main is the entry point: the JVM looks for exactly one method named main to start execution. static means the method belongs to the class itself rather than to a specific object, which is why the JVM can call it without instantiating anything. void means it performs an action but returns no value.',
			},
		},
		{
			id: 'anatomy-args',
			chapter: 'anatomy',
			scene: 'anatomy',
			show: '*',
			focus: ['args'],
			code: { ...holaMundo, focusLines: [2] },
			title: { es: 'String[] args: lo que llega desde la consola', en: 'String[] args: what arrives from the terminal' },
			text: {
				es: 'String[] args es un array de cadenas de texto. Recibe los argumentos que le pasás al programa desde la línea de comandos cuando lo ejecutás. En HolaMundo no lo usamos todavía, pero en unos pasos vamos a sacarle provecho.',
				en: 'String[] args is an array of text strings. It receives the arguments you pass to the program from the command line when you run it. We do not use it in HolaMundo yet, but in a few steps we will put it to work.',
			},
		},
		{
			id: 'anatomy-println',
			chapter: 'anatomy',
			scene: 'anatomy',
			show: '*',
			focus: ['println', 'string', 'semicolon'],
			code: { ...holaMundo, focusLines: [3] },
			title: { es: 'System.out.println y el punto y coma', en: 'System.out.println and the semicolon' },
			text: {
				es: 'System.out.println() imprime una línea en la consola estándar (out) seguida de un salto de línea. Entre paréntesis va el texto a mostrar, una cadena entre comillas dobles. Y al final, el punto y coma: cada instrucción en Java finaliza obligatoriamente con ;.',
				en: 'System.out.println() prints a line to the standard console (out) followed by a line break. Between the parentheses goes the text to show, a string in double quotes. And at the end, the semicolon: every statement in Java must end with ;.',
			},
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
			text: {
				es: 'Sigamos el flujo real desde la terminal. Primero guardá el código anterior en un archivo llamado HolaMundo.java, en una carpeta de trabajo. Recordá la regla de oro: el nombre del archivo coincide con el de la clase pública.',
				en: 'Let’s follow the real flow from the terminal. First save the previous code in a file named HolaMundo.java, inside a working folder. Remember the golden rule: the file name matches the public class name.',
			},
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
			text: {
				es: 'Ejecutá el compilador javac pasándole el archivo fuente. Si no hay errores de sintaxis, javac no imprime nada y crea el archivo binario HolaMundo.class en el mismo directorio. Ese .class es el bytecode que la JVM sabe ejecutar.',
				en: 'Run the javac compiler passing it the source file. If there are no syntax errors, javac prints nothing and creates the binary file HolaMundo.class in the same directory. That .class is the bytecode the JVM knows how to run.',
			},
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
			text: {
				es: 'Ejecutá la máquina virtual con el comando java indicando únicamente el nombre de la clase, sin la extensión .class. La JVM carga HolaMundo.class, verifica el bytecode, busca el método main y lo ejecuta. En la consola aparece el saludo.',
				en: 'Run the virtual machine with the java command, giving only the class name, without the .class extension. The JVM loads HolaMundo.class, verifies the bytecode, finds the main method and runs it. The greeting appears in the console.',
			},
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
			text: {
				es: 'El parámetro String[] args de la firma de main nos permite recibir datos cuando ejecutamos el programa. SaludoPersonalizado pregunta si args.length es mayor que cero: si llegó al menos un argumento, saluda por nombre; si no, muestra un mensaje genérico. Siempre verificá la longitud antes de leer una posición.',
				en: 'The String[] args parameter in main’s signature lets us receive data when we run the program. SaludoPersonalizado asks whether args.length is greater than zero: if at least one argument arrived, it greets by name; otherwise it shows a generic message. Always check the length before reading a position.',
			},
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
			text: {
				es: 'Compilamos y ejecutamos sin pasar nada después del nombre de la clase. La JVM igual crea el array args, pero vacío: args.length vale 0. La condición args.length > 0 es falsa, así que se ejecuta la rama else y vemos el saludo anónimo.',
				en: 'We compile and run without passing anything after the class name. The JVM still creates the args array, but empty: args.length is 0. The condition args.length > 0 is false, so the else branch runs and we see the anonymous greeting.',
			},
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
			text: {
				es: 'Ahora escribimos Facundo después del nombre de la clase. La JVM lo guarda en args[0] y args.length pasa a valer 1. La condición es verdadera, entra la rama if y el programa concatena el nombre dentro del saludo. Cada palabra extra en la consola sería otra posición del array.',
				en: 'Now we type Facundo after the class name. The JVM stores it in args[0] and args.length becomes 1. The condition is true, the if branch runs and the program concatenates the name into the greeting. Each extra word on the command line would be another array position.',
			},
		},

		// ─── 6. Conventions ─────────────────────────────────────────────────
		{
			id: 'conventions-naming',
			chapter: 'conventions',
			scene: 'conventions',
			show: ['pascal', 'camel', 'upper'],
			title: { es: 'Nombrar bien: PascalCase, camelCase y UPPER_SNAKE_CASE', en: 'Naming well: PascalCase, camelCase and UPPER_SNAKE_CASE' },
			text: {
				es: 'Para escribir Java profesional y legible, seguí las convenciones estándar. Clases e interfaces usan PascalCase: HolaMundo, CuentaBancaria, UsuarioService. Métodos y variables usan camelCase: calcularTotal(), nombreUsuario, saldoInicial. Las constantes usan UPPER_SNAKE_CASE: MAX_RETRY_COUNT, PI.',
				en: 'To write professional, readable Java, follow the standard conventions. Classes and interfaces use PascalCase: HolaMundo, CuentaBancaria, UsuarioService. Methods and variables use camelCase: calculateTotal(), userName, initialBalance. Constants use UPPER_SNAKE_CASE: MAX_RETRY_COUNT, PI.',
			},
		},
		{
			id: 'conventions-comments',
			chapter: 'conventions',
			scene: 'conventions',
			show: '*',
			focus: ['semi', 'cmt-line', 'cmt-block', 'cmt-doc'],
			code: { ...comentarios, focusLines: [1, 3, 4, 5, 6, 8, 9, 10] },
			title: { es: 'Punto y coma y tres tipos de comentario', en: 'Semicolon and three kinds of comment' },
			text: {
				es: 'Cada instrucción finaliza obligatoriamente con ;. Para explicar el código tenés tres tipos de comentario: // para una sola línea, /* ... */ para bloques multilínea con explicaciones extensas, y /** ... */ para Javadoc, que la herramienta javadoc transforma en documentación navegable de tu API.',
				en: 'Every statement must end with ;. To explain your code you have three kinds of comment: // for a single line, /* ... */ for multi-line blocks with longer explanations, and /** ... */ for Javadoc, which the javadoc tool turns into browsable documentation of your API.',
			},
		},

		// ─── 7. IDE ─────────────────────────────────────────────────────────
		{
			id: 'ide-options',
			chapter: 'ide',
			scene: 'ide',
			show: ['ide-local', 'ide-online', 'ide-term'],
			title: { es: 'Tres formas de escribir Java', en: 'Three ways to write Java' },
			text: {
				es: 'Podés escribir Java en un editor simple, pero un IDE (entorno de desarrollo integrado) reúne edición, compilación, ejecución, navegación y depuración. Hay tres caminos: un IDE local como IntelliJ IDEA, Eclipse o VS Code con extensiones; un IDE online en el navegador; o la terminal con javac y java. La elección depende de la tarea, no de cuál tiene más funciones.',
				en: 'You can write Java in a simple editor, but an IDE (integrated development environment) combines editing, compilation, execution, navigation and debugging. There are three paths: a local IDE such as IntelliJ IDEA, Eclipse or VS Code with extensions; an online IDE in the browser; or the terminal with javac and java. The choice depends on the task, not on which tool has the most features.',
			},
		},
		{
			id: 'ide-tradeoffs',
			chapter: 'ide',
			scene: 'ide',
			show: ['ide-local', 'ide-online', 'ide-term', 'lts'],
			focus: ['ide-local', 'lts'],
			title: { es: 'Ventajas, límites y la opción segura', en: 'Advantages, limits and the safe default' },
			text: {
				es: 'El IDE local trabaja sin conexión e integra el JDK, pero exige instalación y mantener alineadas sus versiones. El IDE online empieza rápido, pero puede limitar CPU, memoria o versión de Java y guarda tu código en un tercero. La terminal hace visible el flujo real, sin autocompletado. Para este curso, la opción segura es un JDK LTS local con la terminal como referencia. Si ves UnsupportedClassVersionError, no cambies código al azar: verificá la versión requerida.',
				en: 'The local IDE works offline and integrates the JDK, but requires installation and keeping versions aligned. The online IDE starts quickly, but may limit CPU, memory or Java version and stores your code with a third party. The terminal exposes the real flow, without completion. For this course the safe default is a local LTS JDK with the terminal as the reference. If you see UnsupportedClassVersionError, do not change code at random: verify the required version.',
			},
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
			text: {
				es: 'Antes de escribir tu primer proyecto: 1) ejecutá java --version y javac --version, ambas herramientas deben existir y ser compatibles; 2) configurá el proyecto para usar esa versión del JDK, no la que el IDE eligió por defecto; 3) compilá y ejecutá una vez desde la terminal para distinguir un error del código de uno del IDE; 4) guardá el proyecto localmente y bajo control de versiones; 5) no pegues contraseñas ni datos personales en servicios online.',
				en: 'Before writing your first project: 1) run java --version and javac --version, both tools must exist and be compatible; 2) configure the project to use that JDK version, not the one the IDE picked by default; 3) compile and run once from the terminal to tell a code error from an IDE one; 4) keep the project locally and under version control; 5) never paste passwords or personal data into online services.',
			},
		},

		// ─── 8. Javadoc ─────────────────────────────────────────────────────
		{
			id: 'javadoc-locate',
			chapter: 'javadoc',
			scene: 'javadoc',
			show: ['version', 'module', 'package', 'class'],
			focus: ['version', 'module', 'package', 'class'],
			title: { es: 'La API es el contrato; el Javadoc, cómo leerlo', en: 'The API is the contract; Javadoc is how you read it' },
			text: {
				es: 'La API de Java es el contrato de las clases disponibles y el Javadoc es la documentación navegable que lo presenta. Leerlo evita adivinar nombres, parámetros o errores. Primero confirmá la versión: abrí la documentación del mismo JDK que usa tu proyecto. Después localizá la clase por su nombre calificado: para String, la página indica el módulo java.base, el paquete java.lang y la clase String.',
				en: 'The Java API is the contract of the available classes and Javadoc is the browsable documentation that presents it. Reading it avoids guessing names, parameters or errors. First confirm the version: open the documentation of the same JDK your project uses. Then locate the class by its qualified name: for String, the page shows module java.base, package java.lang and class String.',
			},
		},
		{
			id: 'javadoc-signature',
			chapter: 'javadoc',
			scene: 'javadoc',
			show: ['version', 'module', 'package', 'class', 'summary', 'signature', 'params', 'returns'],
			focus: ['signature', 'params', 'returns'],
			title: { es: 'Firma exacta, parámetros y valor devuelto', en: 'Exact signature, parameters and return value' },
			text: {
				es: 'Leé el resumen de la clase antes de elegir un método y buscá la firma exacta: las sobrecargas comparten nombre. substring(int beginIndex, int endIndex) requiere dos índices enteros. Revisá cada parámetro: beginIndex es inclusivo y endIndex es exclusivo, no supongas el significado por el nombre. Y revisá el retorno: devuelve un nuevo String, no modifica el original.',
				en: 'Read the class summary before choosing a method and find the exact signature: overloads share a name. substring(int beginIndex, int endIndex) requires two integer indices. Review every parameter: beginIndex is inclusive and endIndex is exclusive, do not assume the meaning from the name. And review the return: it returns a new String, it does not modify the original.',
			},
		},
		{
			id: 'javadoc-throws',
			chapter: 'javadoc',
			scene: 'javadoc',
			show: '*',
			focus: ['throws', 'meta', 'links'],
			title: { es: 'Throws, Deprecated, Since y tipos enlazados', en: 'Throws, Deprecated, Since and linked types' },
			text: {
				es: 'La sección Throws declara IndexOutOfBoundsException cuando los índices quedan fuera de rango o invertidos: es parte del contrato. Una marca Deprecated explica qué alternativa usar y Since indica desde qué versión existe el método. Si un parámetro o retorno es un tipo desconocido, seguí su enlace y repetí el proceso: los tipos enlazados también son parte del contrato.',
				en: 'The Throws section declares IndexOutOfBoundsException when the indices fall out of range or are reversed: it is part of the contract. A Deprecated label explains which alternative to use and Since tells you from which version the method exists. If a parameter or return is an unknown type, follow its link and repeat the process: linked types are part of the contract too.',
			},
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
			text: {
				es: 'Queremos mostrar como máximo los primeros diez caracteres de un argumento. Math.min(10, texto.length()) da un límite seguro para textos cortos y respeta la precondición documentada. La entrada ausente o vacía produce un mensaje explícito por System.err y termina sin una excepción accidental. No conviene capturar IndexOutOfBoundsException y seguir con datos incorrectos: primero validá las condiciones que controlás.',
				en: 'We want to show at most the first ten characters of an argument. Math.min(10, text.length()) gives a safe boundary for short texts and respects the documented precondition. Missing or blank input produces an explicit message through System.err and exits without an accidental exception. Do not catch IndexOutOfBoundsException and continue with bad data: first validate the conditions you control.',
			},
		},
		{
			id: 'javadoc-mismatch',
			chapter: 'javadoc',
			scene: 'javadoc',
			show: '*',
			focus: ['version', 'meta'],
			title: { es: 'Cuando la documentación y el compilador no coinciden', en: 'When documentation and compiler disagree' },
			text: {
				es: 'Confirmá java --version, javac --version y la versión seleccionada por el proyecto. Verificá el encabezado de versión de la página Javadoc y la sección Since. Consultá la firma completa: quizás elegiste otra sobrecarga o importaste una clase con el mismo nombre. Tratá Deprecated como una señal de migración, no como un error que ocultar. Si el método es de una versión más nueva, usá la alternativa documentada o actualizá el JDK de forma deliberada. La documentación es la fuente del contrato; el autocompletado del IDE es solo una ayuda.',
				en: 'Confirm java --version, javac --version and the version selected by the project. Check the Javadoc page’s version heading and its Since section. Inspect the full signature: you may have picked another overload or imported a class with the same name. Treat Deprecated as a migration signal, not as an error to hide. If the method belongs to a newer version, use the documented alternative or upgrade the JDK deliberately. Documentation is the source of the contract; IDE completion is only an aid.',
			},
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
			text: {
				es: 'El mensaje "class HolaMundo is public, should be declared in a file named HolaMundo.java" aparece cuando el nombre del archivo no coincide exactamente con el de la clase public. Atención a las mayúsculas: holamundo.java y HolaMundo.java son archivos distintos para javac.',
				en: 'The message "class HolaMundo is public, should be declared in a file named HolaMundo.java" appears when the file name does not exactly match the public class name. Mind the capitalization: holamundo.java and HolaMundo.java are different files for javac.',
			},
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
			text: {
				es: '"Error: Could not find or load main class HolaMundo" significa que la JVM no encontró la clase. Las causas típicas: ejecutaste java HolaMundo.class con la extensión, en lugar de java HolaMundo, o no estás en el directorio donde quedó el archivo .class.',
				en: '"Error: Could not find or load main class HolaMundo" means the JVM could not find the class. The typical causes: you ran java HolaMundo.class with the extension instead of java HolaMundo, or you are not in the directory where the .class file ended up.',
			},
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
			text: {
				es: 'java.lang.ArrayIndexOutOfBoundsException salta cuando intentás acceder a args[0] sin verificar primero que args.length > 0 y no enviaste argumentos en la terminal. El array está vacío, la posición 0 no existe y la JVM detiene el programa. La solución ya la viste en SaludoPersonalizado: preguntar por la longitud antes de leer.',
				en: 'java.lang.ArrayIndexOutOfBoundsException fires when you try to access args[0] without first checking that args.length > 0 and you passed no arguments on the terminal. The array is empty, position 0 does not exist and the JVM stops the program. You already saw the fix in SaludoPersonalizado: check the length before reading.',
			},
		},

		// ─── 10. Exercise ───────────────────────────────────────────────────
		{
			id: 'exercise-challenge',
			chapter: 'exercise',
			scene: 'exercise',
			show: ['check', 'yes', 'no'],
			focus: ['check'],
			title: { es: 'Desafío: PerfilDesarrollador.java', en: 'Challenge: PerfilDesarrollador.java' },
			text: {
				es: 'Escribí un programa llamado PerfilDesarrollador.java que verifique si se le pasaron 2 argumentos desde la consola (nombre y lenguaje favorito). Si llegaron, debe imprimir un mensaje formateado del estilo "Desarrollador: [Nombre] | Especialidad: [Lenguaje]". Si no, debe mostrar un mensaje de uso explicativo. Intentá resolverlo antes de ver la solución.',
				en: 'Write a program named PerfilDesarrollador.java that checks whether 2 arguments were passed from the console (name and favorite language). If they arrived, it must print a formatted message like "Developer: [Name] | Specialty: [Language]". Otherwise it must show an explanatory usage message. Try to solve it before looking at the solution.',
			},
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
			text: {
				es: 'La solución reúne todo lo visto: una clase pública con el mismo nombre que el archivo, el método main como punto de entrada, la verificación args.length >= 2 antes de leer, dos variables en camelCase que guardan args[0] y args[1], y System.out.println para imprimir el perfil formateado. Con menos argumentos, la rama else explica el uso correcto.',
				en: 'The solution brings together everything we saw: a public class with the same name as the file, the main method as the entry point, the args.length >= 2 check before reading, two camelCase variables holding args[0] and args[1], and System.out.println to print the formatted profile. With fewer arguments, the else branch explains the correct usage.',
			},
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
			text: {
				es: 'Con un solo argumento, args.length vale 1, la condición >= 2 es falsa y entra la rama else. En lugar de fallar con una excepción, el programa imprime un mensaje de uso que le dice al usuario exactamente qué esperaba. Ese es el comportamiento de un programa bien hecho: validar primero y explicar después.',
				en: 'With a single argument, args.length is 1, the >= 2 condition is false and the else branch runs. Instead of failing with an exception, the program prints a usage message telling the user exactly what it expected. That is how a well-made program behaves: validate first, explain afterwards.',
			},
		},
		{
			id: 'closing-summary',
			chapter: 'exercise',
			scene: 'closing',
			show: '*',
			focus: ['repo'],
			title: { es: 'Resumen y código real para profundizar', en: 'Recap and real code to go deeper' },
			text: {
				es: 'Recorriste la plataforma Java (JDK, JRE, JVM), el flujo de compilación en dos fases, la anatomía de HolaMundo, la consola, los argumentos, las convenciones, los entornos, el Javadoc, los errores comunes y el ejercicio final. Podés reforzar todo con programas completos en el repositorio del curso: Ej01HolaMundo, Ej02SalidaEstandar con print, println y printf, y Ej03ConstantesYConvenciones. Clonalo, abrí la carpeta l01_conceptos_basicos y ejecutá cada programa mientras releés la lección.',
				en: 'You went through the Java platform (JDK, JRE, JVM), the two-phase compilation flow, the anatomy of HolaMundo, the terminal, arguments, conventions, environments, Javadoc, common mistakes and the final exercise. You can reinforce everything with complete programs in the course repository: Ej01HolaMundo, Ej02SalidaEstandar with print, println and printf, and Ej03ConstantesYConvenciones. Clone it, open the l01_conceptos_basicos folder and run each program while you re-read the lesson.',
			},
		},
	],
};
