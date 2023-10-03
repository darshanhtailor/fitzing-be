const mongoose = require('mongoose');

const dbConnect = async()=>{
    try{
        const url = 'mongodb+srv://darshan:12345@cluster0.potuzln.mongodb.net/fitzing?retryWrites=true&w=majority';
        await mongoose.connect(url);
        console.log('DB connected');
    } catch(err){
        console.log(err.message);
    }
}

module.exports = dbConnect;