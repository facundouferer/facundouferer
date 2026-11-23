---
title: 'Dynamic Structures — Linked Lists'
course: 'c'
slug: 'estructuras-dinamicas-listas'
description: 'Build linked lists by allocating nodes on the heap, insert, search and delete by relinking pointers and free the entire list node by node.'
order: 30
lang: 'en'
published: true
---

An array stores its elements side by side: reaching the fifth one is immediate, but inserting at the front means shifting all the others, and growing requires `realloc`. A **linked list** changes that idea: each element lives in its own heap block and knows the address of the next one. You already have every piece you need to build it: structures, pointers, `->`, double pointers, `malloc` and `free`, and the rule that every block has exactly one owner. In this lesson you put them together.

## Objectives

- Define a **node** with `typedef struct` and a pointer to the next node.
- Create nodes with `malloc(sizeof *node)`, check the result against `NULL` and document who owns each one.
- Implement a singly linked list: insert at the head, at the tail and in order; search; delete by value (at the head, in the middle and a missing value); traverse; count; destroy.
- Understand why the functions that change the head take `Node **head`.
- Extend the idea to a doubly linked list.
- Compare the cost of each operation with that of an array.

**Prerequisites:** `concepto-de-estructuras`, `punteros-y-direcciones`, `punteros-arreglos-y-estructuras`, `memoria-dinamica` and `propiedad-y-errores-de-memoria`.

## Nodes and links

A linked list is a chain of **nodes**. Each node stores a value and the address of the next node. The last node stores `NULL` in that field: that is how the end is marked.

```c
typedef struct Node {
    int value;
    struct Node *next;   // address of the next node, or NULL if this is the last one
} Node;
```

The structure is **self-referential**: it contains a pointer to another structure of its own type. Inside the braces the alias `Node` does not exist yet, so the field is declared as `struct Node *`. After the `typedef` you can simply write `Node`.

To use the list you only need one variable: a pointer to the first node, the **head**. An empty list is a head equal to `NULL`.

```c
Node *head = NULL;   // empty list
```

### The list in memory

This is a list holding 3, 7 and 9. The variable `head` lives in `main`'s stack frame; the nodes live on the heap, at addresses that do not need to be contiguous (the addresses are made up):

```text
 main's stack                 heap
+--------------+     +------------------+     +------------------+     +------------------+
| head         |     | 0x5010           |     | 0x5080           |     | 0x5030           |
| 0x5010  -----+---->| value: 3         |  +->| value: 7         |  +->| value: 9         |
+--------------+     | next: 0x5080   --+--+  | next: 0x5030   --+--+  | next: NULL       |
                     +------------------+     +------------------+     +------------------+
```

That difference from an array explains everything else: to reach the third node you have to go through the first two, but to insert or remove a node you only change a couple of pointers, without moving any data.

## Creating a node

The whole list is built with a function that allocates a node, checks the allocation and leaves the node in a valid state:

```c
// Creates a node holding value and with no next node.
// Ownership: the caller owns the returned node (frees it, or links it into
// a list that becomes its owner). Returns NULL if out of memory.
Node *create_node(int value) {
    Node *node = malloc(sizeof *node);
    if (node == NULL) {
        return NULL;
    }
    node->value = value;
    node->next = NULL;
    return node;
}
```

- `sizeof *node` is the size of the pointed-to object (a `Node`), as in `memoria-dinamica`: if you change the type tomorrow, the size follows.
- The result of `malloc` is not cast: in C, `void *` converts implicitly.
- If `malloc` fails, the function reports it by returning `NULL`. The caller decides what to do.

The list's ownership rule is simple: **the list owns all its nodes**. Whoever holds the head owns the whole list and, when done, destroys it with a single call.

## Why `Node **head`

Inserting at the front changes the head. C always passes arguments by value (lesson `variables-parametros-y-pasaje`), so this version does not work:

```c
// WRONG: modifies a copy of the head
void insert_front_wrong(Node *head, Node *new_node) {
    new_node->next = head;
    head = new_node;   // changes the local copy; main's head stays the same
}
```

The function receives a copy of the pointer. Assigning to that copy does not change `main`'s variable, and the new node becomes unreachable: a leak. The fix is the same as for any variable a function must modify: pass **its address**. Since the variable is a `Node *`, its address is a `Node **`:

