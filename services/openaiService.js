const OpenAI = require('openai');
require('dotenv').config();

const AVAILABLE_MODELS = {
    'gpt-4-0409': 'gpt-4-0409',
    'claude35_sonnet': 'claude35_sonnet',
    'qwen2.5-coder-32b-instruct': 'qwen2.5-coder-32b-instruct'
};

class OpenAIService {
    constructor() {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OPENAI_API_KEY environment variable is not set');
        }

        this.client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            baseURL: 'https://idealab.alibaba-inc.com/api/openai/v1',
        });
    }

    async generateStreamResponse(messages, model) {
        console.log('model', model,AVAILABLE_MODELS[model]);
        if (!AVAILABLE_MODELS[model]) {
            throw new Error('Invalid model selected');
        }

        return await this.client.chat.completions.create({
            model: AVAILABLE_MODELS[model],
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