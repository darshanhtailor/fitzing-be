const mongoose = require('mongoose');


const mealSchema = new mongoose.Schema({
    recipe_name: String,
    ingredients: [String],
    macro_goals: {
      calories: Number,
      carbs: Number,
      protein: Number,
      fats: Number,
    },
});

const mealsSchema = new mongoose.Schema({
    user_id:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        required: true
    },
    meals:{
        breakfast: mealSchema,
        lunch: mealSchema,
        dinner: mealSchema
    }
});

const Meals = mongoose.model('Meals', mealsSchema);
module.exports = Meals;