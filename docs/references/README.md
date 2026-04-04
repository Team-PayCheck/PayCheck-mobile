> 이 문서의 역할: references/ 폴더 사용 안내.

# 외부 레퍼런스

## 용도

공식 문서가 방대한 외부 라이브러리의 핵심 사용 패턴을 에이전트 친화적으로 정리한 파일을 보관합니다. 에이전트가 웹 검색 없이 빠르게 참조할 수 있도록 "이 프로젝트에서 실제로 쓰는 방식"만 추출해서 저장하는 것이 목적입니다.

## 파일명 규칙

`{라이브러리명}-llms.txt`

예시:
- `react-navigation-llms.txt` — React Navigation 타입/스택 설정 패턴
- `expo-notifications-llms.txt` — Expo 푸시 알림 설정 방법
- `zustand-llms.txt` — Zustand persist 미들웨어 사용법

## 현재 등록된 레퍼런스

(없음 — 필요한 라이브러리 레퍼런스가 있으면 추가)

## 추가 방법

에이전트에게 요청:
> "{라이브러리명}의 이 프로젝트에서 사용하는 패턴을 references/{라이브러리명}-llms.txt로 정리해줘"
