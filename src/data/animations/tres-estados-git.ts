import type { AnimationScript, MotionCue, Subtitle } from './types';

// "The journey of a file through Git's three areas": a short film (about two
// minutes) for the Git lesson "El principio con Git" (order: 1). It plays on a single
// persistent canvas (`data-scene="journey"` in
// `src/components/animaciones/tres-estados-git.astro`): the terminal session on the
// left, and on the right the three areas of Git side by side (Working Directory,
// Staging Area, repository) with one module per command in front of them. A version
// of `hola.txt` is a card that travels between the areas; a commit is a node with
// its short hash, message, author, date and parent. Magenta marks a change that is
// not saved yet (untracked, modified); violet marks what records it (staged, commit).

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

/** Fades several elements out at the same moment. */
const clear = (at: number, ...els: string[]): MotionCue[] => els.map((el) => ({ at, do: 'exit' as const, el, dur: 400 }));

/**
 * Runs the command on editor line `line`: types it, slides the bar to it, sends the
 * execution particle to its module and builds that module. Its lit state follows.
 */
const run = (at: number, line: number, lit = 700): MotionCue[] => [
	{ at, do: 'type', el: `ed-${line}`, dur: 500 },
	{ at, do: 'move', el: 'hl', to: `ln-${line}`, dur: 500 },
	{ at: at + 100, do: 'enter', el: `m-${line}` },
	{ at: at + 100, do: 'move', el: 'p', to: `a-m${line}`, dur: 700 },
	{ at: at + lit, do: 'enter', el: `on-${line}` },
];

/** Types a comment line of the session (an action outside Git, such as editing a file). */
const note = (at: number, line: number): MotionCue[] => [
	{ at, do: 'type', el: `ed-${line}`, dur: 600 },
	{ at, do: 'move', el: 'hl', to: `ln-${line}`, dur: 500 },
];

/** Types the rows of the output of the command on line `line`, one after the other. */
const output = (at: number, line: number, rows: number, gap = 260): MotionCue[] =>
	Array.from({ length: rows }, (_, index) => ({
		at: at + index * gap,
		do: 'type' as const,
		el: `o${line}-${index + 1}`,
		dur: Math.max(250, gap),
	}));

