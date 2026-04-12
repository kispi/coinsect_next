# Task: i18n Fix and UI System Alignment

## 무엇을 했는가?
`SettingsPanel.tsx`에서 발생하는 i18n 에러를 해결하고, 전역 UI 시스템(Modal, Toast, Snackbar)을 기존 Vue 버전의 디자인과 로직에 맞춰 리팩토링했습니다.

## 왜 그렇게 했는가?
1. **i18n 안정성 확보**: 번역 키가 누락되거나 리터럴을 직접 호출하여 발생하던 `MISSING_MESSAGE` 에러를 해결하기 위해 번역 파일을 보강하고 호출 방식을 표준화했습니다.
2. **글로벌 UI 일관성**: Vue 앱의 `app.ts` 관리 방식을 이식하여 Toast와 Snackbar의 동작 및 시각적 스타일을 기존 서비스와 동일하게 맞췄습니다.
3. **사용자 인터렉션 개선**: 설정 초기화와 같은 중요 동작에 `window.confirm` 대신 구현된 커스텀 모달(`ui.modal.confirm`)을 적용하여 UX 품질을 높였습니다.

## 기술적 결정 사항
- **Store 정렬**: `useUIStore.ts`의 상태 구조를 기존 데이터 스키마와 1:1로 대응시켜 마이그레이션 효율을 극대화했습니다.
- **Visual Parity**: 기존 Vue 컴포넌트(`ModalBasic.vue`, `AppToast.vue` 등)의 스타일 수치와 애니메이션을 React와 Tailwind로 정밀하게 재현했습니다.

## 결과
- 설정 패널 내 모든 텍스트가 정상적으로 번역되어 노출됩니다.
- 서비스 전반에서 기존 서비스와 동일한 사용자 경험을 제공하는 완성도 높은 모달 및 토스트 시스템이 정착되었습니다.
