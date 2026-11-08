import type {
	AnimationChapter,
	AnimationScript,
	AnimationStep,
	CodePanel,
	MotionCue,
	MotionCueKind,
	ShellLine,
	ShellPanel,
	Subtitle,
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

export interface ResolvedSubtitle {
	at: number;
	text: string;
}

export interface ResolvedMotion {
	/** Cues sorted by start time, the order the player schedules them in. */
	cues: MotionCue[];
}

export interface ResolvedStep
	extends Omit<AnimationStep, 'show' | 'title' | 'subtitles' | 'code' | 'shell' | 'motion' | 'duration'> {
	index: number;
	show: string[] | '*';
	title: string;
	/** Captions with their start time resolved for this locale. */
	subtitles: ResolvedSubtitle[];
	/** The captions joined: the narration screen readers get. */
	text: string;
	code?: ResolvedCodePanel;
	shell?: ResolvedShellPanel;
	motion?: ResolvedMotion;
	duration: number;
}

export interface ResolvedChapter extends Omit<AnimationChapter, 'label'> {
	label: string;
	/** Index of the first step of the chapter. */
	firstStepIndex: number;
}

export interface ResolvedScript {
	chapters: ResolvedChapter[];
	steps: ResolvedStep[];
}

const BASE_DURATION_MS = 3200;
const MS_PER_SHELL_LINE = 900;
const MS_PER_CODE_LINE = 220;
const MAX_DURATION_MS = 26000;

/**
 * Default length of each motion cue. The player imports the same table, so the
 * autoplay dwell time computed here matches what the browser actually plays.
 */
export const MOTION_CUE_DEFAULT_MS: Record<MotionCueKind, number> = {
	enter: 600,
	exit: 450,
	draw: 800,
	type: 1200,
	flow: 0,
	pulse: 700,
	spin: 1600,
	move: 1200,
	camera: 1400,
};

const SUBTITLE_BASE_MS = 1200;
const SUBTITLE_MS_PER_CHARACTER = 55;
const STEP_TAIL_MS = 800;

/** Time a caption needs on screen to be read comfortably. */
export function subtitleReadingTime(text: string): number {
	return SUBTITLE_BASE_MS + text.length * SUBTITLE_MS_PER_CHARACTER;
}

export function cueEnd(cue: MotionCue): number {
	return cue.at + (cue.dur ?? MOTION_CUE_DEFAULT_MS[cue.do]);
}

/**
 * Places every caption on the step timeline for one locale: an explicit `at`
 * wins, otherwise a caption starts once the previous one has been read.
 */
export function resolveSubtitles(subtitles: Subtitle[], locale: Locale): ResolvedSubtitle[] {
	let cursor = 0;
	return subtitles.map((subtitle) => {
		const text = subtitle.text[locale];
		const at = subtitle.at ?? cursor;
		cursor = at + subtitleReadingTime(text);
		return { at, text };
	});
}

/** Moment the last caption of a step has been read. */
export function captionsEnd(subtitles: ResolvedSubtitle[]): number {
	return Math.max(0, ...subtitles.map((subtitle) => subtitle.at + subtitleReadingTime(subtitle.text)));
}

/** Narration of a step: its captions joined. */
export function stepNarration(step: Pick<AnimationStep, 'subtitles'>, locale: Locale): string {
	return step.subtitles.map((subtitle) => subtitle.text[locale]).join(' ');
}

/**
 * Autoplay dwell time for one step: until its captions have been read and, for
 * slide steps, long enough to watch the terminal lines appear (capped so a long
 * step never stalls playback). Motion steps also wait for their last cue.
 */
export function estimateStepDuration(
	step: Pick<AnimationStep, 'subtitles' | 'code' | 'shell' | 'motion' | 'duration'>,
	locale: Locale,
): number {
	if (step.duration) return step.duration;
	const captions = captionsEnd(resolveSubtitles(step.subtitles, locale));
	if (step.motion) return Math.max(captions, ...step.motion.cues.map(cueEnd)) + STEP_TAIL_MS;
	const shellLines = step.shell?.lines.length ?? 0;
	const codeLines = step.code ? step.code.source[locale].split('\n').length : 0;
	const panels = BASE_DURATION_MS + shellLines * MS_PER_SHELL_LINE + codeLines * MS_PER_CODE_LINE;
	return Math.min(Math.max(captions + STEP_TAIL_MS, panels), MAX_DURATION_MS);
}

/** Resolves every localized field of a script to plain strings for one locale. */
export function resolveScript(script: AnimationScript, locale: Locale): ResolvedScript {
	const steps: ResolvedStep[] = script.steps.map((step, index) => ({
		...step,
		index,
		show: step.show ?? [],
		title: step.title[locale],
		subtitles: resolveSubtitles(step.subtitles, locale),
		text: stepNarration(step, locale),
		code: step.code ? { ...step.code, source: step.code.source[locale] } : undefined,
		shell: step.shell
			? {
					...step.shell,
					lines: step.shell.lines.map((line) => ({ ...line, text: line.text[locale] })),
				}
			: undefined,
		motion: step.motion ? { cues: [...step.motion.cues].sort((a, b) => a.at - b.at) } : undefined,
		duration: estimateStepDuration(step, locale),
	}));

	const chapters: ResolvedChapter[] = script.chapters.map((chapter) => {
		const firstStepIndex = steps.findIndex((step) => step.chapter === chapter.id);
		return { id: chapter.id, label: chapter.label[locale], firstStepIndex: firstStepIndex < 0 ? 0 : firstStepIndex };
	});

	return { chapters, steps };
}

function validateSubtitles(step: AnimationStep): string[] {
	const problems: string[] = [];
	if (step.subtitles.length === 0) return [`step "${step.id}" has no captions`];
	if ((step.subtitles[0].at ?? 0) !== 0) problems.push(`step "${step.id}" must caption from 0 ms`);

	for (const locale of ['es', 'en'] as const) {
		const resolved = resolveSubtitles(step.subtitles, locale);
		resolved.forEach((subtitle, index) => {
			const next = resolved[index + 1];
			if (!next) return;
			if (next.at <= subtitle.at) problems.push(`captions of "${step.id}" are not in time order`);
			const needed = subtitleReadingTime(subtitle.text);
			const shown = next.at - subtitle.at;
			if (shown < needed) {
				problems.push(`caption ${index + 1} of "${step.id}" stays ${shown} ms but needs ${needed} ms to read in ${locale}`);
			}
		});
	}
	return problems;
}

/**
 * Referential checks a script must pass before it ships: every step points to
 * a known chapter, every chapter owns at least one step, step ids are unique,
 * captions stay on screen long enough to be read, slide steps reveal something
 * and motion steps keep slide fields out. Returns human-readable problems.
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
		problems.push(...validateSubtitles(step));

		if (step.motion) {
			if (step.show || step.focus) problems.push(`motion step "${step.id}" must not use show/focus (cues drive the scene)`);
			if (step.code || step.shell) problems.push(`motion step "${step.id}" must draw its code in the scene, not in panels`);
			for (const cue of step.motion.cues) {
				if (cue.at < 0) problems.push(`cue "${cue.do}" of "${step.id}" starts before the step`);
				if (cue.do === 'camera' && cue.to !== 'all' && cue.to.length === 0) {
					problems.push(`camera cue of "${step.id}" frames nothing`);
				}
			}
			continue;
		}
		if (!step.show || (step.show !== '*' && step.show.length === 0)) problems.push(`step "${step.id}" shows no element`);
	}

	for (const chapter of script.chapters) {
		if (!usedChapters.has(chapter.id)) problems.push(`chapter "${chapter.id}" has no steps`);
	}

	return problems;
}
