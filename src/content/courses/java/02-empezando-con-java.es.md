---
title: 'Empezando con Java'
course: 'java'
slug: 'empezando-con-java'
order: 2
lang: 'es'
published: true
---

# Empezando con Java

Java es un lenguaje de programación de propósito general, potente y versátil. Se utiliza en todo, desde aplicaciones móviles (Android) hasta grandes sistemas empresariales y servidores.

## ¿Qué es Java?

A diferencia de lenguajes como JavaScript (que es interpretado), Java es un lenguaje compilado. Esto significa que el código que escribes se traduce a un formato intermedio llamado **Bytecode**, que luego la Máquina Virtual de Java (JVM) ejecuta en cualquier plataforma.

## Las ventajas de aprender Java

- **Amplia demanda laboral:** Es uno de los lenguajes más usados en la industria.
- **Portabilidad:** "Escribe una vez, ejecuta en cualquier lugar".
- **Flexibilidad:** Se adapta a múltiples tipos de proyectos.
- **Comunidad activa:** Miles de librerías y soporte disponible.

## El primer programa en Java

```java
public class MiPrograma {
    public static void main(String[] args) {
        System.out.println("¡Hola, mundo!");
    }
}
```

### ¿Qué acabamos de hacer?

1. `public class MiPrograma`: Define una clase pública llamada `MiPrograma`.
2. `public static void main(String[] args)`: El punto de entrada del programa. Es lo primero que se ejecuta.
3. `System.out.println("¡Hola, mundo!")`: Imprime el texto en la consola y salta a la siguiente línea.

## La salida estándar

En Java usamos la clase `System.out` para mostrar información:

- `System.out.println()`: Imprime y salta de línea.
- `System.out.print()`: Imprime sin saltar de línea.
- `System.out.printf()`: Permite imprimir con formato (como en C).
- `System.out.write()`: Escribe un solo carácter (menos común).

### Ejemplo de `printf`:
```java
String nombre = "Juan";
int edad = 25;
System.out.printf("Nombre: %s, Edad: %d
", nombre, edad);
```