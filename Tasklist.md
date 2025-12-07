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
- [x] **AI API Integration (Switch to Groq)**
    - [x] **Groq SDK Integration**: Replace Gemini with Groq (gpt-oss-20b).
    - [x] **Environment Update**: Consolidate to `.env` and remove `.env.local/.env.example`.
    - [x] **Service Migration**: `GeminiClient` -> `GroqClient`.
    - [x] *Test*: API 응답 형식 및 에러 처리.

### 6. Integration & Polish
- [x] **Real Data Binding**
    - [x] Mock 데이터를 실제 Repository로 교체.
    - [x] Loading / Error State 처리.
- [ ] **Final Testing**
    - [x] E2E Test (User Flow 전체).
    - [x] Performance Tuning (Lighthouse).


---

## PHASE 3: 광고 기반 채팅 연장 기능 (Ad-based Chat Extension)
*목표: 3분 채팅 시간 종료 후 광고를 시청하고 추가 3분 연장*

### 7. 광고 연장 기능
- [x] **UI 변경**
    - [x] "다른 쿠키 열기" 버튼을 "광고보고 '운세상담' 연장하기"로 변경
    - [x] 번역 파일 업데이트 (en, ko, ja)
    - [x] *Test*: 3분 후 팝업에 새 버튼 텍스트 표시 확인
- [x] **광고 통합**
    - [x] 광고 시뮬레이션 구현 (3초 카운트다운)
    - [x] 광고 재생 후 콜백 처리
    - [x] *Test*: 광고 완료 후 시간 연장 확인 (수동 테스트 필요)
- [x] **시간 관리 로직**
    - [x] 광고 시청 후 3분 추가 연장 로직
    - [x] localStorage에 연장 횟수/상태 저장
    - [x] *Test*: 연장 후 타이머 리셋 및 채팅 재개 확인 (수동 테스트 필요)


## ✅ Test Checklist (If Playwright N/A)
*Playwright로 테스트가 불가능한 경우 아래 리스트를 활용하여 수동 검증*
- [ ] [Manual] iOS Safari에서 쿠키 깨짐 애니메이션 부드러운가?
- [ ] [Manual] Android WebView에서 뒤로가기 제스처 정상 동작하는가?
- [ ] [Manual] 다크모드 해제 시(혹은 시스템 설정 변경 시) UI 깨짐 없는가?
- [ ] [Manual] Groq API Response Speed Check (Is it faster than Gemini?)
