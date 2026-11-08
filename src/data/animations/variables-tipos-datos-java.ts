import type { AnimationScript, CodePanel, Subtitle } from './types';

// Step-by-step animation for the Java lesson 02 "Variables, tipos de datos y
// operadores". Every step names the scene it shows (`data-scene` in
// `src/components/animaciones/variables-tipos-datos-java.astro`), the elements it
// reveals and the ones it emphasizes, plus its narration and any code panel.
// Narration plays as short captions, one idea each: the lesson page keeps the
// long-form explanation. The memory and casting chapters are motion steps: they
// animate one persistent SVG canvas with timed cues instead of revealing elements.

/** One caption of a step, timed after the previous one by its reading time. */
const say = (es: string, en: string): Subtitle => ({ text: { es, en } });

const declaraciones: CodePanel = {
	title: 'Declaraciones.java',
	language: 'java',
	source: {
		es: `// Declaración e inicialización
int edad = 25;
double precio = 99.99;
boolean esEstudiante = true;
char inicial = 'F';

// Constante (no se puede modificar su valor después de asignarlo)
final double PI = 3.14159;`,
		en: `// Declaration and initialization
int age = 25;
double price = 99.99;
boolean isStudent = true;
char initial = 'F';

// Constant (its value cannot be changed after it is assigned)
final double PI = 3.14159;`,
	},
};

const cuentaCampos: CodePanel = {
	title: 'Cuenta.java',
	language: 'java',
	source: {
		es: `public final class Cuenta {
    private static int totalCuentas = 0; // Campo de clase
    private int saldo;                   // Campo de instancia

    public Cuenta(int saldo) {           // Parámetro
        if (saldo < 0) {
            System.out.println("Saldo inválido, se usó 0 por defecto.");
            saldo = 0;
        }
        this.saldo = saldo;              // this.saldo distingue el campo
        totalCuentas++;
    }
    // ...
}`,
		en: `public final class Account {
    private static int totalAccounts = 0; // Class field
    private int balance;                  // Instance field

    public Account(int balance) {         // Parameter
        if (balance < 0) {
            System.out.println("Invalid balance, 0 was used by default.");
            balance = 0;
        }
        this.balance = balance;           // this.balance picks the field
        totalAccounts++;
    }
    // ...
}`,
	},
};

const cuentaAcreditar: CodePanel = {
	title: 'Cuenta.java',
	language: 'java',
	source: {
		es: `    public void acreditar(int monto) {
        if (monto <= 0) {
            System.out.println("Monto inválido, no se acreditó nada.");
            return;
        }
        int saldoAnterior = saldo;       // Variable local
        saldo += monto;

        if (saldo < saldoAnterior) {
            System.out.println("Desbordamiento detectado, se descarta la operación.");
            saldo = saldoAnterior;
        }
    }`,
		en: `    public void credit(int amount) {
        if (amount <= 0) {
            System.out.println("Invalid amount, nothing was credited.");
            return;
        }
        int previousBalance = balance;    // Local variable
        balance += amount;

        if (balance < previousBalance) {
            System.out.println("Overflow detected, the operation is discarded.");
            balance = previousBalance;
        }
    }`,
	},
};

const ambitoBloque: CodePanel = {
	title: 'Bloque.java',
	language: 'java',
	source: {
		es: `if (edad >= 18) {
    String mensaje = "Acceso permitido";
    System.out.println(mensaje);
}
// System.out.println(mensaje); // No compila: mensaje no es visible aquí.`,
		en: `if (age >= 18) {
    String message = "Access granted";
    System.out.println(message);
}
// System.out.println(message); // Does not compile: message is not visible here.`,
	},
	focusLines: [2, 5],
};

const asignacionDefinida: CodePanel = {
	title: 'AsignacionDefinida.java',
	language: 'java',
	source: {
		es: `int resultado;
// System.out.println(resultado); // No compila: quizá no fue inicializada.

int resultadoSeguro = 0; // Solo es correcto si 0 representa un valor válido.`,
		en: `int result;
// System.out.println(result); // Does not compile: it may not be initialized.

int safeResult = 0; // Only correct if 0 is a valid value.`,
	},
};

