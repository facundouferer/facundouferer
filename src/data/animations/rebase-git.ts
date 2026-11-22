import type { AnimationScript, Localized, MotionCue, Subtitle } from './types';

// "The journey of a rebase": a short film (about two minutes) for the Git lesson
// "Rebase y buenas prácticas" (order: 6). It plays on a single persistent canvas
// (`data-scene="journey"` in `src/components/animaciones/rebase-git.astro`): the
// terminal session on the left, and on the right two isometric floors, GitHub on top
// and your repository below. A commit is always the same rounded node with its short
// hash; a branch is always the same tag; the change a commit carries travels as a
// card. Magenta marks the problem (the conflict, the rejected push, what `--force`
// would delete); violet marks what resolves it (`--continue`, `--force-with-lease`).

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

/** Fades several elements in, one after the other. */
const reveal = (at: number, gap: number, ...els: string[]): MotionCue[] =>
	els.map((el, index) => ({ at: at + index * gap, do: 'enter' as const, el }));

// ─── Terminal session ───────────────────────────────────────────────────────
// One command per editor line; the output of the running command is typed in the
// console below. Taken from the lesson, shortened only where a line would not fit.

export type OutputKind = 'out' | 'err' | 'ok' | 'cmt';
export interface OutputLine {
	kind: OutputKind;
	text: Localized;
}

const out = (es: string, en: string, kind: OutputKind = 'out'): OutputLine => ({ kind, text: { es, en } });

export const session = {
	prompt: { es: '~/tienda (feature/carrito)', en: '~/shop (feature/cart)' } satisfies Localized,
	commands: [
		'git fetch',
		'git log --oneline --graph --all',
		'git rebase origin/main',
		'git status',
		'git add config.js',
		'git rebase --continue',
		'git push',
		'git push --force-with-lease',
	],
	outputs: {
		fetch: [
			out('From github.com:tu-usuario/tienda', 'From github.com:your-user/shop'),
			out('   10b4cc8..7ac78ac  main       -> origin/main', '   1264b56..d5e72ab  main       -> origin/main'),
		],
		graph: [
			out('* 780488a feat(envio): agrega envío gratis desde 10000', '* d5e72ab fix(shipping): update the shipping cost'),
			out('* a39a0ac feat(carrito): calcula el total', '| * b4c6c0a feat(shipping): add free shipping from 10000'),
			out('| * 7ac78ac fix(envio): actualiza el costo de envío', '| * a45c681 feat(cart): compute the total'),
			out('|/', '|/'),
			out('* 10b4cc8 chore: agrega configuración inicial', '* 1264b56 chore: add initial configuration'),
		],
		rebase: [
			out('Auto-merging config.js', 'Auto-merging config.js'),
			out('CONFLICT (content): Merge conflict in config.js', 'CONFLICT (content): Merge conflict in config.js', 'err'),
			out('error: could not apply 780488a... feat(envio): ...', 'error: could not apply b4c6c0a... feat(shipping): ...', 'err'),
			out('hint: ... then run "git rebase --continue".', 'hint: ... then run "git rebase --continue".', 'cmt'),
		],
		status: [
			out('interactive rebase in progress; onto 7ac78ac', 'interactive rebase in progress; onto d5e72ab'),
			out(
				"You are currently rebasing branch 'feature/carrito' on '7ac78ac'.",
				"You are currently rebasing branch 'feature/cart' on 'd5e72ab'.",
			),
			out('  (fix conflicts and then run "git rebase --continue")', '  (fix conflicts and then run "git rebase --continue")', 'cmt'),
			out('Unmerged paths:', 'Unmerged paths:'),
			out('        both modified:   config.js', '        both modified:   config.js', 'err'),
		],
		continue: [
			out(
				'[detached HEAD 1dfd393] feat(envio): agrega envío gratis desde 10000',
				'[detached HEAD 5d1dad6] feat(shipping): add free shipping from 10000',
			),
			out(' 1 file changed, 1 insertion(+)', ' 1 file changed, 1 insertion(+)'),
			out(
				'Successfully rebased and updated refs/heads/feature/carrito.',
				'Successfully rebased and updated refs/heads/feature/cart.',
				'ok',
			),
		],
		push: [
			out('To github.com:tu-usuario/tienda.git', 'To github.com:your-user/shop.git'),
			out(
				' ! [rejected] feature/carrito -> feature/carrito (non-fast-forward)',
				' ! [rejected] feature/cart -> feature/cart (non-fast-forward)',
				'err',
			),
			out(
				"error: failed to push some refs to 'github.com:tu-usuario/tienda.git'",
				"error: failed to push some refs to 'github.com:your-user/shop.git'",
				'err',
			),
		],
		stale: [
			out('# si alguien hubiera subido un commit a tu rama:', '# if someone had pushed a commit to your branch:', 'cmt'),
			out('To github.com:tu-usuario/tienda.git', 'To github.com:your-user/shop.git'),
			out(
				' ! [rejected] feature/carrito -> feature/carrito (stale info)',
				' ! [rejected] feature/cart -> feature/cart (stale info)',
				'err',
			),
			out(
				"error: failed to push some refs to 'github.com:tu-usuario/tienda.git'",
				"error: failed to push some refs to 'github.com:your-user/shop.git'",
				'err',
			),
		],
		lease: [
			out('To github.com:tu-usuario/tienda.git', 'To github.com:your-user/shop.git'),
			out(
				' + 780488a...1dfd393 feature/carrito -> feature/carrito (forced update)',
				' + b4c6c0a...5d1dad6 feature/cart -> feature/cart (forced update)',
				'ok',
			),
		],
	} satisfies Record<string, OutputLine[]>,
};

