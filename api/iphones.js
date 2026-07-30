// api/iphones.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const clientId = 'smarthau-SmartHau-PRD-fa49b4867-1a082e31';
  const clientSecret = 'PRD-a49b4867d27-9205-40f0-970c-9950';

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
      throw new Error("Error obteniendo token de eBay");
    }

    // Búsqueda abierta y masiva sin restricciones de palabras clave específicas
    const ebayResponse = await fetch('https://api.ebay.com/buy/browse/v1/item_summary/search?q=Apple+iPhone&limit=100', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
      }
    });

    const ebayData = await ebayResponse.json();

    if (!ebayData.itemSummaries || ebayData.itemSummaries.length === 0) {
      throw new Error("No se encontraron elementos en eBay");
    }

    // Mapeo dinámico total de lo que arroje eBay sin hardcodear nombres ni limitar modelos
    const todosLosIphonesDeEbay = ebayData.itemSummaries.map((item, index) => {
      const precioBase = item.price ? parseFloat(item.price.value) : 300;
      // Tu fórmula exacta: Precio de eBay + 7% comisión + $20 envío a Venezuela
      const precioFinalUsd = Math.round((precioBase * 1.07) + 20);
      
      const tituloLower = item.title.toLowerCase();
      let categoria = "13";
      if (tituloLower.includes('15')) categoria = "15";
      else if (tituloLower.includes('14')) categoria = "14";
      else if (tituloLower.includes('13')) categoria = "13";
      else if (tituloLower.includes('12')) categoria = "12";
      else if (tituloLower.includes('11')) categoria = "11";

      // Obtener imagen real de la API de eBay
      let imagenUrl = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500";
      if (item.image && item.image.imageUrl) {
        imagenUrl = item.image.imageUrl;
      }

      return {
        id: index + 1,
        categoria: categoria,
        condicionTipo: item.condition && item.condition.toLowerCase().includes('new') ? 'nuevo' : 'gradoa',
        nombre: item.title, // Título exacto y real devuelto por eBay
        proveedor: item.seller ? `${item.seller.username} (eBay US)` : "eBay US Seller",
        condicion: item.condition || 'Certified / Refurbished',
        precioUsd: precioFinalUsd,
        imagen: imagenUrl,
        enlaceEbay: item.itemWebUrl || 'https://www.ebay.com'
      };
    });

    return res.status(200).json(todosLosIphonesDeEbay);

  } catch (error) {
    // Manejo de error en caso de que la API de eBay requiera reintento o límite de cuota
    return res.status(500).json({ error: "Error al conectar con la API de eBay: " + error.message });
  }
}
