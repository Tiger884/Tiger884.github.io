# 🚀 ДОРОЖНАЯ КАРТА РЕФАКТОРИНГА И ОПТИМИЗАЦИИ

**Проект:** RETRO-PC STORE v3.3.0 → v4.0.0  
**Дата:** 14 октября 2025  
**Цель:** Безопасная модернизация без поломок

---

## 🎯 СТРАТЕГИЯ РЕФАКТОРИНГА

### Принципы
1. ✅ **Incremental Changes** - маленькие безопасные шаги
2. ✅ **Test After Each Step** - тестирование после каждого изменения
3. ✅ **Backward Compatibility** - старая версия остается доступной
4. ✅ **Git Branching** - использование веток для изоляции изменений
5. ✅ **Documentation** - документирование каждого этапа

### Подход
```
Анализ → Планирование → Рефакторинг → Тестирование → Деплой
   ↓          ↓              ↓              ↓            ↓
  [✅]       [✅]        [В работе]     [Pending]    [Pending]
```

---

## 📋 ФАЗЫ РЕФАКТОРИНГА

### 🔷 ФАЗА 0: ПОДГОТОВКА (✅ Завершена)
**Длительность:** 1 день  
**Статус:** ✅ Выполнено

- [x] Создать полную архитектурную карту
- [x] Выявить все зависимости
- [x] Определить критические точки
- [x] Создать этот документ

---

### 🔷 ФАЗА 1: ИНФРАСТРУКТУРА И СБОРКА
**Длительность:** 2-3 дня  
**Приоритет:** 🔴 Критический  
**Статус:** ⏸️ Готов к запуску

#### Цели
- Настроить современный процесс сборки
- Автоматизировать минификацию
- Внедрить hot-reload для разработки

#### Задачи

##### 1.1 Настройка окружения
```bash
# Проверить Node.js версию
node --version  # Должно быть >= 18.0.0

# Установить зависимости
npm install

# Проверить установку
npm run dev  # Должен запуститься Vite
```

**Файлы для проверки:**
- ✅ `package.json` - уже настроен
- ✅ `vite.config.js` - уже настроен
- ⚠️ `.gitignore` - добавить если отсутствует

**Критерий успеха:**
```bash
npm run dev     # Запускается без ошибок на localhost:3000
npm run build   # Создается папка dist/
```

##### 1.2 Создание npm scripts
Добавить в `package.json`:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "format": "prettier --write .",
    "clean": "rm -rf dist node_modules",
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

##### 1.3 Настройка ESLint (опционально)
```bash
npm install --save-dev eslint @eslint/js
npx eslint --init
```

**Риски:** 🟡 Низкий  
**Откат:** Просто не использовать npm scripts, работать напрямую

---

### 🔷 ФАЗА 2: МОДУЛЯРИЗАЦИЯ CSS (SCSS)
**Длительность:** 3-4 дня  
**Приоритет:** 🟠 Высокий  
**Статус:** ⏸️ Ожидает Фазу 1

#### Цели
- Разбить монолитный CSS на логические модули
- Внедрить SCSS для переиспользования
- Устранить дублирование кода

#### Текущая проблема
```
assets/css/
├── main.css (основной файл, ~800 строк)
├── critical.css (дублирование?)
└── style.css (старый файл?)
```

#### Целевая структура
```
src/
  styles/
    main.scss                 # Главный файл (импорты)
    
    base/
      _reset.scss            # CSS reset
      _variables.scss        # Переменные и темы
      _typography.scss       # Типографика
      _animations.scss       # Анимации
    
    layout/
      _grid.scss             # Сеточная система
      _container.scss        # Контейнеры
      _spacing.scss          # Отступы
    
    components/
      _buttons.scss          # Кнопки
      _cards.scss            # Карточки товаров
      _modal.scss            # Модальные окна
      _navigation.scss       # Навигация
      _footer.scss           # Футер
      _loading.scss          # Анимации загрузки
    
    sections/
      _header.scss           # Шапка сайта
      _products.scss         # Секция товаров
      _wiki.scss             # Wiki модалка
    
    utilities/
      _accessibility.scss    # A11y утилиты
      _responsive.scss       # Медиа-запросы
      _print.scss           # Печать
```

#### Задачи

##### 2.1 Установка Sass
```bash
npm install --save-dev sass
```

