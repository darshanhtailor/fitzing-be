const foodData = require("../constants/food.json");

const getMealsRecommendation = (userDetail) => {
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

  console.log(breakfast);

  return {
    breakfast: {
      recipe_name: breakfast.TranslatedRecipeName,
      ingredients: breakfast.TranslatedIngredients,
      macro_goals: {
        calories: 500,
        carbs: 40,
        protein: 30,
        fats: 10,
      },
    },

    lunch: {
      recipe_name: lunch.TranslatedRecipeName,
      ingredients: lunch.TranslatedIngredients,
      macro_goals: {
        calories: 1000,
        carbs: 60,
        protein: 40,
        fats: 20,
      },
    },

    dinner: {
      recipe_name: dinner.TranslatedRecipeName,
      ingredients: dinner.TranslatedIngredients,
      macro_goals: {
        calories: 600,
        carbs: 40,
        protein: 30,
        fats: 10,
      },
    },
  };
};

module.exports = getMealsRecommendation;
