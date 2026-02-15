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
├── api/              # API 연동 (axios 인스턴스, 인터셉터)
├── assets/           # 폰트, 이미지
├── components/       # 재사용 컴포넌트
│   ├── common/       # 공통 (Text, PrimaryButton 등)
│   ├── employer/     # 고용주 전용
│   ├── layout/       # 레이아웃
│   ├── mypage/       # 마이페이지
│   ├── signup/       # 회원가입 (ProgressBar, FormInput 등)
│   ├── skeleton/     # 로딩 스켈레톤
│   └── worker/       # 근로자 전용
├── hooks/            # 커스텀 훅
│   ├── common/       # useOnboardingStatus 등
│   ├── employer/
│   └── worker/
├── navigation/       # 네비게이션 설정
├── screens/          # 화면 컴포넌트
│   ├── auth/         # 회원가입
│   ├── employer/     # 고용주 화면 (EmployerHomeScreen 등)
│   ├── onboarding/   # 온보딩, 로그인
│   ├── mypage/       # 마이페이지
│   └── worker/       # 근로자 화면 (WorkerHomeScreen 등)
├── stores/           # Zustand 전역 상태 (authStore, onboardingStore, signUpStore)
├── types/            # TypeScript 타입 (api.types.ts 등)
└── utils/            # 유틸리티 함수
```

## 주요 기능

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
