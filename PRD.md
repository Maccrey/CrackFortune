product: FortuneCrack — Interactive Gemini Fortune Cookie Platform

1. 제품 개요
제품명

FortuneCrack

슬로건

Break your fortune. Every day. Powered by Gemini.

문제 정의

전통 운세 서비스는 템플릿 형태의 반복적 문구 제공 → 몰입도 낮음

생시(정확/대략/모름) 고려 부족 → 개인화 정확도 낮음

글로벌 사용자(ko/en/ja) 모두를 위한 자연스러운 언어·톤 제공 어려움

단순 텍스트 중심의 ‘오늘 운세’ → 재미/의식성 낮음

상호작용·몰입형 애니메이션 부족

FortuneCrack의 해결 방식

Gemini 기반 개인 맞춤 운세 생성

명리/토정 raw 계산 → Gemini로 자연스러운 스토리·요약·해석 생성

한국어/영어/일본어 3개 언어의 톤·문화적 뉘앙스 자동 조정

포춘쿠키 애니메이션 중심 UX

오늘 운세는 “쿠키를 깨고 종이가 나오는” 의식적 인터랙션

생시 정확도(Precision) UI/로직 반영

GitHub Pages(Frontend) + Firebase(Backend) + Gemini AI

디자인/인터랙션(Gemini) → 기능 구현(Codex) 순서 고정

2. 핵심 가치 제안

FortuneCrack은 Gemini 기반으로 개인에게 최적화된 오늘의 운세를, 포춘쿠키를 깨는 경험으로 제공합니다.
한국어/영어/일본어를 자연스럽게 지원하고, 생시 정확도를 반영한 신뢰도 높은 글로벌 AI 운세 플랫폼입니다.

3. 핵심 기능 (문제 → 해결 → 지표)
3.1 오늘의 Gemini 포춘쿠키 운세

문제: 텍스트만 보여주는 오늘 운세는 재미가 부족

해결:

포춘쿠키 → 흔들림 → crack → fortune slip 등장

slip에는 Gemini 생성 요약 + Precision 배지(정밀/기본)

“더 보기” → 상세 텍스트는 Gemini가 locale별로 생성

지표:

개봉률 ≥ 80%

상세 보기 클릭률 ≥ 60%

D1≥35%

3.2 연운/주간/월간 대시보드 (Gemini 요약 기반)

raw 명리 계산 → Gemini로 서사적 요약

카드·타임라인 인터랙션

주요 영역(재정/관계/건강/커리어) 스코어

3.3 Gemini AI Q&A (ko/en/ja)

기존 운세 결과 기반으로 후속 질문/상담 가능

locale별 톤/경어/문체 Gemini 프롬프트에서 자동 조정

맥락(오늘 요약·정밀도·프로필)을 context로 전달

4. 유저 스토리 (요약)
한국어 포춘쿠키
Feature: 오늘의 포춘쿠키 운세
  Scenario: 포춘쿠키를 깨고 오늘의 Gemini 운세를 확인
    Given 나는 한국어 UI에서 메인 페이지에 접근했다
    When 중앙 포춘쿠키를 탭한다
    Then 포춘쿠키가 깨지는 애니메이션이 재생된다
    And Gemini 생성 요약이 slip에 표시된다
    And 정밀도 배지가 함께 보인다

일본어 기본 언어 자동 적용
Feature: 일본어 디폴트
  Scenario: 브라우저 언어가 일본어일 때
    Given 브라우저 언어=일본어
    When 페이지 로드
    Then 기본 언어는 일본어로 설정된다

5. 성공 지표(최종)
지표	목표	이벤트	계산식
포춘쿠키 개봉률	≥ 80%	cookie_open	open/view
Gemini 운세 상세 클릭률	≥ 60%	fortune_detail_open	detail/open
다국어 유지율	≥ 80%	language_change	last_lang == selected_lang
Precision-Exact 비율	≥ 40%	profile_created	exact/created
LLM 오류율	≤ 1%	llm_error	error/llm_call
LCP p75	≤ 2.5s	RUM	p75(LCP)
6. 비기능 요구사항

AI: Gemini 2.0 Pro API

성능: 포춘쿠키 애니메이션 60fps

PWA: 오늘 운세 캐싱

보안: Firestore Rules + Function input validation

국제화: ko/en/ja, Gemini 프롬프트의 locale template 적용

7. 데이터 모델 (요약)
profiles
필드	타입	Firestore	설명
locale	"ko"	"en"	"ja"
birthTimeAccuracy	exact/range/unknown	string	정밀도 계산
birthTimeRange	dawn/morning/…	string	null
fortuneResults
필드	타입	Firestore	설명
summary	{ko,en,ja}	map	Gemini 요약
fullText	{ko,en,ja}	map	Gemini 상세
precision	high/basic	string	정밀도
geminiModel	string	string	"gemini-pro-2.0" 등
8. 런칭 플랜

MVP: Today Fortune + ko/en

MLP: ja + 연운/카드/타임라인

GA: AI Q&A + 글로벌 캠페인