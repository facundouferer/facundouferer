---
course: 'java'
slug: '12-tad-pilas-y-colas'
title: 'The Stack and Queue ADTs: Linear Structures'
description: 'Master LIFO and FIFO structures, implement them from scratch over nodes and arrays, understand the circular queue, and solve the classic balanced-brackets problem.'
order: 14
lang: 'en'
published: true
---

# The Stack and Queue ADTs: Linear Structures

In the previous lesson you built a list that does everything: insert anywhere, delete anywhere, read anywhere.

Now we are going to do the opposite: **take powers away**. A stack and a queue are lists that we forbid from doing almost anything. You may only touch one end.

And that restriction, which sounds like a limitation, is exactly what makes them valuable, for two reasons:

1. **They express intent.** If a method takes a `Stack`, you already know order matters and only the tip is touched. A generic `List` tells you nothing.
2. **They guarantee speed.** Since you only operate at the ends, every operation is **O(1)**. Always. No exceptions, no odd cases.

---

## 1. The Stack (LIFO): last in, first out

Think of a stack of plates: you add on top and take from the top. To reach the bottom one you must remove everything above it.

<figure class="diagram">
<svg viewBox="0 0 720 300" role="img" aria-labelledby="d-stack-t">
<title id="d-stack-t">Structure of a LIFO stack with push and pop acting on the top</title>
<defs><marker id="ar-p" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker><marker id="ar-p2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-2-700)"/></marker></defs>
<text x="0" y="20" font-size="13" font-weight="700" fill="var(--color-accent-700)">Stack (LIFO) — everything goes through the same end: the top</text>
<line x1="255" y1="52" x2="255" y2="256" stroke="var(--color-neutral-600)" stroke-width="3"/>
<line x1="465" y1="52" x2="465" y2="256" stroke="var(--color-neutral-600)" stroke-width="3"/>
<line x1="255" y1="256" x2="465" y2="256" stroke="var(--color-neutral-600)" stroke-width="3"/>
<rect x="263" y="196" width="194" height="52" rx="10" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="360" y="228" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">A</text>
<text x="482" y="227" font-size="11" fill="var(--color-neutral-600)">the first one in</text>
<rect x="263" y="140" width="194" height="52" rx="10" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="360" y="172" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">B</text>
<rect x="263" y="84" width="194" height="52" rx="10" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="360" y="116" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">C</text>
<text x="482" y="107" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">TOP — the only</text>
<text x="482" y="123" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">reachable one</text>
<path d="M120 46 L200 46 L200 92 L257 92" fill="none" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-p)"/>
<text x="0" y="50" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">push(D)</text>
<text x="0" y="68" font-size="11" fill="var(--color-neutral-700)">enters from the top</text>
<path d="M463 76 L520 76 L520 46 L640 46" fill="none" stroke="var(--color-accent-2-700)" stroke-width="2" marker-end="url(#ar-p2)"/>
<text x="596" y="80" font-size="12.5" font-weight="700" fill="var(--color-accent-2-700)">pop() → C</text>
<text x="596" y="98" font-size="11" fill="var(--color-neutral-700)">leaves from the top</text>
<text x="0" y="284" font-size="12" fill="var(--color-neutral-800)">To reach A you must pop C and then B. There is no way to access the middle of a stack.</text>
</svg>
<figcaption>All three operations — <code>push</code>, <code>pop</code>, and <code>peek</code> — act on the same point. Nothing else is allowed.</figcaption>
</figure>

There are only four operations:

| Operation | What it does |
| --- | --- |
| `push(item)` | Puts a new element on the top. |
| `pop()` | Removes and returns the top element. |
| `peek()` | Looks at the top **without removing it**. |
| `isEmpty()` | Says whether anything is left. |

### Implementation over nodes

Here is where the previous lesson pays off: a stack is exactly a linked list where you **only use `addFirst` and `removeFirst`**. The two O(1) operations of a linked list.

```java
public class Stack<T> {
    private Node<T> top;      // it is the "head" from the previous lesson, renamed
    private int size;

    public void push(T data) {
        Node<T> fresh = new Node<>(data);
        fresh.next = top;      // the same reference dance as always
        top = fresh;
        size++;
    }

    public T pop() {
        if (isEmpty()) {
            throw new NoSuchElementException("The stack is empty");
        }
        T data = top.data;
        top = top.next;        // the old node has no references left: the GC takes it
        size--;
        return data;
    }

    public T peek() {
        if (isEmpty()) {
            throw new NoSuchElementException("The stack is empty");
        }
        return top.data;       // looks, does not touch
    }

    public boolean isEmpty() { return top == null; }
    public int size() { return size; }
}
```

