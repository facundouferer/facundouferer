import type {
	AnimationChapter,
	AnimationScript,
	AnimationStep,
	CodePanel,
	ShellLine,
	ShellPanel,
} from '../data/animations/types';

type Locale = 'es' | 'en';

export interface ResolvedCodePanel extends Omit<CodePanel, 'source'> {
	source: string;
}

export interface ResolvedShellLine extends Omit<ShellLine, 'text'> {
	text: string;
}

export interface ResolvedShellPanel extends Omit<ShellPanel, 'lines'> {
	lines: ResolvedShellLine[];
}

export interface ResolvedStep
	extends Omit<AnimationStep, 'title' | 'text' | 'code' | 'shell' | 'duration'> {
	index: number;
	title: string;
	text: string;
	code?: ResolvedCodePanel;
	shell?: ResolvedShellPanel;
	duration: number;
}

export interface ResolvedChapter extends Omit<AnimationChapter, 'label'> {
	label: string;
	/** Index of the first step of the chapter, for the chapter navigation. */
	firstStepIndex: number;
}

export interface ResolvedScript {
	chapters: ResolvedChapter[];
	steps: ResolvedStep[];
}

const BASE_DURATION_MS = 3200;
const MS_PER_CHARACTER = 42;
const MS_PER_SHELL_LINE = 900;
const MS_PER_CODE_LINE = 220;
const MAX_DURATION_MS = 26000;

/**
 * Autoplay dwell time for one step: long enough to read the narration and
 * watch the terminal lines appear, capped so a long step never stalls playback.
 */
export function estimateStepDuration(step: Pick<AnimationStep, 'text' | 'code' | 'shell' | 'duration'>, locale: Locale): number {
	if (step.duration) return step.duration;
	const textLength = step.text[locale].length;
	const shellLines = step.shell?.lines.length ?? 0;
	const codeLines = step.code ? step.code.source[locale].split('\n').length : 0;
	const estimate = BASE_DURATION_MS + textLength * MS_PER_CHARACTER + shellLines * MS_PER_SHELL_LINE + codeLines * MS_PER_CODE_LINE;
	return Math.min(estimate, MAX_DURATION_MS);
}

/** Resolves every localized field of a script to plain strings for one locale. */
export function resolveScript(script: AnimationScript, locale: Locale): ResolvedScript {
	const steps: ResolvedStep[] = script.steps.map((step, index) => ({
		...step,
		index,
		title: step.title[locale],
		text: step.text[locale],
		code: step.code ? { ...step.code, source: step.code.source[locale] } : undefined,
		shell: step.shell
			? {
					...step.shell,
					lines: step.shell.lines.map((line) => ({ ...line, text: line.text[locale] })),
				}
			: undefined,
		duration: estimateStepDuration(step, locale),
	}));

	const chapters: ResolvedChapter[] = script.chapters.map((chapter) => {
		const firstStepIndex = steps.findIndex((step) => step.chapter === chapter.id);
		return { id: chapter.id, label: chapter.label[locale], firstStepIndex: firstStepIndex < 0 ? 0 : firstStepIndex };
	});

	return { chapters, steps };
}

/**
 * Referential checks a script must pass before it ships: every step points to
 * a known chapter, every chapter owns at least one step, and step ids are
 * unique. Returns a list of human-readable problems (empty when valid).
 */
export function validateScript(script: AnimationScript): string[] {
	const problems: string[] = [];
	const chapterIds = new Set(script.chapters.map((chapter) => chapter.id));
	const seenSteps = new Set<string>();
	const usedChapters = new Set<string>();

	for (const step of script.steps) {
		if (seenSteps.has(step.id)) problems.push(`duplicate step id "${step.id}"`);
		seenSteps.add(step.id);
		if (!chapterIds.has(step.chapter)) problems.push(`step "${step.id}" references unknown chapter "${step.chapter}"`);
		usedChapters.add(step.chapter);
		if (step.show !== '*' && step.show.length === 0) problems.push(`step "${step.id}" shows no element`);
	}

	for (const chapter of script.chapters) {
		if (!usedChapters.has(chapter.id)) problems.push(`chapter "${chapter.id}" has no steps`);
	}

	return problems;
}
