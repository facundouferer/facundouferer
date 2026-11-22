import type { AnimationScript, MotionCue, Subtitle } from './types';

// "The journey of a Pull Request": a short film (about two minutes) for the Git
// lesson "Ramas y Pull Requests" (order: 5). It plays on a single persistent
// canvas (`data-scene="journey"` in `src/components/animaciones/pull-requests-git.astro`):
// Ana's terminal on the left, and on the right two isometric floors, GitHub on top
// and Ana's clone below, each holding its commit graph. A commit is always the
// same coin with its short hash; a push lifts it from Ana's floor to GitHub, a
// fetch or pull drops it from GitHub to Ana's. Magenta marks the problem (`main`
// moved, the conflict in `menu.html`); violet marks what handles or resolves it
// (the Pull Request, the resolution, the merge).

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
 * Runs one terminal command: types its line in the editor, slides the bar to it,
 * sends the execution particle to the module of that line and lights the module.
 */
const exec = (at: number, line: number): MotionCue[] => [
	{ at, do: 'type', el: `e-${line}`, dur: 500 },
	{ at: at + 300, do: 'move', el: 'hl', to: `ln-${line}`, dur: 500 },
	{ at: at + 300, do: 'move', el: 'p', to: `a-m${line}`, dur: 700 },
	{ at: at + 1000, do: 'enter', el: `on-${line}` },
];

/** Rows of the real Git output of each command, as drawn in the component (`o-<line>-<row>`). */
export const outputRows: Record<number, number> = { 1: 1, 3: 2, 4: 3, 5: 1, 7: 2, 8: 2, 9: 3, 10: 3, 12: 2, 13: 2, 15: 3, 16: 4, 17: 1, 18: 2, 20: 2 };

/** Types the output of one command below the session, one row after the other. */
const typeOut = (at: number, line: number, gap = 350): MotionCue[] =>
	Array.from({ length: outputRows[line] ?? 0 }, (_, index) => ({
		at: at + index * gap,
		do: 'type' as const,
		el: `o-${line}-${index + 1}`,
		dur: 500,
	}));

/** Lifts (push) or drops (fetch, pull) a commit coin from one floor to the other. */
const travel = (at: number, el: string, to: string, dur = 1300): MotionCue[] => [
	{ at, do: 'enter', el, dur: 300 },
	{ at: at + 200, do: 'move', el, to, dur },
];

/** Moves a branch label (and, when given, `HEAD` with it) to another commit. */
const slide = (at: number, tag: string, to: string, head?: string): MotionCue[] => [
	{ at, do: 'move', el: tag, to, dur: 800 },
	...(head ? [{ at, do: 'move' as const, el: 'head', to: head, dur: 800 }] : []),
];

