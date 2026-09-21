// Safe inline-code renderer for quiz prompts/options/explanations. Content
// authors write short inline code mentions using backticks (e.g. `this`,
// `new`), the same convention as Markdown. This escapes the input as HTML
// first, then converts backtick-delimited spans into <code> elements, so the
// only markup it can ever produce is <code>...</code> around already-escaped
// text — safe to pass to Astro's `set:html`.

function escapeHtml(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

/**
 * Escapes `text` as HTML, then converts backtick-delimited spans
 * (`` `code` ``) into `<code>` elements.
 */
export function renderInlineCode(text: string): string {
	const escaped = escapeHtml(text);
	return escaped.replace(/`([^`]+)`/g, '<code>$1</code>');
}
