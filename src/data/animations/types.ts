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

export interface AnimationStep {
	id: string;
	/** `AnimationChapter.id` this step belongs to. */
	chapter: string;
	/** `data-scene` id of the diagram shown while this step is active. */
	scene: string;
	/** `data-el` ids revealed in this step, or `'*'` for every element of the scene. */
	show: string[] | '*';
	/** `data-el` ids emphasized in this step; the rest of the scene dims. */
	focus?: string[];
	title: Localized;
	text: Localized;
	code?: CodePanel;
	shell?: ShellPanel;
	/** Autoplay dwell time in ms. Estimated from the text when omitted. */
	duration?: number;
}

export interface AnimationScript {
	chapters: AnimationChapter[];
	steps: AnimationStep[];
}