// ─── Captions ───────────────────────────────────────────────────────────────
const branch = timed(
	say(
		'En equipo no se sube directo a `main`: cada tarea va en su propia rama.',
		'Teams do not push straight to `main`: each task gets its own branch.',
	),
	say(
		'`git switch -c agrega-contacto` crea la rama y mueve `HEAD` a ella.',
		'`git switch -c add-contact` creates the branch and moves `HEAD` to it.',
	),
	say(
		'Con el commit, la rama avanza a `b4efc3f`; `main` no se mueve.',
		'With the commit, the branch moves to `b4efc3f`; `main` stays put.',
	),
);
const push = timed(
	say(
		'`git push -u origin agrega-contacto` copia el commit y crea la rama en GitHub.',
		'`git push -u origin add-contact` copies the commit and creates the branch on GitHub.',
	),
	say(
		'`-u` la conecta con `origin/agrega-contacto`: luego basta con `git push`.',
		'`-u` links it to `origin/add-contact`: after that, `git push` is enough.',
	),
);
const openPr = timed(
	say(
		'Un Pull Request pide integrar tu rama: base `main`, compare `agrega-contacto`.',
		'A Pull Request asks to merge your branch: base `main`, compare `add-contact`.',
	),
	say(
		'Se abre con Compare & pull request o `gh pr create`; ahí el equipo revisa.',
		'Open it with Compare & pull request or `gh pr create`; the team reviews there.',
	),
);
const review = timed(
	say(
		'Beto pide un enlace en el menú; Ana hace commit en la misma rama y `git push`.',
		'Ben asks for a menu link; Ana commits on the same branch and runs `git push`.',
	),
	say(
		'El PR sigue a la rama, no a un commit: `330bf8b` aparece al instante.',
		'The PR follows the branch, not a commit: `330bf8b` shows up right away.',
	),
);
const fetch = timed(
	say(
		'Se aceptó el PR de Beto: `main` avanzó y el PR avisa un conflicto.',
		"Ben's PR was merged: `main` moved and the PR warns of a conflict.",
	),
	say(
		'`git fetch` los trae y mueve `origin/main`, sin tocar tus archivos.',
		'`git fetch` brings them and moves `origin/main`; your files stay intact.',
	),
	say(
		'`git merge origin/main` los une, pero ambos cambiaron el menú: conflicto.',
		'`git merge origin/main` joins them, but both changed the menu: conflict.',
	),
);
const resolve = timed(
	say(
		'Ana deja los dos enlaces, Blog y Contacto, y borra los marcadores.',
		'Ana keeps both links, Blog and Contact, and deletes the markers.',
	),
	say(
		'`git commit --no-edit` crea el merge commit `cb26567`, con dos padres.',
		'`git commit --no-edit` creates the merge commit `cb26567`, with two parents.',
	),
	say(
		'Tras `git push` el PR queda sin conflictos, resueltos en tu rama.',
		'After `git push` the PR has no conflicts: fixed on your branch.',
	),
);
const merge = timed(
	say(
		'Beto aprueba y GitHub hace el merge: `29d937d` entra en `main`.',
		'Ben approves and GitHub merges it: `29d937d` lands on `main`.',
	),
	say(
		'Tu `main` aún no lo tiene: `git switch main` y `git pull` lo avanzan.',
		'Your `main` lacks it: `git switch main` and `git pull` fast-forward it.',
	),
);
const cleanup = timed(
	say(
		'`git branch -d` la borra aquí y `git push origin --delete`, en GitHub.',
		'`git branch -d` deletes it here and `git push origin --delete` on GitHub.',
	),
	say(
		'El clon de Beto aún ve `origin/agrega-contacto`; `git fetch --prune` la quita.',
		"Ben's clone still sees `origin/add-contact`; `git fetch --prune` removes it.",
	),
	say(
		'Rama, PR, revisión, merge y limpieza: así llega una tarea a `main`.',
		'Branch, PR, review, merge and cleanup: that is how a task reaches `main`.',
	),
);

// Modules of Ana's clone, one per command she runs, in the order of the session.
const ANA_LINES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18];

