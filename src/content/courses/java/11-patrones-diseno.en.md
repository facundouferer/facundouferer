---
title: 'Design Patterns'
course: 'java'
slug: 'patrones-diseno'
order: 11
lang: 'en'
published: true
---

# Patrones de Diseño

Los patrones de diseño son soluciones probadas a problemas comunes en el desarrollo de software. No son reglas rígidas, sino guías.

## Clasificación

1. **Patrones de Creación:** Se enfocan en cómo se crean los objetos (ej: `Singleton`, `Factory`).
2. **Patrones de Estructura:** Cómo se organizan y componen los objetos (ej: `Adapter`, `Composite`).
3. **Patrones de Comportamiento:** Cómo interactúan y se comunican los objetos.

## Patrón State (Estado)
Permite que un objeto cambie su comportamiento cuando su estado interno cambia. Ideal para evitar muchos `if/else` complejos.

**Ejemplo:** Un reproductor de música con estados `Reproduciendo`, `Pausado`, `Detenido`.

## Patrón Template Method
Define la estructura de un algoritmo en una superclase, pero permite que las subclases sobrescriban pasos específicos sin cambiar la estructura global.

**Ejemplo:** Un juego de mesa donde todos los juegos tienen los pasos `iniciar()`, `jugar()` y `finalizar()`, pero cada juego los implementa de forma distinta.
