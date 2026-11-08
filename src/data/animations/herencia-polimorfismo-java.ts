import type { AnimationScript, CodePanel, MotionCue, ShellLine, ShellPanel, Subtitle } from './types';

// Step-by-step animation for the Java lesson 10 "Herencia, Polimorfismo y Sobrecarga".
// Every step names the scene it shows (`data-scene` in
// `src/components/animaciones/herencia-polimorfismo-java.astro`), the elements it
// reveals and emphasizes, plus its captions and any code or terminal panel.
// Seven chapters play as motion steps on persistent SVG canvases (the hierarchy, the
// constructor chain, overloading vs. overriding, dynamic dispatch, a polymorphic
// fleet, composition and the `Object` root); the rest are slide steps.

const say = (es: string, en: string): Subtitle => ({ text: { es, en } });

// ─── Bilingual identifiers ───────────────────────────────────────────────────
// Code and terminal panels are written once, with the Spanish identifiers of the
// Spanish lesson. The English lesson uses its own names (Vehicle, Car, start…), so
// the English text is derived from the Spanish one with this table: messages first
// (they contain identifiers), then the identifiers themselves.
const MESSAGES: Array<[string, string]> = [
	['El vehículo arranca.', 'The vehicle starts.'],
	['El vehículo frena.', 'The vehicle brakes.'],
	['arrancando con botón.', 'starting with a push button.'],
	['Baúl abierto.', 'Trunk open.'],
	['...y activa el arranque sin llave.', '...and engage keyless ignition.'],
	['primero hace lo que hace todo vehículo', 'first do what every vehicle does'],
	['Al escribir este constructor, Vehiculo dejó de tener uno sin argumentos', 'By writing this constructor, Vehicle no longer has a no-arg one'],
	['ERROR: Java intenta insertar super() y Vehiculo no tiene ese constructor', 'ERROR: Java tries to insert super() and Vehicle has no such constructor'],
	['← ERROR de compilación, y eso es bueno', '← compile error, and that is a good thing'],
	['Este método no conoce Auto, Moto ni Camión. Y no necesita conocerlos.', 'This method knows nothing about Car, Motorcycle, or Truck. It does not need to.'],
	['cada objeto ejecuta SU propia versión', 'each object runs ITS own version'],
	['nadie puede heredar de acá', 'nobody can inherit from this'],
	['este método no se sobrescribe', 'this method cannot be overridden'],
	['primera sentencia, obligatorio', 'first statement, mandatory'],
	['extiende, no reemplaza', 'extends, does not replace'],
	['comisión del 8 %', '8 % commission'],
	['Un solo bucle, sin instanceof y sin casteos:', 'A single loop, no instanceof and no casts:'],
	['delega en el motor', 'delegates to the engine'],
];

const IDENTIFIERS: Array<[string, string]> = [
	['Vehiculo', 'Vehicle'],
	['Auto', 'Car'],
	['Moto', 'Motorcycle'],
	['Camion', 'Truck'],
	['Motor', 'Engine'],
	['Taller', 'Garage'],
	['Bicicleta', 'Bicycle'],
	['marca', 'brand'],
	['arrancar', 'start'],
	['frenar', 'brake'],
	['abrirBaul', 'openTrunk'],
	['encender', 'ignite'],
	['revisar', 'inspect'],
	['flota', 'fleet'],
	['velocidad', 'speed'],
	['Empleado', 'Employee'],
	['Gerente', 'Manager'],
	['Vendedor', 'SalesRep'],
	['sueldoBase', 'baseSalary'],
	['calcularSalario', 'computeSalary'],
	['nombre', 'name'],
	['bono', 'bonus'],
	['ventasDelMes', 'monthlySales'],
	['nomina', 'payroll'],
	['salario', 'salary'],
	['Coordenada', 'Coordinate'],
	['Cuenta', 'Account'],
	['acreditar', 'credit'],
	['monto', 'amount'],
	['COMISION', 'COMMISSION'],
	['MainNomina', 'MainPayroll'],
];

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** The English version of a Spanish code or terminal text (see the tables above). */
function toEnglish(text: string): string {
	let result = text;
	for (const [es, en] of MESSAGES) result = result.split(es).join(en);
	for (const [es, en] of IDENTIFIERS) {
		result = result.replace(new RegExp(`(?<![\\p{L}\\p{N}_])${escapeRegExp(es)}(?![\\p{L}\\p{N}_])`, 'gu'), en);
	}
	return result;
}

const code = (title: string, es: string, focusLines?: number[]): CodePanel => ({
	title,
	language: 'java',
	source: { es, en: toEnglish(es) },
	...(focusLines ? { focusLines } : {}),
});

const loc = (text: string) => ({ es: text, en: toEnglish(text) });
const shell = (...lines: ShellLine[]): ShellPanel => ({ lines });
const cmd = (text: string): ShellLine => ({ kind: 'cmd', text: loc(text) });
const out = (text: string): ShellLine => ({ kind: 'out', text: loc(text) });
const err = (text: string): ShellLine => ({ kind: 'err', text: loc(text) });

// ─── Cue helpers ────────────────────────────────────────────────────────────
const enter = (at: number, el: string, dur?: number): MotionCue => ({ at, do: 'enter', el, ...(dur ? { dur } : {}) });
const exit = (at: number, el: string, dur?: number): MotionCue => ({ at, do: 'exit', el, ...(dur ? { dur } : {}) });
const draw = (at: number, el: string, dur?: number): MotionCue => ({ at, do: 'draw', el, ...(dur ? { dur } : {}) });
const type = (at: number, el: string, dur?: number): MotionCue => ({ at, do: 'type', el, ...(dur ? { dur } : {}) });
const pulse = (at: number, el: string): MotionCue => ({ at, do: 'pulse', el });
const move = (at: number, el: string, to: string, options: { dx?: number; dy?: number; dur?: number } = {}): MotionCue => ({
	at,
	do: 'move',
	el,
	to,
	...options,
});
const camera = (at: number, to: string[] | 'all', options: { dur?: number; pad?: number } = {}): MotionCue => ({
	at,
	do: 'camera',
	to,
	...options,
});

/**
 * Pins captions on the step timeline: each one starts once the previous has been
 * read (same formula as `subtitleReadingTime`, for the slower locale) plus a pause.
 * Motion steps use the starts to sync their cues with what is being said.
 */
const readingMs = (sub: Subtitle) => 1200 + Math.max(sub.text.es.length, sub.text.en.length) * 55;
function timed(...subs: Subtitle[]) {
	let at = 0;
	const starts: number[] = [];
	const list = subs.map((sub) => {
		starts.push(at);
		const placed: Subtitle = { ...sub, at };
		at += readingMs(sub) + 200;
		return placed;
	});
	return { list, start: (index: number) => starts[index] ?? 0 };
}

