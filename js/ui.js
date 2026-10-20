/* 공용 UI 컴포넌트 */
(function () {
  const { useState, useEffect, useRef } = React;
  const html = htm.bind(React.createElement);

  /* 물품 일러스트 — 실제 사진 대신 쓰는 라인 드로잉 (이미지 로딩 실패와 무관하게 레이아웃 유지) */
  const PATHS = {
    jacket: 'M38 22l-14 8-8 22 10 4v34h48V56l10-4-8-22-14-8-6 6h-12z M50 28v62 M44 46h-6 M62 46h-6',
    coat: 'M38 20l-14 8-8 26 10 4v34h48V58l10-4-8-26-14-8c-2 8-22 8-24 0z M50 30v62 M30 70h12 M58 70h12',
    tshirt: 'M38 22l-16 10 6 14 8-4v44h28V42l8 4 6-14-16-10c-2 6-22 6-24 0z',
    cardigan: 'M38 22l-14 8-6 30 10 2v30h44V62l10-2-6-30-14-8-12 26z M50 48v44 M47 60h6 M47 72h6 M47 84h6',
    dress: 'M40 20h20l4 14-6 6 14 50H28l14-50-6-6z M38 40h24',
    backpack: 'M32 34c0-10 8-16 18-16s18 6 18 16v52H32z M40 18c0-6 20-6 20 0 M38 56h24v18H38z M32 44h36',
    bag: 'M28 40h44l-4 46H32z M40 40c0-12 20-12 20 0 M28 54h44',
    blanket: 'M22 30h56v40H22z M22 70c6 6 14 8 22 8h34V70 M30 38h40 M30 46h40 M30 54h40',
    pencil: 'M24 74l42-42 8 8-42 42-10 2z M60 38l8 8 M28 30h22v10H28z',
    seat: 'M36 22h28l4 40H32z M32 62h36l4 22H28z M40 32h20 M40 72h20',
  };

  function ItemArt({ icon, tint, size = 'md', label }) {
    return html`
      <div className=${'item-art item-art--' + size} style=${{ background: tint || '#F3F1EC' }} role="img" aria-label=${label || '예시 물품 일러스트'}>
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <path d=${PATHS[icon] || PATHS.tshirt} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      </div>`;
  }

  function AiBadge({ status, small }) {
    const s = DATA.AI_STATUS[status];
    if (!s) return null;
    return html`<span className=${'badge badge--' + s.tone + (small ? ' badge--sm' : '')}><i className="dot"></i>${s.label}</span>`;
  }

  /* 역할 구분 태그: 기존 서비스 / 신규 개발 / 월드비전 / 협의 필요 */
  const TAGS = {
    existing: '당근 기존 서비스',
    new: '신규 개발 필요',
    wv: '월드비전 역할',
    tbd: '협의 필요',
    inst: '협력기관',
  };
  function Tag({ kind, children }) {
    return html`<span className=${'tag tag--' + kind}>${children || TAGS[kind]}</span>`;
  }

  function SectionHead({ num, eyebrow, title, lead, align }) {
    return html`
      <header className=${'section-head reveal' + (align === 'center' ? ' section-head--center' : '')}>
        <p className="eyebrow"><span className="eyebrow-num">${num}</span>${eyebrow}</p>
        <h2 className="section-title">${title}</h2>
        ${lead ? html`<p className="section-lead">${lead}</p>` : null}
      </header>`;
  }

  /* 줄바꿈 문자열을 <br>로 */
  function Lines({ text }) {
    const parts = text.split('\n');
    return parts.map((p, i) => html`<${React.Fragment} key=${i}>${p}${i < parts.length - 1 ? html`<br />` : null}<//>`);
  }

  function DemoNote({ children }) {
    return html`<p className="demo-note"><span className="demo-note-label">데모</span>${children}</p>`;
  }

  function Modal({ open, onClose, title, children, wide }) {
    const ref = useRef(null);
    useEffect(() => {
      if (!open) return;
      const onKey = (e) => { if (e.key === 'Escape') onClose(); };
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
      setTimeout(() => ref.current && ref.current.focus(), 0);
      return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
    }, [open]);
    if (!open) return null;
    return html`
      <div className="modal-backdrop" onClick=${onClose}>
        <div className=${'modal' + (wide ? ' modal--wide' : '')} role="dialog" aria-modal="true" aria-label=${title}
             tabIndex="-1" ref=${ref} onClick=${(e) => e.stopPropagation()}>
          <div className="modal-head">
            <h3>${title}</h3>
            <button className="icon-btn" onClick=${onClose} aria-label="닫기">
              <svg viewBox="0 0 24 24" width="20" height="20"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          </div>
          <div className="modal-body">${children}</div>
        </div>
      </div>`;
  }

  function Check({ ok, state }) {
    const st = state || (ok ? 'ok' : 'no');
    if (st === 'ok') return html`<svg className="chk chk--ok" viewBox="0 0 20 20" width="16" height="16" aria-label="충족"><path d="M5 10.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>`;
    if (st === 'na') return html`<svg className="chk chk--na" viewBox="0 0 20 20" width="16" height="16" aria-label="확인 필요"><path d="M10 5v6M10 14.5v.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>`;
    return html`<svg className="chk chk--no" viewBox="0 0 20 20" width="16" height="16" aria-label="미충족"><path d="M6 6l8 8M14 6l-8 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>`;
  }

  /* 스크롤 진입 애니메이션 */
  function useReveal() {
    useEffect(() => {
      const els = document.querySelectorAll('.reveal:not(.is-in)');
      if (!('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('is-in')); return; }
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
      els.forEach((el) => io.observe(el));
      return () => io.disconnect();
    });
  }

  function scrollToId(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 64;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  function useToast() {
    const [msg, setMsg] = useState(null);
    const t = useRef(null);
    const show = (m) => { setMsg(m); clearTimeout(t.current); t.current = setTimeout(() => setMsg(null), 2800); };
    const node = msg ? html`<div className="toast" role="status">${msg}</div>` : null;
    return [show, node];
  }

  window.UI = { html, ItemArt, AiBadge, Tag, TAGS, SectionHead, Lines, DemoNote, Modal, Check, useReveal, scrollToId, useToast };
})();
