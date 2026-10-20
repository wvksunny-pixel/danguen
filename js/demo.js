/* SECTION 04 — SERVICE DEMO (판매자 · AI 검수 · 기관 물품관 · 수요 매칭) */
(function () {
  const { useState, useEffect, useMemo } = React;
  const { html, ItemArt, AiBadge, Tag, SectionHead, DemoNote, Modal, Check, scrollToId } = UI;

  const won = (n) => n.toLocaleString('ko-KR') + '원';

  const FALLBACK = [
    { id: 'resume', label: '기존 판매 재개', desc: '기부가 성사되지 않으면 판매글을 다시 판매 중으로 되돌립니다.' },
    { id: 'keep', label: '일정 기간 기부 신청 유지', desc: '기간(예: 30일, 협의) 동안 기관 신청을 계속 기다립니다.' },
    { id: 'withdraw', label: '기부 신청 철회', desc: '기부 신청을 종료하고 판매글은 숨김 상태로 둡니다.' },
  ];

  /* ---------- A. 판매자 화면 ---------- */
  function SellerDemo({ state, setState, goTab, toast }) {
    const it = DATA.sellerItem;
    const [form, setForm] = useState({ size: it.size, qty: it.qty, condition: it.condition, fallback: 'resume', agree: false });
    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
    const applied = state.sellerApplied;

    const submit = () => {
      setState((s) => ({ ...s, sellerApplied: true, sellerForm: form }));
      scrollToId('demo-tabs');
      toast('기부 전환 신청이 접수되었습니다. 아직 기부 확정은 아닙니다.');
    };
    const withdraw = () => {
      setState((s) => ({ ...s, sellerApplied: false }));
      set('agree', false);
      toast('신청을 철회했습니다. 판매글은 기존 상태로 돌아갑니다. (데모)');
    };

    const track = [
      { t: '기부 신청 완료', d: '기부 확정 아님 · 소유권 판매자', on: true },
      { t: 'AI 1차 검수', d: '사람의 최종 확인 필요로 분류', on: true },
      { t: '기관 신청 대기', d: '인증 기관 담당자의 신청을 기다리는 중', now: true },
      { t: '판매자 최종 동의', d: '기관 신청 시 알림 → 동의해야 확정' },
      { t: '인계 · 수령 확인', d: '사전에 정한 방식으로 전달' },
    ];

    return html`
      <div className="demo-split">
        <div className="phone">
          <div className="phone-bar"><span>판매글 › 기부 전환 신청</span><${Tag} kind="new">신규 기능 목업</${Tag}></div>
          <div className="phone-body">
            <div className="seller-item">
              <${ItemArt} icon=${it.icon} tint=${it.tint} size="md" label="예시 물품: 아동 니트 가디건" />
              <div>
                <span className="sample-label">예시 물품</span>
                <h4>${it.name}</h4>
                <p className="muted">${it.region} · 등록 ${it.listedDays}일째 · 관심 ${it.likes}</p>
              </div>
            </div>

            <div className="sale-info">
              <div><span>기존 판매 정보</span><b>판매 희망가 ${won(it.price)}</b></div>
              <p>기부 전환 시 판매 희망가는 기부 금액이나 사회공헌 실적으로 간주하지 않습니다.</p>
            </div>

            ${!applied ? html`
              <div className="form-grid">
                <label className="field"><span>카테고리</span><input value=${it.category} readOnly /></label>
                <label className="field"><span>사이즈</span>
                  <select value=${form.size} onChange=${(e) => set('size', e.target.value)}>
                    ${['100', '110', '120', '130', '140'].map((s) => html`<option key=${s}>${s}</option>`)}
                  </select></label>
                <label className="field"><span>수량</span>
                  <input type="number" min="1" max="20" value=${form.qty} onChange=${(e) => set('qty', Math.max(1, +e.target.value || 1))} /></label>
                <label className="field"><span>사용 상태</span>
                  <select value=${form.condition} onChange=${(e) => set('condition', e.target.value)}>
                    ${['새 상품에 가까움', '사용감 적음', '사용감 있음'].map((s) => html`<option key=${s}>${s}</option>`)}
                  </select></label>
              </div>

              <fieldset className="fallback">
                <legend>기부가 성사되지 않으면 어떻게 할까요?</legend>
                ${FALLBACK.map((f) => html`
                  <label key=${f.id} className=${'radio-card' + (form.fallback === f.id ? ' is-on' : '')}>
                    <input type="radio" name="fb" checked=${form.fallback === f.id} onChange=${() => set('fallback', f.id)} />
                    <span><b>${f.label}</b><small>${f.desc}</small></span>
                  </label>`)}
              </fieldset>

              <div className="notice notice--warn">
                <b>기부 신청은 기부 확정이 아닙니다.</b>
                <p>기관의 수요, 물품 상태, 검수 결과, 배송 가능 여부에 따라 기부가 성사되지 않을 수 있습니다. 기관이 신청하면 다시 알려드리고, 판매자가 최종 동의해야 기부가 확정됩니다. 그 전까지 물품의 소유권은 판매자에게 있습니다.</p>
              </div>

              <label className="agree">
                <input type="checkbox" checked=${form.agree} onChange=${(e) => set('agree', e.target.checked)} />
                <span>위 내용을 확인했으며, 기부 확정 시 이 물품을 무상으로 제공할 의사가 있습니다.</span>
              </label>
              <button className="btn btn--primary btn--block" disabled=${!form.agree} onClick=${submit}>기부 전환 신청</button>
              ${!form.agree ? html`<p className="hint">안내 확인에 체크하면 신청할 수 있습니다.</p>` : null}
            ` : html`
              <div className="applied">
                <div className="applied-head">
                  <span className="status-pill status-pill--apply">신청 완료 · 기부 확정 아님</span>
                  <p>미성사 시: <b>${FALLBACK.find((f) => f.id === state.sellerForm.fallback).label}</b></p>
                </div>
                <ol className="tracker">
                  ${track.map((s, i) => html`
                    <li key=${i} className=${(s.on ? 'is-done ' : '') + (s.now ? 'is-now' : '')}>
                      <i></i><div><b>${s.t}</b><small>${s.d}</small></div>
                    </li>`)}
                </ol>
                <div className="applied-actions">
                  <button className="btn btn--dark btn--block" onClick=${() => goTab('ai')}>AI 1차 검수 결과 보기</button>
                  <button className="btn btn--ghost btn--block" onClick=${withdraw}>신청 철회 (현 단계에서 가능)</button>
                </div>
              </div>
            `}
          </div>
        </div>

        <aside className="demo-notes">
          <h4>이 화면에서 확인할 점</h4>
          <ul className="note-list">
            <li><b>자발적 전환.</b> 판매 미성사 물품이라도 자동으로 기부 전환하지 않습니다. 판매자가 직접 신청합니다.</li>
            <li><b>신청 ≠ 확정.</b> 신청 화면에서 가능성을 먼저 안내하고, 동의 체크 후에만 신청할 수 있습니다.</li>
            <li><b>미성사 처리 선택.</b> 판매 재개 · 신청 유지 · 철회 중 하나를 신청 시점에 정합니다.</li>
            <li><b>가격과 가치 분리.</b> 기존 판매 희망가는 기부 실적으로 환산하지 않습니다.</li>
            <li><b>기존 자산 활용.</b> 판매글의 사진·정보를 그대로 쓰므로 판매자가 다시 입력할 내용이 적습니다.</li>
          </ul>
          <${DemoNote}>버튼은 브라우저 안에서만 상태가 바뀌며, 실제 데이터는 저장·전송되지 않습니다.</${DemoNote}>
        </aside>
      </div>`;
  }

  /* ---------- B. AI 검수 화면 ---------- */
  function AiDemo({ state, goTab }) {
    const it = DATA.sellerItem;
    const rows = DATA.aiReport;
    const [shown, setShown] = useState(0);
    const replay = () => setShown(0);
    useEffect(() => {
      if (shown >= rows.length) return;
      const t = setTimeout(() => setShown((n) => n + 1), 420);
      return () => clearTimeout(t);
    }, [shown]);
    const done = shown >= rows.length;

    return html`
      <div>
        <div className="mock-banner">
          <b>목업 데이터 기반 데모</b> — 실제 AI 이미지 분석 API가 연결되지 않은 프로토타입입니다. 아래 결과는 미리 작성한 예시 값이며, AI가 실제로 분석한 결과가 아닙니다.
        </div>
        <div className="demo-split demo-split--ai">
          <div className="ai-photo">
            <div className="ai-photo-frame">
              <${ItemArt} icon=${it.icon} tint=${it.tint} size="xl" label="예시 물품: 아동 니트 가디건" />
              <span className="ai-box" style=${{ left: '20%', top: '44%', width: '18%', height: '18%' }}><em>변색 의심 영역 (예시)</em></span>
            </div>
            <div className="ai-photo-meta">
              <span className="sample-label">예시 물품</span>
              <b>${it.name}</b>
              <small>${state.sellerApplied ? '판매자 신청 완료 → 검수 대기열 진입 (데모)' : '판매자 화면에서 신청하면 이 물품이 검수 대기열에 들어갑니다'}</small>
            </div>
          </div>

          <div className="ai-report">
            <div className="ai-report-head">
              <h4>1차 검수 결과</h4>
              <button className="btn btn--sm btn--ghost" onClick=${replay} disabled=${!done}>검수 과정 다시 보기</button>
            </div>
            <dl className="report">
              ${rows.map((r, i) => html`
                <div key=${r.key} className=${'report-row report-row--' + r.state + (i < shown ? ' is-in' : '')}>
                  <dt>${r.key}</dt>
                  <dd><b>${i < shown ? r.value : '확인 중…'}</b><small>${i < shown ? r.note : ''}</small></dd>
                </div>`)}
            </dl>

            <div className="status-legend">
              <p className="mini-title">검수 상태 4단계</p>
              <ul>
                ${Object.entries(DATA.AI_STATUS).map(([k, v]) => html`
                  <li key=${k} className=${k === 'human' && done ? 'is-current' : ''}>
                    <${AiBadge} status=${k} small=${true} />
                    <span>${v.desc}</span>
                  </li>`)}
              </ul>
            </div>
          </div>
        </div>

        <div className="ai-limits">
          <div>
            <h4>AI는 최종 품질을 보증하지 않습니다</h4>
            <p>AI 검수는 사람이 봐야 할 것을 줄이고 우선순위를 정하는 보조 단계입니다. 아래 항목은 사진만으로 확인할 수 없으므로 판매자 자기신고, 기관 수령 시 확인, 또는 중간 검수 거점에서 별도로 확인합니다.</p>
          </div>
          <ul className="chips">${DATA.notVisible.map((n) => html`<li key=${n}>${n}</li>`)}</ul>
        </div>
        <div className="demo-next">
          <button className="btn btn--dark" onClick=${() => goTab('mall')}>기관 전용 물품관으로</button>
        </div>
      </div>`;
  }

  /* ---------- C. 기관 전용 물품관 ---------- */
  function ItemCard({ item, applied, onOpen, fresh }) {
    return html`
      <article className=${'item-card' + (applied ? ' is-applied' : '')}>
        <button className="item-card-hit" onClick=${() => onOpen(item)} aria-label=${item.name + ' 상세 보기'}>
          <div className="item-card-media">
            <${ItemArt} icon=${item.icon} tint=${item.tint} size="fill" label=${'예시 물품: ' + item.name} />
            <span className="sample-label sample-label--float">${fresh ? '방금 신청된 예시' : '예시 물품'}</span>
            ${applied ? html`<span className="applied-flag">신청함</span>` : null}
          </div>
          <div className="item-card-body">
            <h4>${item.name}</h4>
            <p className="item-meta">${item.size} · ${item.qty}개 · ${item.condition}</p>
            <${AiBadge} status=${item.ai} small=${true} />
            ${item.checks && item.checks[0] ? html`<p className="item-check">${item.checks[0]}</p>` : null}
          </div>
        </button>
        <div className="item-card-foot">
          <span className="muted">${item.region}</span>
          <button className=${'btn btn--sm ' + (applied ? 'btn--ghost' : 'btn--primary')} onClick=${() => onOpen(item)}>${applied ? '신청 내역' : '신청'}</button>
        </div>
      </article>`;
  }

  function sellerAsItem(state) {
    const it = DATA.sellerItem, f = state.sellerForm || {};
    return {
      id: 'seller', name: it.name, category: it.category, size: f.size || it.size, sizeNum: +(f.size || it.size),
      qty: f.qty || it.qty, condition: f.condition || it.condition, ai: 'human', region: it.region,
      icon: it.icon, tint: it.tint, listedDays: it.listedDays, checks: ['소매 끝 변색 의심 — 사람의 최종 확인 필요'],
    };
  }

  function useAllItems(state) {
    return useMemo(() => (state.sellerApplied ? [sellerAsItem(state), ...DATA.items] : DATA.items), [state.sellerApplied, state.sellerForm]);
  }

  function ItemModal({ item, state, setState, onClose, toast }) {
    const applied = item && state.applications[item.id];
    const [qty, setQty] = useState(1);
    useEffect(() => { setQty(applied ? applied.qty : 1); }, [item && item.id]);
    if (!item) return null;
    const apply = () => {
      setState((s) => ({ ...s, applications: { ...s.applications, [item.id]: { qty, at: Date.now() } } }));
      toast('신청이 접수되었습니다. 판매자 최종 동의와 검수 후 확정됩니다. (데모)');
    };
    const cancel = () => {
      setState((s) => { const a = { ...s.applications }; delete a[item.id]; return { ...s, applications: a }; });
      toast('신청을 취소했습니다. (데모)');
    };
    return html`
      <${Modal} open=${!!item} onClose=${onClose} title=${item.name} wide=${true}>
        <div className="detail">
          <div className="detail-media">
            <${ItemArt} icon=${item.icon} tint=${item.tint} size="fill" label=${'예시 물품: ' + item.name} />
            <span className="sample-label sample-label--float">예시 물품</span>
          </div>
          <div className="detail-info">
            <dl className="spec">
              <div><dt>품목</dt><dd>${item.category}</dd></div>
              <div><dt>사이즈·규격</dt><dd>${item.size}</dd></div>
              <div><dt>수량</dt><dd>${item.qty}개</dd></div>
              <div><dt>사용 상태</dt><dd>${item.condition} <small className="muted">(판매자 신고)</small></dd></div>
              <div><dt>지역</dt><dd>${item.region}</dd></div>
              <div><dt>AI 1차 검수</dt><dd><${AiBadge} status=${item.ai} small=${true} /></dd></div>
            </dl>
            <div className="detail-checks">
              <p className="mini-title">추가 확인이 필요한 사항</p>
              <ul>${item.checks.map((c) => html`<li key=${c}>${c}</li>`)}</ul>
            </div>
            <div className="privacy-box">
              <p className="mini-title">정보 공개 범위 (안)</p>
              <p>판매자에게는 <b>기관 유형과 시·군·구</b>만 공개됩니다. 기관이 돌보는 아동·가정의 이름, 얼굴, 주소 등은 판매자에게 노출되지 않으며, 물품관에도 수혜자 정보는 입력하지 않습니다.</p>
            </div>

            ${item.ai === 'unfit' ? html`
              <div className="notice notice--muted"><b>신청 불가</b><p>기부 부적합 의심 물품은 담당자 확인 전까지 신청할 수 없습니다.</p></div>
            ` : applied ? html`
              <div className="applied-box">
                <span className="status-pill status-pill--match">신청 완료 · ${applied.qty}개</span>
                <p>판매자 최종 동의 및 ${item.ai === 'pass' ? '인계 전 확인' : '사람의 검수'} 후 기부가 확정됩니다. 결과에 따라 성사되지 않을 수 있습니다.</p>
                <button className="btn btn--ghost btn--sm" onClick=${cancel}>신청 취소</button>
              </div>
            ` : html`
              <div className="apply-row">
                ${item.qty > 1 ? html`
                  <label className="field field--inline"><span>신청 수량</span>
                    <select value=${qty} onChange=${(e) => setQty(+e.target.value)}>
                      ${Array.from({ length: item.qty }, (_, i) => html`<option key=${i} value=${i + 1}>${i + 1}개</option>`)}
                    </select></label>` : null}
                <button className="btn btn--primary" onClick=${apply}>이 물품 신청하기</button>
              </div>
              <p className="hint">신청은 기관의 필요 의사 표시입니다. 판매자 동의와 검수 결과에 따라 성사되지 않을 수 있습니다.</p>
            `}
          </div>
        </div>
      <//>`;
  }

  function MallDemo({ state, setState, toast }) {
    const all = useAllItems(state);
    const [cat, setCat] = useState('전체');
    const [passOnly, setPassOnly] = useState(false);
    const [open, setOpen] = useState(null);

    const visible = all.filter((i) => i.ai !== 'unfit')
      .filter((i) => cat === '전체' || i.category === cat)
      .filter((i) => !passOnly || i.ai === 'pass');
    const hidden = all.filter((i) => i.ai === 'unfit').length;
    const count = Object.keys(state.applications).length;

    return html`
      <div>
        <div className="mall-bar">
          <div className="mall-who">
            <span className="avatar" aria-hidden="true">기관</span>
            <div>
              <b>마포 ○○지역아동센터 <span className="sample-label">예시 기관</span></b>
              <small>인증 기관 담당자 데모 로그인 · 실제 기관 인증 기능은 미구현</small>
            </div>
          </div>
          <div className="mall-count">신청 내역 <b>${count}</b>건</div>
        </div>

        <div className="mall-filters">
          <div className="chip-row" role="group" aria-label="품목 필터">
            ${['전체', ...DATA.categories].map((c) => html`
              <button key=${c} className=${'chip' + (cat === c ? ' is-on' : '')} onClick=${() => setCat(c)}>${c}</button>`)}
          </div>
          <label className="switch">
            <input type="checkbox" checked=${passOnly} onChange=${(e) => setPassOnly(e.target.checked)} />
            <span>1차 검수 통과만 보기</span>
          </label>
        </div>

        ${visible.length ? html`
          <div className="item-grid">
            ${visible.map((it) => html`<${ItemCard} key=${it.id} item=${it} fresh=${it.id === 'seller'}
              applied=${!!state.applications[it.id]} onOpen=${setOpen} />`)}
          </div>` : html`<p className="empty">조건에 맞는 예시 물품이 없습니다.</p>`}

        <${DemoNote}>기부 부적합 의심 물품 ${hidden}건은 담당자 확인 전까지 물품관에 노출하지 않는 것을 운영안으로 제안합니다. 표시된 모든 물품은 예시 데이터입니다.</${DemoNote}>

        <${ItemModal} item=${open} state=${state} setState=${setState} onClose=${() => setOpen(null)} toast=${toast} />
      </div>`;
  }

  /* ---------- D. 기관 수요 매칭 ---------- */
  function evaluate(item, need) {
    const range = DATA.sizeRanges.find((r) => r.id === need.size);
    const cat = item.category === need.category;
    let size;
    if (need.size === 'any') size = { s: 'ok', t: '사이즈 조건 없음' };
    else if (item.sizeNum == null) size = { s: 'na', t: '사이즈 해당 없음 · 규격 확인' };
    else if (item.sizeNum >= range.min && item.sizeNum <= range.max) size = { s: 'ok', t: '사이즈 일치 (' + item.sizeNum + ')' };
    else size = { s: 'no', t: '사이즈 불일치 (' + item.sizeNum + ')' };
    const qtyOk = item.qty >= need.qty;
    const qty = qtyOk ? { s: 'ok', t: '필요 수량 충족 가능' } : { s: 'na', t: '일부 충족 (' + item.qty + '/' + need.qty + ')' };
    const region = need.regions.includes(item.region) ? { s: 'ok', t: '배송 가능 지역' } : { s: 'no', t: '배송 지역 밖' };
    const ai = item.ai === 'pass' ? { s: 'ok', t: '1차 검수 통과' } : { s: 'na', t: DATA.AI_STATUS[item.ai].label };
    const conds = [{ s: cat ? 'ok' : 'no', t: cat ? '품목 일치' : '품목 불일치' }, size, qty, region, ai];
    const score = conds.filter((c) => c.s === 'ok').length;
    return { item, conds, score, eligible: cat && item.ai !== 'unfit' && size.s !== 'no' };
  }

  function MatchDemo({ state, setState, toast, goTab }) {
    const all = useAllItems(state);
    const [need, setNeed] = useState({ type: DATA.instTypes[0], category: '아동 의류', size: '110-130', qty: 1, timing: DATA.timings[1], regions: ['서울 마포구'] });
    const [result, setResult] = useState(null);
    const set = (k, v) => setNeed((n) => ({ ...n, [k]: v }));
    const toggleRegion = (r) => set('regions', need.regions.includes(r) ? need.regions.filter((x) => x !== r) : [...need.regions, r]);

    const run = () => {
      const ev = all.map((i) => evaluate(i, need));
      const rec = ev.filter((e) => e.eligible).sort((a, b) => b.score - a.score);
      const excluded = ev.filter((e) => !e.eligible && e.item.category === need.category);
      setResult({ rec, excluded, need: { ...need } });
    };
    const apply = (item) => {
      setState((s) => ({ ...s, applications: { ...s.applications, [item.id]: { qty: Math.min(item.qty, result.need.qty), at: Date.now() } } }));
      toast('추천 물품을 신청했습니다. 물품관 신청 내역에 반영됩니다. (데모)');
    };

    return html`
      <div className="demo-split demo-split--match">
        <form className="need-form" onSubmit=${(e) => { e.preventDefault(); run(); }}>
          <h4>필요 물품 등록</h4>
          <p className="muted small">기관 담당자가 기관 단위로 등록합니다. 개별 아동·가정 정보는 입력하지 않습니다.</p>
          <label className="field"><span>기관 유형</span>
            <select value=${need.type} onChange=${(e) => set('type', e.target.value)}>${DATA.instTypes.map((t) => html`<option key=${t}>${t}</option>`)}</select></label>
          <label className="field"><span>필요 품목</span>
            <select value=${need.category} onChange=${(e) => set('category', e.target.value)}>${DATA.categories.map((t) => html`<option key=${t}>${t}</option>`)}</select></label>
          <div className="form-grid">
            <label className="field"><span>사이즈·규격</span>
              <select value=${need.size} onChange=${(e) => set('size', e.target.value)}>${DATA.sizeRanges.map((r) => html`<option key=${r.id} value=${r.id}>${r.label}</option>`)}</select></label>
            <label className="field"><span>필요 수량</span>
              <input type="number" min="1" max="30" value=${need.qty} onChange=${(e) => set('qty', Math.max(1, +e.target.value || 1))} /></label>
          </div>
          <label className="field"><span>필요 시점</span>
            <select value=${need.timing} onChange=${(e) => set('timing', e.target.value)}>${DATA.timings.map((t) => html`<option key=${t}>${t}</option>`)}</select></label>
          <fieldset className="field">
            <span>배송 가능 지역</span>
            <div className="chip-row">
              ${DATA.regions.map((r) => html`
                <button type="button" key=${r} className=${'chip' + (need.regions.includes(r) ? ' is-on' : '')} onClick=${() => toggleRegion(r)} aria-pressed=${need.regions.includes(r)}>${r}</button>`)}
            </div>
          </fieldset>
          <button type="submit" className="btn btn--primary btn--block" disabled=${!need.regions.length}>추천 물품 찾기</button>
          ${!need.regions.length ? html`<p className="hint">배송 가능 지역을 하나 이상 선택하세요.</p>` : null}
        </form>

        <div className="match-result">
          <div className="mock-banner mock-banner--sm"><b>규칙 기반 데모</b> — 실제 매칭 알고리즘은 연결되지 않았습니다. 아래 다섯 가지 조건을 단순 비교합니다.</div>
          ${!result ? html`
            <div className="match-empty">
              <p>왼쪽에서 필요 물품을 등록하면, 예시 물품 중 조건이 맞는 물품과 <b>추천 근거</b>를 보여줍니다.</p>
              <ul className="cond-list">
                <li>품목 일치</li><li>사이즈 일치</li><li>필요 수량 충족 가능</li><li>배송 가능 지역</li><li>AI 1차 검수 상태</li>
              </ul>
            </div>
          ` : html`
            <div className="match-head">
              <p><b>${result.need.category}</b> · ${DATA.sizeRanges.find((r) => r.id === result.need.size).label} · ${result.need.qty}개 · ${result.need.timing}</p>
              <span className="muted">추천 ${result.rec.length}건</span>
            </div>
            ${result.rec.length ? html`
              <ul className="match-list">
                ${result.rec.map((r) => {
                  const ap = state.applications[r.item.id];
                  return html`
                  <li key=${r.item.id} className="match-item">
                    <${ItemArt} icon=${r.item.icon} tint=${r.item.tint} size="sm" />
                    <div className="match-body">
                      <div className="match-title"><b>${r.item.name}</b><span className="score">${r.score}/5 조건 충족</span></div>
                      <p className="item-meta">${r.item.size} · ${r.item.qty}개 · ${r.item.region} <span className="sample-label">예시</span></p>
                      <ul className="reasons">
                        ${r.conds.map((c, i) => html`<li key=${i} className=${'reason reason--' + c.s}><${Check} state=${c.s} />${c.t}</li>`)}
                      </ul>
                    </div>
                    <button className=${'btn btn--sm ' + (ap ? 'btn--ghost' : 'btn--primary')} disabled=${!!ap} onClick=${() => apply(r.item)}>${ap ? '신청함' : '신청'}</button>
                  </li>`; })}
              </ul>` : html`<p className="empty">조건에 맞는 예시 물품이 없습니다. 사이즈나 지역 조건을 바꿔 보세요. 실제 운영에서는 수요가 물품관에 공개되어 판매자 참여를 유도하는 방식도 검토할 수 있습니다.</p>`}
            ${result.excluded.length ? html`<p className="muted small">같은 품목 중 사이즈 불일치 또는 기부 부적합 의심으로 제외: ${result.excluded.map((e) => e.item.name).join(', ')}</p>` : null}
            <button className="btn btn--sm btn--ghost" onClick=${() => goTab('mall')}>물품관 신청 내역 보기</button>
          `}
        </div>
      </div>`;
  }

  /* ---------- 데모 컨테이너 ---------- */
  const TABS = [
    { id: 'seller', l: 'A', t: '판매자 화면', d: '기부 전환 신청' },
    { id: 'ai', l: 'B', t: 'AI 검수 화면', d: '1차 검수 보조' },
    { id: 'mall', l: 'C', t: '기관 전용 물품관', d: '직접 선택·신청' },
    { id: 'match', l: 'D', t: '기관 수요 매칭', d: '필요 등록·추천' },
  ];

  function Demo({ toast }) {
    const [tab, setTab] = useState('seller');
    const [state, setState] = useState({ sellerApplied: false, sellerForm: null, applications: {} });
    const goTab = (id) => { setTab(id); scrollToId('demo-tabs'); };
    const props = { state, setState, goTab, toast };

    return html`
      <section className="section section--ivory" id="demo">
        <div className="container">
          <${SectionHead} num="04" eyebrow="SERVICE DEMO · 서비스 화면 목업"
            title=${html`네 개의 화면으로 보는<br />실제 이용 흐름.`}
            lead="판매자의 신청부터 기관의 선택까지 직접 눌러 볼 수 있습니다. 화면 사이의 상태는 이어집니다 — 판매자 화면에서 신청한 물품이 기관 물품관에 나타납니다." />

          <div className="demo-tabs reveal" id="demo-tabs" role="tablist">
            ${TABS.map((t) => html`
              <button key=${t.id} role="tab" aria-selected=${tab === t.id} className=${'demo-tab' + (tab === t.id ? ' is-active' : '')} onClick=${() => setTab(t.id)}>
                <span className="demo-tab-l">${t.l}</span>
                <span className="demo-tab-t">${t.t}<small>${t.d}</small></span>
              </button>`)}
          </div>

          <div className="demo-stage" role="tabpanel">
            ${tab === 'seller' ? html`<${SellerDemo} ...${props} />` : null}
            ${tab === 'ai' ? html`<${AiDemo} ...${props} />` : null}
            ${tab === 'mall' ? html`<${MallDemo} ...${props} />` : null}
            ${tab === 'match' ? html`<${MatchDemo} ...${props} />` : null}
          </div>

          <p className="demo-foot">본 섹션의 모든 화면은 제안용 프로토타입입니다. 데이터 저장, 기관 인증, AI 분석, 배송 예약 기능은 구현되어 있지 않습니다.</p>
        </div>
      </section>`;
  }

  window.SECTIONS = Object.assign(window.SECTIONS || {}, { Demo });
})();
