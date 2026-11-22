import type { AnimationScript, MotionCue, Subtitle } from './types';

// "A type that hides its fields": a short film (about two minutes) for the C lesson
// "Encapsulación y tipos opacos" (order: 42). It plays on a single persistent canvas
// (`data-scene="journey"` in `src/components/animaciones/tipo-opaco-c.astro`): the
// editor on the left shows the lesson's files in turn (the header, the `main.c` that
// cannot look inside, `cuenta.c` in two pages and the real `main.c`), and on the right
// three places side by side (`main.c`, `cuenta.h`, `cuenta.c`) with one module per
// executed line in front of each. The header shows a sealed box (the type, with no
// fields); the object only opens inside `cuenta.c`. Light blue marks the flow and the
// pointer, magenta what the compiler refuses or a mistake, violet what protects (the
// seal, the invariant, the key of ownership, `static`).

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
const seq = (...cues: (MotionCue | MotionCue[])[]): MotionCue[] =>
	cues
		.flat()
		.map((cue, index) => ({ cue, index }))
		.sort((a, b) => a.cue.at - b.cue.at || a.index - b.index)
		.map((entry) => entry.cue);

/** Camera cue that frames one of the `shot-*` anchors exactly (they carry their own zoom). */
const shot = (at: number, to: string, dur: number): MotionCue => ({ at, do: 'camera', to: [to], dur, pad: 0 });

/** Fades several elements out at the same moment. */
const clear = (at: number, ...els: string[]): MotionCue[] => els.map((el) => ({ at, do: 'exit' as const, el, dur: 400 }));

/**
 * Runs line `line` of pane `pane` (h, b, a, z or m): slides the bar to it, sends the
 * execution particle to its module and builds that module. Its lit state follows.
 */
const run = (at: number, pane: string, line: number, lit = 700): MotionCue[] => [
	{ at, do: 'move', el: 'hl', to: `ln-${pane}-${line}`, dur: 500 },
	{ at: at + 100, do: 'enter', el: `m-${pane}${line}` },
	{ at: at + 100, do: 'move', el: 'p', to: `a-m-${pane}${line}`, dur: 700 },
	{ at: at + lit, do: 'enter', el: `on-${pane}${line}` },
];

/** Swaps the file shown in the editor: the bar hides, the pane changes and the bar returns on `first`. */
const swap = (at: number, from: string, to: string, first: string): MotionCue[] => [
	{ at, do: 'exit', el: 'hl', dur: 300 },
	{ at, do: 'exit', el: from, dur: 400 },
	{ at: at + 400, do: 'enter', el: to },
	{ at: at + 450, do: 'move', el: 'hl', to: first, dur: 1 },
	{ at: at + 600, do: 'enter', el: 'hl' },
];

/** Types the rows of one console block, one after the other. */
const output = (at: number, group: string, from: number, to: number, gap = 320): MotionCue[] =>
	Array.from({ length: to - from + 1 }, (_, index) => ({
		at: at + index * gap,
		do: 'type' as const,
		el: `o-${group}-${from + index}`,
		dur: Math.max(250, gap),
	}));

