---
title: 'Development with AI agents: a four-layer scheme'
slug: 'desarrollo-en-esquema-de-capas'
date: 2026-08-27
author: 'Facundo Uferer'
category: 'AI Engineering'
tags:
  - AI Agents
  - Spec-Driven Development
  - TDD
  - Arquitectura
excerpt: 'The problem is not that agents write bad code. It is that three months in, nobody can reconstruct why the system does what it does. Four layers, four coupling rules, and how the methodologies fit together.'
readingTime: 18
lang: 'en'
published: true
featured: true
---

![A four-layer scheme for development with AI agents](/img/articles/desarrollo-esquema-de-capas-en.svg)

A reference for teams bringing AI agents into large, long-lived projects with several people involved.

## Why a layered scheme

The problem is not that agents write bad code. They write reasonably well. The problem shows up three months in, when nobody can reconstruct why the system does what it does, and the architectural decisions are buried in chat sessions that no longer exist.

The cause is always the same: **one tool ended up covering responsibilities that should have been separate**. The tracker holds the specification, the specification holds the task plan, the agent writes its own acceptance criteria, and the result is a system with no auditable source of truth.

This scheme separates four responsibilities and defines coupling rules between them. It is independent of which agent, which model, or which framework you use — those are details of a single layer, the most replaceable one.

## Part 1 — The four layers

<figure class="diagram">
<svg viewBox="0 0 720 400" role="img" aria-labelledby="d-capas-t">
<title id="d-capas-t">The four layers: intent with maximum authority, coordination, execution, and verification with veto power</title>
<defs><marker id="ar-capas" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker><marker id="ar-capas-v" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-2-600)"/></marker></defs>
<rect x="0" y="10" width="560" height="76" rx="18" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2.5"/>
<circle cx="38" cy="48" r="19" fill="var(--color-accent)"/>
<text x="38" y="55" font-size="17" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">1</text>
<text x="72" y="42" font-size="16" font-weight="700" fill="var(--color-accent-700)">Intent</text>
<text x="72" y="66" font-size="12.5" fill="var(--color-text)">The contract: what the system must do and why. Lives in the repo. Human owner.</text>
<text x="580" y="42" font-size="12" font-weight="700" fill="var(--color-accent-700)">MAXIMUM AUTHORITY</text>
<text x="580" y="64" font-size="11.5" fill="var(--color-neutral-700)">outlives the project</text>
<line x1="38" y1="90" x2="38" y2="106" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-capas)"/>
<rect x="0" y="112" width="560" height="76" rx="18" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<circle cx="38" cy="150" r="19" fill="var(--color-neutral-600)"/>
<text x="38" y="157" font-size="17" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">2</text>
<text x="72" y="144" font-size="16" font-weight="700" fill="var(--color-neutral-800)">Coordination</text>
<text x="72" y="168" font-size="12.5" fill="var(--color-text)">Who does what, in what order. Lives outside the repo. References the contract, never copies it.</text>
<text x="580" y="152" font-size="11.5" fill="var(--color-neutral-700)">outlives the sprint</text>
<line x1="38" y1="192" x2="38" y2="208" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-capas)"/>
<rect x="0" y="214" width="560" height="76" rx="18" fill="var(--color-neutral-200)" stroke="var(--color-neutral-600)" stroke-dasharray="7 6"/>
<circle cx="38" cy="252" r="19" fill="var(--color-neutral-600)"/>
<text x="38" y="259" font-size="17" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">3</text>
<text x="72" y="246" font-size="16" font-weight="700" fill="var(--color-neutral-800)">Execution</text>
<text x="72" y="270" font-size="12.5" fill="var(--color-text)">Translating contract into diff. Deliberately disposable. When in doubt, it does not guess.</text>
<text x="580" y="254" font-size="11.5" fill="var(--color-neutral-700)">outlives the session</text>
<line x1="38" y1="294" x2="38" y2="310" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-capas)"/>
<rect x="0" y="316" width="560" height="76" rx="18" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2.5"/>
<circle cx="38" cy="354" r="19" fill="var(--color-accent-2-700)"/>
<text x="38" y="361" font-size="17" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">4</text>
<text x="72" y="348" font-size="16" font-weight="700" fill="var(--color-accent-2-800)">Verification</text>
<text x="72" y="372" font-size="12.5" fill="var(--color-text)">Proof that the diff satisfies the contract. Lives in the repo, next to the code.</text>
<text x="580" y="348" font-size="12" font-weight="700" fill="var(--color-accent-2-800)">VETO POWER</text>
<text x="580" y="370" font-size="11.5" fill="var(--color-neutral-700)">outlives the project</text>
<path d="M700 340 L716 340 L716 48 L700 48" fill="none" stroke="var(--color-accent-2-600)" stroke-width="2.5" marker-end="url(#ar-capas-v)"/>
<text x="694" y="200" font-size="11.5" font-weight="700" fill="var(--color-accent-2-800)" transform="rotate(-90 694 200)" text-anchor="middle">verification corrects the contract</text>
</svg>
<figcaption>Authority flows down; correction flows up. Layer 3 is the only disposable one, and it is also the only one whose tooling changes every six months.</figcaption>
</figure>

### Layer 1 · Intent

**What it is:** the contract. What the system must do and why.

**Two distinct artifacts:**

- *Current state* — what the system does today. Descriptive and always true.
- *Change proposal* — the delta you want to introduce. Prescriptive and temporary.

Confusing them is the most common mistake. Mix both into one document and in six months you will not be able to tell what the system does from what somebody once proposed it should do.

