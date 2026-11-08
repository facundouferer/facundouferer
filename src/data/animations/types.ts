import type { CodeLanguage } from '../../utils/highlightCode';

export type Localized = {
	es: string;
	en: string;
};

/** A source file shown in a terminal-styled panel with syntax colors. */
export interface CodePanel {
	/** File name shown in the panel chrome, e.g. `HolaMundo.java`. */
	title: string;
	language: CodeLanguage;
	source: Localized;
	/** 1-based lines to emphasize; the rest of the panel dims while they are set. */
	focusLines?: number[];
}

export type ShellLineKind = 'cmd' | 'out' | 'err' | 'cmt';

export interface ShellLine {
	kind: ShellLineKind;
	text: Localized;
}

/** A terminal session: commands typed by the learner and what they print. */
export interface ShellPanel {
	title?: string;
	lines: ShellLine[];
}

export interface AnimationChapter {
	id: string;
	label: Localized;
}

/**
 * Cues act on one `data-el` of a motion scene:
 * - `enter` / `exit`: fade and pop the element in or out.
 * - `draw`: draw its `.mg-stroke` paths on, then fade its `.mg-head` arrowheads in.
 * - `type`: reveal it left to right, one character at a time.
 * - `flow`: start marching dashes along its strokes (kept until the scene resets).
 * - `pulse` / `spin`: a short scale bump, or two turns of its `.mg-spin` children.
 */
export type MotionElementCueKind = 'enter' | 'exit' | 'draw' | 'type' | 'flow' | 'pulse' | 'spin';

export interface MotionElementCue {
	/** Start time in ms from the beginning of the step. */
	at: number;
	do: MotionElementCueKind;
	el: string;
	dur?: number;
}

/** Glides an element along a soft arc to the center of another `data-el` or `data-anchor`. */
export interface MotionMoveCue {
	at: number;
	do: 'move';
	el: string;
	to: string;
	dur?: number;
	dx?: number;
	dy?: number;
}

/** Pans and zooms the scene camera to frame some elements, or back to the whole canvas. */
export interface MotionCameraCue {
	at: number;
	do: 'camera';
	to: string[] | 'all';
	dur?: number;
	/** Breathing room around the framed elements, in canvas units. */
	pad?: number;
}

export type MotionCue = MotionElementCue | MotionMoveCue | MotionCameraCue;
export type MotionCueKind = MotionCue['do'];

/**
 * One caption of a step's narration, shown from `at` until the next caption
 * starts. Without `at` it follows the previous caption once that one has been
 * read (see `subtitleReadingTime`), so slide steps only list their sentences;
 * motion steps pin `at` to sync captions with their cues.
 */
export interface Subtitle {
	at?: number;
	text: Localized;
}

/** Timeline of a motion step: the cues that choreograph its scene. */
export interface MotionTimeline {
	cues: MotionCue[];
}

export interface AnimationStep {
	id: string;
	/** `AnimationChapter.id` this step belongs to. */
	chapter: string;
	/** `data-scene` id of the diagram shown while this step is active. */
	scene: string;
	/** Slide steps: `data-el` ids revealed, or `'*'` for every element of the scene. */
	show?: string[] | '*';
	/** Slide steps: `data-el` ids emphasized; the rest of the scene dims. */
	focus?: string[];
	title: Localized;
	/**
	 * Narration as short captions, one idea each. The player shows them as
	 * subtitles; joined, they are the narration screen readers get.
	 */
	subtitles: Subtitle[];
	code?: CodePanel;
	shell?: ShellPanel;
	/**
	 * Motion steps animate a persistent canvas instead of revealing elements: the
	 * scene keeps its state between consecutive motion steps.
	 */
	motion?: MotionTimeline;
	/** Autoplay dwell time in ms. Estimated from the captions and panels when omitted. */
	duration?: number;
}

export interface AnimationScript {
	chapters: AnimationChapter[];
	steps: AnimationStep[];
}
