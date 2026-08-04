/* =============================================
   MOHAMMED NIHAL S — PORTFOLIO MAIN JAVASCRIPT
   ============================================= */

// Global theme switcher function accessible anywhere
window.toggleTheme = function() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
};

function applyTheme(theme) {
  const html = document.documentElement;
  const body = document.body;
  const themeIcon = document.getElementById('theme-icon');
  
  html.setAttribute('data-theme', theme);
  if (body) body.setAttribute('data-theme', theme);
  localStorage.setItem('nihal-theme', theme);

  if (themeIcon) {
    themeIcon.className = theme === 'dark' ? 'ph ph-moon' : 'ph ph-sun';
  }
}

// Initialise theme immediately before DOM render
(function initTheme() {
  const saved = localStorage.getItem('nihal-theme') || 'light';
  applyTheme(saved);
})();

document.addEventListener('DOMContentLoaded', () => {
  // Re-apply theme state & icon on DOM ready
  const saved = localStorage.getItem('nihal-theme') || 'light';
  applyTheme(saved);

  // Dynamic Year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Bind theme toggle button
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.toggleTheme();
    });
  }

  /* ---- Mobile Navigation ---- */
  const menuBtn   = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  function closeMobile() {
    if (menuBtn && mobileNav) {
      menuBtn.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      mobileNav.hidden = true;
      document.body.style.overflow = '';
    }
  }

  if (menuBtn && mobileNav) {
    menuBtn.onclick = () => {
      const open = menuBtn.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
      mobileNav.hidden = !open;
      document.body.style.overflow = open ? 'hidden' : '';
    };
    document.querySelectorAll('.mobile-link').forEach(l => l.onclick = closeMobile);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobile(); });
  }

  /* ---- Navbar Scroll & Active State ---- */
  const navbar   = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navAs    = document.querySelectorAll('.nav-links a');
  const backTop  = document.getElementById('back-top');

  function onScroll() {
    const y = window.scrollY;
    if (navbar) navbar.classList.toggle('scrolled', y > 60);
    if (backTop) backTop.classList.toggle('show', y > 400);

    let cur = '';
    sections.forEach(s => { if (y >= s.offsetTop - 120) cur = s.id; });
    navAs.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Back to Top ---- */
  if (backTop) {
    backTop.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ---- Cursor Glow ---- */
  const glow = document.getElementById('cursor-glow');
  if (glow) {
    let mx = 0, my = 0, gx = 0, gy = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    (function animGlow() {
      gx += (mx - gx) * 0.06;
      gy += (my - gy) * 0.06;
      glow.style.left = gx + 'px';
      glow.style.top  = gy + 'px';
      requestAnimationFrame(animGlow);
    })();
  }

  /* ---- Fluid Bidirectional Scroll Reveal (Down & Up) ---- */
  const revealTargets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger > *');
  
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          // Remove visible when scrolled out so scrolling back up re-triggers fluid animation
          entry.target.classList.remove('visible');
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    revealTargets.forEach(el => io.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('visible'));
  }

  /* ---- Smooth Anchor Scroll ---- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const targetId = a.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  /* ---- Contact Form Handler ---- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name    = document.getElementById('form-name').value.trim();
      const email   = document.getElementById('form-email').value.trim();
      const subject = document.getElementById('form-subject').value.trim();
      const message = document.getElementById('form-message').value.trim();
      if (!name || !email || !message) { alert('Please fill in your name, email, and message.'); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert('Please enter a valid email address.'); return; }
      const sub  = encodeURIComponent(subject || 'Portfolio Contact from ' + name);
      const body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message);
      window.location.href = 'mailto:mohammednihal1026@gmail.com?subject=' + sub + '&body=' + body;
      const btn = document.getElementById('form-submit-btn');
      if (btn) {
        btn.innerHTML = '<i class="ph ph-check-circle"></i> Sent!';
        btn.style.background = 'linear-gradient(135deg,#4ade80,#22c55e)';
        setTimeout(() => { btn.innerHTML = '<i class="ph ph-paper-plane-tilt"></i> Send Message'; btn.style.background = ''; this.reset(); }, 3000);
      }
    });
  }
});

/* =============================================
   GLOBAL MODAL & DOCUMENT UPLOAD HANDLERS
   ============================================= */
function openUploadModal() {
  const modal = document.getElementById('upload-modal');
  if (modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  }
}

function closeUploadModal() {
  const modal = document.getElementById('upload-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }
}

function handleResumeUpload(input) {
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const nameEl = document.getElementById('resume-file-name');
    if (nameEl) nameEl.textContent = '✅ Selected: ' + file.name;
    const blobUrl = URL.createObjectURL(file);
    document.querySelectorAll('#download-resume-btn').forEach(btn => {
      btn.href = blobUrl;
      btn.download = file.name;
    });
    alert('Resume uploaded successfully! "Download Resume" buttons updated live.');
  }
}

function handleCertUpload(input) {
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const titleInput = document.getElementById('cert-title-input');
    const title = (titleInput && titleInput.value.trim()) || file.name.replace(/\.[^/.]+$/, "");
    const blobUrl = URL.createObjectURL(file);

    const container = document.getElementById('certs-container');
    if (container) {
      const card = document.createElement('div');
      card.className = 'neo-card cert-card reveal visible';
      card.innerHTML = `
        <div>
          <div class="cert-icon"><i class="ph ph-certificate"></i></div>
          <h3 class="cert-title">${title}</h3>
          <p class="cert-issuer">Uploaded Document • ${new Date().getFullYear()}</p>
          <p style="font-size:0.85rem;color:var(--text-b);">User uploaded credential document (${file.name}).</p>
        </div>
        <div class="cert-actions">
          <a href="${blobUrl}" target="_blank" class="cert-btn"><i class="ph ph-eye"></i> View</a>
          <a href="${blobUrl}" download="${file.name}" class="cert-btn"><i class="ph ph-download-simple"></i> Download</a>
        </div>
      `;
      container.prepend(card);
    }
    const nameEl = document.getElementById('cert-file-name');
    if (nameEl) nameEl.textContent = '✅ Added: ' + file.name;
    alert('Certificate "' + title + '" added to your Certificates gallery!');
  }
}

function handlePhotoUpload(input) {
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
      const imgEl = document.getElementById('profile-avatar-img');
      if (imgEl) {
        imgEl.src = e.target.result;
      }
    };
    reader.readAsDataURL(file);
    const nameEl = document.getElementById('photo-file-name');
    if (nameEl) nameEl.textContent = '✅ Selected: ' + file.name;
  }
}

function previewDoc(title, issuer) {
  alert('Previewing ' + title + ' (' + issuer + ').\n\nTo link a permanent PDF file, place it into your "assets/certificates/" directory!');
}
