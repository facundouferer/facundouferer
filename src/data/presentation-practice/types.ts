/**
 * Practice and assessment items shown under a presentation (report §7 of the
 * C course redesign: the "Aprender" mode is the deck itself; "Practicar" and
 * "Evaluar" come from a data file per deck, rendered by
 * `PresentationPractice.astro`).
 */

export type Localized = { es: string; en: string };

export interface PracticeOption {
	id: string;
	text: Localized;
}

export interface PracticeItem {
	id: string;
	/** Question; short code mentions go in backticks. */
	prompt: Localized;
	/** Optional C snippet, shared by both languages or localized. */
	code?: string | Localized;
	options: PracticeOption[];
	/** Id of the correct option. */
	correct: string;
	/** Why the answer is right, shown after answering (practice) or grading (assess). */
	explanation: Localized;
}

export interface PracticeSet {
	/** "Predict the next state or result": immediate feedback per item. */
	practice: PracticeItem[];
	/** "Solve without hints": graded at the end. */
	assess: PracticeItem[];
}
