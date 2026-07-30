const eBayApi = require('ebay-api');

const ebay = new eBayApi({
  appId: 'smarthau-SmartHauBX-9a4a6ebfb-0f6b1284',
  certId: 'SBX-a4a6ebfbee5f-0661-4966-a364-d577',
  sandbox: true, // Cambiado a true para usar el entorno de pruebas
  siteId: 'EBAY-US'
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
    console.error('Error detallado de eBay:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error interno al consultar la API de eBay'
    });
  }
}
