Notion에 정리해달라고 하면 Study archive / React Native 에 페이지를 만들어서 정리를 해주면 된다.
리액트  경험은 많으나 리액트 네이티브는 처음이므로 코드에 대한 설명을 요청했을때는 리액트 네이티브가 처음이라는 것을 염두해 설명할 것.
# PayCheck-mobile

PayCheck 웹 프로젝트(payCheck-frontend)를 React Native(Expo)로 모바일 변환하는 프로젝트

## 개발 / 배포 방식
- Development Build 과 TestFlight를 사용

### Development Build
- 새로운 브랜치를 생성할때마다 eas build --profile development --platform ios로 실시간 테스트를 진행 중.
- **네이티브 모듈 추가 시 빌드 필요**: `expo-image-picker`, `expo-camera` 등 네이티브 모듈을 새로 설치하면 Development Build를 다시 해야 함.

### TestFlight
- github origin develop 코드를 테스트할때 사용.

## github 규칙

### git commit 규칙
- 커밋 메시지에 `Co-Authored-By: Claude ...` 줄을 절대 추가하지 않습니다.
- 커밋은 계획 진행 중에 원할한 코드 리뷰를 위해 중간에 한번씩 해줍니다.

### github 규칙
- ISSUE,Pull Request 생성 시에는 .github폴더의 템플릿을 참고해서 작성합니다.

## 프로젝트 개요

- **목표**: payCheck-frontend(React 웹앱)을 모바일 앱으로 포팅
- **웹 원본**: `../payCheck-frontend`
- **프레임워크**: React Native + Expo
- **상태**: 근로자/고용주 기능 구현 완료, 공지 게시판 구현 완료

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
│   ├── axios.ts      # Axios 인스턴스 + 인터셉터 (토큰 자동 첨부/갱신)
│   ├── auth/         # 인증 API (로그인, 회원가입, 로그아웃, 회원탈퇴)
│   ├── user/         # 사용자 API (프로필 조회/수정, 계좌 정보 수정)
│   ├── worker/       # 근로자 API (계약, 근무기록, 정정요청, 급여, 송금)
│   ├── employer/     # 고용주 API (근무지 CRUD, 계약 CRUD, 정정요청 승인/거절)
│   ├── notice/       # 공지 API (공지 CRUD)
│   └── kakao/        # 카카오 API (주소 검색)
├── assets/           # 폰트, 이미지
├── components/
│   ├── common/       # Text, PrimaryButton, BottomSheetModal, WheelPicker, MonthlyCalendar, Pagination, NoticeBoard 등
│   │   └── notice/          # 공지 컴포넌트 (NoticeCreateModal, NoticeDetailSheet, NoticeEditSheet, NoticeCategorySelector)
│   ├── employer/
│   │   ├── home/            # 고용주 홈 (근무 추가/수정 모달)
│   │   ├── worker-manage/   # 직원관리 (WorkerCard, AddWorkerModal, WorkScheduleCalendarModal 등)
│   │   ├── remittance/      # 송금관리
│   │   └── mypage/          # 고용주 마이페이지 (EmployerMyPageDrawer, ReceivedRequestCard, AddWorkplaceModal 등)
│   ├── layout/       # Header
│   ├── mypage/       # 공통 마이페이지 (Drawer, ProfileCard, MenuButton, SentRequestCard 등)
│   ├── signup/       # 회원가입
│   ├── skeleton/     # 로딩 스켈레톤
│   └── worker/
│       ├── weeklyCalendar/  # 주간 캘린더
│       ├── monthlyCalendar/ # 월간 캘린더
│       └── salary/          # 급여명세서 (WorkplaceTabSelector 등)
├── hooks/
│   ├── common/       # useOnboardingStatus, useLogoutHandler, useNotices, usePickerState
│   ├── employer/     # useWorkplaceManagement, useWorkplaceContracts, useAddWorker, useReceivedRequests, useEmployerDrawer, useEmployerDailyWorkRecords
│   └── worker/       # useWorkRecords, useCorrectionRequest, useUserData, useSalaryStatement 등
├── navigation/       # RootNavigator, WorkerStack, EmployerStack, SignUpNavigator, OnboardingStack
├── screens/
│   ├── auth/         # 회원가입 (Step1~5)
│   ├── employer/
│   │   ├── EmployerHomeScreen.tsx
│   │   ├── EmployerWorkerManageScreen.tsx
│   │   ├── EmployerRemittanceManageScreen.tsx
│   │   └── mypage/   # EmployerWorkplaceManage, EmployerProfileEdit, EmployerReceivedRequests, EmployerWithdraw
│   ├── onboarding/   # 온보딩, WelcomeScreen
│   └── worker/
│       ├── WorkerWeeklyCalendarScreen.tsx
│       ├── WorkerMonthlyCalendarScreen.tsx
│       └── mypage/   # WorkerProfileEdit, WorkerWorkplaceManage, WorkerSentRequests, Withdraw
├── stores/           # authStore, onboardingStore, signUpStore (Zustand)
├── types/            # 공통 API 타입(api.types.ts), 근로자 UI 타입, 고용주 UI 타입
├── constants/        # colors, bank, pickerItems, wage
└── utils/            # alert, date, format, image, notification, employerSchedule
```

## 주요 기능

**근로자(Worker)**:
- 주간/월간 캘린더: 근무 기록 조회, 추가/정정 요청
- 급여명세서: 근무지별 급여 상세 (지급/공제 항목, 4대보험/소득세)
- 마이페이지: 프로필 수정, 근무지 관리, 보낸 근무요청 보기

**고용주(Employer)**:
- 홈: 일간 캘린더, 근무 추가/수정
- 직원관리: 근무지별 근무자 목록, 계약 수정, 근무자 추가/퇴사
- 근무지 관리: 근무지 CRUD (카카오 주소 검색 연동)
- 마이페이지: 프로필 수정, 받은 근무요청 보기 (승인/거절, 페이지네이션)

**공통**:
- 공지 게시판: 공지 작성/수정/삭제, 카테고리 필터, 상세 보기 바텀시트

### 인증
- 카카오 로그인/회원가입 (`@react-native-seoul/kakao-login`)
- JWT 토큰 (AccessToken + RefreshToken)
- 토큰 자동 갱신 로직 (Axios 인터셉터)

### 네비게이션 구조

```
Onboarding (3페이지 스와이프)
    ↓
