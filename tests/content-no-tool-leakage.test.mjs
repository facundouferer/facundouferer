import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const CONTENT_ROOT = 'src/content';
const LEAKAGE_LINE = /^<\/?(content|invoke|parameter)\b[^>]*>\s*$/m;

function listMarkdownFiles(dir) {
	return readdirSync(dir).flatMap((name) => {
		const path = join(dir, name);
		if (statSync(path).isDirectory()) return listMarkdownFiles(path);
		return path.endsWith('.md') ? [path] : [];
	});
}

test('content files contain no leaked tool-call markup lines', () => {
	const offenders = listMarkdownFiles(CONTENT_ROOT).filter((file) =>
		LEAKAGE_LINE.test(readFileSync(file, 'utf8')),
	);
	assert.deepEqual(offenders, []);
});
