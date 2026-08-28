---
course: 'java'
slug: '20-testing-junit-y-spring-boot'
title: 'Testing with JUnit and Your First Spring Boot App'
description: 'Write unit tests with JUnit 5, understand the test pyramid and the AAA pattern, use mocks to isolate dependencies, and build a three-layer CRUD REST service with Spring Boot.'
order: 22
lang: 'en'
published: true
---

# Testing with JUnit and Your First Spring Boot App

You have reached the last lesson. You can already model domains with objects, pick data structures, handle errors, persist data, and query a database. What is left is what separates an exercise from a system other people use: **proving it works** and **exposing it so others can consume it**.

---

## 1. Why tests, in numbers

A bug costs differently depending on when you find it. While writing the code: minutes. In code review: an hour. In production: a 3 a.m. wake-up, an angry customer, and a rushed patch that probably introduces another bug.

Tests do not exist to "feel confident". They exist to **catch the bug on the first rung**, and so you can change code without fear. Without tests, refactoring is gambling.

<figure class="diagram">
<svg viewBox="0 0 720 310" role="img" aria-labelledby="d-pyr-t">
<title id="d-pyr-t">The test pyramid with its three levels, quantities, and speeds</title>
<polygon points="300,20 373,100 227,100" fill="var(--color-neutral-300)" stroke="var(--color-neutral-600)" stroke-width="2"/>
<polygon points="373,100 447,180 153,180 227,100" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<polygon points="447,180 520,260 80,260 153,180" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="300" y="82" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-neutral-900)">E2E</text>
<text x="300" y="148" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">Integration</text>
<text x="300" y="228" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">Unit</text>
<text x="540" y="60" font-size="12" font-weight="700" fill="var(--color-neutral-900)">End-to-end — very few</text>
<text x="540" y="78" font-size="11" fill="var(--color-neutral-700)">The whole app, with a browser.</text>
<text x="540" y="94" font-size="11" fill="var(--color-neutral-700)">Minutes, and they break on their own.</text>
<text x="540" y="136" font-size="12" font-weight="700" fill="var(--color-accent-700)">Integration — some</text>
<text x="540" y="154" font-size="11" fill="var(--color-neutral-800)">Several layers together, with a real</text>
<text x="540" y="170" font-size="11" fill="var(--color-neutral-800)">database. Seconds.</text>
<text x="540" y="212" font-size="12" font-weight="700" fill="var(--color-accent-2-700)">Unit — a great many</text>
<text x="540" y="230" font-size="11" fill="var(--color-neutral-800)">One class in isolation, no database,</text>
<text x="540" y="246" font-size="11" fill="var(--color-neutral-800)">no network. Milliseconds.</text>
<text x="0" y="284" font-size="12" fill="var(--color-neutral-800)">The shape matters: many fast tests at the bottom, very few slow ones on top. Invert the pyramid and you get a</text>
<text x="0" y="300" font-size="12" fill="var(--color-neutral-800)">suite that takes twenty minutes, fails for reasons unrelated to the code, and the team ends up ignoring.</text>
</svg>
<figcaption>If a test takes more than a second, nobody runs it before every commit. And a test that is not run protects nothing.</figcaption>
</figure>

---

## 2. JUnit 5 and the AAA pattern

