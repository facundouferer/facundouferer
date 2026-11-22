---
title: 'Binary Trees'
course: 'c'
slug: 'arboles-binarios'
order: 33
lang: 'en'
published: true
---

So far you have organized data in **linear** structures: lists, stacks and queues. In them, each element has a single successor, like people in a line. But a lot of data is **hierarchical**: a company's org chart, the folders on your computer, the decisions in a game. That is what **trees** are for, and the most widely used one in programming is the **binary tree**.

A binary tree is built from the same pieces as a list: heap nodes created with `malloc`, linked with pointers and released with `free`. The difference is that each node has **two** links, and that makes **recursion** the natural way to walk it.

## Objectives

- Use tree terminology: root, child, parent, leaf, subtree, level and height.
- Define a node with `typedef struct` and two self-referential pointers.
- Understand the **binary search tree** (BST) rule and implement recursive insertion and search.
- Implement the three depth-first **traversals**: inorder, preorder and postorder.
- Free the whole tree with a postorder traversal.
- Compute the height, the minimum and the maximum.
- Delete a value (extension), handling its three cases.
- Explain why a balanced tree searches in O(log n) and a degenerate one in O(n).

**Prerequisites:** `recursividad`, `estructuras-dinamicas-listas` and `propiedad-y-errores-de-memoria`.

## Why trees?

Imagine a sorted linked list with 1,000,000 numbers. To find 999,999 you have to walk through almost every node, one by one: you cannot jump to the middle, as binary search does on an array, because reaching a node means going through all the ones before it.

A **binary search tree** stores data so that at each node you can discard half of what is left, like looking up a word in a dictionary: you open it in the middle, see that the word comes earlier, and discard the whole right half. In a well-balanced tree with a million nodes, finding a value takes about **20 steps**.

## Anatomy of a tree

A tree is drawn upside down: the root at the top and the branches growing downwards.

```text
             [50]           <- root (level 0)
            /    \
        [30]      [70]      <- internal nodes (level 1)
        /  \      /  \
     [20] [40] [60] [80]    <- leaves (level 2)
```

- **Root**: the top node. It is the only one without a parent.
- **Child** and **parent**: a node can have children below it; it is their parent. In a **binary** tree each node has at most **two** children: the left one and the right one.
- **Leaf**: a node with no children (both its pointers are `NULL`).
- **Subtree**: each child is the root of a smaller tree. This idea underlies every algorithm in the lesson: a function that solves a problem for a tree can solve it by calling itself on its two subtrees.
- **Level**: the distance from the root. The root is at level 0.
- **Height**: the number of nodes on the longest path from the root to a leaf. In this course an empty tree has height 0 and a single-node tree has height 1; the tree in the drawing has height 3. Some books count edges instead of nodes and get one less: what matters is being consistent.

## The node in C

```c
typedef struct Node {
    int value;
    struct Node *left;    // subtree of smaller values, or NULL
    struct Node *right;   // subtree of larger values, or NULL
} Node;
```

As with lists, the structure is self-referential, and an empty tree is a pointer `Node *root = NULL`. The ownership rule is also the same: **the tree owns all its nodes**, and whoever holds the root owns the whole tree.

```c
// Creates a leaf holding value.
// Ownership: the caller owns the returned node. Returns NULL if out of memory.
Node *create_node(int value) {
    Node *node = malloc(sizeof *node);
    if (node == NULL) {
        return NULL;
    }
    node->value = value;
    node->left = NULL;
    node->right = NULL;
    return node;
}
```

## The binary search tree rule

A general binary tree has no order. A **binary search tree** satisfies, for **every** node:

1. all values in its left subtree are **smaller** than the node's value;
2. all values in its right subtree are **larger** than the node's value.

This lesson stores no duplicates: inserting a value that is already there leaves the tree unchanged.

### Insert

Inserting means finding the empty spot (`NULL`) where the value belongs and hanging a new node there. That spot is a pointer that has to be **modified**: the root, if the tree is empty, or the `left` or `right` field of some node. That is why the function takes `Node **root`, just like the list functions that change the head.

```c
// Inserts value into the tree. Returns false only if out of memory.
// If value was already there, the tree is unchanged and it returns true.
bool insert(Node **root, int value) {
    if (*root == NULL) {                 // base case: we found the spot
        *root = create_node(value);      // the tree owns the new node
        return *root != NULL;
    }
    if (value < (*root)->value) {
        return insert(&(*root)->left, value);
    }
    if (value > (*root)->value) {
        return insert(&(*root)->right, value);
    }
    return true;                          // already there
}
```

