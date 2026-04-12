---
trigger: always_on
---

# Migration Guidelines (Vue 3 to Next.js)

이 문서는 Vue 3 서비스를 Next.js로 마이그레이션하는 과정에서 준수해야 할 기술적 제약 사항과 에이전트 행동 지침을 정의합니다.

## 1. 커뮤니케이션 및 워크플로우
- **답변 언어**: 에이전트 세션에서의 모든 답변은 **한글**로 작성합니다.
- **커밋 메시지**: - 매 작업 후에는 해당 내용에 대한 커밋 메시지를 아래의 형태로 추천:
```
타입(fix, feat, chore, refactor 등...): 내용

- desc 1 (if needed)
...
```
- **작업 환경**: Windows 11 / Windows PowerShell (background command 사용시 주의)
- **작업 이후**: .agents/tasks/YYYYMMDDHHmmss_${what_you_did_in_snake_case}.md로 작업 내용 저장. 무엇을, 왜 그렇게 했는지에 초점을 맞추어 서술합니다.
- **테스트**: 간단한 테스트들은 해도 되지만, 브라우저 E2E 테스트(DOM 체크 등)은 무거운 작업이므로 하지 않습니다. 개발자에게 테스트를 요청합니다.

## 2. 기술 스택 및 라이브러리 제약
- **패키지 버전**: 모든 패키지는 현존 **최신 버전(latest)**을 사용합니다.
- **React Compiler**: React 19와 함께 제공되는 React Compiler를 사용하도록 설정하고 활용합니다.
- **Data Fetching**: 
  - `axios` 등의 서드파티 라이브러리를 사용하지 않고, 브라우저 내장 **fetch API**만 사용합니다.
- **상태 관리**:
  - **Client State**: `Zustand`
  - **Server State**: `TanStack Query` (React Query: 일반 컴포넌트에서 직접 useQuery 사용 금지)
- **날짜 라이브러리**: `dayjs`를 사용합니다.

## 3. SEO 및 렌더링 전략
- **SEO 우선**: 이 프로젝트는 SEO를 위한 **Universal Rendering** 용도입니다.
- **데이터 흐름**: 
  - 별도의 API 서버가 존재하므로 Next.js 내에서 **Server Actions를 사용하지 않습니다.**
  - Next.js 내에 별도의 API Route를 작성하지 않습니다. (철저히 프론트엔드 역할만 수행)

## 4. 스타일링 가이드라인
- **Tailwind CSS**: Utility-first 방식으로 작성합니다.
- **Dark Mode & Semantic CSS**:
  - CSS 클래스에 직접적인 색상값(예: `text-black`, `bg-white`)을 하드코딩하는 것을 지양합니다.
  - **Semantic CSS Variable**을 사용하여 다크모드를 지원합니다.
  - 예: `var(--text-base)`는 라이트 모드에서는 검정색, 다크 모드에서는 흰색을 가리키도록 설정합니다.
- 모든 컴포넌트의 루트 클래스명은 해당 컴포넌트의 이름을 dash-case로 만든 것을 넣는다. (ex: MainSection.tsx => className="main-section ...")

## 5. 국제화 (i18n)
- **i18n 원칙**: 템플릿(JSX) 내에 문자열을 하드코딩하지 않습니다.
- **함수 사용**: 항상 `i18n('key')` 형태(또는 설정된 i18n 라이브러리의 함수)로 키를 호출하여 사용합니다.
- **관리 구조**: 언어별 키-밸류는 관리가 용이하도록 **Nested JSON** 구조로 구성합니다.

## 6. Vue 코드를 기반으로 마이그레이션을 진행하게 되는데, 원래 코드와 완전히 논리적으로 동일할 필요가 없으며 비슷하게 동작하면 됨. 원래 코드가 지닌 문제점이 있다면 개선해서 마이그레이션 필요. 아이콘도  원래 코드베이스의 그것과 완전히 동일한게 없다면 lucide-react에서 가장 비슷한 것을 사용하면 됨.