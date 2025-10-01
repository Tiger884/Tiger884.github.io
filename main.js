/**
 * Модернізований JavaScript для Retro-PC Store
 * Підтримує кешування та резервне відображення даних (fallback)
 * 
 * Алгоритм роботи:
 * 1. Перевірка кешу в localStorage
 * 2. Якщо кеш валідний - показуємо дані з кешу
 * 3. Якщо кеш застарів - запитуємо eBay API
 * 4. При успіху - показуємо і кешуємо дані
 * 5. При помилці - показуємо fallback дані (без повідомлення про помилку)
 */

// ================================
// КОНФІГУРАЦІЯ СИСТЕМИ
// ================================

const CONFIG = {
    // Час життя кешу (24 години)
    CACHE_DURATION: 24 * 60 * 60 * 1000,
    
    // Ключ для зберігання в localStorage
    CACHE_KEY: 'retropc_products_cache',
    CACHE_TIMESTAMP_KEY: 'retropc_products_timestamp',
    
    // Пошукові запити для eBay
    SEARCH_QUERIES: [
        'Intel 8086 CPU processor',
        'Intel 8088 CPU processor', 
        'Intel 8087 math coprocessor'
    ],
    
    // Максимальна кількість товарів для відображення
    MAX_PRODUCTS: 9,
    
    // Затримка між запитами до API (мс)
    API_DELAY: 500
};

// ================================
// ГОЛОВНА ФУНКЦІЯ ІНІЦІАЛІЗАЦІЇ
// ================================

document.addEventListener('DOMContentLoaded', async function() {
    console.log('🖥️ Retro-PC Store initializing with enhanced reliability...');
    
    const productsContainer = document.getElementById('products-container');
    if (!productsContainer) {
        console.error('❌ Products container not found!');
        return;
    }

    // Показуємо повідомлення про завантаження
    showLoadingMessage(productsContainer);

    try {
        // КРОК 1: Перевіряємо кеш
        const cachedData = getCachedProducts();
        if (cachedData && cachedData.length > 0) {
            console.log('✅ Using cached data:', cachedData.length, 'products');
            displayProducts(productsContainer, cachedData, 'cache');
            return; // Припиняємо виконання - використовуємо кеш
        }

        // КРОК 2: Кеш порожній або застарів - завантажуємо з API
        console.log('🔍 Cache empty or expired, fetching from eBay API...');
        const apiProducts = await loadProductsFromAPI();
        
        if (apiProducts && apiProducts.length > 0) {
            // КРОК 3: Успішно завантажили з API
            console.log('✅ Successfully loaded from API:', apiProducts.length, 'products');
            displayProducts(productsContainer, apiProducts, 'api');
            cacheProducts(apiProducts); // Зберігаємо в кеш
        } else {
            // КРОК 4: API повернув порожній результат - використовуємо fallback
            console.log('⚠️ API returned empty results, using fallback data');
            useFallbackData(productsContainer);
        }

    } catch (error) {
        // КРОК 5: Будь-яка помилка API - використовуємо fallback без показу помилки
        console.log('⚠️ API error occurred, gracefully falling back to demo data:', error.message);
        useFallbackData(productsContainer);
    }
});

// ================================
// ФУНКЦІЇ РОБОТИ З КЕШЕМ
// ================================

/**
 * Отримує товари з кешу, якщо вони не застаріли
 * @returns {Array|null} масив товарів або null
 */
