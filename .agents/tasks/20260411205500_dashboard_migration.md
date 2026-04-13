# Task: 메인 라우트(Dashboard) 마이그레이션

## 무엇을 했는가?
기존 Vue 코드베이스의 `ViewMain.vue` 및 `DashboardsMain.vue`를 Next.js의 App Router 아키텍처 및 React 19 / Tailwind CSS 기반으로 마이그레이션 하였습니다.
또한 암호화된 API(`GET /dashboards/main`)를 복호화하는 기능과 주기적으로 데이터를 가져오는 것을 TanStack Query를 사용해 재구성했습니다.

## 왜 그렇게 했는가?
1. **API Polling 및 서버 상태 관리**
   - 기존 Vue 앱에서는 `setInterval`과 `vuex` 액션을 사용해 5분 단위로 데이터를 폴링했습니다. Next.js에서는 `TanStack Query`의 `refetchInterval: 300000` 옵션을 사용하여 폴링 코드를 간소화하고, React 컴포넌트 라이프사이클에 안전하게 통합했습니다.
   - API 응답을 자체 포맷에 맞춰 복호화하는 `cryptoUtils.decryptAPIResponse` 유틸리티를 추가했습니다.

2. **레이아웃 반응형 최적화**
   - `@media (min-width: 768px)` 등 기존 `scss` 파일을 배제하고 Tailwind CSS `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`를 통해 더 선언적이고 간명한 반응형을 구현했습니다.
   
3. **News Ticker의 CSS Animation 구현**
   - `<SectionNews />`에서 기존 Vue의 `keyframes slide`를 React 내부의 자체 `<style>` 및 inline Class로 마이그레이션했습니다. (Tailwind Arbitrary Variants도 가능하지만 독립적인 애니메이션 속성 관리를 위해 `<style>` 태그를 사용하였습니다.)
   - 요소의 길이가 끊임없이 유지되는 무한 스크롤(Marquee) 효과를 위해 동일한 뉴스 배열을 2배로 늘려서 연속 렌더링하도록 반영했습니다.

4. **점진적 마이그레이션을 위한 Scaffolding**
   - 게시글 리스트, 포지션, 웹 카드 등은 당장 세부 구현을 옮기기보다 컴포넌트(`RecentPosts`, `RealTimePriceCards`, `CPosition`, `WhaleAlertItem`) 껍데기를 먼저 마련해, Next.js 상에서 컴파일 에러가 발생하지 않도록 초기 기틀을 마련했습니다.

## 미해결 및 차후 작업 사항
- **WebSocket 연동**: `useRealTimePosition` (업비트 및 바이낸스 실시간 시세 관련 소켓) 연결은 아직 포팅되지 않았으므로 `RealTimePriceCards` 구현 시 추가해야합니다.
- **다국어 매핑**: `t('SEE_MORE')` 등 다국어 키 추가 작업이 `messages` 파일에 필요할 수 있습니다.
