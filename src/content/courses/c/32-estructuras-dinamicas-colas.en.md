---
title: 'Dynamic Structures — Queues'
course: 'c'
slug: 'estructuras-dinamicas-colas'
description: 'Implement a FIFO queue with front and rear pointers or a circular array, handling the empty-queue transition and releasing its memory.'
order: 32
lang: 'en'
published: true
---

A **queue** works like a line at the bank: whoever arrives joins at the **rear** and the person at the **front** is served. The first one in is the first one out. That rule is called **FIFO** (*First In, First Out*). Queues are everywhere: jobs waiting for a printer, messages waiting to be processed, tasks waiting for their turn on the processor.

Like the stack, the queue is an interface that can be implemented with linked nodes or with an array. The difference is that it works on **two** ends: you insert at one and remove from the other.

## Objectives

- Describe the FIFO rule and the operations **enqueue**, **dequeue**, peek at the front and is empty.
- Implement a linked queue with front and rear pointers, so both operations are O(1).
- Handle the case where the queue becomes empty on dequeue correctly: the rear must go back to `NULL` too.
- Implement a queue on a circular array.
- Use a queue to simulate round-robin scheduling.
- Compare the cost of each operation.

**Prerequisites:** `estructuras-dinamicas-listas`, `estructuras-dinamicas-pilas` and `propiedad-y-errores-de-memoria`.

## The operations

| Operation | What it does | Can fail |
| --- | --- | --- |
| *enqueue* | adds an element at the rear | yes, when out of memory or out of room |
| *dequeue* | removes the front element and returns it | yes, when the queue is empty |
| *front* / *peek* | returns the front element without removing it | yes, when the queue is empty |
| *is empty* | tells whether the queue has no elements | no |

```text
enqueue 1, 2, 3                         dequeue -> 1

front                 rear              front            rear
  |                     |                 |                |
  v                     v                 v                v
[ 1 ] --> [ 2 ] --> [ 3 ] --> NULL      [ 2 ] --> [ 3 ] --> NULL
```

## Linked queue

With a singly linked list and only a head pointer, enqueueing at the rear would cost O(n): you would have to walk to the last node. The fix is to keep **two** pointers: `front` (where you dequeue) and `rear` (where you enqueue). The links go from the front towards the rear, so dequeueing removes the list's head, and enqueueing hooks a node after the last one.

```c
typedef struct Node {
    int value;
    struct Node *next;   // the one that arrived later
} Node;

// The queue owns all its nodes.
// Invariant: front and rear are both NULL (empty queue) or both non-NULL.
typedef struct {
    Node *front;
    Node *rear;
    size_t count;
} Queue;
```

The structure's comment states its **invariant**: a condition every operation must preserve. If `front` is `NULL` but `rear` is not, the program has a bug.

### Enqueue

```c
// Adds value at the rear. Returns false if out of memory (the queue is unchanged).
bool queue_enqueue(Queue *queue, int value) {
    Node *node = malloc(sizeof *node);
    if (node == NULL) {
        return false;
    }
    node->value = value;
    node->next = NULL;              // it will be the last one
    if (queue->rear == NULL) {      // empty queue: it is both front and rear
        queue->front = node;
    } else {
        queue->rear->next = node;
    }
    queue->rear = node;             // the queue now owns the node
    queue->count++;
    return true;
}
```

### Dequeue and the empty case

```c
// Removes the front element and stores it in *value.
// Returns false if the queue is empty (*value is left untouched).
bool queue_dequeue(Queue *queue, int *value) {
    if (queue->front == NULL) {
        return false;
    }
    Node *old = queue->front;
    *value = old->value;
    queue->front = old->next;
    if (queue->front == NULL) {     // the last element just left
        queue->rear = NULL;         // otherwise rear would dangle
    }
    free(old);
    queue->count--;
    return true;
}
```

That `queue->rear = NULL` line is the classic queue bug. See what happens without it when the queue holds a single element:

```text
before:              front --> [ 7 ] <-- rear

dequeue without      front --> NULL
fixing rear:         rear  --> [ ? ]   node already freed: dangling pointer

enqueue 8:           queue->rear->next = node   writes into freed memory
```

The next `queue_enqueue` sees `rear != NULL` and writes into a freed node: a use after free that AddressSanitizer reports as `heap-use-after-free`. On top of that, `front` stays `NULL` and the new node is never reachable: a leak.

### Peek, is empty, traverse and destroy

```c
bool queue_peek(const Queue *queue, int *value) {
    if (queue->front == NULL) {
        return false;
    }
    *value = queue->front->value;
    return true;
}

bool queue_is_empty(const Queue *queue) {
    return queue->front == NULL;
}

// Prints the queue from front to rear without modifying it.
void queue_print(const Queue *queue) {
    printf("front -> ");
    for (const Node *current = queue->front; current != NULL; current = current->next) {
        printf("%d ", current->value);
    }
    printf("<- rear\n");
}

// Frees every node and leaves the queue empty and reusable.
void queue_destroy(Queue *queue) {
    Node *current = queue->front;
    while (current != NULL) {
        Node *next = current->next;
        free(current);
        current = next;
    }
    queue->front = NULL;
    queue->rear = NULL;
    queue->count = 0;
}
```

Traversing a queue to print it is useful for debugging, but it is not part of the FIFO interface: code that uses a queue should only enqueue and dequeue.

### Complete program

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int value;
    struct Node *next;
} Node;

// The queue owns all its nodes.
// Invariant: front and rear are both NULL or both non-NULL.
typedef struct {
    Node *front;
    Node *rear;
    size_t count;
} Queue;

bool queue_enqueue(Queue *queue, int value) {
    Node *node = malloc(sizeof *node);
    if (node == NULL) {
        return false;
    }
    node->value = value;
    node->next = NULL;
    if (queue->rear == NULL) {
        queue->front = node;
    } else {
        queue->rear->next = node;
    }
    queue->rear = node;
    queue->count++;
    return true;
}

bool queue_dequeue(Queue *queue, int *value) {
    if (queue->front == NULL) {
        return false;
    }
    Node *old = queue->front;
    *value = old->value;
    queue->front = old->next;
    if (queue->front == NULL) {
        queue->rear = NULL;
    }
    free(old);
    queue->count--;
    return true;
}

bool queue_peek(const Queue *queue, int *value) {
    if (queue->front == NULL) {
        return false;
    }
    *value = queue->front->value;
    return true;
}

bool queue_is_empty(const Queue *queue) {
    return queue->front == NULL;
}

void queue_print(const Queue *queue) {
    printf("front -> ");
    for (const Node *current = queue->front; current != NULL; current = current->next) {
        printf("%d ", current->value);
    }
    printf("<- rear\n");
}

void queue_destroy(Queue *queue) {
    Node *current = queue->front;
    while (current != NULL) {
        Node *next = current->next;
        free(current);
        current = next;
    }
    queue->front = NULL;
    queue->rear = NULL;
    queue->count = 0;
}

