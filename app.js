class QuizApp {
    constructor() {
        this.start_quiz_button = document.querySelector("#start-quiz-button");
        this.category = document.querySelector("#quiz-category");
        this.difficulty = document.querySelector("#quiz-difficulty");
        this.limit = document.querySelector("#quiz-limit");
        this.categories = ["Linux", "DevOps", "Networking", "Programming", "Cloud", "Docker", "Kubernetes"];
        this.difficulties = ["Hard", "Medium", "Easy"];
        this.limits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
            "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"];
        this.api_key = "AD9sPtCHx3021gY6h39Qkt2ypsr0r1GAm7Y0i9oF";
        this.basic_url = "https://quizapi.io/api/v1/questions?";
        this.init();
    }
    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.start_quiz_button.addEventListener("click", () => {
            this.handleStartQuiz();
        });
    }

    handleStartQuiz() {
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
            const data = await this.getQuizQuestions(url);
            console.log(data);

        } catch (error) {
            console.log(`Error: ${error}`);
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