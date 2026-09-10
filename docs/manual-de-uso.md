# Manual de Uso y Guía de Mantenimiento — ISLP Bolivia

Bienvenido al manual oficial de autoría, mantenimiento y administración de la plataforma web de la **Competencia Boliviana de Pósters Estadísticos (CBPE)** y el **International Statistical Literacy Project (ISLP Bolivia)**.

---

## 📑 Tabla de Contenidos

1. [Arquitectura y Filosofía del Sistema](#1-arquitectura-y-filosofía-del-sistema)
2. [Mapeo y Resolución de Discordancias con el Sitio Anterior](#2-mapeo-y-resolución-de-discordancias-con-el-sitio-anterior)
3. [Cómo Publicar un Nuevo Post o Documento](#3-cómo-publicar-un-nuevo-post-o-documento)
4. [Ejemplos Prácticos de Posts (.qmd)](#4-ejemplos-prácticos-de-posts-qmd)
5. [Uso de Shortcodes Personalizados de Quarto](#5-uso-de-shortcodes-personalizados-de-quarto)
6. [Motor de Filtrado, Búsqueda y Organización del Blog](#6-motor-de-filtrado-búsqueda-y-organización-del-blog)
7. [Organización de Recursos Estáticos (`/public`)](#7-organización-de-recursos-estáticos-public)
8. [Comandos CLI, Flujo de Trabajo y Verificación](#8-comandos-cli-flujo-de-trabajo-y-verificación)

---

## 1. Arquitectura y Filosofía del Sistema

El sitio web combina dos herramientas modernas para lograr una separación limpia entre **autoría de contenidos** y **presentación visual**:

```
┌────────────────────────────────────────┐
│  AUTORÍA EDITORIAL (Científica)        │
│  - Archivos Quarto (.qmd) en content/  │
│  - Metadatos YAML estructurados        │  ──► Compilado por:
│  - Tablas dinámicas y shortcodes       │      quarto render
└────────────────────────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────┐
│  PRESENTACIÓN WEB DE ALTO RENDIMIENTO  │
│  - Astro 5.x (SSG + Islas de UI)       │  ──► Compilado por:
│  - Tipografía e identidad CBPE         │      astro build
│  - Rutas dinámicas /posts/[slug]       │
│  - 0% dependencias pesadas innecesarias│
└────────────────────────────────────────┘
```

* **Ventaja para el editor/docente:** No necesitas programar en JavaScript ni maquetar HTML. Escribes en Markdown (`.qmd`) con metadatos claros, y la plataforma genera las páginas web, rutas y tablas de forma automática.
* **Ventaja para el usuario:** Carga instantánea, diseño responsivo móvil, navegación por migas de pan y filtros interactivos instantáneos.

---

## 2. Mapeo y Resolución de Discordancias con el Sitio Anterior

El sitio web anterior (`https://islp-bolivia.github.io/`) concentraba toda la información histórica en una única página extensa con textos de diversas ediciones pasadas (2018 a 2025). La nueva estructura **unifica y simplifica sin perder ninguna información ni enlace externo**:

| Sección en Sitio Anterior | Ubicación en Nueva Plataforma | Mejoras Implementadas |
| :--- | :--- | :--- |
| **Hero / Motto** | `content/index.qmd` | Diseño con colores oficiales CBPE, botones con alto contraste y lema con datos. |
| **Categorías de Participación** | `content/index.qmd` + `src/components/CategoryFinder.astro` | Se corrigieron los años de nacimiento para la 5ª edición (2026-2027) y se incorporó el selector interactivo por año de nacimiento. |
| **Premios Nacionales e Internacionales** | `content/index.qmd` + `content/posts/2026-08-10-cartilla-premios-incentivos.qmd` | Se detallan tanto los packs nacionales (I, II, III) como los premios en euros del certamen mundial ISI (450€, 350€, 200€ y 2.000€). |
| **Reglas y Formato A1** | `content/index.qmd` + `content/posts/2026-09-15-normas-de-participacion.qmd` | Especificación clara de anonimato, tamaño A1 (594 × 841 mm), peso máximo de 10 MB y legibilidad a 2 metros. |
| **Cronograma / Fechas** | `content/index.qmd` | Tabla de hitos oficial: Octubre 2026 a Mayo 2027. |
| **Preguntas Frecuentes (FAQ)** | `content/index.qmd` | Se compilaron las 7 preguntas oficiales del sitio anterior con respuestas estructuradas. |
| **Bases de Datos Abiertas** | `content/recursos.qmd` | Enlaces externos directos a INE Bolivia, GeoBolivia, AGETIC, SIE Minedu, Banco Mundial, FAOSTAT y UNICEF Data. |
| **Plantillas de Póster** | `content/recursos.qmd` | Enlaces directos a plantillas en Canva, PowerPoint (.pptx), SVG y LaTeX BeamerPoster. |
| **Pósters Anteriores y Casos de Estudio** | `content/index.qmd` + `content/posts/*caso-estudio*.qmd` | Tarjetas interactivas con visor lightbox en pantalla completa y enlace directo a la ficha técnica completa en el blog. |
| **Boletines y Archivo Histórico** | `content/blog.qmd` + `content/posts/` | Repositorio dinámico con 16 artículos, buscador global en tiempo real y pastillas de filtrado por categoría. |
| **Enlaces Internacionales ISLP/ISI** | `content/recursos.qmd` + `content/contacto.qmd` | Enlaces oficiales a `https://iase-web.org/islp/` y galerías mundiales 2018-2021. |
| **Coordinación y Autoridades** | `content/contacto.qmd` + `content/index.qmd` | Reconocimiento explícito a la Coordinación Nacional (M.Sc. Álvaro Chirino Gutiérrez), UMSA y Fundación ARU. |

---

## 3. Cómo Publicar un Nuevo Post o Documento

Para agregar una nueva publicación, boletín, norma o caso de estudio:

1. Crea un nuevo archivo en el directorio [`content/posts/`](file:///home/andreschirinos/Proyectos/islp-bolivia.github.io/content/posts/).
2. Nómbralo siguiendo el estándar de fechas ISO:  
   `AAAA-MM-DD-titulo-descriptivo-slug.qmd`
3. Incluye la cabecera YAML obligatoria al inicio:

```yaml
---
title: "Título Oficial del Documento o Artículo"
date: "2027-02-15"
categories: ["Categoría Principal", "Etiqueta Secundaria"]
description: "Resumen conciso (1 a 2 oraciones) que se mostrará en las tablas del blog y en los buscadores."
---
```

4. Escribe el cuerpo del documento en Markdown estándar o Quarto.
5. Guarda el archivo y ejecuta:
   ```bash
   npm run build
   ```
   *Quarto y Astro detectarán el archivo, generarán la página individual en `/posts/slug` y actualizarán automáticamente la tabla correspondiente en `/blog`.*

---

## 4. Ejemplos Prácticos de Posts (.qmd)

### Ejemplo 1: Nuevo Boletín Periódico
Archivo: `content/posts/2027-02-20-boletin-4-evaluacion-preliminar.qmd`

```markdown
---
title: "Boletín Nº 4 · Evaluación Preliminar de Postulaciones"
date: "2027-02-20"
categories: ["Boletines", "Evaluación"]
description: "Informe de avance sobre los más de 200 equipos inscritos y recomendaciones del jurado para el cierre de envíos."
---
# Boletín Informativo Nº 4: Evaluación Preliminar

El Comité Coordinador Nacional presenta el cuarto boletín oficial de la 5ª Edición de la competencia.

::: {.callout-note}
### Cifras Destacadas de la 5ª Edición
* **Equipos registrados:** 215 unidades educativas y facultades.
* **Departamentos participantes:** Cobertura en los 9 departamentos.
:::

### Recomendaciones Previas al Cierre
1. Verificar que el póster mantenga **anonimato total**.
2. Comprobar que los gráficos incluyan título descriptivo y mención de fuente.

[Descargar Boletín en PDF ↗](/assets/docs/boletines/boletin_4.pdf){.islp-btn .islp-btn-sm .islp-btn-navy}
```

---

### Ejemplo 2: Caso de Estudio de un Póster Premiado
Archivo: `content/posts/2027-05-15-caso-estudio-poisson-energia-solar.qmd`

```markdown
---
title: "Caso de Estudio Poisson: Eficiencia de Paneles Solares en Comunidades Rurales"
date: "2027-05-15"
categories: ["Casos de Estudio", "Poisson", "Ganadores"]
description: "1º lugar nacional categoría Poisson (Oruro). Análisis de radiación solar y amortización económica con datos del altiplano."
---
# Caso de Estudio: Eficiencia de Paneles Solares en Comunidades Rurales

> *"Los vatios de nuestra tierra medidos con rigor estadístico."*

Ficha técnica del proyecto ganador del **1.er Lugar Nacional** en la Categoría Poisson durante la 5ª Edición.

::: {.callout-note}
### Ficha del Proyecto
* **Categoría:** Poisson (Secundaria Mayor · 15 a 18 años)
* **Colegio:** Unidad Educativa Simón Bolívar
* **Sede:** Oruro, Bolivia
* **Premio:** 1.er Lugar Nacional & Clasificado al Congreso Mundial ISI
:::

### Metodología Aplicada
El equipo recopiló registros horarios de generación fotovoltaica durante 6 meses y aplicó regresiones no lineales para modelar el rendimiento en altura.

[Ver en la Portada ↗](/#galeria){.islp-btn .islp-btn-sm .islp-btn-outline}
```

---

### Ejemplo 3: Publicación con Enlace Externo Oficial
Archivo: `content/posts/2027-01-10-taller-virtual-visualizacion-datos.qmd`

```markdown
---
title: "Taller Docente Virtual: Principios de Visualización de Datos para el ISLP"
date: "2027-01-10"
categories: ["Convocatorias", "Talleres"]
description: "Grabación y diapositivas del taller nacional de capacitación para profesores tutores sobre diseño de gráficos estadísticos."
---
# Taller Docente Virtual: Principios de Visualización de Datos

Capacitación virtual impartida por docentes de la Carrera de Estadística de la UMSA para tutores de todo el país.

### Materiales y Grabación
* [Acceder a la Grabación en YouTube ↗](https://youtube.com/watch?v=placeholder-islp-taller){.islp-btn .islp-btn-sm .islp-btn-navy}
* [Descargar Diapositivas en PDF ↗](/assets/docs/taller_visualizacion_2027.pdf){.islp-btn .islp-btn-sm .islp-btn-outline}
* [Inscripción a Próximos Talleres en Google Forms ↗](https://docs.google.com/forms/d/e/1FAIpQLSc7rDxBwNfyn-kl7dL-n6cunoIeHJ2K8BwpLvJGb4jq_6uL0Q/viewform){.islp-btn .islp-btn-sm .islp-btn-gold}
```

---

## 5. Uso de Shortcodes Personalizados de Quarto

En [`_extensions/islp-astro/islp-shortcodes.lua`](file:///home/andreschirinos/Proyectos/islp-bolivia.github.io/file:///home/andreschirinos/Proyectos/islp-bolivia.github.io/_extensions/islp-astro/islp-shortcodes.lua) se encuentran implementados los shortcodes que generan componentes visuales con la identidad CBPE:

### Shortcode 1: `caso-estudio`
Inserta una tarjeta completa con visor de imagen, lema, badge y botones de acción.

```markdown
{{< caso-estudio
  id="caso-ejemplo"
  img="/img/poster/1_Poisson_2020.jpg"
  titulo="Título del Póster Ganador"
  lema="Lema o frase inspiradora del trabajo."
  categoria="poisson"
  catnombre="Categoría Poisson (Secundaria Mayor)"
  edicion="5ª Edición"
  premio="1.er Lugar Nacional"
  depto="Cochabamba"
  institucion="Colegio Alemán Santa María"
  leccion="Explicación clara de por qué el jurado científico premió esta investigación."
  post_url="/posts/2027-05-15-caso-estudio-poisson-energia-solar"
  driveUrl="https://drive.google.com/drive/folders/placeholder"
>}}
```

### Shortcode 2: `drive-download`
Genera una tarjeta de descarga estilizada para plantillas o paquetes de recursos:

```markdown
{{< drive-download
  title="Plantilla Canva: Categoría Bernoulli"
  sub="Diseño infográfico preconfigurado en medida A1."
  size="Cloud / A1"
  url="https://www.canva.com/design/play/placeholder"
  icon="canva"
>}}
```
*Parámetro `icon`: puede ser `"canva"`, `"drive"` o `"file"`.*

### Shortcode 3: `lema`
Inserta un bloque de cita inspiradora con tipografía destacada:

```markdown
{{< lema "La estadística es la gramática de la ciencia." autor="Karl Pearson" >}}
```

---

## 6. Motor de Filtrado, Búsqueda y Organización del Blog

En [`content/blog.qmd`](file:///home/andreschirinos/Proyectos/islp-bolivia.github.io/content/blog.qmd) se organizan las publicaciones mediante **5 listings nativos de Quarto** (`type: table`):

1. `#convocatorias`: Posts que coinciden con `posts/*convocatoria*.qmd`.
2. `#normativas`: Posts de normas, guías, rúbricas y premios.
3. `#boletines`: Publicaciones periódicas `posts/*boletin*.qmd`.
4. `#historico`: Pósters y archivos de versiones pasadas.
5. `#casos-estudio`: Fichas técnicas de pósters ganadores.

### Cómo Funciona la Interactividad en el Navegador
En [`src/pages/blog.astro`](file:///home/andreschirinos/Proyectos/islp-bolivia.github.io/src/pages/blog.astro) opera un motor reactivo en cliente (vanilla JS optimizado) que:
* **Filtra en tiempo real** cuando el usuario escribe en el campo *"Filtro"* de cualquier tabla.
* **Búsqueda global unificada:** El campo superior `#islp-global-search` busca palabras clave a lo largo de las 5 tablas simultáneamente, sincronizando los inputs locales y permitiendo limpiar con el botón `✕`.
* **Pastillas de categoría:** Los botones `Todas`, `📢 Convocatorias`, `📋 Normativas`, `📰 Boletines`, `🏛️ Archivo Histórico` y `🏆 Casos de Estudio` alternan la visibilidad de la sección correspondiente (`section.level2`) y realizan scroll suave a la tabla seleccionada.
* **Ordenamiento:** Permite ordenar por fecha o título en forma ascendente/descendente mediante el selector `select.form-select` o haciendo clic directo en los encabezados `<th>`.

---

## 7. Organización de Recursos Estáticos (`/public`)

Para mantener el proyecto ordenado y evitar romper enlaces históricos:

```
public/
├── assets/                  <-- DOCUMENTOS Y ARCHIVOS NO-IMÁGENES
│   ├── docs/                (Normas_de_participacion.pdf, guia_2022_2023.pdf, Premios.pdf)
│   │   ├── boletines/       (boletin_1.pdf, ISLP_Bolivia_B1.pdf, B2, B3, clausura.pdf)
│   │   └── historico/       (afiches previos, P25_2Bernoulli.pdf, gauss1.pdf, Posters_2019.rar)
│   └── design/              (Archivos editables .psd de carteles)
│
└── img/                     <-- RECURSOS GRÁFICOS E IMÁGENES
    ├── logos/               (cbpe-logo.png, aru.jpg, estadistica.jpg, ucb.jpg, islp.jpg)
    ├── arte/                (categoria-bernoulli-oficial.png, historia-con-datos.png)
    ├── poster/              (carteles oficiales, 1_Bernoulli_2020.jpg, 1_Gauss_2020.jpg)
    └── backgrounds/         (header-bg.jpg, map-image.png)
```

> [!IMPORTANT]
> **Compatibilidad de enlaces:** Se crearon symlinks en `public/img/` apuntando a `public/assets/docs/` para que cualquier URL antigua referenciada en redes sociales (ej. `img/Normas_de_participacion.pdf`) continúe funcionando sin error 404.

---

## 8. Comandos CLI, Flujo de Trabajo y Verificación

### 1. Iniciar servidor local de desarrollo
```bash
npm run dev
```
Inicia Astro en `http://localhost:4321/` con recarga en caliente (*Hot Module Replacement*).

### 2. Construir el sitio completo para producción
```bash
npm run build
```
Este comando ejecuta en secuencia:
1. `quarto render`: Compila los documentos `.qmd` a HTML en `.quarto-build/`.
2. `astro build`: Compila las páginas de Astro, procesa los estilos y genera las 36 rutas estáticas en `_site/`.

### 3. Previsualizar la versión de producción
```bash
npx astro preview --port 4321
```
Levanta un servidor local sirviendo los archivos finales generados en `_site/`.

### 4. Ejecutar la suite de auditoría visual automatizada
```bash
node scripts/visual-audit.mjs
```
Ejecuta un navegador Chromium sin cabeza (*headless*) mediante Playwright que verifica:
* Cero fugas de código o errores en el DOM.
* Portada y selector interactivo de categorías.
* Checklist interactivo con cálculo porcentual en la página de Recursos.
* Búsqueda global y filtrado reactivo de tablas en el Blog.
* Navegación a posts dinámicos de casos de estudio (`/posts/...`).
* Responsividad móvil (menú hamburguesa y drawer en viewport iPhone 14).
* Guarda capturas de pantalla de auditoría para inspección visual.
