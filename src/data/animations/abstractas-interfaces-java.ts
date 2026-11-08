import type { AnimationScript, CodePanel, MotionCue, ShellLine, ShellPanel, Subtitle } from './types';

// Step-by-step animation for the Java lesson 11 "Clases abstractas, interfaces y modelado".
// Every step names the scene it shows (`data-scene` in
// `src/components/animaciones/abstractas-interfaces-java.astro`), the elements it reveals
// and emphasizes, plus its captions and any terminal panel. Six chapters play as motion
// steps on persistent SVG canvases (the abstract mold, the signed contract, one class with
// many contracts, interface + abstract base, namespaces and relationships); the rest are
// slide steps.

const same = (text: string) => ({ es: text, en: text });
const say = (es: string, en: string): Subtitle => ({ text: { es, en } });

const code = (title: string, es: string, en: string = es, focusLines?: number[]): CodePanel => ({
	title,
	language: 'java',
	source: { es, en },
	focusLines,
});

const shell = (...lines: ShellLine[]): ShellPanel => ({ lines });
const cmd = (text: string): ShellLine => ({ kind: 'cmd', text: same(text) });
const out = (es: string, en: string = es): ShellLine => ({ kind: 'out', text: { es, en } });
const err = (text: string): ShellLine => ({ kind: 'err', text: same(text) });
const cmt = (es: string, en: string): ShellLine => ({ kind: 'cmt', text: { es, en } });

/** Same reading-time formula as the validator, for the slower locale, plus a pause. */
const readingMs = (sub: Subtitle) => 1200 + Math.max(sub.text.es.length, sub.text.en.length) * 55;

/**
 * Pins captions on the step timeline so motion cues can sync with what is being
 * said: `start(i)` is the moment caption `i` appears.
 */
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

/** Fades several elements out, a hair apart so they do not vanish as one block. */
const exits = (time: number, ...els: string[]): MotionCue[] => els.map((el, i): MotionCue => ({ at: time + i * 50, do: 'exit', el }));
const enters = (time: number, gap: number, ...els: string[]): MotionCue[] =>
	els.map((el, i): MotionCue => ({ at: time + i * gap, do: 'enter', el }));

