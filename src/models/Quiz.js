const mongoose= require('mongoose');

quizSchema = new mongoose.Schema( {
	quiz_name: {
        type:String,
        unique:true,
        required:true,
    },
    quiz_description: {
        type:String,
    },
	userId: {
        type:String,
    },
    
});

Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;