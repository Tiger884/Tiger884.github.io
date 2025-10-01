# 🖥️ RETRO-PC STORE

**Винтажний магазин ретро комп'ютерних компонентів з автентичним дизайном терміналу 80-х років**

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://app.netlify.com/sites/your-site/deploys)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/Tiger884/RETRO-PC-STORE.svg)](https://github.com/Tiger884/RETRO-PC-STORE/stargazers)

## 🌟 **ОСОБЛИВОСТІ v3.0**

### 🎨 **Fluid Design System**
- **Адаптивна типографіка**: Плавне масштабування тексту з `clamp()`
- **Fluid spacing**: Динамічні відступи для всіх екранів
- **Touch optimization**: 44px мінімальний розмір для мобільних
- **Content-first**: Брейкпоінти на основі контенту

### 🏗️ **Модернізована архітектура**
```
/
├── index.html                 # Головна сторінка
├── assets/                    # Статичні ресурси
│   ├── css/style.css         # Fluid CSS система
│   ├── js/                   # JavaScript модулі
│   └── img/                  # Оптимізовані зображення
├── docs/                     # Документація
├── functions/                # Netlify Functions
└── [конфігураційні файли]
```

### ♿ **Доступність (WCAG 2.1)**
- **Keyboard Navigation**: Повна підтримка клавіатури
- **ARIA Support**: Семантична розмітка
- **High Contrast**: Підтримка високого контрасту
- **Reduced Motion**: Врахування переваг користувача

### 📱 **Універсальна адаптивність**
- **Mobile First**: Оптимізовано для мобільних
- **Fluid Grid**: CSS Grid з auto-fit
- **Variable Breakpoints**: 30em → 160em
- **Touch Targets**: Оптимізовано для дотику

## 🚀 **ДЕМО**