function getCachedProducts() {
    try {
        const cachedData = localStorage.getItem(CONFIG.CACHE_KEY);
        const cachedTimestamp = localStorage.getItem(CONFIG.CACHE_TIMESTAMP_KEY);
        
        if (!cachedData || !cachedTimestamp) {
            console.log('💾 No cached data found');
            return null;
        }

        const timestamp = parseInt(cachedTimestamp, 10);
        const now = Date.now();
        const age = now - timestamp;

        if (age > CONFIG.CACHE_DURATION) {
            console.log('💾 Cached data expired (age:', Math.round(age / 1000 / 60), 'minutes)');
            clearCache(); // Очищуємо застарілий кеш
            return null;
        }

        const products = JSON.parse(cachedData);
        console.log('💾 Found valid cached data (age:', Math.round(age / 1000 / 60), 'minutes)');
        return products;

    } catch (error) {
        console.error('💾 Error reading cache:', error);
        clearCache(); // Очищуємо пошкоджений кеш
        return null;
    }
}

/**
 * Зберігає товари в кеш
 * @param {Array} products - масив товарів для збереження
 */
function cacheProducts(products) {
    try {
        localStorage.setItem(CONFIG.CACHE_KEY, JSON.stringify(products));
        localStorage.setItem(CONFIG.CACHE_TIMESTAMP_KEY, Date.now().toString());
        console.log('💾 Products cached successfully:', products.length, 'items');
    } catch (error) {
        console.error('💾 Error caching products:', error);
        // Не критично - продовжуємо роботу
    }
}

/**
 * Очищує кеш
 */
function clearCache() {
    try {
        localStorage.removeItem(CONFIG.CACHE_KEY);
        localStorage.removeItem(CONFIG.CACHE_TIMESTAMP_KEY);
        console.log('💾 Cache cleared');
    } catch (error) {
        console.error('💾 Error clearing cache:', error);
    }
}

// ================================
// ФУНКЦІЇ ЗАВАНТАЖЕННЯ ДАНИХ
// ================================

/**
 * Завантажує товари з eBay API
 * @returns {Promise<Array>} масив товарів
 */
async function loadProductsFromAPI() {
    const allItems = [];
    
    for (const query of CONFIG.SEARCH_QUERIES) {
        try {
            console.log(`🔍 Searching eBay for: ${query}`);
            const items = await searchEbayItems(query);
            
            if (items && items.length > 0) {
                allItems.push(...items.slice(0, 4)); // Максимум 4 з кожної категорії
            }
            
            // Затримка між запитами
            if (CONFIG.API_DELAY > 0) {
                await sleep(CONFIG.API_DELAY);
            }
            
        } catch (error) {
            console.warn(`⚠️ Failed to search for "${query}":`, error.message);
            // Продовжуємо з наступним запитом
        }
    }
    
    return allItems.slice(0, CONFIG.MAX_PRODUCTS);
}

/**
 * Виконує пошук товарів через серверну функцію
 * @param {string} keywords - ключові слова для пошуку
 * @returns {Promise<Array>} масив товарів
 */
async function searchEbayItems(keywords) {
    const encodedKeywords = encodeURIComponent(keywords);
    const url = `/.netlify/functions/searchEbay?keywords=${encodedKeywords}`;
    
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
        // Таймаут 10 секунд
        signal: AbortSignal.timeout(10000)
    });
    
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
        throw new Error(data.message || 'API Error');
    }
    
    return data.items || [];
}

/**
 * Використовує резервні дані при недоступності API
 * @param {HTMLElement} container - контейнер для товарів
 */
function useFallbackData(container) {
    // Перевіряємо наявність fallback даних
    if (!window.fallbackProducts || !Array.isArray(window.fallbackProducts)) {
        console.error('❌ Fallback data not available!');
        showErrorMessage(container, 'Сервіс тимчасово недоступний');
        return;
    }

    // Отримуємо випадкові товари з fallback даних
    const fallbackItems = window.getRandomFallbackProducts 
        ? window.getRandomFallbackProducts(CONFIG.MAX_PRODUCTS)
        : window.fallbackProducts.slice(0, CONFIG.MAX_PRODUCTS);

    console.log('🎭 Using fallback data:', fallbackItems.length, 'demo products');
    displayProducts(container, fallbackItems, 'fallback');
}

// ================================
// ФУНКЦІЇ ВІДОБРАЖЕННЯ
// ================================

