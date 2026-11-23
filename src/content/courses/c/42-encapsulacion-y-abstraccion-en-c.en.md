---
title: 'Encapsulation and Opaque Types'
course: 'c'
slug: 'encapsulacion-y-abstraccion-en-c'
description: 'Hide the internal layout of a struct using forward declarations and opaque pointers in the .h header while exposing only its public interface.'
order: 42
lang: 'en'
published: true
---

In the previous lesson the account had a problem: any code that could see the definition of `struct Account` could write `account.balance_cents = -500;` and skip the rules. C has no `private`. What it does have is a technique used by real libraries: the **opaque type**. With it, code that uses the type **cannot** touch its fields, because it does not even know them.

## Objectives

- Define **encapsulation** and **abstraction** in terms of design in C.
- Declare an **opaque type** with `typedef struct Account Account;` in the `.h` and define the structure only in the `.c`.
- Write creation and destruction functions and document the object's ownership.
- Make the interface guarantee the type's **invariants**.
- Hide helper functions with `static`.
- Know the cost of this technique.

**Prerequisites:** `modularizacion-subprogramas-y-funciones` (`.h`/`.c`, include guards, `static`), `introduccion-a-poo-en-c`, `memoria-dinamica` and `propiedad-y-errores-de-memoria`.

## Encapsulation and abstraction

- **Encapsulation:** grouping data with the operations that modify it, and making sure **only** those operations can modify it.
- **Abstraction:** the user of the type thinks about **what it can do**, not about **how it is made**.

In C you get both with the separation you know from lesson 15: the **interface** in the `.h` and the **implementation** in the `.c`. The new step is hiding the `struct` definition as well.

## Incomplete types

C lets you declare a structure without saying which fields it has:

```c
struct Account;   /* declaration: it exists, but its contents are unknown */
```

Until the definition appears, `struct Account` is an **incomplete type**. With an incomplete type you can:

- declare pointers: `struct Account *a;`
- pass and return those pointers in functions.

But you **cannot**:

- declare variables of that type (`struct Account a;`), because the compiler does not know its size;
- use `sizeof(struct Account)`;
- access its fields (`a->balance`).

That limitation is exactly what we want: code that only sees the declaration can handle accounts through pointers, but cannot look inside.

## An account with an opaque type

The example has three files. It is a multi-file program, so you build it as in lesson 15.

### The interface: `account.h`

```c
#ifndef ACCOUNT_H
#define ACCOUNT_H

#include <stdbool.h>

/* Opaque type: the fields are known only in account.c. */
typedef struct Account Account;

/* Creates an account with a copy of owner and initial_balance in cents.
   Ownership: the caller owns the result and must free it
   with account_destroy. Returns NULL if the data is not valid
   or if there is no memory. */
Account *account_create(const char *owner, long long initial_balance);

/* Frees the account and everything it holds. Accepts NULL. */
void account_destroy(Account *account);

/* Return false (and change nothing) if the amount is not valid. */
bool account_deposit(Account *account, long long amount);
bool account_withdraw(Account *account, long long amount);

long long account_balance(const Account *account);

/* Returns a borrowed pointer: valid while the account exists.
   Do not free it. */
const char *account_owner(const Account *account);

#endif
```

`typedef struct Account Account;` does two things at once: it declares `struct Account` as an incomplete type and gives it the short name `Account`. Code that includes this header can only use `Account *`.

Every function documents its **ownership**, as you learned in `propiedad-y-errores-de-memoria`: who frees the result of `account_create` (the caller, with `account_destroy`) and what is just a loan (`account_owner`).

### The implementation: `account.c`

