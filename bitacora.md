# Bitácora de prompts

**Herramienta de IA usada:** Claude (Anthropic).

| # | Prompt de ajuste enviado | Problema que buscaba resolver | Resultado obtenido | ¿Funcionó? |
|---|---|---|---|---|
| 1 | Prompt completo de la versión 2: pasar a Tailwind v4 con Play CDN y agregar menú hamburguesa, modo oscuro y formulario de contacto con validación y toast | La v1 usaba CSS plano y no tenía hamburguesa, modo oscuro ni formulario | La IA entregó `index.html` + `script.js` con Tailwind v4 y todos los componentes | Parcial: la página salió sin estilos por el error `Cannot apply unknown utility class 'group'`; se corrigió a mano quitando `group` del `@apply` y poniéndolo en el HTML de los botones del acordeón |
| 2 | "agrega un favicon sencillo para que la web no quede co…" (mensaje cortado al enviarlo) | La pestaña mostraba el ícono por defecto | La IA detectó el mensaje cortado y agregó un favicon SVG en línea (taza de café sobre cuadro verde) | COMPLETAR tras probar |
| 3 | "en la barra de navegacion para telefono agregale el color verde que llevamos trabajando" | La cabecera del celular se veía casi negra | La IA explicó que era el modo oscuro y preguntó qué opción quería | Parcial: pidió aclaración |
| 4 | "el verde de la marca" | Igual que la fila 3 | Cabecera y menú en `#2F4F3A` también en modo oscuro; foco de la cabecera en blanco por contraste | COMPLETAR tras probar |
| 5 | "la imagen principal no tiene mucha forma de tza de cafe ajustala" | La ilustración del hero no se reconocía como taza de café | La IA rehízo el SVG: cuerpo ancho arriba y angosto abajo, asa, plato, café en la boca y tres hilos de vapor, con colores de marca y versión para modo oscuro. Aclaró que no lo vio dentro de la página real | COMPLETAR tras verlo en el navegador (claro y oscuro) |
