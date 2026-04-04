> 이 문서의 역할: 현재 프로젝트의 스타일 코드를 분석해 도출한 디자인 시스템. 새 화면/컴포넌트 작성 시 이 가이드를 참조한다.

# 디자인 시스템

## 색상 팔레트

`src/constants/colors.ts` 기준 (하드코딩 절대 금지):

| 토큰 | 값 | 용도 |
|-----|----|------|
| `colors.primary` | `#0158CC` | 주요 버튼, 강조, 활성 탭 |
| `colors.primaryLight` | `#E8F1FC` | 배경 강조, 선택된 상태 |
| `colors.background` | `#FDFDFD` | 기본 화면 배경 |
| `colors.backgroundGrey` | `#F5F5F5` | 카드/섹션 배경 |
| `colors.textPrimary` | `#161616` | 기본 텍스트 |
| `colors.textSecondary` | `#777777` | 보조 텍스트 |
| `colors.textMuted` | `#AAAAAA` | 비활성 텍스트, 플레이스홀더 |
| `colors.textDisabled` | `#CCCCCC` | 비활성화 텍스트 |
| `colors.border` | `#E8E8E8` | 기본 테두리 |
| `colors.borderLight` | `#F0F0F0` | 연한 구분선 |
| `colors.red` | `#F17D77` | 경고/에러 상태 |
| `colors.deleteRed` | `#FF4D4F` | 삭제 버튼 |
| `colors.green` | `#28C28D` | 성공/완료 상태 |
| `colors.white` | `#FFFFFF` | 카드 배경, 모달 배경 |
| `colors.grey` | `#A0A0A0` | 아이콘, 핸들 |
| `colors.disabled` | `#EEEEEE` | 비활성화 요소 배경 |

## 타이포그래피

폰트: **Pretendard** (항상 `components/common/Text`의 `weight` prop으로 제어)

| weight | fontFamily | 용도 |
|--------|-----------|------|
| `Regular` | Pretendard-Regular | 기본 본문 |
| `Medium` | Pretendard-Medium | 보조 레이블, 버튼 보조 |
| `SemiBold` | Pretendard-SemiBold | 섹션 헤더, 주요 레이블 |
| `Bold` | Pretendard-Bold | 카드 제목, 강조 수치 |
| `ExtraBold` | Pretendard-ExtraBold | 페이지 타이틀 |

**폰트 크기 관례** (StyleSheet에서 직접 지정):
- 타이틀: 20~22px
- 섹션 헤더: 16~18px
- 본문: 14~15px
- 보조 텍스트: 12~13px

## 스페이싱

코드에서 추출한 주요 간격 값:

| 용도 | 값 |
|-----|----|
| 화면 좌우 패딩 | `20px` (scrollContent), `24px` (모달) |
| 화면 하단 패딩 | `40px` |
| 섹션 간격 (gap) | `24px` |
| 카드 내부 패딩 | `16px` 상하, `20px` 좌우 |
| 모달 핸들 영역 | `paddingVertical: 16` |

스페이싱 상수가 없으므로 위 값들을 기준으로 일관성 유지.

## 컴포넌트 스타일 규칙

### 모달 (BottomSheetModal)
- 배경: `colors.white`
- 상단 모서리: `borderTopLeftRadius: 32`, `borderTopRightRadius: 32`
- 패딩: `paddingHorizontal: 24`, `paddingBottom: 40`
- 핸들: 너비 40px, 높이 4px, `colors.grey`

### 버튼 (PrimaryButton)
- 주요 색상: `colors.primary`
- 비활성: `colors.disabled` 배경

### 카드
- 배경: `colors.white`
- 테두리: `colors.border` (1px), `borderRadius: 12` 또는 `16`
- 그림자: iOS `shadowColor/shadowOffset/shadowOpacity`, Android `elevation`

### SafeAreaView
- 항상 `react-native-safe-area-context` 사용
- `edges={['top']}` — 하단은 내부에서 `paddingBottom: 40` 등으로 처리

## 아이콘

`@expo/vector-icons` 또는 `react-native-vector-icons` 사용. 사이즈는 20~24px 기준.

## 애니메이션/트랜지션

현재 프로젝트에서 사용 중인 패턴:

```typescript
// BottomSheetModal 기준 spring 애니메이션
Animated.spring(slideAnim, {
  toValue: 1,
  damping: 20,
  stiffness: 200,
  useNativeDriver: true,
})

// fade-in overlay
Animated.timing(overlayAnim, {
  toValue: 1,
  duration: 250,
  useNativeDriver: true,
})

// 닫힘 애니메이션
Animated.timing(slideAnim, {
  toValue: 0,
  duration: 200,
  useNativeDriver: true,
})
```

**원칙:**
- 항상 `useNativeDriver: true` — JS 스레드 블로킹 방지
- 열림: `Animated.spring` (자연스러운 바운스)
- 닫힘: `Animated.timing` (빠르고 깔끔하게)
- 키보드 회피: `Animated.timing` duration `150ms`

## 다크모드

현재 미구현. 새로 작성하는 컴포넌트도 라이트모드만 고려. `colors.ts`에 semantic 토큰이 없으므로 다크모드 구현 시 전면 개편 필요.

## Figma ↔ 코드 매핑

Figma 디자인 파일이 있다면 색상 변수명을 `colors.ts` 토큰명과 일치시키는 것을 권장. 현재는 코드 기반이 기준.