```c
#include "account.h"

#include <stdlib.h>
#include <string.h>

/* The complete definition lives only here. */
struct Account {
    char *owner;
    long long balance_cents;   /* invariant: never negative */
};

/* Private helper: static makes it invisible outside this file. */
static bool valid_amount(long long amount) {
    return amount > 0;
}

static char *copy_text(const char *text) {
    size_t length = strlen(text) + 1;
    char *copy = malloc(length);
    if (copy != NULL) {
        memcpy(copy, text, length);
    }
    return copy;
}

Account *account_create(const char *owner, long long initial_balance) {
    if (owner == NULL || initial_balance < 0) {
        return NULL;
    }
    Account *account = malloc(sizeof *account);
    if (account == NULL) {
        return NULL;
    }
    account->owner = copy_text(owner);
    if (account->owner == NULL) {
        free(account);   /* do not leave a half-built account */
        return NULL;
    }
    account->balance_cents = initial_balance;
    return account;
}

void account_destroy(Account *account) {
    if (account == NULL) {
        return;
    }
    free(account->owner);   /* first what it holds */
    free(account);          /* then the object */
}

bool account_deposit(Account *account, long long amount) {
    if (!valid_amount(amount)) {
        return false;
    }
    account->balance_cents += amount;
    return true;
}

bool account_withdraw(Account *account, long long amount) {
    if (!valid_amount(amount) || amount > account->balance_cents) {
        return false;
    }
    account->balance_cents -= amount;
    return true;
}

long long account_balance(const Account *account) {
    return account->balance_cents;
}

const char *account_owner(const Account *account) {
    return account->owner;
}
```

> **Basic C:** copying a string with `malloc`, `strlen` and `memcpy` works in every version of the standard.
>
> **Modern C (C23):** `strdup` became part of `<string.h>` in C23 and makes that same copy.
>
> **Portability:** before C23, `strdup` came from POSIX, not ISO C; some compilers do not declare it in strict mode. That is why the example uses its own `copy_text` function.

### The program: `main.c`

```c
#include <stdio.h>

#include "account.h"

int main(void) {
    Account *account = account_create("Ana", 10000);
    if (account == NULL) {
        fprintf(stderr, "Could not create the account\n");
        return 1;
    }

    account_deposit(account, 2550);
    if (!account_withdraw(account, 50000)) {
        printf("Withdrawal rejected\n");
    }
    printf("%s has %lld cents\n", account_owner(account), account_balance(account));

    account_destroy(account);
    return 0;
}
```

### Build and check memory

```bash
gcc -std=c23 -Wall -Wextra -Wpedantic -g -c account.c
gcc -std=c23 -Wall -Wextra -Wpedantic -g -c main.c
gcc account.o main.o -o account
./account
```

Output:

```text
Withdrawal rejected
Ana has 12550 cents
```

To check that there are no leaks or invalid accesses, build everything together with AddressSanitizer:

```bash
gcc -std=c23 -Wall -Wextra -Wpedantic -g -fsanitize=address account.c main.c -o account
./account
```

If everything is right, the output is the same and AddressSanitizer reports nothing.

## What the compiler no longer allows

If `main.c` tries to look inside the account, the program does not compile:

<!-- c-check: skip -->
```c
#include "account.h"

int main(void) {
    Account copy;                    /* error: incomplete type */
    Account *a = account_create("Ana", 0);
    a->balance_cents = -500;         /* error: incomplete type */
    account_destroy(a);
    return 0;
}
```

Now the rule "the balance is never negative" does not depend on the goodwill of the type's user: the compiler blocks direct access, and every modification goes through `account_deposit` and `account_withdraw`, which check it.

## Invariants guaranteed by the interface

An **invariant** is a condition that holds whenever the object is available to its user. For `Account`:

- `owner` points to a valid string owned by the account;
- `balance_cents >= 0`.

With an opaque type, checking that an invariant holds only requires reviewing **one file**:

1. `account_create` establishes it (it rejects a negative initial balance and never returns a half-built account).
2. Every operation keeps it (it rejects amounts that would break it).
3. `account_destroy` frees everything, in the reverse order of allocation.

If tomorrow you replace `balance_cents` with another representation, only `account.c` changes. `main.c` never notices: that is abstraction.

## `static`: private functions of the module

`valid_amount` and `copy_text` are internal details. Declaring them `static` gives them **internal linkage**: they exist only inside `account.c`, they do not appear in the `.h`, and another file can have its own function with the same name without a link conflict. It is the closest thing C has to a "private method".

## The cost of opaque types

This technique is not free:

- **Dynamic memory is mandatory:** since the user does not know the size, they cannot declare an `Account` on the stack; every object goes through `malloc` and needs its `account_destroy`.
- **One call per access:** even reading the balance requires a function. The compiler usually cannot inline it from another file.
- **More code:** creation, destruction, queries.

It is worth it when the type has invariants to protect or when its representation may change. For a `struct Point { double x, y; }` with no rules, a visible structure is simpler and faster.

## Summary

