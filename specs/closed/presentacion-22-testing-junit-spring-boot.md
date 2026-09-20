# Spec: Presentación Interactiva — Testing con JUnit 5, Mockito y Spring Boot

## 1. Identificación y Metadatos
- **Lección vinculada**: `courses/java/20-testing-junit-y-spring-boot`
  - Archivo de lección: `src/content/courses/java/22-testing-junit-y-spring-boot.es.md`
  - Slug de la lección: `20-testing-junit-y-spring-boot`
- **Slug de la presentación**: `testing-junit-spring-boot-java`
- **Archivo de componente**: `src/components/presentaciones/testing-junit-spring-boot-java.astro`
- **Asset de tarjeta**: `/img/presentations/testing-junit-spring-boot-java.svg`
- **Registro en `src/data/presentations.ts`**:
  - `tag`: `{ es: 'Java', en: 'Java' }`
  - `title`: `{ es: 'Testing con JUnit 5, Mockito y Arquitectura Spring Boot', en: 'Testing with JUnit 5, Mockito, and Spring Boot Architecture' }`
  - `description`: `{ es: 'Pirámide de tests, patrón AAA, aislamiento con dobles de prueba (Mockito) y la arquitectura en 3 capas de Spring Boot.', en: 'Test pyramid, AAA pattern, test doubles isolation (Mockito), and Spring Boot 3-tier architecture.' }`
  - `lesson`: `{ course: 'java', slug: '20-testing-junit-y-spring-boot' }`

---

## 2. Propósito Pedagógico y Énfasis Visual

La transición entre resolver algoritmos individuales y construir software comercial mantenible descansa en la verificación automatizada y la arquitectura de capas:
- Visualizar el **costo exponencial de los errores** según la etapa donde se detectan, justificando la **Pirámide de Testing**.
- Desglosar la disciplina del **Patrón AAA (Arrange, Act, Assert)** en JUnit 5 y la importancia del aislamiento con `@BeforeEach`.
- Comprender el propósito de los **Dobles de Prueba (*Mocks*) con Mockito**: aislar la unidad de software sin tocar bases de datos reales ni enviar correos reales.
- Ilustrar la **Arquitectura en 3 Capas de Spring Boot** (Controller, Service, Repository) y cómo la **Inyección de Dependencias** por constructor facilita el testing.
- Recorrer el flujo de datos integral de una petición REST desde la llegada del JSON hasta la persistencia.

---

## 3. Desglose Detallado de Diapositivas y Diagramas Gráficos

### Slide 1: La Economía del Software y la Pirámide de Testing
- **Aspecto conceptual**: Un bug descubierto en desarrollo cuesta minutos; en producción cuesta reputación y miles de dólares. La pirámide define la proporción ideal de pruebas: muchos tests unitarios rápidos, algunos de integración, poquísimos E2E.
- **Gráfica requerida (SVG de la pirámide y métricas de velocidad)**:
  - Cúspide: E2E (Navegador real, red real). Velocidad: minutos. Cantidad: 5%.
  - Centro: Integración (Contexto Spring, Base de datos en memoria). Velocidad: segundos. Cantidad: 20%.
  - Base: Unitarios (JUnit 5 + Mocks puros en RAM). Velocidad: milisegundos. Cantidad: 75%.
  - Contraste con el antipatrón "Cono de Helado Invertido" (muchos E2E frágiles que tardan horas y suites que nadie ejecuta).
- **Interacción**: Calculadora interactiva que compara el tiempo de feedback entre suites unitarias e integración pesada.

