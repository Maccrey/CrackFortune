# Firebase Hosting 배포 가이드

## 📋 개요

FortuneCrack 애플리케이션을 Firebase Hosting에 배포하는 가이드입니다.
이 프로젝트는 **React + Vite** 기반이며, **Firebase** (Auth, Firestore, Hosting)와 **Groq AI**를 사용합니다.

## 🔑 사전 준비

### 1. Firebase 프로젝트 설정

1. [Firebase Console](https://console.firebase.google.com/) 접속 및 프로젝트 선택
2. **Authentication** 설정:
   - Sign-in method: **Google** 활성화
3. **Firestore Database** 생성:
   - 보안 규칙 설정 (로그인 사용자만 쓰기 가능 등)
4. **App Hosting** 설정 (선택사항)

### 2. Groq API 키 발급

1. [Groq Console](https://console.groq.com/) 접속
2. API Key 발급 및 복사

## ⚙️ 환경 설정

### 1. 환경 변수 파일 (.env)

프로젝트 루트에 `.env` 파일을 생성하고 다음 값을 채워넣으세요.
(Firebase 설정값은 Firebase Console -> Project Settings 에서 확인 가능)

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Groq AI Configuration
VITE_GROQ_API_KEY=gsk_your_groq_api_key
```

> **⚠️ 보안 주의사항**: 
> - `.env` 파일은 절대 Git에 커밋하지 마세요. (`.gitignore`에 포함됨)
> - Firebase Config 정보는 클라이언트에 노출되어도 안전하지만, **Groq API Key**는 주의가 필요합니다.
> - 프로덕션 환경에서는 백엔드 프록시를 통하거나, 가능한 한 API 사용량 제한을 설정하세요.

### 2. Firebase CLI 연결

```bash
# 1. CLI 설치
npm install -g firebase-tools

# 2. 로그인
firebase login

# 3. 프로젝트 초기화 (이미 되어있다면 생략 가능)
firebase init hosting
```

**초기화 설정 값:**
- **Public directory**: `dist`
- **Configure as a single-page app**: `Yes`
- **Overwrite index.html**: `No`

## 🚀 수동 배포하기

로컬에서 빌드 후 바로 배포하는 방법입니다.

### 1. 프로젝트 빌드

```bash
npm run build
```
이 과정에서 TypeScript 컴파일 체크(`tsc -b`)와 Vite 빌드가 수행됩니다.

### 2. Firebase에 배포

```bash
firebase deploy --only hosting
```

배포가 완료되면 콘솔에 출력된 `Hosting URL`로 접속하여 확인합니다.

---

## 🤖 CI/CD (GitHub Actions)

이 프로젝트는 `.github/workflows/ci.yml`을 통해 자동화된 CI 파이프라인을 구축했습니다.

### 동작 방식
1. `push` 또는 `pull_request` 발생 시 트리거됨.
2. **Build & Test**:
   - Node.js 환경 설정
   - 의존성 설치 (`npm ci`)
   - 빌드 (`npm run build`)
   - 유닛 테스트 (`npm test`)
3. **Playwright E2E Test** (선택사항, `CI_E2E=true` 설정 시)

### 자동 배포 설정 (옵션)
GitHub Actions를 통해 자동 배포하려면:
1. `firebase init hosting:github` 실행
2. GitHub Secrets에 `FIREBASE_SERVICE_ACCOUNT` 등록
3. 생성된 워크플로우 파일 확인

## 🔧 문제 해결 (Troubleshooting)

### 1. 로그인 후 "Watch Ad" 버튼이 안 보임
- **원인**: Firebase Auth 상태가 동기화되지 않았거나, 데이터 마이그레이션 실패.
- **확인**: 개발자 도구 Console에서 `[AuthContext] Profile migrated...` 로그 확인.
- **해결**: 새로고침하거나 브라우저 캐시 삭제 후 재로그인.

### 2. 운세 생성이 안 됨 (Groq API 오류)
- **원인**: API 키 누락 또는 할당량 초과.
- **확인**: Network 탭에서 API 요청 실패 확인 (401/429 에러).
- **해결**: `.env`의 `VITE_GROQ_API_KEY` 확인 또는 키 재발급.

### 3. 배포 후 404 에러
- **원인**: SPA 라우팅 설정 미비.
- **해결**: `firebase.json`의 `rewrites` 섹션 확인.
  ```json
  "rewrites": [ { "source": "**", "destination": "/index.html" } ]
  ```

## 🔒 보안 규칙 (Firestore)

`firestore.rules` 파일이 올바르게 배포되었는지 확인하세요.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /fortunes/{fortuneId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## 🎉 배포 체크리스트

- [ ] `.env` 파일에 모든 키가 설정되었는가?
- [ ] `npm run build`가 에러 없이 완료되는가?
- [ ] Firestore 보안 규칙이 배포되었는가?
- [ ] Google Login이 허용된 도메인(Firebase Console -> Auth -> Settings -> Authorized domains)에 등록되었는가?

---
**배포 URL**: `https://[project-id].web.app`
