# ═══════════════════════════════════════════════════════════════════
# 🧹 АВТОМАТИЧЕСКАЯ ОЧИСТКА ПРОЕКТА RETRO-PC STORE
# ═══════════════════════════════════════════════════════════════════
# Версия: 1.0
# Дата: 13 октября 2025 г.
# 
# Этот скрипт безопасно удаляет ненужные файлы из проекта
# ═══════════════════════════════════════════════════════════════════

# Цвета для вывода
$SuccessColor = "Green"
$WarningColor = "Yellow"
$ErrorColor = "Red"
$InfoColor = "Cyan"

# Получаем путь к проекту (папка где находится скрипт)
$ProjectPath = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor $InfoColor
Write-Host " 🧹 ОЧИСТКА ПРОЕКТА RETRO-PC STORE" -ForegroundColor $SuccessColor
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor $InfoColor
Write-Host ""
Write-Host "📁 Путь к проекту: $ProjectPath" -ForegroundColor $InfoColor
Write-Host ""

# ═══════════════════════════════════════════════════════════════════
# ШАГ 1: СОЗДАНИЕ РЕЗЕРВНОЙ КОПИИ
# ═══════════════════════════════════════════════════════════════════

Write-Host "📋 ШАГ 1: Создание резервной копии..." -ForegroundColor $InfoColor
$BackupPath = "$ProjectPath BACKUP $(Get-Date -Format 'yyyy-MM-dd_HH-mm')"

$createBackup = Read-Host "Создать резервную копию проекта? (y/n)"
if ($createBackup -eq "y") {
    try {
        Copy-Item -Path $ProjectPath -Destination $BackupPath -Recurse -Force
        Write-Host "✅ Резервная копия создана: $BackupPath" -ForegroundColor $SuccessColor
    }
    catch {
        Write-Host "❌ Ошибка создания резервной копии: $_" -ForegroundColor $ErrorColor
        Write-Host "⚠️ Очистка отменена для безопасности" -ForegroundColor $WarningColor
        exit
    }
}
else {
    Write-Host "⚠️ Резервная копия не создана. Продолжить на свой риск? (y/n)" -ForegroundColor $WarningColor
    $continue = Read-Host
    if ($continue -ne "y") {
        Write-Host "❌ Очистка отменена" -ForegroundColor $ErrorColor
        exit
    }
}

Write-Host ""

# ═══════════════════════════════════════════════════════════════════
# ШАГ 2: АНАЛИЗ ПРОЕКТА
# ═══════════════════════════════════════════════════════════════════

Write-Host "📋 ШАГ 2: Анализ проекта..." -ForegroundColor $InfoColor

# Подсчитываем файлы
$AllFiles = Get-ChildItem -Path $ProjectPath -Recurse -File
$EmptyFiles = $AllFiles | Where-Object { $_.Length -eq 0 }
$EmptyFolders = Get-ChildItem -Path $ProjectPath -Recurse -Directory | 
    Where-Object { (Get-ChildItem $_.FullName -Force).Count -eq 0 }

Write-Host "📊 Статистика:" -ForegroundColor $InfoColor
Write-Host "   Всего файлов: $($AllFiles.Count)" -ForegroundColor $InfoColor
Write-Host "   Пустых файлов: $($EmptyFiles.Count)" -ForegroundColor $WarningColor
Write-Host "   Пустых папок: $($EmptyFolders.Count)" -ForegroundColor $WarningColor
Write-Host ""

# ═══════════════════════════════════════════════════════════════════
# ШАГ 3: УДАЛЕНИЕ ПУСТЫХ ФАЙЛОВ
# ═══════════════════════════════════════════════════════════════════

Write-Host "📋 ШАГ 3: Удаление пустых файлов..." -ForegroundColor $InfoColor

