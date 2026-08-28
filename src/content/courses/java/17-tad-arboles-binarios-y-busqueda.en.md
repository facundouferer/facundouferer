---
course: 'java'
slug: '15-tad-arboles-binarios-y-busqueda'
title: 'The Tree ADT: Traversals and Binary Search Trees'
description: 'Move from linear to hierarchical structures: tree vocabulary, the three depth-first traversals, level-order traversal with a queue, the BST, and why it degenerates.'
order: 17
lang: 'en'
published: true
---

# The Tree ADT: Traversals and Binary Search Trees

Everything so far has been **linear**: each element has a previous and a next, and finding something means, in the worst case, walking all of it.

A **tree** breaks that linearity. Each node can have several children, and that unlocks something powerful: **discarding half the data at every step**. Searching a million elements stops costing a million comparisons and starts costing twenty.

On top of that, plenty of real things *are* trees: the file system, a page's DOM, a company org chart, Java's own class hierarchy, a game's decision space.

---

## 1. Vocabulary

<figure class="diagram">
<svg viewBox="0 0 720 300" role="img" aria-labelledby="d-tree-t">
<title id="d-tree-t">Anatomy of a binary tree with root, internal nodes, leaves, and levels</title>
<text x="0" y="46" font-size="11" font-weight="700" fill="var(--color-neutral-600)">level 0</text>
<text x="0" y="126" font-size="11" font-weight="700" fill="var(--color-neutral-600)">level 1</text>
<text x="0" y="206" font-size="11" font-weight="700" fill="var(--color-neutral-600)">level 2</text>
<line x1="360" y1="62" x2="200" y2="98" stroke="var(--color-neutral-600)" stroke-width="2"/>
<line x1="360" y1="62" x2="520" y2="98" stroke="var(--color-neutral-600)" stroke-width="2"/>
<line x1="200" y1="142" x2="120" y2="178" stroke="var(--color-neutral-600)" stroke-width="2"/>
<line x1="200" y1="142" x2="280" y2="178" stroke="var(--color-neutral-600)" stroke-width="2"/>
<line x1="520" y1="142" x2="440" y2="178" stroke="var(--color-neutral-600)" stroke-width="2"/>
<line x1="520" y1="142" x2="600" y2="178" stroke="var(--color-neutral-600)" stroke-width="2"/>
<circle cx="360" cy="40" r="22" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="360" y="46" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">50</text>
<text x="392" y="30" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">ROOT — the only node with no parent</text>
<circle cx="200" cy="120" r="22" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="200" y="126" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">30</text>
<circle cx="520" cy="120" r="22" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="520" y="126" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">70</text>
<text x="232" y="112" font-size="11" font-weight="700" fill="var(--color-accent-2-700)">internal nodes</text>
<text x="232" y="128" font-size="11" fill="var(--color-neutral-700)">they have a parent and at least one child</text>
<circle cx="120" cy="200" r="22" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="120" y="206" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">20</text>
<circle cx="280" cy="200" r="22" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="280" y="206" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">40</text>
<circle cx="440" cy="200" r="22" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="440" y="206" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">60</text>
<circle cx="600" cy="200" r="22" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="600" y="206" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-text)">80</text>
<line x1="98" y1="232" x2="622" y2="232" stroke="var(--color-neutral-500)" stroke-width="1.5" stroke-dasharray="5 4"/>
<text x="360" y="250" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-neutral-800)">LEAVES — they have no children</text>
<text x="0" y="278" font-size="12" fill="var(--color-neutral-800)">The tree's HEIGHT is 2 (the number of edges on the longest path from the root down to a leaf).</text>
<text x="0" y="296" font-size="12" fill="var(--color-neutral-800)">A SUBTREE is any node together with all its descendants. Node 30 with 20 and 40 is a subtree.</text>
</svg>
<figcaption>A binary tree caps each node at two children: left and right. That restriction is what makes fast searching possible.</figcaption>
</figure>

The class that models it is the sibling of the `Node` from lesson 12, with one more reference:

```java
public class TreeNode {
    int value;
    TreeNode left;
    TreeNode right;

    public TreeNode(int value) {
        this.value = value;
    }
}

public class BinaryTree {
    private TreeNode root;   // same as 'head', just named root here
}
```

And because each node has two children that are themselves complete trees, **everything about trees is solved with recursion**. This is the data structure where recursion stops being an academic exercise and becomes the natural tool.

---

## 2. The three depth-first traversals

Walking a list has exactly one possible order. A tree has several, and each is good for something different.