<figure class="diagram">
<svg viewBox="0 0 720 300" role="img" aria-labelledby="d-estado-t">
<title id="d-estado-t">Current state versus change proposal: descriptive and permanent versus prescriptive and temporary</title>
<defs><marker id="ar-estado" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<rect x="0" y="20" width="330" height="176" rx="18" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="22" y="48" font-size="15" font-weight="700" fill="var(--color-accent-700)">Current state</text>
<text x="22" y="70" font-size="12" font-weight="700" fill="var(--color-neutral-800)">What the system does TODAY</text>
<text x="22" y="96" font-size="12.5" fill="var(--color-text)">· descriptive</text>
<text x="22" y="118" font-size="12.5" fill="var(--color-text)">· always true</text>
<text x="22" y="140" font-size="12.5" fill="var(--color-text)">· permanent</text>
<rect x="22" y="152" width="286" height="30" rx="10" fill="var(--color-bg)" stroke="var(--color-accent)"/>
<text x="165" y="172" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">to know what it does, read here</text>
<rect x="390" y="20" width="330" height="176" rx="18" fill="var(--color-neutral-200)" stroke="var(--color-neutral-600)" stroke-width="2" stroke-dasharray="7 6"/>
<text x="412" y="48" font-size="15" font-weight="700" fill="var(--color-neutral-800)">Change proposal</text>
<text x="412" y="70" font-size="12" font-weight="700" fill="var(--color-neutral-800)">The delta you want to introduce</text>
<text x="412" y="96" font-size="12.5" fill="var(--color-text)">· prescriptive</text>
<text x="412" y="118" font-size="12.5" fill="var(--color-text)">· temporary</text>
<rect x="412" y="130" width="86" height="26" rx="9" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="455" y="148" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">ADDED</text>
<rect x="504" y="130" width="96" height="26" rx="9" fill="var(--color-accent-200)" stroke="var(--color-accent)"/>
<text x="552" y="148" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">MODIFIED</text>
<rect x="606" y="130" width="98" height="26" rx="9" fill="var(--color-neutral-300)" stroke="var(--color-neutral-600)"/>
<text x="655" y="148" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">REMOVED</text>
<text x="412" y="176" font-size="12" font-weight="700" fill="var(--color-neutral-700)">lives only until the cycle closes</text>
<path d="M388 108 L 336 108" fill="none" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-estado)"/>
<text x="362" y="98" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">absorbed</text>
<rect x="0" y="218" width="720" height="66" rx="16" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="22" y="244" font-size="13" font-weight="700" fill="var(--color-accent-2-800)">On closing the cycle: the delta is absorbed into the current state and the proposal is archived.</text>
<text x="22" y="268" font-size="12.5" fill="var(--color-text)">This is the step nearly everyone skips, and without it layer 1 becomes a graveyard of contradictory proposals.</text>
</svg>
<figcaption>Two documents, two natures. Mixing them is what makes it impossible, six months later, to tell whether a line describes the system or just an old intention.</figcaption>
</figure>

**Where it lives:** in the repository, versioned, reviewed by PR like any code change.

**Who owns it:** one person. Always. An agent can draft it, but acceptance is human.

**Authority:** maximum. No other layer can contradict it without an explicit review.

### Layer 2 · Coordination

**What it is:** who does what, in what order, blocked by what.

**Minimum content of a work unit:** an identifier, a reference to the corresponding contract (not a copy), a human owner, and a status.

**Where it lives:** outside the repository. Who is working on what changes far faster than the code, and versioning it across branches produces permanent conflicts while adding nothing.

**Critical rule:** the work unit **references** the contract, never contains it. If the technical substance migrates into the tracker, you lose the ability to reconstruct the project from the repository.

### Layer 3 · Execution

**What it is:** translating contract into diff.

**Artifacts it produces:** task plan, diff, session log.

**Where it lives:** nowhere permanent. It is deliberately disposable.

**Design test:** if all of this layer's output were lost tomorrow, no information should be lost with it. If something produced here becomes indispensable to understanding the system, that is a sign it belonged in layer 1 and needs promoting.

**Its limit:** the agent cannot modify the contract on its own. Faced with an ambiguity, it stops and asks. It does not guess. This is the hardest rule to hold and the one that most defines long-term quality — an agent that guesses right 90% of the time leaves you 10% of architectural decisions made by nobody and documented nowhere.

### Layer 4 · Verification

**What it is:** proof that the diff satisfies the contract.

**Artifacts:** acceptance tests derived from layer 1's criteria, unit tests, the automation that runs them, and the gates that block the merge.

**Where it lives:** in the repository, next to the code.

**Authority:** veto power. It is the only layer that cannot be talked around.

**Critical rule:** the acceptance criterion is written **before** layer 3 starts, and by someone other than the implementer. If whoever implements also defines what counts as success, verification stops verifying.

## The four coupling rules

| Rule | Statement | What it prevents |
| --- | --- | --- |
| **Directionality** | Each layer references upward, never duplicates | Four versions of the truth, none authoritative |
| **Judge/executor separation** | The criterion is written by a person, beforehand, in layer 1 | A loop closed on itself |
| **Asymmetric persistence** | Layers 1 and 4 outlive the project; 2 outlives the sprint; 3 the session | Critical knowledge trapped in ephemeral artifacts |
| **Aligned granularity** | One contract = one unit = one reviewable diff = one evidence set | Review made impossible, traceability lost |

