---
course: 'java'
slug: '02-variables-tipos-datos-y-operadores'
title: 'Variables, Data Types, and Operators'
description: 'Master primitive types, reference types, type casting, and operators in Java.'
order: 2
lang: 'en'
published: true
---

# Variables, Data Types, and Operators

In Java, every data value has a clearly defined type. Java is a **statically typed** language, meaning that every variable's type must be explicitly declared and cannot change during execution.

## 1. Variable and Constant Declaration

A variable is a reserved memory space for storing information.

```java
// Declaration and initialization
int age = 25;
double price = 99.99;
boolean isStudent = true;
char initial = 'F';

// Constant (value cannot be changed after assignment)
final double PI = 3.14159;
```

## 2. Scope, visibility, and lifetime

**Scope** is the region of code where a name can be used. **Visibility** answers from which lines that name is accessible; **lifetime** states how long its value exists during execution. These concepts are related but not identical.

Java uses lexical scopes defined by classes, methods, and `{ }` blocks. **There are no free global variables in Java**: every value declared outside a method belongs to a class or to an instance of that class.

| Category | Declaration | Visibility | Lifetime | Initialization |
| :--- | :--- | :--- | :--- | :--- |
| **Local variable** | Inside a method | From its declaration to the end of its block | During that invocation and block | Has no default value; definite assignment is required. |
| **Block-scope variable** | Inside an `if`, `for`, `while`, or explicit block | Only inside that block | Until the block ends | Same rule as any local variable. |
| **Parameter** | In a method or constructor signature | Throughout that method body | During the invocation | Receives the argument value. |
| **Instance field** | In the class, without `static` | According to its access modifier | While the object remains reachable | Receives a default value if not assigned. |
| **Class field** | In the class, with `static` | According to its access modifier | From class loading onward | Receives a default value if not assigned. |

Numeric fields receive `0`, booleans receive `false`, and references receive `null`. This does not mean those values are valid for the domain: a constructor should explicitly establish required state.

### Complete example and shadowing

```java
public final class Account {
    private static int accountCount = 0; // Class field
    private int balance;                 // Instance field

    public Account(int balance) {        // Parameter
        if (balance < 0) {
            System.out.println("Invalid balance, used 0 by default.");
            balance = 0;
        }
        this.balance = balance;          // this.balance selects the field
        accountCount++;
    }

    public void credit(int amount) {
        if (amount <= 0) {
            System.out.println("Invalid amount, nothing was credited.");
            return;
        }
        int previousBalance = balance;   // Local variable
        balance += amount;

        if (balance < previousBalance) {
            System.out.println("Overflow detected, the operation was discarded.");
            balance = previousBalance;
        }
    }
}
```

The `balance` parameter **shadows** the field with the same name. `this.balance` explicitly selects the instance field. Shadowing is legal, but overusing it makes it harder to see which value changes.

A block also limits names:

```java
if (age >= 18) {
    String message = "Access granted";
    System.out.println(message);
}
// System.out.println(message); // Does not compile: message is not visible here.
```

### Initialization rules and clear failures

Java applies **definite assignment** to locals: the compiler must prove that they received a value before they are read.

```java
int result;
// System.out.println(result); // Does not compile: it may be uninitialized.

int safeResult = 0; // Correct only when 0 is a valid domain value.
```

Do not add an arbitrary default merely to silence the compiler without saying so. If required data is missing, validate it explicitly: print a notice and use a documented default value, as the `Account` constructor does. For optional data, choose and document a genuinely neutral value.

---

## 3. Primitive Types vs. Reference Types

Java categorizes data types into two main groups:

### Primitive Types (Store direct values)
| Type | Size | Range / Example |
| --- | --- | --- |
| `byte` | 8 bits | -128 to 127 |
| `short` | 16 bits | -32,768 to 32,767 |
| `int` | 32 bits | -2,147,483,648 to 2,147,483,647 |
| `long` | 64 bits | Large integers (e.g., `10000000000L`) |
| `float` | 32 bits | Single-precision floating point (e.g., `3.14f`) |
| `double` | 64 bits | Double-precision floating point (e.g., `3.14159265`) |
| `boolean` | 1 bit | `true` or `false` |
| `char` | 16 bits | Single Unicode character (e.g., `'A'`) |

### Reference Types (Store memory addresses to objects)
Examples: `String`, Arrays, and any custom class.

```java
String name = "Facundo"; // Reference to a String object
```

## 4. Type Casting

- **Implicit Casting (Widening)**: Smaller type to larger type (automatic).
  ```java
  int intValue = 10;
  double doubleValue = intValue; // 10.0
  ```
- **Explicit Casting (Narrowing)**: Larger type to smaller type (requires `(type)` syntax).
  ```java
  double exactPrice = 45.89;
  int roundedPrice = (int) exactPrice; // 45 (loses fractional part)
  ```

## 5. Java Operators

### Arithmetic Operators
`+`, `-`, `*`, `/`, `%` (modulus / remainder).
```java
int a = 10;
int b = 3;
int quotient = a / b; // 3
int remainder = a % b; // 1
```

### Relational and Logical Operators
- Relational: `==`, `!=`, `>`, `<`, `>=`, `<=`
- Logical: `&&` (AND), `||` (OR), `!` (NOT)

```java
boolean isAdult = age >= 18;
boolean canAccess = isAdult && isStudent;
```

## 6. Hands-on Exercise
Write a program that declares the grades for three exams of a student, calculates their average using floating-point numbers (`double`), and prints whether the student passed (average >= 6.0) using a boolean expression.
