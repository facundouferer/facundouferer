---
course: 'c'
lesson: 'pruebas-estilo-y-portabilidad'
slug: 'sistema-de-inventario'
title: 'Proyecto final: Sistema de inventario'
description: 'Aplicación de consola de varios archivos que registra, consulta, modifica, elimina, busca, ordena, guarda y carga productos, con memoria dinámica, validación de entradas, pruebas unitarias con assert, un Makefile y un README.'
kind: 'project'
order: 2
lang: 'es'
published: true
estimatedMinutes: 360
objectives:
  - 'Integrar lo aprendido en un programa de varios archivos con una interfaz pública en un .h, una implementación y un programa principal separados.'
  - 'Administrar un arreglo dinámico de estructuras con malloc, realloc y free sin fugas ni accesos inválidos.'
  - 'Validar toda entrada del usuario y de los archivos, y comunicar cada error con un código de estado y un mensaje.'
  - 'Escribir pruebas unitarias con assert en un archivo aparte, automatizarlas con un Makefile y documentar cómo compilar y ejecutar el proyecto.'
requirements:
  - 'El proyecto tiene include/inventario.h, src/inventario.c, src/main.c, tests/test_inventario.c, Makefile y README.md.'
  - 'Cada producto tiene código (entero positivo y único), nombre (de 1 a 31 caracteres), precio (no negativo) y cantidad (no negativa), y el inventario crece con malloc y realloc.'
  - 'El menú ofrece registrar, listar, consultar por código, modificar precio y cantidad, eliminar, buscar por nombre exacto, ordenar por precio (con qsort), guardar en inventario.dat y cargar desde inventario.dat.'
  - 'Las entradas inválidas (texto en lugar de un número, valores fuera de rango, código repetido o inexistente) se rechazan con un mensaje y no detienen el programa. La operación cargar no modifica el inventario si el archivo falta o está dañado.'
  - 'Cada operación del módulo devuelve un código de estado (un enum) y main muestra el mensaje correspondiente; el módulo no imprime.'
  - 'tests/test_inventario.c prueba con assert al menos: agregar y buscar, validación de datos, código repetido, crecimiento más allá de la capacidad inicial, modificar, eliminar, ordenar y guardar y cargar.'
  - 'make construye el programa, make test construye y ejecuta las pruebas con -fsanitize=address,undefined y make clean borra lo generado. El Makefile usa -std=c23 -Wall -Wextra -Wpedantic.'
  - 'Todo se compila sin advertencias, el programa y las pruebas se ejecutan con -fsanitize=address sin reportes y todos los recursos (memoria y archivos) se liberan en todos los caminos.'
  - 'El README explica qué hace el programa, cómo compilarlo, cómo ejecutar las pruebas y el formato de los datos.'
exampleOutput: |
  Sistema de inventario
  1) Registrar   2) Listar    3) Consultar  4) Modificar  5) Eliminar
  6) Buscar      7) Ordenar   8) Guardar    9) Cargar     0) Salir
  Opción: 1
  Código: 101
  Nombre: Lapiz negro
  Precio: 120.50
  Cantidad: 40
  Producto registrado.
  Opción: 1
  Código: 102
  Nombre: Regla 30 cm
  Precio: 310
  Cantidad: 15
  Producto registrado.
  Opción: 1
  Código: 103
  Nombre: Goma
  Precio: 80
  Cantidad: 100
  Producto registrado.
  Opción: 1
  Código: 101
  Nombre: Otro
  Precio: 5
  Cantidad: 5
  Error: el código ya existe.
  Opción: 1
  Código: 104
  Nombre: Cuaderno
  Precio: abc
  Error: datos inválidos.
  Opción: 2
    Cod  Nombre           Precio  Cant
    101  Lapiz negro      120.50    40
    102  Regla 30 cm      310.00    15
    103  Goma              80.00   100
  Opción: 4
  Código: 102
  Nuevo precio: 290
  Nueva cantidad: 12
  Producto modificado.
  Opción: 3
  Código: 103
    103  Goma              80.00   100
  Opción: 6
  Nombre exacto: Regla 30 cm
    102  Regla 30 cm      290.00    12
  Opción: 7
  Ordenado por precio.
  Opción: 2
    Cod  Nombre           Precio  Cant
    103  Goma              80.00   100
    101  Lapiz negro      120.50    40
    102  Regla 30 cm      290.00    12
  Opción: 5
  Código: 103
  Producto eliminado.
  Opción: 2
    Cod  Nombre           Precio  Cant
    101  Lapiz negro      120.50    40
    102  Regla 30 cm      290.00    12
  Opción: 8
  Inventario guardado.
  Opción: 5
  Código: 101
  Producto eliminado.
  Opción: 9
  Inventario cargado.
  Opción: 2
    Cod  Nombre           Precio  Cant
    101  Lapiz negro      120.50    40
    102  Regla 30 cm      290.00    12
  Opción: 0
  Hasta luego.
