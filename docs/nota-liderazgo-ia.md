# Se está corriendo el centro de gravedad de los desarrolladores hacia el liderazgo

Casi todo lo que se escribe sobre IA y desarrollo gira alrededor de una sola pregunta: *¿nos va a reemplazar?* Y creo que tal vez la pregunta puede estar equivocada, porque asume que programar era el trabajo. Escribir código era la parte que más tiempo consumía, sí. Nunca fue la parte que más valor generaba.

Cuando doy clases, la parte difícil nunca es la sintaxis. El `for`, el puntero, el `malloc`, todo eso se aprende. Lo que cuesta enseñar —lo que a veces no llego a enseñar en un cuatrimestre— es *decidir qué programa hay que escribir*. Cómo se piensa un problema antes de tocar el teclado. Cuál de las cinco soluciones posibles es la que se va a poder mantener dentro de dos años. Eso siempre fue la ingeniería. El código era el vehículo.

Lo que pasó en la última década es que esa distinción se borró, porque había tanta demanda de gente que escribiera código que "saber programar" y "ser ingeniero" se volvieron sinónimos en el mercado. La IA vino a deshacer esa confusión de la peor manera posible: automatizando justamente la mitad que se había confundido con el todo.

## Lo que no se puede delegar

Si un agente borra datos porque le di credenciales que no debía darle, el error no es del agente. Es mío, por no haber evaluado el riesgo. Es lo mismo que pasa con una persona recién incorporada al equipo: no le das acceso a producción el primer día, no porque desconfíes de ella, sino porque todavía no construiste el marco donde su trabajo es seguro. Con la IA es idéntico. La herramienta no tiene la culpa de cómo la usás.

Y acá está el giro: **construir ese marco es un trabajo de liderazgo, no de programación.**

## Del paso a paso al encuadre

Antes, programar era definir explícitamente cada paso. Ahora, trabajar con agentes es definir el objetivo, los criterios de éxito y las restricciones. Qué librerías sí y cuáles no. Qué patrones quiero y cuáles me van a complicar el mantenimiento. Qué permisos tiene. Cómo voy a verificar que lo que hizo está bien.

Es exactamente lo que se hace cuando se coordina un equipo. Somos cinco personas y ninguna hace lo mismo: hay desarrollo, producción audiovisual, diseño gráfico, gestión institucional. Nadie le escribe el código a nadie ni le diseña la pieza a nadie. Lo que se hace es traducir un pedido que llega de arriba —muchas veces ambiguo, a veces contradictorio— en objetivos claros, con restricciones explícitas y un criterio de "esto está listo" que todos entendamos igual.

Después reviso. Después me hago cargo.

Esa es la misma operación mental que uso frente a un agente.

## Lo que no cambia, y lo que cambia de forma

Primero, hay que seguir sabiendo programar. No para escribir cada línea a mano, sino porque no se puede supervisar lo que no se entiende. Es la razón por la que sigo dando el curso de desarrollo en la UTN sin ninguna culpa.

Alguien que nunca escribió un ciclo a mano no tiene con qué evaluar lo que un agente le devuelve; solo puede aceptarlo. Y aceptar sin evaluar es, para mí, el riesgo profesional más grande del sector ahora mismo, porque estos sistemas son extraordinariamente buenos haciendo que una respuesta equivocada parezca correcta.

Y segundo, la supervisión no desaparece: cambia de forma. Antes revisaba código línea por línea. Ahora reviso el encuadre: pido que se justifiquen las decisiones contra documentación oficial, corro los tests yo mismo en lugar de creerle al agente cuando dice que pasan y defino de antemano cómo voy a validar cada requisito de manera determinista.

La habilidad concreta que más me sirvió aprender este año no fue prompting: fue agarrar un requerimiento y partirlo en pedazos verificables.

## Por qué me importa

Escribo esto porque creo que hay mucha gente formándose para un trabajo que se está achicando, mientras el trabajo que crece no se enseña casi en ningún lado. Nadie te da una materia de "cómo definir criterios de aceptación", "cómo evaluar riesgo antes de delegar" o "cómo comunicar una decisión técnica hacia arriba y hacia abajo". Y son, cada vez más, el corazón de la profesión.

La ingeniería de software siempre fue esto. Solo que ahora ya no queda dónde esconderse detrás del código.