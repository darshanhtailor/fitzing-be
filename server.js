const OpenAIService = require('./ai/openAiService')
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

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
        res.send({error: err.message});
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
        res.send({error: err.message});
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
        res.send({error: err.message});
    }
});

app.get('/profile', verifyJwt, async(req, res)=>{
    try{
        let profile = await Profile.findOne({user_id: req.user.user_id}).select('-user_id');

        res.send(profile);
    }catch(err){
        res.send({error: err.message});
    }
})

app.post('/meal-planner', verifyJwt, async(req, res)=>{
    try{
        const { userDetail } = req.body;
        const mealPlannerPrompt = mealPlannerPromptGenerator(userDetail);
        let mealPlan = await openAiService.getResponse(mealPlannerPrompt);

        res.send(mealPlan);
    }catch(err){
        res.send({error: err.message});
    }
})

app.listen(5000, (req, res)=>{
    console.log('Server started on http://localhost:5000/');
});