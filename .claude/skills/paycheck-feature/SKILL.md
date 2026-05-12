---
name: paycheck-feature
description: "PayCheck-mobile 프로젝트에서 화면+훅+API+네비게이션이 모두 새로 필요한 큰 기능을 구현할 때 사용하는 옵트인 모드. 단일 컴포넌트/훅/버그 수정에는 사용 금지 (paycheck-component, paycheck-hook, 또는 직접 수정으로 진행). 사용자가 명시적으로 '팀 모드로 구현해줘', '에이전트 분담해서 구현해줘'라고 요청하거나, 작업 범위가 명백히 화면+훅+API 동시 신규 추가일 때만 트리거."
---

# PayCheck Feature Orchestrator

UI(화면/컴포넌트) + 로직(훅/API)을 병렬 구현하고, QA 검토 후 완성하는 에이전트 팀 오케스트레이터.

## 사용 시점

이 스킬은 **옵트인 모드**다. 다음 중 하나일 때만 사용:
- 사용자가 명시적으로 "팀 모드", "에이전트 분담"을 요청
- 작업 범위가 명백히 새 화면 + 새 훅 + 새 API + 네비게이션 등록을 모두 포함

단일 파일 단위 작업, 버그 수정, 단일 컴포넌트/훅 작업에는 절대 사용하지 않는다.
오버헤드(TeamCreate, SendMessage 통신, QA 라운드)가 작업 비용을 상회한다.

## 실행 모드: 에이전트 팀 (팬아웃 + 생성-검증)

## 에이전트 구성

| 팀원 | 역할 | 스킬 | 출력 |
|------|------|------|------|
| `paycheck-ui` | 화면/컴포넌트 구현 | paycheck-component | `.tsx` 파일들 |
| `paycheck-logic` | 훅/API/타입 구현 | paycheck-hook | `.ts` 파일들 |
| `paycheck-qa` | 코드 품질 검토 | paycheck-review | 검토 보고서 |

## 워크플로우

### Phase 0: 브랜치 분리 (필수, 팀 구성 전)

**팀 스폰 전에 반드시 새 작업 브랜치를 생성한다.** `develop`에 직접 작업하면 다른 PR과 충돌하고 머지 단위가 깨진다.

1. `git status`로 현재 브랜치와 작업 상태 확인
2. 현재 `develop`이면 새 브랜치 생성: `git checkout -b feature/<도메인>-<기능명>` (또는 `bug/`, `fix/` prefix)
   - 브랜치 이름은 사용자 컨펌 권장 (PR 제목/이슈와 연결되므로)
3. 이미 작업 브랜치 위라면 그대로 진행
4. 변경사항이 working tree에 있으면 그대로 따라오므로 stash 불필요

⚠️ 이 단계를 건너뛰면 사용자가 수동으로 브랜치를 분리해야 한다 — 반드시 수행할 것.

### Phase 1: 요구사항 분석

1. 사용자 요청에서 파악:
  - 어떤 화면/기능인지 (근로자 vs 고용주, 어떤 도메인)
  - 필요한 API 엔드포인트가 있는지
  - 기존 화면/컴포넌트 중 재사용 가능한 것이 있는지
2. UI 작업과 로직 작업을 분리하여 목록 작성
3. 작업 디렉토리 생성: `_workspace/`

### Phase 2: 팀 구성

```
TeamCreate(
  team_name: "paycheck-team",
  members: [
    {
      name: "paycheck-ui",
      agent_type: "paycheck-ui",
      model: "opus",
      prompt: "[요구사항 분석 결과 전달] UI 작업 목록: ... paycheck-logic과 타입 합의 후 구현 시작. 완료 후 파일 경로 목록을 paycheck-qa에게 SendMessage로 전달."
    },
    {
      name: "paycheck-logic",
      agent_type: "paycheck-logic",
      model: "opus",
      prompt: "[요구사항 분석 결과 전달] 로직 작업 목록: ... paycheck-ui에게 훅 인터페이스를 먼저 SendMessage로 전달. 완료 후 파일 경로 목록을 paycheck-qa에게 SendMessage로 전달."
    },
    {
      name: "paycheck-qa",
      agent_type: "paycheck-qa",
      model: "opus",
      prompt: "paycheck-ui와 paycheck-logic 완료 후 수신한 파일 목록을 검토한다. 문제 발견 시 해당 팀원에게 SendMessage로 수정 요청. 모두 통과하면 리더에게 완료 보고."
    }
  ]
)
```

