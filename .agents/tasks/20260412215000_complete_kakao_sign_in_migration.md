# TASK: Kakao Sign-In Migration and Auth Bootstrap Implementation

## WHAT
기존 Vue 3 프로젝트의 카카오 로그인 모달(`ModalSignIn.vue`)을 Next.js 환경으로 마이그레이션하고, 쿠키 기반의 인증 세션 관리 및 앱 부트스트랩 로직을 통합하여 인증 시스템을 구축했습니다.

## WHY
1. **보안성 강화**: 기존의 `localStorage` 방식은 XSS 공격에 취약할 수 있으므로, 브라우저 `cookie`와 `in-memory` 캐싱을 조합하여 토큰을 더 안전하게 관리하도록 개선했습니다.
2. **초기 로딩 속도 및 UX 최적화**: 앱이 뜰 때(`bootstrap`) 쿠키에서 토큰을 즉시 읽어 세션을 복구함으로써, 사용자가 새로고침을 하더라도 로그인 상태가 끊김 없이 유지되도록 설계했습니다.
3. **코드의 재사용성과 일관성**: 스크립트 지연 로드 로직을 공통 DOM 유틸리티로 분리하고, 인증 비즈니스 로직을 커스텀 훅(`useKakao`, `useMeQuery`)으로 캡슐화하여 유지보수성을 높였습니다.

## HOW & WHY
- **Memory + Cookie Sync**: API 클라이언트 수준에서 `inMemoryToken`을 관리하여 매 요청마다 저장소에 접근하는 오버헤드를 줄이고, `AppInitializer`를 통해 쿠키와 스토어를 동기화했습니다.
- **Reactive Auth State**: Zustand 스토어의 `authToken` 상태를 리액티브하게 관리하여, 로그인 성공 즉시 `me` 정보 조회와 헤더 UI 업데이트가 연쇄적으로 발생하도록 구현했습니다.
- **Lazy SDK Loading**: 카카오 SDK가 필요한 시점에만 로드되도록 하고, 초기화 완료 시점(`Promise`)을 보장하여 런타임 에러를 원천 차단했습니다.

## RESULT
- 인증 토큰이 쿠키에 안전하게 저장되며, API 요청 시 `Authorization` 헤더가 정상적으로 포함됩니다.
- 로그인 성공 즉시 헤더가 사용자 모드로 전환되며, 새로고침 시에도 사용자 정보가 자동으로 복구됩니다.
- 모든 인증 로직이 명확한 관심사 분리에 따라 구현되어 향후 다른 소셜 로그인(Google, Apple 등) 확장 시에도 유연하게 대처할 수 있습니다.