Notice there is **not a single loop**. No operation walks anything. That is why they are all O(1).

> Throwing an exception on `pop()` over an empty stack is the right call: popping an empty stack is a programmer usage error, not an expected condition. It is a `RuntimeException`, exactly as we discussed in lesson 11.

---

## 2. The Queue (FIFO): first in, first out

A bank line. You enter at the back, you are served at the front, and nobody cuts.

<figure class="diagram">
<svg viewBox="0 0 720 250" role="img" aria-labelledby="d-queue-t">
<title id="d-queue-t">Structure of a FIFO queue with entry at the back and exit at the front</title>
<defs><marker id="ar-c" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker><marker id="ar-c2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-2-700)"/></marker></defs>
<text x="0" y="20" font-size="13" font-weight="700" fill="var(--color-accent-700)">Queue (FIFO) — you enter through one end and leave through the other</text>
<line x1="160" y1="56" x2="560" y2="56" stroke="var(--color-neutral-600)" stroke-width="3"/>
<line x1="160" y1="140" x2="560" y2="140" stroke="var(--color-neutral-600)" stroke-width="3"/>
<rect x="170" y="66" width="118" height="64" rx="10" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="229" y="104" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">A</text>
<rect x="298" y="66" width="118" height="64" rx="10" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="357" y="104" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">B</text>
<rect x="426" y="66" width="118" height="64" rx="10" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="485" y="104" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">C</text>
<text x="229" y="160" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-700)">FRONT</text>
<text x="229" y="176" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">the one leaving</text>
<text x="485" y="160" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">BACK</text>
<text x="485" y="176" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">the last one in</text>
<line x1="156" y1="98" x2="76" y2="98" stroke="var(--color-accent-2-700)" stroke-width="2" marker-end="url(#ar-c2)"/>
<text x="0" y="94" font-size="12.5" font-weight="700" fill="var(--color-accent-2-700)">dequeue()</text>
<text x="0" y="112" font-size="11" fill="var(--color-neutral-700)">returns A</text>
<line x1="644" y1="98" x2="566" y2="98" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-c)"/>
<text x="640" y="94" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">enqueue(D)</text>
<text x="640" y="112" font-size="11" fill="var(--color-neutral-700)">joins the back</text>
<text x="0" y="216" font-size="12" fill="var(--color-neutral-800)">Unlike the stack, the queue needs TWO references: one to the front and one to the back. With only one, one of the</text>
<text x="0" y="234" font-size="12" fill="var(--color-neutral-800)">two operations would have to walk the whole structure and would stop being O(1).</text>
</svg>
<figcaption>A queue is fairness by arrival order. Its implementation needs two pointers; a stack gets by with one.</figcaption>
</figure>

```java
public class Queue<T> {
    private Node<T> front;   // exit here
    private Node<T> back;    // entry here
    private int size;

    public void enqueue(T data) {
        Node<T> fresh = new Node<>(data);
        if (isEmpty()) {
            front = fresh;
            back = fresh;         // with one element, both point at the same node
        } else {
            back.next = fresh;    // hook it onto the end
            back = fresh;         // and move the back pointer
        }
        size++;
    }

    public T dequeue() {
        if (isEmpty()) {
            throw new NoSuchElementException("The queue is empty");
        }
        T data = front.data;
        front = front.next;
        if (front == null) {
            back = null;          // ← the case almost everyone forgets
        }
        size--;
        return data;
    }

    public T peek() {
        if (isEmpty()) throw new NoSuchElementException("The queue is empty");
        return front.data;
    }

    public boolean isEmpty() { return front == null; }
}
```

That `if (front == null) back = null;` is **the classic bug** of this structure. If you remove the last element and do not clear `back`, it keeps pointing at a node that no longer belongs to the queue. The next `enqueue` hooks onto it and the data lands in a phantom place. It compiles, it runs, and it gives wrong answers.

---

## 3. The circular queue: why the `%` operator exists

If you implement the queue over an **array** instead of nodes, a non-obvious problem shows up.

