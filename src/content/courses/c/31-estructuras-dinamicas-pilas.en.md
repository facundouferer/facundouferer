---
title: 'Dynamic Structures — Stacks'
course: 'c'
slug: 'estructuras-dinamicas-pilas'
order: 31
lang: 'en'
published: true
---

A **stack** is a collection where you can only touch one end, the **top**: you add on top and you remove from the top. The last element in is the first one out. That rule is called **LIFO** (*Last In, First Out*). Think of a stack of plates, of the "undo" button in an editor, or of the call stack you saw in `recursividad`: every new call is pushed and the one that returns is popped.

A stack is not a new structure in memory: it is an **interface** (a set of operations with rules) that can be implemented with linked nodes or with an array. In this lesson you build both.

## Objectives

- Describe the LIFO rule and the stack operations: **push**, **pop**, **peek** and **is empty**.
- Implement a linked stack on top of the list from `estructuras-dinamicas-listas`, with a checked allocation for each node and a function that destroys it.
- Implement a stack on top of a dynamic array that grows with `realloc`.
- Report the error of popping an empty stack without crashing the program.
- Solve a classic problem with a stack: checking balanced brackets.
- Compare the cost of each operation in both implementations.

**Prerequisites:** `estructuras-dinamicas-listas`, `memoria-dinamica` and `propiedad-y-errores-de-memoria`.

## The operations

| Operation | What it does | Can fail |
| --- | --- | --- |
| *push* | adds an element on top | yes, when out of memory |
| *pop* | removes the top element and returns it | yes, when the stack is empty |
| *peek* | returns the top element without removing it | yes, when the stack is empty |
| *is empty* | tells whether the stack has no elements | no |

The operations that can fail return `bool`. The value they produce (the popped element or the top one) is delivered through an output pointer, as `scanf` does: the outcome of the operation and the data travel separately, and no data value has to be reserved to mean "error".

```text
push 1, push 2, push 3              pop -> 3

   | 3 |  <- top                      | 2 |  <- top
   | 2 |                              | 1 |
   | 1 |                              +---+
   +---+
```

## Linked stack

A linked stack is a singly linked list in which you only insert and delete at the head, which is called the **top** here. Both operations are O(1), because nothing has to be traversed.

We group the top and the element count in a `Stack` structure. The functions take a `Stack *`: they change the top, so they need the address of the structure that holds it, for the same reason the previous lesson's functions took `Node **head`.

```c
typedef struct Node {
    int value;
    struct Node *next;   // the element underneath
} Node;

// The stack owns all its nodes.
typedef struct {
    Node *top;
    size_t count;
} Stack;
```

### Push

```c
// Pushes value. Returns false if out of memory (the stack is unchanged).
bool stack_push(Stack *stack, int value) {
    Node *node = malloc(sizeof *node);
    if (node == NULL) {
        return false;
    }
    node->value = value;
    node->next = stack->top;   // the old top goes underneath
    stack->top = node;         // the stack now owns the node
    stack->count++;
    return true;
}
```

### Pop

Popping an empty stack is a bug in the calling code, but the stack must not dereference `NULL` because of it: it detects the situation and returns `false`.

```c
// Removes the top element and stores it in *value.
// Returns false if the stack is empty (*value is left untouched).
bool stack_pop(Stack *stack, int *value) {
    if (stack->top == NULL) {
        return false;
    }
    Node *old = stack->top;
    *value = old->value;       // copy the value before freeing
    stack->top = old->next;
    free(old);
    stack->count--;
    return true;
}
```

The node is freed inside `stack_pop`: the caller receives a **copy** of the value, not the node, so it never has to free anything.

### Peek, is empty and destroy

```c
bool stack_peek(const Stack *stack, int *value) {
    if (stack->top == NULL) {
        return false;
    }
    *value = stack->top->value;
    return true;
}

bool stack_is_empty(const Stack *stack) {
    return stack->top == NULL;
}

// Frees every node and leaves the stack empty and reusable.
void stack_destroy(Stack *stack) {
    Node *current = stack->top;
    while (current != NULL) {
        Node *below = current->next;
        free(current);
        current = below;
    }
    stack->top = NULL;
    stack->count = 0;
}
```

