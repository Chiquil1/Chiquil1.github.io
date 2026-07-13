const fs = require('fs');
const path = require('path');

// Ruta donde tsc dejará el archivo compilado
const codePath = path.join(__dirname, 'src', 'spanish', 'rncalation', 'rncalation.js'); 

let pluginCode = "";
try {
  if (fs.existsSync(codePath)) {
    pluginCode = fs.readFileSync(codePath, 'utf8');
  } else {
    console.error('❌ Error: No se encontró el archivo compilado en:', codePath);
  }
} catch (err) {
  console.error('❌ Error al leer el archivo JS:', err);
}

// Metadatos obligatorios para indexar en la app en español
const pluginJson = {
  id: "rncalation",
  name: "RNCALATION",
  icon: "src/spanish/rncalation/icon.png",
  site: "https://rncalation.online",
  lang: "Spanish",
  description: "Plugin para RNCALATION",
  version: "1.0.0",
  webStorageUtilized: true,
  code: pluginCode
};

// Generar carpeta .dist y deshabilitar Jekyll
const distDir = path.join(__dirname, '.dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

fs.writeFileSync(path.join(__dirname, '.nojekyll'), '');
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');

// Empaquetar en una lista (formato repositorio)
const repoData = [pluginJson];
const target = path.join(distDir, 'plugins.min.json');
fs.writeFileSync(target, JSON.stringify(repoData, null, 2));

console.log('✅ Repositorio oficial generado con éxito en .dist/plugins.min.json');