int main(void) {
    Queue queue = {NULL, NULL, 0};   // main owns the queue
    int value;

    for (int i = 1; i <= 3; i++) {
        if (!queue_enqueue(&queue, i * 10)) {
            fprintf(stderr, "Out of memory\n");
            queue_destroy(&queue);
            return 1;
        }
    }
    queue_print(&queue);
    if (queue_peek(&queue, &value)) {
        printf("Front: %d (%zu waiting)\n", value, queue.count);
    }

    while (queue_dequeue(&queue, &value)) {   // empties the queue completely
        printf("Served: %d\n", value);
    }
    printf("Empty? %s\n", queue_is_empty(&queue) ? "yes" : "no");
    if (!queue_dequeue(&queue, &value)) {
        printf("Error: cannot dequeue from an empty queue\n");
    }

    // After emptying it, rear went back to NULL: enqueueing again is safe.
    if (!queue_enqueue(&queue, 99)) {
        queue_destroy(&queue);
        return 1;
    }
    queue_print(&queue);

    queue_destroy(&queue);
    return 0;
}
```

Output:

```text
front -> 10 20 30 <- rear
Front: 10 (3 waiting)
Served: 10
Served: 20
Served: 30
Empty? yes
Error: cannot dequeue from an empty queue
front -> 99 <- rear
```

The end of `main` tests exactly the delicate case: emptying the queue and enqueueing again.

## Queue on a circular array

With an array, the naive idea is to enqueue at `data[count]` and dequeue `data[0]`, shifting all the others one place forward: dequeue would cost O(n). The alternative is to shift nothing and keep a `start` index that moves forward. The problem is that the queue "walks" towards the end of the array and leaves free slots at the beginning.

The solution is a **circular array**: when an index reaches the end, it wraps around to 0. The `%` operator does the wrap:

- the front is at `data[start]`;
- the slot where you enqueue is `data[(start + count) % capacity]`;
- on dequeue, `start = (start + 1) % capacity`.

```text
capacity = 5, start = 3, count = 3

 index:    0     1     2     3     4
         [ 50 |     |     | 30  | 40 ]
           ^                 ^
         rear              front
   (start + count) % 5 = 1  ->  the next one is enqueued at data[1]
```

Keeping `count` as well as `start` resolves an ambiguity: with only two indices, "full queue" and "empty queue" would look the same.

```c
#include <stdio.h>
#include <stdlib.h>

// The queue owns the data array.
typedef struct {
    int *data;
    size_t capacity;
    size_t start;      // index of the front
    size_t count;
} CircularQueue;

// Allocates the array. Returns false if capacity is 0 or out of memory.
bool circular_create(CircularQueue *queue, size_t capacity) {
    queue->start = 0;
    queue->count = 0;
    queue->capacity = 0;
    queue->data = NULL;
    if (capacity == 0) {
        return false;
    }
    queue->data = malloc(capacity * sizeof *queue->data);
    if (queue->data == NULL) {
        return false;
    }
    queue->capacity = capacity;
    return true;
}

// Returns false if the queue is full.
bool circular_enqueue(CircularQueue *queue, int value) {
    if (queue->count == queue->capacity) {
        return false;
    }
    size_t rear = (queue->start + queue->count) % queue->capacity;
    queue->data[rear] = value;
    queue->count++;
    return true;
}

// Returns false if the queue is empty.
bool circular_dequeue(CircularQueue *queue, int *value) {
    if (queue->count == 0) {
        return false;
    }
    *value = queue->data[queue->start];
    queue->start = (queue->start + 1) % queue->capacity;
    queue->count--;
    return true;
}

void circular_destroy(CircularQueue *queue) {
    free(queue->data);
    queue->data = NULL;
    queue->capacity = 0;
    queue->start = 0;
    queue->count = 0;
}

