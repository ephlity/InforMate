// Версия темы для предотвращения проблем с кэшированием
const themeVersion = '1.0';

// Функция для получения cookie по имени
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

function applyTheme(theme) {
    console.log('Применяется тема:', theme);
    
    document.documentElement.setAttribute('data-theme', theme);
    
    // Устанавливаем атрибут для CSS переменных
    document.documentElement.setAttribute('data-theme', theme);
    
    // Для обратной совместимости
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
    
    try {
        // Сохраняем во всех доступных хранилищах
        localStorage.setItem('theme-' + themeVersion, theme);
        localStorage.setItem('theme', theme); // Для обратной совместимости
        sessionStorage.setItem('theme-' + themeVersion, theme);
        
        // Устанавливаем cookie на всякий случай (для случаев, когда localStorage недоступен)
        document.cookie = "theme=" + theme + "; path=/; max-age=31536000"; // 1 год
        
        console.log('Тема успешно сохранена в хранилищах:', theme);
    } catch (e) {
        console.error('Ошибка при сохранении темы:', e);
    }
    
    // Обновляем иконку переключателя
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('.theme-icon');
        if (icon) {
            // Теперь для light темы - moon.png, для dark - sun.png
            icon.src = theme === 'dark' ? 'img/light.png' : 'img/dark.png';
            icon.alt = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
        }
    }

    // Обновляем изображения
    const images = document.querySelectorAll('img:not(.theme-icon)');
    images.forEach(img => {
        const src = img.getAttribute('src');
        if (src) {
            if (theme === 'dark') {
                if (!src.includes('-dark.png')) {
                    img.setAttribute('src', src.replace('.png', '-dark.png'));
                }
            } else {
                img.setAttribute('src', src.replace('-dark.png', '.png'));
            }
        }
    });
}

// Функция для определения предпочтительной темы (с тройной проверкой)
function getPreferredTheme() {
    let theme = null;
    
    // Проверяем все возможные источники
    try {
        // 1. Проверяем sessionStorage (самый быстрый и надежный между страницами)
        theme = sessionStorage.getItem('theme-' + themeVersion);
        if (theme) {
            console.log('Тема из sessionStorage:', theme);
            return theme;
        }
        
        // 2. Проверяем localStorage
        theme = localStorage.getItem('theme-' + themeVersion);
        if (theme) {
            console.log('Тема из localStorage (новый формат):', theme);
            return theme;
        }
        
        // 3. Проверяем localStorage (старый формат)
        theme = localStorage.getItem('theme');
        if (theme) {
            console.log('Тема из localStorage (старый формат):', theme);
            return theme;
        }
        
        // 4. Проверяем cookie
        theme = getCookie('theme');
        if (theme) {
            console.log('Тема из cookie:', theme);
            return theme;
        }
    } catch (e) {
        console.error('Ошибка при чтении темы из хранилищ:', e);
    }
    
    // 5. Проверяем системные настройки
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        console.log('Используем системную тёмную тему');
        return 'dark';
    }
    
    console.log('Используем светлую тему по умолчанию');
    return 'light';
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded - инициализация темы');
    
    // Применяем сохранённую или предпочтительную тему
    const theme = getPreferredTheme();
    applyTheme(theme);
    
    // Настраиваем переключатель темы
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            console.log('Переключение темы:', currentTheme, '->', newTheme);
            applyTheme(newTheme);
            
            // Проверка, что тема сохранилась
            setTimeout(() => {
                const savedTheme = getPreferredTheme();
                console.log('Проверка сохранения темы:', savedTheme);
                if (savedTheme !== newTheme) {
                    console.warn('Тема не сохранилась! Повторная попытка...');
                    applyTheme(newTheme);
                }
            }, 100);
        });
    }

    // Слушаем изменения системной темы
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            // Меняем тему только если пользователь не выбрал свою
            try {
                if (!localStorage.getItem('theme-' + themeVersion) && !localStorage.getItem('theme')) {
                    const newTheme = e.matches ? 'dark' : 'light';
                    console.log('Изменена системная тема:', newTheme);
                    applyTheme(newTheme);
                }
            } catch (err) {
                console.error('Ошибка при проверке localStorage:', err);
            }
        });
    }
    
    // Убираем класс loading для включения анимаций
    document.body.classList.remove('loading');
    document.body.classList.add('loaded');

    // Добавляем обработчики событий для всех ссылок с email
    const emailLinks = document.querySelectorAll('.email-link');
    emailLinks.forEach(link => {
        link.addEventListener('click', copyEmail);
    });
});

// Рандомный совет (только для index.html)
if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
    const tips = [
        "Регулярно повторяйте пройденный материал.",
        "Соблюдайте режим сна: 7-8 часов сна помогут лучше усваивать материал.",
        "Решайте задачи каждый день, даже если немного.",
        "Не бойтесь ошибаться — это часть обучения.",
        "Планируйте своё время и ставьте цели."
    ];

    const randomTipElement = document.getElementById('random-tip');
    if (randomTipElement) {
        randomTipElement.textContent = tips[Math.floor(Math.random() * tips.length)];
    }
}

// Функция для копирования email-адреса
function copyEmail(event) {
    event.preventDefault();
    const email = event.target.getAttribute('data-email');
    navigator.clipboard.writeText(email).then(() => {
        const originalText = event.target.textContent;
        event.target.textContent = 'Email скопирован!';
        setTimeout(() => {
            event.target.textContent = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Ошибка при копировании:', err);
    });
}