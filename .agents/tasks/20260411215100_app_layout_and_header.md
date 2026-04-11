# 20260411215100 App Layout and Header Dropdown Refactoring

## 작업 내용

1. **포지션 섹션(REAL_TIME_POSITIONS) 레이아웃 수정**
   - **무엇을:** `DashboardsMain.tsx` 의 포지션 노출 컴포넌트 부모 래퍼를 수평 스크롤(`overflow-x-auto`)에서 수직형 전체 사이즈 컨테이너(`flex-col gap-2 w-full`)로 수정했습니다.
   - **왜:** 가로 공간을 충분히 이용해 정보량이 많은 포지션의 미실현손익(PNL), 진입가, 청산가 등을 스크롤 없이 한 눈에 파악할 수 있도록 하기 위함입니다.

2. **React Best Practice 적용: `WrapperDropdownOverlay` 대체 컴포넌트 개발**
   - **무엇을:** 기존 Vue에서 윈도우 스크롤 위치 및 절대 좌표를 계산하며 Fixed 방식으로 띄웠던 `WrapperDropdownOverlay`를 순수 React Hook(`useClickOutside.ts`)과 상대 부모에 종속되는 Absolute Dropdown 컴포넌트(`Dropdown.tsx`)로 재구현했습니다.
   - **왜:** 브라우저 성능에 악영향을 미치는 직접적인 DOM `getBoundingClientRect` 계산이나 `resize` 이벤트 바인딩 없이, React의 상태 의존성 주기(`useEffect`)로 외곽 영역 클릭(Click Outside)만 감지하는 가장 안전하고 깔끔한 관행(Best Practice)을 따랐습니다. 또한 CSS 구조상 `relative` 부모 안에 렌더링되게 하여 드롭다운이 엉뚱한 곳에 나타나지 않도록 개선했습니다. 

3. **`AppHeader.tsx` 및 `SettingsPanel.tsx` 포팅**
   - **무엇을:** Vue 버전의 `AppHeader.vue`를 본따 `lucide-react` 아이콘으로 컴포넌트를 구성했으며, 설정 및 드롭다운 기능을 `Dropdown.tsx`로 결합했습니다.
   - **왜:** 개발자님이 작성하신 `Zustand` 클라이언트 스토어(`useAppStore.ts`)를 실제로 실험해 볼 수 있도록, Locale, Currency, Theme 변경 시 Zustand 상태가 어떻게 갱신되고 localStorage에 동기화되는지 UI 단에서 연계해 두었습니다.

## 참고 및 제약
- Tailwind의 `animate-in` 관련 클래스가 적용되어 있어 별도의 플러그인 설정이 필요할 수 있습니다. 
- 추후 모바일 햄버거 메뉴를 위한 Navigation 등은 구조만 구성해 두었으므로 후속 작업이 필요합니다.
