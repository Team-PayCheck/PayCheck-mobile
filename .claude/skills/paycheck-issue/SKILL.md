---
name: paycheck-issue
description: "GitHub Issue 번호를 받아 이슈 내용을 분석하고, exec-plan을 생성한 뒤 적절한 스킬로 라우팅하여 구현까지 완료하는 메인 진입점 스킬. 'issue #숫자 작업해줘', 'github issue #숫자', '#숫자번 이슈 해줘' 같은 요청이 오면 반드시 이 스킬을 사용할 것. 이슈 기반 작업의 유일한 시작점."
---

# PayCheck Issue Worker

GitHub Issue를 읽고, 작업 계획을 세우고, 적절한 에이전트에게 라우팅하는 메인 진입점.

## 워크플로우

### Phase 1: 이슈 파악

```bash
gh issue view {번호} --json title,body,labels,assignees,comments
```

이슈에서 추출할 정보:
- 제목 / 본문 (기능 설명, 요구사항)
- 레이블 (feature / bug / enhancement 등)
- 관련 화면/컴포넌트 언급
- API 엔드포인트 언급
- 체크리스트 항목

### Phase 2: 작업 범위 판단

이슈 내용을 읽고 아래 기준으로 분류:

| 조건 | 라우팅 대상 |
|------|-----------|
| 새 화면 + 훅 + API 모두 필요 | `paycheck-feature` |
| UI/컴포넌트 수정만 필요 | `paycheck-component` |
| 훅/API 로직만 필요 | `paycheck-hook` |
| 버그 수정 (파일 특정됨) | 해당 파일 직접 수정 |
| 리팩토링 | 범위에 따라 판단 |

판단이 애매하면 `paycheck-feature`로 라우팅.

### Phase 3: 브랜치 생성

이슈 레이블과 제목을 기반으로 작업 브랜치를 생성하고 체크아웃한다.

**브랜치 접두사 규칙:**

| 레이블 | 접두사 |
|--------|--------|
| `bug` | `bug/` |
| `feature` | `feat/` |
| `enhancement` | `enhance/` |
| 기타 | `chore/` |

**브랜치명 형식:** `{접두사}{제목-슬러그}#{이슈번호}`

- 제목 슬러그: 소문자, 공백→하이픈, 특수문자 제거, 최대 30자
- 예시: `bug/workplace-name-display#50`, `feat/worker-detail-screen#42`

```bash
# 현재 브랜치 확인
git branch --show-current

# 브랜치 생성 및 체크아웃 (develop 기준)
git checkout develop
git pull origin develop
git checkout -b {브랜치명}
```

- 이미 같은 이름의 브랜치가 존재하면 `git checkout {브랜치명}`으로 전환만 함
- 브랜치 생성 후 사용자에게 브랜치명 알림

### Phase 4: exec-plan 생성

`docs/exec-plans/active/YYYY-MM-DD-issue-{번호}-{제목}.md` 파일 생성:

```markdown
# Issue #{번호}: {이슈 제목}

## GitHub Issue
https://github.com/Team-PayCheck/PayCheck-mobile/issues/{번호}

## 목표
{이슈 본문에서 추출한 목표}

## 현재 상태
작업 시작 전

## 작업 범위
- 라우팅: {paycheck-feature / paycheck-component / paycheck-hook}
- 관련 도메인: {worker / employer / common}

## 남은 작업
{이슈 체크리스트 또는 분석한 작업 목록}
- [ ] ...
- [ ] ...

## 관련 파일
{영향 받을 것으로 예상되는 파일}
- src/screens/...
- src/hooks/...
- src/components/...

## API 의존성
{이슈에서 언급된 API 엔드포인트}

## 완료 기준
{이슈의 acceptance criteria 또는 체크리스트 완료}

## 메모
{이슈 코멘트 중 구현에 영향을 주는 내용}
```

### Phase 5: 구현 실행

exec-plan 생성 후 판단한 스킬로 작업 진행:

- `paycheck-feature` → 에이전트 팀 구성하여 UI + 로직 병렬 구현
- `paycheck-component` → paycheck-ui 단독 실행
- `paycheck-hook` → paycheck-logic 단독 실행
- 직접 수정 → 파일 읽고 수정 후 paycheck-review 실행

### Phase 6: 완료 처리

구현 완료 후:
1. exec-plan의 체크리스트 항목을 `[x]`로 업데이트
2. "현재 상태" → "구현 완료"로 업데이트
3. 사용자에게 완료 보고:
   - 구현된 파일 목록
   - 네비게이션 등록 필요 여부
   - 네이티브 빌드 필요 여부
   - 테스트 필요 사항

## 에러 핸들링

| 상황 | 처리 |
|------|------|
| 이슈가 존재하지 않음 | 사용자에게 번호 확인 요청 |
| 이슈 내용이 불충분 | 파악 가능한 범위에서 계획 수립 후 사용자에게 확인 |
| 이슈가 백엔드 작업 | "프론트엔드 작업이 없는 이슈입니다" 안내 |
| 이미 active/ 에 같은 이슈 계획 존재 | 기존 계획 이어서 진행 |
| 같은 이름의 브랜치가 이미 존재 | `git checkout {브랜치명}`으로 전환만 함 |
| develop 브랜치에 pull 실패 | 사용자에게 알리고 현재 브랜치에서 진행 |
