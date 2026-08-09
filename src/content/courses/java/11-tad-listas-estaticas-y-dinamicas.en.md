---
course: 'java'
slug: '11-tad-listas-estaticas-y-dinamicas'
title: 'ADT List: Static, Dynamic, and Linked Lists'
description: 'Understand Abstract Data Type (ADT) concept and implement static, dynamic, circular, and doubly linked lists.'
order: 11
lang: 'en'
published: true
---

# ADT List: Static, Dynamic, and Linked Lists

## 1. What is an ADT?
Separation of specification from concrete heap/array memory implementation.

## 2. Singly Linked List Implementation
```java
public class Node {
    int data;
    Node next;
    public Node(int data) { this.data = data; }
}
```

## 3. Hands-on Exercise
Implement a `remove(int data)` method for the linked list.
