# Firebase Hosting 배포 가이드

## 📋 개요

FortuneCrack 애플리케이션을 Firebase Hosting에 배포하는 가이드입니다.

Firebase Hosting은 정적 웹 호스팅 서비스로, SPA(Single Page Application)를 쉽게 배포하고 관리할 수 있습니다.

## 🔑 사전 준비

### 1. Firebase 계정 및 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. **프로젝트 추가** 클릭
3. 프로젝트 이름 입력 (예: `fortune-crack`)
4. Google 애널리틱스 설정 (선택사항)
5. 프로젝트 생성 완료

### 2. Firebase CLI 설치

```bash
npm install -g firebase-tools
```

### 3. Firebase 로그인

```bash
firebase login
```

브라우저에서 Google 계정으로 로그인합니다.

### 4. Gemini API 키 발급

1. [Google AI Studio](https://aistudio.google.com/app/apikey) 접속
2. **Create API Key** 클릭
3. API 키 복사

## ⚙️ 환경 설정

### 1. 환경 변수 파일 생성

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가:

```env
VITE_GEMINI_API_KEY=your_api_key_here
VITE_GEMINI_MODEL_PATH=/v1/models/gemini-2.0-flash:generateContent
```

> **⚠️ 보안 주의사항**: 
> - `.env` 파일은 `.gitignore`에 포함되어 Git에 추가되지 않습니다
> - API 키는 빌드 시 번들에 포함되므로 **공개 프로젝트에서는 주의**가 필요합니다
> - 프로덕션 환경에서는 API 키 제한(HTTP referrer 등)을 설정하세요

### 2. Firebase 프로젝트 연결

```bash
firebase init hosting
```

다음 질문에 답변:

1. **Use an existing project or create a new one?** → Use an existing project
2. **Select a project:** → 앞서 생성한 프로젝트 선택
3. **What do you want to use as your public directory?** → `dist`
4. **Configure as a single-page app?** → Yes
5. **Set up automatic builds and deploys with GitHub?** → No (수동 배포)
6. **File dist/index.html already exists. Overwrite?** → No

## 🚀 배포하기

### 1. 프로젝트 빌드

```bash
npm run build
```

`.env` 파일의 환경 변수가 번들에 포함됩니다.

### 2. Firebase에 배포

```bash
firebase deploy --only hosting
```

배포 완료 후 제공되는 URL로 접속:
```
https://[project-id].web.app
```

## 🔧 배포 스크립트 (선택사항)

`package.json`에 배포 스크립트 추가:

```json
{
  "scripts": {
    "deploy": "npm run build && firebase deploy --only hosting",
    "deploy:preview": "npm run build && firebase hosting:channel:deploy preview"
  }
}
```

사용법:

```bash
# 프로덕션 배포
npm run deploy

# 프리뷰 배포 (테스트용)
npm run deploy:preview
```

## 🌐 커스텀 도메인 설정

### 1. Firebase Console에서 설정

1. Firebase Console → **Hosting** 메뉴
2. **Add custom domain** 클릭
3. 도메인 입력 (예: `crackfortune.maccrey.com`)
4. Firebase가 제공하는 DNS 레코드 확인

### 2. 도메인 DNS 설정

도메인 등록 업체(가비아, 호스팅케이알 등)에서:

**A 레코드:**
```
Name: @ (또는 crackfortune)
Value: [Firebase가 제공한 IP]
```

또는 **CNAME 레코드:**
```
Name: crackfortune
Value: [Firebase가 제공한 호스트명]
```

### 3. SSL 인증서

Firebase Hosting은 자동으로 SSL 인증서를 발급하고 갱신합니다 (Let's Encrypt).

DNS 설정 후 24-48시간 내에 자동 활성화됩니다.

## 🔒 Gemini API 키 보안

### 1. API 키 제한 설정

[Google Cloud Console](https://console.cloud.google.com/apis/credentials)에서:

1. API 키 선택
2. **Application restrictions** → **HTTP referrers**
3. 허용할 도메인 추가:
   ```
   https://[project-id].web.app/*
   https://crackfortune.maccrey.com/*
   ```

### 2. API 제한

**API restrictions** → **Restrict key**:
- Generative Language API만 선택

## 📊 배포 확인

### 1. Firebase Console에서 확인

Firebase Console → **Hosting** → **Dashboard**:
- 배포 히스토리
- 트래픽 통계
- 성능 메트릭

### 2. 브라우저에서 테스트

1. 배포된 URL 접속
2. 개발자 도구 (F12) 열기
3. Console 탭 확인:
   - `[vite.config] API Key loaded: ✓ (hidden)`
   - `[GeminiClient] Calling Gemini API...`
4. 프로필 설정 후 포춘쿠키 클릭
5. 운세 생성 확인

## 🛠️ 문제 해결

### 빌드 에러

**문제**: `[vite.config] API Key loaded: ✗ Missing`

**해결**: `.env` 파일에 `VITE_GEMINI_API_KEY` 추가

### CORS 에러

**문제**: Gemini API 호출 시 CORS 에러

**해결**: 
- API 키 제한 설정에서 도메인 확인
- 브라우저 캐시 삭제 후 재시도

### 404 에러 (라우팅 문제)

**문제**: `/result` 등의 경로에서 404

**해결**: `firebase.json`의 `rewrites` 설정 확인

### API 키 노출

**문제**: 번들에 API 키가 포함됨

**해결**:
- Google Cloud Console에서 API 키 제한 설정
- HTTP referrer로 특정 도메인만 허용

## 📝 추가 참고사항

### Firebase Hosting vs Vercel

| 기능 | Firebase Hosting | Vercel |
|------|------------------|---------|
| 정적 호스팅 | ✅ | ✅ |
| 서버리스 함수 | Firebase Functions | Vercel Functions |
| 커스텀 도메인 | ✅ 무료 | ✅ 무료 |
| SSL 인증서 | ✅ 자동 | ✅ 자동 |
| CDN | ✅ 글로벌 | ✅ 글로벌 |
| 무료 한도 | 10GB/월 | 100GB/월 |

### 배포 플로우

```mermaid
graph LR
    A[로컬 개발] --> B[빌드]
    B --> C[Firebase 배포]
    C --> D[CDN 배포]
    D --> E[사용자 접근]
```

## 🎉 배포 완료!

배포가 완료되었습니다! 🎊

**배포된 URL**: `https://[project-id].web.app`

**커스텀 도메인** (설정 시): `https://crackfortune.maccrey.com`