### Complete program

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int value;
    struct Node *next;
} Node;

// The stack owns all its nodes.
typedef struct {
    Node *top;
    size_t count;
} Stack;

bool stack_push(Stack *stack, int value) {
    Node *node = malloc(sizeof *node);
    if (node == NULL) {
        return false;
    }
    node->value = value;
    node->next = stack->top;
    stack->top = node;
    stack->count++;
    return true;
}

bool stack_pop(Stack *stack, int *value) {
    if (stack->top == NULL) {
        return false;
    }
    Node *old = stack->top;
    *value = old->value;
    stack->top = old->next;
    free(old);
    stack->count--;
    return true;
}

bool stack_peek(const Stack *stack, int *value) {
    if (stack->top == NULL) {
        return false;
    }
    *value = stack->top->value;
    return true;
}

bool stack_is_empty(const Stack *stack) {
    return stack->top == NULL;
}

void stack_destroy(Stack *stack) {
    Node *current = stack->top;
    while (current != NULL) {
        Node *below = current->next;
        free(current);
        current = below;
    }
    stack->top = NULL;
    stack->count = 0;
}

int main(void) {
    Stack stack = {NULL, 0};   // main owns the stack

    for (int i = 1; i <= 3; i++) {
        if (!stack_push(&stack, i * 10)) {
            fprintf(stderr, "Out of memory\n");
            stack_destroy(&stack);
            return 1;
        }
    }
    int value;
    if (stack_peek(&stack, &value)) {
        printf("Top: %d (%zu elements)\n", value, stack.count);
    }
    while (stack_pop(&stack, &value)) {
        printf("Popped: %d\n", value);
    }
    if (!stack_pop(&stack, &value)) {
        printf("Error: cannot pop an empty stack\n");
    }
    printf("Empty? %s\n", stack_is_empty(&stack) ? "yes" : "no");

    stack_destroy(&stack);   // does nothing if already empty, but it is the right way to finish
    return 0;
}
```

Output:

```text
Top: 30 (3 elements)
Popped: 30
Popped: 20
Popped: 10
Error: cannot pop an empty stack
Empty? yes
```

## Stack on a dynamic array

The same interface can be implemented with an array: the top is the last occupied position. Push writes to `data[count]` and pop reads `data[count - 1]`. When the array is full, its capacity is doubled with `realloc` (lesson `memoria-dinamica`).

```text
data:     [ 10 | 20 | 30 |    ]     capacity = 4
                        ^
               count = 3, the top is data[2]
```

```c
#include <stdio.h>
#include <stdlib.h>

// The stack owns the data array.
typedef struct {
    int *data;
    size_t count;
    size_t capacity;
} ArrayStack;

// Pushes value; when the array is full, doubles its capacity.
// Returns false if out of memory (the stack is unchanged).
bool array_stack_push(ArrayStack *stack, int value) {
    if (stack->count == stack->capacity) {
        size_t new_capacity = stack->capacity == 0 ? 4 : stack->capacity * 2;
        int *new_data = realloc(stack->data, new_capacity * sizeof *new_data);
        if (new_data == NULL) {
            return false;   // stack->data is still valid
        }
        stack->data = new_data;
        stack->capacity = new_capacity;
    }
    stack->data[stack->count] = value;
    stack->count++;
    return true;
}

bool array_stack_pop(ArrayStack *stack, int *value) {
    if (stack->count == 0) {
        return false;
    }
    stack->count--;
    *value = stack->data[stack->count];
    return true;
}

void array_stack_destroy(ArrayStack *stack) {
    free(stack->data);
    stack->data = NULL;
    stack->count = 0;
    stack->capacity = 0;
}

