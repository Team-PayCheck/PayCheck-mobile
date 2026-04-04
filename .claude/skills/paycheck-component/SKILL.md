---
name: paycheck-component
description: "PayCheck-mobile 프로젝트에서 단일 컴포넌트/화면을 만들거나 수정할 때 사용. '이 컴포넌트 고쳐줘', '카드 만들어줘', '모달 수정해줘', '스타일 바꿔줘' 같은 UI 단위 작업에 트리거. 훅/API 변경 없이 UI만 다루는 작업에 사용."
---

# PayCheck Component Skill

단일 컴포넌트/화면의 생성·수정 작업을 `paycheck-ui` 서브 에이전트로 처리한다.

## 실행 모드: 서브 에이전트 (paycheck-ui)

## 워크플로우

### Phase 1: 컨텍스트 파악

1. 대상 파일이 있으면 먼저 Read로 읽기
2. 유사한 기존 컴포넌트가 있는지 확인 (`src/components/` Glob)
3. 재사용 가능한 공용 컴포넌트 목록 확인

### Phase 2: 구현

paycheck-ui 에이전트를 서브 에이전트로 호출:

```
Agent(
  subagent_type: "paycheck-ui",
  model: "opus",
  prompt: "[작업 설명] + [대상 파일 경로] + [현재 코드 스니펫] + [요구사항]
  
  주의사항:
  - 기존 컴포넌트 먼저 확인 후 재사용
  - Text 컴포넌트는 항상 components/common/Text 사용
  - colors.ts에서 색상 import
  - 완료 후 변경된 파일 목록과 변경 내용 요약 반환"
)
```

### Phase 3: 결과 정리

1. 변경된 파일과 주요 변경 내용 사용자에게 보고
2. 네이티브 모듈 추가가 있으면 빌드 필요 여부 안내

## 에러 핸들링

- 파일 경로 불명확: Glob으로 검색 후 진행
- 기존 컴포넌트와 충돌: 사용자에게 선택지 제시

## 자주 쓰는 공용 컴포넌트 경로

```
src/components/common/Text.tsx          # 모든 텍스트
src/components/common/PrimaryButton.tsx # CTA 버튼
src/components/common/BottomSheetModal.tsx
src/components/common/WheelPicker.tsx   # ScrollView 안 사용 주의
src/components/common/Pagination.tsx
src/components/worker/salary/WorkplaceTabSelector.tsx
src/constants/colors.ts                 # 색상 상수
```
