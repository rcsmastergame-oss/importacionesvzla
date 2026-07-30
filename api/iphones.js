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
      throw new Error("No se pudo obtener el token de acceso de eBay USA");
    }

    // Petición directa a la región US buscando inventario masivo de iPhones certificados
    const ebayResponse = await fetch('https://api.ebay.com/buy/browse/v1/item_summary/search?q=Apple+iPhone+Unlocked&limit=100', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
      }
    });

    const ebayData = await ebayResponse.json();

    if (!ebayData.itemSummaries || ebayData.itemSummaries.length === 0) {
      throw new Error("No se encontraron elementos en la región US");
    }

    const productosUsa = ebayData.itemSummaries.map((item, index) => {
      const precioBase = item.price ? parseFloat(item.price.value) : 320;
      // Cálculo: Precio en USA + 7% comisión + $20 de envío a Venezuela
      const precioFinalUsd = Math.round((precioBase * 1.07) + 20);
      
      const tituloLower = item.title.toLowerCase();
      let categoria = "11";
      if (tituloLower.includes('15')) categoria = "15";
      else if (tituloLower.includes('14')) categoria = "14";
      else if (tituloLower.includes('13')) categoria = "13";
      else if (tituloLower.includes('12')) categoria = "12";

      return {
        id: index + 1,
        categoria: categoria,
        condicionTipo: item.condition && item.condition.toLowerCase().includes('new') ? 'nuevo' : 'gradoa',
        nombre: item.title,
        proveedor: "US Certified Supplier",
        condicion: item.condition || 'Certified Refurbished (US)',
        precioUsd: precioFinalUsd,
        imagen: item.image ? item.image.imageUrl : 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
        enlaceEbay: item.itemWebUrl || 'https://www.ebay.com'
      };
    });

    return res.status(200).json(productosUsa);

  } catch (error) {
    // Respaldo de alta gama enfocado en mercado de EE. UU.
    const respaldoUsa = [
      { id: 1, categoria: "13", condicionTipo: "gradoa", nombre: "Apple iPhone 13 128GB - Factory Unlocked (US Stock)", proveedor: "US Certified Supplier", condicion: "Certified Refurbished", precioUsd: Math.round((410 * 1.07) + 20), imagen: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500", enlaceEbay: "https://www.ebay.com" },
      { id: 2, categoria: "14", condicionTipo: "gradoa", nombre: "Apple iPhone 14 Pro 256GB - US Specs", proveedor: "US Certified Supplier", condicion: "Grado A+ (Impecable)", precioUsd: Math.round((700 * 1.07) + 20), imagen: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500", enlaceEbay: "https://www.ebay.com" },
      { id: 3, categoria: "15", condicionTipo: "nuevo", nombre: "Apple iPhone 15 128GB - US Model Sealed", proveedor: "US Certified Supplier", condicion: "Nuevo / Sellado", precioUsd: Math.round((750 * 1.07) + 20), imagen: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500", enlaceEbay: "https://www.ebay.com" }
    ];

    return res.status(200).json(respaldoUsa);
  }
}
