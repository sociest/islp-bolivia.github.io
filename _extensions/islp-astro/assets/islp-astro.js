// islp-astro.js - Interactive behaviors for ISLP Quarto website

// 1. Lightbox Controller
function islpEnsureLightbox() {
  let overlay = document.getElementById('islp-lightbox');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'islp-lightbox';
    overlay.className = 'islp-lightbox-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Vista previa ampliada de póster');
    overlay.innerHTML = `
      <div class="islp-lightbox-content">
        <button type="button" class="islp-lightbox-close" aria-label="Cerrar vista previa">&times;</button>
        <img src="" alt="" class="islp-lightbox-img" id="islp-lightbox-img" />
        <div class="islp-lightbox-caption" id="islp-lightbox-cap"></div>
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.querySelector('.islp-lightbox-close').addEventListener('click', islpCloseLightbox);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) islpCloseLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        islpCloseLightbox();
      }
    });
  }
  return overlay;
}

window.islpOpenLightbox = function(imgSrc, caption) {
  const overlay = islpEnsureLightbox();
  const img = document.getElementById('islp-lightbox-img');
  const cap = document.getElementById('islp-lightbox-cap');
  img.src = imgSrc;
  img.alt = caption || 'Póster ISLP Bolivia';
  cap.textContent = caption || '';
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.islpCloseLightbox = function() {
  const overlay = document.getElementById('islp-lightbox');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
};

// 2. Checklist Progress Controller
window.islpUpdateChecklistProgress = function() {
  const checkboxes = document.querySelectorAll('.islp-chk-input');
  if (!checkboxes.length) return;

  const total = checkboxes.length;
  let checked = 0;
  checkboxes.forEach(chk => {
    if (chk.checked) checked++;
  });

  const percent = Math.round((checked / total) * 100);
  const fill = document.getElementById('islp-chk-fill');
  const countText = document.getElementById('islp-chk-count');

  if (fill) fill.style.width = percent + '%';
  if (countText) countText.textContent = `${checked} de ${total} requisitos completados (${percent}%)`;

  const submitBtn = document.getElementById('islp-chk-submit-btn');
  if (submitBtn) {
    if (percent === 100) {
      submitBtn.removeAttribute('disabled');
      submitBtn.classList.remove('islp-btn-ghost');
      submitBtn.classList.add('islp-btn-primary');
    }
  }
};

// 3. Category Interactive Finder (Birth year -> Category)
window.islpFindCategory = function() {
  const input = document.getElementById('islp-birth-year');
  const resultDiv = document.getElementById('islp-cat-result');
  if (!input || !resultDiv) return;

  const year = parseInt(input.value, 10);
  if (isNaN(year) || year < 1920 || year > 2026) {
    resultDiv.innerHTML = '<span style="color:#ef4444; font-weight:600;">Por favor ingresa un año de nacimiento válido (ej. 2012).</span>';
    return;
  }

  // Current competition edition 2026-2027
  // Laplace: 9 a 11 años (nacidos aprox 2015-2017)
  // Bernoulli: 12 a 15 años (nacidos aprox 2011-2014)
  // Poisson: 16 a 18 años (nacidos aprox 2008-2010)
  // Gauss: Universitarios (pregrado sin límite)
  let cat = "";
  let tone = "";
  let badgeColor = "";

  if (year >= 2015 && year <= 2018) {
    cat = "Laplace (Primaria · 9 a 11 años)";
    tone = "¡Tu enfoque es lúdico y exploratorio! Observa tu entorno escolar, mascotas o juegos favoritos.";
    badgeColor = "#0284c7";
  } else if (year >= 2011 && year <= 2014) {
    cat = "Bernoulli (Secundaria · 12 a 15 años)";
    tone = "¡Pensamiento curioso! Preguntas sobre tu comunidad, deportes, redes sociales y hábitos.";
    badgeColor = "#10b981";
  } else if (year >= 2008 && year <= 2010) {
    cat = "Poisson (Bachillerato · 16 a 18 años)";
    tone = "¡Pensamiento crítico preuniversitario! Datos del Censo, medio ambiente, salud o economía juvenil.";
    badgeColor = "#ea580c";
  } else if (year <= 2007) {
    cat = "Gauss (Universitarios de Pregrado)";
    tone = "¡Rigor metodológico y científico! Modelos econométricos, ciencia de datos e investigación aplicada.";
    badgeColor = "#6d28d9";
  } else {
    cat = "Laplace (Iniciación)";
    tone = "Exploración temprana en estadística y datos cotidianos.";
    badgeColor = "#0284c7";
  }

  resultDiv.innerHTML = `
    <div style="margin-top: 1rem; padding: 1rem; border-radius: 10px; background: #f8fafc; border-left: 4px solid ${badgeColor};">
      <strong style="color: ${badgeColor}; font-size: 1.1rem; display: block; margin-bottom: 0.3rem;">🎯 Te corresponde: ${cat}</strong>
      <p style="margin: 0; font-size: 0.92rem; color: #334155;">${tone}</p>
    </div>
  `;
};

document.addEventListener('DOMContentLoaded', () => {
  // Initialize checklist if on checklist page
  if (document.querySelector('.islp-chk-input')) {
    islpUpdateChecklistProgress();
  }
});
