// Основные скрипты для главной страницы
document.addEventListener('DOMContentLoaded', () => {
    // Анимация черепа
    const skull = document.querySelector('.skull');
    let angle = 0;
    
    function animateSkull() {
        angle += 0.02;
        const x = Math.cos(angle) * 20;
        const y = Math.sin(angle) * 10;
        skull.style.transform = `translate(${x}px, ${y}px) rotate(${angle}rad)`;
        requestAnimationFrame(animateSkull);
    }
    
    animateSkull();
    
    // Глитч-эффект для фона
    const canvas = document.getElementById('background-glitch');
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    function drawGlitch() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const width = Math.random() * 10 + 1;
            const height = Math.random() * 10 + 1;
            
            const colors = ['#FF00FF', '#00FF00', '#00FFFF', '#FF00A8'];
            ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
            ctx.fillRect(x, y, width, height);
        }
        
        requestAnimationFrame(drawGlitch);
    }
    
    drawGlitch();
    
    // Переход на тест
    document.getElementById('startTest').addEventListener('click', () => {
        window.location.href = 'test.html';
    });
});