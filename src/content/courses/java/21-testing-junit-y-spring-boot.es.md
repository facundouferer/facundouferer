---
course: 'java'
slug: '20-testing-junit-y-spring-boot'
title: 'Testing con JUnit y Tu Primera App en Spring Boot'
description: 'Escribí pruebas unitarias con JUnit 5, entendé la pirámide de tests y el patrón AAA, usá mocks para aislar dependencias, y construí un servicio REST CRUD en tres capas con Spring Boot.'
order: 21
lang: 'es'
published: true
---

# Testing con JUnit y Tu Primera App en Spring Boot

Llegaste a la última lección. Ya sabés modelar con objetos, elegir estructuras de datos, manejar errores, persistir y consultar una base. Falta lo que separa un ejercicio de un sistema que otras personas usan: **demostrar que funciona** y **exponerlo para que lo consuman**.

---

## 1. Por qué los tests, en números

Un bug cuesta distinto según cuándo lo encontrás. Escribiendo el código: minutos. En code review: una hora. En producción: una madrugada, un cliente enojado y un parche apurado que probablemente introduzca otro bug.

Los tests no existen para "estar seguros". Existen para **encontrar el bug en el primer escalón**, y para que puedas cambiar código sin miedo. Sin tests, refactorizar es apostar.

<figure class="diagram">
<svg viewBox="0 0 720 310" role="img" aria-labelledby="d-pir-t">
<title id="d-pir-t">La pirámide de tests con sus tres niveles, cantidades y velocidades</title>
<polygon points="300,20 373,100 227,100" fill="var(--color-neutral-300)" stroke="var(--color-neutral-600)" stroke-width="2"/>
<polygon points="373,100 447,180 153,180 227,100" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<polygon points="447,180 520,260 80,260 153,180" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="300" y="82" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-neutral-900)">E2E</text>
<text x="300" y="148" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">Integración</text>
<text x="300" y="228" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">Unitarios</text>
<text x="540" y="60" font-size="12" font-weight="700" fill="var(--color-neutral-900)">End-to-end — poquísimos</text>
<text x="540" y="78" font-size="11" fill="var(--color-neutral-700)">La app entera, con navegador.</text>
<text x="540" y="94" font-size="11" fill="var(--color-neutral-700)">Minutos, y se rompen solos.</text>
<text x="540" y="136" font-size="12" font-weight="700" fill="var(--color-accent-700)">Integración — algunos</text>
<text x="540" y="154" font-size="11" fill="var(--color-neutral-800)">Varias capas juntas, con base</text>
<text x="540" y="170" font-size="11" fill="var(--color-neutral-800)">de datos real. Segundos.</text>
<text x="540" y="212" font-size="12" font-weight="700" fill="var(--color-accent-2-700)">Unitarios — muchísimos</text>
<text x="540" y="230" font-size="11" fill="var(--color-neutral-800)">Una clase aislada, sin base ni</text>
<text x="540" y="246" font-size="11" fill="var(--color-neutral-800)">red. Milisegundos.</text>
<text x="0" y="284" font-size="12" fill="var(--color-neutral-800)">La forma importa: muchos tests rápidos abajo, poquísimos lentos arriba. Invertir la pirámide da una suite que</text>
<text x="0" y="300" font-size="12" fill="var(--color-neutral-800)">tarda veinte minutos, falla por motivos ajenos al código, y que el equipo termina ignorando.</text>
</svg>
<figcaption>Si un test tarda más de un segundo, nadie lo corre antes de cada commit. Y un test que no se corre no protege nada.</figcaption>
</figure>

---

## 2. JUnit 5 y el patrón AAA

