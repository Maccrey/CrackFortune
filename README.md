# FortuneCrack

다크모드 글라스모피즘 UI로 포춘쿠키를 깨고 Gemini 기반 운세를 보여주는 Vite + React + TypeScript 프로젝트입니다.

## 스크립트
- `npm run dev`: 로컬 개발 서버
- `npm run build`: 프로덕션 빌드
- `npm test`: Vitest 단위 테스트 (도메인/리포지토리)
- `npm run test:e2e`: Playwright E2E 테스트

## Gemini API 연결
- 개발: `.env`에 `VITE_GEMINI_ENDPOINT=/api/gemini`, `VITE_GEMINI_API_KEY=<키>` 설정 후 `npm run dev` (Vite 프록시 사용)
- 프로덕션: Vercel serverless 함수 `api/gemini.js`를 사용해 CORS를 피합니다. 배포 후 `.env`의 `VITE_GEMINI_ENDPOINT`를 `https://<배포도메인>/api/gemini`로 설정하고, Vercel 환경변수 `GEMINI_API_KEY`에 키를 넣으세요.

## 환경변수
`.env` 파일에 아래 값을 설정하세요. 예시는 `.env.example` 참고 (커밋 금지).

```
VITE_GEMINI_ENDPOINT=your-endpoint
VITE_GEMINI_API_KEY=your-api-key
```

엔드포인트/키가 비어 있으면 안전한 목(mock) 운세로 동작합니다.