```c
// Inserts value at the front of the list.
// Returns false if out of memory (the list is unchanged).
bool insert_front(Node **head, int value) {
    Node *new_node = create_node(value);
    if (new_node == NULL) {
        return false;
    }
    new_node->next = *head;   // the new node points to the old first one
    *head = new_node;         // main's head now points to the new node
    return true;              // the list owns the new node
}
```

You call it as `insert_front(&head, 5)`. Inside, `*head` is `main`'s `head` variable.

```text
before:  head --> [3] --> [7] --> NULL

step 1:  new_node --> [5] --+
                            v
         head ------------> [3] --> [7] --> NULL

step 2:  head --> [5] --> [3] --> [7] --> NULL
```

Order matters: if you do `*head = new_node` first, you lose the address of the old first node and, with it, the rest of the list.

## Traversing, counting and searching

Traversing does not change the list, so receiving the head by value is enough. The helper pointer `current` moves from node to node until it reaches `NULL`:

```c
// Prints the list. It only reads it (const): it takes ownership of nothing.
void print_list(const Node *head) {
    for (const Node *current = head; current != NULL; current = current->next) {
        printf("%d -> ", current->value);
    }
    printf("NULL\n");
}

size_t length(const Node *head) {
    size_t count = 0;
    for (const Node *current = head; current != NULL; current = current->next) {
        count++;
    }
    return count;
}

// Returns the first node holding value, or NULL if it is not there.
// The returned node still belongs to the list: the caller only borrows it.
const Node *find(const Node *head, int value) {
    for (const Node *current = head; current != NULL; current = current->next) {
        if (current->value == value) {
            return current;
        }
    }
    return NULL;
}
```

The search stops as soon as it finds the value. The length uses `size_t`, the type for sizes and counts, and it is printed with `%zu`.

## Inserting at the tail

To insert at the tail you have to reach the last node, the one with `next == NULL`. If the list is empty there is no last node: the new one becomes the head, which is why this function also takes `Node **`.

```c
// Inserts value at the end of the list. Returns false if out of memory.
bool insert_back(Node **head, int value) {
    Node *new_node = create_node(value);
    if (new_node == NULL) {
        return false;
    }
    if (*head == NULL) {          // empty list: the new node is the first one
        *head = new_node;
        return true;
    }
    Node *last = *head;
    while (last->next != NULL) {
        last = last->next;
    }
    last->next = new_node;
    return true;
}
```

## Inserting in order

If the list is kept sorted in ascending order, the new value goes right before the first node whose value is greater than or equal to it. There are two cases: it goes at the head (empty list, or a value smaller than the first one), or it goes after some node, which we call `previous`.

```c
// Inserts value keeping the list sorted in ascending order.
// Returns false if out of memory.
bool insert_sorted(Node **head, int value) {
    Node *new_node = create_node(value);
    if (new_node == NULL) {
        return false;
    }
    if (*head == NULL || value <= (*head)->value) {   // goes first
        new_node->next = *head;
        *head = new_node;
        return true;
    }
    Node *previous = *head;
    while (previous->next != NULL && previous->next->value < value) {
        previous = previous->next;
    }
    new_node->next = previous->next;   // link the rest first
    previous->next = new_node;         // then hook the new node in
    return true;
}
```

The condition `previous->next != NULL && ...` relies on the short-circuit of `&&` (lesson `operadores`): if there is no next node, `previous->next->value` is not evaluated, which would dereference `NULL`.

## Deleting by value

Deleting a node means unhooking it from its neighbors and freeing it. There are three situations:

1. **The value is at the head:** the head becomes the second node.
2. **The value is in the middle or at the end:** the `previous` node skips over the deleted one.
3. **The value is missing:** the list does not change and the function reports it.

```c
// Deletes the first node holding value and frees it.
// Returns false if the value was not in the list.
bool delete_value(Node **head, int value) {
    Node *current = *head;
    Node *previous = NULL;
    while (current != NULL && current->value != value) {
        previous = current;
        current = current->next;
    }
    if (current == NULL) {                   // case 3: missing
        return false;
    }
    if (previous == NULL) {                  // case 1: it was the head
        *head = current->next;
    } else {                                 // case 2: middle or end
        previous->next = current->next;
    }
    free(current);   // the list owned it; nobody must use this node again
    return true;
}
```

```text
delete 7:   head --> [3] --> [7] --> [9] --> NULL
                     previous current

after:      head --> [3] -----------> [9] --> NULL      [7] freed
```

