// api/iphones.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const clientId = 'smarthau-SmartHau-PRD-fa49b4867-1a082e31';
  const clientSecret = 'PRD-a49b4867d27-9205-40f0-970c-9950';

  const queryBusqueda = req.query.q || 'Apple iPhone';

  try {
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
      throw new Error("No se pudo autenticar con eBay");
    }

    const urlEbay = `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(queryBusqueda)}&limit=100`;
    
    const ebayResponse = await fetch(urlEbay, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
      }
    });

    const ebayData = await ebayResponse.json();

    if (!ebayData.itemSummaries || ebayData.itemSummaries.length === 0) {
      return res.status(200).json([]);
    }

    // Mapeo estrictamente con los datos reales devueltos por eBay (sin textos inventados)
    const catalogoReal = ebayData.itemSummaries.map((item, index) => {
      const precioBase = item.price ? parseFloat(item.price.value) : 10;
      const precioFinalUsd = Math.round((precioBase * 1.07) + 20);

      let imagenUrl = "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500";
      if (item.image && item.image.imageUrl) {
        imagenUrl = item.image.imageUrl;
      } else if (item.thumbnailImages && item.thumbnailImages.length > 0) {
        imagenUrl = item.thumbnailImages[0].imageUrl;
      }

      return {
        id: index + 1,
        nombre: item.title,
        condicion: item.condition || 'Disponible',
        precioUsd: precioFinalUsd,
        imagen: imagenUrl,
        enlaceEbay: item.itemWebUrl || 'https://www.ebay.com'
      };
    });

    return res.status(200).json(catalogoReal);

  } catch (error) {
    // Si ocurre un fallo de conexión, devolvemos una lista vacía en lugar de inventar productos o lotes falsos
    return res.status(200).json([]);
  }
}
