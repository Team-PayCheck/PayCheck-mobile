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
- **상태**: 온보딩/로그인 구현 완료, 홈 화면 구현 중

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
│   ├── auth/         # 인증 API
│   │   ├── index.ts  # 로그인, 회원가입, 로그아웃, 회원탈퇴
│   │   └── types.ts  # AuthSuccessData, UserInfo, KakaoRegisterParams, LoginError
│   ├── user/         # 사용자 API
│   │   ├── index.ts  # 프로필 조회/수정, 계좌 정보 수정
│   │   └── types.ts  # UserType, UserResponse, WorkerResponse 등
│   └── worker/       # 근로자 API
│       ├── index.ts  # 계약, 근무기록, 정정요청, 급여, 송금
│       └── types.ts  # ContractListItem, CorrectionRequest, SalaryDetailResponse, PaymentResponse 등
├── assets/           # 폰트, 이미지
├── components/       # 재사용 컴포넌트
│   ├── common/       # 공통 (Text, PrimaryButton, BottomSheetModal, WheelPicker, MonthlyCalendar 등)
│   ├── employer/     # 고용주 전용
│   ├── layout/       # 레이아웃 (Header)
│   ├── mypage/       # 마이페이지
│   │   ├── drawer/          # MyPageDrawer, ProfileCard, MenuButton 등
│   │   ├── profileEdit/     # ProfilePhoto, ProfileFieldRow
│   │   ├── sentRequests/    # SentRequestCard
│   │   └── workplaceManage/ # WorkplaceCard
│   ├── signup/       # 회원가입 (SignUpScreenLayout, ProgressBar, FormInput 등)
│   ├── skeleton/     # 로딩 스켈레톤
│   └── worker/       # 근로자 전용
│       ├── weeklyCalendar/  # WorkCard, WorkListSection, WeeklySummary, 모달 등
│       ├── monthlyCalendar/ # MonthlySalarySummary, SelectedDateWorkList, WorkplaceSalaryCard 등
│       └── salary/          # 급여명세서 (SalaryStatementSheet, PaymentSection, DeductionSection 등)
├── hooks/            # 커스텀 훅
│   ├── common/       # useOnboardingStatus, useLogoutHandler
│   ├── employer/
│   └── worker/       # useWorkRecords, useCorrectionRequest, useCorrectionForm, useUserData, useSalaryStatement 등
├── navigation/       # 네비게이션 설정
│   ├── RootNavigator.tsx    # 최상위 네비게이터
│   ├── SignUpNavigator.tsx  # 회원가입 5단계 네비게이터
│   ├── OnboardingStack.tsx  # 온보딩 PagerView
│   └── WorkerStack.tsx      # 근로자 스택 네비게이터 (주간/월간 캘린더, 마이페이지 등)
├── dummyData/        # 더미 데이터 (개발용)
│   └── workerWeeklyCalendar.ts
├── screens/          # 화면 컴포넌트
│   ├── auth/         # 회원가입 (Step1~5)
│   ├── employer/     # EmployerHomeScreen, WorkplaceManageScreen
│   ├── onboarding/   # 온보딩 스크린들, WelcomeScreen
│   └── worker/       # WorkerWeeklyCalendarScreen, WorkerMonthlyCalendarScreen
│       └── mypage/   # ProfileEdit, WorkplaceManage, SentRequests, AccountSettings, Withdraw
├── stores/           # Zustand 전역 상태
│   ├── authStore.ts       # 인증 상태 (토큰, 유저 정보)
│   ├── onboardingStore.ts # 온보딩 상태
│   ├── signUpStore.ts     # 회원가입 임시 데이터 (persist 없음)
│   └── index.ts           # 스토어 export
├── types/            # TypeScript 타입 (공통/UI 전용)
│   ├── api.types.ts       # 공통 API 타입 (ApiResponse, CustomAxiosRequestConfig, RefreshSubscriber)
│   └── worker.types.ts    # 근로자 UI 도메인 타입 (WorkItem, WeekDay 등)
├── constants/        # 상수
│   ├── colors.ts          # 앱 전역 색상
│   ├── bank.ts            # 은행/증권사 목록 (35개)
│   └── pickerItems.ts     # WheelPicker 공통 아이템 (시/분/휴게/날짜)
└── utils/            # 유틸리티 함수
    ├── alert.ts           # Toast 알림 (react-native-alert-notification)
    ├── date.ts            # 날짜 유틸 (주간 범위, 주차 계산 등)
    ├── format.ts          # 포맷 유틸 (통화, 날짜 표시)
    ├── image.ts           # 이미지 선택/압축/base64 변환
    └── notification.ts    # 푸시 알림 권한 요청 (expo-notifications)