export const script: AnimationScript = {
	chapters: [
		{ id: 'branch', label: { es: 'Una rama propia', en: 'A branch of its own' } },
		{ id: 'pull-request', label: { es: 'El Pull Request', en: 'The Pull Request' } },
		{ id: 'review', label: { es: 'La revisión', en: 'The review' } },
		{ id: 'update', label: { es: 'Al día con main', en: 'Up to date with main' } },
		{ id: 'merge', label: { es: 'El merge', en: 'The merge' } },
		{ id: 'cleanup', label: { es: 'La limpieza', en: 'The cleanup' } },
	],
	steps: [
		// ─── Scene 1. A branch of its own ──────────────────────────────────
		{
			id: 'branch',
			chapter: 'branch',
			scene: 'journey',
			title: { es: 'Cada tarea en su propia rama', en: 'Every task on its own branch' },
			subtitles: branch.list,
			motion: {
				cues: seq(
					shot(0, 'shot-ana', 3200),
					{ at: 200, do: 'enter', el: 'ana' },
					{ at: 400, do: 'enter', el: 'hub' },
					{ at: 700, do: 'enter', el: 'a-0' },
					{ at: 800, do: 'enter', el: 'g-0' },
					{ at: 1000, do: 'enter', el: 't-a-main' },
					{ at: 1100, do: 'enter', el: 't-a-om' },
					{ at: 1200, do: 'enter', el: 't-g-main' },
					{ at: 1500, do: 'enter', el: 'head' },
					...ANA_LINES.map((line, index) => ({ at: 1700 + index * 70, do: 'enter' as const, el: `m-${line}`, dur: 400 })),
					{ at: 3000, do: 'enter', el: 'hl' },
					{ at: 3100, do: 'enter', el: 'p' },
					{ at: 3600, do: 'pulse', el: 't-a-main' },
					...exec(branch.start(1), 1),
					...typeOut(branch.start(1) + 900, 1),
					{ at: branch.start(1) + 1300, do: 'enter', el: 't-a-feat' },
					...slide(branch.start(1) + 2300, 'head', 'h-feat-0'),
					{ at: branch.start(1) + 3300, do: 'pulse', el: 'head' },
					...clear(branch.start(2), 'o-1'),
					...exec(branch.start(2), 2),
					...exec(branch.start(2) + 1000, 3),
					{ at: branch.start(2) + 1900, do: 'draw', el: 'ae-0-b4e', dur: 600 },
					{ at: branch.start(2) + 2100, do: 'enter', el: 'a-b4e' },
					...typeOut(branch.start(2) + 2000, 3),
					...slide(branch.start(2) + 2600, 't-a-feat', 'ta-feat-b4e', 'h-feat-b4e'),
					{ at: branch.start(2) + 3600, do: 'pulse', el: 't-a-main' },
				),
			},
		},

		// ─── Scene 2. The Pull Request ──────────────────────────────────────
		{
			id: 'push',
			chapter: 'pull-request',
			scene: 'journey',
			title: { es: 'La rama sube a GitHub', en: 'The branch goes up to GitHub' },
			subtitles: push.list,
			motion: {
				cues: seq(
					...clear(0, 'on-1', 'on-2', 'on-3', 'o-3'),
					shot(0, 'shot-mid', 2600),
					...exec(300, 4),
					...typeOut(1100, 4),
					...travel(1400, 'g-b4e', 'n-g-b4e', 1500),
					{ at: 3000, do: 'draw', el: 'ge-0-b4e', dur: 600 },
					{ at: 3300, do: 'enter', el: 't-g-feat' },
					{ at: 3900, do: 'pulse', el: 'g-b4e' },
					{ at: push.start(1) + 300, do: 'enter', el: 'lb-track' },
					{ at: push.start(1) + 1000, do: 'pulse', el: 't-a-feat' },
					{ at: push.start(1) + 1700, do: 'pulse', el: 't-g-feat' },
					{ at: push.start(1) + 2600, do: 'pulse', el: 'lb-track' },
				),
			},
		},
		{
			id: 'open-pr',
			chapter: 'pull-request',
			scene: 'journey',
			title: { es: 'Un pedido para integrar la rama', en: 'A request to merge the branch' },
			subtitles: openPr.list,
			motion: {
				cues: seq(
					...clear(0, 'on-4', 'o-4', 'lb-track'),
					shot(0, 'shot-hub', 2600),
					...exec(300, 5),
					...typeOut(1200, 5),
					{ at: 1500, do: 'draw', el: 'pr-link', dur: 1200 },
					{ at: 2200, do: 'enter', el: 'pr' },
					{ at: 3000, do: 'pulse', el: 'pr' },
					{ at: openPr.start(1) + 400, do: 'pulse', el: 't-g-main' },
					{ at: openPr.start(1) + 1200, do: 'pulse', el: 't-g-feat' },
					{ at: openPr.start(1) + 2200, do: 'pulse', el: 'on-5' },
					{ at: openPr.start(1) + 2600, do: 'flow', el: 'pr-link' },
					{ at: openPr.start(1) + 3300, do: 'pulse', el: 'pr' },
				),
			},
		},

		// ─── Scene 3. The review ────────────────────────────────────────────
		{
			id: 'review',
			chapter: 'review',
			scene: 'journey',
			title: { es: 'Más commits actualizan el mismo PR', en: 'More commits update the same PR' },
			subtitles: review.list,
			motion: {
				cues: seq(
					...clear(0, 'on-5', 'o-5'),
					{ at: 300, do: 'enter', el: 'st-review' },
					{ at: 1000, do: 'pulse', el: 'st-review' },
					shot(1300, 'shot-mid', 2200),
					...exec(1700, 6),
					...exec(2600, 7),
					{ at: 3500, do: 'draw', el: 'ae-b4e-330', dur: 600 },
					{ at: 3700, do: 'enter', el: 'a-330' },
					...typeOut(3600, 7),
					...slide(4200, 't-a-feat', 'ta-feat-330', 'h-feat-330'),
					...clear(review.start(1), 'o-7'),
					...exec(review.start(1) + 100, 8),
					...typeOut(review.start(1) + 900, 8),
					...travel(review.start(1) + 1000, 'g-330', 'n-g-330'),
					{ at: review.start(1) + 2400, do: 'draw', el: 'ge-b4e-330', dur: 600 },
					...slide(review.start(1) + 2600, 't-g-feat', 'tg-feat-330'),
					{ at: review.start(1) + 3500, do: 'pulse', el: 'pr' },
					{ at: review.start(1) + 3900, do: 'exit', el: 'st-review' },
				),
			},
		},

		// ─── Scene 4. Up to date with main ──────────────────────────────────
		{
			id: 'fetch',
			chapter: 'update',
			scene: 'journey',
			title: { es: 'main avanzó: fetch y merge', en: 'main moved: fetch and merge' },
			subtitles: fetch.list,
			motion: {
				cues: seq(
					...clear(0, 'on-6', 'on-7', 'on-8', 'o-8'),
					shot(0, 'shot-hub', 2200),
					{ at: 400, do: 'draw', el: 'ge-0-4ad', dur: 600 },
					{ at: 700, do: 'enter', el: 'g-4ad' },
					{ at: 1200, do: 'draw', el: 'ge-4ad-258', dur: 500 },
					{ at: 1200, do: 'draw', el: 'ge-0-258', dur: 700 },
					{ at: 1600, do: 'enter', el: 'g-258' },
					{ at: 1900, do: 'enter', el: 'lb-beto-pr' },
					...slide(2200, 't-g-main', 'tg-main-258'),
					{ at: 3300, do: 'enter', el: 'st-conflict' },
					{ at: 4200, do: 'pulse', el: 'st-conflict' },
					shot(fetch.start(1), 'shot-mid', 2200),
					...clear(fetch.start(1), 'lb-beto-pr'),
					...exec(fetch.start(1) + 200, 9),
					...typeOut(fetch.start(1) + 1000, 9),
					...travel(fetch.start(1) + 1100, 'a-4ad', 'n-a-4ad'),
					...travel(fetch.start(1) + 1300, 'a-258', 'n-a-258'),
					{ at: fetch.start(1) + 2700, do: 'draw', el: 'ae-0-4ad', dur: 500 },
					{ at: fetch.start(1) + 2900, do: 'draw', el: 'ae-4ad-258', dur: 500 },
					{ at: fetch.start(1) + 2900, do: 'draw', el: 'ae-0-258', dur: 600 },
					...slide(fetch.start(1) + 3300, 't-a-om', 'ta-om-258'),
					{ at: fetch.start(1) + 4200, do: 'pulse', el: 't-a-main' },
					shot(fetch.start(2), 'shot-ana', 2000),
					...clear(fetch.start(2), 'o-9'),
					...exec(fetch.start(2) + 200, 10),
					{ at: fetch.start(2) + 1100, do: 'enter', el: 'hx-10' },
					...typeOut(fetch.start(2) + 1000, 10),
					{ at: fetch.start(2) + 1600, do: 'draw', el: 'clash', dur: 700 },
					{ at: fetch.start(2) + 2200, do: 'enter', el: 'f-conflict' },
					{ at: fetch.start(2) + 2600, do: 'flow', el: 'clash' },
					{ at: fetch.start(2) + 3400, do: 'pulse', el: 'f-conflict' },
				),
			},
		},
		{
			id: 'resolve',
			chapter: 'update',
			scene: 'journey',
			title: { es: 'El conflicto se resuelve en tu rama', en: 'The conflict is resolved on your branch' },
			subtitles: resolve.list,
			motion: {
				cues: seq(
					{ at: 800, do: 'exit', el: 'f-conflict', dur: 400 },
					{ at: 800, do: 'exit', el: 'clash', dur: 400 },
					{ at: 1100, do: 'enter', el: 'f-ok' },
					{ at: 2200, do: 'pulse', el: 'f-ok' },
					...clear(resolve.start(1), 'o-10', 'hx-10'),
					...exec(resolve.start(1) + 100, 11),
					...exec(resolve.start(1) + 1000, 12),
					{ at: resolve.start(1) + 1900, do: 'draw', el: 'ae-330-cb2', dur: 600 },
					{ at: resolve.start(1) + 1900, do: 'draw', el: 'ae-258-cb2', dur: 600 },
					{ at: resolve.start(1) + 2100, do: 'enter', el: 'a-cb2' },
					{ at: resolve.start(1) + 2100, do: 'enter', el: 'hv-12' },
					...typeOut(resolve.start(1) + 2000, 12),
					...slide(resolve.start(1) + 2700, 't-a-feat', 'ta-feat-cb2', 'h-feat-cb2'),
					{ at: resolve.start(1) + 3700, do: 'pulse', el: 'a-cb2' },
					shot(resolve.start(2), 'shot-mid', 2000),
					...clear(resolve.start(2), 'o-12', 'f-ok', 'hv-12'),
					...exec(resolve.start(2) + 100, 13),
					...typeOut(resolve.start(2) + 900, 13),
					...travel(resolve.start(2) + 1000, 'g-cb2', 'n-g-cb2'),
					{ at: resolve.start(2) + 2400, do: 'draw', el: 'ge-330-cb2', dur: 600 },
					{ at: resolve.start(2) + 2400, do: 'draw', el: 'ge-258-cb2', dur: 600 },
					...slide(resolve.start(2) + 2700, 't-g-feat', 'tg-feat-cb2'),
					{ at: resolve.start(2) + 3100, do: 'exit', el: 'st-conflict', dur: 400 },
					{ at: resolve.start(2) + 3400, do: 'enter', el: 'st-ok' },
				),
			},
		},

		// ─── Scene 5. The merge ─────────────────────────────────────────────
		{
			id: 'merge',
			chapter: 'merge',
			scene: 'journey',
			title: { es: 'GitHub integra el PR en main', en: 'GitHub merges the PR into main' },
			subtitles: merge.list,
			motion: {
				cues: seq(
					...clear(0, 'on-9', 'on-10', 'on-11', 'on-12', 'on-13', 'o-13'),
					shot(0, 'shot-hub', 2200),
					{ at: 200, do: 'type', el: 'e-14', dur: 500 },
					{ at: 500, do: 'move', el: 'hl', to: 'ln-14', dur: 500 },
					{ at: 500, do: 'move', el: 'p', to: 'a-pr', dur: 900 },
					{ at: 1300, do: 'exit', el: 'st-ok', dur: 400 },
					{ at: 1500, do: 'exit', el: 'pr-link', dur: 400 },
					{ at: 1600, do: 'draw', el: 'ge-cb2-29d', dur: 600 },
					{ at: 1600, do: 'draw', el: 'ge-258-29d', dur: 600 },
					{ at: 1900, do: 'enter', el: 'g-29d' },
					...slide(2300, 't-g-main', 'tg-main-29d'),
					{ at: 3000, do: 'enter', el: 'st-merged' },
					{ at: 3600, do: 'pulse', el: 'g-29d' },
					shot(merge.start(1), 'shot-mid', 2200),
					...exec(merge.start(1) + 200, 15),
					...slide(merge.start(1) + 1000, 'head', 'h-main-0'),
					...typeOut(merge.start(1) + 1100, 15),
					...clear(merge.start(1) + 2600, 'o-15'),
					...exec(merge.start(1) + 2700, 16),
					...typeOut(merge.start(1) + 3400, 16, 300),
					...travel(merge.start(1) + 3500, 'a-29d', 'n-a-29d', 1200),
					{ at: merge.start(1) + 4700, do: 'draw', el: 'ae-cb2-29d', dur: 500 },
					{ at: merge.start(1) + 4700, do: 'draw', el: 'ae-258-29d', dur: 500 },
					...slide(merge.start(1) + 5100, 't-a-main', 'ta-main-29d', 'h-main-29d'),
					...slide(merge.start(1) + 5100, 't-a-om', 'ta-om-29d'),
					{ at: merge.start(1) + 5900, do: 'enter', el: 'lb-ff' },
				),
			},
		},

		// ─── Scene 6. The cleanup ───────────────────────────────────────────
		{
			id: 'cleanup',
			chapter: 'cleanup',
			scene: 'journey',
			title: { es: 'Borrar la rama en todas partes', en: 'Deleting the branch everywhere' },
			subtitles: cleanup.list,
			motion: {
				cues: seq(
					...clear(0, 'on-15', 'on-16', 'o-16', 'lb-ff'),
					...exec(300, 17),
					...typeOut(1100, 17),
					{ at: 1400, do: 'exit', el: 't-a-feat', dur: 500 },
					...clear(2400, 'o-17'),
					...exec(2500, 18),
					...typeOut(3300, 18),
					{ at: 3600, do: 'exit', el: 't-g-feat', dur: 500 },
					shot(cleanup.start(1), 'shot-all', 3000),
					...clear(cleanup.start(1), 'o-18', 'on-17', 'on-18'),
					{ at: cleanup.start(1) + 300, do: 'enter', el: 'beto' },
					{ at: cleanup.start(1) + 500, do: 'enter', el: 't-b-feat' },
					{ at: cleanup.start(1) + 600, do: 'enter', el: 'm-20' },
					{ at: cleanup.start(1) + 700, do: 'type', el: 'e-19', dur: 400 },
					...exec(cleanup.start(1) + 1200, 20),
					...typeOut(cleanup.start(1) + 2000, 20),
					{ at: cleanup.start(1) + 2600, do: 'exit', el: 't-b-feat', dur: 500 },
					...clear(cleanup.start(2), 'on-20', 'p', 'hl'),
					{ at: cleanup.start(2) + 300, do: 'enter', el: 'r-flow' },
					{ at: cleanup.start(2) + 900, do: 'pulse', el: 'g-29d' },
					{ at: cleanup.start(2) + 1300, do: 'pulse', el: 'a-29d' },
					{ at: cleanup.start(2) + 1800, do: 'pulse', el: 'st-merged' },
					{ at: cleanup.start(2) + 2600, do: 'pulse', el: 'r-flow' },
				),
			},
		},
	],
};
