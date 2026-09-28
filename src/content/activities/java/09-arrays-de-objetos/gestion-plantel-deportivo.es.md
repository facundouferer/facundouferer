---
course: 'java'
lesson: '09-arrays-de-objetos'
slug: 'gestion-plantel-deportivo'
title: 'Sistema de Gestión de Plantel Deportivo'
description: 'Administrá un plantel de jugadores en un array de objetos con capacidad contra cantidad real, implementá búsquedas, ordenamiento manual por goles y eliminación con limpieza de referencias para evitar fugas de memoria.'
kind: 'project'
order: 1
lang: 'es'
published: true
estimatedMinutes: 50
objectives:
  - 'Crear y manipular un array de objetos distinguiendo la reserva de casillas (paso 1) de la instanciación de objetos (paso 2).'
  - 'Diferenciar la capacidad física del array (length) de la cantidad real de elementos ocupados (contador).'
  - 'Manejar el redimensionamiento dinámico duplicando el array con Arrays.copyOf cuando se agota la capacidad.'
  - 'Implementar búsqueda lineal por criterio numérico y textual, protegiendo las comparaciones contra referencias null.'
  - 'Implementar ordenamiento manual por selección intercambiando referencias entre casillas sin duplicar objetos en memoria.'
  - 'Eliminar un elemento desplazando posiciones y limpiando la última referencia sobrante a null para evitar fugas de memoria.'
  - 'Aplicar copia defensiva en los métodos de acceso para preservar el encapsulamiento del array interno.'
requirements:
  - 'Crear la clase Jugador.java con los atributos private final String nombre, private final int dorsal y private int goles.'
  - 'Implementar el constructor canónico Jugador(String nombre, int dorsal, int goles) con validación defensiva: si nombre es nulo o en blanco, asignar "Sin nombre" por defecto e informarlo; si dorsal es menor o igual a 0, asignar 99 e informarlo; si goles es negativo, asignar 0 e informarlo.'
  - 'Implementar getters públicos getNombre(), getDorsal() y getGoles(), y el método de dominio anotarGoles(int cantidad) que incremente los goles si cantidad es positiva.'
  - 'Sobrescribir toString() en Jugador para devolver un formato legible y conciso como "#10 Lionel Messi (15 goles)".'
  - 'Crear la clase Plantel.java con los atributos private Jugador[] jugadores y private int cantidad.'
  - 'Implementar el constructor Plantel(int capacidadInicial) que valide que la capacidad sea mayor a 0 (usar 5 por defecto si no lo es), instancie jugadores = new Jugador[capacidadInicial] e inicialice cantidad en 0.'
  - 'Implementar agregar(Jugador j) como boolean: si j es null, informar el error y retornar false; si cantidad == jugadores.length, duplicar el array con Arrays.copyOf(jugadores, jugadores.length * 2) informando la ampliación de capacidad; asignar jugadores[cantidad] = j, incrementar cantidad y retornar true.'
  - 'Implementar buscarPorDorsal(int dorsal): recorrer estrictamente hasta cantidad y retornar la referencia al Jugador encontrado, o null si ningún jugador posee dicho dorsal.'
  - 'Implementar buscarPorNombre(String nombre): recorrer hasta cantidad comparando con equalsIgnoreCase asegurando que jugadores[i] != null antes de consultar el nombre; retornar el objeto o null.'
  - 'Implementar eliminar(int dorsal) como boolean: buscar el índice del jugador con ese dorsal; si existe, desplazar los elementos sucesivos una posición a la izquierda (jugadores[i] = jugadores[i + 1]), asignar null a jugadores[cantidad - 1] para eliminar la referencia residual y permitir la recolección de basura, decrementar cantidad y retornar true; si no existe, retornar false.'
  - 'Implementar ordenarPorGolesDescendente(): ordenar el array a mano mediante el algoritmo de selección comparando getGoles() de mayor a menor e intercambiando referencias con una variable temporal Jugador temp, recorriendo solo hasta cantidad.'
  - 'Implementar listar(): recorrer con un bucle for desde 0 hasta cantidad (nunca jugadores.length) imprimiendo cada elemento por consola.'
  - 'Implementar getJugadores(): retornar una copia defensiva del array activo mediante Arrays.copyOf(jugadores, cantidad).'
  - 'En MainPlantel.java, demostrar la inicialización en dos pasos mostrando que un array recién creado tiene casillas en null y explicar por qué invocar un método provocaría NullPointerException.'
  - 'En MainPlantel.java, instanciar un Plantel con capacidad 3, agregar 4 jugadores para evidenciar la duplicación dinámica, buscar un jugador existente y uno inexistente manejando el retorno null con if, ordenar por goles, eliminar un jugador verificando el desplazamiento y la limpieza a null, y evidenciar el aliasing de referencias.'
