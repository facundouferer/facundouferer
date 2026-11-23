---
title: 'Character Strings and Operations'
course: 'c'
slug: 'cadenas-de-caracteres-y-operaciones'
order: 21
lang: 'en'
published: true
---

Names, messages, passwords, lines of a file: almost every program handles text. C has no `string` type like other languages. A **string** in C is something you already know: a **`char` array**, with a special mark that tells where the text ends. If you understand the indexes of lesson 19 and that mark, you understand strings; and you also understand why they are the most famous source of security bugs in C.

## Objectives

- Explain what a string is: a `char` array terminated by `'\0'`.
- Tell the array's **capacity** from the text's **length**, and compute each one.
- Traverse a string and use `strlen`, `strcmp`, `strchr` and `strcspn`.
- Read words with `scanf("%19s", ...)` and lines with `fgets`, removing the newline.
- Copy and concatenate without overflowing the array: the risks of `strcpy` and `strcat`, the alternatives `snprintf` and `strncat`, and the traps of `strncpy`.
- Convert between numbers and text.

**Prerequisites:** `arreglos-unidimensionales-y-multidimensionales` (indexes, bounds, `sizeof`, arrays as parameters), `operaciones-con-arreglos` (traversing, copying), `entrada-y-salida` (`scanf`, `printf`, validating with `!= 1`).

## A string is a `char` array with a terminator

```c
char name[] = "Ana";
```

The literal `"Ana"` has three letters, but the array has **four** elements. The compiler appends the null character `'\0'`, the **terminator**:

```text
index:     0     1     2     3
name:    ['A'] ['n'] ['a'] ['\0']
```

`'\0'` is the character with code 0. It is not the digit `'0'` (code 48) nor a space. Its only job is to say "the text ends here". Every string function (`printf` with `%s`, `strlen`, `strcmp`...) moves character by character **until it finds `'\0'`**. A string without a terminator is not a string: those functions would keep reading past the array bound.

Single and double quotes are not the same:

- `'A'` is **one character** (a `char`).
- `"A"` is **a string**: an array of two `char`, `'A'` and `'\0'`.

## Capacity and length

Two numbers describe a string, and mixing them up causes almost every bug:

- **Capacity**: how many `char` the array has. It is fixed when declared. You get it with `sizeof`, where the array is declared.
- **Length**: how many characters come **before** the `'\0'`. It changes with the stored text. You get it with `strlen`.

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char greeting[10] = "Code";

    printf("Text: %s\n", greeting);
    printf("Capacity: %zu\n", sizeof greeting);
    printf("Length: %zu\n", strlen(greeting));
    printf("First character: %c\n", greeting[0]);
    printf("Is greeting[4] the terminator? %s\n", greeting[4] == '\0' ? "yes" : "no");
    return 0;
}
```

```text
index:     0    1    2    3    4     5     6     7     8     9
greeting: ['C']['o']['d']['e']['\0']['\0']['\0']['\0']['\0']['\0']
           |---- length 4 ----|
           |----------------------- capacity 10 -------------------|
```

The rule to remember: **a string of length `L` needs capacity `L + 1`**. An array of capacity 10 holds text of up to 9 characters.

`strlen` returns a `size_t`, which is why it is printed with `%zu`. Using `%d` is a bug: the type does not match and the compiler warns about it.

## Traversing a string

Since a string is an array, you traverse it with indexes. The difference is the stop condition: instead of comparing with a count `n`, you move **until the terminator**.

```c
#include <stdio.h>

size_t length(const char s[]) {
    size_t n = 0;
    while (s[n] != '\0') {
        n++;
    }
    return n;
}

void to_upper(char s[]) {
    for (size_t i = 0; s[i] != '\0'; i++) {
        if (s[i] >= 'a' && s[i] <= 'z') {
            s[i] = s[i] - 'a' + 'A';
        }
    }
}

