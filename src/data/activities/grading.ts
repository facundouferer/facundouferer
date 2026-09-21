// Pure grading logic for `quiz` lesson activities. No Astro/DOM dependency so
// it can run both in the client-side quiz script and in `node --test`.
//
// Question kinds are a discriminated union on `kind` so a new kind (e.g.
// `multiple-select`) can be added later without touching existing callers —
// `isAnswerCorrect` and `getCorrectAnswerLabel` are the only two functions
// that need a new branch.

export type SingleChoiceOption = {
	id: string;
	text: string;
};

export type SingleChoiceQuestion = {
	kind: 'single-choice';
	id: string;
	prompt: string;
	options: SingleChoiceOption[];
	correctOptionId: string;
	explanation: string;
};

export type TrueFalseQuestion = {
	kind: 'true-false';
	id: string;
	prompt: string;
	correctAnswer: boolean;
	explanation: string;
};

export type QuizQuestion = SingleChoiceQuestion | TrueFalseQuestion;

/** A learner's answer for one question: an option id, a boolean, or unanswered. */
export type QuizAnswer = string | boolean | undefined;

export type QuizAnswers = Record<string, QuizAnswer>;

export type QuestionResult = {
	questionId: string;
	/** Whether the learner selected/answered anything at all for this question. */
	answered: boolean;
	/** Whether the given answer matches the correct answer. Unanswered is always false. */
	correct: boolean;
};

export type QuizResult = {
	results: QuestionResult[];
	correctCount: number;
	totalCount: number;
	/** correctCount / totalCount normalized to 10, rounded to one decimal. 0 when totalCount is 0. */
	scoreOutOfTen: number;
};

/**
 * Whether `answer` matches the correct answer for `question`.
 * An unanswered question (answer === undefined) is always incorrect.
 */
export function isAnswerCorrect(question: QuizQuestion, answer: QuizAnswer): boolean {
	if (answer === undefined) return false;

	if (question.kind === 'single-choice') {
		return answer === question.correctOptionId;
	}

	return answer === question.correctAnswer;
}

/**
 * Grades a full quiz: per-question results, correct/total counts, and a
 * score normalized to 10 points (rounded to one decimal). Questions absent
 * from `answers` are treated as unanswered and count as incorrect.
 */
export function gradeQuiz(questions: QuizQuestion[], answers: QuizAnswers): QuizResult {
	const results: QuestionResult[] = questions.map((question) => {
		const answer = answers[question.id];
		return {
			questionId: question.id,
			answered: answer !== undefined,
			correct: isAnswerCorrect(question, answer),
		};
	});

	const correctCount = results.filter((result) => result.correct).length;
	const totalCount = questions.length;
	const scoreOutOfTen = totalCount === 0 ? 0 : roundToOneDecimal((correctCount / totalCount) * 10);

	return { results, correctCount, totalCount, scoreOutOfTen };
}

function roundToOneDecimal(value: number): number {
	return Math.round(value * 10) / 10;
}

/**
 * Formats a score (already 0–10) with a Spanish decimal comma and the
 * "/ 10" suffix, e.g. `7,5 / 10`. Rounds to one decimal first.
 */
export function formatScore(score: number): string {
	return `${roundToOneDecimal(score).toFixed(1).replace('.', ',')} / 10`;
}

/**
 * Human-readable label for the correct answer to `question`. For
 * single-choice questions this is the matching option's text; for
 * true-false questions it is the localized boolean label supplied by the
 * caller (this module stays locale-agnostic).
 */
export function getCorrectAnswerLabel(
	question: QuizQuestion,
	labels: { trueLabel: string; falseLabel: string },
): string {
	if (question.kind === 'single-choice') {
		return question.options.find((option) => option.id === question.correctOptionId)?.text ?? '';
	}

	return question.correctAnswer ? labels.trueLabel : labels.falseLabel;
}