export type OutputId = keyof typeof session.outputs;

/** Types the command of editor line `line`. */
const typeCmd = (at: number, line: number): MotionCue => ({ at, do: 'type', el: `cmd-${line}`, dur: 500 });

/** Types every line of one command output in the console, one after the other. */
const typeOut = (at: number, id: OutputId, gap = 320): MotionCue[] => [
	{ at, do: 'enter', el: `out-${id}`, dur: 1 },
	...session.outputs[id].map((_, index) => ({
		at: at + 1 + index * gap,
		do: 'type' as const,
		el: `out-${id}-${index + 1}`,
		dur: Math.max(220, gap),
	})),
];

/** Moves the execution particle to the module of editor line `line` and the bar to that line. */
const run = (at: number, line: number, dur = 700): MotionCue[] => [
	{ at, do: 'move', el: 'p', to: `a-m${line}`, dur },
	{ at, do: 'move', el: 'hl', to: `ln-${line}`, dur: Math.min(dur, 600) },
];

// ─── Captions ───────────────────────────────────────────────────────────────
const diverge = timed(
	say(
		'Tu rama `feature/carrito` tiene dos commits. Beto integró otro en `main`.',
		'Your branch `feature/cart` has two commits. Beto added another to `main`.',
	),
	say(
		'`git fetch` lo descarga: solo se mueve `origin/main`, ahora en `7ac78ac`.',
		'`git fetch` downloads it: only `origin/main` moves, now at `d5e72ab`.',
	),
	say(
		'El grafo muestra la divergencia: tus commits salen de `10b4cc8`.',
		'The graph shows the divergence: your commits start at `1264b56`.',
	),
);
const replay = timed(
	say(
		'`git rebase origin/main` aparta tus commits y cambia la base de tu rama.',
		'`git rebase origin/main` sets your commits aside and changes your base.',
	),
	say(
		'Los reaplica uno por uno: `a39a0ac` vuelve como `c6d3f43`, un commit nuevo.',
		'It replays them one by one: `a45c681` comes back as `2c8e0f3`, a new commit.',
	),
	say(
		'Mismo cambio y mensaje, pero otro padre: por eso el hash cambia.',
		'Same change and message, but another parent: so the hash changes.',
	),
);
const conflict = timed(
	say(
		'El segundo commit choca: Beto y tú cambiaron la misma línea de `config.js`.',
		'The second commit clashes: Beto and you changed the same line of `config.js`.',
	),
	say(
		'El rebase se detiene en ese commit. `git status` dice dónde está.',
		'The rebase stops at that commit. `git status` tells you where it is.',
	),
	say(
		'Aquí `HEAD` es la nueva base: "ours" es `origin/main` y "theirs", tu commit.',
		'Here `HEAD` is the new base: "ours" is `origin/main` and "theirs" is your commit.',
	),
);
const resolve = timed(
	say(
		'Dejas el costo de Beto y tu envío gratis, y lo marcas con `git add`.',
		"Keep Beto's cost and your free shipping, then mark it with `git add`.",
	),
	say(
		'Sin `git commit`: `git rebase --continue` lo reaplica como `1dfd393`.',
		'No `git commit`: `git rebase --continue` replays it as `5d1dad6`.',
	),
	say(
		'Tus commits viejos no se borran: siguen en `origin/feature/carrito`.',
		'Your old commits are not deleted: they are still on `origin/feature/cart`.',
	),
);
const rejected = timed(
	say(
		'Un `git push` normal es rechazado: non-fast-forward.',
		'A normal `git push` is rejected: non-fast-forward.',
	),
	say(
		'No hagas `git pull`: traería tus commits viejos y los mezclaría.',
		'Do not run `git pull`: it would bring your old commits back.',
	),
);
const stale = timed(
	say(
		'`git push --force` reemplaza la rama remota sin preguntar nada.',
		'`git push --force` replaces the remote branch without asking anything.',
	),
	say(
		'Si un compañero hubiera subido un commit, `--force` lo borraría.',
		'If a teammate had pushed a commit, `--force` would delete it.',
	),
	say(
		'`--force-with-lease` compara: ya no está en `780488a`, así que rechaza.',
		'`--force-with-lease` compares: it is no longer at `b4c6c0a`, so it refuses.',
	),
);
const lease = timed(
	say(
		'En este ejemplo nadie subió nada: la rama remota sigue en `780488a`.',
		'In this example nobody pushed anything: the remote branch is still at `b4c6c0a`.',
	),
	say(
		'`--force-with-lease` la reemplaza y el Pull Request se actualiza solo.',
		'`--force-with-lease` replaces it, and the Pull Request updates itself.',
	),
);
const recap = timed(
	say(
		'Rebase reaplica tus commits sobre `origin/main`: historial lineal, hashes nuevos.',
		'Rebase replays your commits on top of `origin/main`: a linear history, new hashes.',
	),
	say(
		'Regla de oro: nunca hagas rebase de una rama compartida. En la tuya, `--force-with-lease`.',
		'Golden rule: never rebase a shared branch. On your own, `--force-with-lease`.',
	),
);

