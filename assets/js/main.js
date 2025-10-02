/**
 * RETRO-PC STORE - ENHANCED MAIN JAVASCRIPT
 * Модернізований JavaScript з поліпшеннями функціональності
 * 
 * Основні покращення:
 * - Підтримка тем оформлення
 * - Розширена Wiki з новими статтями
 * - Покращена accessibility
 * - Performance моніторинг
 * - Додаткові інтерактивні ефекти
 * - Кнопка "повернутися наверх"
 * - Локальне збереження налаштувань
 */

// ================================
// КОНФІГУРАЦІЯ СИСТЕМИ
// ================================

const CONFIG = {
    // Режим розробки (вимкнути для production)
    DEBUG: location.hostname === 'localhost' || location.hostname === '127.0.0.1',
    
    // Час життя кешу (24 години)
    CACHE_DURATION: 24 * 60 * 60 * 1000,
    
    // Ключі для зберігання в localStorage
    CACHE_KEY: 'retropc_products_cache',
    CACHE_TIMESTAMP_KEY: 'retropc_products_timestamp',
    SETTINGS_KEY: 'retropc_settings',
    
    // Пошукові запити для eBay
    SEARCH_QUERIES: [
        'Intel 8086 CPU processor vintage',
        'Intel 8088 CPU processor retro', 
        'Intel 8087 math coprocessor FPU',
        'IBM PC XT motherboard vintage',
        'Retro computer CGA EGA graphics card'
    ],
    
    // Максимальна кількість товарів для відображення
    MAX_PRODUCTS: 12,
    
    // Затримка між запитами до API (мс)
    API_DELAY: 600,
    
    // Налаштування анімацій
    ANIMATION_DURATION: 300,
    SCROLL_THRESHOLD: 200,
    
    // Налаштування теми
    THEMES: {
        green: 'green',
        amber: 'amber'
    }
};

// ================================
// УТИЛІТИ ДЛЯ ЛОГУВАННЯ
// ================================

/**
 * Обгорнута функція логування, що працює тільки в DEBUG режимі
 */
const logger = {
    log: (...args) => CONFIG.DEBUG && console.log(...args),
    warn: (...args) => CONFIG.DEBUG && console.warn(...args),
    error: (...args) => console.error(...args), // Помилки завжди показуємо
    info: (...args) => CONFIG.DEBUG && console.info(...args)
};

// ================================
// ГЛОБАЛЬНІ ЗМІННІ
// ================================

let currentTheme = 'green';
let isInitialized = false;
let performanceStartTime = performance.now();

// ================================
// ГОЛОВНА ФУНКЦІЯ ІНІЦІАЛІЗАЦІЇ
// ================================

document.addEventListener('DOMContentLoaded', async function() {
    logger.log('🖥️ Retro-PC Store Enhanced v2.0 initializing...');
    performanceStartTime = performance.now();
    
    try {
        // Ініціалізуємо всі компоненти
        await initializeApp();
        
        logger.log('✅ Retro-PC Store fully initialized');
        isInitialized = true;
        
        // Вимірюємо час ініціалізації
        const initTime = performance.now() - performanceStartTime;
        logger.log(`⚡ Initialization completed in ${Math.round(initTime)}ms`);
        
    } catch (error) {
        logger.error('❌ Critical error during initialization:', error);
        showCriticalError();
    }
});

/**
 * Головна функція ініціалізації додатка
 */
async function initializeApp() {
    // 1. Завантажуємо збережені налаштування
    loadUserSettings();
    
    // 2. Ініціалізуємо тему
    initializeThemeSystem();
    
    // 3. Ініціалізуємо товари
    await initializeProducts();
    
    // 4. Ініціалізуємо Wiki модальні вікна
    initializeWikiModal();
    
    // 5. Ініціалізуємо навігацію та UX елементи
    initializeNavigation();
    
    // 6. Ініціалізуємо кнопку "наверх"
    initializeBackToTop();
    
    // 7. Ініціалізуємо клавіатурні скорочення
    initializeKeyboardShortcuts();
    
    // 8. Ініціалізуємо performance моніторинг
    initializePerformanceMonitoring();
    
    // 9. Додаємо обробники помилок
    initializeErrorHandling();
}

// ================================
// СИСТЕМА ТЕМ ОФОРМЛЕННЯ
// ================================

/**
 * Ініціалізує систему тем
 */
function initializeThemeSystem() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    // Встановлюємо поточну тему
    applyTheme(currentTheme);
    
    // Обробник переключення теми
    themeToggle.addEventListener('click', function(e) {
        e.preventDefault();
        toggleTheme();
    });
    
    logger.log('🎨 Theme system initialized');
}

/**
 * Переключає тему оформлення
 */