- **Encapsulation**: data changes only through its operations. **Abstraction**: the user sees what the type does, not how.
- An **opaque type** is declared with `typedef struct Account Account;` in the `.h`; the complete definition stays in the `.c`.
- With an incomplete type you only handle pointers: no variables, no `sizeof`, no field access.
- Creation and destruction functions document ownership; destruction accepts `NULL` and frees in reverse order.
- The interface guarantees the invariants; `static` helpers stay private to the module.
- The cost: dynamic memory, one call per access and more code.

## Practice exercises

### Exercise 1: what compiles?

A file `main.c` includes only `account.h`. Which of these lines compile?

1. `Account *a = NULL;`
2. `Account a;`
3. `size_t n = sizeof(Account);`
4. `printf("%lld\n", account_balance(a));` (with `a` of type `Account *`)

<details><summary>Show solution</summary>

Lines 1 and 4 compile: with an incomplete type you can declare pointers and pass them to functions. Lines 2 and 3 do not compile because the compiler does not know the size of `struct Account` outside `account.c`.

</details>

### Exercise 2: find the bug

What is wrong with this use of the account, and how do you fix it?

```c
#include <stdio.h>
#include <stdlib.h>

#include "account.h"

int main(void) {
    Account *a = account_create("Luis", 500);
    if (a == NULL) {
        return 1;
    }
    const char *name = account_owner(a);
    free(a);
    printf("%s\n", name);
    return 0;
}
```

<details><summary>Show solution</summary>

`free(a)` frees only the account's block and leaves the owner's copy unfreed: a leak. The user of an opaque type does not know what it holds, so they must never free it with `free`; that is what `account_destroy` is for.

But replacing `free(a)` with `account_destroy(a)` without moving anything introduces another bug: `name` is a **borrowed** pointer that stops being valid when the account is destroyed, and the later `printf` would be a use after free. The complete fix is to use `name` first and destroy with the module's function:

```c
    const char *name = account_owner(a);
    printf("%s\n", name);
    account_destroy(a);
```

</details>

### Exercise 3: an opaque counter

Write a module `counter.h`/`counter.c` with an opaque type `Counter` that counts from 0 up to a maximum set at creation. Operations: `counter_create(maximum)` (returns `NULL` if `maximum <= 0`), `counter_destroy`, `counter_increment` (returns `false` if it already reached the maximum) and `counter_value`.

<details><summary>Show solution</summary>

`counter.h`:

```c
#ifndef COUNTER_H
#define COUNTER_H

#include <stdbool.h>

typedef struct Counter Counter;

/* Ownership: the caller frees the result with counter_destroy. */
Counter *counter_create(int maximum);
void counter_destroy(Counter *counter);
bool counter_increment(Counter *counter);
int counter_value(const Counter *counter);

#endif
```

`counter.c`:

```c
#include "counter.h"

#include <stdlib.h>

struct Counter {
    int value;     /* invariant: 0 <= value <= maximum */
    int maximum;
};

Counter *counter_create(int maximum) {
    if (maximum <= 0) {
        return NULL;
    }
    Counter *counter = malloc(sizeof *counter);
    if (counter == NULL) {
        return NULL;
    }
    counter->value = 0;
    counter->maximum = maximum;
    return counter;
}

void counter_destroy(Counter *counter) {
    free(counter);   /* free(NULL) does nothing */
}

bool counter_increment(Counter *counter) {
    if (counter->value >= counter->maximum) {
        return false;
    }
    counter->value++;
    return true;
}

int counter_value(const Counter *counter) {
    return counter->value;
}
```

`main.c`:

```c
#include <stdio.h>

#include "counter.h"

int main(void) {
    Counter *c = counter_create(3);
    if (c == NULL) {
        return 1;
    }
    for (int i = 0; i < 5; i++) {
        if (!counter_increment(c)) {
            printf("Maximum reached\n");
        }
    }
    printf("Value: %d\n", counter_value(c));
    counter_destroy(c);
    return 0;
}
```

Build it with `gcc -std=c23 -Wall -Wextra -Wpedantic counter.c main.c -o counter`. It prints `Maximum reached` twice and then `Value: 3`.

</details>

### Exercise 4: choosing the representation

You want `account_owner` to always return the name in uppercase, without changing `main.c`. Which files do you have to modify, and why?

<details><summary>Show solution</summary>

Only `account.c`: for example, convert the copy to uppercase inside `account_create`. The interface in `account.h` does not change, and since `main.c` does not know the representation, it keeps working unchanged. That independence is the benefit of abstraction.

</details>