// ─── Motion captions (cues below are placed relative to their starts) ───────
const hierExtends = timed(
	say('`extends` hace que Auto reciba todos los atributos y métodos de Vehiculo.', '`extends` makes Car receive every field and method of Vehicle.'),
	say('La flecha apunta al padre: va de lo específico a lo general.', 'The arrow points at the parent: it goes from the specific to the general.'),
);
const hierInherit = timed(
	say('Auto no declara `marca` ni `frenar()`, pero los tiene: los heredó.', 'Car declares neither `brand` nor `brake()`, yet it has both: it inherited them.'),
	say('Moto y Camión reciben lo mismo, y cada clase suma lo propio.', 'Motorcycle and Truck get the same, and each class adds its own.'),
);
const hierOverride = timed(
	say('Una subclase puede redefinir un método heredado con `@Override`.', 'A subclass can redefine an inherited method with `@Override`.'),
	say('Auto y Moto cambian `arrancar()`; Camión cambia `frenar()`.', 'Car and Motorcycle change `start()`; Truck changes `brake()`.'),
	say('Todo lo demás sigue siendo el del padre.', 'Everything else stays the parent’s.'),
);
const hierIsA = timed(
	say('Antes de escribir `extends`, preguntate en voz alta: ¿un X es un Y?', 'Before writing `extends`, ask yourself out loud: is an X a Y?'),
	say('Un Auto es un Vehiculo: la herencia está bien puesta.', 'A Car is a Vehicle: the inheritance is right.'),
	say('Un Auto no es un Motor: tiene uno. Eso es composición.', 'A Car is not an Engine: it has one. That is composition.'),
);
const hierSingle = timed(
	say('Java tiene herencia simple: una clase extiende a una sola clase.', 'Java has single inheritance: a class extends exactly one class.'),
	say('No existe `extends A, B`: para combinar comportamientos están las interfaces.', 'There is no `extends A, B`: interfaces exist to combine behaviors.'),
);

const chainNew = timed(
	say('Al instanciar una subclase no corre un constructor: corre toda la cadena.', 'Instantiating a subclass does not run one constructor: it runs the whole chain.'),
	say('Va desde `Object`, el ancestro más lejano, hasta la clase concreta.', 'It goes from `Object`, the farthest ancestor, down to the concrete class.'),
);
const chainUp = timed(
	say('Primero suben las llamadas: cada `super(...)` le cede el control al padre.', 'First the calls go up: each `super(...)` hands control to the parent.'),
	say('Si no escribís `super(...)`, Java inserta `super()` por su cuenta.', 'If you do not write `super(...)`, Java inserts `super()` on its own.'),
);
const chainDown = timed(
	say('Después se ejecutan los cuerpos, de arriba hacia abajo: 1, 2 y 3.', 'Then the bodies run from the top down: 1, 2 and 3.'),
	say('Cuando corre el cuerpo de Auto, la parte heredada ya está inicializada.', 'By the time the body of Car runs, the inherited part is fully initialized.'),
);

const ovlOverload = timed(
	say('Sobrecarga: varios métodos con el mismo nombre dentro de la misma clase.', 'Overloading: several methods with the same name inside the same class.'),
	say('El compilador elige mirando los tipos de los argumentos que escribiste.', 'The compiler picks by looking at the types of the arguments you wrote.'),
	say('Todo queda resuelto antes de ejecutar: no hay herencia en juego.', 'Everything is settled before running: no inheritance involved.'),
);
const ovlOverride = timed(
	say('Sobrescritura: un mismo método redefinido más abajo en la jerarquía.', 'Overriding: one method redefined lower in the hierarchy.'),
	say('La decide la JVM, mirando el objeto real que hay en el Heap.', 'The JVM decides, looking at the real object on the Heap.'),
	say('Solo se sabe con el programa ya corriendo.', 'It is only known once the program is running.'),
);
const ovlReturn = timed(
	say('El tipo de retorno no cuenta para la sobrecarga.', 'The return type does not count for overloading.'),
	say('`int calcular()` y `double calcular()` no compilan juntos: ¿cuál elegir?', '`int compute()` and `double compute()` do not compile together: which one to pick?'),
);

const polyDecl = timed(
	say('Una variable `Vehiculo` puede apuntar a cualquier objeto que sea un Vehiculo.', 'A `Vehicle` variable can point at any object that is a Vehicle.'),
	say('La variable vive en el Stack; el objeto, con sus capas heredadas, en el Heap.', 'The variable lives on the Stack; the object, with its inherited layers, on the Heap.'),
);
const polyTypes = timed(
	say('El tipo de la variable decide qué métodos podés escribir: lo revisa el compilador.', 'The variable’s type decides which methods you may write: the compiler checks it.'),
	say('El tipo del objeto decide qué código corre: lo resuelve la JVM en cada llamada.', 'The object’s type decides which code runs: the JVM resolves it on every call.'),
	say('Esas dos frases son, literalmente, la definición de polimorfismo.', 'Those two sentences are, literally, the definition of polymorphism.'),
);
const polyDispatch = timed(
	say('`v.arrancar()`: el compilador comprueba que `Vehiculo` declare `arrancar()`.', '`v.start()`: the compiler checks that `Vehicle` declares `start()`.'),
	say('En ejecución, la JVM sigue la referencia y busca el método en el objeto real.', 'At runtime the JVM follows the reference and looks for the method in the real object.'),
	say('Empieza por Auto: ahí está la versión sobrescrita, y esa es la que corre.', 'It starts at Car: the overridden version is there, and that is the one that runs.'),
);
const polyInherited = timed(
	say('`v.frenar()`: Auto no lo sobrescribió, así que la búsqueda sigue hacia arriba.', '`v.brake()`: Car did not override it, so the search keeps going up.'),
	say('Lo encuentra en Vehiculo y ejecuta esa versión heredada.', 'It finds it in Vehicle and runs that inherited version.'),
);
const polyCast = timed(
	say('`v.abrirBaul()` no compila: `Vehiculo` no declara `abrirBaul()`.', '`v.openTrunk()` does not compile: `Vehicle` does not declare `openTrunk()`.'),
	say('Para usar lo propio de Auto hace falta un casteo, con red: `instanceof`.', 'To use what is specific to Car you need a cast, with a safety net: `instanceof`.'),
	say('Sin la comprobación, un casteo equivocado revienta con `ClassCastException`.', 'Without the check, a wrong cast blows up with `ClassCastException`.'),
);