<figure class="diagram">
<svg viewBox="0 0 720 280" role="img" aria-labelledby="d-aaa-t">
<title id="d-aaa-t">The Arrange-Act-Assert structure of a test</title>
<rect x="0" y="0" width="720" height="82" rx="16" fill="var(--color-accent-2-100)" stroke="var(--color-accent-2-400)"/>
<text x="20" y="26" font-size="12.5" font-weight="700" fill="var(--color-accent-2-700)">1. ARRANGE — set up</text>
<text x="200" y="26" font-size="11" fill="var(--color-neutral-800)">everything the test needs in order to exist</text>
<rect x="20" y="36" width="680" height="34" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-accent-2-400)"/>
<text x="34" y="58" font-size="11.5" fill="var(--color-text)">Calculator calc = new Calculator();</text>
<rect x="0" y="98" width="720" height="82" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="20" y="124" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">2. ACT — do the thing</text>
<text x="200" y="124" font-size="11" fill="var(--color-neutral-800)">run EXACTLY one thing: the one under test</text>
<rect x="20" y="134" width="680" height="34" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-accent)"/>
<text x="34" y="156" font-size="11.5" font-weight="700" fill="var(--color-accent-700)">int result = calc.add(5, 10);</text>
<rect x="0" y="196" width="720" height="82" rx="16" fill="var(--color-accent-2-100)" stroke="var(--color-accent-2-400)"/>
<text x="20" y="222" font-size="12.5" font-weight="700" fill="var(--color-accent-2-700)">3. ASSERT — verify</text>
<text x="200" y="222" font-size="11" fill="var(--color-neutral-800)">check the expected outcome, and nothing else</text>
<rect x="20" y="232" width="680" height="34" rx="10" fill="var(--color-neutral-100)" stroke="var(--color-accent-2-400)"/>
<text x="34" y="254" font-size="11.5" fill="var(--color-text)">assertEquals(15, result, "5 + 10 should be 15");</text>
</svg>
<figcaption>If your test has two "Act" blocks, it is really two tests. Split them: when one fails, you will know which of the two broke.</figcaption>
</figure>

```java
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

class CalculatorTest {

    private Calculator calc;

    @BeforeEach                        // runs before EACH test: always a clean state
    void setUpCalculator() {
        calc = new Calculator();
    }

    @Test
    @DisplayName("adding two positives returns their sum")
    void addTwoPositives() {
        int result = calc.add(5, 10);
        assertEquals(15, result);
    }

    @Test
    @DisplayName("dividing by zero throws ArithmeticException")
    void divideByZeroThrows() {
        // Verify the exception is thrown AND that it says the right thing
        ArithmeticException e = assertThrows(
            ArithmeticException.class,
            () -> calc.divide(10, 0)
        );
        assertTrue(e.getMessage().contains("zero"));
    }

    @ParameterizedTest                 // the same test, with many different inputs
    @CsvSource({ "1, 1, 2", "0, 0, 0", "-5, 5, 0", "2147483647, 0, 2147483647" })
    void addSeveralCases(int a, int b, int expected) {
        assertEquals(expected, calc.add(a, b));
    }
}
```

`@BeforeEach` matters more than it looks: **each test gets a fresh object**. If they shared state, a test could pass or fail depending on execution order, and that is worse than having no tests.

### What makes a test good

- **Fast.** Milliseconds. No sleeping, no network, no real database.
- **Independent.** Runs alone and in any order. Never depends on another test.
- **Repeatable.** Same result every time. Watch out for `LocalDate.now()` and random numbers.
- **Named so it explains.** `addTwoPositives` helps; `test1` says nothing when it fails at 3 a.m.
- **One reason to fail.** If it checks five different things, it is five tests.

---

## 3. Mocks: why interfaces mattered

You want to test `ProductService`, but it depends on `ProductRepository`, which hits the database. If the test needs a database it stops being a unit test: it is slow, brittle, and will not run on just any machine.

