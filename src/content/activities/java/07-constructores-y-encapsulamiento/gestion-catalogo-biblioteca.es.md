---
course: 'java'
lesson: '07-constructores-y-encapsulamiento'
slug: 'gestion-catalogo-biblioteca'
title: 'Sistema de Catálogo de una Biblioteca'
description: 'Diseñá una clase Libro con un constructor canónico que valide sus datos, un constructor de conveniencia que delegue con this(...), atributos private y un setter validado, y comprobá por qué ningún Libro puede nacer inválido.'
kind: 'project'
order: 1
lang: 'es'
published: true
estimatedMinutes: 50
objectives:
  - 'Escribir un constructor canónico que valide sus parámetros y garantice que el objeto nazca completo y válido.'
  - 'Usar this(...) para delegar en un constructor de conveniencia sin duplicar ninguna validación.'
  - 'Encapsular el estado con atributos private y exponer solo lo que el contrato realmente necesita.'
  - 'Escribir un setter que valide, y preferir un método de dominio antes que un setter cuando la operación tiene una regla propia.'
  - 'Comprobar que un dato inválido nunca queda guardado en el objeto: el constructor lo reemplaza por un valor por defecto seguro y lo informa por consola.'
requirements:
  - 'Crear la clase Libro.java con los atributos private titulo (String, final), autor (String, final), isbn (String, final), copiasDisponibles (int) y precioReposicion (double).'
  - 'Escribir el constructor canónico Libro(String titulo, String autor, String isbn, int copiasDisponibles, double precioReposicion) que valide: si titulo/autor/isbn es nulo o está en blanco, usar "Sin título"/"Autor desconocido"/"ISBN pendiente" por defecto e informarlo por consola; si copiasDisponibles es negativo, usar 0 por defecto e informarlo; si precioReposicion no es mayor a 0, delegar en setPrecioReposicion (que lo rechaza) y usar 15000.0 por defecto, informando el motivo. Ningún Libro debe terminar de construirse con datos inválidos: siempre gana un valor por defecto seguro.'
  - 'Escribir el constructor de conveniencia Libro(String titulo, String autor, String isbn), que delegue con this(...) en el constructor canónico arrancando con 1 copia disponible y precioReposicion en 15000.0, sin repetir ninguna validación.'
  - 'Implementar getters públicos para los cinco atributos (getTitulo, getAutor, getIsbn, getCopiasDisponibles, getPrecioReposicion).'
  - 'Implementar setPrecioReposicion(double precio) como boolean, aplicando exactamente la misma regla de validación (mayor a 0) que usa el constructor: devuelve true si acepta el nuevo precio, false si lo rechaza dejando intacto el precio anterior.'
  - 'Implementar prestar() como boolean: si copiasDisponibles es mayor a 0, la descuenta en uno, informa el préstamo y devuelve true; si no hay copias, informa el error, no modifica el atributo y devuelve false. No exponer un setter directo para copiasDisponibles: esta es la única forma de cambiarlo hacia abajo.'
  - 'Implementar devolver(): incrementa copiasDisponibles en uno e informa la devolución.'
  - 'Implementar mostrarFicha(), que imprima todos los datos del libro de forma prolija.'
  - 'En MainBiblioteca, crear al menos tres objetos Libro combinando ambos constructores (canónico y de conveniencia), y dejar un comentario junto a la instanciación explicando por qué new Libro() (sin argumentos) no compilaría: al declarar constructores propios, el constructor sin parámetros que regalaba el compilador ya no existe.'
  - 'Demostrar al menos dos rechazos de datos inválidos usando los valores devueltos por los métodos: uno construyendo un Libro con un dato inválido (por ejemplo, título vacío) y comprobando con getTitulo() que se usó el valor por defecto; otro llamando a setPrecioReposicion con un valor inválido y comprobando que devuelve false y que getPrecioReposicion() conserva el precio anterior.'
  - 'Ejercitar prestar() hasta agotar las copias de un libro, comprobando el boolean que devuelve cada llamada, y verificar que un préstamo de más informa el error, devuelve false y no descuenta copias de más (no debe quedar un número negativo).'
  - 'Guardar los libros creados en un List<Libro> (java.util.ArrayList) y recorrerla con un for-each para llamar a mostrarFicha() de cada uno.'
