// api/iphones.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const clientId = 'smarthau-SmartHau-PRD-fa49b4867-1a082e31';
  const clientSecret = 'PRD-a49b4867d27-9205-40f0-970c-9950';

  // Catálogo extendido y masivo de iPhones garantizados
  const fallbackProducts = [
    { id: 1, categoria: "11", condicionTipo: "gradoa", nombre: "Apple iPhone 11 - 64GB", condicion: "Grado A+ (Impecable)", precioUsd: Math.round((275 * 1.07) + 20), imagen: "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=500", enlaceEbay: "https://www.ebay.com/sch/i.html?_nkw=iphone+11" },
    { id: 2, categoria: "11", condicionTipo: "gradoa", nombre: "Apple iPhone 11 Pro - 256GB", condicion: "Libre de fábrica", precioUsd: Math.round((320 * 1.07) + 20), imagen: "https://images.unsplash.com/photo-1573148192801-631d2f277422?w=500", enlaceEbay: "https://www.ebay.com/sch/i.html?_nkw=iphone+11+pro" },
    { id: 3, categoria: "11", condicionTipo: "nuevo", nombre: "Apple iPhone 11 Pro Max - 512GB", condicion: "Nuevo / Original", precioUsd: Math.round((410 * 1.07) + 20), imagen: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500", enlaceEbay: "https://www.ebay.com/sch/i.html?_nkw=iphone+11+pro+max" },
    { id: 4, categoria: "12", condicionTipo: "gradoa", nombre: "Apple iPhone 12 - 128GB", condicion: "Como Nuevo (Batería 90%+)", precioUsd: Math.round((350 * 1.07) + 20), imagen: "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500", enlaceEbay: "https://www.ebay.com/sch/i.html?_nkw=iphone+12" },
    { id: 5, categoria: "12", condicionTipo: "gradoa", nombre: "Apple iPhone 12 Pro - 128GB", condicion: "Grado A+ (Impecable)", precioUsd: Math.round((430 * 1.07) + 20), imagen: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500", enlaceEbay: "https://www.ebay.com/sch/i.html?_nkw=iphone+12+pro" },
    { id: 6, categoria: "12", condicionTipo: "nuevo", nombre: "Apple iPhone 12 Pro Max - 128GB", condicion: "Excelente Estado / Sellado", precioUsd: Math.round((480 * 1.07) + 20), imagen: "https://images.unsplash.com/photo-1611329857572-5c45ce476b4a?w=500", enlaceEbay: "https://www.ebay.com/sch/i.html?_nkw=iphone+12+pro+max" },
    { id: 7, categoria: "13", condicionTipo: "nuevo", nombre: "Apple iPhone 13 - 128GB", condicion: "Sellado / Original", precioUsd: Math.round((450 * 1.07) + 20), imagen: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500", enlaceEbay: "https://www.ebay.com/sch/i.html?_nkw=iphone+13" },
    { id: 8, categoria: "13", condicionTipo: "gradoa", nombre: "Apple iPhone 13 mini - 128GB", condicion: "Libre de fábrica", precioUsd: Math.round((380 * 1.07) + 20), imagen: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500", enlaceEbay: "https://www.ebay.com/sch/i.html?_nkw=iphone+13+mini" },
    { id: 9, categoria: "13", condicionTipo: "gradoa", nombre: "Apple iPhone 13 Pro - 256GB", condicion: "Grado A+ (Impecable)", precioUsd: Math.round((580 * 1.07) + 20), imagen: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=500", enlaceEbay: "https://www.ebay.com/sch/i.html?_nkw=iphone+13+pro" },
    { id: 10, categoria: "13", condicionTipo: "nuevo", nombre: "Apple iPhone 13 Pro Max - 256GB", condicion: "Impecable • Garantía", precioUsd: Math.round((680 * 1.07) + 20), imagen: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500", enlaceEbay: "https://www.ebay.com/sch/i.html?_nkw=iphone+13+pro+max" },
    { id: 11, categoria: "14", condicionTipo: "nuevo", nombre: "Apple iPhone 14 - 128GB", condicion: "Nuevo de Paquete", precioUsd: Math.round((590 * 1.07) + 20), imagen: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=500", enlaceEbay: "https://www.ebay.com/sch/i.html?_nkw=iphone+14" },
    { id: 12, categoria: "14", condicionTipo: "gradoa", nombre: "Apple iPhone 14 Plus - 128GB", condicion: "Grado A+ (Impecable)", precioUsd: Math.round((620 * 1.07) + 20), imagen: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500", enlaceEbay: "https://www.ebay.com/sch/i.html?_nkw=iphone+14+plus" },
    { id: 13, categoria: "14", condicionTipo: "gradoa", nombre: "Apple iPhone 14 Pro - 256GB", condicion: "Libre • Garantía Activa", precioUsd: Math.round((720 * 1.07) + 20), imagen: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500", enlaceEbay: "https://www.ebay.com/sch/i.html?_nkw=iphone+14+pro" },
    { id: 14, categoria: "14", condicionTipo: "nuevo", nombre: "Apple iPhone 14 Pro Max - 256GB", condicion: "Sellado / Original", precioUsd: Math.round((750 * 1.07) + 20), imagen: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500", enlaceEbay: "https://www.ebay.com/sch/i.html?_nkw=iphone+14+pro+max" }
  ];

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
      return res.status(200).json(fallbackProducts);
    }

    const ebayResponse = await fetch('https://api.ebay.com/buy/browse/v1/item_summary/search?q=iphone&limit=20', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
      }
    });

    const ebayData = await ebayResponse.json();

    if (!ebayData.itemSummaries || ebayData.itemSummaries.length === 0) {
      return res.status(200).json(fallbackProducts);
    }

    const productosEbay = ebayData.itemSummaries.map((item, index) => {
      const precioBase = item.price ? parseFloat(item.price.value) : 300;
      const precioFinalUsd = Math.round((precioBase * 1.07) + 20);

      return {
        id: index + 100,
        categoria: item.title.toLowerCase().includes('14') ? '14' : item.title.toLowerCase().includes('13') ? '13' : item.title.toLowerCase().includes('12') ? '12' : '11',
        condicionTipo: item.condition && item.condition.toLowerCase().includes('new') ? 'nuevo' : 'gradoa',
        nombre: item.title,
        condicion: item.condition || 'Grado A+ (Impecable)',
        precioUsd: precioFinalUsd,
        imagen: item.image ? item.image.imageUrl : 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
        enlaceEbay: item.itemWebUrl || 'https://www.ebay.com'
      });
    });

    // Combinar resultados de eBay con el catálogo base ampliado para tener mucha variedad
    const combinados = [...productosEbay, ...fallbackProducts];

    return res.status(200).json(combinados);

  } catch (error) {
    return res.status(200).json(fallbackProducts);
  }
}
