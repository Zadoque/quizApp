class QuizApp {
    constructor() {
        this.start_quiz_button = document.querySelector("#start-quiz-button");
        this.category = document.querySelector("#quiz-category");
        this.difficulty = document.querySelector("#quiz-difficulty");
        this.limit = document.querySelector("#quiz-limit");
        this.init();
    }
    init() {
        this.bindEvents();
    }

    

}