function toggleTheme() {
    currentTheme = currentTheme === 'green' ? 'amber' : 'green';
    applyTheme(currentTheme);
    saveUserSettings();
    
    // Показуємо сповіщення про зміну теми
    showNotification(`Тему змінено на ${currentTheme === 'green' ? 'зелену' : 'янтарну'}`, 'success');
}

/**
 * Застосовує тему до документа
 */
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Оновлюємо текст кнопки
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.textContent = theme === 'green' ? '[ЯНТАРНА ТЕМА]' : '[ЗЕЛЕНА ТЕМА]';
    }
}

// ================================
// РОЗШИРЕНА WIKI СИСТЕМА
// ================================

const WIKI_ARTICLES = {
    'intel-8086-history': {
        title: 'ІСТОРІЯ МІКРОПРОЦЕСОРА INTEL 8086',
        content: `

            <h1>Intel 8086: Революція у світі персональних комп'ютерів</h1>
            
            <h2>Передумови створення</h2>
            <p>У середині 1970-х років компанія Intel активно працювала над створенням 16-бітного мікропроцесора, який мав би стати наступником успішної 8-бітної серії 8080. Проект розпочався у <strong>1976 році</strong> під керівництвом інженера <em>Стівена Морса</em>.</p>
            
            <p>Основною метою було створення процесора, який би забезпечив <strong>зворотну сумісність</strong> з існуючим програмним забезпеченням для 8080, але водночас надав би значно більшу продуктивність та можливості роботи з пам'яттю.</p>
            
            <h2>Технічні характеристики</h2>
            <ul>
                <li><strong>Розрядність:</strong> 16 біт (внутрішня шина даних)</li>
                <li><strong>Зовнішня шина даних:</strong> 16 біт</li>
                <li><strong>Адресна шина:</strong> 20 біт (до 1 МБ пам'яті)</li>
                <li><strong>Частота:</strong> від 5 до 10 МГц</li>
                <li><strong>Технологічний процес:</strong> 3 мікрони (nMOS)</li>
                <li><strong>Кількість транзисторів:</strong> приблизно 29,000</li>
            </ul>
            
            <h2>Революційні особливості</h2>
            <p>Intel 8086 запровадив концепцію <strong>сегментованої пам'яті</strong>, яка дозволяла адресувати до 1 мегабайта оперативної пам'яті - величезний обсяг для того часу. Це було досягнуто за допомогою системи сегментів, де кожна адреса складалася з двох частин: сегменту та зміщення.</p>
            
            <p>Архітектура 8086 заклала основи для всієї майбутньої <em>x86 сімейства процесорів</em>, яке домінує на ринку персональних комп'ютерів і сьогодні.</p>
            
            <h2>Вплив на індустрію</h2>
            <p>Хоча спочатку процесор не мав великого комерційного успіху через високу вартість, все змінилося після випуску <strong>IBM PC</strong> у 1981 році з процесором Intel 8088 (8-бітною версією 8086).</p>
            
            <p>Саме завдяки IBM PC архітектура x86 стала стандартом де-факто для персональних комп'ютерів, а Intel 8086 увійшов в історію як <em>"батько" сучасних процесорів</em>.</p>
        `
    },
    
    'cga-vs-ega': {
        title: 'ПОРІВНЯННЯ ГРАФІЧНИХ СТАНДАРТІВ CGA VS EGA',
        content: `
            <h1>CGA vs EGA: Еволюція комп'ютерної графіки</h1>
            
            <h2>Color Graphics Adapter (CGA) - 1981</h2>
            <p><strong>CGA</strong> був першим кольоровим графічним стандартом для IBM PC, випущеним у <em>1981 році</em>. Незважаючи на обмежені можливості, він заклав основи для всієї майбутньої комп'ютерної графіки.</p>
            
            <h2>Технічні характеристики CGA</h2>
            <ul>
                <li><strong>Роздільна здатність:</strong> 320x200 (4 кольори) або 640x200 (монохром)</li>
                <li><strong>Палітра:</strong> 16 кольорів, але лише 4 одночасно</li>
                <li><strong>Відеопам'ять:</strong> 16 КБ</li>
                <li><strong>Частота оновлення:</strong> 60 Гц</li>
                <li><strong>Текстовий режим:</strong> 80x25 символів</li>
            </ul>
            
            <h2>Enhanced Graphics Adapter (EGA) - 1984</h2>
            <p><strong>EGA</strong> з'явився у <em>1984 році</em> як значне покращення CGA. Він пропонував кращу роздільну здатність, більше кольорів та зворотну сумісність з попередніми стандартами.</p>
            
            <h2>Технічні характеристики EGA</h2>
            <ul>
                <li><strong>Роздільна здатність:</strong> 640x350 (16 кольорів)</li>
                <li><strong>Палітра:</strong> 64 кольори, 16 одночасно</li>
                <li><strong>Відеопам'ять:</strong> 256 КБ</li>
                <li><strong>Частота оновлення:</strong> 60 Гц</li>
                <li><strong>Текстовий режим:</strong> 80x25 або 80x43 символи</li>
            </ul>
            
            <h2>Ключові відмінності</h2>
            <p>Основною перевагою EGA була <strong>значно вища роздільна здатність</strong> - 640x350 проти 320x200 у CGA. Це дозволило створювати набагато більш деталізовані зображення та текст.</p>
            
            <p><em>Кількість одночасних кольорів</em> також зросла з 4 до 16, що відкрило нові можливості для ігор та графічних додатків.</p>
            
            <h2>Спадщина</h2>
            <p>Хоча EGA був замінений VGA у 1987 році, його вплив на розвиток комп'ютерної графіки важко переоцінити. Багато принципів, закладених в EGA, використовуються і сьогодні.</p>
        `
    },
    
    'xt-motherboards': {
        title: 'НАЛАШТУВАННЯ МАТЕРИНСЬКИХ ПЛАТ XT КЛАСУ',
        content: `
            <h1>Материнські плати IBM PC/XT: Посібник з налаштування</h1>
            
            <h2>Огляд архітектури XT</h2>
            <p><strong>IBM PC/XT</strong> (eXtended Technology) був випущений у <em>березні 1983 року</em> як покращена версія оригінального IBM PC. Основними відмінностями були наявність жорсткого диска та розширена материнська плата.</p>
            
            <h2>Основні компоненти материнської плати</h2>
            <ul>
                <li><strong>Процесор:</strong> Intel 8088 на 4.77 МГц</li>
                <li><strong>Оперативна пам'ять:</strong> 128-640 КБ</li>
                <li><strong>ROM BIOS:</strong> 8 КБ (пізніше 64 КБ)</li>
                <li><strong>Слоти розширення:</strong> 8 слотів ISA 8-біт</li>
                <li><strong>Сопроцесор:</strong> гніздо для Intel 8087</li>
            </ul>
            
            <h2>DIP-перемикачі та джампери</h2>
            <p>Налаштування материнської плати XT здійснювалося за допомогою <strong>DIP-перемикачів</strong> (подвійних лінійних перемикачів) та джамперів. Це було необхідно для конфігурації обсягу пам'яті, типу відеоадаптера та інших параметрів.</p>
            
            <h2>Конфігурація пам'яті</h2>
            <p>Одним з найскладніших аспектів налаштування була <em>конфігурація пам'яті</em>. Система використовувала складну схему адресації, де перші 640 КБ відводилися під основну пам'ять.</p>
            
            <ul>
                <li><code>128 КБ</code> - мінімальна конфігурація</li>
                <li><code>256 КБ</code> - стандартна конфігурація</li>
                <li><code>512 КБ</code> - розширена конфігурація</li>
                <li><code>640 КБ</code> - максимальна основна пам'ять</li>
            </ul>
        `
    },
    
    'memory-expansion': {
        title: 'РОЗШИРЕННЯ ПАМ\'ЯТІ В СИСТЕМАХ XT/AT',
        content: `
            <h1>Розширення пам'яті в комп'ютерах XT/AT</h1>
            
            <h2>Обмеження базової пам'яті</h2>
            <p>Ранні персональні комп'ютери мали суворі обмеження щодо обсягу оперативної пам'яті. IBM PC міг адресувати лише <strong>640 КБ</strong> основної пам'яті, що швидко стало вузьким місцем для складних програм.</p>
            
            <h2>Типи розширення пам'яті</h2>
            <ul>
                <li><strong>Conventional Memory</strong> - перші 640 КБ</li>
                <li><strong>Upper Memory Area (UMA)</strong> - 640КБ - 1МБ</li>
                <li><strong>Extended Memory (XMS)</strong> - понад 1 МБ (тільки 80286+)</li>
                <li><strong>Expanded Memory (EMS)</strong> - банкова система пам'яті</li>
            </ul>
            
            <h2>EMS (Expanded Memory Specification)</h2>
            <p>Стандарт EMS, розроблений спільно Lotus, Intel та Microsoft, дозволяв програмам використовувати до <em>32 МБ</em> пам'яті через систему банків по 16 КБ кожен.</p>
            
            <h2>Практичні поради з розширення</h2>
            <ul>
                <li>Використовуйте <code>MEM.EXE</code> для діагностики пам'яті</li>
                <li>Правильно налаштуйте <code>CONFIG.SYS</code> та <code>AUTOEXEC.BAT</code></li>
                <li>Оптимізуйте завантаження драйверів в Upper Memory</li>
                <li>Використовуйте <code>MEMMAKER</code> для автоматичної оптимізації</li>
            </ul>
            
            <h2>Поширені проблеми</h2>
            <p>Найчастіші проблеми включали конфлікти адрес, неправильні налаштування DIP-перемикачів та несумісність між різними типами пам'яті. Рішення вимагало ретельного планування карти пам'яті.</p>
        `
    },
    
    'sound-cards-history': {
        title: 'ЕВОЛЮЦІЯ ЗВУКОВИХ КАРТ ADLIB І SOUND BLASTER',
        content: `
            <h1>Революція звуку: AdLib та Sound Blaster</h1>
            
            <h2>До епохи звукових карт</h2>
            <p>Ранні персональні комп'ютери мали вкрай обмежені звукові можливості. IBM PC міг генерувати лише прості звукові сигнали через вбудований <strong>PC Speaker</strong> - динамік, здатний відтворювати лише одну ноту за раз.</p>
            
            <h2>AdLib Music Synthesizer Card (1987)</h2>
            <p>Компанія Ad Lib Inc. випустила першу популярну звукову карту для PC у <em>1987 році</em>. Карта базувалася на чипі <strong>Yamaha YM3812 (OPL2)</strong> та використовувала FM-синтез для створення музики.</p>
            
            <h2>Технічні характеристики AdLib</h2>
            <ul>
                <li><strong>Синтез:</strong> FM (частотна модуляція)</li>
                <li><strong>Поліфонія:</strong> 9 каналів одночасно</li>
                <li><strong>Чип:</strong> Yamaha YM3812 OPL2</li>
                <li><strong>Частота дискретизації:</strong> 49.7 кГц</li>
                <li><strong>Підтримка MIDI:</strong> через FM-синтез</li>
            </ul>
            
            <h2>Sound Blaster (1989) - Переломний момент</h2>
            <p>Компанія Creative Labs випустила <strong>Sound Blaster</strong> у 1989 році, який не тільки був сумісний з AdLib, але й додавав можливості цифрового звуку.</p>
            
            <h2>Нововведення Sound Blaster</h2>
            <ul>
                <li><strong>Повна сумісність з AdLib</strong> - всі існуючі ігри працювали</li>
                <li><strong>Цифровий звук</strong> - 8-біт моно 22 кГц</li>
                <li><strong>Мікрофонний вхід</strong> для запису звуку</li>
                <li><strong>MIDI-інтерфейс</strong> для підключення синтезаторів</li>
                <li><strong>Joystick порт</strong> - два геймпада одночасно</li>
            </ul>
            
            <h2>Sound Blaster Pro (1991)</h2>
            <p>Покращена версія додала <em>стерео звук</em> та підтримку вищих частот дискретизації до 44.1 кГц. Використовувався подвійний OPL2 чип для стерео FM-синтезу.</p>
            
            <h2>Sound Blaster 16 (1992)</h2>
            <p>Революційна карта з <strong>16-бітним цифровим звуком</strong> та повною підтримкою CD-якості аудіо. Додано:</p>
            <ul>
                <li>16-біт стерео запис/відтворення</li>
                <li>Частоти до 44.1 кГц</li>
                <li>Вбудований CD-ROM інтерфейс</li>
                <li>Покращений MIDI з wave-table синтезом</li>
            </ul>
            
            <h2>Вплив на ігрову індустрію</h2>
            <p>Sound Blaster став стандартом де-факто для PC-ігор. Фрази "Sound Blaster compatible" та "AdLib compatible" стали обов'язковими на коробках ігор 90-х років.</p>
            
            <p>Популярні ігри як <em>Doom</em>, <em>Wing Commander</em> та <em>Monkey Island</em> вперше продемонстрували потужність якісного звуку в іграх, назавжди змінивши очікування гравців.</p>
        `
    }
};

