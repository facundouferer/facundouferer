---
title: 'Vertical Slice Architecture with AI: From User Story to Code'
slug: 'vertical-slice-architecture-con-ia'
date: 2026-10-24
author: 'Facundo Uferer'
category: 'AI Engineering'
tags:
  - Vertical Slice Architecture
  - AI Agents
  - Software Architecture
  - User Stories
  - CQRS
excerpt: 'How to use Vertical Slice Architecture so AI drafts user stories, turns them into issues, and implements each one as a slice of code, with the developer as the orchestrator.'
readingTime: 12
image: '/img/articles/vertical-slice-architecture-torta.png'
lang: 'en'
published: true
featured: false
---
## Introduction

AI drafts the user stories, turns them into issues, and implements each issue as a slice of code. The developer stops writing every line and becomes an orchestrator: they define what gets built, validate what the AI produces at each step, and decide what gets merged. The key is that a story, an issue, a slice, and a PR are the same unit of work, sized just right for an agent to solve it well.

Most projects are organized by technical layers: `Controllers/`, `Services/`, `Repositories/`, `DTOs/` (a DTO, *Data Transfer Object*, is an object that only carries data between parts of the system, with no logic). With that structure, any change forces the agent to read and touch four or five folders full of code unrelated to the task.

VSA organizes code by use case. The agent receives a bounded task, works in a single folder, and delivers a change the orchestrator reviews in minutes.

## What VSA is

![Slice of cake with four labeled layers: form, endpoint, handler, and table](/img/articles/vertical-slice-architecture-torta.png)

Hence the name: if the system is a layer cake, a feature is not an entire layer but a vertical slice that carries a bit of each one.

<figure class="diagram">
<svg viewBox="0 0 720 350" role="img" aria-labelledby="d-vsa-grid-t">
<title id="d-vsa-grid-t">Four technical layers by four features; the "enroll student" slice cuts through all four layers</title>
<text x="220" y="30" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-neutral-700)">Create student</text>
<text x="360" y="30" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">Enroll student</text>
<text x="500" y="30" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-neutral-700)">List courses</text>
<text x="640" y="30" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-neutral-700)">Edit course</text>
<rect x="150" y="44" width="560" height="54" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<rect x="150" y="102" width="560" height="54" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<rect x="150" y="160" width="560" height="54" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<rect x="150" y="218" width="560" height="54" rx="12" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="138" y="77" font-size="13" font-weight="700" text-anchor="end" fill="var(--color-neutral-800)">Frontend</text>
<text x="138" y="135" font-size="13" font-weight="700" text-anchor="end" fill="var(--color-neutral-800)">Backend / API</text>
<text x="138" y="193" font-size="13" font-weight="700" text-anchor="end" fill="var(--color-neutral-800)">Controller</text>
<text x="138" y="251" font-size="13" font-weight="700" text-anchor="end" fill="var(--color-neutral-800)">Database</text>
<rect x="294" y="40" width="132" height="236" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="360" y="77" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">form</text>
<text x="360" y="135" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">endpoint</text>
<text x="360" y="193" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">handler</text>
<text x="360" y="251" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">table</text>
<rect x="300" y="288" width="120" height="24" rx="9" fill="var(--color-accent)"/>
<text x="360" y="304" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">1 issue · 1 PR</text>
<rect x="150" y="331" width="36" height="10" rx="5" fill="var(--color-neutral-400)"/>
<text x="194" y="341" font-size="11.5" fill="var(--color-neutral-700)">Layer = horizontal cut</text>
<rect x="430" y="327" width="10" height="18" rx="5" fill="var(--color-accent)"/>
<text x="448" y="341" font-size="11.5" fill="var(--color-accent-700)">Slice = vertical cut, screen → database</text>
</svg>
<figcaption>Each row is a technical layer; each column, a feature. A slice takes a bit of every layer, but only what that feature needs.</figcaption>
</figure>