### Slide 2: El Patrón AAA en Acción con JUnit 5
- **Aspecto conceptual**: Cada test debe responder a una única pregunta y estar estructurado en 3 fases: Preparar el escenario (*Arrange*), Ejecutar la acción (*Act*), Verificar las aserciones (*Assert*).
- **Gráfica requerida (SVG de 3 paneles)**:
  - Bloque 1 (Arrange - verde claro): Instanciación de `Calculadora` y preparación de argumentos.
  - Bloque 2 (Act - terracotta): La llamada exacta `calc.sumar(5, 10)` resaltada en un marco de ejecución único.
  - Bloque 3 (Assert - sage): `assertEquals(15, resultado)` con visualización del valor esperado vs el valor obtenido.
  - Diagrama de ciclo de vida con `@BeforeEach`: Cada prueba recibe una instancia limpia, garantizando la idempotencia y evitando contaminación de estado entre tests.

### Slide 3: Dobles de Prueba (*Mocks*) con Mockito
- **Aspecto conceptual**: Probar `PedidoService` no debe conectarse a la pasarela de pagos Visa real ni cobrar dinero. Un Mock es un doble controlado que responde según se le instruya.
- **Gráfica requerida (SVG de aislamiento de componentes)**:
  - En el centro: La clase bajo prueba real `PedidoService`.
  - A los lados: Sus colaboradores externos reemplazados por Mocks:
    - `PasarelaPago` (Mock): `when(pasarela.cobrar(...)).thenReturn(true);`
    - `InventarioRepository` (Mock): `when(inventario.hayStock(...)).thenReturn(true);`
  - Verificación de comportamiento: `verify(pasarela, times(1)).cobrar(...)` asegurando que no se cobró dos veces por error.
- **Interacción**: Simulador de escenarios: cambiar el comportamiento del mock (éxito, fondos insuficientes, timeout de red) y ver cómo el servicio gestiona cada situación.

### Slide 4: Arquitectura en 3 Capas de Spring Boot e Inyección de Dependencias
- **Aspecto conceptual**: Separación estricta de responsabilidades en microservicios REST: Controller (traducción HTTP/JSON), Service (reglas de negocio puras), Repository (persistencia).
- **Gráfica requerida (SVG de tuberías y capas)**:
  - Capa 1: `@RestController` (recibe `@RequestBody ProductoDTO`, valida y devuelve `ResponseEntity`).
  - Capa 2: `@Service` (aplica reglas de precios, descuentos, validaciones de dominio).
  - Capa 3: `@Repository` (comunica con SQL / Hibernate / JPA).
  - Flechas de Inyección de Dependencias por constructor: `ProductoController(ProductoService service)` permitiendo inyectar mocks sin necesidad de levantar el contenedor pesado de Spring.

### Slide 5: El Ciclo de Vida de una Petición REST Completa
- **Aspecto conceptual**: Traza visual de una petición `POST /productos` con payload JSON desde el cliente hasta el disco y su respuesta.
- **Gráfica requerida (Diagrama de secuencia SVG animado)**:
  - Paso 1: Petición HTTP entrante con JSON `{"nombre": "Café", "precio": 3.5}`.
  - Paso 2: Jackson deserializa el JSON en un objeto Java `ProductoDTO`.
  - Paso 3: El Controller delega en `productoService.crear(dto)`.
  - Paso 4: El Service calcula impuestos y transforma el DTO en una entidad de dominio `Producto`.
  - Paso 5: El Repository guarda la entidad en la base relacional (`INSERT INTO...`).
  - Paso 6: El Controller empaqueta la respuesta con código `HTTP 201 Created` y el header `Location`.

---

## 4. Estilo y Tokens de Diseño Organic
- Esquema de colores refinado: `--color-accent` (terracotta) para lógica de testing y aserciones, `--color-accent-2` (sage) para validaciones exitosas de Spring Boot, bordes suaves y tipografía Organic.

## 5. Criterios de Aceptación
- **GIVEN** la lección `courses/java/20-testing-junit-y-spring-boot`
- **WHEN** un estudiante explora la presentación
- **THEN** domina la estructura AAA para tests unitarios, sabe cuándo y cómo utilizar mocks con Mockito, y comprende el flujo en 3 capas de una aplicación Spring Boot moderna.
