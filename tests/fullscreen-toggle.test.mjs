import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Animations and presentations offer a fullscreen toggle that fits the
// player to the monitor. One shared component owns the button and the script.

const TOGGLE = 'src/components/FullscreenToggle.astro';
const PLAYER = 'src/components/animations/AnimationPlayer.astro';
const PRESENTATION_PAGES = ['src/pages/presentaciones/[slug].astro', 'src/pages/[lang]/presentaciones/[slug].astro'];

test('the toggle requests fullscreen on its closest root and swaps its label', async () => {
	const source = await readFile(TOGGLE, 'utf8');
	assert.match(source, /data-fullscreen-toggle/);
	assert.match(source, /closest\(['"]\[data-fullscreen-root\]['"]\)/);
	assert.match(source, /requestFullscreen/);
	assert.match(source, /exitFullscreen/);
	assert.match(source, /fullscreenchange/);
	assert.match(source, /aria-pressed/);
	assert.match(source, /t\('fullscreen\.enter'\)/);
	assert.match(source, /t\('fullscreen\.exit'\)/);
	assert.match(source, /stroke-width="2\.75"/, 'Lucide icons at 2.75');
});

test('the toggle hides itself where fullscreen is unavailable', async () => {
	const source = await readFile(TOGGLE, 'utf8');
	assert.match(source, /fullscreenEnabled/);
	assert.match(source, /\bhidden\b/);
});

test('the fullscreen strings exist in both locales', async () => {
	for (const lang of ['es', 'en']) {
		const messages = JSON.parse(await readFile(`src/i18n/${lang}.json`, 'utf8'));
		assert.ok(messages.fullscreen?.enter, `${lang}: fullscreen.enter`);
		assert.ok(messages.fullscreen?.exit, `${lang}: fullscreen.exit`);
	}
});

test('the animation player is a fullscreen root that fills the screen', async () => {
	const source = await readFile(PLAYER, 'utf8');
	assert.match(source, /<section class="anim-player"[^>]*data-fullscreen-root/);
	assert.match(source, /<FullscreenToggle/);
	assert.match(source, /\.anim-player:fullscreen\s*\{[^}]*height:\s*100dvh/);
});

for (const page of PRESENTATION_PAGES) {
	test(`${page} wraps the presentation in a fullscreen root`, async () => {
		const source = await readFile(page, 'utf8');
		assert.match(source, /data-fullscreen-root/);
		assert.match(source, /<FullscreenToggle/);
		assert.match(source, /:fullscreen\s*\{[^}]*--site-header-height:\s*0px/);
		assert.match(source, /:fullscreen\s*\{[^}]*overflow-y:\s*auto/);
	});
}
