# TASK: App Layout and Header Dropdown Refactoring

## WHAT
`DashboardsMain.tsx`의 레이아웃 구조를 개선하고, 안정적인 드롭다운 시스템(`Dropdown.tsx`)과 헤더 컴포넌트를 구현했습니다.

## WHY
1. **레이아웃 가시성 개선**: 포지션 섹션의 수평 스크롤을 제거하고 수직형 컨테이너로 변경하여 주요 지표(PNL, 진입가 등)를 한눈에 파악할 수 있도록 했습니다.
2. **React 관행 준수**: 복잡한 DOM 좌표 계산 대신 `useClickOutside` 훅을 활용한 상대 좌표 방식의 드롭다운을 구현하여 성능과 안정성을 확보했습니다.
3. **상태 연동 및 Scaffolding**: `AppHeader.tsx`와 `SettingsPanel.tsx`를 구현하여 Zustand 스토어와 UI를 연동하고 다국어/테마 변경 기능을 활성화했습니다.

## RESULT
- 정보 밀도가 높은 대시보드 환경에 최적화된 레이아웃이 구성되었습니다.
- 불필요한 DOM 조작 없이 React의 선언적 방식으로 드롭다운 인터랙션을 구현했습니다.
- 테마와 다국어 설정이 즉각적으로 반영되는 사용자 환경이 마련되었습니다.
