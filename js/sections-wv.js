/* WHY DAANGN · WHY WORLD VISION — 두 파트너가 함께해야 하는 이유와 협력 구조 */
(function () {
  const { useState } = React;
  const { html, Tag, SectionHead } = UI;

  /* ---------- WHY DAANGN ---------- */
  const DG_VALUES = [
    {
      n: '01', t: '지역 기반 플랫폼의 역할 확장',
      d: '당근의 핵심 자산인 지역 기반 연결 역량을 거래뿐 아니라 지역사회 문제 해결에도 활용합니다. 플랫폼 정체성을 벗어나는 새 사업이 아니라, 당근이 이미 하고 있는 ‘연결’의 범위를 넓히는 협업입니다.',
      m: '측정: 참여 지역 수, 참여 기관 수',
    },
    {
      n: '02', t: '자원순환의 실질적인 실행 모델',
      d: '거래되지 않은 물품이 필요한 기관으로 가는 경로를 만듭니다. 캠페인이 아니라 기관 수요 확인부터 모집·검수·확정·전달까지 실제 과정을 운영하고 결과를 확인하는 모델입니다.',
      m: '측정: 재사용 물품 수량·무게',
      c: '탄소·폐기물 감축량은 검증된 산정 방법과 기준 데이터가 확보된 경우에만 수치화',
    },
    {
      n: '03', t: '참여자가 체감하는 사회적 가치',
      d: '거래되지 않은 물품을 폐기하거나 계속 보관하는 대신 필요한 기관에 기부할 수 있는 선택지를 줍니다. 판매자에게는 새로운 선택지가, 기관에는 필요한 물품을 고를 기회가 생깁니다.',
      m: '측정: 물품 제공 신청 수, 판매자 참여 의향',
      c: '모든 이용자에게 적용되는 기능이 아닌, 자발적으로 참여하는 선택형 기능',
    },
    {
      n: '04', t: '측정 가능한 사회공헌 성과',
      d: '참여 물품 수에서 멈추지 않고 실제 전달 완료 건수, 참여 기관 수, 기관의 필요 충족 여부, 검수 통과율까지 확인합니다. 당근이 지원한 활동이 어떤 결과로 이어졌는지 데이터로 말할 수 있습니다.',
      m: '측정: 전달 완료 건수, 수요 충족률, 검수 통과율',
      c: '검증되지 않은 환경성과·사회적 효과는 커뮤니케이션에 쓰지 않음',
    },
  ];

  const INPUTS = [
    { t: '물품 제공 기능', d: '모집 중인 수요에 맞는 판매글에 ‘물품 제공’ 선택지를 여는 최소 기능부터', k: 'new' },
    { t: '판매자 안내·참여 유도', d: '미판매 물품 판매자에게 선택지를 알리는 안내', k: 'existing' },
    { t: '당근 택배 연동', d: '택배 신청 간소화와 배송비 지원·후원 재원 연계 가능성', k: 'tbd' },
    { t: '파일럿 데이터 공유', d: '신청·확정·전달 지표를 양측이 함께 확인', k: 'tbd' },
  ];

  function WhyDaangn() {
    return html`
      <section className="section dg-section" id="why-daangn">
        <div className="container">
          <div className="dg-statement reveal">
            <p className="dg-statement-k">당근 관점에서 다시 보면</p>
            <p className="dg-statement-t">거래를 넘어,<br />지역의 자원을 연결하다.</p>
            <p className="dg-statement-d">당근은 지역 안의 사람과 물품을 연결합니다. 월드비전은 지역 현장의 필요와 협력기관 네트워크를 바탕으로 실제 지원을 연결합니다. 두 조직의 연결 역량과 현장 실행 역량이 만나면, 거래되지 않은 물품이 필요한 기관의 선택을 거쳐 실제 전달까지 이어지는 지역사회 자원순환 모델이 가능해집니다.</p>
          </div>

          <${SectionHead} num="07" eyebrow="WHY DAANGN · 왜 당근인가"
            title=${html`당근의 연결은<br />거래에서 끝나지 않습니다.`}
            lead=${html`당근이 지역의 사람과 물품을 연결해 왔다면,<br className="br-desk" />${' '}이제 그 연결을 지역사회의 필요까지 확장할 수 있습니다.`} />

          <ol className="dg-values reveal">
            ${DG_VALUES.map((v) => html`
              <li key=${v.n}>
                <span className="dg-v-n">${v.n}</span>
                <h3>${v.t}</h3>
                <p>${v.d}</p>
                <p className="dg-v-m">${v.m}</p>
                ${v.c ? html`<p className="dg-v-c">${v.c}</p>` : null}
              </li>`)}
          </ol>

          <div className="dg-ledger reveal">
            <div className="dg-ledger-col">
              <p className="mini-title">당근이 검토할 투입 (협의 대상)</p>
              <ul>
                ${INPUTS.map((i) => html`<li key=${i.t}><div><b>${i.t}</b><span>${i.d}</span></div><${Tag} kind=${i.k}>${i.k === 'new' ? '최소 범위 개발' : i.k === 'existing' ? '기존 채널 활용' : '협의 필요'}</${Tag}></li>`)}
              </ul>
            </div>
            <div className="dg-ledger-mid" aria-hidden="true"><span></span></div>
            <div className="dg-ledger-col dg-ledger-col--out">
              <p className="mini-title">확인할 수 있는 결과</p>
              <ul>
                <li><b>미판매 물품의 새 활용 경로</b><span>판매 외 선택지를 가진 판매자 수와 물품 수</span></li>
                <li><b>실제 전달까지 확인된 지원</b><span>기관 수령 확인 기준의 전달 완료 건수</span></li>
                <li><b>지역 단위 사회적 가치</b><span>참여 지역·기관 수와 기관의 수요 충족률</span></li>
                <li><b>확장 판단 근거</b><span>건당 운영·배송 비용과 기관 만족도</span></li>
              </ul>
            </div>
          </div>
          <p className="dg-ledger-note">기능 개발 범위와 비용은 파일럿 설계 단계에서 함께 산정합니다. 처음에는 수요에 맞는 판매글의 물품 제공 선택지와 기관 수요 등록 웹 페이지 정도의 최소 범위로 시작하는 것을 제안합니다.</p>
        </div>
      </section>`;
  }

  /* ---------- WHY WORLD VISION ---------- */
  /* 기관 유형은 예시이며, 실제 참여 기관·규모를 의미하지 않습니다. */
  const NET = [
    { t: '지역아동센터', x: 50, y: 10 },
    { t: '보육기관', x: 88, y: 34 },
    { t: '그룹홈', x: 78, y: 80 },
    { t: '가정위탁지원센터', x: 22, y: 80 },
    { t: '아동복지시설', x: 12, y: 34 },
  ];

  const ROLES = [
    { need: '참여 기관 모집', t: '기관 네트워크', d: '참여 가능한 협력기관을 발굴하고 실제 수요를 파악합니다.' },
    { need: '기관별 필요 파악', t: '수요 기반 매칭', d: '기관이 필요한 품목·사이즈·수량을 등록하고 직접 물품을 선택하도록 지원합니다.' },
    { need: '물품 적합성 기준·수령 확인', t: '현장 운영', d: '물품 검수 기준과 전달 절차를 설계하고 기관의 수령 여부를 확인합니다.' },
    { need: '성과 집계·검증', t: '성과 측정', d: '신청부터 전달 완료까지 데이터를 관리해 사업 성과를 분석합니다.' },
  ];

  const DG_ASSETS = ['지역 기반 이용자·물품 연결', '물품 제공 기능을 도입할 수 있는 플랫폼', '당근 택배 연동·배송비 지원 가능성 검토'];
  const WV_ASSETS = ['협력기관 네트워크', '현장 수요 파악·기관 매칭', '물품 지원 운영·전달 확인', '사회적 가치 측정·성과 커뮤니케이션'];
  const OUTCOMES = ['미판매 물품의 새로운 활용 경로', '기관이 직접 선택하는 수요 기반 지원', '실제 전달 여부를 확인하는 운영 모델', '확장 가능성을 데이터로 검증하는 파일럿'];

  function Network() {
    return html`
      <div className="wv-net">
        <svg viewBox="0 0 100 90" preserveAspectRatio="none" aria-hidden="true">
          ${NET.map((n, i) => html`<line key=${i} x1="50" y1="45" x2=${n.x} y2=${n.y} />`)}
        </svg>
        <span className="wv-net-hub">월드비전</span>
        ${NET.map((n) => html`<span key=${n.t} className="wv-net-node" style=${{ left: n.x + '%', top: (n.y / 90 * 100) + '%' }}>${n.t}</span>`)}
      </div>`;
  }

  function WhyWV() {
    const [hover, setHover] = useState(null);
    return html`
      <section className="section section--ivory" id="why-wv">
        <div className="container">
          <${SectionHead} num="08" eyebrow="WHY WORLD VISION · 왜 월드비전인가"
            title=${html`당근의 연결력을<br />실제 변화로 이어줄 파트너.`}
            lead="당근이 이 모델을 단독으로 운영하려면 참여 기관 모집, 기관별 필요 파악, 물품 적합성 기준, 수령 확인 같은 새로운 운영 체계가 필요합니다. 월드비전과의 협력은 이 현장 실행 과정을 함께 설계하고 운영할 수 있다는 데 의미가 있습니다." />

          <div className="wv-mapping reveal">
            <div className="wv-mapping-head"><span>당근 단독 운영 시 새로 필요한 것</span><span>월드비전이 함께 맡는 역할</span></div>
            ${ROLES.map((r, i) => html`
              <div key=${r.t} className=${'wv-mapping-row' + (hover === i ? ' is-on' : '')}
                   onMouseEnter=${() => setHover(i)} onMouseLeave=${() => setHover(null)}>
                <span className="wv-need">${r.need}</span>
                <span className="wv-link" aria-hidden="true"></span>
                <div className="wv-role"><b>${r.t}</b><span>${r.d}</span></div>
              </div>`)}
          </div>

          <div className="wv-map reveal">
            <div className="wv-side wv-side--dg">
              <p className="wv-side-label">당근의 자산</p>
              <h3>지역의 사람과 물품</h3>
              <ul className="wv-assets">
                ${DG_ASSETS.map((a, i) => html`<li key=${a}>${a}${i === 2 ? html` <${Tag} kind="tbd">검토</${Tag}>` : null}</li>`)}
              </ul>
            </div>

            <div className="wv-core">
              <span className="wv-core-arrow wv-core-arrow--l" aria-hidden="true"></span>
              <div className="wv-core-box">
                <p className="wv-side-label">공동 결과</p>
                <b className="wv-core-title">공동으로 만드는<br />지역사회 자원순환 모델</b>
                <ul className="wv-outcomes">${OUTCOMES.map((o) => html`<li key=${o}>${o}</li>`)}</ul>
              </div>
              <span className="wv-core-arrow wv-core-arrow--r" aria-hidden="true"></span>
            </div>

            <div className="wv-side wv-side--wv">
              <p className="wv-side-label">월드비전의 자산</p>
              <h3>현장의 필요와 실행 역량</h3>
              <${Network} />
              <ul className="wv-roles">${WV_ASSETS.map((a) => html`<li key=${a}>${a}</li>`)}</ul>
            </div>
          </div>
          <p className="wv-net-note">기관 유형은 예시입니다. 월드비전이 모든 기관에 즉시 접근하거나 모든 물품을 직접 검수할 수 있다는 의미가 아니며, 구체적인 참여 기관과 운영 범위는 내부 확인 및 협의가 필요합니다.</p>
        </div>
      </section>`;
  }

  window.SECTIONS = Object.assign(window.SECTIONS || {}, { WhyDaangn, WhyWV });
})();
