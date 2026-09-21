import test from 'node:test';
import assert from 'node:assert/strict';

const GRADING_MODULE_PATH = '../src/data/activities/grading.ts';

let grading;

test('src/data/activities/grading.ts can be loaded and exports the grading functions', async () => {
	grading = await import(GRADING_MODULE_PATH);
	assert.equal(typeof grading.isAnswerCorrect, 'function');
	assert.equal(typeof grading.gradeQuiz, 'function');
	assert.equal(typeof grading.formatScore, 'function');
	assert.equal(typeof grading.getCorrectAnswerLabel, 'function');
});

// --- isAnswerCorrect ---------------------------------------------------

test('isAnswerCorrect: single-choice question is correct when the answer matches correctOptionId', () => {
	const question = {
		kind: 'single-choice',
		id: 'q1',
		prompt: 'prompt',
		options: [
			{ id: 'a', text: 'A' },
			{ id: 'b', text: 'B' },
		],
		correctOptionId: 'b',
		explanation: 'because',
	};
	assert.equal(grading.isAnswerCorrect(question, 'b'), true);
	assert.equal(grading.isAnswerCorrect(question, 'a'), false);
});

test('isAnswerCorrect: true-false question is correct when the boolean answer matches correctAnswer', () => {
	const question = {
		kind: 'true-false',
		id: 'q2',
		prompt: 'prompt',
		correctAnswer: true,
		explanation: 'because',
	};
	assert.equal(grading.isAnswerCorrect(question, true), true);
	assert.equal(grading.isAnswerCorrect(question, false), false);
});

test('isAnswerCorrect: an unanswered question (undefined) is always incorrect', () => {
	const single = {
		kind: 'single-choice',
		id: 'q1',
		prompt: 'prompt',
		options: [{ id: 'a', text: 'A' }],
		correctOptionId: 'a',
		explanation: 'because',
	};
	const trueFalse = { kind: 'true-false', id: 'q2', prompt: 'prompt', correctAnswer: false, explanation: 'because' };
	assert.equal(grading.isAnswerCorrect(single, undefined), false);
	assert.equal(grading.isAnswerCorrect(trueFalse, undefined), false);
});

// --- gradeQuiz -----------------------------------------------------------

function buildQuestions() {
	return [
		{
			kind: 'single-choice',
			id: 'q1',
			prompt: 'p1',
			options: [
				{ id: 'a', text: 'A' },
				{ id: 'b', text: 'B' },
			],
			correctOptionId: 'a',
			explanation: 'e1',
		},
		{ kind: 'true-false', id: 'q2', prompt: 'p2', correctAnswer: true, explanation: 'e2' },
		{ kind: 'true-false', id: 'q3', prompt: 'p3', correctAnswer: false, explanation: 'e3' },
		{
			kind: 'single-choice',
			id: 'q4',
			prompt: 'p4',
			options: [
				{ id: 'a', text: 'A' },
				{ id: 'b', text: 'B' },
			],
			correctOptionId: 'b',
			explanation: 'e4',
		},
	];
}

test('gradeQuiz returns a per-question result array with answered + correct flags', () => {
	const questions = buildQuestions();
	const answers = { q1: 'a', q2: true, q3: true }; // q4 unanswered, q3 wrong
	const result = grading.gradeQuiz(questions, answers);

	assert.deepEqual(
		result.results.map((r) => [r.questionId, r.answered, r.correct]),
		[
			['q1', true, true],
			['q2', true, true],
			['q3', true, false],
			['q4', false, false],
		],
	);
});

test('gradeQuiz counts correct/total and normalizes score to 10, rounded to one decimal', () => {
	const questions = buildQuestions();
	const answers = { q1: 'a', q2: true, q3: true, q4: 'x' }; // 2/4 correct = 5.0
	const result = grading.gradeQuiz(questions, answers);
	assert.equal(result.correctCount, 2);
	assert.equal(result.totalCount, 4);
	assert.equal(result.scoreOutOfTen, 5);
});

test('gradeQuiz rounds a non-integer score to one decimal (3/4 correct = 7.5)', () => {
	const questions = buildQuestions();
	const answers = { q1: 'a', q2: true, q3: true, q4: 'b' }; // 3/4 correct = 7.5
	const result = grading.gradeQuiz(questions, answers);
	assert.equal(result.scoreOutOfTen, 7.5);
});

test('gradeQuiz treats an entirely unanswered quiz as a score of 0', () => {
	const questions = buildQuestions();
	const result = grading.gradeQuiz(questions, {});
	assert.equal(result.correctCount, 0);
	assert.equal(result.scoreOutOfTen, 0);
});

test('gradeQuiz returns a score of 0 for an empty question list (no division by zero)', () => {
	const result = grading.gradeQuiz([], {});
	assert.equal(result.totalCount, 0);
	assert.equal(result.scoreOutOfTen, 0);
});

// --- formatScore -----------------------------------------------------------

test('formatScore renders the score with a Spanish decimal comma and the "/ 10" suffix', () => {
	assert.equal(grading.formatScore(7.5), '7,5 / 10');
	assert.equal(grading.formatScore(10), '10,0 / 10');
	assert.equal(grading.formatScore(0), '0,0 / 10');
});

test('formatScore rounds an unrounded number to one decimal before formatting', () => {
	assert.equal(grading.formatScore(6.666666), '6,7 / 10');
});

// --- getCorrectAnswerLabel --------------------------------------------------

test('getCorrectAnswerLabel returns the correct option text for single-choice questions', () => {
	const question = {
		kind: 'single-choice',
		id: 'q1',
		prompt: 'p1',
		options: [
			{ id: 'a', text: 'Herencia' },
			{ id: 'b', text: 'Composición' },
		],
		correctOptionId: 'b',
		explanation: 'e',
	};
	assert.equal(
		grading.getCorrectAnswerLabel(question, { trueLabel: 'Verdadero', falseLabel: 'Falso' }),
		'Composición',
	);
});

test('getCorrectAnswerLabel returns the localized boolean label for true-false questions', () => {
	const trueQuestion = { kind: 'true-false', id: 'q2', prompt: 'p2', correctAnswer: true, explanation: 'e' };
	const falseQuestion = { kind: 'true-false', id: 'q3', prompt: 'p3', correctAnswer: false, explanation: 'e' };
	const labels = { trueLabel: 'Verdadero', falseLabel: 'Falso' };
	assert.equal(grading.getCorrectAnswerLabel(trueQuestion, labels), 'Verdadero');
	assert.equal(grading.getCorrectAnswerLabel(falseQuestion, labels), 'Falso');
});
