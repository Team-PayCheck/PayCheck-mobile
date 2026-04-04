> 이 문서의 역할: 기술적 판단이 갈릴 때 에이전트가 참조하는 최상위 원칙. 구체적 구현 방법이 아닌 "왜"를 설명한다.

# PayCheck-mobile 프론트엔드 핵심 원칙

## 1. 재사용 우선, 생성은 최후 수단

새 컴포넌트나 훅을 만들기 전에 반드시 기존 것을 먼저 찾는다. 이 프로젝트는 이미 성숙한 공용 컴포넌트 레이어(`BottomSheetModal`, `WheelPicker`, `MonthlyCalendar`, `Pagination`, `WorkplaceTabSelector` 등)를 가지고 있다. 비슷한 기능이 이미 있을 때 새로 만들면 유지보수 부담이 두 배가 된다.

판단 기준: "이 컴포넌트/훅이 2곳 이상에서 쓰일 가능성이 있는가?" → Yes면 `common/`에 두어야 한다.

## 2. 데이터와 UI의 완전한 분리

화면(Screen)과 컴포넌트는 **렌더링만** 담당한다. 데이터 페칭, 상태 관리, API 호출은 반드시 커스텀 훅으로 분리한다. `EmployerHomeScreen`이 `useWorkplaceManagement`, `useEmployerDailyWorkRecords`, `useNotices` 등 여러 훅을 조합하는 방식이 이 프로젝트의 표준이다.

이 분리 덕분에 훅 단위로 로직을 재사용할 수 있다 (`useWorkRecords`가 주간/월간 캘린더 모두에서 쓰이는 것처럼).

## 3. 타입 안전성은 협의 없이 타협하지 않는다

`any` 타입은 외부 라이브러리와의 경계에서만 허용하고, 그 경우에도 주석으로 이유를 명시한다. API 응답은 항상 `ApiResponse<T>` 제네릭 래퍼로 타입핑한다. 백엔드 스펙이 불확실할 때는 `any` 대신 `unknown`을 쓰고 좁혀나간다.

이유: TypeScript의 이점은 런타임 오류를 컴파일 타임에 잡는 것이다. `any`를 쓰는 순간 이 이점을 포기한다.

## 4. 디자인 토큰은 단일 출처 원칙

`src/constants/colors.ts`의 `colors` 객체가 이 프로젝트의 유일한 색상 출처다. 어떤 파일에서도 `#161616`, `rgba(0,0,0,0.5)` 같은 색상 값을 하드코딩하지 않는다. 새 색상이 필요하면 `colors.ts`에 먼저 추가한 뒤 사용한다.

마찬가지로 폰트는 `components/common/Text`의 `weight` prop(`Regular/Medium/SemiBold/Bold/ExtraBold`)으로만 제어한다.

## 5. 성능 최적화는 측정 가능한 문제에만 적용한다

`useCallback`과 `useMemo`는 이 프로젝트에서 광범위하게 쓰이지만, 맹목적으로 모든 함수에 적용하지 않는다. 판단 기준:
- `useCallback`: 자식 컴포넌트에 prop으로 전달되는 함수, `useEffect` 의존성 배열에 들어가는 함수
- `useMemo`: 비용이 큰 계산 결과 (`getWeekDays`, `formatDateStr` 등), 렌더링마다 새로운 객체/배열 참조가 생기는 경우

가독성을 희생하면서까지 최적화하지 않는다. 먼저 동작하게 만들고, 느리면 그때 최적화한다.

## 6. 접근성은 기본값이다

화면 이동, 버튼 동작 등 모든 인터랙션에 `accessibilityLabel`을 기본으로 붙인다. 나중에 추가하려 하면 누락이 생긴다. 현재 프로젝트에서 접근성이 부족한 부분은 기술 부채로 인식하고, 새로 작성하는 컴포넌트부터 적용한다.

## 7. 네이티브 모듈 추가는 신중하게

React Native의 네이티브 모듈(`expo-camera`, `expo-image-picker` 등)을 새로 설치하면 JavaScript 코드만으로 해결되지 않고 Development Build 재빌드가 필요하다. 이는 시간 비용이 크다. 새 기능 구현 전에 이미 설치된 모듈로 해결 가능한지 먼저 확인한다.
