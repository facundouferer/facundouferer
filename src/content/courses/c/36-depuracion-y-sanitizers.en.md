---
title: 'Debugging, warnings and sanitizers'
course: 'c'
slug: 'depuracion-y-sanitizers'
description: 'Apply a systematic method to reproduce and isolate bugs using GDB or LLDB, debug symbols (-g), AddressSanitizer and UndefinedBehaviorSanitizer.'
order: 36
lang: 'en'
published: true
---

Every real program has bugs. The difference between losing an afternoon and losing ten minutes is not "being lucky", but having a **method** and knowing how to use the tools the compiler already gives you: warnings, the debugger and the sanitizers. In this lesson you learn all three, in that order.

## Objectives

- Apply a debugging method: **reproduce**, **isolate**, form a hypothesis, fix and verify with a regression check.
- Use compiler warnings as your first debugger (`-Wall -Wextra -Wpedantic`, `-Werror` and useful extras such as `-Wconversion` and `-Wshadow`).
- Compile with `-g` and walk through a program with GDB or LLDB: breakpoints, stepping line by line, inspecting variables, the call stack and watchpoints.
- Detect memory errors with AddressSanitizer and undefined behavior with UndefinedBehaviorSanitizer, and read their reports.
- Use `printf` and `assert` as complements.

**Prerequisites:** `compilacion-y-enlazado` (warnings and the course command line), `operadores` (undefined behavior), `recursividad` (the call stack), `propiedad-y-errores-de-memoria` (AddressSanitizer) and `biblioteca-estandar-y-errores` (return codes and `errno`).

## A method before a tool

Changing lines at random "to see if it works" is the slowest way to debug. The professional method has five steps:

1. **Reproduce.** Find an input and a way of running the program that shows the bug **every time**. A bug you cannot reproduce is a bug you cannot confirm as fixed. Write down the exact input, the arguments, and the expected versus actual result.
2. **Isolate.** Shrink the problem: remove inputs, functions and lines that do not matter until you have the smallest case that still fails. Often, while isolating it, the bug becomes obvious.
3. **Form a hypothesis.** "I think the loop reads one position too many because the condition uses `<=`." A concrete hypothesis can be checked with the debugger, a `printf` or a sanitizer.
4. **Fix.** Change **one** thing, the one the hypothesis points to. If you change five things at once, you will not know which one fixed the bug (or which one broke something else).
5. **Verify.** Run the case that reproduced the bug again and check that it now gives the expected result. Then turn it into a **regression check**: a case that runs every time you change the program, so the bug cannot come back without you noticing. In `pruebas-estilo-y-portabilidad` you will see how to automate it.

The tools in this lesson help mostly with steps 2 and 3: they show you **where** and **why** the program fails.

## Warnings: the first debugger

The compiler reads every line of your program. When something is legal but suspicious, it says so with a **warning**. In `compilacion-y-enlazado` you adopted the course command line:

```bash
gcc -std=c23 -Wall -Wextra -Wpedantic program.c -o program
```

- `-Wall` turns on the most useful warnings (despite the name, they are not "all" of them).
- `-Wextra` adds another group, such as comparing signed and unsigned integers or unused parameters.
- `-Wpedantic` warns when you use something that is not standard C (compiler extensions).

This program compiles, but it has three bugs:

<!-- c-check: skip -->
```c
#include <stdio.h>

int count_tens(int grades[], int count) {
    int tens;
    for (int i = 0; i < count; i++) {
        if (grades[i] = 10) {
            tens++;
        }
    }
    return tens;
}

int main(void) {
    int grades[] = {4, 10, 7};
    size_t count = sizeof grades / sizeof grades[0];
    for (int i = 0; i < count; i++) {
        printf("%d\n", grades[i]);
    }
    printf("Tens: %d\n", count_tens(grades, 3));
    return 0;
}
```

Clang finds all of them without running anything:

```
warnings.c:6:23: warning: using the result of an assignment as a condition without parentheses [-Wparentheses]
warnings.c:7:13: warning: variable 'tens' is uninitialized when used here [-Wuninitialized]
warnings.c:16:23: warning: comparison of integers of different signs: 'int' and 'size_t' (aka 'unsigned long') [-Wsign-compare]
```

