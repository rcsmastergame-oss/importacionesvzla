export default function handler(req, res) {
  // Encabezados para permitir la conexión con tu página web
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  // Lista de iPhones simulada o conectada a tu inventario para la API
  const iphones = [
    {
      id: 1,
      nombre: "Apple iPhone 13 Pro Max - 128GB - Graphite (Liberado)",
      precioUsd: 650,
      condicion: "Grado A+ (Impecable)",
      condicionTipo: "gradoa",
      categoria: "13",
      imagen: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600",
      enlaceEbay: "https://www.ebay.com"
    },
    {
      id: 2,
      nombre: "Apple iPhone 14 - 128GB - Midnight (Nuevo Sellado)",
      precioUsd: 720,
      condicion: "Nuevo / Sellado en caja",
      condicionTipo: "nuevo",
      categoria: "14",
      imagen: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600",
      enlaceEbay: "https://www.ebay.com"
    },
    {
      id: 3,
      nombre: "Apple iPhone 12 - 64GB - Blue (Desbloqueado)",
      precioUsd: 380,
      condicion: "Grado A (Muy buen estado)",
      condicionTipo: "gradoa",
      categoria: "12",
      imagen: "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=600",
      enlaceEbay: "https://www.ebay.com"
    },
    {
      id: 4,
      nombre: "Apple iPhone 15 Pro - 256GB - Natural Titanium",
      precioUsd: 950,
      condicion: "Nuevo / Sellado",
      condicionTipo: "nuevo",
      categoria: "15",
      imagen: "https://images.unsplash.com/photo-1695048065448-466d3a1a6b33?w=600",
      enlaceEbay: "https://www.ebay.com"
    }
  ];

  // Responde a la petición con los datos en formato JSON
  return res.status(200).json(iphones);
}
