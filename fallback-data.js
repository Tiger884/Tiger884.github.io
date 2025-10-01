/**
 * Резервні дані для Retro-PC Store
 * Використовуються коли eBay API недоступний
 * 
 * Структура об'єктів відповідає структурі даних з eBay API
 */

// Глобальний масив резервних товарів
window.fallbackProducts = [
    {
        title: "Intel 8086 CPU Processor - Vintage 1978 Original",
        galleryURL: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjMEQwRDBEIiBzdHJva2U9IiMzM0ZGMzMiIHN0cm9rZS13aWR0aD0iMiIvPgo8dGV4dCB4PSIxMDAiIHk9IjQwIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE2IiBmaWxsPSIjMzNGRjMzIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5JbnRlbDwvdGV4dD4KPHR5eHQgeD0iMTAwIiB5PSI3NSIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIyNCIgZmlsbD0iI0ZGQjAwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+ODA4NjwvdGV4dD4KPHR5eHQgeD0iMTAwIiB5PSIxMTAiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiMzM0ZGMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNQVTwvdGV4dD4KPHR5eHQgeD0iMTAwIiB5PSIxMzAiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiM4MDgwODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPltSRVRSTy1QQyBTVE9SRV08L3RleHQ+Cjwvc3ZnPgo=",
        viewItemURL: "#demo-product-1",
        currentPrice: "$125.00",
        location: "California, USA",
        condition: "Used"
    },
    {
        title: "Intel 8088 Microprocessor 4.77MHz DIP-40 Ceramic",
        galleryURL: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjMEQwRDBEIiBzdHJva2U9IiMzM0ZGMzMiIHN0cm9rZS13aWR0aD0iMiIvPgo8dGV4dCB4PSIxMDAiIHk9IjQwIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE2IiBmaWxsPSIjMzNGRjMzIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5JbnRlbDwvdGV4dD4KPHR5eHQgeD0iMTAwIiB5PSI3NSIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIyNCIgZmlsbD0iI0ZGQjAwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+ODA4ODwvdGV4dD4KPHR5eHQgeD0iMTAwIiB5PSIxMTAiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiMzM0ZGMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPjQuNzdNaHo8L3RleHQ+Cjx0ZXh0IHg9IjEwMCIgeT0iMTMwIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjEwIiBmaWxsPSIjODA4MDgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5bUkVUUk8tUEMgU1RPUkVdPC90ZXh0Pgo8L3N2Zz4K",
        viewItemURL: "#demo-product-2",
        currentPrice: "$89.99",
        location: "Texas, USA",
        condition: "Used"
    },
    {
        title: "Intel 8087 Math Coprocessor FPU - Original Vintage",
        galleryURL: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjMEQwRDBEIiBzdHJva2U9IiMzM0ZGMzMiIHN0cm9rZS13aWR0aD0iMiIvPgo8dGV4dCB4PSIxMDAiIHk9IjQwIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE2IiBmaWxsPSIjMzNGRjMzIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5JbnRlbDwvdGV4dD4KPHR5eHQgeD0iMTAwIiB5PSI3NSIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIyNCIgZmlsbD0iI0ZGQjAwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+ODA4NzwvdGV4dD4KPHR5eHQgeD0iMTAwIiB5PSIxMTAiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiMzM0ZGMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk1hdGggRlBVPC90ZXh0Pgo8dGV4dCB4PSIxMDAiIHk9IjEzMCIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIxMCIgZmlsbD0iIzgwODA4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+W1JFVFJPLVBDIFNUT1JFXTwvdGV4dD4KPC9zdmc+Cg==",
        viewItemURL: "#demo-product-3",
        currentPrice: "$195.00",
        location: "New York, USA",
        condition: "Good"
    },
    {
        title: "Vintage XT Motherboard 8088 Compatible ISA Slots",
        galleryURL: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjMEQwRDBEIiBzdHJva2U9IiMzM0ZGMzMiIHN0cm9rZS13aWR0aD0iMiIvPgo8dGV4dCB4PSIxMDAiIHk9IjMwIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMzNGRjMzIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5YVDwvdGV4dD4KPHR5eHQgeD0iMTAwIiB5PSI2MCIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIxOCIgZmlsbD0iI0ZGQjAwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TW90aGVyYm9hcmQ8L3RleHQ+Cjx0ZXh0IHg9IjEwMCIgeT0iOTAiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiMzM0ZGMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPklTQSBTbG90czwvdGV4dD4KPHR5eHQgeD0iMTAwIiB5PSIxMTAiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiMzM0ZGMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPjY0MEtCIFJBTTwvdGV4dD4KPHR5eHQgeD0iMTAwIiB5PSIxMzAiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiM4MDgwODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPltSRVRSTy1QQyBTVE9SRV08L3RleHQ+Cjwvc3ZnPgo=",
        viewItemURL: "#demo-product-4",
        currentPrice: "$299.99",
        location: "Illinois, USA",
        condition: "For parts or not working"
    },
    {
        title: "CGA Color Graphics Adapter Card 1981 IBM Compatible",
        galleryURL: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjMEQwRDBEIiBzdHJva2U9IiMzM0ZGMzMiIHN0cm9rZS13aWR0aD0iMiIvPgo8dGV4dCB4PSIxMDAiIHk9IjMwIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjIwIiBmaWxsPSIjRkZCMDAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5DR0E8L3RleHQ+Cjx0ZXh0IHg9IjEwMCIgeT0iNjAiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMzM0ZGMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkdyYXBoaWNzPC90ZXh0Pgo8dGV4dCB4PSIxMDAiIHk9Ijg1IiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMzNGRjMzIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5BZGFwdGVyPC90ZXh0Pgo8dGV4dCB4PSIxMDAiIHk9IjExMCIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIxMCIgZmlsbD0iIzMzRkYzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+MzIweDIwMCA0LWNvbG9yPC90ZXh0Pgo8dGV4dCB4PSIxMDAiIHk9IjEzMCIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIxMCIgZmlsbD0iIzgwODA4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+W1JFVFJPLVBDIFNUT1JFXTwvdGV4dD4KPC9zdmc+Cg==",
        viewItemURL: "#demo-product-5",
        currentPrice: "$145.50",
        location: "Ohio, USA",
        condition: "Used"
    },
    {
        title: "AMD 8086 Compatible CPU Processor Vintage Computing",
        galleryURL: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjMEQwRDBEIiBzdHJva2U9IiMzM0ZGMzMiIHN0cm9rZS13aWR0aD0iMiIvPgo8dGV4dCB4PSIxMDAiIHk9IjQwIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjMzNGRjMzIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5BTUQ8L3RleHQ+Cjx0ZXh0IHg9IjEwMCIgeT0iNzUiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiNGRkIwMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPjgwODYtMjwvdGV4dD4KPHR5eHQgeD0iMTAwIiB5PSIxMTAiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiMzM0ZGMzMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNvbXBhdGlibGU8L3RleHQ+Cjx0ZXh0IHg9IjEwMCIgeT0iMTMwIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjEwIiBmaWxsPSIjODA4MDgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5bUkVUUk8tUEMgU1RPUkVdPC90ZXh0Pgo8L3N2Zz4K",
        viewItemURL: "#demo-product-6",
        currentPrice: "$79.99",
        location: "Florida, USA",
        condition: "Used"
    }
];

// Функція для отримання випадкових товарів з fallback даних
window.getRandomFallbackProducts = function(count = 6) {
    const shuffled = [...window.fallbackProducts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

// Повідомлення в консоль для відлагодження
console.log('📦 Fallback data loaded:', window.fallbackProducts.length, 'products available');