const fleetArray = timed(
	say('Un arreglo de `Vehiculo` guarda a la vez un Auto, una Moto y un Camión.', 'A `Vehicle` array holds a Car, a Motorcycle and a Truck at once.'),
	say('Cada casilla apunta a un objeto distinto, pero todas son de tipo `Vehiculo`.', 'Each cell points at a different object, but all of them are of type `Vehicle`.'),
);
const fleetLoop = timed(
	say('`Taller.revisar` recorre la flota sin saber qué clase hay en cada casilla.', '`Garage.inspect` walks the fleet without knowing which class sits in each cell.'),
	say('Cada objeto ejecuta SU propia versión de `arrancar()`.', 'Each object runs ITS own version of `start()`.'),
	say('Es un solo bucle: no hay `instanceof` ni casteos.', 'It is a single loop: no `instanceof` and no casts.'),
);
const fleetNew = timed(
	say('Mañana agregás `Bicicleta extends Vehiculo` y el Taller la maneja sin cambios.', 'Tomorrow you add `Bicycle extends Vehicle` and the Garage handles it unchanged.'),
	say('Ese es el premio: código nuevo que se integra sin tocar el que ya funcionaba.', 'That is the payoff: new code that plugs in without touching code that already worked.'),
);

const composeBad = timed(
	say('La herencia es la relación más fuerte entre dos clases: ata la subclase al padre.', 'Inheritance is the strongest relationship between two classes: it ties the subclass to the parent.'),
	say('`Auto extends Motor` no pasa la prueba: un Auto no es un Motor.', '`Car extends Engine` fails the test: a Car is not an Engine.'),
);
const composeHas = timed(
	say('Composición: un Auto tiene un Motor y le delega el trabajo.', 'Composition: a Car has an Engine and delegates the work to it.'),
	say('`motor.encender()`: el Auto no hereda nada, solo le pide al motor.', '`engine.ignite()`: the Car inherits nothing, it just asks the engine.'),
);
const composeSwap = timed(
	say('Podés cambiar el motor sin tocar una línea del Auto.', 'You can swap the engine without touching a single line of Car.'),
	say('Y probar el Auto con un motor de mentira. La herencia no permite ninguna de las dos.', 'And test the Car with a fake engine. Inheritance allows neither.'),
);

const objRoot = timed(
	say('Aunque no escribas `extends`, toda clase de Java hereda de `Object`.', 'Even if you never write `extends`, every Java class inherits from `Object`.'),
	say('De ahí vienen métodos que ya usaste sin notarlo: `toString()`, `equals()` y `hashCode()`.', 'That is where methods you used without noticing come from: `toString()`, `equals()` and `hashCode()`.'),
);
const objDefault = timed(
	say('Sin sobrescribir `toString()`, `println(a)` imprime la clase y un código hash.', 'Without overriding `toString()`, `println(a)` prints the class and a hash code.'),
	say('La búsqueda sube hasta `Object` y ejecuta su versión: inútil para depurar.', 'The search climbs up to `Object` and runs its version: useless for debugging.'),
);
const objOverride = timed(
	say('Sobrescribirlo cuesta dos líneas y te devuelve horas de depuración.', 'Overriding it costs two lines and gives you back hours of debugging.'),
	say('Ahora la búsqueda se detiene en Auto y el resultado se puede leer.', 'Now the search stops at Car and the result is readable.'),
	say('`equals()` y `hashCode()` tienen reglas propias: los verás en la lección 16.', '`equals()` and `hashCode()` have rules of their own: you will see them in lesson 16.'),
);

// ─── Code panels ────────────────────────────────────────────────────────────
const vehicleAndCar = code(
	'Vehiculo.java',
	`public class Vehiculo {
    protected String marca;

    public Vehiculo(String marca) { this.marca = marca; }

    public void arrancar() { System.out.println("El vehículo arranca."); }
    public void frenar()   { System.out.println("El vehículo frena."); }
}

public class Auto extends Vehiculo {
    public Auto(String marca) { super(marca); }

    @Override
    public void arrancar() {
        System.out.println("Auto " + marca + " arrancando con botón.");
    }

    public void abrirBaul() { System.out.println("Baúl abierto."); }
}`,
	[1, 10, 14],
);

const noDefaultConstructor = code(
	'Auto.java',
	`public class Vehiculo {
    protected String marca;
    public Vehiculo(String marca) { this.marca = marca; }
    // Al escribir este constructor, Vehiculo dejó de tener uno sin argumentos
}

public class Auto extends Vehiculo {
    public Auto() {
        // ERROR: Java intenta insertar super() y Vehiculo no tiene ese constructor
    }
}`,
	[8, 9],
);

const superMethod = code(
	'Auto.java',
	`@Override
public void arrancar() {
    super.arrancar();                  // primero hace lo que hace todo vehículo
    System.out.println("...y activa el arranque sin llave.");
}`,
	[3],
);

const overrideTypo = code(
	'Auto.java',
	`public class Auto extends Vehiculo {
    @Override
    public void arrancar(int velocidad) {   // ← ERROR de compilación, y eso es bueno
        ...
    }
}`,
	[3],
);

const polymorphicLoop = code(
	'Taller.java',
	`public class Taller {
    // Este método no conoce Auto, Moto ni Camión. Y no necesita conocerlos.
    public void revisar(Vehiculo[] flota) {
        for (Vehiculo v : flota) {
            v.arrancar();   // cada objeto ejecuta SU propia versión
            v.frenar();
        }
    }
}

Vehiculo[] flota = {
    new Auto("Toyota"),
    new Moto("Honda"),
    new Camion("Scania")
};
new Taller().revisar(flota);`,
	[4, 5, 6],
);

const finalKeyword = code(
	'Cuenta.java',
	`public final class Coordenada { ... }   // nadie puede heredar de acá

public class Cuenta {
    public final void acreditar(double monto) { ... }   // este método no se sobrescribe
}`,
	[1, 4],
);

const payrollHierarchy = code(
	'Empleado.java',
	`public class Empleado {
    private final String nombre;
    private final double sueldoBase;

    public Empleado(String nombre, double sueldoBase) {
        this.nombre = nombre;
        this.sueldoBase = sueldoBase;
    }

    public double calcularSalario() { return sueldoBase; }

    @Override
    public String toString() { return getClass().getSimpleName() + " " + nombre; }
}

public class Gerente extends Empleado {
    private final double bono;

    public Gerente(String nombre, double sueldoBase, double bono) {
        super(nombre, sueldoBase);          // primera sentencia, obligatorio
        this.bono = bono;
    }

    @Override
    public double calcularSalario() {
        return super.calcularSalario() + bono;   // extiende, no reemplaza
    }
}

public class Vendedor extends Empleado {
    private static final double COMISION = 0.08;   // comisión del 8 %
    private final double ventasDelMes;

    public Vendedor(String nombre, double sueldoBase, double ventasDelMes) {
        super(nombre, sueldoBase);
        this.ventasDelMes = ventasDelMes;
    }

    @Override
    public double calcularSalario() {
        return super.calcularSalario() + ventasDelMes * COMISION;
    }
}`,
	[20, 26, 41],
);