All three differ **only in where the root is processed** relative to its subtrees:

<figure class="diagram">
<svg viewBox="0 0 720 340" role="img" aria-labelledby="d-trav-t">
<title id="d-trav-t">The three depth-first traversals over the same tree and their results</title>
<line x1="360" y1="52" x2="280" y2="70" stroke="var(--color-neutral-600)" stroke-width="1.8"/>
<line x1="360" y1="52" x2="440" y2="70" stroke="var(--color-neutral-600)" stroke-width="1.8"/>
<line x1="280" y1="102" x2="240" y2="120" stroke="var(--color-neutral-600)" stroke-width="1.8"/>
<line x1="280" y1="102" x2="320" y2="120" stroke="var(--color-neutral-600)" stroke-width="1.8"/>
<line x1="440" y1="102" x2="400" y2="120" stroke="var(--color-neutral-600)" stroke-width="1.8"/>
<line x1="440" y1="102" x2="480" y2="120" stroke="var(--color-neutral-600)" stroke-width="1.8"/>
<circle cx="360" cy="34" r="18" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="360" y="39" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">50</text>
<circle cx="280" cy="86" r="18" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="280" y="91" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-text)">30</text>
<circle cx="440" cy="86" r="18" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="440" y="91" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-text)">70</text>
<circle cx="240" cy="138" r="18" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="240" y="143" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-text)">20</text>
<circle cx="320" cy="138" r="18" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="320" y="143" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-text)">40</text>
<circle cx="400" cy="138" r="18" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="400" y="143" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-text)">60</text>
<circle cx="480" cy="138" r="18" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="480" y="143" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-text)">80</text>
<rect x="0" y="176" width="720" height="46" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="16" y="196" font-size="12" font-weight="700" fill="var(--color-text)">Pre-order</text>
<text x="16" y="213" font-size="10.5" fill="var(--color-neutral-700)">Root · Left · Right</text>
<text x="150" y="205" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">50  30  20  40  70  60  80</text>
<text x="420" y="205" font-size="11" fill="var(--color-neutral-800)">good for copying or serializing the tree</text>
<rect x="0" y="230" width="720" height="46" rx="14" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="16" y="250" font-size="12" font-weight="700" fill="var(--color-accent-700)">In-order</text>
<text x="16" y="267" font-size="10.5" fill="var(--color-neutral-800)">Left · Root · Right</text>
<text x="150" y="259" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">20  30  40  50  60  70  80</text>
<text x="420" y="259" font-size="11" font-weight="700" fill="var(--color-accent-700)">on a BST it comes out SORTED ascending</text>
<rect x="0" y="284" width="720" height="46" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="16" y="304" font-size="12" font-weight="700" fill="var(--color-text)">Post-order</text>
<text x="16" y="321" font-size="10.5" fill="var(--color-neutral-700)">Left · Right · Root</text>
<text x="150" y="313" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">20  40  30  60  80  70  50</text>
<text x="420" y="313" font-size="11" fill="var(--color-neutral-800)">good for freeing or deleting: children first</text>
</svg>
<figcaption>The name says when the root is visited: <em>pre</em> before, <em>in</em> between, <em>post</em> after. Subtrees are always left then right.</figcaption>
</figure>

The code is nearly identical in all three cases. **The only thing that moves is one line:**

```java
public void preOrder(TreeNode node) {
    if (node == null) return;               // base case: always first
    System.out.print(node.value + " ");     // ← the root, BEFORE
    preOrder(node.left);
    preOrder(node.right);
}

public void inOrder(TreeNode node) {
    if (node == null) return;
    inOrder(node.left);
    System.out.print(node.value + " ");     // ← the root, IN BETWEEN
    inOrder(node.right);
}

public void postOrder(TreeNode node) {
    if (node == null) return;
    postOrder(node.left);
    postOrder(node.right);
    System.out.print(node.value + " ");     // ← the root, AFTER
}
```

The `if (node == null) return;` is the **base case**, and it is not a detail: without it the recursion never ends and you get a `StackOverflowError`. Which, as you saw in lesson 13, is literally the JVM call stack overflowing.

> **In-order over a BST yields sorted data.** That property, which looks like a magic trick, is why a `TreeMap` can be iterated in key order without sorting anything: the order is already in the shape of the tree.

---

## 3. Level-order traversal (BFS), with a queue

The three traversals above dive to the bottom before moving sideways. Sometimes you want the opposite: **visiting the tree level by level**.

