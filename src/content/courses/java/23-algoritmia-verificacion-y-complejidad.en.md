---
course: 'java'
slug: '23-algoritmia-verificacion-y-complejidad'
title: 'Algorithms: Specification, Verification, and Complexity'
description: 'Learn to design, verify, and compare algorithms through contracts, tests, and time and space complexity analysis.'
order: 6
lang: 'en'
published: true
---

# Algorithms: Specification, Verification, and Complexity

Programming does not begin when you write Java. You must first understand the problem, define what solving it means, and choose a procedure that terminates with a correct answer. That finite, ordered procedure is an **algorithm**.

This lesson covers the complete cycle: specify, design, verify, implement, test, and analyze. The goal is not to memorize formulas, but to justify two different questions:

1. **Does the algorithm produce the correct result?**
2. **Does it use reasonable time and memory as the input grows?**

---

## 1. From an ambiguous problem to a verifiable specification

A **specification** describes the expected behavior without imposing an implementation yet. It is useful to write it as a contract:

| Part | Question | Example: find the maximum |
| :--- | :--- | :--- |
| Inputs | What data does it receive? | An array of integers. |
| Preconditions | What must be true before execution? | The array cannot be `null` or empty. |
| Output | What does it return? | An integer present in the array. |
| Postcondition | What must be true afterward? | No element is greater than the returned value. |
| Errors | How does invalid input fail? | It prints an error message and returns a documented sentinel value (`Integer.MIN_VALUE`). |

A phrase such as “find a large number” cannot be verified. The postcondition above, however, lets us build tests and review the algorithm.

```java
static int maximum(int[] values) {
    if (values == null || values.length == 0) {
        System.out.println("Error: values must contain at least one element.");
        return Integer.MIN_VALUE; // documented sentinel value
    }

    int currentMaximum = values[0];
    for (int i = 1; i < values.length; i++) {
        if (values[i] > currentMaximum) {
            currentMaximum = values[i];
        }
    }
    return currentMaximum;
}
```

Validation is part of the contract, not an optional detail. Using `0` as a default answer for an empty array would be unsafe: `0` could look like a valid result even though it never appeared in the input. Since no integer here works as a genuine neutral value either, `maximum` leaves an explicit trace of the error on the console and returns `Integer.MIN_VALUE` as a documented sentinel value, instead of returning a silent result. Later, in the [exception handling and robustness](/en/courses/java/10-excepciones-y-manejo-de-errores) lesson, you will meet a tool built exactly for this case, one that does not depend on picking a sentinel.

---

## 2. Algorithm development phases

A disciplined process prevents patching code that solves the wrong problem:

1. **Understand the problem:** identify the goal, available data, and boundary cases.
2. **Specify the contract:** state inputs, outputs, preconditions, postconditions, and errors.
3. **Design alternatives:** express steps in plain language, pseudocode, or diagrams before coupling them to Java.
4. **Argue correctness:** explain why every step preserves the conditions needed to reach the result.
5. **Analyze efficiency:** estimate time and memory as a function of input size `n`.
6. **Implement:** translate the design with clear names, validation, and explicit failure handling.
7. **Test and debug:** check normal, boundary, and invalid cases.
8. **Measure and improve:** optimize only with evidence while preserving correctness tests.

These phases can feed back into each other. If a test reveals that the specification does not define what happens with duplicates, fix the contract before changing the code.

---

## 3. Verification, testing, and correctness

**Verification** asks whether the design satisfies its specification. Tests provide evidence through concrete examples, but they do not prove by themselves that every possible case works.

A minimal strategy for `maximum` includes:

```java
assertEquals(9, maximum(new int[] { 4, 9, 2 })); // normal case
assertEquals(-3, maximum(new int[] { -8, -3, -10 })); // avoids a false initial value of 0
assertEquals(7, maximum(new int[] { 7 })); // smallest valid boundary
assertEquals(Integer.MIN_VALUE, maximum(new int[] {})); // empty array: documented sentinel value
assertEquals(Integer.MIN_VALUE, maximum(null)); // null input: documented sentinel value
```

We can also reason with a **loop invariant**: before every iteration, `currentMaximum` is the maximum of the portion already visited. The comparison incorporates the next element without breaking that property. At termination, the visited portion is the whole array, so the postcondition holds.

### Correctness is not efficiency

An algorithm can be correct and still be too slow. This method correctly detects duplicates:

```java
static boolean hasDuplicatesSlow(int[] values) {
    if (values == null) {
        System.out.println("Error: values cannot be null.");
        return false; // documented sentinel value: no data means nothing to report
    }
    for (int i = 0; i < values.length; i++) {
        for (int j = i + 1; j < values.length; j++) {
            if (values[i] == values[j]) {
                return true;
            }
        }
    }
    return false;
}
```

