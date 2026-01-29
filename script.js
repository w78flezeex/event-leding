// Плавный скролл
function scrollTo(selector) {
    document.querySelector(selector).scrollIntoView({
        behavior: 'smooth'
    });
}

// Калькулятор
function changeCount(id, delta) {
    const input = document.getElementById(id);
    let value = parseInt(input.value) + delta;
    const min = parseInt(input.min);
    const max = parseInt(input.max);
    
    if (value >= min && value <= max) {
        input.value = value;
        calculate();
    }
}

function calculate() {
    const kids = parseInt(document.getElementById('kids').value);
    const hours = parseInt(document.getElementById('hours').value);
    const chars = parseInt(document.getElementById('chars').value);
    
    // Базовая стоимость
    let total = 4000 * chars; // Базовая цена за персонажа
    
    // За каждый час после первого
    total += (hours - 1) * 2000 * chars;
    
    // За количество детей (если больше 10)
    if (kids > 10) {
        total += (kids - 10) * 150;
    }
    
    // Дополнительные опции
    if (document.getElementById('bubble').checked) total += 2000;
    if (document.getElementById('photo').checked) total += 3000;
    if (document.getElementById('balloons').checked) total += 2500;
    
    // Форматирование
    const formatted = total.toLocaleString('ru-RU') + ' ₽';
    document.getElementById('total-price').textContent = formatted;
}

// Модальное окно
function openModal() {
    document.getElementById('modal').classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Конфетти при открытии
    createConfetti();
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
    document.body.style.overflow = '';
    document.getElementById('modal-success').classList.remove('show');
}

function submitForm(e) {
    e.preventDefault();
    document.getElementById('modal-success').classList.add('show');
    createConfetti();
}

// Клик вне модалки
document.getElementById('modal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Фильтр персонажей
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Активная кнопка
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const filter = this.dataset.filter;
        
        document.querySelectorAll('.hero-item').forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
                item.style.display = 'block';
                item.style.animation = 'fadeIn 0.5s ease';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Анимация счётчиков
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.target);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// Intersection Observer для счётчиков
const statsSection = document.querySelector('.stats');
let countersAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
            animateCounters();
            countersAnimated = true;
        }
    });
}, { threshold: 0.5 });

statsObserver.observe(statsSection);

// Конфетти
function createConfetti() {
    const container = document.getElementById('confetti');
    const colors = ['#FF6B35', '#FFD23F', '#7B2CBF', '#4CAF50', '#2196F3', '#E91E63'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        
        // Случайная форма
        if (Math.random() > 0.5) {
            confetti.style.borderRadius = '50%';
        } else {
            confetti.style.width = '8px';
            confetti.style.height = '16px';
        }
        
        container.appendChild(confetti);
        
        // Удаление после анимации
        setTimeout(() => {
            confetti.remove();
        }, 4000);
    }
}

// Анимация появления элементов при скролле
const fadeElements = document.querySelectorAll('.hero-item, .review-card, .calc-feature');

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

fadeElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    fadeObserver.observe(el);
});

// Хедер при скролле
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 5px 30px rgba(0,0,0,0.1)';
    } else {
        header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.05)';
    }
    
    lastScroll = currentScroll;
});

// Добавляем стили для анимации появления
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

// Инициализация калькулятора
calculate();

// Приветственное конфетти через 1.5 сек
setTimeout(() => {
    createConfetti();
}, 1500);
