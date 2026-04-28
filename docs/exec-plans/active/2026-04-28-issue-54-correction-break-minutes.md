# Issue #54: [Bug] 근무 정정 요청 시 휴게 시간이 수정되지 않음

## GitHub Issue
https://github.com/Team-PayCheck/PayCheck-mobile/issues/54

## 목표
근무 정정 요청 모달에서 휴게 시간 변경이 정상적으로 반영되어 정정 요청을 전송할 수 있도록 한다.

## 현재 상태
구현 완료 (사용자 테스트 대기)

## 작업 범위
- 라우팅: 직접 수정 (버그, 파일 특정됨)
- 관련 도메인: common (WheelPicker), worker (정정 요청 흐름)

## 진단된 Root Cause

### 증상
사용자가 휴게 시간 WheelPicker를 짧게 드래그(예: 0 → 30)하면 값이 반영되지 않고 `hasChanges`가 false로 유지되어 "요청 보내기" 버튼이 비활성화된 채로 남는다.

### 원인
`src/components/common/WheelPicker.tsx`는 `onMomentumScrollEnd` 이벤트에서만 `onValueChange`를 호출한다.

- `BREAK_ITEMS`는 7개 항목뿐이라 사용자가 1~3칸 정도 짧게 드래그하면 손을 떼는 순간 즉시 정지하여 momentum scroll(관성 스크롤)이 발생하지 않는다.
- 이 경우 `onMomentumScrollEnd`가 호출되지 않아 `onValueChange` → `handlePickerChange` → `setCorrectedBreakMinutes` 흐름이 끊긴다.
- 다른 picker(HOUR_ITEMS 24개, MINUTE_ITEMS 60개, dateItems 28~31개)는 항목 수가 많아 빠르게 스크롤되므로 momentum scroll이 거의 항상 발생하여 문제가 드러나지 않았다.

### 검증
- 이슈 본문의 `hasChanges` 로직과 `correctedBreakMinutes` 상태 업데이트 코드는 모두 정상.
- `useEffect`의 `parseWorkItem` 초기화 로직도 정상 (`work.breakMinutes ?? 0`).
- 실제 끊긴 부분은 WheelPicker 내부의 이벤트 핸들링.

## 수정 방향
`src/components/common/WheelPicker.tsx`에 `onScrollEndDrag` 처리를 추가하여, 사용자가 손을 뗀 후 momentum scroll이 발생하지 않는 경우에도 값을 동기화한다.

- `onMomentumScrollBegin` / `onScrollEndDrag` ref 플래그로 중복 호출 방지
- 드래그 종료 후 일정 시간 내 momentum scroll이 시작되지 않으면 직접 `onValueChange` 호출

## 남은 작업
- [x] 원인 진단
- [x] 브랜치 생성 (`bug/correction-break-minutes#54`)
- [x] exec-plan 작성
- [x] WheelPicker.tsx 수정
- [x] paycheck-qa 검토 (중복 호출 방지를 위한 clearTimeout 권장 → 반영)
- [ ] 사용자 테스트 및 PR

## 관련 파일
- `src/components/common/WheelPicker.tsx` (수정 대상)
- `src/hooks/worker/useCorrectionForm.ts` (참고)
- `src/components/worker/weeklyCalendar/WorkerCorrectionRequestModal.tsx` (참고)

## API 의존성
없음 (UI 컴포넌트 단독 수정)

## 완료 기준
- 휴게 시간 picker에서 짧은 드래그(1~3칸)로 값 변경 시 상태가 즉시 반영된다.
- 변경 시 "요청 보내기" 버튼이 활성화된다.
- 다른 picker(시간/분/날짜) 동작에 회귀 없음.

## 메모
WheelPicker는 worker/employer 양쪽 흐름에서 공용으로 사용되므로 회귀 영향이 크다. 변경은 onValueChange 호출 보장만 추가하고 기존 동작은 보존한다.