int main(void) {
    ArrayStack stack = {NULL, 0, 0};

    for (int i = 1; i <= 10; i++) {
        if (!array_stack_push(&stack, i)) {
            array_stack_destroy(&stack);
            return 1;
        }
    }
    printf("Count: %zu, capacity: %zu\n", stack.count, stack.capacity);

    int value;
    while (array_stack_pop(&stack, &value)) {
        printf("%d ", value);
    }
    printf("\n");

    array_stack_destroy(&stack);
    return 0;
}
```

Output:

```text
Count: 10, capacity: 16
10 9 8 7 6 5 4 3 2 1
```

Notice three details that come from earlier lessons:

- The result of `realloc` is stored in a helper variable. With `stack->data = realloc(...)`, a failure would lose the only pointer to the old block (lesson `propiedad-y-errores-de-memoria`).
- `realloc(NULL, n)` behaves like `malloc(n)`, which is why the stack starts with `data = NULL` and capacity 0.
- Destroying is a single `free`, because all elements live in one block.

If you know the maximum number of elements in advance, you can use a fixed capacity and make push return `false` when the stack is full.

## A classic use: balanced brackets

An expression like `{[(a + b) * c]}` is balanced when each opening symbol is closed by the matching symbol, in reverse order. A stack is the natural tool: each opening symbol is pushed; each closing symbol must match the top, which is popped.

```text
{ [ ( ) ] }
push {       stack: {
push [       stack: { [
push (       stack: { [ (
close )      top ( matches -> pop    stack: { [
close ]      top [ matches -> pop    stack: {
close }      top { matches -> pop    empty stack -> balanced
```

There are two ways to fail: a closing symbol that does not match the top (or arrives with an empty stack), and opening symbols left over at the end. In the first case the function returns early **with nodes still on the stack**: it has to destroy it before every `return`.

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    char symbol;
    struct Node *next;
} Node;

bool push(Node **top, char symbol) {
    Node *node = malloc(sizeof *node);
    if (node == NULL) {
        return false;
    }
    node->symbol = symbol;
    node->next = *top;
    *top = node;
    return true;
}

bool pop(Node **top, char *symbol) {
    if (*top == NULL) {
        return false;
    }
    Node *old = *top;
    *symbol = old->symbol;
    *top = old->next;
    free(old);
    return true;
}

void destroy_stack(Node **top) {
    char discarded;
    while (pop(top, &discarded)) {
    }
}

char opening_for(char closing) {
    switch (closing) {
    case ')': return '(';
    case ']': return '[';
    default: return '{';
    }
}

// Returns true if text is balanced. It creates and destroys its own stack:
// it never leaves live nodes behind, however it returns.
// If out of memory, it reports the error and returns false.
bool is_balanced(const char *text) {
    Node *top = NULL;
    for (const char *c = text; *c != '\0'; c++) {
        if (*c == '(' || *c == '[' || *c == '{') {
            if (!push(&top, *c)) {
                fprintf(stderr, "Out of memory\n");
                destroy_stack(&top);
                return false;
            }
        } else if (*c == ')' || *c == ']' || *c == '}') {
            char opened;
            if (!pop(&top, &opened) || opened != opening_for(*c)) {
                destroy_stack(&top);   // opening symbols may still be stacked
                return false;
            }
        }
    }
    bool balanced = top == NULL;   // leftover openings mean it is not balanced
    destroy_stack(&top);
    return balanced;
}

int main(void) {
    const char *tests[] = {"{[(a + b) * c]}", "(a + b]", "((a)", "a)", ""};
    size_t count = sizeof tests / sizeof tests[0];

    for (size_t i = 0; i < count; i++) {
        printf("\"%s\": %s\n", tests[i],
               is_balanced(tests[i]) ? "balanced" : "not balanced");
    }
    return 0;
}
```

Output:

```text
"{[(a + b) * c]}": balanced
"(a + b]": not balanced
"((a)": not balanced
"a)": not balanced
"": balanced
```

This version does not use the `Stack` structure: the top is a plain local `Node *`, and the functions take `Node **top` because they change it. Both styles are correct; the structure is handy when you also want to keep a count.

## Cost of the operations

| Operation | Linked stack | Stack on a dynamic array |
| --- | --- | --- |
| Push | O(1) | O(1) on average; O(n) when it has to grow |
| Pop | O(1) | O(1) |
| Peek | O(1) | O(1) |
| Is empty | O(1) | O(1) |
| Destroy | O(n) (one `free` per node) | O(1) (a single `free`) |
| Extra memory | one pointer per element | unused capacity (up to half) |

Doubling the capacity makes the `realloc` calls rarer and rarer: on average, each push costs O(1). The array version is usually faster in practice, because the data is contiguous and there is only one allocation every many operations. The linked version never copies elements and every operation has a predictable cost.

## Summary

- A stack follows the LIFO rule: you only work on the top.
- Push, pop, peek and is empty are O(1).
- Popping or peeking an empty stack is an error the stack reports with `false`, without dereferencing `NULL`.
- The stack owns its nodes (or its array) and has a function that frees them; functions that return early destroy it before `return`.
- With a dynamic array, the result of `realloc` goes into a helper variable.

## Practice exercises

### Exercise 1: predict the output

Using the lesson's linked stack, what does this fragment print?

```c
Stack stack = {NULL, 0};
int x;
stack_push(&stack, 1);
stack_push(&stack, 2);
stack_pop(&stack, &x);
stack_push(&stack, 3);
stack_push(&stack, 4);
stack_pop(&stack, &x);
printf("%d ", x);
stack_pop(&stack, &x);
printf("%d %zu\n", x, stack.count);
stack_destroy(&stack);
```

<details><summary>Show solution</summary>

It prints `4 3 1`. After pushing 1 and 2 and popping, `1` remains. Then 3 and 4 are pushed: `1 3 4`, with 4 on top. The first pop gives 4, the second gives 3, and one element (the 1) remains, which `stack_destroy` frees.

</details>

### Exercise 2: reverse a string

Use a stack to print a string backwards: push each character, then pop until the stack is empty. Write the complete program with a linked stack of `char` and check that no live nodes remain.

<details><summary>Show solution</summary>

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    char character;
    struct Node *next;
} Node;

bool push(Node **top, char character) {
    Node *node = malloc(sizeof *node);
    if (node == NULL) {
        return false;
    }
    node->character = character;
    node->next = *top;
    *top = node;
    return true;
}

bool pop(Node **top, char *character) {
    if (*top == NULL) {
        return false;
    }
    Node *old = *top;
    *character = old->character;
    *top = old->next;
    free(old);
    return true;
}

int main(void) {
    const char *text = "stack";
    Node *top = NULL;
    char c;

    for (const char *p = text; *p != '\0'; p++) {
        if (!push(&top, *p)) {
            while (pop(&top, &c)) {
            }
            return 1;
        }
    }
    while (pop(&top, &c)) {   // emptying the stack frees every node
        putchar(c);
    }
    putchar('\n');            // prints "kcats"
    return 0;
}
```

Popping until the stack is empty frees every node, so none is left alive at the end.

</details>

### Exercise 3: fixed-capacity stack

Change the array stack so that it has a fixed capacity, chosen when it is created, and push returns `false` when it is full instead of growing. Write `bool fixed_stack_create(ArrayStack *stack, size_t capacity)` and the new push.

<details><summary>Show solution</summary>

```c
// Allocates the array. Returns false if capacity is 0 or out of memory.
bool fixed_stack_create(ArrayStack *stack, size_t capacity) {
    stack->count = 0;
    stack->capacity = 0;
    stack->data = NULL;
    if (capacity == 0) {
        return false;
    }
    stack->data = malloc(capacity * sizeof *stack->data);
    if (stack->data == NULL) {
        return false;
    }
    stack->capacity = capacity;
    return true;
}

// Returns false if the stack is full.
bool fixed_stack_push(ArrayStack *stack, int value) {
    if (stack->count == stack->capacity) {
        return false;
    }
    stack->data[stack->count] = value;
    stack->count++;
    return true;
}
```

Pop and destroy do not change. Across both implementations, push now has two different reasons to fail (out of memory or full stack), which is why the caller must always check the `bool`.

</details>
