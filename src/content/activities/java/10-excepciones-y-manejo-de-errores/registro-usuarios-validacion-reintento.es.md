---
course: 'java'
lesson: '10-excepciones-y-manejo-de-errores'
slug: 'registro-usuarios-validacion-reintento'
title: 'Registro de Usuarios con Validación y Reintento'
description: 'Construí un registro por consola que valida DNI, nombre y edad, combina excepciones estándar y propias, y vuelve a pedir los datos hasta que sean válidos.'
kind: 'project'
order: 3
lang: 'es'
published: true
estimatedMinutes: 45
objectives:
  - 'Capturar InputMismatchException al leer números con Scanner y limpiar el buffer para reintentar.'
  - 'Lanzar IllegalArgumentException (unchecked) para datos inválidos y una excepción propia checked para una regla de negocio.'
  - 'Ordenar varios bloques catch de lo más específico a lo más general.'
  - 'Usar finally para cerrar el Scanner siempre.'
requirements:
  - 'Crear MenorDeEdadException extends Exception con dos constructores: uno sin argumentos (mensaje por defecto "La persona debe tener al menos 18 años.") y otro que reciba el mensaje.'
  - 'Crear validarDni(int dni): lanza IllegalArgumentException si dni <= 0.'
  - 'Crear validarNombre(String nombre): lanza IllegalArgumentException si el nombre está vacío.'
  - 'Crear validarEdad(int edad) throws MenorDeEdadException: IllegalArgumentException si edad < 0 o edad > 130; MenorDeEdadException si edad < 18.'
  - 'En main, repetir con un while hasta que los tres datos sean válidos. Capturar, en este orden: InputMismatchException, MenorDeEdadException, IllegalArgumentException y Exception.'
  - 'Ante InputMismatchException, descartar el texto inválido con nextLine() antes de reintentar.'
  - 'Cerrar el Scanner en un bloque finally.'
exampleOutput: |
  REGISTRO DE USUARIO
  Ingrese el DNI: abc
  [ERROR DE FORMATO] Debe ingresar un número entero.
  Ingrese el DNI: 30123456
  Ingrese el nombre: Laura
  Ingrese la edad: 16
  [ERROR DE REGLA DE NEGOCIO] La edad ingresada (16) es menor a 18 años.
  Por favor, intente ingresar los datos nuevamente.
  Ingrese el DNI: 30123456
  Ingrese el nombre: Laura
  Ingrese la edad: 25
  ¡Usuario registrado exitosamente!
  Fin del programa.
deliveryTips:
  - 'Después de nextInt(), llamá a nextLine() para consumir el salto de línea antes de leer el nombre.'
  - 'Si ponés catch (Exception e) antes de los específicos, el código no compila: el orden importa.'
  - 'Cada mensaje de error debe decir qué dato falló y por qué.'
---

## Contexto

Todo formulario real recibe datos erróneos: texto donde va un número, nombres vacíos, edades imposibles. Un programa robusto no se cae ni "se traga" el error: informa qué falló y deja reintentar.

## Consigna

Implementá `RegistroUsuario.java` siguiendo los requisitos. Distinguí entre errores de **formato** (`InputMismatchException`), errores de **datos** (`IllegalArgumentException`, unchecked) y una **regla de negocio** propia (`MenorDeEdadException`, checked). Probá con entradas válidas, texto en lugar de números, DNI negativo, nombre vacío, edad menor a 18 y edad mayor a 130.
