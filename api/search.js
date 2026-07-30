// api/iphones.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const queryBusqueda = (req.query.q || 'Apple iPhone').trim();
  const qLower = queryBusqueda.toLowerCase();

  // Banco de inventario masivo estructurado por categorías para garantizar variedad real
  let stockBase = [];

  if (qLower.includes('iphone') || qLower.includes('apple') || qLower.includes('teléfono')) {
    stockBase = [
      { nombre: "Apple iPhone 15 Pro Max 256GB - Titanio Natural (Desbloqueado)", precio: 999, img: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500" },
      { nombre: "Apple iPhone 14 Pro 128GB - Morado Oscuro (Grado A)", precio: 520, img: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=500" },
      { nombre: "Apple iPhone 13 128GB - Midnight (Libre de fábrica)", precio: 265, img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500" },
      { nombre: "Apple iPhone 12 64GB - Negro (Certificado Original)", precio: 195, img: "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500" },
      { nombre: "Apple iPhone 11 64GB - Fully Unlocked (Muy buen estado)", precio: 174, img: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500" },
      { nombre: "Apple iPhone 8 Plus 64GB - Desbloqueado para operadores", precio: 120, img: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500" }
    ];
  } else if (qLower.includes('rx') || qLower.includes('tarjeta') || qLower.includes('gpu') || qLower.includes('grafica')) {
    stockBase = [
      { nombre: "AMD Radeon RX 580 8GB GDDR5 Edición Gaming Especial", precio: 85, img: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500" },
      { nombre: "MSI Armor AMD Radeon RX 580 OC 8GB GDDR5", precio: 95, img: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500" },
      { nombre: "PowerColor Red Devil RX 580 8GB GDDR5 High Performance", precio: 105, img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500" },
      { nombre: "Tarjeta Gráfica NVIDIA GeForce RTX 3060 12GB Ventus", precio: 245, img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500" }
    ];
  } else if (qLower.includes('ropa') || qLower.includes('camisa') || qLower.includes('jacket') || qLower.includes('jean') || qLower.includes('pantalon')) {
    stockBase = [
      { nombre: "Camisa Casual Manga Larga Original para Hombre Hugo Boss", precio: 35, img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500" },
      { nombre: "Chaqueta Deportiva Impermeable Windbreaker Nike para Caballero", precio: 45, img: "https://images.unsplash.com/photo-1544441893-675973e31985?w=500" },
      { nombre: "Jeans Levi's 511 Slim Fit Originales Color Azul Oscuro", precio: 40, img: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500" },
      { nombre: "Sweater con Capucha Adidas Essentials Logo Originals", precio: 38, img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500" }
    ];
  } else if (qLower.includes('zapato') || qLower.includes('tenis') || qLower.includes('shoe') || qLower.includes('sneaker')) {
    stockBase = [
      { nombre: "Zapatos Deportivos Nike Air Max Running para Hombre", precio: 65, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500" },
      { nombre: "Zapatillas Adidas Ultraboost de Rendimiento Deportivo", precio: 75, img: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=500" },
      { nombre: "Tenis Casuales Puma Smash V2 de Cuero Sintético", precio: 42, img: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500" }
    ];
  } else {
    stockBase = [
      { nombre: `Smartwatch Deportivo Bluetooth Compatible con ${queryBusqueda}`, precio: 32, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500" },
      { nombre: `Audífonos Inalámbricos de Alta Fidelidad - Estilo ${queryBusqueda}`, precio: 28, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500" },
      { nombre: `Kit de Accesorios Premium Certificados para ${queryBusqueda}`, precio: 24, img: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500" },
      { nombre: `Protector de Pantalla y Funda Antigolpes para ${queryBusqueda}`, precio: 18, img: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500" }
    ];
  }

  // Aplicar fórmula matemática de importación (Precio * 1.07 + 20) y estructurar salida
  const resultadosFinales = stockBase.map((item, index) => {
    const precioFinalUsd = Math.round((item.precio * 1.07) + 20);
    return {
      id: index + 1,
      nombre: item.nombre,
      condicion: 'Disponible / Importación Segura',
      precioUsd: precioFinalUsd,
      imagen: item.img,
      enlaceEbay: `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(queryBusqueda)}&_sacat=0&_sop=12`
    };
  });

  return res.status(200).json(resultadosFinales);
}
