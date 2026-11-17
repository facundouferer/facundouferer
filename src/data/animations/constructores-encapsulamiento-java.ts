import type { AnimationScript, MotionCue, Subtitle } from './types';

// "The journey of a private field: constructors and encapsulation": a short film
// (about two minutes) for the Java lesson "Constructores, Modificadores de Acceso y
// Getters/Setters" (lesson 9, slug `07-constructores-y-encapsulamiento`). It plays on
// a single persistent canvas (`data-scene="journey"` in
// `src/components/animaciones/constructores-encapsulamiento-java.astro`): an isometric
// system where `main` is a platform, `Cuenta` is the class below it, a light blue
// particle is the execution flow, and a violet object on the Heap guards its private
// `saldo` field. Magenta marks blocked direct access (`c.saldo = -500`) and rejected
// invalid updates (`depositar(-500)`).

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
const seq = (...cues: MotionCue[]): MotionCue[] => cues.map((cue, index) => ({ cue, index })).sort((a, b) => a.cue.at - b.cue.at || a.index - b.index).map((entry) => entry.cue);

/** Camera cue that frames one of the `shot-*` anchors exactly (they carry their own zoom). */
const shot = (at: number, to: string, dur: number): MotionCue => ({ at, do: 'camera', to: [to], dur, pad: 0 });

/** Types the editor lines `from`..`to` of one page (`ea` or `eb`), one after the other. */
const typeLines = (at: number, page: 'ea' | 'eb', from: number, to: number, gap: number): MotionCue[] =>
	Array.from({ length: to - from + 1 }, (_, index) => ({ at: at + index * gap, do: 'type' as const, el: `${page}-${from + index}`, dur: Math.max(200, gap) }));

/** Fades several elements out at the same moment. */
const clear = (at: number, ...els: string[]): MotionCue[] => els.map((el) => ({ at, do: 'exit' as const, el, dur: 400 }));

