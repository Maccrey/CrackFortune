# FortuneCrack

다크모드 글라스모피즘 UI로 포춘쿠키를 깨고 Gemini 기반 운세를 보여주는 Vite + React + TypeScript 프로젝트입니다.

## 스크립트
- `npm run dev`: 로컬 개발 서버
- `npm run build`: 프로덕션 빌드
- `npm test`: Vitest 단위 테스트 (도메인/리포지토리)
- `npm run test:e2e`: Playwright E2E 테스트
- `npm run test:e2e`: Playwright E2E 테스트

## 배포 (Deployment)
- **Firebase Hosting**: https://fortunecrack-1b398.web.app

## 주요 기능
- **포춘 쿠키**: 3D 애니메이션과 함께 오늘의 운세 확인.
- **AI 점술가 채팅**: 운세 결과를 바탕으로 AI와 3분간 무료 상담.
- **시간 연장**: 로그인 유저는 광고 시청을 통해 상담 시간을 연장 가능.
- **데이터 동기화**: 게스트 모드(로컬 저장) 지원 및 로그인 시 클라우드(Firebase) 자동 동기화.
- **광고 시스템**: Kakao AdFit 배너 광고 적용 (모바일 햄버거 메뉴 및 하단 배너 320x50 최적화).

## Gemini API 연결
- 개발: `.env`에 `VITE_GEMINI_ENDPOINT` 등 설정. Firebase Auth/Firestore 사용 시 `VITE_FIREBASE_*` 키 필수.
- 프로덕션: Firebase Console에서 Authentication(Google) 및 Firestore Database를 활성화해야 합니다.

## 환경변수
`.env` 파일에 아래 값을 설정하세요. 예시는 `.env.example` 참고 (커밋 금지).

```
VITE_GEMINI_ENDPOINT=your-endpoint
VITE_GROQ_API_KEY=your-groq-api-key
```

엔드포인트/키가 비어 있으면 안전한 목(mock) 운세로 동작합니다.
