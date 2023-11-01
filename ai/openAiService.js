const OpenAIClient = require('./api/openAIClient');

class OpenAIService {

    constructor() {
        this.openAIClient = new OpenAIClient()
        this.promptPrefix = `You are an expert diet planner.`
    }

    async getResponse(prompt, context = []) {
        try {
            const messageObj = { role: "user", content: prompt }
            context.push(messageObj)
            const copyContextArray = JSON.parse(JSON.stringify(context))
            const updatedContextChat = this._updateContextWithSystemPrompt(copyContextArray)
            return await this.openAIClient.getChatGptResponse(prompt, updatedContextChat);
        } catch (error) {
            console.error('Error while getting response from ChatGPT:', error);
            throw error;
        }
    }

    _updateContextWithSystemPrompt(context) {
        const systemPrompt = {"role": "system", "content": this.promptPrefix};
        context.unshift(systemPrompt)
        return context
    }
}

module.exports = OpenAIService;