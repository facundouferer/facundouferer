---
title: 'Compilation, linking and warnings'
course: 'c'
slug: 'compilacion-y-enlazado'
description: 'Walk through the four stages from source code to executable (preprocessor, compiler, assembler and linker) and enable C23 warnings.'
order: 3
lang: 'en'
published: true
---

You already know what a C program looks like: an `#include <stdio.h>`, a `main` function and a few calls to `printf`. But the computer does not run that text. Before the program runs, several tools transform it step by step until it becomes an **executable**.

Understanding that path is what lets you read compiler messages without fear, know which stage failed and fix the problem in the right place.

**Objectives**

- Describe the four stages that take source code to an executable: preprocessing, compilation, assembly and linking.
- Tell a source file, an object file and an executable apart.
- Distinguish a compile error from a link error and read a compiler message (file, line and column).
- Use warnings (`-Wall`, `-Wextra`, `-Wpedantic`) and treat them as errors to fix.
- Know the course standards policy: ISO C23 and the compile command we will always use.
- Check the exit status of a program.

**Prerequisites:** [Introduction to C](/en/courses/c/introduccion-y-estructura) and [Sequence of actions](/en/courses/c/procesos-y-estados).

## From source code to executable

Let's start from a minimal program saved in `program.c`:

```c
#include <stdio.h>

#define GREETING "Hello, C"

int main(void) {
    printf(GREETING "\n");
    return 0;
}
```

When you type `gcc program.c -o program`, it looks like a single thing happens. In fact `gcc` coordinates four stages, one after another:

```text
program.c ──► preprocessor ──► compiler ──► assembler ──► linker ──► program
 (source)      (C text)        (assembly)   (program.o)   (+ library)  (executable)
```

You can stop the process after each stage to see what it produced. Doing it once is the best way to understand it.

### 1. Preprocessing (`-E`)

The **preprocessor** works on the text before the compiler reads it. It handles the lines that start with `#`, called **directives**:

- `#include <stdio.h>` is replaced by the whole content of the header file `stdio.h`, which declares `printf` among many other things.
- `#define GREETING "Hello, C"` defines a **macro**: from that line on, every occurrence of `GREETING` is replaced by `"Hello, C"`.

With the `-E` option, `gcc` stops after preprocessing and prints the result:

```bash
gcc -E program.c
```

The output has hundreds of lines (everything `stdio.h` brought in) and ends like this:

```text
int main(void) {
    printf("Hello, C" "\n");
    return 0;
}
```

Notice two things: the `#define` directive is gone and `GREETING` has already been replaced. The compiler never sees macros, only the text the preprocessor left. Two adjacent string literals, such as `"Hello, C" "\n"`, are joined into one.

### 2. Compilation (`-S`)

The **compiler** analyzes the preprocessed text: it checks that it follows the rules of the language (syntax and types) and translates it into assembly language, the low-level instructions of your processor.

```bash
gcc -S program.c
```

This produces `program.s`, a text file with instructions such as `mov`, `call` or `ret`. You do not need to read assembly in this course; it is enough to know that it exists and that it depends on the processor (x86-64, ARM, etc.).

This is the stage where most of the **errors** and **warnings** you will see appear.

### 3. Assembly (`-c`)

The **assembler** turns assembly into machine code and stores it in an **object file** (`.o` on Linux and macOS, `.obj` on Windows):

```bash
gcc -std=c23 -c program.c
```

The `-c` option means "compile but do not link": it runs preprocessing, compilation and assembly, and stops with `program.o`. That file already contains machine code, but **it cannot run yet**: it refers to `printf` without knowing where its code is.

### 4. Linking

The **linker** takes one or more object files and joins them with the libraries they need. In our case, it finds the code of `printf` in the C standard library and produces the executable:

```bash
gcc program.o -o program
```

The `-o program` option names the result. Without it, the executable would be called `a.out`.

### Running the program

On Linux or macOS you run it by giving its path, because the current directory is not searched automatically:

```bash
./program
```

```text
Hello, C
```

On Windows the executable is called `program.exe` and you run it with `.\program.exe`.

### Source, object and executable

| File | What it contains | Readable? | Runnable? |
| --- | --- | --- | --- |
| `program.c` | C source code | yes, it is text | no |
| `program.o` | unlinked machine code | no, it is binary | no |
| `program` | machine code linked with the libraries | no, it is binary | yes |

Separating the stages has a practical benefit you will use in the functions module: when a program has several `.c` files, each one is compiled separately into its `.o` and the linker joins them at the end. If you change one file, you only recompile that one.

## Compile errors and link errors

An error can appear at different stages, and the message tells you which one. Look at this program with a typo:

<!-- c-check: skip -->
```c
#include <stdio.h>

int main(void) {
    prinft("Hello\n");
    return 0;
}
```

### In C23: a compile error

With the course command, the compiler stops before producing the object file. GCC 14 reports something like:

```text
program.c: In function 'main':
program.c:4:5: error: implicit declaration of function 'prinft'; did you mean 'printf'? [-Wimplicit-function-declaration]
    4 |     prinft("Hello\n");
      |     ^~~~~~
      |     printf
```

