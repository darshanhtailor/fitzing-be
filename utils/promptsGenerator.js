const mealPlannerPromptGenerator = (userDetail) => {
    return `
        Design a balanced meal plan that includes a distinct recipe for breakfast, lunch, and dinner. 
        Ensure that each recipe aligns with the user's macro goals, including calories, carbohydrates, protein, and fats. 
        Please provide the recipe name and a list of ingredients for each meal. 
        Consider the user's dietary preferences and aim to create meals that are nutritionally balanced and suitable for their health goals.

        This is the user details:

        ${userDetail}

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

module.exports = {
    mealPlannerPromptGenerator
}