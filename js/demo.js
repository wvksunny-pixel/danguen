/* SECTION — SERVICE DEMO (수요 중심: 기관 수요 등록 · 제공자 화면 · AI 검수 · 기관 선택과 제공 확정) */
(function () {
  const { useState, useEffect } = React;
  const { html, ItemArt, AiBadge, Tag, SectionHead, DemoNote, scrollToId } = UI;

  const won = (n) => n.toLocaleString('ko-KR') + '원';
  const clone = (x) => JSON.parse(JSON.stringify(x));

  function GradeBadge({ grade }) {
    const g = DATA.GRADES[grade];
    if (!g) return null;
    return html`<span className=${'grade grade--' + grade}>${g.label}</span>`;
  }
  function Grades({ list }) {
    return html`<span className="grade-row">${list.map((g) => html`<${GradeBadge} key=${g} grade=${g} />`)}<small>허용</small></span>`;
  }
  function DemandStatus({ d }) {
    if (d.status === 'done') return html`<span className="st st--done">모집 완료</span>`;
    if (d.status === 'cancel') return html`<span className="st st--cancel">수요 취소 · 모집 종료</span>`;
    return html`<span className="st st--open">모집 중</span>`;
  }
  function Progress({ d }) {
    const pct = Math.min(100, Math.round((d.matched / d.qty) * 100));
    const left = Math.max(0, d.qty - d.matched);
    return html`
      <div className="prog">
        <div className="prog-bar"><span style=${{ width: pct + '%' }}></span></div>
        <div className="prog-txt"><span>매칭 <b>${d.matched}</b> / ${d.qty}</span><span>${left ? html`미충족 <b>${left}</b>` : '수요 충족'}</span></div>
      </div>`;
  }

  /* ---------- A. 기관 수요 등록 ---------- */
  function NeedDemo({ state, setState, toast, goTab }) {
    const [f, setF] = useState({ category: '계절용 외투', label: '', size: '110~120', qty: 10, timing: DATA.timings[1], grades: ['S', 'A'], region: '서울 마포구' });
    const set = (k, v) => setF((x) => ({ ...x, [k]: v }));
    const toggleGrade = (g) => set('grades', f.grades.includes(g) ? f.grades.filter((x) => x !== g) : [...f.grades, g].sort());
    const mine = state.demands.filter((d) => d.mine);

    const submit = (e) => {
      e.preventDefault();
      const id = 'n' + Date.now();
      const d = { id, inst: '마포 ○○지역아동센터', instType: '지역아동센터', region: f.region, mine: true,
        category: f.category, label: f.label.trim() || f.category, size: f.size || '해당 없음', qty: f.qty, matched: 0,
        grades: f.grades, timing: f.timing, status: 'open', fresh: true };
      setState((s) => ({ ...s, demands: [d, ...s.demands] }));
      toast('수요가 등록되었습니다. 이 수요에 맞는 물품만 모집이 열립니다. (데모)');
    };
    const cancel = (id) => {
      setState((s) => ({ ...s, demands: s.demands.map((d) => d.id === id ? { ...d, status: 'cancel' } : d) }));
      toast('수요를 취소했습니다. 해당 모집도 함께 종료됩니다. (데모)');
    };

    return html`
      <div className="demo-split demo-split--match">
        <form className="need-form" onSubmit=${submit}>
          <h4>필요 물품 등록</h4>
          <p className="muted small">기관 단위로 등록합니다. 개별 아동·가정 정보는 입력하지 않습니다.</p>
          <label className="field"><span>기관 유형</span><input value="지역아동센터 (예시 기관)" readOnly /></label>
          <div className="form-grid">
            <label className="field"><span>품목</span>
              <select value=${f.category} onChange=${(e) => set('category', e.target.value)}>${DATA.categories.map((c) => html`<option key=${c}>${c}</option>`)}</select></label>
            <label className="field"><span>세부 품목 (선택)</span>
              <input placeholder="예: 아동용 외투" value=${f.label} onChange=${(e) => set('label', e.target.value)} /></label>
            <label className="field"><span>사이즈·규격</span>
              <input value=${f.size} onChange=${(e) => set('size', e.target.value)} /></label>
            <label className="field"><span>필요 수량</span>
              <input type="number" min="1" max="50" value=${f.qty} onChange=${(e) => set('qty', Math.max(1, +e.target.value || 1))} /></label>
          </div>
          <label className="field"><span>필요 시점</span>
            <select value=${f.timing} onChange=${(e) => set('timing', e.target.value)}>${DATA.timings.map((t) => html`<option key=${t}>${t}</option>`)}</select></label>
          <fieldset className="field">
            <span>허용 품질 등급</span>
            <div className="chip-row">
              ${['S', 'A'].map((g) => html`
                <button type="button" key=${g} className=${'chip' + (f.grades.includes(g) ? ' is-on' : '')} aria-pressed=${f.grades.includes(g)} onClick=${() => toggleGrade(g)}>
                  ${DATA.GRADES[g].label} · ${DATA.GRADES[g].desc}</button>`)}
            </div>
          </fieldset>
          <label className="field"><span>배송 가능 지역</span>
            <select value=${f.region} onChange=${(e) => set('region', e.target.value)}>${DATA.regions.map((r) => html`<option key=${r}>${r}</option>`)}</select></label>
          <button type="submit" className="btn btn--primary btn--block" disabled=${!f.grades.length}>수요 등록</button>
          ${!f.grades.length ? html`<p className="hint">허용 품질 등급을 하나 이상 선택하세요.</p>` : null}
        </form>

        <div>
          <div className="mall-bar">
            <div className="mall-who">
              <span className="avatar" aria-hidden="true">기관</span>
              <div>
                <b>마포 ○○지역아동센터 <span className="sample-label">예시 기관</span></b>
                <small>인증 기관 담당자 데모 로그인 · 실제 기관 인증 기능은 미구현</small>
              </div>
            </div>
          </div>
          <h4 className="list-title">우리 기관 수요 현황</h4>
          <ul className="need-list">
            ${mine.map((d) => html`
              <li key=${d.id} className=${'need-item' + (d.fresh ? ' is-fresh' : '') + (d.status !== 'open' ? ' is-closed' : '')}>
                <div className="need-top">
                  <div><b>${d.label}</b> <span className="sample-label">예시</span>
                    <p className="item-meta">${d.size} · ${d.qty}개 · ${d.timing} · ${d.region}</p></div>
                  <${DemandStatus} d=${d} />
                </div>
                <${Grades} list=${d.grades} />
                <${Progress} d=${d} />
                ${d.status === 'open' ? html`
                  <div className="need-actions">
                    <button className="btn btn--sm btn--ghost" onClick=${() => goTab('pick', d.id)}>후보 물품 보기</button>
                    <button className="btn btn--sm btn--ghost" onClick=${() => cancel(d.id)}>수요 취소</button>
                  </div>` : null}
              </li>`)}
          </ul>
        </div>
      </div>`;
  }

  /* ---------- B. 제공자 화면 ---------- */
  const FALLBACK = [
    { id: 'resume', label: '기존 판매 재개' },
    { id: 'keep', label: '일정 기간 제공 신청 유지' },
    { id: 'withdraw', label: '제공 신청 철회' },
  ];

  function ProviderDemo({ state, setState, toast, goTab }) {
    const [pick, setPick] = useState(null);
    const [listingId, setListingId] = useState(null);
    const [agree, setAgree] = useState(false);
    const [fb, setFb] = useState('resume');
    const [browse, setBrowse] = useState(false);
    const open = state.demands.filter((d) => d.status === 'open');
    const closed = state.demands.filter((d) => d.status !== 'open');
    const demand = state.demands.find((d) => d.id === pick);
    const myOffer = state.offers.find((o) => o.mine && o.state !== 'withdrawn');
    const candidates = demand ? DATA.listings.filter((l) => l.category === demand.category && !state.offers.some((o) => o.listingId === l.id && o.state !== 'withdrawn')) : [];
    const listing = DATA.listings.find((l) => l.id === listingId);

    const choose = (id) => { setPick(id); setListingId(null); setAgree(false); };
    const submit = () => {
      const o = { id: 'p' + Date.now(), demandId: demand.id, listingId: listing.id, mine: true, name: listing.name, size: listing.size, qty: 1,
        grade: listing.grade, ai: listing.ai, icon: listing.icon, tint: listing.tint, note: listing.report[2][3], state: 'offered', fallback: fb };
      setState((s) => ({ ...s, offers: [o, ...s.offers] }));
      setPick(null); setListingId(null); setAgree(false); setBrowse(false);
      scrollToId('demo-tabs');
      toast('물품 제공 신청이 접수되었습니다. 아직 제공 확정은 아닙니다.');
    };
    const withdraw = () => {
      setState((s) => ({ ...s, offers: s.offers.map((o) => o.id === myOffer.id ? { ...o, state: 'withdrawn' } : o) }));
      toast('제공 신청을 철회했습니다. (데모)');
    };

    const stepIdx = myOffer ? { offered: 2, selected: 3, confirmed: 4, shipped: 5, received: 6 }[myOffer.state] : 0;
    const steps = ['제공 신청 완료 (확정 아님)', 'AI 1차 검수', '기관 선택 대기', '무상 양도 최종 동의', '인계·택배 발송', '기관 수령 확인'];

    if (myOffer && !browse) {
      const d = state.demands.find((x) => x.id === myOffer.demandId);
      return html`
        <div className="demo-split">
          <div className="phone">
            <div className="phone-bar"><span>물품 제공 › 내 신청</span><${Tag} kind="new">신규 기능 목업</${Tag}></div>
            <div className="phone-body">
              <div className="seller-item">
                <${ItemArt} icon=${myOffer.icon} tint=${myOffer.tint} size="md" />
                <div><span className="sample-label">예시 물품</span><h4>${myOffer.name}</h4>
                  <p className="muted">연결 수요: ${d.label} · ${d.instType} · ${d.region}</p></div>
              </div>
              <span className="status-pill status-pill--apply">${myOffer.state === 'received' ? '전달 완료' : myOffer.state === 'offered' ? '제공 신청 완료 · 확정 아님' : '진행 중'}</span>
              <ol className="tracker">
                ${steps.map((t, i) => html`<li key=${t} className=${(i < stepIdx ? 'is-done ' : '') + (i === stepIdx ? 'is-now' : '')}><i></i><div><b>${t}</b></div></li>`)}
              </ol>
              <div className="applied-actions">
                <button className="btn btn--dark btn--block" onClick=${() => goTab('ai')}>AI 1차 검수 결과 보기</button>
                <button className="btn btn--ghost btn--block" onClick=${() => goTab('pick', d.id)}>기관 선택 화면으로</button>
                ${myOffer.state === 'offered' ? html`<button className="btn btn--ghost btn--block" onClick=${withdraw}>제공 신청 철회 (현 단계에서 가능)</button>` : null}
                <button className="btn btn--ghost btn--block" onClick=${() => setBrowse(true)}>모집 중인 수요 더 보기</button>
              </div>
            </div>
          </div>
          <${ProviderNotes} />
        </div>`;
    }

    return html`
      <div className="demo-split demo-split--provider">
        <div>
          <h4 className="list-title">지금 모집 중인 수요 <span className="sample-label">예시</span></h4>
          <p className="muted small">기관의 수요가 등록된 품목만 모집합니다. 수요가 충족되면 모집이 종료됩니다.</p>
          ${myOffer ? html`<button className="btn btn--sm btn--ghost back-offer" onClick=${() => setBrowse(false)}>내 제공 신청 진행 상황 보기</button>` : null}
          <ul className="demand-cards">
            ${open.map((d) => html`
              <li key=${d.id} className=${'demand-card' + (pick === d.id ? ' is-on' : '')}>
                <div className="need-top"><b>${d.label}</b><${DemandStatus} d=${d} /></div>
                <p className="item-meta">${d.size} · 필요 ${d.qty - d.matched}개 남음 · ${d.timing}</p>
                <p className="item-meta">${d.instType} · ${d.region}</p>
                <${Grades} list=${d.grades} />
                <button className=${'btn btn--sm ' + (pick === d.id ? 'btn--dark' : 'btn--primary')} onClick=${() => choose(d.id)}>제공 가능 물품 등록</button>
              </li>`)}
            ${closed.map((d) => html`
              <li key=${d.id} className="demand-card is-closed">
                <div className="need-top"><b>${d.label}</b><${DemandStatus} d=${d} /></div>
                <p className="item-meta">${d.size} · ${d.instType} · ${d.region}</p>
                <button className="btn btn--sm btn--ghost" disabled>모집 종료</button>
              </li>`)}
          </ul>
        </div>

        <div className="phone">
          <div className="phone-bar"><span>물품 제공 신청</span><${Tag} kind="new">신규 기능 목업</${Tag}></div>
          <div className="phone-body">
            ${!demand ? html`<p className="phone-empty">왼쪽에서 모집 중인 수요를 고르면, 그 수요에 맞는 내 판매글만 불러옵니다. 수요가 없는 물품은 등록하지 않습니다.</p>` : html`
              <div className="picked-demand">
                <span className="mini-title">선택한 수요</span>
                <b>${demand.label} · ${demand.size}</b>
                <${Grades} list=${demand.grades} />
              </div>
              <div>
                <p className="mini-title">내 미판매 판매글에서 선택</p>
                ${candidates.length ? html`
                  <div className="listing-pick">
                    ${candidates.map((l) => html`
                      <label key=${l.id} className=${'radio-card' + (listingId === l.id ? ' is-on' : '')}>
                        <input type="radio" name="lst" checked=${listingId === l.id} onChange=${() => setListingId(l.id)} />
                        <${ItemArt} icon=${l.icon} tint=${l.tint} size="sm" />
                        <span><b>${l.name}</b><small>${l.size} · ${l.condition} · 등록 ${l.listedDays}일째</small></span>
                      </label>`)}
                  </div>` : html`<p className="phone-empty">이 수요에 맞는 판매글이 없습니다. 수요와 맞지 않는 물품은 등록하지 않습니다.</p>`}
              </div>
              ${listing ? html`
                <div className="sale-info">
                  <div><span>기존 판매 희망가</span><b>${won(listing.price)}</b></div>
                  <p>판매 희망가는 기부금액이나 기부 실적으로 계산하지 않습니다.</p>
                </div>
                <label className="field"><span>제공이 성사되지 않으면</span>
                  <select value=${fb} onChange=${(e) => setFb(e.target.value)}>${FALLBACK.map((x) => html`<option key=${x.id} value=${x.id}>${x.label}</option>`)}</select></label>
                <div className="notice notice--warn">
                  <b>물품 제공 신청은 기부 확정을 의미하지 않습니다.</b>
                  <p>기관의 실제 수요, 물품 상태 및 품질 기준을 확인한 후 제공이 확정됩니다. 물품은 무상으로 양도되며, 배송은 별도 후원 재원과 협의된 물류 방식에 따라 진행됩니다.</p>
                </div>
                <label className="agree">
                  <input type="checkbox" checked=${agree} onChange=${(e) => setAgree(e.target.checked)} />
                  <span>위 내용을 확인했으며, 제공 확정 시 이 물품을 무상으로 양도할 의사가 있습니다.</span>
                </label>
                <button className="btn btn--primary btn--block" disabled=${!agree} onClick=${submit}>물품 제공 신청</button>
              ` : null}
            `}
          </div>
        </div>
      </div>`;
  }

  function ProviderNotes() {
    return html`
      <aside className="demo-notes">
        <h4>이 화면에서 확인할 점</h4>
        <ul className="note-list">
          <li><b>수요가 먼저.</b> 제공자는 모집 중인 수요에 맞는 물품만 등록합니다.</li>
          <li><b>신청 ≠ 확정.</b> 무상 양도 의사 등록 후에도 기관 선택과 최종 동의 전까지는 제공 완료가 아닙니다.</li>
          <li><b>기부금이 아닌 물품 무상 양도.</b> 기부금 납부나 영수증 발급을 전제로 하지 않습니다.</li>
          <li><b>택배비는 제공자 부담이 아님.</b> 별도 후원 재원으로 배송하는 구조를 제안합니다 (재원은 협의 필요).</li>
        </ul>
        <${DemoNote}>모든 상태 변화는 브라우저 안에서만 일어나며 실제 데이터는 저장·전송되지 않습니다.</${DemoNote}>
      </aside>`;
  }

  /* ---------- C. AI 검수 ---------- */
  function AiDemo({ state, goTab }) {
    const mine = state.offers.find((o) => o.mine && o.state !== 'withdrawn');
    const listing = DATA.listings.find((l) => l.id === (mine ? mine.listingId : 'L1'));
    const demand = mine ? state.demands.find((d) => d.id === mine.demandId) : state.demands.find((d) => d.id === 'd3');
    const rows = listing.report;
    const [shown, setShown] = useState(0);
    useEffect(() => { setShown(0); }, [listing.id]);
    useEffect(() => {
      if (shown >= rows.length) return;
      const t = setTimeout(() => setShown((n) => n + 1), 380);
      return () => clearTimeout(t);
    }, [shown]);
    const done = shown >= rows.length;
    const gradeOk = demand.grades.includes(listing.grade);

    return html`
      <div>
        <div className="mock-banner">
          <b>목업 데이터 기반 데모</b> — 실제 AI 이미지 분석 API가 연결되지 않은 프로토타입입니다. 아래 결과와 잠정 등급은 미리 작성한 예시 값이며, AI가 실제로 분석한 결과가 아닙니다.
        </div>
        <div className="demo-split demo-split--ai">
          <div className="ai-photo">
            <div className="ai-photo-frame">
              <${ItemArt} icon=${listing.icon} tint=${listing.tint} size="xl" label=${'예시 물품: ' + listing.name} />
              ${listing.box ? html`<span className="ai-box" style=${listing.box}><em>${listing.boxLabel}</em></span>` : null}
            </div>
            <div className="ai-photo-meta">
              <span className="sample-label">예시 물품</span>
              <b>${listing.name}</b>
              <small>${mine ? '내 제공 신청 물품' : '제공자 화면에서 신청하면 해당 물품의 결과가 표시됩니다'}</small>
            </div>
          </div>

          <div className="ai-report">
            <div className="ai-report-head">
              <h4>1차 검수 결과</h4>
              <button className="btn btn--sm btn--ghost" onClick=${() => setShown(0)} disabled=${!done}>검수 과정 다시 보기</button>
            </div>
            <dl className="report">
              ${rows.map((r, i) => html`
                <div key=${r[0]} className=${'report-row report-row--' + r[2] + (i < shown ? ' is-in' : '')}>
                  <dt>${r[0]}</dt>
                  <dd><b>${i < shown ? r[1] : '확인 중…'}</b><small>${i < shown ? r[3] : ''}</small></dd>
                </div>`)}
            </dl>
            ${done ? html`
              <div className=${'grade-check' + (gradeOk ? ' is-ok' : ' is-no')}>
                <span>연결 수요 <b>${demand.label}</b> · 허용 ${demand.grades.map((g) => DATA.GRADES[g].label).join('·')}</span>
                <b>${gradeOk ? '잠정 ' + DATA.GRADES[listing.grade].label + ' — 수요 품질 기준과 일치' : '품질 기준 불일치 — 매칭하지 않음'}</b>
              </div>` : null}

            <div className="status-legend">
              <p className="mini-title">AI 1차 분류 4단계</p>
              <ul>
                ${Object.entries(DATA.AI_STATUS).map(([k, v]) => html`
                  <li key=${k} className=${k === listing.ai && done ? 'is-current' : ''}>
                    <${AiBadge} status=${k} small=${true} /><span>${v.desc}</span>
                  </li>`)}
              </ul>
            </div>
          </div>
        </div>

        <div className="ai-limits">
          <div>
            <h4>AI는 최종 품질을 보증하지 않습니다</h4>
            <p>AI는 사진과 등록 정보로 잠정 등급을 추천하고, 사람이 봐야 할 물품을 골라냅니다. 아래 항목은 사진으로 확인할 수 없어 AI가 판단한 것으로 표현하지 않으며, 필요시 사람이 실제 상태를 확인합니다.</p>
          </div>
          <ul className="chips">${DATA.notVisible.map((n) => html`<li key=${n}>${n}</li>`)}</ul>
        </div>
        <div className="demo-next">
          <button className="btn btn--dark" onClick=${() => goTab('pick', demand.id)}>기관 선택·제공 확정으로</button>
        </div>
      </div>`;
  }

  /* ---------- D. 기관 선택 · 제공 확정 ---------- */
  function PickDemo({ state, setState, toast, focus, setFocus }) {
    const all = state.demands.filter((d) => d.status !== 'cancel');
    const d = state.demands.find((x) => x.id === focus) || all[0];
    const list = state.offers.filter((o) => o.demandId === d.id && o.state !== 'withdrawn');
    const excluded = list.filter((o) => o.ai === 'unfit' || !d.grades.includes(o.grade));
    const usable = list.filter((o) => !excluded.includes(o));

    const update = (id, st, msg) => {
      setState((s) => {
        const n = clone(s);
        const o = n.offers.find((x) => x.id === id);
        o.state = st;
        if (st === 'confirmed') {
          const dd = n.demands.find((x) => x.id === o.demandId);
          dd.matched = Math.min(dd.qty, dd.matched + o.qty);
          if (dd.matched >= dd.qty) { dd.status = 'done'; msg = '수요가 충족되어 모집이 종료되었습니다. (모집 완료)'; }
        }
        setTimeout(() => toast(msg), 0);
        return n;
      });
    };

    const action = (o) => {
      if (d.status === 'done' && ['offered', 'selected'].includes(o.state)) return html`<span className="muted small">모집 완료 · 추가 매칭 없음</span>`;
      if (o.state === 'offered' && o.ai === 'photo') return html`<span className="muted small">추가 사진 확인 후 선택 가능</span>`;
      switch (o.state) {
        case 'offered': return html`<button className="btn btn--sm btn--primary" onClick=${() => update(o.id, 'selected', '물품을 선택했습니다. 제공자의 최종 동의를 기다립니다.')}>이 물품 선택</button>`;
        case 'selected': return html`<div className="act-col"><span className="muted small">제공자 최종 동의 대기</span><button className="btn btn--sm btn--dark" onClick=${() => update(o.id, 'confirmed', '제공자가 무상 양도에 동의해 제공이 확정되었습니다. (데모)')}>제공자 동의 처리 (데모)</button></div>`;
        case 'confirmed': return html`<div className="act-col"><span className="muted small">제공 확정 · 발송 대기</span><button className="btn btn--sm btn--dark" onClick=${() => update(o.id, 'shipped', '택배 발송 처리했습니다. 실제 택배 연동은 구현되지 않았습니다. (데모)')}>택배 발송 (데모)</button></div>`;
        case 'shipped': return html`<div className="act-col"><span className="muted small">배송 중 · 택배비 후원 재원</span><button className="btn btn--sm btn--primary" onClick=${() => update(o.id, 'received', '기관 수령을 확인했습니다. 전달 완료로 기록됩니다. (데모)')}>수령 확인</button></div>`;
        case 'received': return html`<span className="st st--done">전달 완료 · 기록됨</span>`;
        default: return null;
      }
    };

    return html`
      <div>
        <div className="pick-head">
          <label className="field field--inline"><span>수요 선택</span>
            <select value=${d.id} onChange=${(e) => setFocus(e.target.value)}>
              ${all.map((x) => html`<option key=${x.id} value=${x.id}>${x.label} · ${x.instType} (${x.status === 'done' ? '모집 완료' : '모집 중'})</option>`)}
            </select></label>
          <span className="muted small">데모에서는 여러 예시 기관의 수요를 전환해 볼 수 있습니다.</span>
        </div>

        <div className="pick-summary">
          <div>
            <div className="need-top"><b>${d.label} · ${d.size}</b><${DemandStatus} d=${d} /></div>
            <p className="item-meta">${d.instType} · ${d.region} · ${d.timing} <span className="sample-label">예시</span></p>
            <${Grades} list=${d.grades} />
          </div>
          <${Progress} d=${d} />
        </div>

        ${usable.length ? html`
          <ul className="pick-list">
            ${usable.map((o) => html`
              <li key=${o.id} className=${'pick-item' + (o.mine ? ' is-mine' : '')}>
                <${ItemArt} icon=${o.icon} tint=${o.tint} size="sm" />
                <div className="match-body">
                  <div className="match-title"><b>${o.name}</b>${o.mine ? html`<span className="score">내 제공 신청</span>` : html`<span className="sample-label">예시</span>`}</div>
                  <p className="item-meta">${o.size} · ${o.qty}개</p>
                  <div className="reasons"><${GradeBadge} grade=${o.grade} /><${AiBadge} status=${o.ai} small=${true} /></div>
                  <p className="item-check">${o.note}</p>
                </div>
                <div className="pick-act">${action(o)}</div>
              </li>`)}
          </ul>` : html`<p className="empty">아직 이 수요에 맞는 후보 물품이 없습니다. 제공자 화면에서 신청해 보세요.</p>`}

        ${excluded.length ? html`
          <div className="excluded">
            <p className="mini-title">품질 기준 불일치로 매칭하지 않는 물품 ${excluded.length}건</p>
            <ul>${excluded.map((o) => html`<li key=${o.id}><${GradeBadge} grade=${o.grade} /> ${o.name} — ${o.ai === 'unfit' ? '기준 미달 가능성' : '수요가 ' + d.grades.map((g) => DATA.GRADES[g].label).join('·') + '만 허용'}</li>`)}</ul>
          </div>` : null}

        <div className="privacy-box pick-privacy">
          <p className="mini-title">정보 공개 범위 (안)</p>
          <p>제공자에게는 <b>기관 유형과 시·군·구</b>만 공개됩니다. 기관이 돌보는 아동·가정의 이름, 얼굴, 주소 등은 제공자에게 노출되지 않으며, 배송에 필요한 기관 주소는 배송 처리 단계에서만 사용합니다.</p>
        </div>
      </div>`;
  }

  /* ---------- 데모 컨테이너 ---------- */
  const TABS = [
    { id: 'need', l: 'A', t: '기관 수요 등록', d: '필요한 것부터 등록' },
    { id: 'provider', l: 'B', t: '제공자 화면', d: '수요에 맞춰 제공 신청' },
    { id: 'ai', l: 'C', t: 'AI 1차 검수', d: '잠정 등급·품질 확인' },
    { id: 'pick', l: 'D', t: '기관 선택·제공 확정', d: '선택 → 동의 → 전달' },
  ];

  function Demo({ toast }) {
    const [tab, setTab] = useState('need');
    const [focus, setFocus] = useState('d1');
    const [state, setState] = useState({ demands: clone(DATA.demands), offers: clone(DATA.offers) });
    const goTab = (id, demandId) => { if (demandId) setFocus(demandId); setTab(id); scrollToId('demo-tabs'); };
    const props = { state, setState, goTab, toast };

    return html`
      <section className="section section--ivory" id="demo">
        <div className="container">
          <${SectionHead} num="06" eyebrow="SERVICE DEMO · 서비스 화면 목업"
            title=${html`수요에서 출발해<br />전달로 끝나는 네 개의 화면.`}
            lead="기관의 수요 등록부터 제공자의 신청, AI 1차 검수, 기관 선택과 제공 확정, 배송·수령까지 직접 눌러 볼 수 있습니다. 화면 사이의 상태는 이어지며, 수요가 충족되면 모집이 자동으로 종료됩니다." />

          <div className="demo-tabs reveal" id="demo-tabs" role="tablist">
            ${TABS.map((t) => html`
              <button key=${t.id} role="tab" aria-selected=${tab === t.id} className=${'demo-tab' + (tab === t.id ? ' is-active' : '')} onClick=${() => setTab(t.id)}>
                <span className="demo-tab-l">${t.l}</span>
                <span className="demo-tab-t">${t.t}<small>${t.d}</small></span>
              </button>`)}
          </div>

          <div className="demo-stage" role="tabpanel">
            ${tab === 'need' ? html`<${NeedDemo} ...${props} />` : null}
            ${tab === 'provider' ? html`<${ProviderDemo} ...${props} />` : null}
            ${tab === 'ai' ? html`<${AiDemo} ...${props} />` : null}
            ${tab === 'pick' ? html`<${PickDemo} ...${props} focus=${focus} setFocus=${setFocus} />` : null}
          </div>

          <p className="demo-foot">본 섹션의 모든 화면과 데이터는 예시입니다. 데이터 저장, 기관 인증, AI 분석, 택배 연동 기능은 구현되어 있지 않습니다.</p>
        </div>
      </section>`;
  }

  window.SECTIONS = Object.assign(window.SECTIONS || {}, { Demo });
})();
