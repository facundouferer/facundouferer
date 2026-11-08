/**
 * Minimal, dependency-free syntax highlighter for the step-by-step animation
 * terminal panels. It emits `<span class="tok-*">` fragments whose colors are
 * mapped to Organic tokens by the player stylesheet, so the terminal stays on
 * the design-system palette instead of a third-party Shiki theme.
 *
 * Supported languages: `java`, `bash` and `text` (escaped only). The output is
 * one HTML string per source line so a panel can emphasize individual lines.
 */

export type CodeLanguage = 'java' | 'bash' | 'text';

export type TokenClass =
	| 'kw'
	| 'type'
	| 'fn'
	| 'str'
	| 'num'
	| 'cmt'
	| 'ann'
	| 'punct'
	| 'op'
	| 'cmd'
	| 'flag'
	| 'var'
	| 'plain';

interface Token {
	cls: TokenClass;
	text: string;
}

const JAVA_KEYWORDS = new Set([
	'abstract',
	'assert',
	'boolean',
	'break',
	'byte',
	'case',
	'catch',
	'char',
	'class',
	'const',
	'continue',
	'default',
	'do',
	'double',
	'else',
	'enum',
	'extends',
	'final',
	'finally',
	'float',
	'for',
	'goto',
	'if',
	'implements',
	'import',
	'instanceof',
	'int',
	'interface',
	'long',
	'native',
	'new',
	'package',
	'private',
	'protected',
	'public',
	'record',
	'return',
	'short',
	'static',
	'strictfp',
	'super',
	'switch',
	'synchronized',
	'this',
	'throw',
	'throws',
	'transient',
	'try',
	'var',
	'void',
	'volatile',
	'while',
	'yield',
	'true',
	'false',
	'null',
]);

const JAVA_PATTERN =
	/(\/\/[^\n]*)|(\/\*[\s\S]*?\*\/)|("(?:[^"\\\n]|\\.)*")|('(?:[^'\\\n]|\\.)*')|(@[A-Za-z_]\w*)|(\b\d[\d_]*(?:\.\d+)?[fFdDlL]?\b)|([A-Za-z_$][\w$]*)|([{}()[\];,.])|([+\-*/%=<>!&|?:^~]+)|(\n)|([^\S\n]+)|(.)/g;

const BASH_PATTERN =
	/(#[^\n]*)|("(?:[^"\\\n]|\\.)*"|'[^'\n]*')|(\$\{[^}\n]*\}|\$\w+)|(--?[A-Za-z][\w-]*)|([A-Za-z_][\w./:-]*)|(\n)|([^\S\n]+)|(&&|\|\||[|;<>])|(.)/g;

export function escapeHtml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');
}

function nextNonSpace(source: string, from: number): string {
	let index = from;
	while (index < source.length && (source[index] === ' ' || source[index] === '\t')) index += 1;
	return source[index] ?? '';
}

function tokenizeJava(source: string): Token[] {
	const tokens: Token[] = [];
	JAVA_PATTERN.lastIndex = 0;
	let match: RegExpExecArray | null;
	while ((match = JAVA_PATTERN.exec(source)) !== null) {
		const [text, lineCmt, blockCmt, str, chr, ann, num, ident, punct, op, newline] = match;
		if (text === '') {
			JAVA_PATTERN.lastIndex += 1;
			continue;
		}
		if (lineCmt || blockCmt) tokens.push({ cls: 'cmt', text });
		else if (str || chr) tokens.push({ cls: 'str', text });
		else if (ann) tokens.push({ cls: 'ann', text });
		else if (num) tokens.push({ cls: 'num', text });
		else if (ident) {
			if (JAVA_KEYWORDS.has(text)) tokens.push({ cls: 'kw', text });
			else if (nextNonSpace(source, match.index + text.length) === '(') tokens.push({ cls: 'fn', text });
			else if (/^[A-Z]/.test(text)) tokens.push({ cls: 'type', text });
			else tokens.push({ cls: 'plain', text });
		} else if (punct) tokens.push({ cls: 'punct', text });
		else if (op) tokens.push({ cls: 'op', text });
		else if (newline) tokens.push({ cls: 'plain', text });
		else tokens.push({ cls: 'plain', text });
	}
	return tokens;
}

function tokenizeBash(source: string): Token[] {
	const tokens: Token[] = [];
	let expectCommand = true;
	BASH_PATTERN.lastIndex = 0;
	let match: RegExpExecArray | null;
	while ((match = BASH_PATTERN.exec(source)) !== null) {
		const [text, cmt, str, variable, flag, word, newline, space, separator] = match;
		if (text === '') {
			BASH_PATTERN.lastIndex += 1;
			continue;
		}
		if (cmt) tokens.push({ cls: 'cmt', text });
		else if (str) {
			tokens.push({ cls: 'str', text });
			expectCommand = false;
		} else if (variable) {
			tokens.push({ cls: 'var', text });
			expectCommand = false;
		} else if (flag) {
			tokens.push({ cls: 'flag', text });
			expectCommand = false;
		} else if (word) {
			tokens.push({ cls: expectCommand ? 'cmd' : 'plain', text });
			expectCommand = false;
		} else if (newline) {
			tokens.push({ cls: 'plain', text });
			expectCommand = true;
		} else if (space) tokens.push({ cls: 'plain', text });
		else if (separator) {
			tokens.push({ cls: 'op', text });
			expectCommand = true;
		} else tokens.push({ cls: 'plain', text });
	}
	return tokens;
}

function renderToken(token: Token): string {
	const escaped = escapeHtml(token.text);
	return token.cls === 'plain' ? escaped : `<span class="tok-${token.cls}">${escaped}</span>`;
}

/**
 * Highlights `source` and returns one HTML fragment per line. Tokens that span
 * several lines (block comments) are split so every line stays self-contained.
 */
export function highlightCode(source: string, language: CodeLanguage): string[] {
	if (language === 'text') {
		return source.split('\n').map((line) => escapeHtml(line));
	}

	const tokens = language === 'java' ? tokenizeJava(source) : tokenizeBash(source);
	const lines: string[] = [''];

	for (const token of tokens) {
		const pieces = token.text.split('\n');
		pieces.forEach((piece, index) => {
			if (index > 0) lines.push('');
			if (piece.length > 0) {
				lines[lines.length - 1] += renderToken({ cls: token.cls, text: piece });
			}
		});
	}

	return lines;
}

/** Convenience wrapper for a single line (e.g. one shell command). */
export function highlightLine(line: string, language: CodeLanguage): string {
	return highlightCode(line, language)[0] ?? '';
}
