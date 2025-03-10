const OpenAI = require('openai');

const AVAILABLE_MODELS = {
    'gpt-4': 'gpt-4',
    'claude35_sonnet': 'claude35_sonnet',
    'qwen2.5-coder-32b-instruct': 'qwen2.5-coder-32b-instruct'
};

class OpenAIService {
    constructor() {
        if (!process.env.AI_STUDIO_TOKEN) {
            throw new Error('AI_STUDIO_TOKEN environment variable is not set');
        }

        this.client = new OpenAI({
            apiKey: process.env.AI_STUDIO_TOKEN,
            baseURL: 'https://idealab.alibaba-inc.com/api/openai/v1',
        });
    }

    async generateStreamResponse(messages, model) {
        if (!AVAILABLE_MODELS[model]) {
            throw new Error('Invalid model selected');
        }

        return await this.client.chat.completions.create({
            model: model,
            messages: messages,
            stream: true,
        });
    }

    getAvailableModels() {
        return AVAILABLE_MODELS;
    }
}

module.exports = {
    OpenAIService,
    AVAILABLE_MODELS
}; 