"use client";

import { useState } from "react";

const routes = [
  {
    id: "forest", eyebrow: "추천 1", name: "여유로운 서울숲", tone: "산책과 대화 중심", duration: "약 21분", transit: "2호선 + 도보", cost: "42,000원", accent: "#ef5d4b", destination: "서울숲", destinationCoords: "37.544387,127.037442",
    places: [
      { name: "서울숲", type: "산책", x: 28, y: 66, note: "빛 좋은 산책로에서 천천히 시작해요." },
      { name: "페이지27", type: "전시", x: 55, y: 42, note: "작은 전시를 나란히 둘러봐요." },
      { name: "루프카페", type: "카페", x: 77, y: 24, note: "창가 자리에서 여유롭게 마무리해요." },
    ],
    restaurants: [
      { name: "온기식탁", type: "한식 반상", rating: "4.3", walk: "약 4분", distance: "320m", near: "서울숲", coords: "37.545060,127.039820", price: "1인 15,000~20,000원" },
      { name: "담소키친", type: "퓨전 양식", rating: "4.5", walk: "약 7분", distance: "540m", near: "페이지27", coords: "37.543030,127.053030", price: "1인 18,000~24,000원" },
      { name: "서울숲키친", type: "파스타", rating: "4.2", walk: "약 9분", distance: "710m", near: "루프카페", coords: "37.546150,127.043720", price: "1인 16,000~22,000원" },
    ],
  },
  {
    id: "food", eyebrow: "추천 2", name: "성수 감성 탐방", tone: "숍과 디저트 중심", duration: "약 18분", transit: "2호선 + 도보", cost: "51,000원", accent: "#2f7d71", destination: "연무장길", destinationCoords: "37.542450,127.055040",
    places: [
      { name: "연무장길", type: "거리", x: 20, y: 58, note: "작은 숍을 구경하며 골목을 걸어요." },
      { name: "스튜디오마켓", type: "편집숍", x: 49, y: 36, note: "서로 취향에 맞는 소품을 골라봐요." },
      { name: "어반디저트", type: "디저트", x: 79, y: 58, note: "시그니처 디저트로 코스를 마쳐요." },
    ],
    restaurants: [
      { name: "담소키친", type: "퓨전 양식", rating: "4.5", walk: "약 5분", distance: "390m", near: "연무장길", coords: "37.543030,127.053030", price: "1인 18,000~24,000원" },
      { name: "소담면옥", type: "한식", rating: "4.4", walk: "약 8분", distance: "620m", near: "스튜디오마켓", coords: "37.541260,127.057120", price: "1인 12,000~18,000원" },
      { name: "브릭테이블", type: "이탈리안", rating: "4.1", walk: "약 11분", distance: "860m", near: "어반디저트", coords: "37.540710,127.051660", price: "1인 20,000~28,000원" },
    ],
  },
  {
    id: "indoor", eyebrow: "추천 3", name: "실내 문화 코스", tone: "전시와 독서 중심", duration: "약 24분", transit: "2호선 + 도보", cost: "48,000원", accent: "#6e55a4", destination: "아트룸 성수", destinationCoords: "37.547480,127.050080",
    places: [
      { name: "아트룸", type: "전시", x: 23, y: 30, note: "날씨 걱정 없이 전시로 시작해요." },
      { name: "북라운지", type: "서점", x: 52, y: 58, note: "서로에게 어울리는 책을 골라봐요." },
      { name: "시네마카페", type: "카페", x: 80, y: 32, note: "영화 이야기를 나누며 쉬어가요." },
    ],
    restaurants: [
      { name: "무드테이블", type: "컨템퍼러리", rating: "4.2", walk: "약 6분", distance: "470m", near: "아트룸", coords: "37.545920,127.048240", price: "1인 19,000~27,000원" },
      { name: "온기식탁", type: "한식 반상", rating: "4.3", walk: "약 10분", distance: "780m", near: "북라운지", coords: "37.545060,127.039820", price: "1인 15,000~20,000원" },
      { name: "마루카레", type: "일식 카레", rating: "4.1", walk: "약 13분", distance: "980m", near: "시네마카페", coords: "37.548140,127.057920", price: "1인 11,000~16,000원" },
    ],
  },
];

