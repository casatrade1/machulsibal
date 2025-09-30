#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CTA(Call to Action) 관리 모듈
페르소나별 최적의 CTA 생성
"""

class CTAManager:
    def __init__(self):
        self.cta_templates = {
            'mz': {
                'primary': "💬 댓글로 의견 나눠요!",
                'secondary': "📱 DM으로 더 자세히 물어보세요!",
                'urgency': "⏰ 지금 당장 댓글 달아주세요!"
            },
            'startup': {
                'primary': "🚀 함께 성장해요! DM 주세요",
                'secondary': "📊 더 많은 투자 정보 공유할게요",
                'urgency': "💡 지금 바로 연락하세요!"
            },
            'sidehustle': {
                'primary': "💼 부업 정보 더 공유할게요!",
                'secondary': "📝 실전 경험담 DM으로 받아보세요",
                'urgency': "🔥 지금 바로 팔로우하세요!"
            },
            'business': {
                'primary': "📈 사업 파트너 찾아요!",
                'secondary': "🤝 협업 제안 환영합니다",
                'urgency': "⚡ 긴급한 제안이 있으시면 연락주세요!"
            }
        }
    
    def get_cta(self, persona, strategy):
        """페르소나와 전략에 맞는 CTA 생성"""
        cta_info = self.cta_templates.get(persona, self.cta_templates['mz'])
        
        # 전략에 따른 CTA 조정
        if strategy['strategy_name'] == '겨울준비_시즌선점':
            return self._create_seasonal_cta(cta_info, "겨울 준비")
        elif strategy['strategy_name'] == '핑계불가_소액투자':
            return self._create_urgency_cta(cta_info, "소액 투자")
        elif strategy['strategy_name'] == '묶음판매_개당단가':
            return self._create_business_cta(cta_info, "묶음 판매")
        else:
            return self._create_default_cta(cta_info)
    
    def _create_seasonal_cta(self, cta_info, season):
        """계절성 CTA"""
        return f"""🎯 {season} 시즌 한정 기회!

{cta_info['primary']}
{cta_info['secondary']}

⏰ {season} 준비하시는 분들 지금이 기회예요!
{cta_info['urgency']}"""
    
    def _create_urgency_cta(self, cta_info, investment_type):
        """긴급성 CTA"""
        return f"""⚡ {investment_type} 기회 놓치지 마세요!

{cta_info['primary']}
{cta_info['secondary']}

💰 지금 투자하면 수익 보장!
{cta_info['urgency']}"""
    
    def _create_business_cta(self, cta_info, business_type):
        """사업성 CTA"""
        return f"""💼 {business_type} 파트너 찾아요!

{cta_info['primary']}
{cta_info['secondary']}

🤝 함께 성장할 수 있는 분들 환영!
{cta_info['urgency']}"""
    
    def _create_default_cta(self, cta_info):
        """기본 CTA"""
        return f"""📱 더 자세한 정보가 필요하시면!

{cta_info['primary']}
{cta_info['secondary']}

💬 언제든지 문의주세요!
{cta_info['urgency']}"""
    
    def get_hashtags(self, persona, strategy):
        """해시태그 생성"""
        base_hashtags = ['#명품리셀', '#까사트레이드', '#투자']
        
        persona_hashtags = {
            'mz': ['#MZ세대', '#트렌드', '#핫한'],
            'startup': ['#창업', '#스타트업', '#투자'],
            'sidehustle': ['#부업', '#수익', '#실전'],
            'business': ['#사업', '#마케팅', '#분석']
        }
        
        strategy_hashtags = {
            '겨울준비_시즌선점': ['#겨울준비', '#시즌선점'],
            '핑계불가_소액투자': ['#소액투자', '#핑계불가'],
            '묶음판매_개당단가': ['#묶음판매', '#개당단가'],
            '수리후재판매_사업가관점': ['#수리후재판매', '#사업가관점'],
            '역수출_차익거래': ['#역수출', '#차익거래'],
            '기본_영수증스타일': ['#투명거래', '#신뢰']
        }
        
        hashtags = base_hashtags + persona_hashtags.get(persona, []) + strategy_hashtags.get(strategy['strategy_name'], [])
        return ' '.join(hashtags)
