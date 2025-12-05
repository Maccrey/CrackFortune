# FortuneCrack Tasklist

## 📝 Development Rules (VibeCodingGuide)
1.  **Micro TDD**: 기능 구현 전/후 테스트 작성 (Playwright 권장).
2.  **Korean Commits**: 테스트 통과 시 한국어로 커밋 메시지 작성.
3.  **Clean Architecture**: Presentation -> Domain -> Data 계층 준수.
4.  **Security**: `.env` 필수 사용, API Key 커밋 금지.

---

## PHASE 1: GEMINI (Frontend Design & Interaction)
*목표: Mock 데이터를 사용하여 완벽한 UI/UX 및 라우팅 구현*

### 1. Project Setup & Architecture
- [x] **Initial Setup**
    - [x] React + Vite + TypeScript 프로젝트 생성 (Clean Architecture 폴더 구조).
    - [x] Tailwind CSS 설정 (Dark Mode, Custom Colors).
    - [x] `.env` 및 `.gitignore` 설정 (보안).
    - [x] *Test*: 빌드 및 환경변수 로드 확인.
- [x] **Assets & Meta**
    - [x] **Favicon**: 'Nano Banana' 컨셉의 파비콘 생성 및 적용.
    - [x] **Open Graph**: 메타 태그(Title, Desc, Image) 설정.
    - [x] *Test*: 브라우저 탭 아이콘 및 메타 데이터 확인.

### 2. UI Components (Presentation Layer)
- [x] **Layout & Navigation**
    - [x] Header/Footer (Glassmorphism).
    - [x] **Routing**: React Router 설정 (Main, Result, History, Settings).
    - [x] *Test*: 페이지 간 이동 확인 (Playwright).
- [x] **Main Page (Fortune Cookie)**
    - [x] 3D 포춘쿠키 모델/이미지 배치.
    - [x] **Animation**: Idle(둥둥 떠있음), Shake(터치 시), Crack(깨짐).
    - [x] *Test*: 애니메이션 트리거 및 프레임 드랍 확인.
- [x] **Result Page (Fortune Slip)**
    - [x] Slip 등장 애니메이션 (종이가 펼쳐지는 효과).
    - [x] 운세 텍스트 타이포그래피 (가독성 최적화).
    - [x] *Test*: Mock 텍스트 렌더링 확인.

### 3. Mobile & WebView Optimization
- [x] **Responsive Design**
    - [x] 375px 모바일 뷰포트 대응.
    - [x] Safe Area (Notch) 대응.
- [x] **WebView Check**
    - [x] 터치 제스처 충돌 방지.
    - [x] 스크롤 바운스 처리.

---

## PHASE 2: CODEX (Functional Implementation)
*목표: 실제 데이터 및 로직 연동 (Domain & Data Layers)*

### 4. Domain Layer (Business Logic)
- [x] **Entities & UseCases**
    - [x] User Entity / Fortune Entity 정의.
    - [x] `GetDailyFortuneUseCase` 구현.
    - [x] *Test*: Unit Test (Vitest).

### 5. Data Layer (Local Storage & API)
- [x] **Local Storage Integration**
    - [x] User Profile Management (Local).
    - [x] Local Storage Repository 구현.
    - [x] *Test*: Local Storage CRUD 테스트.
- [x] **Gemini API Integration**
    - [x] Cloud Functions 설정.
    - [x] Gemini Prompt Engineering (Persona, Locale).
    - [x] *Test*: API 응답 형식 및 에러 처리.

### 6. Integration & Polish
- [x] **Real Data Binding**
    - [x] Mock 데이터를 실제 Repository로 교체.
    - [x] Loading / Error State 처리.
- [ ] **Final Testing**
    - [x] E2E Test (User Flow 전체).
    - [x] Performance Tuning (Lighthouse).

---

## PHASE 3: FIREBASE INTEGRATION (Auth + Storage)
*목표: Firebase 기반 인증/저장/원격 캐싱으로 실사용 데이터 흐름 완성*