/**
 * Ініціалізує розширену Wiki систему
 */
function initializeWikiModal() {
    logger.log('🔧 Initializing enhanced Wiki modal system...');
    
    const wikiLinks = document.querySelectorAll('.wiki-link[data-article-id]');
    const modal = document.getElementById('wiki-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    const modalClose = document.getElementById('modal-close');
    
    if (!modal || !modalTitle || !modalContent || !modalClose) {
        logger.error('❌ Modal elements not found!');
        return;
    }
    
    // Додаємо обробники для всіх Wiki посилань
    wikiLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const articleId = this.getAttribute('data-article-id');
            logger.log('📖 Opening wiki article:', articleId);
            
            openWikiModal(articleId, modal, modalTitle, modalContent);
            
            // Аналітика (якщо потрібно)
            trackEvent('wiki_article_opened', { article: articleId });
        });
    });
    
    // Обробники закриття модального вікна
    modalClose.addEventListener('click', () => closeWikiModal(modal));
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeWikiModal(modal);
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeWikiModal(modal);
        }
    });
    
    logger.log('✅ Wiki modal system initialized with', Object.keys(WIKI_ARTICLES).length, 'articles');
}

/**
 * Відкриває модальне вікно Wiki статті
 */
function openWikiModal(articleId, modal, modalTitle, modalContent) {
    const article = WIKI_ARTICLES[articleId];
    
    if (!article) {
        logger.error('❌ Article not found:', articleId);
        modalTitle.textContent = 'ПОМИЛКА';
        modalContent.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <h1 style="color: var(--terminal-error); font-size: 24px;">❌ СТАТТЯ НЕ ЗНАЙДЕНА</h1>
                <p>Перепрошуємо, але запитана стаття відсутня в базі даних.</p>
                <p style="color: var(--terminal-gray); font-size: 14px;">Код помилки: WIKI_404_${articleId}</p>
            </div>
        `;
    } else {
        logger.log('✅ Loading article:', article.title);
        modalTitle.textContent = article.title;
        modalContent.innerHTML = article.content;
        
        // Додаємо плавну анімацію для контенту
        modalContent.style.opacity = '0';
        setTimeout(() => {
            modalContent.style.transition = 'opacity 0.3s ease';
            modalContent.style.opacity = '1';
        }, 100);
    }
    
    // Показуємо модальне вікно
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Блокуємо прокрутку фону
    document.body.style.overflow = 'hidden';
    
    // Встановлюємо фокус на контент для accessibility
    setTimeout(() => {
        modalContent.focus();
    }, 350);
}

/**
 * Закриває модальне вікно Wiki
 */
function closeWikiModal(modal) {
    modal.setAttribute('data-closing', 'true');
    modal.classList.remove('show');
    
    // Відновлюємо прокрутку
    document.body.style.overflow = '';
    
    setTimeout(() => {
        modal.style.display = 'none';
        modal.removeAttribute('data-closing');
    }, CONFIG.ANIMATION_DURATION);
    
    logger.log('✅ Modal closed successfully');
}

// ================================
// СИСТЕМА ПРОДУКТІВ (ПОКРАЩЕНА)
// ================================

/**
 * Ініціалізує систему завантаження товарів
 */
async function initializeProducts() {
    const productsContainer = document.getElementById('products-container');
    if (!productsContainer) {
        logger.error('❌ Products container not found!');
        return;
    }

    showLoadingMessage(productsContainer);

    try {
        // Перевіряємо кеш
        const cachedData = getCachedProducts();
        if (cachedData && cachedData.length > 0) {
            logger.log('✅ Using cached data:', cachedData.length, 'products');
            displayProducts(productsContainer, cachedData, 'cache');
            return;
        }

        // Завантажуємо з API
        logger.log('🔍 Cache empty, fetching from eBay API...');
        const apiProducts = await loadProductsFromAPI();
        
        if (apiProducts && apiProducts.length > 0) {
            logger.log('✅ API data loaded:', apiProducts.length, 'products');
            displayProducts(productsContainer, apiProducts, 'api');
            cacheProducts(apiProducts);
        } else {
            // Використовуємо fallback дані
            logger.log('📦 Using fallback data...');
            if (typeof window.fallbackProducts !== 'undefined') {
                const fallbackItems = window.getRandomFallbackProducts 
                    ? window.getRandomFallbackProducts(CONFIG.MAX_PRODUCTS)
                    : window.fallbackProducts.slice(0, CONFIG.MAX_PRODUCTS);
                displayProducts(productsContainer, fallbackItems, 'fallback');
            } else {
                showErrorMessage(productsContainer, 'Товари тимчасово недоступні');
            }
        }
    } catch (error) {
        logger.error('❌ Error loading products:', error);
        // Fallback у випадку помилки
        if (typeof window.fallbackProducts !== 'undefined') {
            displayProducts(productsContainer, window.fallbackProducts, 'fallback');
        } else {
            showErrorMessage(productsContainer, 'Помилка завантаження товарів');
        }
    }
}

// ================================
// НАВІГАЦІЯ ТА UX ПОКРАЩЕННЯ
// ================================

/**
 * Ініціалізує навігацію та UX елементи
 */
function initializeNavigation() {
    // Плавна прокрутка для навігаційних посилань
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Додаємо фокус для accessibility
                targetElement.tabIndex = -1;
                targetElement.focus();
                
                trackEvent('navigation_click', { target: targetId });
            }
        });
    });
    
    logger.log('🧭 Navigation system initialized');
}

/**
 * Ініціалізує кнопку "повернутися наверх"
 */
function initializeBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    if (!backToTopButton) return;
    
    // Показуємо/приховуємо кнопку при прокрутці
    window.addEventListener('scroll', throttle(() => {
        if (window.pageYOffset > CONFIG.SCROLL_THRESHOLD) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    }, 100));
    
    // Обробник кліку
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        trackEvent('back_to_top_clicked');
    });
    
    logger.log('⬆️ Back to top button initialized');
}

/**
 * Ініціалізує клавіатурні скорочення
 */
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Alt + T - переключення теми
        if (e.altKey && e.key === 't') {
            e.preventDefault();
            toggleTheme();
        }
        
        // Alt + H - перехід до магазину
        if (e.altKey && e.key === 'h') {
            e.preventDefault();
            document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Alt + W - перехід до Wiki
        if (e.altKey && e.key === 'w') {
            e.preventDefault();
            document.getElementById('wiki')?.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Alt + R - оновлення товарів
        if (e.altKey && e.key === 'r') {
            e.preventDefault();
            refreshProducts();
        }
    });
    
    logger.log('⌨️ Keyboard shortcuts initialized (Alt+T, Alt+H, Alt+W, Alt+R)');
}

// ================================
// ДОПОМІЖНІ ФУНКЦІЇ
// ================================

/**
 * Завантажує користувацькі налаштування
 */
function loadUserSettings() {
    try {
        const settings = localStorage.getItem(CONFIG.SETTINGS_KEY);
        if (settings) {
            const parsed = JSON.parse(settings);
            currentTheme = parsed.theme || 'green';
            logger.log('⚙️ User settings loaded:', parsed);
        }
    } catch (error) {
        logger.warn('⚠️ Could not load user settings:', error);
    }
}

/**
 * Зберігає користувацькі налаштування
 */
function saveUserSettings() {
    try {
        const settings = {
            theme: currentTheme,
            lastSaved: Date.now()
        };
        localStorage.setItem(CONFIG.SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
        logger.warn('⚠️ Could not save user settings:', error);
    }
}

/**
 * Показує сповіщення користувачу
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--terminal-primary);
        color: var(--terminal-bg);
        padding: 15px 20px;
        border: 2px solid var(--terminal-primary);
        font-family: var(--font-mono);
        z-index: 3000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    // Анімація появи
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Автоматичне зникнення
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

/**
 * Оновлює товари
 */
async function refreshProducts() {
    clearCache();
    showNotification('Оновлення товарів...', 'info');
    await initializeProducts();
    showNotification('Товари оновлено!', 'success');
}

/**
 * Throttle функція для оптимізації подій
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

/**
 * Відстежує події для аналітики
 */
function trackEvent(eventName, properties = {}) {
    // Google Analytics 4 event tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            event_category: properties.category || 'User Interaction',
            event_label: properties.label || '',
            value: properties.value || 0,
            custom_parameter_1: properties.section || 'unknown',
            ...properties
        });
    }
    
    logger.log('📊 Event tracked:', eventName, properties);
}

/**
 * Ініціалізує моніторинг продуктивності
 */
function initializePerformanceMonitoring() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            logger.log('⚡ Page load time:', Math.round(loadTime), 'ms');
            
            // Відстежуємо метрики
            setTimeout(() => {
                const paintMetrics = performance.getEntriesByType('paint');
                paintMetrics.forEach(metric => {
                    logger.log(`🎨 ${metric.name}:`, Math.round(metric.startTime), 'ms');
                });
            }, 0);
        });
    }
}

/**
 * Ініціалізує обробку помилок
 */
function initializeErrorHandling() {
    window.addEventListener('error', function(event) {
        logger.error('🚨 Global error:', event.error);
        trackEvent('javascript_error', {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno
        });
    });
    
    window.addEventListener('unhandledrejection', function(event) {
        logger.error('🚨 Unhandled promise rejection:', event.reason);
        trackEvent('promise_rejection', {
            reason: event.reason?.toString()
        });
        event.preventDefault();
    });
}

/**
 * Показує критичну помилку
 */
function showCriticalError() {
    const errorDiv = document.createElement('div');
    errorDiv.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--terminal-bg);
            border: 3px solid var(--terminal-error);
            padding: 30px;
            text-align: center;
            z-index: 9999;
            font-family: var(--font-mono);
            max-width: 90vw;
        ">
            <h2 style="color: var(--terminal-error); margin-bottom: 20px;">💥 КРИТИЧНА ПОМИЛКА</h2>
            <p style="color: вар(--terminal-text); margin-bottom: 20px;">
                Виникла критична помилка при завантаженні сайту.
            </p>
            <button onclick="location.reload()" style="
                background: вар(--terminal-error);
                color: вар(--terminal-bg);
                border: none;
                padding: 10px 20px;
                font-family: вар(--font-mono);
                cursor: pointer;
            ">ПЕРЕЗАВАНТАЖИТИ СТОРІНКУ</button>
        </div>
    `;
    document.body.appendChild(errorDiv);
}

// ================================
// ІСНУЮЧІ ФУНКЦІЇ (ОНОВЛЕНІ)
// ================================

// [Тут залишаються всі існуючі функції з попередньої версії, 
//  але з покращеннями та оптимізаціями]

function getCachedProducts() {
    try {
        const cachedData = localStorage.getItem(CONFIG.CACHE_KEY);
        const cachedTimestamp = localStorage.getItem(CONFIG.CACHE_TIMESTAMP_KEY);
        
        if (!cachedData || !cachedTimestamp) {
            return null;
        }

        const timestamp = parseInt(cachedTimestamp, 10);
        const age = Date.now() - timestamp;

        if (age > CONFIG.CACHE_DURATION) {
            clearCache();
            return null;
        }

        return JSON.parse(cachedData);
    } catch (error) {
        logger.error('💾 Cache error:', error);
        clearCache();
        return null;
    }
}

function cacheProducts(products) {
    try {
        localStorage.setItem(CONFIG.CACHE_KEY, JSON.stringify(products));
        localStorage.setItem(CONFIG.CACHE_TIMESTAMP_KEY, Date.now().toString());
        logger.log('💾 Products cached:', products.length, 'items');
    } catch (error) {
        logger.error('💾 Cache save error:', error);
    }
}

function clearCache() {
    try {
        localStorage.removeItem(CONFIG.CACHE_KEY);
        localStorage.removeItem(CONFIG.CACHE_TIMESTAMP_KEY);
        logger.log('🗑️ Cache cleared');
    } catch (error) {
        logger.error('🗑️ Cache clear error:', error);
    }
}

async function loadProductsFromAPI() {
    const allItems = [];
    
    for (const query of CONFIG.SEARCH_QUERIES) {
        try {
            logger.log(`🔍 Searching: ${query}`);
            const items = await searchEbayItems(query);
            
            if (items && items.length > 0) {
                allItems.push(...items.slice(0, 3));
            }
            
            if (CONFIG.API_DELAY > 0) {
                await sleep(CONFIG.API_DELAY);
            }
        } catch (error) {
            logger.warn(`⚠️ Search failed for "${query}":`, error.message);
        }
    }
    
    return allItems.slice(0, CONFIG.MAX_PRODUCTS);
}

async function searchEbayItems(keywords) {
    const encodedKeywords = encodeURIComponent(keywords);
    const url = `/.netlify/functions/searchEbay?keywords=${encodedKeywords}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data.items || [];
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

function displayProducts(container, items, source = 'unknown') {
    container.innerHTML = '';
    
    if (source === 'fallback') {
        const indicator = document.createElement('div');
        indicator.className = 'source-indicator';
        indicator.innerHTML = `
            <div class="demo-notice">
                🎭 ДЕМОНСТРАЦІЙНИЙ РЕЖИМ | Показані зразкові товари
            </div>
        `;
        container.appendChild(indicator);
    }
    
    const itemsToDisplay = items.slice(0, CONFIG.MAX_PRODUCTS);
    itemsToDisplay.forEach((item, index) => {
        const card = createProductCard(item, index, source);
        container.appendChild(card);
    });
    
    animateProductCards(container);
    logger.log(`✅ Displayed ${itemsToDisplay.length} products from ${source}`);
}

/**
 * Створює картку товару з оптимізованими зображеннями
 * @param {Object} item - Об'єкт товару
 * @param {number} index - Індекс товару
 * @param {string} source - Джерело даних ('api', 'cache', 'fallback')
 * @returns {HTMLElement} DOM елемент картки товару
 */
function createProductCard(item, index, source) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.opacity = '0';
    
    const category = determineCategory(item.title);
    const safePrice = sanitizePrice(item.currentPrice);
    const shortDescription = createShortDescription(item.title, item.condition);
    const demoIndicator = source === 'fallback' ? '<div class="demo-badge">DEMO</div>' : '';
    
    // Генеруємо оптимізовані зображення з підтримкою AVIF/WebP/JPG
    const imageHTML = generateOptimizedImageHTML(item);
    
    card.innerHTML = `
        <div class="product-header">
            ┌─ ${category} ──────┐
        </div>
        <div class="product-content">
            ${demoIndicator}
            ${imageHTML}
            <h3>${truncateText(item.title, 50)}</h3>
            <div class="product-specs">
                ${shortDescription}
            </div>
            <div class="product-price">${safePrice}</div>
            <div class="product-location">📍 ${item.location || 'Невідомо'}</div>
            <a href="${item.viewItemURL}" target="_blank" rel="noopener noreferrer" class="product-link"
               aria-label="Переглянути товар: ${truncateText(item.title, 30)}">
                ${source === 'fallback' ? '[ДЕМО ТОВАР]' : '[ПЕРЕГЛЯНУТИ НА EBAY]'}
            </a>
        </div>
        <div class="product-footer">
            └───────────────────┘
        </div>
    `;
    
    return card;
}

/**
 * Генерує оптимізований HTML для зображень з підтримкою сучасних форматів
 * @param {Object} item - Об'єкт товару з URL зображень
 * @returns {string} HTML код з тегом <picture>
 */
function generateOptimizedImageHTML(item) {
    // Якщо немає зображення, повертаємо placeholder
    if (!item.galleryURL && !item.galleryURLJPG) {
        return `
            <div class="product-image-placeholder" role="img" aria-label="Зображення товару недоступне">
                <div class="placeholder-content">
                    <span class="placeholder-icon">🖼️</span>
                    <span class="placeholder-text">Зображення<br>недоступне</span>
                </div>
            </div>
        `;
    }
    
    // Визначаємо доступні формати зображень
    const imageAVIF = item.imageAVIF || (item.galleryURL ? item.galleryURL.replace(/\.(webp|jpg|jpeg)$/i, '.avif') : null);
    const imageWebP = item.galleryURL || (item.galleryURLJPG ? item.galleryURLJPG.replace(/\.(jpg|jpeg)$/i, '.webp') : null);
    const imageJPG = item.galleryURLJPG || item.galleryURL || '';
    
    // Alt text для accessibility
    const altText = item.imageAlt || `Зображення товару: ${truncateText(item.title, 40)}`;
    
    // Генеруємо <picture> елемент з підтримкою різних форматів
    return `
        <picture class="product-image-container">
            ${imageAVIF ? `<source srcset="${imageAVIF}" type="image/avif">` : ''}
            ${imageWebP ? `<source srcset="${imageWebP}" type="image/webp">` : ''}
            <img src="${imageJPG}" 
                 alt="${altText}"
                 class="product-image" 
                 loading="lazy"
                 decoding="async"
                 width="300"
                 height="200"
                 onerror="this.style.display='none'; this.parentElement.classList.add('image-error');"
                 onload="this.parentElement.classList.add('image-loaded');">
        </picture>
    `;
}

function animateProductCards(container) {
    const cards = container.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        }, index * 150);
    });
}

// Допоміжні функції залишаються без змін
function determineCategory(title) {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('8086')) return 'ПРОЦЕСОР 8086';
    if (titleLower.includes('8088')) return 'ПРОЦЕСОР 8088';
    if (titleLower.includes('8087')) return 'СПІВПРОЦЕСОР';
    if (titleLower.includes('sound') || titleLower.includes('audio')) return 'ЗВУКОВА КАРТА';
    if (titleLower.includes('motherboard')) return 'МАТЕРИНСЬКА ПЛАТА';
    if (titleLower.includes('graphics') || titleLower.includes('cga')) return 'ВІДЕОКАРТА';
    return 'РЕТРО КОМПОНЕНТ';
}

function createShortDescription(title, condition) {
    const specs = ['• Винтажний компонент', '• Колекційна цінність'];
    if (condition && condition !== 'Used') {
        specs.push(`• Стан: ${condition}`);
    }
    return specs.join('<br>');
}

function sanitizePrice(price) {
    if (!price || price === 'N/A') return 'Ціна за запитом';
    return price.replace(/USD\s*/, '$');
}

function truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) return text || '';
    return text.substring(0, maxLength - 3) + '...';
}

function showLoadingMessage(container) {
    container.innerHTML = `
        <div class="loading-message">
            <div class="loading-text">Завантаження товарів...</div>
            <div class="loading-cursor">C:\\RETRO-PC&gt;_</div>
        </div>
    `;
}

function showErrorMessage(container, message) {
    container.innerHTML = `
        <div class="error-message">
            <div class="error-icon">❌</div>
            <div class="error-text">${message}</div>
            <div class="error-suggestion">Спробуйте оновити сторінку або перевірте з'єднання</div>
            <button onclick="location.reload()" class="retry-button">[СПРОБУВАТИ ЗНОВУ]</button>
        </div>
    `;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ================================
// ГЛОБАЛЬНІ УТИЛІТИ ДЛЯ РОЗРОБКИ
// ================================

window.retroPCStore = {
    // Основні функції
    clearCache,
    getCachedProducts,
    refreshProducts,
    
    // Тема
    toggleTheme,
    getCurrentTheme: () => currentTheme,
    
    // Налаштування
    getSettings: () => JSON.parse(localStorage.getItem(CONFIG.SETTINGS_KEY) || '{}'),
    clearSettings: () => localStorage.removeItem(CONFIG.SETTINGS_KEY),
    
    // Debug функції
    showNotification,
    trackEvent,
    
    // Інформація
    version: '2.0.0',
    config: CONFIG,
    isInitialized: () => isInitialized
};

logger.log('📝 Retro-PC Store Enhanced v2.0 loaded');
logger.log('🛠️ Debug utilities: window.retroPCStore');
logger.log('⌨️ Shortcuts: Alt+T (theme), Alt+H (shop), Alt+W (wiki), Alt+R (refresh)');