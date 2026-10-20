/* 샘플 데이터 — 모두 '예시'이며 실제 물품·기관·이용자 정보가 아닙니다. */
window.DATA = (function () {
  const AI_STATUS = {
    pass:  { label: '1차 검수 통과',     tone: 'green', desc: '사진·등록 정보상 특이사항이 발견되지 않음. 실물 확인 항목은 별도.' },
    photo: { label: '추가 사진 요청',     tone: 'amber', desc: '판단에 필요한 각도·부위 사진이 부족해 판매자에게 추가 촬영 요청.' },
    human: { label: '사람의 확인 필요',   tone: 'blue',  desc: '오염·훼손 의심 등 사람이 사진 또는 실물로 최종 판단해야 함.' },
    unfit: { label: '기부 부적합 의심',   tone: 'red',   desc: '안전·위생 기준상 파일럿 대상에서 제외될 가능성이 높음. 담당자 확인 후 확정.' },
  };

  const items = [
    {
      id: 'i1', name: '아동 바람막이 점퍼', category: '아동 의류', size: '130', sizeNum: 130,
      qty: 1, condition: '사용감 적음', ai: 'pass', region: '서울 마포구', icon: 'jacket', tint: '#EAF2FB',
      listedDays: 34, checks: ['지퍼·밴딩 작동은 실물 확인 권장'],
    },
    {
      id: 'i2', name: '초등 저학년 책가방', category: '아동용 가방', size: '소형 (약 30×38cm)', sizeNum: null,
      qty: 1, condition: '사용감 있음', ai: 'human', region: '서울 마포구', icon: 'backpack', tint: '#FDEFE3',
      listedDays: 52, checks: ['하단부 오염 의심 — 실물 또는 근접 사진 확인 필요'],
    },
    {
      id: 'i3', name: '아동 겨울 패딩', category: '계절용 외투', size: '140', sizeNum: 140,
      qty: 1, condition: '사용감 있음', ai: 'photo', region: '서울 은평구', icon: 'coat', tint: '#EEF0E6',
      listedDays: 41, checks: ['안감·소매 끝 사진 추가 요청', '충전재 뭉침은 실물 확인 필요'],
    },
    {
      id: 'i4', name: '유아 내복 세트', category: '아동 의류', size: '100', sizeNum: 100,
      qty: 3, condition: '새 상품에 가까움', ai: 'pass', region: '경기 고양시', icon: 'tshirt', tint: '#F4EDF8',
      listedDays: 30, checks: ['세탁 여부는 판매자 자기신고 기준'],
    },
    {
      id: 'i5', name: '아동용 극세사 담요', category: '생활용품', size: '100×150cm', sizeNum: null,
      qty: 2, condition: '사용감 적음', ai: 'pass', region: '서울 은평구', icon: 'blanket', tint: '#E8F4F0',
      listedDays: 45, checks: ['냄새·보풀은 사진으로 확인 불가'],
    },
    {
      id: 'i6', name: '학용품 세트 (미개봉)', category: '생활용품', size: '세트 구성 6종', sizeNum: null,
      qty: 5, condition: '미개봉', ai: 'pass', region: '서울 마포구', icon: 'pencil', tint: '#FFF6DC',
      listedDays: 60, checks: ['구성품 수량은 수령 시 확인'],
    },
    {
      id: 'i7', name: '아동 니트 원피스', category: '아동 의류', size: '120', sizeNum: 120,
      qty: 1, condition: '사용감 있음', ai: 'human', region: '경기 고양시', icon: 'dress', tint: '#FBEAEA',
      listedDays: 38, checks: ['앞판 얼룩 의심 — 사람의 확인 필요'],
    },
    {
      id: 'i8', name: '아동 보드 미니가방', category: '아동용 가방', size: '미니 (약 20×25cm)', sizeNum: null,
      qty: 2, condition: '사용감 적음', ai: 'pass', region: '서울 마포구', icon: 'bag', tint: '#EAF2FB',
      listedDays: 33, checks: ['지퍼 작동은 실물 확인 권장'],
    },
    {
      id: 'i9', name: '아동용 카시트', category: '생활용품', size: '1~4세용', sizeNum: null,
      qty: 1, condition: '사용감 있음', ai: 'unfit', region: '서울 은평구', icon: 'seat', tint: '#F1F1EF',
      listedDays: 70, checks: ['안전 관련 품목: 사고 이력·제조일 확인 불가', '파일럿 품목 기준상 제외 의심'],
    },
  ];

  /* 판매자 데모의 예시 물품 (지시서의 AI 검수 예시와 동일) */
  const sellerItem = {
    name: '아동 니트 가디건',
    category: '아동 의류',
    size: '120',
    qty: 1,
    condition: '사용감 있음',
    price: 8000,
    listedDays: 41,
    likes: 2,
    region: '서울 마포구',
    icon: 'cardigan',
    tint: '#FDEFE3',
  };

  const aiReport = [
    { key: '물품 분류',       value: '아동 의류',            state: 'ok',    note: '사진·제목 기준 카테고리 추정' },
    { key: '사진상 상태',     value: '사용감 있음',          state: 'info',  note: '보풀·늘어남 흔적 추정' },
    { key: '오염·훼손 의심',  value: '추가 확인 필요',       state: 'warn',  note: '소매 끝 변색 의심 영역 표시' },
    { key: '등록 정보',       value: '사이즈 정보 확인 완료', state: 'ok',    note: '사이즈·수량 필수값 입력됨' },
    { key: '검수 상태',       value: '사람의 최종 확인 필요', state: 'human', note: '담당자 검토 대기열로 분류' },
  ];

  const notVisible = ['냄새', '실제 촉감·소재 상태', '사진에 찍히지 않은 숨은 오염', '세탁 여부', '안전성 (부속품·유해물질 등)'];

  const categories = ['아동 의류', '아동용 가방', '계절용 외투', '생활용품'];
  const regions = ['서울 마포구', '서울 은평구', '경기 고양시'];
  const sizeRanges = [
    { id: 'any', label: '무관 / 해당 없음', min: 0, max: 999 },
    { id: '90-110', label: '90 ~ 110', min: 90, max: 110 },
    { id: '110-130', label: '110 ~ 130', min: 110, max: 130 },
    { id: '130-150', label: '130 ~ 150', min: 130, max: 150 },
  ];
  const instTypes = ['지역아동센터', '그룹홈 (공동생활가정)', '가정위탁지원센터', '아동복지시설'];
  const timings = ['2주 이내', '1개월 이내', '계절 전환 전 (협의)'];

  const nav = [
    { id: 'why', label: '문제' },
    { id: 'solution', label: '서비스 구조' },
    { id: 'demo', label: '화면 데모' },
    { id: 'why-wv', label: '왜 월드비전' },
    { id: 'trust', label: '운영 원칙' },
    { id: 'value', label: '파트너 가치' },
    { id: 'operation', label: '운영 모델' },
    { id: 'shipping', label: '가격·배송비' },
    { id: 'pilot', label: '파일럿' },
  ];

  const agenda = [
    '배송비 재원: 당근 지원 가능성, 기업 후원, 별도 사업 예산',
    '파일럿 대상군 선택 (보육기관 중심 / 지역아동센터 중심)과 실제 참여 가능 기관 확인',
    '파일럿 품목·지역 기준',
    '협력기관 인증 기준과 담당자 계정 발급 방식',
    '기부 전환 대상 기준 (판매 미성사 기간 등)',
    '단계별 취소 가능 시점과 소유권 이전 시점',
    'AI 검수 보조의 범위와 사람 검수 기준',
    '기관·판매자 간 공개 정보 범위와 개인정보 처리',
    '성과지표 목표치와 데이터 공유 방식',
  ];

  return { AI_STATUS, items, sellerItem, aiReport, notVisible, categories, regions, sizeRanges, instTypes, timings, nav, agenda };
})();
