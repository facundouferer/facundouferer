import type { AnimationScript, MotionCue, Subtitle } from './types';

// "The journey of a contract": a short film (about two minutes) for the Java lesson
// "Clases abstractas, interfaces y organización del código". It plays on a single
// persistent canvas (`data-scene="journey"` in
// `src/components/animaciones/viaje-contrato-interfaz-java.astro`): an isometric
// tower with one level per type (the interface, the abstract class, the concrete
// class), a light blue object that is the contract travelling down, a magenta
// object that is the instance the compiler rejects, and a light blue particle that
// is the call the client code makes through the interface.
// The code is drawn inside the canvas (an editor that highlights the relevant
// line), so every step is a motion step and the cues below keep both halves in sync.

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

// ─── Captions ───────────────────────────────────────────────────────────────
const contract = timed(
	say('Una interfaz es un contrato: declara qué se debe hacer, nunca cómo.', 'An interface is a contract: it declares what must be done, never how.'),
	say('`Pagable` exige dos métodos, `pagar` y `estaDisponible`, sin cuerpo.', '`Payable` demands two methods, `pay` and `isAvailable`, with no body.'),
);
const mold = timed(
	say('El contrato baja a `MedioDePagoDigital`, una clase abstracta que lo firma.', 'The contract moves down to `DigitalPaymentMethod`, an abstract class that signs it.'),
	say('Aporta estado, el campo `activo`, y resuelve `estaDisponible` para todas sus subclases.', 'It adds state, the `active` field, and solves `isAvailable` for all its subclasses.'),
	say('Pero `pagar` sigue sin cuerpo: el molde queda incompleto.', 'But `pay` still has no body: the mold remains incomplete.'),
);
const reject = timed(
	say('¿Qué ocurre si `main` intenta crear un objeto de la clase abstracta?', 'What happens if `main` tries to create an object of the abstract class?'),
	say('El compilador lo rechaza: una clase abstracta no se puede instanciar.', 'The compiler rejects it: an abstract class cannot be instantiated.'),
	say('Ese objeto tendría un hueco: nadie sabría cómo ejecutar `pagar`.', 'That object would have a gap: nobody would know how to run `pay`.'),
);
const complete = timed(
	say('`MercadoPago` extiende el molde: hereda el estado y lo que ya estaba resuelto.', '`DigitalWallet` extends the mold: it inherits the state and what was already solved.'),
	say('Y está obligada a llenar el hueco: implementa `pagar` con su propio saldo.', 'And it is obliged to fill the gap: it implements `pay` with its own balance.'),
	say('Ya no quedan métodos sin cuerpo: el contrato está completo.', 'No method is left without a body: the contract is complete.'),
);
const create = timed(
	say('Ahora `new MercadoPago()` sí compila: de una clase completa nace un objeto.', 'Now `new DigitalWallet()` does compile: a complete class yields an object.'),
	say('La variable `medio` es de tipo `Pagable`: desde `main` solo se ve el contrato.', 'The variable `method` has type `Payable`: from `main` only the contract is visible.'),
);
const ask = timed(
	say('`main` llama a `estaDisponible` a través de la interfaz, sin conocer la implementación.', '`main` calls `isAvailable` through the interface, without knowing the implementation.'),
	say('La llamada baja hasta donde se resolvió: la clase abstracta responde `true`.', 'The call goes down to where it was solved: the abstract class answers `true`.'),
);
const pay = timed(
	say('Con `pagar`, la llamada atraviesa el hueco del molde y llega a `MercadoPago`.', 'With `pay`, the call passes through the gap in the mold and reaches `DigitalWallet`.'),
	say('Se ejecuta el código del objeto: descuenta el monto e imprime el saldo restante.', "The object's code runs: it subtracts the amount and prints the remaining balance."),
);
const reveal = timed(
	say('La interfaz dice qué; la clase abstracta comparte estado y código; la concreta completa.', 'The interface says what; the abstract class shares state and code; the concrete one completes.'),
	say('Quien usa el contrato no depende de ninguna implementación concreta.', 'Whoever uses the contract depends on no concrete implementation.'),
	say('Cualquier clase que firme `Pagable` puede ocupar su lugar: la interfaz alcanza.', 'Any class that signs `Payable` can take its place: the interface is enough.'),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'contract', label: { es: 'La interfaz es un contrato', en: 'The interface is a contract' } },
		{ id: 'mold', label: { es: 'La clase abstracta', en: 'The abstract class' } },
		{ id: 'reject', label: { es: 'El compilador la rechaza', en: 'The compiler rejects it' } },
		{ id: 'concrete', label: { es: 'La clase concreta', en: 'The concrete class' } },
		{ id: 'client', label: { es: 'El código cliente', en: 'The client code' } },
		{ id: 'whole', label: { es: 'El sistema completo', en: 'The whole system' } },
	],
	steps: [
		// ─── Scene 1. The interface is a contract ───────────────────────────
		{
			id: 'contract',
			chapter: 'contract',
			scene: 'journey',
			title: { es: 'Qué se debe hacer, nunca cómo', en: 'What must be done, never how' },
			subtitles: contract.list,
			motion: {
				cues: seq(
					shot(0, 'shot-1', 6000),
					{ at: 200, do: 'enter', el: 'lv-1' },
					{ at: 300, do: 'enter', el: 'hl' },
					{ at: 400, do: 'type', el: 'e-1', dur: 900 },
					{ at: 1500, do: 'move', el: 'hl', to: 'l-2', dur: 500 },
					{ at: 1600, do: 'type', el: 'e-2', dur: 800 },
					{ at: 1700, do: 'enter', el: 'slot-p' },
					{ at: 2300, do: 'enter', el: 'lb-p' },
					{ at: 2700, do: 'move', el: 'hl', to: 'l-3', dur: 500 },
					{ at: 2800, do: 'type', el: 'e-3', dur: 800 },
					{ at: 2900, do: 'enter', el: 'slot-a' },
					{ at: 3500, do: 'enter', el: 'lb-a' },
					{ at: 3900, do: 'type', el: 'e-4', dur: 200 },
					// The contract itself: one object for the whole journey.
					{ at: 4200, do: 'move', el: 'hl', to: 'l-1', dur: 600 },
					{ at: 4300, do: 'enter', el: 'k', dur: 700 },
					{ at: 5200, do: 'pulse', el: 'k' },
					{ at: contract.start(1) + 300, do: 'move', el: 'hl', to: 'l-2', dur: 600 },
					{ at: contract.start(1) + 500, do: 'pulse', el: 'slot-p' },
					{ at: contract.start(1) + 2000, do: 'move', el: 'hl', to: 'l-3', dur: 600 },
					{ at: contract.start(1) + 2200, do: 'pulse', el: 'slot-a' },
				),
			},
		},

		// ─── Scene 2. The abstract class ────────────────────────────────────
		{
			id: 'mold',
			chapter: 'mold',
			scene: 'journey',
			title: { es: 'Un molde incompleto', en: 'An incomplete mold' },
			subtitles: mold.list,
			motion: {
				cues: seq(
					shot(0, 'shot-12', 2200),
					{ at: 200, do: 'enter', el: 'lv-2' },
					{ at: 300, do: 'enter', el: 'e-5' },
					{ at: 400, do: 'move', el: 'hl', to: 'l-6', dur: 700 },
					{ at: 500, do: 'type', el: 'e-6', dur: 1200 },
					{ at: 700, do: 'move', el: 'k', to: 'a-k2', dur: 2000 },
					{ at: 1900, do: 'draw', el: 'ln-p1', dur: 900 },
					{ at: 2600, do: 'enter', el: 'hole' },
					shot(3200, 'shot-2', 2000),
					// State and the part of the contract it can already solve.
					{ at: mold.start(1) + 200, do: 'move', el: 'hl', to: 'l-7', dur: 500 },
					{ at: mold.start(1) + 300, do: 'type', el: 'e-7', dur: 900 },
					{ at: mold.start(1) + 500, do: 'enter', el: 's-act' },
					{ at: mold.start(1) + 1100, do: 'enter', el: 'lb-act' },
					{ at: mold.start(1) + 2400, do: 'move', el: 'hl', to: 'l-8', dur: 500 },
					{ at: mold.start(1) + 2500, do: 'type', el: 'e-8', dur: 1200 },
					{ at: mold.start(1) + 2700, do: 'draw', el: 'ln-a', dur: 900 },
					{ at: mold.start(1) + 3500, do: 'enter', el: 'm-av' },
					{ at: mold.start(1) + 4000, do: 'type', el: 'e-9', dur: 200 },
					{ at: mold.start(1) + 4200, do: 'pulse', el: 'm-av' },
					// The other method is still a gap.
					{ at: mold.start(2) + 300, do: 'move', el: 'hl', to: 'l-2', dur: 800 },
					{ at: mold.start(2) + 600, do: 'pulse', el: 'hole' },
					{ at: mold.start(2) + 900, do: 'enter', el: 'lb-hole' },
					{ at: mold.start(2) + 2400, do: 'pulse', el: 'hole' },
				),
			},
		},

		// ─── Scene 3. The compiler rejects it ───────────────────────────────
		{
			id: 'reject',
			chapter: 'reject',
			scene: 'journey',
			title: { es: 'No se puede instanciar', en: 'It cannot be instantiated' },
			subtitles: reject.list,
			motion: {
				cues: seq(
					shot(0, 'shot-2b', 2400),
					{ at: 200, do: 'enter', el: 'e-19' },
					{ at: 300, do: 'move', el: 'hl', to: 'l-20', dur: 800 },
					{ at: 400, do: 'type', el: 'e-20', dur: 1100 },
					{ at: 1700, do: 'move', el: 'hl', to: 'l-21', dur: 500 },
					{ at: 1800, do: 'type', el: 'e-bad', dur: 1300 },
					// The same object, asked to become an instance while it still has a gap.
					{ at: 3400, do: 'exit', el: 'k', dur: 300 },
					{ at: 3500, do: 'enter', el: 'ghost', dur: 700 },
					{ at: 4300, do: 'pulse', el: 'ghost' },
					{ at: reject.start(1), do: 'exit', el: 'hl', dur: 300 },
					{ at: reject.start(1), do: 'enter', el: 'hx-21' },
					{ at: reject.start(1) + 200, do: 'enter', el: 'hole-x' },
					{ at: reject.start(1) + 300, do: 'type', el: 'out-err', dur: 1000 },
					{ at: reject.start(1) + 400, do: 'exit', el: 'lb-hole', dur: 300 },
					{ at: reject.start(1) + 700, do: 'enter', el: 'lb-reject' },
					{ at: reject.start(1) + 1600, do: 'pulse', el: 'lb-reject' },
					{ at: reject.start(2) + 300, do: 'pulse', el: 'hole-x' },
					{ at: reject.start(2) + 2000, do: 'pulse', el: 'ghost' },
				),
			},
		},

		// ─── Scene 4. The concrete class ────────────────────────────────────
		{
			id: 'complete',
			chapter: 'concrete',
			scene: 'journey',
			title: { es: 'La clase concreta completa el contrato', en: 'The concrete class completes the contract' },
			subtitles: complete.list,
			motion: {
				cues: seq(
					// The rejected attempt is erased; the contract goes on.
					{ at: 0, do: 'exit', el: 'ghost', dur: 400 },
					{ at: 0, do: 'exit', el: 'hole-x', dur: 400 },
					{ at: 0, do: 'exit', el: 'lb-reject', dur: 400 },
					{ at: 0, do: 'exit', el: 'hx-21', dur: 400 },
					{ at: 0, do: 'exit', el: 'out-err', dur: 400 },
					{ at: 0, do: 'exit', el: 'e-bad', dur: 400 },
					shot(100, 'shot-23', 2200),
					{ at: 400, do: 'enter', el: 'lv-3' },
					{ at: 500, do: 'enter', el: 'k' },
					{ at: 600, do: 'enter', el: 'e-10' },
					{ at: 700, do: 'move', el: 'hl', to: 'l-11', dur: 1 },
					{ at: 800, do: 'enter', el: 'hl' },
					{ at: 800, do: 'type', el: 'e-11', dur: 1100 },
					{ at: 1400, do: 'move', el: 'k', to: 'a-k3', dur: 2000 },
					{ at: 3600, do: 'move', el: 'hl', to: 'l-12', dur: 500 },
					{ at: 3700, do: 'type', el: 'e-12', dur: 900 },
					{ at: 3900, do: 'enter', el: 's-bal' },
					{ at: 4500, do: 'enter', el: 'lb-bal-a' },
					// The gap gets a body.
					shot(complete.start(1), 'shot-3', 1800),
					{ at: complete.start(1) + 200, do: 'move', el: 'hl', to: 'l-13', dur: 500 },
					{ at: complete.start(1) + 300, do: 'type', el: 'e-13', dur: 900 },
					{ at: complete.start(1) + 500, do: 'draw', el: 'ln-p2', dur: 900 },
					{ at: complete.start(1) + 1300, do: 'enter', el: 'm-pay' },
					{ at: complete.start(1) + 1500, do: 'move', el: 'hl', to: 'l-14', dur: 500 },
					{ at: complete.start(1) + 1600, do: 'type', el: 'e-14', dur: 500 },
					{ at: complete.start(1) + 2300, do: 'move', el: 'hl', to: 'l-15', dur: 500 },
					{ at: complete.start(1) + 2400, do: 'type', el: 'e-15', dur: 1100 },
					{ at: complete.start(1) + 3600, do: 'type', el: 'e-16', dur: 400 },
					{ at: complete.start(1) + 4100, do: 'type', el: 'e-17', dur: 200 },
					{ at: complete.start(1) + 4400, do: 'type', el: 'e-18', dur: 200 },
					{ at: complete.start(2), do: 'exit', el: 'hl', dur: 300 },
					{ at: complete.start(2) + 100, do: 'enter', el: 'hm-13' },
					{ at: complete.start(2) + 300, do: 'pulse', el: 'm-pay' },
					{ at: complete.start(2) + 600, do: 'enter', el: 'lb-done' },
					{ at: complete.start(2) + 1200, do: 'pulse', el: 'k' },
					shot(complete.start(2) + 1500, 'shot-tower', 2400),
				),
			},
		},

		// ─── Scene 5. The client code ───────────────────────────────────────
		{
			id: 'create',
			chapter: 'client',
			scene: 'journey',
			title: { es: 'Un objeto visto como Pagable', en: 'An object seen as Payable' },
			subtitles: create.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'hm-13', dur: 400 },
					{ at: 0, do: 'exit', el: 'lb-done', dur: 400 },
					shot(0, 'shot-all', 2200),
					{ at: 300, do: 'enter', el: 'lv-m' },
					{ at: 700, do: 'enter', el: 'm-new' },
					{ at: 900, do: 'enter', el: 'm-q' },
					{ at: 1100, do: 'enter', el: 'm-call' },
					{ at: 1300, do: 'draw', el: 'tr-lanes', dur: 900 },
					{ at: 1500, do: 'move', el: 'hl', to: 'l-21', dur: 1 },
					{ at: 1600, do: 'enter', el: 'hl' },
					{ at: 1700, do: 'type', el: 'e-21', dur: 1200 },
					{ at: 1800, do: 'enter', el: 'p' },
					{ at: 2000, do: 'enter', el: 'new-on' },
					{ at: 2100, do: 'pulse', el: 'm-new' },
					// The complete contract becomes an object.
					{ at: 3000, do: 'exit', el: 'k', dur: 300 },
					{ at: 3100, do: 'enter', el: 'obj', dur: 700 },
					{ at: 3900, do: 'pulse', el: 'obj' },
					// From main, only the level of the interface is in sight.
					shot(create.start(1), 'shot-client', 2200),
					{ at: create.start(1) + 300, do: 'enter', el: 'lb-var' },
					{ at: create.start(1) + 1400, do: 'enter', el: 'veil-2' },
					{ at: create.start(1) + 1600, do: 'enter', el: 'veil-3' },
					{ at: create.start(1) + 2600, do: 'type', el: 'e-22', dur: 900 },
					{ at: create.start(1) + 3500, do: 'type', el: 'e-23', dur: 700 },
					{ at: create.start(1) + 4200, do: 'type', el: 'e-24', dur: 200 },
					{ at: create.start(1) + 4500, do: 'type', el: 'e-25', dur: 200 },
				),
			},
		},
		{
			id: 'ask',
			chapter: 'client',
			scene: 'journey',
			title: { es: 'Una llamada a través de la interfaz', en: 'A call through the interface' },
			subtitles: ask.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'new-on', dur: 400 },
					{ at: 100, do: 'move', el: 'hl', to: 'l-22', dur: 600 },
					{ at: 200, do: 'move', el: 'p', to: 'a-q', dur: 800 },
					{ at: 1000, do: 'enter', el: 'q-on' },
					{ at: 1000, do: 'pulse', el: 'm-q' },
					{ at: 1500, do: 'draw', el: 'fl-a', dur: 900 },
					{ at: 1600, do: 'move', el: 'p', to: 'a-sa', dur: 1300 },
					{ at: 2900, do: 'enter', el: 'slot-a-on' },
					// The call falls to the level that gave that method a body.
					shot(ask.start(1), 'shot-12', 1800),
					{ at: ask.start(1) + 300, do: 'draw', el: 'fl-la', dur: 900 },
					{ at: ask.start(1) + 400, do: 'move', el: 'p', to: 'a-av', dur: 1300 },
					{ at: ask.start(1) + 500, do: 'move', el: 'hl', to: 'l-8', dur: 700 },
					{ at: ask.start(1) + 1700, do: 'enter', el: 'av-on' },
					{ at: ask.start(1) + 1700, do: 'pulse', el: 'm-av' },
					{ at: ask.start(1) + 2400, do: 'enter', el: 'lb-true' },
					{ at: ask.start(1) + 3600, do: 'move', el: 'p', to: 'a-sa', dur: 900 },
					shot(ask.start(1) + 4300, 'shot-client', 1700),
					{ at: ask.start(1) + 4500, do: 'move', el: 'p', to: 'a-q', dur: 1000 },
					{ at: ask.start(1) + 4500, do: 'move', el: 'hl', to: 'l-22', dur: 600 },
				),
			},
		},
		{
			id: 'pay',
			chapter: 'client',
			scene: 'journey',
			title: { es: 'Se ejecuta el código del objeto', en: "The object's code runs" },
			subtitles: pay.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'lb-true', dur: 400 },
					{ at: 0, do: 'exit', el: 'av-on', dur: 400 },
					{ at: 0, do: 'exit', el: 'slot-a-on', dur: 400 },
					{ at: 0, do: 'exit', el: 'fl-a', dur: 400 },
					{ at: 0, do: 'exit', el: 'fl-la', dur: 400 },
					{ at: 0, do: 'exit', el: 'q-on', dur: 400 },
					{ at: 100, do: 'move', el: 'hl', to: 'l-23', dur: 500 },
					{ at: 200, do: 'move', el: 'p', to: 'a-call', dur: 700 },
					{ at: 900, do: 'enter', el: 'call-on' },
					{ at: 900, do: 'pulse', el: 'm-call' },
					{ at: 1300, do: 'draw', el: 'fl-p', dur: 700 },
					{ at: 1400, do: 'move', el: 'p', to: 'a-sp', dur: 1000 },
					shot(2300, 'shot-12', 1500),
					{ at: 2400, do: 'enter', el: 'slot-p-on' },
					// Through the gap of the abstract class, down to the class that filled it.
					{ at: 2700, do: 'draw', el: 'fl-lp1', dur: 800 },
					{ at: 2800, do: 'move', el: 'p', to: 'a-hole', dur: 1100 },
					shot(3900, 'shot-23', 1500),
					{ at: 3900, do: 'pulse', el: 'hole' },
					{ at: 4100, do: 'draw', el: 'fl-lp2', dur: 800 },
					{ at: 4200, do: 'move', el: 'p', to: 'a-pay', dur: 1100 },
					{ at: 4300, do: 'move', el: 'hl', to: 'l-13', dur: 800 },
					{ at: 5300, do: 'enter', el: 'pay-on' },
					{ at: 5300, do: 'pulse', el: 'm-pay' },
					shot(pay.start(1), 'shot-3', 1600),
					// The implementation was there all along; now it is the one running.
					{ at: pay.start(1) + 100, do: 'exit', el: 'veil-3', dur: 600 },
					{ at: pay.start(1) + 300, do: 'move', el: 'hl', to: 'l-14', dur: 500 },
					{ at: pay.start(1) + 500, do: 'exit', el: 'lb-bal-a', dur: 300 },
					{ at: pay.start(1) + 800, do: 'enter', el: 'lb-bal-b' },
					{ at: pay.start(1) + 1000, do: 'pulse', el: 's-bal' },
					{ at: pay.start(1) + 1800, do: 'move', el: 'hl', to: 'l-15', dur: 500 },
					{ at: pay.start(1) + 2000, do: 'type', el: 'out-ok', dur: 800 },
					{ at: pay.start(1) + 3200, do: 'move', el: 'hl', to: 'l-16', dur: 500 },
					{ at: pay.start(1) + 3600, do: 'pulse', el: 'obj' },
				),
			},
		},

		// ─── Scene 6. The whole system ──────────────────────────────────────
		{
			id: 'reveal',
			chapter: 'whole',
			scene: 'journey',
			title: { es: 'Un contrato, tres niveles', en: 'One contract, three levels' },
			subtitles: reveal.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'veil-2', dur: 600 },
					{ at: 0, do: 'exit', el: 'hl', dur: 400 },
					// The camera pulls back to reveal the three levels and the path of the call.
					shot(200, 'shot-all', 3000),
					{ at: 600, do: 'pulse', el: 'slot-p' },
					{ at: 800, do: 'pulse', el: 'slot-a' },
					{ at: 2400, do: 'pulse', el: 'm-av' },
					{ at: 2600, do: 'pulse', el: 's-act' },
					{ at: 4300, do: 'pulse', el: 'm-pay' },
					{ at: reveal.start(1) + 300, do: 'flow', el: 'fl-p' },
					{ at: reveal.start(1) + 300, do: 'flow', el: 'fl-lp1' },
					{ at: reveal.start(1) + 300, do: 'flow', el: 'fl-lp2' },
					{ at: reveal.start(1) + 600, do: 'pulse', el: 'lb-var' },
					{ at: reveal.start(1) + 2400, do: 'pulse', el: 'm-call' },
					{ at: reveal.start(2) + 400, do: 'enter', el: 'lb-alt' },
					{ at: reveal.start(2) + 1400, do: 'pulse', el: 'lb-alt' },
					{ at: reveal.start(2) + 3000, do: 'pulse', el: 'obj' },
				),
			},
		},
	],
};
