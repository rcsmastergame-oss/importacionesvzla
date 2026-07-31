export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const urlParams = new URL(req.url, `https://${req.headers.host}`).searchParams;
  const keyword = urlParams.get('q') || 'iphone';

  // Credenciales de PRODUCCIÓN oficiales de eBay
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

    const searchUrl = new URL('https://api.ebay.com/buy/browse/v1/item_summary/search');
    searchUrl.searchParams.append('q', keyword);
    searchUrl.searchParams.append('limit', '20');

    const searchResponse = await fetch(searchUrl.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
      }
    });

    const searchData = await searchResponse.json();

    return res.status(200).json({
      success: true,
      items: searchData.itemSummaries || []
    });

  } catch (error) {
    console.error('Error detallado:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error interno al consultar la API de eBay'
    });
  }
}
