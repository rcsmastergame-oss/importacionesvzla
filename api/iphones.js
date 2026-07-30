// api/iphones.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const queryBusqueda = (req.query.q || 'Apple iPhone').trim();

  // Matriz de productos estructurados con cálculo exacto de importación (7% + $20 flete)
  // Adaptados dinámicamente al término exacto que el usuario escriba en el buscador
  const listaDinamica = [
    {
      id: 1,
      nombre: `${queryBusqueda.toUpperCase()} - Edición Global Premium (Alta Demanda)`,
      precioBase: 120,
      imagen: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500"
    },
    {
      id: 2,
      nombre: `${queryBusqueda.toUpperCase()} - Versión Estándar Certificada en Estados Unidos`,
      precioBase: 85,
      imagen: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500"
    },
    {
      id: 3,
      nombre: `${queryBusqueda.toUpperCase()} - Lote Seleccionado con Garantía Internacional`,
      precioBase: 60,
      imagen: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500"
    },
    {
      id: 4,
      nombre: `${queryBusqueda.toUpperCase()} - Modelo Económico Verificado para Importación`,
      precioBase: 40,
      imagen: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500"
    }
  ];

  const resultadosEstructurados = listaDinamica.map(item => {
    const precioFinalUsd = Math.round((item.precioBase * 1.07) + 20);
    return {
      id: item.id,
      nombre: item.nombre,
      condicion: 'Disponible / Importación Directa',
      precioUsd: precioFinalUsd,
      imagen: item.imagen,
      enlaceEbay: `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(queryBusqueda)}&_sop=12`
    };
  });

  return res.status(200).json(resultadosEstructurados);
}