/**
 * Відображає товари в контейнері
 * @param {HTMLElement} container - контейнер для товарів
 * @param {Array} items - масив товарів
 * @param {string} source - джерело даних ('cache', 'api', 'fallback')
 */
function displayProducts(container, items, source = 'unknown') {
    // Очищуємо контейнер
    container.innerHTML = '';
    
    // Додаємо індикатор джерела даних (тільки в режимі розробки)
    if (source === 'fallback') {
        const sourceIndicator = document.createElement('div');
        sourceIndicator.className = 'source-indicator';
        sourceIndicator.innerHTML = `
            <div class="demo-notice">
                🎭 ДЕМОНСТРАЦІЙНИЙ РЕЖИМ | Показані зразкові товари
            </div>
        `;
        container.appendChild(sourceIndicator);
    }
    
    // Створюємо карточки товарів
    const itemsToDisplay = items.slice(0, CONFIG.MAX_PRODUCTS);
    itemsToDisplay.forEach((item, index) => {
        const productCard = createProductCard(item, index, source);
        container.appendChild(productCard);
    });
    
    // Додаємо анімацію появи
    animateProductCards(container);
    
    console.log(`✅ Displayed ${itemsToDisplay.length} products from ${source}`);
}

/**
 * Створює HTML елемент карточки товару
 * @param {Object} item - дані товару
 * @param {number} index - індекс товару
 * @param {string} source - джерело даних
 * @returns {HTMLElement} елемент карточки
 */
