---
course: 'java'
lesson: '01-conceptos-basicos'
slug: 'inspeccion-plataforma-cli'
title: 'Inspección de Plataforma y Argumentos por Consola'
description: 'Construí tu primer programa interactivo en Java, validá argumentos por consola evitando excepciones y comprobá la ejecución desde la terminal.'
kind: 'project'
order: 1
lang: 'es'
published: true
estimatedMinutes: 30
objectives:
  - 'Escribir una clase pública ejecutable respetando la convención de nombres y el método main.'
  - 'Compilar el código fuente con javac y ejecutar el bytecode resultante en la JVM.'
  - 'Validar el tamaño del array args antes de acceder a sus posiciones para evitar ArrayIndexOutOfBoundsException.'
  - 'Formatear y emitir mensajes claros por consola ante ejecuciones correctas y parámetros faltantes.'
requirements:
  - 'Crear el archivo DiagnosticoConsola.java con la clase pública homónima: public class DiagnosticoConsola.'
  - 'Definir el punto de entrada estándar: public static void main(String[] args).'
  - 'Verificar la cantidad de argumentos recibidos mediante args.length.'
  - 'Si no se envían argumentos (args.length == 0), mostrar un mensaje de uso explicativo y finalizar sin lanzar errores: Uso: java DiagnosticoConsola <usuario> <modulo>.'
  - 'Si se envía exactamente un argumento (args.length == 1), advertir que falta indicar el módulo del entorno y mostrar el usuario recibido.'
  - 'Si se reciben dos o más argumentos (args.length >= 2), imprimir una ficha de diagnóstico con el usuario (args[0]), el módulo asignado (args[1]) y el estado "Entorno configurado correctamente".'
  - 'Si se reciben más de dos argumentos, incluir al final un aviso indicando cuántos parámetros adicionales fueron descartados.'
  - 'Compilar manualmente con javac DiagnosticoConsola.java y verificar la generación del archivo DiagnosticoConsola.class.'
  - 'Ejecutar las cuatro variantes en la terminal usando java DiagnosticoConsola.'
exampleOutput: |
  $ java DiagnosticoConsola
  [ERROR] Parámetros insuficientes.
  Uso: java DiagnosticoConsola <usuario> <modulo>

  $ java DiagnosticoConsola Facundo
  [ALERTA] Se recibió el usuario 'Facundo', pero falta indicar el módulo destino.
  Uso: java DiagnosticoConsola <usuario> <modulo>

  $ java DiagnosticoConsola Facundo Backend
  =============================================
   DIAGNÓSTICO DE PLATAFORMA JAVA
  =============================================
   Usuario:     Facundo
   Módulo:      Backend
   Plataforma:  JVM (Bytecode Verifier OK)
   Estado:      Entorno configurado correctamente
  =============================================

  $ java DiagnosticoConsola Facundo Backend v1 debug
  =============================================
   DIAGNÓSTICO DE PLATAFORMA JAVA
  =============================================
   Usuario:     Facundo
   Módulo:      Backend
   Plataforma:  JVM (Bytecode Verifier OK)
   Estado:      Entorno configurado correctamente
  =============================================
  [INFO] Se ignoraron 2 parámetro(s) adicional(es).
extensionChallenges:
  - 'Modificá el programa para que, además del usuario y módulo, valide si el nombre del módulo coincide con "JVM" o "JDK" y muestre una aclaración de arquitectura.'
  - 'Intentá ejecutar intencionalmente java DiagnosticoConsola.class para observar qué error produce la JVM y documentá la diferencia conceptual.'
deliveryTips:
  - 'Recordá que el nombre del archivo debe ser idéntico al de la clase pública, respetando mayúsculas: DiagnosticoConsola.java.'
  - 'No uses bucles ni métodos adicionales todavía: resolvé la lógica con bloques condicionales dentro de main.'
  - 'Probá siempre la ejecución sin argumentos para asegurarte de que nunca salte una excepción de índice fuera de rango.'
---

## Contexto

En el desarrollo de software profesional —desde scripts de automatización hasta contenedores y microservicios— los parámetros de inicio pasados por terminal son el primer mecanismo de configuración de un proceso.

Si un programa asume ingenuamente que el usuario siempre pasa todos los datos y accede a `args[0]` o `args[1]` a ciegas, la Máquina Virtual de Java (JVM) interrumpe la ejecución con un `ArrayIndexOutOfBoundsException`. Un arquitecto de software comprende que **el código defensivo empieza en el punto de entrada**: validar las precondiciones antes de procesar es una regla de oro innegociable.

## Consigna

Tu tarea es crear una herramienta de consola llamada `DiagnosticoConsola.java` que reciba parámetros de inicio, verifique que estén presentes y genere un reporte estructurado de inicialización del entorno.

### 1. Estructura de la Clase

Creá el archivo `DiagnosticoConsola.java` con la siguiente estructura base:

```java
public class DiagnosticoConsola {
    public static void main(String[] args) {
        // Tu lógica de validación e impresión aquí
    }
}
```

### 2. Flujo de Validación

1. **Sin argumentos (`args.length == 0`)**: emití el mensaje de uso y cortá la ejecución limpiamente.
2. **Un solo argumento (`args.length == 1`)**: avisá qué argumento se reconoció (`args[0]`) y cuál falta completar.
3. **Dos o más argumentos (`args.length >= 2`)**: capturá `args[0]` como el nombre del operador y `args[1]` como el módulo. Imprimí el bloque de diagnóstico formateado.
4. **Parámetros sobrantes (`args.length > 2`)**: informá cuántos argumentos extra se omitieron para que el operador sepa que envió datos no utilizados.

### 3. Compilación y Prueba en Terminal

Abrí tu consola en la carpeta donde guardaste el archivo y ejecutá:

```bash
# 1. Compilar el código fuente a bytecode
javac DiagnosticoConsola.java

# 2. Probar caso sin argumentos
java DiagnosticoConsola

# 3. Probar caso con un solo argumento
java DiagnosticoConsola Ada

# 4. Probar caso exitoso estándar
java DiagnosticoConsola Ada Microservicios

# 5. Probar con argumentos adicionales
java DiagnosticoConsola Ada Microservicios produccion replica1
```

Asegurate de que cada salida coincida con lo requerido y verificá que el archivo `DiagnosticoConsola.class` fue generado por el compilador `javac`.