It follows the recipe from `recursividad`: a **base case** that does not call itself (the empty subtree) and a **recursive case** that works on a smaller problem (one of the two subtrees). `&(*root)->left` is the address of the current node's `left` field: the next call can write into it.

Inserting 50, 30, 70 and 40, in that order:

```text
insert 50        insert 30        insert 70         insert 40: 40 < 50, go left;
                                                    40 > 30, go right of 30
  [50]             [50]              [50]                 [50]
                   /                 /  \                 /  \
                [30]              [30]  [70]           [30]  [70]
                                                          \
                                                          [40]
```

### Search

Search follows the same path as insertion, but only reads:

```c
// Returns the node holding value, or NULL if it is not there.
// The node still belongs to the tree: the caller only borrows it.
const Node *find(const Node *root, int value) {
    if (root == NULL || root->value == value) {
        return root;
    }
    if (value < root->value) {
        return find(root->left, value);
    }
    return find(root->right, value);
}
```

Each call goes down one level and discards the whole other subtree. The number of steps is at most the height of the tree.

## Traversals

A **traversal** visits every node once. A list has a single natural order; a tree has several. The three depth-first traversals visit the left subtree before the right one, and differ in **when** they visit the current node:

| Traversal | Order | Result on the example tree |
| --- | --- | --- |
| **Inorder** | left, node, right | 20 30 40 50 60 70 80 |
| **Preorder** | node, left, right | 50 30 20 40 70 60 80 |
| **Postorder** | left, right, node | 20 40 30 60 80 70 50 |

```c
void inorder(const Node *root) {
    if (root != NULL) {
        inorder(root->left);
        printf("%d ", root->value);
        inorder(root->right);
    }
}

void preorder(const Node *root) {
    if (root != NULL) {
        printf("%d ", root->value);
        preorder(root->left);
        preorder(root->right);
    }
}

void postorder(const Node *root) {
    if (root != NULL) {
        postorder(root->left);
        postorder(root->right);
        printf("%d ", root->value);
    }
}
```

Each one has its use:

- **Inorder** on a binary search tree produces the values **sorted** in ascending order: first all the smaller ones, then the node, then all the larger ones.
- **Preorder** visits each parent before its children. If you insert the values in that order into an empty tree, you get a copy with the same shape.
- **Postorder** visits each parent after its children. It is the order you need to free the tree.

## Freeing the tree in postorder

A node can only be freed once its pointers are no longer needed. If you free the root first, you can no longer read `root->left` or `root->right` without a use after free, and if you do not read them, their subtrees become unreachable: a leak. In postorder, each node is freed after its two subtrees:

```c
// Frees every node of the tree. The tree owns them, so after this call
// no pointer to any of its nodes is valid.
void destroy_tree(Node *root) {
    if (root == NULL) {
        return;
    }
    destroy_tree(root->left);
    destroy_tree(root->right);
    free(root);   // the children are already freed; this node goes last
}
```

The caller must set its root to `NULL` afterwards: `destroy_tree(root); root = NULL;`. A program that builds a tree and never destroys it leaks one block per node.

## Height, minimum and maximum

Height is defined recursively: an empty tree measures 0, and a non-empty one measures 1 plus the height of its taller subtree.

```c
size_t height(const Node *root) {
    if (root == NULL) {
        return 0;
    }
    size_t left = height(root->left);
    size_t right = height(root->right);
    return 1 + (left > right ? left : right);
}
```

Because of the search rule, the minimum is the leftmost node and the maximum, the rightmost. No recursion is needed: just go down one side. An empty tree has no minimum, so the function returns `bool` and delivers the value through an output pointer:

```c
// Stores the smallest value in *result. Returns false if the tree is empty.
bool minimum(const Node *root, int *result) {
    if (root == NULL) {
        return false;
    }
    while (root->left != NULL) {
        root = root->left;
    }
    *result = root->value;
    return true;
}

bool maximum(const Node *root, int *result) {
    if (root == NULL) {
        return false;
    }
    while (root->right != NULL) {
        root = root->right;
    }
    *result = root->value;
    return true;
}
```

## Complete program

This program builds the example tree, traverses it, searches it, computes its height and extremes, and destroys it. Build it with `-fsanitize=address` to check that no node is left unfreed and there are no invalid accesses.

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int value;
    struct Node *left;
    struct Node *right;
} Node;

