# Issue #53: [Bug] 리프레시 토큰으로 액세스 토큰 재발급이 안됨

## GitHub Issue
https://github.com/Team-PayCheck/PayCheck-mobile/issues/53

## 목표
- `@react-native-cookies/cookies` 완전 제거
- refreshToken을 Zustand에 저장 → refresh 요청 시 body로 전송
- New Architecture 호환 + 앱 실행 불가 문제 해결

## 현재 상태
구현 완료

## 작업 범위
- 라우팅: 직접 수정 (훅/API 로직)
- 관련 도메인: common (auth)

## 남은 작업
- [x] `auth/types.ts` — `AuthSuccessData`에 `refreshToken` 추가
- [x] `authStore.ts` — `refreshToken` 필드 + `setRefreshToken` + `login` 시그니처 업데이트
- [x] `axios.ts` — CookieManager 제거, refreshToken body 전송
- [x] `auth/index.ts` — CookieManager 제거, logout 정리
- [x] `WelcomeScreen.tsx` — authLogin에 refreshToken 전달
- [x] `Step4AlarmScreen.tsx` — authLogin에 refreshToken 전달
- [x] `EmployerWithdrawScreen.tsx` — CookieManager 제거
- [x] `WorkerWithdrawScreen.tsx` — CookieManager 제거
- [x] `package.json` — @react-native-cookies/cookies 제거

## 관련 파일
- `src/api/auth/types.ts`
- `src/stores/authStore.ts`
- `src/api/axios.ts`
- `src/api/auth/index.ts`
- `src/screens/onboarding/WelcomeScreen.tsx`
- `src/screens/auth/signup/Step4AlarmScreen.tsx`
- `src/screens/employer/mypage/EmployerWithdrawScreen.tsx`
- `src/screens/worker/mypage/WorkerWithdrawScreen.tsx`

## API 의존성
- `POST /api/auth/refresh` — body: `{ refreshToken }` 로 변경 (백엔드 수정 필요)
- `POST /api/auth/kakao/login` — 응답에 `refreshToken` 포함 (백엔드 수정 필요)
- `POST /api/auth/kakao/register` — 응답에 `refreshToken` 포함 (백엔드 수정 필요)

## 완료 기준
- `@react-native-cookies/cookies` 코드베이스에서 완전 제거
- 앱 런타임 에러 없이 실행
- 백엔드 반영 후 refresh 토큰 갱신 정상 동작

## 메모
- 백엔드 수정이 선행되어야 refresh 흐름 완전 동작
- 백엔드 미반영 상태에서도 앱은 정상 실행됨 (refreshToken이 null이면 401 → 로그아웃 처리)
