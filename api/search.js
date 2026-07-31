export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const keyword = req.query.q || 'iphone';

  // Usamos tus credenciales de PRODUCCIÓN oficiales
  const clientId = 'smarthau-SmartHauPRD-fa49b4867-1a082e31';
  const clientSecret = 'PRD-a49b48675d27-9205-40f0-970c-9950';

  try {
    // 1. Obtener el Token de acceso de eBay (Entorno de Producción)
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
      throw new Error(tokenData.error_description || 'No se pudo generar el token de acceso de producción con eBay');
    }

    const accessToken = tokenData.access_token;

    // 2. Consultar la Browse API oficial de eBay con el token
    const searchResponse = await fetch(`https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(keyword)}&limit=20`, {
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