<figure class="diagram">
<svg viewBox="0 0 720 340" role="img" aria-labelledby="d-reglas-t">
<title id="d-reglas-t">The four coupling rules between layers</title>
<defs><marker id="ar-reglas" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<rect x="0" y="12" width="348" height="146" rx="18" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="20" y="40" font-size="14" font-weight="700" fill="var(--color-accent-700)">1 · Directionality</text>
<text x="20" y="62" font-size="12" fill="var(--color-text)">Each layer references upward, never duplicates.</text>
<rect x="20" y="74" width="54" height="26" rx="9" fill="var(--color-bg)" stroke="var(--color-accent)"/>
<text x="47" y="92" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">4</text>
<path d="M78 87 L 100 87" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-reglas)"/>
<rect x="104" y="74" width="54" height="26" rx="9" fill="var(--color-bg)" stroke="var(--color-accent)"/>
<text x="131" y="92" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">3</text>
<path d="M162 87 L 184 87" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-reglas)"/>
<rect x="188" y="74" width="54" height="26" rx="9" fill="var(--color-bg)" stroke="var(--color-accent)"/>
<text x="215" y="92" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">2</text>
<path d="M246 87 L 268 87" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-reglas)"/>
<rect x="272" y="74" width="54" height="26" rx="9" fill="var(--color-accent)" stroke="var(--color-accent-700)"/>
<text x="299" y="92" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">1</text>
<text x="20" y="126" font-size="11.5" font-weight="700" fill="var(--color-neutral-700)">Prevents: four versions of the truth,</text>
<text x="20" y="145" font-size="11.5" font-weight="700" fill="var(--color-neutral-700)">none of them authoritative.</text>
<rect x="372" y="12" width="348" height="146" rx="18" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="392" y="40" font-size="14" font-weight="700" fill="var(--color-accent-2-800)">2 · Judge/executor separation</text>
<text x="392" y="62" font-size="12" fill="var(--color-text)">The criterion is written by a person, beforehand.</text>
<rect x="392" y="74" width="140" height="30" rx="10" fill="var(--color-bg)" stroke="var(--color-accent-2-600)"/>
<text x="462" y="94" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">who judges</text>
<rect x="556" y="74" width="140" height="30" rx="10" fill="var(--color-neutral-200)" stroke="var(--color-neutral-600)" stroke-dasharray="6 5"/>
<text x="626" y="94" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">who executes</text>
<text x="544" y="94" font-size="16" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">≠</text>
<text x="392" y="126" font-size="11.5" font-weight="700" fill="var(--color-neutral-700)">Prevents: a loop closed on itself that</text>
<text x="392" y="145" font-size="11.5" font-weight="700" fill="var(--color-neutral-700)">verifies nothing.</text>
<rect x="0" y="176" width="348" height="152" rx="18" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="20" y="204" font-size="14" font-weight="700" fill="var(--color-neutral-800)">3 · Asymmetric persistence</text>
<rect x="20" y="216" width="94" height="26" rx="9" fill="var(--color-neutral-300)" stroke="var(--color-neutral-600)" stroke-dasharray="6 5"/>
<text x="67" y="234" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">3: session</text>
<rect x="120" y="216" width="94" height="26" rx="9" fill="var(--color-neutral-300)" stroke="var(--color-neutral-600)"/>
<text x="167" y="234" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">2: sprint</text>
<rect x="220" y="216" width="108" height="26" rx="9" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="274" y="234" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">1 and 4: project</text>
<text x="20" y="266" font-size="12" fill="var(--color-text)">What lasts longest holds what matters most.</text>
<text x="20" y="296" font-size="11.5" font-weight="700" fill="var(--color-neutral-700)">Prevents: critical knowledge trapped</text>
<text x="20" y="315" font-size="11.5" font-weight="700" fill="var(--color-neutral-700)">in ephemeral artifacts.</text>
<rect x="372" y="176" width="348" height="152" rx="18" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="392" y="204" font-size="14" font-weight="700" fill="var(--color-neutral-800)">4 · Aligned granularity</text>
<rect x="392" y="216" width="74" height="26" rx="9" fill="var(--color-accent-200)" stroke="var(--color-accent)"/>
<text x="429" y="234" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">contract</text>
<text x="474" y="234" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-neutral-700)">=</text>
<rect x="484" y="216" width="66" height="26" rx="9" fill="var(--color-neutral-300)" stroke="var(--color-neutral-600)"/>
<text x="517" y="234" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">unit</text>
<text x="558" y="234" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-neutral-700)">=</text>
<rect x="568" y="216" width="56" height="26" rx="9" fill="var(--color-neutral-300)" stroke="var(--color-neutral-600)"/>
<text x="596" y="234" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">diff</text>
<text x="632" y="234" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-neutral-700)">=</text>
<rect x="642" y="216" width="76" height="26" rx="9" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)"/>
<text x="680" y="234" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">evidence</text>
<text x="392" y="266" font-size="12" fill="var(--color-text)">If one grows, review stops being possible.</text>
<text x="392" y="296" font-size="11.5" font-weight="700" fill="var(--color-neutral-700)">Prevents: PRs approved without reading</text>
<text x="392" y="315" font-size="11.5" font-weight="700" fill="var(--color-neutral-700)">and traceability lost.</text>
</svg>
<figcaption>The four rules are not style: each one prevents a concrete, observable failure — and the diagnosis section at the end of this article reads them backwards, as symptoms.</figcaption>
</figure>

### The cycle

**Outbound:** a delta is proposed → humans agree on it → it becomes a work unit → an agent executes it → the evidence validates it.

**Closing:** the delta is absorbed into the current state and the proposal is archived. This is the step nearly everyone skips, and it is what stops layer 1 from becoming a graveyard of contradictory proposals.

**Return:** there are two return paths.

- *From verification* — if the evidence contradicts the contract, the evidence wins and the contract is corrected. Never the other way around.
- *From execution* — if the agent finds an ambiguity, it escalates. It does not resolve.

<figure class="diagram">
<svg viewBox="0 0 720 330" role="img" aria-labelledby="d-ciclo-t">
<title id="d-ciclo-t">The full cycle: outbound, closing, and the two return paths</title>
<defs><marker id="ar-ciclo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker><marker id="ar-ciclo-v" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-2-600)"/></marker><marker id="ar-ciclo-n" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-neutral-600)"/></marker></defs>
<text x="2" y="20" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">OUTBOUND</text>
<rect x="0" y="30" width="126" height="58" rx="14" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="63" y="55" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">delta</text>
<text x="63" y="74" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">proposal</text>
<path d="M128 59 L 148 59" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-ciclo)"/>
<rect x="152" y="30" width="126" height="58" rx="14" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="215" y="55" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">agreement</text>
<text x="215" y="74" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">between humans</text>
<path d="M280 59 L 300 59" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-ciclo)"/>
<rect x="304" y="30" width="126" height="58" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-neutral-600)"/>
<text x="367" y="55" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">work</text>
<text x="367" y="74" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">unit</text>
<path d="M432 59 L 452 59" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-ciclo)"/>
<rect x="456" y="30" width="126" height="58" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-neutral-600)" stroke-dasharray="6 5"/>
<text x="519" y="55" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">the agent</text>
<text x="519" y="74" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">executes</text>
<path d="M584 59 L 604 59" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-ciclo)"/>
<rect x="608" y="30" width="112" height="58" rx="14" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="664" y="55" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">the evidence</text>
<text x="664" y="74" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">validates</text>
<text x="2" y="130" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">CLOSING</text>
<rect x="0" y="140" width="720" height="52" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="22" y="164" font-size="13" font-weight="700" fill="var(--color-accent-700)">The delta is absorbed into the current state and the proposal is archived.</text>
<text x="22" y="184" font-size="11.5" fill="var(--color-text)">The step nearly everyone skips. Without it, layer 1 accumulates proposals that contradict each other.</text>
<text x="2" y="228" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">RETURN — two paths, and neither is optional</text>
<rect x="0" y="238" width="348" height="84" rx="16" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="20" y="264" font-size="12.5" font-weight="700" fill="var(--color-accent-2-800)">From verification</text>
<path d="M20 276 L 84 276" stroke="var(--color-accent-2-600)" stroke-width="2.5" marker-end="url(#ar-ciclo-v)"/>
<text x="20" y="298" font-size="12" fill="var(--color-text)">If the evidence contradicts the contract,</text>
<text x="20" y="316" font-size="12" font-weight="700" fill="var(--color-accent-2-800)">the evidence wins. Never the reverse.</text>
<rect x="372" y="238" width="348" height="84" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-neutral-600)"/>
<text x="392" y="264" font-size="12.5" font-weight="700" fill="var(--color-neutral-800)">From execution</text>
<path d="M392 276 L 456 276" stroke="var(--color-neutral-600)" stroke-width="2.5" marker-end="url(#ar-ciclo-n)"/>
<text x="392" y="298" font-size="12" fill="var(--color-text)">If the agent finds an ambiguity,</text>
<text x="392" y="316" font-size="12" font-weight="700" fill="var(--color-neutral-800)">it escalates. It does not resolve.</text>
</svg>
<figcaption>Closing is the invisible step: nobody misses it until layer 1 has already become useless. Treat it as part of the merge, not as a separate chore.</figcaption>
</figure>

