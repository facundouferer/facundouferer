import type { AnimationScript, CodePanel, ShellLine, ShellPanel, Subtitle } from './types';

// Step-by-step animation for the Java lesson 12 "Excepciones y manejo de errores". Every
// step names the scene it shows (`data-scene` in `src/components/animaciones/excepciones-java.astro`),
// the elements it reveals and emphasizes, plus its captions and any terminal panel.
// Most chapters play as motion steps on persistent SVG canvases (an exception object that
// is thrown, travels up the call stack and is caught); the code-heavy ones are slide steps.

const same = (text: string) => ({ es: text, en: text });
const say = (es: string, en: string): Subtitle => ({ text: { es, en } });

const code = (title: string, es: string, en: string = es): CodePanel => ({
	title,
	language: 'java',
	source: { es, en },
});

const shell = (...lines: ShellLine[]): ShellPanel => ({ lines });
const cmd = (text: string): ShellLine => ({ kind: 'cmd', text: same(text) });
const out = (text: string): ShellLine => ({ kind: 'out', text: same(text) });
const err = (text: string): ShellLine => ({ kind: 'err', text: same(text) });

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
const gapBool = timed(
	say('En la lección de constructores, `setPrecio` devolvía `false` al rechazar un precio negativo.', 'In the constructors lesson, `setPrecio` returned `false` when it rejected a negative price.'),
	say('Pero nada obliga a quien lo llama a mirar ese resultado.', 'But nothing forces the caller to look at that result.'),
	say('El precio queda como estaba, sin aviso, y el programa sigue como si nada.', 'The price stays as it was, with no warning, and the program carries on as if nothing happened.'),
);
const gapThrow = timed(
	say('Con una excepción, `setPrecio` lanza un objeto que describe el problema.', 'With an exception, `setPrecio` throws an object that describes the problem.'),
	say('La ejecución normal se interrumpe hasta que alguien lo atrape.', 'Normal execution is interrupted until somebody catches it.'),
	say('Si nadie lo atrapa, el programa se detiene: no hay forma de fingir que no pasó nada.', 'If nobody catches it, the program stops: there is no way to pretend nothing happened.'),
);
const hierTree = timed(
	say('Todo lo que se puede lanzar cuelga de `Throwable`, la raíz de la jerarquía.', 'Everything that can be thrown hangs from `Throwable`, the root of the hierarchy.'),
	say('Debajo hay dos ramas: `Error`, para fallas de la JVM, y `Exception`.', 'Below it are two branches: `Error`, for JVM failures, and `Exception`.'),
	say('Y de `Exception` cuelga `RuntimeException`, con sus hijas.', 'And `RuntimeException` hangs from `Exception`, with its children.'),
);
const hierFlags = timed(
	say('`Exception` sin `RuntimeException` es CHECKED: el compilador te obliga a hacerte cargo.', '`Exception` outside `RuntimeException` is CHECKED: the compiler forces you to deal with it.'),
	say('Todo lo que cuelga de `RuntimeException` es UNCHECKED: el compilador no dice nada.', 'Everything under `RuntimeException` is UNCHECKED: the compiler says nothing.'),
);
const hierError = timed(
	say('Un `Error`, como `OutOfMemoryError`, no se captura: no hay nada que puedas hacer.', 'An `Error`, like `OutOfMemoryError`, is not caught: there is nothing you can do.'),
	say('Si la JVM se quedó sin memoria, tu `catch` tampoco va a poder ejecutarse.', 'If the JVM ran out of memory, your `catch` will not be able to run either.'),
);
const objFields = timed(
	say('Una excepción no es un código de error: es una instancia de una clase.', 'An exception is not an error code: it is an instance of a class.'),
	say('`getMessage()` devuelve la descripción y `getCause()` la excepción original, si hay.', '`getMessage()` returns the description and `getCause()` the original exception, if any.'),
	say('`getStackTrace()` guarda el recorrido y `printStackTrace()` lo imprime en la salida de error.', '`getStackTrace()` keeps the path and `printStackTrace()` prints it to the error output.'),
);
const flowParts = timed(
	say('El `try` contiene el código que puede fallar.', 'The `try` holds the code that may fail.'),
	say('El `catch` atrapa la excepción, si el tipo coincide.', 'The `catch` catches the exception, if the type matches.'),
	say('El `finally` corre sí o sí, y después sigue el programa.', 'The `finally` runs no matter what, and then the program continues.'),
);
const flowOk = timed(
	say('Sin excepción, el `try` se ejecuta entero, hasta la última línea.', 'Without an exception, the `try` runs completely, up to its last line.'),
	say('El `catch` se saltea por completo: no hubo nada que atrapar.', 'The `catch` is skipped entirely: there was nothing to catch.'),
	say('El `finally` corre igual y el programa continúa normalmente.', 'The `finally` runs anyway and the program continues normally.'),
);
const flowFail = timed(
	say('Ahora el divisor es cero: el `try` se CORTA en esa línea.', 'Now the divisor is zero: the `try` is CUT at that line.'),
	say('Las líneas siguientes nunca se ejecutan: la B no aparece en la salida.', 'The following lines never run: B does not show up in the output.'),
	say('La excepción viaja al `catch`; después corre el `finally` y sigue el código.', 'The exception travels to the `catch`; then the `finally` runs and the code goes on.'),
);
const flowReturn = timed(
	say('Incluso con un `return` dentro del `try`, el `finally` se ejecuta antes de salir.', 'Even with a `return` inside the `try`, the `finally` runs before leaving.'),
	say('Lo que no corre es el código que quedaba después: el método ya terminó.', 'What does not run is the code that was left after it: the method is already over.'),
);
const checkUnchecked = timed(
	say('Las unchecked son errores de programación: un `NullPointerException` se evita, no se maneja.', 'Unchecked exceptions are programming errors: a `NullPointerException` is avoided, not handled.'),
	say('El compilador no pone ninguna barrera: pasan de largo.', 'The compiler puts up no barrier: they just go through.'),
	say('La solución no es un `catch`, es arreglar el código.', 'The fix is not a `catch`, it is fixing the code.'),
);
const checkChecked = timed(
	say('Las checked son condiciones esperables del entorno: el archivo no está, el servicio no responde.', 'Checked exceptions are expected conditions of the environment: the file is missing, the service is down.'),
	say('Acá el compilador frena el paso y te obliga a decidir.', 'Here the compiler stops the way and forces you to decide.'),
);
const checkOptions = timed(
	say('Solo hay dos opciones. Manejarla con `try/catch`…', 'There are only two options. Handle it with `try/catch`…'),
	say('…o declarar con `throws` que no te hacés cargo, y que lo decida quien te llamó.', '…or declare with `throws` that you do not handle it, and let your caller decide.'),
);
const stackBuild = timed(
	say('Cada llamada apila un frame: `main` llama a `procesarArchivo`, que llama a `leerLinea`…', 'Each call stacks a frame: `main` calls `procesarArchivo`, which calls `leerLinea`…'),
	say('…que al final llama a `Integer.parseInt` con el texto "veintidós".', '…which finally calls `Integer.parseInt` with the text "veintidós".'),
);
const stackThrow = timed(
	say('`parseInt` no puede convertir "veintidós" y lanza un `NumberFormatException`.', '`parseInt` cannot convert "veintidós" and throws a `NumberFormatException`.'),
	say('La excepción nace acá, en el frame de más arriba.', 'The exception is born here, in the topmost frame.'),
);
const stackUnwind = timed(
	say('Este frame no tiene `catch`: se abandona y su código restante no se ejecuta.', 'This frame has no `catch`: it is abandoned and its remaining code does not run.'),
	say('La excepción pasa al método que lo llamó, `leerLinea`, que tampoco la atrapa.', 'The exception goes to the method that called it, `leerLinea`, which does not catch it either.'),
	say('Y sigue: `procesarArchivo` tampoco sabe qué hacer con ella.', 'And on it goes: `procesarArchivo` does not know what to do with it either.'),
);
const stackCatch = timed(
	say('En `main` hay un `catch` cuyo tipo coincide: acá la excepción se detiene.', 'In `main` there is a `catch` whose type matches: here the exception stops.'),
	say('Se ejecuta el handler y el programa sigue como si nada.', 'The handler runs and the program carries on.'),
);
const stackTrace = timed(
	say('Ese recorrido queda registrado en el stack trace de la excepción.', 'That path is recorded in the exception’s stack trace.'),
	say('Cada línea es un frame: de dónde nació y por quiénes pasó hasta el `catch`.', 'Each line is a frame: where it was born and who it went through until the `catch`.'),
);
const stackUncaught = timed(
	say('Si nadie la atrapa, llega al final de la pila y la JVM imprime el stack trace.', 'If nobody catches it, it reaches the end of the stack and the JVM prints the stack trace.'),
	say('El hilo termina: una excepción sin atrapar no se puede ignorar.', 'The thread ends: an uncaught exception cannot be ignored.'),
);
const catchOrder = timed(
	say('Java prueba los `catch` en orden y ejecuta el primero cuyo tipo coincide.', 'Java tries the `catch` blocks in order and runs the first one whose type matches.'),
	say('Una `NumberFormatException` cae en el primero: es el más específico.', 'A `NumberFormatException` lands in the first one: it is the most specific.'),
);
const catchSkip = timed(
	say('Una `IllegalArgumentException` pasa de largo el primero y cae en el segundo.', 'An `IllegalArgumentException` skips the first one and lands in the second.'),
	say('Y cualquier otra, como `IOException`, termina en el `catch (Exception e)` final.', 'And any other, like `IOException`, ends up in the final `catch (Exception e)`.'),
);
const catchWrong = timed(
	say('Si ponés `Exception` primero, atrapa todo y los `catch` de abajo nunca podrían correr.', 'If you put `Exception` first, it catches everything and the `catch` blocks below could never run.'),
	say('El compilador te frena: error de compilación, `catch` inalcanzable.', 'The compiler stops you: compile error, unreachable `catch`.'),
);
const catchMulti = timed(
	say('Cuando dos tipos distintos se manejan igual, no dupliques el bloque.', 'When two different types are handled the same way, do not duplicate the block.'),
	say('Con multi-catch, `IOException | SQLException`, un solo `catch` atrapa a las dos.', 'With multi-catch, `IOException | SQLException`, a single `catch` catches both.'),
);
const resOpen = timed(
	say('En `try-with-resources` el recurso se declara dentro del paréntesis del `try`.', 'In `try-with-resources` the resource is declared inside the parentheses of the `try`.'),
	say('Se abre al entrar y se usa dentro del bloque: "Conectando…", "Enviando…".', 'It opens on entry and is used inside the block: "Connecting…", "Sending…".'),
	say('Y se cierra solo, aunque no lo escribas: Java llama a `close()` por vos.', 'And it closes by itself, even if you do not write it: Java calls `close()` for you.'),
);
const resExits = timed(
	say('Un bloque puede terminar de tres maneras: bien, con una excepción o con un `return`.', 'A block can end in three ways: normally, with an exception or with a `return`.'),
	say('Los tres caminos convergen en el mismo punto: `close()` corre siempre.', 'All three paths converge on the same point: `close()` always runs.'),
	say('Corre antes del `catch` o del `finally`. No hay forma de olvidarlo.', 'It runs before the `catch` or the `finally`. There is no way to forget it.'),
);
const chainWrap = timed(
	say('Al traducir una excepción de bajo nivel a una de tu dominio, no pierdas la original.', 'When you translate a low-level exception into a domain one, never lose the original.'),
	say('El segundo argumento, `e`, es la causa: queda guardada dentro de la nueva excepción.', 'The second argument, `e`, is the cause: it stays stored inside the new exception.'),
	say('Así el stack trace completo sigue disponible para depurar.', 'That way the full stack trace remains available for debugging.'),
);
const chainLost = timed(
	say('Si relanzás con `e.getMessage()` en lugar de `e`, la causa se pierde.', 'If you rethrow with `e.getMessage()` instead of `e`, the cause is lost.'),
	say('El stack trace se corta justo donde estaba la línea que falló de verdad.', 'The stack trace is cut right where the line that really failed was.'),
);
const antiEmpty = timed(
	say('El `catch` vacío: la excepción entra y desaparece sin dejar rastro.', 'The empty `catch`: the exception goes in and vanishes without a trace.'),
	say('El pedido no se guardó, el usuario ve "listo" y no hay nada en ningún log.', 'The order was not saved, the user sees "done" and there is nothing in any log.'),
	say('Un error tragado es infinitamente peor que un error visible.', 'A swallowed error is infinitely worse than a visible one.'),
);
const antiFinally = timed(
	say('Un `return` dentro de `finally` descarta la excepción que estaba viajando.', 'A `return` inside `finally` discards the exception that was traveling.'),
	say('Se lanza `IllegalStateException`, el `finally` hace `return 0` y nadie se entera nunca.', '`IllegalStateException` is thrown, the `finally` does `return 0` and nobody ever finds out.'),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'intro', label: { es: 'Introducción', en: 'Introduction' } },
		{ id: 'object', label: { es: '1. Una excepción es un objeto', en: '1. An exception is an object' } },
		{ id: 'flow', label: { es: '2. try, catch y finally', en: '2. try, catch and finally' } },
		{ id: 'checked', label: { es: '3. Checked vs. unchecked', en: '3. Checked vs. unchecked' } },
		{ id: 'stack', label: { es: '4. La propagación', en: '4. Propagation' } },
		{ id: 'catches', label: { es: '5. Varios catch', en: '5. Several catch blocks' } },
		{ id: 'resources', label: { es: '6. try-with-resources', en: '6. try-with-resources' } },
		{ id: 'custom', label: { es: '7. Excepciones personalizadas', en: '7. Custom exceptions' } },
		{ id: 'anti', label: { es: '8. Antipatrones', en: '8. Antipatterns' } },
		{ id: 'mistakes', label: { es: '9. Errores frecuentes', en: '9. Common mistakes' } },
		{ id: 'exercise', label: { es: '10. Ejercicio guiado', en: '10. Guided exercise' } },
		{ id: 'closing', label: { es: 'Para llevarte', en: 'Takeaways' } },
	],
	steps: [
		// ─── Intro ──────────────────────────────────────────────────────────
		{
			id: 'intro-bool',
			chapter: 'intro',
			scene: 'gap',
			title: { es: 'Una grieta en setPrecio', en: 'A crack in setPrecio' },
			subtitles: gapBool.list,
			motion: {
				cues: [
					{ at: 0, do: 'enter', el: 'b-call' },
					{ at: 600, do: 'enter', el: 'b-meth' },
					{ at: gapBool.start(0) + 3000, do: 'enter', el: 'b-arg' },
					{ at: gapBool.start(0) + 3800, do: 'move', el: 'b-arg', to: 'b-meth', dur: 1200 },
					{ at: gapBool.start(0) + 5200, do: 'pulse', el: 'b-meth' },
					{ at: gapBool.start(0) + 5400, do: 'exit', el: 'b-arg', dur: 300 },
					{ at: gapBool.start(1) + 200, do: 'enter', el: 'b-false' },
					{ at: gapBool.start(1) + 900, do: 'move', el: 'b-false', to: 'b-back', dur: 1400 },
					{ at: gapBool.start(2) + 300, do: 'enter', el: 'b-silent' },
					{ at: gapBool.start(2) + 1400, do: 'pulse', el: 'b-silent' },
				],
			},
		},
		{
			id: 'intro-throw',
			chapter: 'intro',
			scene: 'gap',
			title: { es: 'Una forma de fallar que no se ignora', en: 'A way of failing that cannot be ignored' },
			subtitles: gapThrow.list,
			motion: {
				cues: [
					{ at: 0, do: 'enter', el: 'x-call' },
					{ at: 500, do: 'enter', el: 'x-meth' },
					{ at: gapThrow.start(0) + 900, do: 'enter', el: 'x-exc' },
					{ at: gapThrow.start(0) + 1500, do: 'pulse', el: 'x-meth' },
					{ at: gapThrow.start(1) + 200, do: 'move', el: 'x-exc', to: 'x-back', dur: 1500 },
					{ at: gapThrow.start(1) + 1900, do: 'pulse', el: 'x-call' },
					{ at: gapThrow.start(2) + 200, do: 'move', el: 'x-exc', to: 'x-stop', dur: 1200 },
					{ at: gapThrow.start(2) + 1500, do: 'enter', el: 'x-stop' },
					{ at: gapThrow.start(2) + 1900, do: 'exit', el: 'x-exc', dur: 300 },
					{ at: gapThrow.start(2) + 2200, do: 'pulse', el: 'x-stop' },
				],
			},
		},
		{
			id: 'intro-failures',
			chapter: 'intro',
			scene: 'intro12',
			show: ['if1', 'if2', 'if3', 'if4', 'iq'],
			focus: ['iq'],
			title: { es: 'Un programa real falla todo el tiempo', en: 'A real program fails all the time' },
			subtitles: [
				say('El archivo no está, la red se cae, el usuario escribe "veintidós" donde iba un número.', 'The file is missing, the network drops, the user types "twenty-two" where a number belongs.'),
				say('La pregunta no es si va a fallar, sino qué hace tu código cuando falla.', 'The question is not whether it will fail, but what your code does when it does.'),
			],
		},

		// ─── 1. An exception is an object ───────────────────────────────────
		{
			id: 'hier-tree',
			chapter: 'object',
			scene: 'hier',
			title: { es: 'La jerarquía de Throwable', en: 'The Throwable hierarchy' },
			subtitles: hierTree.list,
			motion: {
				cues: [
					{ at: 0, do: 'enter', el: 'h-thr' },
					{ at: hierTree.start(1), do: 'draw', el: 'h-c1', dur: 900 },
					{ at: hierTree.start(1) + 500, do: 'enter', el: 'h-err' },
					{ at: hierTree.start(1) + 1100, do: 'draw', el: 'h-c2', dur: 900 },
					{ at: hierTree.start(1) + 1600, do: 'enter', el: 'h-exc' },
					{ at: hierTree.start(2), do: 'draw', el: 'h-c3', dur: 800 },
					{ at: hierTree.start(2) + 600, do: 'enter', el: 'h-run' },
					{ at: hierTree.start(2) + 1400, do: 'pulse', el: 'h-run' },
				],
			},
		},
		{
			id: 'hier-flags',
			chapter: 'object',
			scene: 'hier',
			title: { es: 'Quién te obliga: checked y unchecked', en: 'Who forces you: checked and unchecked' },
			subtitles: hierFlags.list,
			motion: {
				cues: [
					{ at: 0, do: 'camera', to: ['h-exc', 'h-run'], dur: 1200, pad: 80 },
					{ at: 600, do: 'pulse', el: 'h-exc' },
					{ at: 900, do: 'enter', el: 'h-checked' },
					{ at: hierFlags.start(1) + 200, do: 'pulse', el: 'h-run' },
					{ at: hierFlags.start(1) + 500, do: 'enter', el: 'h-unchecked' },
					{ at: hierFlags.start(1) + 1800, do: 'camera', to: 'all', dur: 1200 },
				],
			},
		},
		{
			id: 'hier-error',
			chapter: 'object',
			scene: 'hier',
			title: { es: 'Error: no se captura', en: 'Error: do not catch it' },
			subtitles: hierError.list,
			motion: {
				cues: [
					{ at: 0, do: 'camera', to: ['h-err', 'h-why'], dur: 1200, pad: 60 },
					{ at: 500, do: 'pulse', el: 'h-err' },
					{ at: hierError.start(1) + 100, do: 'enter', el: 'h-why' },
					{ at: hierError.start(1) + 1100, do: 'pulse', el: 'h-why' },
					{ at: hierError.start(1) + 2400, do: 'camera', to: 'all', dur: 1200 },
				],
			},
		},
		{
			id: 'obj-fields',
			chapter: 'object',
			scene: 'obj',
			title: { es: 'Una excepción trae información', en: 'An exception carries information' },
			subtitles: objFields.list,
			motion: {
				cues: [
					{ at: 0, do: 'enter', el: 'o-card' },
					{ at: 600, do: 'enter', el: 'o-note' },
					{ at: objFields.start(1), do: 'enter', el: 'o-m1' },
					{ at: objFields.start(1) + 400, do: 'draw', el: 'o-a1', dur: 600 },
					{ at: objFields.start(1) + 900, do: 'pulse', el: 'o-r1' },
					{ at: objFields.start(1) + 2200, do: 'enter', el: 'o-m2' },
					{ at: objFields.start(1) + 2600, do: 'draw', el: 'o-a2', dur: 600 },
					{ at: objFields.start(1) + 3100, do: 'pulse', el: 'o-r2' },
					{ at: objFields.start(2), do: 'enter', el: 'o-m3' },
					{ at: objFields.start(2) + 400, do: 'draw', el: 'o-a3', dur: 600 },
					{ at: objFields.start(2) + 900, do: 'pulse', el: 'o-r3' },
					{ at: objFields.start(2) + 2200, do: 'enter', el: 'o-m4' },
					{ at: objFields.start(2) + 2600, do: 'draw', el: 'o-a4', dur: 800 },
					{ at: objFields.start(2) + 3300, do: 'enter', el: 'o-out' },
					{ at: objFields.start(2) + 3600, do: 'type', el: 'o-l1', dur: 1300 },
					{ at: objFields.start(2) + 4800, do: 'type', el: 'o-l2', dur: 1000 },
				],
			},
		},

		// ─── 2. try, catch, finally ─────────────────────────────────────────
		{
			id: 'flow-parts',
			chapter: 'flow',
			scene: 'flow',
			title: { es: 'Los tres bloques', en: 'The three blocks' },
			subtitles: flowParts.list,
			motion: {
				cues: [
					{ at: 0, do: 'enter', el: 'f-try' },
					{ at: 500, do: 'enter', el: 'l-div-ok' },
					{ at: flowParts.start(1), do: 'draw', el: 'f-ar1', dur: 700 },
					{ at: flowParts.start(1) + 500, do: 'enter', el: 'f-catch' },
					{ at: flowParts.start(2), do: 'draw', el: 'f-ar2', dur: 700 },
					{ at: flowParts.start(2) + 500, do: 'enter', el: 'f-fin' },
					{ at: flowParts.start(2) + 1800, do: 'draw', el: 'f-ar3', dur: 700 },
					{ at: flowParts.start(2) + 2300, do: 'enter', el: 'f-next' },
					{ at: flowParts.start(2) + 3000, do: 'enter', el: 'o-strip' },
				],
			},
		},
		{
			id: 'flow-ok',
			chapter: 'flow',
			scene: 'flow',
			title: { es: 'Sin excepción', en: 'Without an exception' },
			subtitles: flowOk.list,
			motion: {
				cues: [
					{ at: 0, do: 'enter', el: 'f-tok' },
					{ at: 500, do: 'enter', el: 'o-a' },
					{ at: 900, do: 'move', el: 'f-tok', to: 'ta2', dur: 900 },
					{ at: 2000, do: 'move', el: 'f-tok', to: 'ta3', dur: 900 },
					{ at: 2600, do: 'enter', el: 'o-b' },
					{ at: flowOk.start(1) + 100, do: 'enter', el: 'f-skip' },
					{ at: flowOk.start(1) + 500, do: 'move', el: 'f-tok', to: 'fa1', dur: 1900 },
					{ at: flowOk.start(2) + 100, do: 'pulse', el: 'f-fin' },
					{ at: flowOk.start(2) + 400, do: 'enter', el: 'o-f' },
					{ at: flowOk.start(2) + 1500, do: 'move', el: 'f-tok', to: 'na1', dur: 1400 },
					{ at: flowOk.start(2) + 3000, do: 'enter', el: 'o-d' },
				],
			},
		},
		{
			id: 'flow-fail',
			chapter: 'flow',
			scene: 'flow',
			title: { es: 'Con excepción', en: 'With an exception' },
			subtitles: flowFail.list,
			motion: {
				cues: [
					{ at: 0, do: 'exit', el: 'f-skip', dur: 300 },
					{ at: 0, do: 'exit', el: 'o-b', dur: 300 },
					{ at: 0, do: 'exit', el: 'o-f', dur: 300 },
					{ at: 0, do: 'exit', el: 'o-d', dur: 300 },
					{ at: 0, do: 'exit', el: 'f-tok', dur: 300 },
					{ at: 0, do: 'exit', el: 'l-div-ok', dur: 300 },
					{ at: 350, do: 'move', el: 'f-tok', to: 'ta1', dur: 1 },
					{ at: 400, do: 'enter', el: 'l-div-bad' },
					{ at: 900, do: 'enter', el: 'f-tok' },
					{ at: 1300, do: 'move', el: 'f-tok', to: 'ta2', dur: 900 },
					{ at: 2400, do: 'enter', el: 'f-bolt' },
					{ at: 2700, do: 'pulse', el: 'f-bolt' },
					{ at: 2700, do: 'exit', el: 'f-tok', dur: 300 },
					{ at: flowFail.start(1) + 300, do: 'draw', el: 'f-strike', dur: 700 },
					{ at: flowFail.start(2) + 100, do: 'move', el: 'f-bolt', to: 'fp-catch', dur: 1400 },
					{ at: flowFail.start(2) + 1600, do: 'pulse', el: 'f-catch' },
					{ at: flowFail.start(2) + 1700, do: 'enter', el: 'o-c' },
					{ at: flowFail.start(2) + 1900, do: 'exit', el: 'f-bolt', dur: 400 },
					{ at: flowFail.start(2) + 2000, do: 'move', el: 'f-tok', to: 'ca1', dur: 1 },
					{ at: flowFail.start(2) + 2100, do: 'enter', el: 'f-tok' },
					{ at: flowFail.start(2) + 2900, do: 'move', el: 'f-tok', to: 'fa1', dur: 1300 },
					{ at: flowFail.start(2) + 4300, do: 'enter', el: 'o-f' },
					{ at: flowFail.start(2) + 4700, do: 'move', el: 'f-tok', to: 'na1', dur: 1300 },
					{ at: flowFail.start(2) + 6100, do: 'enter', el: 'o-d' },
				],
			},
		},
		{
			id: 'flow-return',
			chapter: 'flow',
			scene: 'flow',
			title: { es: 'El finally corre siempre', en: 'The finally always runs' },
			subtitles: flowReturn.list,
			motion: {
				cues: [
					{ at: 0, do: 'exit', el: 'f-tok', dur: 300 },
					{ at: 0, do: 'exit', el: 'o-c', dur: 300 },
					{ at: 0, do: 'exit', el: 'o-f', dur: 300 },
					{ at: 0, do: 'exit', el: 'o-d', dur: 300 },
					{ at: 0, do: 'exit', el: 'f-strike', dur: 300 },
					{ at: 0, do: 'exit', el: 'l-div-bad', dur: 300 },
					{ at: 350, do: 'move', el: 'f-tok', to: 'ta1', dur: 1 },
					{ at: 400, do: 'enter', el: 'l-ret' },
					{ at: 800, do: 'enter', el: 'f-tok' },
					{ at: 1200, do: 'move', el: 'f-tok', to: 'ta2', dur: 900 },
					{ at: 2300, do: 'pulse', el: 'l-ret' },
					{ at: 2500, do: 'move', el: 'f-tok', to: 'fa1', dur: 1800 },
					{ at: 4400, do: 'pulse', el: 'f-fin' },
					{ at: 4600, do: 'enter', el: 'o-f2' },
					{ at: flowReturn.start(1) + 300, do: 'exit', el: 'f-next', dur: 600 },
					{ at: flowReturn.start(1) + 400, do: 'exit', el: 'f-tok', dur: 400 },
					{ at: flowReturn.start(1) + 900, do: 'enter', el: 'f-leave' },
				],
			},
		},

		// A slide: the example of the lesson, with its output.
		{
			id: 'flow-code',
			chapter: 'flow',
			scene: 'tcf',
			show: '*',
			focus: ['t1', 't2'],
			title: { es: 'El try se corta: A, C, D', en: 'The try is cut: A, C, D' },
			code: code(
				'Flujo.java',
				`public class Flujo {
    public static void main(String[] args) {
        try {
            System.out.println("A");
            int x = 10 / 0;              // ← acá se lanza
            System.out.println("B");     // ← NUNCA se ejecuta
        } catch (ArithmeticException e) {
            System.out.println("C");
        }
        System.out.println("D");
    }
}`,
				`public class Flujo {
    public static void main(String[] args) {
        try {
            System.out.println("A");
            int x = 10 / 0;              // ← thrown here
            System.out.println("B");     // ← NEVER runs
        } catch (ArithmeticException e) {
            System.out.println("C");
        }
        System.out.println("D");
    }
}`,
			),
			shell: shell(cmd('java Flujo'), out('A'), out('C'), out('D')),
			subtitles: [
				say('Salida: A, C, D. La línea B jamás se ejecuta.', 'Output: A, C, D. Line B never runs.'),
				say('Por eso conviene que los bloques `try` sean cortos: un `try` de cuarenta líneas es un misterio.', 'That is why `try` blocks should be short: a forty-line `try` is a mystery.'),
			],
		},

		// ─── 3. Checked vs. unchecked ───────────────────────────────────────
		{
			id: 'check-unchecked',
			chapter: 'checked',
			scene: 'check',
			title: { es: 'Unchecked: errores de programación', en: 'Unchecked: programming errors' },
			subtitles: checkUnchecked.list,
			motion: {
				cues: [
					{ at: 0, do: 'enter', el: 'ck-gate' },
					{ at: 500, do: 'enter', el: 'ck-un' },
					{ at: checkUnchecked.start(1) + 100, do: 'move', el: 'ck-un', to: 'ck-pass', dur: 1500 },
					{ at: checkUnchecked.start(1) + 1800, do: 'move', el: 'ck-un', to: 'ck-bug', dur: 1400, dx: 150 },
					{ at: checkUnchecked.start(2) + 100, do: 'enter', el: 'ck-bug' },
					{ at: checkUnchecked.start(2) + 1200, do: 'pulse', el: 'ck-bug' },
				],
			},
		},
		{
			id: 'check-checked',
			chapter: 'checked',
			scene: 'check',
			title: { es: 'Checked: condiciones del entorno', en: 'Checked: environment conditions' },
			subtitles: checkChecked.list,
			motion: {
				cues: [
					{ at: 0, do: 'enter', el: 'ck-ch' },
					{ at: checkChecked.start(0) + 3500, do: 'move', el: 'ck-ch', to: 'ck-wait', dur: 1600 },
					{ at: checkChecked.start(1) + 100, do: 'pulse', el: 'ck-gate' },
					{ at: checkChecked.start(1) + 600, do: 'enter', el: 'ck-ask' },
					{ at: checkChecked.start(1) + 1600, do: 'pulse', el: 'ck-ask' },
				],
			},
		},
		{
			id: 'check-options',
			chapter: 'checked',
			scene: 'check',
			title: { es: 'Manejarla o declararla', en: 'Handle it or declare it' },
			subtitles: checkOptions.list,
			motion: {
				cues: [
					{ at: 0, do: 'enter', el: 'ck-opt1' },
					{ at: 700, do: 'move', el: 'ck-ch', to: 'ck-opt1', dur: 1400, dx: 170 },
					{ at: 2300, do: 'pulse', el: 'ck-opt1' },
					{ at: checkOptions.start(1) + 100, do: 'enter', el: 'ck-opt2' },
					{ at: checkOptions.start(1) + 500, do: 'move', el: 'ck-ch', to: 'ck-opt2', dur: 1400, dx: 170 },
					{ at: checkOptions.start(1) + 2000, do: 'pulse', el: 'ck-opt2' },
				],
			},
		},
		{
			id: 'check-bugs',
			chapter: 'checked',
			scene: 'unchecked',
			show: ['u-un'],
			focus: ['u-un'],
			title: { es: 'Unchecked: se evitan', en: 'Unchecked: you avoid them' },
			code: code(
				'Bugs.java',
				`String s = null;
s.length();                  // NullPointerException — el bug es el null
int[] a = new int[3];
a[5] = 1;                    // ArrayIndexOutOfBoundsException — el bug es el 5
Integer.parseInt("hola");    // NumberFormatException — validá la entrada antes`,
				`String s = null;
s.length();                  // NullPointerException — the bug is the null
int[] a = new int[3];
a[5] = 1;                    // ArrayIndexOutOfBoundsException — the bug is the 5
Integer.parseInt("hola");    // NumberFormatException — validate the input first`,
			),
			subtitles: [
				say('`NullPointerException`, `ArrayIndexOutOfBoundsException`, `NumberFormatException`: todas son unchecked.', '`NullPointerException`, `ArrayIndexOutOfBoundsException`, `NumberFormatException`: all unchecked.'),
				say('El bug es el `null`, el índice 5 o la entrada sin validar, no la excepción.', 'The bug is the `null`, the index 5 or the unvalidated input, not the exception.'),
			],
		},
		{
			id: 'check-scanner',
			chapter: 'checked',
			scene: 'unchecked',
			show: ['u-un'],
			focus: ['u-un'],
			title: { es: 'InputMismatchException y el buffer', en: 'InputMismatchException and the buffer' },
			code: code(
				'Edad.java',
				`Scanner leer = new Scanner(System.in);
int edad = 0;
boolean valido = false;
while (!valido) {
    try {
        edad = leer.nextInt();       // InputMismatchException si escriben "abc"
        valido = true;
    } catch (InputMismatchException e) {
        System.out.println("Ingresá un número.");
        leer.nextLine();             // descarta el texto inválido del buffer
    }
}`,
				`Scanner leer = new Scanner(System.in);
int edad = 0;
boolean valido = false;
while (!valido) {
    try {
        edad = leer.nextInt();       // InputMismatchException if they type "abc"
        valido = true;
    } catch (InputMismatchException e) {
        System.out.println("Enter a number.");
        leer.nextLine();             // discards the invalid text from the buffer
    }
}`,
			),
			shell: shell(cmd('java Edad'), out('abc'), err('Ingresá un número.'), out('22'), out('(la edad es 22)')),
			subtitles: [
				say('`Scanner.nextInt()` lanza `InputMismatchException`: es unchecked, hereda de `RuntimeException`.', '`Scanner.nextInt()` throws `InputMismatchException`: it is unchecked, a child of `RuntimeException`.'),
				say('Cuando falla, el texto inválido sigue en el buffer: sin `nextLine()` el bucle falla una y otra vez.', 'When it fails, the invalid text stays in the buffer: without `nextLine()` the loop fails again and again.'),
			],
		},
		{
			id: 'check-handle',
			chapter: 'checked',
			scene: 'unchecked',
			show: ['u-ch'],
			focus: ['u-ch'],
			title: { es: 'Checked: dos opciones', en: 'Checked: two options' },
			code: code(
				'Configuracion.java',
				`// Opción 1: manejarla
public void leerConfiguracion() {
    try {
        String valor = obtenerConfiguracion();
        System.out.println(valor);
    } catch (ConfiguracionNoDisponibleException e) {
        System.out.println("Uso los valores por defecto.");
    }
}

// Opción 2: declarar que no te hacés cargo
public String leerConfiguracion() throws ConfiguracionNoDisponibleException {
    return obtenerConfiguracion();   // que decida el de arriba
}`,
				`// Option 1: handle it
public void leerConfiguracion() {
    try {
        String valor = obtenerConfiguracion();
        System.out.println(valor);
    } catch (ConfiguracionNoDisponibleException e) {
        System.out.println("Using the default values.");
    }
}

// Option 2: declare that you do not handle it
public String leerConfiguracion() throws ConfiguracionNoDisponibleException {
    return obtenerConfiguracion();   // let the caller decide
}`,
			),
			subtitles: [
				say('`obtenerConfiguracion()` declara `throws ConfiguracionNoDisponibleException`: es checked.', '`obtenerConfiguracion()` declares `throws ConfiguracionNoDisponibleException`: it is checked.'),
				say('O la manejás con un `catch`, o la declarás en tu firma y que decida quien te llamó.', 'Either you handle it with a `catch`, or you declare it in your signature and let your caller decide.'),
			],
		},
		{
			id: 'check-throws',
			chapter: 'checked',
			scene: 'throwkw',
			show: '*',
			focus: ['tw-throw', 'tw-throws'],
			title: { es: 'throw y throws no son lo mismo', en: 'throw and throws are not the same' },
			code: code(
				'Firma.java',
				`public void setEdad(int edad) throws EdadInvalidaException {  // throws: advertencia
    if (edad < 0) {
        throw new EdadInvalidaException(edad);                    // throw: acción
    }
    this.edad = edad;
}`,
				`public void setEdad(int edad) throws EdadInvalidaException {  // throws: warning
    if (edad < 0) {
        throw new EdadInvalidaException(edad);                    // throw: action
    }
    this.edad = edad;
}`,
			),
			subtitles: [
				say('`throw` es una acción: lanza el objeto, dentro del método.', '`throw` is an action: it throws the object, inside the method.'),
				say('`throws` es una advertencia: va en la firma y avisa qué puede salir.', '`throws` is a warning: it goes in the signature and tells what may come out.'),
			],
		},

		// ─── 4. Propagation ─────────────────────────────────────────────────
		{
			id: 'stack-build',
			chapter: 'stack',
			scene: 'stack',
			title: { es: 'La pila de llamadas', en: 'The call stack' },
			subtitles: stackBuild.list,
			motion: {
				cues: [
					{ at: 0, do: 'enter', el: 'fr-4' },
					{ at: 700, do: 'draw', el: 'sa-3', dur: 600 },
					{ at: 1100, do: 'enter', el: 'fr-3' },
					{ at: 2200, do: 'draw', el: 'sa-2', dur: 600 },
					{ at: 2600, do: 'enter', el: 'fr-2' },
					{ at: stackBuild.start(1), do: 'draw', el: 'sa-1', dur: 600 },
					{ at: stackBuild.start(1) + 400, do: 'enter', el: 'fr-1' },
				],
			},
		},
		{
			id: 'stack-throw',
			chapter: 'stack',
			scene: 'stack',
			title: { es: 'Nace la excepción', en: 'The exception is born' },
			subtitles: stackThrow.list,
			motion: {
				cues: [
					{ at: 0, do: 'pulse', el: 'fr-1' },
					{ at: 400, do: 'enter', el: 'st-exc' },
					{ at: 1000, do: 'pulse', el: 'st-exc' },
					{ at: stackThrow.start(1) + 200, do: 'enter', el: 'st-born' },
					{ at: stackThrow.start(1) + 1200, do: 'pulse', el: 'st-born' },
				],
			},
		},
		{
			id: 'stack-unwind',
			chapter: 'stack',
			scene: 'stack',
			title: { es: 'Sube por la pila', en: 'It travels up the stack' },
			subtitles: stackUnwind.list,
			motion: {
				cues: [
					{ at: 0, do: 'exit', el: 'st-born', dur: 300 },
					{ at: 500, do: 'exit', el: 'fr-1', dur: 600 },
					{ at: 800, do: 'move', el: 'st-exc', to: 'fr-2', dx: 150, dur: 1400 },
					{ at: stackUnwind.start(1) + 300, do: 'pulse', el: 'fr-2' },
					{ at: stackUnwind.start(1) + 1200, do: 'exit', el: 'fr-2', dur: 600 },
					{ at: stackUnwind.start(1) + 1500, do: 'move', el: 'st-exc', to: 'fr-3', dx: 150, dur: 1400 },
					{ at: stackUnwind.start(2) + 300, do: 'pulse', el: 'fr-3' },
					{ at: stackUnwind.start(2) + 1200, do: 'exit', el: 'fr-3', dur: 600 },
				],
			},
		},
		{
			id: 'stack-catch',
			chapter: 'stack',
			scene: 'stack',
			title: { es: 'Alguien la atrapa', en: 'Somebody catches it' },
			subtitles: stackCatch.list,
			motion: {
				cues: [
					{ at: 0, do: 'move', el: 'st-exc', to: 'fr-4', dx: 150, dur: 1500 },
					{ at: 1700, do: 'pulse', el: 'fr-4' },
					{ at: 2000, do: 'enter', el: 'st-handler' },
					{ at: stackCatch.start(1), do: 'move', el: 'st-exc', to: 'st-handler', dx: 250, dur: 1400 },
					{ at: stackCatch.start(1) + 1600, do: 'pulse', el: 'st-handler' },
				],
			},
		},
		{
			id: 'stack-trace',
			chapter: 'stack',
			scene: 'stack',
			title: { es: 'El stack trace es el recorrido', en: 'The stack trace is the path' },
			subtitles: stackTrace.list,
			motion: {
				cues: [
					{ at: 0, do: 'enter', el: 'st-trace' },
					{ at: 500, do: 'type', el: 'tr-0', dur: 1500 },
					{ at: stackTrace.start(1), do: 'type', el: 'tr-1', dur: 1300 },
					{ at: stackTrace.start(1) + 1500, do: 'type', el: 'tr-2', dur: 1100 },
					{ at: stackTrace.start(1) + 2800, do: 'type', el: 'tr-3', dur: 1200 },
					{ at: stackTrace.start(1) + 4200, do: 'type', el: 'tr-4', dur: 1000 },
				],
			},
		},
		{
			id: 'stack-uncaught',
			chapter: 'stack',
			scene: 'stack',
			title: { es: 'Si nadie la atrapa', en: 'If nobody catches it' },
			subtitles: stackUncaught.list,
			motion: {
				cues: [
					{ at: 0, do: 'exit', el: 'st-handler', dur: 400 },
					{ at: 200, do: 'exit', el: 'fr-4', dur: 600 },
					{ at: 600, do: 'move', el: 'st-exc', to: 'st-jvm', dx: 250, dur: 1500 },
					{ at: 2000, do: 'enter', el: 'st-jvm' },
					{ at: stackUncaught.start(1), do: 'pulse', el: 'st-jvm' },
					{ at: stackUncaught.start(1) + 1200, do: 'exit', el: 'st-exc', dur: 500 },
				],
			},
		},
		{
			id: 'stack-design',
			chapter: 'stack',
			scene: 'design',
			show: '*',
			focus: ['d2'],
			title: { es: 'Capturá donde podés hacer algo', en: 'Catch where you can do something' },
			subtitles: [
				say('No tenés que capturar donde ocurre el error, sino donde podés hacer algo con él.', 'You do not catch where the error happens, but where you can do something about it.'),
				say('Un método que lee un archivo casi nunca sabe qué hacer si no existe; el que lo mandó a leer, sí.', 'A method that reads a file rarely knows what to do if it is missing; the one that asked for the read does.'),
				say('Un `catch` que no puede tomar ninguna decisión útil es un `catch` que sobra.', 'A `catch` that cannot make any useful decision is a `catch` that is not needed.'),
			],
		},

		// ─── 5. Several catch blocks ────────────────────────────────────────
		{
			id: 'catch-order',
			chapter: 'catches',
			scene: 'catches',
			title: { es: 'El orden de los catch', en: 'The order of the catch blocks' },
			subtitles: catchOrder.list,
			motion: {
				cues: [
					{ at: 0, do: 'enter', el: 'ca1' },
					{ at: 400, do: 'enter', el: 'ca2' },
					{ at: 800, do: 'enter', el: 'ca3' },
					{ at: catchOrder.start(1), do: 'enter', el: 'ct-1' },
					{ at: catchOrder.start(1) + 700, do: 'move', el: 'ct-1', to: 'ra1', dur: 1000 },
					{ at: catchOrder.start(1) + 1900, do: 'move', el: 'ct-1', to: 'cb1', dur: 900 },
					{ at: catchOrder.start(1) + 2900, do: 'pulse', el: 'ca1' },
				],
			},
		},
		{
			id: 'catch-skip',
			chapter: 'catches',
			scene: 'catches',
			title: { es: 'De lo específico a lo general', en: 'From specific to general' },
			subtitles: catchSkip.list,
			motion: {
				cues: [
					{ at: 0, do: 'enter', el: 'ct-2' },
					{ at: 600, do: 'move', el: 'ct-2', to: 'ra1', dur: 900 },
					{ at: 1700, do: 'move', el: 'ct-2', to: 'ra2', dur: 800 },
					{ at: 2700, do: 'move', el: 'ct-2', to: 'cb2', dur: 800 },
					{ at: 3600, do: 'pulse', el: 'ca2' },
					{ at: catchSkip.start(1), do: 'enter', el: 'ct-3' },
					{ at: catchSkip.start(1) + 600, do: 'move', el: 'ct-3', to: 'ra1', dur: 800 },
					{ at: catchSkip.start(1) + 1500, do: 'move', el: 'ct-3', to: 'ra2', dur: 800 },
					{ at: catchSkip.start(1) + 2400, do: 'move', el: 'ct-3', to: 'ra3', dur: 800 },
					{ at: catchSkip.start(1) + 3300, do: 'move', el: 'ct-3', to: 'cb3', dur: 800 },
					{ at: catchSkip.start(1) + 4200, do: 'pulse', el: 'ca3' },
				],
			},
		},
		{
			id: 'catch-wrong',
			chapter: 'catches',
			scene: 'catches',
			title: { es: 'Si invertís el orden', en: 'If you swap the order' },
			subtitles: catchWrong.list,
			motion: {
				cues: [
					{ at: 0, do: 'exit', el: 'ca1', dur: 400 },
					{ at: 0, do: 'exit', el: 'ca2', dur: 400 },
					{ at: 0, do: 'exit', el: 'ca3', dur: 400 },
					{ at: 0, do: 'exit', el: 'ct-1', dur: 400 },
					{ at: 0, do: 'exit', el: 'ct-2', dur: 400 },
					{ at: 0, do: 'exit', el: 'ct-3', dur: 400 },
					{ at: 600, do: 'enter', el: 'cw1' },
					{ at: 1000, do: 'enter', el: 'cw2' },
					{ at: 1400, do: 'enter', el: 'cw3' },
					{ at: 2200, do: 'pulse', el: 'cw1' },
					{ at: catchWrong.start(1) + 200, do: 'enter', el: 'cw-err' },
					{ at: catchWrong.start(1) + 1200, do: 'pulse', el: 'cw-err' },
				],
			},
		},
		{
			id: 'catch-multi',
			chapter: 'catches',
			scene: 'catches',
			title: { es: 'Multi-catch', en: 'Multi-catch' },
			subtitles: catchMulti.list,
			motion: {
				cues: [
					{ at: 0, do: 'exit', el: 'cw1', dur: 400 },
					{ at: 0, do: 'exit', el: 'cw2', dur: 400 },
					{ at: 0, do: 'exit', el: 'cw3', dur: 400 },
					{ at: 0, do: 'exit', el: 'cw-err', dur: 400 },
					{ at: 500, do: 'enter', el: 'cm' },
					{ at: catchMulti.start(1), do: 'enter', el: 'ct-io' },
					{ at: catchMulti.start(1) + 400, do: 'enter', el: 'ct-sql' },
					{ at: catchMulti.start(1) + 1000, do: 'move', el: 'ct-io', to: 'cm', dx: 100, dur: 1300 },
					{ at: catchMulti.start(1) + 1600, do: 'move', el: 'ct-sql', to: 'cm', dx: 290, dur: 1300 },
					{ at: catchMulti.start(1) + 3100, do: 'pulse', el: 'cm' },
				],
			},
		},
		{
			id: 'catch-code',
			chapter: 'catches',
			scene: 'catchsl',
			show: '*',
			focus: ['cs-order'],
			title: { es: 'El código de varios catch', en: 'Several catch blocks in code' },
			code: code(
				'VariosCatch.java',
				`try {
    procesar(datos);
} catch (NumberFormatException e) {       // más específica primero
    System.out.println("El dato no es un número válido.");
} catch (IllegalArgumentException e) {    // NumberFormatException hereda de esta
    System.out.println("Argumento inválido.");
} catch (Exception e) {                   // la más general, al final
    System.out.println("Error inesperado.");
}

try {
    conectarYGuardar();
} catch (IOException | SQLException e) {  // multi-catch
    logger.error("Falló la persistencia: " + e.getMessage());
}`,
				`try {
    procesar(datos);
} catch (NumberFormatException e) {       // most specific first
    System.out.println("The value is not a valid number.");
} catch (IllegalArgumentException e) {    // NumberFormatException extends this
    System.out.println("Invalid argument.");
} catch (Exception e) {                   // the most general, last
    System.out.println("Unexpected error.");
}

try {
    conectarYGuardar();
} catch (IOException | SQLException e) {  // multi-catch
    logger.error("Persistence failed: " + e.getMessage());
}`,
			),
			subtitles: [
				say('Los `catch` van de lo más específico a lo más general.', 'The `catch` blocks go from the most specific to the most general.'),
				say('Y el multi-catch evita duplicar el bloque cuando dos tipos se manejan igual.', 'And multi-catch avoids duplicating the block when two types are handled the same way.'),
			],
		},

		// ─── 6. try-with-resources ──────────────────────────────────────────
		{
			id: 'res-manual',
			chapter: 'resources',
			scene: 'ressl',
			show: ['rl-manual'],
			focus: ['rl-manual'],
			title: { es: 'Cerrar a mano: demasiada ceremonia', en: 'Closing by hand: too much ceremony' },
			code: code(
				'Manual.java',
				`ConexionSimulada conexion = null;
try {
    conexion = new ConexionSimulada("servidor-datos");
    conexion.enviar("SELECT * FROM productos");
} catch (IllegalArgumentException e) {
    System.out.println("No se pudo conectar.");
} finally {
    if (conexion != null) {        // ¿y si falló al construirla?
        try {
            conexion.close();      // cerrar también puede lanzar excepción
        } catch (Exception e) {
            // y acá casi nadie sabe qué poner
        }
    }
}`,
				`ConexionSimulada conexion = null;
try {
    conexion = new ConexionSimulada("servidor-datos");
    conexion.enviar("SELECT * FROM productos");
} catch (IllegalArgumentException e) {
    System.out.println("Could not connect.");
} finally {
    if (conexion != null) {        // what if building it failed?
        try {
            conexion.close();      // closing can also throw
        } catch (Exception e) {
            // and here almost nobody knows what to put
        }
    }
}`,
			),
			subtitles: [
				say('Abrir un archivo o una conexión obliga a cerrarlo, sobre todo si algo falla en el medio.', 'Opening a file or a connection means you must close it, above all if something fails midway.'),
				say('Hacerlo a mano son nueve líneas de ceremonia y dos casos borde que casi todos olvidan.', 'Doing it by hand is nine lines of ceremony and two edge cases that almost everyone forgets.'),
			],
		},
		{
			id: 'res-class',
			chapter: 'resources',
			scene: 'ressl',
			show: ['rl-auto'],
			focus: ['rl-auto'],
			title: { es: 'AutoCloseable', en: 'AutoCloseable' },
			code: code(
				'ConexionSimulada.java',
				`public class ConexionSimulada implements AutoCloseable {
    private final String servidor;

    public ConexionSimulada(String servidor) {
        if (servidor == null || servidor.isBlank()) {
            throw new IllegalArgumentException("El servidor no puede estar vacío");
        }
        this.servidor = servidor;
        System.out.println("Conectando a " + servidor + "...");
    }

    public void enviar(String comando) {
        System.out.println("Enviando: " + comando);
    }

    @Override
    public void close() {
        System.out.println("Conexión a " + servidor + " cerrada.");
    }
}`,
				`public class ConexionSimulada implements AutoCloseable {
    private final String servidor;

    public ConexionSimulada(String servidor) {
        if (servidor == null || servidor.isBlank()) {
            throw new IllegalArgumentException("The server cannot be empty");
        }
        this.servidor = servidor;
        System.out.println("Connecting to " + servidor + "...");
    }

    public void enviar(String comando) {
        System.out.println("Sending: " + comando);
    }

    @Override
    public void close() {
        System.out.println("Connection to " + servidor + " closed.");
    }
}`,
			),
			subtitles: [
				say('Para ver el mecanismo sin archivos, simulamos un recurso que implementa `AutoCloseable`.', 'To see the mechanism without files, we simulate a resource that implements `AutoCloseable`.'),
				say('Imprime un mensaje al abrirse y otro al cerrarse, así se ve el orden exacto.', 'It prints one message when it opens and another when it closes, so the exact order shows.'),
			],
		},
		{
			id: 'res-open',
			chapter: 'resources',
			scene: 'res',
			title: { es: 'Se abre, se usa y se cierra solo', en: 'It opens, is used and closes by itself' },
			subtitles: resOpen.list,
			motion: {
				cues: [
					{ at: 0, do: 'enter', el: 'rs-code' },
					{ at: 500, do: 'enter', el: 'rs-console' },
					{ at: 1000, do: 'enter', el: 'rs-life' },
					{ at: 1400, do: 'enter', el: 'rs-t1' },
					{ at: 1600, do: 'enter', el: 'rs-t2' },
					{ at: 1800, do: 'enter', el: 'rs-t3' },
					{ at: 2200, do: 'enter', el: 'rs-res' },
					{ at: resOpen.start(1) + 200, do: 'move', el: 'rs-res', to: 'rt1', dur: 1200 },
					{ at: resOpen.start(1) + 1500, do: 'type', el: 'rs-o1', dur: 1200 },
					{ at: resOpen.start(1) + 2800, do: 'move', el: 'rs-res', to: 'rt2', dur: 1200 },
					{ at: resOpen.start(1) + 4100, do: 'type', el: 'rs-o2', dur: 1300 },
					{ at: resOpen.start(2) + 200, do: 'move', el: 'rs-res', to: 'rt3', dur: 1200 },
					{ at: resOpen.start(2) + 1500, do: 'type', el: 'rs-o3', dur: 1300 },
					{ at: resOpen.start(2) + 2900, do: 'enter', el: 'rs-auto' },
				],
			},
		},
		{
			id: 'res-exits',
			chapter: 'resources',
			scene: 'exits',
			title: { es: 'Tres caminos, un mismo cierre', en: 'Three paths, one closing' },
			subtitles: resExits.list,
			motion: {
				cues: [
					{ at: 0, do: 'enter', el: 'ex-try' },
					{ at: 500, do: 'draw', el: 'ex-a1', dur: 700 },
					{ at: 500, do: 'draw', el: 'ex-a2', dur: 700 },
					{ at: 500, do: 'draw', el: 'ex-a3', dur: 700 },
					{ at: 1000, do: 'enter', el: 'ex-ok' },
					{ at: 1300, do: 'enter', el: 'ex-exc' },
					{ at: 1600, do: 'enter', el: 'ex-ret' },
					{ at: resExits.start(1), do: 'enter', el: 'ex-close' },
					{ at: resExits.start(1) + 400, do: 'draw', el: 'ex-b1', dur: 800 },
					{ at: resExits.start(1) + 700, do: 'draw', el: 'ex-b2', dur: 800 },
					{ at: resExits.start(1) + 1000, do: 'draw', el: 'ex-b3', dur: 800 },
					{ at: resExits.start(1) + 2000, do: 'flow', el: 'ex-b1' },
					{ at: resExits.start(1) + 2000, do: 'flow', el: 'ex-b2' },
					{ at: resExits.start(1) + 2000, do: 'flow', el: 'ex-b3' },
					{ at: resExits.start(1) + 2200, do: 'pulse', el: 'ex-close' },
					{ at: resExits.start(2) + 200, do: 'enter', el: 'ex-note' },
				],
			},
		},
		{
			id: 'res-code',
			chapter: 'resources',
			scene: 'ressl',
			show: ['rl-twr'],
			focus: ['rl-twr'],
			title: { es: 'El mismo código con try-with-resources', en: 'The same code with try-with-resources' },
			code: code(
				'ConTryWithResources.java',
				`try (ConexionSimulada conexion = new ConexionSimulada("servidor-datos")) {
    conexion.enviar("SELECT * FROM productos");
} catch (IllegalArgumentException e) {
    System.out.println("No se pudo conectar.");
}
// conexion ya está cerrada, pase lo que pase`,
				`try (ConexionSimulada conexion = new ConexionSimulada("servidor-datos")) {
    conexion.enviar("SELECT * FROM productos");
} catch (IllegalArgumentException e) {
    System.out.println("Could not connect.");
}
// conexion is already closed, no matter what`,
			),
			shell: shell(
				cmd('java ConTryWithResources'),
				out('Conectando a servidor-datos...'),
				out('Enviando: SELECT * FROM productos'),
				out('Conexión a servidor-datos cerrada.'),
			),
			subtitles: [
				say('Un solo bloque, sin `finally` ni `null` checks: el cierre ya no depende de vos.', 'One single block, no `finally` or `null` checks: the closing no longer depends on you.'),
				say('Funciona con cualquier clase `AutoCloseable`, y podés declarar varios recursos con punto y coma.', 'It works with any `AutoCloseable` class, and you can declare several resources separated by semicolons.'),
			],
		},

		// ─── 7. Custom exceptions ───────────────────────────────────────────
		{
			id: 'custom-class',
			chapter: 'custom',
			scene: 'custom',
			show: ['cu-class'],
			focus: ['cu-class'],
			title: { es: 'Tu propia excepción', en: 'Your own exception' },
			code: code(
				'SaldoInsuficienteException.java',
				`// Unchecked: el llamador puede prevenirlo consultando el saldo antes
public class SaldoInsuficienteException extends RuntimeException {
    private final double faltante;

    public SaldoInsuficienteException(double solicitado, double disponible) {
        super(String.format("Faltan $%.2f: se pidieron $%.2f y hay $%.2f",
              solicitado - disponible, solicitado, disponible));
        this.faltante = solicitado - disponible;
    }

    public double getFaltante() { return faltante; }
}`,
				`// Unchecked: the caller can prevent it by checking the balance first
public class SaldoInsuficienteException extends RuntimeException {
    private final double faltante;

    public SaldoInsuficienteException(double solicitado, double disponible) {
        super(String.format("Missing $%.2f: $%.2f requested and $%.2f available",
              solicitado - disponible, solicitado, disponible));
        this.faltante = solicitado - disponible;
    }

    public double getFaltante() { return faltante; }
}`,
			),
			subtitles: [
				say('Cuando el problema es de tu dominio, las excepciones estándar no lo describen bien.', 'When the problem belongs to your domain, standard exceptions do not describe it well.'),
				say('`SaldoInsuficienteException` te dice qué pasó desde el nombre.', '`SaldoInsuficienteException` tells you what happened from its name.'),
			],
		},
		{
			id: 'custom-data',
			chapter: 'custom',
			scene: 'custom',
			show: ['cu-class', 'cu-data'],
			focus: ['cu-data'],
			title: { es: 'La excepción lleva datos', en: 'The exception carries data' },
			code: code(
				'Retiro.java',
				`try {
    cuenta.retirar(5000);
} catch (SaldoInsuficienteException e) {
    System.out.printf("Te faltan $%.2f. ¿Querés cargar saldo?%n", e.getFaltante());
}`,
				`try {
    cuenta.retirar(5000);
} catch (SaldoInsuficienteException e) {
    System.out.printf("You are short by $%.2f. Top up your balance?%n", e.getFaltante());
}`,
			),
			shell: shell(cmd('java Retiro'), err('Te faltan $1500,00. ¿Querés cargar saldo?')),
			subtitles: [
				say('Fijate que la excepción lleva datos, no solo un texto.', 'Notice that the exception carries data, not just a text.'),
				say('El `catch` los usa: `e.getFaltante()` permite decidir qué mostrarle al usuario.', 'The `catch` uses them: `e.getFaltante()` lets you decide what to show the user.'),
			],
		},
		{
			id: 'custom-choose',
			chapter: 'custom',
			scene: 'custom',
			show: '*',
			focus: ['cu-checked', 'cu-unchecked'],
			title: { es: '¿Checked o unchecked?', en: 'Checked or unchecked?' },
			subtitles: [
				say('La pregunta que decide: ¿quien llama puede hacer algo razonable para recuperarse?', 'The deciding question: can the caller do something reasonable to recover?'),
				say('Si es una condición esperable del entorno, `extends Exception`: checked.', 'If it is an expected condition of the environment, `extends Exception`: checked.'),
				say('Si es un error de uso de la API, `extends RuntimeException`: unchecked, y es lo más común hoy.', 'If it is an API usage error, `extends RuntimeException`: unchecked, and the most common today.'),
			],
		},
		{
			id: 'chain-wrap',
			chapter: 'custom',
			scene: 'chain',
			title: { es: 'Encadenar causas', en: 'Chaining causes' },
			subtitles: chainWrap.list,
			motion: {
				cues: [
					{ at: 0, do: 'enter', el: 'ch-hi' },
					{ at: 600, do: 'enter', el: 'ch-low' },
					{ at: chainWrap.start(1) + 100, do: 'type', el: 'ch-code', dur: 2200 },
					{ at: chainWrap.start(1) + 2600, do: 'enter', el: 'ch-e' },
					{ at: chainWrap.start(1) + 3000, do: 'move', el: 'ch-low', to: 'ch-slot', dur: 1500 },
					{ at: chainWrap.start(1) + 4700, do: 'pulse', el: 'ch-hi' },
					{ at: chainWrap.start(2) + 200, do: 'enter', el: 'ch-note' },
				],
			},
		},
		{
			id: 'chain-lost',
			chapter: 'custom',
			scene: 'chain',
			title: { es: 'Sin la causa, el trazo se corta', en: 'Without the cause, the trail is cut' },
			subtitles: chainLost.list,
			motion: {
				cues: [
					{ at: 0, do: 'exit', el: 'ch-low', dur: 500 },
					{ at: 0, do: 'exit', el: 'ch-code', dur: 400 },
					{ at: 0, do: 'exit', el: 'ch-e', dur: 400 },
					{ at: 0, do: 'exit', el: 'ch-note', dur: 400 },
					{ at: 600, do: 'type', el: 'ch-bad', dur: 1800 },
					{ at: 900, do: 'enter', el: 'ch-null' },
					{ at: chainLost.start(1) + 100, do: 'enter', el: 'ch-cut' },
					{ at: chainLost.start(1) + 1200, do: 'pulse', el: 'ch-cut' },
				],
			},
		},

		// ─── 8. Antipatterns ────────────────────────────────────────────────
		{
			id: 'anti-empty',
			chapter: 'anti',
			scene: 'anti',
			title: { es: 'El catch vacío', en: 'The empty catch' },
			subtitles: antiEmpty.list,
			motion: {
				cues: [
					{ at: 0, do: 'enter', el: 'an-t1' },
					{ at: 400, do: 'enter', el: 'an-c1' },
					{ at: 800, do: 'enter', el: 'an-v1' },
					{ at: 1200, do: 'enter', el: 'an-tok1' },
					{ at: 1900, do: 'move', el: 'an-tok1', to: 'an-c1', dur: 1500 },
					{ at: 3600, do: 'exit', el: 'an-tok1', dur: 700 },
					{ at: antiEmpty.start(1) + 200, do: 'enter', el: 'an-ok' },
					{ at: antiEmpty.start(1) + 1200, do: 'pulse', el: 'an-v1' },
					{ at: antiEmpty.start(2) + 300, do: 'pulse', el: 'an-c1' },
				],
			},
		},
		{
			id: 'anti-finally',
			chapter: 'anti',
			scene: 'anti',
			title: { es: 'return dentro de finally', en: 'return inside finally' },
			subtitles: antiFinally.list,
			motion: {
				cues: [
					{ at: 0, do: 'camera', to: ['an-t2', 'an-f2', 'an-v2'], dur: 1200, pad: 60 },
					{ at: 600, do: 'enter', el: 'an-t2' },
					{ at: 1000, do: 'enter', el: 'an-f2' },
					{ at: 1400, do: 'enter', el: 'an-v2' },
					{ at: antiFinally.start(1) + 200, do: 'enter', el: 'an-tok2' },
					{ at: antiFinally.start(1) + 900, do: 'move', el: 'an-tok2', to: 'an-f2', dur: 1500 },
					{ at: antiFinally.start(1) + 2600, do: 'pulse', el: 'an-f2' },
					{ at: antiFinally.start(1) + 2800, do: 'exit', el: 'an-tok2', dur: 700 },
					{ at: antiFinally.start(1) + 3600, do: 'pulse', el: 'an-v2' },
				],
			},
		},
		{
			id: 'anti-list',
			chapter: 'anti',
			scene: 'antis',
			show: '*',
			focus: ['an1', 'an2'],
			title: { es: 'Los cuatro antipatrones', en: 'The four antipatterns' },
			subtitles: [
				say('El `catch` vacío es el peor: traga el error y no deja ni un log.', 'The empty `catch` is the worst: it swallows the error and leaves no log at all.'),
				say('Capturar `Exception` de entrada atrapa también los bugs que querías que explotaran temprano.', 'Catching `Exception` up front also catches the bugs you wanted to blow up early.'),
				say('Capturá el tipo más específico que sepas manejar.', 'Catch the most specific type you know how to handle.'),
			],
		},
		{
			id: 'anti-flow',
			chapter: 'anti',
			scene: 'antis',
			show: '*',
			focus: ['an3'],
			title: { es: 'Excepciones como control de flujo', en: 'Exceptions as flow control' },
			code: code(
				'ControlDeFlujo.java',
				`// Mal: usa una excepción para algo que pasa todos los días
try {
    Usuario u = buscarUsuario(email);
    mostrar(u);
} catch (UsuarioNoEncontradoException e) {
    mostrarFormularioDeRegistro();
}

// Bien: null expresa "puede no haber" sin ninguna excepción
Usuario u = buscarUsuario(email);
if (u != null) {
    mostrar(u);
} else {
    mostrarFormularioDeRegistro();
}`,
				`// Bad: uses an exception for something that happens every day
try {
    Usuario u = buscarUsuario(email);
    mostrar(u);
} catch (UsuarioNoEncontradoException e) {
    mostrarFormularioDeRegistro();
}

// Good: null expresses "there may be none" without any exception
Usuario u = buscarUsuario(email);
if (u != null) {
    mostrar(u);
} else {
    mostrarFormularioDeRegistro();
}`,
			),
			subtitles: [
				say('Que un usuario no exista no es excepcional, es martes.', 'A user not existing is not exceptional, it is just Tuesday.'),
				say('Además lanzar excepciones es caro: construirlas implica capturar el stack trace completo.', 'Besides, throwing exceptions is expensive: building them means capturing the whole stack trace.'),
			],
		},

		// ─── 9. Common mistakes ─────────────────────────────────────────────
		{
			id: 'mistakes',
			chapter: 'mistakes',
			scene: 'mistakes12',
			show: '*',
			title: { es: 'Errores frecuentes', en: 'Common mistakes' },
			subtitles: [
				say('Un `catch` vacío, `catch (Exception e)` como primero y el `catch` general antes del específico.', 'An empty `catch`, `catch (Exception e)` first and the general `catch` before the specific one.'),
				say('Relanzar con `e.getMessage()` en vez de pasar la causa, y bloques `try` de cincuenta líneas.', 'Rethrowing with `e.getMessage()` instead of passing the cause, and fifty-line `try` blocks.'),
				say('Cerrar recursos a mano en `finally` y usar excepciones para casos normales.', 'Closing resources by hand in `finally` and using exceptions for normal cases.'),
			],
		},

		// ─── 10. Guided exercise ────────────────────────────────────────────
		{
			id: 'ex-brief',
			chapter: 'exercise',
			scene: 'exercise12',
			show: '*',
			title: { es: 'Desafío: validación de edad', en: 'Challenge: age validation' },
			subtitles: [
				say('Creá `EdadInvalidaException`, una `RuntimeException` que guarda la edad rechazada.', 'Create `EdadInvalidaException`, a `RuntimeException` that stores the rejected age.'),
				say('Un método `registrar` la lanza fuera de 0 a 120; otro convierte texto y traduce el error.', 'A `registrar` method throws it outside 0 to 120; another converts text and translates the error.'),
				say('En el `main`, probá tres casos y dejá constancia en un `finally`.', 'In `main`, try three cases and leave a record in a `finally`.'),
			],
		},
		{
			id: 'ex-exception',
			chapter: 'exercise',
			scene: 'exercise12',
			show: '*',
			focus: ['ex1'],
			title: { es: 'La excepción del dominio', en: 'The domain exception' },
			code: code(
				'EdadInvalidaException.java',
				`public class EdadInvalidaException extends RuntimeException {
    private final int edadRechazada;

    public EdadInvalidaException(int edadRechazada) {
        super("Edad inválida: " + edadRechazada + ". Debe estar entre 0 y 120.");
        this.edadRechazada = edadRechazada;
    }

    // Constructor con causa: para envolver otra excepción sin perderla
    public EdadInvalidaException(String mensaje, Throwable causa) {
        super(mensaje, causa);
        this.edadRechazada = -1;
    }

    public int getEdadRechazada() { return edadRechazada; }
}`,
				`public class EdadInvalidaException extends RuntimeException {
    private final int edadRechazada;

    public EdadInvalidaException(int edadRechazada) {
        super("Invalid age: " + edadRechazada + ". It must be between 0 and 120.");
        this.edadRechazada = edadRechazada;
    }

    // Constructor with a cause: to wrap another exception without losing it
    public EdadInvalidaException(String mensaje, Throwable causa) {
        super(mensaje, causa);
        this.edadRechazada = -1;
    }

    public int getEdadRechazada() { return edadRechazada; }
}`,
			),
			subtitles: [
				say('Es unchecked porque quien llama puede validar la edad antes: es un error de uso.', 'It is unchecked because the caller can validate the age first: it is a usage error.'),
				say('El segundo constructor recibe la causa para envolver otra excepción sin perderla.', 'The second constructor takes the cause to wrap another exception without losing it.'),
			],
		},
		{
			id: 'ex-register',
			chapter: 'exercise',
			scene: 'exercise12',
			show: '*',
			focus: ['ex2', 'ex3'],
			title: { es: 'registrar y registrarDesdeTexto', en: 'registrar and registrarDesdeTexto' },
			code: code(
				'RegistroDePersonas.java',
				`public class RegistroDePersonas {
    private static final int EDAD_MINIMA = 0;
    private static final int EDAD_MAXIMA = 120;

    public void registrar(String nombre, int edad) {
        if (nombre == null || nombre.isBlank()) {
            throw new IllegalArgumentException("El nombre es obligatorio");
        }
        if (edad < EDAD_MINIMA || edad > EDAD_MAXIMA) {
            throw new EdadInvalidaException(edad);
        }
        System.out.println("  ✓ Registrado: " + nombre + ", " + edad + " años");
    }

    public void registrarDesdeTexto(String nombre, String edadTexto) {
        int edad;
        try {
            edad = Integer.parseInt(edadTexto.trim());
        } catch (NumberFormatException e) {
            // Traducimos al lenguaje de NUESTRO dominio, sin perder la causa
            throw new EdadInvalidaException(
                "'" + edadTexto + "' no es un número válido para una edad", e);
        }
        registrar(nombre, edad);   // la regla del rango vive en un solo lugar
    }
}`,
				`public class RegistroDePersonas {
    private static final int EDAD_MINIMA = 0;
    private static final int EDAD_MAXIMA = 120;

    public void registrar(String nombre, int edad) {
        if (nombre == null || nombre.isBlank()) {
            throw new IllegalArgumentException("The name is required");
        }
        if (edad < EDAD_MINIMA || edad > EDAD_MAXIMA) {
            throw new EdadInvalidaException(edad);
        }
        System.out.println("  ✓ Registered: " + nombre + ", " + edad + " years old");
    }

    public void registrarDesdeTexto(String nombre, String edadTexto) {
        int edad;
        try {
            edad = Integer.parseInt(edadTexto.trim());
        } catch (NumberFormatException e) {
            // We translate into OUR domain language, without losing the cause
            throw new EdadInvalidaException(
                "'" + edadTexto + "' is not a valid number for an age", e);
        }
        registrar(nombre, edad);   // the range rule lives in a single place
    }
}`,
			),
			subtitles: [
				say('`registrar` es el único lugar donde vive la regla del rango.', '`registrar` is the only place where the range rule lives.'),
				say('`registrarDesdeTexto` traduce el `NumberFormatException` pero pasa `e` como causa.', '`registrarDesdeTexto` translates the `NumberFormatException` but passes `e` as the cause.'),
			],
		},
		{
			id: 'ex-run',
			chapter: 'exercise',
			scene: 'exercise12',
			show: '*',
			focus: ['ex4', 'ex5'],
			title: { es: 'Probar los tres casos', en: 'Trying the three cases' },
			code: code(
				'MainRegistro.java',
				`for (String[] intento : intentos) {
    System.out.println("Intentando registrar a " + intento[0] + "...");
    try {
        registro.registrarDesdeTexto(intento[0], intento[1]);
    } catch (EdadInvalidaException e) {
        System.out.println("  ✗ " + e.getMessage());
        if (e.getCause() != null) {
            System.out.println("    causa técnica: " + e.getCause());
        }
    } catch (IllegalArgumentException e) {
        System.out.println("  ✗ Dato inválido: " + e.getMessage());
    } finally {
        System.out.println("  — intento finalizado —\\n");
    }
}`,
				`for (String[] intento : intentos) {
    System.out.println("Trying to register " + intento[0] + "...");
    try {
        registro.registrarDesdeTexto(intento[0], intento[1]);
    } catch (EdadInvalidaException e) {
        System.out.println("  ✗ " + e.getMessage());
        if (e.getCause() != null) {
            System.out.println("    technical cause: " + e.getCause());
        }
    } catch (IllegalArgumentException e) {
        System.out.println("  ✗ Invalid data: " + e.getMessage());
    } finally {
        System.out.println("  — attempt finished —\\n");
    }
}`,
			),
			shell: {
				lines: [
					cmd('java MainRegistro'),
					out('Intentando registrar a Laura Giménez...'),
					out('  ✓ Registrado: Laura Giménez, 28 años'),
					out('  — intento finalizado —'),
					out('Intentando registrar a Carlos Ruiz...'),
					err('  ✗ Edad inválida: 150. Debe estar entre 0 y 120.'),
					out('  — intento finalizado —'),
					out('Intentando registrar a Ana Torres...'),
					err("  ✗ 'treinta' no es un número válido para una edad"),
					err('    causa técnica: java.lang.NumberFormatException: For input string: "treinta"'),
					out('  — intento finalizado —'),
				],
			},
			subtitles: [
				say('Un caso válido, una edad fuera de rango y un texto que no es número.', 'A valid case, an out-of-range age and a text that is not a number.'),
				say('El `finally` deja constancia en los tres, y la causa técnica sigue disponible para el log.', 'The `finally` leaves a record in all three, and the technical cause is still available for the log.'),
			],
		},

		// ─── Closing ────────────────────────────────────────────────────────
		{
			id: 'closing',
			chapter: 'closing',
			scene: 'closing12',
			show: '*',
			title: { es: 'Para llevarte', en: 'Takeaways' },
			subtitles: [
				say('Una excepción es un objeto; unchecked se evita, checked te obliga a decidir.', 'An exception is an object; unchecked is avoided, checked forces you to decide.'),
				say('El `finally` corre siempre, la excepción sube por la pila y `try-with-resources` cierra por vos.', 'The `finally` always runs, the exception travels up the stack and `try-with-resources` closes for you.'),
				say('Al relanzar pasá la causa, y recordá: un `catch` vacío es peor que no capturar nada.', 'When rethrowing, pass the cause, and remember: an empty `catch` is worse than not catching at all.'),
			],
		},
	],
};
