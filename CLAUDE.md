# PayCheck-mobile

PayCheck 웹 프로젝트(payCheck-frontend)를 React Native(Expo)로 모바일 변환하는 프로젝트

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
- **상태**: 초기 폴더 구조 생성 완료, 구현 시작 전, 디자인 완료

## 기술 스택

- **프레임워크**: Expo ~54.0.33
- **언어**: TypeScript ~5.9.2
- **React**: 19.1.0
- **React Native**: 0.81.5
- **네비게이션**: React Navigation (예정)
- **상태관리**: Zustand 또는 Context (예정)
- **HTTP 클라이언트**: Axios (웹과 동일)

## 프로젝트 구조

```
src/
├── api/              # API 연동 (웹의 axios 설정 변환)
├── assets/           # 폰트, 이미지
├── components/       # 재사용 컴포넌트
│   ├── common/       # 공통 (버튼, 모달 등)
│   ├── employer/     # 고용주 전용
│   ├── layout/       # 레이아웃
│   ├── mypage/       # 마이페이지
│   ├── skeleton/     # 로딩 스켈레톤
│   └── worker/       # 근로자 전용
├── constants/        # 상수 (은행, 수당, 상태 등)
├── hooks/            # 커스텀 훅
│   ├── common/
│   ├── employer/
│   └── worker/
├── navigation/       # 네비게이션 설정
├── screens/          # 화면 컴포넌트
│   ├── auth/         # 로그인, 회원가입
│   ├── employer/     # 고용주 화면
│   ├── mypage/       # 마이페이지
│   └── worker/       # 근로자 화면
├── services/         # 비즈니스 로직
├── stores/           # 전역 상태
├── types/            # TypeScript 타입
│   ├── common/
│   ├── employer/
│   └── worker/
└── utils/            # 유틸리티 함수
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
- 카카오 로그인/회원가입
- JWT 토큰 (AccessToken + RefreshToken)
- 토큰 자동 갱신 로직

### 화면 구조 (웹 기준)

```
/ (로그인)
├── /auth (카카오 리다이렉트)
├── /signup (회원가입)
├── /notifications (알림)
├── /worker
│   ├── /monthly-calendar
│   ├── /weekly-calendar
│   ├── /remittance
│   └── /mypage
└── /employer
    ├── /daily-calendar
    ├── /remittance-manage
    ├── /worker-manage
    └── /employer-mypage
```

### API 구조

웹에서 사용하는 API 모듈:
- `authApi.ts` - 인증 (로그인, 회원가입, 토큰 갱신)
- `workerApi.ts` - 근로자 API
- `employerApi.ts` - 고용주 API
- `userApi.ts` - 사용자 정보
- `notificationApi.ts` - 알림

### 색상 팔레트

```typescript
const colors = {
  main: "#769fcd",
  mainDark: "#5a7fa8",
  background: "#f7fbfc",
  red: "#f38181",
  yellow: "#fce38a",
  mint: "#95e1d3",
  brown: "#b4846c",
  green: "#27c840",
  grey: "#d9d9d9",
};
```

## 개발 가이드라인

### 웹 → 모바일 변환 시 주의사항

1. **스토리지**: `sessionStorage` → `AsyncStorage` 또는 `expo-secure-store`
2. **네비게이션**: React Router → React Navigation
3. **스타일**: CSS/Tailwind → StyleSheet 또는 NativeWind
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

```
# .env (생성 필요)
EXPO_PUBLIC_API_URL=https://localhost:8080
```

## TODO

- [ ] React Navigation 설정
- [ ] API 모듈 포팅 (axios 설정)
- [ ] 인증 플로우 구현 (카카오 로그인)
- [ ] 근로자 화면 구현
- [ ] 고용주 화면 구현
- [ ] 상태관리 설정
- [ ] 푸시 알림 설정