## Part 2 — Tools by layer

Tools change fast; layers do not. This section will go stale before the rest of the article, and that is exactly the point: if your process depends on a specific tool, migrating costs you the whole process.

<figure class="diagram">
<svg viewBox="0 0 720 290" role="img" aria-labelledby="d-tools-t">
<title id="d-tools-t">Tool categories per layer and how fast each one churns</title>
<rect x="0" y="14" width="720" height="60" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<circle cx="30" cy="44" r="15" fill="var(--color-accent)"/>
<text x="30" y="50" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">1</text>
<text x="58" y="40" font-size="13" font-weight="700" fill="var(--color-accent-700)">Versioned specification frameworks</text>
<text x="58" y="62" font-size="12" fill="var(--color-text)">OpenSpec · Spec Kit · BMAD · Kiro · your own markdown  +  AGENTS.md / CLAUDE.md at the root</text>
<text x="712" y="48" font-size="11" text-anchor="end" fill="var(--color-neutral-700)">low churn</text>
<rect x="0" y="82" width="720" height="60" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<circle cx="30" cy="112" r="15" fill="var(--color-neutral-600)"/>
<text x="30" y="118" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">2</text>
<text x="58" y="108" font-size="13" font-weight="700" fill="var(--color-neutral-800)">Trackers with agent support</text>
<text x="58" y="130" font-size="12" fill="var(--color-text)">GitHub Issues · Linear · Jira — the criterion is not features, it is who else has to take part</text>
<text x="712" y="116" font-size="11" text-anchor="end" fill="var(--color-neutral-700)">low churn</text>
<rect x="0" y="150" width="720" height="60" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-neutral-600)" stroke-width="2" stroke-dasharray="7 6"/>
<circle cx="30" cy="180" r="15" fill="var(--color-neutral-600)"/>
<text x="30" y="186" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">3</text>
<text x="58" y="176" font-size="13" font-weight="700" fill="var(--color-neutral-800)">Agent harness — CLI, IDE, or cloud</text>
<text x="58" y="198" font-size="12" fill="var(--color-text)">Pick it for team ergonomics, not benchmarks. It is the most replaceable of the four layers.</text>
<text x="712" y="184" font-size="11" font-weight="700" text-anchor="end" fill="var(--color-accent-700)">HIGH CHURN</text>
<rect x="0" y="218" width="720" height="60" rx="16" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<circle cx="30" cy="248" r="15" fill="var(--color-accent-2-700)"/>
<text x="30" y="254" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">4</text>
<text x="58" y="244" font-size="13" font-weight="700" fill="var(--color-accent-2-800)">Test frameworks, static analysis, and CI</text>
<text x="58" y="266" font-size="12" fill="var(--color-text)">Cucumber · Playwright · pytest · Vitest · linters · Actions — with blocking gates, not informational ones</text>
<text x="712" y="252" font-size="11" text-anchor="end" fill="var(--color-neutral-700)">low churn</text>
</svg>
<figcaption>The three layers that matter churn slowly. The one everybody argues about — which agent to use — is precisely the one you need to be able to swap at no cost.</figcaption>
</figure>

### Layer 1 · Intent

**Category:** versioned specification frameworks.

| Tool | Profile | Notes |
| --- | --- | --- |
| **OpenSpec** | Brownfield, lightweight | Separates current state from proposals using delta markers (ADDED/MODIFIED/REMOVED). Produces compact, easily reviewable artifacts. Its *stores* allow specs shared across repos. |
| **GitHub Spec Kit** | Greenfield, structured | More exhaustive and more verbose — roughly three times the content OpenSpec produces for the same change. Requires Python. |
| **BMAD-METHOD** | Multi-team, ceremonious | Simulates a full agile team with 12+ specialized agents. Only justified at large scale. |
| **Kiro** | Full IDE | Integrates all four layers in one environment. Less initial friction, more lock-in. |
| **Your own documents** | Any | A markdown directory with clear conventions covers 80% of the value. Do not underestimate this option. |

**Minimum requirement, tool-independent:** a conventions file at the repository root (`AGENTS.md` or `CLAUDE.md`) that any agent reads on startup. That is what makes the rest portable.

### Layer 2 · Coordination

**Category:** trackers with agent support.

| Tool | Strength | Limit |
| --- | --- | --- |
| **GitHub Issues** | Short loops between idea, code, review, and merge; highly programmable via Actions and GraphQL | It is a developer-native coordination layer, not a work system that spans the whole organization |
| **Linear** | Treats agents as first-class participants: direct assignment, issue context when launching the coding tool, MCP support | Lives outside the repository, with no native access to the code |
| **Jira** | Administrative model and governance for large organizations | Considerable configuration weight |

