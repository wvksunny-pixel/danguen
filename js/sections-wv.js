/* WHY WORLD VISION — 월드비전이 파트너로 참여해야 하는 이유 */
(function () {
  const { useState } = React;
  const { html, Tag, SectionHead } = UI;

  /* 기관 유형은 예시이며, 실제 참여 기관·규모를 의미하지 않습니다. */
  const NET = [
    { t: '지역아동센터', x: 50, y: 10 },
    { t: '보육기관', x: 88, y: 34 },
    { t: '그룹홈', x: 78, y: 80 },
    { t: '가정위탁지원센터', x: 22, y: 80 },
    { t: '아동복지시설', x: 12, y: 34 },
  ];

  const VALUES = [
    { n: '01', t: '기관 네트워크', k: 'network',
      d: '월드비전이 보유하거나 협력하는 다양한 지역사회 기관 및 현장 파트너 네트워크를 활용해, 물품을 필요로 하는 기관과 연결합니다.' },
    { n: '02', t: '수요 기반 매칭', k: 'demand',
      d: '기부 물품을 일방적으로 배분하지 않습니다. 기관이 필요한 품목·사이즈·수량을 먼저 등록하고, 담당자가 실제 필요한 물품을 직접 선택합니다.' },
    { n: '03', t: '실제 전달 확인', k: 'confirm',
      d: '기관 신청에서 끝나지 않고 물품 수령과 전달 완료 여부를 확인합니다. 당근의 물품 연결이 실제 사회적 가치로 이어지는지 측정할 수 있습니다.' },
  ];

  function Network({ active }) {
    return html`
      <div className=${'wv-net' + (active ? ' is-active' : '')}>
        <svg viewBox="0 0 100 90" preserveAspectRatio="none" aria-hidden="true">
          ${NET.map((n, i) => html`<line key=${i} x1="50" y1="45" x2=${n.x} y2=${n.y} />`)}
        </svg>
        <span className="wv-net-hub">월드비전</span>
        ${NET.map((n) => html`<span key=${n.t} className="wv-net-node" style=${{ left: n.x + '%', top: (n.y / 90 * 100) + '%' }}>${n.t}</span>`)}
      </div>`;
  }

  function WhyWV() {
    const [focus, setFocus] = useState(null);
    return html`
      <section className="section" id="why-wv">
        <div className="container">
          <${SectionHead} num="05" eyebrow="WHY WORLD VISION · 왜 월드비전인가"
            title=${html`물건을 연결하는 것을 넘어,<br />필요한 곳에 닿도록.`}
            lead="당근이 지역 기반의 물품과 참여자를 연결한다면, 월드비전은 현장의 필요를 이해하고 실제 지원까지 연결할 수 있습니다. 월드비전은 물품을 받는 수혜처가 아니라, 기관 네트워크와 현장 실행 역량을 제공하는 파트너입니다." />

          <div className="wv-map reveal">
            <div className="wv-side wv-side--dg">
              <p className="wv-side-label">당근이 가진 것</p>
              <h3>지역 기반 물품과 참여자</h3>
              <ul>
                <li><b>지역 기반 물품</b><span>동네 단위로 등록된 중고 물품</span></li>
                <li><b>판매자 참여</b><span>기부 전환을 선택할 수 있는 이용자</span></li>
                <li><b>거래·배송 인프라</b><span>활용 가능성 <${Tag} kind="tbd">검토</${Tag}></span></li>
              </ul>
            </div>

            <div className="wv-core">
              <span className="wv-core-arrow wv-core-arrow--l" aria-hidden="true"></span>
              <div className="wv-core-box">
                <p className="wv-side-label">공동 결과</p>
                <b>미판매 물품</b>
                <span className="wv-core-x">×</span>
                <b>필요한 기관</b>
                <p className="wv-core-end">실제 전달까지 연결</p>
              </div>
              <span className="wv-core-arrow wv-core-arrow--r" aria-hidden="true"></span>
            </div>

            <div className="wv-side wv-side--wv">
              <p className="wv-side-label">월드비전이 가진 것</p>
              <h3>현장의 필요와 실행 역량</h3>
              <${Network} active=${focus === 'network'} />
              <ul className="wv-roles">
                <li className=${focus === 'network' ? 'is-on' : ''}>기관 네트워크</li>
                <li className=${focus === 'demand' ? 'is-on' : ''}>현장 수요 파악</li>
                <li className=${focus === 'demand' ? 'is-on' : ''}>수혜 연계</li>
                <li className=${focus === 'confirm' ? 'is-on' : ''}>전달 확인</li>
              </ul>
              <p className="wv-net-note">기관 유형은 예시입니다. 실제 참여 기관과 규모는 내부 확인 및 협의가 필요합니다.</p>
            </div>
          </div>

          <ol className="wv-values reveal">
            ${VALUES.map((v) => html`
              <li key=${v.n} className=${focus === v.k ? 'is-on' : ''}
                  onMouseEnter=${() => setFocus(v.k)} onMouseLeave=${() => setFocus(null)}
                  onFocus=${() => setFocus(v.k)} onBlur=${() => setFocus(null)} tabIndex="0">
                <span className="wv-v-n">${v.n}</span>
                <h4>${v.t}</h4>
                <p>${v.d}</p>
              </li>`)}
          </ol>
        </div>
      </section>`;
  }

  window.SECTIONS = Object.assign(window.SECTIONS || {}, { WhyWV });
})();
