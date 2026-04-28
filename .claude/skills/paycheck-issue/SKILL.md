---
name: paycheck-issue
description: "GitHub Issue 번호를 받아 이슈 분석 → 원인 진단 → exec-plan 생성 → 구현 → 사용자 테스트 대기 → PR 생성까지 책임지는 메인 진입점 스킬. 'issue #숫자 작업해줘', 'github issue #숫자', '#숫자번 이슈 해줘' 같은 요청이 오면 반드시 이 스킬을 사용할 것. 이슈 기반 작업의 유일한 시작점."
---

# PayCheck Issue Worker

GitHub Issue를 읽고, 원인을 검증하고, 구현하고, PR까지 책임지는 메인 진입점.

## 핵심 원칙

1. **이슈 본문의 추정 원인을 그대로 신뢰하지 않는다.** Phase 2.5에서 직접 검증한다.
2. **exec-plan은 머지 전 삭제한다. archive 폴더는 존재하지 않는다.**
3. **이슈/PR 작성은 항상 `.github/` 템플릿을 사용한다.**
4. **백엔드 원인이 의심되면 프론트 코드를 손대지 않고 백엔드 레포에 별도 이슈를 등록한다.**

## 워크플로우

### Phase 1: 이슈 파악

```bash
gh issue view {번호} --json title,body,labels,assignees,comments
```

추출할 정보:
- 제목 / 본문 (기능 설명, 요구사항)
- 레이블 (feature / bug / enhancement 등)
- 관련 화면/컴포넌트/API 언급
- 체크리스트 항목
- 코멘트의 추가 컨텍스트

### Phase 2: 작업 범위 판단

| 조건 | 다음 단계 |
|------|-----------|
| 새 화면 + 훅 + API 모두 필요 | Phase 3 (`paycheck-feature` 옵트인 모드 검토) |
| UI/컴포넌트 수정만 필요 | Phase 3 (`paycheck-component`) |
| 훅/API 로직만 필요 | Phase 3 (`paycheck-hook`) |
| 버그 수정 | **Phase 2.5 (반드시 진단 먼저)** |
| 리팩토링 | Phase 3 (범위에 따라 판단) |

판단이 애매하면 사용자에게 확인 요청. 임의로 큰 스킬로 라우팅하지 않는다.

### Phase 2.5: Root Cause 진단 (버그 또는 동작 이상)

이슈 본문이 원인을 추정하더라도 **그대로 받아들이지 말고 직접 검증한다.**

진단 절차:
1. 이슈 본문이 가리키는 파일/함수를 Read로 직접 확인
2. 데이터 흐름 추적: UI 입력 → 훅 → API 페이로드 → 응답 → 상태 업데이트 → 렌더
3. 각 단계가 정상 동작하는지 코드 레벨에서 검증
4. 실제 root cause를 식별하고 exec-plan에 기록 (이슈 추정과 다르면 명시)

진단 결과 분기:

| 결과 | 다음 단계 |
|------|-----------|
| 프론트엔드 원인 확정 | Phase 3 진행 |
| 백엔드 원인 의심/확정 | **Phase 2.6** |
| 원인 불명확 | 사용자에게 추가 재현 정보 요청 |

진단 결과가 이슈 본문 추정과 다르면 사용자에게 즉시 보고하고 진행 여부 확인.

### Phase 2.6: 백엔드 원인 처리

프론트 코드에 문제가 없고 백엔드 응답/처리가 원인이라고 판단되면:

1. 사용자에게 "백엔드 원인으로 추정됨" 보고. 백엔드 코드 확인 가능 여부 확인 (백엔드 레포 위치는 사용자가 알려줘야 함 — 팀원별로 로컬 환경이 다름)
2. 사용자가 백엔드 코드 위치를 제공하면:
   - Read로 root cause 파악 (수정은 금지 — CLAUDE.md "백엔드 코드 수정 제안 금지")
   - 정확한 파일:라인, 잘못된 동작, 권장 수정 방향까지 정리
