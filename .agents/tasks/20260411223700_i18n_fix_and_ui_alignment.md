# 20260411223700 i18n Fix & UI System Alignment

`SettingsPanel.tsx`에서 발생하던 i18n 에러를 해결하고, 전역 UI 시스템(Modal, Toast, Snackbar)을 기존 Vue 버전의 디자인과 로직에 맞추어 전면 리팩토링했습니다.

## 주요 작업 내역

### 1. i18n & Locales 수정
- **문제 원인**: `SettingsPanel` 내에서 번역 키가 아닌 리터럴 값(KO, EN, ☀️ 등)을 `t()` 없이 출력하거나, 번역 파일에 없는 하위 키(`VALUES.ON`)를 호출하여 `MISSING_MESSAGE` 에러가 발생했습니다.
- **해결 내역**:
    - `ko.json`, `en.json`에 `SETTINGS.VALUES` 하위 키(`ON`, `OFF`, `KO`, `EN`, `KRW`, `USD`)를 모두 추가했습니다.
    - `SettingsPanel.tsx`에서 모든 설정값을 `t()` 함수를 통해 번역 키 방식으로 호출하도록 표준화했습니다.

### 2. 글로벌 UI 시스템 정렬 (Vue app.ts 기준)
- **Store 리팩토링**: `useUIStore.ts`의 상태 구조를 Vue의 `app.ts`와 동일하게 맞췄습니다 (Toast 단일 객체 관리, Snackbar 스택 관리 등).
- **Helper 업데이트**: `ui.ts`의 API를 Vue의 `helpers.modal`, `helpers.toast`와 유사하게 호출할 수 있도록 개선했습니다.
- **Visual Parity (UIRoot.tsx)**:
    - **Modal**: `ModalBasic.vue` 스타일 적용 (480px 고정 너비, 중앙 정렬, 전용 버튼 스타일).
    - **Toast**: `AppToast.vue` 스타일 적용 (하단 64px 위치, slide-up 애니메이션, 전용 배경색).
    - **Snackbar**: `AppSnackbar.vue` 스타일 적용 (우하단 스택형, 정보/경고 아이콘 지원).

### 3. SettingsPanel 고도화
- **Confirm 대체**: "설정 초기화" 클릭 시 브라우저 기본 `window.confirm` 대신, 새롭게 구현된 **커스텀 모달(`ui.modal.confirm`)**이 호출되도록 변경했습니다.
- **코드 정리**: 불필요한 `React` import 제거 및 타입 정의를 최적화했습니다.

## 검증 결과
- [x] **i18n**: 설정 패널 내 모든 텍스트(KO, EN, ON, OFF 등)가 에러 없이 정상 번역됨을 확인.
- [x] **모달**: 설정 초기화 클릭 시 480px 너비의 커스텀 모달이 정상 노출되며, 승인/취소 로직이 올바르게 작동함.
- [x] **토스트/스낵바**: 기존 Vue 앱과 동일한 위치와 스타일로 노출됨을 로직상 확인.

---

### 추천 커밋 메시지
```
fix(i18n): resolve missing message errors in SettingsPanel and align UI system

- Standardize settings translation keys in ko.json and en.json
- Refactor useUIStore and UIRoot to match Vue's Modal/Toast/Snackbar architecture
- Replace window.confirm with custom ui.modal.confirm in SettingsPanel
- Update ui helper API for better compatibility with legacy helpers
```