##### 2.2 Миграция main.css → SCSS

**Шаг 1:** Создать структуру папок
```bash
mkdir -p src/styles/base
mkdir -p src/styles/layout
mkdir -p src/styles/components
mkdir -p src/styles/sections
mkdir -p src/styles/utilities
```

**Шаг 2:** Создать `_variables.scss`
```scss
// Темы
$themes: (
  green: (
    bg: #0D0D0D,
    primary: #33FF33,
    secondary: #00FF00,
    dim: #00AA00,
    glow: rgba(51, 255, 51, 0.5)
  ),
  amber: (
    bg: #0D0D0D,
    primary: #FFB000,
    secondary: #FFA500,
    dim: #CC8800,
    glow: rgba(255, 176, 0, 0.5)
  )
);

// Функция для получения цвета темы
@function theme-color($theme, $key) {
  @return map-get(map-get($themes, $theme), $key);
}

// Миксин для генерации CSS переменных
@mixin generate-theme($theme-name) {
  [data-theme="#{$theme-name}"] {
    --terminal-bg: #{theme-color($theme-name, bg)};
    --terminal-primary: #{theme-color($theme-name, primary)};
    --terminal-secondary: #{theme-color($theme-name, secondary)};
    --terminal-dim: #{theme-color($theme-name, dim)};
    --terminal-glow: #{theme-color($theme-name, glow)};
  }
}

// Генерация тем
@include generate-theme(green);
@include generate-theme(amber);

// Spacing
$spacing-xs: clamp(0.25rem, 1vw, 0.5rem);
$spacing-sm: clamp(0.5rem, 2vw, 1rem);
$spacing-md: clamp(1rem, 3vw, 1.5rem);
$spacing-lg: clamp(1.5rem, 4vw, 2.5rem);
$spacing-xl: clamp(2rem, 5vw, 3.5rem);

// Typography
$font-mono: 'VT323', 'Courier New', monospace;
$font-pixel: 'Press Start 2P', 'VT323', monospace;

// Breakpoints
$breakpoint-xs: 30em;   // 480px
$breakpoint-sm: 48em;   // 768px
$breakpoint-md: 64em;   // 1024px
$breakpoint-lg: 90em;   // 1440px
$breakpoint-xl: 160em;  // 2560px
```

**Шаг 3:** Извлечь компоненты
```scss
// components/_product-card.scss
.product-card {
  border: 2px solid var(--terminal-primary);
  background: rgba(13, 13, 13, 0.95);
  box-shadow: var(--glow-primary);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 0 20px var(--terminal-glow);
  }
  
  .product-image {
    width: 100%;
    height: 200px;
    background: #1a1a1a;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  
  // ... остальные стили карточки
}
```

**Шаг 4:** Создать `main.scss`
```scss
// Base
@import 'base/variables';
@import 'base/reset';
@import 'base/typography';
@import 'base/animations';

// Layout
@import 'layout/grid';
@import 'layout/container';
@import 'layout/spacing';

// Components
@import 'components/buttons';
@import 'components/cards';
@import 'components/modal';
@import 'components/navigation';
@import 'components/footer';
@import 'components/loading';

// Sections
@import 'sections/header';
@import 'sections/products';
@import 'sections/wiki';

// Utilities
@import 'utilities/accessibility';
@import 'utilities/responsive';
@import 'utilities/print';
```

**Шаг 5:** Обновить Vite config
```javascript
// vite.config.js
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/styles/base/_variables.scss";`
      }
    }
  }
});
```

**Шаг 6:** Обновить index.html
```html
<!-- Было -->
<link rel="stylesheet" href="assets/css/main.css">

<!-- Стало -->
<link rel="stylesheet" href="/src/styles/main.scss">
```

##### 2.3 Тестирование
```bash
# Запустить dev сервер
npm run dev

