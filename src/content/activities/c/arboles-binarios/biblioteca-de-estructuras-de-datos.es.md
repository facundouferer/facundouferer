---
course: 'c'
lesson: 'arboles-binarios'
slug: 'biblioteca-de-estructuras-de-datos'
title: 'Biblioteca de estructuras de datos'
description: 'Proyecto integrador de modularización, interfaces y pruebas: una pequeña biblioteca en varios archivos con una pila, una cola y un árbol binario de búsqueda, más un programa de pruebas con assert compilado con el comando de varios archivos.'
kind: 'project'
order: 2
lang: 'es'
published: true
estimatedMinutes: 180
objectives:
  - 'Separar cada estructura en una interfaz (.h con guardas de inclusión) y una implementación (.c), y compilarlas por separado y enlazarlas.'
  - 'Implementar una pila, una cola y un árbol binario de búsqueda que reservan cada nodo con malloc comprobado y tienen una función que libera todo.'
  - 'Escribir un programa de pruebas que use solo las interfaces y verifique cada operación, sus casos vacíos y sus casos límite con assert.'
  - 'Comprobar con AddressSanitizer que la biblioteca no accede a memoria inválida ni deja nodos sin liberar.'
requirements:
  - 'La entrega tiene siete archivos: pila.h, pila.c, cola.h, cola.c, abb.h, abb.c y pruebas.c. Cada .h tiene guardas de inclusión y declara exactamente las funciones de la consigna; cada .c incluye su propio .h.'
  - 'Cada nodo se reserva con malloc(sizeof *nodo) y se comprueba contra NULL; las operaciones que pueden fallar devuelven bool y entregan el dato por un puntero de salida, sin modificarlo si fallan.'
  - 'pila_destruir, cola_destruir y abb_destruir liberan todos los nodos (el árbol, en postorden) y dejan la estructura vacía y reutilizable.'
  - 'cola_desencolar mantiene el invariante: cuando la cola queda vacía, frente y final valen NULL, y se puede volver a encolar.'
  - 'abb_insertar no agrega valores repetidos (abb_cantidad no cambia) y abb_inorden copia los valores en orden ascendente en un arreglo del llamador, sin pasarse de su capacidad.'
  - 'pruebas.c incluye solo los .h de la biblioteca, prueba al menos el caso vacío, el caso normal y un caso límite de cada estructura con assert, y muestra pila: OK, cola: OK, abb: OK y Todas las pruebas pasaron.'
  - 'Los cuatro .c compilan sin advertencias por separado con gcc -std=c23 -Wall -Wextra -Wpedantic -c y se enlazan en el ejecutable pruebas; la versión compilada con -g -fsanitize=address termina sin ningún informe.'
exampleOutput: |
  $ gcc -std=c23 -Wall -Wextra -Wpedantic -c pila.c
  $ gcc -std=c23 -Wall -Wextra -Wpedantic -c cola.c
  $ gcc -std=c23 -Wall -Wextra -Wpedantic -c abb.c
  $ gcc -std=c23 -Wall -Wextra -Wpedantic -c pruebas.c
  $ gcc pila.o cola.o abb.o pruebas.o -o pruebas
  $ ./pruebas
  pila: OK
  cola: OK
  abb: OK
  Todas las pruebas pasaron
extensionChallenges:
  - 'Agrega abb_eliminar con los tres casos de la lección y pruebas para cada uno: hoja, un hijo y dos hijos (incluida la raíz).'
  - 'Escribe un programa de ejemplo, parentesis.c, que use solo pila.h para verificar paréntesis balanceados, y compílalo enlazando pila.o sin recompilar la pila.'
  - 'Agrega a cada estructura contadores de reservas y liberaciones, y una prueba que compruebe que son iguales después de destruirla.'
deliveryTips:
  - 'Escribe primero los tres .h y pruebas.c, con todas las pruebas, y después las implementaciones: las pruebas fallan hasta que cada función está bien.'
  - 'Nunca pongas dentro de assert una llamada que cambia algo (como assert(pila_apilar(&pila, 1))): si alguien compila con -DNDEBUG, la llamada desaparece. Guarda el resultado en una variable y comprueba la variable.'
  - 'Cuando un assert falla, el programa muestra el archivo, la línea y la condición, y termina. Compila con -g para que AddressSanitizer también indique líneas.'
  - 'En macOS, AddressSanitizer no detecta fugas: usa leaks --atExit -- ./pruebas sobre la versión compilada sin -fsanitize, o los contadores del segundo desafío.'
---

## Contexto

En las últimas lecciones escribiste una lista, una pila, una cola y un árbol, cada uno dentro de un programa con su propio `main`. Un programa real los usaría como **biblioteca**: un conjunto de módulos con una interfaz estable (los `.h`) y una implementación que se compila una vez y se enlaza donde haga falta, como viste en `modularizacion-subprogramas-y-funciones`.

Una biblioteca que otros van a usar necesita **pruebas**: un programa que llame a cada función en sus casos normales, vacíos y límite, y que se detenga en cuanto algo no da lo esperado. Para eso este proyecto usa `assert`, de `<assert.h>`. `assert(condicion)` no hace nada si la condición es verdadera; si es falsa, muestra el archivo, la línea y la condición, y termina el programa. La lección `pruebas-estilo-y-portabilidad` lo desarrolla en detalle; aquí alcanza con esta regla: dentro de `assert` solo van comprobaciones, nunca llamadas que cambian algo, porque compilando con `-DNDEBUG` los `assert` desaparecen.

