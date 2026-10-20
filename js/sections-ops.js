/* TRUST · VALUE · OPERATION · SHIPPING · PILOT · CLOSING · FOOTER */
(function () {
  const { useState } = React;
  const { html, Tag, SectionHead, Modal, DemoNote } = UI;

  /* ---------- TRUST ---------- */
  const TRUST_STEPS = [
    { n: 'STEP 1', t: '물품 제공 신청', owner: '제공자', state: '확정 아님', pts: ['모집 중인 수요에 맞춰 무상 양도 의사를 등록한 상태', '아직 제공이 확정되지 않음', '물품 소유권은 제공자에게 있음'] },
    { n: 'STEP 2', t: '기관 선택 및 품질 확인', owner: '제공자', state: '성사 여부 확인 중', pts: ['기관 담당자가 필요한 물품을 선택', '품질 기준과 수요 일치 여부를 확인', '선택이 없거나 기준에 맞지 않으면 성사되지 않을 수 있음'] },
    { n: 'STEP 3', t: '제공 확정 및 전달', owner: '제공자 → 기관', state: '제공 확정', pts: ['제공자가 무상 양도에 최종 동의', '사전에 정한 방식에 따라 물품 인계', '택배 배송 및 기관 수령 확인'] },
  ];

  const FB = [
    { id: 'resume', t: '기존 판매 재개', r: '기부 미성사 확정 시 판매글이 자동으로 ‘판매 중’으로 돌아갑니다. 판매자가 따로 다시 올릴 필요가 없습니다.' },
    { id: 'keep', t: '일정 기간 제공 신청 유지', r: '정해진 기간(예: 30일, 협의) 동안 기관 신청을 계속 기다립니다. 기간이 끝나면 판매자에게 다시 선택을 요청합니다.' },
    { id: 'withdraw', t: '제공 신청 철회', r: '제공 신청을 종료합니다. 판매글은 숨김 상태가 되며 판매자가 원할 때 다시 공개할 수 있습니다.' },
  ];

  const CANCEL = [
    ['제공 신청 ~ 기관 선택 전', '가능', '언제든 철회. 미성사 처리 방식도 변경 가능'],
    ['기관 선택 후 ~ 제공자 최종 동의 전', '가능', '기관에 미성사 알림. 반복 철회 시 참여 제한 등 기준 검토'],
    ['최종 동의 후 ~ 인계 전', '제한적', '일정·사유 기준을 운영 정책으로 정의 (협의 필요)'],
    ['인계·소유권 이전 완료 후', '원칙적 불가', '철회·반환 제한. 예외 처리 기준은 별도 정의'],
  ];

  function Trust() {
    const [fb, setFb] = useState('resume');
    const cur = FB.find((f) => f.id === fb);
    return html`
      <section className="section section--dark" id="trust">
        <div className="container">
          <${SectionHead} num="09" eyebrow="TRUST · 운영 원칙"
            title=${html`물품 제공 신청과 제공 확정은<br />다릅니다.`}
            lead="제공을 신청한 모든 물품이 전달되는 것은 아닙니다. 기관의 선택, 물품 상태, 품질 기준, 배송 가능 여부에 따라 성사되지 않을 수 있습니다. 이 가능성을 제공자에게 처음부터 명확하게 안내합니다." />

          <ol className="trust-steps reveal">
            ${TRUST_STEPS.map((s, i) => html`
              <li key=${s.n} className=${'trust-step' + (i === 2 ? ' is-final' : '')}>
                <div className="trust-step-head">
                  <span className="trust-n">${s.n}</span>
                  <span className=${'trust-state' + (i === 2 ? ' is-confirmed' : '')}>${s.state}</span>
                </div>
                <h3>${s.t}</h3>
                <ul>${s.pts.map((p) => html`<li key=${p}>${p}</li>`)}</ul>
                <p className="trust-owner">소유권 <b>${s.owner}</b></p>
              </li>`)}
          </ol>

          <div className="trust-grid reveal">
            <div className="trust-panel">
              <h4>제공이 성사되지 않으면</h4>
              <p className="muted-inv">처리 방식은 최초 신청 시 판매자가 직접 고릅니다.</p>
              <div className="seg" role="radiogroup" aria-label="미성사 처리 방식">
                ${FB.map((f) => html`
                  <button key=${f.id} role="radio" aria-checked=${fb === f.id} className=${'seg-btn' + (fb === f.id ? ' is-on' : '')} onClick=${() => setFb(f.id)}>${f.t}</button>`)}
              </div>
              <p className="seg-result" key=${fb}>${cur.r}</p>
            </div>

            <div className="trust-panel">
              <h4>단계별 취소 가능 시점 <${Tag} kind="tbd">운영 정책 정의 필요</${Tag}></h4>
              <div className="table-wrap">
                <table className="cancel-table">
                  <thead><tr><th>시점</th><th>판매자 철회</th><th>비고 (안)</th></tr></thead>
                  <tbody>
                    ${CANCEL.map((r) => html`<tr key=${r[0]}><td>${r[0]}</td><td><span className=${'cx cx--' + (r[1] === '가능' ? 'ok' : r[1] === '제한적' ? 'mid' : 'no')}>${r[1]}</span></td><td>${r[2]}</td></tr>`)}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="privacy-rules reveal">
            <h4>개인정보·아동 보호 원칙 (안)</h4>
            <ul>
              <li><b>기관 단위 가입·인증</b><span>개인이 아닌 기관이 가입하고, 월드비전이 인증한 담당자만 물품관에 접근합니다.</span></li>
              <li><b>수혜자 정보 미수집</b><span>아동·위탁가정의 이름, 얼굴, 주소 등은 물품관과 수요 등록에 입력하지 않습니다.</span></li>
              <li><b>판매자 공개 범위 제한</b><span>판매자에게는 기관 유형과 시·군·구 수준의 지역만 공개합니다.</span></li>
              <li><b>인계 정보 분리</b><span>배송에 필요한 기관 주소는 배송 처리 단계에서만 사용하고 판매자 화면에 노출하지 않습니다.</span></li>
            </ul>
          </div>
        </div>
      </section>`;
  }

  /* ---------- VALUE ---------- */
  const VALUES = [
    { who: '당근', kind: 'existing', items: [
      '지역 기반 연결 역량을 사회적 가치로 확장',
      '미판매 물품에 판매 외 활용 경로 제공',
      '전달 완료 데이터로 확인되는 사회공헌 성과',
      '배송 지원·신규 기능 검토를 통한 참여 장벽 완화',
    ], note: '배송 지원은 확정 사항이 아닌 협의 제안입니다.', more: 'why-daangn' },
    { who: '월드비전', kind: 'wv', items: [
      '기존 기관 네트워크를 활용한 새로운 물품 지원 방식 발굴',
      '기관별 필요에 기반한 수요 중심 지원 체계 구축',
      '물품 기부를 실제 전달과 연결해 사업 성과를 확인할 수 있는 구조 마련',
      '당근과의 협업을 통한 지역사회 자원순환 및 기업 사회공헌 모델 개발',
      '파일럿 운영 데이터를 기반으로 다른 품목·지역으로의 확장 가능성 검토',
    ], lead: '기부 물품을 더 많이 확보하는 것이 아니라, 기관의 필요와 물품을 연결하는 새로운 지원 모델을 검증합니다.' },
    { who: '협력기관', kind: 'inst', items: [
      '필요한 물품을 직접 선택',
      '기관의 수요에 맞는 물품 신청',
      '무분별한 기부 물품 수령 부담 완화',
      '물품 수령 및 활용 내역 관리',
    ] },
  ];

  function Value() {
    return html`
      <section className="section" id="value">
        <div className="container">
          <${SectionHead} num="10" eyebrow="VALUE · 파트너별 가치"
            title=${html`세 주체가 각자<br />얻는 것이 분명한 구조.`} />
          <div className="value-grid">
            ${VALUES.map((v, i) => html`
              <article className=${'value-card value-card--' + v.kind + ' reveal'} key=${v.who} style=${{ transitionDelay: i * 80 + 'ms' }}>
                <h3>${v.who}</h3>
                ${v.lead ? html`<p className="value-lead">${v.lead}</p>` : null}
                <ul>${v.items.map((t) => html`<li key=${t}>${t}</li>`)}</ul>
                ${v.note ? html`<p className="value-note"><${Tag} kind="tbd" /> ${v.note}</p>` : null}
                ${v.more ? html`<button className="value-more" onClick=${() => UI.scrollToId(v.more)}>당근이 얻는 가치 자세히 보기</button>` : null}
              </article>`)}
          </div>
        </div>
      </section>`;
  }

  /* ---------- OPERATION ---------- */
  const ROLES = [
    { who: '당근', kind: 'existing', pos: 'tl', items: ['물품 제공 기능 (신규 개발)', '수요에 맞는 판매자 안내', '당근 택배 연동 가능성 검토'] },
    { who: '월드비전', kind: 'wv', pos: 'tr', items: ['기관 모집 및 인증', '수요 검토·관리', '품질 기준 수립', '실제 전달 확인'] },
    { who: '협력기관', kind: 'inst', pos: 'br', items: ['수요 먼저 등록', '물품 선택', '수령 및 상태 확인'] },
    { who: 'AI 시스템', kind: 'new', pos: 'bl', items: ['물품 분류', '정보 누락 탐지', '잠정 품질 등급 추천', '수요 매칭 추천'] },
  ];

  function Operation() {
    const [model, setModel] = useState('A');
    return html`
      <section className="section section--ivory" id="operation">
        <div className="container">
          <${SectionHead} num="11" eyebrow="OPERATION · 운영 모델"
            title=${html`누가 무엇을 맡는지,<br />어떤 경로로 전달하는지.`} />

          <div className="roles reveal">
            ${ROLES.map((r) => html`
              <div key=${r.who} className=${'role role--' + r.kind + ' role--' + r.pos}>
                <h4>${r.who}</h4>
                <ul>${r.items.map((t) => html`<li key=${t}>${t}</li>`)}</ul>
              </div>`)}
            <div className="role-core">
              <span>물품</span>
              <b>수요 → 모집 → 검수 → 확정 → 전달</b>
              <span>데이터</span>
            </div>
            <div className="role role--opt role--bottom">
              <h4>물류·검수 파트너 <${Tag} kind="tbd">필요시</${Tag}></h4>
              <p>수거 · 실물 확인 · 배송 처리</p>
            </div>
          </div>

          <div className="models reveal">
            <div className="models-head">
              <h3>전달 방식 비교</h3>
              <div className="seg seg--light" role="tablist">
                <button role="tab" aria-selected=${model === 'A'} className=${'seg-btn' + (model === 'A' ? ' is-on' : '')} onClick=${() => setModel('A')}>모델 A · 기관 직배송</button>
                <button role="tab" aria-selected=${model === 'B'} className=${'seg-btn' + (model === 'B' ? ' is-on' : '')} onClick=${() => setModel('B')}>모델 B · 중간 검수 거점</button>
              </div>
            </div>

            <div className="route">
              ${(model === 'A'
                ? [['판매자', ''], ['AI 1차 검수', 'ai'], ['배송', ''], ['협력기관 수령 확인', 'end']]
                : [['판매자', ''], ['AI 1차 검수', 'ai'], ['수거', ''], ['검수 거점 실물 확인', 'hub'], ['배송', ''], ['협력기관 수령 확인', 'end']]
              ).map(([t, k], i, arr) => html`
                <${React.Fragment} key=${model + i}>
                  <span className=${'route-node' + (k ? ' route-node--' + k : '')}>${t}</span>
                  ${i < arr.length - 1 ? html`<span className="route-arrow" aria-hidden="true"></span>` : null}
                <//>`)}
            </div>

            <div className="models-grid">
              <div className=${'model-card' + (model === 'A' ? ' is-on' : '')}>
                <h4>모델 A. 기관 직배송</h4>
                <ul className="pc">
                  <li className="pro">AI 1차 검수 후 기관으로 바로 배송</li>
                  <li className="pro">비용과 시간이 적게 들 수 있음</li>
                  <li className="con">물품 상태 확인에 한계가 있을 수 있음</li>
                </ul>
                <p className="fit">적합 품목 예: 미개봉 학용품, 1차 검수 통과한 의류</p>
              </div>
              <div className=${'model-card' + (model === 'B' ? ' is-on' : '')}>
                <h4>모델 B. 중간 검수 거점 경유</h4>
                <ul className="pc">
                  <li className="pro">거점에서 실물 확인 후 기관으로 전달</li>
                  <li className="pro">품질 관리 수준을 높일 수 있음</li>
                  <li className="con">추가 물류비와 운영 인력이 필요함</li>
                </ul>
                <p className="fit">적합 품목 예: 사람의 확인이 필요한 의류·가방, 외투류</p>
              </div>
            </div>
            <p className="models-foot">파일럿에서는 품목과 위험도에 따라 두 방식을 함께 운영해 비용과 품질 차이를 비교할 것을 제안합니다.</p>
          </div>
        </div>
      </section>`;
  }

  /* ---------- COST: 무상 양도 · 택배비 후원 ---------- */
  const FUNDS = [
    { t: '당근 택배 연계·배송비 지원', d: '당근의 기존 택배 서비스 연계와 배송비 지원 협의', k: '협의 제안' },
    { t: '기업 파트너 택배비 후원', d: '물류·유통 등 기업 파트너의 배송비 후원', k: '검토' },
    { t: '사회공헌 사업 예산', d: '별도 사업 예산 내 택배비 항목 편성', k: '검토' },
    { t: '물류 파트너 협력', d: '물류 기업과의 배송 협력', k: '검토' },
  ];
  const DG_DELIVERY = [
    '물품 제공 건의 택배 신청 절차 간소화',
    '배송비 지원 또는 후원 재원 연계',
    '배송 상태 확인 및 수령 완료 데이터 연동 가능성',
    '기부 물품에 적합한 별도 운영 절차 마련',
  ];
  const TERMS = ['물품 제공 신청', '무상 양도 의사 등록', '제공 확정', '물품 인계', '배송 완료'];

  function Shipping() {
    return html`
      <section className="section" id="shipping">
        <div className="container">
          <${SectionHead} num="12" eyebrow="COST · 무상 양도와 택배비 후원"
            title=${html`물품은 무상으로 연결하고,<br />전달에 필요한 비용은 후원으로 해결합니다.`}
            lead="제공자는 물품을 무상으로 양도하고, 배송비는 별도로 마련한 후원 재원으로 지원하는 구조를 제안합니다. 택배비를 판매자가 부담하지 않도록 물품 가치와 배송비를 분리합니다." />

          <div className="lanes reveal" aria-label="물품과 비용의 흐름">
            <div className="lane">
              <span className="lane-k">물품의 흐름</span>
              <div className="lane-row">
                <div className="lane-node"><b>물품 제공자</b><span>물품 무상 양도</span></div>
                <span className="route-arrow" aria-hidden="true"></span>
                <div className="lane-node lane-node--hub"><b>당근 택배 또는 협의된 물류 파트너</b><span>배송 수행</span></div>
                <span className="route-arrow" aria-hidden="true"></span>
                <div className="lane-node lane-node--end"><b>월드비전 협력기관</b><span>물품 수령 및 확인</span></div>
              </div>
            </div>
            <div className="lane lane--cost">
              <span className="lane-k">비용의 흐름</span>
              <div className="lane-row">
                <div className="lane-node lane-node--fund"><b>택배비 후원자</b><span>배송비 재원 지원</span></div>
                <span className="route-arrow" aria-hidden="true"></span>
                <div className="lane-node lane-node--hub"><b>배송비 지급</b><span>물품 제공자 부담 없음</span></div>
                <span className="lane-gap" aria-hidden="true"></span>
                <div className="lane-node lane-node--ghost"><b>판매 희망가</b><span>기부금액·기부 실적으로 계산하지 않음</span></div>
              </div>
            </div>
          </div>

          <div className="cost-grid reveal">
            <div className="ship-box">
              <div className="ship-box-head"><h3>택배비 후원 재원</h3><${Tag} kind="tbd">확정 아님 · 협의 가능한 선택지</${Tag}></div>
              <ul className="fund-list fund-list--2">
                ${FUNDS.map((f) => html`<li key=${f.t}><b>${f.t}</b><span>${f.d}</span><em>${f.k}</em></li>`)}
              </ul>
            </div>
            <div className="dg-ship">
              <div className="ship-box-head"><h3>당근 택배 서비스 연동 제안</h3><${Tag} kind="tbd">협의 필요</${Tag}></div>
              <p>당근의 기존 택배 서비스를 활용할 수 있다면 신규 물류 체계를 처음부터 구축하는 부담을 줄일 수 있습니다.</p>
              <ol>${DG_DELIVERY.map((t) => html`<li key=${t}>${t}</li>`)}</ol>
              <p className="dg-ship-note">당근 택배가 현재 물품 제공 기능이나 해당 배송비 지원을 제공하고 있다는 의미가 아닙니다. 기술적 연동, 비용 부담 주체, 이용 약관 및 운영 정책은 별도 협의가 필요합니다.</p>
            </div>
          </div>

          <div className="giver reveal">
            <div className="giver-head">
              <p className="mini-title">제공자 참여 방식</p>
              <h3>기부금을 내는 것이 아니라,<br />필요한 물품을 무상으로 연결합니다.</h3>
            </div>
            <ol className="terms">${TERMS.map((t, i) => html`<li key=${t}><span>${i + 1}</span>${t}</li>`)}</ol>
            <div className="giver-grid">
              <div className="giver-cell">
                <b>판매 희망가와 기부 가치 분리</b>
                <p>판매 중인 물품은 기존 거래 정책을 따르고, 제공 확정 후에는 판매 희망가를 기부금액이나 사회공헌 실적으로 간주하지 않습니다. 실적은 실제 전달 수량, 상태, 수혜 연계 완료 건수로 관리합니다.</p>
              </div>
              <div className="giver-cell giver-cell--warn">
                <b>기부금영수증 — 검토가 필요한 쟁점</b>
                <p>물품 제공과 기부금 기부를 법적·회계적으로 같은 개념이라고 단정하지 않습니다. 영수증 발급 여부는 물품 종류, 새 제품·중고 여부, 관련 법령, 월드비전의 회계·세무 검토에 따라 달라질 수 있어, 현재 이 제안에서 발급을 약속하지 않습니다.</p>
              </div>
            </div>
          </div>
        </div>
      </section>`;
  }

  /* ---------- PILOT ---------- */
  const NOT_YET = [
    ['전국 단위 신규 플랫폼 완성', '월드비전의 기존 기관 네트워크 안에서 시작'],
    ['모든 물품 카테고리 운영', '아동 의류·가방 등 기준을 정하기 쉬운 품목부터'],
    ['여러 기관군 동시 운영', '후보군 하나를 골라 검증 후 단계적 확대'],
  ];

  /* 제안 규모는 사업 구상을 위한 잠정치이며, 참여가 확정된 수치가 아닙니다. */
  const OPTIONS = [
    { id: 'A', t: '전국 보육기관 네트워크 중심', scale: '약 50개 기관',
      pts: ['아동 의류·가방 등 기준을 정하기 쉬운 품목부터 운영', '기관별 필요 품목·사이즈·수량을 사전에 확인', '기관 담당자가 전용 물품관에서 필요한 물품을 직접 선택'],
      fit: '기관 수가 적어 수요 확인과 운영 기준 정비에 집중하기 쉬운 대안' },
    { id: 'B', t: '지역아동센터 네트워크 중심', scale: '약 300개 지역아동센터',
      pts: ['기관별 수요를 등록받고 물품을 매칭하는 방식으로 운영', '참여 기관과 품목을 단계적으로 확대', '실제 전달률과 운영 비용을 기준으로 확장 가능성 검토'],
      fit: '수요 등록·매칭 방식의 효율과 확장성을 보기에 적합한 대안' },
  ];

  const STAGES = [
    { t: '준비', when: '파일럿 시작 전', d: '참여 기관 모집, 수요 조사, 물품 검수 기준 수립' },
    { t: '실행', when: '1~4주 (안)', d: '기관 수요 등록, 수요 기반 모집, AI 1차 검수, 기관 선택' },
    { t: '전달', when: '2~6주 (안)', d: '택배비 후원 재원으로 배송, 필요시 실물 확인, 기관 수령 확인' },
    { t: '평가', when: '6주 종료 후', d: '수요 충족률, 제공 확정률, 실제 전달률, 택배·검수 비용, 기관 만족도 분석' },
    { t: '확장 검토', when: '평가 이후', d: '성과와 운영 효율을 바탕으로 참여 기관·지역·품목 확대' },
  ];

  /* 측정 예정 지표 — 실제 파일럿 데이터가 없으므로 값은 비워 둡니다. */
  const METRICS = [
    { t: '등록된 기관 수요 수량', u: '개', f: '기관이 등록한 필요 수량 합계' },
    { t: '물품 제공 신청 수', u: '개', f: '수요별 제공 신청 건수' },
    { t: '최종 제공 확정 물품 수', u: '개', f: '제공자 최종 동의 건수' },
    { t: '기관 전달 완료 건수', u: '건', f: '기관 수령 확인 기준' },
    { t: '품질 기준 충족률', u: '%', f: '기준 충족 ÷ 검수 물품' },
    { t: '수요 충족률', u: '%', f: '충족된 수요 ÷ 등록된 수요' },
    { t: 'AI 1차 검수 통과율', u: '%', f: '1차 통과 ÷ 검수 물품' },
    { t: '물품 1건당 택배·운영 비용', u: '원', f: '총비용 ÷ 전달 건수 (재원별 구분)' },
    { t: '참여 기관 만족도', u: '점', f: '수령 후 기관 설문' },
  ];
  const FUNNEL = ['기관 수요 등록', '물품 제공 신청', '제공 확정', '전달 완료'];

  const GATES = [
    { k: 'go', t: '단계적 확장', c: '사전 합의한 기준을 충족', d: '참여 기관 → 지역 → 품목 순으로 범위를 넓혀 2단계 운영' },
    { k: 'fix', t: '보완 후 재검증', c: '일부 지표가 기준에 못 미침', d: '검수 기준, 전달 방식(모델 A·B), 품목을 조정해 같은 규모로 재운영' },
    { k: 'stop', t: '재설계 또는 중단', c: '전달률·비용이 기준과 크게 차이', d: '구조적 원인을 정리하고 모델 자체를 다시 검토' },
  ];

  function Pilot() {
    const [opt, setOpt] = useState('A');
    const [stage, setStage] = useState(0);
    return html`
      <section className="section section--ivory" id="pilot">
        <div className="container">
          <${SectionHead} num="13" eyebrow="PILOT · 6주 파일럿 제안"
            title=${html`전국 확장보다 먼저,<br />검증 가능한 곳에서 시작합니다.`}
            lead="처음부터 전국 단위의 신규 플랫폼을 완성하거나 모든 물품 카테고리를 운영할 필요는 없습니다. 월드비전의 기존 기관 네트워크를 활용해 제한된 기관과 품목으로 파일럿을 운영하고, 실제 수요와 전달 가능성을 검증한 뒤 단계적으로 확대합니다." />

          <div className="not-yet reveal">
            <div className="not-yet-head"><span>처음부터 하지 않는 것</span><span>대신 이렇게 시작</span></div>
            ${NOT_YET.map(([a, b]) => html`
              <div className="not-yet-row" key=${a}><s>${a}</s><span className="ny-arrow" aria-hidden="true"></span><b>${b}</b></div>`)}
          </div>

          <div className="opt-block reveal">
            <div className="opt-head">
              <h3>초기 파일럿 대상군 — 두 가지 대안</h3>
              <p>두 후보군을 동시에 운영하는 것이 아니라, 하나를 골라 시작하는 것을 제안합니다.</p>
            </div>
            <div className="opt-grid" role="radiogroup" aria-label="파일럿 대상군 대안">
              ${OPTIONS.map((o) => html`
                <button key=${o.id} role="radio" aria-checked=${opt === o.id} className=${'opt-card' + (opt === o.id ? ' is-on' : '')} onClick=${() => setOpt(o.id)}>
                  <span className="opt-top"><span className="opt-id">OPTION ${o.id}</span><span className="opt-pick">${opt === o.id ? '검토 중인 대안' : '이 대안 보기'}</span></span>
                  <span className="opt-title">${o.t}</span>
                  <span className="opt-scale"><b>${o.scale}</b><em>제안 규모 · 잠정</em></span>
                  <span className="opt-pts">${o.pts.map((p) => html`<span key=${p}>${p}</span>`)}</span>
                  <span className="opt-fit">${o.fit}</span>
                </button>`)}
            </div>
            <p className="opt-note">※ 50개·300개는 사업 구상을 위한 잠정 제안 규모입니다. 현재 참여가 확정된 기관 수나 즉시 동원 가능한 것으로 확인된 수치가 아니며, 실제 참여 가능 기관 수와 모집 방식은 월드비전 내부 확인 및 당근과의 협의가 필요합니다.</p>
          </div>

          <dl className="pilot-cond reveal">
            <div><dt>운영 기간</dt><dd>6주 (실행·전달 기준, 안)</dd></div>
            <div><dt>대상 기관</dt><dd>선택한 후보군 중 사전 인증된 기관</dd></div>
            <div><dt>품목</dt><dd>아동 의류·가방 등 기준을 정하기 쉬운 품목부터</dd></div>
            <div><dt>지역</dt><dd>후보군과 배송 여건에 따라 협의</dd></div>
            <div><dt>참여 제공자</dt><dd>모집 중인 수요에 자발적으로 제공을 신청한 판매자</dd></div>
          </dl>

          <div className="timeline reveal">
            <h3 className="sr-title">파일럿 운영 단계</h3>
            <ol className="tl">
              ${STAGES.map((s, i) => html`
                <li key=${s.t} className=${'tl-step' + (i === stage ? ' is-on' : '') + (i < stage ? ' is-past' : '') + (i === 4 ? ' is-next' : '')}>
                  <button onClick=${() => setStage(i)} aria-pressed=${i === stage}>
                    <span className="tl-dot">${i + 1}</span>
                    <span className="tl-when">${s.when}</span>
                    <span className="tl-t">${s.t}</span>
                    <span className="tl-d">${s.d}</span>
                  </button>
                </li>`)}
            </ol>
          </div>

          <div className="dash reveal">
            <div className="dash-intro">
              <h3>성공 판단 기준 — 당근 내부 검토용 대시보드</h3>
              <p>파일럿에서 측정할 지표를 실제 화면 형태로 정리했습니다. 목표 수치는 근거 없이 정하지 않고 파일럿 시작 전 양측이 함께 정합니다.</p>
            </div>
            <div className="dash-frame">
              <div className="dash-bar">
                <span className="dash-dots" aria-hidden="true"><i></i><i></i><i></i></span>
                <b>다음 주인 찾기 · 파일럿 성과</b>
                <span className="dash-flag">파일럿 성과 예시 화면 · 실제 데이터 아님</span>
              </div>
              <div className="dash-body">
                <div className="dash-filters">
                  <span>기간 <b>파일럿 6주</b></span>
                  <span>대상군 <b>OPTION ${opt} · ${OPTIONS.find((o) => o.id === opt).t}</b></span>
                  <span>목표치 <b className="tbd-cell">파일럿 시작 전 협의</b></span>
                </div>

                <div className="dash-funnel">
                  <p className="mini-title">전환 흐름 (측정 예정)</p>
                  <ol>
                    ${FUNNEL.map((f, i) => html`<li key=${f} style=${{ '--w': (100 - i * 16) + '%' }}><span className="dash-funnel-bar"></span><b>${f}</b><em>—</em></li>`)}
                  </ol>
                </div>

                <div className="dash-grid">
                  ${METRICS.map((m) => html`
                    <div className="dash-tile" key=${m.t}>
                      <span className="dash-tile-t">${m.t}</span>
                      <span className="dash-tile-v">—<small>${m.u}</small></span>
                      <span className="dash-tile-f">${m.f}</span>
                      <span className="dash-tile-s">측정 예정</span>
                    </div>`)}
                </div>

                <div className="dash-env">
                  <div>
                    <p className="mini-title">환경적 가치 측정 기반</p>
                    <div className="dash-env-row">
                      <span>재사용 물품 수량 <b>— 개</b></span>
                      <span>재사용 물품 무게 <b>— kg</b></span>
                      <em>기록 예정</em>
                    </div>
                  </div>
                  <div className="dash-hold">
                    <p className="mini-title">수치화하지 않는 항목</p>
                    <p>탄소 감축량 · 폐기물 감축량 · 비용 절감률 — 검증된 산정 방법과 기준 데이터가 확보되기 전까지 숫자로 표기하지 않습니다.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="gates reveal">
            <div className="gates-head">
              <h3>평가 이후, 확장은 이렇게 결정합니다</h3>
              <p>파일럿 시작 전에 합의한 기준과 실제 전달 데이터를 비교해 다음 단계를 정합니다.</p>
            </div>
            <div className="gates-flow">
              <div className="gate-src"><span>6주 운영 데이터</span><b>사전 합의 기준과 비교</b></div>
              <ul className="gate-list">
                ${GATES.map((g) => html`<li key=${g.k} className=${'gate gate--' + g.k}><b>${g.t}</b><span className="gate-c">${g.c}</span><span>${g.d}</span></li>`)}
              </ul>
            </div>
          </div>
        </div>
      </section>`;
  }

  /* ---------- CLOSING ---------- */
  function Closing({ toast }) {
    const [open, setOpen] = useState(false);
    const copy = () => {
      const text = '[다음 주인 찾기] 공동 파일럿 협의 항목 (안)\n' + DATA.agenda.map((a, i) => (i + 1) + '. ' + a).join('\n');
      const done = () => toast('협의 항목을 클립보드에 복사했습니다.');
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, () => fallbackCopy(text, done));
      else fallbackCopy(text, done);
    };
    return html`
      <section className="closing" id="closing">
        <div className="container closing-inner reveal">
          <p className="eyebrow eyebrow--inv"><span className="eyebrow-num">14</span>CLOSING</p>
          <h2 className="closing-title">거래의 끝이,<br />누군가에게는 새로운 시작이 되도록.</h2>
          <p className="closing-sub">필요한 물품을 먼저 확인하고, 기준에 맞는 물품만 연결하며, 전달에 필요한 비용은 후원으로 해결합니다. 당근의 지역 기반 연결력과 월드비전의 현장 네트워크·운영 역량으로 이 지역사회 자원순환 모델을 함께 만들어 갈 것을 제안합니다.</p>
          <p className="closing-ask">지역의 연결을 사회적 가치로 확장하는 파일럿을<br className="br-desk" />${' '}함께 검토해 주세요.</p>
          <button className="btn btn--primary btn--lg" onClick=${() => setOpen(true)}>공동 파일럿 검토 제안</button>
          <p className="closing-demo">데모 버튼 · 실제 메일 전송이나 외부 서비스 연결은 없습니다</p>
        </div>

        <${Modal} open=${open} onClose=${() => setOpen(false)} title="공동 파일럿 검토 제안">
          <div className="notice notice--muted"><b>데모 버튼입니다.</b><p>이 버튼은 메일을 보내거나 외부 서비스에 연결하지 않습니다. 아래는 첫 논의에서 다룰 협의 항목(안)입니다.</p></div>
          <ol className="agenda">${DATA.agenda.map((a) => html`<li key=${a}>${a}</li>`)}</ol>
          <div className="modal-actions">
            <button className="btn btn--dark" onClick=${copy}>협의 항목 복사</button>
            <button className="btn btn--ghost" onClick=${() => setOpen(false)}>닫기</button>
          </div>
        <//>
      </section>`;
  }

  function fallbackCopy(text, done) {
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); done(); } catch (e) { /* noop */ }
    document.body.removeChild(ta);
  }

  function Footer() {
    return html`
      <footer className="footer">
        <div className="container footer-inner">
          <div>
            <b>다음 주인 찾기 (가칭)</b>
            <p>당근 × 월드비전 협업 제안용 콘셉트 데모</p>
          </div>
          <ul className="footer-notes">
            <li>이 페이지는 제안 단계의 아이디어이며, 양사 간 확정된 파트너십이나 출시된 서비스가 아닙니다.</li>
            <li>공식 로고를 사용하지 않았으며, 브랜드명은 텍스트로만 표기했습니다.</li>
            <li>모든 물품·기관·화면은 예시이며, 데이터 저장·기관 인증·AI 분석·배송 예약 기능은 구현되어 있지 않습니다.</li>
            <li>시장 규모·미판매율 등 출처가 확인되지 않은 수치는 사용하지 않았습니다.</li>
          </ul>
        </div>
      </footer>`;
  }

  window.SECTIONS = Object.assign(window.SECTIONS || {}, { Trust, Value, Operation, Shipping, Pilot, Closing, Footer });
})();