```

## 웹 프로젝트 참조

### 주요 기능

**근로자(Worker)**:
- 월간/주간 캘린더: 근무 기록 조회 및 추가
- 송금 관리: 급여 조회, 송금 내역
- 마이페이지: 프로필, 근무지 관리, 정정 요청

**고용주(Employer)**:
- 일일 캘린더: 타임라인 기반 스케줄 관리
- 송금 관리: 근로자 급여 계산 및 카카오페이 송금
- 근무지 관리: 근무지 CRUD, 근로자 관리
- 마이페이지: 정정 요청 승인/거절

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

### 회원가입 플로우 (SignUpNavigator)

```
Step1UserTypeScreen: 회원유형 선택 (근로자/사장님)
    ↓
Step2ProfileScreen: 프로필 사진 (선택)
    - 갤러리에서 이미지 선택 (expo-image-picker)
    - 400x400 리사이즈 + 압축 (expo-image-manipulator)
    - base64 변환 → signUpStore에 저장
    - 사진 미선택 시 '다음' 버튼 비활성화
    ↓
Step3BasicInfoScreen: 기본정보
    - 이름, 전화번호 (공통)
    - 은행/계좌 (근로자만)
    - 필수 항목 미입력 시 '다음' 버튼 비활성화
    ↓
Step4AlarmScreen: 알람 설정 + 회원가입 API 호출
    - 푸시 알림 권한 요청 (expo-notifications, expo-device)
    - 회원가입 API 호출 → 성공 시 Step5, 실패 시 Welcome으로 이동
    ↓
Step5CompleteScreen: 가입완료 화면
    - WORKER: '시작하기' → WorkerHome
    - EMPLOYER: '매장 관리하러 가기' → WorkplaceManage
```

**InitialRoute 결정 로직** (`useOnboardingStatus`):
1. 로그인 상태 + 토큰 유효 → userType에 따라 `EmployerHome` 또는 `WorkerHome`
2. 온보딩 완료 → `Welcome`
3. 그 외 → `Onboarding`

### API 구조 (도메인별 폴더)

각 도메인 폴더는 `index.ts` (API 함수) + `types.ts` (요청/응답 타입)로 구성.
API 전용 타입은 각 도메인 폴더의 `types.ts`에, 공통 타입(`ApiResponse` 등)은 `src/types/api.types.ts`에 위치.

```
src/api/
├── axios.ts           # Axios 인스턴스 + 인터셉터
├── auth/index.ts      # kakaoLoginWithToken, kakaoRegisterWithToken, logout, deleteMyAccount
├── auth/types.ts      # AuthSuccessData, UserInfo, KakaoRegisterParams, LoginError
├── user/index.ts      # getUserProfile, updateUserProfile, updateAccountInfo
├── user/types.ts      # UserType, UserResponse, UserUpdateRequest, WorkerResponse, WorkerUpdateRequest
├── worker/index.ts    # getWorkerInfo, getContracts, getContractDetail, getWorkRecords, getWorkRecordDetail,
│                      # getCorrectionRequests, getCorrectionRequestDetail, deleteCorrectionRequest,
│                      # createCorrectionRequest, getSalaryDetail, calculateSalary, getPayments
└── worker/types.ts    # ContractListItem, ContractDetail, CorrectionRequestParams, SalaryDetailResponse, SalaryCalculateResponse, PaymentResponse 등
```

**import 예시:**
```typescript
// API 함수
import { kakaoLoginWithToken } from "../../api/auth";
import { getUserProfile } from "../../api/user";
import { getWorkRecords } from "../../api/worker";

