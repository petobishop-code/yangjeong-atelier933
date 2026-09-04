
(() => {
  const modal = document.getElementById('consultModal');
  const menu = document.querySelector('.mobile-nav');
  const menuToggle = document.querySelector('.menu-toggle');

  if (menuToggle && menu) {
    menuToggle.addEventListener('click', () => menu.classList.toggle('open'));
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
  }

  const openModal = () => {
    if (!modal) return;
    modal.classList.add('is-open');
    document.body.classList.add('modal-open');
  };
  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.classList.remove('modal-open');
  };

  document.querySelectorAll('.open-modal').forEach(el => el.addEventListener('click', e => {
    e.preventDefault();
    openModal();
  }));
  document.querySelectorAll('.modal-close,.close-modal').forEach(el => el.addEventListener('click', closeModal));
  if (modal) modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  const form = document.querySelector('#consultForm, .modal form');
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const fd = new FormData(form);
      const status = form.querySelector('.form-status,.form-helper');
      const btn = form.querySelector('button[type="submit"]');
      if (btn) btn.disabled = true;
      if (status) status.textContent = '상담 신청을 전송하고 있습니다.';

      const payload = {
        name: fd.get('name') || '',
        phone: fd.get('phone') || '',
        interest: fd.get('interest') || '상담문의',
        preferred_time: fd.get('preferred_time') || fd.get('time') || '시간대 무관',
        message: fd.get('message') || ''
      };

      try {
        const res = await fetch('/api/contact', {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify(payload)
        });
        const data = await res.json().catch(()=>({}));
        if (!res.ok) throw new Error(data.error || '전송 중 오류가 발생했습니다.');
        if (status) status.textContent = '상담 신청이 접수되었습니다. 확인 후 연락드리겠습니다.';
        form.reset();
      } catch (err) {
        if (status) status.textContent = err.message || '온라인 접수에 실패했습니다. 010-9469-8957로 연락해 주세요.';
      } finally {
        if (btn) btn.disabled = false;
      }
    });
  }
})();
