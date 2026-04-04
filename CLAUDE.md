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

## 에이전트 / 스킬

| 스킬 | 용도 |
|------|------|
| `paycheck-feature` | 전체 기능 구현 (화면+훅+API 에이전트 팀 모드) |
| `paycheck-component` | 단일 컴포넌트/화면 작업 |
| `paycheck-hook` | 훅/API 연동 작업 |
| `paycheck-review` | 코드 리뷰 / PR 전 점검 |

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
