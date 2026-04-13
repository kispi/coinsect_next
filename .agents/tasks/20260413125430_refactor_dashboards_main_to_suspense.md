# TASK: DashboardsMain 리팩토링 및 자유게시판 SSR 적용

## WHAT
- `DashboardsMain` 컴포넌트를 React `Suspense` 및 `ErrorBoundary` 기반으로 리팩토링했습니다.
- 범용적으로 재사용 가능한 `AppSkeleton` 컴포넌트를 구현했습니다.
- 메인 페이지(`src/app/page.tsx`)에서 자유게시판(boardId: 1) 데이터를 프리페치하도록 수정했습니다.
- `useDashboards` 및 `useBoardPosts` 훅에 `useSuspenseQuery` 지원을 추가했습니다.

## WHY
- **UX 개선**: 페이지 로딩 시 빈 화면 대신 실제 레이아웃과 유사한 스켈레톤을 제공하여 사용자 체감 속도를 높였습니다.
- **SSR 최적화**: 게시판 데이터를 서버사이드에서 미리 가져오게 함으로써, 초기 렌더링 시 데이터가 없는 상태에서 발생하는 레이아웃 시프트를 방지하고 SEO 성능을 향상시켰습니다.
- **코드 품질**: 명령형 로딩 상태 관리(`/if (!dashboards)/`)를 선언적인 `Suspense` 구조로 전환하여 유지보수성을 확보했습니다.

## HOW & WHY
- **Suspense & ErrorBoundary**: 비동기 데이터 처리를 컴포넌트 렌더링 흐름에서 분리하기 위해 `DashboardsContent`라는 내부 컴포넌트를 만들고, 이를 `Suspense`로 감쌌습니다.
- **AppSkeleton**: Tailwind의 `animate-pulse`와 Semantic CSS를 결합하여 유연한 스켈레톤 UI를 만들었으며, 이는 향후 다른 페이지에서도 활용 가능합니다.
- **SSR Prefetch**: TanStack Query의 `prefetchQuery`와 `HydrationBoundary`를 활용하여 서버에서 데이터를 직렬화해 내려줌으로써 클라이언트에서의 불필요한 첫 번째 요청을 제거했습니다.

## RESULT
- 메인 페이지 접속 시 스켈레톤 UI가 부드럽게 표시됩니다.
- 자유게시판 영역이 서버 사이드 렌더링 결과에 포함되어 즉시 노출됩니다.
- 에러 발생 시 전체 페이지가 깨지지 않고 대시보드 영역만 안전하게 에러 UI로 대체됩니다.
