FortuneCrack — Interactive AI Fortune Cookie powered by Gemini
1. 소개

FortuneCrack은 포춘쿠키를 깨면 Gemini가 생성한 오늘의 운세가 나타나는 글로벌 AI 운세 웹앱입니다.
ko/en/ja 3개 언어를 공식 지원하며, 생시 정밀도까지 고려한 개인화된 운세를 제공합니다.

2. 주요 기능

포춘쿠키 애니메이션 + Gemini 오늘의 운세

주간/월간/연운 – 카드/타임라인 기반 시각화

Gemini AI Q&A (다국어 톤 조절)

Precision 기반 운세 신뢰도 표기

3. 기술 스택
Frontend

React 18 + Vite

TypeScript

Tailwind CSS

Framer Motion

React Query

react-i18next (ko/en/ja)

Backend

Firebase Auth

Cloud Firestore

Firebase Cloud Functions

Gemini 2.0 API (운세 생성·Q&A)

Deploy

GitHub Pages (프런트)

Firebase Functions (백엔드)

4. 실행
pnpm install
cp .env.example .env.local   # GEMINI_API_KEY 포함

pnpm firebase:emulators
pnpm dev       # UI (Gemini 없는 목업)
pnpm functions:dev  # Gemini 연동
pnpm build

5. 환경 변수(.env)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_PROJECT_ID=
VITE_GEMINI_API_KEY=