```c
bool ok = pila_apilar(&pila, 10);   // la operación, fuera del assert
assert(ok);                         // solo la comprobación, dentro
```

## Consigna

1. Escribe las tres interfaces. Esta es `pila.h`; `cola.h` y `abb.h` siguen el mismo estilo:

   ```c
   #ifndef PILA_H
   #define PILA_H

   #include <stddef.h>

   typedef struct NodoPila {
       int dato;
       struct NodoPila *siguiente;
   } NodoPila;

   // La pila es dueña de todos sus nodos. Se usa solo con estas funciones.
   typedef struct {
       NodoPila *tope;
       size_t cantidad;
   } Pila;

   void pila_iniciar(Pila *pila);
   bool pila_apilar(Pila *pila, int dato);          // false si no hay memoria
   bool pila_desapilar(Pila *pila, int *dato);      // false si está vacía
   bool pila_ver_tope(const Pila *pila, int *dato); // false si está vacía
   size_t pila_cantidad(const Pila *pila);
   void pila_destruir(Pila *pila);                  // libera todo y la deja vacía

   #endif
   ```

   - `cola.h`: `NodoCola` y `Cola` (con `frente`, `final` y `cantidad`, y el invariante escrito en un comentario), y `cola_iniciar`, `cola_encolar`, `cola_desencolar`, `cola_ver_frente`, `cola_cantidad` y `cola_destruir`.
   - `abb.h`: `NodoAbb` y `Abb` (con `raiz` y `cantidad`), y `abb_iniciar`, `bool abb_insertar(Abb *arbol, int dato)`, `bool abb_contiene(const Abb *arbol, int dato)`, `size_t abb_cantidad(const Abb *arbol)`, `size_t abb_altura(const Abb *arbol)` (vacío: 0; un nodo: 1), `size_t abb_inorden(const Abb *arbol, int destino[], size_t capacidad)` y `abb_destruir`. Las funciones recursivas auxiliares que reciben un `NodoAbb *` quedan en `abb.c` como `static`: no son parte de la interfaz.

2. Implementa `pila.c`, `cola.c` y `abb.c` con el código de las lecciones adaptado a estas interfaces.

3. Escribe `pruebas.c`, que incluye solo los tres `.h` y `<assert.h>`, con una función de prueba por estructura. Como mínimo:
   - **pila:** desapilar una pila vacía devuelve `false` y no toca el dato; después de apilar 10, 20 y 30, el tope es 30 y salen 30 y 20 en ese orden; destruir deja la cantidad en 0.
   - **cola:** desencolar una cola vacía devuelve `false`; salen 1 y 2 en el orden en que entraron; al vaciarse, `frente` y `final` son `NULL`; encolar después de vaciarla funciona.
   - **abb:** insertar 50, 30, 70, 20, 40, 60, 80 y otra vez 40 deja 7 valores y altura 3; contiene 60 y no contiene 65; el inorden tiene 7 valores en orden ascendente; destruir deja la raíz en `NULL`.

4. Compila cada módulo por separado y enlázalos. Todo debe **compilar sin advertencias**:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic -c pila.c
   gcc -std=c23 -Wall -Wextra -Wpedantic -c cola.c
   gcc -std=c23 -Wall -Wextra -Wpedantic -c abb.c
   gcc -std=c23 -Wall -Wextra -Wpedantic -c pruebas.c
   gcc pila.o cola.o abb.o pruebas.o -o pruebas
   ./pruebas
   ```

5. Compila todo junto con AddressSanitizer y ejecuta. No debe aparecer **ningún informe**:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic -g -fsanitize=address pila.c cola.c abb.c pruebas.c -o pruebas
   ./pruebas
   ```

6. Comprueba que las pruebas detectan errores: quita a propósito la línea que pone `final` en `NULL` en `cola_desencolar`, recompila y verifica que un `assert` o AddressSanitizer lo detecta. Después vuelve a ponerla.

## Criterios de evaluación

| Criterio | Peso | Qué se evalúa |
| --- | --- | --- |
| Correctitud funcional | 25 % | Las tres estructuras cumplen su interfaz (LIFO, FIFO, regla del árbol de búsqueda, sin repetidos) y la salida coincide con la de ejemplo. |
| Diseño y organización | 20 % | Un módulo por estructura; los `.h` exponen solo la interfaz, con guardas de inclusión; las funciones auxiliares son `static`; `pruebas.c` usa solo las interfaces. |
| Uso apropiado del lenguaje | 15 % | `const` en las funciones que solo leen, `size_t` para cantidades, `bool` y punteros de salida para las operaciones que pueden fallar, `sizeof *nodo` en cada reserva. |
| Gestión de memoria y recursos | 15 % | Cada reserva se comprueba; cada nodo se libera una sola vez; el árbol se libera en postorden; las funciones de destrucción dejan la estructura vacía y reutilizable. |
| Validación y manejo de errores | 10 % | Desapilar, desencolar o ver el tope de una estructura vacía devuelve `false` sin desreferenciar `NULL` ni modificar el dato de salida. |
| Pruebas y depuración | 10 % | Cada estructura tiene pruebas de caso vacío, normal y límite con `assert`, sin efectos dentro de `assert`; la versión con AddressSanitizer no informa nada; el paso 6 muestra que las pruebas detectan el error del invariante. |
| Documentación y legibilidad | 5 % | Cada `.h` documenta qué hace cada función, qué devuelve cuando falla y quién es dueño de los nodos; nombres con prefijo por módulo. |