Welcome (카카오 로그인)
    ├─ 기존 회원 → EmployerHome / WorkerHome (userType에 따라)
    └─ 신규 회원 → SignUp (5단계)
                      ├─ WORKER → WorkerHome
                      └─ EMPLOYER → WorkplaceManage
```

## 개발 가이드라인

### 웹 → 모바일 변환 시 주의사항

1. **스토리지**: `sessionStorage` → Zustand + persist (AsyncStorage)
2. **네비게이션**: React Router → React Navigation
3. **스타일**: CSS/Tailwind → StyleSheet
4. **터치**: 클릭 이벤트 → 터치 이벤트 (Pressable, TouchableOpacity)
5. **레이아웃**: flexbox 기반 (React Native 기본)

### UI 작업 규칙

- **새 컴포넌트를 만들기 전에 반드시 `src/components/` 하위에 재사용 가능한 기존 컴포넌트가 있는지 확인한다.** 특히 `common/`, `mypage/`, `worker/salary/` 폴더를 우선 확인.

### 코드 컨벤션

- 컴포넌트: PascalCase (`MonthlyCalendar.tsx`)
- 훅: camelCase, use 접두사 (`useMonthlyCalendar.ts`)
- 타입: PascalCase (`WorkRecord.types.ts`)
- 상수: SCREAMING_SNAKE_CASE 또는 camelCase

### 공통 컴포넌트

| 컴포넌트 | 설명 |
|---------|------|
| `Text` | **필수 사용.** react-native의 Text 대신 사용 (Pretendard 폰트). weight: Regular/Medium/SemiBold/Bold/ExtraBold |
| `BottomSheetModal` | 하단 슬라이드업 모달 (overlay + slide-up 애니메이션, 키보드 자동 회피, 스와이프 닫기) |
| `NoticeBoard` | 공지 게시판 (고용주/근로자 공용, 카테고리 필터) |
| `NoticeCard` | 공지 카드 (제목, 카테고리, 날짜) |
| `WheelPicker` | iOS 스타일 드럼 롤 피커. **주의: ScrollView 안에 넣으면 VirtualizedList 중첩 경고** |
| `MonthlyCalendar` | 월간 캘린더 그리드 (날짜별 dot 표시, 오늘/선택 하이라이트) |
| `MonthlyCalendarNav` | 월간 캘린더 상단 네비게이션 (이전/다음 달) |
| `Pagination` | 페이지 번호 UI (0-based currentPage, 말줄임표 지원) |
| `WorkplaceTabSelector` | 사업장 선택 탭 (텍스트 + 하단 밑줄, 급여명세서/받은 요청에서 재사용) |

### 커스텀 훅

**근로자:**
| 훅 | 설명 |
|---|------|
| `useWorkRecords` | 기간별 근무 기록 조회 (주간/월간 캘린더 공용) |
| `useCorrectionRequest` | 근무 추가/정정 요청 모달 상태 + API (주간/월간 캘린더 공용) |
| `useCorrectionForm` | 정정 요청 모달 내부 폼 + WheelPicker 연동 |
| `useWorkRequestForm` | 근무 추가 요청 모달 내부 폼 + WheelPicker 연동 |
| `usePayments` | 송금 내역 + 급여 상세 조회 (월간 캘린더) |
| `useSalaryStatement` | 급여명세서 바텀시트 데이터 관리 |
| `useWorkplaces` | 근로자 활성 근무지 목록 조회 + WheelPicker items 변환 |
| `useGetCorrectionRequests` | 보낸 정정요청 목록/상세/삭제 관리 |

**고용주:**
| 훅 | 설명 |
|---|------|
| `useWorkplaceManagement` | 근무지 목록 조회 + 선택 상태 + CRUD |
| `useWorkplaceContracts` | 근무지별 근무자 목록 + 계약 상세 병렬 조회 + 퇴사/수정 |
| `useAddWorker` | 근무자 추가 2단계 폼 (코드 검색 → 시급/근무시간 설정) |
| `useReceivedRequests` | 받은 정정요청 목록(페이징)/상세/승인/거절 관리 |
| `useEmployerDrawer` | 고용주 Drawer 보일러플레이트 추출 |
| `useEmployerDailyWorkRecords` | 고용주 일간 근무기록 조회 |
| `useWorkTimePicker` | 근무시간 피커 상태 관리 |

**공통:**
| 훅 | 설명 |
|---|------|
| `useNotices` | 공지 목록/상세/CRUD 관리 |
| `usePickerState` | Picker 로직 공통 훅 |

### 참조할 웹 파일 위치

```
../payCheck-frontend/src/ (api/, hooks/, types/, constants/, utils/)
```

## 명령어

```bash
npx expo start          # 개발 서버
npx expo start --ios    # iOS 시뮬레이터
eas build --platform ios  # 빌드
```

## 환경 변수

`app.config.ts`의 `extra` 섹션에서 설정:
- `backendApiUrl`: 백엔드 API URL
- `kakaoAppKey`: 카카오 네이티브 앱 키
- `kakaoRestApiKey`: 카카오 REST API 키 (주소 검색용)

## 구현 현황

### 완료
- [x] 인증 플로우 (카카오 로그인, 회원가입 5단계, JWT 토큰 갱신)
- [x] 온보딩 화면 (3페이지 스와이프)
- [x] 근로자 주간 캘린더 (근무 기록 조회, 추가/정정 요청 모달, API 연동)
- [x] 근로자 월간 캘린더 (월별 근무 기록, 근무지별 급여/송금 현황)
- [x] 급여명세서 바텀시트 (근무지별 급여 상세, 4대보험/소득세 토글)
- [x] 근로자 마이페이지 (Drawer, 프로필 수정, 근무지 관리, 보낸 요청, 회원탈퇴)
- [x] 고용주 직원관리 (근무자 목록, Accordion 카드, 근무자 추가, 퇴사처리)
- [x] 고용주 근무지 관리 (근무지 CRUD, 카카오 주소 검색)
- [x] 고용주 마이페이지 Drawer + 프로필 수정
- [x] 고용주 받은 근무요청 (사업장별 탭, 상태 필터, 페이지네이션, 승인/거절)
- [x] 공통 컴포넌트 (Pagination, WorkplaceTabSelector 등)
- [x] 고용주 일간 캘린더 화면 (근무 추가/수정 모달)
- [x] 공지 게시판 (공지 작성/수정/삭제, 카테고리 필터, 상세 바텀시트)
- [x] BottomSheetModal 스와이프 닫기 + 키보드 회피 버그 수정

### TODO
- [ ] 고용주 송금관리 화면 구현
- [ ] 회원탈퇴 API 연동 (백엔드 개발 필요)
- [ ] 계정 이용/이용동의 상세 UI

## 참고 문서
- [Auth Flow (Wiki)](https://github.com/Team-PayCheck/PayCheck-mobile/wiki/Auth-Flow) - 인증/회원가입 플로우 상세 문서
