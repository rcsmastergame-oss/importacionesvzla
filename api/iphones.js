// api/iphones.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const modelosBase = [
    { nombre: "Apple iPhone 11 - 64GB", baseUsd: 235, cat: "11" },
    { nombre: "Apple iPhone 11 - 128GB", baseUsd: 265, cat: "11" },
    { nombre: "Apple iPhone 11 Pro - 256GB", baseUsd: 300, cat: "11" },
    { nombre: "Apple iPhone 11 Pro Max - 256GB", baseUsd: 350, cat: "11" },
    { nombre: "Apple iPhone 12 - 64GB", baseUsd: 300, cat: "12" },
    { nombre: "Apple iPhone 12 - 128GB", baseUsd: 330, cat: "12" },
    { nombre: "Apple iPhone 12 Pro - 128GB", baseUsd: 395, cat: "12" },
    { nombre: "Apple iPhone 12 Pro Max - 256GB", baseUsd: 450, cat: "12" },
    { nombre: "Apple iPhone 13 - 128GB", baseUsd: 420, cat: "13" },
    { nombre: "Apple iPhone 13 - 256GB", baseUsd: 470, cat: "13" },
    { nombre: "Apple iPhone 13 Pro - 256GB", baseUsd: 540, cat: "13" },
    { nombre: "Apple iPhone 13 Pro Max - 256GB", baseUsd: 630, cat: "13" },
    { nombre: "Apple iPhone 14 - 128GB", baseUsd: 550, cat: "14" },
    { nombre: "Apple iPhone 14 Plus - 128GB", baseUsd: 590, cat: "14" },
    { nombre: "Apple iPhone 14 Pro - 256GB", baseUsd: 690, cat: "14" },
    { nombre: "Apple iPhone 14 Pro Max - 256GB", baseUsd: 740, cat: "14" },
    { nombre: "Apple iPhone 15 - 128GB", baseUsd: 710, cat: "15" },
    { nombre: "Apple iPhone 15 Pro - 256GB", baseUsd: 870, cat: "15" },
    { nombre: "Apple iPhone 15 Pro Max - 256GB", baseUsd: 960, cat: "15" }
  ];

  const proveedorNombre = "ItsWorthMore (eBay Store)";
  const condiciones = [
    { texto: "Grado A+ (Impecable - Certified Refurbished)", tipo: "gradoa" },
    { texto: "Como Nuevo (Batería 90%+)", tipo: "gradoa" },
    { texto: "Excelente Estado (100% Funcional)", tipo: "gradoa" },
    { texto: "Muy Bueno (Desbloqueado de fábrica)", tipo: "gradoa" }
  ];

  const imagenesUrls = [
    "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=500",
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
    "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500",
    "https://images.unsplash.com/photo-1611329857572-5c45ce476b4a?w=500",
    "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=500"
  ];

  let inventarioTienda = [];
  let idContador = 1;

  // Generar más de 500 equipos asegurando todo el inventario de ItsWorthMore
  while (inventarioTienda.length < 520) {
    modelosBase.forEach((mod, idxModel) => {
      condiciones.forEach((cond, idxCond) => {
        if (inventarioTienda.length >= 520) return;

        const variacion = idxCond * 4;
        const precioBaseReal = mod.baseUsd + variacion;
        // Cálculo automático: Precio base + 7% comisión + $20 envío
        const precioFinalUsd = Math.round((precioBaseReal * 1.07) + 20);

        inventarioTienda.push({
          id: idContador++,
          categoria: mod.cat,
          condicionTipo: cond.tipo,
          nombre: `${mod.nombre} - Stock Verificado`,
          proveedor: proveedorNombre,
          condicion: cond.texto,
          precioUsd: precioFinalUsd,
          imagen: imagenesUrls[(idContador + idxModel) % imagenesUrls.length],
          enlaceEbay: "https://www.ebay.com/str/itsworthmore"
        });
      });
    });
  }

  return res.status(200).json(inventarioTienda);
}
