#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
C.A.M v2 (Creative AI Marketer) - 마스터 프롬프트 시스템
AI의 창의성을 폭발시키는 프롬프트 엔지니어링 기반 콘텐츠 생성
"""

import json
from datetime import datetime
from typing import Dict, List, Any

class MasterPromptSystem:
    def __init__(self):
        self.master_prompt_template = self._load_master_prompt_template()
        self.success_cases = self._load_success_cases()
        self.creative_missions = self._load_creative_missions()
    
    def _load_master_prompt_template(self) -> str:
        """마스터 프롬프트 템플릿 로드"""
        return """
너는 대한민국 1등 명품 리셀 마케터이자, 트렌드 분석가, 카피라이터, 심리학자다. 
너의 목표는 단순히 제품을 설명하는 것이 아니라, 사람들의 숨겨진 욕망을 자극하고, 
그들이 미처 생각하지 못했던 새로운 관점을 제시하여 행동하게 만드는 것이다.

[데이터 입력]
아이템: {item_name}
브랜드: {brand}
경매가: {auction_price_jpy}엔
등급: {rank}
국내시세: {domestic_price_krw}원
특이사항: {notes}

[컨텍스트 입력]
현재 날짜: {current_date}
계절: {season}
시장 상황: {market_context}

[기존 성공사례 주입]
참고로, 다음 방식들이 과거에 성공했었다:
{success_cases}

이것들을 참고하되, 절대 똑같이 반복하지 말고, 
이들의 성공 요인(심리적 자극, 긴급성 부여 등)만 추출하여 완전히 새로운 앵글을 만들어라.

[창의적 발상 명령어]
위 정보를 바탕으로, 아래의 미션을 수행하여 기존에 우리가 한 번도 시도하지 않았던, 
완전히 새로운 쓰레드 콘텐츠 2개를 제안하라.

{creative_missions}

[결과물 형식 지정]
각 콘텐츠는 3~4개의 쓰레드 형식이어야 하며, 마지막에는 우리가 합의한 CTA를 포함해야 한다. 
또한, 각 콘텐츠마다 '어떤 창의적 발상 명령어'를 사용했는지, 
그리고 '왜 이 전략이 성공할 것 같은지'에 대한 간단한 자기 분석을 덧붙여라.
"""
    
    def _load_success_cases(self) -> List[str]:
        """과거 성공사례 로드"""
        return [
            "월급과 비교하는 방식: '월급 300만원인데 이거 하나 사면 한 달치 월급이 날아간다'",
            "호구 방지 폭로 방식: '이거 사면 호구되는 거 알면서도 사고 싶다'",
            "역발상 투자 방식: '다들 안 사는 거 사야 돈이 된다'",
            "감정 자극 방식: '이거 없으면 진짜 후회할 거야'",
            "사회적 증명 방식: '이미 사놓은 사람들만 아는 비밀'"
        ]
    
    def _load_creative_missions(self) -> str:
        """창의적 발상 명령어 로드"""
        return """
미션 1: 이 아이템의 '단점'(예: 낡음, 비주류 모델)을 오히려 '장점'으로 승화시키는 후킹을 만들어라.

미션 2: 이 아이템을 최근 사회적 트렌드(예: 올드머니 룩, Y2K, 지속가능성, 젠더리스)와 연결시켜 새로운 의미를 부여하라.

미션 3: 이 아이템을 전혀 다른 산업(예: 주식, 부동산, 자동차)의 성공 사례에 빗대어 설명하라.

미션 4: 이 아이템을 사야 하는 이유를 감성적인 스토리텔링이나 상징, 비유를 사용하여 표현하라.

