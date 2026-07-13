// @ts-nocheck
import { fetchText } from '@libs/fetch';
import { Plugin } from '@/types/plugin';
import { defaultCover } from '@libs/defaultCover';
import { load } from 'cheerio';

class RncalationPlugin implements Plugin.PluginBase {
  id = 'rncalation';
  name = 'RNCALATION';
  site = 'https://rncalation.online/';
  version = '1.0.0';
  icon = 'src/spanish/rncalation/icon.png';
  filters = undefined;

  async popularNovels(
    pageNo: number,
    options: Plugin.PopularNovelsOptions<any>,
  ): Promise<Plugin.NovelItem[]> {
    const url = `${this.site}?page=${pageNo}&sort=popular`;
    const body = await fetchText(url);
    const $ = load(body);
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
    const $ = load(body);

    const novel: Plugin.SourceNovel = {
      path: novelPath,
      name: $('h1').first().text().trim() || 'Novela sin título',
    };

    novel.cover = $('.comic-cover img, .cover-container img, img.comic-cover__img').first().attr('src') || defaultCover;
    novel.summary = $('.comic-description, .synopsis, .description, #sinopsis, p').first().text().trim();

    const novelChapters: Plugin.ChapterItem[] = [];
    $('a[href*="/cap/"]').each((index, element) => {
      let chapterName = $(element).text().trim();
      const chapterHref = $(element).attr('href') || '';

      if (chapterHref && !chapterName.toLowerCase().includes('comenzar')) {
        if (chapterName.includes(', ')) {
          chapterName = chapterName.split(', ')[0].trim();
        }
        novelChapters.push({
          name: chapterName,
          path: chapterHref.replace(this.site, ''),
          releaseTime: '',
          chapterNumber: novelChapters.length + 1,
        });
      }
    });

    novel.chapters = novelChapters.reverse();
    return novel;
  }

  async parseChapter(chapterPath: string): Promise<string> {
    const body = await fetchText(this.site + chapterPath);
    const $ = load(body);
    
    // Extraer contenido HTML
    let chapterHtml = $('.chapter-content, #contenido-novela, .text-content').html() || '';
    if (!chapterHtml) return '';

    const $chapter = load(chapterHtml);

    // Limpieza de scripts, anuncios y basura igual al ejemplo de SkyNovels
    $chapter('script, style, ins, .chapter-ad, .adsbygoogle, .hidden, [style*="display:none"]').remove();

    // Limpieza específica para optimizar el lector TTS de Moon+ Reader / LNReader
    $chapter('*').contents().each((_, element) => {
      if (element.type === 'text' && element.data) {
        let text = element.data;
        text = text.replace(/[\u200B-\u200D\uFEFF\u200E\u200F\u202A-\u202E]/g, ''); // Caracteres invisibles
        text = text.replace(/[\\\/]+/g, '') // Barras duplicadas
                   .replace(/[—––─]/g, '-') // Rayas de diálogo orientales
                   .replace(/[\*_~|•♦¤°]/g, '') // Adornos
                   .trim();
        element.data = text;
      }
    });

    return $chapter.html();
  }

  async searchNovels(
    searchTerm: string,
    pageNo: number,
  ): Promise<Plugin.NovelItem[]> {
    const url = `${this.site}?search=${encodeURIComponent(searchTerm)}&page=${pageNo}`;
    const body = await fetchText(url);
    const $ = load(body);
    const novels: Plugin.NovelItem[] = [];

    $('div.card, div.novel-item, .flex.flex-col').each((index, element) => {
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