int main(void) {
    char word[] = "string";

    printf("Length computed by hand: %zu\n", length(word));
    to_upper(word);
    printf("Uppercase: %s\n", word);
    return 0;
}
```

Notice that functions receiving a string **do not need the number of elements** as a parameter: the `'\0'` plays that role. That is the great advantage of the terminator, and also its great risk: if it is missing, nothing stops the traversal.

`length` does exactly what `strlen` does: it walks the whole text. So `strlen` is not free, and writing `for (size_t i = 0; i < strlen(s); i++)` measures the string again on every iteration. Measure once and keep the result, or use `s[i] != '\0'` as the condition.

## Reading strings

### A word with `scanf`

```c
#include <stdio.h>

int main(void) {
    char name[20];

    printf("What is your name? ");
    if (scanf("%19s", name) != 1) {
        printf("Could not read the name.\n");
        return 1;
    }
    printf("Hello, %s\n", name);
    return 0;
}
```

- `%s` reads a **word**: it stops at the first space, tab or newline.
- The `19` is the **maximum width**: `scanf` stores at most 19 characters plus the `'\0'`. The width is always **capacity − 1**. Without it, `scanf("%s", name)` writes whatever the user types, even if it does not fit: an array overflow.
- Here `name` goes **without `&`**. With an `int` you wrote `&age` to tell `scanf` where to store; the name of an array already says where it is. The `punteros-arreglos-y-estructuras` lesson (26) explains why.

### A whole line with `fgets`

To read text with spaces (a full name, a sentence) use `fgets`:

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char line[50];

    printf("Type a sentence: ");
    if (fgets(line, sizeof line, stdin) == NULL) {
        printf("Could not read.\n");
        return 1;
    }
    line[strcspn(line, "\n")] = '\0';
    printf("You typed \"%s\" (%zu characters)\n", line, strlen(line));
    return 0;
}
```

`fgets(line, sizeof line, stdin)`:

- receives the array's **capacity** and never writes more: it stores at most `capacity − 1` characters and always adds `'\0'`;
- also stores the `'\n'` the user typed when pressing Enter, if it fits;
- returns `NULL` if it could not read anything (for example, because input ended). For now, `NULL` is simply the value that means "no result"; the `punteros-y-direcciones` lesson (25) explains what it is.

To remove the newline use `strcspn(line, "\n")`, which returns the **position** of the first `'\n'` or, if there is none, the length of the string. In both cases writing `'\0'` at that position is safe. The equivalent version with `strlen`:

```c
size_t len = strlen(line);
if (len > 0 && line[len - 1] == '\n') {
    line[len - 1] = '\0';
}
```

If the typed line does not fit, `fgets` stores only its beginning and the rest stays waiting in the input for the next read. In that case the string read does **not** end in `'\n'`, and that is how you detect it.

> **Portability:** never use `gets`. It read a line without receiving the capacity, so any long input overflowed the array. It was declared obsolete in a correction to C99 and **removed from the standard in C11**; with `-std=c23` compilers reject it or warn. Its replacement is `fgets`.

## Copying strings

A string is not assigned with `=` (it is an array). It is copied with `strcpy(destination, source)`, from `<string.h>`, which copies the characters and the `'\0'`.

The problem: **`strcpy` does not know the destination's capacity**. If the source does not fit, it writes past the bound:

```c
char destination[6];
strcpy(destination, "Welcome home");   /* 13 char into an array of 6: overflow */
```

That is undefined behavior and, in real programs, a classic vulnerability (*buffer overflow*). There are two safe ways.

**1. Check before copying.**

```c
if (strlen(source) < sizeof destination) {
    strcpy(destination, source);
}
```

**2. Use `snprintf`**, which receives the capacity, never writes too much, **always** ends with `'\0'` and returns how many characters it **would have** written. If that number is greater than or equal to the capacity, the text was truncated:

```c
#include <stdio.h>

int main(void) {
    char source[] = "Programming in C";
    char shorter[8];

    int written = snprintf(shorter, sizeof shorter, "%s", source);
    if (written < 0 || (size_t)written >= sizeof shorter) {
        printf("Truncated: \"%s\" (%d characters were needed)\n", shorter, written);
    } else {
        printf("Full copy: \"%s\"\n", shorter);
    }
    return 0;
}
```

