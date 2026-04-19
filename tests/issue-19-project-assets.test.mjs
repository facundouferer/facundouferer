import test from 'node:test';
import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';

const assetPaths = [
	'public/img/projects/proyecto01.png',
	'public/img/projects/proyecto02.png',
	'public/img/projects/proyecto03.png',
	'public/img/projects/proyecto04.png',
	'public/img/projects/proyecto05.png',
	'public/img/articles/entodaspartes.png',
	'public/img/articles/empresasia.png',
	'public/img/articles/ias.png',
	'public/img/articles/iaescribiendo.png',
	'public/img/articles/imagenotfound.png',
];

test('project image assets exist for all project cards', async () => {
	await Promise.all(assetPaths.map((assetPath) => access(assetPath)));
	assert.equal(assetPaths.length, 10);
});