int main(void) {
    CircularQueue queue;
    if (!circular_create(&queue, 3)) {
        return 1;
    }
    int value;

    circular_enqueue(&queue, 1);
    circular_enqueue(&queue, 2);
    circular_enqueue(&queue, 3);
    if (!circular_enqueue(&queue, 4)) {
        printf("Queue full: 4 does not fit\n");
    }
    circular_dequeue(&queue, &value);   // 1 leaves, data[0] is free
    circular_enqueue(&queue, 4);        // 4 goes to data[0]: it wrapped around

    while (circular_dequeue(&queue, &value)) {
        printf("%d ", value);
    }
    printf("\n");

    circular_destroy(&queue);
    return 0;
}
```

Output:

```text
Queue full: 4 does not fit
2 3 4
```

The circular array has a fixed capacity. If you need it to grow, `realloc` is not enough: the elements that wrapped around would end up in the wrong order. You have to allocate a new array and copy them in order starting at `start` (you solve this in exercise 3).

## A use case: round-robin scheduling

An operating system shares the processor among several processes with a queue: it takes the process at the front, lets it run for one **quantum** (a fixed slice of time) and, if it has not finished, enqueues it again at the rear. That policy is called *round robin*.

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int id;
    int remaining;   // time units the process still needs
    struct Node *next;
} Node;

// The queue owns all its nodes.
typedef struct {
    Node *front;
    Node *rear;
} Queue;

bool enqueue(Queue *queue, int id, int remaining) {
    Node *node = malloc(sizeof *node);
    if (node == NULL) {
        return false;
    }
    node->id = id;
    node->remaining = remaining;
    node->next = NULL;
    if (queue->rear == NULL) {
        queue->front = node;
    } else {
        queue->rear->next = node;
    }
    queue->rear = node;
    return true;
}

// Removes the front node and transfers its ownership to the caller,
// who must free it or enqueue it again. Returns NULL if the queue is empty.
Node *dequeue_node(Queue *queue) {
    Node *node = queue->front;
    if (node == NULL) {
        return NULL;
    }
    queue->front = node->next;
    if (queue->front == NULL) {
        queue->rear = NULL;
    }
    node->next = NULL;
    return node;
}

// Enqueues an existing node again; the queue takes back its ownership.
void requeue_node(Queue *queue, Node *node) {
    if (queue->rear == NULL) {
        queue->front = node;
    } else {
        queue->rear->next = node;
    }
    queue->rear = node;
}

void destroy(Queue *queue) {
    Node *node;
    while ((node = dequeue_node(queue)) != NULL) {
        free(node);
    }
}

int main(void) {
    const int quantum = 3;
    const int durations[] = {5, 2, 7};
    Queue ready = {NULL, NULL};

    for (int i = 0; i < 3; i++) {
        if (!enqueue(&ready, i + 1, durations[i])) {
            destroy(&ready);
            return 1;
        }
    }

    int clock = 0;
    Node *process;
    while ((process = dequeue_node(&ready)) != NULL) {
        int used = process->remaining < quantum ? process->remaining : quantum;
        clock += used;
        process->remaining -= used;
        if (process->remaining > 0) {
            printf("t=%2d  P%d runs %d, %d left\n", clock, process->id, used, process->remaining);
            requeue_node(&ready, process);   // back to the end of the line
        } else {
            printf("t=%2d  P%d runs %d and finishes\n", clock, process->id, used);
            free(process);                   // the loop owned it
        }
    }
    return 0;
}
```

Output:

```text
t= 3  P1 runs 3, 2 left
t= 5  P2 runs 2 and finishes
t= 8  P3 runs 3, 4 left
t=10  P1 runs 2 and finishes
t=13  P3 runs 3, 1 left
t=14  P3 runs 1 and finishes
```

Here dequeue does not copy the value: it **transfers ownership of the node** to the loop, which decides whether to free it or give it back to the queue. Reusing the node saves a `free` and a `malloc` per turn, and the comments make clear who owns it at every moment.

## Cost of the operations

| Operation | Linked queue (front and rear) | Circular array | List with only a head |
| --- | --- | --- | --- |
| Enqueue | O(1) | O(1) | O(n) |
| Dequeue | O(1) | O(1) | O(1) |
| Peek | O(1) | O(1) | O(1) |
| Destroy | O(n) | O(1) | O(n) |
| Limit | available memory | fixed capacity | available memory |

The linked queue grows without limit and never copies elements; the circular array makes a single allocation and keeps its data contiguous, but you have to choose its capacity.

## Summary

- A queue follows the FIFO rule: you enqueue at the rear and dequeue at the front.
- With `front` and `rear` pointers, enqueue and dequeue are O(1).
- When the last element is dequeued, `rear` must go back to `NULL`; otherwise it dangles and the next enqueue writes into freed memory.
- Every node is created with `malloc(sizeof *node)`, checked against `NULL`, and the queue has a function that frees all its nodes.
- A circular array uses `%` so indices wrap around, and keeps `count` to tell a full queue from an empty one.

## Practice exercises

### Exercise 1: trace the indices

On a freshly created `CircularQueue` with capacity 4, you run: enqueue 1, enqueue 2, enqueue 3, dequeue, dequeue, enqueue 4, enqueue 5, enqueue 6. What are `start` and `count`, and what is in each array slot?