# Проверить:
# ✅ Стили загружаются
# ✅ Темы переключаются
# ✅ Адаптивность работает
# ✅ Нет визуальных регрессий
```

**Риски:** 🟡 Средний - возможны визуальные баги  
**Откат:** Git revert к предыдущему коммиту

---

### 🔷 ФАЗА 3: МОДУЛЯРИЗАЦИЯ JAVASCRIPT
**Длительность:** 4-5 дней  
**Приоритет:** 🔴 Критический  
**Статус:** ⏸️ Ожидает Фазу 2

#### Цели
- Разбить монолитный main.js на ES6 модули
- Улучшить читаемость и тестируемость
- Устранить глобальные переменные

#### Текущая проблема
```
assets/js/
├── main.js (~500 строк, монолит)
└── fallback-data.js (~800 строк, данные)
```

#### Целевая структура
```
src/
  js/
    main.js                    # Точка входа (минимальный)
    
    core/
      app.js                   # Главный класс приложения
      config.js                # Конфигурация
      constants.js             # Константы
    
    modules/
      theme-manager.js         # Управление темами
      product-renderer.js      # Рендеринг товаров
      modal-manager.js         # Модальные окна
      search-engine.js         # Поиск (новый)
      filter-engine.js         # Фильтрация (новый)
      event-bus.js            # Шина событий
    
    services/
      data-loader.js           # Загрузка данных
      storage-service.js       # localStorage/sessionStorage
      analytics-service.js     # Аналитика
    
    utils/
      dom-helpers.js           # DOM утилиты
      formatters.js            # Форматирование
      validators.js            # Валидация
    
    data/
      products.json            # Данные товаров (новый)
      wiki-content.json        # Контент Wiki (новый)
```

#### Задачи

##### 3.1 Создать базовую структуру

**Файл:** `src/js/core/config.js`
```javascript
/**
 * Конфигурация приложения
 */
export const APP_CONFIG = {
  version: '4.0.0',
  mode: 'static',
  api: {
    baseUrl: null, // Статический режим
    timeout: 5000
  },
  cache: {
    enabled: true,
    ttl: 3600000 // 1 час
  },
  theme: {
    default: 'green',
    storageKey: 'retro-theme'
  },
  products: {
    perPage: 12,
    enableSearch: true,
    enableFilter: true
  }
};

export const SELECTORS = {
  productsContainer: '#products-container',
  themeToggle: '#theme-toggle',
  wikiModal: '#wiki-modal',
  searchInput: '#search-input',
  categoryFilter: '#category-filter'
};

export const EVENTS = {
  THEME_CHANGED: 'theme:changed',
  PRODUCTS_LOADED: 'products:loaded',
  PRODUCT_CLICKED: 'product:clicked',
  SEARCH_QUERY: 'search:query',
  FILTER_APPLIED: 'filter:applied'
};
```

**Файл:** `src/js/modules/theme-manager.js`
```javascript
/**
 * Управление темами оформления
 */
import { APP_CONFIG, SELECTORS, EVENTS } from '../core/config.js';
import { EventBus } from './event-bus.js';
import { StorageService } from '../services/storage-service.js';

export class ThemeManager {
  constructor() {
    this.currentTheme = null;
    this.themeToggleBtn = null;
    this.storageService = new StorageService();
    this.eventBus = EventBus.getInstance();
  }

  /**
   * Инициализация
   */
  init() {
    console.log('🎨 ThemeManager: Initializing...');
    
    this.themeToggleBtn = document.querySelector(SELECTORS.themeToggle);
    if (!this.themeToggleBtn) {
      console.warn('⚠️ Theme toggle button not found');
      return;
    }

    // Загружаем сохраненную тему
    const savedTheme = this.storageService.get(APP_CONFIG.theme.storageKey);
    this.currentTheme = savedTheme || APP_CONFIG.theme.default;
    
    // Применяем тему
    this.applyTheme(this.currentTheme);
    
    // Настраиваем обработчик
    this.setupEventListeners();
    
    console.log('✅ ThemeManager: Initialized with theme:', this.currentTheme);
  }

  /**
   * Настройка обработчиков событий
   */
  setupEventListeners() {
    this.themeToggleBtn.addEventListener('click', () => {
      this.toggleTheme();
    });

    // Поддержка клавиатуры
    document.addEventListener('keydown', (e) => {
      if (e.altKey && e.key === 't') {
        e.preventDefault();
        this.toggleTheme();
      }
    });
  }

  /**
   * Переключение темы
   */
  toggleTheme() {
    const newTheme = this.currentTheme === 'green' ? 'amber' : 'green';
    this.setTheme(newTheme);
  }