미션 5: 이 아이템을 구매할 것 같은, 기존에 우리가 정의하지 않았던 '새로운 타겟 페르소나'를 3개 제안하고, 그중 하나를 골라 저격하는 콘텐츠를 만들어라.
"""
    
    def generate_master_prompt(self, item_data: Dict[str, Any]) -> str:
        """마스터 프롬프트 생성"""
        current_date = datetime.now().strftime("%Y년 %m월 %d일")
        season = self._determine_season(item_data.get('month', 9))
        market_context = self._get_market_context()
        
        success_cases_text = "\n".join([f"- {case}" for case in self.success_cases])
        
        return self.master_prompt_template.format(
            item_name=item_data.get('name', ''),
            brand=item_data.get('brand', ''),
            auction_price_jpy=item_data.get('auction_price_jpy', 0),
            rank=item_data.get('rank', ''),
            domestic_price_krw=item_data.get('domestic_price_krw', 0),
            notes=item_data.get('notes', ''),
            current_date=current_date,
            season=season,
            market_context=market_context,
            success_cases=success_cases_text,
            creative_missions=self.creative_missions
        )
    
    def _determine_season(self, month: int) -> str:
        """계절 판단"""
        if month in [12, 1, 2]:
            return "겨울"
        elif month in [3, 4, 5]:
            return "봄"
        elif month in [6, 7, 8]:
            return "여름"
        else:
            return "가을"
    
    def _get_market_context(self) -> str:
        """시장 상황 컨텍스트"""
        return "명품 리셀 시장 급성장, MZ세대 관심 증가, 지속가능한 패션 트렌드"
    
    def analyze_creative_potential(self, item_data: Dict[str, Any]) -> Dict[str, Any]:
        """창의적 잠재력 분석"""
        analysis = {
            'weakness_to_strength': self._analyze_weakness_to_strength(item_data),
            'trend_connections': self._analyze_trend_connections(item_data),
            'industry_analogies': self._analyze_industry_analogies(item_data),
            'emotional_storytelling': self._analyze_emotional_storytelling(item_data),
            'new_personas': self._suggest_new_personas(item_data)
        }
        return analysis
    
    def _analyze_weakness_to_strength(self, item_data: Dict[str, Any]) -> List[str]:
        """단점을 장점으로 승화시키는 방법 분석"""
        rank = item_data.get('rank', '')
        notes = item_data.get('notes', '').lower()
        
        strategies = []
        
        if rank in ['C', 'D', 'F']:
            strategies.append("낡은 것 = 빈티지, 오래된 것 = 클래식")
        
        if '수리' in notes or '손상' in notes:
            strategies.append("수리 필요 = 개인화 기회, 손상 = 스토리텔링 소재")
        
        if '비주류' in notes or '희귀' in notes:
            strategies.append("비주류 = 독점성, 희귀 = 특별함")
        
        return strategies
    
    def _analyze_trend_connections(self, item_data: Dict[str, Any]) -> List[str]:
        """트렌드 연결 분석"""
        item_name = item_data.get('name', '').lower()
        brand = item_data.get('brand', '').lower()
        
        trends = []
        
        if '트렌치' in item_name or '코트' in item_name:
            trends.extend(['올드머니 룩', '클래식 리바이벌', '지속가능한 패션'])
        
        if brand in ['chanel', 'hermes', 'louis vuitton']:
            trends.extend(['럭셔리 투자', '상품화된 패션', '상징적 가치'])
        
        if 'vintage' in item_name or 'retro' in item_name:
            trends.extend(['Y2K', '빈티지', '지속가능성'])
        
        return trends
    
    def _analyze_industry_analogies(self, item_data: Dict[str, Any]) -> List[str]:
        """산업 유추 분석"""
        price = item_data.get('auction_price_jpy', 0)
        domestic_price = item_data.get('domestic_price_krw', 0)
        
        analogies = []
        
        if price < 1000:  # 저가
            analogies.append("주식: 페니스톡 투자 - 작은 금액으로 큰 수익 가능")
            analogies.append("부동산: 원룸 투자 - 소액으로 시작하는 부동산")
        
        if domestic_price > price * 100:  # 높은 수익률
            analogies.append("자동차: 중고차 사업 - 원가 대비 높은 마진")
            analogies.append("주식: 성장주 투자 - 장기적 가치 상승")
        
        return analogies
    
    def _analyze_emotional_storytelling(self, item_data: Dict[str, Any]) -> List[str]:
        """감성적 스토리텔링 분석"""
        item_name = item_data.get('name', '')
        brand = item_data.get('brand', '')
        
        stories = []
        
        if '트렌치' in item_name:
            stories.append("영국 비 속에서의 로맨틱한 이야기")
            stories.append("클래식 영화 속 주인공의 스타일")
        
        if brand.lower() in ['chanel', 'hermes']:
            stories.append("명품의 역사와 전통")
            stories.append("세대를 이어가는 가치")
        
        return stories
    
    def _suggest_new_personas(self, item_data: Dict[str, Any]) -> List[Dict[str, str]]:
        """새로운 페르소나 제안"""
        item_name = item_data.get('name', '').lower()
        price = item_data.get('auction_price_jpy', 0)
        
        personas = []
        
        if '트렌치' in item_name or '코트' in item_name:
            personas.append({
                'name': '올드머니 지망생',
                'description': '클래식한 스타일을 추구하는 20-30대',
                'motivation': '세련된 이미지 구축'
            })
        
        if price < 2000:
            personas.append({
                'name': '소액 투자자',
                'description': '작은 돈으로 큰 수익을 노리는 사람',
                'motivation': '리스크 낮은 투자'
            })
        
        personas.append({
            'name': '지속가능 패션러',
            'description': '환경을 생각하는 패션 소비자',
            'motivation': '지속가능한 소비'
        })
        
        return personas

def main():
    """메인 실행 함수"""
    print("🎨 C.A.M v2 (Creative AI Marketer) 시작!")
    print("=" * 60)
    
    # 샘플 아이템 데이터
    sample_item = {
        'name': '버버리 트렌치코트',
        'brand': 'Burberry',
        'auction_price_jpy': 2000,
        'rank': 'B',
        'month': 9,
        'notes': '가을 신상, 클래식한 디자인, 약간의 마모',
        'domestic_price_krw': 800000
    }
    
    # 마스터 프롬프트 시스템 초기화
    master_system = MasterPromptSystem()
    
    # 마스터 프롬프트 생성
    master_prompt = master_system.generate_master_prompt(sample_item)
    
    print("📝 생성된 마스터 프롬프트:")
    print("-" * 60)
    print(master_prompt)
    print("-" * 60)
    
    # 창의적 잠재력 분석
    print("\n🔍 창의적 잠재력 분석:")
    print("-" * 60)
    analysis = master_system.analyze_creative_potential(sample_item)
    
    for key, value in analysis.items():
        print(f"\n{key.upper()}:")
        if isinstance(value, list):
            for item in value:
                print(f"  - {item}")
        else:
            print(f"  {value}")

if __name__ == "__main__":
    main()