### 7. Firebase 초기 설정
- [ ] **프로젝트/환경 구성**
    - [ ] Firebase 콘솔 프로젝트 생성, Web 앱 추가, `firebaseConfig` 발급.
    - [x] `.env` / `.env.example`에 Firebase 키 추가 (prod/dev 분리), Secrets 관리.
    - [x] SDK 설치 및 `firebase/app`, `firebase/auth`, `firebase/firestore` 초기화 유틸 생성.
    - [x] *Test*: 환경변수 누락 시 초기화 예외 단위 테스트.

### 8. 인증 (Google Login Only)
- [ ] **Auth 흐름**
    - [ ] Google OAuth 팝업/리다이렉트 로그인 구현, `FortuneContext`와 userId 통합.
    - [ ] 로그인/로그아웃 UI 상태(헤더/설정) 및 세션 유지 처리.
    - [ ] *Test*: Vitest로 auth 헬퍼 모킹 + Playwright로 버튼/상태 전환 검증.

### 9. 데이터 계층: Firestore/Storage 전환
- [ ] **User Profile 저장소**
    - [ ] Firestore `users` 컬렉션으로 프로필 CRUD 구현, LocalStorage는 캐시로 유지.
    - [ ] 오프라인 우선: 로컬 캐시 → 원격 동기화, 실패 재시도 큐 설계.
    - [ ] *Test*: 리포지토리 모킹으로 성공/실패/재시도 시나리오 검증.

- [ ] **Fortune 저장소/캐시**
    - [ ] Firestore `fortunes` 컬렉션에 일별 운세 저장, `userId+date` 인덱스 설계.
    - [ ] 로컬 캐시와 병렬 조회(스텁 → 원격 → 캐시 갱신) 전략 적용.
    - [ ] *Test*: 캐시 우선/동기화 로직 단위 테스트.

- [ ] **Chat/Q&A 로그**
    - [ ] Firestore `chats` 컬렉션 설계(질문/답변/locale/model/키워드), UI 저장 연동.
    - [ ] *Test*: 단일 세션 저장/조회 모킹 테스트.

### 10. Gemini 호출 프록시 업데이트
- [ ] **Function 프록시 연동**
    - [ ] Firebase Functions로 프록시 구현, `gemini-2.0-flash` 엔드포인트 호출.
    - [ ] 요청: profile + locale + date + precision, 응답: summary/fullText/precision/keywords/model.
    - [ ] 에러/쿼타/타임아웃 처리 및 로컬 목 폴백 유지.
    - [ ] *Test*: 정상/실패/폴백 통합 테스트(모킹).

### 11. Presentation 업데이트
- [ ] **UI/UX 반영**
    - [ ] 로그인 상태별 헤더 버튼/상태 뱃지, 로그아웃 처리.
    - [ ] 프로필 저장 시 Firestore 동기화 피드백(토스트/스피너), 오프라인 알림.
    - [ ] 히스토리/결과 페이지에서 원격 운세+캐시 병합 표시(최신 동기화 시각).
    - [ ] *Test*: Playwright로 로그인 → 쿠키 깨기 → 결과/히스토리 저장 플로우 검증.

### 12. 운영/품질
- [ ] **CI/CD 확장**
    - [ ] Firebase 서비스 계정/에뮬레이터 기반 테스트 옵션 추가.
    - [ ] E2E에 `CI_E2E=true` + mock auth 경로 설정, Functions 엔드포인트 주입.
    - [ ] *Test*: 워크플로 드라이런 검증.

### 13. 성능/보안 추가 체크
- [ ] Firestore 규칙/인덱스 정의 및 문서화.
- [ ] Lighthouse/번들 분석 재실행(로그인/데이터 로딩 포함) 및 리포트 저장 자동화.
- [ ] 비밀키/토큰 번들 포함 여부 점검.

## ✅ Test Checklist (If Playwright N/A)
*Playwright로 테스트가 불가능한 경우 아래 리스트를 활용하여 수동 검증*
- [ ] [Manual] iOS Safari에서 쿠키 깨짐 애니메이션 부드러운가?
- [ ] [Manual] Android WebView에서 뒤로가기 제스처 정상 동작하는가?
- [ ] [Manual] 다크모드 해제 시(혹은 시스템 설정 변경 시) UI 깨짐 없는가?
