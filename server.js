const express = require('express');
const cors = require('cors');
const { OpenAIService } = require('./services/openaiService');
const { generateChart } = require('./utils/chartGenerator');
const { CHART_SYSTEM_PROMPT } = require('./config/prompts');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const openaiService = new OpenAIService();

app.get('/models', (req, res) => {
    res.json(openaiService.getAvailableModels());
});

app.post('/chat', async (req, res) => {
    try {
        const { messages, model } = req.body;

        // 添加系统提示到消息历史的开始
        const messagesWithSystem = [
            { role: "system", content: CHART_SYSTEM_PROMPT },
            ...messages
        ];

        // 设置 SSE
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        let accumulatedContent = '';
        const stream = await openaiService.generateStreamResponse(messagesWithSystem, model);

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                accumulatedContent += content;
                res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }
        }
        console.log('Accumulated content:', accumulatedContent);

        // 检查是否包含图表数据
        const chartMatch = accumulatedContent.match(/<chart>([\s\S]*?)<\/chart>/);
        if (chartMatch) {
            try {
                const chartData = JSON.parse(chartMatch[1]);
                console.log('Chart data:', chartData);
                const chartImage = await generateChart(JSON.stringify(chartData));
                console.log('Generated chart:', chartImage);
                res.write(`data: ${JSON.stringify({ type: 'chart', image: chartImage })}\n\n`);
            } catch (e) {
                console.error('Error generating chart:', e);
            }
        }

        res.write('data: [DONE]\n\n');
        res.end();
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 