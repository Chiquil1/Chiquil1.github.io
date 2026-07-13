import { load } from 'cheerio';

async function probarExtractorCompleto() {
  const site = 'https://rncalation.online';
  
  // Mantenemos la ruta de la novela con la que validamos el HTML
  const novelPath = '/comics/el-rey-demonio-es-superado-por-los-heroes-1783219691462'; 

  console.log("Conectando a la página web...");
  
  try {
    const response = await fetch(site + novelPath);
    const body = await response.text();
    const $ = load(body);

    // 1. Extraer datos básicos de la Novela
    const novel = {
      path: novelPath,
      name: $('h1').first().text().trim() || 'Novela sin título',
      cover: $('.comic-cover img, .cover-container img, img.comic-cover__img').first().attr('src') || 'Sin portada',
      summary: $('.comic-description, .synopsis, .description, #sinopsis, p').first().text().trim(),
      chapters: []
    };

    // 2. Extraer la lista de capítulos
    $('a[href*="/capitulo/"], .chapters-list a, .list-chapters a').each((index, element) => {
      const chapterName = $(element).text().trim();
      const chapterHref = $(element).attr('href') || '';

      if (chapterHref) {
        novel.chapters.push({
          name: chapterName,
          path: chapterHref.replace(site, ''),
          chapterNumber: index + 1,
        });
      }
    });

    // Invertir capítulos para dejar el primero al inicio, igual que hace el plugin
    novel.chapters.reverse();

    // Mapear la URL de la portada absoluta para revisar que abra bien en la Mac
    if (novel.cover && !novel.cover.startsWith('http')) {
      novel.cover = site + novel.cover;
    }

    console.log("\n=========================================");
    console.log("      === DATOS EXTRAÍDOS CON ÉXITO ===");
    console.log("=========================================");
    console.log(`Título:   ${novel.name}`);
    console.log(`Portada:  ${novel.cover}`);
    console.log(`Sinopsis: ${novel.summary.substring(0, 120)}...`);
    console.log(`Total Capítulos Detectados: ${novel.chapters.length}`);
    
    if (novel.chapters.length > 0) {
      console.log("\n--- Primeros 3 capítulos en la lista ---");
      novel.chapters.slice(0, 3).forEach(c => {
        console.log(`  [Num ${c.chapterNumber}] ${c.name} -> Path: ${c.path}`);
      });
    } else {
      console.log("\n⚠️  Alerta: No se detectaron enlaces de capítulos. Revisa si la estructura de enlaces cambió.");
    }

  } catch (error) {
    console.error("❌ Error durante la simulación de la extracción:", error);
  }
}

probarExtractorCompleto();