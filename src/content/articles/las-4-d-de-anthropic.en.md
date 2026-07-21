---
title: "Anthropic's 4 Ds: The AI Fluency Framework"
title_en: "Anthropic's 4 Ds: The AI Fluency Framework"
slug: 'las-4-d-de-anthropic'
date: 2026-07-20
author: 'Facundo Uferer'
category: 'AI Development'
tags:
  - Anthropic
  - AI Fluency
  - Prompt Engineering
  - AI Development
excerpt: "Anthropic proposes a four-competency framework (Delineation, Discernment, Delegation, and Diligence) for using AI with judgment instead of just writing good prompts. Here's how it applies to building software too."
excerpt_en: "Anthropic proposes a four-competency framework (Delineation, Discernment, Delegation, and Diligence) for using AI with judgment instead of just writing good prompts. Here's how it applies to building software too."
readingTime: 13
image: '/img/articles/las-4-d-de-anthropic-en.svg'
lang: 'en'
published: true
featured: false
---

![Anthropic's 4 Ds: The AI Fluency Framework](/img/articles/las-4-d-de-anthropic-en.svg)

Generative AI is a type of artificial intelligence that **creates new content**, instead of just analyzing existing data. The difference from traditional AI is key: a spam classifier analyzes and categorizes an email that already exists; a generative model can write a new email from scratch. The first approach analyzes and classifies; the second **creates something that didn't exist**.

**Large language models** (LLMs) are the best-known type of generative AI today. They're called "language" models because they're trained to predict and generate human language, and "large" because they contain billions of parameters — mathematical values that determine how the model processes information, somewhat like the synaptic connections in a brain.

### How we got here

The leap wasn't sudden. Three developments converged:

1. **Architecture**: the *transformer* architecture, introduced in 2017, changed how AI systems process text sequences by maintaining relationships between words across long passages — critical for understanding language in context.
2. **Data**: the explosion of digital data (websites, code repositories, text of every kind) gave models the raw material to develop a broad, nuanced understanding of language and concepts.
3. **Compute power**: specialized hardware (GPUs, TPUs) and distributed computing networks (clusters) made it possible to train models on all that data.

The combination of these three factors led to an important finding: **scaling laws**. As models grow and are trained with more data and more compute, their performance improves predictably — and, more surprisingly, **emergent capabilities** show up that nobody explicitly programmed, like step-by-step reasoning or adapting to new tasks with minimal instructions.

<svg viewBox="0 0 900 340" xmlns="http://www.w3.org/2000/svg" width="820">
  <defs>
    <marker id="arrowScaleEn" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#333333"/>
    </marker>
  </defs>
  <rect x="0" y="0" width="900" height="340" rx="12" fill="#ffffff"/>
  <rect x="20" y="20" width="230" height="70" rx="10" fill="#eef3fa" stroke="#5b7fa6" stroke-width="1.5"/>
  <text x="135" y="48" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="700" fill="#2d4a6b">🏛️ Architecture</text>
  <text x="135" y="66" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="12" fill="#2d4a6b">transformer (2017)</text>
  <rect x="335" y="20" width="230" height="70" rx="10" fill="#eef3fa" stroke="#5b7fa6" stroke-width="1.5"/>
  <text x="450" y="48" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="700" fill="#2d4a6b">📚 Data</text>
  <text x="450" y="66" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="12" fill="#2d4a6b">explosion of digital text</text>
  <rect x="650" y="20" width="230" height="70" rx="10" fill="#eef3fa" stroke="#5b7fa6" stroke-width="1.5"/>
  <text x="765" y="48" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="700" fill="#2d4a6b">⚡ Compute</text>
  <text x="765" y="66" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="12" fill="#2d4a6b">GPUs, TPUs, clusters</text>
  <path d="M135,90 L135,150 L370,150" fill="none" stroke="#333333" stroke-width="2" marker-end="url(#arrowScaleEn)"/>
  <path d="M450,90 L450,150" fill="none" stroke="#333333" stroke-width="2" marker-end="url(#arrowScaleEn)"/>
  <path d="M765,90 L765,150 L530,150" fill="none" stroke="#333333" stroke-width="2" marker-end="url(#arrowScaleEn)"/>
  <rect x="300" y="150" width="300" height="80" rx="10" fill="#3f6690"/>
  <text x="450" y="180" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="700" fill="#ffffff">Scaling laws:</text>
  <text x="450" y="200" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="12" fill="#e8eef5">more size + data + compute</text>
  <text x="450" y="218" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="12" fill="#e8eef5">= predictable improvement</text>
  <line x1="450" y1="230" x2="450" y2="255" stroke="#333333" stroke-width="2" marker-end="url(#arrowScaleEn)"/>
  <rect x="270" y="255" width="360" height="75" rx="10" fill="#4d8a5c"/>
  <text x="450" y="282" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="700" fill="#ffffff">✨ Emergent capabilities</text>
  <text x="450" y="300" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="12" fill="#eaf3ec">step-by-step reasoning,</text>
  <text x="450" y="317" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="12" fill="#eaf3ec">adapting with minimal instructions</text>
</svg>

### How a model gets trained

Training happens in two phases:

- **Pretraining**: the model analyzes patterns across billions of text examples, predicting the next word over and over. By the end of this phase it has built something like a complex map of language and knowledge — but it's, literally, a very competent "document completer," nothing more.
- **Fine-tuning**: the model learns to follow instructions, give useful responses, and avoid harmful content. This is where human feedback and reinforcement learning come in, rewarding and penalizing behaviors to make the model more helpful, honest, and harmless.

<svg viewBox="0 0 920 340" xmlns="http://www.w3.org/2000/svg" width="760">
  <defs>
    <marker id="arrowTrainEn" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#333333"/>
    </marker>
  </defs>
  <rect x="0" y="0" width="920" height="340" rx="12" fill="#ffffff"/>
  <!-- Input data -->
  <rect x="15" y="85" width="150" height="55" rx="8" fill="#eeeeee" stroke="#999999" stroke-width="1.5"/>
  <text x="90" y="107" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="12" fill="#555555">📚 Billions of</text>
  <text x="90" y="123" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="12" fill="#555555">text examples</text>
  <line x1="165" y1="112" x2="200" y2="112" stroke="#333333" stroke-width="2" marker-end="url(#arrowTrainEn)"/>
  <!-- Phase 1 -->
  <rect x="205" y="40" width="310" height="280" rx="14" fill="#eef3fa" stroke="#5b7fa6" stroke-width="2.5"/>
  <text x="360" y="65" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="700" fill="#2d4a6b">Phase 1 · Pretraining</text>
  <rect x="225" y="85" width="270" height="55" rx="8" fill="#dce8f5" stroke="#5b7fa6" stroke-width="1.5"/>
  <text x="360" y="110" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="13" fill="#22384f">Predict the next word,</text>
  <text x="360" y="126" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="13" fill="#22384f">over and over</text>
  <line x1="360" y1="140" x2="360" y2="158" stroke="#333333" stroke-width="2" marker-end="url(#arrowTrainEn)"/>
  <rect x="225" y="158" width="270" height="55" rx="8" fill="#dce8f5" stroke="#5b7fa6" stroke-width="1.5"/>
  <text x="360" y="190" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="13" fill="#22384f">Builds a map of language</text>
  <text x="360" y="206" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="13" fill="#22384f">and knowledge</text>
  <line x1="360" y1="213" x2="360" y2="231" stroke="#333333" stroke-width="2" marker-end="url(#arrowTrainEn)"/>
  <rect x="225" y="231" width="270" height="55" rx="8" fill="#3f6690"/>
  <text x="360" y="255" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="700" fill="#ffffff">Base model:</text>
  <text x="360" y="272" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="700" fill="#ffffff">just "completes documents"</text>
  <!-- Connector between phases -->
  <path d="M495,258 L545,258 L545,112 L575,112" fill="none" stroke="#333333" stroke-width="2" marker-end="url(#arrowTrainEn)"/>
  <!-- Phase 2 -->
  <rect x="580" y="40" width="310" height="280" rx="14" fill="#faf3e6" stroke="#c9922f" stroke-width="2.5"/>
  <text x="735" y="65" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="700" fill="#8a5a12">Phase 2 · Fine-tuning</text>
  <rect x="600" y="85" width="270" height="55" rx="8" fill="#f3e6cc" stroke="#c9922f" stroke-width="1.5"/>
  <text x="735" y="110" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="13" fill="#5c3f0d">Follow instructions and give</text>
  <text x="735" y="126" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="13" fill="#5c3f0d">useful, safe responses</text>
  <line x1="735" y1="140" x2="735" y2="158" stroke="#333333" stroke-width="2" marker-end="url(#arrowTrainEn)"/>
  <rect x="600" y="158" width="270" height="55" rx="8" fill="#f3e6cc" stroke="#c9922f" stroke-width="1.5"/>
  <text x="735" y="190" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="13" fill="#5c3f0d">Human feedback +</text>
  <text x="735" y="206" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="13" fill="#5c3f0d">reinforcement learning</text>
  <line x1="735" y1="213" x2="735" y2="231" stroke="#333333" stroke-width="2" marker-end="url(#arrowTrainEn)"/>
  <rect x="600" y="231" width="270" height="55" rx="8" fill="#b8791f"/>
  <text x="735" y="255" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="700" fill="#ffffff">Assistant model:</text>
  <text x="735" y="272" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="700" fill="#ffffff">helpful, honest, and harmless</text>
</svg>

### How an interaction works

When you write to an LLM, you're giving it a **prompt**: text that the model reads and continues based on the patterns it learned during training. The model doesn't look up prearranged answers in a database — it generates new text that statistically follows what you wrote.

There's a practical limit to how much information an LLM can consider at once: the **context window**, something like its working memory. It includes your prompt, the model's responses, and everything else you've shared in the conversation. Even though AI companies keep expanding it, it remains a real limit: the model doesn't have unlimited access to information and can't use content outside that window without specialized tools (like web search).

<svg viewBox="0 0 780 270" xmlns="http://www.w3.org/2000/svg" width="720">
  <rect x="0" y="0" width="780" height="270" rx="12" fill="#ffffff"/>
  <rect x="20" y="60" width="150" height="150" rx="10" fill="none" stroke="#b0b0b0" stroke-width="2" stroke-dasharray="7 5"/>
  <text x="95" y="115" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="#999999">Older messages:</text>
  <text x="95" y="135" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="#999999">dropped</text>
  <text x="95" y="155" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="#999999">first</text>
  <rect x="210" y="30" width="360" height="210" rx="12" fill="#eef3fa" stroke="#5b7fa6" stroke-width="3"/>
  <text x="390" y="60" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="700" fill="#2d4a6b">Context window</text>
  <text x="390" y="80" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="13" fill="#2d4a6b">(working memory)</text>
  <rect x="240" y="100" width="300" height="34" rx="8" fill="#5b7fa6"/>
  <text x="390" y="122" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" fill="#ffffff">Your prompt</text>
  <rect x="240" y="144" width="300" height="34" rx="8" fill="#7595b8"/>
  <text x="390" y="166" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" fill="#ffffff">Model responses</text>
  <rect x="240" y="188" width="300" height="34" rx="8" fill="#93acca"/>
  <text x="390" y="210" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" fill="#ffffff">Rest of the conversation</text>
  <rect x="610" y="60" width="150" height="150" rx="10" fill="none" stroke="#b0b0b0" stroke-width="2" stroke-dasharray="7 5"/>
  <text x="685" y="110" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="#999999">Web, files,</text>
  <text x="685" y="130" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="#999999">external data:</text>
  <text x="685" y="150" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="#999999">only enter with</text>
  <text x="685" y="170" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="#999999">tools</text>
</svg>

## LLM strengths and limits

### What it does well

- **Linguistic versatility**: drafting emails in your voice, condensing lengthy reports, translating, explaining complex topics from any field.
- **In-context learning**: it can go from helping you write poetry to explaining quantum computing, with no additional training — just what you give it in the conversation.
- **Conversational memory**: it keeps the thread of the conversation, remembers what was said before, and builds on it.
- **Use of external tools**: many LLMs can connect to the web, process files, or use other applications, which greatly expands what they can help you do.

### Where it fails — and why

Each limit is explained by how the model works internally:

- **Knowledge cutoff.** The model knows nothing about what happened after its training date. It needs tools like web search to learn about recent events.
- **Hallucinations.** Training doesn't verify every fact, so the model can reproduce inaccuracies or combine what it learned incorrectly, confidently stating something that sounds plausible but is wrong. Unlike a search engine, which retrieves existing documents, an LLM generates text based on statistical patterns — and that's where it can hallucinate.
- **Context window limit.** If a conversation or document exceeds it, the model stops "seeing" what fell outside (usually the oldest content first).
- **Non-determinism.** Unlike traditional software, an LLM doesn't always give the same answer to the same question — it makes probabilistic decisions about what text comes next. This is useful for brainstorming, but you need to account for it when you need consistency or precision. Some interfaces expose this control as "temperature."
- **Complex reasoning.** LLMs have historically struggled with multi-step math or logic problems, though extended-thinking models keep improving significantly here.
- **Access to specific data and tools.** Even though a model can use external tools, if it doesn't have access to a particular data source or tool, it simply can't help you with that — like a brilliant colleague with no access to your company's internal database.

## The 4D framework for AI fluency

Using AI well isn't just about knowing how to write a good prompt. It's a set of habits you train, and it can be summarized in four interconnected competencies: the **4D framework**.

The four competencies are:

- **Delineation**
- **Discernment**
- **Delegation**
- **Diligence**

They're organized into two cycles that coexist at all times: an **internal** one, happening inside each conversation with the AI, and an **external** one, happening around that conversation — in your work, your team, your responsibility.

<svg viewBox="0 0 600 560" xmlns="http://www.w3.org/2000/svg" width="480">
  <defs>
    <marker id="arrow4dEn" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#111111"/>
    </marker>
  </defs>
  <rect x="0" y="0" width="600" height="560" rx="12" fill="#ffffff"/>
  <path d="M115,190 Q160,110 215,65" fill="none" stroke="#111111" stroke-width="2.5" marker-start="url(#arrow4dEn)" marker-end="url(#arrow4dEn)"/>
  <path d="M385,65 Q440,110 485,190" fill="none" stroke="#111111" stroke-width="2.5" marker-start="url(#arrow4dEn)" marker-end="url(#arrow4dEn)"/>
  <path d="M115,260 Q160,340 215,385" fill="none" stroke="#111111" stroke-width="2.5" marker-start="url(#arrow4dEn)" marker-end="url(#arrow4dEn)"/>
  <path d="M485,260 Q440,340 385,385" fill="none" stroke="#111111" stroke-width="2.5" marker-start="url(#arrow4dEn)" marker-end="url(#arrow4dEn)"/>
  <line x1="190" y1="225" x2="410" y2="225" stroke="#111111" stroke-width="2.5" marker-start="url(#arrow4dEn)" marker-end="url(#arrow4dEn)"/>
  <line x1="300" y1="95" x2="300" y2="385" stroke="#111111" stroke-width="2.5" marker-start="url(#arrow4dEn)" marker-end="url(#arrow4dEn)"/>
  <rect x="215" y="20" width="170" height="70" rx="6" fill="#6e8560"/>
  <text x="300" y="61" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="600" fill="#ffffff">Delegation</text>
  <rect x="15" y="190" width="170" height="70" rx="6" fill="#6e8560"/>
  <text x="100" y="231" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="600" fill="#ffffff">Delineation</text>
  <rect x="415" y="190" width="170" height="70" rx="6" fill="#6e8560"/>
  <text x="500" y="231" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="600" fill="#ffffff">Discernment</text>
  <rect x="215" y="390" width="170" height="70" rx="6" fill="#6e8560"/>
  <text x="300" y="431" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="600" fill="#ffffff">Diligence</text>
</svg>

## Internal cycle: Delineation + Discernment

This is the day-to-day mode of interaction: the one you already know, though you're probably not exploiting it fully.

### Delineation

Delineating is communicating effectively with the AI, and it goes well beyond "writing a good prompt." It means defining:

- the outcome you expect,
- the format,
- the target audience,
- the style,
- and the reasoning approach you want the AI to follow.

Asking "summarize this report" isn't the same as asking "summarize this report for a non-technical executive audience, focusing on the three highest-impact findings, in under 300 words."

You can also shape the *role* the AI plays in the interaction:
- do you need a critic who challenges weak arguments?
- a brainstorming partner?
- a fact-checker who flags uncertainty?

You can ask for all of that — and combine it.

**Delineation** is the skill people pick up most naturally: specifying what they want, giving examples, refining the request. It's a good starting point, and it improves with practice.

### Discernment

It's the complement to delineation: critically and thoughtfully evaluating what the AI hands back.

- Are these statistics accurate?
- Does the language reflect how your audience actually talks about this topic?
- Did the AI account for every relevant factor?

Discernment **isn't** accepting or rejecting the output wholesale. It's an iterative process: you delineate, evaluate, adjust the delineation based on that evaluation, and try again — like fine-tuning understanding with a human teammate.

<svg viewBox="0 0 900 280" xmlns="http://www.w3.org/2000/svg" width="820">
  <defs>
    <marker id="arrowLoopEn" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#333333"/>
    </marker>
  </defs>
  <rect x="0" y="0" width="900" height="280" rx="12" fill="#ffffff"/>
  <path d="M780,110 C780,40 120,40 120,110" fill="none" stroke="#999999" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#arrowLoopEn)"/>
  <rect x="20" y="110" width="170" height="70" rx="10" fill="#eef3fa" stroke="#5b7fa6" stroke-width="1.5"/>
  <text x="105" y="150" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700" fill="#2d4a6b">✍️ You delineate</text>
  <line x1="190" y1="145" x2="230" y2="145" stroke="#333333" stroke-width="2" marker-end="url(#arrowLoopEn)"/>
  <rect x="235" y="110" width="170" height="70" rx="10" fill="#eef3fa" stroke="#5b7fa6" stroke-width="1.5"/>
  <text x="320" y="140" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700" fill="#2d4a6b">🤖 The AI</text>
  <text x="320" y="158" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="12" fill="#2d4a6b">responds</text>
  <line x1="405" y1="145" x2="445" y2="145" stroke="#333333" stroke-width="2" marker-end="url(#arrowLoopEn)"/>
  <rect x="450" y="110" width="180" height="70" rx="10" fill="#eef3fa" stroke="#5b7fa6" stroke-width="1.5"/>
  <text x="540" y="140" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700" fill="#2d4a6b">🔍 You evaluate</text>
  <text x="540" y="158" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="12" fill="#2d4a6b">(discernment)</text>
  <line x1="630" y1="145" x2="670" y2="145" stroke="#333333" stroke-width="2" marker-end="url(#arrowLoopEn)"/>
  <rect x="675" y="110" width="180" height="70" rx="10" fill="#eef3fa" stroke="#5b7fa6" stroke-width="1.5"/>
  <text x="765" y="140" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700" fill="#2d4a6b">🔧 You adjust the</text>
  <text x="765" y="158" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="12" fill="#2d4a6b">delineation</text>
  <path d="M540,180 L540,225 L500,225" fill="none" stroke="#333333" stroke-width="2" marker-end="url(#arrowLoopEn)"/>
  <text x="640" y="205" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="11" font-style="italic" fill="#666666">when the result is up to standard</text>
  <rect x="330" y="205" width="150" height="45" rx="22" fill="#4d8a5c"/>
  <text x="405" y="233" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="700" fill="#ffffff">✅ Done</text>
</svg>

While most people already delineate fairly naturally, discernment is **much harder to develop** because it requires a much deeper understanding of the desired outcome. Questioning the AI's reasoning, verifying facts, identifying missing context.
That's exactly where there's the most room to grow, because it's what sustains real collaboration with AI (not blind delegation).

## External cycle: Delegation + Diligence

Using AI well in a single conversation is only part of the problem. The other part is understanding the implications of *how* and *when* you use it in your work, your team, and your context.

### Delegation

Delegating is deciding what work humans do, what work the AI does, and how tasks get split. It requires understanding two things:

1. **The work itself.** Before drafting an email, ask yourself: is this a routine status update, where the AI can put together a first draft? Or is it a delicate negotiation where the tone needs to come from you?
2. **The tools.** If you work with sensitive data, you need to know the privacy and security characteristics of the AI system you're using.

Once you understand the work and the tool well, you can split tasks intelligently, leveraging each side's strengths.

### Diligence

It's the flip side of delegation: taking responsibility for how you use AI.

- Being intentional about which parts the AI handles and which require your own expertise.
- Being honest about the AI's role with the people who need to know — your colleagues and stakeholders deserve to understand when and how it was used.
- Verifying and standing behind every output before sharing it: confirming its accuracy and making sure the final product faithfully represents your goals and standards.

> [!Don't forget]
> You're always responsible for the final result, whether or not you used AI to get there.

Delegation and diligence also run in a cycle: the decisions you make about what to delegate need to be paired with ongoing responsibility for how you use it — and that diligent practice, over time, leads to better delegation decisions.

## The 4 Ds in action

1. **Delegation** — you decide which tasks the AI handles and which you do yourself.
2. **Delineation** — you use detailed descriptions to guide the AI's work.
3. **Discernment** — you critically evaluate the results.
4. **Diligence** — you choose the right tools, you're transparent about the AI's role, and you take responsibility for accuracy.

## The 4D framework applied to building software

### Delegation: the builder's toolkit

If you've spent time coding with AI, you've already noticed this: the hard part isn't getting the AI to write code, it's knowing **what** code you want it to write. Delegating isn't a yes-or-no decision — it's far more granular.

Picture yourself leading a project where the AI is your team. A good leader doesn't just assign tasks — they frame the problem so everyone understands what they're solving, define what a good outcome looks like, and decide which tasks to delegate and which to keep for themselves. That starts well before writing the first line of code.

Every builder has a six-capability toolkit, and the AI doesn't perform equally across all of them:

1. 👀 **Empathy** — what does the person you're building for actually need? Not what they say they want, but what will genuinely serve them. This comes from talking to users and observing, not from the AI.
2. 📝 **Design** — what should we build, and why? Judgment calls (text message or web page? exact times or ranges?). The AI can generate options; the decision is yours.
3. 🏗️ **Architecture** — how is it structured? The AI knows patterns from thousands of similar systems, but it doesn't know your constraints or where your team is headed. This is where human+AI combined works really well.
4. 💻 **Implementation** — writing the code itself. This is where the AI is strongest, as long as you already know what to build and how to structure it. It's the capability most worth delegating.
5. ⚖️ **Judgment** — does it actually work? Is it good? Would you put your name on it? The AI tells you the code runs, not whether you solved the real problem.
6. 🚀 **Deployment** — getting it to real users and learning from what happens: communication, measurement, iteration. The AI can draft release notes, but it doesn't interpret why a user hesitates before clicking.

<svg viewBox="0 0 1020 250" xmlns="http://www.w3.org/2000/svg" width="900">
  <rect x="0" y="0" width="1020" height="250" rx="12" fill="#ffffff"/>
  <!-- 1 · Empathy — human value -->
  <rect x="20" y="15" width="148" height="190" rx="14" fill="#f7e6e2" stroke="#c0654f" stroke-width="1.5"/>
  <circle cx="150" cy="33" r="13" fill="#ffffff" stroke="#c0654f" stroke-width="1.5"/>
  <text x="150" y="38" text-anchor="middle" font-size="14">🧑</text>
  <text x="94" y="82" text-anchor="middle" font-size="42">👀</text>
  <text x="94" y="118" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="700" fill="#8a3b2c">Empathy</text>
  <text x="94" y="140" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="11" font-style="italic" fill="#8a5a4f">what's really</text>
  <text x="94" y="156" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="11" font-style="italic" fill="#8a5a4f">needed?</text>
  <!-- 2 · Design — combined -->
  <rect x="184" y="15" width="148" height="190" rx="14" fill="#eef3fa" stroke="#5b7fa6" stroke-width="1.5"/>
  <circle cx="314" cy="33" r="13" fill="#ffffff" stroke="#5b7fa6" stroke-width="1.5"/>
  <text x="314" y="38" text-anchor="middle" font-size="14">🤝</text>
  <text x="258" y="82" text-anchor="middle" font-size="42">📝</text>
  <text x="258" y="118" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="700" fill="#2d4a6b">Design</text>
  <text x="258" y="140" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="11" font-style="italic" fill="#4d6b8a">what and why</text>
  <text x="258" y="156" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="11" font-style="italic" fill="#4d6b8a">to build?</text>
  <!-- 3 · Architecture — combined -->
  <rect x="348" y="15" width="148" height="190" rx="14" fill="#eef3fa" stroke="#5b7fa6" stroke-width="1.5"/>
  <circle cx="478" cy="33" r="13" fill="#ffffff" stroke="#5b7fa6" stroke-width="1.5"/>
  <text x="478" y="38" text-anchor="middle" font-size="14">🤝</text>
  <text x="422" y="82" text-anchor="middle" font-size="42">🏗️</text>
  <text x="422" y="118" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="700" fill="#2d4a6b">Architecture</text>
  <text x="422" y="140" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="11" font-style="italic" fill="#4d6b8a">how is it</text>
  <text x="422" y="156" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="11" font-style="italic" fill="#4d6b8a">structured?</text>
  <!-- 4 · Implementation — delegable to AI -->
  <rect x="512" y="15" width="148" height="190" rx="14" fill="#e6f0e8" stroke="#4d8a5c" stroke-width="1.5"/>
  <circle cx="642" cy="33" r="13" fill="#ffffff" stroke="#4d8a5c" stroke-width="1.5"/>
  <text x="642" y="38" text-anchor="middle" font-size="14">🤖</text>
  <text x="586" y="82" text-anchor="middle" font-size="42">💻</text>
  <text x="586" y="118" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="700" fill="#2f5c3a">Implementation</text>
  <text x="586" y="140" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="11" font-style="italic" fill="#4d7a5a">writing the</text>
  <text x="586" y="156" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="11" font-style="italic" fill="#4d7a5a">code</text>
  <!-- 5 · Judgment — human value -->
  <rect x="676" y="15" width="148" height="190" rx="14" fill="#f7e6e2" stroke="#c0654f" stroke-width="1.5"/>
  <circle cx="806" cy="33" r="13" fill="#ffffff" stroke="#c0654f" stroke-width="1.5"/>
  <text x="806" y="38" text-anchor="middle" font-size="14">🧑</text>
  <text x="750" y="82" text-anchor="middle" font-size="42">⚖️</text>
  <text x="750" y="118" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="700" fill="#8a3b2c">Judgment</text>
  <text x="750" y="140" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="11" font-style="italic" fill="#8a5a4f">does it work?</text>
  <text x="750" y="156" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="11" font-style="italic" fill="#8a5a4f">is it good?</text>
  <!-- 6 · Deployment — human value -->
  <rect x="840" y="15" width="148" height="190" rx="14" fill="#f7e6e2" stroke="#c0654f" stroke-width="1.5"/>
  <circle cx="970" cy="33" r="13" fill="#ffffff" stroke="#c0654f" stroke-width="1.5"/>
  <text x="970" y="38" text-anchor="middle" font-size="14">🧑</text>
  <text x="914" y="82" text-anchor="middle" font-size="42">🚀</text>
  <text x="914" y="118" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="700" fill="#8a3b2c">Deployment</text>
  <text x="914" y="140" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="11" font-style="italic" fill="#8a5a4f">getting it to</text>
  <text x="914" y="156" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="11" font-style="italic" fill="#8a5a4f">real users</text>
  <!-- Legend -->
  <text x="510" y="235" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="12" fill="#666666">🧑 human value&#160;&#160;&#160;·&#160;&#160;&#160;🤝 human + AI combined&#160;&#160;&#160;·&#160;&#160;&#160;🤖 worth delegating to AI</text>
</svg>

The shape of this list matters: implementation sits in the middle, and that's where the AI is strongest. Empathy, judgment, and deployment sit at the edges, and that's where the AI is weakest — and where the value of human work lives.

<svg viewBox="0 0 760 340" xmlns="http://www.w3.org/2000/svg" width="720">
  <rect x="0" y="0" width="760" height="340" rx="12" fill="#ffffff"/>
  <text x="30" y="35" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="700" fill="#555555">AI strength ↑</text>
  <line x1="50" y1="270" x2="720" y2="270" stroke="#cccccc" stroke-width="1.5"/>
  <path d="M80,240 C120,215 160,185 200,170 C250,150 280,120 320,105 C360,92 400,68 440,68 C480,68 520,140 560,185 C600,215 640,232 680,240"
        fill="none" stroke="#5b7fa6" stroke-width="3.5"/>
  <circle cx="80" cy="240" r="7" fill="#c0654f"/>
  <circle cx="200" cy="170" r="7" fill="#5b7fa6"/>
  <circle cx="320" cy="105" r="7" fill="#5b7fa6"/>
  <circle cx="440" cy="68" r="7" fill="#4d8a5c"/>
  <circle cx="560" cy="185" r="7" fill="#c0654f"/>
  <circle cx="680" cy="240" r="7" fill="#c0654f"/>
  <text x="80" y="295" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="600" fill="#333333">👀 Empathy</text>
  <text x="200" y="295" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="600" fill="#333333">📝 Design</text>
  <text x="320" y="295" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="600" fill="#333333">🏗️ Architecture</text>
  <text x="440" y="295" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="600" fill="#333333">💻 Implementation</text>
  <text x="560" y="295" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="600" fill="#333333">⚖️ Judgment</text>
  <text x="680" y="295" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="600" fill="#333333">🚀 Deployment</text>
  <text x="440" y="45" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="13" font-style="italic" fill="#4d8a5c">worth delegating here</text>
  <text x="120" y="325" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="13" font-style="italic" fill="#c0654f">human value lives here</text>
  <text x="630" y="325" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="13" font-style="italic" fill="#c0654f">human value lives here</text>
</svg>

The builders who stand out aren't the fastest ones — they're the ones who frame the problem well, know what a good outcome looks like before they start, and can tell the difference between code that works and code that matters.

### Delineation: translating what users need

Describing isn't "prompt engineering." It's a higher-level competency that stays relevant even as the tricks for any given model change. You can think of it as a four-step chain, where the builder acts as translator:

1. **User's voice** — what a real person says, with their tone, their emotion, and all the context they don't say out loud. E.g.: *"I want to see wait times before heading to the clinic"* — behind that might be a two-hour wait, a sick kid in the car, indecision between this clinic and the ER across town. It's real raw material, but not yet buildable.
2. **Product requirement** — you take that raw need and turn it into something measurable: *"patients can see the estimated wait time on a mobile-friendly web page, updated every 5 minutes"*. Every word there is a judgment call (mobile-friendly, not an app; estimated, not exact; every 5 minutes, not real-time) based on your own empathy work.
3. **Technical specification** — now buildable: *"a web app that queries the clinic's API and displays wait times with a responsive UI, refreshing every 5 minutes"*. An engineer (or an AI) can start building with that, though it still leaves gaps: which stack? How are errors handled?
4. **AI instruction** — specific, contextualized, with well-defined constraints and edge cases: the stack, the data shape, what to do when there's no data, and the tests it needs to pass.

<svg viewBox="0 0 1020 260" xmlns="http://www.w3.org/2000/svg" width="900">
  <defs>
    <marker id="arrowDescEn" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#333333"/>
    </marker>
  </defs>
  <rect x="0" y="0" width="1020" height="260" rx="12" fill="#ffffff"/>
  <!-- Step 1 · User's voice -->
  <rect x="20" y="20" width="210" height="220" rx="12" fill="#f2f2f2" stroke="#999999" stroke-width="2" stroke-dasharray="7 5"/>
  <circle cx="45" cy="45" r="15" fill="#999999"/>
  <text x="45" y="50" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700" fill="#ffffff">1</text>
  <text x="125" y="50" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700" fill="#444444">User's voice</text>
  <text x="125" y="100" text-anchor="middle" font-size="34">🗣️</text>
  <text x="125" y="140" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="12" font-style="italic" fill="#666666">"I want to see wait</text>
  <text x="125" y="156" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="12" font-style="italic" fill="#666666">times before heading</text>
  <text x="125" y="172" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="12" font-style="italic" fill="#666666">to the clinic"</text>
  <rect x="45" y="198" width="160" height="26" rx="13" fill="none" stroke="#999999" stroke-width="1.5"/>
  <text x="125" y="215" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="11" fill="#666666">real, not buildable</text>
  <line x1="230" y1="130" x2="275" y2="130" stroke="#333333" stroke-width="2" marker-end="url(#arrowDescEn)"/>
  <text x="252" y="118" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic" fill="#777777">translate</text>
  <!-- Step 2 · Product requirement -->
  <rect x="275" y="20" width="210" height="220" rx="12" fill="#dce8f5" stroke="#5b7fa6" stroke-width="2"/>
  <circle cx="300" cy="45" r="15" fill="#5b7fa6"/>
  <text x="300" y="50" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700" fill="#ffffff">2</text>
  <text x="380" y="50" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700" fill="#2d4a6b">Product requirement</text>
  <text x="380" y="100" text-anchor="middle" font-size="34">📋</text>
  <text x="380" y="140" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="12" font-style="italic" fill="#2d4a6b">"estimated time on a</text>
  <text x="380" y="156" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="12" font-style="italic" fill="#2d4a6b">mobile-friendly page,</text>
  <text x="380" y="172" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="12" font-style="italic" fill="#2d4a6b">every 5 minutes"</text>
  <rect x="300" y="198" width="160" height="26" rx="13" fill="#ffffff" stroke="#5b7fa6" stroke-width="1.5"/>
  <text x="380" y="215" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="11" fill="#2d4a6b">measurable, judgment-driven</text>
  <line x1="485" y1="130" x2="530" y2="130" stroke="#333333" stroke-width="2" marker-end="url(#arrowDescEn)"/>
  <text x="507" y="118" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic" fill="#777777">translate</text>
  <!-- Step 3 · Technical specification -->
  <rect x="530" y="20" width="210" height="220" rx="12" fill="#a9c6e8" stroke="#3f6690" stroke-width="2"/>
  <circle cx="555" cy="45" r="15" fill="#3f6690"/>
  <text x="555" y="50" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700" fill="#ffffff">3</text>
  <text x="635" y="50" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700" fill="#1c3350">Technical specification</text>
  <text x="635" y="100" text-anchor="middle" font-size="34">📐</text>
  <text x="635" y="140" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="12" font-style="italic" fill="#1c3350">"queries the API and</text>
  <text x="635" y="156" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="12" font-style="italic" fill="#1c3350">shows times with a</text>
  <text x="635" y="172" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="12" font-style="italic" fill="#1c3350">responsive UI"</text>
  <rect x="555" y="198" width="160" height="26" rx="13" fill="#ffffff" stroke="#3f6690" stroke-width="1.5"/>
  <text x="635" y="215" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="11" fill="#1c3350">buildable, with gaps</text>
  <line x1="740" y1="130" x2="785" y2="130" stroke="#333333" stroke-width="2" marker-end="url(#arrowDescEn)"/>
  <text x="762" y="118" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic" fill="#777777">translate</text>
  <!-- Step 4 · AI instruction -->
  <rect x="785" y="20" width="210" height="220" rx="12" fill="#3f6690" stroke="#22384f" stroke-width="2"/>
  <circle cx="810" cy="45" r="15" fill="#22384f"/>
  <text x="810" y="50" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700" fill="#ffffff">4</text>
  <text x="890" y="50" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="700" fill="#ffffff">AI instruction</text>
  <text x="890" y="100" text-anchor="middle" font-size="34">🤖</text>
  <text x="890" y="140" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="12" fill="#e8eef5">stack, data shape,</text>
  <text x="890" y="156" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="12" fill="#e8eef5">well-defined edge cases,</text>
  <text x="890" y="172" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="12" fill="#e8eef5">tests to pass</text>
  <rect x="810" y="198" width="160" height="26" rx="13" fill="#ffffff" fill-opacity="0.15" stroke="#ffffff" stroke-width="1.5"/>
  <text x="890" y="215" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="11" fill="#ffffff">ready to run</text>
</svg>

The AI can't hear what the user didn't say, or decide that "estimated" is better than "exact" because an exact time would make clinic staff anxious. You know that, and your job is to carry it intact through all four steps.

When the translation breaks down at some step, a specific kind of failure shows up: **code that works, but the product doesn't**. Tests pass, the user is still frustrated. That's not a bug — it's a delineation failure, and it usually happened upstream of the prompt. It's worth diagnosing where the chain broke: did you not understand the user? Did you understand them but define the requirement wrong? Was the requirement fine but the technical spec lost something? Or was everything above fine and you simply gave the AI the wrong instruction?

> [!A detail worth noting]
> Acceptance tests are also delineation — maybe the most powerful form of it, because something that passes or fails can't be misinterpreted. Giving the AI a set of tests along with the prompt doesn't just tell it what to build; it tells it how you'll know it succeeded.

### Discernment: five lenses for evaluating code

A product that works and a good product aren't the same thing. When AI can produce something functional in minutes, telling that difference apart becomes the most valuable skill. There are five lenses — most engineering training stops at the first two:

1. **Functional integrity** — does it actually work? Bugs, failures, vulnerabilities. This is usually where traditional code review ends: necessary, but not sufficient. Key habit: ask the AI to write tests alongside the code, not after — and run those tests, because a test suite that never runs isn't a safety net, it's a false sense of security.
2. **Production readiness** — does it work *well*? Performance, scalability, reliability under load. The AI has blind spots here. It helps to explicitly ask it to stress-test its own code and state what production assumptions it made.
3. **Fit** — is it the right thing? Does it solve the user's actual problem, or the problem they think they have? The patient asked about wait times, but what they really needed to know was whether a pediatrician was available in 20 minutes. The AI solves the *stated* problem — verifying it's the *real* one is on you.
4. **Quality of experience** — is it actually good? Clear, intuitive, accessible? The AI doesn't have taste, it has patterns: it'll give you a competent interface nobody enjoys using. In a clinical context, this isn't just aesthetics — it's patient safety.
5. **Responsible impact** — is it responsible? Bias, privacy, unintended consequences. If the wait-time algorithm is trained on historical data reflecting systemic inequities, it can reproduce that same pattern — and it won't flag it for you, it'll just show a number.

<svg viewBox="0 0 760 400" xmlns="http://www.w3.org/2000/svg" width="720">
  <rect x="0" y="0" width="760" height="400" rx="12" fill="#ffffff"/>
  <rect x="40" y="20" width="600" height="58" rx="10" fill="#8fae87"/>
  <text x="70" y="45" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="700" fill="#ffffff">1 · Functional integrity</text>
  <text x="70" y="66" font-family="Arial, Helvetica, sans-serif" font-size="14" fill="#f2f7f0">Does it actually work? — bugs, failures, vulnerabilities</text>
  <rect x="60" y="90" width="600" height="58" rx="10" fill="#7d9c8a"/>
  <text x="90" y="115" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="700" fill="#ffffff">2 · Production readiness</text>
  <text x="90" y="136" font-family="Arial, Helvetica, sans-serif" font-size="14" fill="#f2f7f0">Does it work well? — performance, scalability, load</text>
  <rect x="80" y="160" width="600" height="58" rx="10" fill="#6b8a92"/>
  <text x="110" y="185" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="700" fill="#ffffff">3 · Fit</text>
  <text x="110" y="206" font-family="Arial, Helvetica, sans-serif" font-size="14" fill="#f2f7f0">Is it the right thing? — does it solve the user's real problem?</text>
  <rect x="100" y="230" width="600" height="58" rx="10" fill="#5d7899"/>
  <text x="130" y="255" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="700" fill="#ffffff">4 · Quality of experience</text>
  <text x="130" y="276" font-family="Arial, Helvetica, sans-serif" font-size="14" fill="#f2f7f0">Is it actually good? — clear, intuitive, accessible</text>
  <rect x="120" y="300" width="600" height="58" rx="10" fill="#50659f"/>
  <text x="150" y="325" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="700" fill="#ffffff">5 · Responsible impact</text>
  <text x="150" y="346" font-family="Arial, Helvetica, sans-serif" font-size="14" fill="#f2f7f0">Is it responsible? — bias, privacy, consequences</text>
  <text x="40" y="385" font-family="Arial, Helvetica, sans-serif" font-size="13" font-style="italic" fill="#888888">↑ Traditional code review stops at lens 1–2. Lenses 3–5 are where the big problems show up.</text>
</svg>

The biggest problems almost never show up at lens one. AI is good at generating code that runs; it needs your oversight to produce something that actually matters. And there's a useful signal about your own process: when something isn't good enough, do you fix it yourself, or step back and delineate better what you needed? That pattern tells you whether you're developing discernment or just building.

### Diligence: owning what you share

With AI, you can end up owning code you didn't write. Diligence means catching up with that code, understanding it, putting it to the test, and catching the errors that slip through.

#### Three habits of a good engineer:

- **Recreate the "what didn't I think of?" step.** When you code it yourself, you notice edge cases and decisions along the way that you hadn't anticipated. With AI, those decisions sometimes get made without you noticing — so ask explicitly: *"can you verify users can't see other users' files?"*
- **Ask what assumptions and trade-offs it made.** After the AI builds something substantial: *"what assumptions did you make? what security risks should I be aware of?"*.
- **Disclose AI use as information, not as a disclaimer.** If the AI wrote most of a PR, say so in the description — because it makes mistakes differently than humans do (confidently using deprecated APIs, code that's clean locally but inconsistent with the rest of the codebase, invented behavior for cases you never specified). A reviewer who knows that can adjust their review accordingly.

==Pre-AI engineering best practices still hold== — maybe more than ever, because you now ship faster and understand a smaller fraction of what you shipped. Solid tests, observability (logs, error tracking, dashboards), and feature flags haven't gone away: they're what lets you move fast safely.

### Putting the 4 Ds together

1. **Delegate first.** Before opening the editor, break down the problem. Implementation, scaffolding, templates, first drafts: solid candidates for the AI. Judgment calls, understanding the real user, and deciding whether what's built is the right thing: that's yours.
2. **Delineate carefully.** It's not just "what to code" — it's the user's voice, the product requirement, the technical spec, the instruction, and the tests. A well-delineated task, with clear acceptance criteria, treats the AI like a competent junior collaborator with precise instructions.
3. **Apply discernment as you work.** Does it work? Does it work well? Is it the right thing? Is it responsible? Sometimes the AI builds exactly what you described, but not what solves the problem.
4. **Practice diligence before shipping.** Prototype freely — that's how you learn — but ship selectively. Before something reaches real users: do you understand what it does? Can you explain it? Is there a way to know if it works? And you have to be willing to stop something of your own when the evidence says it doesn't work — sunk cost is one of the hardest things to let go of, but a developer's job is to serve the user, not to defend the software.

The four Ds aren't a linear checklist: they're dynamic. You'll move from delegation to delineation, from there to discernment, and end up delegating differently next time. That's AI fluency developing in practice.

## Why it matters

The point of the framework isn't "learning to use AI" as an end in itself. It's freeing up time and headspace for the work that actually matters: the kind that requires human judgment, creativity, and deep contextual knowledge. AI doesn't replace that — you protect it by developing these four competencies.

---

**Sources:** Anthropic (Anthropic Academy) — *"What is generative AI"*, *"The 4D Framework for AI Fluency"*, *"Delegation & the builder's toolkit"*, *"Describing what users need"*, *"Discernment for code"*, *"Diligence & sharing your work"*, and *"Looking forward"*.