Its result is correct, but it compares pairs through two loops. For large inputs, a `HashSet<Integer>` solution usually reduces time in exchange for additional memory. **Optimization means choosing a tradeoff**, not claiming that one version is universally better.

---

## 4. Time and space complexity

**Time complexity** describes how the number of operations grows. **Space complexity** describes how the additional memory used by an algorithm grows; it does not necessarily include the original input.

Measuring milliseconds is useful for a real execution, but it depends on hardware, the JVM, JIT warmup, and the data. Asymptotic analysis lets us compare trends independently of those conditions.

### Asymptotic notation and Big O

**Big O** notation expresses a growth bound as `n` becomes large. It ignores constants and lower-order terms to focus on the dominant factor.

| Complexity | Typical growth | Example |
| :--- | :--- | :--- |
| `O(1)` | Constant | Read `values[0]` by index. |
| `O(log n)` | Logarithmic | Binary search in a sorted array. |
| `O(n)` | Linear | Traverse an array to find its maximum. |
| `O(n log n)` | Linearithmic | Efficient sorting such as `Arrays.sort` for objects under ordinary comparisons. |
| `O(n²)` | Quadratic | Compare every element with every later element. |

`3n + 20` is classified as `O(n)`: as `n` grows, the linear term dominates. Two algorithms with the same Big O can still behave differently because of constants, memory access, or data distribution. Big O is a scalability guide, not a stopwatch.

### Best, average, and worst cases

A linear search might find the value in the first position (`O(1)` in the best case) or inspect the entire array (`O(n)` in the worst case). Unless stated otherwise, the worst case is often reported because it provides a predictable bound.

---

## 5. Practical example: safe binary search

Binary search discards half of the search space at each iteration, so its iterative form uses `O(log n)` time and `O(1)` additional space. Its critical precondition is that the array is sorted.

```java
static int binarySearch(int[] sorted, int target) {
    if (sorted == null) {
        System.out.println("Error: sorted cannot be null.");
        return -1; // reuses the same documented sentinel as "not found"
    }

    int left = 0;
    int right = sorted.length - 1;

    while (left <= right) {
        int middle = left + (right - left) / 2;
        int value = sorted[middle];

        if (value == target) {
            return middle;
        }
        if (value < target) {
            left = middle + 1;
        } else {
            right = middle - 1;
        }
    }
    return -1; // documented sentinel: the target is absent
}
```

The midpoint calculation avoids the possible overflow of `(left + right) / 2`. Returning `-1` is safe because no valid index is negative and the contract documents that value. Another API might prefer `OptionalInt`; the important point is not to hide absence.

### Essential tests

- Empty array: returns `-1` without reading an invalid position.
- Target at the beginning, end, and middle.
- Missing target.
- Negative and repeated values, stating which match is accepted.
- `null` input: prints an error message and returns `-1`.
- Unsorted array: the caller violates the precondition; a public API could validate it at `O(n)` cost or expose a method that safely sorts a copy.

---

## 6. Comparing alternatives honestly

Suppose we need to answer many searches over initially unsorted data:

- Linear search costs `O(n)` time and `O(1)` space per query.
- Sorting a copy costs `O(n log n)` time and `O(n)` space; each binary search then costs `O(log n)`.
- Building a `HashSet` normally costs `O(n)` time and `O(n)` space; a query is usually `O(1)`, but order is lost and the theoretical worst case can degrade.

For one query, preparing another structure may cost more than scanning. For thousands of queries, the preparation may be amortized. The real input, required guarantees, and available memory determine the choice.

---

## 7. Common failure modes

1. **Implementing before specifying:** boundary cases become contradictory.
2. **Testing only the happy path:** `null`, empty inputs, negative values, or overflow remain invisible.
3. **Confusing “my tests passed” with a proof:** tests cover examples; reasoning covers properties.
4. **Confusing correctness with efficiency:** a correct answer can arrive too late or exhaust memory.
5. **Treating Big O as exact time:** `O(n)` does not mean `n` milliseconds.
6. **Ignoring preconditions:** binary search over unsorted data can return an incorrect result instead of signaling a failure.
7. **Optimizing too early:** code complexity increases without evidence of a real performance problem.

---

## 8. Integrated exercise

Design a method named `firstIndex(int[] values, int target)`:

1. Write its contract, including behavior for `null` and an absent target.
2. Implement a linear solution.
3. Argue its correctness with an invariant.
4. State its time and space complexity.
5. Create tests for an empty array, first position, last position, duplicates, and absence.
6. Explain why sorting first would change the meaning of the original indices.

The expected solution uses `O(n)` time, `O(1)` additional space, and returns `-1` when there is no match. That decision is a **documented sentinel value**, not an invented answer.

---

## Summary

A professional algorithm starts with a clear contract, is supported by a correctness argument and tests, and is evaluated through time and space analysis. Asymptotic notation anticipates scalability, while measurement confirms real behavior. Make the result correct first; then improve its efficiency without losing that guarantee.
