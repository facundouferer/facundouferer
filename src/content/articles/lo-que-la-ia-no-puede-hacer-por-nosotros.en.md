---
title: 'What AI Can''t Do for Us'
slug: 'lo-que-la-ia-no-puede-hacer-por-nosotros'
date: 2026-10-10
author: 'Facundo Uferer'
category: 'AI Strategy'
tags:
  - AI Agents
  - Developer Training
  - Cognitive Debt
  - Intent Debt
  - Software Engineering
excerpt: 'How to train developers in the age of AI agents: cognitive debt, intent debt, domain knowledge, and critical reading as the skills AI does not replace.'
readingTime: 9
image: '/img/articles/vitruviano-digital-robots-ia.png'
lang: 'en'
published: true
featured: false
---
![Digital Vitruvian figure with AI robots](/img/articles/vitruviano-digital-robots-ia.png)

The question is no longer whether a developer can write code, but whether they can define what the system must do, verify that it does it, and explain why it is built the way it is. Artificial intelligence has made writing code take only seconds, but someone still has to know whether that code does the right thing, and that responsibility remains human.

For a large company, buying licenses for AI tools is the easy part. What defines the outcome is whether teams develop the skills to use them without losing control of their own systems.

## The bottleneck

Today developers no longer write code: they orchestrate it with AI agents. If the answer to the risks were to manually review every generated line, the human would become the bottleneck and the reason for using AI would be lost.

Moreover, manual review is no longer a reliable safeguard: as the volume of generated code grows, it ends up being accepted with little review. A good practice could be to base trust on specifications and checks that a machine can verify, defined before implementation.

The developer's role changes: from author of the code to **designer of the verification**. They define what the system must satisfy, build the tests and automated checks that verify it, and set the rules within which agents work. Understanding what the system does and why it is organized that way does not require knowing every line of code.

Human review does not disappear, but it becomes targeted: it focuses on architectural decisions and critical areas, such as authorization, personal data, or payments, where automated security checks are essential.

## Cognitive debt

It is the erosion, over time, of the shared understanding a team has of its system. The term was proposed in 2026 by researcher Margaret-Anne Storey.

Storey argues that technical debt lives in the code, while cognitive debt lives in people. With AI, nobody needs to understand every line of generated code; what cannot be lost is how that code came to be: what problem it was meant to solve, what decisions were made, and what alternatives were discarded. When that is lost, cognitive debt appears.

AI accelerates this problem for a simple reason: when an agent builds the system, the team no longer goes through the decisions it used to make while programming. A developer can merge generated code, tests, and documentation without knowing why that design was chosen, what assumptions were made, or which business rules must always hold.

The effect is not immediate, and that is what makes it dangerous. The system keeps working, but the organization gradually loses the ability to modify, audit, or extend it with confidence. AI can reduce technical debt while accelerating the accumulation of cognitive debt.

The skill this demands is being able to **explain your own system**: how it is organized, why, and what would break if a piece changed. It is not about knowing every line, but the map of the system. If nobody on the team can do it, the debt is already there.

### What the company can promote

- **Tools that explain and diagram the system**.
- **AI agents that describe how the system works**.
- **Reviews focused on design, not on lines**.

## Intent debt

It is the absence of explicit, recorded reasons for why a system is the way it is. It is the third leg of Storey's model: it lives neither in the code nor in people, but in externalized knowledge.

It includes user goals, discarded alternatives, assumptions, and the constraints that shaped each decision. When none of that is written down, intent depends on the memory of those who were there.

An everyday example: a payroll system calculates a bonus differently for a group of employees. Nobody wrote it down; whoever requested it knew it came from an agreement signed years ago. While that person is in the organization, everything works. When they leave, the rule looks like a bug and a newcomer "fixes" it. A stable team can have little cognitive debt and a lot of intent debt; the problem shows up when those people or those conversations are gone.

With AI, that newcomer shows up every day: it is the agent working on the code without knowing its history. Addy Osmani illustrates it this way: someone asks why two services communicate through a queue, and the honest answer is "an agent suggested it and it seemed fine." That answer is already intent debt.

Paying down this debt does not require expensive tools, but habits:

- **Architecture Decision Records (ADRs):** short documents that state what was decided, why, and what was discarded.
- **Specifications and tests as an expression of intent:** they describe what the system must do, not just how it does it.
- **Agent instructions versioned alongside the code:** context files, rules, and policies are also part of the project.

### What the company can promote

- **Technical writing training**.
- **Specification training**.
- **Standard templates and repositories**.
- **Plenty of mandatory documentation**.

## Domain knowledge

AI knows a lot about programming in general, but nothing about a particular organization: its rules, its exceptions, its regulations, or its history. That knowledge is, increasingly, the developer's distinctive contribution.

A reasonable division of roles could be this: agents bring software engineering knowledge and humans bring knowledge of the organization. Cooperation between the two is what allows them to be combined.

An example shows why it matters. AI can write code that compiles, passes the tests, and is still wrong, because it violates a business rule nobody explained to it. A procedure that in practice allows an exception, a deadline that changes according to provincial regulations, a piece of data that legally cannot be shown: none of that is in the training data.

This risk has already been measured. A Cloud Security Alliance research note (April 2026) reviewed studies of AI-generated applications. In one of them, the most common critical vulnerabilities were flaws in authorization logic and business logic, and the researchers attributed them to AI not understanding the intent of the system as a whole. In other words: the most serious errors appear exactly where domain knowledge is missing.

