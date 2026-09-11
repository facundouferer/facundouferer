**OmniRoute: un solo gateway para gobernarlos a todos**

Usar IA para programar empieza siendo sencillo: instalamos Claude Code, Codex o Cline y seguimos adelante. Después aparecen distintas API keys, modelos, límites, proveedores gratuitos, cuotas y fallbacks. En algún momento uno descubre que está administrando infraestructura de LLMs cuando originalmente sólo quería corregir un componente de React.

**OmniRoute** intenta resolver precisamente ese problema. Es un gateway open source bajo licencia MIT que se ejecuta localmente y coloca una capa común entre nuestras herramientas y los proveedores de inteligencia artificial. Claude Code, Codex, OpenCode, Cline y otros clientes pueden apuntar al mismo endpoint, mientras OmniRoute se encarga del routing. El proyecto declara actualmente soporte para **352 proveedores y más de 1.200 modelos**.

La función especialmente interesante es `auto`. En lugar de seleccionar manualmente un modelo, podemos pedirle a OmniRoute que evalúe las conexiones disponibles y elija automáticamente. Existen variantes como `auto/coding`, orientada a programación; `auto/fast`, que prioriza latencia; `auto/cheap`, centrada en precio; y `auto/offline`, que favorece proveedores con mayor cuota disponible. Si una opción falla o agota su límite, el sistema puede continuar por otra ruta. También existen 19 estrategias configurables, desde round-robin hasta optimización de costes, contexto o caché.

El proyecto va bastante más allá: incluye dashboard, seguimiento de cuotas, compresión de contexto, MCP, A2A, ejecución remota y herramientas de observabilidad. Es potente, aunque para comenzar conviene fingir que el 80 % de esas opciones todavía no existe. Ya habrá tiempo para convertir nuestro portátil en una pequeña bolsa de valores de tokens.

**Guía rápida para principiantes**

Primero necesitás **Node.js 22.22.2 o superior compatible**. Después instalá OmniRoute:

`npm install -g omniroute`

Arrancalo con:

`omniroute`

El dashboard aparecerá en:

[`http://localhost:20128`](http://localhost:20128)

y la API compatible con OpenAI estará en:

[`http://localhost:20128/v1`](http://localhost:20128/v1)

OmniRoute permite probar `auto` incluso sin configurar inicialmente credenciales. Desde **Providers** también podés conectar los proveedores que quieras utilizar.

El siguiente paso es conectar tu herramienta de programación. Para clientes compatibles con OpenAI utilizá:

`Base URL: [http://localhost:20128/v1](http://localhost:20128/v1)`

`Model: auto`

La API key puede copiarse desde **Dashboard → Endpoints**. Para comprobar que todo funciona:

`curl [http://localhost:20128/v1/models](http://localhost:20128/v1/models) -H "Authorization: Bearer TU_API_KEY"`

También podés entrar en [`http://localhost:20128/dashboard/cli-code`](http://localhost:20128/dashboard/cli-code), seleccionar Claude Code, Codex, OpenCode u otra herramienta compatible y dejar que OmniRoute genere o aplique su configuración.

Un detalle importante: Claude Code utiliza como base [`http://localhost:20128`](http://localhost:20128), **sin** `/v1`, mientras Codex y los clientes OpenAI-compatible usan `/v1`. Es una diferencia diminuta, exactamente de esas capaces de consumir cuarenta minutos de una tarde.

OmniRoute cobra verdadero sentido cuando usamos varios modelos o agentes. En vez de casar nuestro flujo de trabajo con un proveedor concreto, convierte la selección del modelo en infraestructura intercambiable. **El IDE o agente pide inteligencia; OmniRoute decide de dónde obtenerla.** Esa separación puede resultar bastante más importante que simplemente ahorrar algunos tokens.