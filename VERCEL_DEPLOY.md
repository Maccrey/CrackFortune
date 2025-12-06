# Vercel 배포 가이드

## 🚀 Vercel 배포 방법

### 문제: GitHub Pages CORS 오류

GitHub Pages는 정적 호스팅만 제공하므로 Gemini API를 직접 호출할 수 없습니다 (CORS 정책).

**해결:** Vercel로 배포하여 서버리스 함수로 API 프록시 사용

### 1단계: Vercel 계정 연결

1. **Vercel 웹사이트** 방문: https://vercel.com
2. GitHub 계정으로 로그인
3. **New Project** 클릭

### 2단계: 프로젝트 Import

1. GitHub repository **CrackFortune** 선택
2. **Import** 클릭

### 3단계: 환경 변수 설정

**Environment Variables** 섹션에서:

- **Name**: `VITE_GEMINI_API_KEY`
- **Value**: [본인의 Gemini API 키]
- **Environment**: Production, Preview, Development 모두 체크

### 4단계: 배포

1. **Deploy** 버튼 클릭
2. 빌드 및 배포 완료 대기 (약 1-2분)
3. Vercel이 제공하는 URL 확인 (예: `crackfortune.vercel.app`)

### 5단계: 커스텀 도메인 설정 (선택)

1. Vercel 프로젝트 → Settings → Domains
2. `crackfortune.maccrey.com` 입력
3. DNS 설정 안내에 따라 CNAME 레코드 추가:
   - **Type**: CNAME
   - **Name**: `crackfortune`
   - **Value**: `cname.vercel-dns.com`

## 🔧 로컬 테스트

Vercel 배포 전에 로컬에서 테스트:

```bash
# Vercel CLI로 로컬 개발 서버 실행
npm run dev:vercel

# 또는 일반 Vite 개발 서버 (프록시 사용)
npm run dev
```

## 📁 파일 구조

```
/api
  └── gemini.ts          # Vercel 서버리스 함수 (API 프록시)
/src
  └── ...                # React 앱
vercel.json              # Vercel 설정
```

## ✅ 장점

- ✅ **CORS 문제 해결**: 서버리스 함수가 프록시 역할
- ✅ **API 키 보안**: 서버에서만 사용, 브라우저에 노출 안 됨
- ✅ **무료**: Hobby 플랜 사용 가능
- ✅ **자동 배포**: main 브랜치 Push 시 자동 재배포
- ✅ **커스텀 도메인 지원**

## 🆚 GitHub Pages vs Vercel

| 항목 | GitHub Pages | Vercel |
|------|-------------|--------|
| 호스팅 | 정적 파일만 | 정적 + 서버리스 |
| API 프록시 | ❌ 불가 | ✅ 가능 |
| CORS 문제 | ❌ 있음 | ✅ 없음 |
| 커스텀 도메인 | ✅ 지원 | ✅ 지원 |
| 자동 배포 | ✅ 지원 | ✅ 지원 |
| 비용 | 무료 | 무료 (Hobby) |

**권장:** Vercel 배포 사용 ✨

## 🔄 배포 흐름

```
git push origin main
  ↓
GitHub 감지
  ↓
Vercel 자동 빌드
  ↓
서버리스 함수 배포 (/api/gemini)
  ↓
정적 파일 배포 (React 앱)
  ↓
배포 완료!
```

## 🎯 최종 URL

- **Vercel 기본**: `https://crackfortune.vercel.app/`
- **커스텀 도메인**: `https://crackfortune.maccrey.com/`

즐거운 개발 되세요! 🚀