// ─── Captions ───────────────────────────────────────────────────────────────
const init = timed(
	say(
		'`git init` crea la carpeta oculta `.git`, donde Git guarda el historial.',
		'`git init` creates the hidden `.git` folder, where Git keeps the history.',
	),
	say(
		'Creas `hola.txt`: queda en el Working Directory, tus archivos en disco.',
		'You create `hello.txt`: it stays in the Working Directory, your files on disk.',
	),
	say(
		'`git status` lo lista en `Untracked files`: Git lo ve, pero aún no lo controla.',
		'`git status` lists it under `Untracked files`: seen, but not tracked yet.',
	),
);
const add = timed(
	say(
		'`git add hola.txt` lleva esta versión al Staging Area, el área de preparación.',
		'`git add hello.txt` takes this version to the Staging Area.',
	),
	say(
		'Ahí queda lo que elegiste para el próximo commit. Aún no es historial.',
		'It holds what you chose for the next commit. Not history yet.',
	),
);
const commit = timed(
	say(
		'`git commit -m` registra lo preparado en el repositorio como un commit.',
		'`git commit -m` records what is staged in the repository as a commit.',
	),
	say(
		'Un commit es una foto de los archivos: hash, autor, fecha, mensaje y padre.',
		'A commit is a snapshot of the files: hash, author, date, message and parent.',
	),
	say(
		'`edf5c7d` es su hash abreviado. Es el `root-commit`: el primero, sin padre.',
		'`c5b1fcb` is its short hash. It is the `root-commit`: the first one, with no parent.',
	),
);
const modify = timed(
	say(
		'Agregas una línea a `hola.txt`: `git status` lo marca `modified`, sin preparar.',
		'You add a line to `hello.txt`: `git status` marks it `modified`, not staged.',
	),
	say(
		'`git diff` compara el Working Directory contra el Staging Area.',
		'`git diff` compares the Working Directory against the Staging Area.',
	),
	say(
		'Muestra lo que aún no preparaste: `+Estoy aprendiendo Git`.',
		'It shows what you have not staged yet: `+I am learning Git`.',
	),
);
const staged = timed(
	say(
		'`git add` prepara el cambio: la línea nueva pasa al Staging Area.',
		'`git add` stages the change: the new line moves to the Staging Area.',
	),
	say(
		'`git diff --staged` compara el Staging Area contra el último commit.',
		'`git diff --staged` compares the Staging Area against the last commit.',
	),
	say(
		'Es lo que entrará en el próximo commit.',
		'That is what will go into the next commit.',
	),
);
const unstage = timed(
	say(
		'¿Preparaste algo por error? `git restore --staged hola.txt` lo saca del Staging Area.',
		'Staged by mistake? `git restore --staged hello.txt` takes it out of the Staging Area.',
	),
	say(
		'El cambio vuelve al Working Directory: el archivo conserva lo que escribiste.',
		'The change goes back to the Working Directory: the file keeps what you wrote.',
	),
	say(
		'Con `git add` vuelve a estar preparado.',
		'With `git add` it is staged again.',
	),
);
const chain = timed(
	say(
		'El segundo commit, `5904ec5`, guarda el hash de su padre: `edf5c7d`.',
		'The second commit, `24c9a2a`, stores the hash of its parent: `c5b1fcb`.',
	),
	say(
		'Así se encadena el historial. `HEAD -> main` marca el commit en el que estás.',
		'That is how the history is chained. `HEAD -> main` marks the commit you are on.',
	),
);
const log = timed(
	say(
		'`git log --oneline` muestra la cadena, del commit más reciente al primero.',
		'`git log --oneline` shows the chain, from the newest commit to the first.',
	),
	say(
		'Editar, `git add` y `git commit`: el ciclo de las tres zonas.',
		'Edit, `git add` and `git commit`: the three-area cycle.',
	),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'repo', label: { es: 'Un repositorio nuevo', en: 'A new repository' } },
		{ id: 'stage', label: { es: 'git add', en: 'git add' } },
		{ id: 'commit', label: { es: 'git commit', en: 'git commit' } },
		{ id: 'diff', label: { es: 'Las dos comparaciones', en: 'The two comparisons' } },
		{ id: 'unstage', label: { es: 'git restore --staged', en: 'git restore --staged' } },
		{ id: 'history', label: { es: 'El historial', en: 'The history' } },
	],
	steps: [
		// ─── Scene 1. A new repository ──────────────────────────────────────
		{
			id: 'init',
			chapter: 'repo',
			scene: 'journey',
			title: { es: 'Un archivo nuevo en el Working Directory', en: 'A new file in the Working Directory' },
			subtitles: init.list,
			motion: {
				cues: seq(
					shot(0, 'shot-all', 3000),
					{ at: 200, do: 'enter', el: 'z-wd' },
					{ at: 400, do: 'enter', el: 'hl' },
					{ at: 500, do: 'enter', el: 'p' },
					...run(600, 1),
					{ at: 1400, do: 'enter', el: 'z-repo' },
					{ at: 1700, do: 'enter', el: 'z-st' },
					...output(1500, 1, 1, 900),
					{ at: 2400, do: 'enter', el: 'repo-on' },
					{ at: 3200, do: 'pulse', el: 'z-repo' },
					...clear(init.start(1), 'on-1', 'repo-on'),
					shot(init.start(1), 'shot-wd', 2200),
					...note(init.start(1) + 200, 2),
					{ at: init.start(1) + 900, do: 'enter', el: 'disk' },
					{ at: init.start(1) + 1300, do: 'enter', el: 'c1' },
					{ at: init.start(1) + 1500, do: 'enter', el: 'wd-on' },
					{ at: init.start(1) + 2400, do: 'pulse', el: 'c1' },
					...run(init.start(2), 3),
					...clear(init.start(2) + 600, 'out-1'),
					...output(init.start(2) + 800, 3, 4),
					{ at: init.start(2) + 1300, do: 'enter', el: 'st-untracked' },
					{ at: init.start(2) + 2400, do: 'pulse', el: 'st-untracked' },
				),
			},
		},

		// ─── Scene 2. git add ───────────────────────────────────────────────
		{
			id: 'add',
			chapter: 'stage',
			scene: 'journey',
			title: { es: 'git add prepara el próximo commit', en: 'git add prepares the next commit' },
			subtitles: add.list,
			motion: {
				cues: seq(
					...clear(0, 'on-3', 'wd-on'),
					...run(200, 4),
					...clear(800, 'out-3'),
					{ at: 1000, do: 'exit', el: 'st-untracked', dur: 400 },
					{ at: 1000, do: 'draw', el: 'fl-add', dur: 1000 },
					{ at: 1100, do: 'move', el: 'c1', to: 'a-st', dur: 1200 },
					{ at: 2300, do: 'enter', el: 'st-on' },
					{ at: 2500, do: 'enter', el: 'st-staged' },
					{ at: add.start(1) + 200, do: 'flow', el: 'fl-add' },
					{ at: add.start(1) + 600, do: 'pulse', el: 'c1' },
					{ at: add.start(1) + 1800, do: 'pulse', el: 'st-staged' },
					{ at: add.start(1) + 2800, do: 'pulse', el: 'z-st' },
				),
			},
		},

		// ─── Scene 3. git commit ────────────────────────────────────────────
		{
			id: 'commit',
			chapter: 'commit',
			scene: 'journey',
			title: { es: 'Un commit en el repositorio', en: 'A commit in the repository' },
			subtitles: commit.list,
			motion: {
				cues: seq(
					...clear(0, 'on-4', 'fl-add'),
					shot(0, 'shot-repo', 2200),
					...run(300, 5),
					{ at: 1100, do: 'draw', el: 'fl-commit', dur: 1000 },
					{ at: 1200, do: 'move', el: 'c1', to: 'a-repo', dur: 1200 },
					{ at: 1300, do: 'exit', el: 'st-staged', dur: 400 },
					{ at: 1500, do: 'exit', el: 'st-on', dur: 400 },
					...output(1400, 5, 3),
					{ at: 2400, do: 'exit', el: 'c1', dur: 300 },
					{ at: 2500, do: 'enter', el: 'n1' },
					{ at: 2600, do: 'enter', el: 'repo-on' },
					{ at: commit.start(1) + 300, do: 'pulse', el: 'n1' },
					{ at: commit.start(1) + 700, do: 'enter', el: 'lb-snap' },
					{ at: commit.start(1) + 2200, do: 'pulse', el: 'lb-snap' },
					{ at: commit.start(2) + 300, do: 'enter', el: 'lb-root' },
					{ at: commit.start(2) + 1400, do: 'pulse', el: 'lb-root' },
					{ at: commit.start(2) + 2400, do: 'pulse', el: 'n1' },
				),
			},
		},

		// ─── Scene 4. The two comparisons ───────────────────────────────────
		{
			id: 'modify',
			chapter: 'diff',
			scene: 'journey',
			title: { es: 'git diff: lo que todavía no preparaste', en: 'git diff: what you have not staged yet' },
			subtitles: modify.list,
			motion: {
				cues: seq(
					...clear(0, 'on-5', 'fl-commit', 'lb-snap', 'lb-root', 'repo-on'),
					shot(0, 'shot-cmp', 2400),
					...note(300, 6),
					{ at: 800, do: 'pulse', el: 'disk' },
					{ at: 1000, do: 'enter', el: 'c2' },
					{ at: 1100, do: 'enter', el: 'wd-on' },
					...run(1700, 7),
					...clear(2100, 'out-5'),
					...output(2300, 7, 3),
					{ at: 2700, do: 'enter', el: 'st-modified' },
					...run(modify.start(1), 8),
					...clear(modify.start(1) + 400, 'out-7'),
					{ at: modify.start(1) + 800, do: 'draw', el: 'cmp-wd', dur: 1000 },
					{ at: modify.start(1) + 1200, do: 'enter', el: 'lb-diff' },
					...output(modify.start(1) + 900, 8, 6, 220),
					{ at: modify.start(2) + 200, do: 'flow', el: 'cmp-wd' },
					{ at: modify.start(2) + 700, do: 'pulse', el: 'c2' },
					{ at: modify.start(2) + 1800, do: 'pulse', el: 'lb-diff' },
				),
			},
		},
		{
			id: 'staged',
			chapter: 'diff',
			scene: 'journey',
			title: { es: 'git diff --staged: lo que entrará', en: 'git diff --staged: what will go in' },
			subtitles: staged.list,
			motion: {
				cues: seq(
					...clear(0, 'on-7', 'on-8', 'cmp-wd', 'lb-diff', 'wd-on'),
					...run(200, 9),
					...clear(700, 'out-8'),
					{ at: 900, do: 'exit', el: 'st-modified', dur: 400 },
					{ at: 1000, do: 'move', el: 'c2', to: 'a-st', dur: 1200 },
					{ at: 2200, do: 'enter', el: 'st-on' },
					{ at: 2400, do: 'enter', el: 'st-staged' },
					...run(staged.start(1), 10),
					{ at: staged.start(1) + 800, do: 'draw', el: 'cmp-st', dur: 1000 },
					{ at: staged.start(1) + 1200, do: 'enter', el: 'lb-staged' },
					...output(staged.start(1) + 900, 10, 6, 220),
					{ at: staged.start(2) + 200, do: 'flow', el: 'cmp-st' },
					{ at: staged.start(2) + 700, do: 'pulse', el: 'c2' },
					{ at: staged.start(2) + 1500, do: 'pulse', el: 'n1' },
				),
			},
		},

		// ─── Scene 5. git restore --staged ──────────────────────────────────
		{
			id: 'unstage',
			chapter: 'unstage',
			scene: 'journey',
			title: { es: 'Sacar un cambio del Staging Area', en: 'Taking a change out of the Staging Area' },
			subtitles: unstage.list,
			motion: {
				cues: seq(
					...clear(0, 'on-9', 'on-10', 'cmp-st', 'lb-staged'),
					shot(0, 'shot-wd', 2000),
					...run(300, 11),
					...clear(800, 'out-10'),
					{ at: 1000, do: 'draw', el: 'fl-back', dur: 1100 },
					{ at: 1100, do: 'exit', el: 'st-staged', dur: 400 },
					{ at: 1200, do: 'move', el: 'c2', to: 'a-wd', dur: 1300 },
					{ at: 1300, do: 'exit', el: 'st-on', dur: 400 },
					{ at: unstage.start(1) + 100, do: 'enter', el: 'st-modified' },
					{ at: unstage.start(1) + 300, do: 'enter', el: 'wd-on' },
					{ at: unstage.start(1) + 500, do: 'flow', el: 'fl-back' },
					{ at: unstage.start(1) + 900, do: 'pulse', el: 'c2' },
					{ at: unstage.start(1) + 2200, do: 'pulse', el: 'disk' },
					...clear(unstage.start(2), 'on-11', 'fl-back'),
					...run(unstage.start(2) + 200, 12),
					{ at: unstage.start(2) + 900, do: 'exit', el: 'st-modified', dur: 400 },
					{ at: unstage.start(2) + 900, do: 'exit', el: 'wd-on', dur: 400 },
					{ at: unstage.start(2) + 1000, do: 'move', el: 'c2', to: 'a-st', dur: 1100 },
					{ at: unstage.start(2) + 2100, do: 'enter', el: 'st-on' },
					{ at: unstage.start(2) + 2300, do: 'enter', el: 'st-staged' },
				),
			},
		},

		// ─── Scene 6. The history ───────────────────────────────────────────
		{
			id: 'chain',
			chapter: 'history',
			scene: 'journey',
			title: { es: 'Cada commit apunta a su padre', en: 'Each commit points to its parent' },
			subtitles: chain.list,
			motion: {
				cues: seq(
					...clear(0, 'on-12'),
					shot(0, 'shot-hist', 2400),
					{ at: 300, do: 'enter', el: 'head' },
					...run(500, 13),
					{ at: 1300, do: 'draw', el: 'fl-commit2', dur: 1000 },
					{ at: 1400, do: 'move', el: 'c2', to: 'a-repo2', dur: 1200 },
					{ at: 1500, do: 'exit', el: 'st-staged', dur: 400 },
					{ at: 1600, do: 'exit', el: 'st-on', dur: 400 },
					...output(1600, 13, 2),
					{ at: 2600, do: 'exit', el: 'c2', dur: 300 },
					{ at: 2700, do: 'enter', el: 'n2' },
					{ at: 2800, do: 'enter', el: 'repo-on' },
					{ at: 3300, do: 'draw', el: 'link', dur: 800 },
					// HEAD fades from the first commit to the new one instead of sliding across it.
					{ at: 2300, do: 'exit', el: 'head', dur: 300 },
					{ at: 2700, do: 'move', el: 'head', to: 'a-head-2', dur: 100 },
					{ at: 3000, do: 'enter', el: 'head' },
					{ at: chain.start(1) + 200, do: 'flow', el: 'link' },
					{ at: chain.start(1) + 500, do: 'pulse', el: 'n1' },
					{ at: chain.start(1) + 1600, do: 'pulse', el: 'head' },
					{ at: chain.start(1) + 2600, do: 'pulse', el: 'n2' },
				),
			},
		},
		{
			id: 'log',
			chapter: 'history',
			scene: 'journey',
			title: { es: 'git log: la cadena de commits', en: 'git log: the chain of commits' },
			subtitles: log.list,
			motion: {
				cues: seq(
					...clear(0, 'on-13', 'fl-commit2'),
					...run(200, 14),
					...clear(600, 'out-13'),
					...output(800, 14, 2, 500),
					{ at: 1500, do: 'pulse', el: 'n2' },
					{ at: 2300, do: 'pulse', el: 'n1' },
					{ at: 3000, do: 'pulse', el: 'link' },
					shot(log.start(1), 'shot-all', 3000),
					{ at: log.start(1) + 300, do: 'draw', el: 'fl-cycle', dur: 1600 },
					{ at: log.start(1) + 500, do: 'enter', el: 'wd-on' },
					{ at: log.start(1) + 1100, do: 'enter', el: 'st-on' },
					{ at: log.start(1) + 1500, do: 'enter', el: 'r-cycle' },
					{ at: log.start(1) + 1900, do: 'flow', el: 'fl-cycle' },
					{ at: log.start(1) + 2400, do: 'pulse', el: 'r-cycle' },
				),
			},
		},
	],
};