// ─── Captions ───────────────────────────────────────────────────────────────
const seal = timed(
	say(
		'`typedef struct Cuenta Cuenta;` declara el tipo sin sus campos.',
		'`typedef struct Account Account;` declares the type without its fields.',
	),
	say(
		'Es un tipo incompleto: afuera solo se ve una caja sellada.',
		'It is an incomplete type: from outside, only a sealed box.',
	),
	say(
		'El `.h` expone el nombre y las seis funciones públicas.',
		'The `.h` exposes the name and the six public functions.',
	),
);
const refuse = timed(
	say(
		'`main.c` solo conoce `Cuenta *`: guarda el puntero y llama a las funciones.',
		'`main.c` only knows `Account *`: it keeps the pointer and calls the functions.',
	),
	say(
		'`Cuenta copia;` y `c->saldo_centavos`: el compilador los rechaza.',
		'`Account copy;` and `a->balance_cents`: the compiler rejects them.',
	),
	say(
		'Responde `incomplete type`: no puede copiarlo ni abrirlo.',
		'It answers `incomplete type`: it cannot copy or open it.',
	),
);
const open = timed(
	say(
		'La definición completa de `struct Cuenta` vive solo en `cuenta.c`.',
		'The complete definition of `struct Account` lives only in `account.c`.',
	),
	say(
		'Ahí la caja se abre: `titular` y `saldo_centavos`; el `.h` nunca los ve.',
		'There the box opens: `owner` and `balance_cents`; the `.h` never sees them.',
	),
);
const create = timed(
	say(
		'`cuenta_crear` reserva la caja con `malloc` y copia el titular en su propio bloque.',
		'`account_create` allocates the box with `malloc` and copies the owner into its own block.',
	),
	say(
		'Devuelve la llave: el llamador es dueño y libera con `cuenta_destruir`.',
		'It hands back the key: the caller owns it and frees it with `account_destroy`.',
	),
);
const hidden = timed(
	say(
		'`monto_valido` y `copiar_texto` son `static`: solo existen en `cuenta.c`.',
		'`valid_amount` and `copy_text` are `static`: they only exist in `account.c`.',
	),
	say(
		'No están en `cuenta.h`: `main.c` no puede llamarlas.',
		'They are not in `account.h`: `main.c` cannot call them.',
	),
);
const guard = timed(
	say(
		'`cuenta_depositar(cuenta, 2550)` pasa la comprobación: el saldo sube a 12550.',
		'`account_deposit(account, 2550)` passes the check: the balance rises to 12550.',
	),
	say(
		'`cuenta_extraer(cuenta, 50000)` supera el saldo: devuelve `false` y no cambia nada.',
		'`account_withdraw(account, 50000)` exceeds the balance: returns `false`, nothing changes.',
	),
	say(
		'Así `saldo_centavos >= 0` se revisa en un solo archivo.',
		'So `balance_cents >= 0` is checked in one file.',
	),
);
const destroy = timed(
	say(
		'`main.c` devuelve la llave a `cuenta_destruir`.',
		'`main.c` hands the key back to `account_destroy`.',
	),
	say(
		'Libera primero el titular y después la caja, en orden inverso.',
		'It frees the owner first and then the box, in reverse order.',
	),
	say(
		'Con `free(cuenta)` desde `main.c` quedaría una fuga.',
		'With `free(account)` from `main.c` it would leak.',
	),
);
const wrap = timed(
	say(
		'Desde `main.c` solo se ven funciones, nunca campos.',
		'From `main.c` you only see functions, never fields.',
	),
	say(
		'Un tipo opaco oculta los campos y deja las reglas en un solo archivo.',
		'An opaque type hides the fields and keeps the rules in a single file.',
	),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'seal', label: { es: 'El encabezado', en: 'The header' } },
		{ id: 'refuse', label: { es: 'El compilador lo impide', en: 'The compiler refuses' } },
		{ id: 'inside', label: { es: 'Dentro de cuenta.c', en: 'Inside account.c' } },
		{ id: 'helpers', label: { es: 'static', en: 'static' } },
		{ id: 'guard', label: { es: 'El invariante', en: 'The invariant' } },
		{ id: 'owner', label: { es: 'La propiedad', en: 'Ownership' } },
	],
	steps: [
		// ─── Scene 1. The header shows a sealed box ─────────────────────────
		{
			id: 'seal',
			chapter: 'seal',
			scene: 'journey',
			title: { es: 'El encabezado muestra una caja sellada', en: 'The header shows a sealed box' },
			subtitles: seal.list,
			motion: {
				cues: seq(
					shot(0, 'shot-h', 2800),
					{ at: 200, do: 'enter', el: 'z-h' },
					{ at: 400, do: 'enter', el: 'hl' },
					{ at: 500, do: 'enter', el: 'p' },
					run(600, 'h', 6),
					{ at: 1000, do: 'enter', el: 'h-on' },
					{ at: 1300, do: 'enter', el: 'sbox' },
					{ at: 1900, do: 'enter', el: 'lk' },
					{ at: 2600, do: 'pulse', el: 'sbox' },
					{ at: seal.start(1) + 300, do: 'enter', el: 'lb-nofields' },
					{ at: seal.start(1) + 900, do: 'pulse', el: 'sbox' },
					{ at: seal.start(1) + 2400, do: 'pulse', el: 'lb-nofields' },
					run(seal.start(2), 'h', 9),
					run(seal.start(2) + 450, 'h', 11),
					run(seal.start(2) + 900, 'h', 12),
					run(seal.start(2) + 1350, 'h', 13),
					run(seal.start(2) + 1800, 'h', 14),
					run(seal.start(2) + 2250, 'h', 15),
					{ at: seal.start(2) + 600, do: 'enter', el: 'lb-api' },
					{ at: seal.start(2) + 2900, do: 'pulse', el: 'z-h' },
				),
			},
		},

		// ─── Scene 2. main.c cannot look inside ─────────────────────────────
		{
			id: 'refuse',
			chapter: 'refuse',
			scene: 'journey',
			title: { es: 'main.c no puede mirar adentro', en: 'main.c cannot look inside' },
			subtitles: refuse.list,
			motion: {
				cues: seq(
					clear(0, 'on-h6', 'on-h9', 'on-h11', 'on-h12', 'on-h13', 'on-h14', 'on-h15', 'lb-nofields', 'lb-api', 'h-on'),
					shot(0, 'shot-mh', 2400),
					swap(0, 'pane-h', 'pane-b', 'ln-b-5'),
					{ at: 300, do: 'enter', el: 'z-main' },
					run(900, 'b', 5),
					{ at: 1500, do: 'enter', el: 'ptr' },
					{ at: 1900, do: 'draw', el: 'fl-ptr', dur: 1000 },
					{ at: 2900, do: 'flow', el: 'fl-ptr' },
					run(refuse.start(1), 'b', 4),
					{ at: refuse.start(1) + 700, do: 'enter', el: 'cp' },
					{ at: refuse.start(1) + 800, do: 'enter', el: 'xm-b4' },
					{ at: refuse.start(1) + 1000, do: 'enter', el: 'x-cp' },
					{ at: refuse.start(1) + 1300, do: 'pulse', el: 'cp' },
					{ at: refuse.start(1) + 2100, do: 'exit', el: 'cp', dur: 400 },
					{ at: refuse.start(1) + 2100, do: 'exit', el: 'x-cp', dur: 400 },
					run(refuse.start(1) + 2300, 'b', 6),
					{ at: refuse.start(1) + 2900, do: 'enter', el: 'xm-b6' },
					{ at: refuse.start(1) + 3000, do: 'draw', el: 'fl-poke', dur: 900 },
					{ at: refuse.start(1) + 3900, do: 'enter', el: 'x-poke' },
					{ at: refuse.start(1) + 4000, do: 'pulse', el: 'sbox' },
					{ at: refuse.start(2) + 200, do: 'enter', el: 'lb-incomplete' },
					output(refuse.start(2) + 600, 'bad', 1, 6, 300),
					{ at: refuse.start(2) + 2600, do: 'pulse', el: 'lb-incomplete' },
				),
			},
		},

		// ─── Scene 3. Inside cuenta.c the box opens ─────────────────────────
		{
			id: 'open',
			chapter: 'inside',
			scene: 'journey',
			title: { es: 'Adentro de cuenta.c la caja se abre', en: 'Inside account.c the box opens' },
			subtitles: open.list,
			motion: {
				cues: seq(
					clear(0, 'on-b4', 'on-b5', 'on-b6', 'xm-b4', 'xm-b6', 'fl-poke', 'x-poke', 'lb-incomplete', 'out-bad'),
					shot(0, 'shot-c', 2600),
					swap(0, 'pane-b', 'pane-a', 'ln-a-4'),
					{ at: 300, do: 'enter', el: 'z-c' },
					run(900, 'a', 4),
					{ at: 1400, do: 'enter', el: 'c-on' },
					{ at: open.start(1) + 300, do: 'enter', el: 'fd-titular' },
					{ at: open.start(1) + 700, do: 'enter', el: 'fd-saldo' },
					{ at: open.start(1) + 1500, do: 'pulse', el: 'fd-titular' },
					{ at: open.start(1) + 1900, do: 'pulse', el: 'fd-saldo' },
					{ at: open.start(1) + 2500, do: 'enter', el: 'lb-hidden' },
					{ at: open.start(1) + 3300, do: 'pulse', el: 'z-c' },
				),
			},
		},

		// ─── Scene 4. cuenta_crear allocates the box and hands over the key ──
		{
			id: 'create',
			chapter: 'inside',
			scene: 'journey',
			title: { es: 'cuenta_crear reserva y entrega la caja', en: 'account_create allocates and hands over the box' },
			subtitles: create.list,
			motion: {
				cues: seq(
					clear(0, 'on-a4', 'lb-hidden'),
					shot(0, 'shot-c', 1200),
					run(300, 'a', 15),
					{ at: 800, do: 'enter', el: 'obox' },
					{ at: 1500, do: 'pulse', el: 'obox' },
					run(1500, 'a', 16),
					run(2700, 'a', 17),
					{ at: 3300, do: 'enter', el: 'blk-name' },
					{ at: 3400, do: 'draw', el: 'ln-name', dur: 700 },
					{ at: 3600, do: 'exit', el: 'fd-titular', dur: 300 },
					{ at: 3700, do: 'enter', el: 'fv-titular' },
					run(4200, 'a', 19),
					{ at: 5000, do: 'exit', el: 'fd-saldo', dur: 300 },
					{ at: 5100, do: 'enter', el: 'fv-s1' },
					clear(create.start(1), 'on-a15', 'on-a16', 'on-a17', 'on-a19', 'fl-ptr'),
					shot(create.start(1), 'shot-all', 2200),
					{ at: create.start(1) + 200, do: 'enter', el: 'key' },
					{ at: create.start(1) + 500, do: 'move', el: 'key', to: 'a-key-main', dur: 1500 },
					{ at: create.start(1) + 800, do: 'draw', el: 'fl-ptr2', dur: 1100 },
					{ at: create.start(1) + 1900, do: 'flow', el: 'fl-ptr2' },
					{ at: create.start(1) + 2100, do: 'enter', el: 'lb-own' },
					{ at: create.start(1) + 2600, do: 'pulse', el: 'key' },
				),
			},
		},

		// ─── Scene 5. static helpers nobody else sees ───────────────────────
		{
			id: 'static',
			chapter: 'helpers',
			scene: 'journey',
			title: { es: 'static: ayudantes que nadie más ve', en: 'static: helpers nobody else sees' },
			subtitles: hidden.list,
			motion: {
				cues: seq(
					shot(0, 'shot-c', 1800),
					run(300, 'a', 9),
					{ at: 700, do: 'enter', el: 'sroom' },
					{ at: 900, do: 'draw', el: 'fence', dur: 900 },
					{ at: 1400, do: 'enter', el: 'st-monto' },
					{ at: 1600, do: 'enter', el: 'lb-static' },
					run(2000, 'a', 10),
					{ at: 2600, do: 'enter', el: 'st-copia' },
					{ at: 3200, do: 'pulse', el: 'st-monto' },
					shot(hidden.start(1), 'shot-hs', 2400),
					{ at: hidden.start(1) + 800, do: 'pulse', el: 'st-copia' },
					{ at: hidden.start(1) + 1500, do: 'enter', el: 'lb-noh' },
					{ at: hidden.start(1) + 2800, do: 'pulse', el: 'lb-noh' },
				),
			},
		},

		// ─── Scene 6. The interface keeps the invariant ─────────────────────
		{
			id: 'guard',
			chapter: 'guard',
			scene: 'journey',
			title: { es: 'El invariante: el saldo nunca es negativo', en: 'The invariant: the balance is never negative' },
			subtitles: guard.list,
			motion: {
				cues: seq(
					clear(0, 'on-a9', 'on-a10', 'lb-noh', 'lb-static'),
					shot(0, 'shot-c', 2400),
					swap(0, 'pane-a', 'pane-z', 'ln-z-24'),
					{ at: 400, do: 'enter', el: 'gate' },
					{ at: 700, do: 'enter', el: 'lb-inv' },
					output(900, 'run', 1, 3, 400),
					{ at: 1000, do: 'enter', el: 'rq-dep' },
					{ at: 1500, do: 'move', el: 'rq-dep', to: 'a-gate', dur: 1300 },
					run(1700, 'z', 24),
					{ at: 2900, do: 'move', el: 'rq-dep', to: 'a-obox', dur: 900 },
					run(3100, 'z', 25),
					{ at: 3900, do: 'exit', el: 'rq-dep', dur: 300 },
					{ at: 3900, do: 'exit', el: 'fv-s1', dur: 300 },
					{ at: 4000, do: 'enter', el: 'fv-s2' },
					{ at: 4400, do: 'pulse', el: 'obox' },
					{ at: guard.start(1) + 100, do: 'enter', el: 'rq-ext' },
					{ at: guard.start(1) + 400, do: 'move', el: 'rq-ext', to: 'a-gate', dur: 1200 },
					run(guard.start(1) + 600, 'z', 30),
					{ at: guard.start(1) + 600, do: 'type', el: 'o-run-4', dur: 400 },
					{ at: guard.start(1) + 1800, do: 'enter', el: 'rj' },
					{ at: guard.start(1) + 1900, do: 'pulse', el: 'gate' },
					{ at: guard.start(1) + 2200, do: 'exit', el: 'rq-ext', dur: 400 },
					{ at: guard.start(1) + 2300, do: 'type', el: 'o-run-5', dur: 500 },
					{ at: guard.start(2) + 300, do: 'pulse', el: 'lb-inv' },
					{ at: guard.start(2) + 1100, do: 'pulse', el: 'gate' },
					{ at: guard.start(2) + 1900, do: 'pulse', el: 'obox' },
				),
			},
		},

		// ─── Scene 7. cuenta_destruir frees in reverse order ────────────────
		{
			id: 'destroy',
			chapter: 'owner',
			scene: 'journey',
			title: { es: 'cuenta_destruir libera en orden inverso', en: 'account_destroy frees in reverse order' },
			subtitles: destroy.list,
			motion: {
				cues: seq(
					clear(0, 'on-z24', 'on-z25', 'on-z30', 'rj', 'lb-own'),
					shot(0, 'shot-all', 2000),
					{ at: 300, do: 'move', el: 'key', to: 'a-key', dur: 1700 },
					{ at: 2000, do: 'pulse', el: 'key' },
					shot(1500, 'shot-c', 1800),
					run(destroy.start(1), 'z', 39),
					{ at: destroy.start(1) + 200, do: 'exit', el: 'ln-name', dur: 300 },
					{ at: destroy.start(1) + 400, do: 'exit', el: 'blk-name', dur: 400 },
					{ at: destroy.start(1) + 400, do: 'exit', el: 'fv-titular', dur: 400 },
					run(destroy.start(1) + 1500, 'z', 40),
					{ at: destroy.start(1) + 2300, do: 'exit', el: 'fv-s2', dur: 400 },
					{ at: destroy.start(1) + 2400, do: 'exit', el: 'obox', dur: 400 },
					{ at: destroy.start(1) + 2400, do: 'exit', el: 'key', dur: 400 },
					{ at: destroy.start(1) + 2400, do: 'exit', el: 'fl-ptr2', dur: 400 },
					{ at: destroy.start(1) + 2500, do: 'exit', el: 'c-on', dur: 400 },
					shot(destroy.start(2), 'shot-all', 2200),
					{ at: destroy.start(2) + 300, do: 'enter', el: 'lb-leak' },
					{ at: destroy.start(2) + 1100, do: 'pulse', el: 'lb-leak' },
				),
			},
		},

		// ─── Scene 8. The whole program, seen from main.c ───────────────────
		{
			id: 'wrap',
			chapter: 'owner',
			scene: 'journey',
			title: { es: 'Tipo opaco: lo que oculta y lo que ofrece', en: 'Opaque type: what it hides and what it offers' },
			subtitles: wrap.list,
			motion: {
				cues: seq(
					clear(0, 'on-z39', 'on-z40', 'lb-leak'),
					shot(0, 'shot-mh', 2000),
					swap(0, 'pane-z', 'pane-m', 'ln-m-5'),
					run(800, 'm', 5),
					run(1400, 'm', 10),
					run(2000, 'm', 11),
					run(2600, 'm', 14),
					{ at: 2800, do: 'type', el: 'o-run-6', dur: 700 },
					run(3200, 'm', 16),
					shot(wrap.start(1), 'shot-all', 3000),
					{ at: wrap.start(1) + 200, do: 'draw', el: 'fl-cycle', dur: 1500 },
					{ at: wrap.start(1) + 400, do: 'enter', el: 'main-on' },
					{ at: wrap.start(1) + 800, do: 'enter', el: 'h-on' },
					{ at: wrap.start(1) + 1200, do: 'enter', el: 'c-on' },
					{ at: wrap.start(1) + 1700, do: 'enter', el: 'r-wrap' },
					{ at: wrap.start(1) + 2000, do: 'flow', el: 'fl-cycle' },
					{ at: wrap.start(1) + 2700, do: 'pulse', el: 'r-wrap' },
					{ at: wrap.start(1) + 3200, do: 'pulse', el: 'z-h' },
				),
			},
		},
	],
};