<figure class="diagram">
<svg viewBox="0 0 720 290" role="img" aria-labelledby="d-mock-t">
<title id="d-mock-t">The same service class receives the real implementation in production and a mock in tests</title>
<defs><marker id="ar-mk" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker></defs>
<rect x="210" y="10" width="300" height="66" rx="16" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="360" y="36" font-size="13" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">ProductService</text>
<text x="360" y="58" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">takes a ProductRepository via its constructor</text>
<line x1="360" y1="78" x2="360" y2="104" stroke="var(--color-accent)" stroke-width="2"/>
<rect x="210" y="104" width="300" height="48" rx="14" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="360" y="124" font-size="10.5" text-anchor="middle" fill="var(--color-accent-700)">«interface»</text>
<text x="360" y="143" font-size="12.5" font-weight="700" text-anchor="middle" fill="var(--color-accent-700)">ProductRepository</text>
<path d="M290 154 L160 154 L160 194" fill="none" stroke="var(--color-accent)" stroke-width="1.8" stroke-dasharray="6 4" marker-end="url(#ar-mk)"/>
<path d="M430 154 L560 154 L560 194" fill="none" stroke="var(--color-accent)" stroke-width="1.8" stroke-dasharray="6 4" marker-end="url(#ar-mk)"/>
<rect x="10" y="198" width="300" height="74" rx="16" fill="var(--color-neutral-200)" stroke="var(--color-neutral-500)"/>
<text x="160" y="222" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-neutral-900)">JdbcRepository</text>
<text x="160" y="242" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">IN PRODUCTION — hits PostgreSQL</text>
<text x="160" y="260" font-size="11" text-anchor="middle" fill="var(--color-neutral-700)">slow, needs the database running</text>
<rect x="410" y="198" width="300" height="74" rx="16" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="560" y="222" font-size="12" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-800)">mock(ProductRepository)</text>
<text x="560" y="242" font-size="11" text-anchor="middle" fill="var(--color-neutral-800)">IN THE TEST — returns whatever you say</text>
<text x="560" y="260" font-size="11" font-weight="700" text-anchor="middle" fill="var(--color-accent-2-700)">instant, no infrastructure</text>
<text x="0" y="288" font-size="12" fill="var(--color-neutral-800)">This only works because the service depends on the INTERFACE and receives it via constructor.</text>
</svg>
<figcaption>Dependency inversion: the class does not create what it needs, it receives it. That is what makes a design testable — and it is lesson 10 bearing its most concrete fruit.</figcaption>
</figure>

```java
import static org.mockito.Mockito.*;

@Test
void discountUsesThePriceFromTheRepository() {
    // Arrange: a test double returning exactly what we need
    ProductRepository repo = mock(ProductRepository.class);
    when(repo.findById(1L))
        .thenReturn(Optional.of(new Product(1L, "Tea", 1000.0, 10)));

    ProductService service = new ProductService(repo);   // ← injection

    // Act
    double finalPrice = service.discountedPrice(1L, 20);

    // Assert: the result, and that the repository was queried exactly once
    assertEquals(800.0, finalPrice, 0.001);
    verify(repo, times(1)).findById(1L);
}
```

If `ProductService` did `new JdbcRepository()` inside, this test would be impossible. **That is why dependencies are received, not created.**

---

## 4. Spring Boot: the three layers

Spring Boot takes that injection idea and automates it across the whole application.

