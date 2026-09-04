
(() => {
  const header = document.getElementById('header');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuBtn = document.querySelector('.menu-btn');

  const onScroll = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('on');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold:.12 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('on'));
  }

  const modal = document.getElementById('consultModal');

  const openModal = () => {
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  };

  document.querySelectorAll('.open-modal-btn, .open-modal').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      openModal();
    });
  });

  document.querySelectorAll('.modal-close, .close-modal').forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  if (modal) {
    modal.addEventListener('click', e => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  document.querySelectorAll('.avenue-modal-form, #consultForm').forEach(form => {
    form.addEventListener('submit', async e => {
      e.preventDefault();

      const submit = form.querySelector('button[type="submit"]');
      const helper = form.querySelector('.form-helper, .form-status');
      if (submit) submit.disabled = true;
      if (helper) helper.textContent = '상담 신청을 전송하고 있습니다.';

      const fd = new FormData(form);
      const payload = {
        name: fd.get('name') || '',
        phone: fd.get('phone') || '',
        interest: fd.get('interest') || form.dataset.formType || '상담문의',
        preferred_time: fd.get('preferred_time') || fd.get('time') || '시간대 무관',
        message: fd.get('message') || ''
      };

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify(payload)
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || `전송 오류 (${res.status})`);

        if (helper) helper.textContent = '상담 신청이 접수되었습니다. 확인 후 연락드리겠습니다.';
        form.reset();
      } catch (err) {
        if (helper) helper.textContent = err?.message || '온라인 접수가 연결되지 않았습니다. 010-9469-8957로 전화해 주세요.';
      } finally {
        if (submit) submit.disabled = false;
      }
    });
  });
})();