exampleOutput: |
  === 1. Verificación de inicialización en dos pasos ===
  Array de prueba reservado con new Jugador[3].
  Casilla prueba[0]: null
  (Llamar a prueba[0].getNombre() causaría NullPointerException)

  === 2. Creación del plantel e inserción ===
  Jugador agregado: #10 Lionel Messi (15 goles)
  Jugador agregado: #7 Lautaro Martínez (8 goles)
  Jugador agregado: #5 Rodrigo De Paul (3 goles)
  Capacidad máxima alcanzada (3). Duplicando array a 6 casillas...
  Jugador agregado: #11 Ángel Di María (11 goles)

  === 3. Búsqueda lineal ===
  Búsqueda dorsal 10: Encontrado -> #10 Lionel Messi (15 goles)
  Búsqueda dorsal 99: No encontrado (resultado null protegido)

  === 4. Ordenamiento manual por goles (descendente) ===
  Plantel ordenado por rendimiento:
  #10 Lionel Messi (15 goles)
  #11 Ángel Di María (11 goles)
  #7 Lautaro Martínez (8 goles)
  #5 Rodrigo De Paul (3 goles)

  === 5. Eliminación de jugador (dorsal 7) ===
  Baja confirmada para dorsal 7.
  Última casilla liberada a null (prevención de fuga de memoria).
  Plantel actualizado (cantidad: 3):
  #10 Lionel Messi (15 goles)
  #11 Ángel Di María (11 goles)
  #5 Rodrigo De Paul (3 goles)

  === 6. Aliasing y copia defensiva ===
  Referencia obtenida para Lionel Messi. Anotando 2 goles...
  El cambio se refleja en el plantel: #10 Lionel Messi (17 goles)
  Array obtenido con getJugadores() es una copia defensiva independiente.
extensionChallenges:
  - 'Agregar un método calcularPromedioGoles() que recorra hasta cantidad y devuelva el promedio de goles del equipo como double.'
  - 'Implementar ordenarPorDorsalAscendente() usando el mismo algoritmo de selección manual pero comparando getDorsal() con <.'
  - 'Probar qué sucedería si se intentara usar Arrays.sort(jugadores) directamente y verificar en qué momento falla la ejecución.'
deliveryTips:
  - 'Compilá todo junto con javac Jugador.java Plantel.java MainPlantel.java y ejecutá con java MainPlantel.'
  - 'Recordá siempre que el bucle de recorrido en Plantel debe tener como tope cantidad y no jugadores.length; de lo contrario saltará un NullPointerException apenas toque una casilla vacía.'
  - 'En el método eliminar, no olvides jugadores[cantidad - 1] = null; para limpiar la referencia huérfana.'
---

## Contexto

En cualquier sistema de software real, rara vez manejamos una única instancia de una entidad. Un club de fútbol, por ejemplo, administra decenas de jugadores que conforman un plantel deportivo. Cada jugador es un objeto con su propio estado y comportamiento, pero el club necesita agruparlos, listarlos, buscar refuerzos, premiar a los goleadores y dar de baja a quienes cambian de equipo.

En esta actividad vas a construir la gestión de un plantel utilizando **arrays de objetos**. Vas a experimentar de primera mano los dos niveles de memoria, la diferencia entre capacidad reservada y cantidad real, el redimensionamiento dinámico con `Arrays.copyOf`, la búsqueda lineal, el ordenamiento manual por intercambio de referencias y la prevención de fugas de memoria al eliminar elementos.

---

## Consigna

Desarrollá tres clases Java: `Jugador.java`, `Plantel.java` y `MainPlantel.java`.

### 1. Clase `Jugador.java`

Representa a cada deportista individual.

- **Atributos**:
  - `private final String nombre;`
  - `private final int dorsal;`
  - `private int goles;`
- **Constructor canónico**:
  - `public Jugador(String nombre, int dorsal, int goles)`
  - Si `nombre` es nulo o está en blanco, asignar `"Sin nombre"` e informar la corrección por consola.
  - Si `dorsal <= 0`, asignar `99` e informar la corrección.
  - Si `goles < 0`, asignar `0` e informar la corrección.