Recursion is no help here. What helps is a **queue**, exactly the one from lesson 13:

```java
public void levelOrder() {
    if (root == null) return;

    Queue<TreeNode> queue = new ArrayDeque<>();
    queue.offer(root);

    while (!queue.isEmpty()) {
        TreeNode current = queue.poll();
        System.out.print(current.value + " ");

        if (current.left  != null) queue.offer(current.left);
        if (current.right != null) queue.offer(current.right);
    }
}
// Output: 50 30 70 20 40 60 80
```

Notice the mechanism: **I enqueue the children and only process them once I have finished the whole current level**. That first-in-first-out behavior is exactly what produces level order.

Swap the queue for a **stack** and you get a depth-first traversal without recursion. Changing the structure changes the algorithm without touching the rest of the code. Same idea you will use for graphs, in the next lesson.

---

## 4. The Binary Search Tree

So far trees just held data. A **BST** adds one rule that changes everything:

> For **every** node: every value in the **left** subtree is smaller, and every value in the **right** subtree is larger.

With that rule, searching stops being traversal and becomes **decision**:

<figure class="diagram">
<svg viewBox="0 0 720 300" role="img" aria-labelledby="d-bst-t">
<title id="d-bst-t">The comparison path when searching for 40 in a binary search tree</title>
<text x="0" y="20" font-size="13" font-weight="700" fill="var(--color-accent-700)">search(40) — each comparison discards half the tree</text>
<line x1="360" y1="58" x2="200" y2="98" stroke="var(--color-accent)" stroke-width="3"/>
<line x1="360" y1="58" x2="520" y2="98" stroke="var(--color-neutral-400)" stroke-width="1.5"/>
<line x1="200" y1="142" x2="120" y2="178" stroke="var(--color-neutral-400)" stroke-width="1.5"/>
<line x1="200" y1="142" x2="280" y2="178" stroke="var(--color-accent)" stroke-width="3"/>
<line x1="520" y1="142" x2="440" y2="178" stroke="var(--color-neutral-400)" stroke-width="1.5"/>
<line x1="520" y1="142" x2="600" y2="178" stroke="var(--color-neutral-400)" stroke-width="1.5"/>
<circle cx="360" cy="36" r="22" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="360" y="42" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">50</text>
<text x="392" y="34" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">40 &lt; 50 → go left</text>
<text x="392" y="50" font-size="11" fill="var(--color-neutral-700)">70, 60 and 80 discarded at once</text>
<circle cx="200" cy="120" r="22" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2.5"/>
<text x="200" y="126" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">30</text>
<text x="232" y="118" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">40 &gt; 30 → go right</text>
<text x="232" y="134" font-size="11" fill="var(--color-neutral-700)">20 discarded</text>
<circle cx="520" cy="120" r="22" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="520" y="126" font-size="13" text-anchor="middle" fill="var(--color-neutral-500)">70</text>
<circle cx="120" cy="200" r="22" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="120" y="206" font-size="13" text-anchor="middle" fill="var(--color-neutral-500)">20</text>
<circle cx="280" cy="200" r="22" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="3"/>
<text x="280" y="206" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">40</text>
<text x="312" y="205" font-size="11.5" font-weight="700" fill="var(--color-accent-2-700)">found ✓</text>
<circle cx="440" cy="200" r="22" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="440" y="206" font-size="13" text-anchor="middle" fill="var(--color-neutral-500)">60</text>
<circle cx="600" cy="200" r="22" fill="var(--color-neutral-100)" stroke="var(--color-neutral-400)"/>
<text x="600" y="206" font-size="13" text-anchor="middle" fill="var(--color-neutral-500)">80</text>
<text x="0" y="256" font-size="12" fill="var(--color-neutral-800)">Three comparisons across seven nodes. The grey nodes were never looked at: the BST property guarantees</text>
<text x="0" y="274" font-size="12" fill="var(--color-neutral-800)">40 cannot be there, so there is no need to check.</text>
<text x="0" y="294" font-size="12" font-weight="700" fill="var(--color-accent-700)">With a million well-balanced nodes, that is 20 comparisons. In a list it would be a million.</text>
</svg>
<figcaption>Every level you descend discards half of what is left. That is exactly what O(log n) means.</figcaption>
</figure>

```java
public boolean search(int value) {
    return search(root, value);
}

private boolean search(TreeNode node, int value) {
    if (node == null) return false;               // hit the void: not there
    if (value == node.value) return true;         // found it
    return value < node.value
        ? search(node.left, value)                // smaller: go left
        : search(node.right, value);              // larger: go right
}
```

