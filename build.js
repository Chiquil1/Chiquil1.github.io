const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 1. Forzar la compilación de TypeScript de forma nativa antes de armar el JSON
console.log('📦 Compilando TypeScript...');
try {
  // Ejecuta el compilador de TypeScript local
  execSync('npx tsc', { stdio: 'inherit' });
} catch (error) {
  console.error('⚠️ Advertencia durante la compilación de TS, continuando con el empaquetado...');
}

// 2. Ruta del JavaScript compilado real
const codePath = path.join(__dirname, 'src', 'spanish', 'rncalation', 'rncalation.js'); 

let pluginCode = "";
try {
  if (fs.existsSync(codePath)) {
    pluginCode = fs.readFileSync(codePath, 'utf8');
    console.log('✅ Archivo JavaScript compilado encontrado con éxito.');
  } else {
    console.error('❌ Error Crítico: No se encontró el archivo compilado en:', codePath);
    process.exit(1); 
  }
} catch (err) {
  console.error('❌ Error al leer el archivo JS:', err);
  process.exit(1);
}

// 3. Metadatos oficiales idénticos a los del repositorio de LNReader
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

// 4. Crear contenedor .dist y archivos bypass
const distDir = path.join(__dirname, '.dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

fs.writeFileSync(path.join(__dirname, '.nojekyll'), '');
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');

// 5. Guardar en formato de arreglo (Repositorio oficial)
const repoData = [pluginJson];
const target = path.join(distDir, 'plugins.min.json');
fs.writeFileSync(target, JSON.stringify(repoData, null, 2));

console.log('🚀 ¡Repositorio generado con éxito en .dist/plugins.min.json!');