<figure class="diagram">
<svg viewBox="0 0 720 280" role="img" aria-labelledby="d-aaa-t">
<title id="d-aaa-t">La estructura Arrange-Act-Assert de un test</title>
<rect x="0" y="0" width="720" height="82" rx="16" fill="var(--color-accent-2-100)" stroke="var(--color-accent-2-400)"/>
<text x="20" y="26" font-size="12.5" font-weight="700" fill="var(--color-accent-2-700)">1. ARRANGE — preparar</text>
<text x="200" y="26" font-size="11" fill="var(--color-neutral-800)">todo lo que el test necesita para existir</text>
<rect x="20" y="36" width="680" height="34" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-accent-2-400)"/>
<text x="34" y="58" font-size="11.5" fill="var(--color-text)">Calculadora calc = new Calculadora();</text>
<rect x="0" y="98" width="720" height="82" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="20" y="124" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">2. ACT — actuar</text>
<text x="200" y="124" font-size="11" fill="var(--color-neutral-800)">ejecutar EXACTAMENTE una cosa: la que se está probando</text>
<rect x="20" y="134" width="680" height="34" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-accent)"/>
<text x="34" y="156" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">int resultado = calc.sumar(5, 10);</text>
<rect x="0" y="196" width="720" height="82" rx="16" fill="var(--color-accent-2-100)" stroke="var(--color-accent-2-400)"/>
<text x="20" y="222" font-size="12.5" font-weight="700" fill="var(--color-accent-2-700)">3. ASSERT — verificar</text>
<text x="200" y="222" font-size="11" fill="var(--color-neutral-800)">comprobar el resultado esperado, y nada más</text>
<rect x="20" y="232" width="680" height="34" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-accent-2-400)"/>
<text x="34" y="254" font-size="11.5" fill="var(--color-text)">assertEquals(15, resultado, "5 + 10 debería dar 15");</text>
</svg>
<figcaption>Si tu test tiene dos bloques "Act", en realidad son dos tests. Separalos: cuando falle, vas a saber cuál de las dos cosas se rompió.</figcaption>
</figure>

```java
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

class CalculadoraTest {

    private Calculadora calc;

    @BeforeEach                        // corre antes de CADA test: estado limpio siempre
    void prepararCalculadora() {
        calc = new Calculadora();
    }

    @Test
    @DisplayName("sumar dos positivos devuelve su suma")
    void sumarDosPositivos() {
        int resultado = calc.sumar(5, 10);
        assertEquals(15, resultado);
    }

    @Test
    @DisplayName("dividir por cero lanza ArithmeticException")
    void dividirPorCeroLanzaExcepcion() {
        // Verificamos que la excepción se lanza Y que dice lo correcto
        ArithmeticException e = assertThrows(
            ArithmeticException.class,
            () -> calc.dividir(10, 0)
        );
        assertTrue(e.getMessage().contains("cero"));
    }

    @ParameterizedTest                 // el mismo test, con muchos datos distintos
    @CsvSource({ "1, 1, 2", "0, 0, 0", "-5, 5, 0", "2147483647, 0, 2147483647" })
    void sumarVariosCasos(int a, int b, int esperado) {
        assertEquals(esperado, calc.sumar(a, b));
    }
}
```

`@BeforeEach` es más importante de lo que parece: **cada test recibe un objeto nuevo**. Si compartieran estado, un test podría pasar o fallar según el orden en que se ejecuten, y eso es peor que no tener tests.

### Qué hace bueno a un test

- **Rápido.** Milisegundos. Nada de dormir, ni de red, ni de base real.
- **Independiente.** Corre solo y en cualquier orden. Nunca depende de otro test.
- **Repetible.** Mismo resultado siempre. Cuidado con `LocalDate.now()` y con números aleatorios.
- **Con nombre que explica.** `sumarDosPositivos` sirve; `test1` no dice nada cuando falla a las tres de la mañana.
- **Un solo motivo para fallar.** Si verifica cinco cosas distintas, son cinco tests.

---

## 3. Mocks: por qué las interfaces importaban

Querés testear `ProductoServicio`, pero depende de `ProductoRepositorio`, que va a la base de datos. Si el test necesita una base, deja de ser unitario: es lento, frágil y no corre en cualquier máquina.