<figure class="diagram">
<svg viewBox="0 0 720 330" role="img" aria-labelledby="d-spring-t">
<title id="d-spring-t">An HTTP request travelling through the three layers of a Spring Boot application</title>
<defs><marker id="ar-sp" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent)"/></marker><marker id="ar-sp2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-accent-2-700)"/></marker></defs>
<rect x="0" y="20" width="130" height="60" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="65" y="44" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-text)">Client</text>
<text x="65" y="62" font-size="10.5" text-anchor="middle" fill="var(--color-neutral-700)">GET /api/products/1</text>
<line x1="132" y1="50" x2="168" y2="50" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-sp)"/>
<rect x="172" y="10" width="548" height="80" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="192" y="34" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">@RestController — web layer</text>
<text x="192" y="54" font-size="11" fill="var(--color-neutral-800)">Translates HTTP into Java calls and back. Validates input and picks the status code.</text>
<text x="192" y="74" font-size="11" font-weight="700" fill="var(--color-accent-700)">NO business logic here. Tested with @WebMvcTest.</text>
<line x1="446" y1="92" x2="446" y2="112" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-sp)"/>
<rect x="172" y="116" width="548" height="80" rx="16" fill="var(--color-accent-2-200)" stroke="var(--color-accent-2-600)" stroke-width="2"/>
<text x="192" y="140" font-size="12.5" font-weight="700" fill="var(--color-accent-2-800)">@Service — business layer</text>
<text x="192" y="160" font-size="11" fill="var(--color-neutral-800)">The rules live here: discounts, domain validation, transactions.</text>
<text x="192" y="180" font-size="11" font-weight="700" fill="var(--color-accent-2-700)">Knows nothing about HTTP or SQL. Tested with plain JUnit and mocks.</text>
<line x1="446" y1="198" x2="446" y2="218" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-sp)"/>
<rect x="172" y="222" width="548" height="80" rx="16" fill="var(--color-accent-200)" stroke="var(--color-accent)" stroke-width="2"/>
<text x="192" y="246" font-size="12.5" font-weight="700" fill="var(--color-accent-700)">@Repository — data layer</text>
<text x="192" y="266" font-size="11" fill="var(--color-neutral-800)">Persistence only: the DAO from lesson 20, or Spring Data JPA.</text>
<text x="192" y="286" font-size="11" font-weight="700" fill="var(--color-accent-700)">Knows nothing about business rules. Tested with @DataJpaTest.</text>
<line x1="168" y1="262" x2="132" y2="262" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#ar-sp)"/>
<rect x="0" y="232" width="130" height="60" rx="14" fill="var(--color-neutral-200)" stroke="var(--color-divider)"/>
<text x="65" y="256" font-size="11.5" font-weight="700" text-anchor="middle" fill="var(--color-text)">Database</text>
<text x="65" y="274" font-size="10.5" text-anchor="middle" fill="var(--color-neutral-700)">PostgreSQL</text>
<path d="M60 20 L60 6 L700 6 L700 12" fill="none" stroke="var(--color-accent-2-700)" stroke-width="2" marker-end="url(#ar-sp2)"/>
<text x="380" y="326" font-size="12" fill="var(--color-neutral-800)">Each layer talks only to the one below, always through an interface. That is what makes them separately testable.</text>
<text x="0" y="326" font-size="11" font-weight="700" fill="var(--color-accent-2-700)">JSON back ↑</text>
</svg>
<figcaption>The separation is not bureaucracy: it is what lets you test business logic without starting a server or a database.</figcaption>
</figure>

```java
@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService service;

    // A single constructor → Spring injects automatically. No @Autowired needed.
    public ProductController(ProductService service) {
        this.service = service;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> get(@PathVariable long id) {
        return service.findById(id)
                      .map(ResponseEntity::ok)                    // 200 with the product
                      .orElse(ResponseEntity.notFound().build()); // 404 when absent
    }

    @PostMapping
    public ResponseEntity<Product> create(@Valid @RequestBody NewProduct data) {
        Product created = service.create(data);
        return ResponseEntity
                   .created(URI.create("/api/products/" + created.id()))   // 201
                   .body(created);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable long id) {
        return service.delete(id) ? ResponseEntity.noContent().build()   // 204
                                  : ResponseEntity.notFound().build();   // 404
    }
}

@Service
public class ProductService {

    private final ProductRepository repository;

    public ProductService(ProductRepository repository) {
        this.repository = repository;        // the interface, not the implementation
    }

    public double discountedPrice(long id, int percentage) {
        if (percentage < 0 || percentage > 100) {
            throw new IllegalArgumentException("Discount must be between 0 and 100");
        }
        Product p = repository.findById(id)
            .orElseThrow(() -> new ProductNotFoundException(id));
        return p.price() * (1 - percentage / 100.0);
    }
}
```

That `Optional` turning into a 200 or a 404 connects straight back to lesson 11: **"not found" is not an exception, it is a possible result**, and here it maps onto an HTTP status code.

### The status codes that actually matter

| Code | When |
| --- | --- |
| `200 OK` | The query succeeded and there is content. |
| `201 Created` | A resource was created. Also return its URL in the `Location` header. |
| `204 No Content` | It worked and there is nothing to return (classic for DELETE). |
| `400 Bad Request` | The data sent is invalid. |
| `404 Not Found` | The resource does not exist. |
| `409 Conflict` | It clashes with the current state (a duplicate email, for instance). |
| `500 Internal Server Error` | Something of yours broke. Never return this on purpose. |

---

## 5. Testing the Spring application

