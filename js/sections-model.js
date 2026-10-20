/* PRINCIPLE · QUALITY — 수요 기반 운영 원칙과 물품 품질 기준 */
(function () {
  const { useState } = React;
  const { html, SectionHead } = UI;

  /* ---------- PRINCIPLE ---------- */
  const OLD = [
    '기부자가 물품을 제공',
    '물품이 먼저 모임',
    '배분 가능한 기관을 나중에 탐색',
  ];
  const NEW = [
    '기관이 필요한 품목·사이즈·수량을 먼저 등록',
    '실제 수요가 확인된 물품만 모집',
    'AI가 물품 정보와 품질 관련 사항을 1차 검수',
    '기관 담당자가 필요한 물품을 직접 선택',
    '최종 제공 확정 후 배송',
    '기관 수령까지 확인',
  ];
  const SHIFTS = [
    ['공급자 중심', '수요 중심'],
    ['물량 확보', '실제 필요 충족'],
    ['단순한 중고 물품 전달', '품질 기준을 갖춘 매칭'],
    ['물품과 배송비가 뒤섞인 비용', '물품 제공과 배송비 지원의 분리'],
    ['신청하면 끝', '신청과 최종 전달을 구분한 투명한 운영'],
    ['한 조직의 단독 운영', '월드비전 기관 네트워크 × 당근 지역 연결'],
  ];

  function Principle() {
    return html`
      <section className="section" id="principle">
        <div className="container">
          <${SectionHead} num="03" eyebrow="PRINCIPLE · 운영 원칙"
            title=${html`물건을 먼저 모으지 않습니다.<br />필요한 물건부터 연결합니다.`}
            lead="기관의 수요를 먼저 확인하고, 필요한 품목과 수량에 맞춰 물품을 연결합니다. 수요가 없는 물품은 모집하거나 전달하지 않습니다." />

          <div className="pr-compare reveal">
            <div className="pr-col pr-col--old">
              <p className="pr-label">일반적인 물품 기부 방식</p>
              <ol>${OLD.map((t, i) => html`<li key=${t}><span>${i + 1}</span>${t}</li>`)}</ol>
              <p className="pr-end pr-end--old">수요가 없는 물품이 남거나 추가 보관·처리 비용이 발생할 수 있음</p>
            </div>
            <div className="pr-col pr-col--new">
              <p className="pr-label">이번 제안 모델</p>
              <ol>${NEW.map((t, i) => html`<li key=${t} className=${i === 0 ? 'is-first' : ''}><span>${i + 1}</span>${t}</li>`)}</ol>
              <p className="pr-end pr-end--new">수요가 없으면 물품 모집도, 재고 전달도 발생하지 않음</p>
            </div>
          </div>

          <div className="pr-shifts reveal">
            <p className="mini-title">이 모델의 차별점</p>
            <ul>
              ${SHIFTS.map(([a, b]) => html`<li key=${a}><s>${a}</s><span className="ny-arrow" aria-hidden="true"></span><b>${b}</b></li>`)}
            </ul>
          </div>
        </div>
      </section>`;
  }

  /* ---------- QUALITY ---------- */
  const NEW_ITEMS = ['미사용 제품', '구성품 및 부속품 확인', '포장 훼손 및 보관 상태 확인', '안전성·유통기한 확인이 필요한 품목은 별도 기준 적용'];
  const USED_ITEMS = [
    '눈에 띄는 얼룩, 오염, 찢어짐, 파손이 없을 것',
    '세탁 및 기본적인 위생 관리가 가능한 상태일 것',
    '기능상 문제가 없고 실제 사용에 불편이 없을 것',
    '냄새, 곰팡이, 해충 흔적 등 위생 문제가 의심되면 제외',
    '구성품이 필요한 물품은 누락 여부 확인',
  ];
  const BANDS = [
    { g: 'S', t: '새 제품에 준하는 상태', pts: ['미사용 또는 사용 흔적이 거의 없음', '눈에 띄는 오염이나 훼손 없음', '기능상 문제 없음', '기관 전달 전 별도 확인 기준 충족'] },
    { g: 'A', t: '깨끗하게 관리된 상태', pts: ['가벼운 사용 흔적은 있으나 오염·파손 없음', '세탁 또는 간단한 관리 후 바로 사용 가능', '기능과 구성에 문제 없음'] },
    { g: 'X', t: '전달 대상 제외', pts: ['눈에 띄는 오염, 찢어짐, 파손', '위생 또는 안전 문제가 의심됨', '기능 확인 불가 또는 필요한 구성품 누락'] },
  ];

  function Quality() {
    const [req, setReq] = useState('SA');
    const allowed = req === 'S' ? ['S'] : ['S', 'A'];
    return html`
      <section className="section section--ivory" id="quality">
        <div className="container">
          <${SectionHead} num="05" eyebrow="QUALITY · 품질 기준"
            title=${html`새 제품이든 중고 제품이든,<br />받는 사람이 안심하고 사용할 수 있도록.`}
            lead="사용하지 않는 물건을 무조건 전달하지 않습니다. 기관의 필요와 물품의 품질 기준을 모두 충족하는 경우에만 연결합니다." />

          <div className="q-sheets reveal">
            <div className="q-sheet">
              <p className="q-sheet-k">A. 새 제품</p>
              <ul>${NEW_ITEMS.map((t) => html`<li key=${t}>${t}</li>`)}</ul>
            </div>
            <div className="q-sheet">
              <p className="q-sheet-k">B. 중고 제품</p>
              <ul>${USED_ITEMS.map((t) => html`<li key=${t}>${t}</li>`)}</ul>
            </div>
          </div>

          <div className="q-bands reveal">
            <p className="mini-title">C. 중고 물품 품질 등급 (운영 제안 기준)</p>
            <div className="q-band-row">
              ${BANDS.map((b) => html`
                <div key=${b.g} className=${'q-band q-band--' + b.g}>
                  <div className="q-band-head"><span className=${'grade grade--' + b.g}>${DATA.GRADES[b.g].label}</span><b>${b.t}</b></div>
                  <ul>${b.pts.map((p) => html`<li key=${p}>${p}</li>`)}</ul>
                </div>`)}
            </div>
            <p className="q-note">S급은 서비스 운영을 위한 제안 기준이며, 공식 품질 인증이나 완벽한 상태를 보증하는 표현이 아닙니다. AI는 사진과 등록 정보로 잠정 등급을 추천하고, 필요시 사람이 실제 상태를 확인합니다. 냄새·촉감·숨은 오염·안전성은 AI가 판단한 것으로 표현하지 않습니다.</p>
          </div>

          <div className="q-matrix reveal">
            <div className="q-matrix-head">
              <div>
                <h3>품질 기준과 수요를 함께 적용합니다</h3>
                <p>기관이 정한 허용 등급과 물품의 실제 상태가 일치하지 않으면 매칭을 진행하지 않습니다.</p>
              </div>
              <div className="seg seg--light" role="radiogroup" aria-label="기관 허용 등급">
                <button role="radio" aria-checked=${req === 'S'} className=${'seg-btn' + (req === 'S' ? ' is-on' : '')} onClick=${() => setReq('S')}>기관이 S급만 요청</button>
                <button role="radio" aria-checked=${req === 'SA'} className=${'seg-btn' + (req === 'SA' ? ' is-on' : '')} onClick=${() => setReq('SA')}>S·A급까지 허용</button>
              </div>
            </div>
            <div className="q-matrix-row">
              ${['S', 'A', 'X'].map((g) => {
                const ok = allowed.includes(g);
                return html`
                  <div key=${g + req} className=${'q-cell' + (ok ? ' is-ok' : ' is-no')}>
                    <span className=${'grade grade--' + g}>${DATA.GRADES[g].label} 물품</span>
                    <b>${ok ? '매칭 가능' : '매칭하지 않음'}</b>
                    <small>${g === 'X' ? '기준 미달은 어떤 수요에도 전달하지 않음' : ok ? '사전에 합의된 기준 충족 시' : '기관 허용 등급 밖'}</small>
                  </div>`;
              })}
            </div>
          </div>
        </div>
      </section>`;
  }

  window.SECTIONS = Object.assign(window.SECTIONS || {}, { Principle, Quality });
})();