// Ownership: the caller owns the returned node. NULL if out of memory.
Node *create_node(int value) {
    Node *node = malloc(sizeof *node);
    if (node == NULL) {
        return NULL;
    }
    node->value = value;
    node->left = NULL;
    node->right = NULL;
    return node;
}

bool insert(Node **root, int value) {
    if (*root == NULL) {
        *root = create_node(value);
        return *root != NULL;
    }
    if (value < (*root)->value) {
        return insert(&(*root)->left, value);
    }
    if (value > (*root)->value) {
        return insert(&(*root)->right, value);
    }
    return true;
}

const Node *find(const Node *root, int value) {
    if (root == NULL || root->value == value) {
        return root;
    }
    if (value < root->value) {
        return find(root->left, value);
    }
    return find(root->right, value);
}

void inorder(const Node *root) {
    if (root != NULL) {
        inorder(root->left);
        printf("%d ", root->value);
        inorder(root->right);
    }
}

void preorder(const Node *root) {
    if (root != NULL) {
        printf("%d ", root->value);
        preorder(root->left);
        preorder(root->right);
    }
}

void postorder(const Node *root) {
    if (root != NULL) {
        postorder(root->left);
        postorder(root->right);
        printf("%d ", root->value);
    }
}

size_t height(const Node *root) {
    if (root == NULL) {
        return 0;
    }
    size_t left = height(root->left);
    size_t right = height(root->right);
    return 1 + (left > right ? left : right);
}

bool minimum(const Node *root, int *result) {
    if (root == NULL) {
        return false;
    }
    while (root->left != NULL) {
        root = root->left;
    }
    *result = root->value;
    return true;
}

bool maximum(const Node *root, int *result) {
    if (root == NULL) {
        return false;
    }
    while (root->right != NULL) {
        root = root->right;
    }
    *result = root->value;
    return true;
}

// The tree owns all its nodes: they are freed in postorder.
void destroy_tree(Node *root) {
    if (root == NULL) {
        return;
    }
    destroy_tree(root->left);
    destroy_tree(root->right);
    free(root);
}

int main(void) {
    const int values[] = {50, 30, 70, 20, 40, 60, 80};
    size_t count = sizeof values / sizeof values[0];
    Node *root = NULL;   // main owns the tree

    for (size_t i = 0; i < count; i++) {
        if (!insert(&root, values[i])) {
            fprintf(stderr, "Out of memory\n");
            destroy_tree(root);
            return 1;
        }
    }

    printf("Inorder:   ");
    inorder(root);
    printf("\nPreorder:  ");
    preorder(root);
    printf("\nPostorder: ");
    postorder(root);
    printf("\n");

    printf("Is 60 there? %s\n", find(root, 60) != NULL ? "yes" : "no");
    printf("Is 65 there? %s\n", find(root, 65) != NULL ? "yes" : "no");
    printf("Height: %zu\n", height(root));

    int smallest;
    int largest;
    if (minimum(root, &smallest) && maximum(root, &largest)) {
        printf("Minimum: %d, maximum: %d\n", smallest, largest);
    }

    destroy_tree(root);
    root = NULL;
    printf("Height after destroying: %zu\n", height(root));
    return 0;
}
```

Output:

```text
Inorder:   20 30 40 50 60 70 80
Preorder:  50 30 20 40 70 60 80
Postorder: 20 40 30 60 80 70 50
Is 60 there? yes
Is 65 there? no
Height: 3
Minimum: 20, maximum: 80
Height after destroying: 0
```

> **Modern C (C23):** `bool`, `true` and `false` are keywords.
>
> **Basic C:** in C99 and C17, add `#include <stdbool.h>` to compile this program.

## Extension: deleting a value

Deleting is the most delicate operation, because the tree has to keep satisfying the search rule. First you find the node (as in `find`) and then there are three cases:

1. **It is a leaf:** it is freed and the pointer that pointed to it becomes `NULL`.
2. **It has a single child:** that child takes its place and the node is freed.
3. **It has two children:** it cannot be removed without breaking the tree. You look for its **successor**, the smallest value in the right subtree (the minimum of that subtree), which comes next in inorder. You copy that value into the node and delete the successor from its subtree. The successor has no left child, so deleting it is always case 1 or case 2.

