/* NAMSSN SAZU — shared site behaviour (vanilla JS, no dependencies) */

document.addEventListener('DOMContentLoaded', () => {
  initAnnouncementBar();
  initMobileMenu();
  initContactForm();
  initNewsletterForm();
  initCgpaCalculator();
});

/* ---------- Announcement bar close button ---------- */
function initAnnouncementBar() {
  const bar = document.getElementById('announcement-bar');
  const closeBtn = document.getElementById('announcement-close');
  if (!bar || !closeBtn) return;

  // Remember dismissal for the rest of the browsing session
  if (sessionStorage.getItem('namssnAnnouncementClosed') === '1') {
    bar.classList.add('is-closed');
  }

  closeBtn.addEventListener('click', () => {
    bar.classList.add('is-closed');
    sessionStorage.setItem('namssnAnnouncementClosed', '1');
  });
}

/* ---------- Mobile hamburger menu ---------- */
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('mobile-nav');
  const iconBars = document.getElementById('menu-icon-bars');
  const iconClose = document.getElementById('menu-icon-close');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    if (iconBars && iconClose) {
      iconBars.classList.toggle('is-hidden', isOpen);
      iconClose.classList.toggle('is-hidden', !isOpen);
    }
  });

  // Close the mobile menu once a link inside it is used
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      if (iconBars && iconClose) {
        iconBars.classList.remove('is-hidden');
        iconClose.classList.add('is-hidden');
      }
    });
  });
}

/* ---------- Contact form (client-side only, no backend) ---------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('contact-form-status');
  if (!form || !status) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.elements['name'].value.trim();
    const email = form.elements['email'].value.trim();
    const message = form.elements['message'].value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !message) {
      showStatus(status, 'Please fill in every field before sending.', 'error');
      return;
    }
    if (!emailPattern.test(email)) {
      showStatus(status, 'Please enter a valid email address.', 'error');
      return;
    }

    // No backend is wired up yet — this confirms receipt locally and
    // hands off to email so a real message still reaches the exec team.
    showStatus(status, `Thanks, ${name}. Your message is ready — confirm in the email app that just opened.`, 'success');
    const subject = encodeURIComponent(`NAMSSN SAZU website message from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:namsnsazu@gmail.com?subject=${subject}&body=${body}`;
    form.reset();
  });
}

/* ---------- Newsletter signup (client-side only, no backend) ---------- */
function initNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  const status = document.getElementById('newsletter-form-status');
  if (!form || !status) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = form.elements['email'].value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      showStatus(status, 'Please enter a valid email address.', 'error');
      return;
    }
    showStatus(status, "You're on the list — watch your inbox for the next digest.", 'success');
    form.reset();
  });
}

function showStatus(el, message, kind) {
  el.textContent = message;
  el.classList.remove('hidden', 'text-red-400', 'text-emerald-400', 'fade-in');
  el.classList.add(kind === 'error' ? 'text-red-400' : 'text-emerald-400');
  // Restart the fade-in animation
  void el.offsetWidth;
  el.classList.add('fade-in');
}

/* ---------- CGPA calculator (Student Resources) ---------- */
const GRADE_POINTS = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };

function initCgpaCalculator() {
  const rowsContainer = document.getElementById('cgpa-rows');
  const addRowBtn = document.getElementById('cgpa-add-row');
  const calcBtn = document.getElementById('cgpa-calculate');
  const resultEl = document.getElementById('cgpa-result');
  if (!rowsContainer || !addRowBtn || !calcBtn) return;

  addRowBtn.addEventListener('click', () => addCgpaRow(rowsContainer));
  calcBtn.addEventListener('click', () => {
    const rows = rowsContainer.querySelectorAll('.cgpa-row');
    let totalUnits = 0;
    let totalPoints = 0;
    let hasInput = false;

    rows.forEach((row) => {
      const units = parseFloat(row.querySelector('.cgpa-units').value);
      const grade = row.querySelector('.cgpa-grade').value;
      if (!units || !grade) return;
      hasInput = true;
      totalUnits += units;
      totalPoints += units * GRADE_POINTS[grade];
    });

    if (!hasInput || totalUnits === 0) {
      resultEl.textContent = 'Add at least one course with units and a grade.';
      resultEl.classList.remove('text-emerald-400');
      resultEl.classList.add('text-red-400');
      return;
    }

    const gpa = (totalPoints / totalUnits).toFixed(2);
    resultEl.textContent = `Your CGPA: ${gpa} (from ${totalUnits} total units)`;
    resultEl.classList.remove('text-red-400');
    resultEl.classList.add('text-emerald-400');
  });
}

function addCgpaRow(container) {
  const row = document.createElement('div');
  row.className = 'cgpa-row grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_100px] gap-3 items-center';
  row.innerHTML = `
    <input type="number" min="1" max="6" placeholder="Course units (e.g. 3)"
      class="cgpa-units w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-orange-500 outline-none" />
    <select class="cgpa-grade w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500 outline-none">
      <option value="">Grade</option>
      <option value="A">A (5.0)</option>
      <option value="B">B (4.0)</option>
      <option value="C">C (3.0)</option>
      <option value="D">D (2.0)</option>
      <option value="E">E (1.0)</option>
      <option value="F">F (0.0)</option>
    </select>
  `;
  container.appendChild(row);
}