# LHGymApp

PWA personal para seguir rutinas de gimnasio (días, grupos musculares, ejercicios, series, superseries A+B, fallo, timer de descanso). Interfaz en español, pensada para usarse instalada en el celular, en vertical.

## Stack y estructura
- Sin build ni dependencias: HTML + CSS + JS vanilla.
- `index.html`: toda la app (~5100 líneas). CSS en el `<style>` principal y JS en el `<script>` principal, al final del archivo.
- `sw.js`: service worker cache-first. **Cada cambio que se publique requiere subir `CACHE` (`gym-vNN`)**, si no, el celular sigue mostrando la versión vieja. Cuando el usuario dice "no veo el cambio", casi siempre es esto.
- `manifest.json`, `icon.png`, `pelota.png`: assets de la PWA (el ícono/logo es la pelota).
- `mockup_*.html`, `preview_dashboard.html`, `sound_preview.html`: maquetas o pruebas sueltas, no forman parte de la app.

## Datos (localStorage)
- `gym_routine_structure_v8`: estructura de la rutina (con migraciones desde v3 a v7 en el arranque). Formato: lista de días `{dia, nombre, musculos, ejercicios: [{titulo} | {n, s, ...}]}`; los `{titulo}` son separadores de grupo muscular.
- `gym_data`: datos por ejercicio (peso, etc.). `gym_logs`: historial de entrenamientos. `gym_config`: ajustes (tema, acento, sonido del timer, etc.). `gym_timer`: estado del timer.
- Hay export/import de backup en JSON (`gym_backup_YYYY-MM-DD.json`). El usuario a veces importa rutinas en JSON hechas a mano. Si se cambia el formato de datos, hay que mantener la compatibilidad o agregar una migración. **Nunca perder datos del usuario.**

## Correr y desplegar
- Local: `python -m http.server 8082` (configurado en `.claude/launch.json` como `LHGymApp`).
- Producción: GitHub Pages desde `master`, en https://lucashorestein.github.io/LHGymApp/
- `C:\Users\horestein\Desktop\Apps\gym-deploy` es el proyecto viejo (antes en Netlify) del que salió este. **Los cambios se hacen solo en LHGymApp, no en gym-deploy.**

## Forma de trabajo (preferencias del usuario)
- Hablar en español rioplatense, con respuestas cortas y concretas.
- Cuando el pedido es ambiguo o dice "haceme preguntas", **preguntar antes de implementar**.
- En cambios visuales, si pide "mostrame como quedaría", **hacer primero un mockup/preview y esperar su OK** antes de tocar `index.html`.
- **Verificar en el navegador antes de decir que está listo**: viewport mobile, tema oscuro y claro, ejercicio simple y combinado A+B. Le molesta mucho que se le diga "listo" y no se vea el cambio, o que se rompa algo que funcionaba.
- Una rama por cambio (`fix/...`, `feat/...`), un PR contra `master`. Prefiere que Claude haga todo (commit, push, PR) y le pase el link para mergear.
- Commits en español con prefijo `feat:` / `fix:` / `chore:`.

## Reglas de diseño
- Textos en mayúsculas y minúsculas normales (no TODO EN MAYÚSCULAS), también en Ajustes.
- Color de acento elegible en Ajustes (default naranja `#e8722a`, `--accent` / `--accent-rgb`). Bordes de días, campos numéricos, botón Fallo activo, toasts, etc. usan el acento.
- Tema oscuro por defecto; tema claro "beige crema" opcional en Ajustes (no sigue al sistema). En claro todo debe ser legible (texto oscuro) y todas las cards de días del mismo color vainilla.
- Nombres de día y de ejercicio centrados; si son largos, pasan a 2 renglones centrados sin tapar los botones.
- Cards limpias, sin líneas separadoras internas; nada puede quedar cortado en el celular.
- Header dentro del día: oculto al bajar y visible al subir (hide on scroll), con el logo a la derecha.
- Press&hold sin selección de texto del navegador.

## Comportamiento clave
- **Días**: alta, edición, borrado y orden con drag&drop. La numeración se recalcula al borrar. Press&hold en un día: editar, marcar como finalizado eligiendo la fecha, desmarcar (desmarca también todas las series).
- **Ejercicios / grupos musculares**: ABM y reordenamiento con press&hold + drag, con auto-scroll en los bordes.
- **Autoguardado**: los cambios dentro de un día se guardan al salir aunque no se toque "Guardar día".
- **Superserie A+B**: Fallo A, Fallo B o ambos, independientes. Con fallo, el campo de reps es un input normal (sin "F"). Sin fallo, solo checks de series.
- **Timer del ejercicio**: se elige el tiempo en un popup (presets + min/seg manuales con teclado numérico). Arranca solo al marcar una serie y se detiene al terminar, sin repetirse. Se puede ocultar con la X. **No avanza a la siguiente card.**
- **Timer de descanso entre ejercicios** (separador, normalmente 3 min): tiene play/reset visibles. Al completar la última serie, la pantalla hace scroll para mostrar el separador y la próxima card (si es el último ejercicio, no hace scroll).
- Los timers se calculan con `Date.now()` para que sigan bien con el teléfono bloqueado.
- El sonido de fin del timer es una campana de boxeo / estilo Rocky (Web Audio) y se puede activar o desactivar en Ajustes.
- Export de la rutina a PDF: solo los ejercicios que alguna vez se completaron.

## Probado y descartado (no volver a proponer)
- Recordatorio para tomar agua: no funciona con el teléfono bloqueado.
- Cronómetro: solo queda el timer.
- Botón "Iniciar hoy" / reset del día.
- Rediseño minimalista estilo "Tesla".

## Otros
- Hubo charlas sobre vender la app a gimnasios con un sistema de licencia de 30 días, gestionado por el gimnasio y sin intervención del usuario. Eso iba en un proyecto aparte, no en este.
