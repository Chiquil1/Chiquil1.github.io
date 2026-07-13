import { fetchApi, fetchProto, fetchText } from '@libs/fetch';
import { Plugin } from '@/types/plugin';
import { Filters } from '@libs/filterInputs';
import { load as loadCheerio } from 'cheerio';
import { defaultCover } from '@libs/defaultCover';
import { NovelStatus } from '@libs/novelStatus';

class RncalationPlugin implements Plugin.PluginBase {
  id = 'rncalation';
  name = 'RNCALATION';
  icon = 'src/spanish/rncalation/icon.png';
  site = 'https://rncalation.online';
  version = '1.0.0';
  filters: Filters | undefined = undefined;
  
  webStorageUtilized = true; 

  async popularNovels(
    pageNo: number,
    { showLatestNovels }: Plugin.PopularNovelsOptions<typeof this.filters>,
  ): Promise<Plugin.NovelItem[]> {
    const url = showLatestNovels 
      ? `${this.site}/?page=${pageNo}&sort=latest` 
      : `${this.site}/?page=${pageNo}&sort=popular`;

    const body = await fetchText(url);
    const $ = loadCheerio(body);
    const novels: Plugin.NovelItem[] = [];

    $('div.card, div.novel-item, .flex.flex-col').each((index, element) => {
      const type = $(element).find('.text-sm, .badge, span').text().trim();
      
      if (type.toLowerCase().includes('novel') || $(element).text().toLowerCase().includes('novela')) {
        const name = $(element).find('h1, h2, .title').text().trim();
        const href = $(element).find('a').attr('href') || '';
        const cover = $(element).find('img').attr('src') || defaultCover;

        if (name && href) {
          novels.push({
            name,
            path: href.replace(this.site, ''), 
            cover,
          });
        }
      }
    });

    return novels;
  }

  async parseNovel(novelPath: string): Promise<Plugin.SourceNovel> {
    const body = await fetchText(this.site + novelPath);
    const $ = loadCheerio(body);

    const novel: Plugin.SourceNovel = {
      path: novelPath,
      name: $('h1').first().text().trim() || 'Novela sin título',
      cover: $('.comic-cover img, .cover-container img, img.comic-cover__img').first().attr('src') || defaultCover,
      summary: $('.comic-description, .synopsis, .description, #sinopsis, p').first().text().trim(),
    };

    const chapters: Plugin.ChapterItem[] = [];

    // Corregido: Selector actualizado con '/cap/' basado en la respuesta real de la web
    $('a[href*="/cap/"]').each((index, element) => {
      let chapterName = $(element).text().trim();
      const chapterHref = $(element).attr('href') || '';

      // Omitimos los botones genéricos de la cabecera como "Comenzar lectura" o "Capítulo X" resumido
      if (chapterHref && !chapterName.toLowerCase().includes('comenzar') && chapterName.includes('\n')) {
        
        // Limpiamos los textos extras como "GRATIS" o fechas que se cuelan por el diseño estructurado de la web
        chapterName = chapterName.split('\n')[0].trim();

        chapters.push({
          name: chapterName,
          path: chapterHref.replace(this.site, ''),
          releaseTime: '', 
          chapterNumber: chapters.length + 1,
        });
      }
    });

    // Invertimos la lista para que el Capítulo 1 aparezca en la parte superior en la app
    novel.chapters = chapters.reverse();
    return novel;
  }

  async parseChapter(chapterPath: string): Promise<string> {
    const body = await fetchText(this.site + chapterPath);
    const $ = loadCheerio(body);

    // Extrae el contenido html limpio del contenedor del texto
    const chapterText = $('.chapter-content, #contenido-novela, .text-content').html() || '';
    
    return chapterText;
  }

  async searchNovels(
    searchTerm: string,
    pageNo: number,
  ): Promise<Plugin.NovelItem[]> {
    const url = `${this.site}/?search=${encodeURIComponent(searchTerm)}&page=${pageNo}`;
    const body = await fetchText(url);
    const $ = loadCheerio(body);
    const novels: Plugin.NovelItem[] = [];

    $('div.card, .search-result').each((index, element) => {
      const name = $(element).find('h1, h2, .title').text().trim();
      const href = $(element).find('a').attr('href') || '';
      const cover = $(element).find('img').attr('src') || defaultCover;

      if (name && href) {
        novels.push({ name, path: href.replace(this.site, ''), cover });
      }
    });

    return novels;
  }

  resolveUrl = (path: string, isNovel?: boolean) => this.site + path;
}

export default new RncalationPlugin();