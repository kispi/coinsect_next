# Fix Client Hydration and Back Navigation State Loss (v2)

## 발생 현상
- 메인 페이지(`/`)에서 존재하지 않는 다른 라우트(`/community` 등, 404 페이지)로 `next/link`를 통해 이동했다가 브라우저 뒤로 가기(Back) 버튼을 누르면 상태 관리(Zustand)와 데이터 캐싱(React Query)이 모두 리셋되어 뷰가 깨지는 오류가 발생.
- `NO_SEARCH_RESULT` 또는 번역 키(e.g., `COMMON.KIMP`)가 노출되는 등 Hydration 실패 및 State Loss가 발생함.

## 원인
Next.js App Router 환경에서는 Client Component로 라우팅을 진행하더라도, 404 `notFound()` Error Boundary 등을 거치거나 잘못된 상태 설정에 따라 로컬 모듈 트리가 리셋되는 버그가 존재합니다. 
1. **Zustand Module Duplication**: `useAppStore` 및 `useMarketStore` 파일 최상단에 `'use client'`를 선언하지 않아, Next.js 모듈 분할에서 싱글톤이 중복되거나 언마운트 시 초기화되는 버그를 겪었습니다.
2. **React Query Scope Leak**: 쿼리 인스턴스 생성이 컴포넌트 라이프사이클 외부에 있어 SSR 도중 메모리 누수를 야기할 수 있으며, Next.js Router 탐색 과정에서 예기치 않은 캐시 플러시(flush)가 될 수 있습니다. 

## 수정한 내용
1. 404로 인한 Next.js 트리 리셋 방지 및 정상 네비게이션 복구 테스트를 위해 임시 라우터 폴더 및 빈 페이지 4종(`/community`, `/prices`, `/indicators/positions`, `/indicators/whale-alert`)을 껍데기로 생성.
2. `useAppStore.ts` 및 `useMarketStore.ts` 파일 최상단에 `'use client';` 명시하여 명확한 Client Boundary 및 싱글톤 구조 확립.
3. `Providers.tsx` 내 `QueryClient` 인스턴스 생성을 `useState` 내부로 이동.
4. `Providers.tsx`에서 React Query 캐시 세팅 적절히 조율 (`staleTime: 1분`, `gcTime: 5분` 적용)하여 무분별한 리패치 억제 및 뒤로가기 복원 최적화 완료.
5. Zustand 번역 State 동기식 초기화 강제 로직 추가 (`Providers.tsx` 내 렌더링 도중 선반영 처리).
