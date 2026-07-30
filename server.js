const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const EBAY_CLIENT_ID = 'smarthau-SmartHau-PRD-fa49b4867-1a082e31';
const EBAY_CLIENT_SECRET = 'PRD-a49b48675d27-9205-40f0-970c-9950';

async function getEbayToken() {
    const credentials = Buffer.from(`${EBAY_CLIENT_ID}:${EBAY_CLIENT_SECRET}`).toString('base64');
    
    const response = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${credentials}`
        },
        body: 'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope'
    });

    const data = await response.json();
    return data.access_token;
}

app.get('/api/iphones', async (req, res) => {
    try {
        const token = await getEbayToken();
        
        const ebayResponse = await fetch('https://api.ebay.com/buy/browse/v1/item_summary/search?q=iPhone&limit=16', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
            }
        });

        const ebayData = await ebayResponse.json();
        
        const items = (ebayData.itemSummaries || []).map(item => ({
            id: item.itemId,
            categoria: item.title.toLowerCase().includes('14') ? '14' : item.title.toLowerCase().includes('13') ? '13' : item.title.toLowerCase().includes('12') ? '12' : '11',
            condicionTipo: item.condition === 'New' ? 'nuevo' : 'gradoa',
            nombre: item.title,
            condicion: item.condition || 'Grado A+',
            precioUsd: parseFloat(item.price?.value || 300),
            imagen: item.image?.imageUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
            enlaceEbay: item.itemWebUrl
        }));

        res.json(items);
    } catch (error) {
        console.error("Error al consultar eBay:", error);
        res.status(500).json({ error: "No se pudo conectar con la API de eBay" });
    }
});

module.exports = app;
