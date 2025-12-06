# FortuneCrack GitHub Pages 배포 가이드

이 문서는 FortuneCrack 프로젝트를 GitHub Pages에 배포하는 방법을 설명합니다.

## 📋 사전 준비사항

### 1. Gemini API Key 설정

GitHub Pages에서 Gemini API를 사용하려면 GitHub Secrets에 API 키를 등록해야 합니다.

**방법:**
1. GitHub 저장소로 이동
2. `Settings` → `Secrets and variables` → `Actions` 클릭
3. `New repository secret` 클릭
4. Name: `VITE_GEMINI_API_KEY`
5. Secret: 본인의 Gemini API 키 입력
6. `Add secret` 클릭

### 2. GitHub Pages 설정

**방법:**
1. GitHub 저장소로 이동
2. `Settings` → `Pages` 클릭
3. **Source** 섹션에서:
   - Source: `GitHub Actions` 선택
4. 저장

> ⚠️ **중요:** `Deploy from a branch`가 아닌 **`GitHub Actions`**를 선택해야 합니다!

## 🚀 자동 배포 (추천)

main 브랜치에 푸시하면 자동으로 배포됩니다.

```bash
# 변경사항 커밋
git add .
git commit -m "feat: 새로운 기능 추가"

# main 브랜치에 푸시
git push origin main
```

**배포 확인:**
1. GitHub 저장소의 `Actions` 탭으로 이동
2. 가장 최근 workflow 실행 확인
3. 빌드 및 배포가 완료되면 🟢 녹색 체크마크 표시
4. 배포된 사이트 확인: `https://<username>.github.io/FortuneCrack/`

## 🏗️ 수동 배포

자동 배포가 실패하거나 수동으로 배포하고 싶은 경우:

### 방법 1: GitHub Actions에서 수동 실행

1. GitHub 저장소의 `Actions` 탭으로 이동
2. 왼쪽 사이드바에서 `Deploy to GitHub Pages` workflow 선택
3. `Run workflow` 버튼 클릭
4. 브랜치 선택 (보통 `main`)
5. `Run workflow` 클릭

### 방법 2: 로컬에서 빌드 후 배포

```bash
# 1. 프로덕션 빌드
npm run build

# 2. 빌드 결과물 확인
ls -la dist/

# 3. GitHub에 푸시하여 자동 배포 트리거
git add .
git commit -m "build: 프로덕션 빌드"
git push origin main
```

## 🔧 빌드 설정

### Base URL

Vite 설정에서 GitHub Pages의 repository 경로를 base URL로 설정했습니다:

```typescript
// vite.config.ts
base: mode === 'production' ? '/CrackFortune/' : '/'
```

- **로컬 개발**: `http://localhost:5173/` (base: `/`)
- **GitHub Pages**: `https://<username>.github.io/CrackFortune/` (base: `/CrackFortune/`)

### 환경 변수

프로덕션 빌드 시 필요한 환경 변수:

- `VITE_GEMINI_API_KEY`: Gemini API 키 (GitHub Secrets에 등록)
- `VITE_GEMINI_ENDPOINT`: Gemini API엔드포인트 (workflow에서 자동 설정됨)

> 💡 **참고:** `VITE_GEMINI_ENDPOINT`는 workflow 파일에 하드코딩되어 있으므로 별도로 설정할 필요 없습니다.

## 🔍 문제 해결

### 1. 404 에러 발생

**원인:** base URL이 잘못 설정됨

**해결:**
- `vite.config.ts`의 `base` 설정 확인
- Repository 이름이 `CrackFortune`인지 확인

### 2. Gemini API 호출 실패

**원인:** API Key가 설정되지 않음

**해결:**
1. GitHub Secrets에 `VITE_GEMINI_API_KEY` 등록 확인
2. Actions workflow에서 환경 변수 전달 확인:
   ```yaml
   env:
     VITE_GEMINI_API_KEY: ${{ secrets.VITE_GEMINI_API_KEY }}
   ```

### 3. 빌드 실패

**원인:** TypeScript 또는 Lint 오류

**해결:**
```bash
# 로컬에서 빌드 테스트
npm run build

# Lint 확인
npm run lint

# TypeScript 타입 체크
npx tsc --noEmit
```

### 4. 빈 페이지 표시

**원인:** JavaScript 파일 경로가 잘못됨

**해결:**
- 브라우저 개발자 도구(F12) → Console 탭에서 에러 확인
- Network 탭에서 404 에러가 있는 리소스 확인
- `vite.config.ts`의 `base` 설정이 올바른지 확인

## 📊 배포 상태 확인

### GitHub Actions Dashboard

1. 저장소의 `Actions` 탭에서 workflow 실행 상태 확인
2. 각 단계(Checkout, Build, Deploy)의 로그 확인 가능

### 배포된 사이트 확인

```
https://maccrey.github.io/CrackFortune/
```

## 🔄 배포 흐름

```mermaid
graph LR
    A[코드 수정] --> B[git commit]
    B --> C[git push origin main]
    C --> D[GitHub Actions 트리거]
    D --> E[Dependencies 설치]
    E --> F[빌드 npm run build]
    F --> G[dist 폴더 생성]
    G --> H[GitHub Pages에 업로드]
    H --> I[배포 완료]
```

## 📝 참고사항

### API 프록시

- **로컬 개발**: Vite 개발 서버의 프록시 사용 (`/api/gemini` → Gemini API)
- **프로덕션**: 클라이언트에서 직접 Gemini API 호출 (API 키는 빌드 시 포함)

> ⚠️ **보안 주의:** 프로덕션 빌드에 API 키가 포함되므로, 클라이언트에서 직접 API를 호출합니다. API 키가 브라우저에서 노출될 수 있으니, Gemini API의 사용량 제한을 설정하는 것을 권장합니다.

### Vercel vs GitHub Pages

이 프로젝트는 Vercel과 GitHub Pages 모두 지원합니다:

- **Vercel**: Serverless Functions 사용 가능, API 키 숨길 수 있음
- **GitHub Pages**: 정적 호스팅, 무료, 간편함

선택은 프로젝트 요구사항에 따라 결정하세요.

## 🎉 배포 성공!

배포가 완료되면 다음 URL에서 애플리케이션을 확인할 수 있습니다:

```
https://maccrey.github.io/CrackFortune/
```

즐거운 개발 되세요! 🚀
