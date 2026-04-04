---
name: paycheck-review
description: "PayCheck-mobile 프로젝트에서 작성한 코드를 검토할 때 사용. '코드 리뷰해줘', '이 파일 검토해줘', '문제 없는지 봐줘', '이슈 있는지 확인해줘' 같은 검토 요청에 트리거. 구현 완료 후 품질 확인, PR 전 최종 점검에 사용."
---

# PayCheck Review Skill

작성된 코드를 `paycheck-qa` 서브 에이전트로 검토한다.

## 실행 모드: 서브 에이전트 (paycheck-qa)

## 워크플로우

### Phase 1: 검토 범위 파악

사용자가 파일을 지정했으면 해당 파일, 지정하지 않았으면 최근 변경 파일(`git diff`로 확인) 검토.

### Phase 2: 코드 검토

paycheck-qa 에이전트를 서브 에이전트로 호출:

```
Agent(
  subagent_type: "paycheck-qa",
  model: "opus",
  prompt: "다음 파일들을 검토한다: [파일 경로 목록]
  
  검토 항목:
  1. 공용 컴포넌트 재사용 여부 (Text, BottomSheetModal, WheelPicker, PrimaryButton, Pagination)
  2. RN 특유 이슈 (WheelPicker+ScrollView 중첩, 애니메이션 리셋, 키보드 회피)
  3. 새로 설치된 네이티브 패키지 → 빌드 재필요 여부
  4. TypeScript 타입 정합성
  5. 색상 하드코딩 (colors.ts 사용 여부)
  6. 코딩 컨벤션 (파일명, 훅 패턴, StyleSheet.create)
  
  결과 형식:
  - ✅ 통과 항목
  - ⚠️ 주의 사항
  - ❌ 수정 필요 항목 (파일명:줄번호 + 이유 + 수정 방향)
  - 🔨 빌드 재필요 여부"
)
```

### Phase 3: 결과 보고

검토 결과를 사용자에게 구조화하여 보고:
```
## 코드 리뷰 결과

✅ 통과: [항목]
⚠️ 주의: [항목]
❌ 수정 필요: [파일:줄번호 - 이유]
🔨 빌드 재필요: [있음/없음]
```

## 에러 핸들링

- 파일 경로 불명확: 사용자에게 파일 목록 요청
- git diff가 비어있으면: 검토할 파일 경로 직접 요청
