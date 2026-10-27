# Bitácora de prompts

**Herramienta de IA usada:** Claude (Anthropic).

| # | Prompt de ajuste enviado | Problema que buscaba resolver | Resultado obtenido | ¿Funcionó? |
|---|---|---|---|---|
| 1 | Prompt completo de la versión 2: pasar a Tailwind v4 con Play CDN y agregar menú hamburguesa, modo oscuro y formulario de contacto con validación y toast | La v1 usaba CSS plano y no tenía hamburguesa, modo oscuro ni formulario | La IA entregó `index.html` + `script.js` con Tailwind v4 y todos los componentes | Parcial: la página salió sin estilos por el error `Cannot apply unknown utility class 'group'`; se corrigió a mano quitando `group` del `@apply` y poniéndolo en el HTML de los botones del acordeón |
| 2 | "agrega un favicon sencillo para que la web no quede co…" (mensaje cortado al enviarlo) | La pestaña mostraba el ícono por defecto | La IA detectó el mensaje cortado y agregó un favicon SVG en línea (taza de café sobre cuadro verde) | Sí |
| 3 | "en la barra de navegacion para telefono agregale el color verde que llevamos trabajando" | La cabecera del celular se veía casi negra | La IA explicó que era el modo oscuro y preguntó qué opción quería | Parcial: pidió aclaración |
| 4 | "el verde de la marca" | Igual que la fila 3 | Cabecera y menú en `#2F4F3A` también en modo oscuro; foco de la cabecera en blanco por contraste | Sí |
| 5 | "la imagen principal no tiene mucha forma de tza de cafe ajustala" | La ilustración del hero no se reconocía como taza de café | La IA rehízo el SVG: cuerpo ancho arriba y angosto abajo, asa, plato, café en la boca y tres hilos de vapor, con colores de marca y versión para modo oscuro. Aclaró que no lo vio dentro de la página real | Sí |

## Cambios manuales (sin IA)

| # | Cambio | Archivo | Qué hace |
|---|---|---|---|
| 1 | Efecto hover con transición en las tarjetas del menú: `transition duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0` | `index.html` (regla `.tarjeta`) | Al pasar el mouse la tarjeta sube un poco y tiene sombra; se desactiva con `motion-reduce` |
| 2 | Nueva sección "Nuestros valores" con 3 tarjetas y su enlace "Valores" en la navegación | `index.html` | Reutiliza la clase `.tarjeta` y la cuadrícula `grid-cols-1 md:grid-cols-3` |
| 3 | Regla nueva de validación: el campo Mensaje debe tener mínimo 10 caracteres | `script.js` (función `mensajeDeError`) | Muestra "Cuéntanos un poco más, mínimo 10 caracteres." al salir del campo y al enviar |
