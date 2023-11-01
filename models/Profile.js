const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    user_id:{
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    food_preference: {
        type: String,
        required: true,
    },
    medical_conditions: {
        type: Array,
        default: []
    },
    current_goal:{
        type: String,
        required: true,
    }
});

const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;