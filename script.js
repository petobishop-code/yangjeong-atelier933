
(() => {
  const overlay = document.getElementById('consultModal');
  const openers = document.querySelectorAll('.js-open-consult');
  const closer = overlay ? overlay.querySelector('.consult-close') : null;
  const form = document.getElementById('consultForm');
  const status = document.getElementById('formStatus');

  function openConsult(e){
    if (e) e.preventDefault();
    if (!overlay) return;
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden','false');
    document.body.classList.add('consult-lock');
    const first = overlay.querySelector('input[name="name"]');
    setTimeout(() => first && first.focus(), 50);
  }

  function closeConsult(){
    if (!overlay) return;
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden','true');
    document.body.classList.remove('consult-lock');
  }

  openers.forEach(el => el.addEventListener('click', openConsult));
  if (closer) closer.addEventListener('click', closeConsult);

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeConsult();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeConsult();
  });

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submit = form.querySelector('.consult-submit');
      if (submit) {
        submit.disabled = true;
        submit.textContent = '전송 중...';
      }
      if (status) status.textContent = '';

      const fd = new FormData(form);
      const payload = {
        name: String(fd.get('name') || '').trim(),
        phone: String(fd.get('phone') || '').trim(),
        interest: String(fd.get('interest') || '').trim(),
        preferred_time: String(fd.get('preferred_time') || '').trim(),
        message: String(fd.get('message') || '').trim()
      };

      try {
        const res = await fetch('/api/contact', {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify(payload)
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.error || '상담 신청 전송 중 오류가 발생했습니다.');
        }

        if (status) status.textContent = '상담 신청이 접수되었습니다. 확인 후 연락드리겠습니다.';
        form.reset();
      } catch (err) {
        if (status) {
          status.textContent = (err && err.message)
            ? err.message
            : '온라인 접수에 실패했습니다. 010-9469-8957로 연락해 주세요.';
        }
      } finally {
        if (submit) {
          submit.disabled = false;
          submit.textContent = '상담 신청 보내기';
        }
      }
    });
  }

  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
    });
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobileNav.classList.remove('open'));
    });
  }
})();