if ($EmptyFiles.Count -eq 0) {
    Write-Host "✅ Пустых файлов не найдено" -ForegroundColor $SuccessColor
}
else {
    Write-Host "Найдено $($EmptyFiles.Count) пустых файлов:" -ForegroundColor $WarningColor
    $EmptyFiles | ForEach-Object {
        Write-Host "   - $($_.FullName.Replace($ProjectPath, '.'))" -ForegroundColor $WarningColor
    }
    
    $deleteEmpty = Read-Host "Удалить все пустые файлы? (y/n)"
    if ($deleteEmpty -eq "y") {
        $deletedCount = 0
        $EmptyFiles | ForEach-Object {
            try {
                Remove-Item $_.FullName -Force
                $deletedCount++
            }
            catch {
                Write-Host "❌ Ошибка удаления: $($_.Name)" -ForegroundColor $ErrorColor
            }
        }
        Write-Host "✅ Удалено файлов: $deletedCount" -ForegroundColor $SuccessColor
    }
}

Write-Host ""

# ═══════════════════════════════════════════════════════════════════
# ШАГ 4: УДАЛЕНИЕ СПЕЦИФИЧЕСКИХ ФАЙЛОВ
# ═══════════════════════════════════════════════════════════════════

Write-Host "📋 ШАГ 4: Удаление специфических файлов..." -ForegroundColor $InfoColor

# Список файлов для удаления (можно безопасно удалить)
$FilesToDelete = @(
    "test_simple.py",
    "test_site.py"
)

$deletedSpecific = 0
foreach ($file in $FilesToDelete) {
    $fullPath = Join-Path $ProjectPath $file
    if (Test-Path $fullPath) {
        Write-Host "   Найден: $file" -ForegroundColor $WarningColor
        $delete = Read-Host "Удалить $file? (y/n)"
        if ($delete -eq "y") {
            try {
                Remove-Item $fullPath -Force
                Write-Host "   ✅ Удалён: $file" -ForegroundColor $SuccessColor
                $deletedSpecific++
            }
            catch {
                Write-Host "   ❌ Ошибка удаления: $file" -ForegroundColor $ErrorColor
            }
        }
    }
}

if ($deletedSpecific -eq 0) {
    Write-Host "✅ Специфические файлы не найдены или не удалены" -ForegroundColor $SuccessColor
}

Write-Host ""

# ═══════════════════════════════════════════════════════════════════
# ШАГ 5: УДАЛЕНИЕ ПУСТЫХ ПАПОК
# ═══════════════════════════════════════════════════════════════════

Write-Host "📋 ШАГ 5: Удаление пустых папок..." -ForegroundColor $InfoColor

# Обновляем список пустых папок (после удаления файлов)
$EmptyFolders = Get-ChildItem -Path $ProjectPath -Recurse -Directory | 
    Where-Object { (Get-ChildItem $_.FullName -Force).Count -eq 0 }

if ($EmptyFolders.Count -eq 0) {
    Write-Host "✅ Пустых папок не найдено" -ForegroundColor $SuccessColor
}
else {
    Write-Host "Найдено $($EmptyFolders.Count) пустых папок:" -ForegroundColor $WarningColor
    $EmptyFolders | ForEach-Object {
        Write-Host "   - $($_.FullName.Replace($ProjectPath, '.'))" -ForegroundColor $WarningColor
    }
    
    $deleteFolders = Read-Host "Удалить все пустые папки? (y/n)"
    if ($deleteFolders -eq "y") {
        $deletedFolders = 0
        $EmptyFolders | ForEach-Object {
            try {
                Remove-Item $_.FullName -Force
                $deletedFolders++
            }
            catch {
                Write-Host "❌ Ошибка удаления: $($_.Name)" -ForegroundColor $ErrorColor
            }
        }
        Write-Host "✅ Удалено папок: $deletedFolders" -ForegroundColor $SuccessColor
    }
}

Write-Host ""

# ═══════════════════════════════════════════════════════════════════
# ШАГ 6: ПРОВЕРКА ДУБЛИКАТОВ CSS
# ═══════════════════════════════════════════════════════════════════

Write-Host "📋 ШАГ 6: Проверка дубликатов CSS..." -ForegroundColor $InfoColor

