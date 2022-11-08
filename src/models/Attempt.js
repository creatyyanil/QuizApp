const mongoose= require('mongoose');

attemptSchema = new mongoose.Schema( {
	quizId: {
        type:String,
        required:true,
    },
    userId: {
        type:String,
        required:true,
    },
    startTime: {
        type:String,
    },
	endTime: {
        type:String,
    },
    correctAnswer:{
        type:String,
    },
    wrongAnswer:{
        type:String,
    },
    totalQuestion:{
        type:String,
    },
    notAnswerd:{
        type:String,
    },
    isCompleted:{
        type:String,
    }

    
});

Attempt = mongoose.model('Attempt', attemptSchema);
module.exports = Attempt;