const icons = {
  heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
  arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  train: <><rect x="5" y="3" width="14" height="15" rx="3" /><path d="M8 21l2-3m6 0 2 3M8 8h8m-8 5h.01M16 13h.01" /></>,
  walk: <><circle cx="13" cy="4" r="2" /><path d="m10 22 1-7-3-3 2-4 4 2 2 4h3m-3 8-3-6-3 6" /></>,
  star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9Z" />,
  external: <><path d="M14 4h6v6" /><path d="M10 14 20 4" /><path d="M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
};

function Icon({ name, size = 20, fill = "none" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[name]}</svg>;
}

export default function Home() {
  const [screen, setScreen] = useState("login");
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState("forest");
  const [restaurant, setRestaurant] = useState(null);
  const selected = routes.find((route) => route.id === selectedId);
  const showResults = () => {
    setLoading(true);
    window.setTimeout(() => { setLoading(false); setScreen("results"); window.scrollTo({ top: 0, behavior: "smooth" }); }, 1400);
  };
  return <main className="site-shell">
    <header className="topbar"><button className="brand" onClick={() => setScreen("login")} aria-label="처음으로"><span className="brand-mark"><Icon name="heart" size={17} /></span><span>둘의 하루</span></button><span className="demo-chip"><span />샘플 데모</span></header>
    {screen === "login" && <LoginScreen onStart={() => setScreen("plan")} />}
    {screen === "plan" && <PlanScreen loading={loading} onBack={() => setScreen("login")} onSubmit={showResults} />}
    {screen === "results" && <ResultsScreen selected={selected} selectedId={selectedId} onSelect={setSelectedId} onBack={() => setScreen("plan")} onRestaurant={setRestaurant} />}
    {restaurant && <RestaurantModal restaurant={restaurant} onClose={() => setRestaurant(null)} />}
  </main>;
}

function LoginScreen({ onStart }) {
  return <section className="login-screen">
    <div className="hero-photo"><img src="/seongsu-date.png" alt="늦은 오후 서울숲길을 함께 걷는 커플" /><div className="photo-wash" /><div className="hero-copy"><p className="kicker">DATE ROUTE CURATOR</p><h1>검색은 줄이고,<br />데이트는 더 길게.</h1><p>출발지에서 첫 장소까지의 길과<br />취향에 맞는 코스 세 가지를 준비했어요.</p></div><div className="route-preview" aria-label="샘플 결과 미리보기"><div><strong>3</strong><span>비교 코스</span></div><i /><div><strong>21분</strong><span>첫 장소까지</span></div><i /><div><strong>4.0+</strong><span>주변 식당</span></div></div></div>
    <div className="login-panel"><div><span className="section-number">01</span><h2>둘만의 하루를<br />골라볼까요?</h2><p>데모 계정으로 바로 시작할 수 있어요.</p></div><div className="login-fields"><label>이메일<input value="date@example.com" readOnly /></label><label>비밀번호<input value="••••••••" readOnly type="text" /></label></div><button className="primary-button" onClick={onStart}>데모 계정으로 시작 <Icon name="arrow" /></button><p className="sample-note">실제 계정은 생성되지 않습니다.</p></div>
  </section>;
}