```text
delete 30 (two children)            successor of 30: the minimum on its right, 40

        [50]                               [50]
        /  \                               /  \
     [30]  [70]       copy 40,          [40]  [70]
     /  \             delete 40         /
  [20]  [40]          from the right [20]
```

Since the pointer to the node may change (the root, or its parent's field), the function takes `Node **root`:

```c
// Deletes value from the tree and frees its node. Returns false if it was not there.
bool delete_value(Node **root, int value) {
    Node *node = *root;
    if (node == NULL) {
        return false;
    }
    if (value < node->value) {
        return delete_value(&node->left, value);
    }
    if (value > node->value) {
        return delete_value(&node->right, value);
    }
    if (node->left == NULL || node->right == NULL) {
        // Cases 1 and 2: whichever child exists (or NULL) takes its place.
        *root = node->left != NULL ? node->left : node->right;
        free(node);
        return true;
    }
    // Case 3: copy the successor and delete it from the right subtree.
    Node *successor = node->right;
    while (successor->left != NULL) {
        successor = successor->left;
    }
    node->value = successor->value;
    return delete_value(&node->right, successor->value);
}
```

In cases 1 and 2, `*root` is updated **before** the `free`, and the freed node is no longer reachable from the tree. In case 3 the node that was found is not freed; the successor's node is, in the recursive call.

## Cost: balanced versus degenerate

Search, insert and delete walk a single path from the root, so their cost is proportional to the **height**:

- In a **balanced** tree (branches of similar height), each level doubles the number of nodes: with *n* nodes the height is about log₂ n. A million nodes fit in about 20 levels: O(log n).
- In a **degenerate** tree, every node has a single child and the tree is, in practice, a list: the height is *n* and the operations are O(n).

Whether the tree ends up balanced or degenerate depends on the **insertion order**. Inserting already sorted values produces the worst case:

```text
insert 10, 20, 30, 40, 50 in that order:

[10]
   \
   [20]
      \
      [30]          height 5 with 5 nodes: finding 50 visits all 5
         \
         [40]
            \
            [50]
```

| Operation | Balanced | Degenerate | Sorted list | Sorted array |
| --- | --- | --- | --- | --- |
| Search | O(log n) | O(n) | O(n) | O(log n) |
| Insert | O(log n) | O(n) | O(n) | O(n) |
| Delete | O(log n) | O(n) | O(n) | O(n) |
| Traverse in order | O(n) | O(n) | O(n) | O(n) |
| Destroy | O(n) | O(n) | O(n) | O(1) |

## Uses and limits

Binary search trees fit when data changes often and must also be searched or traversed in order: indexes, ordered dictionaries, sets without duplicates, a compiler's symbol table. Other binary trees are not search trees: the tree of an arithmetic expression, for example, stores operators in internal nodes and numbers in leaves.

Their limits matter too:

- **They do not balance themselves.** With sorted or nearly sorted data they degenerate into a list. **AVL** and **red-black** trees add rotations that keep the height at O(log n); they are the next step if you study data structures.
- **Recursion has a cost.** Each level is one more frame on the call stack (lesson `recursividad`). On a degenerate tree with hundreds of thousands of nodes, `destroy_tree` or `height` can exhaust the stack; in those cases iterative versions are used.
- **Memory and scattering.** Each value takes a node with two pointers, in a separate heap block. For data that rarely changes, a sorted array with binary search uses less memory and is faster to traverse.

## Summary

- A binary tree is a hierarchical structure: each node has at most two children.
- In a binary search tree, smaller values go left and larger values go right, at every node.
- Insert and search are written recursively; insert takes `Node **root` because it modifies a pointer.
- Every node is created with `malloc(sizeof *node)` and checked against `NULL`.
- The inorder, preorder and postorder traversals visit the node at different moments; inorder yields the values sorted.
- The tree is freed in postorder: children first, then the parent.
- The cost of the operations depends on the height: O(log n) when balanced, O(n) when degenerate.

## Practice exercises

### Exercise 1: traversals by hand

The values 8, 3, 10, 1, 6, 14, 4, 7 are inserted, in that order, into an empty tree. Draw the tree and write its inorder, preorder and postorder traversals. What is its height?

<details><summary>Show solution</summary>

```text
          [8]
         /   \
      [3]     [10]
     /   \       \
   [1]   [6]     [14]
        /   \
      [4]   [7]
```

- Inorder: 1 3 4 6 7 8 10 14
- Preorder: 8 3 1 6 4 7 10 14
- Postorder: 1 4 7 6 3 14 10 8

The height is 4 (path 8, 3, 6, 4).

</details>

### Exercise 2: count nodes and leaves

Write `size_t count_nodes(const Node *root)` and `size_t count_leaves(const Node *root)` recursively.

<details><summary>Show solution</summary>

```c
size_t count_nodes(const Node *root) {
    if (root == NULL) {
        return 0;
    }
    return 1 + count_nodes(root->left) + count_nodes(root->right);
}

size_t count_leaves(const Node *root) {
    if (root == NULL) {
        return 0;
    }
    if (root->left == NULL && root->right == NULL) {
        return 1;
    }
    return count_leaves(root->left) + count_leaves(root->right);
}
```

Both visit each node once: O(n). They only read the tree, which is why they take `const Node *`.

</details>

### Exercise 3: find the bug

This `destroy` compiles, but AddressSanitizer reports `heap-use-after-free`. Why? Which traversal is it using?

<!-- c-check: skip -->
```c
void destroy(Node *root) {
    if (root == NULL) {
        return;
    }
    free(root);
    destroy(root->left);
    destroy(root->right);
}
```

<details><summary>Show solution</summary>

It frees in **preorder**: first the node, then it reads `root->left` and `root->right`, which live inside the block it just freed. It has to free in **postorder**, like `destroy_tree`:

```c
void destroy(Node *root) {
    if (root == NULL) {
        return;
    }
    destroy(root->left);
    destroy(root->right);
    free(root);
}
```

</details>

### Exercise 4: delete and check

Write a complete program that inserts 50, 30, 70, 20, 40, 60, 80, deletes a leaf (20), a node with one child (30, after removing 20) and the root (50, which has two children), prints the inorder traversal after each step and destroys the tree. Build it with `-fsanitize=address`.

<details><summary>Show solution</summary>

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int value;
    struct Node *left;
    struct Node *right;
} Node;