<details><summary>Show solution</summary>

- After enqueueing 1, 2, 3: `data = [1, 2, 3, ?]`, `start = 0`, `count = 3`.
- After two dequeues (1 and 2 leave): `start = 2`, `count = 1`.
- Enqueue 4 goes to `(2 + 1) % 4 = 3`; enqueue 5 goes to `(2 + 2) % 4 = 0`; enqueue 6 goes to `(2 + 3) % 4 = 1`.

Result: `data = [5, 6, 3, 4]`, `start = 2`, `count = 4` (full queue). The output order will be 3, 4, 5, 6.

</details>

### Exercise 2: find the bug

This dequeue works while the queue has several elements, but a program that empties the queue and enqueues again fails under AddressSanitizer. What is missing?

<!-- c-check: skip -->
```c
bool queue_dequeue(Queue *queue, int *value) {
    if (queue->front == NULL) {
        return false;
    }
    Node *old = queue->front;
    *value = old->value;
    queue->front = old->next;
    free(old);
    queue->count--;
    return true;
}
```

<details><summary>Show solution</summary>

When the last element leaves, `front` becomes `NULL` but `rear` still points to the freed node. The next `queue_enqueue` sees `rear != NULL` and runs `queue->rear->next = node`: it writes into freed memory (`heap-use-after-free`), and the new node is unreachable because `front` is still `NULL`. The invariant has to be restored:

```c
    queue->front = old->next;
    if (queue->front == NULL) {
        queue->rear = NULL;
    }
```

</details>

### Exercise 3: a circular array that grows

Write `bool circular_grow(CircularQueue *queue)`, which doubles the capacity by allocating a new array and copying the elements in order, starting at the front. Why is `realloc` not enough? Test it in a complete program.

<details><summary>Show solution</summary>

With `realloc`, the elements that wrapped around (the ones in the low slots, past the physical end of the array) would end up before the front instead of after it. Copying in logical order puts the front at slot 0:

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int *data;
    size_t capacity;
    size_t start;
    size_t count;
} CircularQueue;

// Doubles the capacity. Returns false if out of memory (the queue is unchanged).
bool circular_grow(CircularQueue *queue) {
    size_t new_capacity = queue->capacity == 0 ? 4 : queue->capacity * 2;
    int *new_data = malloc(new_capacity * sizeof *new_data);
    if (new_data == NULL) {
        return false;
    }
    for (size_t i = 0; i < queue->count; i++) {
        new_data[i] = queue->data[(queue->start + i) % queue->capacity];
    }
    free(queue->data);   // the old array is no longer used
    queue->data = new_data;
    queue->capacity = new_capacity;
    queue->start = 0;
    return true;
}

bool circular_enqueue(CircularQueue *queue, int value) {
    if (queue->count == queue->capacity && !circular_grow(queue)) {
        return false;
    }
    queue->data[(queue->start + queue->count) % queue->capacity] = value;
    queue->count++;
    return true;
}

bool circular_dequeue(CircularQueue *queue, int *value) {
    if (queue->count == 0) {
        return false;
    }
    *value = queue->data[queue->start];
    queue->start = (queue->start + 1) % queue->capacity;
    queue->count--;
    return true;
}

int main(void) {
    CircularQueue queue = {NULL, 0, 0, 0};
    int value;

    for (int i = 1; i <= 4; i++) {
        circular_enqueue(&queue, i);
    }
    circular_dequeue(&queue, &value);   // 1 leaves; start = 1
    for (int i = 5; i <= 9; i++) {      // wraps around, then grows
        if (!circular_enqueue(&queue, i)) {
            free(queue.data);
            return 1;
        }
    }
    while (circular_dequeue(&queue, &value)) {
        printf("%d ", value);             // 2 3 4 5 6 7 8 9
    }
    printf("(capacity %zu)\n", queue.capacity);
    free(queue.data);
    return 0;
}
```

</details>
