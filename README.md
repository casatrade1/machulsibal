# 까사트레이드 콘텐츠 제작기

명품 사진을 업로드하면 자동으로 블로그와 쓰레드 콘텐츠를 생성하는 AI 기반 콘텐츠 제작 도구입니다.

## 🚀 주요 기능

- 📸 **이미지 업로드**: 드래그 앤 드롭으로 명품 사진 업로드
- 🤖 **AI 분석**: OpenAI GPT-4 Vision으로 제품 분석
- 📱 **쓰레드 생성**: 다양한 타겟층을 위한 후킹 콘텐츠
- 📝 **블로그 생성**: SEO 최적화된 전문 블로그 포스트
- 🎨 **다크모드**: 사용자 친화적인 UI/UX
- 📋 **복사 기능**: 생성된 콘텐츠 원클릭 복사
- 🔍 **시장 데이터**: 실제 경매 데이터 기반 가격 분석

## 🎯 타겟층별 맞춤 콘텐츠

- **20-30대 창업예정자**: 스타트업 실패 경험, 소자본 창업
- **40-50대 부업자**: 퇴직 준비, 자녀 등록금, 은퇴 후 수입
- **중고명품사업 시작자**: 진입장벽, 정품 보장, 공급처 확보
- **폴로/나이키 빈티지 셀러**: 객단가 한계, 수익성 비교
- **일반 관심자**: 부업, 투자, 수익 창출

## 🛠 기술 스택

- **Frontend**: HTML, CSS (Tailwind), JavaScript
- **Backend**: Vercel API Routes
- **AI**: OpenAI GPT-4 Vision, Anthropic Claude 3
- **배포**: Vercel

## 📦 설치 및 배포

### 1. GitHub에 업로드
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Vercel에 배포
1. [Vercel](https://vercel.com)에 로그인
2. "New Project" 클릭
3. GitHub 저장소 연결
4. 환경변수 설정:
   - `OPENAI_API_KEY`: OpenAI API 키
   - `CLAUDE_API_KEY`: Anthropic Claude API 키

### 3. 환경변수 설정
Vercel 대시보드에서 다음 환경변수를 설정하세요:
- `OPENAI_API_KEY`: `sk-...` (OpenAI API 키)
- `CLAUDE_API_KEY`: `sk-ant-...` (Claude API 키)

## 🎨 사용 방법

1. **이미지 업로드**: 명품 사진을 드래그 앤 드롭하거나 클릭하여 업로드
2. **코멘트 추가**: (선택사항) 생성할 콘텐츠에 반영할 코멘트 입력
3. **톤 설정**: 쓰레드와 블로그의 톤을 선택
4. **생성**: "콘텐츠 생성하기" 버튼 클릭
5. **복사**: 생성된 콘텐츠를 복사하여 사용

## 📊 AI 모델 사용 현황

- **OpenAI GPT-4 Vision**: 이미지 분석 및 제품 인식
- **Anthropic Claude 3**: 창의적 콘텐츠 생성 및 후킹 문구 최적화
- **Google Gemini**: CORS 정책으로 현재 사용 안됨

## 🔧 개발자 정보

- **개발**: 까사트레이드 개발팀
- **라이선스**: MIT License
- **문의**: support@casatrade.co.kr

## 📈 업데이트 로그

### v1.0.0 (2025-01-29)
- 초기 버전 출시
- AI 기반 콘텐츠 생성
- Vercel API Routes 연동
- 다크모드 지원