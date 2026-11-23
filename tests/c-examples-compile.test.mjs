import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { checkFiles, extractPrograms, findCompiler } from '../scripts/check-c-examples.mjs';
import { DONE_STAGE, LESSONS } from './helpers/c-curriculum.mjs';

// S9 of odd/tasks/c-course-redesign.md: every complete program of the C
// lessons of finished stages compiles with the course flags
// (-std=c23 -Wall -Wextra -Wpedantic) without warnings. Skips when no C
// compiler is installed.

test('extractPrograms finds programs, ignores fragments and honors the skip marker', () => {
	const markdown = [
		'```c', 'int x = 1;', '```',
		'```c', 'int main(void) { return 0; }', '```',
		'<!-- c-check: skip -->', '', '```c', 'void main() {}', '```',
		'```c', '#include "pila.h"', 'int main(void) { return 0; }', '```',
	].join('\n');
	const programs = extractPrograms(markdown);
	assert.equal(programs.length, 3);
	assert.deepEqual(programs.map((program) => program.skip), [false, true, true]);
});

const cc = findCompiler();
const files = LESSONS.filter((lesson) => lesson.stage <= DONE_STAGE)
	.flatMap((lesson) => ['es', 'en'].map((lang) => `src/content/courses/c/${lesson.file}.${lang}.md`))
	.filter((file) => existsSync(file));

test('the programs of finished C lessons compile with the course flags', { skip: !cc && 'no C compiler' }, () => {
	const { compiled, failures } = checkFiles(files, cc);
	assert.ok(compiled > 0, 'expected programs to compile');
	assert.deepEqual(failures.map((failure) => `${failure.file}:${failure.line}\n${failure.output}`), []);
});
