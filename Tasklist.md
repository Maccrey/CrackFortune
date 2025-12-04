(규칙: Gemini → 인터랙티브 디자인·UI / Codex → 기능 구현)

PHASE 0 — 구조
[GitHub Pages SPA]
   |
   v
[React + Tailwind + Framer Motion] ← Gemini 역할 (UI/애니메이션)
   |
   v
[Firebase SDK] ← Codex 역할 (Auth/Firestore)
   |
   v
[Cloud Functions → Gemini API] ← Codex 역할 (로직/데이터)

PHASE 1 — GEMINI (UI/애니메이션/인터랙션)

UI는 더미 데이터로 먼저 완성.

1. 공통 UI/레이아웃

 다국어 UI 스켈레톤

 언어 토글(ko/en/ja)

 헤더/푸터/다크테마

2. 포춘쿠키

 쿠키 idle/shake/crack 애니메이션

 slip 등장 애니메이션

 slip 펼치기 상세 보기

3. Today 운세 목업

 dummy summary/precision

 locale 변경 시 UI 텍스트 동적 반영

4. 연운/주간/월간 UI

 카드 Carousel

 카드 플립/페이드

 연간 타임라인

5. 검증

 Storybook

 visual regression

 axe 접근성

(완료 조건)
Firebase/AI 없이 100% UI/애니메이션이 동작.

PHASE 2 — CODEX (기능/데이터/Gemini 연동)
1. 데이터/타입

 Firestore 모델

 Precision 계산 로직

 locale fallback

2. Firebase Auth/Firestore

 Auth 흐름

 profiles CRUD

 user today's opened-at 저장

3. 포춘쿠키 기능(Gemini)

 Cloud Function: /api/fortune/daily

Gemini 프롬프트 구성:

locale, birth info, precision, 오늘 날짜

 FE에서 쿠키 개봉 시 요청 트리거

 이미 본 날짜면 캐싱된 결과 사용

4. 연운/주간/월간 (Gemini)

 fortune-yearly/weekly/monthly Functions

 Gemini: summary & fullText locale별 생성

5. AI Q&A

 chat session/ message Firestore

 Gemini API with conversation context

6. 테스트

 Unit: Precision, locale selection

 Emulator: Firestore/Functions

 E2E: Today Fortune Flow

 CI: LHCI(성능), Sentry 에러 검증

PHASE 3 — 배포/운영
GitHub Pages

 Vite build → gh-pages 브랜치

 Custom domain: fortunecrack.com (옵션)

Firebase

 functions deploy

 security rules

모니터링

 Sentry (FE/BE)

 Gemini API error logging

 Web Vitals → BigQuery

요약

이 문서는 FortuneCrack의:

브랜드/제품 전략

포춘쿠키 중심 UX

Gemini 기반 운세 생성/다국어 대응

Firebase 백엔드

GitHub Pages 프런트엔드

Gemini vs Codex 역할 분리

지표/데이터 모델/CI/CD

까지, 모든 요소가 완전한 형태로 통합된 최종본입니다.