#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
전략 분석 모듈
아이템 정보를 바탕으로 최적의 마케팅 전략 결정
"""

class StrategyAnalyzer:
    def __init__(self):
        self.strategies = {
            '겨울준비_시즌선점': {
                'conditions': ['아우터/머플러', '가을/겨울'],
                'months': [8, 9, 10, 11, 12],
                'angle': '시즌 선점 투자',
                'personas': ['mz', 'startup', 'sidehustle']
            },
            '핑계불가_소액투자': {
                'conditions': ['저가', '소액'],
                'max_price': 50000,
                'angle': '핑계 불가 소액 투자',
                'personas': ['mz', 'sidehustle']
            },
            '묶음판매_개당단가': {
                'conditions': ['묶음', 'F등급'],
                'angle': '묶음 판매로 개당 단가 높이기',
                'personas': ['sidehustle', 'business']
            },
            '수리후재판매_사업가관점': {
                'conditions': ['수리필요', 'Immovable'],
                'angle': '수리 후 재판매로 수익 극대화',
                'personas': ['business', 'sidehustle']
            },
            '역수출_차익거래': {
                'conditions': ['역수출'],
                'angle': '국내보다 해외가 비싼 역수출 기회',
                'personas': ['business', 'startup']
            },
            '기본_영수증스타일': {
                'conditions': ['기본'],
                'angle': '영수증 스타일 투명한 가격 공개',
                'personas': ['mz', 'sidehustle', 'startup']
            }
        }
    
    def analyze_strategy(self, item_data, calculated_price):
        """아이템 정보를 바탕으로 최적 전략 분석"""
        item_name = item_data.get('name', '').lower()
        category = item_data.get('category', '')
        month = item_data.get('month', 0)
        rank = item_data.get('rank', '')
        notes = item_data.get('notes', '').lower()
        total_cost = calculated_price['total_cost_krw']
        domestic_price = item_data.get('domestic_price_krw', 0)
        
        # 1. 계절성 분석
        if self._is_winter_prep_item(category, month):
            return self._create_strategy_result('겨울준비_시즌선점', item_data, calculated_price)
        
        # 2. 가격대 분석
        if total_cost < 50000:
            return self._create_strategy_result('핑계불가_소액투자', item_data, calculated_price)
        
        # 3. 등급/상태 분석
        if '묶음' in item_name or rank == 'F':
            return self._create_strategy_result('묶음판매_개당단가', item_data, calculated_price)
        
        if 'immovable' in notes or '수리' in notes:
            return self._create_strategy_result('수리후재판매_사업가관점', item_data, calculated_price)
        
        # 4. 역수출 분석
        if domestic_price > 0 and total_cost < domestic_price * 0.7:
            return self._create_strategy_result('역수출_차익거래', item_data, calculated_price)
        
        # 5. 기본 전략
        return self._create_strategy_result('기본_영수증스타일', item_data, calculated_price)
    
    def _is_winter_prep_item(self, category, month):
        """겨울 준비 아이템인지 확인"""
        winter_categories = ['아우터/머플러', '부츠', '가방']
        winter_months = [8, 9, 10, 11, 12]
        
        return category in winter_categories and month in winter_months
    
    def _create_strategy_result(self, strategy_name, item_data, calculated_price):
        """전략 결과 생성"""
        strategy = self.strategies[strategy_name]
        
        return {
            'strategy_name': strategy_name,
            'angle': strategy['angle'],
            'recommended_personas': strategy['personas'],
            'reasoning': self._generate_reasoning(strategy_name, item_data, calculated_price),
            'key_points': self._extract_key_points(strategy_name, item_data, calculated_price)
        }
    
    def _generate_reasoning(self, strategy_name, item_data, calculated_price):
        """전략 선택 이유 생성"""
        total_cost = calculated_price['total_cost_krw']
        domestic_price = item_data.get('domestic_price_krw', 0)
        
        reasoning_templates = {
            '겨울준비_시즌선점': f"가을({item_data.get('month', 0)}월)에 {item_data.get('category', '')} 아이템은 겨울 준비 수요가 높아 시즌 선점 투자로 적합합니다.",
            '핑계불가_소액투자': f"총 매입가 {total_cost:,}원으로 소액 투자에 적합하며, 실패해도 부담이 적습니다.",
            '묶음판매_개당단가': f"묶음 판매로 개당 단가를 높여 수익률을 극대화할 수 있습니다.",
            '수리후재판매_사업가관점': f"수리 후 재판매로 원가 대비 높은 수익을 얻을 수 있습니다.",
            '역수출_차익거래': f"국내 시세 {domestic_price:,}원 대비 매입가 {total_cost:,}원으로 역수출 기회가 있습니다.",
            '기본_영수증스타일': f"투명한 가격 공개로 신뢰도를 높이고 고객을 확보할 수 있습니다."
        }
        
        return reasoning_templates.get(strategy_name, "기본 전략을 적용합니다.")
    
    def _extract_key_points(self, strategy_name, item_data, calculated_price):
        """핵심 포인트 추출"""
        total_cost = calculated_price['total_cost_krw']
        domestic_price = item_data.get('domestic_price_krw', 0)
        
        key_points = {
            'price_info': f"매입가: {total_cost:,}원",
            'profit_info': f"예상 수익: {domestic_price - total_cost:,}원" if domestic_price > 0 else "수익 정보 없음",
            'strategy_focus': self.strategies[strategy_name]['angle']
        }
        
        return key_points
