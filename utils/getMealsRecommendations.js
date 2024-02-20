const foodData = require("../constants/food.json");
const getFoodImage = require("../utils/getFoodImage")

const foodWebDomain = `https://www.archanaskitchen.com`

const getMealsRecommendation = async (userDetail) => {
  const preferencedFood = foodData.filter((foodItem) => {
    return (
      foodItem.cuisine === userDetail.Cuisine &&
      foodItem.Diet.toLowerCase().includes(userDetail.food_preference) &&
      (userDetail.ingredients && foodItem.Ingredients
        ? foodItem.Ingredients.toLowerCase().includes(
            userDetail.ingredients
          )
        : true)
    );
  });

  const preferencedFoodLen = preferencedFood.length;

  if (!preferencedFoodLen) {
    return null;
  }

  const breakfast =
    preferencedFood[Math.floor(Math.random() * preferencedFoodLen)];
  const lunch = preferencedFood[Math.floor(Math.random() * preferencedFoodLen)];
  const dinner =
    preferencedFood[Math.floor(Math.random() * preferencedFoodLen)];

  const breakfastImage = await getFoodImage(breakfast.URL)
  const lunchImage = await getFoodImage(lunch.URL)
  const dinnerImage = await getFoodImage(dinner.URL)

  return {
    breakfast: {
      recipe_name: breakfast.TranslatedRecipeName,
      ingredients: breakfast.TranslatedIngredients,
      recipe_instructions: breakfast.TranslatedInstructions,
      macro_goals: {
        calories: 500,
        carbs: 40,
        protein: 30,
        fats: 10,
      },
      img_url: `${foodWebDomain}${breakfastImage}`
    },

    lunch: {
      recipe_name: lunch.TranslatedRecipeName,
      ingredients: lunch.TranslatedIngredients,
      recipe_instructions: lunch.TranslatedInstructions,
      macro_goals: {
        calories: 1000,
        carbs: 60,
        protein: 40,
        fats: 20,
      },
      img_url: `${foodWebDomain}${lunchImage}`
    },

    dinner: {
      recipe_name: dinner.TranslatedRecipeName,
      ingredients: dinner.TranslatedIngredients,
      recipe_instructions: dinner.TranslatedInstructions,
      macro_goals: {
        calories: 600,
        carbs: 40,
        protein: 30,
        fats: 10,
      },
      img_url: `${foodWebDomain}${dinnerImage}`
    },
  };
};

module.exports = getMealsRecommendation;