<figure class="diagram">
<svg viewBox="0 0 720 290" role="img" aria-labelledby="d-mock-t">
<title id="d-mock-t">La misma clase de servicio recibe la implementación real en producción y un mock en los tests</title>
<defs><marker id="ar-mk" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<rect x="210" y="10" width="300" height="66" rx="16" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="360" y="36" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">ProductoServicio</text>
<text x="360" y="58" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">recibe un ProductoRepositorio por constructor</text>
<line x1="360" y1="78" x2="360" y2="104" stroke="var(--color-accent)" stroke-width="2"/>
<rect x="210" y="104" width="300" height="48" rx="14" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="360" y="124" font-size="10.5" text-anchor="middle" fill="var(--color-accent-700)">«interface»</text>
<text x="360" y="143" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">ProductoRepositorio</text>
<path d="M290 154 L160 154 L160 194" fill="none" stroke="var(--color-accent)" stroke-width="1.8" stroke-dasharray="6 4" marker-end="url(#ar-mk)"/>
<path d="M430 154 L560 154 L560 194" fill="none" stroke="var(--color-accent)" stroke-width="1.8" stroke-dasharray="6 4" marker-end="url(#ar-mk)"/>
<rect x="10" y="198" width="300" height="74" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="160" y="222" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-neutral-900)">RepositorioJdbc</text>
<text x="160" y="242" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">EN PRODUCCIÓN — va a PostgreSQL</text>
<text x="160" y="260" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">lento, necesita la base levantada</text>
<rect x="410" y="198" width="300" height="74" rx="16" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="560" y="222" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">mock(ProductoRepositorio)</text>
<text x="560" y="242" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">EN EL TEST — devuelve lo que vos digas</text>
<text x="560" y="260" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-700)">instantáneo, sin infraestructura</text>
<text x="0" y="288" font-size="12" fill="var(--color-neutral-800)">Esto solo funciona porque el servicio depende de la INTERFAZ y la recibe por constructor. Si hiciera new adentro,</text>
</svg>
<figcaption>Inversión de dependencias: la clase no crea lo que necesita, lo recibe. Es lo que hace testeable un diseño — y es la lección 10 dando su fruto más concreto.</figcaption>
</figure>

```java
import static org.mockito.Mockito.*;

@Test
void aplicarDescuentoUsaElPrecioDelRepositorio() {
    // Arrange: un doble de prueba que devuelve lo que necesitamos
    ProductoRepositorio repo = mock(ProductoRepositorio.class);
    when(repo.buscarPorId(1L))
        .thenReturn(Optional.of(new Producto(1L, "Yerba", 1000.0, 10)));

    ProductoServicio servicio = new ProductoServicio(repo);   // ← inyección

    // Act
    double precioFinal = servicio.precioConDescuento(1L, 20);

    // Assert: el resultado, y que se consultó el repositorio una sola vez
    assertEquals(800.0, precioFinal, 0.001);
    verify(repo, times(1)).buscarPorId(1L);
}
```

Si `ProductoServicio` hiciera `new RepositorioJdbc()` adentro, este test sería imposible. **Por eso las dependencias se reciben, no se crean.**

---

## 4. Spring Boot: las tres capas

Spring Boot toma esa idea de inyección y la automatiza para toda la aplicación.

<figure class="diagram">
<svg viewBox="0 0 720 330" role="img" aria-labelledby="d-spring-t">
<title id="d-spring-t">Recorrido de una petición HTTP por las tres capas de una aplicación Spring Boot</title>
<defs><marker id="ar-sp" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker><marker id="ar-sp2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-2-700)"/></marker></defs>
<rect x="0" y="20" width="130" height="60" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="65" y="44" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-text)">Cliente</text>
<text x="65" y="62" font-size="10.5" text-anchor="middle" fill="var(--color-neutral-700)">GET /api/productos/1</text>
<line x1="132" y1="50" x2="168" y2="50" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-sp)"/>
<rect x="172" y="10" width="548" height="80" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="192" y="34" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">@RestController — capa web</text>
<text x="192" y="54" font-size="11" fill="var(--color-neutral-800)">Traduce HTTP a llamadas Java y de vuelta. Valida la entrada y elige el código de estado.</text>
<text x="192" y="74" font-size="11" font-weight="700" fill="var(--color-accent-700)">NO tiene lógica de negocio. Se prueba con @WebMvcTest.</text>
<line x1="446" y1="92" x2="446" y2="112" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-sp)"/>
<rect x="172" y="116" width="548" height="80" rx="16" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="192" y="140" font-size="12.5" font-weight="700" fill="var(--color-accent-2-800)">@Service — capa de negocio</text>
<text x="192" y="160" font-size="11" fill="var(--color-neutral-800)">Acá viven las reglas: descuentos, validaciones de dominio, transacciones.</text>
<text x="192" y="180" font-size="11" font-weight="700" fill="var(--color-accent-2-700)">No sabe nada de HTTP ni de SQL. Se prueba con JUnit puro y mocks.</text>
<line x1="446" y1="198" x2="446" y2="218" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-sp)"/>
<rect x="172" y="222" width="548" height="80" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="192" y="246" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">@Repository — capa de datos</text>
<text x="192" y="266" font-size="11" fill="var(--color-neutral-800)">Solo persistencia: el DAO de la lección 20, o Spring Data JPA.</text>
<text x="192" y="286" font-size="11" font-weight="700" fill="var(--color-accent-700)">No sabe nada de reglas de negocio. Se prueba con @DataJpaTest.</text>
<line x1="168" y1="262" x2="132" y2="262" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-sp)"/>
<rect x="0" y="232" width="130" height="60" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="65" y="256" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-text)">Base de datos</text>
<text x="65" y="274" font-size="10.5" text-anchor="middle" fill="var(--color-neutral-700)">PostgreSQL</text>
<path d="M60 20 L60 6 L700 6 L700 12" fill="none" stroke="var(--color-accent-2-700)" stroke-width="2" marker-end="url(#ar-sp2)"/>
<text x="380" y="326" font-size="12" fill="var(--color-neutral-800)">Cada capa habla solo con la de abajo, y siempre a través de una interfaz. Por eso se puede probar por separado.</text>
<text x="0" y="326" font-size="11" font-weight="700" fill="var(--color-accent-2-700)">JSON de vuelta ↑</text>
</svg>
<figcaption>La separación no es burocracia: es lo que permite testear la lógica de negocio sin levantar un servidor ni una base de datos.</figcaption>
</figure>