```java
// Web-layer test: starts ONLY the controller, with the service mocked out
@WebMvcTest(ProductController.class)
class ProductControllerTest {

    @Autowired  MockMvc mockMvc;
    @MockBean   ProductService service;      // not the real one: a mock

    @Test
    void returns404WhenTheProductDoesNotExist() throws Exception {
        when(service.findById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/products/99"))
               .andExpect(status().isNotFound());
    }

    @Test
    void returnsTheProductAsJson() throws Exception {
        when(service.findById(1L))
            .thenReturn(Optional.of(new Product(1L, "Tea", 3200.0, 45)));

        mockMvc.perform(get("/api/products/1"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.name").value("Tea"))
               .andExpect(jsonPath("$.price").value(3200.0));
    }
}

// Integration test: starts the whole application. Keep these few.
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ProductIntegrationTest {

    @Autowired TestRestTemplate rest;

    @Test
    void createAndRetrieveAProduct() {
        ResponseEntity<Product> created = rest.postForEntity(
            "/api/products", new NewProduct("Coffee", 5800.0, 12), Product.class);

        assertEquals(HttpStatus.CREATED, created.getStatusCode());

        Product read = rest.getForObject(
            "/api/products/" + created.getBody().id(), Product.class);
        assertEquals("Coffee", read.name());
    }
}
```

`@WebMvcTest` starts in a few hundred milliseconds because it only brings up the web layer. `@SpringBootTest` boots everything and takes seconds. **That difference is, once again, the pyramid.**

---

## 6. Common mistakes

| Mistake | What happens | How to fix it |
| --- | --- | --- |
| Tests that depend on execution order | They pass on your machine and fail in CI, with no explanation. | `@BeforeEach` with fresh state; nothing shared between tests. |
| One test checking five things | When it fails you cannot tell what broke. | One test, one reason to fail. |
| Using the real database in unit tests | Slow, brittle, and impossible to run in parallel. | Mocks for unit tests; H2 or Testcontainers for integration. |
| Tests using `LocalDate.now()` or `Math.random()` | They fail one day a year, or once in a hundred runs. | Inject a `Clock` or a fixed seed. |
| Creating dependencies with `new` inside the class | The class cannot be tested in isolation. | Take them via constructor, typed as the interface. |
| Business logic in the `@RestController` | It cannot be tested without booting the whole web context. | All logic in the `@Service`. |
| `@Autowired` on private fields | Impossible to construct the class by hand in a test. | Constructor injection. |
| Always returning `200 OK` | The client cannot distinguish success from failure. | Use the right codes: 201, 204, 404, 400. |
| Too many `@SpringBootTest` | The suite goes from seconds to twenty minutes. | `@WebMvcTest`, `@DataJpaTest`, or plain JUnit where it suffices. |

---

## 7. Guided hands-on exercise

### Challenge: `ProductServiceTest`

Test `ProductService` **without a database**, using a mocked repository:

1. `discountedPrice` computes a normal case correctly.
2. It throws `IllegalArgumentException` for an out-of-range percentage.
3. It throws `ProductNotFoundException` when the id does not exist.
4. `create` rejects negative prices and **never saves anything**.
5. A parameterized test covering several discounts at once.

<details>
<summary>See suggested solution</summary>