extensionChallenges:
  - 'Agrega el orden por nombre con otra función de comparación para qsort y una opción del menú para elegir el criterio.'
  - 'Reemplaza la búsqueda exacta por una búsqueda por prefijo, sin distinguir mayúsculas de minúsculas, y agrega los casos de prueba correspondientes.'
  - 'Guarda los datos en un archivo de texto en lugar de binario y compara las ventajas de cada formato respecto de la portabilidad.'
deliveryTips:
  - 'Empieza por el módulo y sus pruebas: con inv_agregar y inv_buscar_codigo funcionando, el resto crece sobre una base verificada. Escribe el menú al final.'
  - 'Al agrandar el arreglo, guarda el resultado de realloc en una variable temporal; si falla, el bloque anterior sigue siendo válido y tu inventario no se pierde.'
  - 'Para leer números, lee una línea con fgets y conviértela con strtol o strtod comprobando que no sobren caracteres; scanf deja basura en el búfer cuando la entrada es inválida.'
  - 'Ejecuta el programa con el comando del paso 6 y compara con el ejemplo: los mensajes y el orden de las líneas deben coincidir.'
---

## Contexto

Es el **proyecto final** de la parte central del curso: una pequeña aplicación de consola para llevar el inventario de un comercio. Reúne todo lo que aprendiste: estructuras, memoria dinámica, cadenas, archivos, validación de entradas, modularización, depuración con sanitizers y pruebas automatizadas.

El enunciado fija lo que se espera; las decisiones de diseño (nombres de funciones, cómo dividir el trabajo entre `main` y el módulo, cómo leer las entradas) son tuyas y forman parte de la evaluación.

## Consigna

1. **Organiza el proyecto** así:

   ```
   inventario/
   ├── include/
   │   └── inventario.h        tipos y funciones públicas
   ├── src/
   │   ├── inventario.c        lógica del inventario (no imprime)
   │   └── main.c              menú y lectura de entradas
   ├── tests/
   │   └── test_inventario.c   pruebas unitarias con assert
   ├── Makefile
   └── README.md
   ```

2. **Diseña la interfaz** en `include/inventario.h`. Este esqueleto fija los tipos; completa las funciones que necesites (`inv_iniciar`, `inv_destruir`, `inv_agregar`, `inv_buscar_codigo`, `inv_buscar_nombre`, `inv_modificar`, `inv_eliminar`, `inv_ordenar_por_precio`, `inv_guardar`, `inv_cargar` y una función que convierta un código de estado en un mensaje):

   ```c
   #define NOMBRE_MAX 32

   typedef struct {
       int codigo;
       char nombre[NOMBRE_MAX];
       double precio;
       int cantidad;
   } Producto;

   typedef struct {
       Producto *items;
       size_t cantidad;
       size_t capacidad;
   } Inventario;

   typedef enum {
       INV_OK,
       INV_ERR_MEMORIA,
       INV_ERR_DUPLICADO,
       INV_ERR_NO_EXISTE,
       INV_ERR_DATO,
       INV_ERR_ARCHIVO
   } InvEstado;
   ```

