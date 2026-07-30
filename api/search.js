const eBayApi = require('ebay-api');

const ebay = new eBayApi({
  appId: 'smarthau-SmartHauPRD-fa49b4867-1a082e31',
  certId: 'PRD-a49b48675d27-9205-40f0-970c-9950',
  sandbox: false,
  siteId: ebay.sites.EBAY_US // Forzar el mercado de Estados Unidos para asegurar resultados masivos
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const keyword = req.query.q || 'iphone';

  try {
    const response = await ebay.buy.browse.itemSummary.search({
      q: keyword,
      limit: '20'
    });

    return res.status(200).json({
      success: true,
      items: response.itemSummaries || []
    });
  } catch (error) {
    console.error('Error al conectar con eBay:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error interno al consultar la API de eBay'
    });
  }
}