Output: `Truncated: "Program" (16 characters were needed)`.

### The `strncpy` trap

`strncpy(destination, source, n)` looks like the safe version of `strcpy`, but it is not: if the source has `n` characters or more, it copies `n` and **does not add `'\0'`**. The result is not a string.

```c
char code[4];
strncpy(code, "ABCDEF", sizeof code);   /* copies 'A','B','C','D' and no '\0' */
code[sizeof code - 1] = '\0';           /* you must terminate it by hand: "ABC" */
```

Also, when the source is short, it fills the whole rest of the destination with zeros. It was designed for fixed-width fields, not for copying text. To copy with a limit, prefer `snprintf`.

> **Portability:** `strlcpy` and `strlcat` exist in BSD, macOS and POSIX, but they are **not standard C**. Annex K of C11 defines `strcpy_s` and `strcat_s`, but it is optional and almost no compiler implements it. With standard C, use `snprintf` or check the length before copying.

## Concatenating strings

`strcat(destination, source)` appends `source` to the end of `destination`. It has the same problem as `strcpy`: it does not know how much room is left.

`strncat(destination, source, n)` appends at most `n` characters and **always** adds the `'\0'`. The right `n` is the free room: `sizeof destination - strlen(destination) - 1`.

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char full[16] = "Ada";

    strncat(full, " ", sizeof full - strlen(full) - 1);
    strncat(full, "Lovelace", sizeof full - strlen(full) - 1);
    printf("%s (%zu of %zu)\n", full, strlen(full), sizeof full);

    char card[32];
    snprintf(card, sizeof card, "%s, born in %d", full, 1815);
    printf("%s\n", card);
    return 0;
}
```

Output:

```text
Ada Lovelace (12 of 16)
Ada Lovelace, born in 1815
```

When you need to build a text from several parts, `snprintf` is usually the clearest: one format, one capacity.

## Comparing strings

`==` does not compare the content of two strings: it checks whether they are **the same array**, not whether they hold the same letters. To compare text use `strcmp(a, b)`, which returns:

- `0` if they are equal;
- a negative number if `a` comes before `b`;
- a positive number if `a` comes after `b`.

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char key[] = "secret";

    if (strcmp(key, "secret") == 0) {
        printf("Correct key\n");
    }
    printf("apple vs pear: %s\n", strcmp("apple", "pear") < 0 ? "apple comes first" : "pear comes first");
    printf("Zebra vs ant: %s\n", strcmp("Zebra", "ant") < 0 ? "Zebra comes first" : "ant comes first");
    return 0;
}
```

The order is that of the characters' **codes**, not the dictionary's: every uppercase letter comes before every lowercase one, which is why `"Zebra"` comes before `"ant"`. Check only the sign of the result, never its exact value.

## Finding a character

Finding a character is a traversal that stops when it finds it. With indexes:

```c
size_t position_of(const char s[], char c) {
    size_t i = 0;
    while (s[i] != '\0' && s[i] != c) {
        i++;
    }
    return i;   /* if c is not there, i is the length and s[i] is '\0' */
}
```

The library offers two functions for the same job:

- `strchr(s, c)` walks `s` looking for `c`. If it does not find it, it returns `NULL`; if it does, it returns the location of the character inside the array. What that location is exactly you will see in the `punteros-y-direcciones` lesson (25); for now use it to ask **whether** the character is there: `strchr(s, c) != NULL`.
- `strcspn(s, "c")` returns the **position** of the first character of `s` that appears in the second text, or the length if there is none. It is the index-based version.

```c
#include <stdio.h>
#include <string.h>

size_t position_of(const char s[], char c) {
    size_t i = 0;
    while (s[i] != '\0' && s[i] != c) {
        i++;
    }
    return i;
}

int main(void) {
    char email[] = "ana@example.com";

    if (strchr(email, '@') != NULL) {
        printf("It has an at sign\n");
    }
    printf("Position of @ (by hand): %zu\n", position_of(email, '@'));
    printf("Position of @ (strcspn): %zu\n", strcspn(email, "@"));

    size_t pos = strcspn(email, "#");
    if (email[pos] == '\0') {
        printf("No #\n");
    }
    return 0;
}
```

