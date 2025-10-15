/**
 * RETRO-PC STORE v3.3.1 - Main JavaScript
 * Статический сайт для GitHub Pages / локального использования
 * Без серверных зависимостей
 */

(function() {
    'use strict';

    // Debug Mode (установить false для production)
    const DEBUG = false;
    const log = DEBUG ? console.log.bind(console) : () => {};

    log('🎮 RETRO-PC STORE v3.3.1 - Initializing...');

    // ================================
    // ГЛОБАЛЬНЫЙ ОБЪЕКТ ПРИЛОЖЕНИЯ
    // ================================
    window.retroApp = {
        version: '3.3.1',
        debug: DEBUG,
        mode: 'static',
        initialized: false,
        products: [],
        
        /**
         * Инициализация приложения
         */
        init: function() {
            log('⚡ Initializing Retro-PC Store...');
            
            // Загружаем демо-данные
            this.loadDemoProducts();
            
            // Настраиваем переключатель темы
            this.setupThemeToggle();
            
            // Настраиваем модальное окно wiki
            this.setupWikiModal();
            
            // Обработчики событий
            this.setupEventListeners();
            
            this.initialized = true;
            log('✅ Retro-PC Store initialized successfully!');
            log('📦 Products loaded:', this.products.length);
        },

        /**
         * Загружаем демонстрационные товары из fallback-data.js
         */
        loadDemoProducts: function() {
            log('📦 Loading demo products...');
            
            // Используем fallbackProducts из fallback-data.js
            if (window.fallbackProducts && window.fallbackProducts.length > 0) {
                this.products = window.fallbackProducts;
                log('✅ Loaded', this.products.length, 'products from fallback data');
                this.renderProducts(this.products);
            } else {
                console.warn('⚠️ No fallback products found, loading inline demo data');
                this.loadInlineDemoProducts();
            }
        },

        /**
         * Резервные демо-данные на случай если fallback-data.js не загрузился
         */
        loadInlineDemoProducts: function() {
            this.products = [
                {
                    id: 'intel-8086',
                    title: "Intel 8086 CPU - Vintage 16-bit Processor (1978)",
                    currentPrice: "$89.99",
                    condition: "Used - Excellent",
                    location: "Silicon Valley, CA",
                    brand: "Intel",
                    yearManufactured: "1978",
                    images: {
                        jpg: "assets/img/Intel_8086-2.jpg",
                        alt: "Микропроцессор Intel 8086 16-бит"
                    },
                    specifications: {
                        architecture: "x86 16-bit",
                        frequency: "5-10 MHz",
                        transistors: "29,000"
                    }
                },
                {
                    id: 'intel-8088',
                    title: "Intel 8088 CPU - IBM PC Compatible Processor",
                    currentPrice: "$75.50",
                    condition: "Used - Good",
                    location: "Austin, TX",
                    brand: "Intel",
                    yearManufactured: "1979",
                    images: {
                        jpg: "assets/img/Intel_8088-2.jpg",
                        alt: "Микропроцессор Intel 8088"
                    },
                    specifications: {
                        architecture: "x86 16-bit",
                        frequency: "4.77-8 MHz",
                        dataWidth: "16-bit internal, 8-bit external"
                    }
                },
                {
                    id: 'intel-8087',
                    title: "Intel 8087 Math Coprocessor FPU",
                    currentPrice: "$125.00",
                    condition: "Used - Very Good",
                    location: "Portland, OR",
                    brand: "Intel",
                    yearManufactured: "1980",
                    images: {
                        jpg: "assets/img/Intel_8087.jpg",
                        alt: "Intel 8087 сопроцессор"
                    },
                    specifications: {
                        architecture: "x87 FPU",
                        dataTypes: "32, 64, 80-bit floating point",
                        standards: "IEEE 754"
                    }
                }
            ];

            this.products = inlineProducts;
            log('✅ Loaded', this.products.length, 'inline demo products');
            this.renderProducts(this.products);
        },

        /**
         * Рендерим товары на странице
         */
        renderProducts: function(products) {
            const container = document.getElementById('products-container');
            if (!container) {
                console.error('❌ Products container not found!');
                return;
            }

            // Очищаем контейнер
            container.innerHTML = '';

            // Создаем карточки товаров
            const productsHTML = products.map(product => this.createProductCard(product)).join('');
            container.innerHTML = productsHTML;

            log('✅ Rendered', products.length, 'product cards');
        },

        /**
         * Создаем HTML карточку товара
         */
        createProductCard: function(product) {
            // Поддержка двух форматов данных
            const imageUrl = product.image || product.images?.jpg || product.images?.webp || product.images?.avif;
            const title = product.name || product.title;
            const price = product.price || product.currentPrice;
            const brand = product.brand || 'Intel';
            const year = product.year || product.yearManufactured;
            const imageAlt = product.images?.alt || title;
            
            // Генерируем HTML для изображения или placeholder
            let imageHTML;
            if (imageUrl) {
                imageHTML = `
                    <div class="product-image">
                        <img src="${imageUrl}" 
                             alt="${imageAlt}" 
                             loading="lazy"
                             onerror="this.parentElement.innerHTML = window.retroApp.createImagePlaceholder('${title}');">
                    </div>`;
            } else {
                imageHTML = this.createImagePlaceholder(title);
            }

            return `
                <article class="product-card" data-product-id="${product.id}">
                    ${imageHTML}
                    
                    <div class="product-info">
                        <h3 class="product-title">${title}</h3>
                        
                        <div class="product-meta">
                            <span class="product-brand">🏭 ${brand}</span>
                            <span class="product-year">📅 ${year}</span>
                        </div>
                        
                        <p class="product-description">${product.description || ''}</p>
                        
                        <div class="product-condition">
                            <span class="condition-badge">${product.condition || 'Unknown condition'}</span>
                        </div>
                        
                        <div class="product-footer">
                            <div class="product-price">${price}</div>
                        </div>
                        
                        <button class="product-button" onclick="window.retroApp.viewProduct('${product.id}')">
                            [ПРОСМОТР ДЕТАЛЬНО]
                        </button>
                    </div>
                </article>
            `;
        },

        /**
         * Форматируем ключи спецификаций
         */
        formatSpecKey: function(key) {
            return key
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase())
                .trim();
        },

        /**
         * Создаем HTML placeholder для отсутствующего изображения
         */
        createImagePlaceholder: function(title = 'Товар') {
            return `
                <div class="product-image-placeholder" role="img" aria-label="Изображение товара недоступно: ${title}">
                    <div class="placeholder-content">
                        <span class="placeholder-icon">🖼️</span>
                        <span class="placeholder-text">Изображение<br>недоступно</span>
                    </div>
                </div>
            `;
        },

        /**
         * Просмотр детальной информации о товаре
         */
        viewProduct: function(productId) {
            const product = this.products.find(p => p.id === productId);
            if (!product) {
                console.warn('⚠️ Product not found:', productId);
                return;
            }

            log('👁️ Viewing product:', product.title);
            
            // Формируем детальную информацию
            let specsHTML = '<div class="modal-specs">';
            if (product.specifications) {
                specsHTML += '<h4>📋 Технические характеристики:</h4><ul>';
                Object.entries(product.specifications).forEach(([key, value]) => {
                    specsHTML += `<li><strong>${this.formatSpecKey(key)}:</strong> ${value}</li>`;
                });
                specsHTML += '</ul>';
            }
            specsHTML += '</div>';

            const message = `
                <div class="product-detail-modal">
                    <h3>${product.title}</h3>
                    <div class="detail-meta">
                        <p><strong>🏭 Производитель:</strong> ${product.brand}</p>
                        <p><strong>📅 Год выпуска:</strong> ${product.yearManufactured}</p>
                        <p><strong>💰 Цена:</strong> ${product.currentPrice}</p>
                        <p><strong>📦 Состояние:</strong> ${product.condition}</p>
                        <p><strong>📍 Местоположение:</strong> ${product.location}</p>
                    </div>
                    ${specsHTML}
                    <p class="demo-notice">⚠️ Это демонстрационная версия. Товар недоступен для покупки.</p>
                </div>
            `;
            
            alert(message.replace(/<[^>]*>/g, '\n').replace(/\n+/g, '\n').trim());
        },

        /**
         * Настраиваем переключатель темы
         */
        setupThemeToggle: function() {
            const themeToggle = document.getElementById('theme-toggle');
            if (!themeToggle) return;

            // Загружаем сохраненную тему
            const savedTheme = localStorage.getItem('retro-theme') || 'green';
            this.setTheme(savedTheme);

            // Обработчик клика
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'green' ? 'amber' : 'green';
                this.setTheme(newTheme);
            });

            log('🎨 Theme toggle initialized');
        },

        /**
         * Устанавливаем тему
         */
        setTheme: function(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('retro-theme', theme);
            
            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) {
                themeToggle.textContent = theme === 'green' ? '[ЯНТАРНАЯ ТЕМА]' : '[ЗЕЛЕНАЯ ТЕМА]';
            }
            
            log('🎨 Theme set to:', theme);
        },

        /**
         * Настраиваем модальное окно Wiki
         */
        setupWikiModal: function() {
            const modal = document.getElementById('wiki-modal');
            if (!modal) return;

            // Закрытие по клику вне модального окна
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideWiki();
                }
            });

            // Закрытие по ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
                    this.hideWiki();
                }
            });

            log('📖 Wiki modal initialized');
        },

        /**
         * Показываем Wiki
         */
        showWiki: function() {
            const modal = document.getElementById('wiki-modal');
            if (modal) {
                modal.setAttribute('aria-hidden', 'false');
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                log('📖 Wiki opened');
            }
        },

        /**
         * Скрываем Wiki
         */
        hideWiki: function() {
            const modal = document.getElementById('wiki-modal');
            if (modal) {
                modal.setAttribute('aria-hidden', 'true');
                modal.style.display = 'none';
                document.body.style.overflow = '';
                log('📖 Wiki closed');
            }
        },

        /**
         * Настраиваем обработчики событий
         */
        setupEventListeners: function() {
            // Обработка ссылок "Skip to content"
            const skipLink = document.querySelector('.skip-link');
            if (skipLink) {
                skipLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.getElementById('main-content');
                    if (target) {
                        target.focus();
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            }

            log('🎯 Event listeners initialized');
        },

        /**
         * Получаем статус приложения
         */
        getAppStatus: function() {
            const status = {
                version: this.version,
                mode: this.mode,
                initialized: this.initialized,
                productsCount: this.products.length,
                theme: document.documentElement.getAttribute('data-theme'),
                timestamp: new Date().toISOString()
            };
            
            console.table(status);
            return status;
        }
    };

    // ================================
    // ГЛОБАЛЬНЫЕ ФУНКЦИИ
    // ================================

    /**
     * Показать Wiki (вызывается из HTML)
     */
    window.showWiki = function() {
        window.retroApp.showWiki();
    };

    /**
     * Скрыть Wiki (вызывается из HTML)
     */
    window.hideWiki = function() {
        window.retroApp.hideWiki();
    };

    /**
     * Переключение разделов Wiki (вызывается из HTML)
     */
    window.showWikiSection = function(sectionId) {
        // Скрываем все разделы
        const sections = document.querySelectorAll('.wiki-section');
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // Убираем активность со всех вкладок
        const tabs = document.querySelectorAll('.wiki-tab');
        tabs.forEach(tab => {
            tab.classList.remove('active');
        });

        // Показываем выбранный раздел
        const targetSection = document.getElementById(`wiki-${sectionId}`);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Активируем соответствующую вкладку
        const activeTab = Array.from(tabs).find(tab => 
            tab.getAttribute('onclick')?.includes(sectionId)
        );
        if (activeTab) {
            activeTab.classList.add('active');
        }

        log(`📖 Wiki section switched to: ${sectionId}`);
    };

    // ================================
    // ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ
    // ================================

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.retroApp.init();
        });
    } else {
        // DOM уже загружен
        window.retroApp.init();
    }

    log('🎮 Main script loaded, waiting for DOM...');

})();
