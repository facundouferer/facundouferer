#!/usr/bin/env node
// Compiles every complete C program shown in the C course with the course's
// declared flags, so "the examples were tested in the declared environment"
// (odd/tasks/c-course-redesign.md, S9) is checked, not assumed.
//
// A block is a complete program when it is a ```c fence that defines `main`.
// Fragments (no `main`) are not compiled. A program that is wrong on purpose
// (it shows a compiler error or warning) is skipped with the marker
//   <!-- c-check: skip -->
// on the line before its fence. Programs that include a local header
// (`#include "..."`) belong to a multi-file example and are skipped too.
//
// Usage: node scripts/check-c-examples.mjs [file.md ...]
// Without arguments it checks every C lesson. Exit code 1 on any failure,
// 2 when no C compiler is available.

import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const C_FLAGS = ['-std=c23', '-Wall', '-Wextra', '-Wpedantic', '-Werror', '-fsyntax-only'];
export const SKIP_MARKER = '<!-- c-check: skip -->';

const FENCE = /^```c[ \t]*$/;

/** Extracts the complete programs of a Markdown document. */
export function extractPrograms(markdown) {
	const lines = markdown.split('\n');
	const programs = [];
	for (let i = 0; i < lines.length; i++) {
		if (!FENCE.test(lines[i])) continue;
		const start = i + 1;
		let end = start;
		while (end < lines.length && !/^```\s*$/.test(lines[end])) end++;
		const code = lines.slice(start, end).join('\n');
		let previous = i - 1;
		while (previous >= 0 && lines[previous].trim() === '') previous--;
		const skipped = previous >= 0 && lines[previous].trim() === SKIP_MARKER;
		const isProgram = /\bmain\s*\(/.test(code);
		const localHeader = /^\s*#\s*include\s*"/m.test(code);
		if (isProgram) programs.push({ line: start, code, skip: skipped || localHeader });
		i = end;
	}
	return programs;
}

/** Returns the first available C compiler, or null. */
export function findCompiler() {
	for (const cc of [process.env.CC, 'cc', 'clang', 'gcc'].filter(Boolean)) {
		const probe = spawnSync(cc, ['--version'], { encoding: 'utf8' });
		if (probe.status === 0) return cc;
	}
	return null;
}

/** Compiles every program of the given files; returns the failures. */
export function checkFiles(files, cc) {
	const dir = mkdtempSync(join(tmpdir(), 'c-check-'));
	const failures = [];
	let compiled = 0;
	try {
		for (const file of files) {
			for (const program of extractPrograms(readFileSync(file, 'utf8'))) {
				if (program.skip) continue;
				const source = join(dir, `p${compiled}.c`);
				writeFileSync(source, `${program.code}\n`);
				compiled++;
				const result = spawnSync(cc, [...C_FLAGS, source], { encoding: 'utf8' });
				if (result.status !== 0) {
					failures.push({ file, line: program.line, output: (result.stderr || result.stdout).trim() });
				}
			}
		}
	} finally {
		rmSync(dir, { recursive: true, force: true });
	}
	return { compiled, failures };
}

export function courseFiles(dir = 'src/content/courses/c') {
	return readdirSync(dir)
		.filter((name) => /\.(es|en)\.md$/.test(name))
		.sort()
		.map((name) => join(dir, name));
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
	const cc = findCompiler();
	if (!cc) {
		console.error('No C compiler found (set CC).');
		process.exit(2);
	}
	const files = process.argv.length > 2 ? process.argv.slice(2) : courseFiles();
	const version = execFileSync(cc, ['--version'], { encoding: 'utf8' }).split('\n')[0];
	const { compiled, failures } = checkFiles(files, cc);
	for (const failure of failures) {
		console.error(`\n✖ ${failure.file}:${failure.line}\n${failure.output}`);
	}
	console.log(`${version}\n${compiled} programs compiled with ${C_FLAGS.join(' ')}, ${failures.length} failed.`);
	process.exit(failures.length ? 1 : 0);
}
