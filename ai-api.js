// AI API 연동을 위한 JavaScript 모듈

class AIAPIService {
    constructor() {
        this.apiKeys = {
            openai: '',
            claude: '',
            gemini: ''
        };
        this.loadApiKeys();
    }

    loadApiKeys() {
        const stored = localStorage.getItem('casa-api-keys');
        if (stored) {
            this.apiKeys = JSON.parse(stored);
        }
    }

    saveApiKeys(keys) {
        this.apiKeys = keys;
        localStorage.setItem('casa-api-keys', JSON.stringify(keys));
    }

    async analyzeProductWithOpenAI(imageBase64) {
        if (!this.apiKeys.openai) {
            throw new Error('OpenAI API 키가 설정되지 않았습니다.');
        }

        try {
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: "gpt-4-vision-preview",
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: `이 명품 사진을 분석해주세요. 다음 정보를 JSON 형태로 제공해주세요:
                                {
                                    "brand": "브랜드명",
                                    "model": "모델명/제품명",
                                    "condition": "상태 (A급, B급, C급 등)",
                                    "estimatedValue": 예상가격(원),
                                    "targetAudience": ["타겟 고객군 배열"],
                                    "sellingPoints": ["판매 포인트 배열"],
                                    "marketTrends": ["시장 트렌드 배열"],
                                    "competitorAnalysis": "경쟁사 분석"
                                }
                                
                                까사트레이드 플랫폼의 맥락에서 분석해주세요. 명품 리셀러, 도소매상, 개인 소비자를 대상으로 합니다.`
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:image/jpeg;base64,${imageBase64}`
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 1000
            }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKeys.openai}`,
                    'Content-Type': 'application/json'
                }
            });

            const analysis = JSON.parse(response.data.choices[0].message.content);
            return analysis;
        } catch (error) {
            console.error('OpenAI 분석 오류:', error);
            throw new Error('제품 분석에 실패했습니다.');
        }
    }

    async generateThreadWithOpenAI(productInfo, tone = 'persuasive') {
        if (!this.apiKeys.openai) {
            throw new Error('OpenAI API 키가 설정되지 않았습니다.');
        }

        try {
            const prompt = `까사트레이드 플랫폼을 위한 쓰레드 콘텐츠를 생성해주세요.

제품 정보:
- 브랜드: ${productInfo.brand}
- 모델: ${productInfo.model}
- 상태: ${productInfo.condition}
- 예상가격: ${productInfo.estimatedValue.toLocaleString()}원

타겟 고객: ${productInfo.targetAudience.join(', ')}
판매 포인트: ${productInfo.sellingPoints.join(', ')}

요구사항:
1. ${tone}한 톤으로 작성
2. 최대 280자 이내
3. 후킹이 강한 첫 문장
4. 구체적인 수익 정보 포함
5. 까사트레이드 플랫폼 언급
6. 행동 유도(CTA) 포함

예시 스타일:
- "폴로 20장 파는 것과, 이거 하나 파는 것. 어떤 게 더 스마트한 사업일까요?"
- "객단가의 한계를 명확히 짚어주고, 해결책을 제시"
- "당신의 노동과 시간을 어디에 집중해야 할지, 숫자가 명확하게 보여줍니다"

4개의 연속된 쓰레드로 구성해주세요. 각각 [1/4], [2/4], [3/4], [4/4]로 표시해주세요.`;

            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: "당신은 까사트레이드의 마케팅 전문가입니다. 명품 리셀러들을 위한 매력적이고 설득력 있는 쓰레드 콘텐츠를 작성합니다."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_tokens: 1500,
                temperature: 0.8
            }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKeys.openai}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data.choices[0].message.content;
        } catch (error) {
            console.error('OpenAI 쓰레드 생성 오류:', error);
            throw new Error('쓰레드 콘텐츠 생성에 실패했습니다.');
        }
    }

    async generateBlogWithOpenAI(productInfo, tone = 'professional') {
        if (!this.apiKeys.openai) {
            throw new Error('OpenAI API 키가 설정되지 않았습니다.');
        }

        try {
            const prompt = `까사트레이드 플랫폼을 위한 SEO 최적화 블로그 콘텐츠를 생성해주세요.

제품 정보:
- 브랜드: ${productInfo.brand}
- 모델: ${productInfo.model}
- 상태: ${productInfo.condition}
- 예상가격: ${productInfo.estimatedValue.toLocaleString()}원

타겟 고객: ${productInfo.targetAudience.join(', ')}
판매 포인트: ${productInfo.sellingPoints.join(', ')}
시장 트렌드: ${productInfo.marketTrends.join(', ')}

요구사항:
1. SEO 최적화 (키워드: ${productInfo.brand}, ${productInfo.model}, 명품, 리셀, 까사트레이드)
2. ${tone}한 톤으로 작성
3. 최소 2000자 이상
4. 제목, 소제목, 본문, 결론 구조
5. 깊이 있는 분석과 인사이트
6. 까사트레이드 플랫폼의 장점 강조
7. 명품 시장 동향 분석
8. 실용적인 조언과 팁 포함

구조:
- 매력적인 제목 (H1)
- 요약 (H2)
- 제품 상세 분석 (H2)
- 시장 동향 (H2)
- 까사트레이드의 차별점 (H2)
- 실전 팁 (H2)
- 결론 (H2)

각 섹션은 구체적이고 실용적인 내용으로 구성해주세요.`;

            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: "당신은 까사트레이드의 콘텐츠 마케터이자 명품 시장 전문가입니다. SEO에 최적화되고 독자에게 가치를 제공하는 블로그 콘텐츠를 작성합니다."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_tokens: 3000,
                temperature: 0.7
            }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKeys.openai}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data.choices[0].message.content;
        } catch (error) {
            console.error('OpenAI 블로그 생성 오류:', error);
            throw new Error('블로그 콘텐츠 생성에 실패했습니다.');
        }
    }

    async analyzeProductWithClaude(imageBase64) {
        if (!this.apiKeys.claude) {
            throw new Error('Claude API 키가 설정되지 않았습니다.');
        }

        try {
            const response = await axios.post('https://api.anthropic.com/v1/messages', {
                model: "claude-3-sonnet-20240229",
                max_tokens: 1000,
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: `이 명품 사진을 분석해주세요. 다음 정보를 JSON 형태로 제공해주세요:
                                {
                                    "brand": "브랜드명",
                                    "model": "모델명/제품명",
                                    "condition": "상태 (A급, B급, C급 등)",
                                    "estimatedValue": 예상가격(원),
                                    "targetAudience": ["타겟 고객군 배열"],
                                    "sellingPoints": ["판매 포인트 배열"],
                                    "marketTrends": ["시장 트렌드 배열"],
                                    "competitorAnalysis": "경쟁사 분석"
                                }
                                
                                까사트레이드 플랫폼의 맥락에서 분석해주세요. 명품 리셀러, 도소매상, 개인 소비자를 대상으로 합니다.`
                            },
                            {
                                type: "image",
                                source: {
                                    type: "base64",
                                    media_type: "image/jpeg",
                                    data: imageBase64
                                }
                            }
                        ]
                    }
                ]
            }, {
                headers: {
                    'x-api-key': this.apiKeys.claude,
                    'Content-Type': 'application/json',
                    'anthropic-version': '2023-06-01'
                }
            });

            const analysis = JSON.parse(response.data.content[0].text);
            return analysis;
        } catch (error) {
            console.error('Claude 분석 오류:', error);
            throw new Error('제품 분석에 실패했습니다.');
        }
    }

    async generateThreadWithClaude(productInfo, tone = 'persuasive') {
        if (!this.apiKeys.claude) {
            throw new Error('Claude API 키가 설정되지 않았습니다.');
        }

        try {
            const prompt = `까사트레이드 플랫폼을 위한 쓰레드 콘텐츠를 생성해주세요.

제품 정보:
- 브랜드: ${productInfo.brand}
- 모델: ${productInfo.model}
- 상태: ${productInfo.condition}
- 예상가격: ${productInfo.estimatedValue.toLocaleString()}원

타겟 고객: ${productInfo.targetAudience.join(', ')}
판매 포인트: ${productInfo.sellingPoints.join(', ')}

요구사항:
1. ${tone}한 톤으로 작성
2. 최대 280자 이내
3. 후킹이 강한 첫 문장
4. 구체적인 수익 정보 포함
5. 까사트레이드 플랫폼 언급
6. 행동 유도(CTA) 포함

4개의 연속된 쓰레드로 구성해주세요. 각각 [1/4], [2/4], [3/4], [4/4]로 표시해주세요.`;

            const response = await axios.post('https://api.anthropic.com/v1/messages', {
                model: "claude-3-sonnet-20240229",
                max_tokens: 1500,
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            }, {
                headers: {
                    'x-api-key': this.apiKeys.claude,
                    'Content-Type': 'application/json',
                    'anthropic-version': '2023-06-01'
                }
            });

            return response.data.content[0].text;
        } catch (error) {
            console.error('Claude 쓰레드 생성 오류:', error);
            throw new Error('쓰레드 콘텐츠 생성에 실패했습니다.');
        }
    }

    async generateBlogWithClaude(productInfo, tone = 'professional') {
        if (!this.apiKeys.claude) {
            throw new Error('Claude API 키가 설정되지 않았습니다.');
        }

        try {
            const prompt = `까사트레이드 플랫폼을 위한 SEO 최적화 블로그 콘텐츠를 생성해주세요.

제품 정보:
- 브랜드: ${productInfo.brand}
- 모델: ${productInfo.model}
- 상태: ${productInfo.condition}
- 예상가격: ${productInfo.estimatedValue.toLocaleString()}원

타겟 고객: ${productInfo.targetAudience.join(', ')}
판매 포인트: ${productInfo.sellingPoints.join(', ')}
시장 트렌드: ${productInfo.marketTrends.join(', ')}

요구사항:
1. SEO 최적화 (키워드: ${productInfo.brand}, ${productInfo.model}, 명품, 리셀, 까사트레이드)
2. ${tone}한 톤으로 작성
3. 최소 2000자 이상
4. 제목, 소제목, 본문, 결론 구조
5. 깊이 있는 분석과 인사이트
6. 까사트레이드 플랫폼의 장점 강조
7. 명품 시장 동향 분석
8. 실용적인 조언과 팁 포함

구조:
- 매력적인 제목 (H1)
- 요약 (H2)
- 제품 상세 분석 (H2)
- 시장 동향 (H2)
- 까사트레이드의 차별점 (H2)
- 실전 팁 (H2)
- 결론 (H2)

각 섹션은 구체적이고 실용적인 내용으로 구성해주세요.`;

            const response = await axios.post('https://api.anthropic.com/v1/messages', {
                model: "claude-3-sonnet-20240229",
                max_tokens: 3000,
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            }, {
                headers: {
                    'x-api-key': this.apiKeys.claude,
                    'Content-Type': 'application/json',
                    'anthropic-version': '2023-06-01'
                }
            });

            return response.data.content[0].text;
        } catch (error) {
            console.error('Claude 블로그 생성 오류:', error);
            throw new Error('블로그 콘텐츠 생성에 실패했습니다.');
        }
    }

    async analyzeProductWithGemini(imageBase64) {
        if (!this.apiKeys.gemini) {
            throw new Error('Gemini API 키가 설정되지 않았습니다.');
        }

        try {
            const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${this.apiKeys.gemini}`, {
                contents: [{
                    parts: [
                        {
                            text: `이 명품 사진을 분석해주세요. 다음 정보를 JSON 형태로 제공해주세요:
                            {
                                "brand": "브랜드명",
                                "model": "모델명/제품명",
                                "condition": "상태 (A급, B급, C급 등)",
                                "estimatedValue": 예상가격(원),
                                "targetAudience": ["타겟 고객군 배열"],
                                "sellingPoints": ["판매 포인트 배열"],
                                "marketTrends": ["시장 트렌드 배열"],
                                "competitorAnalysis": "경쟁사 분석"
                            }
                            
                            까사트레이드 플랫폼의 맥락에서 분석해주세요. 명품 리셀러, 도소매상, 개인 소비자를 대상으로 합니다.`
                        },
                        {
                            inlineData: {
                                data: imageBase64,
                                mimeType: "image/jpeg"
                            }
                        }
                    ]
                }]
            });

            const analysis = JSON.parse(response.data.candidates[0].content.parts[0].text);
            return analysis;
        } catch (error) {
            console.error('Gemini 분석 오류:', error);
            throw new Error('제품 분석에 실패했습니다.');
        }
    }

    async generateThreadWithGemini(productInfo, tone = 'persuasive') {
        if (!this.apiKeys.gemini) {
            throw new Error('Gemini API 키가 설정되지 않았습니다.');
        }

        try {
            const prompt = `까사트레이드 플랫폼을 위한 쓰레드 콘텐츠를 생성해주세요.

제품 정보:
- 브랜드: ${productInfo.brand}
- 모델: ${productInfo.model}
- 상태: ${productInfo.condition}
- 예상가격: ${productInfo.estimatedValue.toLocaleString()}원

타겟 고객: ${productInfo.targetAudience.join(', ')}
판매 포인트: ${productInfo.sellingPoints.join(', ')}

요구사항:
1. ${tone}한 톤으로 작성
2. 최대 280자 이내
3. 후킹이 강한 첫 문장
4. 구체적인 수익 정보 포함
5. 까사트레이드 플랫폼 언급
6. 행동 유도(CTA) 포함

4개의 연속된 쓰레드로 구성해주세요. 각각 [1/4], [2/4], [3/4], [4/4]로 표시해주세요.`;

            const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${this.apiKeys.gemini}`, {
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            });

            return response.data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('Gemini 쓰레드 생성 오류:', error);
            throw new Error('쓰레드 콘텐츠 생성에 실패했습니다.');
        }
    }

    async generateBlogWithGemini(productInfo, tone = 'professional') {
        if (!this.apiKeys.gemini) {
            throw new Error('Gemini API 키가 설정되지 않았습니다.');
        }

        try {
            const prompt = `까사트레이드 플랫폼을 위한 SEO 최적화 블로그 콘텐츠를 생성해주세요.

제품 정보:
- 브랜드: ${productInfo.brand}
- 모델: ${productInfo.model}
- 상태: ${productInfo.condition}
- 예상가격: ${productInfo.estimatedValue.toLocaleString()}원

타겟 고객: ${productInfo.targetAudience.join(', ')}
판매 포인트: ${productInfo.sellingPoints.join(', ')}
시장 트렌드: ${productInfo.marketTrends.join(', ')}

요구사항:
1. SEO 최적화 (키워드: ${productInfo.brand}, ${productInfo.model}, 명품, 리셀, 까사트레이드)
2. ${tone}한 톤으로 작성
3. 최소 2000자 이상
4. 제목, 소제목, 본문, 결론 구조
5. 깊이 있는 분석과 인사이트
6. 까사트레이드 플랫폼의 장점 강조
7. 명품 시장 동향 분석
8. 실용적인 조언과 팁 포함

구조:
- 매력적인 제목 (H1)
- 요약 (H2)
- 제품 상세 분석 (H2)
- 시장 동향 (H2)
- 까사트레이드의 차별점 (H2)
- 실전 팁 (H2)
- 결론 (H2)

각 섹션은 구체적이고 실용적인 내용으로 구성해주세요.`;

            const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${this.apiKeys.gemini}`, {
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            });

            return response.data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('Gemini 블로그 생성 오류:', error);
            throw new Error('블로그 콘텐츠 생성에 실패했습니다.');
        }
    }

    async generateContent(imageBase64, model, threadTone, blogTone) {
        const startTime = Date.now();
        
        try {
            let productAnalysis, threadContent, blogContent;

            // 제품 분석
            switch (model) {
                case 'openai':
                    productAnalysis = await this.analyzeProductWithOpenAI(imageBase64);
                    break;
                case 'claude':
                    productAnalysis = await this.analyzeProductWithClaude(imageBase64);
                    break;
                case 'gemini':
                    productAnalysis = await this.analyzeProductWithGemini(imageBase64);
                    break;
                default:
                    throw new Error(`지원하지 않는 모델: ${model}`);
            }

            // 쓰레드 콘텐츠 생성
            switch (model) {
                case 'openai':
                    threadContent = await this.generateThreadWithOpenAI(productAnalysis, threadTone);
                    break;
                case 'claude':
                    threadContent = await this.generateThreadWithClaude(productAnalysis, threadTone);
                    break;
                case 'gemini':
                    threadContent = await this.generateThreadWithGemini(productAnalysis, threadTone);
                    break;
            }

            // 블로그 콘텐츠 생성
            switch (model) {
                case 'openai':
                    blogContent = await this.generateBlogWithOpenAI(productAnalysis, blogTone);
                    break;
                case 'claude':
                    blogContent = await this.generateBlogWithClaude(productAnalysis, blogTone);
                    break;
                case 'gemini':
                    blogContent = await this.generateBlogWithGemini(productAnalysis, blogTone);
                    break;
            }

            const generationTime = Date.now() - startTime;

            return {
                productAnalysis,
                threadContent,
                blogContent,
                provider: model,
                generationTime
            };
        } catch (error) {
            console.error('콘텐츠 생성 오류:', error);
            throw error;
        }
    }

    async generateWithAllModels(imageBase64, threadTone, blogTone) {
        const results = [];
        const models = ['openai', 'claude', 'gemini'];
        
        for (const model of models) {
            if (this.apiKeys[model]) {
                try {
                    const result = await this.generateContent(imageBase64, model, threadTone, blogTone);
                    results.push(result);
                } catch (error) {
                    console.error(`${model} 생성 실패:`, error);
                }
            }
        }

        if (results.length === 0) {
            throw new Error('사용 가능한 AI 모델이 없습니다.');
        }

        // 가장 긴 콘텐츠를 선택 (더 상세하다고 가정)
        return results.reduce((best, current) => {
            const currentLength = current.threadContent.length + current.blogContent.length;
            const bestLength = best.threadContent.length + best.blogContent.length;
            return currentLength > bestLength ? current : best;
        });
    }
}

// 전역 인스턴스 생성
window.aiService = new AIAPIService();
