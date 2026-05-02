# Issue #58: 프로필 사진 등록 제거

## GitHub Issue
https://github.com/Team-PayCheck/PayCheck-mobile/issues/58

## 목표
프로필 이미지 선택·업로드·표시 기능을 앱 전체에서 제거한다.
회원가입 Step2(프로필 사진 선택) 화면을 삭제하고, 프로필 수정 모달에서 이미지 관련 UI를 제거한다.
Drawer의 ProfileCard는 이니셜(이름 첫 글자) 표시로 대체한다.

## 현재 상태
구현 완료

## 작업 범위
- 라우팅: 직접 수정 (다수 파일, 기능 제거)
- 관련 도메인: worker / employer / common / auth

## 남은 작업
- [x] `src/utils/image.ts` 삭제
- [x] `src/components/signup/ProfileImagePicker.tsx` 삭제
- [x] `src/components/mypage/profileEdit/ProfilePhoto.tsx` 삭제
- [x] `src/screens/auth/signup/Step2ProfileScreen.tsx` 삭제
- [x] `src/components/signup/index.ts` — ProfileImagePicker export 제거
- [x] `src/screens/auth/signup/index.ts` — Step2ProfileScreen export 제거
- [x] `src/navigation/SignUpNavigator.tsx` — Step2Profile 화면/타입 제거
- [x] `src/screens/auth/signup/Step1UserTypeScreen.tsx` — Step3BasicInfo로 바로 이동
- [x] `src/screens/auth/signup/Step4AlarmScreen.tsx` — profileImageBase64/profileImageUrl 제거
- [x] `src/stores/signUpStore.ts` — profileImageUri, profileImageBase64, setProfileImage 제거
- [x] `src/api/user/types.ts` — UserUpdateRequest.profileImageUrl 제거
- [x] `src/hooks/worker/useProfileEdit.ts` — 이미지 상태/핸들러 제거
- [x] `src/components/mypage/ProfileEditModal.tsx` — ProfileImagePicker 섹션 제거
- [x] `src/components/mypage/drawer/ProfileCard.tsx` — imageUri prop 제거, 이니셜 원형 뷰로 대체
- [x] `src/components/mypage/drawer/MyPageDrawer.tsx` — imageUri prop 제거
- [x] `src/screens/worker/mypage/WorkerProfileEditScreen.tsx` — ProfileImagePicker 제거
- [x] `src/screens/employer/mypage/EmployerProfileEditScreen.tsx` — ProfileImagePicker 제거

## 관련 파일
(위 목록 참조)

## API 의존성
- `PUT /api/users/me` — `profileImageUrl` 필드 전송 중단
- `POST /api/auth/kakao/register` — `profileImageUrl` 필드 전송 중단

## 완료 기준
- 회원가입 플로우: Step1 → Step3 (Step2 없음)
- 프로필 수정 모달: 이름/전화번호만 수정 가능
- Drawer ProfileCard: 이니셜 원형 뷰 표시
- 프로필 수정 화면: 이미지 영역 없음
- TypeScript 오류 없음

## 메모
- expo-image-picker, expo-image-manipulator 패키지는 코드 제거 후 별도로 uninstall 검토 필요 (Dev Build 재빌드 필요)
- ProfileCard의 이미지를 이니셜로 대체할 때 기존 스타일(45x45 원형) 유지