```java
@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoServicio servicio;

    // Un solo constructor → Spring inyecta solo. No hace falta @Autowired.
    public ProductoController(ProductoServicio servicio) {
        this.servicio = servicio;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtener(@PathVariable long id) {
        return servicio.buscarPorId(id)
                       .map(ResponseEntity::ok)                 // 200 con el producto
                       .orElse(ResponseEntity.notFound().build()); // 404 si no está
    }

    @PostMapping
    public ResponseEntity<Producto> crear(@Valid @RequestBody NuevoProducto datos) {
        Producto creado = servicio.crear(datos);
        return ResponseEntity
                   .created(URI.create("/api/productos/" + creado.id()))   // 201
                   .body(creado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable long id) {
        return servicio.eliminar(id) ? ResponseEntity.noContent().build()   // 204
                                     : ResponseEntity.notFound().build();   // 404
    }
}

@Service
public class ProductoServicio {

    private final ProductoRepositorio repositorio;

    public ProductoServicio(ProductoRepositorio repositorio) {
        this.repositorio = repositorio;      // la interfaz, no la implementación
    }

    public double precioConDescuento(long id, int porcentaje) {
        if (porcentaje < 0 || porcentaje > 100) {
            throw new IllegalArgumentException("El descuento debe estar entre 0 y 100");
        }
        Producto p = repositorio.buscarPorId(id)
            .orElseThrow(() -> new ProductoNoEncontradoException(id));
        return p.precio() * (1 - porcentaje / 100.0);
    }
}
```

Ese `Optional` que se transforma en 200 o en 404 conecta directamente con la lección 11: **"no existe" no es una excepción, es un resultado posible**, y acá se traduce a un código HTTP.

### Los códigos de estado que sí importan

| Código | Cuándo |
| --- | --- |
| `200 OK` | La consulta salió bien y hay contenido. |
| `201 Created` | Se creó un recurso. Devolvé también la URL en el header `Location`. |
| `204 No Content` | Salió bien y no hay nada que devolver (típico del DELETE). |
| `400 Bad Request` | Los datos que mandaron son inválidos. |
| `404 Not Found` | El recurso no existe. |
| `409 Conflict` | Choca con el estado actual (por ejemplo, un email duplicado). |
| `500 Internal Server Error` | Se rompió algo tuyo. Nunca devuelvas esto a propósito. |

---

## 5. Testear la aplicación Spring

```java
// Test de la capa web: levanta SOLO el controlador, con el servicio simulado
@WebMvcTest(ProductoController.class)
class ProductoControllerTest {

    @Autowired  MockMvc mockMvc;
    @MockBean   ProductoServicio servicio;      // no es el real: es un mock

    @Test
    void devuelve404CuandoElProductoNoExiste() throws Exception {
        when(servicio.buscarPorId(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/productos/99"))
               .andExpect(status().isNotFound());
    }

    @Test
    void devuelveElProductoEnJson() throws Exception {
        when(servicio.buscarPorId(1L))
            .thenReturn(Optional.of(new Producto(1L, "Yerba", 3200.0, 45)));

        mockMvc.perform(get("/api/productos/1"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.nombre").value("Yerba"))
               .andExpect(jsonPath("$.precio").value(3200.0));
    }
}

// Test de integración: levanta la aplicación entera. Pocos de estos.
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ProductoIntegracionTest {

    @Autowired TestRestTemplate rest;

    @Test
    void crearYRecuperarUnProducto() {
        ResponseEntity<Producto> creado = rest.postForEntity(
            "/api/productos", new NuevoProducto("Café", 5800.0, 12), Producto.class);

        assertEquals(HttpStatus.CREATED, creado.getStatusCode());

        Producto leido = rest.getForObject(
            "/api/productos/" + creado.getBody().id(), Producto.class);
        assertEquals("Café", leido.nombre());
    }
}
```

