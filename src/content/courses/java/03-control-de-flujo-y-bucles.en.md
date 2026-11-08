---
course: 'java'
slug: '03-control-de-flujo-y-bucles'
title: 'Control Flow and Loops'
description: 'Learn to make decisions with conditionals and repeat tasks using loops in Java.'
order: 3
lang: 'en'
published: true
---

# Control Flow and Loops

Control flow structures allow you to alter the execution path of a program based on conditions or repeat a block of code multiple times.

## 1. Conditionals: `if`, `else if`, `else`

Execute code only when a logical condition is met:

```java
int score = 85;

if (score >= 90) {
    System.out.println("Excellent");
} else if (score >= 70) {
    System.out.println("Passed");
} else {
    System.out.println("Failed");
}
```

### Ternary Operator
Short syntax for simple conditional assignments:
```java
String status = (score >= 70) ? "Passed" : "Failed";
```

## 2. The `switch` Statement

Ideal when evaluating multiple possible discrete values of a variable.

```java
int day = 3;

switch (day) {
    case 1:
        System.out.println("Monday");
        break;
    case 2:
        System.out.println("Tuesday");
        break;
    case 3:
        System.out.println("Wednesday");
        break;
    default:
        System.out.println("Invalid day");
        break;
}
```

> **Modern Java (Switch Expressions):**
> ```java
> String dayName = switch (day) {
>     case 1 -> "Monday";
>     case 2 -> "Tuesday";
>     case 3 -> "Wednesday";
>     default -> "Invalid day";
> };
> ```

> **Modern Java (Arrow switch to run actions):**
> The `->` syntax also works when you don't want to return a value but run an action for each case. No `break` is needed: each case runs only its own statement, without falling through to the next one. It's very common in console menus:
> ```java
> switch (option) {
>     case 1 -> loadPerson(scanner, people);
>     case 2 -> listPeople(people);
>     case 0 -> System.out.println("End of program");
>     default -> System.out.println("Invalid option. Choose 0, 1 or 2.");
> }
> ```
> If a case needs more than one statement, use a block: `case 1 -> { ... }`.

## 3. Loops and Iteration

### `for` Loop
Used when the number of iterations is known in advance:

```java
for (int i = 1; i <= 5; i++) {
    System.out.println("Iteration number: " + i);
}
```

### `while` Loop
Evaluates the condition **before** executing the block:

```java
int count = 0;
while (count < 3) {
    System.out.println("Count: " + count);
    count++;
}
```

### `do-while` Loop
Guarantees the block runs **at least once**, as the condition is evaluated at the end:

```java
int number = 10;
do {
    System.out.println("Runs at least once");
} while (number < 5);
```

## 4. Loop Control: `break` and `continue`

- `break`: Immediately exits the loop.
- `continue`: Skips the current iteration and jumps to the next.

```java
for (int i = 1; i <= 10; i++) {
    if (i == 5) continue; // Skips 5
    if (i == 8) break;    // Stops loop at 8
    System.out.print(i + " "); // Output: 1 2 3 4 6 7
}
```

## 5. Hands-on Exercise
Write a Java program using a loop to calculate the sum of all even numbers between 1 and 100, and print the total.

---

## Go deeper with real code

You can reinforce this lesson by browsing complete, runnable programs in the course repository: [l03_control_de_flujo_y_bucles](https://github.com/facundouferer/CursoDeJava/tree/main/src/CursoJava/l03_control_de_flujo_y_bucles).

There you will find 43 solved exercises: `if`, `if-else` and nested conditions, the ternary operator, `switch`, and the `for`, `while`, `do-while` and `for-each` loops, applied to problems such as prime numbers, digit sums, discounts, salaries and password validation.

Clone the repository, open the folder and run each program while you read the lesson to see every concept in action.