## Numbers and text

`"12"` is a string of two characters, not the number 12. "Adding" two strings with `snprintf` **joins** them; to add their values you have to **convert** them:

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void) {
    char a[] = "12";
    char b[] = "30";

    char joined[8];
    snprintf(joined, sizeof joined, "%s%s", a, b);

    int sum = atoi(a) + atoi(b);

    char text[12];
    snprintf(text, sizeof text, "%d", sum);

    printf("Joined as text: %s\n", joined);
    printf("Added as numbers: %d\n", sum);
    printf("The sum as text: \"%s\" (%zu characters)\n", text, strlen(text));
    return 0;
}
```

```text
Joined as text: 1230
Added as numbers: 42
The sum as text: "42" (2 characters)
```

- `atoi` (from `<stdlib.h>`) converts text into an `int`.
- `snprintf` with `%d` converts a number into text, with the capacity as a limit. There is also `sprintf`, with no capacity: it has the same risk as `strcpy`.

> **Basic C:** `atoi` reports no errors: `atoi("hello")` returns `0`, just like `atoi("0")`, and a number that is too large is undefined behavior. It is fine for examples with known data. The `biblioteca-estandar-y-errores` lesson (34) teaches `strtol`, which detects invalid text and overflow.

## Counting words

A classic problem that brings everything together: traverse the string remembering whether you are **inside** or **outside** a word. Every time you go from outside to inside, a new word starts.

```c
#include <stdio.h>

size_t count_words(const char s[]) {
    size_t words = 0;
    bool inside = false;

    for (size_t i = 0; s[i] != '\0'; i++) {
        bool separator = s[i] == ' ' || s[i] == '\t' || s[i] == '\n';
        if (separator) {
            inside = false;
        } else if (!inside) {
            inside = true;
            words++;
        }
    }
    return words;
}

int main(void) {
    char sentence[] = "  Hello   world in   C  ";

    printf("Words: %zu\n", count_words(sentence));
    return 0;
}
```

Output: `Words: 4`. Counting spaces would not work: there are repeated spaces, and spaces at the start and at the end. The `isspace` function from `<ctype.h>` (lesson 34) recognizes every separator without writing them by hand.

> **Modern C (C23):** C23 adds `strdup` and `strndup` to the standard; they create a new copy of a string in memory requested at run time. You will see them with the `memoria-dinamica` lesson (28).

## Common mistakes

- **Forgetting room for the `'\0'`.** Storing `"Code"` needs capacity 5. Watch out: `char s[4] = "Code";` compiles in C, but the array ends up **without a terminator**.
- **Using `strcpy`, `strcat` or `sprintf` without checking the capacity.** Prefer `snprintf`, or measure first with `strlen`.
- **Believing `strncpy` always terminates the string.** It does not when the source is long.
- **`scanf("%s", s)` without a width.** Write `%19s` for a capacity of 20.
- **Using `gets`.** It is no longer in the standard; use `fgets`.
- **Forgetting the `'\n'` that `fgets` keeps.** Remove it with `s[strcspn(s, "\n")] = '\0';`.
- **Comparing strings with `==`.** Use `strcmp(a, b) == 0`.
- **Printing `strlen` with `%d`.** It is a `size_t`: use `%zu`.
- **Confusing capacity and length.** `sizeof` measures the array; `strlen` measures the text.

## Summary

- A string is a `char` array terminated by `'\0'`; `"A"` takes two `char`.
- Capacity (`sizeof`, fixed) and length (`strlen`, variable) are different; length `L` needs capacity `L + 1`.
- Strings are traversed up to `'\0'`, with no need to pass the count.
- `scanf("%19s", ...)` reads a word with a limit; `fgets` reads a line with a limit and keeps the `'\n'`.
- `strcpy` and `strcat` do not check the capacity: use `snprintf`, `strncat` with the free room, or check first.
- `strcmp` compares content; `strchr` and `strcspn` find characters.
- `atoi` and `snprintf` convert between text and numbers.

## Practice exercises

### Exercise 1: capacity and length

What do `sizeof` and `strlen` give for each array?

```c
char a[] = "C23";
char b[10] = "C23";
char c[10] = "";
```

<details><summary>Show solution</summary>

| | `sizeof` | `strlen` |
| --- | --- | --- |
| `a` | 4 | 3 |
| `b` | 10 | 3 |
| `c` | 10 | 0 |

`a` takes the literal's capacity (3 letters plus `'\0'`). `b` and `c` have a declared capacity of 10; `c` holds only the terminator, so its length is 0.

</details>

### Exercise 2: greeting with a full name

Write a program that reads a full name with `fgets` (capacity 40), removes the newline, rejects an empty line and builds with `snprintf` the greeting `Hello, <name>. Your name has N characters.`

<details><summary>Show solution</summary>

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char name[40];

    printf("Full name: ");
    if (fgets(name, sizeof name, stdin) == NULL) {
        printf("Could not read.\n");
        return 1;
    }
    name[strcspn(name, "\n")] = '\0';
    if (name[0] == '\0') {
        printf("The name cannot be empty.\n");
        return 1;
    }

    char greeting[80];
    snprintf(greeting, sizeof greeting, "Hello, %s. Your name has %zu characters.", name, strlen(name));
    printf("%s\n", greeting);
    return 0;
}
```

