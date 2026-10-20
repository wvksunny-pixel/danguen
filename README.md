# 다음 주인 찾기 (가칭) — 당근 × 월드비전 협업 제안

당근에서 거래되지 않은 물품을 AI가 검수 보조하고, 인증된 기관이 직접 선택해 실제 전달까지 이어지는 수요 기반 기부 연결 모델을 제안하는 인터랙티브 웹 제안서입니다.

> 제안 단계의 콘셉트 데모입니다. 확정된 파트너십이나 출시된 서비스가 아니며, 공식 로고를 사용하지 않았습니다. 데이터 저장·기관 인증·AI 분석·배송 예약 기능은 구현되어 있지 않습니다.

## 실행

빌드 과정 없이 정적 파일로 동작합니다. (React·htm은 CDN에서 불러오므로 인터넷 연결 필요)

```bash
python -m http.server 8780
```

브라우저에서 http://localhost:8780 을 엽니다. `index.html`을 직접 열어도 동작합니다.

## 구조

| 파일 | 내용 |
| --- | --- |
| `index.html` | 진입점 |
| `css/styles.css` | 디자인 토큰과 전체 스타일 |
| `js/data.js` | 예시 기관 수요·제공 물품·품질 등급·검수 상태 등 샘플 데이터 |
| `js/ui.js` | 공용 컴포넌트 (배지, 태그, 모달, 물품 일러스트 등) |
| `js/sections-intro.js` | 내비게이션 · Hero · Why · Solution (5단계) |
| `js/sections-model.js` | Principle (수요 기반 원칙) · Quality (품질 기준) |
| `js/demo.js` | 서비스 화면 데모 (기관 수요 등록 · 제공자 화면 · AI 검수 · 기관 선택·제공 확정) |
| `js/sections-wv.js` | Why Daangn · Why World Vision |
| `js/sections-ops.js` | Trust · Value · Operation · 무상 양도·택배비 후원 · Pilot · Closing · Footer |
| `js/app.js` | 섹션 조립 |