  /**
   * Установка темы
   */
  setTheme(theme) {
    if (!['green', 'amber'].includes(theme)) {
      console.warn('⚠️ Invalid theme:', theme);
      return;
    }

    this.currentTheme = theme;
    this.applyTheme(theme);
    this.storageService.set(APP_CONFIG.theme.storageKey, theme);
    
    // Отправляем событие
    this.eventBus.emit(EVENTS.THEME_CHANGED, { theme });
    
    console.log('🎨 Theme changed to:', theme);
  }

  /**
   * Применение темы к DOM
   */
  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Обновляем текст кнопки
    if (this.themeToggleBtn) {
      const buttonText = theme === 'green' ? '[ЯНТАРНАЯ ТЕМА]' : '[ЗЕЛЕНАЯ ТЕМА]';
      this.themeToggleBtn.textContent = buttonText;
    }
  }

  /**
   * Получить текущую тему
   */
  getCurrentTheme() {
    return this.currentTheme;
  }
}
```

**Файл:** `src/js/modules/event-bus.js`
```javascript
/**
 * Шина событий для связи между модулями
 */
export class EventBus {
  static instance = null;

  constructor() {
    if (EventBus.instance) {
      return EventBus.instance;
    }
    
    this.events = new Map();
    EventBus.instance = this;
  }

