class QuizApp {
    constructor() {
        this.content_start = document.querySelector(".content-start");
        this.start_quiz_button = document.querySelector("#start-quiz-button");
        this.category = document.querySelector("#quiz-category");
        this.difficulty = document.querySelector("#quiz-difficulty");
        this.limit = document.querySelector("#quiz-limit");
        this.categories = ["Linux", "DevOps", "Code", "react", "vuejs", "docker", "sql"];
        this.difficulties = ["Hard", "Medium", "Easy"];
        this.limits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
            "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"];
        this.api_key = "AD9sPtCHx3021gY6h39Qkt2ypsr0r1GAm7Y0i9oF";
        this.basic_url = "https://quizapi.io/api/v1/questions?";

        //Questions part:
        this.content_question = document.querySelector(".content-question");
        this.question_title = document.querySelector('#question-title');
        this.question_options = document.querySelector(".content-question-options");
        this.question_explanation = document.querySelector("#question-explanation");
        this.subimit_button = document.querySelector("#question-subimit-button");
        this.next_button = document.querySelector("#question-next-button");
        this.previous_button = document.querySelector("#question-previous-button");
        this.progress_bar = document.querySelector("#progress-bar");


        this.questions = [];
        this.actual_question = 0;
        this.score = {
            total_answered: 0,
            total_right_answered: 0,
            total_wrong_answered: 0,
            answers: [],
            subimiteds: []
        }
        this.init();
    }
    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.start_quiz_button.addEventListener("click", () => {
            this.handleStartQuizButton();
        });
        this.subimit_button.addEventListener("click", () => {
            this.handleSubimitQuestionButton();
        });
        this.next_button.addEventListener("click", () => {
            this.handleNextQuestionButton();
        });
        this.previous_button.addEventListener("click", () => {
            this.handlePreviousQuestionButton();
        });
    }
    handleNextQuestionButton(){
        if(this.actual_question == this.questions.length - 1) return;
        this.actual_question++;
        this.goToNextQuestion();
        if(this.score.subimiteds[this.actual_question]){
            this.revealAnswer();
        }
    }
    handlePreviousQuestionButton(){
        if(this.actual_question == 0) return;
        this.actual_question--;
        this.goToNextQuestion();
        if(this.score.subimiteds[this.actual_question]){
            this.revealAnswer();
        }
    }
    handleStartQuizButton() {
        let category = this.category.value;
        let difficulty = this.difficulty.value;
        let limit = this.limit.value;
        if (category == "Random") {
            category = this.getRandomFromArray(this.categories);
        }
        if (difficulty == "Random") {
            difficulty = this.getRandomFromArray(this.difficulties);
        }
        if (limit == "Random") {
            limit = this.getRandomFromArray(this.limits);
        }
        if (this.isParametesValid(category, difficulty, limit)) {
            this.fetchQuestions(category, difficulty, limit);
        } else {
            this.handleInvalidParameters();
        }
    }
    isParametesValid(category, difficulty, limit) {
        return ((category != "none") && (difficulty != "none") && (limit != "none"));
    }
    getRandomFromArray(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    async fetchQuestions(category, difficulty, limit) {
        const url = `${this.basic_url}apiKey=${this.api_key}&category=${category}&difficulty=${difficulty}&limit=${limit}`;
        try {
            this.questions = await this.getQuizQuestions(url);
            this.score.total_questions = this.questions.length;
            for (let i = 0; i < this.score.total_questions; i++) {
                this.score.answers.push([]);
                this.score.subimiteds.push(false);
            }
            this.goToNextQuestion();
            this.toogleStartQuestion();
        } catch (error) {
            console.log(`Error: ${error}`);
        }

    }
    toogleStartQuestion() {
        console.log(window.getComputedStyle(this.content_start).display);
        if (window.getComputedStyle(this.content_start).display == "flex") {
            this.content_start.style.display = "none";
            this.content_question.style.display = "flex";
        } else {
            this.content_question.style.display = "none";
            this.content_start.style.display = "display";
        }
    }
    async getQuizQuestions(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
    handleInvalidParameters() {
        alert("Please provide the 3: category, difficulty and limit");
    }

    goToNextQuestion() {
        this.question_options.innerHTML = '';
        this.question_title.textContent = `${this.questions[this.actual_question].question}`;

        if (this.questions[this.actual_question].multiple_correct_answers === "true") {
            for (let answer in this.questions[this.actual_question].answers) {
                if (!this.questions[this.actual_question].answers[answer]) continue;
                let question_option = `<div class="content-question-options-each">
                    <input type="checkbox" name="q${this.actual_question}" id="${answer}" value="${this.questions[this.actual_question].answers[answer]}">
                    <span>${this.questions[this.actual_question].answers[answer]}</span>
                </div>`
                this.question_options.innerHTML += `${question_option}`;

            }
        } else {
            for (let answer in this.questions[this.actual_question].answers) {
                if (!this.questions[this.actual_question].answers[answer]) continue;
                let question_option = `<div class="content-question-options-each">
                    <input type="radio" name="q${this.actual_question}" id="${answer}" value="${this.questions[this.actual_question].answers[answer]}">
                    <span>${this.questions[this.actual_question].answers[answer]}</span>
                </div>`
                this.question_options.innerHTML += `${question_option}`;
            }
        }
        console.log(this.questions);
        console.log(this.questions[this.actual_question].question);
    }

    handleSubimitQuestionButton() {
        console.log("Here we go");
        if (this.score.subimiteds[this.actual_question]) return;
        let inputs = document.querySelectorAll(`input[name= "q${this.actual_question}"]:checked`);
        Array.from(inputs).map(input => this.score.answers[this.actual_question].push(`${input.id}`));
        console.log(this.score.answers);
        let is_correct = true;
        Array.from(this.score.answers[this.actual_question]).map(guess => {
            if (this.questions[this.actual_question].correct_answers[`${guess}_correct`] === "false") {
                is_correct = false;
            }
        });
        if (is_correct) {
            this.score.total_right_answered++;
        } else {
            this.total_wrong_answered++;
        }
        this.score.subimiteds[this.actual_question] = true;
        this.revealAnswer();
    }
    revealAnswer() {
        let inputs = document.querySelectorAll(`input[name=q${this.actual_question}]`);
        Array.from(inputs).map(input => {
            if (this.questions[this.actual_question].correct_answers[`${input.id}_correct`] === "true") {
                input.parentElement.classList.add('content-question-options-each-correct');
            } else {
                input.parentElement.classList.add('content-question-options-each-wrong');
            }
        });
        if (this.questions[this.actual_question].explanation) {
            this.question_explanation.textContent = this.questions[this.actual_question].explanation;
        } else {
            this.question_explanation.textContent = "It seems that there isn't an explanation for this question. Maybe it is pretty simple.";

        }
    }
}
document.addEventListener("DOMContentLoaded", () => {
    new QuizApp();
});