const OpenAIClient = require("./api/openAIClient");
const getMealRecommendation = require("../utils/getMealsRecommendations");

const defaultMeal = {
  breakfast: {
    recipe_name: "पालक पनीर रेसिपी - Palak Paneer (Recipe In Hindi)",
    ingredients:
      "250 ग्राम पनीर - काट ले,500 ग्राम पालक - धो कर काट ले,1 टमाटर - प्यूरी कर ले,2 कली लहसुन - कस ले,2 इंच अदरक - कस ले,2 हरी मिर्च - काट ले,1/2 छोटा चमच्च जीरा,1/4 छोटा चमच्च दालचीनी पाउडर,1 छोटा चमच्च जीरा पाउडर,1/4 छोटा चमच्च हल्दी पाउडर,1 छोटा चमच्च गरम मसाला पाउडर,2 बड़े चमच्च क्रीम,1 बड़ा चमच्च मक्खन,नमक - स्वाद अनुसार",
    macro_goals: {
        calories: 500,
        carbs: 40,
        protein: 30,
        fats: 10,
      },
  },
  lunch: {
    recipe_name: "Chili Coriander and Capsicum Rusk Chutney Recipe",
    ingredients:
      "2 cups Coriander (Dhania) Leaves,1 Green Bell Pepper (Capsicum),1 Rusk - (or bread crumbs),4 cloves Garlic,2 Green Chillies,2 tablespoon Raw Peanuts (Moongphali),1 tablespoon Sugar,2 teaspoons Lemon juice,Salt - to taste",
    macro_goals: {
        calories: 500,
        carbs: 40,
        protein: 30,
        fats: 10,
      },
  },
  dinner: {
    recipe_name: "Chicken Momos Recipe -Delicious Steamed Chicken Dumplings",
    ingredients:
      "2 cups All Purpose Flour (Maida),Salt - to taste,1-1/2 teaspoon Baking powder,1 cup Chicken - boiled and minced,1/2 cup Green peas (Matar) - boiled,1/2 cup Onions - finely chopped,1 tablespoon Garlic - finely chopped,1/2 tablespoon Ginger - finely chopped,1/2 tablespoon Soy sauce,Salt - to taste,1 Fresh Red chillies - or green chilli,1/4 tablespoon Whole Black Peppercorns - crushed",
    macro_goals: {
        calories: 500,
        carbs: 40,
        protein: 30,
        fats: 10,
      },
  },
};

class OpenAIService {
  constructor() {
    this.openAIClient = new OpenAIClient();
    this.promptPrefix = `You are an expert diet planner.`;
  }

  async getResponse(prompt, userDetail, context = []) {
    try {
      const mealRecommendations = await getMealRecommendation(userDetail);
      if (!mealRecommendations) {
        return defaultMeal;
      }

      return mealRecommendations;

      /* deprecated */
      const messageObj = { role: "user", content: prompt };
      context.push(messageObj);
      const copyContextArray = JSON.parse(JSON.stringify(context));
      const updatedContextChat =
        this._updateContextWithSystemPrompt(copyContextArray);
      return await this.openAIClient.getChatGptResponse(
        prompt,
        updatedContextChat
      );
    } catch (error) {
      console.error("Error while getting response from ChatGPT:", error);
      throw error;
    }
  }

  _updateContextWithSystemPrompt(context) {
    const systemPrompt = { role: "system", content: this.promptPrefix };
    context.unshift(systemPrompt);
    return context;
  }
}

module.exports = OpenAIService;