The choice criterion is not features but **who else has to take part**. If it is only developers, Issues is enough. If design, product, or management are involved, a developer-native tracker shuts them out.

### Layer 3 · Execution

**Category:** agent harness.

- **CLI:** Claude Code, Codex CLI, Gemini CLI, Aider
- **IDE:** Cursor, Cline, Roo Code, Copilot
- **Cloud/async:** agents that take an issue and hand back a PR

This is the fastest-churning layer and the one where deep integration is least worth investing in. Pick it for team ergonomics, not benchmarks. The best agents today solve between 60% and 70% of SWE-bench Verified, but that benchmark uses curated issues with explicit acceptance criteria — conditions real tasks almost never have. The number says more about the quality of your layer 1 than about the agent.

### Layer 4 · Verification

**Category:** test frameworks and automation.

| Level | Typical tools | Derives from |
| --- | --- | --- |
| Acceptance | Cucumber, Behave, Playwright, contract testing | Layer 1 criteria |
| Unit | pytest, Vitest, JUnit, Go testing | Layer 3 design |
| Static | linters, type checkers, security analysis | Repo conventions |
| Orchestration | GitHub Actions, GitLab CI, and merge gates | — |

**Configuration rule:** gates must be blocking, not informational. A check you can merge past in red is not verification, it is decoration.

## Part 3 — How the methodologies fit together

No methodology covers all four layers. Each one concentrates on one or two and assumes the rest. Understanding **where each one puts its weight** is what lets you combine them with neither overlap nor gaps.

### Coverage matrix

| Methodology | Layer 1 | Layer 2 | Layer 3 | Layer 4 |
| --- | :---: | :---: | :---: | :---: |
| Vibe coding | — | — | ●●● | — |
| Issue-driven | ○ | ●●● | ●● | ○ |
| SDD (spec-driven) | ●●● | ○ | ●● | ● |
| TDD (test-driven) | — | — | ●● | ●●● |
| BDD / ATDD | ●● | — | ● | ●●● |
| **SDD + TDD** | ●●● | ○ | ●● | ●●● |
| EDD (evaluation-driven) | ● | — | ● | ●●● |

●●● main focus · ●● strong involvement · ● partial involvement · ○ marginal · — does not cover

<figure class="diagram">
<svg viewBox="0 0 720 330" role="img" aria-labelledby="d-mapa-t">
<title id="d-mapa-t">Coverage heat map: seven methodologies against the four layers</title>
<text x="200" y="26" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">Layer 1</text>
<text x="316" y="26" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">Layer 2</text>
<text x="432" y="26" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">Layer 3</text>
<text x="548" y="26" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">Layer 4</text>
<text x="0" y="56" font-size="12.5" fill="var(--color-text)">Vibe coding</text>
<rect x="142" y="38" width="112" height="26" rx="8" fill="var(--color-neutral-200)"/>
<rect x="258" y="38" width="112" height="26" rx="8" fill="var(--color-neutral-200)"/>
<rect x="374" y="38" width="112" height="26" rx="8" fill="var(--color-accent-600)"/>
<text x="430" y="56" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">focus</text>
<rect x="490" y="38" width="112" height="26" rx="8" fill="var(--color-neutral-200)"/>
<text x="0" y="90" font-size="12.5" fill="var(--color-text)">Issue-driven</text>
<rect x="142" y="72" width="112" height="26" rx="8" fill="var(--color-accent-200)"/>
<rect x="258" y="72" width="112" height="26" rx="8" fill="var(--color-accent-600)"/>
<text x="314" y="90" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">focus</text>
<rect x="374" y="72" width="112" height="26" rx="8" fill="var(--color-accent-400)"/>
<rect x="490" y="72" width="112" height="26" rx="8" fill="var(--color-accent-200)"/>
<text x="0" y="124" font-size="12.5" fill="var(--color-text)">SDD</text>
<rect x="142" y="106" width="112" height="26" rx="8" fill="var(--color-accent-600)"/>
<text x="198" y="124" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">focus</text>
<rect x="258" y="106" width="112" height="26" rx="8" fill="var(--color-accent-200)"/>
<rect x="374" y="106" width="112" height="26" rx="8" fill="var(--color-accent-400)"/>
<rect x="490" y="106" width="112" height="26" rx="8" fill="var(--color-accent-300)"/>
<text x="0" y="158" font-size="12.5" fill="var(--color-text)">TDD</text>
<rect x="142" y="140" width="112" height="26" rx="8" fill="var(--color-neutral-200)"/>
<rect x="258" y="140" width="112" height="26" rx="8" fill="var(--color-neutral-200)"/>
<rect x="374" y="140" width="112" height="26" rx="8" fill="var(--color-accent-2-400)"/>
<rect x="490" y="140" width="112" height="26" rx="8" fill="var(--color-accent-2-700)"/>
<text x="546" y="158" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">focus</text>
<text x="0" y="192" font-size="12.5" fill="var(--color-text)">BDD / ATDD</text>
<rect x="142" y="174" width="112" height="26" rx="8" fill="var(--color-accent-400)"/>
<rect x="258" y="174" width="112" height="26" rx="8" fill="var(--color-neutral-200)"/>
<rect x="374" y="174" width="112" height="26" rx="8" fill="var(--color-accent-2-300)"/>
<rect x="490" y="174" width="112" height="26" rx="8" fill="var(--color-accent-2-700)"/>
<text x="546" y="192" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">focus</text>
<rect x="-8" y="208" width="620" height="34" rx="10" fill="var(--color-accent-100)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="0" y="230" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">SDD + TDD</text>
<rect x="142" y="212" width="112" height="26" rx="8" fill="var(--color-accent-600)"/>
<text x="198" y="230" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">focus</text>
<rect x="258" y="212" width="112" height="26" rx="8" fill="var(--color-accent-200)"/>
<rect x="374" y="212" width="112" height="26" rx="8" fill="var(--color-accent-400)"/>
<rect x="490" y="212" width="112" height="26" rx="8" fill="var(--color-accent-2-700)"/>
<text x="546" y="230" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">focus</text>
<text x="0" y="272" font-size="12.5" fill="var(--color-text)">EDD</text>
<rect x="142" y="254" width="112" height="26" rx="8" fill="var(--color-accent-300)"/>
<rect x="258" y="254" width="112" height="26" rx="8" fill="var(--color-neutral-200)"/>
<rect x="374" y="254" width="112" height="26" rx="8" fill="var(--color-accent-2-300)"/>
<rect x="490" y="254" width="112" height="26" rx="8" fill="var(--color-accent-2-700)"/>
<text x="546" y="272" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">focus</text>
<text x="622" y="230" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">the only one</text>
<text x="622" y="246" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">on 1 and 4</text>
<text x="0" y="310" font-size="11.5" fill="var(--color-neutral-700)">More saturation, more weight. Pale cells are partial involvement; grey ones, no coverage.</text>
</svg>
<figcaption>No methodology covers all four layers on its own. SDD + TDD is the only row with a main focus on layer 1 and layer 4 at once — which are, precisely, the two that outlive the project.</figcaption>
</figure>

