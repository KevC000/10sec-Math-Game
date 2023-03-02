$(document).ready(function () {
    var currentQuestion;
    var highScore = 0;
    var interval;
    var timeLeft = 10;
    var score = 0;

    var updateTimeLeft = function (amount) {
        timeLeft += amount;
        $('#time-left').text(timeLeft);
    };

    var updateScore = function (amount) {
        score += amount;
        $('#score').text(score);
    };

    var updateHighScore = function () {
        highScore = Math.max(highScore, score)
        $('#high-score').text(highScore);
    };

    var startGame = function () {
        if (!interval) {
            if (timeLeft === 0) {
                updateTimeLeft(10);
                updateScore(-score);
                updateHighScore();
            }
            interval = setInterval(function () {
                updateTimeLeft(-1);
                if (timeLeft === 0) {
                    clearInterval(interval);
                    interval = undefined;
                }
            }, 1000);
        }
    };

    var randomNumberGenerator = function (size) {
        return Math.ceil(Math.random() * size);
    };

    var randomOperationGenerator = function () {
        var operations = ['+', '-', '*', '/'];
        var index = Math.floor(Math.random() * 4);
        return operations[index];
    };

    var questionGenerator = function () {
        var question = {};
        var operation = randomOperationGenerator();
        var num1 = randomNumberGenerator(10);
        var num2 = randomNumberGenerator(10);

        if (operation === '-') {
            while (num1 < num2) {
                var num1 = randomNumberGenerator(10);
                var num2 = randomNumberGenerator(10);
            }
        } else if (operation === '/') {
            while (num1 % num2 != 0) {
                var num1 = randomNumberGenerator(10);
                var num2 = randomNumberGenerator(10);
            }
        }


        switch (operation) {
            case '+':
                question.answer = num1 + num2;
                break;
            case '-':
                question.answer = num1 - num2;
                break;
            case '*':
                question.answer = num1 * num2;
                break;
            case '/':
                question.answer = num1 / num2;
                break;
        }

        question.equation = String(num1) + ' ' + operation + ' ' + String(num2);

        return question;
    };

    var renderNewQuestion = function () {
        currentQuestion = questionGenerator();
        $('#equation').text(currentQuestion.equation);
    };

    var checkAnswer = function (userInput, answer) {
        if (userInput === answer) {
            renderNewQuestion();
            $('#user-input').val('');
            updateTimeLeft(+1);
            updateScore(+1);
            updateHighScore();
        }
    };

    $('#user-input').on('keyup', function () {
        startGame();
        checkAnswer(Number($(this).val()), currentQuestion.answer);
    });

    renderNewQuestion();
});