// api/iphones.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const clientId = 'smarthau-SmartHau-PRD-fa49b4867-1a082e31';
  const clientSecret = 'PRD-a49b4867d27-9205-40f0-970c-9950';

  const queryBusqueda = (req.query.q || 'Apple iPhone').trim();

  try {
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    // 1. Generar token oficial de producción
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
      throw new Error("No se pudo autenticar con la API de eBay");
    }

    // 2. Petición directa a la Browse API pidiendo un límite alto de resultados (ej. 50)
    const ebayResponse = await fetch(`https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(queryBusqueda)}&limit=50`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
        'Accept': 'application/json',
        'Accept-Language': 'en-US'
      }
    });

    const ebayData = await ebayResponse.json();

    if (!ebayData.itemSummaries || ebayData.itemSummaries.length === 0) {
      return res.status(200).json([]);
    }

    // 3. Mapear cada resultado real de eBay aplicando tu fórmula (precio * 1.07 + 20)
    const productosReales = ebayData.itemSummaries.map((item, index) => {
      // Extraer el precio numérico real de la API
      const precioBase = item.price && item.price.value ? parseFloat(item.price.value) : 50;
      const precioFinalUsd = Math.round((precioBase * 1.07) + 20);

      // Extraer la imagen real del producto o usar una por defecto si el vendedor no subió una
      let imagenUrl = "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500";
      if (item.image && item.image.imageUrl) {
        imagenUrl = item.image.imageUrl;
      }

      // Obtener la condición limpia
      let condicionItem = item.condition || 'Nuevo / Usado verificado';

      return {
        id: index + 1,
        nombre: item.title,
        condicion: condicionItem,
        precioUsd: precioFinalUsd,
        imagen: imagenUrl,
        enlaceEbay: item.itemWebUrl || `https://www.ebay.com`
      };
    });

    // Devuelve el listado masivo real directamente a tu interfaz
    return res.status(200).json(productosReales);

  } catch (error) {
    // En caso de intermitencia de red, devuelve un arreglo vacío para que lo maneje tu frontend
    return res.status(200).json([]);
  }
}
