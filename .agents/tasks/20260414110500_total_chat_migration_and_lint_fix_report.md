# TASK: [Chat System Migration & Linting Stabilization]

## WHAT
Vue 3 기반의 레거시 채팅 시스템을 Next.js (React 19) 환경으로 완벽하게 마이그레이션하고, 34개 이상의 ESLint 에러 및 경고를 전수 수정하여 안정적인 코드베이스를 확보했습니다.

## WHY
- **Migration**: 기존 Vue 코드를 현대적인 React 패턴으로 전환하여 성능과 유지보수성을 향상시켰습니다.
- **Stability**: WebSocket 연결의 신뢰성을 확보하고, 자동 스크롤 및 위치 초기화 로직의 버그를 수정했습니다.
- **Lint Compliance**: React 19의 엄격한 Hook 규칙과 Ref 사용 가이드를 준수하여 런타임 에러 가능성을 원천 차단했습니다.

## HOW & WHY

### 1. 전역 시스템 개선
- **`lib/chat.ts`**: 메시지 처리 로직(`processChatMessage`)을 중앙 집중화했습니다. WebSocket 데이터와 API 데이터를 동일한 규격으로 변환하며, 시스템 알림(Alert) 프로필 부여 및 고유 ID 생성을 보장합니다.
- **`StoreProvider.tsx`**: Zustand 스토어 접근 Hook(`useChatStore` 등)에서 조건부 Hook 호출 위반을 수정했습니다. 전달된 selector가 없을 경우 identity selector를 기본값으로 사용하도록 변경했습니다.
- **`AppPortal.tsx`**: hydration 불일치를 해결하기 위해 `useSyncExternalStore`를 도입했습니다.

### 2. 채팅 UI 및 경험 최적화
- **Scroll & Position**: `loadMore` 시 스크롤 점프 현상을 `scrollTop = scrollHeight - prevScrollHeight` 공식으로 해결했습니다. 채팅창 접기/펴기, 리사이즈 시 `resetPosition()`을 통해 항상 우측 하단에 적절히 위치하도록 보정했습니다.
- **Ref Safety**: `AppChatMessage.tsx`에서 렌더링 도중 Ref를 직접 참조하던 로직을 `useLayoutEffect`와 `pickerPosition` 상태를 통해 제어하도록 수정했습니다.
- **CDN Integration**: 모든 자산(ding.mp3 등)을 `withCdn` 유틸리티를 통해 처리하도록 마이그레이션했습니다.

### 3. 결함 수정 및 정비 (Lint Fix)
- **Temporal Dead Zone**: `useChatWs.ts`에서 `connect` 함수가 초기화되기 전에 참조되던 문제를 `useEffect` 내 핸들러 재할당 패턴으로 해결했습니다.
- **Dead Code removal**: 다수의 미사용 변수, import, state를 제거하여 코드 가독성을 높였습니다.
- **Modal Context**: `ModalChatUsers`와 `ModalChatSettings`의 열기/닫기 로직 및 이벤트 전파 문제를 해결했습니다.

## RESULT
- **ESLint Status**: 총 34개 이상의 에러를 0개로 클리어했습니다. (`npm run lint` 통과)
- **Functional**: WebSocket 채팅 발신/수신, 온라인 유저 목록 확인, 설정 변경, 이전 메시지 로드 등 모든 기능이 Vue 서비스와 동일하게(혹은 더 개선된 방식으로) 동작합니다.
- **Build Quality**: Next.js 빌드 시 경고 없이 성공하며, hydration 에러가 해결되었습니다.
