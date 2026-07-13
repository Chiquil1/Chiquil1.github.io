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

// 2. Metadatos del plugin
const pluginJson = {
  id: "rncalation",
  name: "RNCALATION",
  icon: "src/spanish/rncalation/icon.png",
  site: "https://rncalation.online",
  version: "1.0.0",
  webStorageUtilized: true,
  code: pluginCode
};

// 3. Crear la carpeta .dist si no existe
const distDir = path.join(__dirname, '.dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// 4. Forzar a GitHub Pages a incluir carpetas con punto (.) creando .nojekyll
fs.writeFileSync(path.join(__dirname, '.nojekyll'), ''); 
fs.writeFileSync(path.join(distDir, '.nojekyll'), ''); // Opcional, en ambas por seguridad

// 5. LNReader requiere un ARREGLO de plugins
const repoData = [pluginJson];

const target = path.join(distDir, 'plugins.min.json');
fs.writeFileSync(target, JSON.stringify(repoData, null, 2));
console.log('✅ Archivo .dist/plugins.min.json y .nojekyll generados correctamente');