<figure class="diagram">
<svg viewBox="0 0 720 300" role="img" aria-labelledby="d-circ-t">
<title id="d-circ-t">A linear array queue wasting space compared to a circular queue that reuses it</title>
<text x="0" y="20" font-size="12.5" font-weight="700" fill="var(--color-neutral-800)">Linear queue over an array — after three dequeues</text>
<rect x="0" y="32" width="114" height="52" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)" stroke-dasharray="5 4"/>
<rect x="120" y="32" width="114" height="52" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)" stroke-dasharray="5 4"/>
<rect x="240" y="32" width="114" height="52" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)" stroke-dasharray="5 4"/>
<rect x="360" y="32" width="114" height="52" rx="10" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="417" y="64" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">C</text>
<rect x="480" y="32" width="114" height="52" rx="10" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="537" y="64" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">D</text>
<rect x="600" y="32" width="114" height="52" rx="10" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="657" y="64" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">E</text>
<text x="417" y="102" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-700)">↑ front = 3</text>
<text x="657" y="102" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">back hit the end ↑</text>
<text x="0" y="128" font-size="11.5" fill="var(--color-neutral-800)">Three slots are free, yet the queue reports itself full: the back cannot advance. Half the array is wasted, and the</text>
<text x="0" y="146" font-size="11.5" fill="var(--color-neutral-800)">only way out would be shifting every element left on each dequeue. That is O(n).</text>
<text x="0" y="186" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">Circular queue — the index wraps around with the modulo</text>
<rect x="0" y="198" width="114" height="52" rx="10" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="57" y="230" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">F</text>
<rect x="120" y="198" width="114" height="52" rx="10" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="177" y="230" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">G</text>
<rect x="240" y="198" width="114" height="52" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)" stroke-dasharray="5 4"/>
<rect x="360" y="198" width="114" height="52" rx="10" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="417" y="230" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">C</text>
<rect x="480" y="198" width="114" height="52" rx="10" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="537" y="230" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">D</text>
<rect x="600" y="198" width="114" height="52" rx="10" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="657" y="230" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">E</text>
<text x="417" y="268" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-700)">↑ front = 3</text>
<text x="177" y="268" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">↑ back = 1, it wrapped</text>
<text x="0" y="294" font-size="12" font-weight="700" fill="var(--color-accent-700)">back = (back + 1) % capacity   →   past the end it returns to 0 and reuses the gaps.</text>
</svg>
<figcaption>The modulo operator turns a linear array into a ring. It is the trick that stops an array-backed queue from wasting memory.</figcaption>
</figure>

```java
public class CircularQueue<T> {
    private final Object[] items;
    private int front = 0;
    private int count = 0;
    private final int capacity;

    public CircularQueue(int capacity) {
        this.capacity = capacity;
        this.items = new Object[capacity];
    }

    public void enqueue(T item) {
        if (count == capacity) {
            throw new IllegalStateException("The queue is full");
        }
        int back = (front + count) % capacity;   // ← the modulo does the magic
        items[back] = item;
        count++;
    }

    @SuppressWarnings("unchecked")
    public T dequeue() {
        if (count == 0) {
            throw new NoSuchElementException("The queue is empty");
        }
        T item = (T) items[front];
        items[front] = null;                  // release the reference for the GC
        front = (front + 1) % capacity;       // ← and here too
        count--;
        return item;
    }
}
```

This pattern — a fixed-size array with two wrapping indices — is called a **circular buffer**, and it is everywhere: audio drivers, network buffers, logging systems. When you meet it in the wild, you will know exactly what it is.

---

## 4. Where they are actually used

**Stacks:**

- **The JVM call stack.** Every method call pushes a stack frame; every `return` pops it. The `StackOverflowError` from infinite recursion is literally this stack overflowing. And the stack trace from lesson 11 is that stack, printed.
- **Undo (Ctrl+Z).** Every action is pushed; undoing is a `pop`.
- **The browser back button.**
- **Expression evaluation and syntax checking**, which is this lesson's exercise.

**Queues:**

- **Print queues**, task queues, message queues.
- **BFS traversal of graphs and trees**, which you will see in lessons 16 and 17.
- **Producer-consumer** between threads: one thread enqueues work, another dequeues it. That is the basis of the `ExecutorService` in lesson 19.
- **Order processing** in any system where arrival order is the rule.

---

## 5. How it is actually done in Java

Do not implement this in production. Java already ships it, and ships it well:

```java
import java.util.ArrayDeque;
import java.util.Deque;

// STACK
Deque<String> stack = new ArrayDeque<>();
stack.push("A");
stack.push("B");
System.out.println(stack.pop());    // B
System.out.println(stack.peek());   // A (without removing it)

// QUEUE
Deque<String> queue = new ArrayDeque<>();
queue.offer("A");                   // enqueue
queue.offer("B");
System.out.println(queue.poll());   // A — dequeue
```

A `Deque` ("double ended queue") lets you operate on both ends, so it serves as both stack and queue. `ArrayDeque` is the recommended implementation for both: internally it uses exactly the circular buffer you just saw.