bool insert(Node **root, int value) {
    if (*root == NULL) {
        Node *node = malloc(sizeof *node);
        if (node == NULL) {
            return false;
        }
        node->value = value;
        node->left = NULL;
        node->right = NULL;
        *root = node;
        return true;
    }
    if (value < (*root)->value) {
        return insert(&(*root)->left, value);
    }
    if (value > (*root)->value) {
        return insert(&(*root)->right, value);
    }
    return true;
}

bool delete_value(Node **root, int value) {
    Node *node = *root;
    if (node == NULL) {
        return false;
    }
    if (value < node->value) {
        return delete_value(&node->left, value);
    }
    if (value > node->value) {
        return delete_value(&node->right, value);
    }
    if (node->left == NULL || node->right == NULL) {
        *root = node->left != NULL ? node->left : node->right;
        free(node);
        return true;
    }
    Node *successor = node->right;
    while (successor->left != NULL) {
        successor = successor->left;
    }
    node->value = successor->value;
    return delete_value(&node->right, successor->value);
}

void inorder(const Node *root) {
    if (root != NULL) {
        inorder(root->left);
        printf("%d ", root->value);
        inorder(root->right);
    }
}

void destroy_tree(Node *root) {
    if (root != NULL) {
        destroy_tree(root->left);
        destroy_tree(root->right);
        free(root);
    }
}

void show(const char *title, const Node *root) {
    printf("%-15s", title);
    inorder(root);
    printf("\n");
}

int main(void) {
    const int values[] = {50, 30, 70, 20, 40, 60, 80};
    Node *root = NULL;

    for (size_t i = 0; i < sizeof values / sizeof values[0]; i++) {
        if (!insert(&root, values[i])) {
            destroy_tree(root);
            return 1;
        }
    }
    show("Initial:", root);
    delete_value(&root, 20);
    show("Without 20:", root);     // leaf
    delete_value(&root, 30);
    show("Without 30:", root);     // one child (40)
    delete_value(&root, 50);
    show("Without 50:", root);     // two children: 60 moves to the root
    printf("Delete 99? %s\n", delete_value(&root, 99) ? "yes" : "not found");

    destroy_tree(root);
    return 0;
}
```

Output:

```text
Initial:       20 30 40 50 60 70 80
Without 20:    30 40 50 60 70 80
Without 30:    40 50 60 70 80
Without 50:    40 60 70 80
Delete 99? not found
```

The inorder traversal stays sorted after each deletion: that is the evidence that the tree keeps the search rule.

</details>
