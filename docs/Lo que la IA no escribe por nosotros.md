# Cómo formar desarrolladores en la era de los agentes de IA

Oct 10, 2026 · @Facundo Uferer

La pregunta ya no es si un desarrollador sabe escribir código, sino si sabe definir qué debe hacer el sistema, verificar que lo haga y explicar por qué está construido así. La inteligencia artificial hizo que escribir código lleve apenas segundos, pero alguien tiene que saber si ese código hace lo correcto y  esa responsabilidad sigue siendo humana.&#32;

Para una gran empresa, comprar licencias de herramientas de IA es la parte fácil. Lo que define el resultado es si los equipos desarrollan las habilidades para usarlas sin perder el control de sus propios sistemas.

## EL CUELLO DE BOTELLA

Hoy los desarrolladores ya no escriben código: lo orquestan con agentes de IA. Si la respuesta a los riesgos fuera revisar a mano cada línea generada, el humano se convertiría en el cuello de botella y se perdería la razón de usar la IA.

Además, la revisión manual ya no es una salvaguarda confiable: cuando el volumen de código generado crece, se termina aceptando con poca revisión. Una buena práctica podría ser basar la confianza en especificaciones y verificaciones que una máquina pueda comprobar, definidas antes de la implementación.

El rol del desarrollador cambia: de autor del código a **diseñador de la verificación**. Define qué debe cumplir el sistema, construye las pruebas y los controles automáticos que lo comprueban, y establece las reglas dentro de las cuales trabajan los agentes. Entender qué hace el sistema y por qué está organizado así no requiere conocer cada línea de código.

La revisión humana no desaparece, pero se vuelve puntual: se concentra en las decisiones de arquitectura y en las zonas críticas, como autorización, datos personales o pagos, donde los controles automáticos de seguridad son imprescindibles.

## DEUDA COGNITIVA

Es la erosión, con el tiempo, de la comprensión compartida que un equipo tiene sobre su sistema. El término lo propuso en 2026 la investigadora Margaret-Anne Storey.

Storey sostiene que la deuda técnica vive en el código, mientras que la deuda cognitiva vive en las personas. Con la IA, no hace falta que alguien entienda cada línea del código generado; lo que no puede perderse es cómo se llegó a ese código: qué problema buscaba resolver, qué decisiones se tomaron y qué alternativas se descartaron. Cuando eso se pierde, aparece la deuda cognitiva.

La IA acelera este problema por una razón simple: cuando un agente construye el sistema, el equipo deja de pasar por las decisiones que antes tomaba al programar. Un desarrollador puede integrar código, tests y documentación generados sin saber por qué se eligió ese diseño, qué supuestos se hicieron o qué reglas de negocio deben cumplirse siempre.

El efecto no es inmediato, y eso lo vuelve peligroso. El sistema sigue funcionando, pero la organización pierde poco a poco la capacidad de modificarlo, auditarlo o extenderlo con confianza. La IA puede reducir la deuda técnica mientras acelera la acumulación de deuda cognitiva.

La habilidad que esto exige es poder **explicar el sistema propio**: cómo está organizado, por qué, y qué se rompería si se cambia una pieza. No se trata de conocer cada línea, sino el mapa del sistema. Si nadie del equipo puede hacerlo, la deuda ya está ahí.

## DEUDA DE INTENCIÓN

Es la ausencia de razones explícitas y registradas sobre por qué un sistema es como es. Es la tercera pata del modelo de Storey: no vive en el código ni en las personas, sino en el conocimiento externalizado.

Incluye los objetivos del usuario, las alternativas descartadas, los supuestos y las restricciones que dieron forma a cada decisión. Cuando nada de eso está escrito, la intención depende de la memoria de quienes estuvieron presentes.

Un ejemplo cotidiano: un sistema de liquidación de sueldos calcula un adicional de forma distinta para un grupo de empleados. Nadie lo dejó escrito; quien lo pidió sabía que respondía a un acuerdo firmado hace años. Mientras esa persona está en la organización, todo funciona. Cuando se va, la regla parece un error y un recién llegado la "corrige". Un equipo estable puede tener poca deuda cognitiva y mucha deuda de intención; el problema aparece cuando esas personas o esas conversaciones ya no están.

Con la IA, ese recién llegado aparece todos los días: es el agente que trabaja sobre el código sin conocer su historia. Addy Osmani lo ilustra así: alguien pregunta por qué dos servicios se comunican por una cola y la respuesta honesta es "lo sugirió un agente y parecía bien". Esa respuesta ya es deuda de intención.

Pagar esta deuda no requiere herramientas costosas, sino hábitos:

