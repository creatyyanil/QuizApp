const mongoose= require('mongoose');

questionSchema = new mongoose.Schema( {
	quizId: {
        type:String,
        required:true,
    },
    question: {
        type:String,
    },
    options: {
        type: [String], default: []
    },
    right_answer: {
        type:String,
    }
    
});

Question = mongoose.model('Question', questionSchema);
module.exports = Question;