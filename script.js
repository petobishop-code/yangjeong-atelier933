
(() => {
  const modal = document.getElementById('consultModal');
  const form = document.getElementById('consultForm');
  const status = document.getElementById('formStatus');

  const open = () => {
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
  };
  const close = () => {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
  };
  document.querySelectorAll('.open-modal').forEach(el => el.addEventListener('click', e => { e.preventDefault(); open(); }));
  document.querySelectorAll('.close-modal').forEach(el => el.addEventListener('click', close));
  document.addEventListener('keydown', e => { if(e.key === 'Escape') close(); });

  if (form && status) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      if (btn) btn.disabled = true;
      status.textContent = '상담 신청을 전송하고 있습니다.';
      status.className = 'form-status';
      try {
        const data = Object.fromEntries(new FormData(form).entries());
        const res = await fetch('/api/contact', {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify(data)
        });
        const json = await res.json().catch(()=>({}));
        if(!res.ok) throw new Error(json.error || `전송 오류 (${res.status})`);
        status.textContent = '상담 신청이 접수되었습니다. 확인 후 연락드리겠습니다.';
        status.className = 'form-status ok';
        form.reset();
      } catch(err) {
        status.textContent = err?.message || '온라인 접수가 연결되지 않았습니다. 010-9469-8957로 전화해 주세요.';
        status.className = 'form-status error';
      } finally {
        if(btn) btn.disabled = false;
      }
    });
  }

  const menuBtn = document.querySelector('.menu-btn');
  if(menuBtn){
    menuBtn.addEventListener('click',()=>{
      document.querySelector('.nav')?.classList.toggle('mobile-open');
    });
  }
})();
