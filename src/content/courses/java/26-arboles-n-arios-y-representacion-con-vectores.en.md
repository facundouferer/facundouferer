---
course: 'java'
slug: '26-arboles-n-arios-y-representacion-con-vectores'
title: 'N-ary trees and vector-based representation'
description: 'Model hierarchies with a variable number of children, transform them through first-child/next-sibling links, and store them with validated indices.'
order: 21
lang: 'en'
published: true
---

# N-ary trees and vector-based representation

A binary tree limits each node to two children. An **N-ary tree** allows zero or more children per node, so it naturally represents directories, menus, organization charts, and categories.

## 1. Terminology and invariants

- The **root** is the only node without a parent.
- Every non-root node has exactly one parent.
- **Siblings** share a parent; a **leaf** has no children.
- **Depth** counts edges from the root; **height** is the longest downward path.
- A tree is connected and has no cycles. A nonempty tree with `n` nodes has exactly `n - 1` parent-child relationships.

An empty structure is a valid tree and has an empty traversal. In a nonempty structure, two roots, a child with multiple parents, a missing index, or a cycle violates the invariants: reject it rather than silently trying to “repair” it.

### Preorder traversal

**Preorder** visits the node and then each child subtree from left to right:

```java
static <T> void preorder(NaryNode<T> node, java.util.function.Consumer<T> visit) {
    if (node == null) return; // empty tree: empty result
    visit.accept(node.value());
    for (NaryNode<T> child : node.children()) {
        if (child == null) {
            throw new IllegalStateException("a child cannot be null");
        }
        preorder(child, visit);
    }
}

record NaryNode<T>(T value, java.util.List<NaryNode<T>> children) {
    NaryNode {
        java.util.Objects.requireNonNull(value, "value is required");
        children = java.util.List.copyOf(
            java.util.Objects.requireNonNull(children, "children are required")
        );
    }
}
```

Visiting all `n` nodes takes **O(n)** time. The stack uses O(h) space, where `h` is the height; a very deep tree may require an iterative traversal.

## 2. First-child / next-sibling transformation

Any ordered N-ary tree can be interpreted as a binary tree without losing order:

- the left link points to the **first child**;
- the right link points to the **next sibling**.

To transform N-ary → binary, convert the first child and chain its siblings through right links. The other children do not connect directly to their parent. An empty tree produces an empty binary root.

The reverse binary → N-ary interpretation starts at the root, walks its left-right chain as the child list, and repeats for every child. The root's right link must be empty: if it exists, it represents a sibling of the root and the input is malformed. Cycles and binary nodes reachable through more than one path must also be rejected.

```text
N-ary:               First-child/next-sibling binary:
A                    A
├─ B                 /
│  ├─ D              B ── C
│  └─ E              /    /
└─ C                 D──E F
   └─ F
```

This is not a binary search tree: `left` and `right` encode relationships, not comparisons. Conversion or reconstruction visits each node once: **O(n)** time and O(h) auxiliary space.

## 3. Vector and index representation

References are expressive, but a vector improves memory **locality** and lets relationships be serialized as numbers. This design stores nodes in a `List<IndexedNode>` and uses three indices: parent, first child, and next sibling. `NO_INDEX` represents absence.

```java
import java.util.ArrayDeque;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public final class IndexedTree {
    private static final int NO_INDEX = -1;
    private static final int MAX_CAPACITY = 10_000;

    public record IndexedNode(
        String value,
        int parent,
        int firstChild,
        int nextSibling
    ) {
        public IndexedNode {
            if (value == null || value.isBlank()) {
                throw new IllegalArgumentException("value is required");
            }
        }
    }

    private final List<IndexedNode> nodes;
    private final int root;

    public IndexedTree(List<IndexedNode> nodes, int root) {
        if (nodes == null) throw new IllegalArgumentException("nodes are required");
        if (nodes.size() > MAX_CAPACITY) {
            throw new IllegalArgumentException("maximum capacity exceeded");
        }
        this.nodes = List.copyOf(nodes);
        if (nodes.isEmpty()) {
            if (root != NO_INDEX) throw new IllegalArgumentException("empty tree has no root");
            this.root = NO_INDEX;
            return;
        }
        requireIndex(root, "root");
        this.root = root;
        validate();
    }

    private void requireIndex(int index, String field) {
        if (index < 0 || index >= nodes.size()) {
            throw new IndexOutOfBoundsException("invalid index in " + field + ": " + index);
        }
    }

    private void validateLink(int index, String field) {
        if (index != NO_INDEX) requireIndex(index, field);
    }

    private void validate() {
        if (nodes.get(root).parent() != NO_INDEX) {
            throw new IllegalArgumentException("root cannot have a parent");
        }
        for (int i = 0; i < nodes.size(); i++) {
            IndexedNode node = nodes.get(i);
            validateLink(node.parent(), "parent");
            validateLink(node.firstChild(), "first child");
            validateLink(node.nextSibling(), "next sibling");
        }

        Set<Integer> seen = new HashSet<>();
        ArrayDeque<Integer> pending = new ArrayDeque<>();
        pending.push(root);
        while (!pending.isEmpty()) {
            int current = pending.pop();
            if (!seen.add(current)) {
                throw new IllegalArgumentException("cycle or node with multiple parents");
            }
            int child = nodes.get(current).firstChild();
            Set<Integer> siblings = new HashSet<>();
            while (child != NO_INDEX) {
                if (!siblings.add(child)) {
                    throw new IllegalArgumentException("cycle in sibling chain");
                }
                if (nodes.get(child).parent() != current) {
                    throw new IllegalArgumentException("inconsistent parent");
                }
                pending.push(child);
                child = nodes.get(child).nextSibling();
            }
        }
        if (seen.size() != nodes.size()) {
            throw new IllegalArgumentException("unreachable nodes exist");
        }
    }

    public List<String> preorder() {
        if (root == NO_INDEX) return List.of();
        java.util.ArrayList<String> output = new java.util.ArrayList<>();
        traverse(root, output);
        return List.copyOf(output);
    }

    private void traverse(int index, List<String> output) {
        output.add(nodes.get(index).value());
        for (int child = nodes.get(index).firstChild();
             child != NO_INDEX;
             child = nodes.get(child).nextSibling()) {
            traverse(child, output);
        }
    }
}
```

Validation is O(n): each node and valid link is processed a bounded number of times. The capacity limit rejects inputs that could exhaust memory, and `List.copyOf` prevents later external mutation.

## 4. Costs and selection

| Operation or property | Reference-based nodes | Vector with indices |
| :--- | :--- | :--- |
| Full traversal | O(n) | O(n), usually better locality |
| Insert at known position | O(1), plus allocation | Amortized O(1); vector may reallocate |
| Find parent without parent link | O(n) | O(1) through `parent` index |
| Delete subtree | O(k), then garbage collection | O(k), but compaction changes indices |
| Sparse capacity | No explicit holes | Stable indices may leave holes |

Indices work well for persistence, network transfer, and compact pools. References make edits easier and avoid updating indices after compaction. In either representation, insertion and deletion must preserve parent, first-child, and sibling-chain invariants; performance without invariants merely corrupts data faster.
