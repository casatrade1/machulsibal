#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
페르소나별 콘텐츠 생성 모듈
각 페르소나에 맞는 쓰레드 콘텐츠 생성
"""

class PersonaGenerator:
    def __init__(self):
        self.personas = {
            'mz': {
                'tone': '트렌디하고 유머러스',
                'keywords': ['핫한', '대박', '레전드', '미쳤다', '존맛'],
                'style': '짧고 임팩트 있는 문장'
            },
            'startup': {
                'tone': '도전적이고 야심찬',
                'keywords': ['창업', '투자', '기회', '성장', '혁신'],
                'style': '구체적인 수치와 전략 제시'
            },
            'sidehustle': {
                'tone': '실용적이고 현실적',
                'keywords': ['부업', '수익', '효율', '실전', '팁'],
                'style': '경험담과 실용적 조언'
            },
            'business': {
                'tone': '전문적이고 분석적',
                'keywords': ['사업', '마진', '전략', '분석', '성과'],
                'style': '데이터 기반의 논리적 설명'
            }
        }
    
    def generate_content(self, item_data, calculated_price, strategy, persona):
        """페르소나별 콘텐츠 생성"""
        persona_info = self.personas[persona]
        
        # 기본 정보
        item_name = item_data['name']
        brand = item_data.get('brand', '')
        total_cost = calculated_price['total_cost_krw']
        domestic_price = item_data.get('domestic_price_krw', 0)
        profit = domestic_price - total_cost if domestic_price > 0 else 0
        
        # 페르소나별 콘텐츠 생성
        if persona == 'mz':
            return self._generate_mz_content(item_name, brand, total_cost, profit, strategy)
        elif persona == 'startup':
            return self._generate_startup_content(item_name, brand, total_cost, profit, strategy)
        elif persona == 'sidehustle':
            return self._generate_sidehustle_content(item_name, brand, total_cost, profit, strategy)
        elif persona == 'business':
            return self._generate_business_content(item_name, brand, total_cost, profit, strategy)
        else:
            return self._generate_default_content(item_name, brand, total_cost, profit, strategy)
    
    def _generate_mz_content(self, item_name, brand, total_cost, profit, strategy):
        """MZ세대용 콘텐츠"""
        content = f"""🔥 {brand} {item_name} 대박 발견!

💰 매입가: {total_cost:,}원
📈 예상 수익: {profit:,}원 (수익률: {(profit/total_cost*100):.1f}%)

{strategy['angle']} 전략으로 가져왔는데 진짜 미쳤다... 😱

이거 진짜 핫할 것 같은데? 
겨울 준비하는 사람들 많을 거 아냐?

#명품리셀 #부업 #투자 #겨울준비"""
        
        return content
    
    def _generate_startup_content(self, item_name, brand, total_cost, profit, strategy):
        """창업자용 콘텐츠"""
        content = f"""🚀 {brand} {item_name} 투자 기회 분석

📊 투자 정보:
• 매입가: {total_cost:,}원
• 예상 수익: {profit:,}원
• 수익률: {(profit/total_cost*100):.1f}%
• 전략: {strategy['angle']}

이 아이템은 {strategy['reasoning']}

창업 초기 자본이 부족한 상황에서도 
이런 소액 투자로 시작할 수 있어요.

투자 성공률을 높이려면 
시장 트렌드를 정확히 파악하는 것이 핵심!

#창업 #투자 #명품리셀 #스타트업"""
        
        return content
    
    def _generate_sidehustle_content(self, item_name, brand, total_cost, profit, strategy):
        """부업자용 콘텐츠"""
        content = f"""💼 {brand} {item_name} 부업 실전 후기

실제 매입가: {total_cost:,}원
예상 판매가: {total_cost + profit:,}원
순수익: {profit:,}원

{strategy['angle']} 방식으로 접근했어요.

부업으로 명품 리셀 할 때 
가장 중요한 건 '타이밍'이에요.

이번엔 겨울 준비 시즌이라 
수요가 높을 것 같아서 투자했어요.

초보자도 따라할 수 있는 
실전 팁들 공유할게요!

#부업 #명품리셀 #수익 #실전팁"""
        
        return content
    
    def _generate_business_content(self, item_name, brand, total_cost, profit, strategy):
        """사업자용 콘텐츠"""
        content = f"""📈 {brand} {item_name} 사업 분석 보고서

투자 분석:
• 원가: {total_cost:,}원
• 목표가: {total_cost + profit:,}원
• 마진: {profit:,}원 ({(profit/total_cost*100):.1f}%)
• 전략: {strategy['angle']}

시장 분석:
{strategy['reasoning']}

사업 관점에서 보면 
이 아이템은 수익성과 리스크가 
적절히 균형을 이룬 투자안입니다.

장기적 관점에서 브랜드 가치와 
시장 수요를 고려했을 때 
안정적인 수익을 기대할 수 있어요.

#사업 #투자분석 #명품 #마케팅"""
        
        return content
    
    def _generate_default_content(self, item_name, brand, total_cost, profit, strategy):
        """기본 콘텐츠"""
        content = f"""📱 {brand} {item_name} 리셀 정보

매입가: {total_cost:,}원
예상 수익: {profit:,}원
전략: {strategy['angle']}

{strategy['reasoning']}

투명한 가격 공개로 
신뢰할 수 있는 거래를 추구합니다.

#명품리셀 #투명거래 #신뢰"""
        
        return content