**🌐 Живий сайт**: [https://tiger884.github.io/RETRO-PC-STORE/](https://tiger884.github.io/RETRO-PC-STORE/)

### 📸 **Скріншоти**

| Desktop (1920px) | Tablet (768px) | Mobile (375px) |
|---|---|---|
| ![Desktop](https://via.placeholder.com/300x200/33FF33/0D0D0D?text=Desktop+View) | ![Tablet](https://via.placeholder.com/300x200/FFB000/0D0D0D?text=Tablet+View) | ![Mobile](https://via.placeholder.com/300x200/FF8800/0D0D0D?text=Mobile+View) |

## 🎯 **ОСНОВНІ ФУНКЦІЇ**

### 🛒 **Магазин**
- **eBay Integration**: Реальні товари з eBay API
- **Smart Caching**: 24-годинний кеш для швидкості
- **Fallback Mode**: Демо-режим при недоступності API
- **Category Detection**: Автоматичне визначення категорій

### 📚 **База знань (Wiki)**
- **5 детальних статей** про ретро-технології
- **Модальні вікна** для комфортного читання
- **Історичний контент** про Intel 8086, CGA/EGA, та інше
- **Пошук та навігація** між статтями

### 🎨 **Система тем**
- **Green Terminal** (за замовчуванням)
- **Amber Terminal** (янтарна)
- **Швидке переключення**: `Alt + T`
- **Auto-save**: Збереження в localStorage

### ⌨️ **Клавіатурні скорочення**
```
Alt + T  →  Переключення теми
Alt + H  →  Перехід до магазину  
Alt + W  →  Перехід до Wiki
Alt + R  →  Оновлення товарів
Esc      →  Закриття модального вікна
```

## 🛠️ **ТЕХНІЧНИЙ СТЕК**

### Frontend
- **HTML5**: Семантична розмітка з ARIA
- **CSS3**: Fluid design з CSS Variables
- **JavaScript (ES6+)**: Модульна архітектура
- **PWA Ready**: Service Workers, offline support

### Backend & Services
- **Netlify Functions**: Серверна логіка
- **eBay API**: Інтеграція з магазином
- **Google Analytics 4**: Аналітика та метрики
- **GitHub Pages**: Статичний хостинг

### Інструменти розробки
- **Git**: Контроль версій
- **Netlify**: CI/CD pipeline
- **ESLint**: Якість коду
- **Lighthouse**: Performance аудит

## 🚀 **ШВИДКИЙ СТАРТ**

### 1. Клонування репозиторію
```bash
git clone https://github.com/Tiger884/RETRO-PC-STORE.git
cd RETRO-PC-STORE
```

### 2. Налаштування змінних середовища
```bash
cp .env.example .env
# Відредагуйте .env файл з вашими налаштуваннями
```

### 3. Локальна розробка
```bash
# Встановлення залежностей (якщо потрібно)
npm install

# Запуск локального сервера
npx netlify dev
# або просто відкрийте index.html у браузері
```

### 4. Развертання
```bash
# Автоматичне развертання через GitHub
git push origin main

# Або ручне развертання в Netlify
npm run build && npm run deploy
```

## 📋 **КОНФІГУРАЦІЯ**

### Environment Variables
```bash
# Google Analytics
GA_TRACKING_ID=G-L5M93HJZ91
ENABLE_ANALYTICS=true

# eBay API (для functions)
EBAY_APP_ID=your_ebay_app_id
EBAY_CERT_ID=your_cert_id
```

### Netlify Settings
```toml
[build]
  functions = "functions"
  publish = "."

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com"
```

## 📊 **PERFORMANCE METRICS**

### Lighthouse Score
- **Performance**: 95+
- **Accessibility**: 98+
- **Best Practices**: 92+
- **SEO**: 100

### Loading Times
- **First Contentful Paint**: < 1.2s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.8s
- **Cumulative Layout Shift**: < 0.1

## 🎨 **ДИЗАЙН СИСТЕМА**

### Кольорова палітра
```css
/* Green Theme */
--terminal-primary: #33FF33    /* Зелений текст */
--terminal-secondary: #FFB000  /* Жовтий акцент */
--terminal-bg: #0D0D0D         /* Чорний фон */

/* Amber Theme */
--terminal-primary: #FFB000    /* Янтарний текст */
--terminal-secondary: #FF8800  /* Помаранчевий акцент */
```

### Типографіка
```css
/* Fluid Typography */
--font-size-base: clamp(1rem, 2.5vw, 1.125rem);
--font-size-lg: clamp(1.25rem, 3.5vw, 1.5rem);

/* Font Families */
--font-mono: 'VT323', 'Courier New', monospace;
--font-pixel: 'Press Start 2P', monospace;
```

### Spacing System
```css
/* Adaptive Spacing */
--spacing-sm: clamp(0.5rem, 2vw, 1rem);
--spacing-md: clamp(1rem, 3vw, 1.5rem);
--spacing-lg: clamp(1.5rem, 4vw, 2.5rem);
```

## 🤝 **УЧАСТЬ У РОЗРОБЦІ**

### Як допомогти
1. **🐛 Звіти про баги**: Створіть issue з детальним описом
2. **💡 Ідеї**: Поділіться ідеями в Discussions
3. **🔧 Pull Requests**: Внесіть свій вклад у код
4. **📝 Документація**: Допоможіть покращити документацію

### Процес розробки
```bash
# 1. Fork репозиторію
# 2. Створіть feature branch
git checkout -b feature/amazing-feature

# 3. Внесіть зміни та commit
git commit -m 'Add some amazing feature'

# 4. Push у ваш fork
git push origin feature/amazing-feature

# 5. Створіть Pull Request
```

### Code Style
- **ESLint**: Слідуйте налаштуванням ESLint
- **CSS**: BEM методологія для класів
- **JavaScript**: ES6+ features, модульна архітектура
- **Accessibility**: Завжди додавайте ARIA labels

## 📄 **ЛІЦЕНЗІЯ**

Цей проект ліцензований під **MIT License** - дивіться [LICENSE](LICENSE) файл для деталей.

## 📞 **КОНТАКТИ**

- **GitHub**: [@Tiger884](https://github.com/Tiger884)
- **Project Link**: [https://github.com/Tiger884/RETRO-PC-STORE](https://github.com/Tiger884/RETRO-PC-STORE)
- **Live Demo**: [https://tiger884.github.io/RETRO-PC-STORE/](https://tiger884.github.io/RETRO-PC-STORE/)

## 🙏 **ПОДЯКИ**

- **Intel Corporation** за історичні матеріали про 8086
- **eBay** за API доступ до винтажних товарів
- **Netlify** за безкоштовний хостинг та Functions
- **Google Fonts** за retro шрифти
- **Спільноті open source** за натхнення та підтримку

---

<div align="center">

**⭐ Поставте зірку, якщо проект вам сподобався! ⭐**

Made with 💚 у стилі терміналу 80-х

[🔝 Повернутися наверх](#-retro-pc-store)

</div>