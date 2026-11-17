import type { AnimationScript, MotionCue, Subtitle } from './types';

// "The journey to an object: the four pillars of OOP": a short film (about two minutes)
// for the Java lesson "Programación Orientada a Objetos y sus Pilares". It plays on a
// single persistent canvas (`data-scene="journey"` in
// `src/components/animaciones/introduccion-pilares-poo-java.astro`): an isometric
// system where loose procedural variables (`titular1`, `saldo1`) are exposed to
// direct negative corruption in magenta, then gathered into a cohesive `CuentaBancaria`
// object with protected `private` state, extended by `CajaAhorro`, and invoked
// polymorphically through `calcularInteres()`.

const say = (es: string, en: string): Subtitle => ({ text: { es, en } });

/**
 * Pins captions on the step timeline: each one starts once the previous has been
 * read (same formula as `subtitleReadingTime`, for the slower locale) plus a pause.
 * Cues are placed relative to those starts to stay in sync with what is being said.
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

/** Cues in chronological order: later cues must be scheduled after the ones they override. */
const seq = (...cues: MotionCue[]): MotionCue[] =>
	cues
		.map((cue, index) => ({ cue, index }))
		.sort((a, b) => a.cue.at - b.cue.at || a.index - b.index)
		.map((entry) => entry.cue);

/** Camera cue that frames one of the `shot-*` anchors exactly (they carry their own zoom). */
const shot = (at: number, to: string, dur: number): MotionCue => ({ at, do: 'camera', to: [to], dur, pad: 0 });

/** Types the editor lines `from`..`to` of one page (`ea` or `eb`), one after the other. */
const typeLines = (at: number, page: 'ea' | 'eb', from: number, to: number, gap: number): MotionCue[] =>
	Array.from({ length: to - from + 1 }, (_, index) => ({
		at: at + index * gap,
		do: 'type' as const,
		el: `${page}-${from + index}`,
		dur: Math.max(200, gap),
	}));

/** Fades several elements out at the same moment. */
const clear = (at: number, ...els: string[]): MotionCue[] => els.map((el) => ({ at, do: 'exit' as const, el, dur: 400 }));

// ─── Captions ───────────────────────────────────────────────────────────────
const chaos = timed(
	say(
		'En la programación estructurada, los datos viven en variables sueltas como `titular1` y `saldo1`.',
		'In procedural programming, data lives in loose variables such as `holder1` and `balance1`.',
	),
	say(
		'Las funciones y los datos están separados: nada agrupa qué variables pertenecen a cada cuenta.',
		'Functions and data are separate: nothing groups which variables belong to each account.',
	),
);

const corrupt = timed(
	say(
		'Cualquier línea altera `saldo1` sin control: asignar `-500` deja la cuenta en un estado inválido.',
		'Any line mutates `balance1` without control: assigning `-500` leaves the account in an invalid state.',
	),
	say(
		'Ese acoplamiento hace frágil al programa: un error en un lugar rompe los datos de todos.',
		'That coupling makes the program fragile: a mistake in one place breaks the data for everyone.',
	),
);

const abstractStep = timed(
	say(
		'Pilar 1, abstracción: elegimos lo esencial del dominio y lo reunimos en la clase `CuentaBancaria`.',
		'Pillar 1, abstraction: we pick the essentials of the domain and gather them in `BankAccount`.',
	),
	say(
		'Un objeto combina estado (`saldo`) y comportamiento (`depositar`) bajo una sola responsabilidad.',
		'An object combines state (`balance`) and behavior (`deposit`) under a single responsibility.',
	),
);

const encapsulate = timed(
	say(
		'Pilar 2, encapsulamiento: el atributo `private double saldo` queda oculto dentro del objeto.',
		'Pillar 2, encapsulation: the field `private double balance` stays hidden inside the object.',
	),
	say(
		'Nadie puede tocarlo desde afuera; solo los métodos públicos del propio objeto acceden a él.',
		'No one can touch it from outside; only the public methods of the object itself access it.',
	),
);