  static getInstance() {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  /**
   * Подписка на событие
   */
  on(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    
    this.events.get(event).push(callback);
    
    // Возвращаем функцию отписки
    return () => this.off(event, callback);
  }

  /**
   * Отписка от события
   */
  off(event, callback) {
    if (!this.events.has(event)) return;
    
    const callbacks = this.events.get(event);
    const index = callbacks.indexOf(callback);
    
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  /**
   * Отправка события
   */
  emit(event, data) {
    if (!this.events.has(event)) return;
    
    const callbacks = this.events.get(event);
    callbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event handler for "${event}":`, error);
      }
    });
  }

  /**
   * Одноразовая подписка
   */
  once(event, callback) {
    const onceCallback = (data) => {
      callback(data);
      this.off(event, onceCallback);
    };
    
    this.on(event, onceCallback);
  }
}
```

**Файл:** `src/js/core/app.js`
```javascript
/**
 * Главный класс приложения
 */
import { APP_CONFIG, EVENTS } from './config.js';
import { ThemeManager } from '../modules/theme-manager.js';
import { ProductRenderer } from '../modules/product-renderer.js';
import { ModalManager } from '../modules/modal-manager.js';
import { DataLoader } from '../services/data-loader.js';
import { EventBus } from '../modules/event-bus.js';

export class RetroApp {
  constructor() {
    this.version = APP_CONFIG.version;
    this.initialized = false;
    this.products = [];
    
    // Модули
    this.themeManager = null;
    this.productRenderer = null;
    this.modalManager = null;
    this.dataLoader = null;
    this.eventBus = EventBus.getInstance();
  }

  /**
   * Инициализация приложения
   */
  async init() {
    console.log(`🎮 RETRO-PC STORE v${this.version} - Initializing...`);
    
    try {
      // Инициализируем модули
      this.themeManager = new ThemeManager();
      this.themeManager.init();
      
      this.modalManager = new ModalManager();
      this.modalManager.init();
      
      this.dataLoader = new DataLoader();
      this.productRenderer = new ProductRenderer();
      
      // Загружаем данные
      await this.loadData();
      
      // Настраиваем обработчики
      this.setupEventListeners();
      
      this.initialized = true;
      console.log('✅ RETRO-PC STORE initialized successfully!');
      console.log('📦 Products loaded:', this.products.length);
      
    } catch (error) {
      console.error('❌ Failed to initialize app:', error);
      this.showError('Ошибка инициализации приложения');
    }
  }

  /**
   * Загрузка данных
   */
  async loadData() {
    try {
      this.products = await this.dataLoader.loadProducts();
      this.productRenderer.renderProducts(this.products);
      
      this.eventBus.emit(EVENTS.PRODUCTS_LOADED, { 
        products: this.products 
      });
      
    } catch (error) {
      console.error('❌ Failed to load products:', error);
      // Fallback к встроенным данным
      this.loadFallbackData();
    }
  }

  /**
   * Загрузка резервных данных
   */
  loadFallbackData() {
    console.log('📦 Loading fallback data...');
    
    if (window.fallbackProducts) {
      this.products = window.fallbackProducts;
      this.productRenderer.renderProducts(this.products);
    } else {
      this.showError('Не удалось загрузить данные товаров');
    }
  }

  /**
   * Настройка обработчиков событий
   */
  setupEventListeners() {
    // Обработка событий от других модулей
    this.eventBus.on(EVENTS.PRODUCT_CLICKED, (data) => {
      this.handleProductClick(data);
    });
    
    this.eventBus.on(EVENTS.SEARCH_QUERY, (data) => {
      this.handleSearch(data);
    });
  }

  /**
   * Обработка клика по товару
   */
  handleProductClick(data) {
    const product = this.products.find(p => p.id === data.productId);
    if (product) {
      this.modalManager.showProductDetails(product);
    }
  }

  /**
   * Обработка поиска
   */
  handleSearch(data) {
    // Будет реализовано в SearchEngine
    console.log('Search query:', data.query);
  }

  /**
   * Показать ошибку
   */
  showError(message) {
    console.error('Error:', message);
    // TODO: Показать красивое сообщение об ошибке
  }

  /**
   * Получить статус приложения
   */
  getStatus() {
    return {
      version: this.version,
      initialized: this.initialized,
      productsCount: this.products.length,
      theme: this.themeManager?.getCurrentTheme(),
      timestamp: new Date().toISOString()
    };
  }
}
```

**Файл:** `src/js/main.js` (точка входа)
```javascript
/**
 * RETRO-PC STORE - Точка входа
 */
import { RetroApp } from './core/app.js';

// Создаем глобальный экземпляр приложения
window.retroApp = new RetroApp();

// Инициализируем при загрузке DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.retroApp.init();
  });
} else {
  window.retroApp.init();
}

// Для отладки
console.log('🎮 Main script loaded');
```

##### 3.2 Обновить index.html
```html
<!-- Было -->
<script src="assets/js/main.js"></script>
<script src="assets/js/fallback-data.js"></script>

<!-- Стало -->
<script type="module" src="/src/js/main.js"></script>
```

##### 3.3 Тестирование
```bash
npm run dev

# Проверить:
# ✅ Приложение инициализируется
# ✅ Темы переключаются
# ✅ Товары отображаются
# ✅ Модалки работают
# ✅ Нет ошибок в консоли
```

**Риски:** 🔴 Высокий - много изменений  
**Откат:** Git revert, поэтапные коммиты

---

### 🔷 ФАЗА 4: ОПТИМИЗАЦИЯ ДАННЫХ (JSON)
**Длительность:** 2 дня  
**Приоритет:** 🟠 Высокий  
**Статус:** ⏸️ Ожидает Фазу 3

#### Цели
- Вынести данные из JS в JSON файлы
- Упростить редактирование контента
- Подготовить к возможному API

#### Задачи

##### 4.1 Создать products.json
```javascript
// Конвертировать fallback-data.js → products.json
const products = window.fallbackProducts;
const json = JSON.stringify(products, null, 2);
fs.writeFileSync('src/data/products.json', json);
```

##### 4.2 Создать DataLoader
```javascript
// src/services/data-loader.js
export class DataLoader {
  async loadProducts() {
    try {
      const response = await fetch('/src/data/products.json');
      if (!response.ok) throw new Error('Failed to load products');
      return await response.json();
    } catch (error) {
      console.error('Failed to load products:', error);
      // Fallback к встроенным данным
      return window.fallbackProducts || [];
    }
  }
}
```

**Риски:** 🟢 Низкий  
**Откат:** Легко вернуться к fallback-data.js

---

### 🔷 ФАЗА 5: ОПТИМИЗАЦИЯ ИЗОБРАЖЕНИЙ
**Длительность:** 2-3 дня  
**Приоритет:** 🟡 Средний  
**Статус:** ⏸️ Ожидает Фазу 4

#### Цели
- Конвертировать JPG → WebP + AVIF
- Создать респонсивные версии
- Внедрить lazy loading

#### Задачи

##### 5.1 Конвертация форматов
```bash
# Установить sharp
npm install --save-dev sharp

# Создать скрипт конвертации
node scripts/convert-images.js
```

```javascript
// scripts/convert-images.js
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputDir = 'assets/img';
const outputDir = 'assets/img/optimized';

// Создать папку если не существует
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Получить все JPG файлы
const images = fs.readdirSync(inputDir)
  .filter(file => /\.(jpg|jpeg)$/i.test(file));

// Конвертировать каждое изображение
for (const image of images) {
  const inputPath = path.join(inputDir, image);
  const baseName = path.parse(image).name;
  
  console.log(`Converting ${image}...`);
  
  // WebP
  await sharp(inputPath)
    .webp({ quality: 85 })
    .toFile(path.join(outputDir, `${baseName}.webp`));
  
  // AVIF
  await sharp(inputPath)
    .avif({ quality: 80 })
    .toFile(path.join(outputDir, `${baseName}.avif`));
  
  // Копировать оригинал как fallback
  fs.copyFileSync(inputPath, path.join(outputDir, image));
  
  console.log(`✅ ${baseName} converted`);
}

console.log('🎉 All images converted!');
```

##### 5.2 Обновить рендеринг
```javascript
// product-renderer.js
createProductImage(product) {
  const { images } = product;
  
  return `
    <picture class="product-image">
      <source srcset="${images.avif}" type="image/avif">
      <source srcset="${images.webp}" type="image/webp">
      <img src="${images.jpg}" 
           alt="${images.alt}"
           loading="lazy"
           decoding="async">
    </picture>
  `;
}
```

**Риски:** 🟢 Низкий  
**Откат:** Использовать только JPG

---

### 🔷 ФАЗА 6: ФУНКЦИОНАЛЬНОСТЬ (Поиск/Фильтрация)
**Длительность:** 3-4 дня  
**Приоритет:** 🟡 Средний  
**Статус:** ⏸️ Ожидает Фазу 5

#### Цели
- Добавить живой поиск
- Реализовать фильтры по категориям
- Добавить сортировку

#### UI компоненты
```html
<div class="controls-panel">
  <input type="search" 
         id="search-input" 
         placeholder="Поиск товаров..."
         aria-label="Поиск по каталогу">
  
  <select id="category-filter" aria-label="Фильтр по категории">
    <option value="">Все категории</option>
    <option value="processors">Процессоры</option>
    <option value="graphics">Графика</option>
    <option value="sound">Звуковые карты</option>
  </select>
  
  <select id="sort-by" aria-label="Сортировка">
    <option value="default">По умолчанию</option>
    <option value="price-asc">Сначала дешевые</option>
    <option value="price-desc">Сначала дорогие</option>
    <option value="year">По году</option>
  </select>
</div>
```

##### 6.1 SearchEngine модуль
```javascript
// src/modules/search-engine.js
export class SearchEngine {
  constructor(products) {
    this.products = products;
    this.searchIndex = this.buildSearchIndex();
  }

  buildSearchIndex() {
    return this.products.map(product => ({
      id: product.id,
      searchableText: [
        product.title,
        product.brand,
        product.seoMetadata.description,
        ...product.seoMetadata.keywords,
        ...Object.values(product.specifications || {})
      ].join(' ').toLowerCase()
    }));
  }

  search(query) {
    if (!query || query.length < 2) {
      return this.products;
    }

    const normalizedQuery = query.toLowerCase();
    
    const matchingIds = this.searchIndex
      .filter(item => item.searchableText.includes(normalizedQuery))
      .map(item => item.id);

    return this.products.filter(p => matchingIds.includes(p.id));
  }
}
```

**Риски:** 🟡 Средний  
**Откат:** Убрать UI, функция остается опциональной

---

### 🔷 ФАЗА 7: PWA АКТИВАЦИЯ
**Длительность:** 2 дня  
**Приоритет:** 🟡 Средний  
**Статус:** ⏸️ Ожидает Фазу 6

#### Цели
- Активировать Service Worker
- Настроить кеширование
- Тестировать offline режим

#### Задачи

##### 7.1 Раскомментировать регистрацию
```html
<!-- index.html -->
<script>
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('✅ SW registered:', reg.scope))
      .catch(err => console.log('❌ SW registration failed:', err));
  });
}
</script>
```

##### 7.2 Обновить sw.js
```javascript
// Обновить версию кеша
const CACHE_VERSION = 'retro-pc-store-v4.0.0';

// Обновить список кешируемых ресурсов
const CORE_CACHE_RESOURCES = [
  './',
  '/index.html',
  '/src/styles/main.scss', // Теперь компилируется в CSS
  '/src/js/main.js',
  '/src/data/products.json',
  // ... остальные
];
```

##### 7.3 Тестирование
```bash
# Собрать production build
npm run build

# Запустить preview
npm run preview

# Открыть DevTools → Application → Service Workers
# Проверить:
# ✅ SW зарегистрирован
# ✅ Кеши создаются
# ✅ Offline режим работает
```

**Риски:** 🟡 Средний  
**Откат:** Закомментировать обратно

---

### 🔷 ФАЗА 8: ФИНАЛЬНАЯ ОПТИМИЗАЦИЯ
**Длительность:** 2-3 дня  
**Приоритет:** 🟢 Низкий  
**Статус:** ⏸️ Ожидает Фазу 7

#### Цели
- Оптимизировать bundle size
- Улучшить Core Web Vitals
- Достичь Lighthouse 100/100

#### Задачи

##### 8.1 Code Splitting
```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['workbox-window'],
          'product-data': ['/src/data/products.json'],
          'theme': ['/src/modules/theme-manager.js']
        }
      }
    }
  }
});
```

##### 8.2 Preload критичных ресурсов
```html
<link rel="preload" href="/src/styles/main.scss" as="style">
<link rel="preload" href="/src/js/main.js" as="script" crossorigin>
```

##### 8.3 Resource Hints
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="https://fonts.gstatic.com">
```

---

## 📊 МЕТРИКИ УСПЕХА

### До рефакторинга
```
Lighthouse Score: 95
Bundle Size: ~150KB
LCP: ~1.2s
Code Modularity: Монолит
PWA Score: 0 (отключен)
```

### После рефакторинга (цели)
```
Lighthouse Score: 100/100 ✅
Bundle Size: <50KB (gzipped) ✅
LCP: <1.0s ✅
Code Modularity: ES6 модули ✅
PWA Score: 100 ✅
```

---

## 🔄 ПРОЦЕСС РАБОТЫ

### Git стратегия
```bash
# Создать ветку для каждой фазы
git checkout -b refactor/phase-1-infrastructure
# ... работа ...
git commit -m "Phase 1: Setup Vite and build tools"
git push origin refactor/phase-1-infrastructure
# Создать PR, ревью, merge

git checkout -b refactor/phase-2-scss
# ... и так далее
```

### Тестирование на каждом этапе
1. ✅ Visual regression testing (скриншоты до/после)
2. ✅ Функциональное тестирование (все фичи работают)
3. ✅ Performance testing (Lighthouse)
4. ✅ Accessibility testing (axe DevTools)

---

## ⚠️ РИСКИ И МИТИГАЦИЯ

| Риск | Вероятность | Воздействие | Митигация |
|------|-------------|-------------|-----------|
| Визуальные регрессии при SCSS миграции | Средняя | Высокое | Скриншот-тестирование, поэтапный подход |
| Поломка функциональности при модуляризации JS | Высокая | Критичное | Частые коммиты, откат через Git |
| Проблемы с Service Worker | Средняя | Среднее | Тщательное тестирование, fallback сценарии |
| Увеличение bundle size | Низкая | Среднее | Code splitting, tree shaking |
| Несовместимость старых браузеров | Низкая | Низкое | Legacy плагин Vite |

---

## ✅ ЧЕКЛИСТ ГОТОВНОСТИ

### Перед началом
- [x] Создана полная архитектурная карта
- [x] Сделан backup проекта
- [x] Создан Git репозиторий
- [x] Составлена эта дорожная карта

### Перед каждой фазой
- [ ] Создана Git ветка
- [ ] Изучена документация используемых инструментов
- [ ] Подготовлены тестовые сценарии

### После каждой фазы
- [ ] Проведено тестирование
- [ ] Сделаны скриншоты
- [ ] Обновлена документация
- [ ] Создан Git commit/PR

---

## 🎉 РЕЗУЛЬТАТ

После выполнения всех фаз получим:

✅ **Современная архитектура** - модульный, тестируемый код  
✅ **Высокая производительность** - Lighthouse 100/100  
✅ **Удобство разработки** - hot-reload, dev tools  
✅ **Легкость поддержки** - логичная структура, документация  
✅ **PWA функциональность** - offline режим, установка  
✅ **SEO оптимизация** - structured data, sitemap  
✅ **Accessibility** - WCAG 2.1 AA соответствие  

---

**🚀 Готово к началу рефакторинга!**