1. `grades[i] = 10` **assigns** instead of comparing: every grade becomes 10 and the condition is always true. It should be `==`.
2. `tens` starts with an indeterminate value: `= 0` is missing.
3. `i` is an `int` and `count` is a `size_t`: the comparison converts `i` to unsigned. It does not fail here, but with negative numbers it would give surprising results. The fix is to declare `size_t i`.

Each warning points to the file, line and column, and between brackets it names the option that enabled it. Read them **from first to last**: sometimes a single cause produces several.

### `-Werror`: do not let a warning slip by

With `-Werror` every warning becomes an error and no program is produced. It is the way to avoid getting used to ignoring them. In this course, the automatic check of the examples uses exactly `-std=c23 -Wall -Wextra -Wpedantic -Werror`.

### Useful extras: `-Wconversion` and `-Wshadow`

They are not part of `-Wall -Wextra`, but they catch common bugs:

<!-- c-check: skip -->
```c
#include <stdio.h>

int main(void) {
    double price = 19.99;
    int whole = price;             // the decimals are lost silently
    int total = 0;
    {
        int total = whole * 2;     // another variable with the same name
        printf("%d\n", total);
    }
    printf("%d\n", total);         // prints 0: the "outer" total
    return 0;
}
```

```bash
gcc -std=c23 -Wall -Wextra -Wpedantic -Wconversion -Wshadow conv.c -o conv
```

```
conv.c:5:17: warning: implicit conversion turns floating-point number into integer: 'double' to 'int' [-Wfloat-conversion]
conv.c:8:13: warning: declaration shadows a local variable [-Wshadow]
```

- `-Wconversion` warns about implicit conversions that may lose information (you saw them in `tipos-de-datos`). The fix is to make the conversion explicit, `(int)price`, if that is what you want.
- `-Wshadow` warns when a variable **hides** another one with the same name from an outer block (`sentencia-switch-y-bloques-de-codigo`).

`-Wconversion` can be noisy on existing code; it is best turned on from the start of a new project.

> **Portability:** the `-W...` options belong to GCC and Clang, not to the C standard, and each compiler has its own set (some messages and names differ between the two). MSVC uses another syntax (`/W4`, `/WX`). The standard only requires a **diagnostic** for certain errors; everything else is help from the compiler.

Warnings do not find everything. The next program compiles **without a single warning** and yet it is wrong.

## A bug the compiler cannot see

```c
#include <stdio.h>

double average(const int grades[], size_t count) {
    int sum = 0;
    for (size_t i = 0; i <= count; i++) {
        sum += grades[i];
    }
    return (double)sum / count;
}

int main(void) {
    int grades[] = {7, 8, 10, 6};
    size_t count = sizeof grades / sizeof grades[0];
    printf("Average: %.2f\n", average(grades, count));
    return 0;
}
```

The average of 7, 8, 10 and 6 is 7.75, but the program prints something like:

```
Average: -43413400.25
```

The value changes from one run to the next and from one machine to another. **Reproducing** it is easy: it always fails with these four grades. **Isolating** it is easy too: `main` only calls `average`, so the problem is there. To find the exact line we use the debugger.

## The debugger: GDB and LLDB

A **debugger** runs your program under its control: you can stop it at a line, advance one statement at a time, look at the value of each variable and at the call stack. The two most used with C are:

- **GDB**, from the GNU project, common on Linux.
- **LLDB**, from the LLVM project, the one that ships with Apple's developer tools on macOS (it is also available on Linux).

### Compiling for debugging: `-g` and `-O0`

```bash
gcc -std=c23 -Wall -Wextra -Wpedantic -g -O0 average.c -o average
```

- `-g` stores **debug information** inside the executable: which instruction belongs to which line and where each variable lives. Without `-g`, the debugger only sees machine addresses.
- `-O0` turns optimizations off. With optimizations, the compiler reorders or removes code and variables, and the debugger shows strange jumps or `<optimized out>`. For debugging, use `-O0`.

### The essential commands

