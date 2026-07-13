const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, 'rncalation.js');
const target = path.join(__dirname, 'plugin.min.json');

if (fs.existsSync(source)) {
    fs.renameSync(source, target);
    console.log('¡Archivo plugin.min.json generado con éxito!');
} else {
    console.error('Error: No se encontró el archivo compilado rncalation.js');
    process.exit(1);
}