### Vibe coding

**What it is:** describing in natural language what you want, letting the agent generate the code, and accepting the result if it "works", iterating through conversation without reading the code in detail. There is no prior contract and no success criterion fixed in advance: the criterion is the impression of whoever tries it. Andrej Karpathy popularized the term in early 2025 to describe that mode of working where you forget the code even exists.

**Where it lives:** layer 3, exclusively.

It works well for prototypes, exploration, and throwaway scripts — contexts where the cost of being wrong is zero and the artifact has no future.

**Why it fails at scale:** all the knowledge stays in the most ephemeral layer. When the session ends, the information is gone. With several people, each one builds a different mental model of the system and nobody can reconcile them.

**When to use it anyway:** inside a work unit already bounded by a contract. Vibe coding is a valid layer 3 technique; the problem is using it *as a methodology*.

### Issue-driven development

**What it is:** organizing work around a tracker's issues. Every change is born as an issue, is discussed, prioritized, and assigned there, and is closed when the associated PR merges. It is the default practice of almost any team using GitHub, GitLab, or Jira, which is why many apply it without naming it.

**Where it lives:** layer 2, spilling into layer 3.

The issue is the work unit and the agent's entry point. In its pure form, the agent reads the issue, navigates the code, and hands back a PR.

**Strength:** zero adoption friction. It does not change how the team works, it just adds an actor.

**Structural weakness:** with no layer 1, the issue ends up absorbing the specification. It starts as three lines and ends up a design document buried in comments. Six months later you have a tracker with thousands of closed issues and no coherent description of the system.

**How to integrate it well:** keep the issue thin and pointing at the contract. Issue-driven is an excellent layer 2 and a terrible layer 1.

### SDD — Spec-driven development

**What it is:** writing and approving a specification — what the system must do, at what scope, under what constraints — before generating code, and using that spec as the agent's direct input instead of a loose prompt. It is the methodology behind the layer 1 tools from Part 2 (OpenSpec, Spec Kit, Kiro): each is a different way of structuring the spec and chaining it to the plan and the tasks.

**Where it lives:** layer 1, with strong influence over layer 3.

It inverts the traditional relationship: the specification stops being documentation written afterwards and becomes the source that drives generation, checklists, and task decomposition.

**Key difference from a traditional PRD:** a design document is written for human readers, who interpret ambiguities and fill gaps with organizational context. Agents fill gaps too — but not the way you would want. Without explicit scope, they move fast in the wrong direction.

**Its blind spot:** SDD alone is weak on layer 4. It produces documents describing expected behavior, but the translation into executable evidence stays implicit. On top of that, proposals are static: in long implementations, contract and code drift apart with nothing catching it.

**Three levels of spec authority over code:**

1. *Spec-first* — the spec precedes and constrains, the code is still the main deliverable
2. *Spec-anchored* — governance layers and supervision checkpoints are added
3. *Spec-as-source* — the spec is the primary artifact and the code is derived

Most teams should start at level 1.

### TDD — Test-driven development

**What it is:** writing an automated test that fails first, because the functionality does not exist yet, then the minimum code to make it pass, and finally refactoring with the test as a safety net. That cycle — *red, green, refactor* — repeats in small increments at the unit level. Kent Beck formalized it within Extreme Programming, and it is as much a design technique as a verification one: it forces you to define a component's interface before implementing it.

**Where it lives:** layer 4, with strong influence over layer 3.

With agents, there are three variants depending on where the human sits:

| Variant | Who writes the test | Risk |
| --- | --- | --- |
| Human writes the tests | A person | Low — but it is the bottleneck |
| Review checkpoint | Agent writes, human approves before implementing | Medium |
| Everything inside the loop | Agent writes both test and implementation | **High** |

**The third variant's risk is concrete, not theoretical.** Kent Beck documented agents deleting failing tests instead of fixing the underlying implementation. The agent optimizes the criterion you gave it — if the criterion is "keep the suite green" and the agent controls the suite, you have a misaligned incentive.

**Its blind spot:** TDD says nothing about *what* to build. It verifies you did well what you decided to do, not that you decided the right thing. A system with 100% coverage can be solving the wrong problem.

### BDD / ATDD

**What it is:** two names for the same idea, with different emphases.

- *BDD (Behavior-Driven Development)* — an evolution of TDD proposed by Dan North. Instead of unit tests, the system's expected behavior is described in structured natural-language scenarios (*Given-When-Then*: given an initial state, when an action occurs, then a result is expected), written jointly by business, development, and testing, and automated with tools like Cucumber or Behave.
- *ATDD (Acceptance Test-Driven Development)* — the same practice seen from the test side: acceptance criteria are agreed with whoever requests the change and turned into executable tests **before** implementing.

In practice they are used almost interchangeably. BDD puts the weight on shared language; ATDD, on the acceptance test as a contract.

**Where it lives:** a bridge between layer 1 and layer 4.

The scenarios work simultaneously as readable specification and as executable test. It is the methodology that naturally connects intent with evidence.

**Its specific advantage in this scheme:** it resolves the translation SDD leaves implicit. The acceptance criterion stops being interpretable prose and becomes an artifact that runs.

**Its risk with agents:** when the agent generates the scenarios from a domain description, those scenarios tend to reflect the model's training distribution rather than your domain's specific edge cases. AI-generated scenarios need human review focused on **completeness**, not correctness — the problem is rarely that a scenario is wrong, but that the three that matter are missing.

