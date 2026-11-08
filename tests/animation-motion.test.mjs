import test from 'node:test';
import assert from 'node:assert/strict';
import {
	MOTION_CUE_DEFAULT_MS,
	captionsEnd,
	cueEnd,
	estimateStepDuration,
	resolveScript,
	resolveSubtitles,
	stepNarration,
	subtitleReadingTime,
	validateScript,
} from '../src/utils/animations.ts';

const caption = (es, en = es, at) => (at === undefined ? { text: { es, en } } : { at, text: { es, en } });
const LONG = 'Una frase de subtítulo con suficiente texto para leerla con calma.';
const SHORT_EN = 'A short line.';

function scriptWith(step) {
	return {
		chapters: [{ id: 'c', label: { es: 'C', en: 'C' } }],
		steps: [{ id: 's', chapter: 'c', scene: 'x', title: { es: 'T', en: 'T' }, ...step }],
	};
}

test('captions without `at` follow each other by reading time, per locale', () => {
	const subtitles = [caption(LONG, SHORT_EN), caption('Cierre.', 'End.')];
	const es = resolveSubtitles(subtitles, 'es');
	const en = resolveSubtitles(subtitles, 'en');
	assert.deepEqual(
		es.map((sub) => sub.at),
		[0, subtitleReadingTime(LONG)],
	);
	assert.deepEqual(
		en.map((sub) => sub.at),
		[0, subtitleReadingTime(SHORT_EN)],
		'each locale waits for its own sentence',
	);
	assert.equal(captionsEnd(es), subtitleReadingTime(LONG) + subtitleReadingTime('Cierre.'));
	assert.equal(stepNarration({ subtitles }, 'es'), `${LONG} Cierre.`);
});

test('an explicit `at` pins a caption and later ones follow it', () => {
	const resolved = resolveSubtitles([caption(LONG, LONG, 0), caption('B', 'B', 9000), caption('C')], 'es');
	assert.deepEqual(
		resolved.map((sub) => sub.at),
		[0, 9000, 9000 + subtitleReadingTime('B')],
	);
});

test('slide steps last until their captions are read, or longer for terminal panels', () => {
	const subtitles = [caption(LONG)];
	assert.equal(estimateStepDuration({ subtitles }, 'es'), subtitleReadingTime(LONG) + 800);

	const shell = { lines: Array.from({ length: 20 }, () => ({ kind: 'out', text: { es: 'x', en: 'x' } })) };
	assert.equal(estimateStepDuration({ subtitles: [caption('Hola.')], shell }, 'es'), 3200 + 20 * 900);
	assert.equal(estimateStepDuration({ subtitles, duration: 4000 }, 'es'), 4000, 'an explicit duration still wins');
});

test('a motion step lasts until its last cue ends and its last caption is read', () => {
	const step = { subtitles: [caption('Corta.')], motion: { cues: [{ at: 9000, do: 'move', el: 'a', to: 'b' }] } };
	assert.equal(cueEnd(step.motion.cues[0]), 9000 + MOTION_CUE_DEFAULT_MS.move);
	assert.equal(estimateStepDuration(step, 'es'), 9000 + MOTION_CUE_DEFAULT_MS.move + 800);

	const readingBound = { subtitles: [caption(LONG)], motion: { cues: [{ at: 0, do: 'enter', el: 'a', dur: 100 }] } };
	assert.equal(estimateStepDuration(readingBound, 'es'), subtitleReadingTime(LONG) + 800);
});

test('resolveScript exposes captions, narration and time-ordered cues', () => {
	const script = scriptWith({
		subtitles: [caption(LONG), caption('Cierre.')],
		motion: {
			cues: [
				{ at: 900, do: 'enter', el: 'b' },
				{ at: 0, do: 'camera', to: ['a'] },
			],
		},
	});
	assert.deepEqual(validateScript(script), []);
	const [step] = resolveScript(script, 'es').steps;
	assert.equal(step.text, `${LONG} Cierre.`);
	assert.deepEqual(
		step.subtitles.map((sub) => sub.at),
		[0, subtitleReadingTime(LONG)],
	);
	assert.deepEqual(
		step.motion.cues.map((cue) => cue.at),
		[0, 900],
	);
	assert.deepEqual(step.show, []);
});

test('validation rejects rushed, late or missing captions', () => {
	const rushed = scriptWith({ show: '*', subtitles: [caption(LONG, LONG, 0), caption('Otra.', 'Other.', 500)] });
	assert.ok(validateScript(rushed).some((problem) => /caption 1 of "s" stays 500 ms but needs \d+ ms to read in es/.test(problem)));

	const late = scriptWith({ show: '*', subtitles: [caption(LONG, LONG, 200)] });
	assert.ok(validateScript(late).includes('step "s" must caption from 0 ms'));

	const silent = scriptWith({ show: '*', subtitles: [] });
	assert.ok(validateScript(silent).includes('step "s" has no captions'));
});

test('validation keeps slide fields out of motion steps and requires slide steps to reveal something', () => {
	const mixed = scriptWith({
		show: ['a'],
		shell: { lines: [] },
		subtitles: [caption(LONG)],
		motion: { cues: [{ at: 0, do: 'camera', to: [] }] },
	});
	const problems = validateScript(mixed);
	assert.ok(problems.includes('motion step "s" must not use show/focus (cues drive the scene)'));
	assert.ok(problems.includes('motion step "s" must draw its code in the scene, not in panels'));
	assert.ok(problems.includes('camera cue of "s" frames nothing'));

	assert.deepEqual(validateScript(scriptWith({ show: '*', subtitles: [caption(LONG)] })), []);
	assert.ok(validateScript(scriptWith({ show: [], subtitles: [caption(LONG)] })).includes('step "s" shows no element'));
	assert.ok(validateScript(scriptWith({ subtitles: [caption(LONG)] })).includes('step "s" shows no element'));
});
