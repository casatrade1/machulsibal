export default async function handler(req, res) {
    // CORS 헤더 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { imageBase64, userComment } = req.body;

    if (!imageBase64) {
        return res.status(400).json({ error: 'Image is required' });
    }

    // API 키 확인
    if (!process.env.OPENAI_API_KEY) {
        console.error('OPENAI_API_KEY not found');
        return res.status(500).json({ error: 'API key not configured' });
    }

    try {
        console.log('Starting product analysis...');
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4-vision-preview',
                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                text: `이 명품 이미지를 분석해서 다음 JSON 형식으로 응답해주세요:
                                {
                                    "brand": "브랜드명",
                                    "model": "모델명", 
                                    "condition": "A급/B급/C급",
                                    "estimatedValue": 숫자,
                                    "targetAudience": ["타겟1", "타겟2"],
                                    "sellingPoints": ["포인트1", "포인트2"],
                                    "marketTrends": ["트렌드1", "트렌드2"],
                                    "competitorAnalysis": "경쟁사 분석"
                                }
                                
                                사용자 코멘트: ${userComment || '없음'}
                                이 코멘트를 반영해서 분석해주세요.`
                            },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: `data:image/jpeg;base64,${imageBase64}`
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 1000
            })
        });

        console.log('OpenAI API response status:', response.status);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('OpenAI API error:', errorData);
            throw new Error(errorData.error?.message || 'OpenAI API error');
        }

        const data = await response.json();
        console.log('OpenAI API response received');
        
        const analysisText = data.choices[0].message.content;
        console.log('Analysis text:', analysisText);
        
        // JSON 추출
        let productAnalysis;
        try {
            const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                productAnalysis = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('No JSON found in response');
            }
        } catch (parseError) {
            console.error('JSON parsing error:', parseError);
            // 기본값 사용
            productAnalysis = {
                brand: "명품 브랜드",
                model: "제품 모델",
                condition: "B급",
                estimatedValue: 2000000,
                targetAudience: ["명품 리셀러", "개인 소비자"],
                sellingPoints: ["고급스러운 디자인", "투자 가치"],
                marketTrends: ["명품 시장 성장", "온라인 거래 증가"],
                competitorAnalysis: "경쟁사 대비 우수한 품질"
            };
        }

        console.log('Product analysis completed:', productAnalysis);
        res.status(200).json({ productAnalysis });

    } catch (error) {
        console.error('Error in analyze-product:', error);
        res.status(500).json({ 
            error: 'Failed to analyze product',
            details: error.message 
        });
    }
}
