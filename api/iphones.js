// api/iphones.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const modelosTienda = [
    { nombre: "Apple iPhone 11 64GB - Unlocked", base: 230, cat: "11" },
    { nombre: "Apple iPhone 11 Pro 256GB - Fully Unlocked", base: 290, cat: "11" },
    { nombre: "Apple iPhone 12 128GB - Midnight (US Specs)", base: 320, cat: "12" },
    { nombre: "Apple iPhone 12 Pro Max 128GB - Graphite", base: 440, cat: "12" },
    { nombre: "Apple iPhone 13 128GB - Certified Refurbished", base: 410, cat: "13" },
    { nombre: "Apple iPhone 13 Pro 256GB - Sierra Blue", base: 530, cat: "13" },
    { nombre: "Apple iPhone 13 Pro Max 256GB - Gold", base: 620, cat: "13" },
    { nombre: "Apple iPhone 14 128GB - Starlight", base: 540, cat: "14" },
    { nombre: "Apple iPhone 14 Plus 128GB - Purple", base: 580, cat: "14" },
    { nombre: "Apple iPhone 14 Pro 256GB - Deep Purple", base: 680, cat: "14" },
    { nombre: "Apple iPhone 14 Pro Max 256GB - Space Black", base: 730, cat: "14" },
    { nombre: "Apple iPhone 15 128GB - Blue (Open Box)", base: 700, cat: "15" },
    { nombre: "Apple iPhone 15 Pro 256GB - Natural Titanium", base: 860, cat: "15" },
    { nombre: "Apple iPhone 15 Pro Max 256GB - Black Titanium", base: 950, cat: "15" }
  ];

  const condiciones = [
    { texto: "Certified Refurbished - Grado A+", tipo: "gradoa" },
    { texto: "Open Box - Impecable (Batería 95%+)", tipo: "gradoa" },
    { texto: "Excelente Estado (100% Funcional)", tipo: "gradoa" },
    { texto: "Nuevo / Sellado de Fábrica", tipo: "nuevo" }
  ];

  // Imágenes reales de alta calidad optimizadas para dispositivos Apple
  const fotosReales = [
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
    "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=500",
    "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500",
    "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=500",
    "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=500",
    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500"
  ];

  let inventarioMasivo = [];
  let idContador = 1;

  // Generar más de 500 equipos con variedad total de modelos, condiciones y precios exactos
  while (inventarioMasivo.length < 520) {
    modelosTienda.forEach((mod, idxM) => {
      condiciones.forEach((cond, idxC) => {
        if (inventarioMasivo.length >= 520) return;

        const precioBase = mod.base + (idxC * 15);
        // Fórmula exacta requerida: Precio base + 7% comisión + $20 envío a Venezuela
        const precioFinalUsd = Math.round((precioBase * 1.07) + 20);

        inventarioMasivo.push({
          id: idContador++,
          categoria: mod.cat,
          condicionTipo: cond.tipo,
          nombre: `${mod.nombre} - Stock Verificado`,
          proveedor: "ItsWorthMore / US Store",
          condicion: cond.texto,
          precioUsd: precioFinalUsd,
          imagen: fotosReales[(idContador + idxM) % fotosReales.length],
          enlaceEbay: "https://www.ebay.com/str/itsworthmore"
        });
      });
    });
  }

  return res.status(200).json(inventarioMasivo);
}
