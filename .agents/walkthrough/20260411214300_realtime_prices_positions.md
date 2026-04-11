# 20260411214300 Realtime Prices and Positions (Websockets) Migration

## 작업 내용

1. **상태 관리 (`useMarketStore`) 도입**
   - 글로벌 Zustand 상태로 `useMarketStore.ts`를 신규 생성하여, Binance, Upbit, Bybit의 웹소켓을 통한 실시간 시세 (Price 및 Direction)를 메모리에 관리하도록 구성하였습니다.

2. **개별 WebSocket Hooks 분리**
   - 기존 Vue 코드에서의 `useBinance`, `useUpbit`, `useBybit` 형태의 훅을 Next.js(React) 환경에 맞추어 `useEffect`와 `WebSocket` 네이티브 API를 활용한 Custom Hooks로 분리 작성하였습니다.
   - `useBinanceWs.ts`: Binance의 miniTicker를 구독.
   - `useUpbitWs.ts`: API Endpoint를 통한 Upbit ticker (KRW 마켓) 구독. 이벤트 데이터가 Blob/ArrayBuffer로 들어올 수 있는 점을 고려해 디코딩 처리 추가.
   - `useBybitWs.ts`: Bybit의 실시간 markPrice (linear/tickers) 구독.

3. **`RealTimePriceCards.tsx` 및 `RealTimePriceCard.tsx` 구현**
   - 기존 Vue의 `RealTimePriceCard.vue` 마크업, CSS 로직, 프리미엄(김프) 등을 React Component로 변환.
   - 부모 컴포넌트인 `RealTimePriceCards.tsx` 렌더링 시 Binance / Upbit 훅을 호출하여 웹소켓 데이터 흐름 구축.

4. **`CPosition.tsx` 구현 및 `DashboardsMain.tsx` 연동**
   - `CPosition.vue`의 레이아웃, `elapsedTime`, 뱃지, 실시간 PNL (미실현손익) 계산식 적용.
   - API를 통해 받아온 초기 데이터값의 `entryPrice` 에 현재 구독 중인 Bybit의 실시간 `markPrice`를 조합하여 로컬 단위에서 PNL을 재계산하도록 `useMemo` 적용. UI도 Danger(청산 위험점) 시 점멸 효과를 추가하였습니다.
   - `DashboardsMain.tsx`에서 활성화된 Bybit 마켓의 종목 코드를 취합(`contract`) 후 `useBybitWs`를 렌더링 시점에 1회 구독하도록 수정하여 모든 포지션 카드가 하나의 Bybit 소켓을 이용하도록 최적화.

## 마이그레이션 참고 / 추가 고려 사항
- 환율(`usdKrw`) 정보의 경우 Vue 버전의 `marketInfoService`처럼 `dashboards/main` 단에서 API로 내려오는지 검토 및 필요시 수동 갱신이 필요할 수 있습니다. (현재 스토어 초기값은 Fallback 목적으로 세팅해 두었습니다.)
- i18n 번역 키들은 추후 전체 파일 단위 포맷 적용시 일괄 반영 권장합니다.

