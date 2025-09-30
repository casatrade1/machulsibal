#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
가격 계산 모듈
환율, 관세, 수수료를 자동으로 계산
"""

import requests
from datetime import datetime

class PriceCalculator:
    def __init__(self):
        self.exchange_rate = self.get_exchange_rate()
        self.customs_rate = 0.11  # 11% 관세
        self.service_fee_rate = 0.03  # 3% 수수료
    
    def get_exchange_rate(self):
        """실시간 환율 조회 (엔화)"""
        try:
            # 실제로는 환율 API를 사용해야 함
            # 여기서는 예시로 0.9 사용
            return 0.9
        except:
            print("⚠️ 환율 API 오류, 기본값 사용")
            return 0.9
    
    def calculate_total_cost(self, item_data):
        """총 매입가 계산"""
        auction_price_jpy = item_data['auction_price_jpy']
        
        # 1. 엔화 → 원화 변환
        krw_price = auction_price_jpy * self.exchange_rate * 1000  # 1000원 단위
        
        # 2. 관세 계산
        customs_fee = krw_price * self.customs_rate
        
        # 3. 수수료 계산
        service_fee = krw_price * self.service_fee_rate
        
        # 4. 총 매입가
        total_cost = krw_price + customs_fee + service_fee
        
        return {
            'auction_price_jpy': auction_price_jpy,
            'auction_price_krw': krw_price,
            'customs_fee': customs_fee,
            'service_fee': service_fee,
            'total_cost_krw': int(total_cost),
            'exchange_rate': self.exchange_rate,
            'profit_margin': self.calculate_profit_margin(total_cost, item_data.get('domestic_price_krw', 0))
        }
    
    def calculate_profit_margin(self, total_cost, domestic_price):
        """수익률 계산"""
        if domestic_price == 0:
            return 0
        
        profit = domestic_price - total_cost
        margin = (profit / total_cost) * 100
        return round(margin, 2)
    
    def get_price_analysis(self, item_data, calculated_price):
        """가격 분석 결과"""
        domestic_price = item_data.get('domestic_price_krw', 0)
        total_cost = calculated_price['total_cost_krw']
        
        analysis = {
            'is_profitable': domestic_price > total_cost,
            'profit_amount': domestic_price - total_cost if domestic_price > 0 else 0,
            'profit_margin': calculated_price['profit_margin'],
            'price_competitiveness': self.analyze_price_competitiveness(total_cost, domestic_price)
        }
        
        return analysis
    
    def analyze_price_competitiveness(self, total_cost, domestic_price):
        """가격 경쟁력 분석"""
        if domestic_price == 0:
            return "국내 시세 정보 없음"
        
        ratio = total_cost / domestic_price
        
        if ratio < 0.5:
            return "매우 경쟁력 있음 (50% 이하)"
        elif ratio < 0.7:
            return "경쟁력 있음 (50-70%)"
        elif ratio < 0.9:
            return "보통 (70-90%)"
        else:
            return "경쟁력 낮음 (90% 이상)"