const aritmeticos: CodePanel = {
	title: 'Operadores.java',
	language: 'java',
	source: {
		es: `int a = 10;
int b = 3;
int cociente = a / b; // 3
int resto = a % b;    // 1`,
		en: `int a = 10;
int b = 3;
int quotient = a / b; // 3
int remainder = a % b; // 1`,
	},
};

const logicos: CodePanel = {
	title: 'Operadores.java',
	language: 'java',
	source: {
		es: `int edad = 20;
boolean esEstudiante = true;

boolean tieneEdad = edad >= 18;
boolean puedeIngresar = tieneEdad && esEstudiante;`,
		en: `int age = 20;
boolean isStudent = true;

boolean isAdult = age >= 18;
boolean canEnter = isAdult && isStudent;`,
	},
	focusLines: [4, 5],
};

const promedioAlumno: CodePanel = {
	title: 'PromedioAlumno.java',
	language: 'java',
	source: {
		es: `public class PromedioAlumno {
    public static void main(String[] args) {
        double nota1 = 7.0;
        double nota2 = 6.0;
        double nota3 = 8.0;
        double promedio = (nota1 + nota2 + nota3) / 3;
        boolean aprobo = promedio >= 6.0;
        System.out.println("Promedio: " + promedio);
        System.out.println("¿Aprobó? " + aprobo);
    }
}`,
		en: `public class StudentAverage {
    public static void main(String[] args) {
        double grade1 = 7.0;
        double grade2 = 6.0;
        double grade3 = 8.0;
        double average = (grade1 + grade2 + grade3) / 3;
        boolean passed = average >= 6.0;
        System.out.println("Average: " + average);
        System.out.println("Passed? " + passed);
    }
}`,
	},
	focusLines: [6, 7],
};

const same = (text: string) => ({ es: text, en: text });