3. **Implementa y prueba el módulo** en `src/inventario.c` y `tests/test_inventario.c`. Escribe cada prueba antes que la función que verifica, incluye los casos límite (inventario vacío, un solo producto, el primero y el último, datos fuera de rango) y comprueba también que `inv_cargar` conserva el inventario original cuando el archivo no existe.

4. **Escribe el menú** en `src/main.c`, con estas operaciones y estos textos de mensaje: `Producto registrado.`, `Producto modificado.`, `Producto eliminado.`, `Ordenado por precio.`, `Inventario guardado.`, `Inventario cargado.`, `El inventario está vacío.`, `Error: el código ya existe.`, `Error: no existe un producto con ese código.`, `Error: datos inválidos.`, `Opción inválida.` y `Hasta luego.`. La tabla de `Listar` muestra el encabezado `Cod`, `Nombre`, `Precio` y `Cant` y una fila por producto con `printf("%5d  %-14s %8.2f  %4d\n", ...)`.

5. **Escribe el `Makefile`** con las opciones del curso, un objetivo `all`, un objetivo `test` y un objetivo `clean`:

   ```bash
   make              # construye el programa
   make test         # construye y ejecuta las pruebas con ASan y UBSan
   make clean        # borra lo generado
   ```

   El Makefile compila con `gcc -std=c23 -Wall -Wextra -Wpedantic`. Los comandos de cada regla empiezan con un tabulador. Debe **compilar sin advertencias**.

6. **Verifica con sanitizers.** Compila el programa con AddressSanitizer y ejecuta una sesión como la del ejemplo, sin informes (`-fsanitize=address` sin reportes):

   ```bash
   make clean
   make EXTRA=-fsanitize=address
   ./inventario
   ```

   Para que esa variable funcione, define `CFLAGS` en el `Makefile` con una variable `EXTRA` al final, vacía por defecto.

7. **Escribe el `README.md`** con: qué hace el programa, cómo compilarlo (`make`), cómo ejecutar las pruebas (`make test`), el formato del archivo `inventario.dat` y una sesión de ejemplo.

La salida de ejemplo muestra el programa con una sesión completa; cada línea escrita por el usuario aparece a continuación de su pregunta.

## Criterios de evaluación

El proyecto se califica con esta rúbrica, que suma 100 %:

| Criterio | Peso | Qué se evalúa |
| --- | --- | --- |
| Correctitud funcional | 25 % | Las nueve operaciones del menú producen los resultados y mensajes del ejemplo, incluida una sesión de guardar y cargar. |
| Diseño y organización | 20 % | Módulo e interfaz separados del programa principal, el módulo no imprime ni lee, funciones cortas con una responsabilidad y nombres claros. |
| Uso apropiado del lenguaje | 15 % | `enum` para los códigos de estado, `const` donde corresponde, `size_t` para tamaños, `qsort` con una función de comparación y sin comportamiento indefinido. |
| Gestión de memoria y recursos | 15 % | `realloc` con variable temporal, todo `malloc` con su `free`, archivos cerrados en todos los caminos y ningún informe de AddressSanitizer. |
| Validación y manejo de errores | 10 % | Entradas numéricas y de texto comprobadas, errores de archivo y de memoria tratados y cargar sin efectos si el archivo está dañado. |
| Pruebas y depuración | 10 % | Pruebas con `assert` que cubren cada operación y los casos límite, ejecutadas con `make test` y con sanitizers. |
| Documentación y legibilidad | 5 % | README completo, comentarios que documentan la interfaz del módulo y un estilo de formato consistente. |

Lista de verificación final:

- [ ] `make` compila sin advertencias con `-std=c23 -Wall -Wextra -Wpedantic`.
- [ ] `make test` ejecuta las pruebas y termina con código 0.
- [ ] La sesión del ejemplo produce la misma salida.
- [ ] Ejecutar con `-fsanitize=address` no produce reportes.
- [ ] Un archivo inexistente o dañado no destruye el inventario en memoria.
