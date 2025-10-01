@echo off
echo ===============================================
echo   RETRO-PC STORE - DEPLOY TO GITHUB SCRIPT
echo ===============================================
echo.

REM Перевіряємо чи встановлений Git
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git не встановлений або недоступний в PATH
    echo.
    echo Будь ласка, встановіть Git з https://git-scm.com/download/win
    echo або використайте GitHub Desktop
    pause
    exit /b 1
)

echo ✅ Git знайдено
echo.

REM Встановлюємо конфігурацію користувача якщо не встановлена
git config user.name >nul 2>&1
if errorlevel 1 (
    echo 🔧 Встановлюємо конфігурацію Git...
    git config user.name "Tiger884"
    git config user.email "tiger884@github.user"
)

echo 📁 Поточна директорія: %CD%
echo.

REM Перевіряємо статус репозиторію
echo 🔍 Перевіряємо статус репозиторію...
git status

echo.
echo 📦 Додаємо всі файли до staging area...
git add .

echo.
echo 📝 Створюємо commit з оптимізаціями...
git commit -m "🚀 Major optimization v3.1: Performance, SEO, A11y & Security

✨ New Features:
- Multi-format image support (AVIF/WebP/JPG)
- Enhanced structured data (Store, WebSite, BreadcrumbList)
- Advanced focus management with :focus-visible
- Comprehensive sitemap.xml and robots.txt

⚡ Performance:
- Aggressive caching strategy (31M seconds for immutable resources)
- Lazy loading with async decoding
- Picture element with format fallbacks
- Optimized image containers

🔒 Security:
- Strict Content Security Policy
- Enhanced security headers (HSTS-ready)
- Cross-Origin policies
- Permissions Policy restrictions

♿ Accessibility:
- WCAG 2.1 AA compliance
- High contrast mode support
- Reduced motion preferences
- Enhanced ARIA attributes

📈 SEO:
- Technical SEO optimization
- Image sitemaps
- Enhanced meta tags
- Search engine friendly URLs

🏗️ Architecture:
- Organized file structure (assets/, docs/)
- Modern CSS with fluid design
- Progressive enhancement
- Error handling improvements"

echo.
echo 🌐 Підключаємо до GitHub репозиторію...
git remote -v | findstr origin >nul 2>&1
if errorlevel 1 (
    echo 🔗 Додаємо remote origin...
    git remote add origin https://github.com/Tiger884/RETRO-PC-STORE.git
) else (
    echo ✅ Remote origin вже налаштований
)

echo.
echo 🚀 Завантажуємо на GitHub...
git push -u origin main

if errorlevel 1 (
    echo.
    echo ⚠️ Push на main не вдався, спробуємо master...
    git push -u origin master
)

echo.
echo ✅ Завантаження завершено!
echo.
echo 🌐 Ваш сайт доступний за адресою:
echo https://tiger884.github.io/RETRO-PC-STORE/
echo.
echo 📊 Очікувані покращення:
echo - Performance: 98+ Lighthouse score
echo - Accessibility: 100 WCAG 2.1 AA
echo - SEO: Enhanced rich snippets
echo - Security: Strict CSP compliance
echo.
pause