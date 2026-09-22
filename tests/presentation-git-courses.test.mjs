import { test } from 'node:test';
import assert from 'node:assert';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { presentations, categories, getPresentationsForLesson, getLessonForPresentation } from '../src/data/presentations.ts';

const GIT_PRESENTATIONS = [
	{
		slug: 'fundamentos-tres-estados-git',
		lessonSlug: 'el-principio-con-git',
		image: '/img/presentations/fundamentos-tres-estados-git.svg',
		component: 'src/components/presentaciones/fundamentos-tres-estados-git.astro',
	},
	{
		slug: 'sincronizacion-remota-pull-push-git',
		lessonSlug: 'bajar-y-subir-cambios',
		image: '/img/presentations/sincronizacion-remota-pull-push-git.svg',
		component: 'src/components/presentaciones/sincronizacion-remota-pull-push-git.astro',
	},
	{
		slug: 'ramas-merge-conflictos-git',
		lessonSlug: 'conflictos',
		image: '/img/presentations/ramas-merge-conflictos-git.svg',
		component: 'src/components/presentaciones/ramas-merge-conflictos-git.astro',
	},
	{
		slug: 'rebase-buenas-practicas-git',
		lessonSlug: 'rebase-y-buenas-practicas',
		image: '/img/presentations/rebase-buenas-practicas-git.svg',
		component: 'src/components/presentaciones/rebase-buenas-practicas-git.astro',
	},
];

test('presentations catalog carries all 4 Git presentation records', () => {
	for (const p of GIT_PRESENTATIONS) {
		const pres = presentations.find((item) => item.slug === p.slug);
		assert.ok(pres, `${p.slug} must be registered in presentations array`);
		assert.equal(pres.lesson.course, 'git');
		assert.equal(pres.lesson.slug, p.lessonSlug);
		assert.equal(pres.image, p.image);
		assert.equal(pres.tag.es, 'Git');
		assert.equal(pres.tag.en, 'Git');
	}
});

test('categories list includes the Git category filter', () => {
	const gitCat = categories.find((c) => c.filter === 'Git');
	assert.ok(gitCat, 'Git filter must exist in categories array');
	assert.equal(gitCat.label.es, '~/git');
	assert.equal(gitCat.label.en, '~/git');
});

test('getPresentationsForLesson and getLessonForPresentation map correctly for Git', () => {
	for (const p of GIT_PRESENTATIONS) {
		const mapped = getPresentationsForLesson('git', p.lessonSlug);
		assert.ok(mapped.some((item) => item.slug === p.slug));
		const lesson = getLessonForPresentation(p.slug);
		assert.deepEqual(lesson, { course: 'git', slug: p.lessonSlug });
	}
});

test('presentation card SVG assets exist for all Git presentations', () => {
	for (const p of GIT_PRESENTATIONS) {
		assert.ok(existsSync(`public${p.image}`), `Missing SVG asset: public${p.image}`);
	}
});

test('presentation Astro components exist and define 6 slides each', async () => {
	for (const p of GIT_PRESENTATIONS) {
		assert.ok(existsSync(p.component), `Missing component: ${p.component}`);
		const content = await readFile(p.component, 'utf8');
		for (let i = 1; i <= 6; i++) {
			assert.match(content, new RegExp(`data-slide="${i}"`), `${p.component} missing slide ${i}`);
		}
	}
});

test('both presentation detail pages import and map all 4 Git presentations', async () => {
	for (const file of [
		'src/pages/presentaciones/[slug].astro',
		'src/pages/[lang]/presentaciones/[slug].astro',
	]) {
		const content = await readFile(file, 'utf8');
		assert.match(content, /FundamentosTresEstadosGit/);
		assert.match(content, /SincronizacionRemotaPullPushGit/);
		assert.match(content, /RamasMergeConflictosGit/);
		assert.match(content, /RebaseBuenasPracticasGit/);
		for (const p of GIT_PRESENTATIONS) {
			assert.match(content, new RegExp(`'${p.slug}':`));
		}
	}
});