// ─── Motion captions ────────────────────────────────────────────────────────
const absMold = timed(
	say('Una clase abstracta es un molde incompleto: trae estado y deja huecos.', 'An abstract class is an incomplete mold: it brings state and leaves gaps.'),
	say('Los métodos abstractos no tienen cuerpo: obligan a cada subclase a escribirlos.', 'Abstract methods have no body: they force each subclass to write them.'),
	say('Los concretos, como `describe()`, ya están resueltos y se heredan tal cual.', 'Concrete ones, like `describe()`, are already solved and inherited as is.'),
);
const absTemplate = timed(
	say('`describe()` llama a dos métodos que todavía no existen.', '`describe()` calls two methods that do not exist yet.'),
	say('La clase abstracta escribe el algoritmo una vez y delega los pasos concretos.', 'The abstract class writes the algorithm once and delegates the concrete steps.'),
);
const absNew = timed(
	say('Y `new Shape(...)` ni compila: el compilador frena al objeto que no tenía sentido.', 'And `new Shape(...)` does not even compile: the compiler stops the object that made no sense.'),
	say('Una clase abstracta existe solo para ser extendida.', 'An abstract class exists only to be extended.'),
);
const absFill = timed(
	say('Circle y Rectangle extienden Shape y completan cada hueco con su propia fórmula.', 'Circle and Rectangle extend Shape and fill every gap with their own formula.'),
	say('Si una subclase deja un hueco sin llenar, también tiene que declararse abstract.', 'If a subclass leaves a gap unfilled, it must be declared abstract too.'),
);
const contractClauses = timed(
	say('Una interfaz es un contrato puro: dice qué se puede hacer, nunca cómo.', 'An interface is a pure contract: it says what can be done, never how.'),
	say('Cada método es `public abstract` por defecto: no hace falta escribirlo.', 'Every method is `public abstract` by default: there is no need to write it.'),
	say('Y con `default` el contrato puede traer una implementación que las clases heredan.', 'And with `default` the contract can carry an implementation classes inherit.'),
);
const contractSign = timed(
	say('Cualquier clase firma el contrato con `implements`, y el compilador la obliga a cumplirlo entero.', 'Any class signs the contract with `implements`, and the compiler forces it to honor all of it.'),
	say('`CreditCard` no hereda de nadie: la interfaz no gasta tu único `extends`.', '`CreditCard` inherits from nobody: the interface does not use up your only `extends`.'),
	say('`DigitalWallet` ya extiende una clase abstracta y aun así firma el mismo contrato.', '`DigitalWallet` already extends an abstract class and still signs the same contract.'),
);
const contractLoop = timed(
	say('Un `Payable[]` guarda a los tres, sin `instanceof` ni casting.', 'A `Payable[]` holds all three, with no `instanceof` and no casting.'),
	say('Al llamar `payIfPossible(12500)`, cada uno responde a su manera.', 'When `payIfPossible(12500)` is called, each one answers in its own way.'),
	say('El tercer medio no tiene saldo: el contrato lo salta.', 'The third method has no balance: the contract skips it.'),
);
const multiTypes = timed(
	say('Una clase extiende una sola clase, pero implementa todas las interfaces que necesite.', 'A class extends a single class, but implements every interface it needs.'),
	say('Java no tiene herencia múltiple de clases: la respuesta son los contratos.', 'Java has no multiple class inheritance: the answer is contracts.'),
);
const multiDuck = timed(
	say('`Duck` extiende `Bird`, su única línea de herencia, e implementa `Swimmer` y `Flyer`.', '`Duck` extends `Bird`, its single line of inheritance, and implements `Swimmer` and `Flyer`.'),
	say('Hereda `eat()` y escribe `swim()` y `fly()`.', 'It inherits `eat()` and writes `swim()` and `fly()`.'),
);
const multiViews = timed(
	say('El mismo objeto se puede ver desde distintos ángulos.', 'The same object can be seen from different angles.'),
	say('Como `Bird`, como `Swimmer` o como `Flyer`, según lo que cada método necesite.', 'As a `Bird`, a `Swimmer` or a `Flyer`, depending on what each method needs.'),
);
const multiContest = timed(
	say('Un `Swimmer[]` puede guardar un `Duck`, un `Fish` y un `Submarine`.', 'A `Swimmer[]` can hold a `Duck`, a `Fish` and a `Submarine`.'),
	say('Tres clases sin ningún ancestro en común: la interfaz es lo único que comparten, y alcanza.', 'Three classes with no common ancestor: the interface is all they share, and it is enough.'),
);
const comboLayers = timed(
	say('Los dos se combinan: la interfaz fija el contrato y la clase abstracta resuelve lo repetitivo.', 'The two combine: the interface sets the contract and the abstract class solves the repetitive part.'),
	say('`findById()` ya está resuelto; `save()` queda abstracto.', '`findById()` is already solved; `save()` stays abstract.'),
	say('Cada subclase concreta decide qué validar antes de guardar.', 'Each concrete subclass decides what to validate before saving.'),
);
const comboRule = timed(
	say('Interfaz por defecto. Clase abstracta solo cuando hay estado o código compartido.', 'Interface by default. Abstract class only when there is shared state or code.'),
);
const fqcnTwo = timed(
	say('Para la JVM, la identidad de una clase es su nombre completo, el FQCN.', 'To the JVM, a class’s identity is its fully qualified name, the FQCN.'),
	say('Por eso dos `Product` conviven sin ambigüedad en la misma aplicación.', 'That is why two `Product` classes coexist without ambiguity in the same application.'),
);
const fqcnClash = timed(
	say('`import` no carga nada: solo registra un alias para escribir menos.', '`import` loads nothing: it only registers an alias so you type less.'),
	say('Dos clases con el mismo nombre corto no pueden importarse juntas.', 'Two classes with the same short name cannot be imported together.'),
);
const fqcnFix = timed(
	say('La solución: importás la que más usás y escribís el FQCN de la otra.', 'The fix: import the one you use most and write the FQCN of the other.'),
	say('Cada nombre queda sin ambigüedad y el compilador sabe a cuál te referís.', 'Every name is unambiguous and the compiler knows which one you mean.'),
);
const relAssoc = timed(
	say('Asociación: los objetos se conocen y colaboran, pero cada uno vive por su cuenta.', 'Association: objects know each other and collaborate, but each lives on its own.'),
	say('Un `Teacher` guarda sus `Course`, y ninguno es dueño del otro.', 'A `Teacher` keeps its `Course` objects, and neither owns the other.'),
);
const relAggr = timed(
	say('Agregación: el todo reúne partes que ya existían y las recibe desde afuera.', 'Aggregation: the whole gathers parts that already existed and receives them from outside.'),
	say('Un `Team` recibe sus `Player` en el constructor, con copia defensiva.', 'A `Team` receives its `Player` objects in the constructor, with a defensive copy.'),
);
const relComp = timed(
	say('Composición: la parte no existe sin el todo, y el todo la crea en su constructor.', 'Composition: the part cannot exist without the whole, which creates it in its constructor.'),
	say('`House` crea sus `Room` y no tiene `getRooms()`: nadie de afuera las toca.', '`House` creates its `Room` objects and has no `getRooms()`: nobody outside touches them.'),
);
const relDemolish = timed(
	say('La pregunta que lo decide: si destruyo el contenedor, ¿la parte sigue teniendo sentido?', 'The question that decides it: if I destroy the container, does the part still make sense?'),
	say('Asociación y agregación: la parte sobrevive. Composición: se va junto con el todo.', 'Association and aggregation: the part survives. Composition: it goes with the whole.'),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'intro', label: { es: 'Introducción', en: 'Introduction' } },
		{ id: 'abstract', label: { es: '1. Clases abstractas', en: '1. Abstract classes' } },
		{ id: 'interface', label: { es: '2. Interfaces', en: '2. Interfaces' } },
		{ id: 'defaults', label: { es: '3. default, static y adaptadoras', en: '3. default, static and adapters' } },
		{ id: 'multi', label: { es: '4. Varias interfaces', en: '4. Several interfaces' } },
		{ id: 'choose', label: { es: '5. Cuál elegir', en: '5. Which one to pick' } },
		{ id: 'namespace', label: { es: '6. Packages y namespaces', en: '6. Packages and namespaces' } },
		{ id: 'relations', label: { es: '7. Asociación, agregación y composición', en: '7. Association, aggregation and composition' } },
		{ id: 'errors', label: { es: '8. Errores frecuentes', en: '8. Common mistakes' } },
		{ id: 'exercise', label: { es: '9. Ejercicio guiado', en: '9. Guided exercise' } },
		{ id: 'closing', label: { es: 'Cierre', en: 'Wrap-up' } },
	],
	steps: [
		// ─── Intro ──────────────────────────────────────────────────────────
		{
			id: 'intro-problem',
			chapter: 'intro',
			scene: 'intro11',
			show: ['p1', 'p2'],
			title: { es: 'Un vehículo que no existe', en: 'A vehicle that does not exist' },
			subtitles: [
				say('En la lección anterior, `Vehicle` tenía un problema silencioso: nada impide escribir `new Vehicle("Ford")`.', 'In the previous lesson, `Vehicle` had a quiet problem: nothing stops you from writing `new Vehicle("Ford")`.'),
				say('Un vehículo genérico no existe en el mundo real: es un concepto, no una cosa.', 'A generic vehicle does not exist in the real world: it is a concept, not a thing.'),
				say('Y `start()` inventaba un cuerpo que ninguna subclase usa, solo para que compile.', 'And `start()` invented a body no subclass uses, just so it would compile.'),
			],
		},
		{
			id: 'intro-tools',
			chapter: 'intro',
			scene: 'intro11',
			show: '*',
			focus: ['abs', 'iface'],
			title: { es: 'Dos herramientas', en: 'Two tools' },
			subtitles: [
				say('Java tiene dos herramientas para arreglarlo, y elegir mal es una decisión que se paga mucho tiempo.', 'Java has two tools to fix it, and choosing badly is a decision you pay for a long time.'),
				say('La clase abstracta es un molde incompleto; la interfaz, un contrato puro.', 'The abstract class is an incomplete mold; the interface is a pure contract.'),
			],
		},

		// ─── 1. Abstract classes ────────────────────────────────────────────
		{
			id: 'abs-anatomy',
			chapter: 'abstract',
			scene: 'abs-anatomy',
			show: ['an-state', 'an-gap', 'an-body'],
			focus: ['an-gap'],
			title: { es: 'Anatomía de una clase abstracta', en: 'Anatomy of an abstract class' },
			subtitles: [
				say('Una clase `abstract` no se puede instanciar: existe solo para ser extendida.', 'An `abstract` class cannot be instantiated: it exists only to be extended.'),
				say('Puede tener estado y constructor, métodos concretos y métodos abstractos sin cuerpo.', 'It can have state and a constructor, concrete methods and abstract methods with no body.'),
				say('Fijate en `describe()`: llama a dos métodos que todavía no existen.', 'Look at `describe()`: it calls two methods that do not exist yet.'),
			],
			code: code(
				'Shape.java',
				`public abstract class Shape {
    protected final String name;

    protected Shape(String name) {
        this.name = name;
    }

    // Sin cuerpo: cada subclase DEBE escribirlos
    public abstract double area();
    public abstract double perimeter();

    // Con cuerpo: se hereda tal cual
    public void describe() {
        System.out.printf("%s → area %.2f, perimeter %.2f%n",
            name, area(), perimeter());
    }
}`,
				`public abstract class Shape {
    protected final String name;

    protected Shape(String name) {
        this.name = name;
    }

    // No body: every subclass MUST write them
    public abstract double area();
    public abstract double perimeter();

    // Has a body: inherited as is
    public void describe() {
        System.out.printf("%s → area %.2f, perimeter %.2f%n",
            name, area(), perimeter());
    }
}`,
				[9, 10, 13, 14, 15],
			),
		},
		{
			id: 'abs-mold',
			chapter: 'abstract',
			scene: 'abs',
			title: { es: 'Un molde con huecos', en: 'A mold with gaps' },
			subtitles: absMold.list,
			motion: {
				cues: [
					{ at: 0, do: 'type', el: 'a-decl', dur: 1400 },
					{ at: 800, do: 'enter', el: 'a-shape' },
					{ at: 1600, do: 'enter', el: 'r-state' },
					{ at: 2000, do: 'enter', el: 'tag-state' },
					{ at: absMold.start(1), do: 'enter', el: 'r-area' },
					{ at: absMold.start(1) + 350, do: 'enter', el: 'tag-gap1' },
					{ at: absMold.start(1) + 900, do: 'enter', el: 'r-perim' },
					{ at: absMold.start(1) + 1250, do: 'enter', el: 'tag-gap2' },
					{ at: absMold.start(1) + 1900, do: 'pulse', el: 'r-area' },
					{ at: absMold.start(1) + 2300, do: 'pulse', el: 'r-perim' },
					{ at: absMold.start(2), do: 'enter', el: 'r-describe' },
					{ at: absMold.start(2) + 400, do: 'enter', el: 'tag-body' },
					{ at: absMold.start(2) + 1300, do: 'pulse', el: 'r-describe' },
				],
			},
		},
		{
			id: 'abs-template',
			chapter: 'abstract',
			scene: 'abs',
			title: { es: 'Un algoritmo con pasos delegados', en: 'An algorithm with delegated steps' },
			subtitles: absTemplate.list,
			motion: {
				cues: [
					{ at: 0, do: 'camera', to: ['r-area', 'r-perim', 'r-describe'], pad: 90, dur: 1400 },
					{ at: 900, do: 'draw', el: 'call-area', dur: 900 },
					{ at: 1400, do: 'draw', el: 'call-perim', dur: 900 },
					{ at: 2400, do: 'flow', el: 'call-area' },
					{ at: 2400, do: 'flow', el: 'call-perim' },
					{ at: absTemplate.start(1) + 300, do: 'pulse', el: 'r-area' },
					{ at: absTemplate.start(1) + 800, do: 'pulse', el: 'r-perim' },
					{ at: absTemplate.start(1) + 1500, do: 'pulse', el: 'r-describe' },
					{ at: absTemplate.start(1) + 2600, do: 'camera', to: 'all', dur: 1200 },
				],
			},
		},
		{
			id: 'abs-new',
			chapter: 'abstract',
			scene: 'abs',
			title: { es: 'new Shape() no compila', en: 'new Shape() does not compile' },
			subtitles: absNew.list,
			motion: {
				cues: [
					{ at: 0, do: 'enter', el: 'newcard' },
					{ at: 300, do: 'type', el: 'newtext', dur: 1400 },
					{ at: 2200, do: 'enter', el: 'newerr' },
					{ at: 2700, do: 'draw', el: 'ban', dur: 900 },
					{ at: 3700, do: 'pulse', el: 'ban' },
					{ at: absNew.start(1) + 200, do: 'pulse', el: 'a-shape' },
				],
			},
		},
		{
			id: 'abs-fill',
			chapter: 'abstract',
			scene: 'abs',
			title: { es: 'Las subclases llenan los huecos', en: 'Subclasses fill the gaps' },
			subtitles: absFill.list,
			motion: {
				cues: [
					...exits(0, 'newcard', 'newtext', 'newerr', 'ban'),
					{ at: 600, do: 'enter', el: 'circ' },
					{ at: 850, do: 'enter', el: 'rect' },
					{ at: 1500, do: 'draw', el: 'ext-circ', dur: 700 },
					{ at: 1800, do: 'draw', el: 'ext-rect', dur: 700 },
					{ at: 2500, do: 'enter', el: 'impl-area' },
					{ at: 3000, do: 'move', el: 'impl-area', to: 'r-area', dur: 1300 },
					{ at: 3500, do: 'enter', el: 'impl-perim' },
					{ at: 4000, do: 'move', el: 'impl-perim', to: 'r-perim', dur: 1300 },
					{ at: 5400, do: 'enter', el: 'fill-area' },
					{ at: 5500, do: 'exit', el: 'impl-area' },
					{ at: 5800, do: 'enter', el: 'fill-perim' },
					{ at: 5900, do: 'exit', el: 'impl-perim' },
					{ at: absFill.start(1) + 300, do: 'enter', el: 'warn' },
					{ at: absFill.start(1) + 1300, do: 'pulse', el: 'warn' },
				],
			},
		},
		{
			id: 'abs-subclasses',
			chapter: 'abstract',
			scene: 'abs-anatomy',
			show: '*',
			focus: ['an-rule'],
			title: { es: 'Subclases concretas en acción', en: 'Concrete subclasses at work' },
			subtitles: [
				say('Con el molde fijo, cada subclase solo aporta lo suyo.', 'With the mold fixed, each subclass only contributes its own part.'),
				say('Un `Shape[]` con círculos y rectángulos llama a `describe()` sin distinguirlos.', 'A `Shape[]` holding circles and rectangles calls `describe()` without telling them apart.'),
			],
			code: code(
				'Circle.java',
				`public class Circle extends Shape {
    private final double radius;

    public Circle(double radius) {
        super("Circle");
        this.radius = radius;
    }

    @Override
    public double area() { return Math.PI * radius * radius; }

    @Override
    public double perimeter() { return 2 * Math.PI * radius; }
}`,
			),
			shell: shell(
				cmd('javac Main.java'),
				err('error: Shape is abstract; cannot be instantiated'),
				cmt('// quitamos esa línea y volvemos a compilar', '// we remove that line and compile again'),
				cmd('java Main'),
				out('Circle → area 28.27, perimeter 18.85'),
				out('Rectangle → area 20.00, perimeter 18.00'),
			),
		},

		// ─── 2. Interfaces ──────────────────────────────────────────────────
		{
			id: 'iface-intro',
			chapter: 'interface',
			scene: 'iface-anatomy',
			show: ['if-const', 'if-abs', 'if-rule'],
			focus: ['if-abs'],
			title: { es: 'Un contrato puro', en: 'A pure contract' },
			subtitles: [
				say('Una interfaz describe qué se puede hacer, nunca cómo.', 'An interface describes what can be done, never how.'),
				say('Sus métodos son `public abstract` sin escribirlo, y no guarda estado de instancia.', 'Its methods are `public abstract` without writing it, and it holds no instance state.'),
			],
			code: code(
				'Payable.java',
				`public interface Payable {
    // Cada método es public abstract por defecto
    boolean pay(double amount);
    boolean isAvailable();
}`,
				`public interface Payable {
    // Every method is public abstract by default
    boolean pay(double amount);
    boolean isAvailable();
}`,
			),
		},
		{
			id: 'contract-clauses',
			chapter: 'interface',
			scene: 'contract',
			title: { es: 'Las cláusulas del contrato', en: 'The clauses of the contract' },
			subtitles: contractClauses.list,
			motion: {
				cues: [
					{ at: 0, do: 'enter', el: 'payable' },
					{ at: 700, do: 'type', el: 'cl-pay', dur: 1100 },
					{ at: 1400, do: 'type', el: 'cl-avail', dur: 1100 },
					{ at: contractClauses.start(1) + 200, do: 'pulse', el: 'cl-pay' },
					{ at: contractClauses.start(1) + 700, do: 'pulse', el: 'cl-avail' },
					{ at: contractClauses.start(2), do: 'enter', el: 'cl-def' },
					{ at: contractClauses.start(2) + 800, do: 'pulse', el: 'cl-def' },
				],
			},
		},
		{
			id: 'contract-sign',
			chapter: 'interface',
			scene: 'contract',
			title: { es: 'Tres clases firman con implements', en: 'Three classes sign with implements' },
			subtitles: contractSign.list,
			motion: {
				cues: [
					...enters(0, 300, 'cc', 'dw', 'ew'),
					{ at: 1200, do: 'enter', el: 'lab-impl' },
					{ at: 1500, do: 'draw', el: 'arr-1', dur: 700 },
					{ at: 2000, do: 'draw', el: 'arr-2', dur: 700 },
					{ at: 2500, do: 'draw', el: 'arr-3', dur: 700 },
					{ at: 3400, do: 'enter', el: 'sig-1' },
					{ at: 3700, do: 'enter', el: 'sig-2' },
					{ at: 4000, do: 'enter', el: 'sig-3' },
					{ at: contractSign.start(1) + 300, do: 'pulse', el: 'cc' },
					{ at: contractSign.start(2) + 300, do: 'pulse', el: 'dw' },
				],
			},
		},
		{
			id: 'contract-loop',
			chapter: 'interface',
			scene: 'contract',
			title: { es: 'Un solo bucle para todos', en: 'A single loop for all of them' },
			subtitles: contractLoop.list,
			motion: {
				cues: [
					{ at: 0, do: 'enter', el: 'coin' },
					{ at: 500, do: 'move', el: 'coin', to: 'cc', dy: -100, dur: 1200 },
					{ at: 1800, do: 'pulse', el: 'cc' },
					{ at: 2200, do: 'enter', el: 'res-1' },
					{ at: contractLoop.start(1) + 100, do: 'pulse', el: 'cl-def' },
					{ at: contractLoop.start(1) + 300, do: 'move', el: 'coin', to: 'dw', dy: -100, dur: 1200 },
					{ at: contractLoop.start(1) + 1600, do: 'pulse', el: 'dw' },
					{ at: contractLoop.start(1) + 2000, do: 'enter', el: 'res-2' },
					{ at: contractLoop.start(2), do: 'move', el: 'coin', to: 'ew', dy: -100, dur: 1200 },
					{ at: contractLoop.start(2) + 1500, do: 'pulse', el: 'ew' },
					{ at: contractLoop.start(2) + 1900, do: 'enter', el: 'res-3' },
					{ at: contractLoop.start(2) + 3000, do: 'exit', el: 'coin' },
				],
			},
		},
		{
			id: 'iface-credit',
			chapter: 'interface',
			scene: 'iface-anatomy',
			show: ['if-abs', 'if-rule'],
			focus: ['if-rule'],
			title: { es: 'CreditCard cumple el contrato', en: 'CreditCard honors the contract' },
			subtitles: [
				say('`@Override` marca cada método del contrato que `CreditCard` cumple.', '`@Override` marks each contract method that `CreditCard` honors.'),
				say('La clase no hereda de nadie: solo firma `Payable` y escribe lo que promete.', 'The class inherits from nobody: it only signs `Payable` and writes what it promises.'),
			],
			code: code(
				'CreditCard.java',
				`public class CreditCard implements Payable {
    private final String number;
    private double availableCredit;

    @Override
    public boolean pay(double amount) {
        if (amount > availableCredit) {
            System.out.println("Insufficient credit.");
            return false;
        }
        availableCredit -= amount;
        System.out.println("Paid with card " + number);
        return true;
    }

    @Override
    public boolean isAvailable() { return availableCredit > 0; }
}`,
			),
		},

		// ─── 3. default, static and adapters ────────────────────────────────
		{
			id: 'def-default',
			chapter: 'defaults',
			scene: 'evolve',
			show: ['ev-before', 'ev-default', 'ev-warn'],
			focus: ['ev-default'],
			title: { es: 'Métodos default', en: 'Default methods' },
			subtitles: [
				say('Desde Java 8, una interfaz puede traer implementaciones con `default`.', 'Since Java 8, an interface can carry implementations with `default`.'),
				say('Sirven para agregar un método sin romper las mil clases que ya la implementan.', 'They exist to add a method without breaking the thousand classes already implementing it.'),
				say('Usalas con moderación: una interfaz llena de default es una clase abstracta mal disfrazada.', 'Use them sparingly: an interface full of defaults is a badly disguised abstract class.'),
			],
			code: code(
				'Payable.java',
				`public interface Payable {
    boolean pay(double amount);
    boolean isAvailable();

    // default: implementación heredable
    default void payIfPossible(double amount) {
        if (isAvailable()) {
            pay(amount);
        } else {
            System.out.println("Payment method unavailable.");
        }
    }

    // static: utilidad de la interfaz misma
    static boolean isValidAmount(double amount) {
        return amount > 0 && amount < 1_000_000;
    }
}`,
				`public interface Payable {
    boolean pay(double amount);
    boolean isAvailable();

    // default: inheritable implementation
    default void payIfPossible(double amount) {
        if (isAvailable()) {
            pay(amount);
        } else {
            System.out.println("Payment method unavailable.");
        }
    }

    // static: a utility of the interface itself
    static boolean isValidAmount(double amount) {
        return amount > 0 && amount < 1_000_000;
    }
}`,
				[6, 7, 8, 9, 10, 11, 12],
			),
		},
		{
			id: 'def-static',
			chapter: 'defaults',
			scene: 'evolve',
			show: ['ev-before', 'ev-default', 'ev-warn', 'ev-static'],
			focus: ['ev-static'],
			title: { es: 'static no se hereda', en: 'static is not inherited' },
			subtitles: [
				say('Los métodos `static` de una interfaz no se heredan.', 'The `static` methods of an interface are not inherited.'),
				say('Se llaman siempre por el nombre de la interfaz, nunca desde una instancia ni desde la clase.', 'They are always called through the interface name, never from an instance or from the class.'),
			],
			code: code(
				'UsoStatic.java',
				`Payable.isValidAmount(500);        // ✓ por la interfaz
card.isValidAmount(500);           // ✗ no compila
CreditCard.isValidAmount(500);     // ✗ tampoco`,
				`Payable.isValidAmount(500);        // ✓ through the interface
card.isValidAmount(500);           // ✗ does not compile
CreditCard.isValidAmount(500);     // ✗ neither does this`,
			),
		},
		{
			id: 'def-adapter',
			chapter: 'defaults',
			scene: 'evolve',
			show: '*',
			focus: ['ev-adapter'],
			title: { es: 'Clases adaptadoras', en: 'Adapter classes' },
			subtitles: [
				say('Si una interfaz es larga y te importa un solo método, implementarla entera llena todo de métodos vacíos.', 'If an interface is long and you care about one method, implementing it fully fills the code with empty methods.'),
				say('Una clase adaptadora la implementa vacía y vos sobrescribís solo lo que necesitás.', 'An adapter class implements it empty and you override only what you need.'),
				say('El costo: al ser una clase, gasta tu única herencia.', 'The trade-off: being a class, it uses up your only inheritance.'),
			],
			code: code(
				'WindowEvents.java',
				`class WindowEvents extends WindowAdapter {
    @Override
    public void windowActivated(WindowEvent e) {
        System.out.println("WINDOW ACTIVE");
    }
}

// addWindowListener espera un WindowListener:
// un WindowAdapter lo es
myFrame.addWindowListener(new WindowEvents());`,
				`class WindowEvents extends WindowAdapter {
    @Override
    public void windowActivated(WindowEvent e) {
        System.out.println("WINDOW ACTIVE");
    }
}

// addWindowListener expects a WindowListener:
// a WindowAdapter is one
myFrame.addWindowListener(new WindowEvents());`,
			),
		},

		// ─── 4. Several interfaces ──────────────────────────────────────────
		{
			id: 'multi-types',
			chapter: 'multi',
			scene: 'multi',
			title: { es: 'Una herencia, muchos contratos', en: 'One inheritance, many contracts' },
			subtitles: multiTypes.list,
			motion: {
				cues: [
					{ at: 0, do: 'enter', el: 'bird' },
					{ at: 700, do: 'enter', el: 'swimmer' },
					{ at: 1400, do: 'enter', el: 'flyer' },
					{ at: multiTypes.start(1) + 200, do: 'pulse', el: 'bird' },
					{ at: multiTypes.start(1) + 700, do: 'pulse', el: 'swimmer' },
					{ at: multiTypes.start(1) + 1200, do: 'pulse', el: 'flyer' },
				],
			},
		},
		{
			id: 'multi-duck',
			chapter: 'multi',
			scene: 'multi',
			title: { es: 'Duck extiende e implementa', en: 'Duck extends and implements' },
			subtitles: multiDuck.list,
			motion: {
				cues: [
					{ at: 0, do: 'enter', el: 'duck' },
					{ at: 900, do: 'draw', el: 'ext', dur: 900 },
					{ at: 1300, do: 'enter', el: 'lab-ext' },
					{ at: 1900, do: 'draw', el: 'imp-s', dur: 800 },
					{ at: 2400, do: 'draw', el: 'imp-f', dur: 800 },
					{ at: 2800, do: 'enter', el: 'lab-imp' },
					{ at: multiDuck.start(1) + 200, do: 'pulse', el: 'duck' },
					{ at: multiDuck.start(1) + 900, do: 'flow', el: 'imp-s' },
					{ at: multiDuck.start(1) + 900, do: 'flow', el: 'imp-f' },
				],
			},
		},
		{
			id: 'multi-views',
			chapter: 'multi',
			scene: 'multi',
			title: { es: 'El mismo objeto, tres ángulos', en: 'The same object, three angles' },
			subtitles: multiViews.list,
			motion: {
				cues: [
					{ at: 0, do: 'enter', el: 'view-b' },
					{ at: 400, do: 'enter', el: 'view-s' },
					{ at: 800, do: 'enter', el: 'view-f' },
					{ at: multiViews.start(1) + 200, do: 'pulse', el: 'bird' },
					{ at: multiViews.start(1) + 200, do: 'pulse', el: 'view-b' },
					{ at: multiViews.start(1) + 900, do: 'pulse', el: 'swimmer' },
					{ at: multiViews.start(1) + 900, do: 'pulse', el: 'view-s' },
					{ at: multiViews.start(1) + 1600, do: 'pulse', el: 'flyer' },
					{ at: multiViews.start(1) + 1600, do: 'pulse', el: 'view-f' },
				],
			},
		},
		{
			id: 'multi-contest',
			chapter: 'multi',
			scene: 'multi',
			title: { es: 'Tres clases sin ancestro común', en: 'Three classes with no common ancestor' },
			subtitles: multiContest.list,
			motion: {
				cues: [
					...exits(0, 'bird', 'flyer', 'duck', 'ext', 'imp-s', 'imp-f', 'lab-ext', 'lab-imp', 'view-b', 'view-s', 'view-f'),
					{ at: 900, do: 'pulse', el: 'swimmer' },
					...enters(1200, 350, 'p-duck', 'p-fish', 'p-sub'),
					{ at: 2400, do: 'draw', el: 'pa-duck', dur: 700 },
					{ at: 2700, do: 'draw', el: 'pa-fish', dur: 700 },
					{ at: 3000, do: 'draw', el: 'pa-sub', dur: 700 },
					{ at: 3800, do: 'type', el: 'arrc', dur: 1500 },
					{ at: multiContest.start(1) + 200, do: 'flow', el: 'pa-duck' },
					{ at: multiContest.start(1) + 200, do: 'flow', el: 'pa-fish' },
					{ at: multiContest.start(1) + 200, do: 'flow', el: 'pa-sub' },
					{ at: multiContest.start(1) + 600, do: 'pulse', el: 'swimmer' },
				],
			},
		},
		{
			id: 'multi-code',
			chapter: 'multi',
			scene: 'duck-code',
			show: '*',
			focus: ['dk-views'],
			title: { es: 'Duck en código', en: 'Duck in code' },
			subtitles: [
				say('Una línea de herencia y muchos contratos: así responde Java a la herencia múltiple.', 'One line of inheritance and many contracts: that is Java’s answer to multiple inheritance.'),
				say('Un método que solo necesita nadar no tiene por qué saber que es un pato.', 'A method that only needs something to swim has no reason to know it is a duck.'),
			],
			code: code(
				'Duck.java',
				`public class Duck extends Bird implements Swimmer, Flyer {
    @Override public void swim() { System.out.println("The duck swims."); }
    @Override public void fly()  { System.out.println("The duck flies."); }
}

Duck duck = new Duck();
Bird b = duck;       // como pájaro
Swimmer s = duck;    // como algo que nada
Flyer f = duck;      // como algo que vuela

public void swimmingContest(Swimmer[] participants) {
    for (Swimmer participant : participants) {
        participant.swim();
    }
}`,
				`public class Duck extends Bird implements Swimmer, Flyer {
    @Override public void swim() { System.out.println("The duck swims."); }
    @Override public void fly()  { System.out.println("The duck flies."); }
}

Duck duck = new Duck();
Bird b = duck;       // as a bird
Swimmer s = duck;    // as something that swims
Flyer f = duck;      // as something that flies

public void swimmingContest(Swimmer[] participants) {
    for (Swimmer participant : participants) {
        participant.swim();
    }
}`,
			),
		},

		// ─── 5. Which one to pick ───────────────────────────────────────────
		{
			id: 'cmp-identity',
			chapter: 'choose',
			scene: 'compare',
			show: ['cmp-head', 'cmp-1', 'cmp-2', 'cmp-3'],
			focus: ['cmp-1'],
			title: { es: 'Identidad o capacidad', en: 'Identity or capability' },
			subtitles: [
				say('La clase abstracta expresa «es un»: una identidad compartida.', 'The abstract class expresses “is a”: a shared identity.'),
				say('La interfaz expresa «es capaz de»: una capacidad que cualquiera puede firmar.', 'The interface expresses “is capable of”: a capability anyone can sign.'),
				say('Una clase extiende una sola; implementa tantas interfaces como quiera.', 'A class extends only one; it implements as many interfaces as it wants.'),
			],
		},
		{
			id: 'cmp-details',
			chapter: 'choose',
			scene: 'compare',
			show: ['cmp-head', 'cmp-1', 'cmp-2', 'cmp-3', 'cmp-4', 'cmp-5', 'cmp-6'],
			focus: ['cmp-4', 'cmp-5', 'cmp-6'],
			title: { es: 'Estado, visibilidad y evolución', en: 'State, visibility and evolution' },
			subtitles: [
				say('Solo la clase abstracta tiene estado de instancia y constructores.', 'Only the abstract class has instance state and constructors.'),
				say('Agregar un método abstracto rompe las subclases; uno `default` no rompe nada.', 'Adding an abstract method breaks subclasses; a `default` one breaks nothing.'),
			],
		},
		{
			id: 'cmp-rule',
			chapter: 'choose',
			scene: 'compare',
			show: '*',
			focus: ['cmp-rule'],
			title: { es: 'La regla práctica', en: 'The practical rule' },
			subtitles: [
				say('La regla que vale en el 90% de los casos: interfaz por defecto.', 'The rule that holds in 90% of cases: interface by default.'),
				say('Clase abstracta solo cuando hay estado o código compartido que no querés repetir.', 'Abstract class only when there is shared state or code you do not want to repeat.'),
			],
		},
		{
			id: 'combo-layers',
			chapter: 'choose',
			scene: 'combo',
			title: { es: 'Interfaz más base abstracta', en: 'Interface plus abstract base' },
			subtitles: comboLayers.list,
			motion: {
				cues: [
					{ at: 0, do: 'enter', el: 'repo' },
					{ at: 500, do: 'enter', el: 'tag-contract' },
					{ at: 1400, do: 'enter', el: 'comb-abs' },
					{ at: 1900, do: 'draw', el: 'cmb-a1', dur: 700 },
					{ at: 2200, do: 'enter', el: 'tag-shared' },
					{ at: 2900, do: 'enter', el: 'abs-solved' },
					{ at: comboLayers.start(1) + 100, do: 'pulse', el: 'abs-solved' },
					{ at: comboLayers.start(1) + 800, do: 'enter', el: 'abs-gap' },
					{ at: comboLayers.start(1) + 1500, do: 'pulse', el: 'abs-gap' },
					{ at: comboLayers.start(2), do: 'enter', el: 'conc' },
					{ at: comboLayers.start(2) + 600, do: 'draw', el: 'cmb-a2', dur: 700 },
					{ at: comboLayers.start(2) + 900, do: 'enter', el: 'tag-own' },
					{ at: comboLayers.start(2) + 1600, do: 'pulse', el: 'conc' },
				],
			},
		},
		{
			id: 'combo-rule',
			chapter: 'choose',
			scene: 'combo',
			title: { es: 'Interfaz primero', en: 'Interface first' },
			subtitles: comboRule.list,
			motion: {
				cues: [
					{ at: 0, do: 'enter', el: 'rule' },
					{ at: 700, do: 'type', el: 'rule-text', dur: 1600 },
					{ at: 2600, do: 'pulse', el: 'repo' },
					{ at: 3100, do: 'pulse', el: 'comb-abs' },
					{ at: 3600, do: 'flow', el: 'cmb-a1' },
					{ at: 3600, do: 'flow', el: 'cmb-a2' },
				],
			},
		},

		// ─── 6. Packages and namespaces ─────────────────────────────────────
		{
			id: 'ns-intro',
			chapter: 'namespace',
			scene: 'ns-pillars',
			show: ['pl-ns'],
			title: { es: 'Qué es un namespace', en: 'What a namespace is' },
			subtitles: [
				say('Un namespace agrupa tipos y les da un contexto único para evitar choques de nombres.', 'A namespace groups types and gives them a unique context to prevent name collisions.'),
				say('Java no tiene una palabra `namespace`: usa `package`.', 'Java has no `namespace` keyword: it uses `package`.'),
			],
		},
		{
			id: 'ns-pillars',
			chapter: 'namespace',
			scene: 'ns-pillars',
			show: '*',
			focus: ['pl-package', 'pl-fqcn', 'pl-import'],
			title: { es: 'Tres pilares', en: 'Three pillars' },
			subtitles: [
				say('Tres pilares: la declaración `package`, el nombre completo FQCN y el `import` como atajo.', 'Three pillars: the `package` declaration, the FQCN, and `import` as a shortcut.'),
				say('La carpeta tiene que coincidir con el package, siempre: si no, no compila.', 'The folder must match the package, always: otherwise it does not compile.'),
			],
			code: code(
				'Product.java',
				`package com.facundouferer.shop.domain;   // primera línea, obligatoria

public class Product { ... }`,
				`package com.facundouferer.shop.domain;   // first line, mandatory

public class Product { ... }`,
			),
			shell: shell(
				cmd('tree src'),
				out('src'),
				out('└── com/facundouferer/shop'),
				out('    ├── domain/Product.java'),
				out('    ├── service/CartService.java'),
				out('    └── Main.java'),
			),
		},
		{
			id: 'fqcn-two',
			chapter: 'namespace',
			scene: 'fqcn',
			title: { es: 'Dos Product, cero ambigüedad', en: 'Two Product, zero ambiguity' },
			subtitles: fqcnTwo.list,
			motion: {
				cues: [
					{ at: 0, do: 'enter', el: 'pkg-a' },
					{ at: 400, do: 'enter', el: 'cls-a' },
					{ at: 1100, do: 'type', el: 'fq-a', dur: 1400 },
					{ at: 1800, do: 'enter', el: 'pkg-b' },
					{ at: 2200, do: 'enter', el: 'cls-b' },
					{ at: 2900, do: 'type', el: 'fq-b', dur: 1300 },
					{ at: fqcnTwo.start(1) + 200, do: 'pulse', el: 'cls-a' },
					{ at: fqcnTwo.start(1) + 800, do: 'pulse', el: 'cls-b' },
				],
			},
		},
		{
			id: 'fqcn-clash',
			chapter: 'namespace',
			scene: 'fqcn',
			title: { es: 'Colisión al importar', en: 'Collision when importing' },
			subtitles: fqcnClash.list,
			motion: {
				cues: [
					{ at: 0, do: 'camera', to: ['clash-card', 'clash-err'], pad: 70, dur: 1300 },
					{ at: 700, do: 'enter', el: 'clash-card' },
					{ at: 1200, do: 'type', el: 'clash-l1', dur: 1100 },
					{ at: fqcnClash.start(1), do: 'type', el: 'clash-l2', dur: 1100 },
					{ at: fqcnClash.start(1) + 1400, do: 'enter', el: 'clash-err' },
					{ at: fqcnClash.start(1) + 2000, do: 'pulse', el: 'clash-err' },
				],
			},
		},
		{
			id: 'fqcn-fix',
			chapter: 'namespace',
			scene: 'fqcn',
			title: { es: 'Desambiguar con el FQCN', en: 'Disambiguate with the FQCN' },
			subtitles: fqcnFix.list,
			motion: {
				cues: [
					{ at: 0, do: 'camera', to: ['clash-card', 'fix-card'], pad: 50, dur: 1300 },
					{ at: 600, do: 'exit', el: 'clash-err' },
					{ at: 700, do: 'exit', el: 'clash-l2' },
					{ at: 900, do: 'enter', el: 'fix-card' },
					{ at: 1400, do: 'type', el: 'fix-l1', dur: 1000 },
					{ at: 2500, do: 'type', el: 'fix-l2', dur: 1200 },
					{ at: fqcnFix.start(1) + 100, do: 'enter', el: 'fix-ok' },
					{ at: fqcnFix.start(1) + 900, do: 'pulse', el: 'fix-ok' },
					{ at: fqcnFix.start(1) + 2200, do: 'camera', to: 'all', dur: 1200 },
				],
			},
		},
		{
			id: 'ns-rules',
			chapter: 'namespace',
			scene: 'ns-rules',
			show: '*',
			focus: ['nr-6'],
			title: { es: 'Reglas de diseño de packages', en: 'Package design rules' },
			subtitles: [
				say('Dominio al revés, todo en minúsculas y un archivo por cada clase pública.', 'Reversed domain, all lowercase, and one file per public class.'),
				say('Agrupá por responsabilidad, no por tipo de artefacto: `domain` y `service`, no `interfaces`.', 'Group by responsibility, not by artifact type: `domain` and `service`, not `interfaces`.'),
				say('Y el acceso package-private convierte al package en una frontera de confianza.', 'And package-private access turns the package into a trust boundary.'),
			],
		},

		// ─── 7. Relationships ───────────────────────────────────────────────
		{
			id: 'rel-assoc',
			chapter: 'relations',
			scene: 'rel',
			title: { es: 'Asociación', en: 'Association' },
			subtitles: relAssoc.list,
			motion: {
				cues: [
					{ at: 0, do: 'enter', el: 'w-1' },
					{ at: 500, do: 'draw', el: 'lk-1', dur: 800 },
					{ at: 1100, do: 'enter', el: 'p-1' },
					{ at: 1600, do: 'enter', el: 'ds-1' },
					{ at: relAssoc.start(1) + 300, do: 'pulse', el: 'w-1' },
					{ at: relAssoc.start(1) + 800, do: 'pulse', el: 'p-1' },
				],
			},
		},
		{
			id: 'rel-aggr',
			chapter: 'relations',
			scene: 'rel',
			title: { es: 'Agregación', en: 'Aggregation' },
			subtitles: relAggr.list,
			motion: {
				cues: [
					{ at: 0, do: 'enter', el: 'w-2' },
					{ at: 500, do: 'enter', el: 'dia-2' },
					{ at: 800, do: 'draw', el: 'lk-2', dur: 800 },
					{ at: 1400, do: 'enter', el: 'p-2' },
					{ at: 1900, do: 'enter', el: 'ds-2' },
					{ at: relAggr.start(1) + 300, do: 'pulse', el: 'dia-2' },
					{ at: relAggr.start(1) + 800, do: 'pulse', el: 'p-2' },
				],
			},
		},
		{
			id: 'rel-comp',
			chapter: 'relations',
			scene: 'rel',
			title: { es: 'Composición', en: 'Composition' },
			subtitles: relComp.list,
			motion: {
				cues: [
					{ at: 0, do: 'enter', el: 'w-3' },
					{ at: 500, do: 'enter', el: 'dia-3' },
					{ at: 800, do: 'draw', el: 'lk-3', dur: 800 },
					{ at: 1400, do: 'enter', el: 'p-3' },
					{ at: 1900, do: 'enter', el: 'ds-3' },
					{ at: relComp.start(1) + 300, do: 'pulse', el: 'dia-3' },
					{ at: relComp.start(1) + 800, do: 'pulse', el: 'p-3' },
				],
			},
		},
		{
			id: 'rel-demolish',
			chapter: 'relations',
			scene: 'rel',
			title: { es: 'Si destruyo el todo…', en: 'If I destroy the whole…' },
			subtitles: relDemolish.list,
			motion: {
				cues: [
					{ at: 0, do: 'type', el: 'q', dur: 2000 },
					...exits(2600, 'w-1', 'w-2', 'w-3', 'lk-1', 'lk-2', 'lk-3', 'dia-2', 'dia-3'),
					{ at: relDemolish.start(1), do: 'enter', el: 'ok-1' },
					{ at: relDemolish.start(1) + 300, do: 'enter', el: 'ok-2' },
					{ at: relDemolish.start(1) + 600, do: 'pulse', el: 'p-1' },
					{ at: relDemolish.start(1) + 900, do: 'pulse', el: 'p-2' },
					{ at: relDemolish.start(1) + 2000, do: 'exit', el: 'p-3' },
					{ at: relDemolish.start(1) + 2300, do: 'enter', el: 'ko-3' },
				],
			},
		},
		{
			id: 'rel-code-aggr',
			chapter: 'relations',
			scene: 'rel-code',
			show: ['rc-assoc', 'rc-aggr'],
			focus: ['rc-aggr'],
			title: { es: 'Agregación en código', en: 'Aggregation in code' },
			subtitles: [
				say('En la agregación, el contenedor recibe las partes desde afuera.', 'In aggregation, the container receives the parts from outside.'),
				say('Por eso hace una copia defensiva con `Arrays.copyOf`: la lista original sigue siendo de otro.', 'That is why it makes a defensive copy with `Arrays.copyOf`: the original array belongs to someone else.'),
			],
			code: relationsCode([6, 7, 8, 9, 10, 11, 12]),
		},
		{
			id: 'rel-code-comp',
			chapter: 'relations',
			scene: 'rel-code',
			show: '*',
			focus: ['rc-comp'],
			title: { es: 'Composición en código', en: 'Composition in code' },
			subtitles: [
				say('En la composición, el contenedor crea las partes en su propio constructor.', 'In composition, the container creates the parts in its own constructor.'),
				say('Y no las expone: no hay `getRooms()`. Esa diferencia en el código es la diferencia conceptual.', 'And it does not expose them: there is no `getRooms()`. That code difference is the conceptual one.'),
			],
			code: relationsCode([14, 15, 16, 17, 18, 19, 20, 21, 22, 23]),
		},

		// ─── 8. Common mistakes ─────────────────────────────────────────────
		{
			id: 'errors-list',
			chapter: 'errors',
			scene: 'errors11',
			show: '*',
			title: { es: 'Errores frecuentes', en: 'Common mistakes' },
			subtitles: [
				say('Usar una clase abstracta donde va una interfaz quema el único `extends` disponible.', 'Using an abstract class where an interface belongs burns the only available `extends`.'),
				say('Una interfaz con `default` en cada método deja de ser contrato y se vuelve clase abstracta.', 'An interface with a `default` for every method stops being a contract and becomes an abstract class.'),
				say('Todo campo de una interfaz es `public static final`: una constante global, no estado de objeto.', 'Every field of an interface is `public static final`: a global constant, not object state.'),
				say('Y si la parte no vive sin el todo, es composición: crearla adentro y no exponerla.', 'And if the part cannot live without the whole, it is composition: create it inside and do not expose it.'),
			],
		},

		// ─── 9. Guided exercise ─────────────────────────────────────────────
		{
			id: 'ex-brief',
			chapter: 'exercise',
			scene: 'exercise11',
			show: '*',
			title: { es: 'Desafío: medios de pago', en: 'Challenge: payment methods' },
			subtitles: [
				say('Definí `Payable` con `pay`, `isAvailable` y un `default payIfPossible`.', 'Define `Payable` with `pay`, `isAvailable` and a `default payIfPossible`.'),
				say('Implementalo en `CreditCard` y en `DigitalWallet`, que extiende una clase abstracta con el email y un flag `active`.', 'Implement it in `CreditCard` and `DigitalWallet`, which extends an abstract class with the email and an `active` flag.'),
				say('En `main`, cobrá lo mismo a todos con un solo bucle, sin `instanceof` ni casting.', 'In `main`, charge everyone the same amount in one loop, with no `instanceof` or casting.'),
			],
		},
		{
			id: 'ex-solution',
			chapter: 'exercise',
			scene: 'exercise11',
			show: '*',
			focus: ['ex3', 'ex4'],
			title: { es: 'La clase abstracta aporta el estado', en: 'The abstract class contributes the state' },
			subtitles: [
				say('`DigitalPaymentMethod` guarda el email y el flag `active`, y deja `pay()` abstracto.', '`DigitalPaymentMethod` stores the email and the `active` flag, and leaves `pay()` abstract.'),
				say('`DigitalWallet.isAvailable()` llama a `super.isAvailable()` y suma su propia condición.', '`DigitalWallet.isAvailable()` calls `super.isAvailable()` and adds its own condition.'),
			],
			code: code(
				'DigitalWallet.java',
				`public abstract class DigitalPaymentMethod implements Payable {
    protected final String email;
    protected boolean active = true;

    protected DigitalPaymentMethod(String email) {
        this.email = email;
    }

    @Override
    public boolean isAvailable() { return active; }

    // pay() sigue abstracto: cada medio cobra a su modo
}

public class DigitalWallet extends DigitalPaymentMethod {
    private double balance;

    @Override
    public boolean isAvailable() {
        return super.isAvailable() && balance > 0;   // reutiliza y refina
    }

    @Override
    public boolean pay(double amount) {
        if (amount > balance) return false;
        balance -= amount;
        return true;
    }
}`,
				`public abstract class DigitalPaymentMethod implements Payable {
    protected final String email;
    protected boolean active = true;

    protected DigitalPaymentMethod(String email) {
        this.email = email;
    }

    @Override
    public boolean isAvailable() { return active; }

    // pay() stays abstract: each method charges its own way
}

public class DigitalWallet extends DigitalPaymentMethod {
    private double balance;

    @Override
    public boolean isAvailable() {
        return super.isAvailable() && balance > 0;   // reuses and refines
    }

    @Override
    public boolean pay(double amount) {
        if (amount > balance) return false;
        balance -= amount;
        return true;
    }
}`,
				[16, 17, 18, 19, 20],
			),
		},
		{
			id: 'ex-run',
			chapter: 'exercise',
			scene: 'exercise11',
			show: '*',
			focus: ['ex5'],
			title: { es: 'Un bucle, tres medios', en: 'One loop, three methods' },
			subtitles: [
				say('`CreditCard` y `DigitalWallet` no comparten ningún ancestro y viven en el mismo `Payable[]`.', '`CreditCard` and `DigitalWallet` share no ancestor and live in the same `Payable[]`.'),
				say('El `default` decide por todos: nadie pregunta de qué tipo es cada uno.', 'The `default` decides for everyone: nobody asks what type each one is.'),
			],
			code: code(
				'MainCobros.java',
				`Payable[] methods = {
    new CreditCard("4417", 50000),
    new DigitalWallet("facu@mail.com", 30000),
    new DigitalWallet("empty@mail.com", 0)   // sin saldo
};

for (Payable method : methods) {
    method.payIfPossible(12500);
}`,
				`Payable[] methods = {
    new CreditCard("4417", 50000),
    new DigitalWallet("facu@mail.com", 30000),
    new DigitalWallet("empty@mail.com", 0)   // no balance
};

for (Payable method : methods) {
    method.payIfPossible(12500);
}`,
			),
			shell: shell(
				cmd('java MainCobros'),
				out('Cobrando $12.500 a cada medio:', 'Charging $12,500 to every method:'),
				out('  ✓ Tarjeta ****4417 — crédito restante $37500.00', '  ✓ Card ****4417 — remaining credit $37500.00'),
				out('  ✓ Billetera (facu@mail.com) — saldo restante $17500.00', '  ✓ Wallet (facu@mail.com) — remaining balance $17500.00'),
				out('  ✗ Medio no disponible, cobro omitido.', '  ✗ Method unavailable, charge skipped.'),
			),
		},

		// ─── Closing ────────────────────────────────────────────────────────
		{
			id: 'closing-takeaways',
			chapter: 'closing',
			scene: 'closing11',
			show: '*',
			title: { es: 'Para llevarte', en: 'Key takeaways' },
			subtitles: [
				say('Una clase abstracta es un molde incompleto; una interfaz, un contrato que no gasta tu `extends`.', 'An abstract class is an incomplete mold; an interface is a contract that does not use up your `extends`.'),
				say('Empezá por la interfaz y sumá una base abstracta solo si hay estado o lógica compartida.', 'Start with the interface and add an abstract base only if there is shared state or logic.'),
				say('Y ante cualquier relación, preguntá: si destruyo el todo, ¿la parte sigue existiendo?', 'And for any relationship, ask: if I destroy the whole, does the part still exist?'),
			],
		},
	],
};

