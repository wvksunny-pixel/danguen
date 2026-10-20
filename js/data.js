/* 샘플 데이터 — 모두 '예시'이며 실제 기관 수요·물품·이용자 정보가 아닙니다. */
window.DATA = (function () {
  /* AI 1차 검수 분류 (사진·등록 정보 기준의 잠정 분류이며 품질 보증이 아님) */
  const AI_STATUS = {
    pass:  { label: '품질 기준 충족 가능', tone: 'green', desc: '사진·등록 정보상 사전 기준을 충족할 가능성이 높음. 사진으로 볼 수 없는 항목은 별도 확인.' },
    photo: { label: '추가 사진 필요',     tone: 'amber', desc: '판단에 필요한 각도·부위 사진이 부족해 제공자에게 추가 촬영 요청.' },
    human: { label: '사람의 확인 필요',   tone: 'blue',  desc: '오염·훼손 의심 등 사람이 사진 또는 실물로 최종 판단해야 함.' },
    unfit: { label: '기준 미달 가능성',   tone: 'red',   desc: '눈에 띄는 오염·파손 또는 위생·안전 문제가 의심됨. 담당자 확인 후 제외 확정.' },
  };

  /* 품질 등급 — 운영을 위한 제안 기준이며 공식 품질 인증이 아님 */
  const GRADES = {
    S: { label: 'S급', desc: '새 제품에 준하는 상태' },
    A: { label: 'A급', desc: '깨끗하게 관리된 상태' },
    X: { label: '기준 미달', desc: '전달 대상 제외' },
  };

  /* 기관 수요 (예시) — 수요가 먼저 등록되어야 모집이 열립니다 */
  const demands = [
    { id: 'd1', inst: '마포 ○○지역아동센터', instType: '지역아동센터', region: '서울 마포구', mine: true,
      category: '계절용 외투', label: '아동용 외투', size: '110~120', qty: 10, matched: 6, grades: ['S', 'A'], timing: '11월 말까지', status: 'open' },
    { id: 'd2', inst: '은평 ○○그룹홈', instType: '그룹홈', region: '서울 은평구',
      category: '아동용 가방', label: '아동용 가방 (초등 저학년)', size: '소형', qty: 5, matched: 4, grades: ['S'], timing: '1개월 이내', status: 'open' },
    { id: 'd3', inst: '마포 ○○지역아동센터', instType: '지역아동센터', region: '서울 마포구', mine: true,
      category: '아동 의류', label: '아동 상의 (니트·맨투맨)', size: '120', qty: 6, matched: 2, grades: ['S', 'A'], timing: '2주 이내', status: 'open' },
    { id: 'd4', inst: '고양 ○○가정위탁지원센터', instType: '가정위탁지원센터', region: '경기 고양시',
      category: '생활용품', label: '아동용 담요', size: '100×150cm 내외', qty: 4, matched: 4, grades: ['S', 'A'], timing: '1개월 이내', status: 'done' },
  ];

  /* 다른 제공자가 이미 신청한 후보 물품 (예시) */
  const offers = [
    { id: 'o1', demandId: 'd1', name: '아동 바람막이 점퍼', size: '120', qty: 1, grade: 'A', ai: 'pass', icon: 'jacket', tint: '#EAF2FB',
      note: '지퍼·밴딩 작동은 수령 시 확인', state: 'offered' },
    { id: 'o2', demandId: 'd1', name: '아동 겨울 패딩', size: '110', qty: 1, grade: 'A', ai: 'photo', icon: 'coat', tint: '#EEF0E6',
      note: '안감·소매 끝 사진 추가 요청', state: 'offered' },
    { id: 'o3', demandId: 'd3', name: '아동 맨투맨', size: '120', qty: 1, grade: 'S', ai: 'pass', icon: 'tshirt', tint: '#F4EDF8',
      note: '택 부착 미사용 제품 (제공자 신고)', state: 'offered' },
    { id: 'o4', demandId: 'd2', name: '초등 책가방', size: '소형', qty: 1, grade: 'A', ai: 'human', icon: 'backpack', tint: '#FDEFE3',
      note: '하단부 사용 흔적', state: 'offered' },
    { id: 'o5', demandId: 'd3', name: '아동 니트 원피스', size: '120', qty: 1, grade: 'X', ai: 'unfit', icon: 'dress', tint: '#FBEAEA',
      note: '앞판 얼룩·보풀 다수 의심', state: 'offered' },
  ];

  /* 데모 제공자의 미판매 판매글 (예시) — AI 결과는 미리 작성한 목업 값 */
  const listings = [
    { id: 'L1', name: '아동 니트 가디건', category: '아동 의류', size: '120', qty: 1, condition: '사용감 적음', price: 8000, listedDays: 41,
      icon: 'cardigan', tint: '#FDEFE3', grade: 'A', ai: 'human',
      report: [
        ['물품 분류', '아동 의류', 'ok', '사진·제목 기준 카테고리 추정'],
        ['사진상 상태', '가벼운 사용 흔적', 'info', '보풀·늘어남 흔적 추정'],
        ['오염·훼손 의심', '추가 확인 필요', 'warn', '소매 끝 변색 의심 영역 표시'],
        ['등록 정보', '사이즈·수량 확인 완료', 'ok', '필수값 입력됨'],
        ['잠정 품질 등급', 'A급 추천', 'info', '사람 확인 후 확정'],
        ['검수 상태', '사람의 확인 필요', 'human', '담당자 검토 대기열로 분류'],
      ], box: { left: '20%', top: '44%', width: '18%', height: '18%' }, boxLabel: '변색 의심 영역 (예시)' },
    { id: 'L2', name: '초등 저학년 책가방', category: '아동용 가방', size: '소형', qty: 1, condition: '거의 사용하지 않음', price: 15000, listedDays: 52,
      icon: 'backpack', tint: '#EAF2FB', grade: 'S', ai: 'pass',
      report: [
        ['물품 분류', '아동용 가방', 'ok', '사진·제목 기준 카테고리 추정'],
        ['사진상 상태', '사용 흔적 거의 없음', 'ok', '모서리·바닥면 사진 포함'],
        ['오염·훼손 의심', '발견되지 않음', 'ok', '사진에 보이는 범위 기준'],
        ['등록 정보', '규격·구성품 확인 완료', 'ok', '지퍼·어깨끈 상태 신고'],
        ['잠정 품질 등급', 'S급 추천', 'ok', '인계 전 확인 기준 적용'],
        ['검수 상태', '품질 기준 충족 가능', 'ok', '기관 선택 단계로 이동'],
      ] },
    { id: 'L3', name: '아동 플리스 점퍼', category: '계절용 외투', size: '120', qty: 1, condition: '사용감 적음', price: 10000, listedDays: 35,
      icon: 'jacket', tint: '#EEF0E6', grade: 'A', ai: 'pass',
      report: [
        ['물품 분류', '계절용 외투', 'ok', '사진·제목 기준 카테고리 추정'],
        ['사진상 상태', '가벼운 사용 흔적', 'info', '보풀 소량 추정'],
        ['오염·훼손 의심', '발견되지 않음', 'ok', '사진에 보이는 범위 기준'],
        ['등록 정보', '사이즈·수량 확인 완료', 'ok', '필수값 입력됨'],
        ['잠정 품질 등급', 'A급 추천', 'info', '세탁 후 사용 가능 수준'],
        ['검수 상태', '품질 기준 충족 가능', 'ok', '기관 선택 단계로 이동'],
      ] },
  ];

  const notVisible = ['냄새', '실제 촉감·소재 상태', '사진에 찍히지 않은 숨은 오염', '세탁 여부', '안전성 (부속품·유해물질 등)'];

  const categories = ['아동 의류', '계절용 외투', '아동용 가방', '생활용품'];
  const regions = ['서울 마포구', '서울 은평구', '경기 고양시'];
  const instTypes = ['지역아동센터', '그룹홈 (공동생활가정)', '가정위탁지원센터', '아동복지시설'];
  const timings = ['2주 이내', '1개월 이내', '계절 전환 전 (협의)'];

  const nav = [
    { id: 'why', label: '문제' },
    { id: 'principle', label: '원칙' },
    { id: 'solution', label: '구조' },
    { id: 'quality', label: '품질' },
    { id: 'demo', label: '데모' },
    { id: 'why-daangn', label: '왜 당근' },
    { id: 'why-wv', label: '왜 월드비전' },
    { id: 'operation', label: '운영' },
    { id: 'shipping', label: '택배비' },
    { id: 'pilot', label: '파일럿' },
  ];

  const agenda = [
    '택배비 후원 재원: 당근 택배 연계·배송비 지원 가능성, 기업 후원, 사회공헌 예산, 물류 파트너',
    '당근 택배 서비스와의 기술 연동, 비용 부담 주체, 이용 약관·운영 정책',
    '파일럿 대상군 선택 (보육기관 중심 / 지역아동센터 중심)과 실제 참여 가능 기관 확인',
    '기관 수요 등록 기준과 모집 대상 판매글 기준 (판매 미성사 기간 등)',
    '품질 등급(S·A·기준 미달) 세부 기준과 사람 확인 범위',
    '무상 양도 절차, 단계별 취소 가능 시점과 소유권 이전 시점',
    '기부금영수증 발급 가능 여부 (물품 종류·새 제품/중고 여부별 회계·세무 검토)',
    '기관·제공자 간 공개 정보 범위와 개인정보 처리',
    '성과지표 목표치와 데이터 공유 방식',
  ];

  return { AI_STATUS, GRADES, demands, offers, listings, notVisible, categories, regions, instTypes, timings, nav, agenda };
})();
