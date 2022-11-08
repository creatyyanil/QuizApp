const mongoose= require('mongoose');

userAnswerSchema = new mongoose.Schema( {
    
    userId: {
        type:String,
    },
	quiz_id: {
        type:String,
        required:true,
    },
    questionId: {
        type:String,
    },
    optionsId: {
        type: String
    },
    attemptId: {
        type: String
    },
    answer: {
        type: String
    },
    result: {
        type: String,
        enum : ['true','false'],
        default: 'false'
    },
   
});

UserAnswer = mongoose.model('UserAnswer', userAnswerSchema);
module.exports = UserAnswer;