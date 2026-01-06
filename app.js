class QuizApp {
    constructor() {
        this.content_start = document.querySelector(".content-start");
        this.start_quiz_button = document.querySelector("#start-quiz-button");
        this.category = document.querySelector("#quiz-category");
        this.difficulty = document.querySelector("#quiz-difficulty");
        this.limit = document.querySelector("#quiz-limit");
        this.categories = ["Linux", "DevOps", "Networking", "react", "Cloud", "Docker", "Kubernetes"];
        this.difficulties = ["Hard", "Medium", "Easy"];
        this.limits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
            "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"];
        this.api_key = "AD9sPtCHx3021gY6h39Qkt2ypsr0r1GAm7Y0i9oF";
        this.basic_url = "https://quizapi.io/api/v1/questions?";

        //Questions part:
        this.content_question = document.querySelector(".content-question");
        this.question_title = document.querySelector('#question-title');
        this.question_options = document.querySelector(".content-question-options");
        this.subimit_button = document.querySelector("#question-subimit-button");
        this.next_button = document.querySelector("#question-next-button");
        this.previous_button = document.querySelector("#question-previous-button");
        this.progress_bar = document.querySelector("#progress-bar");

        this.questions = [];
        this.actual_question = 0;
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
            this.startQuiz();
            this.toogleStartQuestion();
        } catch (error) {
            console.log(`Error: ${error}`);
        }

    }
    toogleStartQuestion(){
        console.log(window.getComputedStyle(this.content_start).display);
        if(window.getComputedStyle(this.content_start).display == "flex"){
            this.content_start.style.display = "none";
            this.content_question.style.display = "flex";
        } else{
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
}
document.addEventListener("DOMContentLoaded", () => {
    new QuizApp();
});