function relationsCode(focusLines: number[]): CodePanel {
	return code(
		'Relaciones.java',
		`// ASOCIACIÓN: se conocen, ninguno es dueño
public class Teacher {
    private Course[] courses = new Course[10];
}

// AGREGACIÓN: recibe las partes desde afuera
public class Team {
    private final Player[] players;
    public Team(Player[] players) {
        this.players = Arrays.copyOf(players, players.length);
    }
}

// COMPOSICIÓN: crea sus partes y no las expone
public class House {
    private final Room[] rooms;
    public House(int roomCount) {
        rooms = new Room[roomCount];
        for (int i = 0; i < roomCount; i++) {
            rooms[i] = new Room(i + 1);
        }
    }
}`,
		`// ASSOCIATION: they know each other, neither owns the other
public class Teacher {
    private Course[] courses = new Course[10];
}

// AGGREGATION: receives the parts from outside
public class Team {
    private final Player[] players;
    public Team(Player[] players) {
        this.players = Arrays.copyOf(players, players.length);
    }
}

// COMPOSITION: creates its parts and does not expose them
public class House {
    private final Room[] rooms;
    public House(int roomCount) {
        rooms = new Room[roomCount];
        for (int i = 0; i < roomCount; i++) {
            rooms[i] = new Room(i + 1);
        }
    }
}`,
		focusLines,
	);
}