| To... | GDB | LLDB |
| --- | --- | --- |
| Open the program | `gdb ./average` | `lldb ./average` |
| Set a breakpoint on a function | `break average` | `break set --name average` (or `b average`) |
| Breakpoint on a line | `break average.c:6` | `break set --file average.c --line 6` (or `b average.c:6`) |
| Run | `run` | `run` |
| Next line, without entering functions | `next` (`n`) | `next` (`n`) |
| Next line, entering functions | `step` (`s`) | `step` (`s`) |
| Show a variable or expression | `print i` (`p i`) | `print i` (`p i`) |
| Show the call stack | `backtrace` (`bt`) | `thread backtrace` (`bt`) |
| Move up / down one frame | `up` / `down` / `frame 1` | `up` / `down` / `frame select 1` |
| Stop when a variable changes | `watch sum` | `watchpoint set variable sum` |
| Finish the current function and show its return value | `finish` | `finish` |
| Continue to the next breakpoint | `continue` (`c`) | `continue` (`c`) |
| Quit | `quit` | `quit` |

The difference between `next` and `step` matters: on a line that calls a function, `next` runs the whole call and stops at the following line; `step` goes **into** the function.

Each active call takes a **frame** on the stack, as you saw in `recursividad`. `backtrace` lists them from the most recent to the oldest; `up` and `down` move you between them to inspect the caller's local variables.

### A guided session with GDB

Initial hypothesis: "the loop adds something that is not a grade". To check it, we stop at the line of the sum only when `i` reaches `count`, which is exactly the value it should never reach. That is a **conditional breakpoint**:

```
$ gdb ./average
(gdb) break average.c:6 if i == count
Breakpoint 1 at 0x1175: file average.c, line 6.
(gdb) run
Starting program: /home/ana/average

Breakpoint 1, average (grades=0x7fffffffe0b0, count=4) at average.c:6
6	        sum += grades[i];
(gdb) print i
$1 = 4
(gdb) print grades[0]@count
$2 = {7, 8, 10, 6}
(gdb) print grades[i]
$3 = -43413431
```

The program reached line 6 with `i == 4`. The array has four elements (`grades[0]@count` shows `count` elements starting at `grades[0]`), so `grades[4]` is **out of bounds**: the value being added is garbage. The hypothesis is confirmed, and it points to the condition `i <= count`.

We can also see who called and with what data:

```
(gdb) backtrace
#0  average (grades=0x7fffffffe0b0, count=4) at average.c:6
#1  0x00005555555551d4 in main () at average.c:14
(gdb) up
#1  0x00005555555551d4 in main () at average.c:14
14	    printf("Average: %.2f\n", average(grades, count));
(gdb) print grades
$4 = {7, 8, 10, 6}
(gdb) down
#0  average (grades=0x7fffffffe0b0, count=4) at average.c:6
6	        sum += grades[i];
(gdb) finish
Run till exit from #0  average (grades=0x7fffffffe0b0, count=4) at average.c:6
0x00005555555551d4 in main () at average.c:14
14	    printf("Average: %.2f\n", average(grades, count));
Value returned is $5 = -10853350.25
(gdb) quit
```

`finish` completes `average` and shows the returned value: it confirms the result is already wrong when it leaves the function. The addresses and the garbage value change on every machine; what matters is `i = 4` against an array of 4 elements.

A **watchpoint** stops the program every time a variable changes, without you knowing in advance on which line:

```
(gdb) break average
(gdb) run
(gdb) watch sum
Hardware watchpoint 2: sum
(gdb) continue
Hardware watchpoint 2: sum

Old value = 0
New value = 7
average (grades=0x7fffffffe0b0, count=4) at average.c:5
```

It is useful when "something" modifies a variable and you do not know what.

### The same session with LLDB

```
$ lldb ./average
(lldb) break set --file average.c --line 6 --condition 'i == count'
Breakpoint 1: where = average`average + 52 at average.c:6:16
(lldb) run
Process 51302 stopped
* thread #1, stop reason = breakpoint 1.1
    frame #0: average`average(grades=0x000000016fdff0e0, count=4) at average.c:6:16
