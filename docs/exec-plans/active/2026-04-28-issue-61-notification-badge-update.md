# Issue #61: 알림 뱃지 숫자가 '전체 보기' 클릭 후에만 업데이트됨

## GitHub Issue
https://github.com/Team-PayCheck/PayCheck-mobile/issues/61

## 목표
헤더 종 아이콘의 알림 뱃지 숫자가 실시간으로 업데이트되도록 수정. 팝업을 열거나 앱이 포그라운드로 복귀할 때도 최신 unreadCount가 반영되어야 함.

## 현재 상태
구현 완료

## 작업 범위
- 라우팅: 직접 수정 (UI + 훅 모두 변경, 파일 특정됨)
- 관련 도메인: common (notification)

## 남은 작업
- [x] `Header.tsx`의 `handleBellPress`에서 `getNotifications` 응답의 `unreadCount`를 `setUnreadCount()`로 스토어에 반영
- [x] `useNotificationStream` 훅에 `AppState` 'active' 변경 감지 시 `getUnreadCount` 재호출 로직 추가
- [x] paycheck-review로 코드 검토

## 관련 파일
- `src/components/layout/Header.tsx` — 팝업 열 때 unreadCount 동기화
- `src/hooks/common/useNotificationStream.ts` — AppState 감지 추가
- `src/components/common/notification/NotificationPopup.tsx` — 변경 없음 (props 전달자 역할만)
- `src/hooks/common/useNotifications.ts` — 변경 없음 (이미 올바름)
- `src/stores/notificationStore.ts` — 변경 없음

## API 의존성
- `GET /api/notifications` — 응답에 `unreadCount: number` 포함됨 (NotificationPagedResponse)
- `GET /api/notifications/unread-count` — `{ count: number }` 반환

## 완료 기준
- 새 알림 수신 시 뱃지 숫자가 실시간 업데이트
- 팝업을 열 때 응답의 unreadCount가 스토어에 반영
- 앱 백그라운드 → 포그라운드 복귀 시 unreadCount 재조회

## 메모
- SSE 자체는 이미 `incrementUnreadCount()` 호출하므로 정상 동작 시 실시간 업데이트됨
- 핵심 버그는 Header에서 알림 5개 조회 시 응답의 unreadCount를 무시한 것
- AppState 감지는 SSE 끊김 후 복구 시 안전장치 역할
