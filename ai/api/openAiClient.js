const axios = require('axios');
const { OpenAI } = require('openai');
require('dotenv').config()

class OpenAIClient {

    constructor() {
        this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }

    async getChatGptResponse(prompt, context = [], maxTokens = 2000, temperature = 1) {
        try {
            const chatCompletion = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: context,
                max_tokens: maxTokens,
                temperature: temperature,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            });

            return chatCompletion.choices[0].message;
        } catch (error) {
            console.error('Error getting ChatGPT response:', error);
            throw error;
        }
    }

    async getEmbeddings(content) {
        try {
            const embedding = await this.openai.embeddings.create({
                model: "text-embedding-ada-002",
                input: content,
                encoding_format: "float",
              });
            
              return embedding
            
        }catch(error) {
            throw error;
        }
    }
}

module.exports = OpenAIClient;