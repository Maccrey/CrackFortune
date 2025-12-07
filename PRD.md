# Product Requirements Document (PRD)

## 1. 제품 개요
**제품명**: FortuneCrack  
**슬로건**: Break your fortune. Every day. Powered by Gemini.

### 문제 정의
- **몰입도 부족**: 텍스트 중심의 운세는 재미와 의식적 요소가 결여됨.
- **개인화 부족**: 생시(정밀도)를 고려하지 않은 일반적인 텍스트.
- **글로벌 한계**: 단순 번역 투의 어색한 다국어 지원.

### 해결 방식 (FortuneCrack)
- **Gemini 기반 개인화**: 명리 데이터를 바탕으로 Gemini가 자연스러운 스토리텔링 생성.
- **인터랙티브 경험**: 포춘쿠키를 깨는(Crack) 애니메이션과 사운드로 의식적 경험 제공.
- **인터랙티브 경험**: 포춘쿠키를 깨는(Crack) 애니메이션과 사운드로 의식적 경험 제공.
- **글로벌 최적화**: 한국어/영어/일본어/중국어의 문화적 뉘앙스를 반영한 톤 앤 매너.
- **하이브리드 데이터**: 비로그인 시 로컬 저장, 로그인 시 클라우드(Firebase) 동기화로 데이터 영속성 보장.

### 개발 전략 (Gemini vs Codex)
- **Phase 1 (Gemini)**: 프론트엔드 인터랙티브 디자인, UI/UX, 애니메이션, **라우팅(페이지 전환)** 구현. (Mock 데이터 사용)
- **Phase 1 (Gemini)**: 프론트엔드 인터랙티브 디자인, UI/UX, 애니메이션, **라우팅(페이지 전환)** 구현. (Mock 데이터 사용)
- **Phase 2 (Codex)**: 실제 기능 구현, 로컬 저장소(Local Storage) 연동, Gemini API 연결, 비즈니스 로직.
- **Phase 3 (Ad Extension)**: 광고 기반 채팅 연장 기능 구현 (로그인 유저 전용).
- **Phase 4 (Dragon)**: Firebase (Auth/Firestore) 연동, 로그인 유도 UX (3초 딜레이/채팅 종료 시), 데이터 마이그레이션 전략 수립.

## 2. 핵심 가치 제안
- **Hyper-Personalized**: 생시 정밀도(Precision)에 따른 차별화된 운세 분석.
- **Immersive UX**: 다크모드 + 글라스모피즘 기반의 신비롭고 고급스러운 디자인.
- **Global Standard**: 전 세계 사용자가 위화감 없이 즐길 수 있는 다국어 지원.

## 3. 핵심 기능
### 3.1 오늘의 Gemini 포춘쿠키
- **Flow**: 쿠키 흔들기 -> 깨기(Crack) -> 운세 종이(Slip) 등장 -> 상세 보기.
- **UI**: 3D 느낌의 CSS/Canvas 애니메이션, 햅틱 피드백(모바일).

### 3.2 대시보드 (연운/주간/월간)
- **Visualization**: 카드 캐러셀 및 타임라인 UI.
- **Content**: Gemini가 요약한 핵심 키워드 및 흐름 분석.

### 3.3 Gemini AI Q&A
- **Context**: 오늘의 운세 결과를 바탕으로 심층 질문 가능.
- **Persona**: 사용자의 언어 및 문화권에 맞는 페르소나 적용.

## 4. 아키텍처 및 기술 스택
### 4.1 Clean Architecture
- **Presentation Layer**: UI, State Management (React, Framer Motion).
- **Domain Layer**: Entities, Use Cases (Business Logic).
- **Data Layer**: Repositories, Data Sources (Browser Local Storage, Gemini API).

### 4.2 Tech Stack
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS.
- **State/Query**: React Query, Zustand (선택).
- **Testing**: Playwright (E2E/Integration), Vitest (Unit).
- **Testing**: Playwright (E2E/Integration), Vitest (Unit).
- **Backend**: Firebase (Auth: Google Login, DB: Firestore).
- **Client Storage**: Local Storage (Guest) -> Sync to Firestore (User).
- **AI**: Groq API (gpt-oss-20b).

## 5. UI/UX 요구사항
- **Design System**: **Dark Mode** 기본, **Glassmorphism** (블러, 투명도) 적용.
- **Mobile First**: 375px~ 반응형 지원.
- **WebView Compatibility**: Flutter WebView 임베딩 시 Safe Area, 제스처, 스크롤 충돌 방지.
- **Navigation**: 직관적인 라우팅 (Main -> Result -> History -> Settings).

## 6. 테스트 및 품질 보증 (Micro TDD)
- **Micro TDD**: 작은 단위의 기능 구현 시 테스트 코드 선행/병행 작성.
- **Playwright**: UI 인터랙션 및 E2E 테스트 필수. (테스트 불가 시 `Testlist.md` 활용)
- **Commit Rule**: 테스트 통과 후 **한국어 커밋 메시지** 작성.

## 7. 보안 및 운영
- **Environment Variables**: API Key(Gemini)는 반드시 `.env` 파일로 관리.
- **Git Security**: `.env` 파일은 `.gitignore`에 포함하여 절대 커밋하지 않음.
- **CI/CD**: GitHub Actions (Lint, Test, Build).

- **User Collection**: `users/{uid}` (프로필, 설정).
- **Fortune Collection**: `users/{uid}/fortunes/{date}` (운세 결과).
- **Chat Collection**: `users/{uid}/chats/{date}` (대화 내역).
- **Data Strategy**:
    - **Guest**: Local Storage 사용.
    - **User**: Firestore 사용.
    - **Migration**: 로그인 성공 시 Local Storage 데이터를 Firestore로 업로드 후 Local Storage 데이터 삭제 (Clean-up).
- **Chat Extension Rule**:
    - 채팅 시간(3분) 종료 시:
        - **Guest**: 로그인 팝업 노출 -> 로그인 완료 시 광고 시청 버튼 활성화.
        - **User**: 광고 시청 버튼 노출 -> 광고 시청 후 시간 연장.