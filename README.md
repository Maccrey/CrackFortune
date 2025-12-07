# FortuneCrack

다크모드 글라스모피즘 UI로 포춘쿠키를 깨고 Gemini 기반 운세를 보여주는 Vite + React + TypeScript 프로젝트입니다.

## 스크립트
- `npm run dev`: 로컬 개발 서버
- `npm run build`: 프로덕션 빌드
- `npm test`: Vitest 단위 테스트 (도메인/리포지토리)
- `npm run test:e2e`: Playwright E2E 테스트

## Gemini API 연결
- 개발: `.env`에 `VITE_GEMINI_ENDPOINT` 등 설정. Firebase Auth/Firestore 사용 시 `VITE_FIREBASE_*` 키 필수.
- 프로덕션: Firebase Console에서 Authentication(Google) 및 Firestore Database를 활성화해야 합니다.

## 환경변수
`.env` 파일에 아래 값을 설정하세요. 예시는 `.env.example` 참고 (커밋 금지).

```
VITE_GEMINI_ENDPOINT=your-endpoint
VITE_GEMINI_API_KEY=your-api-key
```

엔드포인트/키가 비어 있으면 안전한 목(mock) 운세로 동작합니다.