const guard = timed(
	say(
		'Al llamar a `depositar(-500)`, la condición `monto > 0` rechaza el valor negativo en la entrada.',
		'When calling `deposit(-500)`, the condition `amount > 0` rejects the negative value at the gate.',
	),
	say(
		'En cambio, `depositar(300)` supera la regla y actualiza el saldo protegido a `1300.0`.',
		'Instead, `deposit(300)` passes the rule and updates the protected balance to `1300.0`.',
	),
);

const inherit = timed(
	say(
		'Pilar 3, herencia: `CajaAhorro extends CuentaBancaria` reutiliza el estado y los métodos de la base.',
		'Pillar 3, inheritance: `SavingsAccount extends BankAccount` reuses the base state and methods.',
	),
	say(
		'La subclase especializa el modelo sin duplicar código: una `CajaAhorro` es una `CuentaBancaria`.',
		'The subclass specializes the model without duplicating code: a `SavingsAccount` is a `BankAccount`.',
	),
);

const polymorph = timed(
	say(
		'Pilar 4, polimorfismo: una variable `CuentaBancaria` envía el mismo mensaje `calcularInteres()`.',
		'Pillar 4, polymorphism: a `BankAccount` variable sends the same message `calculateInterest()`.',
	),
	say(
		'En tiempo de ejecución, cada objeto responde según su tipo real: `CajaAhorro` calcula su 10%.',
		'At runtime, each object responds according to its real type: `SavingsAccount` computes its 10%.',
	),
);