```
TaskCreate(tasks: [
  { title: "타입/인터페이스 합의", description: "paycheck-logic이 훅 인터페이스를 정의하고 paycheck-ui에게 전달", assignee: "paycheck-logic" },
  { title: "UI 구현", description: "화면/컴포넌트 파일 작성", assignee: "paycheck-ui", depends_on: ["타입/인터페이스 합의"] },
  { title: "로직 구현", description: "훅/API/타입 파일 작성", assignee: "paycheck-logic" },
  { title: "QA 검토", description: "구현된 파일 전체 검토", assignee: "paycheck-qa", depends_on: ["UI 구현", "로직 구현"] }
])
```

### Phase 3: 병렬 구현

**팀원 통신 규칙:**
- `paycheck-logic` → `paycheck-ui`: 훅 인터페이스, 반환값 타입을 먼저 SendMessage로 전달
- `paycheck-ui` → `paycheck-logic`: 필요한 추가 데이터 구조 요청
- 두 팀원이 완료되면 각자 파일 목록을 `paycheck-qa`에게 SendMessage로 전달

**산출물 저장:**

| 팀원 | 출력 경로 |
|------|----------|
| `paycheck-ui` | 실제 프로젝트 경로 (`src/screens/`, `src/components/`) |
| `paycheck-logic` | 실제 프로젝트 경로 (`src/hooks/`, `src/api/`, `src/types/`) |

### Phase 4: QA 검토

1. `paycheck-qa`가 모든 파일을 Read로 읽어 체크리스트 실행
2. 문제 발견 시 해당 팀원에게 SendMessage로 수정 요청 (파일명 + 문제 + 수정 방향)
3. 수정 완료 확인 후 리더에게 최종 보고

**네이티브 모듈 체크**: 새로 설치가 필요한 패키지가 있으면 사용자에게 명시적으로 알림
```
⚠️ 네이티브 모듈 빌드 필요: {패키지명}을 새로 설치했습니다.
  EAS Development Build를 다시 실행해야 합니다:
  eas build --profile development --platform ios
```

### Phase 5: 정리

1. TeamDelete
2. 사용자에게 구현 완료 보고:
  - 생성/수정된 파일 목록
  - 네비게이션 등록 필요 여부
  - 네이티브 빌드 필요 여부 (있는 경우)

## 데이터 흐름

```
[리더: 요구사항 분석]
        ↓ TeamCreate + TaskCreate
[paycheck-logic] ─SendMessage(타입)→ [paycheck-ui]
        ↓ 완료                              ↓ 완료
  훅/API 파일                          화면/컴포넌트 파일
        └──────── SendMessage(파일목록) ─────────┘
                          ↓
                  [paycheck-qa: 검토]
                          ↓
                [리더: 완료 보고]
```

## 에러 핸들링

| 상황 | 전략 |
|------|------|
| 팀원 1명 실패 | SendMessage로 상태 확인 → 재시작 시도 → 실패 시 리더가 직접 처리 |
| 타입 합의 실패 | 리더가 두 팀원 간 중재 |
| QA에서 수정 필요 | 해당 팀원이 수정 → QA 재검토 (최대 2회) |
| 네이티브 모듈 필요 | 구현 완료 후 사용자에게 빌드 안내 |

## 테스트 시나리오

### 정상 흐름
1. 사용자: "고용주 급여 정산 화면 만들어줘"
2. 리더: 도메인(employer), 필요 API, 재사용 컴포넌트(WorkplaceTabSelector, Pagination) 파악
3. 팀 구성 (3명)
4. paycheck-logic → paycheck-ui: `useSalaryStatement` 훅 인터페이스 전달
5. 두 팀원 병렬 구현 → paycheck-qa 검토
6. 완료: 생성 파일 목록 + 네비게이션 등록 안내

### 에러 흐름
1. paycheck-ui가 WheelPicker를 ScrollView 안에 배치
2. paycheck-qa가 VirtualizedList 경고 발견
3. paycheck-ui에게 수정 요청 (ScrollView → FlatList 또는 구조 변경)
4. 수정 후 재검토 통과
