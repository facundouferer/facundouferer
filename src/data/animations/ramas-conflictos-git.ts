import type { AnimationScript, MotionCue, Subtitle } from './types';

// "The journey of two branches": a short film (about two minutes) for the Git
// lesson "Ramas, fusión y conflictos" (`git/conflictos`, file `03-conflictos`). It
// plays on a single persistent canvas (`data-scene="journey"` in
// `src/components/animaciones/ramas-conflictos-git.astro`): the terminal session on
// the left and, on the right, an isometric repository where every commit is the same
// rounded node with its short hash, every branch the same label and `HEAD` the same
// marker. Labels slide from commit to commit; the graph only grows. Magenta marks the
// problem (the conflict), violet what resolves it (merge commits and the resolution).
// Names, messages and hashes are the lesson's, localized the way the lesson does.

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

type Page = 'a' | 'b' | 'c';

/** Types one line of a terminal page (`ea`, `eb` or `ec`). */
const type = (at: number, page: Page, line: number, dur = 500): MotionCue => ({ at, do: 'type', el: `e${page}-${line}`, dur });

/**
 * Runs one command: the editor bar slides to its line, the line is typed, the
 * execution particle flies to the command's module and the module lights up.
 */
const run = (at: number, page: Page, line: number): MotionCue[] => [
	{ at, do: 'move', el: 'hl', to: `ln-${line}`, dur: 450 },
	type(at + 100, page, line),
	{ at, do: 'move', el: 'p', to: `a-m-${page}${line}`, dur: 650 },
	{ at: at + 600, do: 'enter', el: `m-${page}${line}-on`, dur: 400 },
];

/** Slides a branch label to one of the two label slots above (or below) a commit. */
const label = (at: number, el: string, commit: string, slot: 1 | 2, dur = 900): MotionCue => ({
	at,
	do: 'move',
	el,
	to: `a-${commit}-${slot}`,
	dur,
});

/** Moves `HEAD` next to the label it points to. */
const head = (at: number, commit: string, slot: 1 | 2, dur = 900): MotionCue => ({
	at,
	do: 'move',
	el: 'head',
	to: `a-${commit}-h${slot}`,
	dur,
});

/** Fades several elements in or out at the same moment. */
const show = (at: number, ...els: string[]): MotionCue[] => els.map((el, index) => ({ at: at + index * 90, do: 'enter' as const, el, dur: 500 }));
const clear = (at: number, ...els: string[]): MotionCue[] => els.map((el) => ({ at, do: 'exit' as const, el, dur: 400 }));

// Commands of each terminal page (the lines that have a module in the scene).
const COMMANDS: Record<Page, number[]> = {
	a: [1, 3, 5, 6, 8, 9, 12],
	b: [1, 2, 3, 4, 5, 6, 7, 9],
	c: [1, 2, 3, 4, 5, 6, 7, 10, 11, 13],
};
const modules = (page: Page) => COMMANDS[page].map((line) => `m-${page}${line}`);
const lits = (page: Page) => COMMANDS[page].map((line) => `m-${page}${line}-on`);

