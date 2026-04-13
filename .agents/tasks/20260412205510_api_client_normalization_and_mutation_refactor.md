# TASK: API Client Normalization and Mutation Refactory

## WHAT
API 클라이언트의 URL 결합 로직을 유연하게 개선하고, 포지션 변경 요청 로직을 TanStack Mutation 패턴으로 리팩토링했습니다.

## WHY
1. **URL 결합의 유연성 확보**: `BASE_URL`과 `endpoint` 사이의 슬래시(`/`) 중복이나 누락 문제에 신경 쓰지 않아도 되도록 자동 정규화 로직을 도입했습니다.
2. **타입 안정성과 편의성 사이의 균형**: 처음에는 타입 레벨에서 `/` 시작을 강제하려 했으나, 실제 개발 편의성을 고려하여 어떤 형식이든 "그냥 잘 작동하게" 만드는 방향으로 선회했습니다.
3. **모던한 상태 관리 적용**: 컴포넌트 내부에서 수동으로 관리하던 로딩/에러 상태를 TanStack Query의 `useMutation`으로 대체하여 코드의 가독성과 선언성을 높였습니다.

## HOW & WHY
- **Robust Path Joining**: `baseUrl`과 `path`를 각각 정규화하여 항상 하나의 슬래시로 연결되도록 구현했습니다.
- **Custom Mutation Hook**: `usePositionChangeMutation`을 별도 파일로 분리하여 컴포넌트와 비즈니스 로직을 격리했습니다.

## RESULT
- `api.get('posts')`와 같이 슬래시를 생략해도 정상적으로 요청이 전송됩니다.
- `ModalPositionRequestEdit` 컴포넌트의 코드가 더 간결해졌으며, API 요청 상태를 효율적으로 관리하게 되었습니다.
