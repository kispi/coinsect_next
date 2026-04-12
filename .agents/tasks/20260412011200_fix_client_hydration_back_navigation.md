# Task: Fix Client Hydration and Back Navigation State Loss

## 무엇을 했는가?
브라우저 뒤로 가기 시 발생하는 상태 초기화 문제와 Hydration 오류를 해결하고, 안정적인 클라이언트 상태 유지를 위한 인프라를 조정했습니다.

## 왜 그렇게 했는가?
1. **상태 손실 방지**: Next.js App Router 환경에서 라우팅 이동 후 복귀 시 Zustand 싱글톤 인스턴스가 중복되거나 리셋되는 현상을 방지하기 위해 Client Boundary를 명확히 했습니다.
2. **캐시 최적화**: React Query 인스턴스 생성을 컴포넌트 라이프사이클 내부로 이동시켜 SSR 도중의 메모리 누수를 방지하고, 캐시 정책(`staleTime`, `gcTime`)을 조정하여 뒤로 가기 시 데이터 복구 속도를 높였습니다.
3. **안정성 확보**: 404 트리 리셋 등으로 인한 뷰 깨짐 현상을 방지하기 위해 필수 라우트 껍데기를 생성하고, 번역 데이터의 동기식 초기화 로직을 강화했습니다.

## 기술적 결정 사항
- **Client Singleton**: 스토어 파일(`useAppStore.ts`, `useMarketStore.ts`) 최상단에 `'use client'`를 명시하여 브라우저 환경에서의 싱글톤 구조를 확립했습니다.
- **Provider 패턴**: `Providers.tsx`에서 `QueryClient`를 `useState`로 관리하여 리렌더링 시에도 동일 인스턴스를 유지하도록 보장했습니다.

## 결과
- 뒤로 가기 시 상태가 초기화되거나 번역 키가 노출되는 현상이 완전히 해결되었습니다.
- 클라이언트 사이드 네비게이션이 매끄럽게 동작하며, 캐시된 데이터가 효율적으로 재사용됩니다.
