class PersonalityTest {
    constructor() {
        this.questions = [];
        this.currentQuestion = 0;
        this.answers = {};
        this.totalQuestions = 0;
        
        this.questionElement = document.querySelector('.question-text');
        this.answersContainer = document.querySelector('.answers-container');
        this.progressFill = document.querySelector('.progress-fill');
        this.progressText = document.querySelector('.progress-text');
        this.prevButton = document.querySelector('.prev');
        this.nextButton = document.querySelector('.next');
        
        this.init();
    }
    
    async init() {
        await this.loadQuestions();
        this.renderQuestion();
        this.setupEventListeners();
    }
    
    async loadQuestions() {
        try {
            const response = await fetch('questions.json');
            const data = await response.json();
            this.questions = this.shuffleQuestions(data.questions);
            this.totalQuestions = this.questions.length;
        } catch (error) {
            console.error('Error loading questions:', error);
        }
    }
    
    shuffleQuestions(questions) {
        // Перемешиваем вопросы, но сохраняем порядок внутри блоков
        const block1 = questions.filter(q => q.block === "Блок 1: Фокус внимания (I/O)");
        const block2 = questions.filter(q => q.block === "Блок 2: Стиль мышления (L/C/E)");
        const block3 = questions.filter(q => q.block === "Блок 3: Способ взаимодействия (B/G/R)");
        
        // Перемешиваем вопросы внутри каждого блока
        const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);
        
        return [
            ...shuffleArray(block1),
            ...shuffleArray(block2),
            ...shuffleArray(block3)
        ];
    }
    
    renderQuestion() {
        if (this.currentQuestion >= this.questions.length) {
            this.completeTest();
            return;
        }
        
        const question = this.questions[this.currentQuestion];
        this.questionElement.textContent = question.text;
        
        // Обновляем прогресс
        const progressPercent = ((this.currentQuestion + 1) / this.totalQuestions) * 100;
        this.progressFill.style.width = `${progressPercent}%`;
        this.progressText.textContent = `Вопрос ${this.currentQuestion + 1}/${this.totalQuestions}`;
        
        // Очищаем предыдущие ответы
        this.answersContainer.innerHTML = '';
        
        // Добавляем новые варианты ответов
        question.answers.forEach((answer, index) => {
            const answerBtn = document.createElement('button');
            answerBtn.className = 'answer-btn';
            answerBtn.textContent = answer.text;
            answerBtn.dataset.value = answer.value;
            
            answerBtn.addEventListener('click', () => {
                this.selectAnswer(answer.value);
            });
            
            this.answersContainer.appendChild(answerBtn);
        });
        
        // Обновляем состояние кнопок навигации
        this.prevButton.disabled = this.currentQuestion === 0;
        this.nextButton.disabled = !this.answers[this.currentQuestion];
        
        // Анимация появления вопроса
        this.questionElement.classList.add('fade-in');
        setTimeout(() => {
            this.questionElement.classList.remove('fade-in');
        }, 500);
    }
    
    selectAnswer(value) {
        // Снимаем выделение со всех кнопок
        document.querySelectorAll('.answer-btn').forEach(btn => {
            btn.style.backgroundColor = 'transparent';
            btn.style.boxShadow = 'none';
        });
        
        // Выделяем выбранную кнопку
        const selectedBtn = [...document.querySelectorAll('.answer-btn')].find(
            btn => btn.dataset.value === value
        );
        
        if (selectedBtn) {
            selectedBtn.style.backgroundColor = 'rgba(0, 255, 255, 0.2)';
            selectedBtn.style.boxShadow = '0 0 10px #00FFFF';
        }
        
        // Сохраняем ответ
        this.answers[this.currentQuestion] = value;
        this.nextButton.disabled = false;
    }
    
    setupEventListeners() {
        this.nextButton.addEventListener('click', () => {
            if (this.currentQuestion < this.questions.length - 1) {
                this.currentQuestion++;
                this.renderQuestion();
            } else {
                this.completeTest();
            }
        });
        
        this.prevButton.addEventListener('click', () => {
            if (this.currentQuestion > 0) {
                this.currentQuestion--;
                this.renderQuestion();
            }
        });
    }
    
    completeTest() {
        // Сохраняем ответы в localStorage
        localStorage.setItem('personalityTestAnswers', JSON.stringify(this.answers));
        
        // Перенаправляем на страницу результатов
        window.location.href = 'results.html';
    }
}