Only someone who knows the domain can detect that error, because only that person knows what to look for. That is why developers need to know the business as well as analysts or project leads do. Today we are all a bit of a systems analyst.

Domain knowledge connects directly to the two debts above. It is what makes it possible to write good specifications (paying down intent debt) and what gives meaning to understanding the system (avoiding cognitive debt). A developer who understands the real problem does not just program better: they give AI the context it lacks.

### What the company can promote

- **Direct contact with users and business areas**.
- **Onboarding about the business, not just the technology**.
- **Glossaries and documented business rules**.

## Reading well

Reading has always been most of a developer's work, and with AI it still is, although what gets read changes. Since agents write the code, the human no longer reads line by line: they read requirements, specifications, agents' work plans, test results, and the system's architecture.

A field study published in IEEE Transactions on Software Engineering (Xia et al., 2018) followed 78 professionals over more than 3,000 hours of work. It found that they spend on average about 58% of their time comprehending programs, not writing them. In addition, senior developers spend a smaller share of their time on that task than juniors: reading well is part of what makes someone senior.

The risk is that AI erodes precisely this skill. In a controlled trial by Anthropic with 52 developers, those who learned a new library with AI assistance scored 17% lower on comprehension assessments. The biggest gap appeared in the ability to notice when code is wrong and why.

"Reading well" in software development covers several different kinds of reading:

- **Reading requirements** and **specifications**.
- **Reading agents' plans**.
- **Critically reading the AI's explanation of the system**.

Not every use of AI harms learning, because the problem is not using AI, but delegating the thinking.

### What the company can promote

- **Workshops on reading specifications and agent plans**.
- **Diagnostic practice**.
- **Using the learning modes of the tools**.

## How they connect

The four concepts form a single cycle: two debts that grow when we delegate without understanding, and two skills that pay them down.

- **Cognitive debt.** Lives in people: shared understanding of the system is lost. It is addressed with diagrams and agents that explain the system, and by reviewing the design as a team.
- **Intent debt.** Lives in documents and artifacts: the why behind decisions is lost. It is addressed with ADRs, specifications, tests, and versioned instructions.
- **Domain knowledge.** Lives in people and in the organization: it provides the context AI lacks. It is built by knowing the business, the regulations, and the users.
- **Reading well.** Lives in daily practice: it provides the ability to detect errors. It is built by reading requirements, specifications, agents' plans, and test results.

Reading well is the tool for not accumulating cognitive debt. Domain knowledge is the raw material for paying down intent debt. And both skills feed each other: whoever knows the domain knows what to look for when reading, and whoever reads well learns the domain.

## Suggested training plan

A company can start with five training programs that cover the four concepts. None require expensive tools; they require dedicated time and being part of the team's evaluation.

| Training | Concepts addressed |
| --- | --- |
| Verification design: specifications, tests, and automated checks | Reading well, intent debt |
| Agent orchestration: planning, delegating, and defining rules | Cognitive debt, intent debt |
| Technical writing: requirements and instructions for agents | Intent debt |
| Business immersion | Domain knowledge |
| Responsible use of AI assistants | All four |

AI works as an amplifier. It boosts what already exists, both strengths and weaknesses. A team that understands its system, records its decisions, and knows its domain will win with AI. One that does not will produce, faster, something it understands less and less.

For a company, the practical conclusion is that investing in AI and investing in people do not compete: the second is the condition for the first to pay off. Training in comprehension, verification, decision recording, business knowledge, and critical reading is what turns a powerful tool into a real advantage.

## Further reading

- Stack Overflow (2026). [Developer Survey 2026: AI](https://survey.stackoverflow.co/2026/ai). Data on employer guidelines according to [IT Brief](https://itbrief.co.uk/story/stack-overflow-survey-finds-developers-wary-of-ai-tools).
- Veracode (2026). [2026 GenAI Code Security Report](https://www.veracode.com/blog/2026-genai-code-security-report-ai-risk).
- Cloud Security Alliance (2026). [Vibe Coding Security Debt: AI-Generated Vulnerabilities at Scale](https://labs.cloudsecurityalliance.org/research/csa-research-note-ai-codegen-vulnerability-debt-2026).
- METR (2026). [Measuring the Self-Reported Impact of Early-2026 AI on Technical Worker Productivity](https://metr.org/blog/2026-05-11-ai-usage-survey/).
- Storey, M.-A. (2026). [From Technical Debt to Cognitive and Intent Debt: Rethinking Software Health in the Age of AI](https://arxiv.org/abs/2603.22106). ACM Queue 24(2).
- Osmani, A. (2026). [The Intent Debt](https://addyosmani.com/blog/intent-debt/).
- Shen, J. H. and Tamkin, A. (2026). [How AI assistance impacts the formation of coding skills](https://www.anthropic.com/research/AI-assistance-coding-skills). Anthropic.
- DORA / Google (2025). [State of AI-assisted Software Development](https://research.google/pubs/dora-2025-state-of-ai-assisted-software-development-report/). Most recent edition of the annual report.
- Xia, X. et al. (2018). [Measuring Program Comprehension: A Large-Scale Field Study with Professionals](https://research.monash.edu/en/publications/measuring-program-comprehension-a-large-scale-field-study-with-pr/). IEEE Transactions on Software Engineering 44. Reference study on time spent comprehending code.
