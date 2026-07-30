// api/iphones.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const modelosBase = [
    { nombre: "Apple iPhone 11 - 64GB", baseUsd: 240, cat: "11" },
    { nombre: "Apple iPhone 11 - 128GB", baseUsd: 270, cat: "11" },
    { nombre: "Apple iPhone 11 Pro - 256GB", baseUsd: 310, cat: "11" },
    { nombre: "Apple iPhone 11 Pro Max - 256GB", baseUsd: 360, cat: "11" },
    { nombre: "Apple iPhone 12 - 64GB", baseUsd: 310, cat: "12" },
    { nombre: "Apple iPhone 12 - 128GB", baseUsd: 340, cat: "12" },
    { nombre: "Apple iPhone 12 Pro - 128GB", baseUsd: 410, cat: "12" },
    { nombre: "Apple iPhone 12 Pro Max - 256GB", baseUsd: 470, cat: "12" },
    { nombre: "Apple iPhone 13 - 128GB", baseUsd: 430, cat: "13" },
    { nombre: "Apple iPhone 13 - 256GB", baseUsd: 480, cat: "13" },
    { nombre: "Apple iPhone 13 Pro - 256GB", baseUsd: 560, cat: "13" },
    { nombre: "Apple iPhone 13 Pro Max - 256GB", baseUsd: 650, cat: "13" },
    { nombre: "Apple iPhone 14 - 128GB", baseUsd: 570, cat: "14" },
    { nombre: "Apple iPhone 14 Plus - 128GB", baseUsd: 610, cat: "14" },
    { nombre: "Apple iPhone 14 Pro - 256GB", baseUsd: 710, cat: "14" },
    { nombre: "Apple iPhone 14 Pro Max - 256GB", baseUsd: 760, cat: "14" },
    { nombre: "Apple iPhone 15 - 128GB", baseUsd: 730, cat: "15" },
    { nombre: "Apple iPhone 15 Pro - 256GB", baseUsd: 890, cat: "15" },
    { nombre: "Apple iPhone 15 Pro Max - 256GB", baseUsd: 990, cat: "15" }
  ];

  const proveedores = ["Smart Hauss Direct", "Global Electronics USA", "Miami Stock Supplier", "Liquidadores Apple US"];
  const condiciones = [
    { texto: "Grado A+ (Impecable)", tipo: "gradoa" },
    { texto: "Como Nuevo (Batería 90%+)", tipo: "gradoa" },
    { texto: "Nuevo / Sellado de Fábrica", tipo: "nuevo" },
    { texto: "Libre • Garantía Activa", tipo: "gradoa" }
  ];

  const imagenesUrls = [
    "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=500",
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
    "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500",
    "https://images.unsplash.com/photo-1611329857572-5c45ce476b4a?w=500",
    "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=500"
  ];

  let inventarioMasivo = [];
  let idContador = 1;

  // Generar más de 500 productos combinando modelos, proveedores y variantes
  while (inventarioMasivo.length < 520) {
    modelosBase.forEach((mod, idxModel) => {
      proveedores.forEach((prov, idxProv) => {
        condiciones.forEach((cond, idxCond) => {
          if (inventarioMasivo.length >= 520) return;

          // Variación leve de precio según proveedor/condición
          const variacion = (idxProv * 5) + (idxCond * 3);
          const precioBaseReal = mod.baseUsd + variacion;
          const precioFinalUsd = Math.round((precioBaseReal * 1.07) + 20);

          inventarioMasivo.push({
            id: idContador++,
            categoria: mod.cat,
            condicionTipo: cond.tipo,
            nombre: `${mod.nombre} (${prov.split(' ')[0]})`,
            proveedor: prov,
            condicion: cond.texto,
            precioUsd: precioFinalUsd,
            imagen: imagenesUrls[(idContador + idxModel) % imagenesUrls.length],
            enlaceEbay: `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(mod.nombre)}`
          });
        });
      });
    });
  }

  return res.status(200).json(inventarioMasivo);
}
