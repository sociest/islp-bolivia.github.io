-- islp-shortcodes.lua
-- Custom shortcodes for ISLP Bolivia Astro-grade components in Quarto

local function to_str(val)
  if val == nil then return "" end
  if type(val) == "string" then return val end
  return pandoc.utils.stringify(val)
end

local function escape_html(s)
  s = to_str(s)
  s = string.gsub(s, "&", "&amp;")
  s = string.gsub(s, "<", "&lt;")
  s = string.gsub(s, ">", "&gt;")
  s = string.gsub(s, '"', "&quot;")
  return s
end

return {
  -- Shortcode: {{< lema "Texto" autor="..." >}} or with named args
  ["lema"] = function(args, kwargs)
    local texto = to_str(args[1] or kwargs["texto"] or kwargs["text"] or "")
    local autor = to_str(kwargs["autor"] or kwargs["author"] or "")
    local contexto = to_str(kwargs["contexto"] or "")

    local autor_html = ""
    if autor ~= "" then
      autor_html = string.format([[<footer class="islp-lema-author"><span class="islp-lema-dash">—</span> %s %s</footer>]],
        escape_html(autor),
        contexto ~= "" and string.format([[<span class="islp-lema-context">(%s)</span>]], escape_html(contexto)) or ""
      )
    end

    local html = string.format([[
<blockquote class="islp-lema-quote">
  <div class="islp-lema-mark">“</div>
  <p class="islp-lema-text">%s</p>
  %s
</blockquote>
]], escape_html(texto), autor_html)

    return pandoc.RawBlock('html', html)
  end,

  -- Shortcode: {{< drive-download title="..." url="..." size="..." subtitle="..." icon="..." >}}
  ["drive-download"] = function(args, kwargs)
    local title = to_str(kwargs["title"] or kwargs["titulo"] or (args[1] or "Descargar Recurso"))
    local url = to_str(kwargs["url"] or "https://drive.google.com/drive/folders/placeholder-islp-bolivia")
    local size = to_str(kwargs["size"] or kwargs["tamano"] or "Google Drive")
    local subtitle = to_str(kwargs["subtitle"] or kwargs["subtitulo"] or "Archivo alojado en almacenamiento oficial")
    local icon_type = to_str(kwargs["icon"] or "drive")

    local icon_svg = [[<svg class="islp-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>]]
    if icon_type == "canva" then
      icon_svg = [[<svg class="islp-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>]]
    elseif icon_type == "code" then
      icon_svg = [[<svg class="islp-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>]]
    end

    local html = string.format([[
<div class="islp-resource-card">
  <div class="islp-resource-badge">%s</div>
  <div class="islp-resource-header">
    <div class="islp-resource-icon-wrap">%s</div>
    <div class="islp-resource-meta">
      <h4 class="islp-resource-title">%s</h4>
      <p class="islp-resource-sub">%s</p>
    </div>
  </div>
  <div class="islp-resource-footer">
    <span class="islp-resource-tag">%s</span>
    <a href="%s" target="_blank" rel="noopener noreferrer" class="islp-btn islp-btn-primary islp-btn-sm">
      Abrir en %s
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
    </a>
  </div>
</div>
]],
      escape_html(icon_type:upper()),
      icon_svg,
      escape_html(title),
      escape_html(subtitle),
      escape_html(size),
      escape_html(url),
      icon_type == "canva" and "Canva" or "Drive"
    )

    return pandoc.RawBlock('html', html)
  end,

  -- Shortcode: {{< caso-estudio id="..." img="..." titulo="..." lema="..." categoria="..." ano="..." ... >}}
  ["caso-estudio"] = function(args, kwargs)
    local id = to_str(kwargs["id"] or ("caso-" .. tostring(math.random(1000, 9999))))
    local img = to_str(kwargs["img"] or "img/cartel_2.jpg")
    local titulo = to_str(kwargs["titulo"] or kwargs["title"] or "Investigación Destacada")
    local lema = to_str(kwargs["lema"] or "El rigor estadístico transforma realidades.")
    local categoria = to_str(kwargs["categoria"] or "poisson")
    local catnombre = to_str(kwargs["catnombre"] or "Categoría Poisson")
    local edicion = to_str(kwargs["edicion"] or "Edición ISLP Bolivia")
    local premio = to_str(kwargs["premio"] or "1.er Lugar Nacional")
    local depto = to_str(kwargs["depto"] or "Bolivia")
    local colegio = to_str(kwargs["colegio"] or kwargs["institucion"] or "Unidad Educativa")
    local leccion = to_str(kwargs["leccion"] or "Pregunta clara, datos verificados y narrativa visual de alto impacto.")
    local post_url = to_str(kwargs["post_url"] or kwargs["post"] or "")
    local drive_url = to_str(kwargs["driveUrl"] or kwargs["drive_url"] or kwargs["drive"] or "https://drive.google.com")
    local post_btn_html = ""
    if post_url ~= "" then
      post_btn_html = string.format([[<a href="%s" class="islp-btn islp-btn-sm islp-btn-primary">Leer Caso Completo →</a>]], escape_html(post_url))
    end

    local html = string.format([[
<article class="islp-study-card cat-%s" id="%s">
  <div class="islp-study-media">
    <img src="%s" alt="Póster: %s" loading="lazy" decoding="async" class="islp-study-img" onclick="islpOpenLightbox('%s', '%s')" />
    <div class="islp-study-badge">%s · %s</div>
    <button type="button" class="islp-zoom-btn" onclick="islpOpenLightbox('%s', '%s')" aria-label="Ampliar póster en pantalla completa">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
      Zoom
    </button>
  </div>
  <div class="islp-study-content">
    <div class="islp-study-pill">%s · %s</div>
    <div class="islp-study-lema">“%s”</div>
    <h3 class="islp-study-title">%s</h3>
    <p class="islp-study-institution"><strong>Sede:</strong> %s (%s)</p>
    <div class="islp-study-takeaway">
      <div class="islp-takeaway-label">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        ¿Por qué destacó el jurado este trabajo?
      </div>
      <p class="islp-takeaway-text">%s</p>
    </div>
    <div class="islp-study-actions">
      <button type="button" class="islp-btn islp-btn-outline islp-btn-sm" onclick="islpOpenLightbox('%s', '%s')">
        Ver Póster HD
      </button>
      %s
      <a href="%s" target="_blank" rel="noopener noreferrer" class="islp-btn islp-btn-ghost islp-btn-sm">
        Ficha en Drive
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
      </a>
    </div>
  </div>
</article>
]],
      escape_html(categoria),
      escape_html(id),
      escape_html(img),
      escape_html(titulo),
      escape_html(img),
      escape_html(titulo),
      escape_html(premio),
      escape_html(edicion),
      escape_html(img),
      escape_html(titulo),
      escape_html(catnombre),
      escape_html(depto),
      escape_html(lema),
      escape_html(titulo),
      escape_html(colegio),
      escape_html(depto),
      escape_html(leccion),
      escape_html(img),
      escape_html(titulo),
      post_btn_html,
      escape_html(drive_url)
    )

    return pandoc.RawBlock('html', html)
  end,

  -- Shortcode: {{< checklist-item id="..." text="..." help="..." >}}
  ["checklist-item"] = function(args, kwargs)
    local id = to_str(kwargs["id"] or ("chk-" .. tostring(math.random(1000, 9999))))
    local text = to_str(kwargs["text"] or kwargs["texto"] or (args[1] or "Requisito del póster"))
    local help = to_str(kwargs["help"] or kwargs["ayuda"] or "")

    local help_html = ""
    if help ~= "" then
      help_html = string.format([[<span class="islp-chk-help">%s</span>]], escape_html(help))
    end

    local html = string.format([[
<label class="islp-chk-label" for="%s">
  <input type="checkbox" id="%s" class="islp-chk-input" onchange="islpUpdateChecklistProgress()" />
  <span class="islp-chk-box">
    <svg class="islp-chk-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
  </span>
  <span class="islp-chk-text-wrap">
    <span class="islp-chk-text">%s</span>
    %s
  </span>
</label>
]], escape_html(id), escape_html(id), escape_html(text), help_html)

    return pandoc.RawBlock('html', html)
  end
}