exampleOutput: |
  Título inválido, se usó "Sin título" por defecto.
  ¿Se aceptó el precio -100.0? false (se mantiene el precio anterior)

  === Ficha de libro ===
  Título:  Clean Code
  Autor:   Robert C. Martin
  ISBN:    9780132350884
  Copias disponibles: 1
  Precio de reposición: $15000.0
  =======================
  === Ficha de libro ===
  Título:  Efectivo con Java
  Autor:   Ana Restrepo
  ISBN:    9781234567897
  Copias disponibles: 3
  Precio de reposición: $22000.0
  =======================
  === Ficha de libro ===
  Título:  Cien Años de Soledad
  Autor:   Gabriel García Márquez
  ISBN:    9780307474728
  Copias disponibles: 2
  Precio de reposición: $18500.0
  =======================
  Préstamo registrado: "Clean Code". Copias disponibles: 0
  Error: no hay copias disponibles de "Clean Code" para prestar.
  Devolución registrada: "Clean Code". Copias disponibles: 1
  Precio de reposición actualizado de "Clean Code": $15000.0 -> $18000.0
extensionChallenges:
  - 'Agregar un atributo private List<String> historialPrestamos que registre la fecha o un identificador de cada préstamo, exponiendo un getHistorialPrestamos() que devuelva una copia (new ArrayList<>(historialPrestamos)), nunca la referencia interna.'
  - 'Marcar la clase Libro como final y dejar un comentario corto explicando por qué esta clase no está pensada para extenderse.'
  - 'Escribir, aparte, una versión mínima de un portador de datos inmutable equivalente (solo título, autor e isbn, sin las operaciones de préstamo) como record, siguiendo la idea de inmutabilidad de la lección.'
deliveryTips:
  - 'Compilá con javac Libro.java MainBiblioteca.java y ejecutá con java MainBiblioteca.'
  - 'Escribí primero el constructor canónico con toda la validación; los demás constructores y el setter reutilizan esa lógica, no la repiten.'
  - 'Probá primero los casos válidos y después, a propósito, los inválidos: un título vacío, copiasDisponibles negativo, un precio en cero.'
  - 'Si te confundís con this(...), volvé a la sección 3 de la lección: tiene que ser la primera sentencia del constructor, sin excepción.'
---

## Contexto

Una biblioteca necesita un catálogo mínimo para sus libros: título, autor, ISBN,
cuántas copias hay disponibles para prestar y cuánto cuesta reponer un
ejemplar perdido. A diferencia del ejercicio de la lección anterior, acá un
`Libro` **no puede nacer con datos basura**: un título vacío o un precio de
reposición negativo tienen que quedar reemplazados por un valor por defecto
seguro en el mismo instante en que alguien intenta crear el objeto, no
descubiertos después en algún reporte.

## Consigna

Escribí una clase Java llamada `Libro.java` que represente un ejemplar del
catálogo, y una clase `MainBiblioteca.java` con el método `main` que la ponga
a prueba.

### 1. Atributos de la clase `Libro`

Definí los siguientes atributos, todos `private` (estado protegido, nunca
expuesto directamente):

- `titulo` (`String`, `final`)
- `autor` (`String`, `final`)
- `isbn` (`String`, `final`)
- `copiasDisponibles` (`int`)
- `precioReposicion` (`double`)

Estructura sugerida para arrancar (completá los cuerpos):

```java
public class Libro {
    private final String titulo;
    private final String autor;
    private final String isbn;
    private int copiasDisponibles;
    private double precioReposicion;

    public Libro(String titulo, String autor, String isbn, int copiasDisponibles, double precioReposicion) {
        /* ... */
    }

    public Libro(String titulo, String autor, String isbn) {
        /* ... */
    }

    public boolean prestar() { /* ... */ }
    public void devolver() { /* ... */ }
    public boolean setPrecioReposicion(double precio) { /* ... */ }
    public void mostrarFicha() { /* ... */ }
}
```