Clang says the same in other words (`use of undeclared identifier 'prinft'; did you mean 'printf'?`). The compiler knows no function called `prinft`: it is not declared in `stdio.h` or anywhere else.

### How to read a compiler message

Every message follows the format `file:line:column: kind: description`:

- `program.c` is the file where the problem is.
- `4` is the line and `5` the column (the character where `prinft` starts).
- `error` means no file was produced; if it says `warning`, the file was produced.
- The description explains the problem and sometimes suggests the fix (`did you mean 'printf'?`).
- The option that controls that diagnostic appears in brackets, for example `[-Wimplicit-function-declaration]`.

Below it, the compiler copies the line and marks the column with `^`. Always fix **the first error** in the list: the following ones are often a consequence of it.

### In old C: a link error

Old versions of C (C89) allowed calling an undeclared function: the compiler only emitted a warning and assumed the function would exist somewhere. If you compile the same program with an old standard (for example, `gcc -std=c89 program.c -o program`), compilation finishes and the error shows up **at link time**, when the linker looks for `prinft` in the object files and libraries and cannot find it. On Linux with GCC:

```text
/usr/bin/ld: /tmp/ccA1b2C3.o: in function `main':
program.c:(.text+0x10): undefined reference to `prinft'
collect2: error: ld returned 1 exit status
```

On macOS with Clang:

```text
Undefined symbols for architecture arm64:
  "_prinft", referenced from:
      _main in program-1a2b3c.o
ld: symbol(s) not found for architecture arm64
```

You recognize a link error because `ld` (the linker) reports it, it does not mention a line of your code and it talks about undefined symbols or references (`undefined reference`, `Undefined symbols`). It means: "something you used is declared or assumed to exist, but I could not find its code".

| Stage | Example cause | What the message looks like |
| --- | --- | --- |
| Preprocessing | `#include <stdoi.h>` | `fatal error: stdoi.h: No such file or directory` |
| Compilation | a missing `;`, an undeclared function | `file:line:column: error: ...` |
| Linking | a function whose code is nowhere to be found | `undefined reference to ...` / `Undefined symbols` |

## Warnings

A **warning** points to something the language allows but that is almost certainly a bug or an oversight. The compiler produces the file anyway, and that is why warnings are dangerous: the program compiles and fails later.

By default, compilers show few warnings. These options turn on the ones we will always use:

- `-Wall`: enables a broad set of common warnings (unused variables, wrong `printf` formats, etc.). Despite its name, it is not "all" of them.
- `-Wextra`: adds extra warnings that `-Wall` does not include.
- `-Wpedantic`: warns when the code uses something that is not part of the chosen standard, such as compiler-specific extensions.

This program compiles, but it has two problems:

<!-- c-check: skip -->
```c
#include <stdio.h>

int main(void) {
    int unused = 0;
    printf("%d\n", 3.5);
    return 0;
}
```

With `-Wall -Wextra -Wpedantic`, GCC reports:

```text
program.c:5:14: warning: format '%d' expects argument of type 'int', but argument 2 has type 'double' [-Wformat=]
program.c:4:9: warning: unused variable 'unused' [-Wunused-variable]
```

The first warning is serious: `%d` expects an integer and `3.5` is a number with decimals (`double`). The result of that `printf` is **undefined behavior**: it may print anything. The fix is to use `%f` for a `double`. The second warning points to a variable that is declared and never used; here it is enough to delete it.

```c
#include <stdio.h>

int main(void) {
    printf("%f\n", 3.5);
    return 0;
}
```

The course rule is simple: **a warning is a bug that has not bitten you yet**. A course program is finished when it compiles without a single warning. If you want the compiler to enforce it, add `-Werror`, which turns every warning into an error and does not produce the executable until you fix it. It is optional, but very useful while you learn.

## The course standards policy

C is not a single frozen language: the ISO committee publishes revised versions of the standard. The most important ones today are:

- **C99** and **C11**: versions you will still find in a lot of existing code.
- **C17**: a revision of C11 that fixed defects without adding new features. It is the default standard of many compilers and the one much of today's code uses.
- **C23**: the most recent version (ISO/IEC 9899:2024). It brings improvements such as `bool`, `true` and `false` as keywords, `nullptr`, `constexpr` and others you will see throughout the course.

**This course uses ISO C23.** Every program is compiled with this command:

```bash
gcc -std=c23 -Wall -Wextra -Wpedantic -g program.c -o program
```

Each option has a purpose:

| Option | What it does |
| --- | --- |
| `gcc` | the compiler; with Clang, type `clang` and the same options |
| `-std=c23` | compiles according to the ISO C23 standard |
| `-Wall` | enables the common warnings |
| `-Wextra` | enables extra warnings |
| `-Wpedantic` | warns about anything that is not standard C |
| `-g` | stores debugging information, which you will use later with a debugger (GDB or LLDB) to run the program step by step |
| `program.c` | the source file |
| `-o program` | the name of the executable |

Recommended versions: **GCC 14 or later** or **Clang 18 or later**. You can check yours with `gcc --version` or `clang --version`. On macOS, the `gcc` command actually runs Clang.