A vertical slice is a complete use case with everything it needs: endpoint, validation, business logic, data access, DTOs, and tests. Jimmy Bogard, who popularized the approach, sums it up in one principle: minimize coupling between slices and maximize coupling within each slice ([source](https://sessionize.com/s/jimmy-bogard/vertical-slice-architecture-effective-guardrails-f/185766)).

The difference shows in the folder structure:

<figure class="diagram">
<svg viewBox="0 0 720 436" role="img" aria-labelledby="d-vsa-folders-t">
<title id="d-vsa-folders-t">Layered structure versus sliced structure: the "enroll student" use case spread across four folders or gathered in one</title>
<text x="0" y="22" font-size="15" font-weight="700" fill="var(--color-neutral-800)">By layers</text>
<text x="340" y="22" font-size="12" font-weight="700" text-anchor="end" fill="var(--color-neutral-700)">4 folders to read</text>
<text x="380" y="22" font-size="15" font-weight="700" fill="var(--color-accent-700)">By slices (VSA)</text>
<text x="720" y="22" font-size="12" font-weight="700" text-anchor="end" fill="var(--color-accent-700)">1 folder to read</text>
<rect x="0" y="40" width="340" height="74" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="14" y="62" font-size="13" font-weight="700" fill="var(--color-neutral-800)">Controllers/</text>
<text x="14" y="82" font-size="12" fill="var(--color-neutral-700)">StudentsController</text>
<rect x="14" y="90" width="190" height="20" rx="7" fill="var(--color-accent-200)" stroke="var(--color-accent)"/>
<text x="22" y="104" font-size="12" font-weight="700" fill="var(--color-accent-700)">EnrollmentsController</text>
<rect x="0" y="122" width="340" height="74" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="14" y="144" font-size="13" font-weight="700" fill="var(--color-neutral-800)">Services/</text>
<text x="14" y="164" font-size="12" fill="var(--color-neutral-700)">StudentService</text>
<rect x="14" y="172" width="190" height="20" rx="7" fill="var(--color-accent-200)" stroke="var(--color-accent)"/>
<text x="22" y="186" font-size="12" font-weight="700" fill="var(--color-accent-700)">EnrollmentService</text>
<rect x="0" y="204" width="340" height="74" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="14" y="226" font-size="13" font-weight="700" fill="var(--color-neutral-800)">Repositories/</text>
<text x="14" y="246" font-size="12" fill="var(--color-neutral-700)">StudentRepository</text>
<rect x="14" y="254" width="190" height="20" rx="7" fill="var(--color-accent-200)" stroke="var(--color-accent)"/>
<text x="22" y="268" font-size="12" font-weight="700" fill="var(--color-accent-700)">EnrollmentRepository</text>
<rect x="0" y="286" width="340" height="74" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="14" y="308" font-size="13" font-weight="700" fill="var(--color-neutral-800)">DTOs/</text>
<text x="14" y="328" font-size="12" fill="var(--color-neutral-700)">StudentDto</text>
<rect x="14" y="336" width="190" height="20" rx="7" fill="var(--color-accent-200)" stroke="var(--color-accent)"/>
<text x="22" y="350" font-size="12" font-weight="700" fill="var(--color-accent-700)">EnrollmentRequest</text>
<rect x="0" y="376" width="340" height="50" rx="14" fill="var(--color-neutral-300)" stroke="var(--color-divider)"/>
<text x="14" y="397" font-size="13" font-weight="700" fill="var(--color-neutral-800)">Shared/</text>
<text x="14" y="415" font-size="11.5" fill="var(--color-neutral-700)">domain · authentication · database connection</text>
<rect x="380" y="40" width="340" height="320" rx="18" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="396" y="62" font-size="13" font-weight="700" fill="var(--color-neutral-800)">Features/</text>
<rect x="396" y="78" width="308" height="66" rx="14" fill="var(--color-neutral-100)" stroke="var(--color-divider)"/>
<text x="410" y="100" font-size="13" font-weight="700" fill="var(--color-neutral-800)">Students/CreateStudent/</text>
<text x="410" y="122" font-size="11.5" fill="var(--color-neutral-700)">request · handler · test_create_student</text>
<rect x="616" y="86" width="76" height="20" rx="7" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="654" y="100" font-size="10.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">reference</text>
<rect x="396" y="158" width="308" height="172" rx="14" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="410" y="182" font-size="13" font-weight="700" fill="var(--color-accent-700)">Enrollments/EnrollStudent/</text>
<text x="410" y="208" font-size="12.5" fill="var(--color-text)">request</text>
<text x="410" y="230" font-size="12.5" fill="var(--color-text)">response</text>
<text x="410" y="252" font-size="12.5" fill="var(--color-text)">handler</text>
<text x="410" y="274" font-size="12.5" fill="var(--color-text)">test_enroll</text>
<text x="410" y="310" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">the whole use case in one folder</text>
<rect x="380" y="376" width="340" height="50" rx="14" fill="var(--color-neutral-300)" stroke="var(--color-divider)"/>
<text x="394" y="397" font-size="13" font-weight="700" fill="var(--color-neutral-800)">Shared/</text>
<text x="394" y="415" font-size="11.5" fill="var(--color-neutral-700)">domain · authentication · database connection</text>
</svg>
<figcaption>Everything highlighted is the code for the "enroll student" use case: spread across four folders on the left, in a single one on the right. For an agent, the right side means reading one folder instead of four.</figcaption>
</figure>

Three rules the agent must follow, and that are worth writing down in the repository:

1. **One slice = one use case.** A command ("enroll student") or a query ("list students"), in the style of CQRS (*Command Query Responsibility Segregation*: separating the operations that modify data, the commands, from those that only read it, the queries).
2. **Slices do not import each other.** What is truly shared (domain entities, authentication, database connection) goes in `Shared/`.
3. **Duplication is acceptable.** Two slices may have similar DTOs. That is preferable to a shared DTO that, when changed for one case, breaks another.

## Preparing the repository to work with AI

Before assigning the first issue to an agent, the repository has to spell out the rules the agent cannot guess. With VSA, code is organized by convention alone, so that convention has to be written down and verified automatically.

- An `AGENTS.md` file at the root with the slice conventions (or whichever instructions file the agent reads).
- A complete reference slice for the agent to copy.
- The issue template in the repo (for example, `.github/ISSUE_TEMPLATE/slice.md`), for the AI to fill in.
- Architecture tests, generated by the AI, that fail if one slice imports another.
- CI that runs the tests and the architecture tests on every PR.
- AI test review: a second agent checks that the tests cover every criterion in the issue before implementation; the orchestrator resolves only what that agent flags.
- Periodic review of `Shared/`: when the AI repeats the same thing across several slices, it gets extracted.

Example `AGENTS.md`:

```markdown
# Conventions
- Each use case lives in Features/<Module>/<Verb><Noun>/
- Files in a slice: request, response, handler, and tests, using the
  project's language extension
- Slices do not import each other. Shared code goes in Shared/.
- Reference slice: Features/Students/CreateStudent/
- One PR = one issue = one slice.
- Write the tests before the code, one per acceptance criterion.
- Issue titles are use-case verbs, never layers.
```

## Stories, issues, and slices: the same unit

A good user story is already vertical: it describes an outcome the user gets, not a technical layer. With VSA, that unit passes intact through the whole process, and at each level the AI produces the artifact and the orchestrator validates it.

| Level | Example | What the AI does | What the orchestrator validates |
| --- | --- | --- | --- |
| User story | As a teacher, I want to enroll a student in a course so they can access the classroom. | Drafts it from notes, requests, or the current system | That it reflects the real need; the priority |
| Issue | #42 Enroll student in course | Derives it from the story, with criteria, folder, and reference slice | That it is a vertical slice and not a layer |
| Tests | One test per acceptance criterion | Writes them before the code; a second agent checks they cover the criteria | Only what the reviewing agent flags |
| Slice | `Features/Enrollments/EnrollStudent/` | Implements it by copying the reference slice | CI does it with architecture tests |
| PR | `feature/42-enroll-student`, a single folder | Opens it and fixes it based on comments | The final review and the merge |

<figure class="diagram">
<svg viewBox="0 0 720 200" role="img" aria-labelledby="d-vsa-unit-t">
<title id="d-vsa-unit-t">The same unit of work passes through story, issue, tests, slice, and PR; at each step the AI produces and the orchestrator validates</title>
<defs><marker id="ar-vsa-unit" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-neutral-600)"/></marker></defs>
<circle cx="6" cy="18" r="5" fill="var(--color-accent-2-600)"/>
<text x="18" y="22" font-size="11" font-weight="700" fill="var(--color-accent-2-800)">THE AI PRODUCES</text>
<text x="60" y="48" font-size="11.5" text-anchor="middle" fill="var(--color-text)">drafts it</text>
<text x="210" y="48" font-size="11.5" text-anchor="middle" fill="var(--color-text)">derives it</text>
<text x="360" y="48" font-size="11.5" text-anchor="middle" fill="var(--color-text)">writes them first</text>
<text x="510" y="48" font-size="11.5" text-anchor="middle" fill="var(--color-text)">implements it</text>
<text x="660" y="48" font-size="11.5" text-anchor="middle" fill="var(--color-text)">opens and fixes it</text>
<line x1="60" y1="54" x2="60" y2="68" stroke="var(--color-accent-2-600)" stroke-width="2.5" stroke-linecap="round"/>
<line x1="210" y1="54" x2="210" y2="68" stroke="var(--color-accent-2-600)" stroke-width="2.5" stroke-linecap="round"/>
<line x1="360" y1="54" x2="360" y2="68" stroke="var(--color-accent-2-600)" stroke-width="2.5" stroke-linecap="round"/>
<line x1="510" y1="54" x2="510" y2="68" stroke="var(--color-accent-2-600)" stroke-width="2.5" stroke-linecap="round"/>
<line x1="660" y1="54" x2="660" y2="68" stroke="var(--color-accent-2-600)" stroke-width="2.5" stroke-linecap="round"/>
<rect x="0" y="70" width="120" height="54" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="60" y="92" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">Story</text>
<text x="60" y="112" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">the user's need</text>
<line x1="124" y1="97" x2="146" y2="97" stroke="var(--color-neutral-600)" stroke-width="2.5" marker-end="url(#ar-vsa-unit)"/>
<rect x="150" y="70" width="120" height="54" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="210" y="92" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">Issue</text>
<text x="210" y="112" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">#42 Enroll student</text>
<line x1="274" y1="97" x2="296" y2="97" stroke="var(--color-neutral-600)" stroke-width="2.5" marker-end="url(#ar-vsa-unit)"/>
<rect x="300" y="70" width="120" height="54" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="360" y="92" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">Tests</text>
<text x="360" y="112" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">one per criterion</text>
<line x1="424" y1="97" x2="446" y2="97" stroke="var(--color-neutral-600)" stroke-width="2.5" marker-end="url(#ar-vsa-unit)"/>
<rect x="450" y="70" width="120" height="54" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="510" y="92" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">Slice</text>
<text x="510" y="112" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">a single folder</text>
<line x1="574" y1="97" x2="596" y2="97" stroke="var(--color-neutral-600)" stroke-width="2.5" marker-end="url(#ar-vsa-unit)"/>
<rect x="600" y="70" width="120" height="54" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="660" y="92" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">PR</text>
<text x="660" y="112" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">feature/42-…</text>
<line x1="60" y1="126" x2="60" y2="140" stroke="var(--color-accent)" stroke-width="2.5" stroke-linecap="round"/>
<line x1="210" y1="126" x2="210" y2="140" stroke="var(--color-accent)" stroke-width="2.5" stroke-linecap="round"/>
<line x1="360" y1="126" x2="360" y2="140" stroke="var(--color-accent)" stroke-width="2.5" stroke-linecap="round"/>
<line x1="510" y1="126" x2="510" y2="140" stroke="var(--color-accent)" stroke-width="2.5" stroke-linecap="round"/>
<line x1="660" y1="126" x2="660" y2="140" stroke="var(--color-accent)" stroke-width="2.5" stroke-linecap="round"/>
<text x="60" y="158" font-size="11.5" text-anchor="middle" fill="var(--color-text)">reflects the need</text>
<text x="60" y="174" font-size="11.5" text-anchor="middle" fill="var(--color-text)">and the priority</text>
<text x="210" y="158" font-size="11.5" text-anchor="middle" fill="var(--color-text)">is it a vertical</text>
<text x="210" y="174" font-size="11.5" text-anchor="middle" fill="var(--color-text)">slice?</text>
<text x="360" y="158" font-size="11.5" text-anchor="middle" fill="var(--color-text)">only what the</text>
<text x="360" y="174" font-size="11.5" text-anchor="middle" fill="var(--color-text)">reviewing agent flags</text>
<text x="510" y="158" font-size="11.5" text-anchor="middle" fill="var(--color-text)">CI with</text>
<text x="510" y="174" font-size="11.5" text-anchor="middle" fill="var(--color-text)">architecture tests</text>
<text x="660" y="158" font-size="11.5" text-anchor="middle" fill="var(--color-text)">final review</text>
<text x="660" y="174" font-size="11.5" text-anchor="middle" fill="var(--color-text)">and merge</text>
<circle cx="6" cy="194" r="5" fill="var(--color-accent)"/>
<text x="18" y="198" font-size="11" font-weight="700" fill="var(--color-accent-700)">THE ORCHESTRATOR VALIDATES</text>
</svg>
<figcaption>A single unit of work crosses all five levels. Above, what the AI produces at each one; below, what the orchestrator validates before letting it move to the next.</figcaption>
</figure>

The most common AI mistake when generating issues is slicing by layer: "create enrollments table", "create endpoint", "create screen". None of them delivers value on its own, and none can be tested end to end. When that happens, reject the split and ask it to redo it by use case: a closed issue has to be a working feature.

## Option A: user stories + issues

This fits when there are business users and a product with several features to prioritize. The story lives at a higher level (epic, milestone, or label) and each issue is a slice of that story.

Flow with AI:

1. The AI drafts the stories from the need, meeting notes, or the description of the current system.
   > Prompt: "From these notes, propose user stories for the enrollment module, in the As a / I want / so that format."
2. The orchestrator prioritizes and approves the stories.
3. The AI turns each story into issues, one per slice, filling in the repository template.
   > Prompt: "Turn story #12 into issues. Each issue must be a vertical slice, with acceptance criteria, a folder under Features/, and a reference slice. Use the template in AGENTS.md."
4. The orchestrator reviews the split (see [How to validate the split the AI proposes](#how-to-validate-the-split-the-ai-proposes)) and only then assigns the issues to the agent.

Issue template the AI fills in:

```markdown
## #42 Enroll student in course
Story: #12 Enrollment management
As a teacher, I want to enroll a student in a course so they can access the classroom.

### Acceptance criteria
- [ ] Student already enrolled → 409 error
- [ ] Course has no seats left → 422 error
- [ ] Successful enrollment → 201 and appears in the course roster

### Slice
Features/Enrollments/EnrollStudent/

### Reference
Features/Students/CreateStudent/

### Do not touch
Other slices. Changes to Shared/ must be flagged in the PR.
```

## Option B: issues only

This fits small teams, internal systems, or migrations, where the story format adds ceremony without adding clarity. The AI drafts the issue directly from a short request.

> Prompt: "Write an issue for 'enroll student in course' using the template in AGENTS.md. The goal is for the student to access the course classroom."

Expected result:

```markdown
## Enroll student in course
So that: the student can access the course classroom.

- [ ] Already enrolled → 409
- [ ] No seats left → 422
- [ ] OK → 201

Slice: Features/Enrollments/EnrollStudent/
Reference: Features/Students/CreateStudent/
```

In both options there is one rule worth including in the prompt: the issue title is a verb that a user or system performs ("Enroll student", "List active courses"), never a layer ("Create course repository").

| | Stories + issues | Issues only |
| --- | --- | --- |
| Best for | Products with business users and prioritization | Small teams, internal systems, migrations |
| Planning prompts | Two: stories, then issues | One: the issue directly |
| Orchestrator validations | Stories and the split into issues | Only the split into issues |
| Unit the agent receives | One issue = one slice | One issue = one slice |

## How to validate the split the AI proposes

The AI proposes how to split the stories; the orchestrator decides. When a story is large, the right split produces thinner stories that are still vertical. This table helps correct the AI when it splits badly:

| Instead of splitting by… | Split by… |
| --- | --- |
| Layer: table, endpoint, screen | Rule variant: simple enrollment → with waiting list |
| Component: backend, frontend | Happy path first, error cases later |
| "All of course CRUD" | Each operation: create, edit, deactivate, list |
| Generic infrastructure up front | Only the infrastructure the first slice needs |

Criteria for accepting an AI-generated issue (INVEST):

- It can be tested end to end, on its own.
- It touches a single folder under `Features/`, plus minor changes in `Shared/`.
- The PR can be reviewed in one sitting.
- It has between two and six acceptance criteria. More than that usually means it is two slices.

One reasonable exception: the project's technical foundation (authentication, database connection, CI) is built once, horizontally, before the first slice.

The same AI can do a first review of the split before the orchestrator:

> Prompt: "Review these issues. Flag any that touches more than one folder under Features/, is named after a layer, or has more than six criteria, and propose how to split it into vertical slices."

## Implementing each issue with an agent

Once the issue is approved, the agent implements it. The issue is the prompt: it says what to do, where to do it, what not to touch, and when it is done.

1. **Assign the issue.** The prompt is short because the issue already has everything: "Implement issue #42 following AGENTS.md."
2. **Tests first.** The agent turns each acceptance criterion into a test inside the slice folder. A second agent checks that the tests cover what the issue asks for before moving on; the orchestrator resolves whatever that agent flags.
3. **Implementation.** The agent copies the structure of the reference slice and writes code until the tests pass.
4. **CI.** The tests and the architecture tests run. If they fail, the agent fixes and tries again.
5. **Orchestrator review.** The PR touches a single folder and is reviewed quickly. Changes are requested with a PR comment and the agent applies them.
6. **Merge and close.** The PR closes the issue (`Closes #42`).

Because slices are independent, several issues can be assigned to several agents in parallel without merge conflicts.

<figure class="diagram">
<svg viewBox="0 0 720 310" role="img" aria-labelledby="d-vsa-flow-t">
<title id="d-vsa-flow-t">Flow of one issue: criteria become tests, the agent implements, CI and the orchestrator's review send the work back to the agent until the merge is approved</title>
<defs>
<marker id="ar-vsa-n" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-neutral-600)"/></marker>
<marker id="ar-vsa-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker>
<marker id="ar-vsa-s" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-2-600)"/></marker>
</defs>
<rect x="0" y="110" width="120" height="56" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-neutral-600)"/>
<text x="60" y="143" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">Approved issue</text>
<line x1="124" y1="138" x2="146" y2="138" stroke="var(--color-neutral-600)" stroke-width="2.5" marker-end="url(#ar-vsa-n)"/>
<rect x="150" y="110" width="130" height="56" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-neutral-600)"/>
<text x="215" y="143" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">Criteria → tests</text>
<line x1="284" y1="138" x2="306" y2="138" stroke="var(--color-neutral-600)" stroke-width="2.5" marker-end="url(#ar-vsa-n)"/>
<rect x="310" y="110" width="140" height="56" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-neutral-600)"/>
<text x="380" y="143" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">Agent implements</text>
<line x1="454" y1="138" x2="476" y2="138" stroke="var(--color-neutral-600)" stroke-width="2.5" marker-end="url(#ar-vsa-n)"/>
<path d="M540 98 L600 138 L540 178 L480 138 Z" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2.5" stroke-linejoin="round"/>
<text x="540" y="143" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">CI passes?</text>
<path d="M540 96 L540 60 L380 60 L380 106" fill="none" stroke="var(--color-accent)" stroke-width="2.5" stroke-linejoin="round" marker-end="url(#ar-vsa-a)"/>
<text x="460" y="52" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">fails: back to the agent</text>
<line x1="540" y1="180" x2="540" y2="216" stroke="var(--color-accent-2-600)" stroke-width="2.5" marker-end="url(#ar-vsa-s)"/>
<text x="550" y="202" font-size="11.5" font-weight="700" fill="var(--color-accent-2-800)">passes</text>
<rect x="460" y="220" width="160" height="56" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="540" y="253" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">Orchestrator reviews</text>
<path d="M458 236 L420 236 L420 170" fill="none" stroke="var(--color-accent)" stroke-width="2.5" stroke-linejoin="round" marker-end="url(#ar-vsa-a)"/>
<text x="412" y="200" font-size="11.5" font-weight="700" text-anchor="end" fill="var(--color-accent-700)">requests changes</text>
<line x1="458" y1="262" x2="316" y2="262" stroke="var(--color-accent-2-600)" stroke-width="2.5" marker-end="url(#ar-vsa-s)"/>
<text x="388" y="254" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">approves</text>
<rect x="150" y="234" width="160" height="56" rx="16" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2.5"/>
<text x="230" y="267" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">Merge, closes #42</text>
<circle cx="6" cy="300" r="5" fill="var(--color-accent)"/>
<text x="18" y="304" font-size="11" font-weight="700" fill="var(--color-accent-700)">correction loops: the work goes back to the agent</text>
</svg>
<figcaption>Two loops back to the agent: CI when the tests fail, and the orchestrator when it requests changes. The agent does not decide when it is done.</figcaption>
</figure>

