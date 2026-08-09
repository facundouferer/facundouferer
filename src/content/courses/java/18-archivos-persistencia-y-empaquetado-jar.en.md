---
course: 'java'
slug: '17-archivos-persistencia-y-empaquetado-jar'
title: 'Files, Serialization, and JAR Packaging'
description: 'Manage text and binary file persistence with Java I/O, serialize objects, and distribute JAR/EXE applications.'
order: 18
lang: 'en'
published: true
---

# Files, Serialization, and JAR Packaging

## 1. Java I/O Text Files
`BufferedReader` and `BufferedWriter`.

## 2. Object Serialization
`Serializable`, `ObjectOutputStream`, `ObjectInputStream`.

## 3. JAR Packaging
```bash
jar cvfe app.jar com.company.Main -C bin .
```

## 4. Hands-on Exercise
Serialize a product catalog list to `catalog.ser`.