const recap = timed(
	say(
		'De variables sueltas a objetos cohesivos: estado protegido y comportamiento en una misma unidad.',
		'From loose variables to cohesive objects: protected state and behavior in a single unit.',
	),
	say(
		'Los cuatro pilares —abstracción, encapsulamiento, herencia y polimorfismo— trazan límites claros.',
		'The four pillars —abstraction, encapsulation, inheritance and polymorphism— draw clear boundaries.',
	),
	say(
		'Así se construye software modular: cada objeto cuida sus datos y responde a mensajes bien definidos.',
		'That is how modular software is built: each object guards its data and answers well-defined messages.',
	),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'procedural', label: { es: 'Variables sueltas', en: 'Loose variables' } },
		{ id: 'abstraction', label: { es: '1. Abstracción', en: '1. Abstraction' } },
		{ id: 'encapsulation', label: { es: '2. Encapsulamiento', en: '2. Encapsulation' } },
		{ id: 'inheritance', label: { es: '3. Herencia', en: '3. Inheritance' } },
		{ id: 'polymorphism', label: { es: '4. Polimorfismo', en: '4. Polymorphism' } },
		{ id: 'recap', label: { es: 'Los cuatro pilares', en: 'The four pillars' } },
	],
	steps: [
		// ─── Scene 1. Loose procedural variables ────────────────────────────
		{
			id: 'chaos',
			chapter: 'procedural',
			scene: 'journey',
			title: { es: 'Datos sueltos en main()', en: 'Loose data in main()' },
			subtitles: chaos.list,
			motion: {
				cues: seq(
					shot(0, 'shot-proc', 3500),
					{ at: 200, do: 'enter', el: 'floor-proc' },
					...typeLines(300, 'ea', 1, 5, 280),
					{ at: 700, do: 'enter', el: 'm-t1' },
					{ at: 900, do: 'enter', el: 'm-s1' },
					{ at: 1100, do: 'enter', el: 'm-bad' },
					{ at: 1300, do: 'draw', el: 'tr-proc', dur: 800 },
					{ at: 1600, do: 'enter', el: 'hl' },
					{ at: 1700, do: 'enter', el: 'p' },
					{ at: 2000, do: 'move', el: 'p', to: 'a-t1', dur: 800 },
					{ at: 2000, do: 'move', el: 'hl', to: 'ln-3', dur: 600 },
					{ at: 2800, do: 'enter', el: 't1-on' },
					{ at: 2900, do: 'enter', el: 'lb-t1' },
					{ at: chaos.start(1) + 200, do: 'draw', el: 'fl-proc-1', dur: 700 },
					{ at: chaos.start(1) + 300, do: 'move', el: 'p', to: 'a-s1', dur: 900 },
					{ at: chaos.start(1) + 300, do: 'move', el: 'hl', to: 'ln-4', dur: 600 },
					{ at: chaos.start(1) + 1200, do: 'enter', el: 's1-on' },
					{ at: chaos.start(1) + 1300, do: 'enter', el: 'lb-s1' },
					{ at: chaos.start(1) + 2200, do: 'pulse', el: 'lb-t1' },
					{ at: chaos.start(1) + 2800, do: 'pulse', el: 'lb-s1' },
				),
			},
		},
		{
			id: 'corrupt',
			chapter: 'procedural',
			scene: 'journey',
			title: { es: 'Modificación directa sin control', en: 'Uncontrolled direct mutation' },
			subtitles: corrupt.list,
			motion: {
				cues: seq(
					shot(0, 'shot-proc', 2200),
					...typeLines(200, 'ea', 6, 8, 280),
					{ at: 900, do: 'draw', el: 'fl-proc-bad', dur: 800 },
					{ at: 1000, do: 'move', el: 'p', to: 'a-bad', dur: 900 },
					{ at: 1000, do: 'move', el: 'hl', to: 'ln-6', dur: 600 },
					{ at: 1900, do: 'enter', el: 'bad-on' },
					{ at: 1900, do: 'enter', el: 'hx-6' },
					{ at: 2100, do: 'enter', el: 'bad-chip' },
					{ at: 2800, do: 'pulse', el: 'bad-chip' },
					{ at: corrupt.start(1) + 200, do: 'move', el: 'hl', to: 'ln-7', dur: 600 },
					{ at: corrupt.start(1) + 800, do: 'type', el: 'out-bad', dur: 800 },
					{ at: corrupt.start(1) + 1800, do: 'pulse', el: 'bad-on' },
				),
			},
		},

		// ─── Scene 2. Pillar 1: Abstraction ─────────────────────────────────
		{
			id: 'abstract',
			chapter: 'abstraction',
			scene: 'journey',
			title: { es: 'Pilar 1: Abstracción en CuentaBancaria', en: 'Pillar 1: Abstraction in BankAccount' },
			subtitles: abstractStep.list,
			motion: {
				cues: seq(
					shot(0, 'shot-account', 2600),
					{ at: 200, do: 'enter', el: 'floor-acc' },
					...typeLines(300, 'ea', 9, 14, 250),
					{ at: 1200, do: 'enter', el: 'pil-1' },
					{ at: 1900, do: 'pulse', el: 'pil-1' },
					{ at: 2400, do: 'enter', el: 'lb-abs' },
					...typeLines(abstractStep.start(1), 'ea', 15, 20, 220),
					{ at: abstractStep.start(1) + 900, do: 'enter', el: 'heap' },
					{ at: abstractStep.start(1) + 1400, do: 'enter', el: 'obj-acc', dur: 700 },
					{ at: abstractStep.start(1) + 2200, do: 'pulse', el: 'obj-acc' },
					{ at: abstractStep.start(1) + 2600, do: 'enter', el: 'lb-dep' },
				),
			},
		},

		// ─── Scene 3. Pillar 2: Encapsulation ───────────────────────────────
		{
			id: 'encapsulate',
			chapter: 'encapsulation',
			scene: 'journey',
			title: { es: 'Pilar 2: Estado privado y barrera', en: 'Pillar 2: Private state and barrier' },
			subtitles: encapsulate.list,
			motion: {
				cues: seq(
					...clear(0, 'floor-proc', 'm-t1', 'm-s1', 'm-bad', 'tr-proc', 't1-on', 's1-on', 'bad-on', 'lb-t1', 'lb-s1', 'bad-chip', 'fl-proc-1', 'fl-proc-bad', 'hx-6', 'out-bad', 'ea', 'p', 'hl'),
					shot(0, 'shot-encap', 2400),
					{ at: 400, do: 'enter', el: 'eb' },
					...typeLines(500, 'eb', 1, 9, 200),
					{ at: 1200, do: 'enter', el: 'hv-2' },
					{ at: 1600, do: 'enter', el: 'pil-2' },
					{ at: 2300, do: 'pulse', el: 'pil-2' },
					{ at: encapsulate.start(1) + 200, do: 'enter', el: 'shield' },
					{ at: encapsulate.start(1) + 900, do: 'pulse', el: 'shield' },
					{ at: encapsulate.start(1) + 1500, do: 'enter', el: 'lb-priv' },
					{ at: encapsulate.start(1) + 2300, do: 'pulse', el: 'obj-acc' },
				),
			},
		},
		{
			id: 'guard',
			chapter: 'encapsulation',
			scene: 'journey',
			title: { es: 'depositar() valida la regla de negocio', en: 'deposit() validates the business rule' },
			subtitles: guard.list,
			motion: {
				cues: seq(
					shot(0, 'shot-guard', 2200),
					{ at: 100, do: 'enter', el: 'floor-main' },
					{ at: 250, do: 'enter', el: 'm-dep-bad' },
					{ at: 400, do: 'enter', el: 'm-dep-ok' },
					{ at: 550, do: 'draw', el: 'tr-main', dur: 700 },
					{ at: 700, do: 'move', el: 'p', to: 'a-dep-bad', dur: 1 },
					{ at: 700, do: 'move', el: 'hl', to: 'ln-4', dur: 1 },
					{ at: 900, do: 'enter', el: 'p' },
					{ at: 900, do: 'enter', el: 'hl' },
					{ at: 1400, do: 'draw', el: 'rt-rej', dur: 800 },
					{ at: 2100, do: 'enter', el: 'dep4-x' },
					{ at: 2300, do: 'enter', el: 'rej-chip' },
					{ at: 3000, do: 'pulse', el: 'rej-chip' },
					...clear(guard.start(1), 'rt-rej', 'dep4-x', 'rej-chip'),
					{ at: guard.start(1) + 300, do: 'draw', el: 'fl-guard-1', dur: 600 },
					{ at: guard.start(1) + 400, do: 'move', el: 'p', to: 'a-dep-ok', dur: 800 },
					{ at: guard.start(1) + 400, do: 'move', el: 'hl', to: 'ln-5', dur: 600 },
					{ at: guard.start(1) + 1200, do: 'enter', el: 'dep-ok-on' },
					{ at: guard.start(1) + 1400, do: 'draw', el: 'rt-dep', dur: 900 },
					{ at: guard.start(1) + 1500, do: 'move', el: 'p', to: 'a-dep5', dur: 1100 },
					{ at: guard.start(1) + 2600, do: 'enter', el: 'dep5-on' },
					{ at: guard.start(1) + 2800, do: 'type', el: 'out-enc', dur: 800 },
					{ at: guard.start(1) + 3400, do: 'pulse', el: 'obj-acc' },
				),
			},
		},

		// ─── Scene 4. Pillar 3: Inheritance ─────────────────────────────────
		{
			id: 'inherit',
			chapter: 'inheritance',
			scene: 'journey',
			title: { es: 'Pilar 3: CajaAhorro extends CuentaBancaria', en: 'Pillar 3: SavingsAccount extends BankAccount' },
			subtitles: inherit.list,
			motion: {
				cues: seq(
					shot(0, 'shot-inherit', 2400),
					...typeLines(200, 'eb', 10, 14, 220),
					{ at: 700, do: 'enter', el: 'floor-sav' },
					{ at: 1300, do: 'draw', el: 'fl-ext', dur: 900 },
					{ at: 1800, do: 'enter', el: 'pil-3' },
					{ at: 2400, do: 'pulse', el: 'pil-3' },
					{ at: 2700, do: 'enter', el: 'lb-ext' },
					...typeLines(inherit.start(1), 'eb', 15, 20, 200),
					{ at: inherit.start(1) + 600, do: 'enter', el: 'm-sav-new' },
					{ at: inherit.start(1) + 800, do: 'enter', el: 'm-poly-call' },
					{ at: inherit.start(1) + 1200, do: 'move', el: 'p', to: 'a-sav-new', dur: 900 },
					{ at: inherit.start(1) + 1200, do: 'move', el: 'hl', to: 'ln-17', dur: 600 },
					{ at: inherit.start(1) + 2100, do: 'enter', el: 'sav-new-on' },
					{ at: inherit.start(1) + 2300, do: 'enter', el: 'obj-sav', dur: 700 },
					{ at: inherit.start(1) + 2900, do: 'draw', el: 'ref-sav', dur: 800 },
					{ at: inherit.start(1) + 3500, do: 'pulse', el: 'obj-sav' },
				),
			},
		},

		// ─── Scene 5. Pillar 4: Polymorphism ────────────────────────────────
		{
			id: 'polymorph',
			chapter: 'polymorphism',
			scene: 'journey',
			title: { es: 'Pilar 4: Despacho polimórfico', en: 'Pillar 4: Polymorphic dispatch' },
			subtitles: polymorph.list,
			motion: {
				cues: seq(
					shot(0, 'shot-poly', 2400),
					{ at: 300, do: 'draw', el: 'fl-poly-1', dur: 700 },
					{ at: 400, do: 'move', el: 'p', to: 'a-poly-call', dur: 900 },
					{ at: 400, do: 'move', el: 'hl', to: 'ln-18', dur: 600 },
					{ at: 1300, do: 'enter', el: 'poly-call-on' },
					{ at: 1600, do: 'enter', el: 'pil-4' },
					{ at: 2200, do: 'pulse', el: 'pil-4' },
					{ at: 2500, do: 'draw', el: 'fl-ref-sav', dur: 800 },
					{ at: 2600, do: 'move', el: 'p', to: 'a-sav-obj', dur: 900 },
					{ at: polymorph.start(1) + 200, do: 'enter', el: 'o-scan' },
					{ at: polymorph.start(1) + 700, do: 'draw', el: 'rt-poly', dur: 1000 },
					{ at: polymorph.start(1) + 800, do: 'move', el: 'p', to: 'a-sav12', dur: 1200 },
					{ at: polymorph.start(1) + 800, do: 'move', el: 'hl', to: 'ln-12', dur: 700 },
					{ at: polymorph.start(1) + 2000, do: 'enter', el: 'sav12-on' },
					{ at: polymorph.start(1) + 2100, do: 'enter', el: 'hv-12' },
					{ at: polymorph.start(1) + 2300, do: 'enter', el: 'lb-poly' },
					{ at: polymorph.start(1) + 2600, do: 'type', el: 'out-poly', dur: 800 },
					{ at: polymorph.start(1) + 3300, do: 'pulse', el: 'lb-poly' },
				),
			},
		},

		// ─── Scene 6. The four pillars together ─────────────────────────────
		{
			id: 'recap',
			chapter: 'recap',
			scene: 'journey',
			title: { es: 'Estado, comportamiento y los cuatro pilares', en: 'State, behavior and the four pillars' },
			subtitles: recap.list,
			motion: {
				cues: seq(
					...clear(0, 'p', 'hl', 'o-scan'),
					shot(200, 'shot-all', 3000),
					{ at: 800, do: 'flow', el: 'rt-dep' },
					{ at: 800, do: 'flow', el: 'fl-ext' },
					{ at: 800, do: 'flow', el: 'fl-ref-sav' },
					{ at: 800, do: 'flow', el: 'rt-poly' },
					{ at: 1400, do: 'pulse', el: 'pil-1' },
					{ at: 2000, do: 'pulse', el: 'pil-2' },
					{ at: recap.start(1) + 200, do: 'pulse', el: 'pil-3' },
					{ at: recap.start(1) + 900, do: 'pulse', el: 'pil-4' },
					{ at: recap.start(1) + 1800, do: 'enter', el: 'r-pillars' },
					{ at: recap.start(2) + 400, do: 'pulse', el: 'obj-acc' },
					{ at: recap.start(2) + 1200, do: 'pulse', el: 'obj-sav' },
					{ at: recap.start(2) + 2000, do: 'pulse', el: 'r-pillars' },
				),
			},
		},
	],
};
