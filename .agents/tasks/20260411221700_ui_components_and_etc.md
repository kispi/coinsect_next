# 20260411221700 Dashboard Migration Phase 2: UI, UX and Real-time Sync

본 세션에서는 대시보드의 시각적 완성도와 실시간 데이터 동기화 기능을 대폭 강화했습니다.

## 주요 작업 내역

### 1. UI/UX 리팩토링 및 다크모드 완성
- **포지션 레이아웃**: 가로 스크롤 위주의 구성을 세로형 전체 너비 레이아웃으로 변경하여 정보 가독성을 최대화했습니다.
- **Dropdown 아키텍처**: 직접적인 좌표 계산 방식을 버리고, React 관행에 맞는 `useClickOutside`와 상대 좌표 기반의 `Dropdown.tsx` 시스템을 구축했습니다.
- **다크모드 지원**: Zustand 전역 상태와 연동되는 `ThemeHandler`를 추가하고, `globals.css`를 Semantic CSS 변수 구조로 전면 개편하여 테마 전환 시 즉각적이고 자연스러운 UI 대응을 구현했습니다.

### 2. 전역 i18n 시스템 고도화
- **Nested JSON**: 번역 파일을 위계 구조로 리팩토링하여 관리 효율성을 높였습니다.
- **Graceful Fallback**: `next-intl`의 Strict 모드를 제어하여, 번역 키가 누락되더라도 앱이 중단되지 않고 키 이름을 그대로 노출하도록 안전 장치를 마련했습니다.
- **데이터 보강**: 지수 배너(`BannerMarketIndices`) 등에 필요한 필수 번역 키들을 모두 추가했습니다.

### 3. 글로벌 UI 유틸리티 (Modal/Toast) 이식
- **내용**: Vue 레포의 `helpers/modal.ts`, `toast.ts` 등의 기능을 React로 완벽하게 이식했습니다.
- **UI**: Framer Motion 느낌의 부드러운 애니메이션이 적용된 커스텀 모달 및 토스트 시스템(`UIRoot.tsx`)을 구축했습니다. 이제 `window.confirm` 대신 `ui.modal.confirm` 등을 통해 훨씬 고급스러운 사용자 경험을 제공합니다.

### 4. 실시간 데이터 동기화 (Websocket)
- **General WS**: `webchat` 소켓을 새롭게 연결하여 서버에서 발생하는 'Alert' 메시지를 감지합니다.
- **Cache Sync**: 포지션 수정 알림(`realTimePosition`) 수신 시 **React Query의 대시보드 캐시를 즉시 업데이트**합니다. 이를 통해 페이지 새로고침 없이도 다른 사용자가 수정한 포지션 정보가 내 화면에 실시간으로 반영됩니다.

### 5. 컴포넌트 마이그레이션 완료
- `AppHeader`: 네비게이션 및 설정 통합.
- `SettingsPanel`: 전역 설정 제어 (Zustand 연동).
- `BannerMarketIndices`: 상단 실시간 지수.
- `CPositionContextMenu`: 포지션별 상세 액션 메뉴.

## 검증 결과
- [x] 테마 전환 속도: 즉각 반응 확인.
- [x] i18n 누락 대응: 없는 키 호출 시 에러 없이 키 이름 출력 확인.
- [x] 모달/토스트: 전역 상태를 통해 원활하게 노출 및 해제 확인.
- [x] 실시간 업데이트: 소켓 메시지를 통한 React Query 데이터 갱신 로직 검증.

---
