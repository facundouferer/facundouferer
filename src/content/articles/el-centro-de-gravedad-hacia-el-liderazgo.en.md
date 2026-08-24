---
title: "The Developer's Center of Gravity Is Shifting Toward Leadership"
slug: 'el-centro-de-gravedad-hacia-el-liderazgo'
date: 2026-08-23
author: 'Facundo Uferer'
category: 'Technical Essay'
tags: ['AI', 'Leadership', 'Software Engineering', 'Education']
excerpt: 'Coding was never just typing syntax. Working with AI agents requires framing problems, assessing risk, and leading systems rather than writing line by line.'
readingTime: 5
lang: 'en'
published: true
featured: false
---
![The developer's center of gravity shifting toward leadership](/img/articles/liderazgo-ia.png)

Almost everything written about artificial intelligence and software development revolves around a single question: *will it replace us?* And I believe the question itself might be mistaken, because it assumes that writing code was the actual job. Typing code was the part that consumed the most time, yes. But it was never the part that generated the most value.

When I teach programming, the hard part is never the syntax. Loops, pointers, `malloc`, or basic language structures: all of that can be learned relatively quickly. What is difficult to teach—what I sometimes struggle to fully instill in a single academic term—is **deciding which program needs to be written in the first place**. How to think through a problem before touching the keyboard. Which of the five possible solutions will remain maintainable two years down the line. That has always been real software engineering. Code was merely the vehicle.

What happened over the past decade is that this distinction became blurred. There was so much demand for people to write code that "knowing how to code" and "being a software engineer" became treated as synonyms in the job market. AI came to dismantle that confusion in the most direct way possible: **by automating the mechanical half that had been mistaken for the whole**.

## What Cannot Be Delegated

If an autonomous agent deletes data because I handed it credentials it shouldn't have had, the failure does not belong to the agent. It belongs to me, for failing to assess the risk beforehand.

It is identical to onboarding a new engineer onto a team: you don't grant direct production access on day one—not because of distrust, but because you haven't yet built the framework where their work is safe and fault-tolerant. With AI, it is the exact same dynamic. The tool is not to blame for how you configure it or the execution boundaries you set.

And here lies the fundamental turn: **building that safe operating framework is a job of leadership, not of code typing.**

## From Step-by-Step Instructions to Problem Framing

Previously, programming meant explicitly defining every sequential step. Today, working with agents means **defining the objective, the success criteria, and the constraints**.

- Which libraries and dependencies are permitted and which are not.
- Which architectural patterns we expect and which will complicate long-term maintainability.
- What execution permissions and boundaries the agent operates within.
- How we will deterministically verify that what it produced is correct.

This mirrors what happens when coordinating a multidisciplinary team. In a team of five where everyone performs a distinct role—development, audiovisual production, graphic design, institutional management—no one writes someone else's code or designs someone else's assets. The leader's role is to **translate a request that often arrives ambiguous or contradictory into clear goals**, with explicit constraints and a shared definition of done that everyone understands alike.

Then I review. Then I take full ownership of the outcome.

That is precisely the same cognitive operation we now apply when working with AI agents.

## What Stays, and What Changes Form

In navigating this shift, two core realities remain essential:

### 1. You Still Need to Know How to Program

Not necessarily to handcraft every single line in daily practice, but because **you cannot supervise what you do not deeply understand**. This is why I continue teaching software development courses at university with absolute conviction.

Someone who has never written a loop or managed memory by hand lacks the mental models required to critically evaluate what an agent produces; they can only accept it blindly. And accepting output without evaluating it is the single greatest professional hazard in our industry today, because large language models are extraordinarily good at making conceptually flawed code look completely plausible.

### 2. Supervision Changes Form

In the past, we reviewed code line-by-line looking for syntactic typos or basic logic errors. Today, we review the overarching framing:

- Demanding justifications for architectural decisions against official documentation.
- Running the test suites ourselves rather than passively trusting an agent's claim that tests passed.
- Pre-defining deterministic validation strategies for every requirement before generation begins.

The single most valuable skill learned in recent practice has not been shallow prompt engineering: it has been **taking a complex requirement and breaking it down into verifiable, modular units**.

## Why This Matters Today

Many people are currently training for a job profile that is rapidly shrinking, while the skill set that is expanding is rarely taught in traditional curricula.

Rarely is there a course dedicated to crafting rigorous acceptance criteria, evaluating system risk before delegating critical tasks, or communicating technical tradeoffs clearly across teams. Yet these competencies are, more than ever, the true core of our craft.

Software engineering was always about this. The only difference is that **today, there is nowhere left to hide behind the code**.
