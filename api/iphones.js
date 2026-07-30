// api/iphones.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  // Tus credenciales oficiales de la API de eBay
  const clientId = 'smarthau-SmartHau-PRD-fa49b4867-1a082e31';
  const clientSecret = 'PRD-a49b4867d27-9205-40f0-970c-9950';

  try {
    // 1. Obtener el token de acceso automático de eBay
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
      throw new Error("No se pudo obtener el token de eBay");
    }

    // 2. Buscar masivamente iPhones en tiempo real en todo el marketplace de eBay (hasta 100 resultados)
    const ebayResponse = await fetch('https://api.ebay.com/buy/browse/v1/item_summary/search?q=Apple+iPhone+Unlocked+Refurbished&limit=100', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
      }
    });

    const ebayData = await ebayResponse.json();

    if (!ebayData.itemSummaries || ebayData.itemSummaries.length === 0) {
      throw new Error("No se encontraron resultados en eBay");
    }

    // 3. Procesar cada producto, clasificarlo y aplicar tu fórmula de importación a Venezuela
    const catalogoIphones = ebayData.itemSummaries.map((item, index) => {
      const precioBase = item.price ? parseFloat(item.price.value) : 250;
      
      // Aplicación de tu fórmula matemática de importación
      const precioFinalUsd = Math.round((precioBase * 1.07) + 20);
      
      // Detectar la categoría según el título del iPhone
      const tituloLower = item.title.toLowerCase();
      let categoria = "13";
      if (tituloLower.includes('15')) categoria = "15";
      else if (tituloLower.includes('14')) categoria = "14";
      else if (tituloLower.includes('13')) categoria = "13";
      else if (tituloLower.includes('12')) categoria = "12";
      else if (tituloLower.includes('11')) categoria = "11";

      // Obtener imagen o usar una predeterminada si no tiene
      let imagenUrl = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500";
      if (item.image && item.image.imageUrl) {
        imagenUrl = item.image.imageUrl;
      }

      return {
        id: index + 1,
        categoria: categoria,
        condicionTipo: item.condition && item.condition.toLowerCase().includes('new') ? 'nuevo' : 'gradoa',
        nombre: item.title,
        proveedor: "eBay Marketplace Global",
        condicion: item.condition || 'Reacondicionado Certificado',
        precioUsd: precioFinalUsd,
        imagen: imagenUrl,
        enlaceEbay: item.itemWebUrl || 'https://www.ebay.com'
      };
    });

    return res.status(200).json(catalogoIphones);

  } catch (error) {
    // Plan de respaldo por si la API de eBay llega a fallar en algún momento
    const respaldoEmergencia = [
      {
        id: 1,
        categoria: "13",
        condicionTipo: "gradoa",
        nombre: "Apple iPhone 13 128GB Desbloqueado (Respaldo)",
        proveedor: "eBay Global",
        condicion: "Muy buen estado",
        precioUsd: Math.round((250 * 1.07) + 20),
        imagen: "https://i.ebayimg.com/images/g/yJ8AAOSwK59l2W~D/s-l500.jpg",
        enlaceEbay: "https://www.ebay.com"
      }
    ];

    return res.status(200).json(respaldoEmergencia);
  }
}