Insertion uses exactly the same logic: descend until you find an empty spot and hang the new node there.

```java
public void insert(int value) {
    root = insert(root, value);
}

private TreeNode insert(TreeNode node, int value) {
    if (node == null) return new TreeNode(value);   // this is the spot

    if (value < node.value) {
        node.left = insert(node.left, value);
    } else if (value > node.value) {
        node.right = insert(node.right, value);
    }
    // if equal, do nothing: a BST holds no duplicates
    return node;
}
```

The `node.left = insert(node.left, value)` pattern — reassigning the recursion's result — is the idiomatic way to modify trees in Java. It saves you from carrying a reference to the parent.

---

## 5. The Achilles heel: imbalance

Everything above assumes the tree is shaped like a tree. But that is **not guaranteed**:

<figure class="diagram">
<svg viewBox="0 0 720 340" role="img" aria-labelledby="d-bal-t">
<title id="d-bal-t">A balanced binary search tree versus one degenerated into a chain</title>
<text x="0" y="20" font-size="12.5" font-weight="700" fill="var(--color-accent-2-700)">Inserting 40, 20, 60, 10, 30, 50, 70</text>
<line x1="172" y1="56" x2="100" y2="94" stroke="var(--color-accent-2-700)" stroke-width="1.8"/>
<line x1="172" y1="56" x2="245" y2="94" stroke="var(--color-accent-2-700)" stroke-width="1.8"/>
<line x1="100" y1="134" x2="60" y2="170" stroke="var(--color-accent-2-700)" stroke-width="1.8"/>
<line x1="100" y1="134" x2="140" y2="170" stroke="var(--color-accent-2-700)" stroke-width="1.8"/>
<line x1="245" y1="134" x2="205" y2="170" stroke="var(--color-accent-2-700)" stroke-width="1.8"/>
<line x1="245" y1="134" x2="285" y2="170" stroke="var(--color-accent-2-700)" stroke-width="1.8"/>
<circle cx="172" cy="38" r="18" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="172" y="43" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">40</text>
<circle cx="100" cy="112" r="18" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="100" y="117" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">20</text>
<circle cx="245" cy="112" r="18" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="245" y="117" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">60</text>
<circle cx="60" cy="188" r="18" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="60" y="193" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">10</text>
<circle cx="140" cy="188" r="18" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="140" y="193" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">30</text>
<circle cx="205" cy="188" r="18" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="205" y="193" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">50</text>
<circle cx="285" cy="188" r="18" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="285" y="193" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">70</text>
<text x="0" y="240" font-size="12" font-weight="700" fill="var(--color-accent-2-700)">BALANCED — height 2</text>
<text x="0" y="258" font-size="11.5" fill="var(--color-neutral-800)">Worst-case search: 3 comparisons.</text>
<text x="0" y="276" font-size="11.5" font-weight="700" fill="var(--color-accent-2-700)">O(log n)</text>
<line x1="345" y1="10" x2="345" y2="290" stroke="var(--color-divider)" stroke-width="1.5"/>
<text x="375" y="20" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">Inserting 10, 20, 30, 40, 50, 60, 70 (already sorted)</text>
<line x1="410" y1="44" x2="440" y2="66" stroke="var(--color-accent)" stroke-width="1.8"/>
<line x1="450" y1="82" x2="480" y2="104" stroke="var(--color-accent)" stroke-width="1.8"/>
<line x1="490" y1="120" x2="520" y2="142" stroke="var(--color-accent)" stroke-width="1.8"/>
<line x1="530" y1="158" x2="560" y2="180" stroke="var(--color-accent)" stroke-width="1.8"/>
<line x1="570" y1="196" x2="600" y2="218" stroke="var(--color-accent)" stroke-width="1.8"/>
<circle cx="396" cy="34" r="17" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="396" y="39" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">10</text>
<circle cx="450" cy="76" r="17" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="450" y="81" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">20</text>
<circle cx="504" cy="118" r="17" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="504" y="123" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">30</text>
<circle cx="558" cy="160" r="17" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="558" y="165" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">40</text>
<circle cx="612" cy="202" r="17" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="612" y="207" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">50</text>
<text x="650" y="228" font-size="11.5" fill="var(--color-neutral-700)">...</text>
<text x="375" y="252" font-size="12" font-weight="700" fill="var(--color-accent-700)">DEGENERATE — height 6</text>
<text x="375" y="270" font-size="11.5" fill="var(--color-neutral-800)">A linked list wearing tree nodes.</text>
<text x="375" y="288" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">O(n) — the whole advantage is gone</text>
<text x="0" y="322" font-size="12" fill="var(--color-neutral-800)">Inserting already-sorted data degenerates a BST. That is why AVL and red-black trees exist: they rebalance</text>
<text x="0" y="338" font-size="12" fill="var(--color-neutral-800)">themselves on every insertion. Java's TreeMap and TreeSet are red-black trees: they never degenerate.</text>
</svg>
<figcaption>The same data set, two different shapes. The gap between 3 and 7 comparisons is decided by insertion order, not by the algorithm.</figcaption>
</figure>

