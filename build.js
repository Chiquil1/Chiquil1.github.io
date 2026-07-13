const fs = require('fs');
const path = require('path');

const pluginJson = {
  id: "rncalation",
  name: "RNCALATION",
  icon: "src/spanish/rncalation/icon.png",
  site: "https://rncalation.online",
  version: "1.0.0",
  webStorageUtilized: true
};

const target = path.join(__dirname, 'plugin.min.json');
fs.writeFileSync(target, JSON.stringify(pluginJson, null, 2));
console.log('✅ Archivo plugin.min.json generado correctamente');
