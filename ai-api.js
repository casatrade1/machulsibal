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
        console.log('API 키 저장 중:', keys);
        this.apiKeys = keys;
        localStorage.setItem('casa-api-keys', JSON.stringify(keys));
        console.log('API 키 저장 완료:', this.apiKeys);
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

            const content = response.data.choices[0].message.content;
            console.log('OpenAI 응답:', content);
            
            // JSON 추출 시도
            let analysis;
            try {
                // JSON 코드 블록에서 추출
                const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
                if (jsonMatch) {
                    analysis = JSON.parse(jsonMatch[1]);
                } else {
                    // 직접 JSON 파싱 시도
                    analysis = JSON.parse(content);
                }
            } catch (parseError) {
                console.error('JSON 파싱 오류:', parseError);
                // 기본값으로 대체
                analysis = {
                    brand: "알 수 없음",
                    model: "알 수 없음",
                    condition: "B급",
                    estimatedValue: 1000000,
                    targetAudience: ["명품 리셀러", "개인 소비자"],
                    sellingPoints: ["고급스러운 디자인", "브랜드 가치"],
                    marketTrends: ["명품 시장 성장", "온라인 거래 증가"],
                    competitorAnalysis: "경쟁력 있는 제품"
                };
            }
            
            return analysis;
        } catch (error) {
            console.error('OpenAI 분석 오류:', error);
            throw new Error('제품 분석에 실패했습니다.');
        }
    }

    async generateThreadWithOpenAI(productInfo, tone = 'persuasive', userComment = '') {
        if (!this.apiKeys.openai) {
            throw new Error('OpenAI API 키가 설정되지 않았습니다.');
        }

        try {
            const commentContext = userComment ? `\n\n사용자 추가 코멘트: "${userComment}"\n이 코멘트를 자연스럽게 반영하여 콘텐츠를 생성해주세요.` : '';
            
            const prompt = `까사트레이드 플랫폼을 위한 쓰레드 콘텐츠를 생성해주세요.

제품 정보:
- 브랜드: ${productInfo.brand}
- 모델: ${productInfo.model}
- 상태: ${productInfo.condition}
- 예상가격: ${productInfo.estimatedValue.toLocaleString()}원

타겟 고객: ${productInfo.targetAudience.join(', ')}
판매 포인트: ${productInfo.sellingPoints.join(', ')}${commentContext}

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

    async generateBlogWithOpenAI(productInfo, tone = 'professional', userComment = '') {
        if (!this.apiKeys.openai) {
            throw new Error('OpenAI API 키가 설정되지 않았습니다.');
        }

        try {
            const commentContext = userComment ? `\n\n사용자 추가 코멘트: "${userComment}"\n이 코멘트를 자연스럽게 반영하여 콘텐츠를 생성해주세요.` : '';
            
            const prompt = `까사트레이드 플랫폼을 위한 실전형 명품 리셀 블로그 콘텐츠를 생성해주세요.

제품 정보:
- 브랜드: ${productInfo.brand}
- 모델: ${productInfo.model}
- 상태: ${productInfo.condition}
- 예상가격: ${productInfo.estimatedValue.toLocaleString()}원

타겟 고객: ${productInfo.targetAudience.join(', ')}
판매 포인트: ${productInfo.sellingPoints.join(', ')}
시장 트렌드: ${productInfo.marketTrends.join(', ')}${commentContext}

다음 스타일로 작성해주세요:

**제목 스타일**: "명품빈티지 소자본 창업을 위한 '실시간' 추천 아이템" 같은 구체적이고 임팩트 있는 제목

**구조와 내용**:
1. **도입부**: 중고명품 사업의 핵심은 '타이밍'과 '정보'라는 메시지로 시작
2. **실제 사례**: 구체적인 낙찰가, 원가, 국내 시세, 수익 구조를 숫자로 제시
3. **플랫폼별 시세 비교**: 표 형태로 명확한 가격 비교
4. **마진 분석**: 구체적인 수익 계산 공식 제시
5. **실전 팁**: 초보자도 따라할 수 있는 구체적인 조언
6. **까사트레이드 차별점**: 정품 보증, 감정서, 수선 연계 등 구체적 혜택
7. **결론**: 강력한 CTA로 마무리

**작성 요령**:
- 구체적인 숫자와 데이터 중심 (낙찰가, 원가, 시세, 수익률)
- 실제 경험담처럼 생생하게 작성
- "~만원", "~엔" 등 구체적 가격 표기
- 표와 리스트를 활용한 명확한 정보 전달
- 독자의 궁금증을 해결하는 실용적 내용
- SEO 키워드 자연스럽게 포함: ${productInfo.brand}, ${productInfo.model}, 명품, 리셀, 까사트레이드, 중고명품, 빈티지

**톤**: ${tone}하되 전문적이면서도 친근하게

최소 2500자 이상으로 작성해주세요.`;

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

            const content = response.data.content[0].text;
            console.log('Claude 응답:', content);
            
            // JSON 추출 시도
            let analysis;
            try {
                // JSON 코드 블록에서 추출
                const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
                if (jsonMatch) {
                    analysis = JSON.parse(jsonMatch[1]);
                } else {
                    // 직접 JSON 파싱 시도
                    analysis = JSON.parse(content);
                }
            } catch (parseError) {
                console.error('JSON 파싱 오류:', parseError);
                // 기본값으로 대체
                analysis = {
                    brand: "알 수 없음",
                    model: "알 수 없음",
                    condition: "B급",
                    estimatedValue: 1000000,
                    targetAudience: ["명품 리셀러", "개인 소비자"],
                    sellingPoints: ["고급스러운 디자인", "브랜드 가치"],
                    marketTrends: ["명품 시장 성장", "온라인 거래 증가"],
                    competitorAnalysis: "경쟁력 있는 제품"
                };
            }
            
            return analysis;
        } catch (error) {
            console.error('Claude 분석 오류:', error);
            throw new Error('제품 분석에 실패했습니다.');
        }
    }

    async generateThreadWithClaude(productInfo, tone = 'persuasive', userComment = '') {
        if (!this.apiKeys.claude) {
            throw new Error('Claude API 키가 설정되지 않았습니다.');
        }

        try {
            const commentContext = userComment ? `\n\n사용자 추가 코멘트: "${userComment}"\n이 코멘트를 자연스럽게 반영하여 콘텐츠를 생성해주세요.` : '';
            
            const prompt = `까사트레이드 플랫폼을 위한 쓰레드 콘텐츠를 생성해주세요.

제품 정보:
- 브랜드: ${productInfo.brand}
- 모델: ${productInfo.model}
- 상태: ${productInfo.condition}
- 예상가격: ${productInfo.estimatedValue.toLocaleString()}원

타겟 고객: ${productInfo.targetAudience.join(', ')}
판매 포인트: ${productInfo.sellingPoints.join(', ')}${commentContext}

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

    async generateBlogWithClaude(productInfo, tone = 'professional', userComment = '') {
        if (!this.apiKeys.claude) {
            throw new Error('Claude API 키가 설정되지 않았습니다.');
        }

        try {
            const commentContext = userComment ? `\n\n사용자 추가 코멘트: "${userComment}"\n이 코멘트를 자연스럽게 반영하여 콘텐츠를 생성해주세요.` : '';
            
            const prompt = `까사트레이드 플랫폼을 위한 실전형 명품 리셀 블로그 콘텐츠를 생성해주세요.

제품 정보:
- 브랜드: ${productInfo.brand}
- 모델: ${productInfo.model}
- 상태: ${productInfo.condition}
- 예상가격: ${productInfo.estimatedValue.toLocaleString()}원

타겟 고객: ${productInfo.targetAudience.join(', ')}
판매 포인트: ${productInfo.sellingPoints.join(', ')}
시장 트렌드: ${productInfo.marketTrends.join(', ')}${commentContext}

다음 스타일로 작성해주세요:

**제목 스타일**: "명품빈티지 소자본 창업을 위한 '실시간' 추천 아이템" 같은 구체적이고 임팩트 있는 제목

**구조와 내용**:
1. **도입부**: 중고명품 사업의 핵심은 '타이밍'과 '정보'라는 메시지로 시작
2. **실제 사례**: 구체적인 낙찰가, 원가, 국내 시세, 수익 구조를 숫자로 제시
3. **플랫폼별 시세 비교**: 표 형태로 명확한 가격 비교
4. **마진 분석**: 구체적인 수익 계산 공식 제시
5. **실전 팁**: 초보자도 따라할 수 있는 구체적인 조언
6. **까사트레이드 차별점**: 정품 보증, 감정서, 수선 연계 등 구체적 혜택
7. **결론**: 강력한 CTA로 마무리

**작성 요령**:
- 구체적인 숫자와 데이터 중심 (낙찰가, 원가, 시세, 수익률)
- 실제 경험담처럼 생생하게 작성
- "~만원", "~엔" 등 구체적 가격 표기
- 표와 리스트를 활용한 명확한 정보 전달
- 독자의 궁금증을 해결하는 실용적 내용
- SEO 키워드 자연스럽게 포함: ${productInfo.brand}, ${productInfo.model}, 명품, 리셀, 까사트레이드, 중고명품, 빈티지

**톤**: ${tone}하되 전문적이면서도 친근하게

최소 2500자 이상으로 작성해주세요.`;

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

            const text = response.data.candidates[0].content.parts[0].text;
            console.log('Gemini 응답:', text);
            
            // JSON 추출 시도
            let analysis;
            try {
                // JSON 코드 블록에서 추출
                const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
                if (jsonMatch) {
                    analysis = JSON.parse(jsonMatch[1]);
                } else {
                    // 직접 JSON 파싱 시도
                    analysis = JSON.parse(text);
                }
            } catch (parseError) {
                console.error('JSON 파싱 오류:', parseError);
                // 기본값으로 대체
                analysis = {
                    brand: "알 수 없음",
                    model: "알 수 없음",
                    condition: "B급",
                    estimatedValue: 1000000,
                    targetAudience: ["명품 리셀러", "개인 소비자"],
                    sellingPoints: ["고급스러운 디자인", "브랜드 가치"],
                    marketTrends: ["명품 시장 성장", "온라인 거래 증가"],
                    competitorAnalysis: "경쟁력 있는 제품"
                };
            }
            
            return analysis;
        } catch (error) {
            console.error('Gemini 분석 오류:', error);
            throw new Error('제품 분석에 실패했습니다.');
        }
    }

    async generateThreadWithGemini(productInfo, tone = 'persuasive', userComment = '') {
        if (!this.apiKeys.gemini) {
            throw new Error('Gemini API 키가 설정되지 않았습니다.');
        }

        try {
            const commentContext = userComment ? `\n\n사용자 추가 코멘트: "${userComment}"\n이 코멘트를 자연스럽게 반영하여 콘텐츠를 생성해주세요.` : '';
            
            const prompt = `까사트레이드 플랫폼을 위한 쓰레드 콘텐츠를 생성해주세요.

제품 정보:
- 브랜드: ${productInfo.brand}
- 모델: ${productInfo.model}
- 상태: ${productInfo.condition}
- 예상가격: ${productInfo.estimatedValue.toLocaleString()}원

타겟 고객: ${productInfo.targetAudience.join(', ')}
판매 포인트: ${productInfo.sellingPoints.join(', ')}${commentContext}

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

    async generateBlogWithGemini(productInfo, tone = 'professional', userComment = '') {
        if (!this.apiKeys.gemini) {
            throw new Error('Gemini API 키가 설정되지 않았습니다.');
        }

        try {
            const commentContext = userComment ? `\n\n사용자 추가 코멘트: "${userComment}"\n이 코멘트를 자연스럽게 반영하여 콘텐츠를 생성해주세요.` : '';
            
            const prompt = `까사트레이드 플랫폼을 위한 실전형 명품 리셀 블로그 콘텐츠를 생성해주세요.

제품 정보:
- 브랜드: ${productInfo.brand}
- 모델: ${productInfo.model}
- 상태: ${productInfo.condition}
- 예상가격: ${productInfo.estimatedValue.toLocaleString()}원

타겟 고객: ${productInfo.targetAudience.join(', ')}
판매 포인트: ${productInfo.sellingPoints.join(', ')}
시장 트렌드: ${productInfo.marketTrends.join(', ')}${commentContext}

다음 스타일로 작성해주세요:

**제목 스타일**: "명품빈티지 소자본 창업을 위한 '실시간' 추천 아이템" 같은 구체적이고 임팩트 있는 제목

**구조와 내용**:
1. **도입부**: 중고명품 사업의 핵심은 '타이밍'과 '정보'라는 메시지로 시작
2. **실제 사례**: 구체적인 낙찰가, 원가, 국내 시세, 수익 구조를 숫자로 제시
3. **플랫폼별 시세 비교**: 표 형태로 명확한 가격 비교
4. **마진 분석**: 구체적인 수익 계산 공식 제시
5. **실전 팁**: 초보자도 따라할 수 있는 구체적인 조언
6. **까사트레이드 차별점**: 정품 보증, 감정서, 수선 연계 등 구체적 혜택
7. **결론**: 강력한 CTA로 마무리

**작성 요령**:
- 구체적인 숫자와 데이터 중심 (낙찰가, 원가, 시세, 수익률)
- 실제 경험담처럼 생생하게 작성
- "~만원", "~엔" 등 구체적 가격 표기
- 표와 리스트를 활용한 명확한 정보 전달
- 독자의 궁금증을 해결하는 실용적 내용
- SEO 키워드 자연스럽게 포함: ${productInfo.brand}, ${productInfo.model}, 명품, 리셀, 까사트레이드, 중고명품, 빈티지

**톤**: ${tone}하되 전문적이면서도 친근하게

최소 2500자 이상으로 작성해주세요.`;

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

    async generateContent(imageBase64, model, threadTone, blogTone, userComment = '') {
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
                    threadContent = await this.generateThreadWithOpenAI(productAnalysis, threadTone, userComment);
                    break;
                case 'claude':
                    threadContent = await this.generateThreadWithClaude(productAnalysis, threadTone, userComment);
                    break;
                case 'gemini':
                    threadContent = await this.generateThreadWithGemini(productAnalysis, threadTone, userComment);
                    break;
            }

            // 블로그 콘텐츠 생성
            switch (model) {
                case 'openai':
                    blogContent = await this.generateBlogWithOpenAI(productAnalysis, blogTone, userComment);
                    break;
                case 'claude':
                    blogContent = await this.generateBlogWithClaude(productAnalysis, blogTone, userComment);
                    break;
                case 'gemini':
                    blogContent = await this.generateBlogWithGemini(productAnalysis, blogTone, userComment);
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

    async generateWithAllModels(imageBase64, threadTone, blogTone, userComment = '') {
        const results = [];
        const models = ['openai', 'claude', 'gemini'];
        
        console.log('사용 가능한 API 키들:', {
            openai: !!this.apiKeys.openai,
            claude: !!this.apiKeys.claude,
            gemini: !!this.apiKeys.gemini
        });
        
        for (const model of models) {
            if (this.apiKeys[model]) {
                console.log(`${model} 모델로 콘텐츠 생성 시작...`);
                try {
                    const result = await this.generateContent(imageBase64, model, threadTone, blogTone, userComment);
                    results.push(result);
                    console.log(`${model} 모델 생성 성공`);
                } catch (error) {
                    console.error(`${model} 생성 실패:`, error);
                }
            } else {
                console.log(`${model} 모델: API 키 없음`);
            }
        }

        console.log(`총 ${results.length}개 모델에서 결과 생성됨`);

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
