# PayCheck-mobile

PayCheck 웹 프로젝트(payCheck-frontend)를 React Native(Expo)로 모바일 변환하는 프로젝트

## 기술 스택

- **프레임워크**: Expo ~54.0.33
- **언어**: TypeScript ~5.9.2
- **React**: 19.1.0
- **React Native**: 0.81.5
- **네비게이션**: React Navigation
- **상태관리**: Zustand + persist 미들웨어
- **HTTP 클라이언트**: Axios + 인터셉터

## 프로젝트 구조

```
src/
├── api/              # API 연동 (도메인별 폴더 구조)
│   ├── axios.ts      # Axios 인스턴스 + 인터셉터
│   ├── auth/         # 인증 API (로그인, 회원가입, 로그아웃)
│   ├── user/         # 사용자 API (프로필 조회/수정)
│   ├── worker/       # 근로자 API (계약, 근무기록, 정정요청, 급여, 송금)
│   ├── employer/     # 고용주 API (근무지 CRUD, 계약 CRUD, 정정요청 승인/거절)
│   ├── notice/       # 공지 API (공지 CRUD)
│   ├── notification/ # 알림 API (인앱 알림 CRUD, FCM 토큰 등록/삭제)
│   └── kakao/        # 카카오 API (주소 검색)
├── assets/           # 폰트, 이미지
├── components/
│   ├── common/       # Text, PrimaryButton, BottomSheetModal, WheelPicker, MonthlyCalendar, Pagination, NoticeBoard 등
│   │   ├── notice/          # 공지 컴포넌트 (작성/수정/상세 모달, 카테고리 선택)
│   │   └── notification/    # 알림 컴포넌트 (NotificationPopup 드롭다운)
│   ├── employer/     # 고용주 전용 (홈, 직원관리, 송금관리, 마이페이지)
│   ├── layout/       # Header
│   ├── mypage/       # 공통 마이페이지 (Drawer, ProfileCard, SentRequestCard 등)
│   ├── signup/       # 회원가입
│   ├── skeleton/     # 로딩 스켈레톤
│   └── worker/       # 근로자 전용 (주간/월간 캘린더, 급여명세서)
├── hooks/
│   ├── common/       # useOnboardingStatus, useLogoutHandler, useNotices, useNotifications, useNotificationStream, useFcmToken, useNotificationNavigation
│   ├── employer/     # useWorkplaceManagement, useWorkplaceContracts, useAddWorker, useReceivedRequests, useEmployerDailyWorkRecords
│   └── worker/       # useWorkRecords, useCorrectionRequest, useUserData, useSalaryStatement 등
├── navigation/       # RootNavigator, WorkerStack, EmployerStack, SignUpNavigator, OnboardingStack
├── screens/
│   ├── auth/         # 회원가입 (Step1~5)
│   ├── common/       # 공통 화면 (NotificationScreen, NotificationSettingsScreen)
│   ├── employer/     # 고용주 화면 (홈, 직원관리, 송금관리, 마이페이지)
│   ├── onboarding/   # 온보딩, 로그인
│   └── worker/       # 근로자 화면 (주간/월간 캘린더, 마이페이지)
├── stores/           # Zustand 전역 상태 (authStore, onboardingStore, signUpStore, notificationStore)
├── types/            # TypeScript 타입 (공통 API 타입, UI 도메인 타입)
├── constants/        # 상수 (colors, bank, pickerItems, wage)
└── utils/            # 유틸리티 함수 (alert, date, format, image, notification, employerSchedule, sse, pushToken)
```

## 주요 기능

### 근로자 기능
- 주간 캘린더: 근무 기록 조회, 근무 추가/정정 요청, 과거/미래 근무 카드 색상 구분
- 월간 캘린더: 월별 근무 기록 조회, 날짜별 근무 상세, 근무지별 급여/송금 현황
- 급여명세서: 근무지별 급여 상세 (지급/공제 항목), 4대보험/소득세 토글 표시
- 마이페이지: Drawer 메뉴, 프로필 수정, 근무지 관리, 보낸 요청, 회원탈퇴

### 고용주 기능
- 홈: 일간 캘린더, 근무 추가/수정 모달
- 직원관리: 근무지별 근무자 목록 조회, Accordion 카드 (시급/급여지급일/근무시간 편집), 퇴사처리
- 근무자 추가: 2단계 플로우 (근무자 코드 검색 → 근무시간 설정), 근무 스케줄 타임라인 차트 프리뷰
- 송금관리: 근무지별 근무자 급여 조회, 송금 처리
- 근무지 관리: 근무지 CRUD, 카카오 주소 검색 연동
- 마이페이지: 프로필 수정, 받은 근무요청 보기 (사업장별 탭, 상태 필터, 페이지네이션, 승인/거절)

### 공통 기능
- 공지 게시판: 공지 작성/수정/삭제, 카테고리 필터, 상세 보기 바텀시트 (고용주/근로자 공용)
- 알림: 인앱 알림 팝업 (Header 벨 아이콘), 알림 상세 화면 (필터/페이지네이션), SSE 실시간 구독, 숫자 뱃지
- 푸시 알림: FCM 토큰 등록/삭제, 딥링크 네비게이션 (알림 탭 시 해당 화면 이동), 알림 설정 화면

### 인증
- 카카오 네이티브 SDK 로그인 (`@react-native-seoul/kakao-login`)
- JWT 토큰 (AccessToken + RefreshToken)
- 토큰 자동 갱신 로직 (Axios 인터셉터)
- 앱 시작 시 토큰 유효성 검증

### 네비게이션 구조
```
Onboarding (3페이지 스와이프)
    ↓
Welcome (카카오 로그인)
    ├─ 기존 회원 → EmployerHome / WorkerHome
    └─ 신규 회원 → SignUp (5단계)
                      ├─ WORKER → WorkerHome
                      └─ EMPLOYER → WorkplaceManage
```

### 상태 관리
- **authStore**: accessToken, userInfo, isLoggedIn (AsyncStorage 자동 persist)
- **onboardingStore**: isOnboardingCompleted (AsyncStorage 자동 persist)
- **signUpStore**: 회원가입 임시 데이터 (persist 없음, 앱 종료 시 자동 초기화)
- **notificationStore**: unreadCount (전역 알림 뱃지 상태, persist 없음)

## 명령어

```bash
npx expo start              # 개발 서버 시작
npx expo start --ios        # iOS 시뮬레이터
npx expo start --android    # Android 에뮬레이터
eas build --platform ios    # iOS 빌드
eas build --platform android  # Android 빌드
```

## 환경 변수

`app.config.ts`의 `extra` 섹션에서 설정:
- `backendApiUrl`: 백엔드 API URL
- `kakaoAppKey`: 카카오 네이티브 앱 키
- `kakaoRestApiKey`: 카카오 REST API 키 (주소 검색용)
