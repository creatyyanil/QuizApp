const express = require('express');
const mongoose = require('mongoose');
const Question = mongoose.model('Question');
const Quiz = mongoose.model('Quiz');
const Attempt = mongoose.model('Attempt');
const UserAnswer = mongoose.model('UserAnswer');

const verifyAuth = require('../middlewares/verifyAuth');

const router = express.Router();
router.use(verifyAuth);

router.get('/quizs', async (req, res) => {
    const quizs = await Quiz.find({ userId: req.user._id });
    res.send(quizs);

});

router.get('/other-quizs', async (req, res) => {
    const quizs = await Quiz.find({ userId: { $ne: req.user._id } });
    res.send(quizs);

});



router.post('/quizs', async (req, res) => {

    const { quiz_name, quiz_description } = req.body;
    if (!quiz_name || !quiz_description) {
        res.status(422).send({ error: "You must provide quiz name and descrption" });
    }

    try {
        const quiz = new Quiz({ quiz_name, quiz_description, userId: req.user._id });
        await quiz.save();
        res.status(200).send(quiz);
    } catch (err) {
        res.status(422).send({ error: err.message });
    }



});


router.post('/questions', async (req, res) => {

    const { quizId } = req.body;

    const questions = await Question.find({ quizId }, { right_answer: 0 });
    res.send(questions);

});

router.post('/quiz-question-list', async (req, res) => {
    const { quizId } = req.body;

    const runningQuiz = await Attempt.findOne({ quizId: quizId, isCompleted: "false" });
    if (runningQuiz) {
        const questions = await Question.find({ quizId }, { right_answer: 0 });
        res.send(questions);
    } else {
        res.status(404).send({ errors: "Please start Quiz to view Question" })
    }


});




router.post('/add-questions', async (req, res) => {
    const { quizId, question, options, right_answer } = req.body;

    // check quiz is associated with this user or not 

    const QuizCount = await Quiz.findOne({ _id: quizId, userId: req.user._id });

    if (QuizCount) {
        if (!quizId || !question || !right_answer) {
            res.status(422).send({ error: "You must provide quizId question and right_answer" });
        }

        try {
            // check question already exist 

            const checkQuestion = await Question.findOne({ quizId: quizId, question: question });
            if (!checkQuestion) {
                const questions = new Question({ quizId, question, options, right_answer });
                await questions.save();
                res.status(200).send(questions);
            } else {
                res.status(422).send({ error: "Question Already Exist for this quiz" });
            }


        } catch (err) {
            res.status(422).send({ error: err.message });
        }
    } else {
        res.status(422).send({ error: "Invalid Quiz Id" });
    }




});



// attempting the quiz  AttemptQuiz


router.post('/attempt-quiz', async (req, res) => {
    const { quizId } = req.body;

    const runningQuiz = await Attempt.find({ quizId: quizId, userId: req.user._id, isCompleted: "false" });

    if (runningQuiz.length > 0) {
        res.status(422).send({ errors: `Please complete current Quiz`, runningQuiz });
    } else {
        const startTime = Date.now();
        const attempt = new Attempt({ quizId, startTime, userId: req.user._id, isCompleted: "false" });
        await attempt.save();
        res.send(attempt);
    }


});


router.post('/quiz-question-answer', async (req, res) => {
    const { quizId, questionId, answer } = req.body;

    const runningQuiz = await Attempt.findOne({ quizId: quizId, isCompleted: "false" });
    if (runningQuiz) {

        const question = await Question.findOne({ _id: questionId });
        let result = "false";
        if (question.right_answer == answer) {
            result = "true";
        }

        //  check user already saved answer then update record 
        const alreadyExist = await UserAnswer.findOne({ quiz_id: quizId, questionId: questionId, userId: req.user._id, attemptId: runningQuiz._id });
        if (alreadyExist) {
            await UserAnswer.findOneAndUpdate({ _id: alreadyExist._id }, { userId: req.user._id, quiz_id: quizId, questionId, answer, result, attemptId: runningQuiz._id }, { upsert: true });

            res.send("Answer updated successfully");
        } else {
            const userAnswer = new UserAnswer({ userId: req.user._id, quiz_id: quizId, questionId, answer, result, attemptId: runningQuiz._id });
            await userAnswer.save();
            res.send("Answer saved successfully");
        }
    } else {
        res.status(422).send({ errors: `Please start quiz` });
    }








});


router.post('/submit-quiz', async (req, res) => {
    const { quizId } = req.body;
    // const runningQuiz =await AttemptQuiz.find({quizId:quizId});
    console.log(req.body)
    const runningQuiz = await Attempt.findOne({ quizId: quizId, userId: req.user._id, isCompleted: "false" });

    const totalQuestion = await Question.find({ quizId }).count();
    let correctAnswer = 0;
    let wrongAnswer = 0;
    let notAnswerd = 0;

    if (runningQuiz) {
        const userAnswers = await UserAnswer.find({ userId: req.user._id, quiz_id: quizId, attemptId: runningQuiz._id });
        userAnswers.forEach(element => {

            if (element.result == "true") {
                correctAnswer++;
            } else {
                wrongAnswer++;
            }

        });

        notAnswerd = (totalQuestion - correctAnswer - wrongAnswer);

        const endTime = Date.now();
        const data = { quizId, endTime, userId: req.user._id, isCompleted: "true", totalQuestion, correctAnswer, wrongAnswer, notAnswerd }
        const result = await Attempt.findOneAndUpdate({ _id: runningQuiz._id }, data, { upsert: true });
        res.send("Quiz submitted successfully");

    } else {
        res.status(422).send({ errors: `You dont have any Quiz to submit`, runningQuiz });

    }


});




router.get('/view-results', async (req, res) => {

    const userResult = await Attempt.find({ userId: req.user._id });
    if (userResult) {
        res.send({ "success": userResult });
    } else {
        res.status(422).send({ errors: `You dont have Participated in any quiz` });

    }


});

module.exports = router;