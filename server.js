const OpenAIService = require('./ai/openAiService')
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
require('dotenv').config()

const openAiService = new OpenAIService();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const dbConnect = require('./db');
dbConnect();

const verifyJwt = require('./verifyJwt');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Profile = require('./models/Profile');
const Meals = require('./models/Meals');

const {mealPlannerPromptGenerator} = require('./utils/promptsGenerator');

const jwtSecret = 'secret';

app.get('/', (req, res)=>{
    res.send('fitzing backend');
});

app.post('/login', async(req, res)=>{
    try{
        const user = await User.findOne({email: req.body.email});
        if(!user){
            throw new Error('User not found');
        }

        const valid = await bcrypt.compare(req.body.password, user.password);
        if(!valid){
            throw new Error('Incorrect password');
        }

        const auth_token = jwt.sign({user_id: user._id.toString(), email: user.email}, jwtSecret);
        res.send({user_id: user._id.toString(), auth_token, is_profile_created: user.profile_created});
    } catch(err){
        res.status(400).send({error: err.message});
    }
});

app.post('/signup', async(req, res)=>{
    try{
        const user = req.body;

        if(user.password != user.confirm_password){
            throw new Error('Passwords do not match');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(user.password, salt);

        user.password = hashedPass;
        delete user.confirm_password;

        await new User(user).save();
        res.send({message: 'User created'});
    } catch(err){
        res.status(400).send({error: err.message});
    }
});

app.post('/update-profile', verifyJwt, async(req, res)=>{
    try{
        const user = await User.findById(req.user.user_id);

        if(user.profile_created == true){
            await Profile.findOneAndUpdate({user_id: req.user.user_id}, {...req.body});
        } else{
            await new Profile({...req.body, user_id: req.user.user_id}).save();
            await User.findByIdAndUpdate(req.user.user_id, {profile_created: true});
        }

        res.send({message: 'Profile updated'});
    }catch(err){
        res.status(400).send({error: err.message});
    }
});

app.get('/profile', verifyJwt, async(req, res)=>{
    try{
        const profile = await Profile.findOne({user_id: req.user.user_id}).select('-user_id');

        res.send(profile);
    }catch(err){
        res.status(400).send({error: err.message});
    }
})

app.get('/meal-planner', verifyJwt, async(req, res)=>{
    try{
        const user_id = req.user.user_id;
        const meal_data = await Meals.findOneAndUpdate({user_id},{user_id},{upsert:true, new:true});
        const today = new Date().toISOString().substring(0, 10);

        if(meal_data.data != []){
            for(let data of meal_data.data){
                if(data['date'] == today){
                    return res.send({meals: data['meals']});
                }
            }
        }

        const {gender, age, food_preference, medical_conditions, current_goal} = await Profile.findOne({user_id: req.user.user_id});

        const userDetail = { gender, age, food_preference, medical_conditions, current_goal, cuisine: 'Indian'};
        const mealPlannerPrompt = mealPlannerPromptGenerator(userDetail);
        let mealPlan = await openAiService.getResponse(mealPlannerPrompt);
        const result = JSON.parse(mealPlan.content);
        
        meal_data.data.push({
            date: today,
            meals: result
        });
        await meal_data.save();

        res.send({meals: result});
        // const me = "{\n    \"breakfast\": {\n        \"recipe_name\": \"Egg and Vegetable Scramble\",\n        \"ingredients\": [\n            \"2 eggs\",\n            \"1 bell pepper, diced\",\n            \"1/2 onion, diced\",\n            \"1 cup spinach\",\n            \"1/4 cup shredded cheese\",\n            \"Salt and pepper to taste\",\n            \"1 tsp olive oil\"\n        ],\n        \"macro_goals\": {\n            \"calories\": 350,\n            \"carbs\": 15,\n            \"protein\": 20,\n            \"fats\": 23\n        }\n    },\n    \"lunch\": {\n        \"recipe_name\": \"Grilled Chicken Salad\",\n        \"ingredients\": [\n            \"4 oz grilled chicken breast, sliced\",\n            \"2 cups mixed salad greens\",\n            \"1/2 cucumber, sliced\",\n            \"1/4 cup cherry tomatoes, halved\",\n            \"1/4 cup sliced almonds\",\n            \"2 tbsp balsamic vinaigrette dressing\"\n        ],\n        \"macro_goals\": {\n            \"calories\": 400,\n            \"carbs\": 20,\n            \"protein\": 35,\n            \"fats\": 20\n        }\n    },\n    \"dinner\": {\n        \"recipe_name\": \"Salmon with Roasted Vegetables\",\n        \"ingredients\": [\n            \"4 oz salmon fillet\",\n            \"1 cup broccoli florets\",\n            \"1 cup cauliflower florets\",\n            \"1/2 red bell pepper, sliced\",\n            \"1/2 yellow bell pepper, sliced\",\n            \"2 tbsp olive oil\",\n            \"1 tsp dried herbs (e.g., basil, oregano, thyme)\",\n            \"Salt and pepper to taste\"\n        ],\n        \"macro_goals\": {\n            \"calories\": 450,\n            \"carbs\": 25,\n            \"protein\": 30,\n            \"fats\": 30\n        }\n    }\n}";
        // const result = JSON.parse(me);
    }catch(err){
        res.status(400).send({error: err.message});
    }
})

app.listen(5000, (req, res)=>{
    console.log('Server started on http://localhost:5000/');
});