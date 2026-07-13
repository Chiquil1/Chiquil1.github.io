const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📦 Compilando TypeScript de forma nativa...');
try {
  execSync('npx tsc', { stdio: 'inherit' });
} catch (error) {
  console.log('⚠️ Compilación completada con advertencias.');
}

const codePath = path.join(__dirname, 'src', 'spanish', 'rncalation', 'rncalation.js'); 

let pluginCode = "";
try {
  if (fs.existsSync(codePath)) {
    pluginCode = fs.readFileSync(codePath, 'utf8');
    
    // CORRECCIÓN DE EXPORTACIÓN: LNReader rompe con exports.default. 
    // Mapeamos la salida para que exponga la instancia global directamente.
    pluginCode = pluginCode.replace('exports.default = new RncalationPlugin();', 'module.exports = new RncalationPlugin();');
  } else {
    console.error('❌ Error: No se encontró el JS compilado en:', codePath);
    process.exit(1);
  }
} catch (err) {
  console.error('❌ Error al procesar archivo:', err);
  process.exit(1);
}

// METADATOS CORREGIDOS SEGÚN EL ESTÁNDAR DE LNREADER
const pluginJson = {
  id: "rncalation",
  name: "RNCALATION",
  site: "https://rncalation.online",
  lang: "Español", // Corregido a 'Español'
  version: "1.0.0",
  url: "https://raw.githubusercontent.com/Chiquil1/Chiquil1.github.io/refs/heads/gh-pages/.dist/rncalation.js",
  iconUrl: "https://raw.githubusercontent.com/Chiquil1/Chiquil1.github.io/refs/heads/gh-pages/src/spanish/rncalation/icon.png",
  code: pluginCode
};

const distDir = path.join(__dirname, '.dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// Escribir el bypass de Jekyll
fs.writeFileSync(path.join(__dirname, '.nojekyll'), '');
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');

// Generar el JS individual en la carpeta de distribución para la URL directa
fs.writeFileSync(path.join(distDir, 'rncalation.js'), pluginCode);

// Guardar el repositorio en formato Array
const repoData = [pluginJson];
fs.writeFileSync(path.join(distDir, 'plugins.min.json'), JSON.stringify(repoData, null, 2));

console.log('🚀 ¡Repositorio homologado generado en .dist/plugins.min.json!');