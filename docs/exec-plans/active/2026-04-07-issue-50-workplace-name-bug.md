# Issue #50: [Bug] 근무지 관리 화면에서 근무지 이름이 잘못 표시됨

## GitHub Issue
https://github.com/Team-PayCheck/PayCheck-mobile/issues/50

## 목표
근무지 관리 화면에서 근무지 카드에 올바른 근무지 이름이 표시되도록 수정

## 현재 상태
구현 완료

## 작업 범위
- 라우팅: 직접 수정 (버그, 파일 특정됨)
- 관련 도메인: employer / mypage

## 남은 작업
- [x] `EmployerWorkplaceManageScreen` 에서 name을 `detail?.name || w.name` fallback으로 수정
- [x] `handleDeleteWorkplace` Alert 메시지도 동일하게 수정

## 관련 파일
- `src/screens/employer/mypage/EmployerWorkplaceManageScreen.tsx` (수정)

## API 의존성
- `GET /api/employer/workplaces` — 리스트 (name 오류 가능성)
- `GET /api/employer/workplaces/{id}` — 상세 (올바른 name)

## 완료 기준
근무지 카드에 올바른 근무지 이름 표시

## 메모
- 리스트 API와 상세 API의 name 불일치가 원인
- `detail?.name`이 있으면 우선 사용, 없으면 `w.name` fallback