Unhook first, free afterwards. If you call `free(current)` before reading `current->next`, you read memory that was already freed: a use after free (lesson `propiedad-y-errores-de-memoria`).

## Destroying the list

Since the list owns all its nodes, it needs a function that frees all of them. The key detail is saving the next node **before** freeing the current one:

```c
// Frees every node and sets the head to NULL (empty, reusable list).
void destroy_list(Node **head) {
    Node *current = *head;
    while (current != NULL) {
        Node *next = current->next;   // save before freeing
        free(current);
        current = next;
    }
    *head = NULL;   // keeps main's head from dangling
}
```

Setting `*head = NULL` avoids a dangling pointer: after destroying it, `main`'s variable describes a valid empty list.

## The complete program

All the functions together, with a `main` that exercises every case. Build it with AddressSanitizer to check that there are no invalid accesses or leaks:

```bash
gcc -std=c23 -Wall -Wextra -Wpedantic -g -fsanitize=address lists.c -o lists
./lists
```

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int value;
    struct Node *next;
} Node;

// Ownership: the caller owns the returned node. NULL if out of memory.
Node *create_node(int value) {
    Node *node = malloc(sizeof *node);
    if (node == NULL) {
        return NULL;
    }
    node->value = value;
    node->next = NULL;
    return node;
}

bool insert_front(Node **head, int value) {
    Node *new_node = create_node(value);
    if (new_node == NULL) {
        return false;
    }
    new_node->next = *head;
    *head = new_node;
    return true;
}

bool insert_back(Node **head, int value) {
    Node *new_node = create_node(value);
    if (new_node == NULL) {
        return false;
    }
    if (*head == NULL) {
        *head = new_node;
        return true;
    }
    Node *last = *head;
    while (last->next != NULL) {
        last = last->next;
    }
    last->next = new_node;
    return true;
}

bool insert_sorted(Node **head, int value) {
    Node *new_node = create_node(value);
    if (new_node == NULL) {
        return false;
    }
    if (*head == NULL || value <= (*head)->value) {
        new_node->next = *head;
        *head = new_node;
        return true;
    }
    Node *previous = *head;
    while (previous->next != NULL && previous->next->value < value) {
        previous = previous->next;
    }
    new_node->next = previous->next;
    previous->next = new_node;
    return true;
}

void print_list(const Node *head) {
    for (const Node *current = head; current != NULL; current = current->next) {
        printf("%d -> ", current->value);
    }
    printf("NULL\n");
}

size_t length(const Node *head) {
    size_t count = 0;
    for (const Node *current = head; current != NULL; current = current->next) {
        count++;
    }
    return count;
}

const Node *find(const Node *head, int value) {
    for (const Node *current = head; current != NULL; current = current->next) {
        if (current->value == value) {
            return current;
        }
    }
    return NULL;
}

bool delete_value(Node **head, int value) {
    Node *current = *head;
    Node *previous = NULL;
    while (current != NULL && current->value != value) {
        previous = current;
        current = current->next;
    }
    if (current == NULL) {
        return false;
    }
    if (previous == NULL) {
        *head = current->next;
    } else {
        previous->next = current->next;
    }
    free(current);
    return true;
}

// The list owns all its nodes: this function frees all of them.
void destroy_list(Node **head) {
    Node *current = *head;
    while (current != NULL) {
        Node *next = current->next;
        free(current);
        current = next;
    }
    *head = NULL;
}

int main(void) {
    Node *head = NULL;   // main owns the list

    if (!insert_back(&head, 7) || !insert_back(&head, 9) ||
        !insert_front(&head, 3) || !insert_sorted(&head, 8) ||
        !insert_sorted(&head, 1)) {
        fprintf(stderr, "Out of memory\n");
        destroy_list(&head);   // frees whatever was inserted
        return 1;
    }
    print_list(head);
    printf("Length: %zu\n", length(head));
    printf("Is 8 there? %s\n", find(head, 8) != NULL ? "yes" : "no");

    delete_value(&head, 1);   // at the head
    delete_value(&head, 8);   // in the middle
    if (!delete_value(&head, 42)) {
        printf("42 was not in the list\n");
    }
    print_list(head);
    printf("Length: %zu\n", length(head));

    destroy_list(&head);
    print_list(head);
    return 0;
}
```

Output:

```text
1 -> 3 -> 7 -> 8 -> 9 -> NULL
Length: 5
Is 8 there? yes
42 was not in the list
3 -> 7 -> 9 -> NULL
Length: 3
NULL
```

Look at `main`'s error path: if an insertion fails, the program destroys what it already inserted before exiting. An error is no excuse for a leak.

> **Modern C (C23):** `bool`, `true` and `false` are keywords, so the program includes nothing to use them.
>
> **Basic C:** in C99 and C17, add `#include <stdbool.h>`.