The empty line is detected after removing the `'\n'`: the first character is already the terminator.

</details>

### Exercise 3: fix an overflow

This fragment overflows the array. Explain why and fix it with `snprintf` so it reports when the text does not fit.

```c
char destination[6];
strcpy(destination, "Welcome");
```

<details><summary>Show solution</summary>

`"Welcome"` has 7 letters: it needs capacity 8, and `destination` has 6. `strcpy` does not know the capacity and writes 2 bytes past the bound (undefined behavior).

```c
#include <stdio.h>

int main(void) {
    char destination[6];

    int written = snprintf(destination, sizeof destination, "%s", "Welcome");
    if (written < 0 || (size_t)written >= sizeof destination) {
        printf("It does not fit; stored \"%s\"\n", destination);
    }
    return 0;
}
```

Output: `It does not fit; stored "Welco"`.

</details>

### Exercise 4: count vowels

Write `size_t count_vowels(const char s[])`, which counts vowels, uppercase or lowercase, and test it with `"Programming in C"`.

<details><summary>Show solution</summary>

```c
#include <stdio.h>

bool is_vowel(char c) {
    return c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u' ||
           c == 'A' || c == 'E' || c == 'I' || c == 'O' || c == 'U';
}

size_t count_vowels(const char s[]) {
    size_t vowels = 0;
    for (size_t i = 0; s[i] != '\0'; i++) {
        if (is_vowel(s[i])) {
            vowels++;
        }
    }
    return vowels;
}

int main(void) {
    printf("Vowels: %zu\n", count_vowels("Programming in C"));
    return 0;
}
```

Output: `Vowels: 4`. The function does not need the number of elements: it stops at `'\0'`.

</details>

### Exercise 5: append without overflowing

Write `bool append(char destination[], size_t capacity, const char extra[])`, which appends `extra` to the end of `destination` only if the whole result fits, and returns whether it could.

<details><summary>Show solution</summary>

```c
#include <stdio.h>
#include <string.h>

bool append(char destination[], size_t capacity, const char extra[]) {
    size_t used = strlen(destination);
    size_t needed = strlen(extra);
    if (used + needed + 1 > capacity) {
        return false;
    }
    strcat(destination, extra);
    return true;
}

int main(void) {
    char path[12] = "/home";

    printf("%s\n", append(path, sizeof path, "/ana") ? path : "Does not fit");
    printf("%s\n", append(path, sizeof path, "/documents") ? path : "Does not fit");
    return 0;
}
```

Output: `/home/ana` and `Does not fit`. Here `strcat` is safe because the function checked first that there is room for the text **and** for the `'\0'` (the `+ 1`). The capacity travels as a parameter because inside the function `sizeof destination` would not give it.

</details>