This is why **you will not implement a BST in production**. `TreeMap` and `TreeSet` are red-black trees: they rearrange themselves with rotations on every insertion and guarantee O(log n) regardless of the order the data arrives in.

What you take away is understanding **why** they are O(log n) and what would happen if they did not rebalance.

---

## 6. Common mistakes

| Mistake | What happens | How to fix it |
| --- | --- | --- |
| Forgetting the base case `if (node == null) return;` | Infinite recursion → `StackOverflowError`. | The base case is always the first line of a recursive method. |
| Writing `insert(node.left, v)` without reassigning | The new node is created and lost: the tree does not change and no error appears. | `node.left = insert(node.left, v);`. |
| Inserting already-sorted data into your own BST | The tree degenerates into a list and every search becomes O(n). | Shuffle the data, or use `TreeMap`/`TreeSet`. |
| Using recursion for level-order traversal | It does not work: BFS needs queue-shaped memory, not stack-shaped. | `ArrayDeque` as a queue, with a `while (!queue.isEmpty())` loop. |
| Confusing height with node count | Complexity calculations come out wrong. | Height = edges on the longest path. A single-node tree has height 0. |
| Inserting duplicates with no defined policy | The tree grows with repeated data or silently loses it. | Decide explicitly: ignore, count occurrences, or always send them right. |
| Deep recursion over a degenerate tree | `StackOverflowError` on data that "should" fit. | Balance it, or convert the traversal to iterative with an explicit stack. |

---

## 7. Guided hands-on exercise

### Challenge: complete the BST

Implement on `BinarySearchTree`:

1. `insert(int value)`, no duplicates.
2. `search(int value)` returning a `boolean`.
3. `height()` of the tree.
4. `countNodes()` and `countLeaves()`.
5. `isValidBST()` verifying the property holds across **the entire** tree.
6. The three depth-first traversals plus level-order.

Point 5 is harder than it looks. Think it through before peeking.

<details>
<summary>See suggested solution</summary>

