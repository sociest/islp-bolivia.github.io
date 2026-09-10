import"./hoisted.Cplw_QFu.js";function c(){const n=document.getElementById("islp-birth-year-astro"),d=document.getElementById("islp-finder-btn"),s=document.getElementById("islp-finder-result");function l(){if(!n||!s)return;const e=parseInt(n.value,10);if(isNaN(e)||e<1920||e>2026){s.innerHTML=`
          <div style="padding: 0.75rem 1rem; border-radius: 8px; background: #fee2e2; border: 2px solid #b91c1c; box-shadow: 3px 3px 0 #b91c1c; color: #991b1b; font-size: 0.92rem; font-weight: 700;">
            ⚠️ Por favor ingresa un año de nacimiento válido (ejemplo: 2012).
          </div>
        `;return}let i="",o="",a="",t="",r="#categorias";e>=2015&&e<=2018?(i="Categoría Laplace",o="Primaria · 9 a 11 años",a="¡Tu enfoque es lúdico y divertido! Observa tu entorno escolar, mascotas, juegos y meriendas.",t="#bae6fd",r="#laplace"):e>=2011&&e<=2014?(i="Categoría Bernoulli",o="Secundaria Menor · 12 a 15 años",a="¡Pensamiento curioso! Preguntas sobre tu comunidad, deportes, redes sociales y hábitos colectivos.",t="#a7f3d0",r="#bernoulli"):e>=2008&&e<=2010?(i="Categoría Poisson",o="Bachillerato · 16 a 18 años",a="¡Pensamiento crítico preuniversitario! Datos del Censo, medio ambiente, empleo o salud pública.",t="#fed7aa",r="#poisson"):(i="Categoría Gauss",o="Pregrado Universitario · Sin límite de edad",a="¡Rigor metodológico y científico! Modelos econométricos, ciencia de datos e investigación aplicada.",t="#e0e7ff",r="#gauss"),s.innerHTML=`
        <div style="padding: 1rem 1.25rem; border-radius: 12px; background: ${t}; border: 2.5px solid #13154a; box-shadow: 3.5px 3.5px 0 #13154a; display: flex; flex-direction: column; gap: 0.4rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
            <strong style="color: #13154a; font-size: 1.15rem; font-family: Outfit, sans-serif;">🎯 ${i}</strong>
            <span style="background: #ffffff; color: #13154a; border: 1.5px solid #13154a; padding: 2px 10px; border-radius: 9999px; font-size: 0.78rem; font-weight: 800; box-shadow: 1.5px 1.5px 0 #13154a;">${o}</span>
          </div>
          <p style="margin: 0; font-size: 0.92rem; color: #1e293b; font-weight: 500; line-height: 1.45;">${a}</p>
          <div style="margin-top: 0.35rem;">
            <a href="${r}" class="islp-btn islp-btn-sm islp-btn-primary" style="display: inline-block;">Ver Requisitos de ${i} →</a>
          </div>
        </div>
      `}d&&d.addEventListener("click",l),n&&n.addEventListener("keydown",e=>{e.key==="Enter"&&l()})}c();document.addEventListener("astro:page-load",c);
