const foodData = require("../constants/food.json");

const getMealsRecommendation = (userDetail) => {
  const preferencedFood = foodData.filter(
    (foodItem) =>
      foodItem.cuisine === userDetail.Cuisine &&
      foodItem.Diet === userDetail.food_preference &&
      foodItem.Diet.toLowerCase().includes(userDetail.food_preference)
  );
  const preferencedFoodLen = preferencedFood.length;

  if (!preferencedFoodLen) {
    return null;
  }

  const breakfast =
    preferencedFood[Math.floor(Math.random() * preferencedFoodLen)];
  const lunch = preferencedFood[Math.floor(Math.random() * preferencedFoodLen)];
  const dinner =
    preferencedFood[Math.floor(Math.random() * preferencedFoodLen)];

  console.log(breakfast);

  return {
    breakfast: {
      recipe_name: breakfast.TranslatedRecipeName,
      ingredients: breakfast.TranslatedIngredients,
      macro_goals: {
        calories: 500,
        carb: 40,
        protein: 30,
        fats: 10,
      },
    },

    lunch: {
      recipe_name: lunch.TranslatedRecipeName,
      ingredients: lunch.TranslatedIngredients,
      macro_goals: {
        calories: 1000,
        carb: 60,
        protein: 40,
        fats: 20,
      },
    },

    dinner: {
      recipe_name: dinner.TranslatedRecipeName,
      ingredients: dinner.TranslatedIngredients,
      macro_goals: {
        calories: 600,
        carb: 40,
        protein: 30,
        fats: 10,
      },
    },
  };
};

module.exports = getMealsRecommendation;
