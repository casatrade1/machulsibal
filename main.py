#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
까사트레이드 AI 마케터
명품 리셀 전략 분석 및 콘텐츠 생성 도구
"""

import json
from datetime import datetime
from calculator import PriceCalculator
from strategy_analyzer import StrategyAnalyzer
from persona_generator import PersonaGenerator
from cta_manager import CTAManager

class CasaTradeAIMarketer:
    def __init__(self):
        self.calculator = PriceCalculator()
        self.strategy_analyzer = StrategyAnalyzer()
        self.persona_generator = PersonaGenerator()
        self.cta_manager = CTAManager()
    
    def process_item(self, item_data):
        """아이템 정보를 처리하여 마케팅 콘텐츠 생성"""
        print("🔄 아이템 분석 시작...")
        
        # 1. 가격 계산
        calculated_price = self.calculator.calculate_total_cost(item_data)
        print(f"💰 총 매입가: {calculated_price['total_cost_krw']:,}원")
        
        # 2. 전략 분석
        strategy = self.strategy_analyzer.analyze_strategy(item_data, calculated_price)
        print(f"🎯 추천 전략: {strategy['strategy_name']}")
        
        # 3. 페르소나별 콘텐츠 생성
        personas = strategy['recommended_personas']
        contents = {}
        
        for persona in personas:
            content = self.persona_generator.generate_content(
                item_data, calculated_price, strategy, persona
            )
            contents[persona] = content
            print(f"📝 {persona} 콘텐츠 생성 완료")
        
        # 4. CTA 추가
        final_contents = {}
        for persona, content in contents.items():
            cta = self.cta_manager.get_cta(persona, strategy)
            final_contents[persona] = content + "\n\n" + cta
        
        return {
            'item_info': item_data,
            'calculated_price': calculated_price,
            'strategy': strategy,
            'contents': final_contents,
            'generated_at': datetime.now().isoformat()
        }

def main():
    """메인 실행 함수"""
    print("🏠 까사트레이드 AI 마케터 시작!")
    print("=" * 50)
    
    # 샘플 아이템 데이터
    sample_item = {
        'name': '버버리 트렌치코트',
        'brand': 'Burberry',
        'auction_price_jpy': 2000,
        'rank': 'B',
        'month': 9,
        'category': '아우터/머플러',
        'notes': '가을 신상, 클래식한 디자인',
        'domestic_price_krw': 800000
    }
    
    # AI 마케터 초기화
    marketer = CasaTradeAIMarketer()
    
    # 아이템 처리
    result = marketer.process_item(sample_item)
    
    # 결과 출력
    print("\n" + "=" * 50)
    print("📊 분석 결과")
    print("=" * 50)
    
    for persona, content in result['contents'].items():
        print(f"\n🎭 {persona.upper()} 페르소나")
        print("-" * 30)
        print(content)
        print()

if __name__ == "__main__":
    main()