### 2. El constructor canónico

`Libro(String titulo, String autor, String isbn, int copiasDisponibles, double precioReposicion)`
es el **único lugar** donde vive la validación completa:

- `titulo`, `autor` e `isbn` no pueden ser `null` ni estar en blanco.
- `copiasDisponibles` no puede ser negativo.
- `precioReposicion` tiene que ser mayor a `0`.

Si alguna condición no se cumple, el constructor **no corta la construcción**:
reemplaza el dato inválido por un valor por defecto seguro (`"Sin título"`,
`"Autor desconocido"`, `"ISBN pendiente"`, `0` copias o `$15000.0`) e informa
por consola qué se rechazó y por qué. Ningún `Libro` termina de construirse
con datos inválidos, pero tampoco deja de construirse: siempre gana un valor
por defecto seguro.

### 3. El constructor de conveniencia y `this(...)`

`Libro(String titulo, String autor, String isbn)` es para el caso frecuente
de un libro nuevo: arranca con **1 copia disponible** y un
`precioReposicion` por defecto de `15000.0`. No repitas ninguna validación
acá: delegá con `this(...)` en el constructor canónico, como primera
sentencia del constructor, para que sea el único lugar donde la regla puede
romperse o arreglarse.

Dejá comentado en `main` algo como `// new Libro(); // no compila`, con una
línea que explique por qué: al declarar estos dos constructores propios, el
constructor sin argumentos que el compilador regalaba automáticamente
**dejó de existir**.

### 4. Getters y el setter validado

Escribí un getter público para cada uno de los cinco atributos. Para el
precio de reposición, además, escribí `setPrecioReposicion(double precio)`
como `boolean`, aplicando la **misma** regla que el constructor (mayor a
`0`): devuelve `true` si acepta el nuevo precio y `false` si lo rechaza, sin
tocar el precio anterior. Que la regla viva en un solo lugar y el
constructor la reutilice, o que ambos deleguen en un validador privado
común: lo importante es que no esté escrita dos veces.

### 5. Operaciones de dominio en lugar de un setter de copias

No escribas `setCopiasDisponibles(int)`. En su lugar, expresá la intención
con dos métodos:

- **`prestar()`** (`boolean`): si hay copias disponibles, descontá una,
  informá el préstamo y devolvé `true`. Si no hay copias, informá el error,
  no modifiques el atributo y devolvé `false`.
- **`devolver()`**: suma una copia disponible e informa la devolución.

Un setter genérico de copias dejaría que cualquier código externo ponga el
contador en cualquier valor, incluido uno negativo. `prestar()` y
`devolver()` son la única puerta, y cada una aplica su propia regla.

### 6. `MainBiblioteca`: instanciación, validaciones y recorrido

En `MainBiblioteca`:

- Creá al menos **tres** objetos `Libro`, combinando el constructor canónico
  y el de conveniencia.
- Demostrá al menos dos rechazos usando los valores devueltos por los
  métodos: construí un libro con un dato inválido (por ejemplo, título
  vacío) y comprobá con `getTitulo()` que se usó el valor por defecto; y
  llamá a `setPrecioReposicion` con un valor inválido, comprobando que
  devuelve `false` y que `getPrecioReposicion()` no cambió.
- Agotá las copias de algún libro con llamadas repetidas a `prestar()`,
  comprobando el `boolean` que devuelve cada llamada, y verificá que un
  préstamo de más informa el error, devuelve `false` y no deja el contador en
  negativo.
- Guardá los libros en un `List<Libro>` (`new ArrayList<>()`) y recorrela con
  un `for` de tipo `for (Libro libro : libros)` para llamar a
  `mostrarFicha()` de cada uno.

El formato exacto de tus mensajes puede variar, pero debe comunicar la misma
información que la salida esperada de más abajo: qué se rechazó y por qué,
la ficha de cada libro, y el resultado de prestar, agotar copias y devolver.
