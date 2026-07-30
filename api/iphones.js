// api/iphones.js
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  try {
    // Ruta hacia el archivo JSON de proveedores dentro del servidor
    const filePath = path.join(process.cwd(), 'api', 'proveedores.json');
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const inventarioProveedores = JSON.parse(jsonData);

    // Motor de cálculo automático de importación a Venezuela
    const catalogoCalculado = inventarioProveedores.map(item => {
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

    return res.status(200).json(catalogoCalculado);

  } catch (error) {
    return res.status(500).json({ error: "Error al leer el inventario de proveedores: " + error.message });
  }
}