// 타입
import type { LoginError } from "../../api/auth/types";
import type { UserType } from "../../api/user/types";
import type { ContractListItem } from "../../api/worker/types";

// 공통 API 타입
import type { ApiResponse } from "../../types/api.types";
```

- (예정) `employer/` - 고용주 API

### 색상 팔레트 (`src/constants/colors.ts`)

```typescript
const colors = {
  // 버튼/강조 색상
  primary: "#0158CC",
  primaryLight: "#E8F1FC",

  // 배경
  background: "#FDFDFD",
  backgroundGrey: "#F5F5F5",

  // 텍스트
  textPrimary: "#161616",
  textSecondary: "#777777",
  textMuted: "#AAAAAA",
  textDisabled: "#CCCCCC",

  // 테두리/구분선
  border: "#E8E8E8",
  borderLight: "#F0F0F0",

  // 상태 색상
  red: "#F17D77",
  yellow: "#FCE38A",
  mint: "#E0F2F1",
  green: "#28C28D",

  // 기타
  blue: "#038BFA",
  grey: "#A0A0A0",
  white: "#FFFFFF",
  black: "#000000",
  disabled: "#EEEEEE",
  deleteRed: "#FF4D4F",
  lightBlue: "#a8cfff",
};
```

## 개발 가이드라인

### 웹 → 모바일 변환 시 주의사항

1. **스토리지**: `sessionStorage` → Zustand + persist (AsyncStorage)
2. **네비게이션**: React Router → React Navigation
3. **스타일**: CSS/Tailwind → StyleSheet
4. **터치**: 클릭 이벤트 → 터치 이벤트 (Pressable, TouchableOpacity)
5. **레이아웃**: flexbox 기반 (React Native 기본)

### 코드 컨벤션

- 컴포넌트: PascalCase (`MonthlyCalendar.tsx`)
- 훅: camelCase, use 접두사 (`useMonthlyCalendar.ts`)
- 타입: PascalCase (`WorkRecord.types.ts`)
- 상수: SCREAMING_SNAKE_CASE 또는 camelCase

### 공통 컴포넌트

#### Text 컴포넌트 (`src/components/common/Text.tsx`)

React Native의 기본 `Text` 대신 **공통 Text 컴포넌트**를 사용합니다. Pretendard 폰트가 자동 적용됩니다.

```typescript
import { Text } from "../components/common/Text";

// 사용 예시
<Text weight="Bold">볼드 텍스트</Text>
<Text weight="Medium">미디엄 텍스트</Text>
<Text weight="SemiBold">세미볼드 텍스트</Text>
<Text weight="ExtraBold">엑스트라볼드 텍스트</Text>
<Text>기본(Regular) 텍스트</Text>
```

**weight props:**
- `Regular` (기본값)
- `Medium`
- `SemiBold`
- `Bold`
- `ExtraBold`

**주의:** 새로운 스크린 작성 시 `react-native`의 `Text`가 아닌 공통 `Text` 컴포넌트를 import해서 사용해야 합니다.

#### BottomSheetModal (`src/components/common/BottomSheetModal.tsx`)

하단에서 올라오는 모달 컴포넌트. overlay fade-in + 컨텐츠 slide-up 애니메이션 포함.

```typescript
import BottomSheetModal from "../components/common/BottomSheetModal";

<BottomSheetModal visible={visible} onClose={onClose} maxHeight="90%">
  {/* 모달 내부 컨텐츠 */}
