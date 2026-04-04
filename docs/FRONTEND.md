> 이 문서의 역할: 현재 프로젝트 코드를 기반으로 도출한 프론트엔드 코딩 컨벤션. 범용 가이드가 아닌 이 프로젝트의 실제 패턴을 문서화한다.

# 프론트엔드 코딩 컨벤션

## 파일/폴더 구조 및 명명

```
src/
├── api/{domain}/
│   ├── index.ts   # API 함수 (export named)
│   └── types.ts   # 요청/응답 타입
├── components/
│   ├── common/    # 도메인 무관 공용 컴포넌트
│   ├── employer/  # 고용주 전용 (하위: home/, worker-manage/, mypage/, remittance/)
│   ├── worker/    # 근로자 전용 (하위: weeklyCalendar/, monthlyCalendar/, salary/)
│   ├── mypage/    # 공통 마이페이지 컴포넌트
│   ├── layout/    # Header, NavigationBar
│   └── signup/    # 회원가입 전용
├── hooks/{domain}/use{Feature}.ts
├── screens/{domain}/{FeatureName}Screen.tsx
├── stores/{name}Store.ts
├── types/{domain}.types.ts 또는 api.types.ts
├── constants/{name}.ts
└── utils/{name}.ts
```

**명명 규칙:**
- 컴포넌트: `PascalCase` (`WorkerCard.tsx`, `EmployerHomeScreen.tsx`)
- 훅: `camelCase` + `use` 접두사 (`useWorkRecords.ts`)
- 타입: `PascalCase` (`worker.types.ts`, `api.types.ts`)
- 상수: `camelCase` 객체 + `SCREAMING_SNAKE_CASE` 개별 값

## 컴포넌트 작성 패턴

`EmployerHomeScreen`이 보여주는 표준 구조:

```tsx
// 1. React / RN imports
import React, { useState, useMemo, useCallback } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// 2. 네비게이션
import { useNavigation } from '@react-navigation/native';

// 3. 공통 컴포넌트 (common/ 먼저)
import { Text } from '../../components/common/Text';
import { colors } from '../../constants/colors';
import BottomSheetModal from '../../components/common/BottomSheetModal';

// 4. 도메인 컴포넌트
import EmployerTimeline from '../../components/employer/home/EmployerTimeline';

// 5. 훅
import { useWorkplaceManagement } from '../../hooks/employer/useWorkplaceManagement';

// 6. 타입
import type { WorkplaceDetails } from '../../api/employer/types';

// 7. 유틸
import { formatDateStr } from '../../utils/date';

const MyScreen: React.FC = () => {
  // 상태 선언
  // 훅 호출
  // 핸들러 (useCallback)
  // 파생 데이터 (useMemo)
  // JSX return

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 내용 */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default MyScreen;
```

**SafeAreaView**: 항상 `react-native-safe-area-context`의 것을 사용하고 `edges={['top']}`을 명시.

## Text 컴포넌트

**react-native의 Text는 직접 사용하지 않는다.** 항상 아래 방식으로 import:

```tsx
import { Text } from '../../components/common/Text';

// weight 옵션: Regular(기본) | Medium | SemiBold | Bold | ExtraBold
<Text weight="SemiBold" style={{ fontSize: 16, color: colors.textPrimary }}>
  내용
</Text>
```

## 상태 관리 구분 기준

| 상태 유형 | 도구 | 예시 |
|---------|------|------|
| 컴포넌트 로컬 | `useState` | 모달 open/close, 선택된 탭 |
| 파생/계산 값 | `useMemo` | `getWeekDays(selectedDate)`, `formatDateStr(date)` |
| 이벤트 핸들러 | `useCallback` | `onPressNotice`, `handleDateSelect` |
| 전역 영구 상태 | `Zustand + persist` | 로그인 정보(`authStore`), 온보딩 상태 |
| 전역 임시 상태 | `Zustand` (persist 없음) | 알림 뱃지(`notificationStore`) |
| 서버 데이터 | 커스텀 훅 | `useWorkRecords`, `useNotices` |

서버 데이터는 TanStack Query를 사용하지 않고, 커스텀 훅 내부에서 직접 `useState + useEffect`로 관리한다.

## 커스텀 훅 패턴

```typescript
// src/hooks/{domain}/use{Feature}.ts
import { useState, useEffect, useCallback } from 'react';
import { someApi } from '../../api/{domain}';

const use{Feature} = (param: string) => {
  const [data, setData] = useState<DataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await someApi(param);
      setData(response.data ?? []);
    } catch {
      setData([]);          // 에러 시 빈 배열, 에러 상태 노출 최소화
    } finally {
      setIsLoading(false);
    }
  }, [param]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, refetch: fetchData };
};

export default use{Feature};
```

CRUD가 포함된 훅은 `{ data, isLoading, refetch, createItem, updateItem, deleteItem }` 형태로 반환.

## API 호출 패턴

```typescript
// src/api/{domain}/index.ts
import { AxiosError } from 'axios';
import api from '../axios';
import type { ApiResponse } from '../../types/api.types';

export const getSomething = async (id: number): Promise<ApiResponse<SomeType>> => {
  try {
    const { data } = await api.get<ApiResponse<SomeType>>(`/api/endpoint/${id}`);
    return data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse<SomeType>>;
    const message =
      axiosError.response?.data?.error?.message ||
      axiosError.message ||
      '조회 실패';               // 한국어 폴백 메시지
    throw new Error(message);
  }
};
```

- `api` 인스턴스는 `src/api/axios.ts`에서 import (토큰 자동 첨부 처리됨)
- 에러 메시지는 백엔드 → Axios 자체 메시지 → 한국어 폴백 순서
- 응답 타입은 항상 `ApiResponse<T>` 제네릭 사용

## Zustand 스토어 패턴

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MyState {
  value: string | null;
  setValue: (v: string) => void;
}

export const useMyStore = create<MyState>()(
  persist(
    (set) => ({
      value: null,
      setValue: (v) => set({ value: v }),
    }),
    {
      name: 'my-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ value: state.value }), // 영구 저장할 필드만 선택
    }
  )
);

// 컴포넌트 외부 접근용 (인터셉터 등)
export const getMyState = () => useMyStore.getState();
```

## 에러 핸들링 패턴

- API 에러: 훅 내부 `catch`에서 처리 (상태를 빈 값으로 reset)
- 사용자 알림: `src/utils/alert.ts`의 유틸 함수 사용
- 치명적 에러: `logout()` 후 온보딩으로 리다이렉트 (authStore 참조)
- 로딩 중 UI: `ActivityIndicator` (색상: `colors.primary`)

## 성능 최적화 규칙

- `useCallback` 적용: 자식에게 prop으로 전달하는 함수, `useEffect` 의존성에 들어가는 함수
- `useMemo` 적용: 날짜 계산(`getWeekDays`, `getWeekRange`), 파생 데이터(`workplaces.find(...)`)
- 리렌더링 방지: 거대한 화면보다 작은 컴포넌트로 분리
- 이미지: `src/utils/image.ts` 유틸 활용

## 금지 패턴

- `import { Text } from 'react-native'` — 공용 `Text` 컴포넌트 사용
- 색상 하드코딩 (`'#0158CC'`, `'white'` 등) — `colors.*` 사용
- `StyleSheet` 없이 인라인 스타일 남발 — 동적 값만 인라인 허용
- `any` 타입 남용 — `unknown` 또는 제네릭으로 대체
- `onClick` — `onPress` 사용 (RN은 터치 이벤트)
- 하드코딩된 문자열 스타일 (`fontFamily: 'Pretendard-Bold'`) — `<Text weight="Bold">` 사용
