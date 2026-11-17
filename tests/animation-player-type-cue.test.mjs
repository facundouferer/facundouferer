import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const player = await readFile('src/components/animations/AnimationPlayer.astro', 'utf8');
const typeCue = player.slice(player.indexOf("case 'type': {"), player.indexOf("case 'flow': {"));

test('the type cue reveals one character per step', () => {
	assert.match(typeCue, /\(el\.textContent \?\? ''\)\.trim\(\)\.length/);
	assert.match(typeCue, /clipPath: 'inset\(0 100% 0 0\)'/);
	assert.match(typeCue, /clipPath: 'inset\(0 0% 0 0\)'/);
});

test('the type cue reaches the full line before the animation ends', () => {
	// Chrome can finish a delayed `steps(n, end)` animation one step short, leaving the
	// last character (or a one-character line) clipped. `jump-start` reaches the final
	// value one interval before the end, so rounding at the end cannot hide it.
	assert.match(typeCue, /easing: `steps\(\$\{characters\}, jump-start\)`/);
	assert.doesNotMatch(typeCue, /steps\(\$\{characters\}, end\)/);
});
