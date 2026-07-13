const fs = require('fs');
const path = require('path');

// 1. Ruta del JavaScript ya compilado por TypeScript
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

// 2. Metadatos del plugin individual
const pluginJson = {
  id: "rncalation",
  name: "RNCALATION",
  icon: "src/spanish/rncalation/icon.png",
  site: "https://rncalation.online",
  version: "1.0.0",
  webStorageUtilized: true,
  code: pluginCode
};

// 3. Crear la carpeta .dist si no existe para imitar el repositorio original
const distDir = path.join(__dirname, '.dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// 4. LNReader requiere un ARREGLO (plural) de plugins, no el objeto solo
const repoData = [pluginJson];

const target = path.join(distDir, 'plugins.min.json'); // Nota el plural 'plugins'
fs.writeFileSync(target, JSON.stringify(repoData, null, 2));
console.log('✅ Archivo .dist/plugins.min.json generado correctamente en formato de lista');