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
│   └── worker/       # 근로자 API (계약, 근무기록, 정정요청)
├── assets/           # 폰트, 이미지
├── components/       # 재사용 컴포넌트
│   ├── common/       # 공통 (Text, PrimaryButton, BottomSheetModal, WheelPicker 등)
│   ├── employer/     # 고용주 전용
│   ├── layout/       # 레이아웃 (Header)
│   ├── mypage/       # 마이페이지 (Drawer, 프로필 수정, 근무지 관리 등)
│   ├── signup/       # 회원가입 (ProgressBar, FormInput 등)
│   ├── skeleton/     # 로딩 스켈레톤
│   └── worker/       # 근로자 전용 (주간 캘린더, 근무 카드 등)
├── hooks/            # 커스텀 훅
│   ├── common/       # useOnboardingStatus, useLogoutHandler
│   ├── employer/
│   └── worker/       # useWorkRecords, useCorrectionRequest, useUserData 등
├── navigation/       # 네비게이션 설정
│   ├── RootNavigator.tsx
│   ├── SignUpNavigator.tsx
│   ├── OnboardingStack.tsx
│   └── WorkerStack.tsx
├── screens/          # 화면 컴포넌트
│   ├── auth/         # 회원가입 (Step1~5)
│   ├── employer/     # 고용주 화면 (EmployerHomeScreen 등)
│   ├── onboarding/   # 온보딩, 로그인
│   └── worker/       # 근로자 화면 (주간 캘린더, 마이페이지 서브 화면)
├── stores/           # Zustand 전역 상태 (authStore, onboardingStore, signUpStore)
├── types/            # TypeScript 타입 (공통 API 타입, UI 도메인 타입)
├── constants/        # 상수 (colors, bank, pickerItems)
└── utils/            # 유틸리티 함수 (alert, date, format, image, notification)
```

## 주요 기능

### 근로자 기능
- 주간 캘린더: 근무 기록 조회, 근무 추가/정정 요청
- 마이페이지: Drawer 메뉴, 프로필 수정, 근무지 관리, 보낸 요청, 회원탈퇴

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

### 회원가입 플로우 (5단계)
```
Step1: 회원유형 선택 (근로자/사장님)
    ↓
Step2: 프로필 사진 (선택, 갤러리에서 선택 → 압축 → base64)
    - 사진 미선택 시 '다음' 버튼 비활성화
    ↓
Step3: 기본정보 (이름, 전화번호, 은행/계좌 - 근로자만)
    - 필수 항목 미입력 시 '다음' 버튼 비활성화
    ↓
Step4: 알람 설정 (푸시 알림 권한 요청) → 회원가입 API 호출
    - expo-notifications, expo-device 사용
    - 성공 시 Step5로 이동, 실패 시 Welcome으로 이동
    ↓
Step5: 가입완료 화면
    - WORKER: '시작하기' → WorkerHome
    - EMPLOYER: '매장 관리하러 가기' → WorkplaceManage
```

### 상태 관리
- **authStore**: accessToken, userInfo, isLoggedIn (AsyncStorage 자동 persist)
- **onboardingStore**: isOnboardingCompleted (AsyncStorage 자동 persist)
- **signUpStore**: 회원가입 임시 데이터 (persist 없음, 앱 종료 시 자동 초기화)

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
- `backendApiUrl`: 백엔드 API URL
- `kakaoAppKey`: 카카오 네이티브 앱 키
