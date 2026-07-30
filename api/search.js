const eBayApi = require('ebay-api');

const ebay = new eBayApi({
  appId: process.env.EBAY_APP_ID,
  certId: process.env.EBAY_CERT_ID,
  sandbox: false
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const keyword = req.query.q || 'smartphone';

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