const payrollLoop = code(
	'MainNomina.java',
	`Empleado[] nomina = {
    new Empleado("Ana Torres", 800000),
    new Gerente("Luis Paz", 1500000, 400000),
    new Vendedor("Sofia Rios", 700000, 2500000)
};

double total = 0;
// Un solo bucle, sin instanceof y sin casteos:
for (Empleado e : nomina) {
    double salario = e.calcularSalario();
    total += salario;
    System.out.printf("%-22s $ %,.2f%n", e, salario);
}
System.out.printf("%-22s $ %,.2f%n", "TOTAL", total);`,
	[9, 10, 11],
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'intro', label: { es: 'Introducción', en: 'Introduction' } },
		{ id: 'extends', label: { es: '1. Herencia: extends', en: '1. Inheritance: extends' } },
		{ id: 'ctor', label: { es: '2. super y los constructores', en: '2. super and constructors' } },
		{ id: 'override', label: { es: '3. Sobrescritura', en: '3. Overriding' } },
		{ id: 'overload', label: { es: '4. Sobrecarga vs. sobrescritura', en: '4. Overloading vs. overriding' } },
		{ id: 'poly', label: { es: '5. Polimorfismo', en: '5. Polymorphism' } },
		{ id: 'usage', label: { es: '5b. Para qué sirve', en: '5b. What it is for' } },
		{ id: 'avoid', label: { es: '6. Cuándo no heredar', en: '6. When not to inherit' } },
		{ id: 'object', label: { es: '7. Todo hereda de Object', en: '7. Everything inherits from Object' } },
		{ id: 'errors', label: { es: '8. Errores frecuentes', en: '8. Common mistakes' } },
		{ id: 'exercise', label: { es: '9. Ejercicio guiado', en: '9. Guided exercise' } },
	],
	steps: [
		// ─── Intro ──────────────────────────────────────────────────────────
		{
			id: 'intro-problem',
			chapter: 'intro',
			scene: 'intro10',
			show: ['auto', 'moto', 'camion', 'problem'],
			focus: ['problem'],
			title: { es: 'Clases que repiten lo mismo', en: 'Classes that repeat themselves' },
			subtitles: [
				say('Un Auto, una Moto y un Camión comparten marca, `arrancar()` y `frenar()`.', 'A Car, a Motorcycle and a Truck share a brand, `start()` and `brake()`.'),
				say('Copiar y pegar funciona hasta que cambia una regla: ahí hay que acordarse de los tres lugares.', 'Copy and paste works until a rule changes: then you must remember all three places.'),
			],
		},
		{
			id: 'intro-solution',
			chapter: 'intro',
			scene: 'intro10',
			show: '*',
			focus: ['solution'],
			code: vehicleAndCar,
			title: { es: 'La herencia lo resuelve', en: 'Inheritance solves it' },
			subtitles: [
				say('La herencia pone lo común arriba, una sola vez, y cada clase lo recibe.', 'Inheritance puts what is common on top, once, and every class receives it.'),
				say('El polimorfismo es su consecuencia: por eso la lección trata las dos cosas juntas.', 'Polymorphism is its consequence: that is why the lesson covers both together.'),
			],
		},

		// ─── 1. Inheritance (motion) ────────────────────────────────────────
		{
			id: 'hier-extends',
			chapter: 'extends',
			scene: 'hier',
			title: { es: 'extends: la jerarquía', en: 'extends: the hierarchy' },
			subtitles: hierExtends.list,
			motion: {
				cues: [
					type(0, 'decl', 1700),
					enter(1000, 'vehiculo'),
					enter(1700, 'auto'),
					enter(1900, 'moto'),
					enter(2100, 'camion'),
					draw(2700, 'a-auto', 900),
					draw(2900, 'a-moto', 900),
					draw(3100, 'a-camion', 900),
					pulse(hierExtends.start(1) + 500, 'vehiculo'),
				],
			},
		},
		{
			id: 'hier-inherit',
			chapter: 'extends',
			scene: 'hier',
			title: { es: 'Lo heredado llega solo', en: 'Inherited members arrive on their own' },
			subtitles: hierInherit.list,
			motion: {
				cues: [
					camera(0, ['vehiculo', 'auto'], { dur: 1200, pad: 50 }),
					enter(600, 'fly-marca'),
					enter(800, 'fly-frenar'),
					move(1300, 'fly-marca', 'auto-slot-a', { dur: 1500 }),
					move(1600, 'fly-frenar', 'auto-slot-b', { dur: 1500 }),
					pulse(3300, 'auto'),
					camera(hierInherit.start(1), 'all', { dur: 1200 }),
					enter(hierInherit.start(1) + 700, 'inh-moto'),
					enter(hierInherit.start(1) + 900, 'inh-camion'),
					enter(hierInherit.start(1) + 1500, 'own-auto'),
					enter(hierInherit.start(1) + 1700, 'own-moto'),
					enter(hierInherit.start(1) + 1900, 'own-camion'),
				],
			},
		},
		{
			id: 'hier-override',
			chapter: 'extends',
			scene: 'hier',
			title: { es: 'Redefinir con @Override', en: 'Redefining with @Override' },
			subtitles: hierOverride.list,
			motion: {
				cues: [
					enter(hierOverride.start(1) - 200, 'ovr-auto'),
					pulse(hierOverride.start(1) + 600, 'ovr-auto'),
					enter(hierOverride.start(1) + 500, 'ovr-moto'),
					pulse(hierOverride.start(1) + 1100, 'ovr-moto'),
					enter(hierOverride.start(1) + 1000, 'ovr-camion'),
					pulse(hierOverride.start(1) + 1600, 'ovr-camion'),
					pulse(hierOverride.start(2) + 300, 'vehiculo'),
				],
			},
		},
		{
			id: 'hier-isa',
			chapter: 'extends',
			scene: 'hier',
			title: { es: 'La prueba del "es un"', en: 'The "is-a" test' },
			subtitles: hierIsA.list,
			motion: {
				cues: [
					exit(0, 'decl'),
					enter(hierIsA.start(1), 'isa-yes'),
					pulse(hierIsA.start(1) + 600, 'auto'),
					enter(hierIsA.start(2), 'isa-no'),
					pulse(hierIsA.start(2) + 600, 'isa-no'),
				],
			},
		},
		{
			id: 'hier-single',
			chapter: 'extends',
			scene: 'hier',
			title: { es: 'Herencia simple', en: 'Single inheritance' },
			subtitles: hierSingle.list,
			motion: {
				cues: [
					exit(0, 'isa-yes'),
					exit(0, 'isa-no'),
					enter(500, 'ghost'),
					draw(1400, 'a-ghost', 900),
					enter(2500, 'x-mark'),
					pulse(3100, 'x-mark'),
					enter(hierSingle.start(1) + 400, 'iface-lbl'),
					pulse(hierSingle.start(1) + 1200, 'iface-lbl'),
				],
			},
		},

		// ─── 2. super and the constructor chain ─────────────────────────────
		{
			id: 'chain-new',
			chapter: 'ctor',
			scene: 'chain',
			title: { es: 'new Auto(...) corre una cadena', en: 'new Car(...) runs a chain' },
			subtitles: chainNew.list,
			motion: {
				cues: [
					type(0, 'decl', 1600),
					enter(900, 'c-auto'),
					enter(1300, 'c-vehiculo'),
					enter(1700, 'c-object'),
					enter(2600, 'tok'),
					pulse(chainNew.start(1) + 500, 'c-object'),
					pulse(chainNew.start(1) + 1500, 'c-auto'),
				],
			},
		},
		{
			id: 'chain-up',
			chapter: 'ctor',
			scene: 'chain',
			title: { es: 'Primero suben las llamadas', en: 'The calls go up first' },
			subtitles: chainUp.list,
			motion: {
				cues: [
					draw(200, 'up1', 900),
					move(300, 'tok', 'c-vehiculo', { dx: -380, dur: 1300 }),
					enter(1000, 'lbl-up1'),
					pulse(1700, 'c-vehiculo'),
					draw(2000, 'up2', 900),
					move(2100, 'tok', 'c-object', { dx: -380, dur: 1300 }),
					enter(2800, 'lbl-up2'),
					pulse(3500, 'c-object'),
				],
			},
		},
		{
			id: 'chain-down',
			chapter: 'ctor',
			scene: 'chain',
			title: { es: 'Después se ejecutan hacia abajo', en: 'Then the bodies run downwards' },
			subtitles: chainDown.list,
			motion: {
				cues: [
					enter(300, 'run1'),
					pulse(500, 'c-object'),
					draw(1100, 'dn1', 900),
					move(1200, 'tok', 'c-vehiculo', { dx: -380, dur: 1300 }),
					enter(2500, 'run2'),
					pulse(2700, 'c-vehiculo'),
					draw(3200, 'dn2', 900),
					move(3300, 'tok', 'c-auto', { dx: -380, dur: 1300 }),
					enter(4600, 'run3'),
					pulse(4800, 'c-auto'),
					enter(chainDown.start(1) + 600, 'ready'),
				],
			},
		},
		{
			id: 'chain-rules',
			chapter: 'ctor',
			scene: 'ctor-rules',
			show: ['r1', 'r2', 'r3'],
			focus: ['r1', 'r2', 'r3'],
			title: { es: 'Tres reglas sin excepción', en: 'Three rules, no exceptions' },
			subtitles: [
				say('Tres reglas, sin excepción: `super(...)` tiene que ser la primera sentencia.', 'Three rules, no exceptions: `super(...)` must be the first statement.'),
				say('Si falta, Java inserta `super()`; y si el padre no lo tiene, no compila.', 'If it is missing, Java inserts `super()`; and if the parent has none, it will not compile.'),
			],
		},
		{
			id: 'chain-error',
			chapter: 'ctor',
			scene: 'ctor-rules',
			show: ['r1', 'r2', 'r3', 'r-err'],
			focus: ['r-err'],
			code: noDefaultConstructor,
			shell: shell(
				cmd('javac Auto.java'),
				err('Auto.java:8: error: constructor Vehiculo in class Vehiculo cannot be applied to given types;'),
				err('    public Auto() {'),
				err('                  ^'),
				err('  required: String'),
				err('  found:    no arguments'),
			),
			title: { es: 'El error más frecuente', en: 'The most common error' },
			subtitles: [
				say('El error más frecuente: el padre solo tiene un constructor con argumentos.', 'The most common error: the parent only has a constructor with arguments.'),
				say('El compilador reclama por un constructor que nunca escribiste.', 'The compiler complains about a constructor you never wrote.'),
				say('Se arregla llamando a `super(marca)` en la primera línea.', 'Fix it by calling `super(brand)` on the first line.'),
			],
		},
		{
			id: 'chain-super',
			chapter: 'ctor',
			scene: 'ctor-rules',
			show: '*',
			focus: ['super-m'],
			code: superMethod,
			shell: shell(cmd('java Main'), out('El vehículo arranca.'), out('...y activa el arranque sin llave.')),
			title: { es: 'super.método()', en: 'super.method()' },
			subtitles: [
				say('`super` también llama a la versión del padre de un método sobrescrito.', '`super` also calls the parent’s version of an overridden method.'),
				say('Así extendés el comportamiento en lugar de reemplazarlo.', 'That way you extend the behavior instead of replacing it.'),
			],
		},

		// ─── 3. Overriding ──────────────────────────────────────────────────
		{
			id: 'ovr-annotation',
			chapter: 'override',
			scene: 'override10',
			show: ['ann-what', 'ann-miss'],
			focus: ['ann-what', 'ann-miss'],
			code: overrideTypo,
			shell: shell(
				cmd('javac Auto.java'),
				err('Auto.java:3: error: method does not override or implement a method from a supertype'),
				err('    @Override'),
				err('    ^'),
			),
			title: { es: '@Override y el bug silencioso', en: '@Override and the silent bug' },
			subtitles: [
				say('Sobrescribir es redefinir un método heredado con la misma firma.', 'Overriding is redefining an inherited method with the same signature.'),
				say('`@Override` no cambia la ejecución: le pide al compilador que lo verifique.', '`@Override` changes nothing at runtime: it asks the compiler to verify it.'),
				say('Sin la anotación, un parámetro de más crea un método nuevo y el bug es silencioso.', 'Without it, an extra parameter creates a new method and the bug is silent.'),
			],
		},
		{
			id: 'ovr-contract',
			chapter: 'override',
			scene: 'override10',
			show: '*',
			focus: ['t1', 't2', 't3', 't4', 't5'],
			title: { es: 'Lo que la subclase puede cambiar', en: 'What the subclass may change' },
			subtitles: [
				say('Nombre y parámetros deben ser idénticos; el retorno puede ser un subtipo.', 'Name and parameters must be identical; the return may be a subtype.'),
				say('La visibilidad solo puede abrirse, nunca cerrarse: es la promesa del padre.', 'Visibility may only widen, never narrow: it is the parent’s promise.'),
				say('Las excepciones checked no se ensanchan; `private`, `static` y `final` no se sobrescriben.', 'Checked exceptions never widen; `private`, `static` and `final` cannot be overridden.'),
			],
		},

		// ─── 4. Overloading vs. overriding (motion) ─────────────────────────
		{
			id: 'ovl-overload',
			chapter: 'overload',
			scene: 'ovl',
			title: { es: 'Sobrecarga: la decide el compilador', en: 'Overloading: the compiler decides' },
			subtitles: ovlOverload.list,
			motion: {
				cues: [
					enter(0, 't-left'),
					enter(400, 'b1'),
					enter(600, 'b2'),
					enter(800, 'b3'),
					enter(ovlOverload.start(1) + 100, 'call-a'),
					move(ovlOverload.start(1) + 900, 'call-a', 'anc-b2', { dur: 1300 }),
					pulse(ovlOverload.start(1) + 2300, 'b2'),
					enter(ovlOverload.start(1) + 2400, 'call-b'),
					move(ovlOverload.start(1) + 3200, 'call-b', 'anc-b3', { dur: 1300 }),
					pulse(ovlOverload.start(1) + 4600, 'b3'),
					enter(ovlOverload.start(2) + 200, 'stamp-c'),
					pulse(ovlOverload.start(2) + 900, 'stamp-c'),
				],
			},
		},
		{
			id: 'ovl-override',
			chapter: 'overload',
			scene: 'ovl',
			title: { es: 'Sobrescritura: la decide la JVM', en: 'Overriding: the JVM decides' },
			subtitles: ovlOverride.list,
			motion: {
				cues: [
					enter(0, 't-right'),
					enter(400, 'vh'),
					enter(700, 'au'),
					enter(1000, 'obj'),
					enter(ovlOverride.start(1) + 100, 'call-v'),
					draw(ovlOverride.start(1) + 900, 'ar-call', 900),
					pulse(ovlOverride.start(1) + 1800, 'obj'),
					draw(ovlOverride.start(1) + 2000, 'ar-obj', 900),
					pulse(ovlOverride.start(1) + 3000, 'au'),
					enter(ovlOverride.start(2) + 200, 'stamp-j'),
					pulse(ovlOverride.start(2) + 900, 'stamp-j'),
				],
			},
		},
		{
			id: 'ovl-return',
			chapter: 'overload',
			scene: 'ovl',
			title: { es: 'El retorno no cuenta', en: 'The return type does not count' },
			subtitles: ovlReturn.list,
			motion: {
				cues: [
					exit(0, 'call-a'),
					exit(0, 'call-b'),
					exit(0, 'stamp-c'),
					enter(500, 'ret-a'),
					enter(800, 'ret-b'),
					move(ovlReturn.start(1) + 200, 'ret-b', 'ret-a', { dx: 60, dur: 1300 }),
					pulse(ovlReturn.start(1) + 1700, 'ret-a'),
					pulse(ovlReturn.start(1) + 1800, 'ret-b'),
					enter(ovlReturn.start(1) + 1900, 'ret-msg'),
				],
			},
		},

		// ─── 5. Polymorphism and dynamic dispatch (motion) ──────────────────
		{
			id: 'poly-decl',
			chapter: 'poly',
			scene: 'poly',
			title: { es: 'Variable y objeto, dos cosas distintas', en: 'Variable and object, two different things' },
			subtitles: polyDecl.list,
			motion: {
				cues: [
					type(0, 'decl', 1700),
					enter(900, 'stack'),
					enter(1200, 'heap'),
					enter(1600, 'v'),
					enter(2300, 'obj-vh'),
					enter(2700, 'obj-auto'),
					enter(3100, 'lbl-obj'),
					draw(polyDecl.start(1) + 300, 'a-ref', 900),
					pulse(polyDecl.start(1) + 1300, 'v'),
					pulse(polyDecl.start(1) + 1800, 'obj-auto'),
				],
			},
		},
		{
			id: 'poly-types',
			chapter: 'poly',
			scene: 'poly',
			title: { es: 'El tipo de la variable y el del objeto', en: 'The variable’s type and the object’s type' },
			subtitles: polyTypes.list,
			motion: {
				cues: [
					enter(300, 'ty-var'),
					pulse(900, 'v'),
					enter(polyTypes.start(1) + 100, 'ty-obj'),
					pulse(polyTypes.start(1) + 800, 'obj-auto'),
					pulse(polyTypes.start(1) + 1100, 'obj-vh'),
					pulse(polyTypes.start(2) + 300, 'ty-var'),
					pulse(polyTypes.start(2) + 600, 'ty-obj'),
				],
			},
		},
		{
			id: 'poly-dispatch',
			chapter: 'poly',
			scene: 'poly',
			title: { es: 'Despacho dinámico', en: 'Dynamic dispatch' },
			subtitles: polyDispatch.list,
			motion: {
				cues: [
					exit(0, 'ty-var'),
					exit(0, 'ty-obj'),
					enter(300, 'call'),
					enter(800, 'tk'),
					move(1300, 'tk', 'v', { dx: 150, dur: 1400 }),
					enter(2800, 'chk'),
					pulse(3200, 'chk'),
					move(polyDispatch.start(1) + 300, 'tk', 'obj-auto', { dx: 200, dur: 1500 }),
					enter(polyDispatch.start(1) + 600, 'jvm'),
					pulse(polyDispatch.start(2) + 200, 'obj-auto'),
					type(polyDispatch.start(2) + 900, 'out', 1200),
				],
			},
		},
		{
			id: 'poly-inherited',
			chapter: 'poly',
			scene: 'poly',
			title: { es: 'La búsqueda sube por la jerarquía', en: 'The search climbs the hierarchy' },
			subtitles: polyInherited.list,
			motion: {
				cues: [
					exit(0, 'call'),
					exit(0, 'chk'),
					exit(0, 'jvm'),
					exit(0, 'out'),
					enter(300, 'call2'),
					move(500, 'tk', 'call2', { dx: 150, dur: 1000 }),
					move(1700, 'tk', 'v', { dx: 150, dur: 1000 }),
					enter(2300, 'chk2'),
					move(2900, 'tk', 'obj-auto', { dx: 200, dur: 1200 }),
					pulse(4100, 'obj-auto'),
					move(polyInherited.start(1) + 100, 'tk', 'obj-vh', { dx: 200, dur: 1400 }),
					pulse(polyInherited.start(1) + 1500, 'obj-vh'),
					type(polyInherited.start(1) + 1700, 'out2', 1200),
				],
			},
		},
		{
			id: 'poly-cast',
			chapter: 'poly',
			scene: 'poly',
			title: { es: 'Casteo seguro con instanceof', en: 'Safe casting with instanceof' },
			subtitles: polyCast.list,
			motion: {
				cues: [
					exit(0, 'call2'),
					exit(0, 'chk2'),
					exit(0, 'out2'),
					exit(0, 'tk'),
					enter(300, 'call3'),
					enter(900, 'err-chip'),
					pulse(1500, 'err-chip'),
					exit(polyCast.start(1), 'decl'),
					exit(polyCast.start(1), 'call3'),
					exit(polyCast.start(1), 'err-chip'),
					type(polyCast.start(1) + 400, 'inst', 1500),
					enter(polyCast.start(1) + 2000, 'v-auto'),
					draw(polyCast.start(1) + 2600, 'a-auto', 900),
					enter(polyCast.start(1) + 3600, 'ok-chip'),
					enter(polyCast.start(2) + 300, 'cce'),
					pulse(polyCast.start(2) + 1000, 'cce'),
				],
			},
		},

		// ─── 5b. What it is for (motion + slide) ────────────────────────────
		{
			id: 'fleet-array',
			chapter: 'usage',
			scene: 'fleet',
			title: { es: 'Una flota con tres clases', en: 'A fleet of three classes' },
			subtitles: fleetArray.list,
			motion: {
				cues: [
					type(0, 'decl', 2000),
					enter(1500, 'cell-0'),
					enter(1700, 'cell-1'),
					enter(1900, 'cell-2'),
					enter(2400, 'obj-0'),
					enter(2600, 'obj-1'),
					enter(2800, 'obj-2'),
					draw(3200, 'arr-0', 800),
					draw(3400, 'arr-1', 800),
					draw(3600, 'arr-2', 800),
					enter(fleetArray.start(1) + 300, 'garage'),
				],
			},
		},
		{
			id: 'fleet-loop',
			chapter: 'usage',
			scene: 'fleet',
			title: { es: 'Un bucle, tres comportamientos', en: 'One loop, three behaviors' },
			subtitles: fleetLoop.list,
			motion: {
				cues: [
					enter(0, 'vp'),
					move(500, 'vp', 'cell-0', { dy: -70, dur: 1000 }),
					pulse(1700, 'obj-0'),
					enter(1800, 'out-0'),
					move(3000, 'vp', 'cell-1', { dy: -70, dur: 1000 }),
					pulse(4200, 'obj-1'),
					enter(4300, 'out-1'),
					move(fleetLoop.start(1) + 1200, 'vp', 'cell-2', { dy: -70, dur: 1000 }),
					pulse(fleetLoop.start(1) + 2400, 'obj-2'),
					enter(fleetLoop.start(1) + 2500, 'out-2'),
				],
			},
		},
		{
			id: 'fleet-new',
			chapter: 'usage',
			scene: 'fleet',
			title: { es: 'Una clase nueva sin tocar el Taller', en: 'A new class without touching the Garage' },
			subtitles: fleetNew.list,
			motion: {
				cues: [
					enter(300, 'cell-3'),
					enter(600, 'obj-3'),
					draw(900, 'arr-3', 800),
					move(1800, 'vp', 'cell-3', { dy: -70, dur: 1200 }),
					pulse(3100, 'obj-3'),
					enter(3200, 'out-3'),
					pulse(fleetNew.start(1) + 300, 'garage'),
					enter(fleetNew.start(1) + 900, 'keep'),
					pulse(fleetNew.start(1) + 1700, 'keep'),
				],
			},
		},
		{
			id: 'fleet-ladder',
			chapter: 'usage',
			scene: 'ladder10',
			show: '*',
			focus: ['good'],
			code: polymorphicLoop,
			title: { es: 'La cadena de instanceof que te ahorrás', en: 'The instanceof chain you save yourself' },
			subtitles: [
				say('Sin polimorfismo necesitás una cadena de `instanceof` que crece para siempre.', 'Without polymorphism you need an `instanceof` chain that grows forever.'),
				say('Y hay que editarla cada vez que aparece una clase nueva.', 'And you must edit it every time a new class appears.'),
				say('Con polimorfismo, cada clase sabe qué hacer y el bucle no cambia.', 'With polymorphism each class knows what to do and the loop never changes.'),
			],
		},

		// ─── 6. When NOT to inherit (motion + slide) ────────────────────────
		{
			id: 'compose-bad',
			chapter: 'avoid',
			scene: 'compose',
			title: { es: 'Herencia mal puesta', en: 'Misplaced inheritance' },
			subtitles: composeBad.list,
			motion: {
				cues: [
					type(0, 'decl', 1500),
					enter(800, 'motor'),
					enter(1200, 'auto-card'),
					draw(1900, 'a-ext', 900),
					enter(composeBad.start(1) + 300, 'no-chip'),
					pulse(composeBad.start(1) + 1000, 'no-chip'),
				],
			},
		},
		{
			id: 'compose-has',
			chapter: 'avoid',
			scene: 'compose',
			title: { es: 'Composición: tiene un', en: 'Composition: has a' },
			subtitles: composeHas.list,
			motion: {
				cues: [
					exit(0, 'a-ext'),
					exit(0, 'no-chip'),
					exit(0, 'decl'),
					enter(400, 'field'),
					move(900, 'motor', 'slot', { dur: 1500 }),
					enter(2500, 'has-lbl'),
					enter(composeHas.start(1) + 200, 'tk'),
					move(composeHas.start(1) + 800, 'tk', 'auto-card', { dx: -200, dur: 1000 }),
					move(composeHas.start(1) + 2000, 'tk', 'slot', { dx: 230, dur: 1000 }),
					pulse(composeHas.start(1) + 3100, 'motor'),
				],
			},
		},
		{
			id: 'compose-swap',
			chapter: 'avoid',
			scene: 'compose',
			title: { es: 'Cambiar el motor sin tocar el Auto', en: 'Swap the engine without touching the Car' },
			subtitles: composeSwap.list,
			motion: {
				cues: [
					exit(0, 'tk'),
					exit(300, 'motor'),
					enter(700, 'motor-e'),
					pulse(1500, 'motor-e'),
					pulse(1700, 'auto-card'),
					exit(composeSwap.start(1), 'motor-e'),
					enter(composeSwap.start(1) + 500, 'motor-f'),
					pulse(composeSwap.start(1) + 1300, 'motor-f'),
					enter(composeSwap.start(1) + 1800, 'test-chip'),
				],
			},
		},
		{
			id: 'final-keyword',
			chapter: 'avoid',
			scene: 'final10',
			show: '*',
			focus: ['fin-class', 'fin-method'],
			code: finalKeyword,
			title: { es: 'final: lo que no se extiende', en: 'final: what must not be extended' },
			subtitles: [
				say('Si una clase no debe extenderse, marcala con `final` y el compilador lo hace cumplir.', 'If a class must not be extended, mark it `final` and the compiler enforces it.'),
				say('Lo mismo vale para un método: un `final` no se sobrescribe.', 'The same goes for a method: a `final` one cannot be overridden.'),
			],
		},

		// ─── 7. Everything inherits from Object (motion) ────────────────────
		{
			id: 'obj-root',
			chapter: 'object',
			scene: 'obj',
			title: { es: 'La raíz de toda clase', en: 'The root of every class' },
			subtitles: objRoot.list,
			motion: {
				cues: [
					enter(0, 'o-auto'),
					enter(300, 'o-veh'),
					enter(600, 'o-object'),
					draw(1200, 'u1', 900),
					draw(1700, 'u2', 900),
					enter(2600, 'root-lbl'),
					pulse(3300, 'o-object'),
					enter(objRoot.start(1) + 400, 'more'),
					pulse(objRoot.start(1) + 1300, 'more'),
				],
			},
		},
		{
			id: 'obj-default',
			chapter: 'object',
			scene: 'obj',
			title: { es: 'toString() sin sobrescribir', en: 'toString() not overridden' },
			subtitles: objDefault.list,
			motion: {
				cues: [
					exit(0, 'more'),
					enter(300, 'call-p'),
					enter(900, 'tk'),
					move(1400, 'tk', 'o-auto', { dx: 300, dur: 1100 }),
					move(objDefault.start(1) + 100, 'tk', 'o-veh', { dx: 300, dur: 1100 }),
					move(objDefault.start(1) + 1500, 'tk', 'o-object', { dx: 300, dur: 1100 }),
					pulse(objDefault.start(1) + 2700, 'o-object'),
					type(objDefault.start(1) + 2800, 'res-def', 1200),
				],
			},
		},
		{
			id: 'obj-override',
			chapter: 'object',
			scene: 'obj',
			title: { es: 'toString() sobrescrito', en: 'toString() overridden' },
			subtitles: objOverride.list,
			motion: {
				cues: [
					exit(0, 'res-def'),
					enter(400, 'o-auto-ts'),
					pulse(900, 'o-auto-ts'),
					move(1300, 'tk', 'call-p', { dx: -250, dur: 1100 }),
					move(objOverride.start(1) + 100, 'tk', 'o-auto', { dx: 300, dur: 1300 }),
					pulse(objOverride.start(1) + 1500, 'o-auto'),
					type(objOverride.start(1) + 1600, 'res-ovr', 1200),
					pulse(objOverride.start(2) + 400, 'o-object'),
				],
			},
		},

		// ─── 8. Common mistakes ─────────────────────────────────────────────
		{
			id: 'errors-first',
			chapter: 'errors',
			scene: 'errors10',
			show: ['e1', 'e2', 'e3'],
			focus: ['e1', 'e2', 'e3'],
			title: { es: 'Errores frecuentes (1 de 2)', en: 'Common mistakes (1 of 2)' },
			subtitles: [
				say('Sobrescribir cambiando los parámetros crea un método nuevo: poné siempre `@Override`.', 'Overriding while changing the parameters creates a new method: always write `@Override`.'),
				say('Un constructor hijo sin `super(...)` falla si el padre no tiene constructor vacío.', 'A child constructor without `super(...)` fails if the parent has no empty constructor.'),
				say('Llamar a un método sobrescribible desde el constructor del padre deja campos sin inicializar.', 'Calling an overridable method from the parent’s constructor leaves fields uninitialized.'),
			],
		},
		{
			id: 'errors-second',
			chapter: 'errors',
			scene: 'errors10',
			show: '*',
			focus: ['e4', 'e5', 'e6'],
			title: { es: 'Errores frecuentes (2 de 2)', en: 'Common mistakes (2 of 2)' },
			subtitles: [
				say('Castear sin `instanceof` termina en `ClassCastException` en ejecución.', 'Casting without `instanceof` ends in `ClassCastException` at runtime.'),
				say('Heredar solo para reutilizar código, sin un "es un", arma jerarquías rígidas: componé.', 'Inheriting just to reuse code, with no "is-a", builds rigid hierarchies: compose instead.'),
				say('Y no confundas sobrecarga con sobrescritura: una es del compilador, la otra de la JVM.', 'And do not mix up overloading and overriding: one is the compiler’s, the other the JVM’s.'),
			],
		},

		// ─── 9. Guided exercise and closing ─────────────────────────────────
		{
			id: 'ex-brief',
			chapter: 'exercise',
			scene: 'ex10',
			show: ['ex1', 'ex2', 'ex3', 'ex4', 'ex5'],
			focus: [],
			title: { es: 'Desafío: jerarquía de empleados', en: 'Challenge: employee hierarchy' },
			subtitles: [
				say('El desafío: una jerarquía de empleados con Empleado, Gerente y Vendedor.', 'The challenge: an employee hierarchy with Employee, Manager and SalesRep.'),
				say('Cada subclase sobrescribe `calcularSalario()` y las tres sobrescriben `toString()`.', 'Each subclass overrides `computeSalary()` and all three override `toString()`.'),
			],
		},
		{
			id: 'ex-hierarchy',
			chapter: 'exercise',
			scene: 'ex10',
			show: '*',
			focus: ['ex1', 'ex2', 'ex3', 'ex4'],
			code: payrollHierarchy,
			title: { es: 'Solución: las tres clases', en: 'Solution: the three classes' },
			subtitles: [
				say('Gerente suma un bono y Vendedor una comisión del 8 %, los dos con `super.calcularSalario()`.', 'Manager adds a bonus and SalesRep an 8% commission, both through `super.computeSalary()`.'),
				say('No repiten la lógica del sueldo base: la reutilizan y le suman lo suyo.', 'They do not repeat the base salary logic: they reuse it and add their own.'),
			],
		},
		{
			id: 'ex-loop',
			chapter: 'exercise',
			scene: 'ex10',
			show: '*',
			focus: ['ex5'],
			code: payrollLoop,
			shell: shell(
				cmd('java MainNomina'),
				out('Empleado Ana Torres    $ 800,000.00'),
				out('Gerente Luis Paz       $ 1,900,000.00'),
				out('Vendedor Sofia Rios    $ 900,000.00'),
				out('TOTAL                  $ 3,600,000.00'),
			),
			title: { es: 'Solución: un solo bucle', en: 'Solution: a single loop' },
			subtitles: [
				say('Lo que hay que mirar es el bucle: no pregunta de qué tipo es cada empleado.', 'What matters is the loop: it never asks which type each employee is.'),
				say('Si mañana agregás un Pasante, ese bucle sigue funcionando sin una sola modificación.', 'If you add an Intern tomorrow, that loop keeps working without a single change.'),
			],
		},
		{
			id: 'closing-takeaways',
			chapter: 'exercise',
			scene: 'closing10',
			show: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8'],
			focus: [],
			title: { es: 'Para llevarte', en: 'Takeaways' },
			subtitles: [
				say('`extends` solo si un X es un Y; la cadena de constructores sube con `super` y se ejecuta bajando.', '`extends` only if an X is a Y; the constructor chain goes up with `super` and runs downwards.'),
				say('Sobrecarga la decide el compilador, sobrescritura la JVM: la variable define qué podés llamar.', 'Overloading is the compiler’s call, overriding the JVM’s: the variable defines what you may call.'),
				say('Preferí composición antes que herencia, y marcá con `final` lo que no debe extenderse.', 'Prefer composition over inheritance, and mark with `final` whatever must not be extended.'),
			],
		},
		{
			id: 'closing-repo',
			chapter: 'exercise',
			scene: 'closing10',
			show: '*',
			focus: ['repo'],
			title: { es: 'Código real para profundizar', en: 'Real code to go deeper' },
			subtitles: [
				say('Reforzá todo con programas completos en el repositorio del curso.', 'Reinforce everything with complete programs in the course repository.'),
				say('Clonalo, abrí `l10_herencia_polimorfismo_y_sobrecarga` y ejecutá cada uno mientras releés la lección.', 'Clone it, open `l10_herencia_polimorfismo_y_sobrecarga` and run each one while you reread the lesson.'),
			],
		},
	],
};
