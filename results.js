class ResultDisplay {
    constructor() {
        this.answers = {};
        this.typeData = {};
        this.aspects = {
            'I': { emoji: '🏠', desc: 'Интроверсия: Домашний уют, тишина, созерцание' },
            'O': { emoji: '🎉', desc: 'Экстраверсия: Вечеринки, общение, энергия' },
            'L': { emoji: '🧠', desc: 'Логика: Рациональность, анализ, структура' },
            'C': { emoji: '🎨', desc: 'Креативность: Нестандартное мышление, хаос, идеи' },
            'E': { emoji: '💙', desc: 'Эмпатия: Чувствительность, забота, эмоции' },
            'B': { emoji: '👑', desc: 'Доминирование: Лидерство, контроль, власть' },
            'G': { emoji: '🌊', desc: 'Гибкость: Адаптивность, компромисс, спокойствие' },
            'R': { emoji: '🚀', desc: 'Авантюризм: Риск, эксперименты, неожиданные повороты' }
        };
        
        this.init();
    }
    
    async init() {
        await this.loadTypeData();
        this.loadAnswers();
        this.calculateResult();
        this.displayResult();
        this.setupCharts();
        this.setupEventListeners();
    }
    
    async loadTypeData() {
        try {
            const response = await fetch('types.json');
            this.typeData = await response.json();
        } catch (error) {
            console.error('Error loading type data:', error);
        }
    }
    
    loadAnswers() {
        const savedAnswers = localStorage.getItem('personalityTestAnswers');
        if (savedAnswers) {
            this.answers = JSON.parse(savedAnswers);
        }
    }
    
    calculateResult() {
        // Подсчитываем баллы для каждого аспекта
        const aspectScores = {
            'I': 0, 'O': 0,
            'L': 0, 'C': 0, 'E': 0,
            'B': 0, 'G': 0, 'R': 0
        };
        
        // Подсчет баллов
        Object.values(this.answers).forEach((value, index) => {
            if (index < 5) {
                // Блок 1: I/O
                aspectScores[value]++;
            } else if (index < 12) {
                // Блок 2: L/C/E
                aspectScores[value]++;
            } else {
                // Блок 3: B/G/R
                aspectScores[value]++;
            }
        });
        
        // Определяем доминирующие аспекты
        const focus = aspectScores['I'] > aspectScores['O'] ? 'I' : 'O';
        const thinking = this.getDominantAspect(['L', 'C', 'E'], aspectScores);
        const interaction = this.getDominantAspect(['B', 'G', 'R'], aspectScores);
        
        // Сохраняем результаты
        this.resultType = focus + thinking + interaction;
        this.aspectScores = aspectScores;
        
        // Нормализуем баллы для диаграмм (0-100%)
        this.normalizedScores = {
            'I': Math.round((aspectScores['I'] / 5) * 100),
            'O': Math.round((aspectScores['O'] / 5) * 100),
            'L': Math.round((aspectScores['L'] / 7) * 100),
            'C': Math.round((aspectScores['C'] / 7) * 100),
            'E': Math.round((aspectScores['E'] / 7) * 100),
            'B': Math.round((aspectScores['B'] / 7) * 100),
            'G': Math.round((aspectScores['G'] / 7) * 100),
            'R': Math.round((aspectScores['R'] / 7) * 100)
        };
    }
    
    getDominantAspect(aspects, scores) {
        let maxScore = -1;
        let dominantAspect = aspects[0];
        
        aspects.forEach(aspect => {
            if (scores[aspect] > maxScore) {
                maxScore = scores[aspect];
                dominantAspect = aspect;
            }
        });
        
        return dominantAspect;
    }
    
    displayResult() {
        // Находим данные о типе
        const typeInfo = this.typeData.types.find(t => t.code === this.resultType);
        
        if (!typeInfo) {
            console.error('Type not found:', this.resultType);
            return;
        }
        
        // Заполняем основную карточку
        document.querySelector('.type-title').textContent = typeInfo.name;
        document.querySelector('.type-emoji').textContent = typeInfo.emoji;
        document.querySelector('.type-code').textContent = typeInfo.code;
        document.querySelector('.type-description').textContent = typeInfo.description;
        
        // Определяем три основных аспекта
        const mainAspects = [
            this.resultType[0], // I/O
            this.resultType[1], // L/C/E
            this.resultType[2]  // B/G/R
        ];
        
        // Заполняем карточки аспектов
        const aspectCards = document.querySelectorAll('.aspect-card');
        mainAspects.forEach((aspect, index) => {
            const card = aspectCards[index];
            card.querySelector('.aspect-title').textContent = this.getAspectName(aspect);
            card.querySelector('.aspect-emoji').textContent = this.aspects[aspect].emoji;
            card.querySelector('.aspect-desc').textContent = this.aspects[aspect].desc;
        });
    }
    
    getAspectName(aspect) {
        const names = {
            'I': 'Интроверсия',
            'O': 'Экстраверсия',
            'L': 'Логика',
            'C': 'Креативность',
            'E': 'Эмпатия',
            'B': 'Доминирование',
            'G': 'Гибкость',
            'R': 'Авантюризм'
        };
        return names[aspect] || aspect;
    }
    
    setupCharts() {
        // График 1: I/O
        this.createChart(
            'chart1',
            ['Интроверсия', 'Экстраверсия'],
            [this.normalizedScores['I'], this.normalizedScores['O']],
            ['#FF00FF', '#00FFFF']
        );
        
        // График 2: L/C/E
        this.createChart(
            'chart2',
            ['Логика', 'Креативность', 'Эмпатия'],
            [this.normalizedScores['L'], this.normalizedScores['C'], this.normalizedScores['E']],
            ['#00FF00', '#FF00A8', '#00FFFF']
        );
        
        // График 3: B/G/R
        this.createChart(
            'chart3',
            ['Доминирование', 'Гибкость', 'Авантюризм'],
            [this.normalizedScores['B'], this.normalizedScores['G'], this.normalizedScores['R']],
            ['#FF00FF', '#00FF00', '#00FFFF']
        );
    }
    
    createChart(canvasId, labels, data, colors) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    borderColor: colors.map(c => `${c}CC`),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            color: '#fff',
                            font: {
                                family: '"Press Start 2P", cursive',
                                size: 8
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#fff',
                            font: {
                                family: '"Press Start 2P", cursive',
                                size: 8
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.parsed.y}%`;
                            }
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeOutQuart'
                }
            }
        });
    }
    
    setupEventListeners() {
        // Копирование результата
        document.getElementById('copyBtn').addEventListener('click', () => {
            const typeInfo = this.typeData.types.find(t => t.code === this.resultType);
            const textToCopy = `Мой студенческий архетип: ${typeInfo.name} ${typeInfo.emoji}\n\n${typeInfo.description}\n\nПройти тест: ${window.location.origin}`;
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                alert('Результат скопирован в буфер обмена!');
            }).catch(err => {
                console.error('Failed to copy:', err);
            });
        });
    }
}