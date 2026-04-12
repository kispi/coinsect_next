# next-intl Removal & Custom i18n Implementation

## 작업 목적 및 요구 사항
`next-intl` 라이브러리를 완전히 제거하고, Zustand 스토어와 연동되는 **커스텀 전역 i18n 시스템**을 구축하여 번역 데이터 관리의 유연성과 성능을 확보함. 이제 모든 컴포넌트에서 `t('SETTINGS.VALUES.FAVORITES')`와 같이 전체 경로(Full Path)를 사용하여 직관적으로 번역 데이터를 호출할 수 있습니다.

## 핵심 구현 내용

### 1. 커스텀 i18n 코어 로직 (`src/lib/i18n.ts`)
- 도트 표기법(A.B.C)을 해석하여 중첩된 JSON 구조에서 값을 찾아오는 `getNestedValue` 유틸리티를 구현했습니다.
- `{count}` 또는 `:count` 형태의 파라미터 치환을 지원하는 `translate` 함수를 작성했습니다.

### 2. Zustand 스토어 통합 (`src/store/useAppStore.ts`)
- 스토어 내에 `messages` 상태를 추가하여 클라이언트 측 번역 데이터를 관리합니다.
- `locale` 변경 시 `/locales/[locale].json` 파일을 실시간으로 `fetch`하여 메시지를 갱신하는 `loadMessages` 액션을 추가했습니다.
- 서버 측 SSR 데이터를 클라이언트 스토어로 즉시 동기화하는 `setMessages` 액션을 구현했습니다.

### 3. 인프라 및 훅 리팩토링
- **useI18n.ts**: `next-intl` 의존성을 제거하고, Zustand 스토어의 메시지를 참조하여 전역 경로를 지원하는 `t()` 함수를 제공하도록 수정했습니다.
- **Providers.tsx**: 서버에서 내려준 초기 메시지를 Zustand 스토어에 주입(Hydration)하도록 변경했습니다.
- **layout.tsx**: `next-intl/server` 의존성을 제거하고, `fs`를 통해 서버 사이드에서 번역 파일을 직접 읽어 초기 상태를 생성하도록 최적화했습니다.

### 4. 전역 컴포넌트 리팩토링
- 다음 컴포넌트들의 번역 호출 방식을 전역 경로 방식으로 일괄 전환했습니다:
    - `SettingsPanel`, `AppHeader`, `CPosition`, `DashboardsMain`, `MainSection`, `BannerMarketIndices` 등.
- 하드코딩되어 있던 "SIGN IN", "내 활동", "로그아웃" 등의 문자열을 `COMMON` 및 `SETTINGS` 네임스페이스로 이전하고 번역 적용했습니다.

### 5. 클린업
- `DynamicI18nProvider.tsx` 및 `src/i18n/request.ts` 파일을 삭제했습니다.
- `npm uninstall next-intl`을 통해 관련 패키지를 완전히 제거했습니다.

## 검증 결과
- [x] **언어 변경**: 설정 패널에서 언어 변경 시, 스토어가 새 JSON을 로드하고 전체 UI가 즉각 업데이트됨을 로직상 확인.
- [x] **중첩 경로**: `t('SETTINGS.VALUES.ON')`과 같은 전체 경로 호출이 정상 작동함.
- [x] **SSR**: 서버에서 읽은 대시보드 타이틀 등이 초기 렌더링 시 깜빡임 없이 번역된 상태로 노출됨.