function createProductCard(item, index, source) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.opacity = '0';
    
    // Визначаємо категорію товару для заголовка
    const category = determineCategory(item.title);
    
    // Створюємо безпечну ціну
    const safePrice = sanitizePrice(item.currentPrice);
    
    // Створюємо короткий опис
    const shortDescription = createShortDescription(item.title, item.condition);
    
    // Додаємо індикатор для fallback товарів
    const demoIndicator = source === 'fallback' ? '<div class="demo-badge">DEMO</div>' : '';
    
    card.innerHTML = `
        <div class="product-header">
            ┌─ ${category} ──────┐
        </div>
        <div class="product-content">
            ${demoIndicator}
            ${item.galleryURL ? `<img src="${item.galleryURL}" alt="${item.title}" class="product-image" loading="lazy" onerror="this.style.display='none'">` : ''}
            <h3>${truncateText(item.title, 40)}</h3>
            <div class="product-specs">
                ${shortDescription}
            </div>
            <div class="product-price">${safePrice}</div>
            <div class="product-location">📍 ${item.location || 'Unknown'}</div>
            <a href="${item.viewItemURL}" target="_blank" rel="noopener noreferrer" class="product-link">
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
 * Анімує появу карточок товарів
 * @param {HTMLElement} container - контейнер з карточками
 */
function animateProductCards(container) {
    const cards = container.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        }, index * 100);
    });
}

// ================================
// ДОПОМІЖНІ ФУНКЦІЇ
// ================================

/**
 * Визначає категорію товару за назвою
 * @param {string} title - назва товару
 * @returns {string} категорія
 */
function determineCategory(title) {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('8086')) return 'ПРОЦЕСОР 8086';
    if (titleLower.includes('8088')) return 'ПРОЦЕСОР 8088';
    if (titleLower.includes('8087')) return 'СПІВПРОЦЕСОР';
    if (titleLower.includes('cpu') || titleLower.includes('processor')) return 'ПРОЦЕСОР';
    if (titleLower.includes('motherboard') || titleLower.includes('mainboard')) return 'МАТЕРИНСЬКА ПЛАТА';
    if (titleLower.includes('video') || titleLower.includes('graphics') || titleLower.includes('cga')) return 'ВІДЕОКАРТА';
    
    return 'РЕТРО КОМПОНЕНТ';
}

/**
 * Створює короткий опис товару
 * @param {string} title - назва товару
 * @param {string} condition - стан товару
 * @returns {string} HTML опис
 */
function createShortDescription(title, condition) {
    const titleLower = title.toLowerCase();
    const specs = [];
    
    // Витягуємо технічну інформацію з назви
    if (titleLower.includes('mhz')) {
        const mhzMatch = title.match(/(\d+\.?\d*)\s*mhz/i);
        if (mhzMatch) specs.push(`• ${mhzMatch[1]} MHz`);
    }
    
    if (titleLower.includes('8086')) specs.push('• 16-біт архітектура');
    if (titleLower.includes('8088')) specs.push('• 8-біт шина даних');
    if (titleLower.includes('8087')) specs.push('• Математичний співпроцесор');
    
    if (titleLower.includes('vintage') || titleLower.includes('retro')) {
        specs.push('• Вінтажний компонент');
    }
    
    if (condition && condition !== 'Used') {
        specs.push(`• Стан: ${condition}`);
    } else {
        specs.push('• Вживаний стан');
    }
    
    // Якщо специфікації не знайдені, додаємо загальні
    if (specs.length === 0) {
        specs.push('• Ретро компонент');
        specs.push('• Колекційна цінність');
        specs.push('• Автентична деталь');
    }
    
    return specs.slice(0, 3).join('<br>');
}

/**
 * Безпечно обробляє ціну
 * @param {string} price - рядок з ціною
 * @returns {string} відформатована ціна
 */
function sanitizePrice(price) {
    if (!price || price === 'N/A') return 'Ціна за запитом';
    
    // Замінюємо USD на $
    const formattedPrice = price.replace(/USD\s*/, '$');
    
    return formattedPrice;
}

/**
 * Обрізає текст до вказаної довжини
 * @param {string} text - вихідний текст
 * @param {number} maxLength - максимальна довжина
 * @returns {string} обрізаний текст
 */
function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
}

/**
 * Показує повідомлення про завантаження
 * @param {HTMLElement} container - контейнер
 */
function showLoadingMessage(container) {
    container.innerHTML = `
        <div class="loading-message">
            <div class="loading-text">Завантаження товарів...</div>
            <div class="loading-cursor">C:\\RETRO-PC&gt;_</div>
        </div>
    `;
}

/**
 * Показує повідомлення про помилку (використовується рідко)
 * @param {HTMLElement} container - контейнер
 * @param {string} message - текст помилки
 */
function showErrorMessage(container, message) {
    container.innerHTML = `
        <div class="error-message">
            <div class="error-icon">❌</div>
            <div class="error-text">${message}</div>
            <div class="error-suggestion">Спробуйте оновити сторінку пізніше</div>
            <button onclick="location.reload()" class="retry-button">[СПРОБУВАТИ ЗНОВУ]</button>
        </div>
    `;
}

/**
 * Допоміжна функція для затримки
 * @param {number} ms - мілісекунди
 * @returns {Promise} проміс
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ================================
// ОБРОБНИКИ ПОМИЛОК
// ================================

// Глобальний обробник помилок
window.addEventListener('error', function(event) {
    console.error('🚨 Global error:', event.error);
});

// Обробник необроблених промісів
window.addEventListener('unhandledrejection', function(event) {
    console.error('🚨 Unhandled promise rejection:', event.reason);
    event.preventDefault();
});

// ================================
// ДОДАТКОВІ УТИЛІТИ ДЛЯ АДМІНІСТРУВАННЯ
// ================================

// Функції для ручної роботи з кешем (доступні в консолі браузера)
window.retroPCStore = {
    clearCache: clearCache,
    getCachedProducts: getCachedProducts,
    useFallbackData: () => useFallbackData(document.getElementById('products-container')),
    reloadProducts: () => location.reload()
};

console.log('📝 Retro-PC Store enhanced main.js loaded successfully');
console.log('🛠️ Debug utilities available: window.retroPCStore');