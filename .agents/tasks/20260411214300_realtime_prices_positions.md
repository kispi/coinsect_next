# TASK: Realtime Prices and Positions (Websockets) Migration

## WHAT
기존 Vue 코드베이스의 실시간 시세 및 포지션 관리 기능을 Next.js로 마이그레이션 하였습니다. Zustand를 통한 전역 상태 관리와 자산별 전용 WebSocket 훅을 구축했습니다.

## WHY
1. **상태 관리 (`useMarketStore`) 도입**
   - 글로벌 Zustand 상태로 `useMarketStore.ts`를 신규 생성하여, Binance, Upbit, Bybit의 웹소켓을 통한 실시간 시세 (Price 및 Direction)를 메모리에 관리하도록 구성하였습니다.

2. **개별 WebSocket Hooks 분리**
   - 기존 Vue 코드에서의 `useBinance`, `useUpbit`, `useBybit` 형태의 훅을 Next.js(React) 환경에 맞추어 `useEffect`와 `WebSocket` 네이티브 API를 활용한 Custom Hooks로 분리 작성하였습니다.

3. **컴포넌트 구현 및 최적화**
   - `RealTimePriceCards.tsx`, `CPosition.tsx` 등을 구현하여 마크업과 CSS 로직을 React 기반으로 이식했습니다.
   - 불필요한 중복 구독을 방지하기 위해 상위 컴포넌트에서 소켓을 관리하는 최적화를 수행했습니다.

## RESULT
- 웹소켓을 통한 실시간 데이터 흐름이 안정적으로 구축되었습니다.
- PNL 재계산 로직 및 UI 점멸 효과 등 디테일한 사용자 경험이 복원되었습니다.
- 환율(`usdKrw`) 정보의 경우 Vue 버전의 `marketInfoService`처럼 `dashboards/main` 단에서 API로 내려오는지 검토 및 필요시 수동 갱신이 필요할 수 있습니다. (현재 스토어 초기값은 Fallback 목적으로 세팅해 두었습니다.)
- i18n 번역 키들은 추후 전체 파일 단위 포맷 적용시 일괄 반영 권장합니다.

