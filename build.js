const fs = require('fs');
const path = require('path');

// 1. Ruta del JavaScript ya compilado por TypeScript
// (Si tsc lo genera en la raíz como rncalation.js, usamos esta ruta)
const codePath = path.join(__dirname, 'rncalation.js'); 

let pluginCode = "";
try {
  if (fs.existsSync(codePath)) {
    pluginCode = fs.readFileSync(codePath, 'utf8');
  } else {
    console.error('❌ Error: No se encontró el archivo compilado rncalation.js');
  }
} catch (err) {
  console.error('❌ Error al leer rncalation.js:', err);
}

// 2. Estructura que LNReader espera con el código fuente inyectado
const pluginJson = {
  id: "rncalation",
  name: "RNCALATION",
  icon: "src/spanish/rncalation/icon.png",
  site: "https://rncalation.online",
  version: "1.0.0",
  webStorageUtilized: true,
  code: pluginCode // <--- Aquí se inyecta el código completo del scraper
};

const target = path.join(__dirname, 'plugin.min.json');
fs.writeFileSync(target, JSON.stringify(pluginJson, null, 2));
console.log('✅ Archivo plugin.min.json generado correctamente con el código embebido');