</BottomSheetModal>
```

#### MonthlyCalendar (`src/components/common/MonthlyCalendar.tsx`)

월간 캘린더 그리드 컴포넌트. 날짜 셀별 근무 건수 점(dot) 표시, 정정요청 여부 구분, 오늘/선택 날짜 하이라이트.

```typescript
import MonthlyCalendar from "../components/common/MonthlyCalendar";

<MonthlyCalendar
  year={2026}
  month={2}                    // 1~12
  selectedDate={selectedDate}  // Date
  onDateSelect={setSelectedDate}
  dotInfoMap={dotInfoMap}      // Record<string, { count: number; hasCorrectionRequest: boolean }>
/>
```

#### MonthlyCalendarNav (`src/components/common/MonthlyCalendarNav.tsx`)

월간 캘린더 상단 네비게이션 (이전/다음 달 이동, 현재 년/월 표시).

```typescript
import MonthlyCalendarNav from "../components/common/MonthlyCalendarNav";

<MonthlyCalendarNav
  year={year}
  month={month}
  onPrev={handlePrevMonth}
  onNext={handleNextMonth}
/>
```

#### WheelPicker (`src/components/common/WheelPicker.tsx`)

iOS 스타일 드럼 롤 피커. 시간, 날짜, 휴게시간 선택 등에 사용.

```typescript
import WheelPicker, { type WheelPickerItem } from "../components/common/WheelPicker";

<WheelPicker
  items={items}           // WheelPickerItem[]
  selectedValue={value}   // string | number
  onValueChange={onChange} // (value: string | number) => void
  itemHeight={40}         // 기본값 40
  visibleCount={3}        // 기본값 3
  width={80}              // 기본값 80
/>
```

**주의:** WheelPicker 내부에 FlatList를 사용하므로 ScrollView 안에 직접 넣으면 VirtualizedList 중첩 경고 발생. BottomSheetModal 내부에서 사용할 때는 ScrollView 대신 View를 사용할 것.

### 재사용 커스텀 훅 (근로자)

#### useWorkRecords (`src/hooks/worker/useWorkRecords.ts`)

기간별 근무 기록 조회. **주간캘린더, 월간캘린더 등에서 재사용.**

```typescript
import useWorkRecords from "../../hooks/worker/useWorkRecords";

const { works, isLoading, refetch } = useWorkRecords(startDate, endDate);
// works: WorkItem[], startDate/endDate: "yyyy-MM-dd"
```

#### useCorrectionRequest (`src/hooks/worker/useCorrectionRequest.ts`)

근무 추가(CREATE) 및 정정(UPDATE) 요청의 모달 상태 + API 호출 관리. **주간캘린더, 월간캘린더 등에서 재사용.**

```typescript
import useCorrectionRequest from "../../hooks/worker/useCorrectionRequest";

const {
  correctionModalVisible, selectedWork, openCorrectionModal, closeCorrectionModal, handleCorrectionSubmit,
  addModalVisible, openAddModal, closeAddModal, handleAddWorkSubmit,
} = useCorrectionRequest();
```

#### useCorrectionForm (`src/hooks/worker/useCorrectionForm.ts`)

정정 요청 모달 내부 폼 상태 + WheelPicker 연동. WorkerCorrectionRequestModal 전용.

```typescript
import useCorrectionForm from "../../hooks/worker/useCorrectionForm";

const { original, activePicker, hasChanges, handlePickerChange, togglePicker, getPickerConfig, getDisplayValue, buildSubmitData } = useCorrectionForm(work, visible);
```

#### useWorkRequestForm (`src/hooks/worker/useWorkRequestForm.ts`)

근무 추가 요청 모달 내부 폼 상태 + WheelPicker 연동. AddWorkRequestModal 전용.

#### usePayments (`src/hooks/worker/usePayments.ts`)

송금 내역 + 급여 상세 조회. **월간캘린더에서 근무지별 급여/송금 상태 표시에 사용.**

```typescript
import usePayments from "../../hooks/worker/usePayments";