3. 사용자 동의 후 백엔드 레포에 신규 이슈 등록:
   ```bash
   gh issue create -R {백엔드_레포_이름} \
     --label bug \
     --title "[Bug] {증상}" \
     --body "{본문 — .github/ISSUE_TEMPLATE/bug-report-template.md 형식 따름}"
   ```
   - 본문에는 재현 방법, 기대/실제 동작, 원인 분석(파일:라인), 수정 방향, 연관 프론트 이슈/PR 링크 포함
4. 프론트 이슈에 백엔드 이슈 링크를 코멘트로 남기고 워크플로우 종결

### Phase 3: 브랜치 생성

레이블과 제목 기반으로 작업 브랜치 생성.

| 레이블 | 접두사 |
|--------|--------|
| `bug` | `bug/` |
| `feature` 또는 `enhancement` | `feat/` (기존 enhancement도 feat로 통일) |
| 기타 | `chore/` |

**브랜치명 형식:** `{접두사}{제목-슬러그}#{이슈번호}`

- 슬러그: 소문자, 공백→하이픈, 특수문자 제거, 최대 30자

```bash
git checkout develop
git pull origin develop
git checkout -b {브랜치명}
```

같은 이름 브랜치 존재 시 체크아웃만 수행. develop pull 실패 시 사용자에게 알리고 현재 상태에서 진행.

### Phase 4: exec-plan 생성

`docs/exec-plans/active/YYYY-MM-DD-issue-{번호}-{슬러그}.md` 생성:

```markdown
# Issue #{번호}: {이슈 제목}

## GitHub Issue
{이슈 URL}

## 목표
{이슈 본문에서 추출한 목표}

## 현재 상태
작업 시작 전

## 작업 범위
- 라우팅: {paycheck-feature / paycheck-component / paycheck-hook / 직접 수정}
- 관련 도메인: {worker / employer / common}

## Root Cause 진단 (Phase 2.5 결과)
- 이슈 추정 원인: {본문 요약}
- 실제 root cause: {진단 결과 — 파일:라인 포함}
- 일치 여부: {일치 / 불일치 — 불일치 시 어떻게 다른지}

## 남은 작업
- [ ] ...

## 관련 파일
- src/...

## API 의존성
{언급된 엔드포인트}

## 완료 기준
{이슈의 acceptance criteria}

## 메모
{구현 시 결정사항, 주의점}
```

### Phase 5: 구현 실행

진단된 root cause에 맞춰 구현:
- `paycheck-feature` → 사용자가 명시적으로 "팀 모드"를 요청하거나 화면+훅+API가 모두 신규일 때만
- `paycheck-component` → UI 단일 작업
- `paycheck-hook` → 로직 단일 작업
- **직접 수정** → 단일 파일 버그 수정