`@WebMvcTest` arranca en cientos de milisegundos porque levanta solo la capa web. `@SpringBootTest` levanta todo y tarda segundos. **Esa diferencia es, otra vez, la pirámide.**

---

## 6. Errores frecuentes

| Error | Qué pasa | Cómo se arregla |
| --- | --- | --- |
| Tests que dependen del orden de ejecución | Pasan en tu máquina y fallan en CI, sin ninguna explicación. | `@BeforeEach` con estado nuevo; nada compartido entre tests. |
| Un test que verifica cinco cosas | Cuando falla, no sabés cuál se rompió. | Un test, un motivo para fallar. |
| Usar la base de datos real en tests unitarios | Lentos, frágiles y sin poder correrse en paralelo. | Mocks para lo unitario; H2 o Testcontainers para integración. |
| Tests con `LocalDate.now()` o `Math.random()` | Fallan un día del año o una vez cada cien corridas. | Inyectar un `Clock` o una semilla fija. |
| Crear las dependencias con `new` dentro de la clase | La clase no se puede testear aisladamente. | Recibirlas por constructor, tipadas con la interfaz. |
| Lógica de negocio en el `@RestController` | No se puede probar sin levantar el contexto web entero. | Toda la lógica en el `@Service`. |
| Usar `@Autowired` sobre campos privados | Imposible construir la clase a mano en un test. | Inyección por constructor. |
| Devolver siempre `200 OK` | El cliente no puede distinguir éxito de error. | Usar los códigos correctos: 201, 204, 404, 400. |
| Muchos `@SpringBootTest` | La suite pasa de segundos a veinte minutos. | `@WebMvcTest`, `@DataJpaTest`, o JUnit puro donde alcance. |

---

## 7. Ejercicio práctico guiado

### Desafío: `ProductoServicioTest`

Testeá `ProductoServicio` **sin base de datos**, con un mock del repositorio:

1. `precioConDescuento` calcula bien un caso normal.
2. Lanza `IllegalArgumentException` con un porcentaje fuera de rango.
3. Lanza `ProductoNoEncontradoException` cuando el id no existe.
4. `crear` rechaza precios negativos y **no llega a guardar nada**.
5. Un test parametrizado que cubra varios descuentos de una vez.

<details>
<summary>Ver solución sugerida</summary>

