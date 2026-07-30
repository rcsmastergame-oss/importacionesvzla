// api/iphones.js
export default async function handler(req, res) {
  // Configurar CORS para permitir peticiones desde tu frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const clientId = 'smarthau-SmartHau-PRD-fa49b4867-1a082e31';
  const clientSecret = 'PRD-a49b4867d27-9205-40f0-970c-9950';

  try {
    // 1. Obtener el token de acceso OAuth de eBay (Production)
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    const tokenResponse = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${credentials}`
      },
      body: 'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope'
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      throw new Error('No se pudo autenticar con la API de eBay');
    }

    const accessToken = tokenData.access_token;

    // 2. Buscar iPhones reales en el Browse API de eBay
    const ebayResponse = await fetch('https://api.ebay.com/buy/browse/v1/item_summary/search?q=iphone&limit=12&filter=buyingOptions:{FIXED_PRICE}', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
      }
    });

    const ebayData = await ebayResponse.json();

    if (!ebayData.itemSummaries) {
      return res.status(200).json([]);
    }

    // 3. Formatear los productos para tu tienda (aplicando comisión del 7% + $20 de envío)
    const productosFormateados = ebayData.itemSummaries.map((item, index) => {
      const precioBase = item.price ? parseFloat(item.price.value) : 300;
      // Cálculo automático: Precio base + 7% de comisión + $20 de envío fijo
      const precioFinalUsd = Math.round((precioBase * 1.07) + 20);

      return {
        id: index + 1,
        categoria: item.title.toLowerCase().includes('14') ? '14' : item.title.toLowerCase().includes('13') ? '13' : item.title.toLowerCase().includes('12') ? '12' : '11',
        condicionTipo: item.condition === 'New' ? 'nuevo' : 'gradoa',
        nombre: item.title,
        condicion: item.condition || 'Grado A+ (Impecable)',
        precioUsd: precioFinalUsd,
        imagen: item.image ? item.image.imageUrl : 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
        enlaceEbay: item.itemWebUrl
      };
    });

    return res.status(200).json(productosFormateados);

  } catch (error) {
    console.error('Error conectando a eBay API:', error);
    return res.status(500).json({ error: 'Error al sincronizar con eBay', detalle: error.message });
  }
}