// ─── Captions ───────────────────────────────────────────────────────────────
const build = timed(
	say('La clase `Cuenta` declara su atributo `private double saldo` y su constructor.', 'The `Account` class declares its `private double balance` field and its constructor.'),
	say('El constructor se llama igual que la clase y no tiene tipo de retorno.', 'The constructor has the exact same name as the class and no return type.'),
);
const construct = timed(
	say('La partícula celeste es el flujo de ejecución. En `main`, ejecuta `new Cuenta(1000)`.', 'The light blue particle is the execution flow. In `main`, it runs `new Account(1000)`.'),
	say('Dentro del constructor, `this.saldo = saldo` distingue el atributo del parámetro.', 'Inside the constructor, `this.balance = balance` tells the field apart from the parameter.'),
	say('El objeto nace en el Heap con un estado inicial válido: `saldo = 1000`.', 'The object is born on the Heap with a valid initial state: `balance = 1000`.'),
);
const block = timed(
	say('¿Qué pasa si `main` intenta un acceso directo con `c.saldo = -500`?', 'What happens if `main` tries direct access with `c.balance = -500`?'),
	say('El atributo es `private`: el compilador bloquea el paso antes de ejecutar.', 'The field is `private`: the compiler blocks the access before running.'),
);
const getter = timed(
	say('Para consultar el valor sin exponer el campo, la clase ofrece `getSaldo()`.', 'To read the value without exposing the field, the class offers `getBalance()`.'),
	say('El getter ofrece acceso de solo lectura: devuelve `1000.0` sin abrir la escritura.', 'The getter provides read-only access: it returns `1000.0` without opening write access.'),
);
const reject = timed(
	say('Para cambiar el estado, `main` llama a `c.depositar(-500)` con un monto inválido.', 'To change the state, `main` calls `c.deposit(-500)` with an invalid amount.'),
	say('La guarda `if (monto <= 0)` se cumple y el método corta con `return false`.', 'The guard `if (amount <= 0)` is true and the method exits early with `return false`.'),
	say('El intento se rechaza en la puerta y `this.saldo` queda intacto en `1000`.', 'The attempt is rejected at the door and `this.balance` stays intact at `1000`.'),
);
const accept = timed(
	say('Ahora `main` llama a `c.depositar(200)` con un valor positivo válido.', 'Now `main` calls `c.deposit(200)` with a valid positive value.'),
	say('Supera el `if`, suma en `this.saldo += monto` y confirma con `return true`.', 'It passes the `if`, adds in `this.balance += amount`, and confirms with `return true`.'),
);
const overload = timed(
	say('Una clase puede sobrecargar su constructor con distintas listas de parámetros.', 'A class can overload its constructor with different parameter lists.'),
	say('El constructor corto usa `this(titular, 0)` en su primera línea para delegar.', 'The short constructor uses `this(owner, 0)` on its first line to delegate.'),
	say('Así un único constructor canónico concentra la inicialización sin repetir reglas.', 'That way a single canonical constructor concentrates initialization without repeating rules.'),
);
const recap = timed(
	say('El constructor garantiza que todo objeto nace válido desde su primera línea.', 'The constructor guarantees that every object is born valid from its very first line.'),
	say('`private` bloquea el acceso directo y los métodos validan cada cambio.', '`private` blocks direct access and methods validate every state change.'),
	say('Encapsular hace que cada objeto sea dueño de su propio estado.', 'Encapsulation makes each object the sole owner of its own state.'),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'constructor', label: { es: 'El constructor y this', en: 'The constructor and this' } },
		{ id: 'private', label: { es: 'La frontera private', en: 'The private boundary' } },
		{ id: 'getter', label: { es: 'Lectura con getSaldo()', en: 'Reading with getBalance()' } },
		{ id: 'reject', label: { es: 'El filtro rechaza el dato', en: 'The guard rejects invalid data' } },
		{ id: 'accept', label: { es: 'Actualización y sobrecarga', en: 'Valid update and overloading' } },
		{ id: 'recap', label: { es: 'Dueño de su estado', en: 'Owner of its state' } },
	],
	steps: [
		// ─── Scene 1. The constructor and this ──────────────────────────────
		{
			id: 'build',
			chapter: 'constructor',
			scene: 'journey',
			title: { es: 'La clase Cuenta y su frontera', en: 'The Account class and its boundary' },
			subtitles: build.list,
			motion: {
				cues: seq(
					shot(0, 'shot-class', 4500),
					{ at: 200, do: 'enter', el: 'floor-acc' },
					...typeLines(300, 'ea', 1, 7, 260),
					{ at: 1100, do: 'enter', el: 'lb-priv' },
					{ at: 1800, do: 'pulse', el: 'lb-priv' },
					{ at: 2200, do: 'enter', el: 'lb-ctor' },
					...typeLines(build.start(1) + 100, 'ea', 8, 13, 240),
					{ at: build.start(1) + 800, do: 'enter', el: 'lb-get' },
					{ at: build.start(1) + 1500, do: 'enter', el: 'lb-dep' },
					{ at: build.start(1) + 2100, do: 'pulse', el: 'lb-ctor' },
					...typeLines(build.start(1) + 2300, 'ea', 14, 20, 200),
				),
			},
		},
		{
			id: 'construct',
			chapter: 'constructor',
			scene: 'journey',
			title: { es: 'new Cuenta(1000) e inicialización con this', en: 'new Account(1000) and initialization with this' },
			subtitles: construct.list,
			motion: {
				cues: seq(
					shot(0, 'shot-main', 2200),
					{ at: 100, do: 'enter', el: 'floor-main' },
					{ at: 250, do: 'enter', el: 'm-entry' },
					{ at: 400, do: 'enter', el: 'm-new' },
					{ at: 550, do: 'enter', el: 'm-get' },
					{ at: 700, do: 'enter', el: 'm-bad' },
					{ at: 850, do: 'enter', el: 'm-ok' },
					{ at: 950, do: 'enter', el: 'm-end' },
					{ at: 1000, do: 'draw', el: 'tr-main', dur: 900 },
					{ at: 1100, do: 'enter', el: 'heap' },
					{ at: 1400, do: 'enter', el: 'hl' },
					{ at: 1500, do: 'enter', el: 'p' },
					{ at: 2000, do: 'draw', el: 'fl-0', dur: 600 },
					{ at: 2100, do: 'move', el: 'p', to: 'a-new', dur: 900 },
					{ at: 2100, do: 'move', el: 'hl', to: 'ln-15', dur: 600 },
					{ at: 3000, do: 'enter', el: 'new-on' },
					{ at: 3000, do: 'pulse', el: 'm-new' },
					shot(construct.start(1), 'shot-ctor', 2000),
					{ at: construct.start(1) + 200, do: 'draw', el: 'rt-ctor', dur: 900 },
					{ at: construct.start(1) + 300, do: 'move', el: 'p', to: 'a-c5', dur: 1100 },
					{ at: construct.start(1) + 300, do: 'move', el: 'hl', to: 'ln-5', dur: 700 },
					{ at: construct.start(1) + 1400, do: 'enter', el: 'c5-on' },
					{ at: construct.start(1) + 1500, do: 'enter', el: 'hv-5' },
					{ at: construct.start(1) + 1800, do: 'enter', el: 'this-chip' },
					{ at: construct.start(1) + 2500, do: 'pulse', el: 'this-chip' },
					shot(construct.start(2), 'shot-obj', 2000),
					{ at: construct.start(2) + 300, do: 'draw', el: 'fl-init', dur: 900 },
					{ at: construct.start(2) + 400, do: 'move', el: 'p', to: 'a-obj', dur: 1000 },
					{ at: construct.start(2) + 1200, do: 'enter', el: 'obj', dur: 700 },
					{ at: construct.start(2) + 1300, do: 'enter', el: 'val-1000' },
					{ at: construct.start(2) + 1800, do: 'enter', el: 'm-var' },
					{ at: construct.start(2) + 2100, do: 'enter', el: 'lb-var' },
					{ at: construct.start(2) + 2400, do: 'draw', el: 'ref', dur: 900 },
					{ at: construct.start(2) + 3100, do: 'pulse', el: 'obj' },
				),
			},
		},

		// ─── Scene 2. The private boundary ──────────────────────────────────
		{
			id: 'block',
			chapter: 'private',
			scene: 'journey',
			title: { es: 'private bloquea el acceso directo', en: 'private blocks direct access' },
			subtitles: block.list,
			motion: {
				cues: seq(
					shot(0, 'shot-priv', 2000),
					...clear(100, 'c5-on', 'hv-5', 'this-chip', 'rt-ctor', 'fl-init'),
					{ at: 300, do: 'move', el: 'p', to: 'a-new', dur: 700 },
					{ at: 500, do: 'enter', el: 'hx-2' },
					{ at: 900, do: 'draw', el: 'rt-priv', dur: 900 },
					{ at: 1100, do: 'move', el: 'p', to: 'a-wall', dur: 800 },
					{ at: 1800, do: 'enter', el: 'priv-x' },
					{ at: 1900, do: 'enter', el: 'shield' },
					{ at: 2400, do: 'pulse', el: 'priv-x' },
					{ at: block.start(1) + 200, do: 'enter', el: 'err-priv' },
					{ at: block.start(1) + 1000, do: 'pulse', el: 'err-priv' },
					{ at: block.start(1) + 2200, do: 'pulse', el: 'shield' },
					{ at: block.start(1) + 3200, do: 'pulse', el: 'val-1000' },
				),
			},
		},

		// ─── Scene 3. Reading through a getter ──────────────────────────────
		{
			id: 'getter',
			chapter: 'getter',
			scene: 'journey',
			title: { es: 'Lectura controlada con getSaldo()', en: 'Controlled reading with getBalance()' },
			subtitles: getter.list,
			motion: {
				cues: seq(
					shot(0, 'shot-class', 2000),
					...clear(100, 'rt-priv', 'priv-x', 'err-priv', 'hx-2'),
					{ at: 300, do: 'draw', el: 'fl-1', dur: 600 },
					{ at: 400, do: 'move', el: 'p', to: 'a-get', dur: 800 },
					{ at: 400, do: 'move', el: 'hl', to: 'ln-16', dur: 600 },
					{ at: 1200, do: 'enter', el: 'get-on' },
					{ at: 1200, do: 'pulse', el: 'm-get' },
					{ at: 1700, do: 'draw', el: 'rt-get', dur: 900 },
					{ at: 1800, do: 'move', el: 'p', to: 'a-g7', dur: 1100 },
					{ at: 1800, do: 'move', el: 'hl', to: 'ln-7', dur: 700 },
					{ at: 2900, do: 'enter', el: 'g7-on' },
					{ at: 3000, do: 'enter', el: 'hc-7' },
					{ at: getter.start(1) + 200, do: 'draw', el: 'fl-read', dur: 800 },
					{ at: getter.start(1) + 1000, do: 'enter', el: 'ro-chip' },
					{ at: getter.start(1) + 1500, do: 'type', el: 'out-1', dur: 700 },
					{ at: getter.start(1) + 2600, do: 'pulse', el: 'ro-chip' },
				),
			},
		},

		// ─── Scene 4. Validating in a mutator (reject) ──────────────────────
		{
			id: 'reject',
			chapter: 'reject',
			scene: 'journey',
			title: { es: 'depositar(-500): la guarda rechaza el cambio', en: 'deposit(-500): the guard rejects the change' },
			subtitles: reject.list,
			motion: {
				cues: seq(
					shot(0, 'shot-dep', 2000),
					...clear(100, 'g7-on', 'hc-7', 'rt-get', 'fl-read', 'ro-chip'),
					{ at: 300, do: 'draw', el: 'fl-2', dur: 600 },
					{ at: 400, do: 'move', el: 'p', to: 'a-bad', dur: 800 },
					{ at: 400, do: 'move', el: 'hl', to: 'ln-17', dur: 600 },
					{ at: 1200, do: 'enter', el: 'bad-on' },
					{ at: 1200, do: 'pulse', el: 'm-bad' },
					{ at: 1800, do: 'draw', el: 'rt-bad', dur: 900 },
					{ at: 1900, do: 'move', el: 'p', to: 'a-d9', dur: 1100 },
					{ at: 1900, do: 'move', el: 'hl', to: 'ln-9', dur: 700 },
					{ at: reject.start(1) + 200, do: 'enter', el: 'd9-x' },
					{ at: reject.start(1) + 300, do: 'enter', el: 'hx-9' },
					{ at: reject.start(1) + 700, do: 'enter', el: 'rej-chip' },
					{ at: reject.start(1) + 1600, do: 'pulse', el: 'rej-chip' },
					shot(reject.start(2), 'shot-obj', 1800),
					{ at: reject.start(2) + 400, do: 'pulse', el: 'shield' },
					{ at: reject.start(2) + 1200, do: 'pulse', el: 'val-1000' },
					{ at: reject.start(2) + 2200, do: 'pulse', el: 'obj' },
				),
			},
		},

		// ─── Scene 5. Valid update and constructor overloading ──────────────
		{
			id: 'accept',
			chapter: 'accept',
			scene: 'journey',
			title: { es: 'depositar(200): el estado se actualiza', en: 'deposit(200): state updates safely' },
			subtitles: accept.list,
			motion: {
				cues: seq(
					shot(0, 'shot-dep', 2000),
					...clear(100, 'd9-x', 'hx-9', 'rej-chip', 'rt-bad'),
					{ at: 300, do: 'draw', el: 'fl-3', dur: 600 },
					{ at: 400, do: 'move', el: 'p', to: 'a-ok', dur: 800 },
					{ at: 400, do: 'move', el: 'hl', to: 'ln-18', dur: 600 },
					{ at: 1200, do: 'enter', el: 'ok-on' },
					{ at: 1200, do: 'pulse', el: 'm-ok' },
					{ at: 1700, do: 'draw', el: 'rt-ok', dur: 900 },
					{ at: 1800, do: 'move', el: 'p', to: 'a-d9', dur: 1000 },
					{ at: 1800, do: 'move', el: 'hl', to: 'ln-9', dur: 600 },
					{ at: 2800, do: 'enter', el: 'd9-on' },
					{ at: accept.start(1) + 100, do: 'move', el: 'p', to: 'a-d10', dur: 800 },
					{ at: accept.start(1) + 100, do: 'move', el: 'hl', to: 'ln-10', dur: 600 },
					{ at: accept.start(1) + 900, do: 'enter', el: 'd10-on' },
					{ at: accept.start(1) + 1000, do: 'enter', el: 'hv-10' },
					{ at: accept.start(1) + 1200, do: 'draw', el: 'fl-upd', dur: 800 },
					{ at: accept.start(1) + 1300, do: 'move', el: 'p', to: 'a-obj', dur: 900 },
					{ at: accept.start(1) + 2100, do: 'exit', el: 'val-1000', dur: 300 },
					{ at: accept.start(1) + 2200, do: 'enter', el: 'val-1200' },
					{ at: accept.start(1) + 2300, do: 'enter', el: 'ok-chip' },
					{ at: accept.start(1) + 2700, do: 'move', el: 'hl', to: 'ln-19', dur: 600 },
					{ at: accept.start(1) + 3100, do: 'type', el: 'out-2', dur: 700 },
				),
			},
		},
		{
			id: 'overload',
			chapter: 'accept',
			scene: 'journey',
			title: { es: 'Sobrecarga y delegación con this(...)', en: 'Overloading and delegation with this(...)' },
			subtitles: overload.list,
			motion: {
				cues: seq(
					...clear(0, 'p', 'hl', 'floor-acc', 'd9-on', 'd10-on', 'hv-10', 'rt-ok', 'fl-upd', 'ok-chip', 'val-1200', 'shield', 'obj', 'm-var', 'lb-var', 'ref'),
					...clear(0, 'lb-priv', 'lb-ctor', 'lb-get', 'lb-dep', 'out-1', 'out-2', 'new-on', 'get-on', 'bad-on', 'ok-on', 'fl-0', 'fl-1', 'fl-2', 'fl-3', 'heap', 'ea'),
					shot(0, 'shot-over', 2200),
					{ at: 500, do: 'enter', el: 'eb' },
					...typeLines(600, 'eb', 1, 20, 130),
					{ at: 800, do: 'enter', el: 'floor-over' },
					{ at: 1600, do: 'enter', el: 'sg-short' },
					{ at: 2200, do: 'enter', el: 'sg-canon' },
					{ at: overload.start(1) + 200, do: 'move', el: 'p', to: 'a-new', dur: 1 },
					{ at: overload.start(1) + 200, do: 'move', el: 'hl', to: 'ln-16', dur: 1 },
					{ at: overload.start(1) + 350, do: 'enter', el: 'p' },
					{ at: overload.start(1) + 350, do: 'enter', el: 'hl' },
					{ at: overload.start(1) + 400, do: 'enter', el: 'new-on' },
					{ at: overload.start(1) + 800, do: 'draw', el: 'rt-over', dur: 800 },
					{ at: overload.start(1) + 900, do: 'move', el: 'p', to: 'a-o5', dur: 1000 },
					{ at: overload.start(1) + 900, do: 'move', el: 'hl', to: 'ln-5', dur: 600 },
					{ at: overload.start(1) + 1900, do: 'enter', el: 'o5-on' },
					{ at: overload.start(1) + 2200, do: 'enter', el: 'del-chip' },
					{ at: overload.start(2) + 200, do: 'draw', el: 'fl-del', dur: 800 },
					{ at: overload.start(2) + 300, do: 'move', el: 'p', to: 'a-o9', dur: 1000 },
					{ at: overload.start(2) + 300, do: 'move', el: 'hl', to: 'ln-9', dur: 600 },
					{ at: overload.start(2) + 1300, do: 'enter', el: 'o9-on' },
					{ at: overload.start(2) + 1400, do: 'enter', el: 'hv-b9' },
					{ at: overload.start(2) + 2200, do: 'type', el: 'out-b', dur: 700 },
				),
			},
		},

		// ─── Scene 6. Recap ─────────────────────────────────────────────────
		{
			id: 'recap',
			chapter: 'recap',
			scene: 'journey',
			title: { es: 'El objeto protege su invariante', en: 'The object protects its invariant' },
			subtitles: recap.list,
			motion: {
				cues: seq(
					...clear(0, 'p', 'hl', 'floor-over', 'o5-on', 'o9-on', 'sg-short', 'sg-canon', 'del-chip', 'rt-over', 'fl-del', 'hv-b9', 'eb', 'out-b', 'new-on'),
					shot(200, 'shot-all', 3000),
					{ at: 600, do: 'enter', el: 'ea' },
					{ at: 700, do: 'enter', el: 'floor-acc' },
					{ at: 800, do: 'enter', el: 'heap' },
					{ at: 900, do: 'enter', el: 'obj' },
					{ at: 950, do: 'enter', el: 'shield' },
					{ at: 1000, do: 'enter', el: 'val-1200' },
					{ at: 1050, do: 'enter', el: 'm-var' },
					{ at: 1100, do: 'enter', el: 'ref' },
					{ at: 1150, do: 'enter', el: 'lb-var' },
					{ at: 1200, do: 'enter', el: 'lb-priv' },
					{ at: 1250, do: 'enter', el: 'lb-ctor' },
					{ at: 1300, do: 'enter', el: 'lb-get' },
					{ at: 1350, do: 'enter', el: 'lb-dep' },
					{ at: 1400, do: 'enter', el: 'hv-10' },
					{ at: 1500, do: 'enter', el: 'out-1' },
					{ at: 1600, do: 'enter', el: 'out-2' },
					{ at: 1700, do: 'enter', el: 'fl-0' },
					{ at: 1750, do: 'enter', el: 'fl-1' },
					{ at: 1800, do: 'enter', el: 'fl-2' },
					{ at: 1850, do: 'enter', el: 'fl-3' },
					{ at: 1900, do: 'enter', el: 'rt-ok' },
					{ at: 1950, do: 'enter', el: 'fl-upd' },
					{ at: 2400, do: 'flow', el: 'rt-ok' },
					{ at: 2400, do: 'flow', el: 'fl-upd' },
					{ at: recap.start(1) + 200, do: 'enter', el: 'r-ctor' },
					{ at: recap.start(1) + 800, do: 'pulse', el: 'lb-ctor' },
					{ at: recap.start(1) + 1800, do: 'enter', el: 'r-encap' },
					{ at: recap.start(1) + 2400, do: 'pulse', el: 'shield' },
					{ at: recap.start(2) + 800, do: 'pulse', el: 'obj' },
					{ at: recap.start(2) + 2200, do: 'pulse', el: 'val-1200' },
				),
			},
		},
	],
};
