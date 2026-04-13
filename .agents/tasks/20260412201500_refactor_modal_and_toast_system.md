# TASK: Refactor Modal and Toast System

## WHAT
- 유연하고 확장 가능한 모달 시스템 개발 (React Component 기반)
- 다중 토스트 지원 및 상단 배치로 개선
- UI 전반의 가시성 및 애니메이션 고도화

## WHY
1. **모달 아키텍처 개선**: 기존 문자열 매핑 방식에서 React 컴포넌트 직접 전달 방식으로 변경하여 타입 안정성과 유연성을 확보했습니다. Vue의 `ModalBasic` 패턴을 `ModalBasic.tsx`로 이식하여 `alert`, `confirm` 등이 일관된 템플릿을 공유하도록 했습니다.
2. **토스트 시스템 강화**: 단일 토스트만 표시되던 것을 다중 토스트(Stacking) 지원으로 변경하여 알림의 연속성을 확보했습니다. 시각적 가시성을 위해 하단에서 상단 중앙으로 위치를 조정했습니다.
3. **사용자 경험(UX) 디테일**:
   - 모달 백드롭 클릭 시 닫기 기능 추가.
   - 모든 대화형 요소(X 버튼, 확인/취소 버튼 등)에 `cursor-pointer` 적용.
   - 다크 모드 및 라이트 모드 모두에서 명확한 시인성을 위해 그림자(shadow-2xl)와 테두리(border) 강화.
   - 부드러운 전환을 위한 `fade-in`, `slide-down` CSS 애니메이션 구현.

## HOW & WHY
- **Zustand Store**: `toasts` 배열을 통해 상태를 관리하며, 각 토스트는 개별 타임아웃을 가집니다.
- **Generic Components**: `UIRoot`는 더 이상 특정 모달 타입을 알 필요가 없으며, 단순히 주입된 컴포넌트를 렌더링하도록 일반화했습니다.
- **Tailwind & Vanilla CSS**: 복잡한 애니메이션 라이브러리 대신 `globals.css`의 키프레임을 활용하여 가볍고 빠른 전환 효과를 구현했습니다.

## RESULT
- `ui.modal.custom`, `ui.modal.alert`, `ui.modal.confirm` 등이 보다 직관적으로 통합되었습니다.
- 서비스 전반의 알림 및 모달 인터랙션이 더 정교하고 프리미엄한 느낌을 주게 되었습니다.
