const axios = require('axios');
const { Configuration, OpenAIApi } = require("openai");

class OpenAIClient {

    constructor() {
        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        this.openai = new OpenAIApi(configuration);
    }

    async getChatGptResponse(prompt, context = [], maxTokens = 300, temperature = 0.7) {
        try {
            const chatCompletion = await this.openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: context,
                max_tokens: maxTokens,
                temperature: temperature,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            });
            return chatCompletion.data.choices[0].message;
        } catch (error) {
            console.error('Error getting ChatGPT response:', error);
            throw error;
        }
    }
}

module.exports = OpenAIClient;