function PlanScreen({ loading, onBack, onSubmit }) {
  return <section className="plan-screen content-screen">
    <button className="back-link" onClick={onBack}>← 처음으로</button>
    <div className="page-heading"><div><span className="section-number">02</span><p className="kicker">READY-MADE SCENARIO</p></div><h1>오늘은 성수에서<br />천천히 걸어볼까요?</h1><p>완성도 높은 데모를 위해 한 가지 준비된 조건으로 코스 세 개를 비교합니다.</p></div>
    <article className="scenario-card selected-card"><div className="scenario-photo"><img src="/seongsu-date.png" alt="서울숲과 성수동 산책길" /><span><Icon name="check" size={16} /> 선택됨</span></div><div className="scenario-content"><div className="scenario-title"><div><p>성수 산책 데이트</p><h2>건대입구역에서 시작</h2></div><span>추천 시나리오</span></div><div className="condition-grid"><Condition label="데이트 지역" value="성수 · 서울숲" /><Condition label="교통수단" value="지하철 + 도보" /><Condition label="분위기" value="산책 · 전시" /><Condition label="활동 예산" value="8만 원 이하" /></div></div></article>
    <div className="sample-banner"><span>i</span><p><strong>준비된 샘플이에요.</strong> 장소·이동시간·평점은 실제 조회 결과가 아닌 시연용 데이터입니다.</p></div>
    <button className="primary-button plan-cta" onClick={onSubmit} disabled={loading}>{loading ? "코스 세 개를 구성하고 있어요…" : "성수 샘플 코스 3개 비교하기"}<Icon name="arrow" /></button>
    {loading && <div className="loading-panel" role="status"><span className="loading-route"><i /><i /><i /></span><p>첫 장소까지의 이동과 주변 식당을 확인하고 있어요.</p></div>}
  </section>;
}

function Condition({ label, value }) { return <div><span>{label}</span><strong>{value}</strong></div>; }

function ResultsScreen({ selected, selectedId, onSelect, onBack, onRestaurant }) {
  const routeUrl = `https://map.kakao.com/link/by/traffic/건대입구역,37.540408,127.069202/${encodeURIComponent(selected.destination)},${selected.destinationCoords}`;
  return <section className="results-screen content-screen">
    <div className="results-header"><div><button className="back-link" onClick={onBack}>← 조건 다시 보기</button><p className="kicker">3 ROUTES FOUND</p><h1>둘의 하루,<br />어떤 결이 좋을까요?</h1></div><div className="result-summary"><span>출발지</span><strong>건대입구역</strong><small>지하철 + 도보 · 활동비 8만 원 이하</small></div></div>
    <div className="route-tabs" role="tablist" aria-label="데이트 코스 비교">{routes.map((route) => <button key={route.id} role="tab" aria-selected={selectedId === route.id} className={selectedId === route.id ? "active" : ""} style={{ "--route-accent": route.accent }} onClick={() => onSelect(route.id)}><span>{route.eyebrow}</span><strong>{route.name}</strong><small>{route.tone}</small><div><b><Icon name="train" size={15} />{route.duration}</b><b>{route.cost}</b></div></button>)}</div>
    <div className="result-workspace"><div className="map-card"><div className="map-toolbar"><div><span className="live-dot" />선택한 코스</div><small>시연용 지도</small></div><RouteMap route={selected} /></div><aside className="route-detail"><div className="detail-heading"><span style={{ color: selected.accent }}>{selected.eyebrow}</span><h2>{selected.name}</h2><p>{selected.tone}</p></div><div className="start-route"><div className="start-route-head"><span className="train-icon"><Icon name="train" /></span><div><small>첫 장소까지</small><strong>건대입구역 → {selected.destination}</strong></div><b>{selected.duration}</b></div><div className="transit-line"><span>2</span><i /><span className="walk-icon"><Icon name="walk" size={14} /></span><p>{selected.transit}<small>샘플 예상시간</small></p></div><a className="kakao-button" href={routeUrl} target="_blank" rel="noreferrer">카카오맵에서 지하철 길찾기 <Icon name="external" size={17} /></a></div><div className="place-list"><div className="subsection-heading"><h3>코스에 담긴 장소</h3><span>식당 제외</span></div>{selected.places.map((place, index) => <article key={place.name}><span className="place-index" style={{ background: selected.accent }}>{index + 1}</span><div><div><strong>{place.name}</strong><small>{place.type}</small></div><p>{place.note}</p></div></article>)}</div></aside></div>
    <section className="restaurant-section"><div className="restaurant-heading"><div><p className="kicker">NEARBY TABLES</p><h2>코스에는 넣지 않았지만,<br />이 근처 식당은 좋아 보여요.</h2></div><p>코스 장소에서 <strong>도보 20분 이내</strong><br />샘플 평점 <strong>4.0 이상</strong>만 모았어요.</p></div><div className="restaurant-grid">{selected.restaurants.map((item) => <button key={item.name} className="restaurant-card" onClick={() => onRestaurant(item)}><div className="restaurant-top"><span>{item.type}</span><b><Icon name="star" size={15} fill="currentColor" /> {item.rating}</b></div><h3>{item.name}</h3><p>{item.near}에서</p><div className="walk-data"><span><Icon name="walk" size={18} />{item.walk}</span><i /><strong>{item.distance}</strong></div><small>샘플 평점·도보 거리</small></button>)}</div></section>
    <footer className="result-footer"><p>모든 장소·평점·비용·이동시간은 목업용 샘플입니다.</p><button onClick={onBack}>다른 조건으로 다시 보기</button></footer>
  </section>;
}