The two loops back to the agent (CI and review) are what keep quality up: the agent does not decide when it is done.

## How to implement it: mattpocock/skills

To avoid building everything from scratch, the process can be set up on top of [mattpocock/skills](https://github.com/mattpocock/skills), an open collection (MIT license) that works with Claude Code, Codex, Copilot, Gemini CLI, Cursor, and other agents.

### 1. Install

One method per agent: installing both the plugin and the files duplicates the skills.

| Agent | Command |
| --- | --- |
| Claude Code | `claude plugin install mattpocock-skills@claude-plugins-official` |
| Codex | `codex plugin marketplace add mattpocock/skills`, then `codex plugin add mattpocock-skills@mattpocock` |
| GitHub Copilot (CLI and VS Code) | `copilot plugin marketplace add mattpocock/skills`, then `copilot plugin install mattpocock-skills@mattpocock` |
| Gemini CLI | `gemini skills install https://github.com/mattpocock/skills.git --path skills/engineering` |
| Others (Cursor, OpenCode, Windsurf…) | `npx skills@latest add mattpocock/skills -a <agent>`, including `setup-matt-pocock-skills` when it asks which skills to install |

### 2. Configure the repository (once)

Run `/setup-matt-pocock-skills`. It asks which issue tracker to use (GitHub, GitLab, local files, or other), which labels are used to classify issues, and where to store documentation. Then add the `AGENTS.md` with the slice conventions from the [Preparing the repository](#preparing-the-repository-to-work-with-ai) section.

### 3. Align with the AI: `/grill-with-docs`

The AI interviews the orchestrator, one question at a time, until every decision is explicit. Along the way it maintains a domain glossary (`GLOSSARY.md`) and records architecture decisions (ADRs). This is the stage where the user stories are born.

### 4. Write the specification: `/to-spec`

Turns the conversation into a specification and publishes it to the issue tracker. It plays the role of the user story or the epic.

### 5. Split into vertical issues: `/to-tickets`

This is the central step. It runs on the specification, for example `/to-tickets #12`, and:

1. Reads the specification and explores the code; if it helps, it proposes a preparatory refactor to make the work easier.
2. Splits the work into *tracer bullet* tickets: each one cuts through every layer, can be verified on its own, and fits in a fresh context window.
3. Marks the dependencies: which ticket blocks which.
4. Shows the list to the orchestrator and asks whether the granularity is right, whether the dependencies are real, and whether tickets should be merged or split. It iterates until the orchestrator approves.
5. Publishes one issue per ticket, with acceptance criteria and the `ready-for-agent` label (or one file per ticket under `.scratch/<feature>/issues/` if local files were chosen).

Step 4 is the validation of the split. To reinforce it, before approving you can run the control prompt from [How to validate the split](#how-to-validate-the-split-the-ai-proposes) over the list. One detail: `/to-tickets` avoids putting file paths in issues because they go stale, so the folder for each slice is defined by the `AGENTS.md` convention, not by the issue.

### 6. Implement: `/implement` or `/implement-spec`

- `/implement` takes the tickets, works with `/tdd` (first a failing test, then the code that makes it pass), runs the tests, and closes with `/code-review`. That review uses parallel subagents that check two things separately: whether the code follows the repo's standards and whether it faithfully implements the issue. It is the reviewing agent this article describes.
- `/implement-spec` works through a complete specification: it launches several subagents in parallel on the tickets that have no blockers.

Every few days it is worth running `/improve-codebase-architecture`, which looks for where the structure is degrading and proposes improvements.

### Mapping to the process

| Stage in this article | Skill |
| --- | --- |
| Prepare the repository | `/setup-matt-pocock-skills` + your own `AGENTS.md` |
| Draft stories | `/grill-with-docs` + `/to-spec` |
| Turn stories into vertical issues | `/to-tickets` |
| Validate the split | `/to-tickets` questions + control prompt |
| Tests first | `/tdd` |
| Implement the slice | `/implement` |
| Reviewing agent | `/code-review` |
| Several slices in parallel | `/implement-spec` |