const { workplaces, isLoading, refetch } = usePayments(year, month);
// workplaces: WorkplaceSalaryItem[] (workplaceName, baseSalary, deduction, maxSalary, status)
```

#### useSalaryStatement (`src/hooks/worker/useSalaryStatement.ts`)

급여명세서 바텀시트 데이터 관리. 계약 목록 → 계약 상세 + 급여 계산 병렬 호출로 근무지별 급여명세서 구성.

```typescript
import useSalaryStatement from "../../hooks/worker/useSalaryStatement";

const { statements, isLoading, selectedIndex, setSelectedIndex, fetchStatements } = useSalaryStatement(year, month);
// statements: SalaryStatementData[] (contractId, workplaceName, payrollDeductionType, salary)
// 모달 visible 시 fetchStatements() 호출
```

#### useWorkplaces (`src/hooks/worker/useWorkplaces.ts`)

근로자의 활성 근무지 목록 조회. 계약 목록 → 상세 조회를 통해 근무지명, 시급 정보를 가공하고 WheelPicker용 items까지 변환.

```typescript
import useWorkplaces from "../../hooks/worker/useWorkplaces";

const { workplaces, isLoading, fetchWorkplaces, workplacePickerItems } = useWorkplaces();
```

### 재사용 상수

#### pickerItems (`src/constants/pickerItems.ts`)

WheelPicker용 공통 아이템 목록. **useCorrectionForm, useWorkRequestForm 등에서 공유.**

```typescript
import { HOUR_ITEMS, MINUTE_ITEMS, BREAK_ITEMS, getDateItems } from "../../constants/pickerItems";

HOUR_ITEMS   // 00~23시
MINUTE_ITEMS // 00~59분
BREAK_ITEMS  // 0, 10, 20, ..., 60분
getDateItems(baseDate?) // 해당 월의 일자 목록 (baseDate: string | Date, 기본값 현재 날짜)
```

### 재사용 유틸리티

#### date.ts (`src/utils/date.ts`)

```typescript
import { getWeekRange, getWeekDays, getWeekTitle, getWeekLabel } from "../../utils/date";

getWeekRange(baseDate)  // { startDate: "yyyy-MM-dd", endDate: "yyyy-MM-dd" } (월~일)
getWeekDays(baseDate)   // WeekDay[] (Mon~Sun, 오늘 표시 포함)
getWeekTitle(baseDate)  // "2월 3주차 근무"
getWeekLabel(baseDate)  // "이번주(3주차)"
```

#### format.ts (`src/utils/format.ts`)

```typescript
import { formatCurrency, formatDate } from "../../utils/format";

formatCurrency(10300)       // "10,300"
formatDate("2026-02-16")    // "2/16"
```

### 상태 관리 (Zustand)

#### authStore
```typescript
// 사용 예시 (컴포넌트 내부)
const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
const userInfo = useAuthStore((state) => state.userInfo);
const login = useAuthStore((state) => state.login);

// 사용 예시 (컴포넌트 외부 - axios 인터셉터 등)
import { getAuthState } from "../stores/authStore";
const { accessToken } = getAuthState();
```

#### onboardingStore
```typescript
const isOnboardingCompleted = useOnboardingStore((state) => state.isOnboardingCompleted);
const completeOnboarding = useOnboardingStore((state) => state.completeOnboarding);
```

#### signUpStore (persist 없음)
회원가입 진행 중 임시 데이터 저장. 앱 종료 시 자동 초기화.

```typescript
// 데이터
const userType = useSignUpStore((state) => state.userType);
const profileImageUri = useSignUpStore((state) => state.profileImageUri);
const profileImageBase64 = useSignUpStore((state) => state.profileImageBase64);
const name = useSignUpStore((state) => state.name);
const phone = useSignUpStore((state) => state.phone);
const bankName = useSignUpStore((state) => state.bankName);
const accountNumber = useSignUpStore((state) => state.accountNumber);