### SDD + TDD — the recommended combination

**What it is:** not a new methodology but the explicit combination of the two above: SDD to fix the contract and scope before starting, and TDD — with BDD scenarios as the bridge — to turn that contract into failing tests before the agent writes any code. Each one covers the other's blind spot.

**Where it lives:** layers 1 and 4 simultaneously, which is exactly what neither covers alone.

The two methodologies operate at different architectural levels, which is why they integrate rather than compete: TDD drives interface design through red-green-refactor cycles at the unit level, while SDD stacks on top to impose architectural constraints.

<figure class="diagram">
<svg viewBox="0 0 720 400" role="img" aria-labelledby="d-flujo-t">
<title id="d-flujo-t">The SDD plus TDD flow in six steps across the four layer lanes</title>
<defs><marker id="ar-flujo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<rect x="0" y="0" width="96" height="392" rx="14" fill="var(--color-accent-200)" stroke="var(--color-accent)"/>
<text x="48" y="30" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">LAYER 1</text>
<text x="48" y="48" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">Intent</text>
<rect x="104" y="18" width="616" height="52" rx="14" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<circle cx="130" cy="44" r="14" fill="var(--color-accent)"/>
<text x="130" y="49" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">1</text>
<text x="154" y="40" font-size="13" font-weight="700" fill="var(--color-accent-700)">Change contract + Given-When-Then scenarios</text>
<text x="154" y="60" font-size="11.5" fill="var(--color-text)">Expected behavior, scope, and criteria. Reviewed and approved by a person.</text>
<line x1="130" y1="74" x2="130" y2="86" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-flujo)"/>
<rect x="104" y="90" width="616" height="46" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-neutral-600)"/>
<circle cx="130" cy="113" r="14" fill="var(--color-neutral-600)"/>
<text x="130" y="118" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">2</text>
<text x="154" y="109" font-size="13" font-weight="700" fill="var(--color-neutral-800)">Work units with an assigned owner</text>
<text x="154" y="128" font-size="11.5" fill="var(--color-text)">Layer 2 — the tracker points at the contract, it does not copy it.</text>
<line x1="130" y1="140" x2="130" y2="152" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-flujo)"/>
<rect x="104" y="156" width="616" height="52" rx="14" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2.5"/>
<circle cx="130" cy="182" r="14" fill="var(--color-accent-2-700)"/>
<text x="130" y="187" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">3</text>
<text x="154" y="178" font-size="13" font-weight="700" fill="var(--color-accent-2-800)">Acceptance tests that FAIL — written by the judge</text>
<text x="154" y="198" font-size="11.5" fill="var(--color-text)">Layer 4, before execution. This is the step that makes judge/executor separation real.</text>
<line x1="130" y1="212" x2="130" y2="224" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-flujo)"/>
<rect x="104" y="228" width="616" height="52" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-neutral-600)" stroke-dasharray="7 6"/>
<circle cx="130" cy="254" r="14" fill="var(--color-neutral-600)"/>
<text x="130" y="259" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">4</text>
<text x="154" y="250" font-size="13" font-weight="700" fill="var(--color-neutral-800)">The agent implements the minimum to pass them</text>
<text x="154" y="270" font-size="11.5" fill="var(--color-text)">Layer 3 — with unit-level TDD for internal design. It does not touch the acceptance tests.</text>
<line x1="130" y1="284" x2="130" y2="296" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-flujo)"/>
<rect x="104" y="300" width="616" height="46" rx="14" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<circle cx="130" cy="323" r="14" fill="var(--color-accent-2-700)"/>
<text x="130" y="328" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">5</text>
<text x="154" y="319" font-size="13" font-weight="700" fill="var(--color-accent-2-800)">CI green, with blocking gates</text>
<text x="154" y="338" font-size="11.5" fill="var(--color-text)">Layer 4 — acceptance and unit tests. Red does not merge.</text>
<line x1="130" y1="350" x2="130" y2="362" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-flujo)"/>
<rect x="104" y="366" width="616" height="34" rx="12" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<circle cx="130" cy="383" r="13" fill="var(--color-accent)"/>
<text x="130" y="388" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">6</text>
<text x="154" y="388" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">The delta is absorbed into the current state and the proposal is archived.</text>
</svg>
<figcaption>Order matters more than tooling: step 3 comes before step 4, and someone else writes it. If the same agent does both, you are back to the closed loop.</figcaption>
</figure>

**The concrete flow, layer by layer:**

1. **Layer 1** — the change contract is written: expected behavior, scope, and the acceptance scenarios in Given-When-Then format. A person reviews and approves it.
2. **Layer 2** — the contract becomes one or more work units with an assigned owner.
3. **Layer 4 (first step)** — the scenarios are translated into executable acceptance tests **that fail**. This happens *before* execution, and it is what makes judge/executor separation real rather than declarative.
4. **Layer 3** — the agent implements the minimum needed to pass the tests, using unit-level TDD for the internal design.
5. **Layer 4 (closing)** — CI runs acceptance and unit tests. The gates block the merge if anything fails.
6. **Layer 1 (archiving)** — the delta is absorbed into the current state.

**Why this combination specifically:** the spec is the rein; TDD is the mechanism that holds it. Without a spec, TDD verifies the wrong thing well. Without TDD, the spec drifts silently during implementation. Code shipped with neither spec nor test suite looks fine until the third sprint, when behavioral drift accumulates and refactoring turns into archaeology.

**The rule that keeps it from collapsing:** the step 3 acceptance tests are written by a person, or by an agent different from the one implementing and reviewed by a person. If the same agent does 3 and 4, you are back to the closed loop.

### EDD — Evaluation-driven development

**What it is:** adapting the test-driven cycle to components whose behavior is non-deterministic, such as an LLM or an agent. Instead of binary asserts, you define *evals*: sets of representative cases with metrics — accuracy, instruction adherence, quality judged by another model or by people — run continuously, before and after each deployment, to catch regressions when the model, the prompt, or the data changes.

**Where it lives:** layer 4, extended beyond the merge.

Only relevant if what you are building *includes* AI components. TDD and BDD assume that once software passes its tests it stays reliable — a valid assumption for deterministic systems. LLM-based components evolve with model changes, knowledge updates, and context variations, and exhibit emergent behaviors no static test case anticipates.

