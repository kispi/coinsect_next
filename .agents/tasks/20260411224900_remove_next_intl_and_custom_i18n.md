# Task: next-intl Removal & Custom i18n Implementation

## 무엇을 했는가?
`next-intl` 라이브러리를 완전히 제거하고, Zustand 스토어와 연동되는 커스텀 전역 i18n 시스템을 구축했습니다.

## 왜 그렇게 했는가?
1. **관리 유연성 및 성능**: 외부 라이브러리 의존성을 줄이고, 번역 데이터 로딩 방식을 프로젝트에 최적화하여 성능을 개선했습니다.
2. **직관적인 경로 호출**: `t('SETTINGS.VALUES.FAVORITES')`와 같이 도트 표기법을 통한 전체 경로(Full Path) 호출을 지원하여 개발 생산성을 높였습니다.
3. **SSR 및 클라이언트 동기화**: 서버 사이드에서 초기 번역 데이터를 읽어 클라이언트 Zustand 스토어로 즉시 주입(Hydration)함으로써 깜빡임 없는 번역 환경을 구축했습니다.

## 기술적 결정 사항
- **Core 로직 분리**: 중첩 JSON 해석을 위한 `getNestedValue`와 파라미터 치환을 지원하는 `translate` 함수를 `lib/i18n.ts`로 모듈화했습니다.
- **Zustand 통합**: 스토어 내 `loadMessages` 액션을 통해 언어 변경 시 `/locales/[locale].json` 파일을 비동기적으로 fetch하도록 구현했습니다.

## 결과
- `next-intl` 패키지를 완전히 제거하여 번들 사이즈를 줄이고 외부 의존성을 낮췄습니다.
- 전체 UI 컴포넌트의 번역 호출 방식이 표준화되었으며, 언어 전환 시 UI가 즉각적으로 업데이트됩니다.