(lldb) print i
(size_t) 4
(lldb) print grades[i]
(const int) -43413431
(lldb) bt
* thread #1, stop reason = breakpoint 1.1
  * frame #0: average`average(grades=0x000000016fdff0e0, count=4) at average.c:6:16
    frame #1: average`main at average.c:14:31
(lldb) up
(lldb) print grades
(int[4]) ([0] = 7, [1] = 8, [2] = 10, [3] = 6)
(lldb) quit
```

The short commands (`b`, `n`, `s`, `p`, `bt`, `c`) are the same in both debuggers, so what you learn in one works in the other.

> **Portability:** on macOS, `gcc` is actually Clang and GDB is not installed; use LLDB. The first time you debug, macOS may ask for permission to let the debugger control processes. On Linux, GDB is usually in the package manager (`gdb`), and so is LLDB (`lldb`). Neither of them is part of the C standard.

### The fix and the verification

Line 5 must walk the indices `0` to `count - 1`:

```c
for (size_t i = 0; i < count; i++) {
```

Verify: compile again, run with the same grades and check `Average: 7.75`. Regression check: keep this case (four grades, average 7.75) to run it again after every change. And a boundary case the fix reveals: with `count == 0`, `average` would divide by zero; the function should document that it requires `count > 0` or handle that case.

## AddressSanitizer: memory errors at run time

In `propiedad-y-errores-de-memoria` you used **AddressSanitizer** (ASan) to find use after free, double free and leaks on the heap. It also detects out-of-bounds accesses on **automatic** arrays (on the stack). With the original `average` program:

```bash
gcc -std=c23 -Wall -Wextra -Wpedantic -g -O0 -fsanitize=address average.c -o average
./average
```

```
==51267==ERROR: AddressSanitizer: stack-buffer-overflow on address 0x00016eef9e30 at pc 0x000100f04884 bp 0x00016eef9d90 sp 0x00016eef9d88
READ of size 4 at 0x00016eef9e30 thread T0
    #0 0x000100f04880 in average average.c:6
    #1 0x000100f04a1c in main average.c:14

Address 0x00016eef9e30 is located in stack of thread T0 at offset 48 in frame
    #0 0x000100f048e8 in main average.c:11

  This frame has 1 object(s):
    [32, 48) 'grades' (line 12) <== Memory access at offset 48 overflows this variable
SUMMARY: AddressSanitizer: stack-buffer-overflow average.c:6 in average
```

With no debugger and no prior hypothesis, the report says:

1. **What:** `stack-buffer-overflow`, a read (`READ of size 4`, one `int`) outside an array on the stack.
2. **Where:** in `average`, `average.c:6`, called from `main`, line 14.
3. **On which object:** `grades`, declared on line 12, which takes bytes `[32, 48)` of `main`'s frame; the access was at byte 48, **right after the end**.

Below it there is a map of "shadow bytes" you can ignore at first: it is the internal representation ASan uses to know which bytes are valid.

The ASan reports you will see most often:

| Report | Means |
| --- | --- |
| `heap-buffer-overflow` | read or write outside a `malloc` block |
| `stack-buffer-overflow` | outside a local array |
| `global-buffer-overflow` | outside a global or `static` array |
| `heap-use-after-free` | use of a block already freed |
| `attempting double-free` | `free` twice on the same block |
| `detected memory leaks` | leak (LeakSanitizer, at exit) |

### `ASAN_OPTIONS`

ASan's behavior is tuned with the `ASAN_OPTIONS` environment variable, without recompiling:

```bash
ASAN_OPTIONS=detect_leaks=1 ./average            # ask for leak checking
ASAN_OPTIONS=halt_on_error=0 ./average           # keep going after the first error (requires compiling with -fsanitize-recover=address)
ASAN_OPTIONS=detect_stack_use_after_return=1 ./average
```

Options are separated with `:` (for example `ASAN_OPTIONS=detect_leaks=1:abort_on_error=1`).

> **Portability:** AddressSanitizer works with GCC and Clang on Linux and macOS, and with Clang or MSVC on Windows. **LeakSanitizer** (leaks) is on by default with ASan on Linux, but it does not exist on macOS: there `ASAN_OPTIONS=detect_leaks=1` answers `detect_leaks is not supported on this platform`, and the alternative is `leaks --atExit -- ./program`. On Linux, **Valgrind** (`valgrind --leak-check=full ./program`) finds memory errors and leaks without recompiling with sanitizers, although it is much slower.

## UndefinedBehaviorSanitizer: undefined behavior at run time

In `operadores` you saw that some operations have **undefined behavior**: the standard does not say what happens, and the compiler may assume they never occur. The program may "work" on your machine and fail on another. **UndefinedBehaviorSanitizer** (UBSan) adds checks for many of those cases:

```c
#include <limits.h>
#include <stdio.h>

int main(void) {
    int big = INT_MAX;
    int next = big + 1;                      // signed overflow
    printf("%d\n", next);

    int bits = 32;
    unsigned int mask = 1u << bits;          // shift out of range
    printf("%u\n", mask);

    char bytes[16] = {0};
    int *misaligned = (int *)(bytes + 1);    // address not aligned for int
    printf("%d\n", *misaligned);

    int *null_ptr = nullptr;
    printf("%d\n", *null_ptr);               // dereferencing a null pointer
    return 0;
}
```

```bash
gcc -std=c23 -Wall -Wextra -Wpedantic -g -fsanitize=undefined ub.c -o ub
./ub
```

```
ub.c:6:20: runtime error: signed integer overflow: 2147483647 + 1 cannot be represented in type 'int'
ub.c:10:28: runtime error: shift exponent 32 is too large for 32-bit type 'unsigned int'
ub.c:15:20: runtime error: load of misaligned address 0x00016f709ee9 for type 'int', which requires 4 byte alignment
ub.c:18:20: runtime error: load of null pointer of type 'int'
```

Each line has the format `file:line:column: runtime error: description`:

- **Signed overflow:** adding 1 to `INT_MAX` does not "wrap around" in C; it is undefined. (With `unsigned` it is defined: it wraps modulo 2ⁿ.)
- **Shift out of range:** shifting a 32-bit integer by 32 positions or more (or by a negative amount) is undefined.
- **Misaligned access:** many types require their address to be a multiple of their size (alignment). Converting an arbitrary address to `int *` and reading through it is undefined; on some processors the program crashes.
- **Null pointer:** dereferencing `nullptr` (or `NULL`) is undefined; usually the program ends with a segmentation fault, but the compiler may optimize assuming it never happens.

By default UBSan reports and **keeps running**. To make it stop at the first error (useful in automated tests), compile with `-fno-sanitize-recover=undefined`, or run with `UBSAN_OPTIONS=halt_on_error=1` when your compiler allows it.

### Combining sanitizers

ASan and UBSan can be used together. It is the recommended combination for developing and testing:

```bash
gcc -std=c23 -Wall -Wextra -Wpedantic -g -O0 -fsanitize=address,undefined program.c -o program
```

Remember their limits:

- They only find bugs on the paths that **run**: test with several inputs, including error inputs and boundary cases.
- The program runs slower and uses more memory: they are for development and testing, not for the version you ship.
- They do not detect all undefined behavior (for example, they do not see reads of uninitialized variables; for that, Clang has MemorySanitizer, Linux only).

> **Portability:** UBSan belongs to GCC and Clang (Linux and macOS). The messages are similar but not identical between compilers. A program with no sanitizer reports is not "proven correct": it just did not have those errors in the runs you made.

## `printf` and `assert` as complements

### Debugging with `printf`

Printing intermediate values is a legitimate and fast technique, especially to watch how a loop evolves. Two rules make it useful:

- Print to `stderr`, not `stdout`: it does not mix with the program's normal output and it is not left in a buffer if the program crashes.
- Include where you are: the line and the relevant values.

```c
fprintf(stderr, "[average:%d] i=%zu sum=%d\n", __LINE__, i, sum);
```

`__LINE__` is a predefined macro whose value is the current line number. When you are done, **delete** those lines: they are not part of the program.

### `assert`: checking what must be true

`assert(condition)`, from `<assert.h>`, stops the program with a message if the condition is false. It is used to write down in the code the **assumptions** that, if they fail, reveal a programmer's error (not a user input error):

```c
#include <assert.h>
#include <stdio.h>

double average(const int grades[], size_t count) {
    assert(count > 0);             // requirement: at least one grade
    int sum = 0;
    for (size_t i = 0; i < count; i++) {
        sum += grades[i];
    }
    return (double)sum / count;
}

int main(void) {
    int grades[] = {7, 8, 10, 6};
    printf("Average: %.2f\n", average(grades, 4));
    printf("Average: %.2f\n", average(grades, 0));
    return 0;
}
```

The second call breaks the requirement and the program ends with a message like this one (the format depends on the library):

```
Average: 7.75
Assertion failed: (count > 0), function average, file average.c, line 5.
```

The message says which condition failed and where, which is the exact point where the assumption was broken, not twenty lines later when the symptom shows up. `assert` does not replace input validation (that is `scanf(...) != 1`, return codes, `errno`): invalid user data is reported and handled; a failing `assert` is a bug in the program. In `pruebas-estilo-y-portabilidad` you will see how it is turned off and how to use it to write tests.

## Summary

- Debug with a method: **reproduce**, **isolate**, hypothesize, fix one thing, verify and leave a regression check.
- Warnings are the first debugger: `-Wall -Wextra -Wpedantic`, `-Werror` so you never ignore them, and `-Wconversion` and `-Wshadow` as extras.
- Compile with `-g -O0` to debug. In GDB and LLDB: `break`, `run`, `next`, `step`, `print`, `backtrace`, `up`/`down`, `watch`, `finish`, `continue`.
- `-fsanitize=address` finds out-of-bounds accesses (stack, heap, globals), use after free, double free and (on Linux) leaks.
- `-fsanitize=undefined` finds signed overflow, out-of-range shifts, misaligned accesses and null pointers, among others.
- `printf` to `stderr` and `assert` complement the tools.

## Practice exercises

### Exercise 1: read the ASan report

This program copies a text into a new block:

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char *copy(const char *text) {
    char *result = malloc(strlen(text));
    if (result == NULL) {
        return NULL;
    }
    strcpy(result, text);
    return result;
}

int main(void) {
    char *greeting = copy("hello");
    if (greeting == NULL) {
        return 1;
    }
    printf("%s\n", greeting);
    free(greeting);
    return 0;
}
```

With `-fsanitize=address` you get:

```
==3120==ERROR: AddressSanitizer: heap-buffer-overflow on address 0x602000000015
WRITE of size 6 at 0x602000000015 thread T0
    #0 0x... in strcpy
    #1 0x... in copy copy.c:10
    #2 0x... in main copy.c:15
0x602000000015 is located 0 bytes after 5-byte region [0x602000000010,0x602000000015)
allocated by thread T0 here:
    #0 0x... in malloc
    #1 0x... in copy copy.c:6
```

Which error is it, on which line does it happen, on which line is the cause, and how do you fix it?

<details><summary>Show solution</summary>

It is a write outside a heap block (`heap-buffer-overflow`): `strcpy` writes 6 bytes (`WRITE of size 6`: the five letters plus `'\0'`) into a block of 5 (`5-byte region`). The symptom is on line 10 (`strcpy`), but the cause is on line 6: `malloc(strlen(text))` does not reserve room for the terminator. The fix:

```c
char *result = malloc(strlen(text) + 1);
```

</details>

### Exercise 2: read the UBSan report

A function computes the area of a square:

```c
int area(int side) {
    return side * side;
}
```

With `-fsanitize=undefined` and the input `50000`, the program prints:

```
area.c:2:17: runtime error: signed integer overflow: 50000 * 50000 cannot be represented in type 'int'
```

Explain what happens and propose a fix.

<details><summary>Show solution</summary>

50000 × 50000 = 2,500,000,000, which is larger than `INT_MAX` (2,147,483,647 for a 32-bit `int`). Overflow of a **signed** integer is undefined behavior, which is why UBSan reports it. Two possible fixes: compute in a wider type, or reject the sides that would overflow.

```c
#include <limits.h>
#include <stdio.h>

long long area(int side) {
    return (long long)side * side;
}

int main(void) {
    printf("%lld\n", area(50000));
    printf("%d\n", INT_MAX);
    return 0;
}
```

The conversion `(long long)side` is applied before multiplying, so the multiplication is done in `long long` (at least 64 bits).

</details>

### Exercise 3: write the debugger session

In this program, `sum_to` should return 1 + 2 + ... + n, but for `n = 10` it returns a wrong value.

```c
#include <stdio.h>

int sum_to(int n) {
    int sum = 0;
    for (int i = 1; i < n; i++) {
        sum += i;
    }
    return sum;
}

int main(void) {
    printf("%d\n", sum_to(10));
    return 0;
}
```

Write the GDB commands (and their LLDB equivalents) to: compile for debugging, stop inside the loop when `i` is 9, show `sum`, step one line at a time until leaving the loop, and see what the function returns. What is the bug?

<details><summary>Show solution</summary>

```bash
gcc -std=c23 -Wall -Wextra -Wpedantic -g -O0 sum.c -o sum
```

| Step | GDB | LLDB |
| --- | --- | --- |
| Open | `gdb ./sum` | `lldb ./sum` |
| Conditional breakpoint on line 6 | `break sum.c:6 if i == 9` | `break set --file sum.c --line 6 --condition 'i == 9'` |
| Run | `run` | `run` |
| Show the sum | `print sum` | `print sum` |
| Step | `next` (several times) | `next` (several times) |
| Show the return value | `finish` | `finish` |

When it stops with `i == 9`, `sum` is 36. With `next`, after adding 9 the loop evaluates `i < n` with `i == 10` and leaves: 10 is never added, and `finish` shows that the function returns 45 instead of 55. The condition must be `i <= n`.

</details>

### Exercise 4: fix the warnings

Compile this program with `-Wall -Wextra -Wpedantic -Wshadow` and fix every warning without changing what the program must do (show the maximum of the ages).

<!-- c-check: skip -->
```c
#include <stdio.h>

int maximum(int values[], int count) {
    int largest;
    for (int i = 0; i < count; i++) {
        if (i == 0 || values[i] > largest) {
            int largest = values[i];
        }
    }
    return largest;
}

int main(void) {
    int ages[] = {31, 17, 45, 22};
    size_t count = sizeof ages / sizeof ages[0];
    for (int i = 0; i < count; i++) {
        printf("%d ", ages[i]);
    }
    printf("\nMaximum: %d\n", maximum(ages, 4));
    return 0;
}
```

<details><summary>Show solution</summary>

Warnings: `int largest` inside the `if` **hides** the function's variable (`-Wshadow`) and is never used (`-Wunused-variable`); that is why the outer `largest` never gets a value and is compared and returned uninitialized (`-Wuninitialized`); `i < count` compares an `int` with a `size_t` (`-Wsign-compare`). Fixed version, which also uses `const` and `size_t`:

```c
#include <stdio.h>

// Requires count > 0.
int maximum(const int values[], size_t count) {
    int largest = values[0];
    for (size_t i = 1; i < count; i++) {
        if (values[i] > largest) {
            largest = values[i];
        }
    }
    return largest;
}

int main(void) {
    int ages[] = {31, 17, 45, 22};
    size_t count = sizeof ages / sizeof ages[0];
    for (size_t i = 0; i < count; i++) {
        printf("%d ", ages[i]);
    }
    printf("\nMaximum: %d\n", maximum(ages, count));
    return 0;
}
```

</details>

### Exercise 5: reproduce and isolate

A 300-line program reads a list of products from a file and sometimes crashes at the end. Describe, in concrete steps, how you would **reproduce** the bug and how you would **isolate** it before opening the debugger.

<details><summary>Show solution</summary>

Reproduce: keep the exact file it crashed with; run several times with that file to confirm it always fails; if it only fails "sometimes", compile with `-g -fsanitize=address,undefined`, because an out-of-bounds access or a use of freed memory usually becomes a deterministic error with the sanitizers.

Isolate: cut down the input file (remove half of the products and try again; repeat with the half that fails) until you have the smallest file that triggers the bug; then disable or skip the parts of the program that are not involved (for example, the final report) until only the responsible function is left. With that minimal case, the sanitizer report or a short debugger session shows the exact line, and that minimal file stays as a regression check.

</details>