## Extension: doubly linked list

In a singly linked list you can only move forward. To delete a node you need its predecessor, which forces a walk from the head. A **doubly linked list** adds a pointer to the previous node in each node. If you also keep a pointer to the last node, inserting at the tail and traversing backwards are immediate too.

```c
typedef struct DNode {
    int value;
    struct DNode *prev;
    struct DNode *next;
} DNode;

typedef struct {
    DNode *first;
    DNode *last;
    size_t count;
} DList;
```

```text
           first                                  last
             |                                      |
             v                                      v
NULL <-- [prev| 3 |next] <--> [prev| 7 |next] <--> [prev| 9 |next] --> NULL
```

Here the list is represented by a `DList` structure, and the functions take a `DList *`: since they change fields of that structure, they need its address, just like before.

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct DNode {
    int value;
    struct DNode *prev;
    struct DNode *next;
} DNode;

// The list owns all its nodes.
typedef struct {
    DNode *first;
    DNode *last;
    size_t count;
} DList;

bool dlist_push_back(DList *list, int value) {
    DNode *new_node = malloc(sizeof *new_node);
    if (new_node == NULL) {
        return false;
    }
    new_node->value = value;
    new_node->next = NULL;
    new_node->prev = list->last;
    if (list->last == NULL) {        // empty list
        list->first = new_node;
    } else {
        list->last->next = new_node;
    }
    list->last = new_node;
    list->count++;
    return true;
}

// Unhooks and frees node, which must belong to list. No traversal needed.
void dlist_remove(DList *list, DNode *node) {
    if (node->prev == NULL) {
        list->first = node->next;
    } else {
        node->prev->next = node->next;
    }
    if (node->next == NULL) {
        list->last = node->prev;
    } else {
        node->next->prev = node->prev;
    }
    free(node);
    list->count--;
}

void print_backwards(const DList *list) {
    for (const DNode *current = list->last; current != NULL; current = current->prev) {
        printf("%d ", current->value);
    }
    printf("\n");
}

void dlist_destroy(DList *list) {
    DNode *current = list->first;
    while (current != NULL) {
        DNode *next = current->next;
        free(current);
        current = next;
    }
    list->first = NULL;
    list->last = NULL;
    list->count = 0;
}