// 액션
const setUserType = useSignUpStore((state) => state.setUserType);
const setProfileImage = useSignUpStore((state) => state.setProfileImage); // (uri, base64)
const reset = useSignUpStore((state) => state.reset); // 회원가입 완료/취소 시 호출
```

### 참조할 웹 파일 위치

```
../payCheck-frontend/src/
├── api/              # API 로직 복사 및 수정
├── hooks/            # 훅 로직 재사용
├── types/            # 타입 정의 복사
├── constants/        # 상수 복사
└── utils/            # 유틸리티 복사
```

## 명령어

```bash
# 개발 서버 시작
npx expo start

# iOS 시뮬레이터
npx expo start --ios

# Android 에뮬레이터
npx expo start --android

# 빌드
eas build --platform ios
eas build --platform android
```

## 환경 변수

`app.config.ts`의 `extra` 섹션에서 설정:
```typescript
extra: {
  backendApiUrl: process.env.BACKEND_API_URL,
  kakaoAppKey: process.env.KAKAO_APP_KEY,
}
```

## 구현 현황

### 완료
- [x] React Navigation 설정
- [x] API 모듈 포팅 (axios 인스턴스 + 인터셉터)
- [x] 인증 플로우 구현 (카카오 로그인)
- [x] Zustand 상태관리 설정
- [x] 온보딩 화면
- [x] 로그인/회원가입 화면
- [x] userType별 홈 화면 분리 (EmployerHome / WorkerHome)
- [x] 회원가입 5단계 플로우 (근로자/사장님)
- [x] 프로필 이미지 선택/압축/base64 변환
- [x] 은행 선택 모달 (35개 은행/증권사)
- [x] Toast 알림 (react-native-alert-notification)
- [x] 푸시 알림 권한 요청 (expo-notifications, expo-device)
- [x] 회원가입 폼 유효성 검사 및 버튼 비활성화
- [x] 회원가입 완료 후 userType별 화면 분기 (WorkerHome / WorkplaceManage)
- [x] 근로자 주간 캘린더 UI (WeeklyDateBar, WorkCard, WorkListSection, WeeklySummary)
- [x] 공통 컴포넌트 (BottomSheetModal, WheelPicker)
- [x] 근무 추가 요청 모달 (AddWorkRequestModal)
- [x] 근무 기록 정정 요청 모달 (WorkerCorrectionRequestModal)
- [x] 근로자 API 연동 (계약 목록/상세, 근무 기록 조회, 정정요청)
- [x] 주간 근무 리스트 실제 API 연동 (더미 데이터 제거)
- [x] 근로자 마이페이지 Drawer (프로필 카드, 메뉴, 로그아웃/회원탈퇴)
- [x] 마이페이지 서브 화면 (프로필 수정, 근무지 관리, 보낸 요청, 계정 설정, 회원탈퇴)
- [x] 사용자/근로자 정보 API 연동 (getUserProfile, getWorkerInfo)
- [x] API 폴더 구조 리팩토링 (도메인별 폴더: auth/, user/, worker/)
- [x] 근로자 월간 캘린더 UI (MonthlyCalendar, MonthlyCalendarNav, MonthlySalarySummary, SelectedDateWorkList)
- [x] 공통 컴포넌트 추가 (MonthlyCalendar, MonthlyCalendarNav)
- [x] 근로자 API 추가 (급여 상세 조회, 송금 내역 조회, 근무 기록 상세, 정정요청 목록/상세/취소)
- [x] 주간캘린더 과거/미래 근무 날짜 카드 색상 구분
- [x] 급여명세서 바텀시트 (근무지별 급여 상세, 4대보험/소득세 토글, 지급/공제 항목)

### TODO
- [ ] 고용주 화면 구현
- [ ] 프로필 정보 수정 기능 (이미지 업로드 포함)
- [ ] 회원탈퇴 API 연동 (백엔드 개발 필요)
- [ ] 계정 이용/이용동의 상세 UI

## 참고 문서
- [Auth Flow (Wiki)](https://github.com/Team-PayCheck/PayCheck-mobile/wiki/Auth-Flow) - 인증/회원가입 플로우 상세 문서