```java
import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@DisplayName("ProductService")
class ProductServiceTest {

    private ProductRepository repository;   // the test double
    private ProductService service;         // the thing under test

    @BeforeEach
    void setUpScenario() {
        // A fresh mock per test: no interaction leaks into the next one
        repository = mock(ProductRepository.class);
        service = new ProductService(repository);
    }

    @Nested
    @DisplayName("discountedPrice")
    class DiscountedPrice {

        @Test
        @DisplayName("applies the percentage to the repository's price")
        void appliesTheDiscount() {
            // ARRANGE
            when(repository.findById(1L))
                .thenReturn(Optional.of(new Product(1L, "Tea", 1000.0, 10)));

            // ACT — exactly one thing
            double result = service.discountedPrice(1L, 20);

            // ASSERT
            assertEquals(800.0, result, 0.001);
            verify(repository).findById(1L);          // it was queried
            verifyNoMoreInteractions(repository);     // and nothing else
        }

        @ParameterizedTest(name = "{0}% off $1000 → ${1}")
        @CsvSource({ "0, 1000.0", "10, 900.0", "50, 500.0", "100, 0.0" })
        @DisplayName("covers the whole valid discount range")
        void severalDiscounts(int percentage, double expected) {
            when(repository.findById(1L))
                .thenReturn(Optional.of(new Product(1L, "Tea", 1000.0, 10)));

            assertEquals(expected, service.discountedPrice(1L, percentage), 0.001);
        }

        @Test
        @DisplayName("rejects a percentage above 100")
        void rejectsInvalidPercentage() {
            IllegalArgumentException e = assertThrows(
                IllegalArgumentException.class,
                () -> service.discountedPrice(1L, 150)
            );
            assertTrue(e.getMessage().contains("between 0 and 100"));

            // Key point: it failed in validation, BEFORE touching the repository
            verifyNoInteractions(repository);
        }

        @Test
        @DisplayName("throws ProductNotFoundException when the id is absent")
        void missingProduct() {
            when(repository.findById(99L)).thenReturn(Optional.empty());

            assertThrows(ProductNotFoundException.class,
                         () -> service.discountedPrice(99L, 10));
        }
    }

    @Nested
    @DisplayName("create")
    class Create {

        @Test
        @DisplayName("rejects negative prices and saves nothing")
        void rejectsNegativePrice() {
            NewProduct invalid = new NewProduct("Coffee", -100.0, 5);

            assertThrows(IllegalArgumentException.class, () -> service.create(invalid));

            // The point of this test: validation cuts in BEFORE persisting
            verify(repository, never()).save(any());
        }

        @Test
        @DisplayName("saves the product and returns what the repository gives back")
        void savesValidProduct() {
            NewProduct data = new NewProduct("Coffee", 5800.0, 12);
            when(repository.save(any()))
                .thenReturn(new Product(7L, "Coffee", 5800.0, 12));

            Product created = service.create(data);

            assertEquals(7L, created.id());
            assertEquals("Coffee", created.name());
            verify(repository).save(argThat(p -> p.name().equals("Coffee")));
        }
    }
}
```

**The most valuable part of this suite is not the `assertEquals` calls, it is the `verify` calls.**

`verifyNoInteractions(repository)` in the invalid-percentage test proves something no `assertEquals` can: **that validation cuts in before the database is consulted**. If tomorrow someone reorders the method and fetches the product first, that test fails and tells you. It is a design rule turned into a test.

Same with `verify(repository, never()).save(any())`: it is not enough that the exception is thrown, you have to prove **nothing was persisted**. A service that validates after saving leaves junk in the database even when it throws the right error.

And notice all of this runs in **milliseconds**, with no database, no server, and no internet connection. That is a unit test.

</details>

---

## Key takeaways

- The **pyramid**: a great many fast unit tests at the bottom, very few end-to-end on top. Upside down, the suite becomes useless.
- **Arrange, Act, Assert.** One "Act" per test, and one reason to fail.
- A good test is fast, independent, repeatable, and named so it explains what broke.
- **Mocks** are only possible when a class **receives** its dependencies instead of creating them. That is lesson 10's interfaces paying off.
- Spring Boot splits into **three layers**: web (`@RestController`), business (`@Service`), and data (`@Repository`).
- Each layer is tested differently: `@WebMvcTest`, plain JUnit with mocks, `@DataJpaTest`. Use `@SpringBootTest` as little as possible.
- An empty `Optional` in the service becomes a `404` in the controller. The same idea, in two different languages.
- `verify` proves **how** something was done, not just the result. That is what turns a design decision into a guarantee.

---

## End of the course

You started with `System.out.println("Hello world")`.

You finish modeling domains with objects, choosing data structures with judgment, handling errors without swallowing them, persisting to files and databases, and exposing a REST service backed by tests.

What changed is not how much syntax you know: it is that you now understand **why** each tool exists and **what problem it came to solve**. A constructor is not ceremony, it is the guarantee that an object is born valid. An interface is not bureaucracy, it is what lets you swap the database without touching the logic. A test is not paperwork, it is what lets you refactor without fear.

That is what nobody learns in two hours, and it is exactly what will still serve you when the language of the moment is no longer Java.
</content>
