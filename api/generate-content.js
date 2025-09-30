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

    const { productAnalysis, threadTone, blogTone, userComment } = req.body;

    if (!productAnalysis) {
        return res.status(400).json({ error: 'Product analysis is required' });
    }

    // API 키 확인
    if (!process.env.OPENAI_API_KEY) {
        console.error('OPENAI_API_KEY not found');
        return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    try {
        console.log('Starting content generation...');
        
        // OpenAI로 쓰레드 콘텐츠 생성
        const threadResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                        model: 'gpt-4o',
                messages: [
                    {
                        role: 'user',
                        content: `까사트레이드 플랫폼을 위한 쓰레드 콘텐츠를 생성해주세요.

제품 정보:
- 브랜드: ${productAnalysis.brand}
- 모델: ${productAnalysis.model}
- 상태: ${productAnalysis.condition}
- 예상가격: ${productAnalysis.estimatedValue.toLocaleString()}원

타겟 고객: ${productAnalysis.targetAudience.join(', ')}
판매 포인트: ${productAnalysis.sellingPoints.join(', ')}
시장 트렌드: ${productAnalysis.marketTrends.join(', ')}
사용자 코멘트: ${userComment || '없음'}

다양한 타겟층을 고려해서 후킹이 강한 쓰레드 콘텐츠를 만들어주세요:
- 20-30대 창업예정자
- 40-50대 부업자  
- 중고명품사업 시작자
- 폴로/나이키 빈티지 셀러
- 일반 관심자

톤: ${threadTone}
4개 포스트로 나누어서 작성해주세요.`
                    }
                ],
                max_tokens: 1000
            })
        });

        if (!threadResponse.ok) {
            const errorData = await threadResponse.json();
            console.error('OpenAI thread error:', errorData);
            throw new Error(errorData.error?.message || 'OpenAI API error');
        }

        const threadData = await threadResponse.json();
        const threadContent = threadData.choices[0].message.content;
        console.log('Thread content generated');

        // Claude 또는 Gemini로 블로그 콘텐츠 생성
        let blogContent;
        let blogProvider = 'openai';
        
        if (process.env.CLAUDE_API_KEY) {
            // Claude 사용
            const blogResponse = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'x-api-key': process.env.CLAUDE_API_KEY,
                    'Content-Type': 'application/json',
                    'anthropic-version': '2023-06-01'
                },
            body: JSON.stringify({
                model: 'claude-3-sonnet-20240229',
                max_tokens: 2000,
                messages: [
                    {
                        role: 'user',
                        content: `까사트레이드 플랫폼을 위한 실전형 명품 리셀 블로그 콘텐츠를 생성해주세요.

제품 정보:
- 브랜드: ${productAnalysis.brand}
- 모델: ${productAnalysis.model}
- 상태: ${productAnalysis.condition}
- 예상가격: ${productAnalysis.estimatedValue.toLocaleString()}원

타겟 고객: ${productAnalysis.targetAudience.join(', ')}
판매 포인트: ${productAnalysis.sellingPoints.join(', ')}
시장 트렌드: ${productAnalysis.marketTrends.join(', ')}
사용자 코멘트: ${userComment || '없음'}

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
- SEO 키워드 자연스럽게 포함: ${productAnalysis.brand}, ${productAnalysis.model}, 명품, 리셀, 까사트레이드, 중고명품, 빈티지

**톤**: ${blogTone}하되 전문적이면서도 친근하게

최소 2500자 이상으로 작성해주세요.`
                    }
                ]
            })
        });

            if (!blogResponse.ok) {
                const errorData = await blogResponse.json();
                console.error('Claude blog error:', errorData);
                throw new Error(errorData.error?.message || 'Claude API error');
            }

            const blogData = await blogResponse.json();
            blogContent = blogData.content[0].text;
            blogProvider = 'claude';
            console.log('Blog content generated with Claude');
            
        } else if (process.env.GEMINI_API_KEY) {
            // Gemini 사용
            const blogResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `까사트레이드 플랫폼을 위한 실전형 명품 리셀 블로그 콘텐츠를 생성해주세요.

제품 정보:
- 브랜드: ${productAnalysis.brand}
- 모델: ${productAnalysis.model}
- 상태: ${productAnalysis.condition}
- 예상가격: ${productAnalysis.estimatedValue.toLocaleString()}원

타겟 고객: ${productAnalysis.targetAudience.join(', ')}
판매 포인트: ${productAnalysis.sellingPoints.join(', ')}
시장 트렌드: ${productAnalysis.marketTrends.join(', ')}
사용자 코멘트: ${userComment || '없음'}

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
- SEO 키워드 자연스럽게 포함: ${productAnalysis.brand}, ${productAnalysis.model}, 명품, 리셀, 까사트레이드, 중고명품, 빈티지

**톤**: ${blogTone}하되 전문적이면서도 친근하게

최소 2500자 이상으로 작성해주세요.`
                        }]
                    }]
                })
            });

            if (!blogResponse.ok) {
                const errorData = await blogResponse.json();
                console.error('Gemini blog error:', errorData);
                throw new Error(errorData.error?.message || 'Gemini API error');
            }

            const blogData = await blogResponse.json();
            blogContent = blogData.candidates[0].content.parts[0].text;
            blogProvider = 'gemini';
            console.log('Blog content generated with Gemini');
            
        } else {
            // OpenAI로 블로그 생성 (fallback)
            const blogResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                        model: 'gpt-4o',
                    messages: [{
                        role: 'user',
                        content: `까사트레이드 플랫폼을 위한 실전형 명품 리셀 블로그 콘텐츠를 생성해주세요.

제품 정보:
- 브랜드: ${productAnalysis.brand}
- 모델: ${productAnalysis.model}
- 상태: ${productAnalysis.condition}
- 예상가격: ${productAnalysis.estimatedValue.toLocaleString()}원

타겟 고객: ${productAnalysis.targetAudience.join(', ')}
판매 포인트: ${productAnalysis.sellingPoints.join(', ')}
시장 트렌드: ${productAnalysis.marketTrends.join(', ')}
사용자 코멘트: ${userComment || '없음'}

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
- SEO 키워드 자연스럽게 포함: ${productAnalysis.brand}, ${productAnalysis.model}, 명품, 리셀, 까사트레이드, 중고명품, 빈티지

**톤**: ${blogTone}하되 전문적이면서도 친근하게

최소 2500자 이상으로 작성해주세요.`
                    }],
                    max_tokens: 2000
                })
            });

            if (!blogResponse.ok) {
                const errorData = await blogResponse.json();
                console.error('OpenAI blog error:', errorData);
                throw new Error(errorData.error?.message || 'OpenAI API error');
            }

            const blogData = await blogResponse.json();
            blogContent = blogData.choices[0].message.content;
            blogProvider = 'openai';
            console.log('Blog content generated with OpenAI');
        }

        res.status(200).json({
            productAnalysis,
            threadContent,
            blogContent,
            provider: `openai-${blogProvider}`,
            generationTime: 3000
        });

    } catch (error) {
        console.error('Error in generate-content:', error);
        res.status(500).json({ 
            error: 'Failed to generate content',
            details: error.message 
        });
    }
}
