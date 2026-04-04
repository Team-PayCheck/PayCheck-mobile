---
name: paycheck-hook
description: "PayCheck-mobile 프로젝트에서 커스텀 훅을 만들거나 API 연동을 추가할 때 사용. '훅 만들어줘', 'API 연동해줘', '데이터 페칭 추가해줘', '스토어 업데이트해줘' 같은 로직 단위 작업에 트리거. UI 변경 없이 데이터 로직만 다루는 작업에 사용."
---

# PayCheck Hook Skill

커스텀 훅/API 모듈/Zustand 스토어 작업을 `paycheck-logic` 서브 에이전트로 처리한다.

## 실행 모드: 서브 에이전트 (paycheck-logic)

## 워크플로우

### Phase 1: 컨텍스트 파악

1. 유사한 기존 훅이 있는지 확인 (`src/hooks/` Glob)
2. 연동할 API 엔드포인트가 이미 있는지 확인 (`src/api/`)
3. 관련 타입이 이미 정의되어 있는지 확인 (`src/types/`)

### Phase 2: 구현

paycheck-logic 에이전트를 서브 에이전트로 호출:

```
Agent(
  subagent_type: "paycheck-logic",
  model: "opus",
  prompt: "[작업 설명] + [관련 기존 파일 경로] + [API 스펙 (있을 경우)]
  
  구현 요건:
  - 기존 훅 패턴 유지 (useState + useCallback + useEffect)
  - API 모듈 패턴 유지 (AxiosError 래핑)
  - 반환값: { data, isLoading, refetch, ... }
  - TypeScript 타입 명시
  - 완료 후 파일 목록과 훅 인터페이스(반환값, 파라미터) 요약 반환"
)
```

### Phase 3: 결과 정리

1. 생성된 파일 목록과 훅 사용법을 사용자에게 보고
2. 컴포넌트에서 어떻게 사용하면 되는지 간단한 사용 예시 제공

## 에러 핸들링

- 백엔드 API 스펙 불명확: 기존 유사 API 기반으로 타입 추론 후 주석으로 "백엔드 확인 필요" 명시
- 기존 훅 확장 vs 새 훅 생성: 관련성이 높으면 확장 우선

## 기존 훅 위치

```
src/hooks/worker/      # 근로자 훅
src/hooks/employer/    # 고용주 훅
src/hooks/common/      # 공통 훅
src/api/worker/        # 근로자 API
src/api/employer/      # 고용주 API
src/stores/            # Zustand 스토어
src/types/api.types.ts # ApiResponse<T> 공통 타입
```
