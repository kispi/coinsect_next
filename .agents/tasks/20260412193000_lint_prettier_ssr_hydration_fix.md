# Lint enforcement, Prettier setup and SSR Theme/Locale Hydration

## 작업 목적 및 요구 사항
- 프로젝트 전반에 걸쳐 코드 스타일이 통일되지 않았으며, 미사용 변수나 임포트(특히 `import React from 'react'`)가 코드에 남아 있어 유지보수 효율이 떨어짐.
- 기존에 Husky와 lint-staged가 설정되어 있지 않아 규칙을 강제하기 어려움.
- 페이지 새로고침 시 테마(Dark/Light)와 로케일(ko/en) 정보가 클라이언트 사이드에서만 적용되어, 초기 화면이 번쩍이는 현상(FOUC) 발생.
- Next.js 및 Tanstack Query Devtools가 화면을 가리고 있어 개발 방해.

## 수정한 내용
1. **Lint/Formatting 강제화**:
    * `husky`와 `lint-staged`를 도입하여 `pre-commit` 단계에서 린트 에러가 있는 코드의 커밋을 차단.
    * `eslint-plugin-unused-imports`를 추가하고 `@typescript-eslint/no-unused-vars`를 `error`로 설정하여 모든 미사용 코드(특히 `import React`)를 엄격하게 제거하도록 구성.
    * `.prettierrc`를 통해 세미콜론 제거, 일반 문자열 작은따옴표(''), JSX 내 큰따옴표("") 사용 규칙 확립.
    * Windows 환경의 줄바꿈 방식(CRLF) 대응을 위해 `endOfLine: "auto"` 추가.
2. **SSR Theme/Locale Hydration (번쩍임 방지)**:
    * `useAppStore.ts`에서 설정 변경 시 `NEXT_LOCALE`, `NEXT_THEME` 쿠키를 함께 업데이트하도록 수정.
    * `layout.tsx`에서 서버 사이드 쿠키를 읽어 `html` 태그에 직접 `lang` 속성과 `dark` 클래스를 주입하여 SSR 단계에서부터 테마와 언어가 적용되도록 개선.
    * `Providers.tsx`에서 서버로부터 전달받은 초기 설정값(initialProps)을 Zustand 스토어에 동기적으로 주입하여 클라이언트 하이드레이션 시점의 상태 불일치 해결.
3. **코드 정리 및 UI 개선**:
    * `Providers.tsx`에서 불필요한 `ReactQueryDevtools` 제거.
    * `DashboardsMain.tsx`에서 React Compiler와 충돌하던 수동 `useMemo` 캐싱 로직을 IIFE 패턴으로 변경하여 최적화 경고 해결.
    * `RealTimePriceCard.tsx`에서 실시간 티커 선택 시 토스트 알림(`ui.toast.success`)이 나오도록 i18n 키 추가 및 로직 구현.
    * `.agents` 폴더를 린트 및 포맷팅 대상에서 제외하여 에디터 및 에이전트 작업 방해 요소 제거.
