/* NAV · HERO · WHY · SOLUTION */
(function () {
  const { useState, useEffect } = React;
  const { html, ItemArt, Tag, SectionHead, Lines, scrollToId } = UI;

  /* ---------- NAV ---------- */
  function Nav() {
    const [active, setActive] = useState('');
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
      const onScroll = () => {
        setScrolled(window.scrollY > 8);
        let cur = '';
        for (const n of DATA.nav) {
          const el = document.getElementById(n.id);
          if (el && el.getBoundingClientRect().top < 140) cur = n.id;
        }
        setActive(cur);
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const go = (id) => { setOpen(false); scrollToId(id); };

    return html`
      <nav className=${'nav' + (scrolled ? ' nav--scrolled' : '') + (open ? ' nav--open' : '')}>
        <div className="nav-inner">
          <a className="brand" href="#top" onClick=${(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <span className="brand-name">다음 주인 찾기</span>
            <span className="brand-sub">당근 × 월드비전 협업 제안</span>
          </a>
          <ul className="nav-links">
            ${DATA.nav.map((n) => html`
              <li key=${n.id}><a href=${'#' + n.id} className=${active === n.id ? 'is-active' : ''}
                onClick=${(e) => { e.preventDefault(); go(n.id); }}>${n.label}</a></li>`)}
          </ul>
          <button className="btn btn--sm btn--primary nav-cta" onClick=${() => go('closing')}>파일럿 논의</button>
          <button className="nav-toggle" aria-label="메뉴 열기" aria-expanded=${open} onClick=${() => setOpen(!open)}>
            <span></span><span></span>
          </button>
        </div>
      </nav>`;
  }

  /* ---------- HERO ---------- */
  const FLOW = [
    { key: 'sale', label: '판매 중', sub: '등록 41일째 · 거래 없음' },
    { key: 'apply', label: '기부 신청', sub: '판매자 자발적 전환 · 아직 확정 아님' },
    { key: 'match', label: '기관 매칭', sub: '인증 기관 담당자가 직접 신청' },
    { key: 'done', label: '전달 완료', sub: '기관 수령 확인 · 전달 기록' },
  ];

  function HeroVisual() {
    const [step, setStep] = useState(0);
    const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    useEffect(() => {
      if (reduce) return;
      const t = setInterval(() => setStep((s) => (s + 1) % FLOW.length), 2400);
      return () => clearInterval(t);
    }, []);
    const s = FLOW[step];
    return html`
      <div className="hero-visual" aria-label="물품 상태 흐름 예시">
        <span className="concept-label">제안용 콘셉트 목업 · 실제 서비스 화면 아님</span>

        <div className="hero-stack">
          <div className="hero-card hero-card--back hero-card--b1">
            <${ItemArt} icon="backpack" tint="#FDEFE3" size="sm" />
            <div><b>초등 저학년 책가방</b><small>아동용 가방 · 1개</small></div>
          </div>
          <div className="hero-card hero-card--back hero-card--b2">
            <${ItemArt} icon="coat" tint="#EEF0E6" size="sm" />
            <div><b>아동 겨울 패딩</b><small>계절용 외투 · 140</small></div>
          </div>

          <div className="hero-card hero-card--main">
            <div className="hero-card-top">
              <${ItemArt} icon="cardigan" tint="#FDEFE3" size="md" />
              <div className="hero-card-info">
                <span className="sample-label">예시 물품</span>
                <b>아동 니트 가디건</b>
                <small>아동 의류 · 120 · 1벌 · 사용감 있음</small>
                <small className="muted">서울 마포구</small>
              </div>
            </div>
            <div className=${'hero-status hero-status--' + s.key} key=${s.key}>
              <span className="hero-status-chip">${s.label}</span>
              <span className="hero-status-sub">${s.sub}</span>
            </div>
            <ol className="hero-steps">
              ${FLOW.map((f, i) => html`
                <li key=${f.key} className=${(i < step ? 'is-done ' : '') + (i === step ? 'is-now' : '')}>
                  <button onClick=${() => setStep(i)} aria-label=${f.label + ' 단계 보기'}>
                    <i></i><span>${f.label}</span>
                  </button>
                </li>`)}
            </ol>
          </div>
        </div>
      </div>`;
  }

  function Hero() {
    return html`
      <section className="hero" id="top">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="hero-kicker"><span>당근 × 월드비전</span> 협업 제안 · 가칭 「다음 주인 찾기」</p>
            <h1 className="hero-title">팔리지 않은 물건에도,<br />다음 주인이 있습니다.</h1>
            <p className="hero-sub">
              당근에서 거래되지 않은 물품을 AI가 검수하고,${' '}<br className="br-desk" />
              필요한 기관이 직접 선택해 실제 전달까지 이어지는${' '}<br className="br-desk" />
              수요 기반 기부 연결 모델.
            </p>
            <div className="hero-cta">
              <button className="btn btn--primary" onClick=${() => scrollToId('solution')}>서비스 구조 보기</button>
              <button className="btn btn--ghost" onClick=${() => scrollToId('pilot')}>파일럿 제안 보기</button>
            </div>
            <dl className="hero-facts">
              <div><dt>대상</dt><dd>판매되지 않은 중고 물품</dd></div>
              <div><dt>선택</dt><dd>인증 기관이 필요한 것만</dd></div>
              <div><dt>기준</dt><dd>실제 전달 완료 데이터</dd></div>
            </dl>
          </div>
          <${HeroVisual} />
        </div>
      </section>`;
  }

  /* ---------- WHY ---------- */
  function WhyViz({ kind }) {
    if (kind === 1) {
      return html`
        <div className="why-viz why-viz--1" aria-hidden="true">
          <div className="mini-listing"><span className="ml-thumb"></span><span className="ml-lines"><i></i><i></i></span><span className="ml-tag">판매 중</span></div>
          <div className="mini-listing is-dim"><span className="ml-thumb"></span><span className="ml-lines"><i></i><i></i></span><span className="ml-tag">끌어올리기</span></div>
          <div className="mini-listing is-dimmer"><span className="ml-thumb"></span><span className="ml-lines"><i></i><i></i></span><span className="ml-tag">가격 내림</span></div>
          <p className="why-viz-cap">선택지: 가격 인하 · 재등록 · 삭제</p>
        </div>`;
    }
    if (kind === 2) {
      return html`
        <div className="why-viz why-viz--2" aria-hidden="true">
          <span className="node node--me">판매자</span>
          <span className="links"><i></i><i></i><i></i></span>
          <span className="node-col"><span className="node">어디에?</span><span className="node">누가 필요?</span><span className="node">받아줄까?</span></span>
        </div>`;
    }
    return html`
      <div className="why-viz why-viz--3" aria-hidden="true">
        <span className="track-step is-on">기부</span>
        <span className="track-line"></span>
        <span className="track-step is-unknown">?</span>
        <span className="track-line is-dash"></span>
        <span className="track-step is-unknown">실제 사용</span>
      </div>`;
  }

  const PROBLEMS = [
    { n: '01', t: '판매되지 않은 물품의\n새로운 활용 기회가 제한적이다', d: '거래가 성사되지 않은 물품은 가격을 내리거나, 다시 올리거나, 결국 내리는 것 외에 다른 경로가 마땅치 않습니다. 쓸 수 있는 물건이 쓰임을 찾지 못한 채 머무릅니다.' },
    { n: '02', t: '기부 의사가 있어도\n적합한 수혜처를 찾기 어렵다', d: '판매자 개인이 어떤 기관에 어떤 물품이 필요한지, 지금 받을 수 있는지를 직접 알아보기는 어렵습니다. 의사가 행동으로 이어지기 전에 멈춥니다.' },
    { n: '03', t: '기부만으로는 실제 전달 여부를\n확인하기 어렵다', d: '물품을 보낸 뒤 필요한 사람에게 닿았는지, 기관에 부담이 되지는 않았는지 확인할 방법이 부족합니다. 수요와 맞지 않는 물품은 받는 쪽의 처리 부담이 됩니다.' },
  ];

  function Why() {
    return html`
      <section className="section section--ivory" id="why">
        <div className="container">
          <${SectionHead} num="02" eyebrow="WHY · 왜 필요한가"
            title=${html`거래되지 않았다는 것이,<br />필요하지 않다는 뜻은 아니니까.`}
            lead="이 제안은 미판매 물품의 규모를 추정하는 대신, 연결 구조가 비어 있는 지점을 세 가지로 정의합니다. 정량 규모는 파일럿 데이터로 확인할 것을 제안합니다." />
          <div className="why-grid">
            ${PROBLEMS.map((p, i) => html`
              <article className="why-card reveal" key=${p.n} style=${{ transitionDelay: i * 80 + 'ms' }}>
                <${WhyViz} kind=${i + 1} />
                <span className="why-num">${p.n}</span>
                <h3><${Lines} text=${p.t} /></h3>
                <p>${p.d}</p>
              </article>`)}
          </div>
        </div>
      </section>`;
  }

  /* ---------- SOLUTION ---------- */
  const STEPS = [
    {
      key: 'donate', en: 'DONATE', ko: '기부 전환 신청', who: '판매자',
      summary: '일정 기간 판매되지 않은 물품의 판매자가 스스로 기부 전환을 신청합니다.',
      points: [
        ['일정 기간 이상 판매되지 않은 물품이 대상 (기준 기간은 협의)', 'tbd'],
        ['판매자가 자발적으로 기부 전환 신청 — 자동 전환 없음', 'new'],
        ['기부 미성사 시 처리 방식(판매 재개 · 신청 유지 · 철회)을 신청 시 선택', 'new'],
        ['기존 판매글·물품 정보·사진을 그대로 활용', 'existing'],
      ],
    },
    {
      key: 'ai', en: 'AI CHECK', ko: 'AI 1차 검수', who: 'AI 시스템 + 담당자',
      summary: 'AI는 품질을 보증하지 않습니다. 분류하고, 빠진 정보를 찾고, 사람이 볼 것을 골라냅니다.',
      points: [
        ['물품 카테고리 분류', 'new'],
        ['등록 정보(사이즈·수량 등) 누락 확인', 'new'],
        ['사진상 오염·훼손 의심 사항 표시', 'new'],
        ['추가 사진 요청 · 사람의 검수 필요 여부 분류', 'new'],
        ['검수 기준 및 최종 판단은 운영 주체가 정함', 'wv'],
      ],
    },
    {
      key: 'match', en: 'INSTITUTION MATCH', ko: '기관 전용 물품관', who: '협력기관 담당자',
      summary: '인증된 기관 담당자만 들어오는 물품관에서, 기관이 실제로 필요한 것만 직접 신청합니다.',
      points: [
        ['기관 단위로 가입·인증된 담당자만 로그인', 'wv'],
        ['기관별 필요 품목·사이즈·수량과 비교해 추천', 'new'],
        ['담당자가 필요한 물품을 직접 선택해 신청', 'inst'],
        ['판매자에게 기관 수혜자 정보는 공개하지 않음', 'wv'],
      ],
    },
    {
      key: 'delivery', en: 'DELIVERY', ko: '전달 및 수령 확인', who: '판매자 · 기관 · 월드비전',
      summary: '판매자의 최종 동의로 기부가 확정되고, 기관의 수령 확인까지 기록합니다.',
      points: [
        ['판매자 최종 동의 후 기부 확정', 'new'],
        ['배송 및 필요시 중간 검수 거점 경유', 'tbd'],
        ['기관의 수령 확인 및 물품 상태 피드백', 'inst'],
        ['실제 전달 완료 데이터 기록·관리', 'wv'],
      ],
    },
  ];

  function Solution() {
    const [cur, setCur] = useState(0);
    const s = STEPS[cur];
    return html`
      <section className="section" id="solution">
        <div className="container">
          <${SectionHead} num="03" eyebrow="SOLUTION · 서비스 한눈에 보기"
            title=${html`기부 의사에서 실제 전달까지,<br />하나의 흐름으로.`}
            lead="네 단계를 선택하면 단계별로 누가 무엇을 하는지, 무엇이 기존 서비스이고 무엇이 새로 필요한지 확인할 수 있습니다." />

          <div className="legend reveal">
            <${Tag} kind="existing" /><${Tag} kind="new" /><${Tag} kind="wv" /><${Tag} kind="inst" /><${Tag} kind="tbd" />
          </div>

          <div className="flow reveal" role="tablist" aria-label="서비스 4단계">
            ${STEPS.map((st, i) => html`
              <button key=${st.key} role="tab" aria-selected=${cur === i}
                className=${'flow-step' + (cur === i ? ' is-active' : '') + (i < cur ? ' is-past' : '')}
                onClick=${() => setCur(i)}>
                <span className="flow-num">${String(i + 1).padStart(2, '0')}</span>
                <span className="flow-en">${st.en}</span>
                <span className="flow-ko">${st.ko}</span>
              </button>`)}
          </div>

          <div className="flow-detail reveal" role="tabpanel" key=${s.key}>
            <div className="flow-detail-main">
              <p className="flow-who">주체 · ${s.who}</p>
              <h3>${s.ko}</h3>
              <p className="flow-summary">${s.summary}</p>
              <div className="flow-nav">
                <button className="btn btn--sm btn--ghost" disabled=${cur === 0} onClick=${() => setCur(cur - 1)}>이전 단계</button>
                <button className="btn btn--sm btn--dark" disabled=${cur === STEPS.length - 1} onClick=${() => setCur(cur + 1)}>다음 단계</button>
              </div>
            </div>
            <ul className="flow-points">
              ${s.points.map(([t, k], i) => html`<li key=${i}><span>${t}</span><${Tag} kind=${k} /></li>`)}
            </ul>
          </div>
        </div>
      </section>`;
  }

  window.SECTIONS = Object.assign(window.SECTIONS || {}, { Nav, Hero, Why, Solution });
})();
