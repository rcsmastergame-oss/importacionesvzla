const IPHONE_SELLERS_LIST = [
  'bidallies',
  'buythatapple',
  'creo_cellular',
  'easytradenow123',
  'gatorwireless',
  'itsworthmore',
  'kisselectronicsinc',
  'maxbacksales',
  'nikatronics',
  'paymore_arlington',
  'paymore_bustleton',
  'paymore_springfield',
  'smartphoneexchange',
  'verizon'
];

const IPHONE_ALLOWED_SELLERS = new Set(IPHONE_SELLERS_LIST);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const urlParams = new URL(req.url, `https://${req.headers.host}`).searchParams;
  const keyword = urlParams.get('q') || 'iphone';
  const condition = urlParams.get('condition');
  const storage = urlParams.get('storage');
  const model = urlParams.get('model');
  const buyingFormat = urlParams.get('buyingFormat');
  const sort = urlParams.get('sort');
  const limit = Math.min(Math.max(parseInt(urlParams.get('limit') || '48', 10), 1), 200);
  const offset = Math.max(parseInt(urlParams.get('offset') || '0', 10), 0);

  const clientId = 'smarthau-SmartHau-PRD-fa49b4867-1a082e31';
  const clientSecret = 'PRD-a49b48675d27-9205-40f0-970c-9950';

  try {
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const tokenResponse = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${credentials}`
      },
      body: 'grant_type=client_credentials&scope=https%3A%2F%2Fapi.ebay.com%2Foauth%2Fapi_scope'
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      throw new Error(tokenData.error_description || 'No se pudo generar el token de acceso');
    }

    const accessToken = tokenData.access_token;

    let searchFullQuery = keyword;
    if (model) searchFullQuery += ` ${model}`;
    if (storage) searchFullQuery += ` ${storage}`;

    const isIphoneSearch = `${keyword} ${searchFullQuery}`
      .toLowerCase()
      .includes('iphone');

    const ebayFetchLimit = isIphoneSearch ? Math.max(limit, 100) : limit;

    const searchUrl = new URL('https://api.ebay.com/buy/browse/v1/item_summary/search');
    searchUrl.searchParams.append('q', searchFullQuery);
    searchUrl.searchParams.append('limit', String(ebayFetchLimit));
    searchUrl.searchParams.append('offset', String(offset));

    const filters = [];

    // Modalidad de compra (por defecto compra inmediata si no se pide subasta)
    if (buyingFormat === 'AUCTION') {
      filters.push('buyingOptions:{AUCTION}');
    } else if (buyingFormat === 'ALL') {
      filters.push('buyingOptions:{FIXED_PRICE|AUCTION}');
    } else {
      filters.push('buyingOptions:{FIXED_PRICE}');
    }

    // Filtro de condición (soporta NEW, USED o IDs numéricos de eBay)
    if (condition) {
      if (condition === 'NEW') {
        filters.push('conditions:{NEW}');
      } else if (condition === 'USED') {
        filters.push('conditions:{USED}');
      } else if (condition === 'REFURBISHED') {
        filters.push('conditions:{REFURBISHED}');
      } else {
        filters.push(`conditionIds:{${condition}}`);
      }
    }

    // Filtrar vendedores directamente en eBay solo cuando se busca iPhone
    if (isIphoneSearch && IPHONE_SELLERS_LIST.length > 0) {
      filters.push(`sellers:{${IPHONE_SELLERS_LIST.join('|')}}`);
    }

    if (filters.length > 0) {
      searchUrl.searchParams.append('filter', filters.join(','));
    }

    // Ordenamiento nativo en eBay API
    if (sort === 'low') {
      searchUrl.searchParams.append('sort', 'price');
    } else if (sort === 'high') {
      searchUrl.searchParams.append('sort', '-price');
    }

    const searchResponse = await fetch(searchUrl.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
      }
    });

    const searchData = await searchResponse.json();

    if (!searchResponse.ok) {
      throw new Error(searchData.errors?.[0]?.message || 'Error en la respuesta de eBay');
    }

    let items = (searchData.itemSummaries || []).map(item => {
      const rawPrice = item.price ? parseFloat(item.price.value) : 0;
      const currency = item.price ? item.price.currency : 'USD';
      const finalPrice = (rawPrice * 1.07).toFixed(2);

      // Extraer costo de envío si viene en shippingOptions
      let shippingCost = null;
      if (Array.isArray(item.shippingOptions) && item.shippingOptions.length > 0) {
        const sc = item.shippingOptions[0].shippingCost;
        if (sc && sc.value !== undefined) {
          shippingCost = parseFloat(sc.value) === 0 ? 'Gratis EE.UU.' : `$${parseFloat(sc.value).toFixed(2)}`;
        }
      }

      // Normalizar formato de compra para el frontend
      const format = Array.isArray(item.buyingOptions) && item.buyingOptions.includes('AUCTION') && !item.buyingOptions.includes('FIXED_PRICE')
        ? 'AUCTION'
        : 'FIXED_PRICE';

      return {
        ...item,
        calculatedPrice: finalPrice,
        currency: currency,
        buyingFormat: format,
        shippingCost: shippingCost
      };
    });

    if (isIphoneSearch) {
      items = items
        .filter(item => {
          const sellerUsername = (item?.seller?.username || '').toLowerCase().trim();
          return IPHONE_ALLOWED_SELLERS.has(sellerUsername);
        })
        .slice(0, limit);
    }

    return res.status(200).json({
      success: true,
      total: isIphoneSearch
        ? items.length
        : (typeof searchData.total === 'number' ? searchData.total : items.length),
      offset: offset,
      limit: limit,
      items: items
    });

  } catch (error) {
    console.error('Error detallado:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error interno al consultar la API'
    });
  }
}