$mainCSS = Join-Path $ProjectPath "assets\css\main.css"
$styleCSS = Join-Path $ProjectPath "assets\css\style.css"

if ((Test-Path $mainCSS) -and (Test-Path $styleCSS)) {
    $mainSize = (Get-Item $mainCSS).Length
    $styleSize = (Get-Item $styleCSS).Length
    
    Write-Host "   main.css: $([math]::Round($mainSize/1KB, 2)) KB" -ForegroundColor $InfoColor
    Write-Host "   style.css: $([math]::Round($styleSize/1KB, 2)) KB" -ForegroundColor $InfoColor
    Write-Host ""
    Write-Host "⚠️ Найдено два CSS файла. Рекомендуется проверить вручную." -ForegroundColor $WarningColor
    Write-Host "   Если style.css не используется, его можно удалить." -ForegroundColor $WarningColor
    
    $checkCSS = Read-Host "Открыть оба файла для сравнения? (y/n)"
    if ($checkCSS -eq "y") {
        Start-Process "notepad.exe" -ArgumentList $mainCSS
        Start-Process "notepad.exe" -ArgumentList $styleCSS
        Write-Host "📝 Файлы открыты в Notepad для сравнения" -ForegroundColor $InfoColor
    }
}
else {
    Write-Host "✅ Дубликатов CSS не найдено" -ForegroundColor $SuccessColor
}

Write-Host ""

# ═══════════════════════════════════════════════════════════════════
# ФИНАЛЬНАЯ СТАТИСТИКА
# ═══════════════════════════════════════════════════════════════════

Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor $InfoColor
Write-Host " 📊 ФИНАЛЬНАЯ СТАТИСТИКА" -ForegroundColor $SuccessColor
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor $InfoColor

$FinalFiles = Get-ChildItem -Path $ProjectPath -Recurse -File
$FinalFolders = Get-ChildItem -Path $ProjectPath -Recurse -Directory
$TotalSize = ($FinalFiles | Measure-Object -Property Length -Sum).Sum

Write-Host "📁 Всего папок: $($FinalFolders.Count)" -ForegroundColor $InfoColor
Write-Host "📄 Всего файлов: $($FinalFiles.Count)" -ForegroundColor $InfoColor
Write-Host "💾 Общий размер: $([math]::Round($TotalSize/1MB, 2)) MB" -ForegroundColor $InfoColor
Write-Host ""

# ═══════════════════════════════════════════════════════════════════
# ПРОВЕРКА РАБОТЫ САЙТА
# ═══════════════════════════════════════════════════════════════════

Write-Host "🚀 Проверка работы сайта..." -ForegroundColor $InfoColor
$indexPath = Join-Path $ProjectPath "index.html"

if (Test-Path $indexPath) {
    $openSite = Read-Host "Открыть сайт для проверки? (y/n)"
    if ($openSite -eq "y") {
        Start-Process $indexPath
        Write-Host "✅ Сайт открыт в браузере" -ForegroundColor $SuccessColor
        Write-Host "   Проверьте что всё работает правильно!" -ForegroundColor $WarningColor
    }
}
else {
    Write-Host "❌ ОШИБКА: index.html не найден!" -ForegroundColor $ErrorColor
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor $InfoColor
Write-Host " ✅ ОЧИСТКА ЗАВЕРШЕНА!" -ForegroundColor $SuccessColor
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor $InfoColor
Write-Host ""
Write-Host "📝 Следующие шаги:" -ForegroundColor $InfoColor
Write-Host "   1. Проверьте работу сайта" -ForegroundColor $InfoColor
Write-Host "   2. Откройте консоль браузера (F12)" -ForegroundColor $InfoColor
Write-Host "   3. Убедитесь что нет ошибок" -ForegroundColor $InfoColor
Write-Host "   4. Если всё работает - можно загружать на GitHub" -ForegroundColor $InfoColor
Write-Host ""

# Пауза перед закрытием
Read-Host "Нажмите Enter для выхода"
