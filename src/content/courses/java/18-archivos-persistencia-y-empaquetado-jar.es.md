---
course: 'java'
slug: '17-archivos-persistencia-y-empaquetado-jar'
title: 'Archivos, Serialización y Empaquetado JAR'
description: 'Manejá la persistencia en archivos de texto y binarios con Java I/O, serializá objetos y distribuí aplicaciones JAR/EXE.'
order: 18
lang: 'es'
published: true
---

# Archivos, Serialización y Empaquetado JAR

## 1. Java I/O (Lectura y Escritura)
`BufferedReader` y `BufferedWriter`.

## 2. Serialización
`Serializable`, `ObjectOutputStream`, `ObjectInputStream`.

## 3. Empaquetado JAR y EXE
```bash
jar cvfe app.jar com.empresa.Main -C bin .
```

## 4. Ejercicio Práctico
Guardá y cargá un catálogo de productos serializado en `catalogo.ser`.