```java
import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@DisplayName("ProductoServicio")
class ProductoServicioTest {

    private ProductoRepositorio repositorio;   // el doble de prueba
    private ProductoServicio servicio;         // lo que estamos probando

    @BeforeEach
    void prepararEscenario() {
        // Mock nuevo en cada test: ninguna interacción se filtra al siguiente
        repositorio = mock(ProductoRepositorio.class);
        servicio = new ProductoServicio(repositorio);
    }

    @Nested
    @DisplayName("precioConDescuento")
    class PrecioConDescuento {

        @Test
        @DisplayName("aplica el porcentaje sobre el precio del repositorio")
        void aplicaElDescuento() {
            // ARRANGE
            when(repositorio.buscarPorId(1L))
                .thenReturn(Optional.of(new Producto(1L, "Yerba", 1000.0, 10)));

            // ACT — una sola cosa
            double resultado = servicio.precioConDescuento(1L, 20);

            // ASSERT
            assertEquals(800.0, resultado, 0.001);
            verify(repositorio).buscarPorId(1L);        // se consultó
            verifyNoMoreInteractions(repositorio);      // y nada más
        }

        @ParameterizedTest(name = "{0}% de $1000 → ${1}")
        @CsvSource({ "0, 1000.0", "10, 900.0", "50, 500.0", "100, 0.0" })
        @DisplayName("cubre todo el rango válido de descuentos")
        void variosDescuentos(int porcentaje, double esperado) {
            when(repositorio.buscarPorId(1L))
                .thenReturn(Optional.of(new Producto(1L, "Yerba", 1000.0, 10)));

            assertEquals(esperado, servicio.precioConDescuento(1L, porcentaje), 0.001);
        }

        @Test
        @DisplayName("rechaza un porcentaje mayor a 100")
        void rechazaPorcentajeInvalido() {
            IllegalArgumentException e = assertThrows(
                IllegalArgumentException.class,
                () -> servicio.precioConDescuento(1L, 150)
            );
            assertTrue(e.getMessage().contains("entre 0 y 100"));

            // Clave: falló en la validación, ANTES de tocar el repositorio
            verifyNoInteractions(repositorio);
        }

        @Test
        @DisplayName("lanza ProductoNoEncontradoException si el id no existe")
        void productoInexistente() {
            when(repositorio.buscarPorId(99L)).thenReturn(Optional.empty());

            assertThrows(ProductoNoEncontradoException.class,
                         () -> servicio.precioConDescuento(99L, 10));
        }
    }

    @Nested
    @DisplayName("crear")
    class Crear {

        @Test
        @DisplayName("rechaza precios negativos y no guarda nada")
        void rechazaPrecioNegativo() {
            NuevoProducto invalido = new NuevoProducto("Café", -100.0, 5);

            assertThrows(IllegalArgumentException.class, () -> servicio.crear(invalido));

            // Lo importante del test: la validación corta ANTES de persistir
            verify(repositorio, never()).guardar(any());
        }

        @Test
        @DisplayName("guarda el producto y devuelve el que trae el repositorio")
        void guardaProductoValido() {
            NuevoProducto datos = new NuevoProducto("Café", 5800.0, 12);
            when(repositorio.guardar(any()))
                .thenReturn(new Producto(7L, "Café", 5800.0, 12));

            Producto creado = servicio.crear(datos);

            assertEquals(7L, creado.id());
            assertEquals("Café", creado.nombre());
            verify(repositorio).guardar(argThat(p -> p.nombre().equals("Café")));
        }
    }
}
```

**Lo más valioso de esta suite no son los `assertEquals`, son los `verify`.**

`verifyNoInteractions(repositorio)` en el test del porcentaje inválido demuestra algo que ningún `assertEquals` puede: **que la validación corta antes de consultar la base**. Si mañana alguien reordena el método y busca el producto primero, ese test falla y te avisa. Es una regla de diseño convertida en test.

Lo mismo con `verify(repositorio, never()).guardar(any())`: no alcanza con que se lance la excepción, hay que probar que **no se persistió nada**. Un servicio que valida después de guardar deja basura en la base incluso cuando lanza el error correcto.

Y fijate que todo esto corre en **milisegundos**, sin base de datos, sin servidor y sin conexión a internet. Eso es un test unitario.

</details>

---

## Para llevarte

- La **pirámide**: muchísimos tests unitarios rápidos abajo, poquísimos end-to-end arriba. Al revés, la suite se vuelve inútil.
- **Arrange, Act, Assert.** Un solo "Act" por test, y un solo motivo para fallar.
- Un buen test es rápido, independiente, repetible y tiene un nombre que explica qué se rompió.
- Los **mocks** solo son posibles si la clase **recibe** sus dependencias en lugar de crearlas. Ahí están las interfaces de la lección 10 dando fruto.
- Spring Boot separa en **tres capas**: web (`@RestController`), negocio (`@Service`) y datos (`@Repository`).
- Cada capa se prueba distinto: `@WebMvcTest`, JUnit puro con mocks, `@DataJpaTest`. `@SpringBootTest`, lo mínimo posible.
- Un `Optional` vacío en el servicio se traduce en un `404` en el controlador. La misma idea, en dos lenguajes distintos.
- `verify` prueba **cómo** se hizo algo, no solo el resultado. Es lo que convierte una decisión de diseño en una garantía.

---

## Fin del curso

Empezaste con `System.out.println("Hola mundo")`.

Terminás modelando dominios con objetos, eligiendo estructuras de datos con criterio, manejando errores sin tragarlos, persistiendo en archivos y en bases, y exponiendo un servicio REST con tests que lo respaldan.

Lo que cambió no es la cantidad de sintaxis que sabés: es que ahora entendés **por qué** cada herramienta existe y **qué problema vino a resolver**. Un constructor no es ceremonia, es la garantía de que un objeto nazca válido. Una interfaz no es burocracia, es lo que te deja cambiar la base de datos sin tocar la lógica. Un test no es un trámite, es lo que te permite refactorizar sin miedo.

Eso es lo que no se aprende en dos horas, y es exactamente lo que te va a servir cuando el lenguaje de moda ya no sea Java.
</content>
