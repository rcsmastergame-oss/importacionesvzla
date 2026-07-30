// api/iphones.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const clientId = 'smarthau-SmartHau-PRD-fa49b4867-1a082e31';
  const clientSecret = 'PRD-a49b4867d27-9205-40f0-970c-9950';

  // Captura lo que el usuario busque en tu barra (por defecto busca iPhones si viene vacío)
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

    // Consulta dinámica a la Browse API usando el término ingresado por el usuario (hasta 100 resultados)
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

    // Mapeo masivo con extracción de imágenes optimizada de eBay
    const catalogoMasivo = ebayData.itemSummaries.map((item, index) => {
      const precioBase = item.price ? parseFloat(item.price.value) : 50;
      // Fórmula de importación a Venezuela: (Precio eBay * 1.07) + $20 de flete
      const precioFinalUsd = Math.round((precioBase * 1.07) + 20);

      // Extracción segura de la imagen principal que provee eBay
      let imagenUrl = "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500";
      if (item.image && item.image.imageUrl) {
        imagenUrl = item.image.imageUrl;
      } else if (item.thumbnailImages && item.thumbnailImages.length > 0) {
        imagenUrl = item.thumbnailImages[0].imageUrl;
      }

      return {
        id: index + 1,
        nombre: item.title,
        condicion: item.condition || 'Nuevo / Reacondicionado',
        precioUsd: precioFinalUsd,
        imagen: imagenUrl,
        enlaceEbay: item.itemWebUrl || 'https://www.ebay.com'
      };
    });

    return res.status(200).json(catalogoMasivo);

  } catch (error) {
    // Plan de respaldo dinámico en caso de fallo temporal de la API
    const fallbackDinamico = Array.from({ length: 16 }, (_, i) => ({
      id: i + 1,
      nombre: `${queryBusqueda} - Lote Global Importación #${i + 1}`,
      condicion: 'Certificado por Proveedor',
      precioUsd: Math.round(((80 + (i * 25)) * 1.07) + 20),
      imagen: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500",
      enlaceEbay: "https://www.ebay.com"
    }));

    return res.status(200).json(fallbackDinamico);
  }
}
