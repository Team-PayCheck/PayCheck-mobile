Notion에 정리해달라고 하면 Study archive / React Native 에 페이지를 만들어서 정리를 해주면 된다.
리액트 경험은 많으나 리액트 네이티브는 처음이므로 코드에 대한 설명을 요청했을때는 리액트 네이티브가 처음이라는 것을 염두해 설명할 것.

# PayCheck-mobile 작업 가이드

PayCheck 급여 관리 서비스 앱을 React Native(Expo)로 모바일 포팅한 프로젝트.

## 내 역할

**프론트엔드 + 디자인 전담. 백엔드는 다른 팀원 담당 — 백엔드 코드 수정 제안 금지.**

## 기술 스택

- Expo ~54.0.33 / React Native 0.81.5 / TypeScript ~5.9.2
- 네비게이션: React Navigation (Stack)
- 상태관리: Zustand + AsyncStorage persist
- HTTP: Axios + 인터셉터 (토큰 자동 갱신)
- 빌드: Development Build (실시간 테스트) + TestFlight (배포)

## 핵심 규칙

1. `Text`는 항상 `components/common/Text` 사용 — RN Text 직접 사용 금지
2. 색상은 `src/constants/colors.ts`의 `colors` 객체만 사용, 하드코딩 금지
3. 새 컴포넌트 전 `src/components/` 하위 재사용 가능한 것 먼저 확인
4. 네이티브 모듈 신규 설치 시 Development Build 재빌드 필요 — 반드시 사용자에게 알림
5. git commit에 `Co-Authored-By: Claude` 라인 절대 포함 금지
6. **이슈/PR 작성 시 반드시 `.github/ISSUE_TEMPLATE/`, `.github/PULL_REQUEST_TEMPLATE.md` 형식을 따른다.** 자체 양식 만들지 말 것.
7. **`docs/exec-plans/active/` 의 작업 계획서는 PR 머지 전 `git rm`으로 삭제한다.** archive 폴더는 존재하지 않는다.
8. 백엔드 코드 수정 제안 금지. 백엔드 원인 발견 시 백엔드 레포에 별도 이슈로 등록한다 (백엔드 레포 위치는 사용자가 알려준 경우에만 접근 — 팀원별 로컬 환경이 다름).
9. **모든 구현 작업은 `develop`에서 직접 하지 말고 새 작업 브랜치(`feature/`·`fix/`·`bug/` prefix)에서 진행한다.** `paycheck-feature` 팀 스폰 / `paycheck-component` / `paycheck-hook` / 직접 수정 모두 해당. 작업 시작 전에 `git status`로 현재 브랜치 확인, `develop`이면 `git checkout -b <new-branch>`로 분리한다 (working tree 변경은 자동으로 따라옴).

## 자기개선 규칙

사용자가 하네스/워크플로우/컨벤션에 대한 정정·새 규칙을 알려주면 **즉시** 다음을 수행한다:

1. 어디에 반영할지 식별:
   - 절차/스킬 → `.claude/skills/{관련 스킬}/SKILL.md`
   - 에이전트 행동 → `.claude/agents/{관련 에이전트}.md`
   - 프로젝트 전반 규칙 → 이 `CLAUDE.md`
   - 외부 시스템 문서 → `docs/{해당 문서}.md`
2. 해당 파일을 즉시 수정 (Edit/Write)
3. 변경 위치/내용을 사용자에게 요약 보고
4. 변경은 git에 흔적을 남긴다 (PR 포함 또는 별도 chore 커밋)

이미 하네스에 반영된 규칙은 메모리 시스템에 중복 저장하지 않는다.

## 에이전트 / 스킬

**작업 시작점: 항상 GitHub Issue 기반으로 작업한다.**

| 스킬 | 용도 |
|------|------|
| `paycheck-issue` | **메인 진입점** — Issue 분석 → 원인 진단 → exec-plan → 구현 → 테스트 대기 → PR |
| `paycheck-component` | 단일 컴포넌트/화면 작업 |
| `paycheck-hook` | 훅/API 연동 작업 |
| `paycheck-review` | 코드 리뷰 / PR 전 점검 (사용자 직접 요청 진입점) |
| `paycheck-feature` | **옵트인 모드** — 화면+훅+API+네비게이션 동시 신규 시에만 |

에이전트: `paycheck-ui` (UI 전문) · `paycheck-logic` (로직 전문) · `paycheck-qa` (검토)

## 문서 경로

| 문서 | 설명 |
|------|------|
| `docs/FRONTEND.md` | 컴포넌트·훅·API 코딩 컨벤션 상세 |
| `docs/DESIGN.md` | 디자인 시스템 (색상·타이포·간격·애니메이션) |
| `docs/design-docs/core-beliefs.md` | 기술 판단 최상위 기준 원칙 |
| `docs/design-docs/index.md` | 설계 문서 목록 |
| `docs/generated/api-schema.md` | API 엔드포인트 명세 |
| `docs/exec-plans/README.md` | 작업 계획서 사용법 |
| `docs/product-specs/README.md` | 프로덕트 명세서 가이드 |
| `docs/references/README.md` | 외부 라이브러리 레퍼런스 가이드 |
| `docs/QUALITY_SCORE.md` | 코드 품질 등급 추적 |

## 현재 작업

`docs/exec-plans/active/` 폴더 참조
