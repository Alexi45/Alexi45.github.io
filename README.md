# Web personal — Alejandro Riscart Rosado

Sitio estático, sin build y sin dependencias, listo para GitHub Pages.
Bilingüe español/inglés, tema claro y oscuro, responsive e imprimible como CV.

```
alejandro-web/
├── index.html            ← todo el contenido
├── assets/
│   ├── styles.css        ← paleta, tipografía, componentes, impresión
│   ├── script.js         ← idioma, tema, paleta ⌘K, canvas, animaciones
│   ├── favicon.svg
│   └── og-image.jpg      ← vista previa al compartir el enlace
├── serve.js              ← servidor local para previsualizar
├── robots.txt
├── sitemap.xml
└── .nojekyll
```

## Ver en local

Doble clic en `index.html`, o bien:

```bash
node serve.js
```

y abre http://localhost:4002

## Publicar en GitHub Pages

Tu web actual vive en el repo `Alexi45.github.io` y se sirve en https://alexi45.github.io/.
Para sustituirla por esta:

```bash
git clone https://github.com/Alexi45/Alexi45.github.io.git ~/Desktop/repo-pages
```

Borra el contenido viejo de `repo-pages` (deja la carpeta `.git`), copia dentro
todo lo de `alejandro-web` y sube los cambios:

```bash
cp -R ~/Desktop/alejandro-web/. ~/Desktop/repo-pages/ && cd ~/Desktop/repo-pages && git add -A && git commit -m "Nueva web personal" && git push
```

En 1-2 minutos estará en https://alexi45.github.io/.

---

## Cosas que deberías personalizar

1. **Tu foto.** Guarda una foto tuya como `assets/foto.jpg` y aparecerá
   automáticamente en lugar del monograma "AR". Sin foto, se ve el monograma.
2. **Fechas y detalle de Minsait.** En `index.html`, dentro de la sección
   `EXPERIENCIA`, hay un comentario `▼ REVISA LAS FECHAS...`. Puse
   "2022 — Actualidad" y una descripción genérica de consultoría porque tu
   LinkedIn no mostraba los títulos exactos. Si has tenido varios puestos,
   duplica el bloque `<li class="tl-item">`.
3. **Estadísticas** de "Sobre mí" (atributos `data-count`). El número de
   repositorios se actualiza solo desde la API pública de GitHub; los otros dos
   son manuales.
4. **CV en PDF.** Guarda tu currículum como
   `assets/CV-Alejandro-Riscart-Rosado.pdf` y aparecerán solos el botón "CV" del
   menú y el enlace "Descargar CV". Si el archivo no está, esos enlaces se
   ocultan para no dejar enlaces rotos.

   Truco: la web ya está preparada para imprimirse como currículum. Ábrela,
   Cmd+P → "Guardar como PDF" y tienes un CV decente sin hacer nada más.

---

## Qué hace la página

### Paleta de comandos (⌘K / Ctrl+K)

Un buscador tipo Raycast con las seis secciones y siete acciones: copiar tu
email, escribirte, abrir GitHub o LinkedIn, cambiar tema, cambiar idioma y
guardar la página como PDF. Se maneja con flechas y Enter, se cierra con Escape
y la búsqueda ignora los acentos ("formacion" encuentra "Formación").

Los comandos viven en el array `COMMANDS` de `assets/script.js`. Añadir uno son
tres líneas.

### Campo de puntos del hero

`<canvas id="field">` dibuja una retícula de puntos que reacciona al ratón: los
de cerca se iluminan, crecen y se apartan un poco. Se pausa sola cuando el hero
sale de pantalla y se apaga entera si el sistema pide menos animación.

### Maqueta de Sella

El caso de estudio no solo cuenta el producto: lo enseña. La maqueta del panel
está hecha en HTML y CSS (nada de capturas), con los colores reales de Sella,
inclinada en 3D y con la gráfica animándose al aparecer.

### Otros detalles

- **Cursor personalizado** (punto + anillo que persigue con retardo y crece
  sobre lo pulsable). Solo con ratón fino; en táctil ni se activa. Para
  quitarlo, borra el bloque "Cursor personalizado" de `script.js`.
- **Botones magnéticos**: el CTA principal se inclina hacia el cursor.
- **Bordes cónicos animados** al pasar por encima de las tarjetas, más un foco
  radial que sigue al ratón.
- **Marquesina** de tecnologías que se pausa al pasar por encima. El script
  duplica la lista lo necesario para que el bucle no deje huecos.
- **Barra de progreso** de lectura y enlace activo según la sección visible.
- **Auroras** de fondo que se desplazan lento, más un grano sutil sobre todo.

---

## Cómo funciona el bilingüe

El español vive directamente en el HTML (mejor para SEO) y cada elemento
traducible lleva un atributo `data-en` con su versión inglesa:

```html
<a href="#proyectos" data-en="Work">Proyectos</a>
```

Al arrancar, el script guarda el original en `data-es` y a partir de ahí solo
intercambia. Para añadir texto traducible basta con ponerle su `data-en`.

**Regla importante:** un elemento con `data-en` no puede contener otro elemento
con `data-en` (el intercambio reescribe el `innerHTML` del padre y se llevaría
por delante al hijo). Si necesitas anidar, pon el `data-en` solo en las hojas.

El botón EN/ES recuerda la elección en `localStorage`; la primera visita usa el
idioma del navegador.

---

## Accesibilidad y robustez

- Enlace para saltar al contenido, foco visible, `aria-label` en los botones de
  icono, `role="dialog"` en la paleta y menú cerrable con Escape.
- `prefers-reduced-motion`: se desactivan canvas, cursor, imanes, marquesina y
  todas las transiciones.
- Sin JavaScript el contenido se ve igual (un `<noscript>` anula las animaciones
  de entrada). Nada esencial depende del JS.
- Si la API de GitHub falla o te limita, el número de repos se queda en el valor
  escrito en el HTML.

## SEO

Meta description, Open Graph, Twitter Card, canonical, `robots.txt`,
`sitemap.xml` y datos estructurados JSON-LD `ProfilePage`/`Person` con tus
estudios y perfiles.

## Regenerar la imagen de vista previa

`assets/og-image.jpg` (1200×630) es la tarjeta que se ve al compartir el enlace
en LinkedIn o WhatsApp. Si cambias tu titular, regénerala respetando esas
medidas, o pídemelo y la vuelvo a generar.
