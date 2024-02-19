const mealPlannerPromptGenerator = (userDetail) => {
    const userDetailPrompt = `${userDetail.name} is a ${userDetail.gender}. Their height is ${userDetail.height} and weight is ${userDetail.weight}. ${userDetail.name} is ${userDetail.age} years old. ${userDetail.name}'s food preferences are ${userDetail.food_preference}.
        Medical conditions of ${userDetail.name} includes ${userDetail.medical_conditions}. ${userDetail.name}'s current goal is ${userDetail.current_goal}.
        Please recommend meal based on the user preferences, carefully consider vegeterian and non-vegeterian food preferences.
        Do not repeat your meal recommendation.
     `
    return `
        Design a balanced meal plan that includes a distinct recipe for breakfast, lunch, and dinner. 
        Ensure that each recipe aligns with the user's macro goals, including calories, carbohydrates, protein, and fats. 
        Please provide the recipe name and a list of ingredients for each meal. 
        Consider the user's dietary preferences and aim to create meals that are nutritionally balanced and suitable for their health goals.

        This is the user details:

        ${userDetailPrompt}

        Only return a json response in the following schema:

        {
            breakfast:{
                recipe_name,
                ingredients,
                macro_goals:{
                    calories,
                    carbs,
                    protein,
                    fats
                },
            },

            lunch:{
                recipe_name,
                ingredients,
                macro_goals:{
                    calories,
                    carbs,
                    protein,
                    fats
                },
            },

            dinner:{
                recipe_name,
                ingredients,
                macro_goals:{
                    calories,
                    carbs,
                    protein,
                    fats
                },
                }
            }
        }

        Do not return anything except the json response:
        `
}

const customizeMealPromptGenerator = (userDetail, prevMeal) => {
    const userDetailPrompt = `${userDetail.name} is a ${userDetail.gender}. Their height is ${userDetail.height} and weight is ${userDetail.weight}. ${userDetail.name} is ${userDetail.age} years old. ${userDetail.name}'s food preferences are ${userDetail.food_preference}.
        Medical conditions of ${userDetail.name} includes ${userDetail.medical_conditions}. ${userDetail.name}'s current goal is ${userDetail.current_goal}.
        Suggest a recipe which has the following ingredients ${userDetail.ingredients}.
        Please recommend meal based on the user preferences, carefully consider vegeterian and non-vegeterian food preferences.
        Do not repeat your meal recommendation.
     `

    return `
    Design a balanced meal plan that includes a distinct recipe for the given meal. 
    Please provide the recipe name and a list of ingredients for each meal. 
    Consider the user's dietary preferences and the previous meal and aim to create a new meal that are nutritionally balanced and suitable for their health goals and the count of calorie, carbohydrates, protein, and fats should be similar to previous meal.

    This is the user details:

    ${userDetailPrompt}

    This is previous meal:

    ${prevMeal}

    Only return a json response in the following schema:

    {
        recipe_name,
        ingredients,
        macro_goals:{
            calories,
            carbs,
            protein,
            fats
        },
    }

    Do not return anything except the json response:
    `
}

module.exports = {
    mealPlannerPromptGenerator,
    customizeMealPromptGenerator
}