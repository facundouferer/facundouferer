import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('articles catalog includes pagination controls and page size', async () => {
	const content = await readFile('src/components/ArticlesCatalog.astro', 'utf8');
	assert.match(content, /id="articles-pager"/);
	assert.match(content, /const pageSize = 9/);
	assert.match(content, /prev-page/);
	assert.match(content, /next-page/);
});
