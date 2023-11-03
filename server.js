const OpenAIService = require("./ai/openAiService");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
require("dotenv").config();

const openAiService = new OpenAIService();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const dbConnect = require("./db");
dbConnect();

const verifyJwt = require("./verifyJwt");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Profile = require("./models/Profile");
const Meals = require("./models/Meals");

const { mealPlannerPromptGenerator, customizeMealPromptGenerator } = require("./utils/promptsGenerator");

const jwtSecret = "secret";

app.get("/", (req, res) => {
    res.send("fitzing backend");
});

app.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            throw new Error("User not found");
        }

        const valid = await bcrypt.compare(req.body.password, user.password);
        if (!valid) {
            throw new Error("Incorrect password");
        }

        const auth_token = jwt.sign(
            { user_id: user._id.toString(), email: user.email },
            jwtSecret
        );
        res.send({
            user_id: user._id.toString(),
            auth_token,
            is_profile_created: user.profile_created,
        });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

app.post("/signup", async (req, res) => {
    try {
        const user = req.body;

        if (user.password != user.confirm_password) {
            throw new Error("Passwords do not match");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(user.password, salt);

        user.password = hashedPass;
        delete user.confirm_password;

        await new User(user).save();
        res.send({ message: "User created" });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

app.post("/update-profile", verifyJwt, async (req, res) => {
    try {
        const user = await User.findById(req.user.user_id);

        if (user.profile_created == true) {
            await Profile.findOneAndUpdate(
                { user_id: req.user.user_id },
                { ...req.body }
            );
        } else {
            await new Profile({ ...req.body, user_id: req.user.user_id }).save();
            await User.findByIdAndUpdate(req.user.user_id, { profile_created: true });
        }

        res.send({ message: "Profile updated" });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

app.get("/profile", verifyJwt, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user_id: req.user.user_id }).select(
            "-user_id"
        );

        res.send(profile);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

app.post('/update-meal-status', verifyJwt, async(req, res)=>{
    try{
        const user_id = req.user.user_id;
        const meal_time = req.body.meal_time;

        const meal_data = await Meals.findOne({user_id});
        const today = new Date().toISOString().substring(0, 10);
        
        for (let data of meal_data.data) {
            if (data["date"] == today) {
                data['completed'][meal_time] = true;
                
                data['macros_consumed']['calories'] += data['meals'][meal_time]['macro_goals']['calories'];
                data['macros_consumed']['carbs'] += data['meals'][meal_time]['macro_goals']['carbs'];
                data['macros_consumed']['protein'] += data['meals'][meal_time]['macro_goals']['protein'];
                data['macros_consumed']['fats'] += data['meals'][meal_time]['macro_goals']['fats'];

                await meal_data.save();

                return res.send({ message: `${meal_time} macros updated` })
            }
        }
    } catch(err){
        res.status(400).send({ error: err.message });
    }
});

app.get("/meal-planner", verifyJwt, async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const meal_data = await Meals.findOneAndUpdate(
            { user_id },
            { user_id },
            { upsert: true, new: true }
        );
        const today = new Date().toISOString().substring(0, 10);

        if (meal_data.data != []) {
            for (let data of meal_data.data) {
                if (data["date"] == today) {
                    return res.send({ macros_consumed: data['macros_consumed'], completed: data['completed'], meals: data["meals"] });
                }
            }
        }

        const { name, gender, age, food_preference, medical_conditions, current_goal } =
            await Profile.findOne({ user_id: req.user.user_id });

        const userDetail = {
            name,
            gender,
            age,
            food_preference,
            medical_conditions,
            current_goal,
            cuisine: "Indian",
        };
        const mealPlannerPrompt = mealPlannerPromptGenerator(userDetail);
        let mealPlan = await openAiService.getResponse(mealPlannerPrompt);
        const result = JSON.parse(mealPlan.content);

        meal_data.data.push({
            date: today,
            meals: result,
        });
        await meal_data.save();

        const len = meal_data.data.length;
        res.send({ macros_consumed: meal_data.data[len-1]['macros_consumed'], completed: meal_data.data[len-1]['completed'], meals: result });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

app.post("/customize-meal", verifyJwt, async (req, res) => {
    try {
        // prev_meal = {
        //     meal_time,
        //     info:{

        //     }
        // }
        const user_id = req.user.user_id;
        const meal_time = req.body.meal_time;
        const user_input = req.body.user_input;

        const meal_data = await Meals.findOne({user_id});
        const today = new Date().toISOString().substring(0, 10);
        
        let prev_meal = 0;
        for (let data of meal_data.data) {
            if (data["date"] == today) {
                prev_meal = data['meals'][meal_time];

                const { name, gender, age, food_preference, medical_conditions, current_goal } =
                await Profile.findOne({ user_id });

                const userDetail = {
                    name,
                    gender,
                    age,
                    ingredients: user_input,
                    food_preference,
                    medical_conditions,
                    current_goal,
                    cuisine: "Indian",
                };

                const mealPlannerPrompt = customizeMealPromptGenerator(userDetail, prev_meal);
                let mealPlan = await openAiService.getResponse(mealPlannerPrompt);
                const result = JSON.parse(mealPlan.content);

                data['meals'][meal_time] = result;
                await meal_data.save();
                
                return res.send(result);
            }
        }
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

const chartdata = require('./chartdata.json');
app.get('/chart-data', async(req, res)=>{
    // console.log(chartdata);
    res.send(chartdata);
})

app.listen(5000, (req, res) => {
    console.log("Server started on http://localhost:5000/");
});
