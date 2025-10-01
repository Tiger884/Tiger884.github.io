/**
 * Серверная функция для поиска товаров на eBay
 * Предназначена для развертывания на Netlify Functions
 * 
 * Использование: /.netlify/functions/searchEbay?keywords=Intel+8086
 */

exports.handler = async (event, context) => {
    // Настройка CORS заголовков
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Обработка preflight OPTIONS запроса
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // Проверяем наличие ключа API
    const EBAY_APP_ID = process.env.EBAY_APP_ID;
    if (!EBAY_APP_ID) {
        console.error('EBAY_APP_ID environment variable is not set');
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Server configuration error',
                message: 'API key not configured'
            })
        };
    }

    try {
        // Получаем параметры запроса
        const { keywords } = event.queryStringParameters || {};
        
        if (!keywords) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'Bad Request',
                    message: 'Keywords parameter is required'
                })
            };
        }

        console.log(`Searching eBay for: ${keywords}`);

        // Параметры для eBay Finding API
        const ebayParams = new URLSearchParams({
            'OPERATION-NAME': 'findItemsByKeywords',
            'SERVICE-VERSION': '1.0.0',
            'SECURITY-APPNAME': EBAY_APP_ID,
            'RESPONSE-DATA-FORMAT': 'JSON',
            'REST-PAYLOAD': '',
            'keywords': keywords,
            'paginationInput.entriesPerPage': '12', // Максимум 12 товаров
            'sortOrder': 'PricePlusShipping', // Сортировка по цене
            'itemFilter(0).name': 'Condition',
            'itemFilter(0).value': 'Used', // Только б/у товары (для винтажных компонентов)
            'itemFilter(1).name': 'ListingType',
            'itemFilter(1).value(0)': 'FixedPrice',
            'itemFilter(1).value(1)': 'AuctionWithBIN', // Аукцион с возможностью Buy It Now
            'itemFilter(2).name': 'MinPrice',
            'itemFilter(2).value': '10', // Минимальная цена $10
            'itemFilter(2).paramName': 'Currency',
            'itemFilter(2).paramValue': 'USD'
        });

        // URL для eBay Finding API
        const ebayUrl = `https://svcs.ebay.com/services/search/FindingService/v1?${ebayParams.toString()}`;

        // Выполняем запрос к eBay API
        const response = await fetch(ebayUrl, {
            method: 'GET',
            headers: {
                'User-Agent': 'Retro-PC-Store/1.0'
            }
        });

        if (!response.ok) {
            throw new Error(`eBay API responded with status: ${response.status}`);
        }

        const data = await response.json();
        
        // Проверяем структуру ответа eBay
        if (!data.findItemsByKeywordsResponse || 
            !data.findItemsByKeywordsResponse[0] || 
            !data.findItemsByKeywordsResponse[0].searchResult) {
            throw new Error('Invalid response structure from eBay API');
        }

        const searchResult = data.findItemsByKeywordsResponse[0].searchResult[0];
        
        // Проверяем, найдены ли товары
        if (searchResult['@count'] === '0' || !searchResult.item) {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    items: [],
                    count: 0,
                    message: 'No items found'
                })
            };
        }

        // Обрабатываем найденные товары
        const items = searchResult.item.map(item => {
            // Безопасное извлечение данных с проверками
            const title = item.title ? item.title[0] : 'Unknown Item';
            const galleryURL = item.galleryURL ? item.galleryURL[0] : null;
            const viewItemURL = item.viewItemURL ? item.viewItemURL[0] : '#';
            
            // Извлекаем цену
            let currentPrice = 'N/A';
            if (item.sellingStatus && 
                item.sellingStatus[0] && 
                item.sellingStatus[0].currentPrice && 
                item.sellingStatus[0].currentPrice[0]) {
                const priceData = item.sellingStatus[0].currentPrice[0];
                const currency = priceData['@currencyId'] || 'USD';
                const value = priceData['__value__'] || '0';
                currentPrice = `${currency} ${parseFloat(value).toFixed(2)}`;
            }

            // Извлекаем местоположение
            const location = item.location ? item.location[0] : 'Unknown';
            
            // Извлекаем состояние товара
            let condition = 'Used';
            if (item.condition && item.condition[0] && item.condition[0].conditionDisplayName) {
                condition = item.condition[0].conditionDisplayName[0];
            }

            return {
                title: title.length > 60 ? title.substring(0, 57) + '...' : title,
                galleryURL,
                viewItemURL,
                currentPrice,
                location,
                condition
            };
        });

        console.log(`Found ${items.length} items for "${keywords}"`);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                items,
                count: items.length,
                searchTerm: keywords
            })
        };

    } catch (error) {
        console.error('Error in searchEbay function:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Internal Server Error',
                message: 'Failed to search eBay',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            })
        };
    }
};