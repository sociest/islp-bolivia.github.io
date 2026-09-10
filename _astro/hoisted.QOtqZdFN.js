import"./hoisted.Cplw_QFu.js";function c(){const n=document.getElementById("islp-birth-year-astro"),d=document.getElementById("islp-finder-btn"),s=document.getElementById("islp-finder-result");function l(){if(!n||!s)return;const e=parseInt(n.value,10);if(isNaN(e)||e<1920||e>2026){s.innerHTML=`
          <div style="padding: 0.9rem 1.2rem; border-radius: 8px; background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; font-size: 0.92rem; font-weight: 600;">
            ⚠️ Por favor ingresa un año de nacimiento válido (ejemplo: 2012).
          </div>
        `;return}let o="",t="",a="",i="",r="";e>=2015&&e<=2018?(o="Categoría Laplace",t="Primaria · 9 a 11 años",a="¡Tu enfoque es lúdico y divertido! Observa tu entorno escolar, mascotas, juegos y meriendas.",i="#0369a1",r="#categorias"):e>=2011&&e<=2014?(o="Categoría Bernoulli",t="Secundaria Menor · 12 a 15 años",a="¡Pensamiento curioso! Preguntas sobre tu comunidad, deportes, redes sociales y hábitos colectivos.",i="#047857",r="#categorias"):e>=2008&&e<=2010?(o="Categoría Poisson",t="Bachillerato · 16 a 18 años",a="¡Pensamiento crítico preuniversitario! Datos del Censo, medio ambiente, empleo o salud pública.",i="#c2410c",r="#categorias"):(o="Categoría Gauss",t="Pregrado Universitario · Sin límite de edad",a="¡Rigor metodológico y científico! Modelos econométricos, ciencia de datos e investigación aplicada.",i="#2e3193",r="#categorias"),s.innerHTML=`
        <div style="padding: 1.2rem; border-radius: 10px; background: #f8fafc; border: 2px solid ${i}; display: flex; flex-direction: column; gap: 0.5rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
            <strong style="color: ${i}; font-size: 1.2rem; font-family: Outfit, sans-serif;">🎯 ${o}</strong>
            <span style="background: ${i}; color: #ffffff; padding: 3px 10px; border-radius: 9999px; font-size: 0.78rem; font-weight: 700;">${t}</span>
          </div>
          <p style="margin: 0; font-size: 0.95rem; color: #334155; line-height: 1.5;">${a}</p>
          <div style="margin-top: 0.5rem;">
            <a href="${r}" class="islp-btn islp-btn-outline islp-btn-sm">Ver Requisitos de ${o} →</a>
          </div>
        </div>
      `}d&&d.addEventListener("click",l),n&&n.addEventListener("keydown",e=>{e.key==="Enter"&&l()})}c();document.addEventListener("astro:page-load",c);
