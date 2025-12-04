# FortuneCrack 🥠
**Break your fortune. Every day. Powered by Gemini.**

FortuneCrack은 포춘쿠키를 깨는 몰입형 경험과 Gemini AI의 정밀한 운세 분석을 결합한 차세대 운세 플랫폼입니다.

## 📜 Development Rules (VibeCodingGuide)
본 프로젝트는 **VibeCodingGuide**를 준수합니다.
1.  **Micro TDD**: 모든 기능은 테스트 코드와 함께 구현합니다. (Playwright/Vitest)
2.  **Korean Commits**: 테스트 통과 시 **한국어**로 커밋 메시지를 작성합니다.
3.  **Clean Architecture**: Presentation, Domain, Data 레이어를 엄격히 분리합니다.
4.  **UI/UX**: Dark Mode, Glassmorphism, Mobile-First(375px~), Flutter WebView 호환성을 최우선으로 합니다.

## 🛠 Tech Stack
-   **Frontend**: React 18, Vite, TypeScript
-   **Styling**: Tailwind CSS (Glassmorphism), Framer Motion
-   **Architecture**: Clean Architecture
-   **Testing**: Playwright (E2E), Vitest (Unit)
-   **Backend**: Firebase (Auth, Firestore, Functions)
-   **AI**: Google Gemini 2.0 Pro

## 🚀 Getting Started

### 1. Installation
```bash
pnpm install
```

### 2. Environment Setup (Security)
> **WARNING**: `.env` 파일은 절대 Git에 커밋하지 마세요.

`.env.example`을 복사하여 `.env`를 생성하고 키를 입력합니다.
```bash
cp .env.example .env
```
```env
VITE_FIREBASE_API_KEY=your_key
VITE_GEMINI_API_KEY=your_key
```

### 3. Run Development Server
```bash
pnpm dev
```

### 4. Run Tests
```bash
pnpm test:e2e  # Playwright
pnpm test:unit # Vitest
```

## 📂 Project Structure (Clean Architecture)
```
src/
├── presentation/  # UI Components, Pages, State
├── domain/        # Entities, Use Cases, Interfaces
├── data/          # Repositories, API, DTOs
└── main.tsx
```