function RouteMap({ route }) {
  const points = route.places.map((place) => `${place.x},${place.y}`).join(" ");
  return <div className="map-visual" style={{ "--map-accent": route.accent }}><div className="river" /><span className="river-label">한강</span><div className="park patch-one">서울숲</div><div className="park patch-two" /><div className="road road-one" /><div className="road road-two" /><div className="road road-three" /><svg className="route-line" viewBox="0 0 100 100" preserveAspectRatio="none"><polyline points={points} /></svg>{route.places.map((place, index) => <button className="map-pin" key={place.name} style={{ left: `${place.x}%`, top: `${place.y}%` }} aria-label={`${index + 1}. ${place.name}`}><span style={{ background: route.accent }}><b>{index + 1}</b></span><em>{place.name}</em></button>)}<div className="map-legend"><span><i className="course-dot" />코스 장소</span><span><i className="food-dot" />주변 식당</span></div>{route.restaurants.map((item, index) => <span key={item.name} className="food-map-dot" title={item.name} style={{ left: `${[35, 63, 83][index]}%`, top: `${[52, 60, 43][index]}%` }} />)}</div>;
}

function RestaurantModal({ restaurant, onClose }) {
  const placeUrl = `https://map.kakao.com/link/map/${encodeURIComponent(restaurant.name)},${restaurant.coords}`;
  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}><section className="restaurant-modal" role="dialog" aria-modal="true" aria-labelledby="restaurant-title" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" onClick={onClose} aria-label="닫기"><Icon name="close" /></button><p className="kicker">SAMPLE RESTAURANT</p><div className="modal-title"><div><span>{restaurant.type}</span><h2 id="restaurant-title">{restaurant.name}</h2></div><b><Icon name="star" size={17} fill="currentColor" /> {restaurant.rating}</b></div><div className="modal-walk"><span><Icon name="walk" />{restaurant.near}에서</span><strong>{restaurant.walk} · {restaurant.distance}</strong></div><dl><div><dt>예상 가격</dt><dd>{restaurant.price}</dd></div><div><dt>추천 기준</dt><dd>평점 4.0 이상 · 도보 20분 이내</dd></div></dl><p className="modal-copy">코스의 방문 순서에는 포함되지 않아요. 두 사람의 식사 시간에 맞춰 자유롭게 선택해 보세요.</p><a className="kakao-button" href={placeUrl} target="_blank" rel="noreferrer">카카오맵에서 위치 보기 <Icon name="external" size={17} /></a><small className="sample-note">평점·거리·가격은 시연용 샘플 데이터입니다.</small></section></div>;
}