구현 종료 시 코드 검토는 **`Agent(subagent_type: "paycheck-qa")` 직접 호출**로 수행한다 (검토 방식은 [검토 가이드](#검토-가이드) 참조).

구현 중 새로운 컨벤션/제약 발견 시 [자기개선 규칙](#자기개선-규칙) 트리거.

### Phase 6: 사용자 테스트 대기

구현 완료 후:
1. exec-plan 체크리스트 `[x]` 처리
2. "현재 상태" → "사용자 테스트 대기"
3. 타입 체크 `npx tsc --noEmit` 통과 확인
4. 사용자에게 보고:
   - 변경된 파일 목록
   - 네비게이션 등록 필요 여부
   - **네이티브 빌드 필요 여부** (새 패키지 설치한 경우)
   - 테스트 시나리오 (golden path + 회귀 + 엣지 케이스 + 양 OS)

**여기서 멈춘다.** PR 생성은 사용자가 테스트 통과를 알린 뒤 Phase 7에서 진행.

### Phase 7: PR 생성 + exec-plan 정리

사용자가 테스트 통과(예: "잘 작동함", "OK") 알린 뒤 진행:

1. **exec-plan 삭제** (`docs/exec-plans/README.md`에 따라 머지 전 삭제):
   ```bash
   git rm docs/exec-plans/active/{파일명}
   git commit -m "[Chore] exec-plan 정리 (#{이슈번호})"
   ```
2. 브랜치 push (`-u origin {브랜치명}`)
3. PR 생성 — `.github/PULL_REQUEST_TEMPLATE.md` 형식 사용:
   ```bash
   gh pr create --base develop \
     --title "{commit 제목과 동일}" \
     --body "$(cat <<'EOF'
   ## 📌 Issue number and Link
   closed #{이슈번호}
   {이슈 URL}

   ## ✏️ Summary
   {핵심 요약 — 무엇이 문제였고 무엇을 바꿨는가}

   ## 📝 Changes
   - {변경 1}
   - {변경 2}

   ## 🔎 PR Type
   - [x] {Bugfix / Feature / Refactoring / ...}

   ## 📸 Screenshot
   {UI 변경이면 사용자에게 첨부 요청. 아니면 "해당 없음"}
   EOF
   )"
   ```
4. PR URL을 사용자에게 보고. UI 변경 PR이면 스크린샷 첨부 안내.

## 검토 가이드

검토 진입점은 두 가지로 명확히 분리한다:

| 상황 | 진입점 |
|------|--------|
| **`paycheck-issue` 흐름 내부** | `Agent(subagent_type: "paycheck-qa")` 직접 호출 |
| **사용자가 자연어로 "리뷰해줘" 요청** | `paycheck-review` 스킬 (description 매칭으로 자동 트리거) |

`paycheck-review`는 사용자 직접 진입 전용 wrapper다. issue 흐름 내부에서는 한 단계 적은 Agent 직접 호출을 사용해 호출 비용을 줄인다. 결과물(검토 보고서)은 두 경로 모두 동등하다.

## 신규 이슈 등록 가이드

PayCheck-mobile 또는 백엔드 레포에 신규 이슈를 등록할 때 반드시 `.github/ISSUE_TEMPLATE/`의 템플릿을 따른다:
- 버그: `bug-report-template.md` (요약 / 재현 방법 / 기대 동작 / 실제 동작)
- 기능: `feature-request-template.md` (요약 / 필요한 이유 / 요구사항 / UX·UI / 추가 고려)

```bash
gh issue create -R {레포} --label {bug|enhancement} \
  --title "[{Bug|Feat}] {제목}" \
  --body "{템플릿 본문}"
```

## 자기개선 규칙

사용자가 하네스/워크플로우/컨벤션을 정정하거나 새 규칙을 알려주면 **즉시** 다음 절차:

1. 정정 내용을 분석하여 반영 위치 식별:
   - 워크플로우/스킬 절차 → `.claude/skills/{관련 스킬}/SKILL.md`
   - 에이전트 행동 → `.claude/agents/{관련 에이전트}.md`
   - 프로젝트 전반 규칙 → `CLAUDE.md`
   - 외부 시스템 가이드 → `docs/{해당 문서}.md`
2. 해당 파일 즉시 수정 (Edit/Write)
3. 사용자에게 어디를 어떻게 바꿨는지 요약 보고
4. 하네스 파일 변경은 PR에 함께 포함하거나 별도 chore 커밋으로 처리 — 어느 쪽이든 흔적은 git에 남긴다

자주 반복되는 개인 선호는 메모리 시스템에도 기록 가능. 단 하네스에 반영된 항목은 메모리 중복 저장 불필요.

## 에러 핸들링

| 상황 | 처리 |
|------|------|
| 이슈가 존재하지 않음 | 사용자에게 번호 확인 요청 |
| 이슈 내용이 불충분 | 파악 가능한 범위에서 계획 수립 후 사용자에게 확인 |
| Phase 2.5 진단 결과 백엔드 원인 | Phase 2.6 |
| Phase 2.5 진단 결과 원인 불명 | 사용자에게 재현 정보 요청 |
| 이미 active/ 에 같은 이슈 계획 존재 | 기존 계획 이어서 진행 |
| 같은 이름 브랜치 존재 | `git checkout {브랜치명}` |
| develop pull 실패 | 사용자에게 알리고 현재 상태에서 진행 |
| 사용자 테스트 미완료 상태에서 PR 요청 | "테스트 결과 확인 후 진행 권장" 안내 |