export const script: AnimationScript = {
	chapters: [
		{ id: 'intro', label: { es: 'Introducción', en: 'Introduction' } },
		{ id: 'declare', label: { es: '1. Variables y constantes', en: '1. Variables and constants' } },
		{ id: 'scope', label: { es: '2. Ámbito y tiempo de vida', en: '2. Scope and lifetime' } },
		{ id: 'types', label: { es: '3. Primitivos y referencias', en: '3. Primitives and references' } },
		{ id: 'casting', label: { es: '4. Conversión de tipos', en: '4. Type casting' } },
		{ id: 'operators', label: { es: '5. Operadores', en: '5. Operators' } },
		{ id: 'exercise', label: { es: '6. Ejercicio', en: '6. Exercise' } },
	],
	steps: [
		// ─── Intro ──────────────────────────────────────────────────────────
		{
			id: 'intro-typing',
			chapter: 'intro',
			scene: 'typing',
			show: ['t-type', 't-name', 't-value', 't-lock'],
			title: { es: 'Java es estáticamente tipado', en: 'Java is statically typed' },
			subtitles: [
				say(
					'Java es estáticamente tipado: cada variable declara su tipo de forma explícita.',
					'Java is statically typed: every variable declares its type explicitly.',
				),
				say(
					'Y ese tipo no puede cambiar mientras el programa se ejecuta.',
					'And that type cannot change while the program runs.',
				),
			],
		},

		// ─── 1. Variables y constantes ──────────────────────────────────────
		{
			id: 'declare-vars',
			chapter: 'declare',
			scene: 'declare',
			show: ['v-int', 'v-double', 'v-bool', 'v-char'],
			focus: ['v-int', 'v-double', 'v-bool', 'v-char'],
			code: { ...declaraciones, focusLines: [2, 3, 4, 5] },
			title: { es: 'Declarar e inicializar', en: 'Declare and initialize' },
			subtitles: [
				say(
					'Una variable es un espacio reservado en memoria para guardar información.',
					'A variable is a reserved space in memory to store information.',
				),
				say(
					'Se declara con un tipo y un nombre, y se inicializa con `=`.',
					'You declare it with a type and a name, and initialize it with `=`.',
				),
			],
		},
		{
			id: 'declare-final',
			chapter: 'declare',
			scene: 'declare',
			show: ['v-int', 'v-double', 'v-bool', 'v-char', 'v-final'],
			focus: ['v-final'],
			code: { ...declaraciones, focusLines: [7, 8] },
			title: { es: 'Constantes con final', en: 'Constants with final' },
			subtitles: [
				say(
					'`final` declara una constante: una vez asignado, su valor no se puede modificar.',
					'`final` declares a constant: once assigned, its value cannot be modified.',
				),
				say(
					'Intentar reasignar `PI` más adelante es un error de compilación.',
					'Trying to reassign `PI` later is a compilation error.',
				),
			],
		},

		// ─── 2. Ámbito y tiempo de vida ─────────────────────────────────────
		{
			id: 'scope-terms',
			chapter: 'scope',
			scene: 'scopeterms',
			show: ['sc-scope', 'sc-vis', 'sc-life'],
			title: { es: 'Ámbito, visibilidad y tiempo de vida', en: 'Scope, visibility and lifetime' },
			subtitles: [
				say(
					'El ámbito es la región del código donde un nombre puede usarse.',
					'Scope is the region of code where a name can be used.',
				),
				say(
					'La visibilidad dice desde qué líneas se accede; el tiempo de vida, cuánto existe su valor.',
					'Visibility says from which lines it is reachable; lifetime, how long its value exists.',
				),
				say(
					'Son conceptos relacionados, pero no idénticos.',
					'They are related concepts, but not identical.',
				),
			],
		},
		{
			id: 'scope-lexical',
			chapter: 'scope',
			scene: 'nesting',
			show: ['n-class', 'n-method', 'n-block', 'n-noglobal'],
			focus: ['n-noglobal'],
			title: { es: 'Ámbitos léxicos', en: 'Lexical scopes' },
			subtitles: [
				say(
					'Java usa ámbitos léxicos definidos por clases, métodos y bloques `{ }`.',
					'Java uses lexical scopes defined by classes, methods and `{ }` blocks.',
				),
				say(
					'No existen variables globales libres: todo dato fuera de un método pertenece a una clase.',
					'There are no free global variables: any data outside a method belongs to a class.',
				),
			],
		},
		{
			id: 'scope-locals',
			chapter: 'scope',
			scene: 'scopetable',
			show: ['row-local', 'row-block', 'row-param'],
			focus: ['row-local', 'row-block', 'row-param'],
			title: { es: 'Locales, de bloque y parámetros', en: 'Locals, block variables and parameters' },
			subtitles: [
				say(
					'Las variables locales y de bloque viven hasta que termina su bloque y no tienen valor predeterminado.',
					'Local and block variables live until their block ends and have no default value.',
				),
				say(
					'Los parámetros reciben el valor del argumento y viven durante la invocación.',
					'Parameters receive the argument value and live during the call.',
				),
			],
		},
		{
			id: 'scope-fields',
			chapter: 'scope',
			scene: 'scopetable',
			show: ['row-local', 'row-block', 'row-param', 'row-instance', 'row-class'],
			focus: ['row-instance', 'row-class'],
			title: { es: 'Campos de instancia y de clase', en: 'Instance and class fields' },
			subtitles: [
				say(
					'Los campos de instancia viven mientras el objeto sea alcanzable; los de clase, desde que se carga la clase.',
					'Instance fields live while the object is reachable; class fields, from the moment the class is loaded.',
				),
				say(
					'Ambos reciben un valor predeterminado si no los asignás.',
					'Both receive a default value if you do not assign them.',
				),
			],
		},
		{
			id: 'scope-defaults',
			chapter: 'scope',
			scene: 'defaults',
			show: ['d-num', 'd-bool', 'd-null', 'd-warn'],
			focus: ['d-warn'],
			title: { es: 'Valores predeterminados de los campos', en: 'Default values of fields' },
			subtitles: [
				say(
					'Los campos numéricos reciben `0`, los booleanos `false` y las referencias `null`.',
					'Numeric fields get `0`, booleans `false` and references `null`.',
				),
				say(
					'Eso no significa que sean válidos: el constructor debe establecer el estado requerido.',
					'That does not mean they are valid: the constructor must set the required state.',
				),
			],
		},
		{
			id: 'scope-shadow',
			chapter: 'scope',
			scene: 'shadow',
			show: ['sh-class', 'sh-param', 'sh-this'],
			focus: ['sh-param', 'sh-this'],
			code: { ...cuentaCampos, focusLines: [5, 10] },
			title: { es: 'Sombreado y this', en: 'Shadowing and this' },
			subtitles: [
				say(
					'El parámetro `saldo` sombrea al campo con el mismo nombre.',
					'The `balance` parameter shadows the field with the same name.',
				),
				say(
					'`this.saldo` selecciona de forma explícita el campo de instancia.',
					'`this.balance` explicitly selects the instance field.',
				),
				say(
					'El sombreado es legal, pero abusarlo dificulta saber qué valor se modifica.',
					'Shadowing is legal, but overusing it makes it hard to know which value changes.',
				),
			],
		},
		{
			id: 'scope-local',
			chapter: 'scope',
			scene: 'flow',
			show: ['f-check', 'f-local', 'f-add', 'f-overflow'],
			focus: ['f-local'],
			code: { ...cuentaAcreditar, focusLines: [1, 7] },
			title: { es: 'Parámetro y variable local', en: 'Parameter and local variable' },
			subtitles: [
				say(
					'En `acreditar`, `monto` es un parámetro y `saldoAnterior` es una variable local.',
					'In `credit`, `amount` is a parameter and `previousBalance` is a local variable.',
				),
				say(
					'Validar antes de operar y detectar el desbordamiento evita dejar datos corruptos.',
					'Validating before operating and detecting overflow avoids leaving corrupt data.',
				),
			],
		},
		{
			id: 'scope-block',
			chapter: 'scope',
			scene: 'blockscope',
			show: ['bk-outer', 'bk-inner', 'bk-fail'],
			focus: ['bk-fail'],
			code: ambitoBloque,
			title: { es: 'Ámbito de bloque', en: 'Block scope' },
			subtitles: [
				say(
					'Un bloque también limita nombres: `mensaje` solo existe dentro del `if`.',
					'A block also limits names: `message` only exists inside the `if`.',
				),
				say('Fuera del bloque, usarla no compila.', 'Outside the block, using it does not compile.'),
			],
		},
		{
			id: 'scope-definite',
			chapter: 'scope',
			scene: 'definite',
			show: ['df-bad', 'df-good', 'df-note'],
			focus: ['df-bad', 'df-note'],
			code: asignacionDefinida,
			title: { es: 'Asignación definida', en: 'Definite assignment' },
			subtitles: [
				say(
					'Java exige asignación definida: el compilador debe probar que una local recibió valor antes de leerla.',
					'Java requires definite assignment: the compiler must prove a local got a value before it is read.',
				),
				say(
					'No pongas un valor arbitrario solo para silenciarlo: validá y documentá un valor por defecto real.',
					'Do not add an arbitrary value just to silence it: validate and document a real default.',
				),
			],
		},

		// ─── 3. Primitivos y referencias ────────────────────────────────────
		{
			id: 'types-ints',
			chapter: 'types',
			scene: 'primitives',
			show: ['p-byte', 'p-short', 'p-int', 'p-long'],
			focus: ['p-byte', 'p-short', 'p-int', 'p-long'],
			title: { es: 'Primitivos enteros', en: 'Integer primitives' },
			subtitles: [
				say(
					'Los tipos primitivos almacenan valores directos, no direcciones.',
					'Primitive types store direct values, not addresses.',
				),
				say(
					'Enteros: `byte` de 8 bits, `short` de 16, `int` de 32 y `long` de 64.',
					'Integers: `byte` with 8 bits, `short` with 16, `int` with 32 and `long` with 64.',
				),
				say(
					'Un literal `long` grande termina en `L`: `10000000000L`.',
					'A large `long` literal ends in `L`: `10000000000L`.',
				),
			],
		},
		{
			id: 'types-others',
			chapter: 'types',
			scene: 'primitives',
			show: ['p-byte', 'p-short', 'p-int', 'p-long', 'p-float', 'p-double', 'p-boolean', 'p-char'],
			focus: ['p-float', 'p-double', 'p-boolean', 'p-char'],
			title: { es: 'Decimales, boolean y char', en: 'Decimals, boolean and char' },
			subtitles: [
				say(
					'Decimales: `float` de 32 bits (`3.14f`) y `double` de 64 bits, de mayor precisión.',
					'Decimals: 32-bit `float` (`3.14f`) and 64-bit `double`, with higher precision.',
				),
				say(
					'`boolean` es `true` o `false`; `char` guarda un carácter Unicode de 16 bits, como `\'A\'`.',
					'`boolean` is `true` or `false`; `char` holds a 16-bit Unicode character, like `\'A\'`.',
				),
			],
		},
		{
			id: 'mem-primitives',
			chapter: 'types',
			scene: 'memory',
			title: { es: 'Los primitivos viven en la pila', en: 'Primitives live on the stack' },
			subtitles: [
				say(
					'Una variable primitiva guarda su valor directamente en la pila (stack).',
					'A primitive variable stores its value directly on the stack.',
				),
				say(
					'`int edad = 25;` y `double precio = 99.99;` reservan una celda cada una con su valor.',
					'`int age = 25;` and `double price = 99.99;` each reserve a cell holding its value.',
				),
			],
			motion: {
				cues: [
					{ at: 0, do: 'camera', to: ['editor', 'stack'], dur: 1 },
					{ at: 200, do: 'enter', el: 'editor' },
					{ at: 600, do: 'enter', el: 'stack' },
					{ at: 1200, do: 'enter', el: 'slot-edad' },
					{ at: 1400, do: 'enter', el: 'slot-precio' },
					{ at: 4800, do: 'type', el: 'code-1', dur: 900 },
					{ at: 5800, do: 'enter', el: 'val-edad' },
					{ at: 6000, do: 'move', el: 'val-edad', to: 'a-edad', dur: 1200 },
					{ at: 7500, do: 'type', el: 'code-2', dur: 1300 },
					{ at: 8900, do: 'enter', el: 'val-precio' },
					{ at: 9100, do: 'move', el: 'val-precio', to: 'a-precio', dur: 1200 },
					{ at: 10500, do: 'pulse', el: 'val-edad' },
					{ at: 10600, do: 'pulse', el: 'val-precio' },
				],
			},
		},
		{
			id: 'mem-reference',
			chapter: 'types',
			scene: 'memory',
			title: { es: 'Las referencias apuntan al heap', en: 'References point to the heap' },
			subtitles: [
				say(
					'Un `String` es una referencia: la variable guarda una dirección, no el objeto.',
					'A `String` is a reference: the variable stores an address, not the object.',
				),
				say(
					'El objeto vive en el heap (montón) y la pila solo apunta a él.',
					'The object lives on the heap and the stack just points to it.',
				),
			],
			motion: {
				cues: [
					{ at: 0, do: 'camera', to: 'all', dur: 1400 },
					{ at: 400, do: 'enter', el: 'slot-nombre' },
					{ at: 1400, do: 'type', el: 'code-3', dur: 1600 },
					{ at: 3400, do: 'enter', el: 'val-ref' },
					{ at: 5800, do: 'enter', el: 'heap' },
					{ at: 6500, do: 'enter', el: 'obj-string' },
					{ at: 7300, do: 'draw', el: 'arrow-ref', dur: 800 },
					{ at: 8400, do: 'pulse', el: 'obj-string' },
				],
			},
		},
		{
			id: 'mem-compare',
			chapter: 'types',
			scene: 'memory',
			title: { es: 'Valor directo o dirección', en: 'Direct value or address' },
			subtitles: [
				say(
					'Primitivo: el valor vive directo en la variable.',
					'Primitive: the value lives directly in the variable.',
				),
				say(
					'Referencia: la variable guarda la dirección y el objeto vive aparte.',
					'Reference: the variable stores the address and the object lives elsewhere.',
				),
			],
			motion: {
				cues: [
					{ at: 0, do: 'camera', to: 'all', dur: 1 },
					{ at: 200, do: 'enter', el: 'note-direct' },
					{ at: 700, do: 'pulse', el: 'val-edad' },
					{ at: 900, do: 'pulse', el: 'val-precio' },
					{ at: 4000, do: 'enter', el: 'note-ref' },
					{ at: 4500, do: 'pulse', el: 'val-ref' },
					{ at: 4700, do: 'pulse', el: 'obj-string' },
				],
			},
		},

		// ─── 4. Conversión de tipos ─────────────────────────────────────────
		{
			id: 'cast-widening',
			chapter: 'casting',
			scene: 'casting',
			title: { es: 'Casting implícito (widening)', en: 'Implicit casting (widening)' },
			subtitles: [
				say(
					'Casting implícito (widening): de un tipo menor a uno mayor, es automático.',
					'Implicit casting (widening): from a smaller type to a larger one, it is automatic.',
				),
				say(
					'`int numeroEntero = 10;` pasa a un `double` y vale 10.0 sin perder nada.',
					'`int wholeNumber = 10;` becomes a `double` and is 10.0 without losing anything.',
				),
			],
			motion: {
				cues: [
					{ at: 0, do: 'camera', to: ['ladder', 'w-int', 'w-double', 'w-note', 'code-w'], dur: 1 },
					{ at: 200, do: 'enter', el: 'ladder' },
					{ at: 3200, do: 'pulse', el: 'ladder', dur: 900 },
					{ at: 5300, do: 'enter', el: 'w-int' },
					{ at: 5700, do: 'type', el: 'code-w', dur: 1800 },
					{ at: 6100, do: 'enter', el: 'tok-10' },
					{ at: 7700, do: 'draw', el: 'w-arrow', dur: 800 },
					{ at: 8400, do: 'enter', el: 'w-double' },
					{ at: 9100, do: 'move', el: 'tok-10', to: 'a-wdouble', dur: 1200 },
					{ at: 10300, do: 'exit', el: 'tok-10', dur: 300 },
					{ at: 10300, do: 'enter', el: 'tok-10d', dur: 400 },
					{ at: 10700, do: 'enter', el: 'w-note' },
					{ at: 10900, do: 'pulse', el: 'w-double' },
				],
			},
		},
		{
			id: 'cast-narrowing',
			chapter: 'casting',
			scene: 'casting',
			title: { es: 'Casting explícito (narrowing)', en: 'Explicit casting (narrowing)' },
			subtitles: [
				say(
					'Casting explícito (narrowing): de un tipo mayor a uno menor, exige escribir `(tipo)`.',
					'Explicit casting (narrowing): from a larger type to a smaller one, you must write `(type)`.',
				),
				say(
					'`(int) precioExacto` convierte 45.89 en 45: se pierden los decimales.',
					'`(int) exactPrice` turns 45.89 into 45: the decimals are lost.',
				),
			],
			motion: {
				cues: [
					{ at: 0, do: 'camera', to: ['n-double', 'n-gate', 'n-int', 'n-note', 'code-n'], dur: 1500 },
					{ at: 200, do: 'enter', el: 'n-double' },
					{ at: 500, do: 'enter', el: 'tok-4589' },
					{ at: 1000, do: 'type', el: 'code-n', dur: 1800 },
					{ at: 3200, do: 'draw', el: 'n-arrow-in', dur: 700 },
					{ at: 3900, do: 'enter', el: 'n-gate' },
					{ at: 4400, do: 'pulse', el: 'n-gate', dur: 900 },
					{ at: 5600, do: 'move', el: 'tok-4589', to: 'a-gate', dur: 1200 },
					{ at: 6800, do: 'exit', el: 'tok-4589', dur: 300 },
					{ at: 6800, do: 'enter', el: 'tok-45', dur: 300 },
					{ at: 6800, do: 'enter', el: 'tok-frac', dur: 300 },
					{ at: 7200, do: 'draw', el: 'n-arrow-out', dur: 600 },
					{ at: 7500, do: 'enter', el: 'n-int' },
					{ at: 7800, do: 'move', el: 'tok-45', to: 'a-nint', dur: 1100 },
					{ at: 7800, do: 'move', el: 'tok-frac', to: 'a-drop', dur: 1100 },
					{ at: 9000, do: 'exit', el: 'tok-frac', dur: 500 },
					{ at: 9200, do: 'enter', el: 'n-note' },
					{ at: 9400, do: 'pulse', el: 'n-int' },
				],
			},
		},

		// ─── 5. Operadores ──────────────────────────────────────────────────
		{
			id: 'ops-arith',
			chapter: 'operators',
			scene: 'operators',
			show: ['op-arith', 'op-div', 'op-mod'],
			focus: ['op-div', 'op-mod'],
			code: { ...aritmeticos, focusLines: [3, 4] },
			title: { es: 'Operadores aritméticos', en: 'Arithmetic operators' },
			subtitles: [
				say(
					'Los operadores aritméticos son `+`, `-`, `*`, `/` y `%`, el módulo.',
					'The arithmetic operators are `+`, `-`, `*`, `/` and `%`, the modulo.',
				),
				say(
					'Con enteros, `10 / 3` da 3: la división descarta los decimales.',
					'With integers, `10 / 3` gives 3: the division drops the decimals.',
				),
				say('`10 % 3` da 1: el resto de esa división.', '`10 % 3` gives 1: the remainder of that division.'),
			],
		},
		{
			id: 'ops-logic',
			chapter: 'operators',
			scene: 'operators',
			show: ['op-arith', 'op-div', 'op-mod', 'op-rel', 'op-and', 'op-log'],
			focus: ['op-rel', 'op-and', 'op-log'],
			code: logicos,
			title: { es: 'Relacionales y lógicos', en: 'Relational and logical operators' },
			subtitles: [
				say(
					'Los relacionales comparan: `==`, `!=`, `>`, `<`, `>=` y `<=`; el resultado es un `boolean`.',
					'Relational operators compare: `==`, `!=`, `>`, `<`, `>=` and `<=`; the result is a `boolean`.',
				),
				say(
					'Los lógicos combinan booleanos: `&&` (AND), `||` (OR) y `!` (NOT).',
					'Logical operators combine booleans: `&&` (AND), `||` (OR) and `!` (NOT).',
				),
				say(
					'`tieneEdad && esEstudiante` es verdadero solo si ambos lo son.',
					'`isAdult && isStudent` is true only if both are.',
				),
			],
		},

		// ─── 6. Ejercicio ───────────────────────────────────────────────────
		{
			id: 'exercise-challenge',
			chapter: 'exercise',
			scene: 'exercise',
			show: ['ex-n1', 'ex-n2', 'ex-n3', 'ex-avg-q', 'ex-pass-q'],
			focus: ['ex-avg-q', 'ex-pass-q'],
			title: { es: 'Desafío: promedio de un alumno', en: 'Challenge: a student’s average' },
			subtitles: [
				say(
					'Declará las notas de tres exámenes y calculá el promedio con `double`.',
					'Declare the grades of three exams and compute the average with `double`.',
				),
				say(
					'Imprimí si aprobó (promedio >= 6.0) con un `boolean`. Intentalo antes de ver la solución.',
					'Print whether the student passed (average >= 6.0) using a `boolean`. Try it before the solution.',
				),
			],
		},
		{
			id: 'exercise-solution',
			chapter: 'exercise',
			scene: 'exercise',
			show: ['ex-n1', 'ex-n2', 'ex-n3', 'ex-avg', 'ex-pass'],
			focus: ['ex-avg', 'ex-pass'],
			code: promedioAlumno,
			shell: {
				lines: [
					{ kind: 'cmd', text: same('javac PromedioAlumno.java') },
					{ kind: 'cmd', text: same('java PromedioAlumno') },
					{ kind: 'out', text: { es: 'Promedio: 7.0', en: 'Average: 7.0' } },
					{ kind: 'out', text: { es: '¿Aprobó? true', en: 'Passed? true' } },
				],
			},
			title: { es: 'Solución sugerida', en: 'Suggested solution' },
			subtitles: [
				say(
					'Sumar tres `double` y dividir por 3 conserva los decimales.',
					'Adding three `double` values and dividing by 3 keeps the decimals.',
				),
				say(
					'`promedio >= 6.0` produce el `boolean` `aprobo`, que se imprime junto al promedio.',
					'`average >= 6.0` produces the `boolean` `passed`, printed next to the average.',
				),
			],
		},
		{
			id: 'closing-summary',
			chapter: 'exercise',
			scene: 'closing',
			show: ['s1', 's2', 's3', 's4', 's5', 's6', 'repo'],
			focus: ['repo'],
			title: { es: 'Resumen y código real', en: 'Summary and real code' },
			subtitles: [
				say(
					'Recorriste variables, constantes, ámbito, tipos primitivos y por referencia, casting y operadores.',
					'You covered variables, constants, scope, primitive and reference types, casting and operators.',
				),
				say(
					'Cloná el repositorio y ejecutá los ocho programas de `l02_variables_tipos_datos_y_operadores`.',
					'Clone the repository and run the eight programs in `l02_variables_tipos_datos_y_operadores`.',
				),
			],
		},
	],
};