// ─── Captions ───────────────────────────────────────────────────────────────
const pointer = timed(
	say(
		'La rama `main` no copia archivos: es un puntero móvil sobre el commit `954f1dd`.',
		'The `main` branch copies no files: it is a movable pointer on commit `84e98ce`.',
	),
	say(
		'`HEAD` marca dónde estás; `git branch` lo indica con `* main`.',
		'`HEAD` marks where you are; `git branch` shows it as `* main`.',
	),
);
const create = timed(
	say(
		'`git switch -c despedida` crea la rama en el commit actual y te cambia a ella.',
		'`git switch -c farewell` creates the branch at the current commit and switches to it.',
	),
	say(
		'Dos etiquetas sobre el mismo commit, y `HEAD` pasó a `despedida`.',
		'Two labels on the same commit, and `HEAD` moved to `farewell`.',
	),
);
const advance = timed(
	say(
		'`git add` y `git commit`: nace `54f85d4` y avanza solo la rama de `HEAD`.',
		'`git add` and `git commit`: `1c21b09` is born; only the `HEAD` branch moves.',
	),
	say(
		'`git switch main` lleva `HEAD` de vuelta: `main` sigue en el commit anterior.',
		'`git switch main` takes `HEAD` back: `main` is still on the previous commit.',
	),
);
const ff = timed(
	say(
		'`git merge despedida` desde `main`: `main` no tiene commits propios.',
		'`git merge farewell` from `main`: `main` has no commits of its own.',
	),
	say(
		'Git solo adelanta el puntero: es un fast-forward y no crea ningún commit.',
		'Git only moves the pointer forward: a fast-forward creates no commit.',
	),
	say(
		'`git branch -d despedida` borra la etiqueta; el commit queda.',
		'`git branch -d farewell` deletes the label; the commit stays.',
	),
);
const diverge = timed(
	say(
		'`git switch -c autor` y un commit: nace `2cf59a0` y `autor` avanza.',
		'`git switch -c author` and a commit: `c236346` is born, `author` moves.',
	),
	say('En `main`, otro commit en `despedida.txt`: `5d789cf`.', 'On `main`, another commit on `farewell.txt`: `e4fe6bd`.'),
	say(
		'Divergieron: cada rama tiene un commit que la otra no tiene.',
		'They diverged: each branch has a commit the other lacks.',
	),
);
const merge = timed(
	say(
		'`git merge autor` compara las dos puntas con su ancestro común, `54f85d4`.',
		'`git merge author` compares both tips with their common ancestor, `1c21b09`.',
	),
	say(
		'Combina los cambios en un merge commit: un commit con dos padres.',
		'It combines the changes in a merge commit: a commit with two parents.',
	),
	say(
		'`main` avanza al merge commit; `git branch -d autor` borra la etiqueta que sobra.',
		'`main` moves to the merge commit; `git branch -d author` drops the extra label.',
	),
);
const conflict = timed(
	say(
		'`saludo-formal` y `main` cambian la misma línea de `saludo.txt`.',
		'`formal-greeting` and `main` change the same line of `greeting.txt`.',
	),
	say(
		'Git no adivina cuál es la buena: detiene la fusión con `CONFLICT`.',
		'Git does not guess the right one: it stops the merge with `CONFLICT`.',
	),
	say('En el archivo deja las dos versiones entre marcadores.', 'In the file it leaves both versions between markers.'),
);
const resolve = timed(
	say(
		'Decides el texto final y borras los marcadores: `Buenos días, mundo entero`.',
		'You pick the final text and delete the markers: `Good morning, whole world`.',
	),
	say(
		'`git add` lo marca como resuelto; `git commit` cierra la fusión con un merge commit.',
		'`git add` marks it as resolved; `git commit` finishes the merge with a merge commit.',
	),
	say(
		'`git branch -d saludo-formal` borra la etiqueta; los commits quedan en el grafo.',
		'`git branch -d formal-greeting` deletes the label; the commits stay in the graph.',
	),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'pointers', label: { es: 'Ramas y HEAD', en: 'Branches and HEAD' } },
		{ id: 'branch', label: { es: 'Crear una rama', en: 'Creating a branch' } },
		{ id: 'fastforward', label: { es: 'Fast-forward', en: 'Fast-forward' } },
		{ id: 'threeway', label: { es: 'Merge commit', en: 'Merge commit' } },
		{ id: 'conflict', label: { es: 'Conflicto', en: 'Conflict' } },
		{ id: 'resolve', label: { es: 'Resolver', en: 'Resolving' } },
	],
	steps: [
		// ─── Scene 1. Branches and HEAD ─────────────────────────────────────
		{
			id: 'pointer',
			chapter: 'pointers',
			scene: 'journey',
			title: { es: 'Una rama apunta a un commit', en: 'A branch points to a commit' },
			subtitles: pointer.list,
			motion: {
				cues: seq(
					shot(0, 'shot-start', 3600),
					{ at: 200, do: 'enter', el: 'floor-repo' },
					{ at: 500, do: 'enter', el: 'floor-term' },
					{ at: 900, do: 'enter', el: 'c-a' },
					{ at: 1100, do: 'enter', el: 'fv-saludo' },
					{ at: 1500, do: 'enter', el: 't-main' },
					...show(2000, ...modules('a')),
					{ at: 2700, do: 'pulse', el: 't-main' },
					{ at: 3200, do: 'enter', el: 'lb-pointer' },
					{ at: 4300, do: 'pulse', el: 'c-a' },
					{ at: pointer.start(1), do: 'exit', el: 'lb-pointer', dur: 400 },
					{ at: pointer.start(1) + 200, do: 'enter', el: 'head' },
					{ at: pointer.start(1) + 600, do: 'enter', el: 'hl' },
					{ at: pointer.start(1) + 600, do: 'enter', el: 'p' },
					...run(pointer.start(1) + 900, 'a', 1),
					type(pointer.start(1) + 1700, 'a', 2, 300),
					{ at: pointer.start(1) + 2300, do: 'pulse', el: 'head' },
					{ at: pointer.start(1) + 2900, do: 'pulse', el: 't-main' },
				),
			},
		},

		// ─── Scene 2. Creating a branch ─────────────────────────────────────
		{
			id: 'create',
			chapter: 'branch',
			scene: 'journey',
			title: { es: 'git switch -c crea y cambia', en: 'git switch -c creates and switches' },
			subtitles: create.list,
			motion: {
				cues: seq(
					...run(200, 'a', 3),
					type(900, 'a', 4, 600),
					{ at: 1100, do: 'enter', el: 't-desp' },
					head(1800, 'a', 2, 1000),
					{ at: 2900, do: 'pulse', el: 't-desp' },
					{ at: create.start(1) + 300, do: 'pulse', el: 'c-a' },
					{ at: create.start(1) + 1000, do: 'pulse', el: 't-main' },
					{ at: create.start(1) + 1700, do: 'pulse', el: 't-desp' },
					{ at: create.start(1) + 2500, do: 'pulse', el: 'head' },
				),
			},
		},
		{
			id: 'advance',
			chapter: 'branch',
			scene: 'journey',
			title: { es: 'Un commit hace avanzar la rama', en: 'A commit moves the branch forward' },
			subtitles: advance.list,
			motion: {
				cues: seq(
					shot(0, 'shot-a', 2600),
					{ at: 0, do: 'exit', el: 'fv-saludo', dur: 400 },
					{ at: 400, do: 'enter', el: 'fv-desp' },
					...run(900, 'a', 5),
					...run(1700, 'a', 6),
					{ at: 2300, do: 'draw', el: 'e-ab', dur: 700 },
					{ at: 2800, do: 'enter', el: 'c-b' },
					label(3100, 't-desp', 'b', 1),
					head(3100, 'b', 1),
					type(3300, 'a', 7, 600),
					{ at: 4300, do: 'pulse', el: 'c-b' },
					...run(advance.start(1), 'a', 8),
					{ at: advance.start(1) + 600, do: 'exit', el: 'fv-desp', dur: 400 },
					head(advance.start(1) + 700, 'a', 1, 1100),
					{ at: advance.start(1) + 2200, do: 'pulse', el: 't-main' },
					{ at: advance.start(1) + 3000, do: 'pulse', el: 'c-a' },
				),
			},
		},

		// ─── Scene 3. Fast-forward ──────────────────────────────────────────
		{
			id: 'ff',
			chapter: 'fastforward',
			scene: 'journey',
			title: { es: 'Fast-forward: solo se mueve el puntero', en: 'Fast-forward: only the pointer moves' },
			subtitles: ff.list,
			motion: {
				cues: seq(
					...run(200, 'a', 9),
					type(1000, 'a', 10, 500),
					type(1500, 'a', 11, 300),
					label(1700, 't-main', 'b', 2, 1500),
					head(1700, 'b', 2, 1500),
					{ at: ff.start(1) + 200, do: 'enter', el: 'lb-ff' },
					{ at: ff.start(1) + 1200, do: 'pulse', el: 't-main' },
					{ at: ff.start(1) + 2200, do: 'pulse', el: 'c-b' },
					{ at: ff.start(1) + 3200, do: 'pulse', el: 'lb-ff' },
					{ at: ff.start(2), do: 'exit', el: 'lb-ff', dur: 400 },
					...run(ff.start(2) + 200, 'a', 12),
					type(ff.start(2) + 900, 'a', 13, 500),
					{ at: ff.start(2) + 1200, do: 'exit', el: 't-desp', dur: 500 },
					label(ff.start(2) + 1800, 't-main', 'b', 1, 800),
					head(ff.start(2) + 1800, 'b', 1, 800),
					{ at: ff.start(2) + 2700, do: 'pulse', el: 'c-b' },
				),
			},
		},

		// ─── Scene 4. Merge commit ──────────────────────────────────────────
		{
			id: 'diverge',
			chapter: 'threeway',
			scene: 'journey',
			title: { es: 'Las dos ramas avanzan', en: 'Both branches move forward' },
			subtitles: diverge.list,
			motion: {
				cues: seq(
					shot(0, 'shot-b', 2800),
					...clear(0, 'ea', ...modules('a'), ...lits('a')),
					{ at: 300, do: 'enter', el: 'eb' },
					...show(400, ...modules('b')),
					...run(1100, 'b', 1),
					{ at: 1600, do: 'enter', el: 't-autor' },
					head(1900, 'b', 2, 800),
					{ at: 2300, do: 'enter', el: 'fv-autor' },
					...run(2700, 'b', 2),
					...run(3300, 'b', 3),
					{ at: 3900, do: 'draw', el: 'e-bd', dur: 700 },
					{ at: 4300, do: 'enter', el: 'c-d' },
					label(4500, 't-autor', 'd', 1),
					head(4500, 'd', 1),
					...run(diverge.start(1), 'b', 4),
					{ at: diverge.start(1) + 400, do: 'exit', el: 'fv-autor', dur: 400 },
					head(diverge.start(1) + 500, 'b', 1),
					{ at: diverge.start(1) + 1000, do: 'enter', el: 'fv-desp2' },
					...run(diverge.start(1) + 1600, 'b', 5),
					...run(diverge.start(1) + 2200, 'b', 6),
					{ at: diverge.start(1) + 2800, do: 'draw', el: 'e-bc', dur: 700 },
					{ at: diverge.start(1) + 3200, do: 'enter', el: 'c-c' },
					label(diverge.start(1) + 3400, 't-main', 'c', 1),
					head(diverge.start(1) + 3400, 'c', 1),
					{ at: diverge.start(2) + 300, do: 'pulse', el: 'c-c' },
					{ at: diverge.start(2) + 1100, do: 'pulse', el: 'c-d' },
				),
			},
		},
		{
			id: 'merge',
			chapter: 'threeway',
			scene: 'journey',
			title: { es: 'Un merge commit con dos padres', en: 'A merge commit with two parents' },
			subtitles: merge.list,
			motion: {
				cues: seq(
					{ at: 0, do: 'exit', el: 'fv-desp2', dur: 400 },
					...run(200, 'b', 7),
					{ at: 1000, do: 'enter', el: 'c-b-anc' },
					{ at: 1300, do: 'enter', el: 'lb-anc' },
					{ at: 1700, do: 'pulse', el: 'c-c' },
					{ at: 1700, do: 'pulse', el: 'c-d' },
					{ at: 2600, do: 'pulse', el: 'c-b-anc' },
					{ at: merge.start(1) + 200, do: 'draw', el: 'e-cm1', dur: 900 },
					{ at: merge.start(1) + 200, do: 'draw', el: 'e-dm1', dur: 900 },
					{ at: merge.start(1) + 900, do: 'enter', el: 'c-m1' },
					type(merge.start(1) + 1100, 'b', 8, 600),
					{ at: merge.start(1) + 1500, do: 'enter', el: 'lb-two' },
					{ at: merge.start(1) + 2600, do: 'pulse', el: 'lb-two' },
					label(merge.start(2) + 200, 't-main', 'm1', 1, 1200),
					head(merge.start(2) + 200, 'm1', 1, 1200),
					...run(merge.start(2) + 1600, 'b', 9),
					type(merge.start(2) + 2300, 'b', 10, 500),
					{ at: merge.start(2) + 2600, do: 'exit', el: 't-autor', dur: 500 },
					{ at: merge.start(2) + 3300, do: 'pulse', el: 'c-d' },
				),
			},
		},

		// ─── Scene 5. Conflict ──────────────────────────────────────────────
		{
			id: 'conflict',
			chapter: 'conflict',
			scene: 'journey',
			title: { es: 'La misma línea en dos ramas', en: 'The same line on two branches' },
			subtitles: conflict.list,
			motion: {
				cues: seq(
					shot(0, 'shot-c', 2800),
					...clear(0, 'eb', ...modules('b'), ...lits('b'), 'lb-anc', 'lb-two', 'c-b-anc'),
					{ at: 200, do: 'enter', el: 'ec' },
					...show(250, ...modules('c')).map((cue) => ({ ...cue, at: cue.at - (cue.at - 250) / 2 })),
					...run(700, 'c', 1),
					{ at: 1000, do: 'enter', el: 't-formal' },
					head(1200, 'm1', 2, 600),
					{ at: 1400, do: 'enter', el: 'fv-formal' },
					...run(1700, 'c', 2),
					...run(2100, 'c', 3),
					{ at: 2500, do: 'draw', el: 'e-m1e', dur: 500 },
					{ at: 2700, do: 'enter', el: 'c-e' },
					label(2800, 't-formal', 'e', 1, 700),
					head(2800, 'e', 1, 700),
					...run(3400, 'c', 4),
					{ at: 3600, do: 'exit', el: 'fv-formal', dur: 400 },
					head(3700, 'm1', 1, 700),
					{ at: 3900, do: 'enter', el: 'fv-amplia' },
					...run(4200, 'c', 5),
					...run(4600, 'c', 6),
					{ at: 5000, do: 'draw', el: 'e-m1f', dur: 500 },
					{ at: 5200, do: 'enter', el: 'c-f' },
					label(5300, 't-main', 'f', 1, 700),
					head(5300, 'f', 1, 700),
					...run(conflict.start(1) + 900, 'c', 7),
					{ at: conflict.start(1) + 1500, do: 'enter', el: 'g-m2', dur: 700 },
					type(conflict.start(1) + 1700, 'c', 8, 500),
					type(conflict.start(1) + 2200, 'c', 9, 600),
					{ at: conflict.start(1) + 2300, do: 'enter', el: 'c-m2-wait' },
					{ at: conflict.start(1) + 2500, do: 'enter', el: 'hxc-8' },
					{ at: conflict.start(1) + 2900, do: 'enter', el: 'lb-conflict' },
					{ at: conflict.start(1) + 3700, do: 'pulse', el: 'c-m2-wait' },
					{ at: conflict.start(2), do: 'exit', el: 'fv-amplia', dur: 400 },
					{ at: conflict.start(2) + 300, do: 'enter', el: 'fv-markers' },
					...[1, 2, 3, 4, 5].map((row): MotionCue => ({ at: conflict.start(2) + 300 + row * 330, do: 'type', el: `fvm-${row}`, dur: 300 })),
					{ at: conflict.start(2) + 2400, do: 'pulse', el: 'fv-markers' },
					{ at: conflict.start(2) + 3200, do: 'pulse', el: 'lb-conflict' },
				),
			},
		},

		// ─── Scene 6. Resolving ─────────────────────────────────────────────
		{
			id: 'resolve',
			chapter: 'resolve',
			scene: 'journey',
			title: { es: 'git add y git commit cierran la fusión', en: 'git add and git commit finish the merge' },
			subtitles: resolve.list,
			motion: {
				cues: seq(
					{ at: 300, do: 'exit', el: 'fv-markers', dur: 500 },
					{ at: 900, do: 'enter', el: 'fv-final' },
					{ at: 2000, do: 'pulse', el: 'fv-final' },
					{ at: 3200, do: 'pulse', el: 'c-m2-wait' },
					...run(resolve.start(1), 'c', 10),
					{ at: resolve.start(1) + 700, do: 'exit', el: 'lb-conflict', dur: 400 },
					{ at: resolve.start(1) + 900, do: 'enter', el: 'lb-resolved' },
					...run(resolve.start(1) + 1900, 'c', 11),
					{ at: resolve.start(1) + 2500, do: 'enter', el: 'hvc-11' },
					type(resolve.start(1) + 2600, 'c', 12, 600),
					{ at: resolve.start(1) + 2600, do: 'exit', el: 'c-m2-wait', dur: 400 },
					{ at: resolve.start(1) + 2600, do: 'exit', el: 'g-m2', dur: 400 },
					{ at: resolve.start(1) + 2700, do: 'draw', el: 'e-m2', dur: 900 },
					{ at: resolve.start(1) + 3100, do: 'enter', el: 'c-m2' },
					label(resolve.start(1) + 3300, 't-main', 'm2', 1, 1000),
					head(resolve.start(1) + 3300, 'm2', 1, 1000),
					{ at: resolve.start(2), do: 'exit', el: 'lb-resolved', dur: 400 },
					...run(resolve.start(2) + 200, 'c', 13),
					type(resolve.start(2) + 900, 'c', 14, 600),
					{ at: resolve.start(2) + 1200, do: 'exit', el: 't-formal', dur: 500 },
					shot(resolve.start(2) + 1400, 'shot-all', 3200),
					{ at: resolve.start(2) + 2600, do: 'flow', el: 'e-m2' },
					{ at: resolve.start(2) + 3000, do: 'pulse', el: 'c-m1' },
					{ at: resolve.start(2) + 3500, do: 'pulse', el: 'c-m2' },
					{ at: resolve.start(2) + 4000, do: 'pulse', el: 't-main' },
				),
			},
		},
	],
};
