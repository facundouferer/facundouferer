---
course: 'java'
lesson: '20-testing-junit-y-spring-boot'
slug: 'api-rest-tdd-junit-spring'
title: 'Desarrollo Guiado por Pruebas (TDD) con JUnit 5 y API REST en Spring Boot'
description: 'Construí un servicio REST en 3 capas aplicando la pirámide de pruebas, el patrón AAA en JUnit 5 y buenas prácticas de inyección de dependencias en Spring Boot.'
kind: 'project'
order: 1
lang: 'es'
published: true
estimatedMinutes: 70
objectives:
  - 'Aplicar el ciclo TDD (Red-Green-Refactor) para modelar la lógica de negocio guiada por especificaciones.'
  - 'Estructurar pruebas unitarias limpias e independientes con JUnit 5 aplicando el patrón AAA (Arrange-Act-Assert).'
  - 'Diseñar una arquitectura en 3 capas (Controller, Service, Repository) desacoplada mediante inyección de dependencias por constructor.'
  - 'Exponer endpoints REST semánticos con Spring Boot manejando códigos de estado HTTP apropiados (200, 201, 400, 404).'
requirements:
  - 'Crear la clase de dominio Tarea con campos: id (Long), titulo (String), completada (boolean) y prioridad (Prioridad: ALTA, MEDIA, BAJA).'
  - 'Escribir primero la suite de pruebas unitarias TareaServiceTest con JUnit 5 utilizando @Test, @BeforeEach y @DisplayName.'
  - 'Probar exhaustivamente en TareaServiceTest: creación exitosa, rechazo con assertThrows de títulos vacíos o nulos, consulta por id existente y no existente.'
  - 'Implementar TareaService con inyección de dependencias de TareaRepository, haciendo pasar todas las pruebas unitarias en verde.'
  - 'Crear el controlador TareaController anotado con @RestController y @RequestMapping("/api/tareas").'
  - 'Implementar endpoints REST: GET /api/tareas (200 OK), GET /api/tareas/{id} (200 OK o 404 Not Found), POST /api/tareas (201 Created con cabecera Location) y DELETE /api/tareas/{id} (204 No Content).'
  - 'Diseñar un GlobalExceptionHandler o control de errores para responder con códigos HTTP semánticos ante excepciones de negocio.'
  - 'Crear una prueba de integración Web con @SpringBootTest o MockMvc verificando el contrato HTTP de la API.'
exampleOutput: |
  === Ejecución de Pruebas Unitarias JUnit 5 (Maven / Gradle) ===
  [INFO] Running com.ejemplo.tareas.TareaServiceTest
  [OK] crearTarea_conTituloValido_deberiaRetornarTareaGuardada() PASSED (14ms)
  [OK] crearTarea_conTituloVacio_deberiaLanzarIllegalArgumentException() PASSED (2ms)
  [OK] buscarPorId_conIdInexistente_deberiaLanzarTareaNoEncontradaException() PASSED (1ms)
  [INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0

  === Inicio de Servidor Spring Boot en Puerto 8080 ===
  [INFO] Tomcat started on port 8080 (http) with context path ''
  [INFO] Started TareasApplication in 1.450 seconds

  Pruebas HTTP vía cURL:
  > POST /api/tareas {"titulo": "Diseñar esquema DB", "prioridad": "ALTA"}
  < HTTP/1.1 201 Created
  < Location: /api/tareas/1
  < Body: {"id": 1, "titulo": "Diseñar esquema DB", "completada": false, "prioridad": "ALTA"}

  > GET /api/tareas/99
  < HTTP/1.1 404 Not Found
  < Body: {"error": "Tarea no encontrada con ID: 99"}
deliveryTips:
  - 'Preferí siempre la inyección de dependencias por constructor en lugar de @Autowired sobre campos privados; esto permite instanciar la clase en tests unitarios sin levantar el contexto de Spring.'
  - 'Asegurate de que cada test unitario tenga exactamente una sola acción en la fase ACT.'
  - 'Para verificar excepciones esperadas en JUnit 5, utilizá `assertThrows(MiExcepcion.class, () -> servicio.operar())`.'
---

## Contexto

El desarrollo de software profesional descansa sobre dos pilares:
1. **La pirámide de pruebas**: la base debe estar compuesta por cientos de pruebas unitarias ultrarrápidas (en milisegundos con JUnit 5) que aíslen cada componente sin levantar bases de datos ni servidores web. En la cúspide se ubican unas pocas pruebas de integración o E2E.
2. **Arquitectura desacoplada en Spring Boot**:
   - **Controlador (`@RestController`)**: traduce HTTP (JSON, códigos de estado, parámetros) hacia el dominio de la aplicación.
   - **Servicio (`@Service`)**: aloja las reglas de negocio e invariantes de dominio.
   - **Repositorio (`@Repository`)**: abstrae el acceso al medio de persistencia.

Mediante el enfoque **TDD (*Test-Driven Development*)**, primero especificamos el comportamiento esperado mediante una prueba que falla (**Red**), escribimos el código mínimo necesario para que pase (**Green**), y finalmente mejoramos el diseño y legibilidad sin alterar el comportamiento (**Refactor**).

## Consigna

Vas a construir un microservicio REST de tareas aplicando TDD riguroso en la capa de servicio y exponiendo endpoints HTTP semánticos en Spring Boot.

### 1. El Patrón AAA en JUnit 5

```java
@DisplayName("Pruebas Unitarias del Servicio de Tareas")
class TareaServiceTest {

    private TareaRepository repository;
    private TareaService service;

    @BeforeEach
    void setUp() {
        // ARRANGE: Aislamiento inicial antes de cada test
        repository = new FakeTareaRepository();
        service = new TareaService(repository);
    }

    @Test
    @DisplayName("Debe lanzar excepción si el título de la tarea está en blanco")
    void crearTarea_tituloVacio_lanzaExcepcion() {
        // ACT & ASSERT
        IllegalArgumentException ex = assertThrows(
            IllegalArgumentException.class,
            () -> service.crear("", Prioridad.ALTA)
        );
        assertEquals("El título no puede estar vacío", ex.getMessage());
    }
}
```

### 2. Implementación de la Capa de Servicio

```java
@Service
public class TareaService {
    private final TareaRepository repository;

    // Inyección de dependencias por constructor (Clean Code)
    public TareaService(TareaRepository repository) {
        this.repository = Objects.requireNonNull(repository);
    }

    public Tarea crear(String titulo, Prioridad prioridad) {
        if (titulo == null || titulo.trim().isEmpty()) {
            throw new IllegalArgumentException("El título no puede estar vacío");
        }
        Tarea nueva = new Tarea(null, titulo.trim(), false, prioridad);
        return repository.guardar(nueva);
    }
}
```

### 3. Controlador REST con Códigos Semánticos

```java
@RestController
@RequestMapping("/api/tareas")
public class TareaController {

    private final TareaService service;

    public TareaController(TareaService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Tarea> crear(@RequestBody CrearTareaDTO dto) {
        Tarea creada = service.crear(dto.titulo(), dto.prioridad());
        URI location = URI.create("/api/tareas/" + creada.getId());
        return ResponseEntity.created(location).body(creada);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tarea> obtenerPorId(@PathVariable Long id) {
        return service.buscarPorId(id)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
```
