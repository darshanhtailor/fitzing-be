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
    data:[{
        date:{
            type: String,
            require: true
        },
        meals:{
            breakfast: mealSchema,
            lunch: mealSchema,
            dinner: mealSchema
        },
        completed:{
            breakfast:{
                type: Boolean,
                default: false
            },
            lunch:{
                type: Boolean,
                default: false
            },
            dinner:{
                type: Boolean,
                default: false
            }
        }
    }]
});

const Meals = mongoose.model('Meals', mealsSchema);
module.exports = Meals;