int main(void) {
    DList list = {NULL, NULL, 0};

    for (int i = 1; i <= 4; i++) {
        if (!dlist_push_back(&list, i * 10)) {
            dlist_destroy(&list);
            return 1;
        }
    }
    print_backwards(&list);                    // 40 30 20 10
    dlist_remove(&list, list.first->next);     // removes 20
    print_backwards(&list);                    // 40 30 10
    printf("Count: %zu\n", list.count);

    dlist_destroy(&list);
    return 0;
}
```

The price of the doubly linked list is one more pointer per node and more links to maintain in every operation: forgetting to update one of the four pointers is the typical bug.

## Cost of each operation: list versus array

With *n* elements, O(1) means "does not depend on n" and O(n) means "grows with n" (lesson `busqueda-en-arreglos`).

| Operation | Array | Singly linked list | Doubly linked list with `last` |
| --- | --- | --- | --- |
| Access element i | O(1) | O(n) | O(n) |
| Insert at the front | O(n) (shift everything) | O(1) | O(1) |
| Insert at the back | O(1) if there is capacity; `realloc` otherwise | O(n) (no pointer to the last node) | O(1) |
| Insert in order | O(n) | O(n) | O(n) |
| Search for a value | O(n); O(log n) if sorted (binary search) | O(n) | O(n) |
| Delete a known node | O(n) (shift everything) | O(n) (must find the predecessor) | O(1) |
| Extra memory | none | one pointer per node | two pointers per node |

Lists win when you insert and delete a lot at the ends or at a position you already hold. Arrays win when you access by position or traverse a lot: their elements are contiguous, and the processor reads them faster than nodes scattered across the heap. In practice, a dynamic array is the default choice, and a list is the answer to a specific problem.

## Summary

- A node holds a value and a pointer to the next node; the last one points to `NULL`.
- Every node is created with `malloc(sizeof *node)` and checked against `NULL`.
- The list owns its nodes: `destroy_list` frees all of them, saving the next node before each `free`.
- Functions that may change the head take `Node **head`, because C passes arguments by value.
- Operations that can fail return `bool`; counts are `size_t`.
- Deleting means unhooking first and freeing afterwards.

## Practice exercises

### Exercise 1: sum the list

Write `int sum(const Node *head)`, which returns the sum of the values in the list (0 if it is empty). Why does it not need `Node **`?

<details><summary>Show solution</summary>

```c
int sum(const Node *head) {
    int total = 0;
    for (const Node *current = head; current != NULL; current = current->next) {
        total += current->value;
    }
    return total;
}
```

It only reads the list: it changes neither the head nor any node, so a copy of the pointer is enough, and `const` documents that it modifies nothing.

</details>

### Exercise 2: find the bug

This `destroy` compiles, but AddressSanitizer reports `heap-use-after-free`. Why? Fix it.

<!-- c-check: skip -->
```c
void destroy(Node *head) {
    for (Node *current = head; current != NULL; current = current->next) {
        free(current);
    }
}
```

<details><summary>Show solution</summary>

The step expression `current = current->next` runs **after** `free(current)`: it reads the `next` field of a node that was already freed. Save the next node before freeing:

```c
void destroy(Node *head) {
    Node *current = head;
    while (current != NULL) {
        Node *next = current->next;
        free(current);
        current = next;
    }
}
```

This version also leaves the caller's pointer dangling. The lesson's version takes `Node **head` to set it to `NULL`.

</details>

### Exercise 3: delete without special cases

The lesson's `delete_value` checks whether the node is the head. Rewrite it walking with a `Node **link`, which first points to the head and then to the `next` field of each node, so that all three cases are handled by the same code. Test it in a complete program.

<details><summary>Show solution</summary>

`link` holds the address of the pointer that would have to change. At first it is the address of the head; afterwards, the address of the previous node's `next` field. That way the head needs no special case:

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int value;
    struct Node *next;
} Node;

bool insert_front(Node **head, int value) {
    Node *new_node = malloc(sizeof *new_node);
    if (new_node == NULL) {
        return false;
    }
    new_node->value = value;
    new_node->next = *head;
    *head = new_node;
    return true;
}

bool delete_value(Node **head, int value) {
    Node **link = head;
    while (*link != NULL && (*link)->value != value) {
        link = &(*link)->next;
    }
    if (*link == NULL) {
        return false;
    }
    Node *victim = *link;
    *link = victim->next;   // the pointer that pointed to victim skips it
    free(victim);
    return true;
}

void print_list(const Node *head) {
    for (const Node *current = head; current != NULL; current = current->next) {
        printf("%d -> ", current->value);
    }
    printf("NULL\n");
}

void destroy_list(Node **head) {
    while (*head != NULL) {
        Node *next = (*head)->next;
        free(*head);
        *head = next;
    }
}

int main(void) {
    Node *head = NULL;
    for (int i = 1; i <= 4; i++) {
        if (!insert_front(&head, i)) {
            destroy_list(&head);
            return 1;
        }
    }
    print_list(head);                    // 4 -> 3 -> 2 -> 1 -> NULL
    delete_value(&head, 4);              // head
    delete_value(&head, 2);              // middle
    printf("%s\n", delete_value(&head, 9) ? "deleted" : "not found");
    print_list(head);                    // 3 -> 1 -> NULL
    destroy_list(&head);
    return 0;
}
```

</details>

### Exercise 4: reverse the list

Write `void reverse(Node **head)`, which reverses the list by changing only the pointers, without creating or freeing nodes. What does it cost?

<details><summary>Show solution</summary>

```c
void reverse(Node **head) {
    Node *previous = NULL;
    Node *current = *head;
    while (current != NULL) {
        Node *next = current->next;   // save the rest
        current->next = previous;     // flip the link
        previous = current;
        current = next;
    }
    *head = previous;   // the old last node is the new head
}
```

It visits each node once: O(n) time and O(1) extra memory. Ownership does not change: the same nodes still belong to the same list.

</details>
