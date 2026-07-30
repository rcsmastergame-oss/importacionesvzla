// api/iphones.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  // Listado directo basado en los 3 proveedores de tus capturas con sus productos reales y fotos de alta calidad
  const inventarioProveedoresReales = [
    {
      id: 1,
      categoria: "13",
      condicionTipo: "gradoa",
      nombre: "Apple iPhone 13 de 128 GB totalmente desbloqueado - Muy buen estado",
      proveedor: "Soluciones para dispositivos (G5 Gadget)",
      condicion: "Muy buen estado - Reformado",
      precioBase: 259.99,
      imagen: "https://i.ebayimg.com/images/g/yJ8AAOSwK59l2W~D/s-l500.jpg",
      enlaceEbay: "https://www.ebay.com/itm/226523060489"
    },
    {
      id: 2,
      categoria: "13",
      condicionTipo: "gradoa",
      nombre: "Apple iPhone 13 128GB Midnight A2482 (Desbloqueado) EXCELENTE",
      proveedor: "SoonerSoft Electronics",
      condicion: "Excelente - Reformado",
      precioBase: 239.35,
      imagen: "https://i.ebayimg.com/images/g/x1UAAOSw2lpm1X8x/s-l500.jpg",
      enlaceEbay: "https://www.ebay.com/itm/278228816329"
    },
    {
      id: 3,
      categoria: "13",
      condicionTipo: "gradoa",
      nombre: "Apple iPhone 13 Mini A2628 128GB Desbloqueado Buen estado Todos los colores",
      proveedor: "Verizon (Certified Refurbished)",
      condicion: "Bueno - Reformado",
      precioBase: 202.89,
      imagen: "https://i.ebayimg.com/images/g/w0cAAOSwk-Bm4Y2z/s-l500.jpg",
      enlaceEbay: "https://www.ebay.com/itm/127912674651"
    }
  ];

  // Aplicación automática de tu fórmula exacta a cada producto: (Base * 1.07) + 20
  const productosConPreciosCalculados = inventarioProveedoresReales.map(item => {
    const precioFinalUsd = Math.round((item.precioBase * 1.07) + 20);
    return {
      id: item.id,
      categoria: item.categoria,
      condicionTipo: item.condicionTipo,
      nombre: item.nombre,
      proveedor: item.proveedor,
      condicion: item.condicion,
      precioUsd: precioFinalUsd,
      imagen: item.imagen,
      enlaceEbay: item.enlaceEbay
    };
  });

  return res.status(200).json(productosConPreciosCalculados);
}
