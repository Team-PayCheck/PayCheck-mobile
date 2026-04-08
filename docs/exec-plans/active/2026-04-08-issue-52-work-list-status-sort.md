# Issue #52: [Bug] 이번 주 근무 리스트가 상태별로 정렬되지 않음

## GitHub Issue
https://github.com/Team-PayCheck/PayCheck-mobile/issues/52

## 목표
주간 캘린더의 근무 리스트를 근무 상태별(근무중 → 근무예정 → 근무완료)로 정렬

## 현재 상태
구현 완료

## 작업 범위
- 라우팅: 직접 수정 (버그 수정, 파일 특정됨)
- 관련 도메인: worker

## 남은 작업
- [x] WorkListSection.tsx의 정렬 로직에 상태 우선순위 반영
- [x] StatusBadge와 동일한 상태 판단 로직 적용 (백엔드 버그 보정 포함)
- [x] 같은 상태 내 시간순(오름차순) 정렬

## 관련 파일
- src/components/worker/weeklyCalendar/WorkListSection.tsx (수정 대상)
- src/components/worker/weeklyCalendar/WorkCard.tsx (StatusBadge 로직 참조)

## API 의존성
없음 (프론트엔드 정렬 로직만 수정)

## 완료 기준
- 근무중 → 근무예정 → 근무완료 순으로 정렬
- 같은 상태 내에서는 시간순(오름차순) 정렬
- StatusBadge 표시와 정렬 순서가 일치

## 메모
- WorkCard.tsx의 StatusBadge에 백엔드 익일근무 status 버그 보정 로직 존재 → 정렬에도 동일 적용 필요
