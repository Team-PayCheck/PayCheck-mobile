> 이 문서의 역할: 현재 프로젝트 코드에서 추출한 백엔드 API 엔드포인트 명세. 자동 생성 — 직접 수정하지 말 것.

# API 스키마

## 공통 응답 포맷

```typescript
interface ApiResponse<T> {
  data: T;
  error?: {
    message: string;
    code?: string;
  };
}
```

Axios 인스턴스: `src/api/axios.ts` (토큰 자동 첨부 + 갱신 인터셉터 포함)

---

## 인증 (Auth) — `src/api/auth/`

| Method | Path | 설명 | 요청 | 응답 |
|--------|------|------|------|------|
| POST | `/api/auth/kakao/login` | 카카오 로그인 | `{ kakaoAccessToken }` | `ApiResponse<AuthSuccessData>` |
| POST | `/api/auth/kakao/register` | 카카오 회원가입 | `KakaoRegisterParams` | `ApiResponse<AuthSuccessData>` |
| POST | `/api/auth/logout` | 로그아웃 | — | `void` |
| DELETE | `/api/auth/withdraw` | 회원탈퇴 | — | — |
| POST | `/api/auth/dev/login` | Dev 로그인 (개발 전용) | `{ userId, name, userType }` | `ApiResponse<AuthSuccessData>` |

---

## 사용자 (User) — `src/api/user/`

| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/user/profile` | 프로필 조회 |
| PUT | `/api/user/profile` | 프로필 수정 |
| PUT | `/api/user/account` | 계좌 정보 수정 |

---

## 근로자 (Worker) — `src/api/worker/`

| Method | Path | 설명 | 주요 파라미터 |
|--------|------|------|------------|
| GET | `/api/workers/code/{code}` | 코드로 근로자 조회 | `code` (path) |
| GET | `/api/worker/contracts` | 계약 목록 | — |
| GET | `/api/worker/contracts/{id}` | 계약 상세 | `id` (path) |
| GET | `/api/worker/work-records` | 근무기록 목록 | `startDate`, `endDate` (query) |
| GET | `/api/worker/work-records/{id}` | 근무기록 상세 | `id` (path) |
| GET | `/api/worker/correction-requests` | 정정요청 목록 | `status?` (query) |
| GET | `/api/worker/correction-requests/{id}` | 정정요청 상세 | `id` (path) |
| POST | `/api/worker/correction-requests` | 정정요청 생성 | `CorrectionRequestParams` (body) |
| DELETE | `/api/worker/correction-requests/{id}` | 정정요청 취소 | `id` (path) |
| GET | `/api/worker/salaries/{id}` | 급여 상세 | `id` (path) |
| POST | `/api/worker/salaries/contracts/{id}/calculate` | 급여 계산 | `year`, `month` (query) |
| GET | `/api/worker/payments` | 송금 내역 목록 | — |

---

## 고용주 (Employer) — `src/api/employer/`

### 사업장 (Workplaces)

| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/employer/workplaces` | 사업장 목록 |
| GET | `/api/employer/workplaces/{id}` | 사업장 상세 |
| POST | `/api/employer/workplaces` | 사업장 생성 |
| PUT | `/api/employer/workplaces/{id}` | 사업장 수정 |
| DELETE | `/api/employer/workplaces/{id}` | 사업장 삭제 |

### 계약/근로자 (Contracts)

| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/employer/workplaces/{id}/workers` | 사업장별 근로자 목록 |
| GET | `/api/employer/contracts/{id}` | 계약 상세 |
| POST | `/api/employer/workplaces/{id}/workers` | 계약 생성 (근로자 추가) |
| PUT | `/api/employer/contracts/{id}` | 계약 수정 |
| DELETE | `/api/employer/contracts/{id}` | 계약 삭제 (퇴사) |

### 근무 기록 (Work Records)

| Method | Path | 설명 | 파라미터 |
|--------|------|------|---------|
| GET | `/api/employer/work-records` | 근무기록 목록 | `workplaceId`, `startDate`, `endDate` (query) |
| POST | `/api/employer/work-records` | 근무기록 생성 | `CreateWorkRecordRequest` (body) |
| PUT | `/api/employer/work-records/{id}` | 근무기록 수정 | — |
| DELETE | `/api/employer/work-records/{id}` | 근무기록 삭제 | — |

### 정정요청 (Correction Requests)

| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/employer/workplaces/{id}/pending-approvals` | 승인 대기 요청 목록 |
| GET | `/api/employer/workplaces/{id}/correction-requests` | 정정요청 목록 (페이징) |
| GET | `/api/employer/correction-requests/{id}` | 정정요청 상세 |
| PUT | `/api/employer/correction-requests/{id}/approve` | 정정요청 승인 |
| PUT | `/api/employer/correction-requests/{id}/reject` | 정정요청 거절 |

### 급여/송금 (Salary & Payment)

| Method | Path | 설명 | 파라미터 |
|--------|------|------|---------|
| GET | `/api/employer/salaries/year-month` | 연월 급여 현황 | `workplaceId`, `year`, `month` (query) |
| GET | `/api/employer/salaries/{id}` | 급여 상세 | — |
| POST | `/api/employer/salaries/contracts/{id}/calculate` | 급여 계산 | `year`, `month` (query) |
| GET | `/api/employer/payments/year-month` | 연월 송금 현황 | `workplaceId`, `year`, `month` (query) |
| GET | `/api/employer/payments/{id}` | 송금 상세 (tossLink 포함) | — |
| POST | `/api/employer/payments` | 송금 처리 (토스 딥링크 생성) | `CreatePaymentRequest` (body) |
| PUT | `/api/employer/payments/{id}/complete` | 송금 완료 처리 | — |

---

## 공지 (Notice) — `src/api/notice/`

| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/workplaces/{id}/notices` | 공지 목록 |
| GET | `/api/notices/{id}` | 공지 상세 |
| POST | `/api/workplaces/{id}/notices` | 공지 작성 |
| PUT | `/api/notices/{id}` | 공지 수정 |
| DELETE | `/api/notices/{id}` | 공지 삭제 |

---

## 알림 (Notification) — `src/api/notification/`

| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/notifications` | 알림 목록 |
| PUT | `/api/notifications/{id}/read` | 알림 읽음 처리 |
| DELETE | `/api/notifications/{id}` | 알림 삭제 |
| POST | `/api/notifications/fcm-token` | FCM 토큰 등록 |
| DELETE | `/api/notifications/fcm-token` | FCM 토큰 삭제 |
| GET | `/api/notifications/stream` | SSE 실시간 알림 구독 |

---

## 카카오 (Kakao) — `src/api/kakao/`

| Method | Path | 설명 |
|--------|------|------|
| GET | 카카오 주소 검색 API (외부) | 주소 검색 (`kakaoRestApiKey` 사용) |