```java
import java.util.ArrayDeque;
import java.util.Queue;

public class BinarySearchTree {

    private static class TreeNode {
        int value;
        TreeNode left, right;
        TreeNode(int value) { this.value = value; }
    }

    private TreeNode root;

    // ── 1. Insertion ────────────────────────────────────────────
    public void insert(int value) {
        root = insert(root, value);
    }

    private TreeNode insert(TreeNode node, int value) {
        if (node == null) return new TreeNode(value);
        if (value < node.value)      node.left  = insert(node.left, value);
        else if (value > node.value) node.right = insert(node.right, value);
        // equal → ignored, no duplicates allowed
        return node;   // returning the node is what makes the reassignment work
    }

    // ── 2. Search ───────────────────────────────────────────────
    public boolean search(int value) {
        return search(root, value);
    }

    private boolean search(TreeNode node, int value) {
        if (node == null) return false;
        if (value == node.value) return true;
        return value < node.value ? search(node.left, value)
                                  : search(node.right, value);
    }

    // ── 3. Height ───────────────────────────────────────────────
    public int height() {
        return height(root);
    }

    private int height(TreeNode node) {
        if (node == null) return -1;   // -1 so that a leaf has height 0
        return 1 + Math.max(height(node.left), height(node.right));
    }

    // ── 4. Counts ───────────────────────────────────────────────
    public int countNodes() { return countNodes(root); }

    private int countNodes(TreeNode node) {
        if (node == null) return 0;
        return 1 + countNodes(node.left) + countNodes(node.right);
    }

    public int countLeaves() { return countLeaves(root); }

    private int countLeaves(TreeNode node) {
        if (node == null) return 0;
        if (node.left == null && node.right == null) return 1;
        return countLeaves(node.left) + countLeaves(node.right);
    }

    // ── 5. BST validation ───────────────────────────────────────
    public boolean isValidBST() {
        return isValid(root, Long.MIN_VALUE, Long.MAX_VALUE);
    }

    // The key: every node inherits an allowed RANGE, not just a comparison
    // with its immediate parent. Going left tightens the maximum to the
    // parent's value; going right tightens the minimum.
    private boolean isValid(TreeNode node, long min, long max) {
        if (node == null) return true;
        if (node.value <= min || node.value >= max) return false;
        return isValid(node.left,  min, node.value)
            && isValid(node.right, node.value, max);
    }

    // ── 6. Traversals ───────────────────────────────────────────
    public void preOrder()  { preOrder(root);  System.out.println(); }
    public void inOrder()   { inOrder(root);   System.out.println(); }
    public void postOrder() { postOrder(root); System.out.println(); }

    private void preOrder(TreeNode n) {
        if (n == null) return;
        System.out.print(n.value + " ");
        preOrder(n.left);
        preOrder(n.right);
    }

    private void inOrder(TreeNode n) {
        if (n == null) return;
        inOrder(n.left);
        System.out.print(n.value + " ");
        inOrder(n.right);
    }

    private void postOrder(TreeNode n) {
        if (n == null) return;
        postOrder(n.left);
        postOrder(n.right);
        System.out.print(n.value + " ");
    }

    public void levelOrder() {
        if (root == null) { System.out.println("(empty)"); return; }
        Queue<TreeNode> queue = new ArrayDeque<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            TreeNode current = queue.poll();
            System.out.print(current.value + " ");
            if (current.left  != null) queue.offer(current.left);
            if (current.right != null) queue.offer(current.right);
        }
        System.out.println();
    }

    public static void main(String[] args) {
        BinarySearchTree tree = new BinarySearchTree();
        for (int v : new int[]{50, 30, 70, 20, 40, 60, 80}) {
            tree.insert(v);
        }

        System.out.print("Pre-order  : "); tree.preOrder();    // 50 30 20 40 70 60 80
        System.out.print("In-order   : "); tree.inOrder();     // 20 30 40 50 60 70 80
        System.out.print("Post-order : "); tree.postOrder();   // 20 40 30 60 80 70 50
        System.out.print("Level-order: "); tree.levelOrder();  // 50 30 70 20 40 60 80

        System.out.println("\nHeight       : " + tree.height());        // 2
        System.out.println("Nodes        : " + tree.countNodes());      // 7
        System.out.println("Leaves       : " + tree.countLeaves());     // 4
        System.out.println("search(40)   : " + tree.search(40));        // true
        System.out.println("search(45)   : " + tree.search(45));        // false
        System.out.println("isValidBST() : " + tree.isValidBST());      // true

        // Imbalance demonstration
        BinarySearchTree degenerate = new BinarySearchTree();
        for (int v : new int[]{10, 20, 30, 40, 50, 60, 70}) {
            degenerate.insert(v);
        }
        System.out.println("\nSame 7 values, inserted in sorted order:");
        System.out.println("Height: " + degenerate.height() + "  ← was 2, now 6");
    }
}
```

**Point 5 is where nearly everyone gets it wrong.** The intuitive solution compares each node only with its parent:

```java
// WRONG: only looks at the immediate parent
if (node.left != null && node.left.value >= node.value) return false;
```

That code returns `true` for this tree, which is **not a valid BST**:

```
      50
     /  \
   30    70
  /  \
20    60      ← 60 is greater than 50 and sits in 50's LEFT subtree
```

The 60 respects its parent (30) but violates the rule with respect to the root. Which is why you must carry a **range** `(min, max)` that narrows as you descend: going left of 50 caps the maximum at 50, and 60 falls out of range.

We use `long` for the range because a node may legitimately hold `Integer.MIN_VALUE`, and with `int` there would be no way to represent a bound below it.

</details>

---

## Key takeaways

- A tree breaks linearity and lets you **discard half the data at every step**.
- Everything about trees is solved with **recursion**, and every recursive method starts with its base case.
- The three DFS traversals differ by exactly one line: where the root is processed.
- **In-order over a BST returns sorted data.** That is why `TreeMap` iterates in order without sorting anything.
- Level-order traversal (BFS) needs a **queue**, not recursion.
- The BST property — smaller left, larger right, **across the whole tree** — is what turns a search into a decision.
- Inserting already-sorted data **degenerates** a BST into a list and drops it from O(log n) to O(n).
- In production use `TreeMap`/`TreeSet`: red-black trees that rebalance themselves.
</content>