- **Registros de decisiones de arquitectura (ADR):** documentos breves que dicen qué se decidió, por qué y qué se descartó.
- **Especificaciones y tests como expresión de la intención:** describen qué debe hacer el sistema, no solo cómo lo hace.
- **Instrucciones para los agentes versionadas junto al código:** los archivos de contexto, reglas y políticas también son parte del proyecto.

## CONOCIMIENTO DEL DOMINIO

La IA sabe mucho de programación en general, pero no sabe nada de una organización en particular: sus reglas, sus excepciones, su normativa ni su historia. Ese conocimiento es, cada vez más, el aporte distintivo del desarrollador.

Un reparto de roles razonable podría ser este: los agentes aportan el conocimiento de ingeniería de software y los humanos, el conocimiento de la organización. La cooperación entre ambos es lo que permite combinarlos.

Un ejemplo muestra por qué importa. La IA puede escribir un código que compila, pasa los tests y aun así está mal, porque viola una regla de negocio que nadie le explicó. Un trámite que en la práctica admite una excepción, un plazo que cambia según la normativa provincial, un dato que legalmente no puede mostrarse: nada de eso está en los datos de entrenamiento.

Este riesgo ya está medido. Una nota de investigación de la Cloud Security Alliance (abril de 2026) revisó estudios sobre aplicaciones generadas con IA. En uno de ellos, las vulnerabilidades críticas más comunes fueron fallas en la lógica de autorización y en la lógica de negocio, y los investigadores las atribuyeron a que la IA no comprende la intención del sistema en su conjunto. Es decir: los errores más graves aparecen justo donde falta conocimiento del dominio.

Solo quien conoce el dominio puede detectar ese error, porque solo esa persona sabe qué buscar. Por eso los desarrolladores necesitan conocer el negocio tanto como los analistas o los responsables del proyecto. Hoy todos somos un poco analistas del sistema.

El conocimiento del dominio se conecta directamente con las dos deudas anteriores. Es lo que permite escribir buenas especificaciones (pagar deuda de intención) y lo que da sentido a la comprensión del sistema (evitar deuda cognitiva). Un desarrollador que entiende el problema real no solo programa mejor: le da a la IA el contexto que no tiene.

## LEER BIEN

Leer siempre fue la mayor parte del trabajo de un desarrollador, y con la IA sigue siéndolo, aunque cambia qué se lee. Como los agentes escriben el código, el humano ya no lee línea por línea: lee requerimientos, especificaciones, planes de trabajo de los agentes, resultados de las pruebas y la arquitectura del sistema.

Un estudio de campo publicado en IEEE Transactions on Software Engineering (Xia y otros, 2018) siguió a 78 profesionales durante más de 3.000 horas de trabajo. Encontró que dedican en promedio alrededor del 58% de su tiempo a comprender programas, no a escribirlos. Además, los desarrolladores senior dedican a esa tarea un porcentaje menor que los junior: leer bien es parte de lo que hace a alguien senior.

El riesgo es que la IA erosione justamente esta habilidad. En un ensayo controlado de Anthropic con 52 desarrolladores, quienes aprendieron una librería nueva con asistencia de IA obtuvieron un 17% menos en las evaluaciones de comprensión. La mayor diferencia apareció en la capacidad de darse cuenta de cuándo el código es incorrecto y por qué.

"Leer bien" en el desarrollo de software abarca varias lecturas distintas:

- **Leer requerimientos** y **especificaciones**.
- **Leer los planes de los agentes**.
- **Leer críticamente la ****e****xp****lic****a****ció****n** **de la IA**** ****so****bre el ****s****is****te****m****a**.

No todo uso de la IA perjudica el aprendizaje, porque el problema no es usar IA, sino delegar el pensamiento.

## CÓMO SE CONECTAN

Los cuatro conceptos forman un mismo ciclo: dos deudas que crecen cuando delegamos sin entender, y dos habilidades que las pagan.

- **Deuda cognitiva.** Vive en las personas: se pierde la comprensión compartida del sistema. Se trabaja con diagramas y agentes que expliquen el sistema, y revisando el diseño en equipo.
- **Deuda de intención.** Vive en los documentos y artefactos: se pierde el porqué de las decisiones. Se trabaja con ADR, especificaciones, tests e instrucciones versionadas.
- **Conocimiento del dominio.** Vive en las personas y en la organización: aporta el contexto que la IA no tiene. Se trabaja conociendo el negocio, la normativa y a los usuarios.
- **Leer bien.** Vive en la práctica diaria: da la capacidad de detectar errores. Se trabaja leyendo requerimientos, especificaciones, planes de los agentes y resultados de pruebas.