- **Métodos**:
  - Getters: `getNombre()`, `getDorsal()`, `getGoles()`.
  - `public void anotarGoles(int cantidad)`: si `cantidad > 0`, suma al atributo `goles`.
  - `@Override public String toString()`: devuelve un texto con formato `#<dorsal> <nombre> (<goles> goles)`.

### 2. Clase `Plantel.java`

Encapsula la colección de jugadores y administra el array interno.

- **Atributos**:
  - `private Jugador[] jugadores;` (capacidad física)
  - `private int cantidad;` (elementos reales almacenados)
- **Constructor**:
  - `public Plantel(int capacidadInicial)`: si `capacidadInicial <= 0`, usar `5`. Instancia `jugadores = new Jugador[capacidadInicial]` y fija `cantidad = 0`.
- **Métodos obligatorios**:
  - `public int getCantidad()`: retorna la cantidad actual de jugadores.
  - `public int getCapacidad()`: retorna `jugadores.length`.
  - `public boolean agregar(Jugador j)`:
    - Valida que `j != null` (si es null, informa y retorna `false`).
    - Si `cantidad == jugadores.length`, duplica la capacidad del array usando `jugadores = Arrays.copyOf(jugadores, jugadores.length * 2);` e imprime el aviso de redimensionamiento.
    - Asigna `jugadores[cantidad] = j;`, incrementa `cantidad++`, imprime confirmación y retorna `true`.
  - `public Jugador buscarPorDorsal(int dorsal)`:
    - Recorre con un `for` desde `0` hasta `cantidad`.
    - Si coincide el dorsal, retorna la referencia al `Jugador`.
    - Si finaliza el bucle sin coincidencias, retorna `null`.
  - `public Jugador buscarPorNombre(String nombre)`:
    - Si `nombre == null`, retorna `null`.
    - Recorre hasta `cantidad`, verificando `jugadores[i] != null` y comparando con `equalsIgnoreCase`. Retorna la referencia o `null`.
  - `public boolean eliminar(int dorsal)`:
    - Localiza el índice `idx` del jugador con ese dorsal.
    - Si no existe, retorna `false`.
    - Si existe, desplaza hacia la izquierda los elementos desde `idx` hasta `cantidad - 2`:
      ```java
      for (int i = idx; i < cantidad - 1; i++) {
          jugadores[i] = jugadores[i + 1];
      }
      ```
    - **Limpieza de referencia**: asigna `jugadores[cantidad - 1] = null;` para evitar que la última casilla retenga una referencia huérfana (*memory loitering*), permitiendo la acción del recolector de basura.
    - Decrementa `cantidad--` y retorna `true`.
  - `public void ordenarPorGolesDescendente()`:
    - Implementa el ordenamiento por selección a mano.
    - En cada pasada `i` (desde `0` hasta `cantidad - 2`), encuentra el índice del jugador con más goles en el resto del array.
    - Si el mayor no está en la posición `i`, intercambia referencias usando una variable temporal `Jugador temp`.
  - `public void listar()`:
    - Recorre estrictamente desde `0` hasta `cantidad` e imprime cada jugador (`System.out.println(jugadores[i])`).
  - `public Jugador[] getJugadores()`:
    - Retorna una copia defensiva: `return Arrays.copyOf(jugadores, cantidad);`.

### 3. Clase `MainPlantel.java`

Contiene el método `main` y comprueba cada concepto de la lección:

1. **Inicialización en dos pasos**: declara `Jugador[] prueba = new Jugador[3];` e imprime `prueba[0]`. Explica en un comentario por qué invocar un método allí arrojaría `NullPointerException`.
2. **Llenado y expansión**: crea un `Plantel` con capacidad inicial 3 y agrega 4 jugadores para demostrar cómo `Arrays.copyOf` redimensiona el array sin perder datos.
3. **Búsqueda lineal**: busca un jugador existente y uno inexistente. Demuestra la verificación `if (encontrado != null)` antes de interactuar con el resultado.
4. **Ordenamiento manual**: ordena por goles descendente y lista los jugadores para verificar el nuevo orden.
5. **Eliminación y limpieza**: elimina a un jugador del medio, confirma que `cantidad` baja en uno y que el jugador ya no figura en la lista.
6. **Aliasing y copia defensiva**: obtiene una referencia a un jugador existente, modifica sus goles con `anotarGoles(2)` y comprueba que el plantel refleja el cambio (ambas variables apuntan al mismo objeto en el Heap). Luego obtiene el array con `getJugadores()` y comprueba que es una copia independiente del array interno.