**What it adds:** continuous post-deployment evaluation, with metrics on dimensions asserts do not capture — reasoning coherence, constraint adherence, output quality.

**When to bring it in:** if your product has an agent inside it, layer 4 needs this component in addition to traditional tests. If you only use agents *to* build deterministic software, you do not need it.

## Adoption guide

**Coming from vibe coding:** add layer 4 first. Acceptance tests before specs. It is the change with the best effort-to-benefit ratio and the one that makes the problem visible.

**Coming from issue-driven:** add layer 1 and slim the issues down. Migrate the technical substance from the tracker to the repo.

**Already doing SDD:** check whether your acceptance criteria are executable or prose. If they are prose, you have a nominal layer 4.

**Already doing TDD:** add layer 1 for the decisions tests do not capture — scope, architectural constraints, design rationale.

<figure class="diagram">
<svg viewBox="0 0 720 230" role="img" aria-labelledby="d-adopcion-t">
<title id="d-adopcion-t">Suggested adoption order: layer 4, then layer 1, then layer 2, and layer 3 last</title>
<defs><marker id="ar-adop" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<rect x="0" y="30" width="160" height="106" rx="18" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2.5"/>
<circle cx="34" cy="60" r="16" fill="var(--color-accent-2-700)"/>
<text x="34" y="66" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">4</text>
<text x="60" y="66" font-size="14" font-weight="700" fill="var(--color-accent-2-800)">Verification</text>
<text x="20" y="94" font-size="11.5" fill="var(--color-text)">First, because it is</text>
<text x="20" y="112" font-size="11.5" fill="var(--color-text)">what makes the</text>
<text x="20" y="130" font-size="11.5" font-weight="700" fill="var(--color-accent-2-800)">problem visible.</text>
<path d="M164 83 L 184 83" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-adop)"/>
<rect x="188" y="30" width="160" height="106" rx="18" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2.5"/>
<circle cx="222" cy="60" r="16" fill="var(--color-accent)"/>
<text x="222" y="66" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">1</text>
<text x="248" y="66" font-size="14" font-weight="700" fill="var(--color-accent-700)">Intent</text>
<text x="208" y="94" font-size="11.5" fill="var(--color-text)">Next, to fix</text>
<text x="208" y="112" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">the source of truth</text>
<text x="208" y="130" font-size="11.5" fill="var(--color-text)">the evidence measures.</text>
<path d="M352 83 L 372 83" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-adop)"/>
<rect x="376" y="30" width="160" height="106" rx="18" fill="var(--color-neutral-200)" stroke="var(--color-neutral-600)"/>
<circle cx="410" cy="60" r="16" fill="var(--color-neutral-600)"/>
<text x="410" y="66" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">2</text>
<text x="436" y="66" font-size="14" font-weight="700" fill="var(--color-neutral-800)">Coordination</text>
<text x="396" y="94" font-size="11.5" fill="var(--color-text)">Then, to split the work</text>
<text x="396" y="112" font-size="11.5" fill="var(--color-text)">without absorbing the</text>
<text x="396" y="130" font-size="11.5" fill="var(--color-text)">technical substance.</text>
<path d="M540 83 L 560 83" stroke="var(--color-accent)" stroke-width="2.5" marker-end="url(#ar-adop)"/>
<rect x="564" y="30" width="156" height="106" rx="18" fill="var(--color-neutral-200)" stroke="var(--color-neutral-600)" stroke-dasharray="7 6"/>
<circle cx="598" cy="60" r="16" fill="var(--color-neutral-600)"/>
<text x="598" y="66" font-size="14" font-weight="700" text-anchor="middle" fill="var(--color-neutral-100)">3</text>
<text x="624" y="66" font-size="14" font-weight="700" fill="var(--color-neutral-800)">Execution</text>
<text x="584" y="94" font-size="11.5" fill="var(--color-text)">Last, because it is the</text>
<text x="584" y="112" font-size="11.5" fill="var(--color-text)">one that matters least</text>
<text x="584" y="130" font-size="11.5" font-weight="700" fill="var(--color-neutral-800)">and will change most.</text>
<text x="2" y="176" font-size="12.5" fill="var(--color-text)">The order is counterintuitive on purpose: almost everyone starts by picking an agent, the last decision that matters.</text>
<text x="2" y="204" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">Health indicator: if a newcomer understands what the system does by reading only layers 1 and 4, the scheme works.</text>
</svg>
<figcaption>Suggested implementation order. Layer 3 goes last because it is the one that matters least and the one that will change most.</figcaption>
</figure>

**Suggested implementation order:** layer 4 → layer 1 → layer 2 → optimize layer 3. Layer 3 is last because it matters least and will change most.

## Diagnosis

Four failures, each identifiable by which layer slipped out of place:

| Symptom | Displaced layer | Correction |
| --- | --- | --- |
| Project knowledge lives in the tracker | Substance migrated from 1 to 2 | Move content to the repo, leave references |
| Tests always pass, bugs always ship | Layer 3 writes layer 4 | Separate who writes the criterion |
| The spec says one thing, the system does another | Layer 1 is never archived | Institute the cycle's closing step |
| PRs get approved without reading | Broken granularity | Reduce the size of the work unit |

**Health indicator, in one sentence:** if a newcomer can understand what the system does by reading only layers 1 and 4, the scheme is working.

## References

- [OpenSpec](https://github.com/Fission-AI/OpenSpec)
- [GitHub Spec Kit](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/)
- [Andrej Karpathy, origin of the term *vibe coding*](https://x.com/karpathy/status/1886192184808149383)
- [Dan North, *Introducing BDD*](https://dannorth.net/introducing-bdd/)
- [Martin Fowler, on TDD inside the agent loop](https://martinfowler.com/articles/exploring-gen-ai/tdd-in-the-agent-loop.html)
- [Augment Code, on the spec + TDD combination](https://www.augmentcode.com/guides/spec-tdd-shippable-ai-generated-code)
- [Evaluation-Driven Development for LLM agents](https://arxiv.org/pdf/2411.13768)
- [A taxonomy of frameworks for development agents](https://arxiv.org/pdf/2606.04967)