Leer bien es la herramienta para no acumular deuda cognitiva. El conocimiento del dominio es la materia prima para pagar la deuda de intención. Y ambas habilidades se alimentan mutuamente: quien conoce el dominio sabe qué buscar al leer, y quien lee bien aprende el dominio.

## PLAN DE CAPACITACIONES&#32;

Este plan se sugiere para que lo lleven adelante las empresas que desarrollan software con IA. Reúne las capacitaciones y las prácticas que conviene promover frente a cada uno de las cuatro problemáticas. Ninguna requiere herramientas costosas; requieren tiempo asignado y que formen parte de la evaluación del equipo.

### Capacitaciones

| Capacitación | Conceptos que atiende |
| --- | --- |
| Diseño de verificación: especificaciones, tests y controles automáticos | Leer bien, deuda de intención |
| Orquestación de agentes: planificar, delegar y definir reglas | Deuda cognitiva, deuda de intención |
| Escritura técnica:  requerimientos e instrucciones para agentes | Deuda de intención |
| Inmersión en el negocio | Conocimiento del dominio |
| Uso responsable de asistentes de IA | Las cuatro |

### Prácticas que conviene promover

**Frente a la deuda cognitiva**

- **Herramientas que expliquen y diagramen el sistema**.
- **Agentes de IA que cuenten cómo es el sistema**.
- **Revisiones centradas en el diseño, no en las líneas**.

**Frente a la deuda de intención**

- **Capacitación en escritura técnica**.
- **Capacitación en especificaciones**.
- **Plantillas y repositorios estándar**.
- **Mucha documentación obligatoria**.

**Para fortalecer el conocimiento del dominio**

- **Contacto directo con usuarios y áreas de negocio**.
- **Inducción sobre el negocio, no solo sobre la tecnología**.
- **Glosarios y reglas de negocio documentadas**.

**Para leer bien**

- **Talleres de lectura de especificaciones y planes de agentes**.
- **Práctica de diagnóstico**.
- **Uso de los modos de aprendizaje de las herramientas**.

La IA funciona como un amplificador. Potencia lo que ya existe, tanto las fortalezas como las debilidades. Un equipo que comprende su sistema, registra sus decisiones y conoce su dominio va a ganar con la IA. Uno que no lo hace va a producir más rápido algo que entiende cada vez menos.

Para una empresa, la conclusión práctica es que la inversión en IA y la inversión en personas no compiten: la segunda es la condición para que la primera rinda. Capacitar en comprensión, verificación, registro de decisiones, conocimiento del negocio y lectura crítica es lo que convierte una herramienta potente en una ventaja real.

## Para saber Más

- Stack Overflow (2026). [Developer Survey 2026: AI](https://survey.stackoverflow.co/2026/ai). Datos sobre lineamientos de empleadores según [IT Brief](https://itbrief.co.uk/story/stack-overflow-survey-finds-developers-wary-of-ai-tools).
- Veracode (2026). [2026 GenAI Code Security Report](https://www.veracode.com/blog/2026-genai-code-security-report-ai-risk).
- Cloud Security Alliance (2026). [Vibe Coding Security Debt: AI-Generated Vulnerabilities at Scale](https://labs.cloudsecurityalliance.org/research/csa-research-note-ai-codegen-vulnerability-debt-2026).
- METR (2026). [Measuring the Self-Reported Impact of Early-2026 AI on Technical Worker Productivity](https://metr.org/blog/2026-05-11-ai-usage-survey/).
- Storey, M.-A. (2026). [From Technical Debt to Cognitive and Intent Debt: Rethinking Software Health in the Age of AI](https://arxiv.org/abs/2603.22106). ACM Queue 24(2).
- Osmani, A. (2026). [The Intent Debt](https://addyosmani.com/blog/intent-debt/).
- Shen, J. H. y Tamkin, A. (2026). [How AI assistance impacts the formation of coding skills](https://www.anthropic.com/research/AI-assistance-coding-skills). Anthropic.
- DORA / Google (2025). [State of AI-assisted Software Development](https://research.google/pubs/dora-2025-state-of-ai-assisted-software-development-report/). Edición más reciente del informe anual.
- Xia, X. y otros (2018). [Measuring Program Comprehension: A Large-Scale Field Study with Professionals](https://research.monash.edu/en/publications/measuring-program-comprehension-a-large-scale-field-study-with-pr/). IEEE Transactions on Software Engineering 44. Estudio de referencia sobre el tiempo dedicado a comprender código.