export const script: AnimationScript = {
	chapters: [
		{ id: 'diverge', label: { es: 'Ramas divergentes', en: 'Diverging branches' } },
		{ id: 'replay', label: { es: 'Reaplicar commits', en: 'Replaying commits' } },
		{ id: 'conflict', label: { es: 'Conflicto en el rebase', en: 'Conflict in a rebase' } },
		{ id: 'rejected', label: { es: 'Push rechazado', en: 'Rejected push' } },
		{ id: 'lease', label: { es: '--force-with-lease', en: '--force-with-lease' } },
		{ id: 'recap', label: { es: 'Historial lineal', en: 'Linear history' } },
	],
	steps: [
		// ─── Scene 1. Diverging branches ────────────────────────────────────
		{
			id: 'diverge',
			chapter: 'diverge',
			scene: 'journey',
			title: { es: 'Tu rama y main divergen', en: 'Your branch and main diverge' },
			subtitles: diverge.list,
			motion: {
				cues: seq(
					shot(0, 'shot-all', 3200),
					{ at: 200, do: 'enter', el: 'floor-local' },
					{ at: 400, do: 'enter', el: 'n-lb' },
					{ at: 600, do: 'enter', el: 'tg-om' },
					{ at: 700, do: 'draw', el: 'e-lbd', dur: 600 },
					{ at: 1100, do: 'enter', el: 'n-ld' },
					{ at: 1300, do: 'draw', el: 'e-lde', dur: 500 },
					{ at: 1700, do: 'enter', el: 'n-le' },
					...reveal(1900, 150, 'tg-feat', 'tg-ofeat', 'tg-head'),
					{ at: 2100, do: 'enter', el: 'floor-remote' },
					...reveal(2300, 120, 'n-rb', 'n-rc', 'n-rd', 'n-re'),
					{ at: 2500, do: 'draw', el: 'e-rbc', dur: 500 },
					{ at: 2600, do: 'draw', el: 'e-rbd', dur: 500 },
					{ at: 2800, do: 'draw', el: 'e-rde', dur: 500 },
					...reveal(3000, 150, 'tg-rmain', 'tg-rfeat'),
					...reveal(3300, 90, 'm-1', 'm-2', 'm-3', 'm-4', 'm-5', 'm-6', 'm-7', 'm-8'),
					{ at: 3600, do: 'enter', el: 'lb-beto' },
					{ at: 4300, do: 'pulse', el: 'n-rc' },
					{ at: 4400, do: 'enter', el: 'hl' },
					{ at: 4500, do: 'enter', el: 'p' },
					// git fetch: the new commit comes down, only origin/main moves.
					typeCmd(diverge.start(1), 1),
					...run(diverge.start(1) + 100, 1),
					{ at: diverge.start(1) + 800, do: 'enter', el: 'on-1' },
					{ at: diverge.start(1) + 600, do: 'exit', el: 'lb-beto', dur: 300 },
					{ at: diverge.start(1) + 900, do: 'enter', el: 'pk-fetch' },
					{ at: diverge.start(1) + 1100, do: 'move', el: 'pk-fetch', to: 'a-lc', dur: 1300 },
					...typeOut(diverge.start(1) + 1200, 'fetch', 500),
					{ at: diverge.start(1) + 2400, do: 'exit', el: 'pk-fetch', dur: 300 },
					{ at: diverge.start(1) + 2500, do: 'enter', el: 'n-lc' },
					{ at: diverge.start(1) + 2600, do: 'draw', el: 'e-lbc', dur: 500 },
					{ at: diverge.start(1) + 3000, do: 'move', el: 'tg-om', to: 't1-lc', dur: 900 },
					{ at: diverge.start(1) + 4000, do: 'pulse', el: 'tg-om' },
					// git log --oneline --graph --all
					{ at: diverge.start(2), do: 'exit', el: 'out-fetch', dur: 300 },
					{ at: diverge.start(2), do: 'exit', el: 'on-1', dur: 300 },
					typeCmd(diverge.start(2) + 100, 2),
					...run(diverge.start(2) + 100, 2),
					{ at: diverge.start(2) + 800, do: 'enter', el: 'on-2' },
					...typeOut(diverge.start(2) + 900, 'graph', 300),
					shot(diverge.start(2) + 600, 'shot-local', 2000),
					{ at: diverge.start(2) + 2400, do: 'pulse', el: 'n-lb' },
					{ at: diverge.start(2) + 2900, do: 'pulse', el: 'n-ld' },
					{ at: diverge.start(2) + 3300, do: 'pulse', el: 'n-le' },
				),
			},
		},

		// ─── Scene 2. Replaying commits ─────────────────────────────────────
		{
			id: 'replay',
			chapter: 'replay',
			scene: 'journey',
			title: { es: 'Los commits se reaplican uno por uno', en: 'Commits are replayed one by one' },
			subtitles: replay.list,
			motion: {
				cues: seq(
					...clear(0, 'out-graph', 'on-2'),
					typeCmd(100, 3),
					...run(100, 3),
					{ at: 800, do: 'enter', el: 'on-3' },
					// Your commits are set aside as the changes they carry.
					{ at: 1100, do: 'enter', el: 'pk-d' },
					{ at: 1300, do: 'enter', el: 'pk-e' },
					{ at: 1500, do: 'enter', el: 'old-ld' },
					{ at: 1700, do: 'enter', el: 'old-le' },
					{ at: 2200, do: 'move', el: 'tg-head', to: 'h-lc', dur: 1100 },
					{ at: 3300, do: 'pulse', el: 'n-lc' },
					// The first one lands on the new base as a new commit.
					{ at: replay.start(1) + 100, do: 'move', el: 'pk-d', to: 'a-ld2', dur: 1300 },
					{ at: replay.start(1) + 1400, do: 'exit', el: 'pk-d', dur: 300 },
					{ at: replay.start(1) + 1500, do: 'draw', el: 'e-lcd2', dur: 400 },
					{ at: replay.start(1) + 1600, do: 'enter', el: 'n-ld2' },
					{ at: replay.start(1) + 2000, do: 'move', el: 'tg-head', to: 'h-ld2', dur: 800 },
					{ at: replay.start(1) + 3000, do: 'pulse', el: 'n-ld' },
					{ at: replay.start(1) + 3700, do: 'pulse', el: 'n-ld2' },
					{ at: replay.start(2) + 300, do: 'enter', el: 'lb-parent' },
					{ at: replay.start(2) + 1100, do: 'flow', el: 'e-lcd2' },
					{ at: replay.start(2) + 1600, do: 'pulse', el: 'lb-parent' },
				),
			},
		},

		// ─── Scene 3. Conflict in a rebase ──────────────────────────────────
		{
			id: 'conflict',
			chapter: 'conflict',
			scene: 'journey',
			title: { es: 'El rebase se detiene en un conflicto', en: 'The rebase stops on a conflict' },
			subtitles: conflict.list,
			motion: {
				cues: seq(
					...clear(0, 'lb-parent'),
					shot(0, 'shot-conflict', 2000),
					{ at: 200, do: 'move', el: 'pk-e', to: 'a-le2', dur: 1300 },
					{ at: 1500, do: 'enter', el: 'cf-slot' },
					{ at: 1600, do: 'exit', el: 'on-3', dur: 300 },
					{ at: 1600, do: 'enter', el: 'bad-3' },
					...typeOut(1700, 'rebase', 350),
					{ at: 2300, do: 'enter', el: 'lb-conflict' },
					{ at: 2700, do: 'enter', el: 'f-cfg' },
					{ at: 3600, do: 'pulse', el: 'cf-slot' },
					// git status: where the rebase stopped.
					{ at: conflict.start(1), do: 'exit', el: 'out-rebase', dur: 300 },
					typeCmd(conflict.start(1) + 100, 4),
					...run(conflict.start(1) + 100, 4),
					{ at: conflict.start(1) + 800, do: 'enter', el: 'on-4' },
					...typeOut(conflict.start(1) + 900, 'status', 300),
					{ at: conflict.start(1) + 2600, do: 'pulse', el: 'lb-conflict' },
					// HEAD is the new base: ours and theirs swap.
					{ at: conflict.start(2) + 200, do: 'pulse', el: 'tg-head' },
					{ at: conflict.start(2) + 700, do: 'enter', el: 'f-ours' },
					{ at: conflict.start(2) + 2200, do: 'enter', el: 'f-theirs' },
					{ at: conflict.start(2) + 2700, do: 'pulse', el: 'pk-e' },
				),
			},
		},
		{
			id: 'resolve',
			chapter: 'conflict',
			scene: 'journey',
			title: { es: 'Resolver y continuar, sin commit', en: 'Resolve and continue, no commit' },
			subtitles: resolve.list,
			motion: {
				cues: seq(
					...clear(0, 'out-status', 'on-4', 'f-ours', 'f-theirs'),
					{ at: 300, do: 'exit', el: 'f-cfg', dur: 400 },
					{ at: 700, do: 'enter', el: 'f-fixed' },
					typeCmd(1500, 5),
					...run(1500, 5),
					{ at: 2200, do: 'enter', el: 'on-5' },
					{ at: 2300, do: 'exit', el: 'bad-3', dur: 300 },
					{ at: 2300, do: 'exit', el: 'lb-conflict', dur: 300 },
					{ at: 2500, do: 'exit', el: 'cf-slot', dur: 300 },
					{ at: 2800, do: 'enter', el: 'ok-slot' },
					// git rebase --continue: the second commit lands, the branch moves.
					{ at: resolve.start(1), do: 'exit', el: 'on-5', dur: 300 },
					typeCmd(resolve.start(1) + 100, 6),
					...run(resolve.start(1) + 100, 6),
					{ at: resolve.start(1) + 800, do: 'enter', el: 'on-6' },
					{ at: resolve.start(1) + 900, do: 'exit', el: 'pk-e', dur: 300 },
					{ at: resolve.start(1) + 900, do: 'exit', el: 'ok-slot', dur: 300 },
					{ at: resolve.start(1) + 900, do: 'exit', el: 'f-fixed', dur: 400 },
					{ at: resolve.start(1) + 1000, do: 'draw', el: 'e-ld2e2', dur: 400 },
					{ at: resolve.start(1) + 1100, do: 'enter', el: 'n-le2' },
					...typeOut(resolve.start(1) + 1200, 'continue', 400),
					{ at: resolve.start(1) + 1600, do: 'move', el: 'tg-feat', to: 't1-le2', dur: 1000 },
					{ at: resolve.start(1) + 1800, do: 'move', el: 'tg-head', to: 'h-le2', dur: 900 },
					shot(resolve.start(2), 'shot-local', 1800),
					{ at: resolve.start(2) + 600, do: 'enter', el: 'lb-old' },
					{ at: resolve.start(2) + 1500, do: 'pulse', el: 'tg-ofeat' },
					{ at: resolve.start(2) + 2200, do: 'pulse', el: 'n-le' },
					{ at: resolve.start(2) + 2800, do: 'pulse', el: 'n-le2' },
				),
			},
		},

		// ─── Scene 4. Rejected push ─────────────────────────────────────────
		{
			id: 'rejected',
			chapter: 'rejected',
			scene: 'journey',
			title: { es: 'Un push normal es rechazado', en: 'A normal push is rejected' },
			subtitles: rejected.list,
			motion: {
				cues: seq(
					...clear(0, 'out-continue', 'on-6', 'lb-old'),
					shot(0, 'shot-all', 1800),
					typeCmd(200, 7),
					...run(200, 7),
					{ at: 900, do: 'enter', el: 'on-7' },
					{ at: 1000, do: 'enter', el: 'pk-push' },
					{ at: 1200, do: 'move', el: 'pk-push', to: 'a-push', dur: 1300 },
					{ at: 2500, do: 'exit', el: 'on-7', dur: 300 },
					{ at: 2500, do: 'enter', el: 'bad-7' },
					{ at: 2600, do: 'enter', el: 'lb-rejected' },
					...typeOut(2600, 'push', 350),
					{ at: 3400, do: 'pulse', el: 'n-re' },
					{ at: rejected.start(1), do: 'exit', el: 'pk-push', dur: 400 },
					{ at: rejected.start(1) + 300, do: 'enter', el: 'lb-nopull' },
					{ at: rejected.start(1) + 1200, do: 'pulse', el: 'old-ld' },
					{ at: rejected.start(1) + 1500, do: 'pulse', el: 'old-le' },
					{ at: rejected.start(1) + 2400, do: 'pulse', el: 'lb-nopull' },
				),
			},
		},

		// ─── Scene 5. --force-with-lease ────────────────────────────────────
		{
			id: 'stale',
			chapter: 'lease',
			scene: 'journey',
			title: { es: 'Por qué nunca --force a secas', en: 'Why never plain --force' },
			subtitles: stale.list,
			motion: {
				cues: seq(
					...clear(0, 'out-push', 'bad-7', 'lb-rejected', 'lb-nopull'),
					shot(0, 'shot-remote', 1800),
					{ at: 600, do: 'pulse', el: 'tg-rfeat' },
					{ at: 1500, do: 'pulse', el: 'n-re' },
					// What if a teammate had pushed a commit to your branch?
					{ at: stale.start(1), do: 'draw', el: 'e-rex', dur: 500 },
					{ at: stale.start(1) + 300, do: 'enter', el: 'n-rx' },
					{ at: stale.start(1) + 500, do: 'enter', el: 'lb-mate' },
					{ at: stale.start(1) + 700, do: 'move', el: 'tg-rfeat', to: 't1-rx', dur: 800 },
					{ at: stale.start(1) + 2000, do: 'enter', el: 'x-bad' },
					{ at: stale.start(1) + 2200, do: 'enter', el: 'lb-force' },
					{ at: stale.start(1) + 3200, do: 'pulse', el: 'x-bad' },
					// --force-with-lease compares what you last saw with the remote first.
					shot(stale.start(2), 'shot-push', 1600),
					typeCmd(stale.start(2) + 100, 8),
					...run(stale.start(2) + 100, 8),
					{ at: stale.start(2) + 800, do: 'enter', el: 'on-8' },
					{ at: stale.start(2) + 900, do: 'enter', el: 'pk-lease' },
					{ at: stale.start(2) + 1100, do: 'move', el: 'pk-lease', to: 'a-lease-rx', dur: 1300 },
					{ at: stale.start(2) + 2400, do: 'exit', el: 'lb-force', dur: 300 },
					{ at: stale.start(2) + 2500, do: 'enter', el: 'lb-stale' },
					...typeOut(stale.start(2) + 2500, 'stale', 300),
					{ at: stale.start(2) + 3600, do: 'pulse', el: 'n-rx' },
					{ at: stale.start(2) + 4300, do: 'pulse', el: 'lb-stale' },
				),
			},
		},
		{
			id: 'lease',
			chapter: 'lease',
			scene: 'journey',
			title: { es: 'La rama sigue donde la viste', en: 'The branch is still where you saw it' },
			subtitles: lease.list,
			motion: {
				cues: seq(
					// Back to this example: nobody pushed anything.
					...clear(0, 'out-stale', 'lb-stale', 'lb-mate', 'x-bad', 'pk-lease'),
					{ at: 300, do: 'exit', el: 'n-rx', dur: 400 },
					{ at: 300, do: 'exit', el: 'e-rex', dur: 400 },
					{ at: 500, do: 'move', el: 'tg-rfeat', to: 't1-re', dur: 800 },
					{ at: 600, do: 'move', el: 'pk-lease', to: 'a-lease', dur: 1 },
					{ at: 1400, do: 'enter', el: 'pk-lease' },
					{ at: 1600, do: 'move', el: 'pk-lease', to: 'a-lease-re', dur: 1300 },
					{ at: 2900, do: 'enter', el: 'lb-match' },
					{ at: 3500, do: 'pulse', el: 'n-re' },
					// Forced update: the remote branch now points at the new commits.
					{ at: lease.start(1), do: 'exit', el: 'pk-lease', dur: 300 },
					{ at: lease.start(1) + 100, do: 'exit', el: 'lb-match', dur: 300 },
					{ at: lease.start(1) + 200, do: 'exit', el: 'n-rd', dur: 400 },
					{ at: lease.start(1) + 200, do: 'exit', el: 'n-re', dur: 400 },
					{ at: lease.start(1) + 200, do: 'exit', el: 'e-rbd', dur: 400 },
					{ at: lease.start(1) + 200, do: 'exit', el: 'e-rde', dur: 400 },
					{ at: lease.start(1) + 600, do: 'draw', el: 'e-rcd2', dur: 400 },
					{ at: lease.start(1) + 800, do: 'enter', el: 'n-rd2' },
					{ at: lease.start(1) + 1000, do: 'draw', el: 'e-rd2e2', dur: 400 },
					{ at: lease.start(1) + 1200, do: 'enter', el: 'n-re2' },
					{ at: lease.start(1) + 1300, do: 'move', el: 'tg-rfeat', to: 't1-re2', dur: 900 },
					{ at: lease.start(1) + 1500, do: 'move', el: 'tg-ofeat', to: 't3-le2', dur: 900 },
					...typeOut(lease.start(1) + 1300, 'lease', 450),
					{ at: lease.start(1) + 2200, do: 'enter', el: 'lb-forced' },
					{ at: lease.start(1) + 3000, do: 'enter', el: 'lb-pr' },
					{ at: lease.start(1) + 3600, do: 'pulse', el: 'n-re2' },
					{ at: lease.start(1) + 4200, do: 'pulse', el: 'lb-pr' },
				),
			},
		},

		// ─── Scene 6. Linear history ────────────────────────────────────────
		{
			id: 'recap',
			chapter: 'recap',
			scene: 'journey',
			title: { es: 'Historial lineal y la regla de oro', en: 'Linear history and the golden rule' },
			subtitles: recap.list,
			motion: {
				cues: seq(
					...clear(0, 'out-lease', 'on-8', 'lb-forced', 'lb-pr', 'p', 'hl'),
					shot(300, 'shot-all', 3000),
					{ at: 1200, do: 'flow', el: 'e-lbc' },
					{ at: 1300, do: 'flow', el: 'e-lcd2' },
					{ at: 1400, do: 'flow', el: 'e-ld2e2' },
					{ at: 1500, do: 'flow', el: 'e-rbc' },
					{ at: 1600, do: 'flow', el: 'e-rcd2' },
					{ at: 1700, do: 'flow', el: 'e-rd2e2' },
					{ at: 2000, do: 'enter', el: 'r-linear' },
					{ at: 3200, do: 'pulse', el: 'n-le2' },
					{ at: 3600, do: 'pulse', el: 'n-re2' },
					{ at: recap.start(1) + 300, do: 'enter', el: 'r-gold' },
					{ at: recap.start(1) + 1500, do: 'enter', el: 'r-lease' },
					{ at: recap.start(1) + 2600, do: 'pulse', el: 'r-gold' },
					{ at: recap.start(1) + 3400, do: 'pulse', el: 'r-lease' },
				),
			},
		},
	],
};
