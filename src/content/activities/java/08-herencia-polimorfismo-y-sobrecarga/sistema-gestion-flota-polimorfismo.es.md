---
course: 'java'
lesson: '08-herencia-polimorfismo-y-sobrecarga'
slug: 'sistema-gestion-flota-polimorfismo'
title: 'Sistema Polimórfico de Gestión de Flota Logística'
description: 'Modelá una jerarquía de vehículos de transporte aplicando herencia, constructores con super, sobrescritura con @Override y despacho dinámico sobre arreglos polimórficos.'
kind: 'project'
order: 1
lang: 'es'
published: true
estimatedMinutes: 50
objectives:
  - 'Modelar una jerarquía de clases coherente respetando la prueba del "es-un" (is-a).'
  - 'Reutilizar e inicializar atributos compartidos llamando al constructor de la superclase con super(...).'
  - 'Especializar comportamiento en subclases mediante sobrescritura controlada con @Override.'
  - 'Comprobar el despacho dinámico al procesar un arreglo de supertipo con instancias variadas.'
  - 'Diferenciar en la práctica la sobrecarga (tiempo de compilación) de la sobrescritura (tiempo de ejecución).'
requirements:
  - 'Crear la superclase Vehiculo.java con atributos protegidos patente (String), marca (String) y costoBaseKm (double).'
  - 'Incluir en Vehiculo un constructor canónico que inicialice todos sus atributos y los métodos calcularCostoViaje(double distanciaKm) y mostrarFicha().'
  - 'Crear la subclase Camion extends Vehiculo con atributo privado capacidadToneladas (double). Su constructor debe delegar en super(...) y sobrescribir calcularCostoViaje sumando un recargo por tonelada transportada.'
  - 'Crear la subclase Furgoneta extends Vehiculo con atributo privado tieneRefrigeracion (boolean). Delegar en super(...) y sobrescribir calcularCostoViaje agregando un adicional por cadena de frío.'
  - 'Crear la subclase MotoEnvios extends Vehiculo, delegando en super(...) y sobrescribiendo calcularCostoViaje con una bonificación por transporte liviano.'
  - 'Implementar sobrecarga de métodos en Vehiculo: calcularCostoViaje(double distanciaKm, double peajes) que sume el costo adicional de peajes.'
  - 'En MainFlota.java, instanciar un arreglo Vehiculo[] con al menos un Camión, una Furgoneta y una MotoEnvios.'
  - 'Recorrer el arreglo polimórficamente con un bucle for o for-each, mostrando la ficha y el costo calculado de cada vehículo sin usar cadenas de if-else para averiguar el tipo.'
exampleOutput: |
  === Reporte de Operaciones de Flota ===
  [Vehículo] Camión | Patente: AA123BB | Marca: Scania | Toneladas: 18.0
  Costo de viaje (150.0 km): $128500.0
  --------------------------------------------------
  [Vehículo] Furgoneta | Patente: AF456CD | Marca: Mercedes-Benz | Refrigerado: Sí
  Costo de viaje (150.0 km): $67500.0
  --------------------------------------------------
  [Vehículo] MotoEnvios | Patente: A099XYZ | Marca: Honda | Mensajería liviana
  Costo de viaje (150.0 km): $22950.0
  --------------------------------------------------
  Costo total operativo de la flota: $218950.0
deliveryTips:
  - 'Compilá con javac Vehiculo.java Camion.java Furgoneta.java MotoEnvios.java MainFlota.java y ejecutá con java MainFlota.'
  - 'Anotá siempre los métodos sobrescritos con @Override para que el compilador te proteja ante errores tipográficos en las firmas.'
  - 'Evitá usar instanceof para calcular costos: dejá que el despacho dinámico elija automáticamente la versión correspondiente de cada subclase.'
---

## Contexto

Una empresa de distribución logística administra distintos tipos de vehículos para sus operaciones de entrega: camiones pesados para transporte interurbano, furgonetas refrigeradas para productos perecederos y motos para envíos rápidos urbanos.

Si modelamos cada vehículo como una entidad aislada, terminaríamos duplicando datos esenciales (patente, marca, costos base) y llenando el sistema de condicionales frágiles para calcular tarifas. La **herencia** nos permite compartir atributos y lógica común en una superclase, mientras que el **polimorfismo** permite tratar a toda la flota de manera uniforme, delegando en cada vehículo particular el cálculo de su tarifa específica.

## Consigna

Vas a diseñar una arquitectura de clases en Java para este dominio logístico.

### 1. La superclase `Vehiculo`

- Atributos con modificador `protected`:
  - `patente` (`String`)
  - `marca` (`String`)
  - `costoBaseKm` (`double`)
- Constructor:
  - `public Vehiculo(String patente, String marca, double costoBaseKm)`
- Métodos:
  - `public double calcularCostoViaje(double distanciaKm)`: retorna `distanciaKm * costoBaseKm`.
  - `public double calcularCostoViaje(double distanciaKm, double peajes)`: **sobrecarga** que suma el monto de peajes al cálculo anterior.
  - `public void mostrarFicha()`: imprime la información base del vehículo.

### 2. Las subclases especializadas

- **`Camion extends Vehiculo`**:
  - Atributo propio `private double capacidadToneladas`.
  - Constructor: recibe patente, marca, costo base y capacidad en toneladas; invoca a `super(...)` en la primera línea.
  - Sobrescribe `calcularCostoViaje(double distanciaKm)` agregando un 5% extra por cada tonelada de capacidad: `(distanciaKm * costoBaseKm) * (1 + capacidadToneladas * 0.05)`.
- **`Furgoneta extends Vehiculo`**:
  - Atributo propio `private boolean tieneRefrigeracion`.
  - Constructor delegando en `super(...)`.
  - Sobrescribe `calcularCostoViaje(double distanciaKm)` agregando un recargo fijo de `$5000` si `tieneRefrigeracion` es verdadero.
- **`MotoEnvios extends Vehiculo`**:
  - Constructor delegando en `super(...)`.
  - Sobrescribe `calcularCostoViaje(double distanciaKm)` aplicando un descuento del 15% (`0.85`) respecto a la tarifa base.

### 3. Programa principal y despacho dinámico

En `MainFlota.java`:
- Creá un arreglo polimórfico `Vehiculo[] flota = new Vehiculo[3];`.
- Instanciá un `Camion`, una `Furgoneta` y una `MotoEnvios` guardándolos en el arreglo de tipo `Vehiculo`.
- Recorré el arreglo con un bucle:
  - Invocá `v.mostrarFicha()`.
  - Invocá `v.calcularCostoViaje(150.0)`.
  - Acumulá el costo total.
- Observá que Java invoca en tiempo de ejecución el método de la subclase real instanciada en el Heap, sin necesidad de consultar el tipo con `if` o `switch`.