> **Do not use Java's `Stack` class.** It dates from 1996, extends `Vector`, is needlessly synchronized on every operation — which makes it slow — and, worst of all, iterates bottom to top, the opposite of how a stack works. Java's own documentation recommends `ArrayDeque` instead.

There are also `offer`/`poll` as alternatives to `add`/`remove`: the former return `null` or `false` when the operation cannot be done, the latter throw. Pick based on whether the case is expected or an error.

---

## 6. The classic: is the expression balanced?

This problem is the "hello world" of stacks, and it turns up in job interviews with suspicious frequency. The idea is to verify that every `(`, `[`, and `{` has its matching closer, **in the right order**.

<figure class="diagram">
<svg viewBox="0 0 720 320" role="img" aria-labelledby="d-bal-t">
<title id="d-bal-t">Step-by-step trace of the balance check using a stack</title>
<text x="0" y="20" font-size="13" font-weight="700" fill="var(--color-accent-700)">Trace of { a + [ b * ( c ) ] }</text>
<rect x="0" y="30" width="130" height="34" rx="10" fill="var(--color-accent-200)" stroke="var(--color-accent)"/>
<text x="65" y="52" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">character</text>
<rect x="136" y="30" width="300" height="34" rx="10" fill="var(--color-accent-200)" stroke="var(--color-accent)"/>
<text x="286" y="52" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">action</text>
<rect x="442" y="30" width="278" height="34" rx="10" fill="var(--color-accent-200)" stroke="var(--color-accent)"/>
<text x="581" y="52" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">stack (top on the right)</text>
<text x="65" y="90" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">{</text>
<text x="152" y="90" font-size="11.5" fill="var(--color-neutral-800)">an opener → push</text>
<text x="458" y="90" font-size="12" font-weight="700" fill="var(--color-accent-700)">{</text>
<line x1="0" y1="100" x2="720" y2="100" stroke="var(--color-divider)"/>
<text x="65" y="124" font-size="13" text-anchor="middle" fill="var(--color-neutral-600)">a  +</text>
<text x="152" y="124" font-size="11.5" fill="var(--color-neutral-600)">not a bracket → ignored</text>
<text x="458" y="124" font-size="12" font-weight="700" fill="var(--color-accent-700)">{</text>
<line x1="0" y1="134" x2="720" y2="134" stroke="var(--color-divider)"/>
<text x="65" y="158" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">[</text>
<text x="152" y="158" font-size="11.5" fill="var(--color-neutral-800)">an opener → push</text>
<text x="458" y="158" font-size="12" font-weight="700" fill="var(--color-accent-700)">{  [</text>
<line x1="0" y1="168" x2="720" y2="168" stroke="var(--color-divider)"/>
<text x="65" y="192" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">(</text>
<text x="152" y="192" font-size="11.5" fill="var(--color-neutral-800)">an opener → push</text>
<text x="458" y="192" font-size="12" font-weight="700" fill="var(--color-accent-700)">{  [  (</text>
<line x1="0" y1="202" x2="720" y2="202" stroke="var(--color-divider)"/>
<text x="65" y="226" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">)</text>
<text x="152" y="226" font-size="11.5" fill="var(--color-neutral-800)">a closer → pop gives ( ✓ matches</text>
<text x="458" y="226" font-size="12" font-weight="700" fill="var(--color-accent-700)">{  [</text>
<line x1="0" y1="236" x2="720" y2="236" stroke="var(--color-divider)"/>
<text x="65" y="260" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">]</text>
<text x="152" y="260" font-size="11.5" fill="var(--color-neutral-800)">a closer → pop gives [ ✓ matches</text>
<text x="458" y="260" font-size="12" font-weight="700" fill="var(--color-accent-700)">{</text>
<line x1="0" y1="270" x2="720" y2="270" stroke="var(--color-divider)"/>
<text x="65" y="294" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">}</text>
<text x="152" y="294" font-size="11.5" fill="var(--color-neutral-800)">a closer → pop gives { ✓ matches</text>
<text x="458" y="294" font-size="12" font-weight="700" fill="var(--color-accent-2-700)">(empty) → BALANCED ✓</text>
<text x="0" y="316" font-size="11.5" fill="var(--color-neutral-700)">If the stack is not empty at the end, an opener was never closed. If a pop does not match, things closed out of order.</text>
</svg>
<figcaption>The stack remembers exactly what is left to close and in what order. No other structure answers that so directly.</figcaption>
</figure>

The conceptual key: **the last symbol you opened is the first one you must close**. That sentence is, word for word, the definition of LIFO. Which is why the problem and the structure fit so perfectly.

---

## 7. Common mistakes

| Mistake | What happens | How to fix it |
| --- | --- | --- |
| Not setting `back = null` when the queue empties | `back` points at an orphaned node; the next `enqueue` writes into the void. | In `dequeue`, if `front` became `null`, clear `back` too. |
| `pop()` or `peek()` without checking for empty | `NullPointerException` instead of a message anyone can read. | Validate and throw `NoSuchElementException` with clear text. |
| Confusing `pop()` with `peek()` | An element you only wanted to inspect gets consumed, and the bug shows up much later. | `peek` looks, `pop` removes. |
| Array-backed queue without the modulo | It reports itself "full" with half the array free. | `(index + 1) % capacity`. |
| Using `java.util.Stack` | Needless synchronization and iteration backwards from how a stack works. | `ArrayDeque` as a `Deque`. |
| Forgetting `items[front] = null` in the circular queue | The array keeps references to dequeued objects and the GC cannot free them. | Clear the cell on dequeue. |
| Using a stack where arrival order matters | The most recent arrival gets served first. | If arrival order rules, it is a queue. |

---

## 8. Guided hands-on exercise

### Challenge: `isBalanced(String expression)`

Write a method returning `true` when every opening symbol `(`, `[`, `{` has its matching closer in the correct order.

Cases it must get right:

| Input | Result | Why |
| --- | --- | --- |
| `{ a + [ b * ( c ) ] }` | `true` | Everything closes in order |
| `( ( a )` | `false` | One `(` is never closed |
| `( a ] )` | `false` | Closed with the wrong symbol |
| `) a (` | `false` | Closes something never opened |
| `""` (empty) | `true` | Nothing is unbalanced |

<details>
<summary>See suggested solution</summary>

```java
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;

public class BalanceChecker {

    // Each closer maps to its matching opener
    private static final Map<Character, Character> PAIRS = Map.of(
        ')', '(',
        ']', '[',
        '}', '{'
    );

    public static boolean isBalanced(String expression) {
        if (expression == null) {
            return false;
        }

        Deque<Character> stack = new ArrayDeque<>();

        for (char c : expression.toCharArray()) {

            if (PAIRS.containsValue(c)) {
                // An opener: note it down and move on
                stack.push(c);

            } else if (PAIRS.containsKey(c)) {
                // A closer. Two ways to fail here:

                // 1) Nothing is open: closing something never opened
                if (stack.isEmpty()) {
                    return false;
                }

                // 2) The most recent opener is not of the same kind
                if (stack.pop() != PAIRS.get(c)) {
                    return false;
                }
            }
            // Any other character takes no part: ignored
        }

        // Third way to fail: openers left dangling.
        // If the stack is empty, everything closed correctly.
        return stack.isEmpty();
    }

    public static void main(String[] args) {
        String[] cases = {
            "{ a + [ b * ( c ) ] }",   // true
            "( ( a )",                 // false: missing a closer
            "( a ] )",                 // false: crossed closing
            ") a (",                   // false: closes without opening
            "",                        // true: nothing to unbalance
            "no symbols here"          // true
        };

        for (String c : cases) {
            System.out.printf("%-24s → %s%n", "\"" + c + "\"", isBalanced(c));
        }
    }
}
```

**What matters in this exercise are the three ways to fail**, each detected at a different moment:

1. **During the walk, with an empty stack**: a closer appeared with no prior opener. Case `) a (`.
2. **During the walk, with a `pop()` that does not match**: things closed in the wrong order. Case `( a ] )`.
3. **At the end, with a non-empty stack**: openers were left dangling. Case `( ( a )`.

If your solution only covers the third, the `) a (` case will return `true` and you will not understand why. That is exactly the point of the exercise.

Notice too that the stack **never holds more than it needs**: every resolved opener is popped immediately. In a well-balanced thousand-character expression, the stack never exceeds the real nesting depth.

</details>

---

## Key takeaways

- Stack and queue are lists **with restricted powers**, and that restriction is the feature, not the shortcoming.
- Because only one end is touched, **every operation is O(1)**. No loops, no traversals.
- The **stack** needs one pointer (`top`); the **queue** needs two (`front` and `back`).
- When dequeuing the last element you must clear `back` as well. It is the queue's most common bug.
- The `%` operator turns an array into a ring: that is a **circular queue**, found in drivers, network buffers, and logging systems.
- `pop`/`dequeue` on an empty structure is a usage error: throw `NoSuchElementException`.
- In real Java use **`ArrayDeque`** as a `Deque`, never the old `Stack` class.
- "The last thing I opened is the first thing I must close" is LIFO stated in words. Which is why a stack solves balance checking.
</content>