> **Basic C:** many courses and books compile simply with `gcc program.c`. That uses the compiler's default standard (often C17 with GNU extensions) and shows very few warnings.

> **Modern C (C23):** with `-std=c23` you choose the standard explicitly, and with `-Wall -Wextra -Wpedantic` the compiler warns you about the most common mistakes and about anything that is not standard C.

> **Portability:** compilers older than GCC 14 or Clang 18 do not recognize `-std=c23`; use `-std=c2x`, the provisional name of C23. Even so, an option does not guarantee full support: some C23 features may be missing in a given compiler or in its standard library. When a lesson uses something from C23 that does not exist in C17, it will say so in a box like this one.

### Compiler extensions

GCC and Clang accept things that are **not standard C**, called **extensions** (for example, some keywords that start with `__`). A program that depends on extensions may not compile with another compiler. That is why the course uses `-Wpedantic` and, whenever an extension shows up, it will be named as such. If an option or a construct only works with one compiler, it is not standard C.

## The exit status of a program

When `main` ends, the value of its `return` is handed to the operating system as the **exit status**. By convention, `0` means "finished fine" and any other value signals some problem.

```c
#include <stdio.h>

int main(void) {
    printf("Something went wrong\n");
    return 3;
}
```

In the Linux or macOS terminal, the `$?` variable holds the exit status of the last command:

```bash
./program
echo $?
```

```text
Something went wrong
3
```

In PowerShell, the equivalent is `$LASTEXITCODE`. Tools that run programs (scripts, continuous integration systems, `gcc` itself) use this number to know whether something failed. When `gcc` finds an error, it ends with a status other than `0`.

> **Basic C:** since C99, if `main` reaches its closing `}` without a `return`, it behaves as if it returned `0`. In this course we write `return 0;` anyway, so the intent is explicit.

## Summary

- The **preprocessor** handles the `#include` and `#define` directives (`gcc -E`).
- The **compiler** checks the rules of the language and translates to assembly (`gcc -S`).
- The **assembler** produces the `.o` object file (`gcc -c`).
- The **linker** joins the object files with the libraries and produces the executable.
- A compile error gives `file:line:column`; a link error talks about undefined symbols.
- **Warnings** are always fixed; `-Werror` turns them into errors.
- The course uses ISO C23 with `gcc -std=c23 -Wall -Wextra -Wpedantic -g program.c -o program`.
- The `return` of `main` is the exit status; `echo $?` shows it.

## Practice exercises

### Exercise 1: which stage fails?

For each case, state at which stage `gcc` stops (preprocessing, compilation or linking):

1. The program starts with `#include <stdoi.h>`.
2. The line `printf("Hello\n")` is missing its semicolon.
3. With an old standard, the program calls `prinft` and the compiler only emits a warning.

<details><summary>Show solution</summary>

1. **Preprocessing.** The preprocessor cannot find the file `stdoi.h` and stops with `fatal error: stdoi.h: No such file or directory`.
2. **Compilation.** It is a syntax error: `error: expected ';' before 'return'` (Clang: `expected ';' after expression`).
3. **Linking.** The object file is produced, but the linker cannot find the code of `prinft`: `undefined reference to 'prinft'`.

</details>

### Exercise 2: reading a compiler message

You compiled `greeting.c` and got:

```text
greeting.c:6:21: error: expected ';' after expression
```

In which file, line and column is the problem? Was the executable produced? What do you have to do?

<details><summary>Show solution</summary>

The problem is in the file `greeting.c`, line `6`, column `21`. Since it is an `error` (not a `warning`), the executable was **not** produced. You have to add the missing `;` at the end of the statement on line 6 and compile again.

</details>

### Exercise 3: zero warnings

This program produces warnings with the course command. Find them and fix them so it compiles without any.

<!-- c-check: skip -->
```c
#include <stdio.h>

int main(void) {
    int total = 10;
    printf("Price: %d\n", 2.5);
    printf("Done\n");
    return 0;
}
```

<details><summary>Show solution</summary>

There are two warnings: `%d` receives a `double` (`-Wformat`) and `total` is never used (`-Wunused-variable`). The fix is to use `%f` and delete the variable:

```c
#include <stdio.h>

int main(void) {
    printf("Price: %f\n", 2.5);
    printf("Done\n");
    return 0;
}
```

</details>

### Exercise 4: the stages one by one

Write the commands to get, starting from `program.c`: (a) the preprocessed text, (b) the object file, (c) the executable from the object file, and (d) run the program and see its exit status.

<details><summary>Show solution</summary>

```bash
gcc -std=c23 -E program.c
gcc -std=c23 -Wall -Wextra -Wpedantic -g -c program.c
gcc program.o -o program
./program
echo $?
```

Step (b) produces `program.o`; step (c) only links, which is why it does not need the warning options.

</details>

### Exercise 5: an exit status of your choice

Write a program that prints `Process finished` and ends with exit status `2`. Check the value with `echo $?`.

<details><summary>Show solution</summary>

```c
#include <stdio.h>

int main(void) {
    printf("Process finished\n");
    return 2;
}
```

After `./program`, the command `echo $?` prints `2`.

</details>
